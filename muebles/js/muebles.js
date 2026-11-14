// AceroStudio · Muebles desarmables en acero: visor 3D (Three.js 0.169, sin build), instructivo paso a paso,
// despiece de taller con el motor de Fábrica y pedido de una cafetería completa.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { PRODUCTOS, PARAM_NOMBRE, ACABADOS, PERFORADOS, PERFILES, LAMINAS, HERRAJES, CAFETERIA, paramsIniciales, construir, despiece, costo, caja, contornoPlatina, csvMuebles, dxfPieza, dxfHoja } from './kit.js';
import { nestBars, nestPlates } from '../../fabrica/js/nesting.js';
import { csvCorte, zip } from '../../fabrica/js/cnc.js';

const $ = (s) => document.querySelector(s);
const fmt = (n) => Math.round(n).toLocaleString('es-CO');
const pesos = (n) => '$' + fmt(n);
const kgf = (n) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
const Y = new THREE.Vector3(0, 1, 0), Z = new THREE.Vector3(0, 0, 1);

const Q = new URLSearchParams(location.search);
const S = {
  id: PRODUCTOS[Q.get('mueble')] ? Q.get('mueble') : 'silla',
  params: Object.fromEntries(Object.keys(PRODUCTOS).map((k) => [k, paramsIniciales(k)])),
  perforado: PERFORADOS[Q.get('perforado')] ? Q.get('perforado') : 'puntos',
  acabado: ACABADOS[Q.get('acabado')] ? Q.get('acabado') : 'negro',
  vista: 'producto', explota: 0, modoPaso: false, paso: 0, auto: null,
  cafe: Object.fromEntries(CAFETERIA.map((l) => [l.id, l.cant])),
};
let M = null; // mueble actual (datos)

/* =================================================================================================
   UI: catálogo, medidas, acabados
   ================================================================================================= */
const ICONOS = {
  silla: '<path d="M14 36V4M30 36V18M12 18h20M14 6h0M16 5q6 2 0 6"/><path d="M14 5h1v7h-1M14 26h16"/>',
  taburete: '<path d="M13 36V12M31 36V12M11 12h22M13 26h18"/>',
  mesa: '<path d="M4 12h36M4 12v2h36v-2M8 14v22M36 14v22"/>',
  barra: '<path d="M2 8h40M2 8v2h40V8M7 10v26M37 10v26M7 28h30"/>',
  pedestal: '<path d="M6 10h32M6 10v2h32v-2M22 12v20M10 34h24M22 32v2"/>',
};
function pintarCatalogo() {
  $('#catalogo').innerHTML = Object.entries(PRODUCTOS).map(([id, p]) => `<li><button type="button" data-id="${id}" aria-pressed="${id === S.id}"><svg viewBox="0 0 44 38" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">${ICONOS[id]}</svg><b>${p.nombre}</b><small>${p.nota}</small><em>${p.ref}</em></button></li>`).join('');
}
$('#catalogo').addEventListener('click', (e) => { const b = e.target.closest('button[data-id]'); if (!b) return; S.id = b.dataset.id; salirPaso(); pintarCatalogo(); pintarMedidas(); rehacer(true); });
function pintarMedidas() {
  const p = PRODUCTOS[S.id].params, v = S.params[S.id];
  $('#medidas').innerHTML = '<span class="rot">Medidas</span>' + Object.entries(p).map(([k, [mn, mx]]) => `<label for="r-${k}">${PARAM_NOMBRE[k]} <output id="o-${k}">${v[k]} mm</output></label><input type="range" id="r-${k}" data-k="${k}" min="${mn}" max="${mx}" step="10" value="${v[k]}">`).join('');
}
let tRehacer = 0;
$('#medidas').addEventListener('input', (e) => {
  const k = e.target.dataset.k; if (!k) return;
  S.params[S.id][k] = +e.target.value; $(`#o-${k}`).textContent = `${e.target.value} mm`;
  clearTimeout(tRehacer); tRehacer = setTimeout(() => rehacer(false), 60);
});
$('#perforado').innerHTML = Object.entries(PERFORADOS).map(([k, n]) => `<button type="button" data-p="${k}" aria-pressed="${k === S.perforado}">${n}</button>`).join('');
$('#perforado').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; S.perforado = b.dataset.p; for (const x of $('#perforado').children) x.setAttribute('aria-pressed', x === b); rehacer(false); });
$('#acabados').innerHTML = Object.entries(ACABADOS).map(([k, a]) => `<button type="button" data-a="${k}" style="--c:${a.hex}" aria-pressed="${k === S.acabado}" aria-label="${a.nombre}" title="${a.nombre}"></button>`).join('');
$('#acabados').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; S.acabado = b.dataset.a; for (const x of $('#acabados').children) x.setAttribute('aria-pressed', x === b); acabado(); });

for (const t of document.querySelectorAll('.tabs [role=tab]')) t.addEventListener('click', () => {
  for (const x of document.querySelectorAll('.tabs [role=tab]')) x.setAttribute('aria-selected', x === t);
  for (const id of ['armado', 'desp', 'cafe']) $(`#tab-${id}`).hidden = id !== t.dataset.tab;
});

/* =================================================================================================
   3D: escena de estudio clara, sin paisaje; el metal con pintura electrostática real
   ================================================================================================= */
let R = null, scene, cam, ctl, mPint, mZinc, mOscuro, mFieltro, mPiso, sol, raiz, sala = null, M3 = null;
const cajaCam = { activa: false, pos: new THREE.Vector3(), tgt: new THREE.Vector3() };

function texRelieve(tipo, rep) {
  const n = 128, cv = document.createElement('canvas'); cv.width = cv.height = n; const g = cv.getContext('2d'), im = g.createImageData(n, n);
  let h = new Float32Array(n * n), r = 7; const azar = () => (r = (r * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < n * n; i++) h[i] = azar();
  const pasada = (dx, dy) => { const o = new Float32Array(n * n); for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { let a = 0; for (let k = -1; k <= 1; k++) a += h[((y + k * dy + n) % n) * n + (x + k * dx + n) % n]; o[y * n + x] = a / 3; } h = o; };
  if (tipo === 'piel') { for (let i = 0; i < 3; i++) { pasada(1, 0); pasada(0, 1); } } else for (let i = 0; i < 14; i++) pasada(1, 0);
  const k = tipo === 'piel' ? 14 : 5;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const dx = (h[y * n + (x + 1) % n] - h[y * n + (x + n - 1) % n]) * k, dy = (h[((y + 1) % n) * n + x] - h[((y + n - 1) % n) * n + x]) * k, l = Math.hypot(dx, dy, 1), i = (y * n + x) * 4;
    im.data[i] = (-dx / l * 0.5 + 0.5) * 255; im.data[i + 1] = (-dy / l * 0.5 + 0.5) * 255; im.data[i + 2] = (1 / l * 0.5 + 0.5) * 255; im.data[i + 3] = 255;
  }
  g.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); t.anisotropy = 4; return t;
}

