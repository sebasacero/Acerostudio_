// AceroStudio · Ornamentación · planta de producción: celda rotativa AS-RT-08 (Three.js 0.169, sin build).
// Una mesa rotativa con 8 puestos lleva cada pieza por carga, corte láser, doblez, armado del marco,
// soldadura robot, esmerilado, pintura electrostática e inspección con descarga. Cada pieza puede ser
// distinta (lote de uno): el diseño y el acabado elegidos entran con la siguiente lámina que se carga.
// Unidades en metros. Centro de la celda en el origen; el puesto 0 (carga) mira a +z, hacia la puerta.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const PUESTOS = [
  { id: 'carga', nombre: 'Carga de lámina', maquina: 'Robot con ventosas', texto: 'El robot toma una lámina calibre 14 del carro y la centra en el palé. Si cambiaste el diseño o el acabado, esta es la primera pieza que lo lleva.' },
  { id: 'laser', nombre: 'Corte láser', maquina: 'Pórtico láser de fibra 3 kW', texto: 'El cabezal recorre la lámina fila por fila y corta la celosía. Mide su foco en cada pasada y compensa si la lámina viene ondulada.' },
  { id: 'doblez', nombre: 'Doblez', maquina: 'Prensa plegadora 40 t', texto: 'La prensa baja y dobla las pestañas a 90° para darle rigidez al panel y apoyo al marco.' },
  { id: 'armado', nombre: 'Armado del marco', maquina: 'Pórtico de ensamble', texto: 'Cuatro tubos 30 × 30 cortados a medida llegan del estante y se ubican alrededor del panel con sus topes.' },
  { id: 'soldadura', nombre: 'Soldadura', maquina: 'Robot MIG de 6 ejes', texto: 'Ocho cordones: dos por esquina. El robot sigue la junta con el arco y registra corriente y velocidad de cada cordón.' },
  { id: 'esmerilado', nombre: 'Esmerilado', maquina: 'Robot con disco flap', texto: 'Rebaja los cordones al ras para que la pintura cubra parejo y no queden filos.' },
  { id: 'pintura', nombre: 'Pintura electrostática', maquina: 'Cabina de polvo', texto: 'La pistola carga el polvo y lo atrae al acero. El acabado cambia pieza a pieza sin limpiar la línea.' },
  { id: 'inspeccion', nombre: 'Inspección y descarga', maquina: 'Escáner 3D + robot', texto: 'Un barrido láser compara la pieza con el modelo. Si está dentro de ±1 mm, el robot la pone en el estante de producto terminado.' },
];
export const DISENOS = { celosia: 'Celosía', rombos: 'Rombos', listones: 'Listones' };
export const ACABADOS = {
  grafito: { nombre: 'Grafito', color: 0x3a3f4b, met: .55, rug: .38 },
  negro: { nombre: 'Negro satinado', color: 0x141519, met: .2, rug: .5 },
  coral: { nombre: 'Coral', color: 0xe0705f, met: .15, rug: .42 },
  blanco: { nombre: 'Blanco', color: 0xe9e8e3, met: .1, rug: .4 },
};

const N = PUESTOS.length, PASO = Math.PI * 2 / N;
const R_PALE = 1.42, R_MAQ = 2.55, R_CERCA = 3.55, MESA = .86, PANEL = .6, T_TUBO = .03;
const pos = (ang, r, y = 0) => new THREE.Vector3(Math.sin(ang) * r, y, Math.cos(ang) * r);
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const lerpV = (a, b, t) => new THREE.Vector3(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));
function azar(s) { let a = s >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// Relieve fino (cepillado del acero, piel de la pintura) como mapa de normales.
function texNormal(tipo, rep) {
  const n = 128, c = document.createElement('canvas'); c.width = c.height = n;
  const g = c.getContext('2d'), img = g.createImageData(n, n), r = azar(tipo === 'cepillo' ? 5 : 9);
  const h = new Float32Array(n * n);
  for (let y = 0; y < n; y++) { let v = r(); for (let x = 0; x < n; x++) { v = tipo === 'cepillo' ? v * .92 + r() * .08 : r(); h[y * n + x] = v; } }
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const i = y * n + x, dx = h[y * n + (x + 1) % n] - h[i], dy = h[((y + 1) % n) * n + x] - h[i], k = i * 4;
    img.data[k] = 128 + dx * 90; img.data[k + 1] = 128 + dy * 90; img.data[k + 2] = 255; img.data[k + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); return t;
}

// Lámina del panel con sus perforaciones; `nivel` (0..4) deja ver el corte avanzando fila por fila.
function huecos(diseno) {
  const out = [], m = .07, L = PANEL - 2 * m;
  if (diseno === 'rombos') {
    const n = 6;
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const x = -L / 2 + (i + .5) * L / n, y = -L / 2 + (j + .5) * L / n, a = .03 + .012 * Math.sin(i + j); const s = new THREE.Path(); s.moveTo(x, y - a); s.lineTo(x + a, y); s.lineTo(x, y + a); s.lineTo(x - a, y); s.closePath(); out.push({ fila: j, s }); }
  } else if (diseno === 'listones') {
    const n = 7, w = .022;
    for (let i = 0; i < n; i++) { const x = -L / 2 + (i + .5) * L / n, h = L * (.55 + .4 * Math.abs(Math.sin(i * 1.3))); for (let j = 0; j < 2; j++) { const y0 = j ? 0.01 : -h / 2, y1 = j ? h / 2 : -.01; const s = new THREE.Path(); s.absarc(x, y1 - w / 2, w / 2, 0, Math.PI, false); s.lineTo(x - w / 2, y0 + w / 2); s.absarc(x, y0 + w / 2, w / 2, Math.PI, Math.PI * 2, false); s.closePath(); out.push({ fila: j * 3 + (i % 3), s }); } }
  } else {
    const n = 7;
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const x = -L / 2 + (i + .5) * L / n, y = -L / 2 + (j + .5) * L / n, d = Math.hypot(x, y); const rr = .008 + .022 * (.5 + .5 * Math.cos(d * 14)); const s = new THREE.Path(); s.absarc(x, y, rr, 0, Math.PI * 2, true); out.push({ fila: j, s }); }
  }
  return out;
}
const GEO_LAMINA = new Map();
function geoLamina(diseno, nivel) {
  const k = diseno + nivel;
  if (GEO_LAMINA.has(k)) return GEO_LAMINA.get(k);
  const h = huecos(diseno), filas = Math.max(...h.map((o) => o.fila)) + 1, hasta = Math.round(filas * nivel / 4);
  const f = new THREE.Shape(), a = PANEL / 2 - .02;
  f.moveTo(-a, -a); f.lineTo(a, -a); f.lineTo(a, a); f.lineTo(-a, a); f.closePath();
  f.holes = h.filter((o) => o.fila < hasta).map((o) => o.s);
  const g = new THREE.ExtrudeGeometry(f, { depth: .0019, bevelEnabled: false, curveSegments: 10 });
  g.rotateX(-Math.PI / 2); g.computeVertexNormals();
  GEO_LAMINA.set(k, g);
  return g;
}

