// AceroStudio · estilo volumétrico urbano
// Ciudad isométrica de bloques, viaducto de acero coral y complejos destacados
// con estructura de acero predimensionada. Three.js sin build.
import * as THREE from 'three';

/* ---------- paletas (0 = tarde, 1 = noche) ---------- */
const PAL = {
  // colores medidos de la referencia (noche) y su versión de atardecer
  tarde: { bg: '#eceef2', topA: '#ffffff', topB: '#fcfcfd', litA: '#f4f5f8', litB: '#e7e3e8', shdA: '#d9dde5', shdB: '#d0c9d1', pink: '#f3cfd0',
           ground: '#e3e5ea', grid: '#d6d9e0', road: '#ee8a82', roadSide: '#cf6f68', pillar: '#c7a0a4', cel: '#a9d4f6', frame: '#1c2232', car: '#ffffff', fog: '#eceef2' },
  noche: { bg: '#2b3040', topA: '#56627a', topB: '#4d5f79', litA: '#4f5f79', litB: '#5f5266', shdA: '#363e51', shdB: '#4a3a48', pink: '#7a5566',
           ground: '#242936', grid: '#2f3545', road: '#e29699', roadSide: '#b47e85', pillar: '#9c6d77', cel: '#bfe2fb', frame: '#121622', car: '#ffe9b8', fog: '#3a3546' },
};
const C = (h) => new THREE.Color(h);
function mix(a, b, t) { return C(a).lerp(C(b), t); }
export function paleta(t) {
  const o = {};
  for (const k of Object.keys(PAL.noche)) o[k] = mix(PAL.tarde[k], PAL.noche[k], t);
  return o;
}

/* ---------- azar con semilla ---------- */
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

/* ---------- perfiles de acero (kg/m reales) ---------- */
export const PERFILES = {
  columna: { nombre: 'HEB 300', kgm: 117 },
  viga: { nombre: 'IPE 360', kgm: 57.1 },
  riostra: { nombre: 'SHS 150×8', kgm: 34.4 },
  cercha: { nombre: 'CHS 219×10', kgm: 51.6 },
};