function iniciar3D() {
  const cv = $('#c');
  R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: false });
  R.setPixelRatio(Math.min(devicePixelRatio, 2));
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.0;
  scene = new THREE.Scene(); scene.background = new THREE.Color(0xeceef2);
  const pm = new THREE.PMREMGenerator(R); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.75;
  cam = new THREE.PerspectiveCamera(32, 1, 0.01, 80); cam.position.set(1.6, 1.1, 2.2);
  ctl = new OrbitControls(cam, cv); ctl.enableDamping = true; ctl.target.set(0, 0.45, 0); ctl.maxPolarAngle = Math.PI * 0.495; ctl.minDistance = 0.18; ctl.maxDistance = 14;
  ctl.addEventListener('start', () => { cajaCam.activa = false; });
  scene.add(new THREE.HemisphereLight(0xffffff, 0xc9cedb, 0.75));
  sol = new THREE.DirectionalLight(0xfff3e2, 2.3); sol.position.set(2.6, 4.2, 2.2); sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048); sol.shadow.bias = -0.0004; sol.shadow.normalBias = 0.012; sol.shadow.radius = 4;
  scene.add(sol, sol.target);
  const relleno = new THREE.DirectionalLight(0xdfe8ff, 0.6); relleno.position.set(-3, 2, -1.5); scene.add(relleno);
  mPiso = new THREE.MeshStandardMaterial({ color: 0xe6e8ed, roughness: 0.96 });
  const piso = new THREE.Mesh(new THREE.CircleGeometry(40, 64), mPiso); piso.rotation.x = -Math.PI / 2; piso.receiveShadow = true; scene.add(piso);
  mPint = new THREE.MeshPhysicalMaterial({ color: 0x1d2028, metalness: 0.35, roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.28, normalMap: texRelieve('piel', 6), normalScale: new THREE.Vector2(0.12, 0.12) });
  mPint.userData.piel = mPint.normalMap; mPint.userData.cepillo = texRelieve('cepillo', 3);
  mZinc = new THREE.MeshStandardMaterial({ color: 0xc8ccd3, metalness: 1, roughness: 0.26 });
  mOscuro = new THREE.MeshStandardMaterial({ color: 0x15171c, metalness: 0.6, roughness: 0.5 });
  mFieltro = new THREE.MeshStandardMaterial({ color: 0x8b8f98, roughness: 1 });
  raiz = new THREE.Group(); scene.add(raiz);
  acabado();
  const tam = () => { const r = $('#lienzo').getBoundingClientRect(); R.setSize(r.width, r.height, false); cam.aspect = r.width / Math.max(1, r.height); cam.updateProjectionMatrix(); };
  new ResizeObserver(tam).observe($('#lienzo')); tam();
}
function acabado() {
  $('#oAcabado').textContent = ACABADOS[S.acabado].nombre;
  if (!mPint) return;
  const nat = S.acabado === 'natural';
  mPint.color.set(ACABADOS[S.acabado].hex);
  mPint.metalness = nat ? 0.92 : S.acabado === 'blanco' ? 0.12 : 0.35;
  mPint.roughness = nat ? 0.34 : S.acabado === 'negro' ? 0.55 : 0.4;
  mPint.clearcoat = nat ? 0.25 : 0.55;
  mPint.normalMap = nat ? mPint.userData.cepillo : mPint.userData.piel;
  mPint.normalScale.set(nat ? 0.3 : 0.12, nat ? 0.3 : 0.12);
  mPint.needsUpdate = true;
  for (const m of DERIVADOS.values()) copiarAcabado(m);
}

/* ---------- geometrías ---------- */
const DERIVADOS = new Map();
// material de pintura con las perforaciones como máscara (para láminas roladas)
function materialPerforado(p) {
  const k = `${p.w}|${p.h}|${p.perf.length}`; let m = DERIVADOS.get(k); if (m) return m;
  const ppm = 2.4, cv = document.createElement('canvas'); cv.width = Math.round(p.w * ppm); cv.height = Math.round(p.h * ppm);
  const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.fillStyle = '#000';
  for (const [x, y, d] of [...p.perf, ...p.agujeros]) { g.beginPath(); g.arc((p.w / 2 - x) * ppm, (p.h / 2 - y) * ppm, d / 2 * ppm, 0, Math.PI * 2); g.fill(); }
  m = mPint.clone(); m.alphaMap = new THREE.CanvasTexture(cv); m.alphaTest = 0.5; m.side = THREE.DoubleSide; m.normalMap = null;
  DERIVADOS.set(k, m); copiarAcabado(m); return m;
}
function copiarAcabado(m) { for (const k of ['metalness', 'roughness', 'clearcoat', 'clearcoatRoughness']) m[k] = mPint[k]; m.color.copy(mPint.color); m.needsUpdate = true; }
const CACHE = new Map();
const cache = (k, f) => { let g = CACHE.get(k); if (!g) { g = f(); CACHE.set(k, g); } return g; };
function rectRedondo(w, h, r, cx = 0, cy = 0, path = new THREE.Shape(), cw = false) {
  const x = w / 2, y = h / 2;
  if (!cw) {
    path.moveTo(cx - x + r, cy - y); path.lineTo(cx + x - r, cy - y); path.absarc(cx + x - r, cy - y + r, r, -Math.PI / 2, 0); path.lineTo(cx + x, cy + y - r); path.absarc(cx + x - r, cy + y - r, r, 0, Math.PI / 2);
    path.lineTo(cx - x + r, cy + y); path.absarc(cx - x + r, cy + y - r, r, Math.PI / 2, Math.PI); path.lineTo(cx - x, cy - y + r); path.absarc(cx - x + r, cy - y + r, r, Math.PI, Math.PI * 1.5);
  } else {
    path.moveTo(cx - x + r, cy - y); path.absarc(cx - x + r, cy - y + r, r, Math.PI * 1.5, Math.PI, true); path.lineTo(cx - x, cy + y - r); path.absarc(cx - x + r, cy + y - r, r, Math.PI, Math.PI / 2, true);
    path.lineTo(cx + x - r, cy + y); path.absarc(cx + x - r, cy + y - r, r, Math.PI / 2, 0, true); path.lineTo(cx + x, cy - y + r); path.absarc(cx + x - r, cy - y + r, r, 0, -Math.PI / 2, true); path.lineTo(cx - x + r, cy - y);
  }
  return path;
}
function geoTuboCuad(a, e, L) {
  return cache(`tc${a}|${e}|${L.toFixed(4)}`, () => {
    const s = rectRedondo(a, a, Math.min(0.0035, a * 0.16));
    s.holes.push(rectRedondo(a - 2 * e, a - 2 * e, Math.min(0.002, a * 0.1), 0, 0, new THREE.Path(), true));
    const g = new THREE.ExtrudeGeometry(s, { depth: L, bevelEnabled: false, curveSegments: 3 }); g.translate(0, 0, -L / 2); return g;
  });
}
const geoRedondo = (r, L) => cache(`tr${r}|${L.toFixed(4)}`, () => new THREE.CylinderGeometry(r, r, L, 48, 1, false));
function agujerosEn(s, lista, mm = true) {
  const k = mm ? 1000 : 1;
  for (const [x, y, d] of lista) { const h = new THREE.Path(); h.absarc(x / k, y / k, d / 2 / k, 0, Math.PI * 2, true); s.holes.push(h); }
}
function geoTapa(p, esp) {
  return cache(`tp${p.nombre}|${p.w}|${p.h}|${p.forma}|${p.perf.length}|${p.curva || 0}`, () => {
    const w = p.w / 1000, h = p.h / 1000;
    let s;
    if (p.forma === 'circ') { s = new THREE.Shape(); s.absarc(0, 0, w / 2, 0, Math.PI * 2, false); } else s = rectRedondo(w, h, 0.006);
    agujerosEn(s, [...p.perf, ...p.agujeros]);
    const g = new THREE.ExtrudeGeometry(s, { depth: esp, bevelEnabled: false, curveSegments: p.forma === 'circ' ? 10 : 5 });
    if (p.vertical) g.translate(0, 0, -esp / 2);
    else g.rotateX(-Math.PI / 2);
    return g;
  });
}
function geoPlatina(p) {
  return cache(`pl${p.w}|${p.h}|${p.ranura?.desde}|${p.pestanas?.lado}`, () => {
    const o = contornoPlatina(p.w, p.h, p), s = new THREE.Shape();
    o.forEach(([x, y], i) => s[i ? 'lineTo' : 'moveTo']((x - p.w / 2) / 1000, y / 1000)); s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.006, bevelEnabled: false }); g.translate(0, 0, -0.003); return g;
  });
}
function geoDisco(p) {
  return cache(`dc${p.nombre}|${p.d}|${p.agujeros.length}|${p.ranuras.length}`, () => {
    const s = new THREE.Shape(); s.absarc(0, 0, p.d / 2000, 0, Math.PI * 2, false);
    agujerosEn(s, p.agujeros);
    for (const [x, y, w, h] of p.ranuras) { const r = new THREE.Path(); const x0 = (x - w / 2) / 1000, y0 = (y - h / 2) / 1000, x1 = (x + w / 2) / 1000, y1 = (y + h / 2) / 1000; r.moveTo(x0, y0); r.lineTo(x0, y1); r.lineTo(x1, y1); r.lineTo(x1, y0); r.closePath(); s.holes.push(r); }
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.006, bevelEnabled: false, curveSegments: 18 }); g.rotateX(-Math.PI / 2); return g;
  });
}
const G_CABEZA = new THREE.LatheGeometry([[0, 0], [0.0057, 0], [0.0056, 0.0012], [0.0049, 0.0025], [0.0034, 0.0033], [0, 0.0036]].map((q) => new THREE.Vector2(q[0], q[1])), 28);
const G_ALLEN = new THREE.CylinderGeometry(0.0019, 0.0019, 0.0012, 6);
const G_REG = new THREE.BoxGeometry(0.0272, 0.008, 0.0272), G_FIELTRO = new THREE.BoxGeometry(0.025, 0.002, 0.025);
const G_NIV = new THREE.CylinderGeometry(0.016, 0.019, 0.006, 28), G_ROSCA = new THREE.CylinderGeometry(0.004, 0.004, 0.016, 12);
function herraje(tipo, vis = 0) {
  const g = new THREE.Group();
  if (tipo === 'm6x40' || tipo === 'm6x16') {
    const L = vis || (tipo === 'm6x40' ? 0.04 : 0.016); // vis: lo que se ve del tornillo (la punta queda dentro de la tuerca)
    const c = new THREE.Mesh(G_CABEZA, mZinc), a = new THREE.Mesh(G_ALLEN, mOscuro), v = new THREE.Mesh(geoRedondo(0.003, L), mZinc);
    a.position.y = 0.0033; v.position.y = -L / 2; g.add(c, a, v);
  } else if (tipo === 'reg') {
    const c = new THREE.Mesh(G_REG, mZinc), f = new THREE.Mesh(G_FIELTRO, mFieltro); c.position.y = 0.006; f.position.y = 0.001; g.add(c, f);
  } else {
    const b = new THREE.Mesh(G_NIV, mZinc), r = new THREE.Mesh(G_ROSCA, mZinc); b.position.y = 0.003; r.position.y = 0.013; g.add(b, r);
  }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}