/* ---------------------------------------------------------------------------------------------- */
export function crearCelda(canvas, opt = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: !!opt.captura });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.setScissorTest(true);
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; pm.dispose();
  const cam = new THREE.PerspectiveCamera(32, 1, .05, 120), camSigue = new THREE.PerspectiveCamera(38, 1, .02, 60);
  cam.position.set(5.6, 4.9, 6.7);
  const controls = new OrbitControls(cam, canvas);
  Object.assign(controls, { enableDamping: true, dampingFactor: .08, maxPolarAngle: Math.PI * .47, minDistance: 1.4, maxDistance: 18, enablePan: false, autoRotate: true, autoRotateSpeed: .35 });
  controls.target.set(0, .9, 0);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x8890a0, .9), sol = new THREE.DirectionalLight(0xffffff, 1.6);
  sol.position.set(4, 9, 5); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); sol.shadow.bias = -.0004; sol.shadow.normalBias = .02;
  Object.assign(sol.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 25 });
  const arco = new THREE.PointLight(0x9fd0ff, 0, 3, 1.6);
  scene.add(hemi, sol, arco);

  /* materiales: entorno plano, metal realista */
  const nCep = texNormal('cepillo', 6), nPiel = texNormal('piel', 10);
  const mPiso = new THREE.MeshStandardMaterial({ color: 0xe6e7eb, roughness: 1 });
  const mAcero = new THREE.MeshStandardMaterial({ color: 0xc4c9d1, metalness: 1, roughness: .32, envMapIntensity: 1.6, normalMap: nCep, normalScale: new THREE.Vector2(.4, .4) });
  const mInox = new THREE.MeshStandardMaterial({ color: 0xdfe3e8, metalness: 1, roughness: .2, envMapIntensity: 1.8, normalMap: nCep, normalScale: new THREE.Vector2(.25, .25) });
  const mMaquina = new THREE.MeshPhysicalMaterial({ color: 0xf1f1ee, metalness: .1, roughness: .42, clearcoat: .5, clearcoatRoughness: .3, normalMap: nPiel, normalScale: new THREE.Vector2(.08, .08) });
  const mRobot = new THREE.MeshPhysicalMaterial({ color: 0xe57a68, metalness: .15, roughness: .38, clearcoat: .8, clearcoatRoughness: .18, normalMap: nPiel, normalScale: new THREE.Vector2(.06, .06) });
  const mOscuro = new THREE.MeshPhysicalMaterial({ color: 0x1c1f27, metalness: .35, roughness: .45, clearcoat: .4 });
  const mCerca = new THREE.MeshPhysicalMaterial({ color: 0x15171c, metalness: .4, roughness: .5, clearcoat: .5, normalMap: nPiel, normalScale: new THREE.Vector2(.1, .1) });
  const mAmarillo = new THREE.MeshStandardMaterial({ color: 0xf2c230, roughness: .6 });
  const mVidrio = new THREE.MeshPhysicalMaterial({ color: 0xcfe4f2, metalness: 0, roughness: .05, transparent: true, opacity: .16, depthWrite: false });
  const mHaz = new THREE.MeshBasicMaterial({ color: 0x9fd0ff, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false });
  const mEscaner = new THREE.MeshBasicMaterial({ color: 0x5cf09a, transparent: true, opacity: .35, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const emis = (c) => new THREE.MeshStandardMaterial({ color: 0x222222, emissive: c, emissiveIntensity: 0, roughness: .5 });
  const luzVerde = emis(0x3ee07a), luzAmbar = emis(0xffb21c), luzRoja = emis(0xff3b30);

  const UNIT = new THREE.BoxGeometry(1, 1, 1), RB = new Map();
  const rbox = (sx, sy, sz, r) => { const k = [sx, sy, sz, r].join(); if (!RB.has(k)) RB.set(k, new RoundedBoxGeometry(sx, sy, sz, 3, r ?? Math.min(sx, sy, sz) * .18)); return RB.get(k); };
  const malla = (g, m, x, y, z, padre) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; (padre || scene).add(o); return o; };
  const caja = (padre, m, sx, sy, sz, x, y, z, r) => malla(r === 0 ? UNIT : rbox(sx, sy, sz, r), m, x, y, z, padre).scale.set(r === 0 ? sx : 1, r === 0 ? sy : 1, r === 0 ? sz : 1) && padre.children[padre.children.length - 1];
  const cil = (padre, m, r, h, x, y, z, seg = 24) => malla(new THREE.CylinderGeometry(r, r, h, seg), m, x, y, z, padre);

  /* ---------- piso, líneas de seguridad y cerca ---------- */
  const piso = new THREE.Mesh(new THREE.CircleGeometry(30, 64), mPiso); piso.rotation.x = -Math.PI / 2; piso.receiveShadow = true; scene.add(piso);
  const anillo = (r, w, m, y = .002) => { for (let k = 0; k < 8; k++) { const a0 = (k + .5) * PASO, a1 = (k + 1.5) * PASO, p0 = pos(a0, r), p1 = pos(a1, r), L = p0.distanceTo(p1); const o = new THREE.Mesh(UNIT, m); o.scale.set(L + w, .004, w); o.position.copy(p0.clone().add(p1).multiplyScalar(.5)).setY(y); o.rotation.y = Math.atan2(p1.x - p0.x, p1.z - p0.z) + Math.PI / 2; o.receiveShadow = true; scene.add(o); } };
  anillo(R_CERCA + .35, .08, mAmarillo);

  // Malla de la cerca: textura de alambre soldado con transparencia.
  const tMalla = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); g.strokeStyle = '#fff'; g.lineWidth = 3; g.strokeRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; })();
  const letrero = (txt, sub) => { const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#f2c230'; g.fillRect(0, 0, 512, 256); g.fillStyle = '#111'; for (let i = -4; i < 20; i++) { g.beginPath(); g.moveTo(i * 40, 0); g.lineTo(i * 40 + 20, 0); g.lineTo(i * 40 - 30, 50); g.lineTo(i * 40 - 50, 50); g.fill(); } g.fillRect(0, 206, 512, 50); g.font = '700 54px Antonio, Arial Narrow, sans-serif'; g.textAlign = 'center'; g.fillText(txt, 256, 128); g.font = '500 26px DM Mono, monospace'; g.fillText(sub, 256, 176); g.fillStyle = '#f2c230'; g.font = '500 24px DM Mono, monospace'; g.fillText('ACEROSTUDIO · AS-RT-08', 256, 240); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const cerca = new THREE.Group(); scene.add(cerca);
  const mMalla = new THREE.MeshStandardMaterial({ color: 0x15171c, metalness: .5, roughness: .5, alphaMap: tMalla, transparent: true, alphaTest: .4, side: THREE.DoubleSide });
  const HC = 2.05;
  for (let k = 0; k < 8; k++) {
    const a0 = (k + .5) * PASO, a1 = (k + 1.5) * PASO, p0 = pos(a0, R_CERCA), p1 = pos(a1, R_CERCA), L = p0.distanceTo(p1), mid = p0.clone().add(p1).multiplyScalar(.5), rot = Math.atan2(p1.x - p0.x, p1.z - p0.z) - Math.PI / 2;
    caja(cerca, mCerca, .06, HC, .06, p0.x, HC / 2, p0.z);
    caja(cerca, mAmarillo, .14, .02, .14, p0.x, .01, p0.z, 0);
    const puerta = k === 7; // panel frente a +z: puerta corrediza entreabierta
    const g = new THREE.Group(); g.position.copy(mid); g.rotation.y = rot; cerca.add(g);
    const w = L - .1;
    if (!puerta) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, HC - .25), mMalla.clone()); m.material.alphaMap = tMalla.clone(); m.material.alphaMap.repeat.set(w / .05, (HC - .25) / .05); m.material.alphaMap.needsUpdate = true; m.position.y = .15 + (HC - .25) / 2; g.add(m);
      for (const y of [.12, HC - .06, 1.1]) caja(g, mCerca, w, .035, .035, 0, y, 0, .006);
      if (k % 2 === 0) { const s = new THREE.Mesh(new THREE.PlaneGeometry(.5, .25), new THREE.MeshStandardMaterial({ map: letrero(k === 2 ? 'PELIGRO' : k === 4 ? 'ATENCIÓN' : 'CELDA ROBOTIZADA', k === 2 ? 'ROBOTS EN MOVIMIENTO' : k === 4 ? 'USE GAFAS · LÁSER CLASE 4' : 'SOLO PERSONAL AUTORIZADO'), roughness: .6 })); s.position.set(0, 1.45, .03); g.add(s); const s2 = s.clone(); s2.rotation.y = Math.PI; s2.position.z = -.03; g.add(s2); }
    } else {
      for (const y of [.12, HC - .06]) caja(g, mCerca, w, .035, .035, 0, y, 0, .006);
      const hoja = new THREE.Group(); hoja.position.set(w * .38, 0, .08); g.add(hoja);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w * .55, HC - .3), mMalla.clone()); m.material.alphaMap = tMalla.clone(); m.material.alphaMap.repeat.set(w * .55 / .05, (HC - .3) / .05); m.material.alphaMap.needsUpdate = true; m.position.y = .15 + (HC - .3) / 2; hoja.add(m);
      for (const x of [-w * .275, w * .275]) caja(hoja, mCerca, .035, HC - .2, .035, x, (HC - .2) / 2 + .05, 0, .006);
      for (const y of [.13, HC - .16]) caja(hoja, mCerca, w * .55, .035, .035, 0, y, 0, .006);
      caja(hoja, mAmarillo, .04, .12, .03, -w * .23, 1.05, .03, .006);
      // torre de luces de estado junto a la puerta
      const t = new THREE.Group(); t.position.set(-w / 2 + .05, HC, 0); g.add(t);
      cil(t, mOscuro, .012, .2, 0, .1, 0);
      [luzRoja, luzAmbar, luzVerde].forEach((m, i) => cil(t, m, .035, .07, 0, .24 + (2 - i) * .075, 0));
      cil(t, mOscuro, .036, .02, 0, .43, 0);
    }
  }

  /* ---------- mesa rotativa y columna central ---------- */
  const mesa = new THREE.Group(); scene.add(mesa);
  cil(scene, mMaquina, .95, MESA - .08, 0, (MESA - .08) / 2, 0, 48);
  caja(scene, mOscuro, 1.0, .06, 1.0, 0, .03, 0, .02);
  const tapa = cil(mesa, mAcero, 1.95, .07, 0, MESA - .035, 0, 96);
  tapa.material = mInox;
  const borde = new THREE.Mesh(new THREE.TorusGeometry(1.95, .012, 8, 96), mOscuro); borde.rotation.x = Math.PI / 2; borde.position.y = MESA - .07; mesa.add(borde);
  const col = new THREE.Group(); scene.add(col);
  cil(col, mMaquina, .34, 1.1, 0, MESA + .55, 0, 8).rotation.y = Math.PI / 8;
  cil(col, mOscuro, .37, .06, 0, MESA + 1.12, 0, 8).rotation.y = Math.PI / 8;
  cil(col, mAcero, .2, .25, 0, MESA + 1.27, 0, 32);
  const placaLogo = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 96; const g = c.getContext('2d'); g.fillStyle = '#1c1f27'; g.fillRect(0, 0, 256, 96); g.fillStyle = '#f1f1ee'; g.font = '700 46px Antonio, Arial Narrow, sans-serif'; g.textAlign = 'center'; g.fillText('ACERO', 128, 52); g.font = '500 16px DM Mono, monospace'; g.fillStyle = '#e57a68'; g.fillText('AS-RT-08', 128, 80); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  for (let k = 0; k < 8; k += 2) { const p = new THREE.Mesh(new THREE.PlaneGeometry(.26, .1), new THREE.MeshStandardMaterial({ map: placaLogo, roughness: .5 })); const a = (k + .5) * PASO; p.position.copy(pos(a, .345, MESA + .75)); p.rotation.y = a; col.add(p); }

  // Palés con su pieza.
  const pales = [];
  for (let i = 0; i < N; i++) {
    const g = new THREE.Group(); const a = i * PASO; g.position.copy(pos(a, R_PALE, MESA)); g.rotation.y = a; mesa.add(g);
    caja(g, mOscuro, .78, .04, .78, 0, .02, 0, .01);
    for (const [x, z] of [[-.34, -.34], [.34, -.34], [-.34, .34], [.34, .34]]) { cil(g, mAcero, .016, .05, x, .065, z, 12); caja(g, mRobot, .06, .025, .03, x * .92, .055, z * 1.08, .006); }
    const num = (() => { const c = document.createElement('canvas'); c.width = 64; c.height = 64; const x = c.getContext('2d'); x.fillStyle = '#f2c230'; x.fillRect(0, 0, 64, 64); x.fillStyle = '#111'; x.font = '700 40px DM Mono, monospace'; x.textAlign = 'center'; x.fillText(String(i + 1), 32, 46); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    const et = new THREE.Mesh(new THREE.PlaneGeometry(.07, .07), new THREE.MeshStandardMaterial({ map: num })); et.rotation.x = -Math.PI / 2; et.position.set(0, .041, .36); g.add(et);
    const pz = crearPieza(); pz.g.position.y = .045; g.add(pz.g);
    pales.push({ g, pz, id: 0, diseno: 'celosia', acabado: 'grafito', hecha: false });
  }

  /* ---------- la pieza: lámina perforada, pestañas, marco, cordones y pintura ---------- */
  function crearPieza() {
    const g = new THREE.Group();
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xc4c9d1, metalness: 1, roughness: .34, envMapIntensity: 1.6, normalMap: nCep, normalScale: new THREE.Vector2(.35, .35), clearcoat: 0, clearcoatRoughness: .25 });
    const matCord = new THREE.MeshPhysicalMaterial({ color: 0x8a7a68, metalness: .9, roughness: .5, envMapIntensity: 1.2 });
    const lam = new THREE.Mesh(geoLamina('celosia', 4), mat); lam.castShadow = lam.receiveShadow = true; lam.position.y = .0; g.add(lam);
    const pest = [-1, 1].map((s) => { const h = new THREE.Group(); h.position.set(s * (PANEL / 2 - .02), .0019, 0); g.add(h); const o = new THREE.Mesh(UNIT, mat); o.scale.set(.03, .0019, PANEL - .06); o.position.x = s * .015; o.castShadow = true; h.add(o); h.userData.s = s; return h; });
    const L = PANEL + T_TUBO * 2, tubos = [];
    for (let j = 0; j < 4; j++) {
      const lado = j % 2 === 0, o = new THREE.Mesh(rbox(lado ? L : T_TUBO, T_TUBO, lado ? T_TUBO : PANEL, .004), mat);
      o.position.set(lado ? 0 : (j === 1 ? 1 : -1) * (PANEL / 2 + T_TUBO / 2), T_TUBO / 2, lado ? (j === 0 ? -1 : 1) * (PANEL / 2 + T_TUBO / 2) : 0);
      o.castShadow = o.receiveShadow = true; o.userData.base = o.position.clone(); g.add(o); tubos.push(o);
    }
    const cord = [], GC = new THREE.CapsuleGeometry(.0045, .022, 4, 8);
    const esq = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    for (const [sx, sz] of esq) for (const eje of ['x', 'z']) {
      const o = new THREE.Mesh(GC, matCord); const x = sx * (PANEL / 2 + T_TUBO / 2), z = sz * (PANEL / 2 + T_TUBO / 2);
      if (eje === 'x') { o.rotation.z = Math.PI / 2; o.position.set(x - sx * .02, T_TUBO + .002, sz * (PANEL / 2 + T_TUBO)); } else { o.rotation.x = Math.PI / 2; o.position.set(sx * (PANEL / 2 + T_TUBO), T_TUBO + .002, z - sz * .02); }
      o.castShadow = true; g.add(o); cord.push(o);
    }
    return { g, mat, matCord, lam, pest, tubos, cord };
  }
  const C_CRUDO = new THREE.Color(0xc4c9d1), C_CORD = new THREE.Color(0x8a7a68), C_TMP = new THREE.Color();
  // estado de la pieza según el puesto en que está (k) y el avance del puesto (p); k = 8 = descargada
  function pintarPieza(pl, k, p) {
    const { pz } = pl, A = ACABADOS[pl.acabado];
    const vis = k > 0 || p > .8;
    pz.g.visible = vis && !(k === 7 && p > .62);
    if (!pz.g.visible) return;
    pz.lam.position.y = k === 0 ? (1 - sstep(.8, .88, p)) * .25 : 0;
    const nivel = k < 1 ? 0 : k > 1 ? 4 : Math.min(4, Math.floor(sstep(.08, .92, p) * 4.999));
    const geo = geoLamina(pl.diseno, nivel); if (pz.lam.geometry !== geo) pz.lam.geometry = geo;
    const dob = k < 2 ? 0 : k > 2 ? 1 : sstep(.3, .52, p);
    pz.pest.forEach((h) => { h.visible = true; h.rotation.z = h.userData.s * dob * Math.PI / 2; });
    pz.tubos.forEach((o, j) => { const a = k < 3 ? 0 : k > 3 ? 1 : sstep(.1 + j * .2, .22 + j * .2, p); o.visible = a > 0; o.position.copy(o.userData.base); o.position.y += (1 - a) * .25; });
    pz.cord.forEach((o, j) => { const a = k < 4 ? 0 : k > 4 ? 1 : sstep(.08 + j * .105, .16 + j * .105, p); o.visible = a > 0; const g2 = k < 5 ? 1 : k > 5 ? .35 : lerp(1, .35, sstep(.1 + (j / 8) * .8, .2 + (j / 8) * .8, p)); o.scale.set(1, Math.max(.01, a), g2); });
    const pin = k < 6 ? 0 : k > 6 ? 1 : sstep(.15, .85, p);
    pz.mat.color.copy(C_CRUDO).lerp(C_TMP.setHex(A.color), pin); pz.mat.metalness = lerp(1, A.met, pin); pz.mat.roughness = lerp(.34, A.rug, pin); pz.mat.clearcoat = pin * .6; pz.mat.normalScale.setScalar(lerp(.35, .05, pin));
    pz.matCord.color.copy(C_CORD).lerp(C_TMP.setHex(A.color), pin); pz.matCord.metalness = lerp(.9, A.met, pin);
  }

  /* ---------- robots de 6 ejes con cinemática inversa de dos eslabones ---------- */
  const L1 = .72, L2 = .62, HOMBRO = .78;
  function robot(padre, herramienta) {
    const g = new THREE.Group(); padre.add(g);
    caja(g, mOscuro, .46, .32, .46, 0, .16, 0, .03);
    const giro = new THREE.Group(); giro.position.y = .32; g.add(giro);
    cil(giro, mRobot, .2, .16, 0, .08, 0, 32); caja(giro, mRobot, .26, .34, .3, 0, .3, 0, .05);
    const hombro = new THREE.Group(); hombro.position.y = HOMBRO - .32; giro.add(hombro);
    cil(hombro, mOscuro, .1, .32, 0, 0, 0, 24).rotation.z = Math.PI / 2;
    caja(hombro, mRobot, .16, L1, .18, 0, L1 / 2, 0, .05);
    const codo = new THREE.Group(); codo.position.y = L1; hombro.add(codo);
    cil(codo, mOscuro, .085, .26, 0, 0, 0, 24).rotation.z = Math.PI / 2;
    caja(codo, mRobot, .13, L2, .13, 0, L2 / 2, 0, .04);
    cil(codo, mRobot, .07, .1, 0, L2 * .15, -.07, 16).rotation.x = Math.PI / 2;
    const muneca = new THREE.Group(); muneca.position.y = L2; codo.add(muneca);
    cil(muneca, mOscuro, .055, .16, 0, 0, 0, 20).rotation.z = Math.PI / 2;
    const punta = new THREE.Object3D(); muneca.add(punta);
    let largo = .12, extra = {};
    if (herramienta === 'antorcha') { cil(muneca, mOscuro, .028, .12, 0, .06, 0, 16); cil(muneca, mInox, .016, .1, 0, .16, 0, 16); cil(muneca, mAcero, .006, .02, 0, .22, 0, 8); largo = .23; }
    else if (herramienta === 'disco') { caja(muneca, mOscuro, .08, .12, .08, 0, .06, 0, .015); const d = cil(muneca, mInox, .06, .01, 0, .13, 0, 32); extra.disco = d; largo = .14; }
    else { caja(muneca, mOscuro, .07, .08, .07, 0, .04, 0, .015); caja(muneca, mInox, .3, .012, .2, 0, .09, 0, .004); for (const x of [-.1, .1]) for (const z of [-.06, .06]) cil(muneca, mOscuro, .018, .02, x, .1, z, 12); largo = .11; }
    punta.position.y = largo;
    // Pone la punta en `t` (coordenadas del puesto) apuntando hacia abajo.
    const resolver = (t) => {
      giro.rotation.y = Math.atan2(-t.x, -t.z) + Math.PI;
      const r = Math.hypot(t.x, t.z), h = t.y + largo - HOMBRO;
      let D = Math.hypot(r, h); D = Math.min(D, L1 + L2 - .005); const fi = Math.atan2(r, h);
      const b = Math.acos(Math.min(1, Math.max(-1, (L1 * L1 + D * D - L2 * L2) / (2 * L1 * D))));
      const gm = Math.acos(Math.min(1, Math.max(-1, (L1 * L1 + L2 * L2 - D * D) / (2 * L1 * L2))));
      const s = fi - b, e = Math.PI - gm;
      hombro.rotation.x = s; codo.rotation.x = e; muneca.rotation.x = Math.PI - s - e;
    };
    return { g, punta, resolver, extra };
  }

  /* ---------- chispas, polvo de pintura y destellos ---------- */
  const MAXP = 900, pPos = new Float32Array(MAXP * 3), pCol = new Float32Array(MAXP * 3), pVel = new Float32Array(MAXP * 3), pVida = new Float32Array(MAXP), pGrav = new Float32Array(MAXP);
  const gP = new THREE.BufferGeometry(); gP.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); gP.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  const puntos = new THREE.Points(gP, new THREE.PointsMaterial({ size: .018, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); puntos.frustumCulled = false; scene.add(puntos);
  const gPolvo = new THREE.BufferGeometry(); const polvoPos = new Float32Array(400 * 3), polvoVel = new Float32Array(400 * 3), polvoVida = new Float32Array(400);
  gPolvo.setAttribute('position', new THREE.BufferAttribute(polvoPos, 3));
  const mPolvo = new THREE.PointsMaterial({ size: .03, color: 0x3a3f4b, transparent: true, opacity: .45, depthWrite: false });
  const polvo = new THREE.Points(gPolvo, mPolvo); polvo.frustumCulled = false; scene.add(polvo);
  let pi = 0, qi = 0;
  const R = azar(11);
  const chispa = (p, n, col, vel = 1.2, grav = 6) => { for (let k = 0; k < n; k++) { const i = pi++ % MAXP; pPos.set([p.x, p.y, p.z], i * 3); const a = R() * Math.PI * 2, u = R(); pVel.set([Math.cos(a) * vel * u, R() * vel * .9, Math.sin(a) * vel * u], i * 3); pCol.set(col, i * 3); pVida[i] = .25 + R() * .45; pGrav[i] = grav; } };
  const rociar = (p, n) => { for (let k = 0; k < n; k++) { const i = qi++ % 400; polvoPos.set([p.x + (R() - .5) * .04, p.y, p.z + (R() - .5) * .04], i * 3); polvoVel.set([(R() - .5) * .5, -.9 - R() * .6, (R() - .5) * .5], i * 3); polvoVida[i] = .5 + R() * .4; } };
  function moverParticulas(dt) {
    for (let i = 0; i < MAXP; i++) { if (pVida[i] <= 0) { pPos[i * 3 + 1] = -10; continue; } pVida[i] -= dt; pVel[i * 3 + 1] -= pGrav[i] * dt; for (let a = 0; a < 3; a++) pPos[i * 3 + a] += pVel[i * 3 + a] * dt; if (pPos[i * 3 + 1] < MESA + .05 && pVel[i * 3 + 1] < 0) { pVel[i * 3 + 1] *= -.3; pVel[i * 3] *= .6; pVel[i * 3 + 2] *= .6; } const f = Math.max(0, pVida[i] / .7); pCol[i * 3] *= .985; pCol[i * 3 + 1] *= .97; pCol[i * 3 + 2] *= .95; void f; }
    for (let i = 0; i < 400; i++) { if (polvoVida[i] <= 0) { polvoPos[i * 3 + 1] = -10; continue; } polvoVida[i] -= dt; for (let a = 0; a < 3; a++) polvoPos[i * 3 + a] += polvoVel[i * 3 + a] * dt; polvoVel[i * 3 + 1] *= .97; if (polvoPos[i * 3 + 1] < MESA + .06) polvoVida[i] = 0; }
    gP.attributes.position.needsUpdate = gP.attributes.color.needsUpdate = gPolvo.attributes.position.needsUpdate = true;
  }

  /* ---------- puestos: cada máquina en coordenadas propias (la pieza queda en z = -1.13) ---------- */
  const ZP = -(R_MAQ - R_PALE), YP = MESA + .05; // centro de la pieza en coordenadas del puesto
  const PP = new THREE.Vector3(0, YP, ZP);
  const tmp = new THREE.Vector3();
  const maquinas = PUESTOS.map((P, k) => { const g = new THREE.Group(); g.position.copy(pos(k * PASO, R_MAQ)); g.rotation.y = k * PASO; scene.add(g); return { g, P }; });
  const mundo = (g, v) => g.localToWorld(v.clone());
  const esquinaPieza = (j) => { const e = [[-1, -1], [1, -1], [1, 1], [-1, 1]][j >> 1], d = PANEL / 2 + T_TUBO; return new THREE.Vector3(e[0] * d * (j % 2 ? 1 : .8), YP + T_TUBO + .01, ZP + e[1] * d * (j % 2 ? .8 : 1)); };
  const portico = (g, alto, ancho = 1.2) => { for (const x of [-ancho / 2, ancho / 2]) { caja(g, mMaquina, .1, alto, .1, x, alto / 2, ZP + .5, .015); caja(g, mMaquina, .1, alto, .1, x, alto / 2, ZP - .5, .015); caja(g, mMaquina, .08, .08, 1.1, x, alto, ZP, .012); } };

  // 0 · carga: robot de ventosas y carro de láminas
  const r0 = robot(maquinas[0].g, 'ventosa'); r0.g.position.set(-.05, 0, .05);
  const carro = new THREE.Group(); carro.position.set(.82, 0, -.35); maquinas[0].g.add(carro);
  caja(carro, mAmarillo, .7, .06, .7, 0, .45, 0, .01); for (const x of [-.3, .3]) for (const z of [-.3, .3]) caja(carro, mCerca, .04, .45, .04, x, .22, z, .006);
  const pilaLam = []; for (let i = 0; i < 9; i++) { const o = caja(carro, mAcero, .6, .0019, .6, 0, .482 + i * .006, 0, 0); pilaLam.push(o); }
  const lamVent = new THREE.Mesh(UNIT, mAcero); lamVent.scale.set(.6, .0019, .6); lamVent.position.y = .1; r0.punta.add(lamVent);
  maquinas[0].update = (p, act) => {
    const pila = new THREE.Vector3(.82, .5 + 8 * .006, -.35), sobre = PP.clone().setY(YP + .32), baja = PP.clone().setY(YP + .03), casa = new THREE.Vector3(.2, 1.2, -.55);
    let t; if (!act) t = casa; else if (p < .18) t = lerpV(casa, pila.clone().setY(pila.y + .25), sstep(0, .18, p)); else if (p < .3) t = lerpV(pila.clone().setY(pila.y + .25), pila, sstep(.18, .3, p)); else if (p < .45) t = lerpV(pila, pila.clone().setY(pila.y + .3), sstep(.3, .45, p)); else if (p < .7) t = lerpV(pila.clone().setY(pila.y + .3), sobre, sstep(.45, .7, p)); else if (p < .82) t = lerpV(sobre, baja, sstep(.7, .82, p)); else t = lerpV(baja, casa, sstep(.86, 1, p));
    r0.resolver(t); lamVent.visible = act && p > .3 && p < .82;
  };
  // 1 · corte láser: pórtico con cabezal
  const g1 = maquinas[1].g; portico(g1, 1.75);
  const puente = new THREE.Group(); g1.add(puente); caja(puente, mMaquina, 1.3, .14, .16, 0, 1.75, 0, .02); caja(puente, mRobot, 1.3, .03, .17, 0, 1.83, 0, .006);
  const cabezal = new THREE.Group(); puente.add(cabezal); caja(cabezal, mOscuro, .16, .22, .2, 0, 1.68, 0, .02); cil(cabezal, mInox, .035, .42, 0, 1.36, 0, 20); cil(cabezal, mAcero, .02, .05, 0, 1.13, 0, 16);
  const haz = new THREE.Mesh(new THREE.CylinderGeometry(.0025, .0025, 1, 8), mHaz); cabezal.add(haz);
  caja(g1, mOscuro, .5, .9, .4, .95, .45, ZP + .3, .03); caja(g1, mMaquina, .3, .5, .02, .95, 1.1, ZP + .3, .01); // fuente y enfriador
  maquinas[1].update = (p, act, dt) => {
    const filas = 7, q = sstep(.08, .92, p), fila = Math.min(filas - 1, Math.floor(q * filas)), f = q * filas - fila, x = (fila % 2 ? 1 - f : f) - .5;
    const zl = act ? ZP - .25 + fila / (filas - 1) * .5 : ZP - .45, xl = act ? x * .5 : .5;
    puente.position.z = zl; cabezal.position.x = xl;
    const corta = act && p > .08 && p < .92; haz.visible = corta; haz.scale.y = 1.11 - YP; haz.position.y = (1.11 + YP) / 2;
    if (corta) { chispa(mundo(g1, new THREE.Vector3(xl, YP + .005, zl)), Math.ceil(dt * 260), [1, .95, .8], .9, 7); }
  };
  // 2 · doblez: prensa plegadora
  const g2 = maquinas[2].g;
  for (const x of [-.55, .55]) caja(g2, mMaquina, .16, 2.0, .5, x, 1.0, ZP, .03);
  caja(g2, mMaquina, 1.3, .3, .5, 0, 2.0, ZP, .04); caja(g2, mRobot, 1.32, .05, .52, 0, 1.86, ZP, .008);
  const pison = new THREE.Group(); g2.add(pison); caja(pison, mOscuro, 1.0, .1, .3, 0, 0, 0, .015); for (const s of [-1, 1]) caja(pison, mInox, .04, .08, PANEL - .06, s * (PANEL / 2 - .03), -.09, 0, .006);
  cil(g2, mInox, .05, .5, -.35, 1.6, ZP, 20); cil(g2, mInox, .05, .5, .35, 1.6, ZP, 20);
  maquinas[2].update = (p, act) => { const b = act ? sstep(.2, .42, p) - sstep(.55, .78, p) : 0; pison.position.set(0, lerp(1.62, YP + .16, b), ZP); };
  // 3 · armado: pórtico con pinza y estante de tubos
  const g3 = maquinas[3].g; portico(g3, 1.7, 1.3);
  const puente3 = new THREE.Group(); g3.add(puente3); caja(puente3, mMaquina, 1.4, .12, .14, 0, 1.7, 0, .02);
  const pinza = new THREE.Group(); puente3.add(pinza); caja(pinza, mOscuro, .12, .14, .12, 0, 1.64, 0, .015);
  const vastago = new THREE.Group(); pinza.add(vastago); cil(vastago, mInox, .02, .5, 0, -.25, 0, 12); caja(vastago, mRobot, .1, .04, .06, 0, -.52, 0, .008); for (const s of [-1, 1]) caja(vastago, mOscuro, .015, .07, .05, s * .04, -.57, 0, .004);
  const tuboPinza = new THREE.Mesh(rbox(.66, T_TUBO, T_TUBO, .004), mAcero); tuboPinza.position.y = -.6; vastago.add(tuboPinza);
  const estante = new THREE.Group(); estante.position.set(0, 0, ZP + .62); g3.add(estante);
  caja(estante, mAmarillo, .9, .05, .3, 0, .9, 0, .008); for (const x of [-.4, .4]) caja(estante, mCerca, .04, .9, .25, x, .45, 0, .006);
  for (let i = 0; i < 6; i++) caja(estante, mAcero, .66, T_TUBO, T_TUBO, 0, .94 + Math.floor(i / 3) * .032, -.07 + (i % 3) * .07, .004);
  maquinas[3].update = (p, act) => {
    let z = ZP + .62, y = 0, lleva = false, rotY = 0;
    if (act) { const j = Math.min(3, Math.floor(p / .2)), f = (p - j * .2) / .2; if (p < .8) { const dest = j % 2 === 0 ? ZP + (j === 0 ? -1 : 1) * (PANEL / 2 + T_TUBO / 2) : ZP; z = lerp(ZP + .62, dest, sstep(.1, .5, f)); y = sstep(.5, .75, f) - sstep(.85, 1, f) + (f < .15 ? sstep(0, .1, f) - sstep(.1, .15, f) : 0); lleva = f > .1 && f < .78; rotY = j % 2 ? Math.PI / 2 : 0; pinza.position.x = j % 2 ? (j === 1 ? 1 : -1) * (PANEL / 2 + T_TUBO / 2) : 0; } }
    puente3.position.z = z - 0; pinza.position.y = 0; vastago.position.y = -y * (1.64 - .62 - YP - T_TUBO); vastago.rotation.y = rotY; tuboPinza.visible = lleva;
    if (!act) pinza.position.x = 0;
  };
  // 4 · soldadura MIG
  const r4 = robot(maquinas[4].g, 'antorcha'); r4.g.position.set(0, 0, .02);
  caja(maquinas[4].g, mOscuro, .5, .8, .45, .78, .4, .1, .03); cil(maquinas[4].g, mAcero, .1, .3, .78, .95, .1, 24); // fuente y carrete
  maquinas[4].update = (p, act, dt) => {
    const casa = new THREE.Vector3(.1, 1.25, -.5); let t = casa, arc = false;
    if (act && p > .04 && p < .94) { const q = (p - .04) / .9 * 8, j = Math.min(7, Math.floor(q)), f = q - j; const a = esquinaPieza(j); t = a.clone().add(new THREE.Vector3(0, sstep(0, .2, f) < 1 ? .06 * (1 - sstep(0, .25, f)) + .06 * sstep(.8, 1, f) : 0, 0)); arc = f > .25 && f < .8; }
    else if (act) t = lerpV(casa, esquinaPieza(0).setY(YP + .1), p < .5 ? sstep(0, .04, p) : 1 - sstep(.94, 1, p));
    r4.resolver(t);
    arco.intensity = 0;
    if (arc) { r4.punta.getWorldPosition(tmp); chispa(tmp, Math.ceil(dt * 320), [.75, .85, 1], 1.4, 8); arco.position.copy(tmp).setY(tmp.y + .05); arco.intensity = 1.5 + Math.random() * 2.5; }
  };
  // 5 · esmerilado
  const r5 = robot(maquinas[5].g, 'disco'); r5.g.position.set(0, 0, .02);
  maquinas[5].update = (p, act, dt) => {
    const casa = new THREE.Vector3(-.1, 1.25, -.5); let t = casa, roza = false;
    if (act && p > .06 && p < .94) { const q = (p - .06) / .88 * 8, j = Math.min(7, Math.floor(q)), f = q - j; t = esquinaPieza(j).clone(); t.y += .005 + .05 * (1 - sstep(0, .2, f)) + .05 * sstep(.85, 1, f); t.x += Math.sin(f * 18) * .01; roza = f > .2 && f < .85; }
    r5.resolver(t);
    if (r5.extra.disco) r5.extra.disco.rotation.y += act ? dt * 60 : dt * 2;
    if (roza) { r5.punta.getWorldPosition(tmp); chispa(tmp, Math.ceil(dt * 380), [1, .55, .15], 1.8, 5); }
  };
  // 6 · pintura electrostática: cabina con vidrio y pistola
  const g6 = maquinas[6].g;
  for (const x of [-.6, .6]) for (const z of [ZP - .5, ZP + .5]) caja(g6, mMaquina, .08, 2.0, .08, x, 1.0, z, .015);
  caja(g6, mMaquina, 1.3, .25, 1.12, 0, 2.05, ZP, .03); caja(g6, mOscuro, 1.0, .02, .8, 0, 1.92, ZP, 0);
  const vidrio = new THREE.Mesh(new THREE.PlaneGeometry(1.12, 1.0), mVidrio); vidrio.position.set(0, 1.45, ZP + .5); g6.add(vidrio);
  for (const x of [-.6, .6]) { const v = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), mVidrio); v.rotation.y = Math.PI / 2; v.position.set(x, 1.45, ZP); g6.add(v); }
  caja(g6, mOscuro, .5, 1.1, .4, .95, .55, ZP + .55, .03); // recuperador de polvo
  const pistola = new THREE.Group(); g6.add(pistola); cil(pistola, mInox, .012, .5, 0, 1.6, 0, 12); caja(pistola, mOscuro, .06, .06, .14, 0, 1.33, 0, .01); cil(pistola, mInox, .02, .08, 0, 1.27, 0, 16);
  maquinas[6].update = (p, act, dt) => {
    const q = sstep(.1, .9, p), fila = Math.min(4, Math.floor(q * 5)), f = q * 5 - fila;
    pistola.position.set(act ? ((fila % 2 ? 1 - f : f) - .5) * .55 : .45, 0, act ? ZP - .24 + fila * .12 : ZP);
    if (act && p > .1 && p < .9) { pistola.getWorldPosition(tmp); tmp.y = 1.24; rociar(tmp, Math.ceil(dt * 160)); }
  };
  // 7 · inspección con escáner y descarga
  const g7 = maquinas[7].g;
  for (const x of [-.55, .55]) caja(g7, mMaquina, .1, 1.5, .1, x, .75, ZP, .015);
  const barra = new THREE.Group(); g7.add(barra); caja(barra, mOscuro, 1.2, .08, .1, 0, 1.38, 0, .015); caja(barra, mRobot, .3, .05, .11, 0, 1.44, 0, .01);
  const plano = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.38 - YP), mEscaner); plano.position.y = (1.38 + YP) / 2; barra.add(plano);
  const r7 = robot(g7, 'ventosa'); r7.g.position.set(-.05, 0, .1);
  const lamVent7 = new THREE.Group(); r7.punta.add(lamVent7);
  const salida = new THREE.Group(); salida.position.set(-.85, 0, -.3); g7.add(salida);
  caja(salida, mOscuro, .78, .4, .78, 0, .2, 0, .02); const pilaSalida = [];
  const pantalla = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 160; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return { c, t }; })();
  const monitor = new THREE.Group(); monitor.position.set(.75, 0, -.2); monitor.rotation.y = -.5; g7.add(monitor);
  cil(monitor, mOscuro, .03, 1.2, 0, .6, 0, 12); caja(monitor, mOscuro, .42, .28, .03, 0, 1.3, 0, .01);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(.38, .24), new THREE.MeshBasicMaterial({ map: pantalla.t })); scr.position.set(0, 1.3, .017); monitor.add(scr);
  let copiaVent = null;
  maquinas[7].update = (p, act) => {
    barra.position.z = act ? lerp(ZP - .42, ZP + .42, sstep(.04, .42, p)) : ZP - .45; plano.visible = act && p > .04 && p < .42;
    const casa = new THREE.Vector3(-.3, 1.2, -.45), sobre = PP.clone().setY(YP + .35), baja = PP.clone().setY(YP + .06), dejar = new THREE.Vector3(-.85, .45 + pilaSalida.length * .035 + .25, -.3);
    let t = casa;
    if (act) { if (p < .48) t = casa; else if (p < .56) t = lerpV(casa, baja, sstep(.48, .56, p)); else if (p < .62) t = baja; else if (p < .74) t = lerpV(baja, sobre, sstep(.62, .68, p)); if (p >= .68 && p < .84) t = lerpV(sobre, dejar, sstep(.68, .84, p)); else if (p >= .84) t = lerpV(dejar, casa, sstep(.88, 1, p)); }
    r7.resolver(t); lamVent7.visible = act && p > .62 && p < .86;
  };
  function dibujarPantalla(id, ok, dev) {
    const g = pantalla.c.getContext('2d'); g.fillStyle = '#0d1016'; g.fillRect(0, 0, 256, 160);
    g.fillStyle = '#7d879c'; g.font = '500 13px DM Mono, monospace'; g.fillText('ESCÁNER 3D · AS-RT-08', 14, 24);
    g.fillStyle = '#eef1f8'; g.font = '700 34px Antonio, Arial Narrow, sans-serif'; g.fillText(id || '—', 14, 68);
    g.fillStyle = ok ? '#5cf09a' : '#ffb21c'; g.font = '700 26px Antonio, Arial Narrow, sans-serif'; g.fillText(ok ? 'CONFORME' : 'MIDIENDO…', 14, 106);
    g.fillStyle = '#aab3c9'; g.font = '500 13px DM Mono, monospace'; g.fillText(dev != null ? `desvío máx ${dev.toFixed(1)} mm · ±1,0` : 'comparando con el modelo', 14, 136);
    pantalla.t.needsUpdate = true;
  }
  dibujarPantalla(null, false);

  // Puesto de mando (HMI) afuera de la puerta.
  const hmi = new THREE.Group(); hmi.position.copy(pos(-PASO * .75, R_CERCA + .9)); hmi.rotation.y = -PASO * .75 + Math.PI; scene.add(hmi);
  caja(hmi, mOscuro, .36, 1.0, .3, 0, .5, 0, .03); const hTex = (() => { const c = document.createElement('canvas'); c.width = 320; c.height = 200; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return { c, t }; })();
  const hp = new THREE.Group(); hp.position.set(0, 1.12, 0); hp.rotation.x = -.5; hmi.add(hp); caja(hp, mOscuro, .46, .32, .04, 0, 0, 0, .01);
  const hs = new THREE.Mesh(new THREE.PlaneGeometry(.42, .27), new THREE.MeshBasicMaterial({ map: hTex.t })); hs.position.z = .021; hs.rotation.y = 0; hp.add(hs);
  const hb = cil(hmi, luzRoja, .03, .02, .1, 1.01, .1, 16); void hb;
  hmi.rotation.y += Math.PI;

  /* ---------- tiempo, estado y eventos ---------- */
  const cfg = { dwell: 6.2, indexa: 1.4, vel: 1, pausa: false, diseno: 'celosia', acabado: 'grafito', sigue: 0, verSigue: true };
  const S = { t: 0, n: -1, serie: 40, hechas: 0, inicio: 0, eventos: [], seguida: null };
  const oyentes = [], evento = (tipo, txt, pieza) => { const e = { t: S.t, tipo, txt, pieza }; S.eventos.push(e); if (S.eventos.length > 60) S.eventos.shift(); oyentes.forEach((f) => f(e)); };
  const ciclo = () => cfg.dwell + cfg.indexa;
  const idDe = (n) => `P-${String(n).padStart(4, '0')}`;
  // Al iniciar, la mesa ya viene trabajando: cada palé tiene una pieza en el puesto que le toca.
  for (let i = 0; i < N; i++) { const k = i; pales[i].id = S.serie - k; pales[i].diseno = ['celosia', 'rombos', 'listones'][(i * 5) % 3]; pales[i].acabado = Object.keys(ACABADOS)[(i * 3) % 4]; }
  S.serie += 1;
  let ultimoN = 0;
  const puestoDe = (i, n) => ((i + n) % N + N) % N;
  function alIndexar(n) {
    for (let i = 0; i < N; i++) {
      const k = puestoDe(i, n), pl = pales[i];
      if (k === 0) { pl.id = S.serie++; pl.diseno = cfg.diseno; pl.acabado = cfg.acabado; evento('carga', `entra ${DISENOS[pl.diseno].toLowerCase()} · ${ACABADOS[pl.acabado].nombre.toLowerCase()}`, idDe(pl.id)); }
    }
  }
  const dev = azar(77);
  let compensa = 0;
  function eventosPuesto(k, pl) {
    const id = idDe(pl.id);
    if (k === 1) { const d = (dev() - .5) * .5 + compensa; if (Math.abs(d) > .18) { evento('ajuste', `láser compensa foco ${(-d).toFixed(2)} mm`, id); compensa = 0; } else { compensa += .05; evento('ok', `corte completo · ${huecos(pl.diseno).length} perforaciones`, id); } }
    if (k === 4) evento('ok', 'soldadura · 8 cordones · 142 A', id);
    if (k === 6) evento('ok', `pintura ${ACABADOS[pl.acabado].nombre.toLowerCase()} · 70 µm`, id);
    if (k === 7) { const d = .2 + dev() * .7; S.hechas++; evento('cert', `inspección conforme · desvío ${d.toFixed(1).replace('.', ',')} mm`, id); dibujarPantalla(id, true, d); pilaSalida.push(caja(salida, new THREE.MeshPhysicalMaterial({ color: ACABADOS[pl.acabado].color, metalness: ACABADOS[pl.acabado].met, roughness: ACABADOS[pl.acabado].rug, clearcoat: .6 }), PANEL + .06, .03, PANEL + .06, 0, .415 + pilaSalida.length * .035, 0, .004)); if (pilaSalida.length > 7) { for (const o of pilaSalida.splice(0)) salida.remove(o); } }
  }

  /* ---------- cámaras y dibujo ---------- */
  let ancho = 1, alto = 1, modo = 'inset', foco = null, focoT = 0, recorrido = null;
  const vistaPrincipal = { x: 0, y: 0, w: 1, h: 1 }, vistaSigue = { x: 0, y: 0, w: 0, h: 0 };
  function medir() {
    const r = canvas.getBoundingClientRect(); ancho = Math.max(1, r.width); alto = Math.max(1, r.height);
    renderer.setSize(ancho, alto, false);
    modo = ancho / alto < .9 ? 'apilado' : 'inset';
    if (!cfg.verSigue) { Object.assign(vistaPrincipal, { x: 0, y: 0, w: ancho, h: alto }); Object.assign(vistaSigue, { w: 0, h: 0 }); }
    else if (modo === 'apilado') { Object.assign(vistaPrincipal, { x: 0, y: alto / 2, w: ancho, h: alto / 2 }); Object.assign(vistaSigue, { x: 0, y: 0, w: ancho, h: alto / 2 }); }
    else { const w = Math.round(ancho * .36), h = Math.round(w * .62); Object.assign(vistaPrincipal, { x: 0, y: 0, w: ancho, h: alto }); Object.assign(vistaSigue, { x: ancho - w - 16, y: 16, w, h }); }
    cam.aspect = vistaPrincipal.w / vistaPrincipal.h; cam.updateProjectionMatrix();
    camSigue.aspect = (vistaSigue.w || 1) / (vistaSigue.h || 1); camSigue.updateProjectionMatrix();
  }
  new ResizeObserver(medir).observe(canvas); medir();
  controls.addEventListener('start', () => { controls.autoRotate = false; recorrido = null; foco = null; });

  const camPos = new THREE.Vector3(), camMira = new THREE.Vector3(), sPos = new THREE.Vector3(1, 2, 3), sMira = new THREE.Vector3();
  function irA(k, dur = 1.6) {
    const a = k * PASO + .2, c = pos(a, 4.1, 3.5), m = pos(k * PASO, R_PALE + .15, MESA + .15);
    foco = { desde: cam.position.clone(), hacia: c, mDesde: controls.target.clone(), mHacia: m }; focoT = 0; controls.autoRotate = false; foco.dur = dur;
  }
  function vistaGeneral() { foco = { desde: cam.position.clone(), hacia: new THREE.Vector3(5.6, 4.9, 6.7), mDesde: controls.target.clone(), mHacia: new THREE.Vector3(0, .9, 0), dur: 1.6 }; focoT = 0; }

  let ultimo = performance.now(), cuadro = 0, hmiT = 0;
  function paso(ahora) {
    const bruto = Math.min(.3, Math.max(0, (ahora - ultimo) / 1000)), real = Math.min(.05, bruto); ultimo = ahora;
    const dt = cfg.pausa ? 0 : real * cfg.vel;
    S.t += dt;
    const T = ciclo(), n = Math.floor(S.t / T), f = (S.t - n * T);
    if (n !== ultimoN) {
      for (let m = ultimoN + 1; m <= n; m++) alIndexar(m);
      ultimoN = n;
    }
    const indexando = f > cfg.dwell, gi = indexando ? sstep(0, 1, (f - cfg.dwell) / cfg.indexa) : 0;
    mesa.rotation.y = (n + gi) * PASO;
    const p = indexando ? 1 : f / cfg.dwell;
    for (let i = 0; i < N; i++) {
      const k = puestoDe(i, n), pl = pales[i];
      const kk = indexando && k === 7 ? 8 : k;
      pintarPieza(pl, indexando ? (k === 7 ? 8 : k + 1) : kk, indexando ? 0 : p);
      if (pl.ev !== n && (indexando || p > .95)) { pl.ev = n; eventosPuesto(k, pl); }
      pl.k = k;
    }
    // pieza vacía después de la descarga: el palé vuelve sin pieza al puesto de carga
    for (let i = 0; i < N; i++) if (indexando && puestoDe(i, n) === 7) pales[i].pz.g.visible = false;
    for (const M of maquinas) M.update(p, !indexando && !cfg.pausaMaq, dt);
    if (indexando) { arco.intensity = 0; }
    moverParticulas(dt);
    mPolvo.color.setHex(ACABADOS[pales.find((pl) => pl.k === 6)?.acabado || 'grafito'].color);
    // lámina en la ventosa de descarga = copia de la pieza que sale
    const sale = pales.find((pl) => pl.k === 7);
    if (sale && lamVent7.visible) { if (copiaVent !== sale.id) { lamVent7.clear(); const c = sale.pz.g.clone(true); c.visible = true; c.position.set(0, .09 + .0, 0); c.traverse((o) => { o.visible = true; }); lamVent7.add(c); copiaVent = sale.id; } }
    if (!indexando && p < .1 && sale) dibujarPantalla(idDe(sale.id), false);
    // luces de la torre
    luzVerde.emissiveIntensity = cfg.pausa ? 0 : 2.2; luzAmbar.emissiveIntensity = cfg.pausa ? 2.2 * (Math.sin(ahora / 200) > 0 ? 1 : .2) : 0; luzRoja.emissiveIntensity = 0;

    // Cámara principal: transición o recorrido guiado.
    if (foco) { focoT = Math.min(1, focoT + bruto / foco.dur); const e = sstep(0, 1, focoT); cam.position.lerpVectors(foco.desde, foco.hacia, e); controls.target.lerpVectors(foco.mDesde, foco.mHacia, e); if (focoT >= 1) foco = null; }
    if (recorrido && !foco) { recorrido.t += bruto; if (recorrido.t > recorrido.dur) { recorrido.k++; recorrido.t = 0; if (recorrido.k >= N) { recorrido = null; vistaGeneral(); oyentesRec.forEach((fn) => fn(null)); } else { irA(recorrido.k); oyentesRec.forEach((fn) => fn(recorrido.k)); } } }
    controls.update();

    // Cámara que sigue una pieza: se mueve con el palé y mira la pieza desde el lado de la máquina.
    const pl = pales[cfg.sigue]; S.seguida = pl;
    pl.g.getWorldPosition(camMira); camMira.y += .08;
    const ang = Math.atan2(camMira.x, camMira.z);
    camPos.copy(pos(ang - .58, .72, MESA + 1.05));
    sPos.lerp(camPos, cuadro ? 1 - Math.exp(-real * 6) : 1); sMira.lerp(camMira, cuadro ? 1 - Math.exp(-real * 8) : 1);
    camSigue.position.copy(sPos); camSigue.lookAt(sMira);

    // Dibujo con dos vistas.
    renderer.setScissor(0, 0, ancho, alto); renderer.setViewport(0, 0, ancho, alto);
    const vp = vistaPrincipal; renderer.setViewport(vp.x, vp.y, vp.w, vp.h); renderer.setScissor(vp.x, vp.y, vp.w, vp.h); renderer.render(scene, cam);
    if (cfg.verSigue && vistaSigue.w) { const v = vistaSigue; const y = modo === 'inset' ? alto - v.y - v.h : v.y; renderer.setViewport(v.x, y, v.w, v.h); renderer.setScissor(v.x, y, v.w, v.h); renderer.render(scene, camSigue); }
    hmiT += real; if (hmiT > .5) { hmiT = 0; dibujarHMI(); }
    cuadro++;
    oyentesCuadro.forEach((fn) => fn());
    if (!opt.manual) requestAnimationFrame(paso);
  }
  function dibujarHMI() {
    const g = hTex.c.getContext('2d'); g.fillStyle = '#10131a'; g.fillRect(0, 0, 320, 200);
    g.fillStyle = cfg.pausa ? '#ffb21c' : '#5cf09a'; g.fillRect(14, 16, 10, 10);
    g.fillStyle = '#eef1f8'; g.font = '500 14px DM Mono, monospace'; g.fillText(cfg.pausa ? 'EN PAUSA' : 'PRODUCIENDO', 32, 26);
    g.font = '700 54px Antonio, Arial Narrow, sans-serif'; g.fillText(String(S.hechas), 14, 92);
    g.fillStyle = '#aab3c9'; g.font = '500 13px DM Mono, monospace'; g.fillText('PIEZAS TERMINADAS', 14, 114);
    g.fillText(`CICLO ${ciclo().toFixed(1)} s · ${Math.round(3600 / ciclo())} PZ/H`, 14, 140);
    for (let k = 0; k < N; k++) { const pl = pales.find((x) => x.k === k); g.fillStyle = pl ? '#e57a68' : '#2a2f3a'; g.fillRect(14 + k * 37, 160, 32, 22); g.fillStyle = '#10131a'; g.font = '500 11px DM Mono, monospace'; g.fillText(String(k + 1), 25 + k * 37, 175); }
    hTex.t.needsUpdate = true;
  }

  const oyentesCuadro = [], oyentesRec = [];
  // proyección de un punto 3D a la vista principal (para etiquetas en HTML)
  const proy = new THREE.Vector3();
  function enPantalla(v) { proy.copy(v).project(cam); return { x: vistaPrincipal.x + (proy.x + 1) / 2 * vistaPrincipal.w, y: (1 - proy.y) / 2 * vistaPrincipal.h, z: proy.z }; }
  const puntoPuesto = (k) => pos(k * PASO, R_MAQ, k === 0 || k === 4 || k === 5 || k === 7 ? 1.9 : 2.25);

  function tema(dia) {
    mPiso.color.setHex(dia ? 0xe6e7eb : 0x3a4159); renderer.setClearColor(dia ? 0xe6e7eb : 0x363d56); hemi.intensity = dia ? .9 : .55; sol.intensity = dia ? 1.6 : 1.0;
    scene.fog = new THREE.Fog(dia ? 0xe6e7eb : 0x363d56, 14, 34);
  }
  tema(true);
  if (!opt.manual) requestAnimationFrame(paso);

  return {
    cfg, S, pales, PUESTOS,
    set(o) { Object.assign(cfg, o); if ('verSigue' in o) medir(); },
    irA, vistaGeneral, tema,
    seguirSiguiente() { cfg.sigue = (cfg.sigue + 1) % N; return pales[cfg.sigue]; },
    seguirEn(k) { const i = pales.findIndex((pl) => pl.k === k); if (i >= 0) cfg.sigue = i; },
    recorrido(on) { if (on) { recorrido = { k: 0, t: 0, dur: 6.5 }; irA(0); oyentesRec.forEach((fn) => fn(0)); } else { recorrido = null; oyentesRec.forEach((fn) => fn(null)); } },
    alEvento(f) { oyentes.push(f); }, alCuadro(f) { oyentesCuadro.push(f); }, alRecorrido(f) { oyentesRec.push(f); },
    estado() { const T = ciclo(), n = Math.floor(S.t / T), f = S.t - n * T; return { indexando: f > cfg.dwell, p: f > cfg.dwell ? 1 : f / cfg.dwell, n, ciclo: T, pzh: 3600 / T * 1, hechas: S.hechas, pales: pales.map((pl) => ({ id: idDe(pl.id), k: pl.k, diseno: pl.diseno, acabado: pl.acabado })), seguida: idDe(pales[cfg.sigue].id), kSeguida: pales[cfg.sigue].k }; },
    etiquetas() { return PUESTOS.map((_, k) => enPantalla(puntoPuesto(k))); },
    vistas() { return { modo, principal: { ...vistaPrincipal }, sigue: cfg.verSigue ? { ...vistaSigue } : null }; },
    paso: (ms) => paso(ms ?? performance.now()),
    idDe,
  };
}