/* ---------- escena ---------- */
export function crearCiudad(canvas, overlay, opciones = {}) {
  const opt = Object.assign({ hora: 1, semilla: 7, deriva: true, vista: 150, azimut: 45, elevacion: 41, centro: [0, 0, 0] }, opciones);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1200);
  const target = new THREE.Vector3(...opt.centro);
  let az = opt.azimut, el = opt.elevacion, vista = opt.vista;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x8890b0, 1.55);
  const sol = new THREE.DirectionalLight(0xffffff, 1.35);
  sol.position.set(-60, 140, 30);
  scene.add(hemi, sol);
  scene.fog = new THREE.Fog(0x000000, 420, 900);

  const R = rng(opt.semilla);

  /* ----- vías: viaducto principal y ramal ----- */
  // coordenadas de pantalla: u = horizontal, w = profundidad (hacia abajo en la imagen)
  const v = (u, w) => new THREE.Vector3((u + w) / Math.SQRT2, 0, (w - u) / Math.SQRT2);
  const vias = [
    new THREE.CatmullRomCurve3([v(-230, 80), v(-150, 66), v(-80, 52), v(-38, 34), v(-22, 4), v(-30, -36), v(-8, -68), v(50, -84), v(130, -92), v(240, -104)], false, 'centripetal'),
    new THREE.CatmullRomCurve3([v(-24, 8), v(14, 26), v(46, 58), v(78, 96), v(120, 140)], false, 'centripetal'),
  ];
  const ELEV = 7, ESP = 1.5;
  const muestras = vias.map((c) => c.getSpacedPoints(Math.round(c.getLength() / 1.5)));
  function distVia(x, z) {
    let m = 1e9;
    for (const arr of muestras) for (const p of arr) { const d = (p.x - x) ** 2 + (p.z - z) ** 2; if (d < m) m = d; }
    return Math.sqrt(m);
  }

  /* ----- complejos destacados (en acero) ----- */
  const complejos = [
    { id: 'A', nombre: 'complejo A', uso: 'vivienda + comercio', pos: (() => { const q = v(-6, 64); return [q.x, 0, q.z]; })(),
      cajas: [ { x: 0, z: 0, w: 11, d: 11, y: 0, h: 50 }, { x: 14, z: -2, w: 28, d: 9, y: 34, h: 9 }, { x: 26, z: -2, w: 8, d: 9, y: 0, h: 34 } ] },
    { id: 'B', nombre: 'complejo B', uso: 'oficinas + mirador', pos: (() => { const q = v(-64, -50); return [q.x, 0, q.z]; })(),
      cajas: [ { x: 0, z: 0, w: 30, d: 13, y: 0, h: 16 }, { x: -4, z: 0, w: 20, d: 11, y: 16, h: 14 }, { x: -7, z: 0, w: 11, d: 10, y: 30, h: 16 } ] },
  ];
  const reservas = complejos.map((c) => {
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const b of c.cajas) { x0 = Math.min(x0, c.pos[0] + b.x - b.w / 2); x1 = Math.max(x1, c.pos[0] + b.x + b.w / 2); z0 = Math.min(z0, c.pos[2] + b.z - b.d / 2); z1 = Math.max(z1, c.pos[2] + b.z + b.d / 2); }
    return { x0: x0 - 5, x1: x1 + 5, z0: z0 - 5, z1: z1 + 5 };
  });
  const enReserva = (x, z, r) => reservas.some((q) => x + r > q.x0 && x - r < q.x1 && z + r > q.z0 && z - r < q.z1);

  /* ----- geometría de la ciudad (una sola malla) ----- */
  const pos = [], nor = [], info = []; // info: [h, cara(0 techo,1 luz,2 sombra,3 fondo), tipo(0 edificio,1 vía,2 faldón,3 pila), brillo rosa]
  let glowActual = 0;
  function cara(a, b, c, d, n, h0, h1, top, tipo) {
    const k = top ? 0 : n[2] > 0.5 ? 1 : n[0] > 0.5 ? 2 : 3;
    for (const [p, h] of [[a, h0], [b, h0], [c, h1], [a, h0], [c, h1], [d, h1]]) { pos.push(...p); nor.push(...n); info.push(h, k, tipo, glowActual); }
  }
  function caja(x0, y0, z0, x1, y1, z1, tipo = 0) {
    const H = 50, h0 = Math.min(1, y0 / H), h1 = Math.min(1, y1 / H);
    if (tipo === 0) glowActual = Math.exp(-Math.max(0, distVia((x0 + x1) / 2, (z0 + z1) / 2) - 8) / 22);
    cara([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], [0, 1, 0], h1, h1, 1, tipo);
    cara([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1], h0, h1, 0, tipo);
    cara([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [0, 0, -1], h0, h1, 0, tipo);
    cara([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [1, 0, 0], h0, h1, 0, tipo);
    cara([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0], h0, h1, 0, tipo);
  }
  // bloques robustos, calles angostas, alturas de 2:1 (como la referencia)
  const PASO = 16, N = 13, ocupado = new Set();
  for (let gx = -N; gx <= N; gx++) for (let gz = -N; gz <= N; gz++) {
    if (ocupado.has(gx + ',' + gz)) { R(); R(); R(); continue; }
    const largo = R() < 0.14 && !ocupado.has(gx + 1 + ',' + gz);
    const cx = gx * PASO + (largo ? PASO / 2 : 0) + (R() - 0.5) * 1.2, cz = gz * PASO + (R() - 0.5) * 1.2;
    const w = (largo ? PASO : 0) + 11 + R() * 2.8, d = 11 + R() * 2.8, r = Math.max(w, d) / 2;
    if (distVia(cx, cz) < r + 9 || enReserva(cx, cz, r)) { R(); continue; }
    if (largo) ocupado.add(gx + 1 + ',' + gz);
    const lejos = Math.hypot(cx, cz) / 200;
    let h = largo ? 8 + R() * 10 : 12 + Math.pow(R(), 1.25) * (36 - lejos * 12);
    if (enReserva(cx, cz, r + 16)) h *= 0.55;
    caja(cx - w / 2, 0, cz - d / 2, cx + w / 2, h, cz + d / 2);
    if (!largo && R() < 0.07 && h > 24) { const s = 0.6; caja(cx - w * s / 2, h, cz - d * s / 2, cx + w * s / 2, h + 5 + R() * 6, cz + d * s / 2); }
  }
  // viaducto: dos tableros con vacío central, faldones y pilas
  for (const arr of muestras) {
    for (const lado of [-1, 1]) {
      const o0 = lado * 2.0, o1 = lado * 7.6;
      const nrm = arr.map((_, i) => { const t = new THREE.Vector3().subVectors(arr[Math.min(i + 1, arr.length - 1)], arr[Math.max(i - 1, 0)]).normalize(); return [-t.z, 0, t.x]; });
      for (let i = 0; i < arr.length - 1; i++) {
        const p = arr[i], q = arr[i + 1]; const n = nrm[i];
        const P = (pt, o, y) => { const m = pt === q ? nrm[i + 1] : nrm[i]; return [pt.x + m[0] * o, y, pt.z + m[2] * o]; };
        const hb = ELEV / 40;
        { const oa = Math.min(o0, o1), ob = Math.max(o0, o1); cara(P(p, ob, ELEV), P(q, ob, ELEV), P(q, oa, ELEV), P(p, oa, ELEV), [0, 1, 0], hb, hb, 1, 1); }
        cara(P(p, o1, ELEV - ESP), P(q, o1, ELEV - ESP), P(q, o1, ELEV), P(p, o1, ELEV), [n[0] * lado, 0, n[2] * lado], hb, hb, 0, 2);
        cara(P(q, o0, ELEV - ESP), P(p, o0, ELEV - ESP), P(p, o0, ELEV), P(q, o0, ELEV), [-n[0] * lado, 0, -n[2] * lado], hb, hb, 0, 2);
        if (i % 9 === 4) { const c = P(p, (o0 + o1) / 2, 0); caja(c[0] - 0.45, 0, c[2] - 0.45, c[0] + 0.45, ELEV - ESP, c[2] + 0.45, 3); }
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  const colores = new Float32Array(pos.length);
  geo.setAttribute('color', new THREE.BufferAttribute(colores, 3));
  const ciudad = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }));
  scene.add(ciudad);

  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshBasicMaterial({ color: 0x242936 }));
  suelo.rotation.x = -Math.PI / 2; suelo.position.y = -0.02;
  const grilla = new THREE.GridHelper(900, 180, 0x434a64, 0x434a64);
  grilla.material.transparent = true; grilla.material.opacity = 0.55;
  scene.add(suelo, grilla);
  const halos = [];
  for (const [ancho, op] of [[13, 0.22], [19, 0.12], [26, 0.07]]) for (const arr of muestras) {
    const hp = [];
    for (let i = 0; i < arr.length - 1; i++) {
      const p = arr[i], q = arr[i + 1], t = new THREE.Vector3().subVectors(q, p).normalize(), n = new THREE.Vector3(-t.z, 0, t.x);
      const a = p.clone().addScaledVector(n, -ancho), b = p.clone().addScaledVector(n, ancho), c = q.clone().addScaledVector(n, ancho), d = q.clone().addScaledVector(n, -ancho);
      for (const v of [a, b, c, a, c, d]) hp.push(v.x, 0.03, v.z);
    }
    const hg = new THREE.BufferGeometry(); hg.setAttribute('position', new THREE.Float32BufferAttribute(hp, 3));
    const hm = new THREE.Mesh(hg, new THREE.MeshBasicMaterial({ color: 0xe29699, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide }));
    hm.renderOrder = 1; hm.userData.op = op; halos.push(hm); scene.add(hm);
  }

  /* ----- complejos: volumen celeste, contorno negro y estructura ----- */
  const Y = new THREE.Vector3(0, 1, 0);
  const negro = new THREE.MeshBasicMaterial({ color: 0x0b0d14, side: THREE.BackSide });
  const lineaMat = new THREE.LineBasicMaterial({ color: 0x0b0d14 });
  const grupoComplejos = [];
  for (const c of complejos) {
    const g = new THREE.Group(); g.position.set(...c.pos);
    const mat = new THREE.MeshBasicMaterial({ color: 0xb6dbf8, vertexColors: true, transparent: true, opacity: 1, fog: false });
    const miembros = []; let kg = 0, area = 0;
    for (const b of c.cajas) {
      const bg = new THREE.BoxGeometry(b.w, b.h, b.d); bg.translate(b.x, b.y + b.h / 2, b.z);
      { const n = bg.attributes.normal, col = new Float32Array(n.count * 3);
        for (let i = 0; i < n.count; i++) { const f = n.getY(i) > 0.5 ? 1.0 : n.getZ(i) > 0.5 ? 0.93 : n.getX(i) > 0.5 ? 0.8 : 0.86; col.set([f, f, f], i * 3); }
        bg.setAttribute('color', new THREE.BufferAttribute(col, 3)); }
      const m = new THREE.Mesh(bg, mat); m.userData.complejo = c.id; g.add(m);
      const hull = new THREE.Mesh(new THREE.BoxGeometry(b.w + 0.7, b.h + 0.7, b.d + 0.7), negro);
      hull.position.set(b.x, b.y + b.h / 2, b.z); hull.userData.hull = true; g.add(hull);
      g.add(new THREE.LineSegments(new THREE.EdgesGeometry(bg), lineaMat));
      // estructura: columnas en grilla, vigas por piso, riostras en X en una crujía por fachada
      const nx = Math.max(1, Math.round(b.w / 6)), nz = Math.max(1, Math.round(b.d / 6)), np = Math.max(1, Math.round(b.h / 3.6));
      const x0 = b.x - b.w / 2, z0 = b.z - b.d / 2, sx = b.w / nx, sz = b.d / nz, sy = b.h / np;
      const voladizo = b.y > 0 && b.w > 18; // barra puente: cercha
      for (let i = 0; i <= nx; i++) for (let k = 0; k <= nz; k++) {
        if (!voladizo) miembros.push(['columna', [x0 + i * sx, b.y, z0 + k * sz], [x0 + i * sx, b.y + b.h, z0 + k * sz]]);
      }
      for (let p = 0; p <= np; p++) {
        const y = b.y + p * sy;
        for (let i = 0; i <= nx; i++) miembros.push(['viga', [x0 + i * sx, y, z0], [x0 + i * sx, y, z0 + b.d]]);
        for (let k = 0; k <= nz; k++) miembros.push(['viga', [x0, y, z0 + k * sz], [x0 + b.w, y, z0 + k * sz]]);
        if (p > 0) area += b.w * b.d;
      }
      if (voladizo) { // cercha Warren en ambas fachadas largas
        for (const z of [z0, z0 + b.d]) for (let i = 0; i < nx * 2; i++) {
          const xa = x0 + (i * sx) / 2, xb = x0 + ((i + 1) * sx) / 2;
          miembros.push(['cercha', [xa, i % 2 ? b.y + b.h : b.y, z], [xb, i % 2 ? b.y : b.y + b.h, z]]);
        }
      } else {
        for (let p = 0; p < np; p++) {
          const ya = b.y + p * sy, yb = ya + sy;
          if (p % 2 === 0) continue;
          for (const z of [z0, z0 + b.d]) { miembros.push(['riostra', [x0, ya, z], [x0 + sx, yb, z]]); miembros.push(['riostra', [x0 + sx, ya, z], [x0, yb, z]]); }
          for (const x of [x0, x0 + b.w]) { miembros.push(['riostra', [x, ya, z0], [x, yb, z0 + sz]]); miembros.push(['riostra', [x, ya, z0 + sz], [x, yb, z0]]); }
        }
      }
    }
    const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x121622 }), miembros.length);
    const M = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), cuenta = {};
    miembros.forEach(([tipo, a, b], i) => {
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = d.length();
      q.setFromUnitVectors(Y, d.normalize()); const grosor = tipo === 'columna' ? 0.42 : tipo === 'viga' ? 0.26 : 0.22;
      s.set(grosor, L, grosor); M.compose(A.clone().add(B).multiplyScalar(0.5), q, s); inst.setMatrixAt(i, M);
      kg += L * PERFILES[tipo].kgm; cuenta[tipo] = (cuenta[tipo] || 0) + 1;
    });
    inst.visible = false; g.add(inst);
    scene.add(g);
    c.ton = kg / 1000; c.area = area; c.kgm2 = kg / area; c.pisos = Math.max(...c.cajas.map((b) => Math.round((b.y + b.h) / 3.6))); c.miembros = cuenta;
    c.altura = Math.max(...c.cajas.map((b) => b.y + b.h));
    { const b = c.cajas.reduce((m, k) => (k.y + k.h > m.y + m.h ? k : m)); c.ancla = [c.pos[0] + b.x, b.y + b.h, c.pos[2] + b.z]; }
    grupoComplejos.push({ c, g, mat, inst });
  }
  // viaducto: cuantía indicativa (tablero mixto + pilas)
  const largoVia = vias.reduce((s, c) => s + c.getLength(), 0);

  /* ----- flujo: luces de autos sobre el viaducto ----- */
  const autos = [];
  const autoGeo = new THREE.BoxGeometry(1.4, 0.5, 0.8);
  const autoMat = new THREE.MeshBasicMaterial({ color: 0xffe9b8 });
  const autoMesh = new THREE.InstancedMesh(autoGeo, autoMat, 70);
  for (let i = 0; i < 70; i++) autos.push({ via: i % 5 === 0 ? 1 : 0, u: R(), lado: R() < 0.5 ? -1 : 1, vel: 0.008 + R() * 0.01 });
  scene.add(autoMesh);
  function moverAutos(dt) {
    const M = new THREE.Matrix4(), q = new THREE.Quaternion();
    autos.forEach((a, i) => {
      const c = vias[a.via]; a.u = (a.u + a.vel * dt * (a.lado > 0 ? 1 : -1) * (120 / c.getLength()) + 1) % 1;
      const p = c.getPointAt(a.u), t = c.getTangentAt(a.u); const n = new THREE.Vector3(-t.z, 0, t.x);
      p.addScaledVector(n, a.lado * 4.8); p.y = ELEV + 0.3;
      q.setFromAxisAngle(Y, Math.atan2(-t.z, t.x)); M.compose(p, q, new THREE.Vector3(1, 1, 1)); autoMesh.setMatrixAt(i, M);
    });
    autoMesh.instanceMatrix.needsUpdate = true;
  }
  moverAutos(0);

  /* ----- color por hora ----- */
  let hora = opt.hora;
  function aplicarHora(t) {
    hora = t; const P = paleta(t);
    const tmp = new THREE.Color();
    for (let i = 0, j = 0; i < info.length; i += 4, j += 3) {
      const h = info[i], k = info[i + 1], tipo = info[i + 2], g = info[i + 3];
      if (tipo === 1) tmp.copy(P.road); else if (tipo === 2) tmp.copy(P.roadSide); else if (tipo === 3) tmp.copy(P.pillar);
      else if (k === 0) tmp.copy(P.topB).lerp(P.topA, h);
      else {
        const A = k === 2 ? P.shdA : k === 1 ? P.litA : P.shdA, B = k === 2 ? P.shdB : k === 1 ? P.litB : P.shdB;
        const u = Math.pow(1 - h, 1.6);                       // degradado vertical: arriba frío, abajo malva
        tmp.copy(A).lerp(B, u * 0.85);
        tmp.lerp(P.pink, g * Math.pow(1 - h, 2.2) * 0.6);    // reflejo rosado del viaducto en las bases
        if (h < 0.06) tmp.multiplyScalar(0.78 + h * 3.6);     // oclusión al pie del edificio
      }
      colores[j] = tmp.r; colores[j + 1] = tmp.g; colores[j + 2] = tmp.b;
    }
    geo.attributes.color.needsUpdate = true;
    scene.background = P.bg; scene.fog.color.copy(P.fog); suelo.material.color.copy(P.ground); grilla.material.color.copy(P.grid);
    autoMat.color.copy(P.car); halos.forEach((m) => { m.material.color.copy(P.road); m.material.opacity = m.userData.op * (0.35 + 0.65 * t); }); autoMesh.visible = t > 0.45;
    hemi.intensity = 1.25 + (1 - t) * 0.5; sol.intensity = 1.1 + (1 - t) * 0.6;
    for (const k of grupoComplejos) { k.mat.color.copy(P.cel); k.inst.material.color.copy(P.frame); }
    pedir();
  }

  /* ----- estructura visible ----- */
  let verAcero = false;
  function mostrarAcero(si) {
    verAcero = si;
    for (const k of grupoComplejos) {
      k.inst.visible = si; k.mat.opacity = si ? 0.22 : 1; k.mat.depthWrite = !si;
      k.g.children.forEach((o) => { if (o.userData.hull) o.visible = !si; });
    }
    pedir();
  }

  /* ----- cámara ----- */
  function encuadrar() {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1; const asp = w / h;
    const vh = asp < 1 ? vista * 1.25 : vista / Math.max(1, asp / 1.6);
    camera.left = -vh * asp / 2; camera.right = vh * asp / 2; camera.top = vh / 2; camera.bottom = -vh / 2;
    const a = THREE.MathUtils.degToRad(az), e = THREE.MathUtils.degToRad(el);
    camera.position.set(target.x + Math.cos(e) * Math.sin(a) * 400, target.y + Math.sin(e) * 400, target.z + Math.cos(e) * Math.cos(a) * 400);
    camera.lookAt(target); camera.updateProjectionMatrix();
  }
  function redimensionar() {
    const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); encuadrar(); pedir();
  }
  new ResizeObserver(redimensionar).observe(canvas);

  /* ----- anotaciones ----- */
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg'); svg.setAttribute('class', 'iso-lineas'); overlay.appendChild(svg);
  svg.innerHTML = '<defs><marker id="flecha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L8 5 L1 9" fill="none" stroke="currentColor" stroke-width="1.4"/></marker></defs>';
  let notas = [];
  function anotar(lista) {
    for (const n of notas) { n.el?.remove(); n.path?.remove(); n.dot?.remove(); }
    notas = lista.map((n) => {
      const o = { ...n };
      o.el = document.createElement('div'); o.el.className = 'iso-nota iso-' + (n.tipo || 'callout'); o.el.innerHTML = n.html; overlay.appendChild(o.el);
      if (n.tipo !== 'zona') {
        o.path = document.createElementNS(svgNS, 'path'); o.path.setAttribute('class', 'iso-guia'); o.path.setAttribute('marker-end', 'url(#flecha)'); svg.appendChild(o.path);
        o.dot = document.createElementNS(svgNS, 'circle'); o.dot.setAttribute('r', '3.2'); o.dot.setAttribute('class', 'iso-punto'); svg.appendChild(o.dot);
      }
      if (n.complejo) o.el.addEventListener('click', () => elegir(n.complejo));
      return o;
    });
    pedir();
  }
  function aPantalla(p) {
    const v3 = new THREE.Vector3(...p).project(camera);
    return [(v3.x + 1) / 2 * canvas.clientWidth, (1 - v3.y) / 2 * canvas.clientHeight];
  }
  function actualizarNotas() {
    for (const n of notas) {
      let at = n.at;
      if (n.via != null) { const c = vias[n.via]; const p = c.getPointAt(n.u); at = [p.x, ELEV, p.z]; }
      const [x, y] = aPantalla(at);
      if (n.tipo === 'zona') {
        const c = vias[n.via]; const p = c.getPointAt(n.u), q = c.getPointAt(Math.min(1, n.u + 0.01));
        const [x2, y2] = aPantalla([q.x, ELEV, q.z]); let ang = Math.atan2(y2 - y, x2 - x) * 180 / Math.PI;
        if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
        const off = n.off || 18; const nx = -Math.sin(ang * Math.PI / 180) * off, ny = Math.cos(ang * Math.PI / 180) * off;
        o_set(n.el, x + nx, y - ny, `translate(-50%,-50%) rotate(${ang}deg)`); continue;
      }
      const dx = n.dx ?? 60, dy = n.dy ?? -50;
      const ex = x + dx, ey = y + dy;
      const d = n.recto ? `M${x} ${y} L${ex} ${y}` : `M${x} ${y} L${x} ${ey} L${ex - Math.sign(dx) * 4} ${ey}`;
      n.path.setAttribute('d', d); n.dot.setAttribute('cx', x); n.dot.setAttribute('cy', y);
      const ty = n.recto ? y : ey;
      o_set(n.el, ex + Math.sign(dx) * 6, ty, dx >= 0 ? 'translate(0,-50%)' : 'translate(-100%,-50%)');
      n.el.classList.toggle('activa', n.complejo && n.complejo === elegido);
    }
  }
  function o_set(el, x, y, tr) { el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.transform = tr; }

  /* ----- selección ----- */
  let elegido = null; const oyentes = [];
  function elegir(id) {
    elegido = id;
    for (const k of grupoComplejos) k.mat.color.copy(paleta(hora).cel).multiplyScalar(!id || k.c.id === id ? 1 : 0.7);
    oyentes.forEach((f) => f(id ? complejos.find((c) => c.id === id) : null)); pedir();
  }
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let arrastre = null;
  canvas.addEventListener('pointerdown', (e) => { arrastre = { x: e.clientX, y: e.clientY, az, el, movio: false }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => {
    if (arrastre) {
      const dx = e.clientX - arrastre.x, dy = e.clientY - arrastre.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) arrastre.movio = true;
      if (arrastre.movio && opt.orbitar !== false) { az = arrastre.az - dx * 0.25; el = THREE.MathUtils.clamp(arrastre.el + dy * 0.15, 18, 70); encuadrar(); pedir(); }
      return;
    }
    const r = canvas.getBoundingClientRect(); ptr.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(ptr, camera); const hit = ray.intersectObjects(grupoComplejos.map((k) => k.g), true).find((h) => h.object.userData.complejo);
    canvas.style.cursor = hit ? 'pointer' : 'grab';
  });
  canvas.addEventListener('pointerup', (e) => {
    const a = arrastre; arrastre = null; if (!a || a.movio) return;
    const r = canvas.getBoundingClientRect(); ptr.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(ptr, camera); const hit = ray.intersectObjects(grupoComplejos.map((k) => k.g), true).find((h) => h.object.userData.complejo);
    if (opt.seleccionar !== false) elegir(hit ? hit.object.userData.complejo : null);
  });
  canvas.addEventListener('wheel', (e) => { if (opt.zoom === false) return; e.preventDefault(); vista = THREE.MathUtils.clamp(vista * (1 + e.deltaY * 0.001), 60, 260); encuadrar(); pedir(); }, { passive: false });

  /* ----- bucle ----- */
  let sucio = true, t0 = performance.now(), vivo = true;
  function pedir() { sucio = true; }
  const quieto = new URLSearchParams(location.search).has('quieto');
  function cuadro(now) {
    if (!vivo) return;
    const dt = Math.min(50, now - t0) / 16.7; t0 = now;
    if (!quieto) {
      if (opt.deriva && !arrastre) { az += 0.006 * dt * Math.sin(now / 9000); encuadrar(); sucio = true; }
      if (autoMesh.visible) { moverAutos(dt); sucio = true; }
    }
    if (sucio) { renderer.render(scene, camera); actualizarNotas(); sucio = false; }
    requestAnimationFrame(cuadro);
  }
  aplicarHora(hora); redimensionar(); requestAnimationFrame(cuadro);

  return {
    complejos, largoVia, v, aplicarHora, mostrarAcero, anotar, elegir,
    alElegir: (f) => oyentes.push(f),
    get acero() { return verAcero; },
    enfocar(p, v) { target.set(...p); if (v) vista = v; encuadrar(); pedir(); },
    render() { renderer.render(scene, camera); actualizarNotas(); },
  };
}

export function fmt(n, d = 0) { return n.toLocaleString('es-CO', { maximumFractionDigits: d, minimumFractionDigits: d }); }