function malla(geo, mat, grp) { const o = new THREE.Mesh(geo, mat); o.castShadow = o.receiveShadow = true; grp.add(o); return o; }
function parte(grp, p, c) {
  if (p.t === 'tubo') {
    const P = PERFILES[p.perfil], a = V(p.a), b = V(p.b), d = b.clone().sub(a), L = d.length(); d.normalize();
    const o = malla(P.forma === 'red' ? geoRedondo(P.a / 2, L) : geoTuboCuad(P.a, P.esp, L), mPint, grp);
    o.position.copy(a).add(b).multiplyScalar(0.5); o.quaternion.setFromUnitVectors(P.forma === 'red' ? Y : Z, d);
    if (c.grupo === 'travesano') for (const [e, s] of [[a, 1], [b, -1]]) { // tapón soldado con la tuerca remachable M6
      const qd = new THREE.Quaternion().setFromUnitVectors(Y, d);
      const t = malla(cache(`tap${P.a}`, () => new THREE.BoxGeometry(P.a - 2 * P.esp, 0.0015, P.a - 2 * P.esp)), mPint, grp); t.position.copy(e).addScaledVector(d, s * 0.0035); t.quaternion.copy(qd);
      const r = malla(cache('ins', () => new THREE.CylinderGeometry(0.0052, 0.0052, 0.0012, 20)), mZinc, grp); r.position.copy(e).addScaledVector(d, s * 0.0026); r.quaternion.copy(qd);
      const h = malla(cache('insh', () => new THREE.CylinderGeometry(0.003, 0.003, 0.0014, 16)), mOscuro, grp); h.position.copy(e).addScaledVector(d, s * 0.0024); h.quaternion.copy(qd);
    }
    return;
  }
  if (p.t === 'chapa') {
    const esp = LAMINAS[p.mat].t / 1000, pl = (p.plegue || 0) / 1000;
    if (p.vertical && p.curva) { // lámina rolada: segmento de cilindro con las perforaciones recortadas
      const Rr = p.curva, th = p.w / 1000 / Rr, sag = Rr * (1 - Math.cos(th / 2));
      const o = malla(cache(`rol${p.w}|${p.h}|${Rr}`, () => new THREE.CylinderGeometry(Rr, Rr, p.h / 1000, 64, 1, true, Math.PI - th / 2, th)), materialPerforado(p), grp);
      o.position.set(0, p.y, p.z - sag + Rr);
      return;
    }
    const o = malla(geoTapa(p, esp), mPint, grp);
    if (p.vertical) { o.position.set(0, p.y, p.z); return; }
    o.position.set(0, p.y - esp, 0);
    if (!pl) return;
    const w = p.w / 1000, h = p.h / 1000;
    if (p.forma === 'circ') {
      const r = w / 2, lab = cache(`lab${r}|${pl}`, () => new THREE.LatheGeometry([[r - esp, -pl], [r, -pl], [r, -0.0015], [r - 0.0015, 0], [r - esp, 0]].map((q) => new THREE.Vector2(q[0], q[1])), 120));
      malla(lab, mPint, grp).position.y = p.y;
    } else {
      for (const s of [-1, 1]) {
        malla(cache(`plx${w}|${pl}|${esp}`, () => new THREE.BoxGeometry(w - 0.004, pl, esp)), mPint, grp).position.set(0, p.y - pl / 2, s * (h / 2 - esp / 2));
        malla(cache(`plz${h}|${pl}|${esp}`, () => new THREE.BoxGeometry(esp, pl, h - 0.004)), mPint, grp).position.set(s * (w / 2 - esp / 2), p.y - pl / 2, 0);
      }
    }
    return;
  }
  if (p.t === 'platina') { const o = malla(geoPlatina(p), mPint, grp); o.position.y = p.y; o.rotation.y = p.rotY || 0; return; }
  if (p.t === 'disco') { const o = malla(geoDisco(p), mPint, grp); o.position.y = p.y; }
}
// cordones de soldadura de los marcos que salen soldados de planta: un collar fino donde un tubo llega a otro
function cordones(grp, c) {
  const tubos = c.partes.filter((p) => p.t === 'tubo');
  for (const t of tubos) for (const e of [t.a, t.b]) {
    const q = V(e);
    for (const o of tubos) {
      if (o === t) continue;
      const a = V(o.a), b = V(o.b), ab = b.clone().sub(a), u = THREE.MathUtils.clamp(q.clone().sub(a).dot(ab) / ab.lengthSq(), 0, 1), cerca = a.clone().addScaledVector(ab, u);
      const P = PERFILES[t.perfil];
      if (cerca.distanceTo(q) > PERFILES[o.perfil].a * 0.75 || u <= 0.001 || u >= 0.999) continue;
      const d = V(t.b).sub(V(t.a)).normalize(), s = P.a + 0.003;
      const m = malla(cache(`cord${s}`, () => new THREE.BoxGeometry(s, s, 0.004)), mPint, grp);
      m.position.copy(q).addScaledVector(d, e === t.a ? 0.002 : -0.002); m.quaternion.setFromUnitVectors(Z, d);
      if (P.forma === 'red') { m.geometry = cache(`cordr${P.a}`, () => new THREE.CylinderGeometry(P.a / 2 + 0.003, P.a / 2 + 0.003, 0.004, 40)); m.quaternion.setFromUnitVectors(Y, d); }
    }
  }
  if (c.id === 'columna') for (const p of c.partes.filter((x) => x.t === 'disco')) {
    const m = malla(cache('cordcol', () => new THREE.TorusGeometry(0.0395, 0.003, 6, 48)), mPint, grp); m.rotation.x = Math.PI / 2; m.position.y = p.y > 0.3 ? p.y : p.y + 0.006;
  }
}

// Mueble 3D: un grupo por componente (lo que llega en la caja) y uno por herraje.
function mueble3D(m) {
  const root = new THREE.Group(), comps = [], herr = [];
  for (const c of m.comps) {
    const g = new THREE.Group();
    for (const p of c.partes) parte(g, p, c);
    if (c.soldado) cordones(g, c);
    const bx = new THREE.Box3().setFromObject(g), ctr = bx.getCenter(new THREE.Vector3()), size = bx.getSize(new THREE.Vector3());
    for (const ch of g.children) ch.position.sub(ctr);
    g.position.copy(ctr); root.add(g);
    comps.push({ c, g, base: ctr.clone(), size, ex: V(c.explode), paso: c.paso });
  }
  for (const h of m.herr) {
    const o = herraje(h.tipo, h.vis), d = V(h.d).normalize(), q = new THREE.Quaternion().setFromUnitVectors(Y, d);
    o.position.copy(V(h.p)); o.quaternion.copy(q); root.add(o);
    herr.push({ h, o, p: V(h.p), d, q, paso: h.paso, comp: comps.find((k) => k.c.id === h.comp), delay: 0 });
  }
  const bx = new THREE.Box3().setFromObject(root);
  return { m, root, comps, herr, box: bx };
}

// Distribución de "la caja": cada componente acostado sobre el piso, numerado, y los herrajes en bolsas.
function distribuirKit(X) {
  const items = X.comps.map((k) => {
    const s = k.size, ax = s.x <= s.y && s.x <= s.z ? 0 : s.z <= s.y ? 2 : 1;
    const q = new THREE.Quaternion();
    let fx = s.x, fz = s.z, alto = s.y;
    if (ax === 0) { q.setFromAxisAngle(Z, Math.PI / 2); fx = s.y; alto = s.x; }
    else if (ax === 2) { q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2); fz = s.y; alto = s.z; }
    return { k, q, fx, fz, alto };
  });
  const ancho = Math.max(1.5, ...items.map((i) => i.fx)) * 1.15, gap = 0.08;
  let x = 0, z = 0, fila = 0;
  const orden = [...items].sort((a, b) => b.fx * b.fz - a.fx * a.fz);
  for (const it of orden) {
    if (x > 0 && x + it.fx > ancho) { x = 0; z += fila + gap; fila = 0; }
    it.pos = new THREE.Vector3(x + it.fx / 2, it.alto / 2 + 0.001, z + it.fz / 2);
    x += it.fx + gap; fila = Math.max(fila, it.fz);
  }
  z += fila + 0.14;
  const tipos = [...new Set(X.herr.map((h) => h.h.tipo))], qh = new THREE.Quaternion().setFromUnitVectors(Y, new THREE.Vector3(1, 0, 0)), bolsas = [];
  let bx = 0;
  for (const t of tipos) {
    const hs = X.herr.filter((h) => h.h.tipo === t), paso = t === 'reg' || t === 'niv' ? 0.05 : 0.026;
    hs.forEach((h, i) => { h.kitPos = new THREE.Vector3(bx + (i % 8) * paso, t === 'm6x40' || t === 'm6x16' ? 0.0057 : 0, z + Math.floor(i / 8) * 0.05); h.kitQ = t === 'm6x40' || t === 'm6x16' ? qh : new THREE.Quaternion(); });
    bolsas.push({ t, n: hs.length, pos: new THREE.Vector3(bx + Math.min(hs.length, 8) * paso / 2, 0.02, z + Math.ceil(hs.length / 8) * 0.05 + 0.03) });
    bx += Math.min(hs.length, 8) * paso + 0.12;
  }
  const tot = new THREE.Box3();
  for (const it of items) tot.expandByPoint(it.pos.clone().add(new THREE.Vector3(it.fx / 2, 0, it.fz / 2))).expandByPoint(it.pos.clone().sub(new THREE.Vector3(it.fx / 2, 0, it.fz / 2)));
  for (const h of X.herr) tot.expandByPoint(h.kitPos);
  const c = tot.getCenter(new THREE.Vector3()); c.y = 0;
  for (const it of items) { it.k.kitPos = it.pos.sub(c); it.k.kitQ = it.q; }
  for (const h of X.herr) h.kitPos.sub(c);
  for (const b of bolsas) b.pos.sub(c);
  X.bolsas = bolsas; X.kitBox = tot.translate(c.negate());
}

/* ---------- estado → posiciones ---------- */
const tmp = new THREE.Vector3();
function objetivos(snap = false, foto = null) {
  if (!M3) return;
  const kit = S.vista === 'kit', k = S.explota, paso = foto ? foto.paso : S.modoPaso ? S.paso : Infinity;
  for (const c of M3.comps) {
    const vis = c.paso <= paso;
    c.g.visible = vis;
    if (kit && !foto) { c.tPos = c.kitPos; c.tQ = c.kitQ; }
    else {
      const extra = foto && c.paso === foto.paso ? foto.ex : 0;
      c.tPos = c.base.clone().addScaledVector(c.ex, k + extra); c.tQ = new THREE.Quaternion();
    }
    if (snap) { c.g.position.copy(c.tPos); c.g.quaternion.copy(c.tQ); }
  }
  for (const h of M3.herr) {
    h.o.visible = h.paso <= paso;
    if (kit && !foto) { h.tPos = h.kitPos; h.tQ = h.kitQ; }
    else {
      const ce = h.comp ? h.comp.ex : tmp.set(0, 0, 0), extra = foto && h.paso === foto.paso ? foto.ex : 0;
      h.tPos = h.p.clone().addScaledVector(ce, (h.comp && h.comp.paso === h.paso ? k + extra : k)).addScaledVector(h.d, 0.07 * k + (extra ? 0.06 : 0)); h.tQ = h.q;
    }
    if (snap) { h.o.position.copy(h.tPos); h.o.quaternion.copy(h.tQ); }
  }
}
function animar(dt) {
  if (!M3) return;
  const a = 1 - Math.exp(-dt * 5.5), b = 1 - Math.exp(-dt * 7);
  for (const c of M3.comps) { if (!c.tPos) continue; c.g.position.lerp(c.tPos, a); c.g.quaternion.slerp(c.tQ, a); }
  for (const h of M3.herr) {
    if (!h.tPos) continue;
    if (h.delay > 0) { h.delay -= dt; continue; }
    const d = h.o.position.distanceTo(h.tPos);
    h.o.position.lerp(h.tPos, b);
    if (S.vista !== 'kit' && d > 0.0015 && (h.h.tipo === 'm6x40' || h.h.tipo === 'm6x16')) h.o.quaternion.copy(h.tQ).multiply(new THREE.Quaternion().setFromAxisAngle(Y, d * 260));
    else h.o.quaternion.slerp(h.tQ, b);
  }
}

/* ---------- cámara ---------- */
function encuadre(vista, inmediato = false) {
  if (!M3) return;
  let tgt, dir, rad;
  if (vista === 'cafeteria' && sala) { const s = sala.box.getBoundingSphere(new THREE.Sphere()); tgt = s.center.clone(); tgt.y = 0.35; rad = s.radius * 0.82; dir = new THREE.Vector3(0.75, 0.95, 1.1); }
  else if (vista === 'kit') { const s = M3.kitBox.getBoundingSphere(new THREE.Sphere()); tgt = s.center.clone(); rad = s.radius * 1.02; dir = new THREE.Vector3(0.18, 1.7, 0.9); }
  else if (vista === 'union') {
    const h = M3.herr.find((x) => x.h.tipo === 'm6x40' && x.d.x > 0) || M3.herr.find((x) => x.h.tipo === 'm6x16') || M3.herr[0];
    tgt = h.p.clone(); rad = 0.075; dir = h.d.clone().multiplyScalar(1.1).add(new THREE.Vector3(0.25, 0.35, 0.75));
  } else { const s = M3.box.getBoundingSphere(new THREE.Sphere()); tgt = s.center.clone(); rad = s.radius * (1 + S.explota * 0.85); tgt.y += S.explota * 0.12; dir = new THREE.Vector3(1.0, 0.55, 1.3); }
  const dist = rad / Math.sin(THREE.MathUtils.degToRad(cam.fov / 2)) * (cam.aspect < 1 ? 1.25 / Math.max(0.55, cam.aspect) : 1.05);
  cajaCam.tgt.copy(tgt); cajaCam.pos.copy(tgt).addScaledVector(dir.normalize(), dist); cajaCam.activa = true;
  const r = Math.max(2.2, rad * 2.2); Object.assign(sol.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 0.5, far: 20 }); sol.shadow.camera.updateProjectionMatrix();
  sol.target.position.copy(tgt); sol.position.copy(tgt).add(new THREE.Vector3(2.6, 4.2, 2.2));
  if (inmediato) { cam.position.copy(cajaCam.pos); ctl.target.copy(cajaCam.tgt); cajaCam.activa = false; }
}

/* ---------- etiquetas numeradas ---------- */
const etqs = [];
function etiquetas() {
  const cont = $('#etiquetas'), lista = [];
  if (M3 && S.vista !== 'cafeteria') {
    const kit = S.vista === 'kit', mostrar = kit || S.explota > 0.25;
    for (const c of M3.comps) if (c.g.visible && (mostrar || (S.modoPaso && c.paso === S.paso))) lista.push({ p: c.g.position.clone().add(new THREE.Vector3(0, kit ? 0.03 : 0, 0)), n: c.c.n, t: c.c.nombre });
    if (kit) for (const b of M3.bolsas) lista.push({ p: b.pos, n: `${b.n}×`, t: HERRAJES[b.t].corto, h: true });
  }
  const r = cont.getBoundingClientRect();
  while (etqs.length < lista.length) { const d = document.createElement('div'); d.className = 'etq'; d.innerHTML = '<i></i><span></span>'; cont.appendChild(d); etqs.push(d); }
  etqs.forEach((d, i) => {
    const e = lista[i]; if (!e) { d.hidden = true; return; }
    const v = e.p.clone().project(cam); d.hidden = v.z > 1;
    d.style.left = `${(v.x * 0.5 + 0.5) * r.width}px`; d.style.top = `${(-v.y * 0.5 + 0.5) * r.height}px`;
    d.className = e.h ? 'etq h' : 'etq'; d.firstChild.textContent = e.n; d.lastChild.textContent = e.t;
  });
}

/* ---------- cafetería armada: todos los muebles del pedido sobre el piso del estudio ---------- */
function armarSala() {
  if (sala) { scene.remove(sala.g); sala = null; }
  const g = new THREE.Group(), modelos = {};
  const modelo = (id) => (modelos[id] ||= mueble3D(construir(id, S.params[id], { perforado: S.perforado })).root);
  const pon = (id, x, z, ry = 0) => { const o = modelo(id).clone(); o.position.set(x, 0, z); o.rotation.y = ry; g.add(o); };
  let sillas = S.cafe.silla, tab = S.cafe.taburete;
  const nb = S.cafe.barra, Wb = S.params.barra.ancho / 1000;
  for (let i = 0; i < nb; i++) {
    const x = -((nb - 1) * (Wb + 0.25)) / 2 + i * (Wb + 0.25); pon('barra', x - 0.6, -1.9);
    const n = Math.ceil(tab / (nb - i)); for (let j = 0; j < n; j++) { pon('taburete', x - 0.6 - Wb / 2 + (Wb / n) * (j + 0.5), -1.32, Math.PI); } tab -= n;
  }
  const nm = S.cafe.mesa, nm2 = S.cafe.pedestal;
  for (let i = 0; i < nm; i++) {
    const x = -((nm - 1) * 1.75) / 2 + i * 1.75, f = S.params.mesa.fondo / 1000; pon('mesa', x, 0.15);
    if (sillas > 0) { pon('silla', x, 0.15 + f / 2 + 0.12, Math.PI); sillas--; }
    if (sillas > 0) { pon('silla', x, 0.15 - f / 2 - 0.12); sillas--; }
  }
  for (let i = 0; i < nm2; i++) {
    const x = -((nm2 - 1) * 1.9) / 2 + i * 1.9 + 0.4, r = S.params.pedestal.diametro / 2000; pon('pedestal', x, 2.05);
    if (sillas > 0) { pon('silla', x + r + 0.14, 2.05, -Math.PI / 2); sillas--; }
    if (sillas > 0) { pon('silla', x - r - 0.14, 2.05, Math.PI / 2); sillas--; }
  }
  for (let i = 0; i < sillas; i++) pon('silla', 2.6, -1.2 + i * 0.55, -Math.PI / 2);
  for (let i = 0; i < tab; i++) pon('taburete', 2.9, 0.4 + i * 0.5);
  const bx = new THREE.Box3().setFromObject(g), s = bx.getSize(new THREE.Vector3()), c = bx.getCenter(new THREE.Vector3());
  const zona = new THREE.Mesh(new THREE.PlaneGeometry(s.x + 1.2, s.z + 1.2), new THREE.MeshStandardMaterial({ color: 0xd6dae2, roughness: 0.95 }));
  zona.rotation.x = -Math.PI / 2; zona.position.set(c.x, 0.001, c.z); zona.receiveShadow = true; g.add(zona);
  g.traverse((o) => { if (o.isMesh && o !== zona) { o.castShadow = true; o.receiveShadow = true; } });
  scene.add(g); sala = { g, box: bx };
}

/* =================================================================================================
   Rehacer: datos → ficha → instructivo → despiece → 3D
   ================================================================================================= */
function rehacer(nuevoProducto) {
  M = construir(S.id, S.params[S.id], { perforado: S.perforado });
  const prod = PRODUCTOS[S.id], P = M.params;
  $('#tNombre').textContent = prod.nombre;
  $('#tMedida').textContent = Object.keys(prod.params).map((k) => `${PARAM_NOMBRE[k].toLowerCase()} ${P[k]}`).join(' · ') + ' mm';
  const d = despiece([{ id: S.id, mueble: M, cant: 1 }], { orden: prod.ref });
  const cj = caja(M), torn = (d.herrajes.m6x40 || 0) + (d.herrajes.m6x16 || 0);
  $('#fKg').innerHTML = `${kgf(d.resumen.kg)}<span>kg</span>`;
  $('#fPiezas').textContent = `${M.comps.length} + ${M.herr.length - torn}`;
  $('#fTorn').textContent = `${torn} M6`;
  $('#fMin').textContent = `${Math.round(3 + M.pasos.length * 1.5 + torn * 0.5)} min`;
  $('#fCaja').textContent = `${cj.l} × ${cj.a} × ${cj.h} mm · ${kgf(d.resumen.kg + 1.2)} kg con empaque`;
  pintarInstructivo(d);
  pintarDespiece(d);
  pintarCafeteria();
  if (R) {
    if (M3) raiz.remove(M3.root);
    M3 = mueble3D(M); distribuirKit(M3); raiz.add(M3.root);
    raiz.visible = S.vista !== 'cafeteria';
    if (S.vista === 'cafeteria') { armarSala(); }
    else if (sala) { scene.remove(sala.g); sala = null; }
    objetivos(true);
    if (nuevoProducto) encuadre(S.vista === 'cafeteria' ? 'cafeteria' : S.vista, false);
  }
  history.replaceState(null, '', `?mueble=${S.id}${S.acabado !== 'negro' ? `&acabado=${S.acabado}` : ''}${S.perforado !== 'puntos' ? `&perforado=${S.perforado}` : ''}`);
}

/* ---------- instructivo ---------- */
const bolsa = (cuenta) => Object.entries(cuenta).map(([k, n]) => `${n}× ${HERRAJES[k].corto}`);
function pintarInstructivo(d) {
  $('#aHerr').textContent = `${M.pasos.length} pasos · llave Allen 4 mm`;
  $('#pasos').innerHTML = M.pasos.map((p) => `<li data-n="${p.n}" aria-current="${S.modoPaso && S.paso === p.n}"><button type="button"><i>${p.n}</i><b>${p.titulo}</b><span>${p.texto}</span><small>${[...p.comps.map((id) => `pieza ${M.comps.find((c) => c.id === id).n}`), ...bolsa(p.cuenta)].join(' · ') || '—'}</small></button></li>`).join('');
  const filas = M.comps.map((c) => `<tr><td>${c.n}</td><td>${c.nombre}${c.soldado ? '<small>sale soldado de planta</small>' : ''}</td><td class="n">1</td></tr>`).join('') +
    Object.entries(d.herrajes).map(([k, n]) => `<tr><td>${k === 'llave' ? '🔧' : '·'}</td><td>${HERRAJES[k].nombre}</td><td class="n">${n}</td></tr>`).join('');
  $('#tCaja').innerHTML = `<tr><th>#</th><th>Pieza</th><th>Cant.</th></tr>${filas}`;
}
$('#pasos').addEventListener('click', (e) => { const li = e.target.closest('li[data-n]'); if (!li) return; pararAuto(); irPaso(+li.dataset.n); });
function marcarPasos() { for (const li of $('#pasos').children) li.setAttribute('aria-current', S.modoPaso && +li.dataset.n === S.paso); }
function irPaso(n) {
  if (S.vista !== 'producto' && S.vista !== 'union') ponerVista('producto');
  S.modoPaso = true; S.explota = 0; $('#explota').value = 0;
  const ant = S.paso; S.paso = Math.max(1, Math.min(M.pasos.length, n));
  objetivos(false);
  if (M3 && S.paso > ant) {
    for (const c of M3.comps) if (c.paso === S.paso) c.g.position.copy(c.base).addScaledVector(c.ex, 1.5);
    for (const h of M3.herr) if (h.paso === S.paso) { h.o.position.copy(h.p).addScaledVector(h.d, 0.09); h.delay = h.comp && h.comp.paso === S.paso ? 0.75 : 0.15; }
  }
  const p = M.pasos[S.paso - 1];
  $('#pasoinfo').hidden = false; document.body.classList.add('en-paso');
  $('#pasoN').textContent = `Paso ${S.paso} de ${M.pasos.length}`; $('#pasoT').textContent = p.titulo; $('#pasoX').textContent = p.texto;
  $('#pasoB').innerHTML = [...bolsa(p.cuenta), p.herramienta].map((t) => `<em>${t}</em>`).join('');
  marcarPasos();
}
function salirPaso() { S.modoPaso = false; S.paso = 0; $('#pasoinfo').hidden = true; document.body.classList.remove('en-paso'); pararAuto(); marcarPasos(); objetivos(false); }
function pararAuto() { if (S.auto) { clearInterval(S.auto); S.auto = null; } $('#bPaso').textContent = '▶ armar paso a paso'; $('#bArmar').textContent = '▶ armar'; }
function autoArmar() {
  if (S.auto) { pararAuto(); return; }
  S.paso = 0; if (M3) for (const c of M3.comps) c.g.visible = false;
  irPaso(1);
  $('#bPaso').textContent = '❚❚ pausa'; $('#bArmar').textContent = '❚❚ pausa';
  S.auto = setInterval(() => { if (S.paso >= M.pasos.length) { pararAuto(); return; } irPaso(S.paso + 1); }, 2600);
}
$('#bPaso').addEventListener('click', autoArmar); $('#bArmar').addEventListener('click', autoArmar);
$('#bSig').addEventListener('click', () => { pararAuto(); irPaso(S.modoPaso ? S.paso + 1 : 1); });
$('#bAnt').addEventListener('click', () => { pararAuto(); if (S.modoPaso) irPaso(S.paso - 1); else irPaso(M.pasos.length); });
$('#explota').addEventListener('change', () => { if (S.vista === 'producto') encuadre('producto'); });
$('#explota').addEventListener('input', (e) => { if (S.modoPaso) salirPaso(); if (S.vista === 'kit' || S.vista === 'cafeteria') ponerVista('producto'); S.explota = +e.target.value; objetivos(false); });

/* ---------- vistas ---------- */
function ponerVista(v) {
  if (v !== 'producto' && v !== 'union' && S.modoPaso) salirPaso();
  S.vista = v;
  for (const b of document.querySelectorAll('.vistas button')) b.setAttribute('aria-pressed', b.dataset.vista === v);
  if (!R) return;
  if (v === 'cafeteria') { if (!sala) armarSala(); sala.g.visible = true; raiz.visible = false; }
  else { raiz.visible = true; if (sala) sala.g.visible = false; }
  if (v === 'union') { S.explota = 0.16; $('#explota').value = 0.16; }
  else if (v === 'producto' && S.explota === 0.16) { S.explota = 0; $('#explota').value = 0; }
  objetivos(false); encuadre(v);
}
for (const b of document.querySelectorAll('.vistas button')) b.addEventListener('click', () => ponerVista(b.dataset.vista));
$('#bVerCafe').addEventListener('click', () => { ponerVista('cafeteria'); if (innerWidth < 860) $('#lienzo').scrollIntoView({ behavior: 'smooth' }); });

/* ---------- despiece (motor de Fábrica) ---------- */
function nest(d) { return { B: nestBars(d, { stock: [6000], kerf: 2, trim: 10, retalMin: 400 }), P: nestPlates(d, { sheet: { w: 2440, h: 1220 }, gap: 8, margin: 10 }) }; }
function pintarDespiece(d) {
  const { B, P } = nest(d);
  const fila = (m, med, mat) => `<tr${m.qty > 2 ? ' class="lego"' : ''}><td>${m.mark}</td><td>${m.nombre}<small>${mat}</small></td><td class="n">${med}</td><td class="n">×${m.qty}</td></tr>`;
  $('#tPiezas').innerHTML = `<tr><th>Marca</th><th>Pieza</th><th>mm</th><th>Cant.</th></tr>` +
    d.marcas.map((m) => fila(m, fmt(m.length), PERFILES[m.profile].nombre)).join('') +
    d.placas.map((p) => fila(p, `${p.w}×${p.h}`, `${LAMINAS[p.mat].nombre}${p.dobleces ? ` · ${p.dobleces} dobleces` : ''}${p.holes.length > 8 ? ` · ${p.holes.length} perforaciones` : ''}`)).join('');
  $('#oAprov').textContent = `${B.barras.length} × 6 m · ${Math.round(B.aprovechamiento * 100)} %`;
  $('#barras').innerHTML = B.barras.map((b) => `<div title="${b.codigo}">${b.cuts.map((c) => `<span style="width:${(c.len / b.stock) * 100}%">${c.mark}</span>`).join('')}<span class="r" style="width:${((b.stock - b.used) / b.stock) * 100}%"></span></div>`).join('') +
    `<p>${B.cortes} cortes · rayado = retal ${B.retales.length ? `(vuelve al almacén: ${B.retales.map((r) => `${fmt(r.len)} mm`).join(', ')})` : ''}</p>`;
  const porT = {}; for (const h of P.hojas) porT[h.t] = (porT[h.t] || 0) + 1;
  $('#oHojas').textContent = `${P.hojas.length} pliego${P.hojas.length > 1 ? 's' : ''}`;
  $('#nHojas').textContent = Object.entries(porT).map(([t, n]) => `${n} pliego de ${String(t).replace('.', ',')} mm (1,22 × 2,44 m)`).join(' · ') + `. Corte láser: ${String(d.resumen.corteLaser).replace('.', ',')} m. Lo que sobra del pliego sirve para el siguiente mueble del pedido.`;
}
function paquete(d, nombre) {
  const { B, P } = nest(d), cs = costo(d, B, P), slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
  const files = [
    { name: 'LEEME.txt', data: `AceroStudio · Muebles desarmables · ${nombre}\nOrden ${d.orden} · ${d.resumen.unidades} muebles · ${kgf(d.resumen.kg)} kg de acero\n\ncorte_tubos.csv: barra por barra (6 m), con marca y posición de cada corte.\npiezas.csv: marcas de tubo y lámina, cantidades, kg y en qué mueble va cada una.\nlaminas/: DXF de cada pieza de lámina (capas CORTE, AGUJEROS, DOBLEZ, MARCADO).\npliegos/: DXF de cada pliego ya anidado para el láser.\nPrecios de ejemplo: confirmar con cotizaciones del taller.\n` },
    { name: 'corte_tubos.csv', data: csvCorte(B) },
    { name: 'piezas.csv', data: csvMuebles(d) },
    { name: 'costo.csv', data: ['Grupo;Concepto;Cant.;Unitario;Total', ...cs.lineas.map((l) => `${l.grupo};${l.nombre};${String(l.cant).replace('.', ',')};${l.unit};${l.total}`), `;Costo;;;${cs.costo}`, `;Venta (margen ${Math.round(cs.margen * 100)} %);;;${cs.venta}`].join('\n') + '\n' },
    ...d.placas.map((p) => ({ name: `laminas/${p.mark}_${slug(p.nombre)}.dxf`, data: dxfPieza(p) })),
    ...P.hojas.map((h) => ({ name: `pliegos/${h.codigo}_lamina_${String(h.t).replace('.', ',')}mm.dxf`, data: dxfHoja(h, d.placas) })),
  ];
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([zip(files)], { type: 'application/zip' })); a.download = `acerostudio_muebles_${slug(nombre)}.zip`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
$('#bZip1').addEventListener('click', () => paquete(despiece([{ id: S.id, mueble: M, cant: 1 }], { orden: PRODUCTOS[S.id].ref }), PRODUCTOS[S.id].nombre));

/* ---------- cafetería: pedido completo ---------- */
function pedidoCafe() { return Object.entries(S.cafe).filter(([, n]) => n > 0).map(([id, cant]) => ({ id, params: S.params[id], cfg: { perforado: S.perforado }, cant })); }
function pintarCafeteria() {
  $('#cCant').innerHTML = Object.entries(PRODUCTOS).map(([id, p]) => `<li><span>${p.nombre}</span><small>${p.ref} · ${Object.values(S.params[id]).join('×')} mm</small><span class="num"><button type="button" data-id="${id}" data-d="-1" aria-label="Quitar">−</button><output>${S.cafe[id]}</output><button type="button" data-id="${id}" data-d="1" aria-label="Agregar">+</button></span></li>`).join('');
  const ped = pedidoCafe();
  if (!ped.length) { $('#cVenta').textContent = '$0'; return; }
  const d = despiece(ped, { orden: 'CAFE-01' }), { B, P } = nest(d), cs = costo(d, B, P);
  $('#cUnid').textContent = `${d.resumen.unidades} muebles`;
  $('#cVenta').textContent = pesos(cs.venta); $('#cCosto').textContent = `costo ${pesos(cs.costo)} · margen ${Math.round(cs.margen * 100)} %`;
  $('#cKg').textContent = `${kgf(d.resumen.kg)} kg`; $('#cTramos').textContent = B.compra.reduce((s, c) => s + c.n, 0); $('#cPliegos').textContent = P.hojas.length;
  $('#cLego').innerHTML = [...d.marcas, ...d.placas].filter((x) => x.en.length > 1 || x.qty >= 12).sort((a, b) => b.qty - a.qty).slice(0, 5).map((x) => `<li><i>${x.mark}</i><span>${x.nombre.split(' / ')[0]} ${x.length ? `${fmt(x.length)} mm` : `${x.w}×${x.h}`} <b>×${x.qty}</b></span><small>${x.en.length > 1 ? `la misma pieza sirve en ${x.en.join(' y ')}` : `una sola marca en ${x.en[0]}`}</small></li>`).join('');
  let g = '';
  $('#cPresu').innerHTML = cs.lineas.map((l) => { const t = l.grupo !== g ? `<li class="t">${(g = l.grupo)}</li>` : ''; return `${t}<li><span>${l.nombre}</span><small>${String(l.cant).replace('.', ',')} × ${pesos(l.unit)}</small><b>${pesos(l.total)}</b></li>`; }).join('');
}
$('#cCant').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-id]'); if (!b) return;
  S.cafe[b.dataset.id] = Math.max(0, Math.min(24, S.cafe[b.dataset.id] + +b.dataset.d)); pintarCafeteria();
  if (R && S.vista === 'cafeteria') { armarSala(); encuadre('cafeteria'); } else if (sala) { scene.remove(sala.g); sala = null; }
});
$('#bZip2').addEventListener('click', () => { const ped = pedidoCafe(); if (ped.length) paquete(despiece(ped, { orden: 'CAFE-01' }), 'cafeteria'); });

/* ---------- instructivo imprimible con dibujos de cada paso ---------- */
function foto(est, vista) {
  const vPrev = S.vista; S.vista = vista;
  objetivos(true, est); encuadre(vista, true); ctl.update();
  R.render(scene, cam); const url = R.domElement.toDataURL('image/jpeg', 0.9);
  S.vista = vPrev; return url;
}
$('#bInstructivo').addEventListener('click', () => {
  if (!R) return;
  const w = window.open('', '_blank'); if (!w) return;
  const prev = { modo: S.modoPaso, paso: S.paso, ex: S.explota, vista: S.vista };
  pararAuto(); raiz.visible = true; if (sala) sala.g.visible = false; $('#etiquetas').hidden = true;
  S.explota = 0;
  const kit = foto(null, 'kit');
  const pasos = M.pasos.map((p) => ({ p, img: foto({ paso: p.n, ex: p.comps.length ? 0.55 : 0 }, 'producto') }));
  const fin = foto({ paso: 99, ex: 0 }, 'producto');
  Object.assign(S, { modoPaso: prev.modo, paso: prev.paso, explota: prev.ex }); $('#etiquetas').hidden = false; ponerVista(prev.vista); objetivos(true);
  const prod = PRODUCTOS[S.id], d = despiece([{ id: S.id, mueble: M, cant: 1 }]);
  w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Instructivo ${prod.nombre}</title><style>
    body{font-family:Outfit,system-ui,sans-serif;color:#1a1e2c;margin:0;padding:28px;background:#fff}h1{font-family:Antonio,'Arial Narrow',sans-serif;text-transform:uppercase;font-size:44px;margin:0}
    .k{font:11px 'DM Mono',monospace;letter-spacing:.1em;text-transform:uppercase;color:#5f6679}.g{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px}
    figure{margin:0;border:1px solid #e3e6ec;border-radius:6px;overflow:hidden;break-inside:avoid}figure img{width:100%;display:block;background:#eceef2}figcaption{padding:12px 14px}
    figcaption b{display:flex;gap:10px;align-items:center;font-size:18px}figcaption i{width:30px;height:30px;border-radius:50%;background:#e8736a;color:#fff;display:grid;place-items:center;font:500 13px monospace;font-style:normal}
    figcaption p{margin:6px 0;font-size:13.5px;line-height:1.4}.b{display:flex;gap:6px;flex-wrap:wrap}.b em{font:500 11px monospace;font-style:normal;border:1px solid #c9cedb;border-radius:12px;padding:3px 9px}
    table{border-collapse:collapse;font-size:13px;width:100%}td{padding:4px 6px;border-bottom:1px solid #eee}td:first-child{color:#d8574b;font:500 12px monospace}
    @media print{body{padding:0}.no{display:none}}</style></head><body>
    <p class="k">AceroStudio · muebles desarmables en acero · ${prod.ref}</p><h1>${prod.nombre}</h1>
    <p class="k">${Object.entries(M.params).map(([k, v]) => `${PARAM_NOMBRE[k]} ${v} mm`).join(' · ')} · ${ACABADOS[S.acabado].nombre} · ${M.pasos.length} pasos · llave Allen 4 mm</p>
    <button class="no" onclick="print()" style="padding:8px 14px;margin:8px 0">Imprimir</button>
    <div class="g"><figure><img src="${kit}" alt="Piezas de la caja"><figcaption><b>En la caja</b><table>${M.comps.map((c) => `<tr><td>${c.n}</td><td>${c.nombre}</td></tr>`).join('')}${Object.entries(d.herrajes).map(([k, n]) => `<tr><td>${n}×</td><td>${HERRAJES[k].nombre}</td></tr>`).join('')}</table></figcaption></figure>
    <figure><img src="${fin}" alt="Mueble armado"><figcaption><b>Armado</b><p>${kgf(d.resumen.kg)} kg de acero. Aprieta todos los tornillos al final, cuando el mueble ya esté parado y derecho.</p></figcaption></figure>
    ${pasos.map(({ p, img }) => `<figure><img src="${img}" alt="Paso ${p.n}"><figcaption><b><i>${p.n}</i>${p.titulo}</b><p>${p.texto}</p><div class="b">${[...p.comps.map((id) => `pieza ${M.comps.find((c) => c.id === id).n}`), ...bolsa(p.cuenta), p.herramienta].map((t) => `<em>${t}</em>`).join('')}</div></figcaption></figure>`).join('')}</div></body></html>`);
  w.document.close();
});

/* =================================================================================================
   Arranque
   ================================================================================================= */
pintarCatalogo(); pintarMedidas();
try { iniciar3D(); } catch (e) { console.error(e); R = null; $('#sin3d').hidden = false; }
rehacer(true);
if (R) {
  const v = Q.get('vista'); if (['kit', 'union', 'cafeteria'].includes(v)) { ponerVista(v); objetivos(true); encuadre(v, true); } else encuadre('producto', true);
  if (Q.get('tab')) document.querySelector(`[data-tab=${Q.get('tab')}]`)?.click();
  if (Q.has('explota')) { S.explota = +Q.get('explota'); $('#explota').value = S.explota; objetivos(true); encuadre('producto', true); }
  if (Q.has('paso')) { irPaso(+Q.get('paso')); objetivos(true); }
  let t0 = performance.now();
  R.setAnimationLoop(() => {
    const t = performance.now(), dt = Math.min(0.05, (t - t0) / 1000); t0 = t;
    if (cajaCam.activa) { const a = 1 - Math.exp(-dt * 4); cam.position.lerp(cajaCam.pos, a); ctl.target.lerp(cajaCam.tgt, a); if (cam.position.distanceTo(cajaCam.pos) < 0.002) cajaCam.activa = false; }
    animar(dt); ctl.update(); R.render(scene, cam); etiquetas();
  });
}
window.__muebles = { S, get M() { return M; }, irPaso, ponerVista, rehacer, salirPaso };
