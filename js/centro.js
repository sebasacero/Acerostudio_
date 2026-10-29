// =================================================================
// CENTRO DE MANDO — AceroStudio
// Gemelo digital de un conjunto de torres en estructura de acero:
//   Aérea  · el conjunto de noche con las ventanas encendidas
//   Corte  · corta en cualquier nivel, del último piso al sótano
//   Obra   · simulación de la obra por fases y toneladas de acero montadas
//   Ventas · cada apartamento con su estado y su ficha
//   Dron   · recorrido guiado con paradas narradas
// y un modo reel vertical de ~30 s con subtítulos, para grabar en pantalla.
//
// Parámetros por URL: ?nombre=Torres%20del%20Parque&torres=3&pisos=20&sotanos=5
// =================================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// ---------- Parámetros ----------
const qs = new URLSearchParams(location.search);
const entero = (k, d, min, max) => Math.min(max, Math.max(min, parseInt(qs.get(k), 10) || d));
const NOMBRE = (qs.get('nombre') || 'Torres del Parque').slice(0, 48);
const T = entero('torres', 3, 1, 4);
const NP = entero('pisos', 20, 6, 40);      // pisos sobre el terreno (los 3 primeros son el podio)
const NS = entero('sotanos', 5, 1, 6);
const WHATSAPP = '573152125327';

// ---------- Medidas (m) ----------
const LUZ = 6;                 // crujía de la retícula de acero
const HS = 3.0, HP = 4.5, HT = 3.2;
const LOSA = 0.25;
const ANCHO = T * 30;          // podio: 30 m por torre
const FONDO = 30;
const Y4 = 3 * HP;             // cota de la cubierta del podio (+13.50)
const TZ = -6;                 // centro de las torres en z (se apoyan atrás, la terraza mira al parque)
const LADO = 18;               // planta de torre 18 × 18 (3 × 3 crujías)
const TORRES = Array.from({ length: T }, (_, i) => ({ id: 'ABCD'[i], cx: -ANCHO / 2 + 15 + i * 30 }));
const TOPE = Y4 + (NP - 3) * HT;  // cota de cubierta de las torres

// Perfiles (kg/m) del catálogo del Studio
const KG = { HEB400: 155, HEB300: 117, IPE450: 77.6, SHS200: 57 };

// ---------- Paleta ----------
const C = {
  fondo: 0x16191c, suelo: 0x22262a, sueloDia: 0x3a3a37, linea: 0x6b7178,
  acero: 0x3a3f45, rojo: 0xb8261c, losa: 0xd8d4cc, concreto: 0x9c9890, tierra: 0x3b342d, tierraFresca: 0x5a4c3e,
  vidrio: 0x8fb4c4, parque: 0x2f3b2a, parqueDia: 0x58704a, arbol: 0x3f5a35, vecino: 0x30353a, vecinoDia: 0xb9b4aa,
  piscina: 0x4fa3c7, madera: 0xa7825b,
  disponible: 0x5fbf9f, apartado: 0xe6c66e, vendido: 0x50565c,
};

// ---------- Niveles ----------
// índice 0 = sótano más profundo. y = cota del piso terminado.
const NIVELES = [];
for (let k = NS; k >= 1; k--) NIVELES.push({ id: 'S' + k, nombre: 'Sótano ' + k, y: -k * HS, h: HS, tipo: 'sotano' });
for (let p = 1; p <= 3; p++) NIVELES.push({ id: 'P' + p, nombre: 'Piso ' + p, y: (p - 1) * HP, h: HP, tipo: 'podio' });
for (let p = 4; p <= NP; p++) NIVELES.push({ id: 'P' + p, nombre: 'Piso ' + p, y: Y4 + (p - 4) * HT, h: HT, tipo: 'torre', piso: p });
const iNivel = (id) => NIVELES.findIndex((n) => n.id === id);
const cota = (y) => (y >= 0 ? '+' : '−') + Math.abs(y).toFixed(2);

// ---------- PRNG determinista (mismas ventas en cada visita) ----------
let semilla = 20261029;
const azar = () => ((semilla = (semilla * 1664525 + 1013904223) >>> 0) / 4294967296);

// =================================================================
// Escena
// =================================================================
const app = document.getElementById('app');
const contenedor = document.getElementById('escena');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
contenedor.appendChild(renderer.domElement);

const escena = new THREE.Scene();
const camara = new THREE.PerspectiveCamera(40, 1, 0.5, 1500);
camara.position.set(ANCHO * 0.9 + 40, 75, 120);
const controles = new OrbitControls(camara, renderer.domElement);
controles.enableDamping = true;
controles.dampingFactor = 0.08;
controles.maxPolarAngle = Math.PI * 0.49;
controles.minDistance = 8;
controles.maxDistance = 420;
controles.target.set(0, 22, -4);

const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
const sol = new THREE.DirectionalLight(0xffffff, 2);
sol.castShadow = true;
sol.shadow.mapSize.setScalar(innerWidth < 700 ? 1024 : 2048);
const ext = Math.max(ANCHO, 60) * 0.85;
Object.assign(sol.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 1, far: 400 });
sol.shadow.bias = -0.0004;
escena.add(hemi, sol, sol.target);

// ---------- Materiales ----------
const est = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05, ...extra });
const MAT = {
  acero: est(C.acero, { roughness: 0.45, metalness: 0.6 }),
  rojo: est(C.rojo, { roughness: 0.5, metalness: 0.35 }),
  losa: est(C.losa),
  concreto: est(C.concreto),
  tierra: est(C.tierra, { roughness: 1 }),
  tierraFresca: est(C.tierraFresca, { roughness: 1 }),
  vidrioDia: est(C.vidrio, { transparent: true, opacity: 0.32, roughness: 0.06, metalness: 0.4, envMapIntensity: 1.4, depthWrite: false }),
  vidrioNoche: new THREE.MeshBasicMaterial({ vertexColors: true }),
  piscina: est(C.piscina, { roughness: 0.1, metalness: 0.1, emissive: 0x0d3a52, emissiveIntensity: 0.6 }),
  madera: est(C.madera),
  arbol: est(C.arbol, { flatShading: true }),
  unidad: new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0, transparent: true, opacity: 0.92 }),
  grua: est(0xd9a640, { roughness: 0.6, metalness: 0.3 }),
};

// ---------- Ayudantes de geometría ----------
function B(w, h, d, x, y, z) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return g;
}
function unir(lista) {
  if (!lista.length) return null;
  const g = mergeGeometries(lista, false);
  lista.forEach((x) => x.dispose());
  return g;
}
function malla(geo, material, { sombra = true } = {}) {
  if (!geo) return null;
  const m = new THREE.Mesh(geo, material);
  m.castShadow = sombra;
  m.receiveShadow = true;
  return m;
}
// Columna H (HEB) de altura h, lado s
function columnaH(out, x, z, h, s = 0.4) {
  const tf = 0.045, tw = 0.03;
  out.push(B(s, h, tf, x, h / 2, z - s / 2 + tf / 2), B(s, h, tf, x, h / 2, z + s / 2 - tf / 2), B(tw, h, s - 2 * tf, x, h / 2, z));
}
// Viga I (IPE) entre dos puntos alineados con un eje, con el ala superior en yTop
function vigaI(out, eje, a0, a1, fijo, yTop, d = 0.45, b = 0.2) {
  const L = Math.abs(a1 - a0), m = (a0 + a1) / 2, tf = 0.035, tw = 0.025;
  const pieza = (ancho, alto, y) => (eje === 'x' ? B(L, alto, ancho, m, y, fijo) : B(ancho, alto, L, fijo, y, m));
  out.push(pieza(b, tf, yTop - tf / 2), pieza(b, tf, yTop - d + tf / 2), pieza(tw, d - 2 * tf, yTop - d / 2));
}
// Diagonal entre dos puntos (tubo cuadrado)
function diagonal(out, p0, p1, s = 0.22) {
  const a = new THREE.Vector3(...p0), b = new THREE.Vector3(...p1);
  const L = a.distanceTo(b);
  const g = new THREE.BoxGeometry(s, L, s);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  g.applyQuaternion(q);
  g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
  out.push(g);
  return L;
}
// Retícula de acero: columnas en cada cruce y vigas bajo la losa superior
function marco(out, xs, zs, h, kgCol) {
  let kg = 0;
  for (const x of xs) for (const z of zs) { columnaH(out, x, z, h); kg += h * kgCol; }
  const yv = h - LOSA;
  for (const z of zs) for (let i = 0; i < xs.length - 1; i++) { vigaI(out, 'x', xs[i], xs[i + 1], z, yv); kg += (xs[i + 1] - xs[i]) * KG.IPE450; }
  for (const x of xs) for (let i = 0; i < zs.length - 1; i++) { vigaI(out, 'z', zs[i], zs[i + 1], x, yv); kg += (zs[i + 1] - zs[i]) * KG.IPE450; }
  return kg;
}
const rango = (a, b, paso) => { const r = []; for (let v = a; v <= b + 1e-6; v += paso) r.push(+v.toFixed(3)); return r; };

// Fachada de vidrio con color por vértice (noche: ventanas encendidas al azar)
const CALIDOS = [0xffd9a0, 0xffe6bd, 0xf7c77e, 0xffefd6].map((c) => new THREE.Color(c));
const OSCUROS = [0x223040, 0x2a3846, 0x1d2834].map((c) => new THREE.Color(c));
function panelColor(g, color) {
  const n = g.attributes.position.count, arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) color.toArray(arr, i * 3);
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return g;
}
function fachada(vidrio, montantes, x0, x1, z0, z1, h, encendidas = 0.45, sep = 0.25) {
  const y0 = 0.06, y1 = h - LOSA - 0.04, hp = y1 - y0, yc = (y0 + y1) / 2;
  const lados = [
    { L: x1 - x0, pos: (t) => [x0 + t, z1 + sep], eje: 'x' },
    { L: x1 - x0, pos: (t) => [x0 + t, z0 - sep], eje: 'x' },
    { L: z1 - z0, pos: (t) => [x1 + sep, z0 + t], eje: 'z' },
    { L: z1 - z0, pos: (t) => [x0 - sep, z0 + t], eje: 'z' },
  ];
  for (const l of lados) {
    const n = Math.max(1, Math.round(l.L / 3)), w = l.L / n;
    for (let i = 0; i < n; i++) {
      const [x, z] = l.pos(w * (i + 0.5));
      const g = l.eje === 'x' ? B(w - 0.08, hp, 0.05, x, yc, z) : B(0.05, hp, w - 0.08, x, yc, z);
      const lit = azar() < encendidas;
      vidrio.push(panelColor(g, (lit ? CALIDOS : OSCUROS)[Math.floor(azar() * 3)]));
      const [mx, mz] = l.pos(w * i);
      montantes.push(l.eje === 'x' ? B(0.07, hp, 0.12, mx, yc, mz) : B(0.12, hp, 0.07, mx, yc, mz));
    }
  }
  // banda de borde de losa
  montantes.push(B(x1 - x0 + 2 * sep + 0.1, 0.4, 0.06, (x0 + x1) / 2, h - 0.2, z1 + sep), B(x1 - x0 + 2 * sep + 0.1, 0.4, 0.06, (x0 + x1) / 2, h - 0.2, z0 - sep));
  montantes.push(B(0.06, 0.4, z1 - z0 + 2 * sep, x1 + sep, h - 0.2, (z0 + z1) / 2), B(0.06, 0.4, z1 - z0 + 2 * sep, x0 - sep, h - 0.2, (z0 + z1) / 2));
}

// =================================================================
// Construcción del conjunto
// =================================================================
// Cada "pieza" es un nivel de una zona (podio o torre) con sus capas:
// acero, diagonales, losa, fachada y extras. Las capas se escalan en y
// para la simulación de obra y se ocultan para el corte.
const PIEZAS = [];
const conjunto = new THREE.Group();
escena.add(conjunto);

function nuevaPieza(nv, zona, torre, capas) {
  const g = new THREE.Group();
  g.position.y = NIVELES[nv].y;
  for (const k of Object.keys(capas)) if (capas[k]) g.add(capas[k]);
  conjunto.add(g);
  const p = { nv, zona, torre, grupo: g, ...capas, kg: 0, t: {} };
  PIEZAS.push(p);
  return p;
}

const xsPodio = rango(-ANCHO / 2, ANCHO / 2, LUZ);
const zsPodio = rango(-FONDO / 2, FONDO / 2, LUZ);

// --- Sótanos y podio ---
NIVELES.forEach((n, nv) => {
  if (n.tipo === 'torre') return;
  const acero = [], losa = [], vidrio = [], mont = [];
  const kg = marco(acero, xsPodio, zsPodio, n.h, KG.HEB400);
  losa.push(B(ANCHO + 0.6, LOSA, FONDO + 0.6, 0, -LOSA / 2 + 0.001, 0));
  let fac = null;
  if (n.tipo === 'sotano') {
    const m = [], e = 0.4, h = n.h;
    m.push(B(ANCHO + 2 * e, h, e, 0, h / 2, FONDO / 2 + e / 2 + 0.3), B(ANCHO + 2 * e, h, e, 0, h / 2, -FONDO / 2 - e / 2 - 0.3));
    m.push(B(e, h, FONDO + 0.6, ANCHO / 2 + e / 2 + 0.3, h / 2, 0), B(e, h, FONDO + 0.6, -ANCHO / 2 - e / 2 - 0.3, h / 2, 0));
    fac = malla(unir(m), MAT.concreto);
  } else {
    fachada(vidrio, mont, -ANCHO / 2, ANCHO / 2, -FONDO / 2, FONDO / 2, n.h, n.id === 'P1' ? 0.85 : 0.35, 0.35);
    acero.push(...mont);
    fac = malla(unir(vidrio), MAT.vidrioDia, { sombra: false });
  }
  const p = nuevaPieza(nv, 'podio', null, {
    acero: malla(unir(acero), MAT.acero),
    losa: malla(unir(losa), MAT.losa),
    fac,
  });
  p.kg = kg;
});

// --- Cubierta del podio: terraza con piscina, deck, jardineras y pérgola de acero ---
(() => {
  const nv = iNivel('P4');
  const losa = [B(ANCHO + 0.6, LOSA, FONDO + 0.6, 0, -LOSA / 2 + 0.001, 0)];
  const acero = [], madera = [], extra = [];
  // pretil perimetral
  acero.push(B(ANCHO + 0.8, 1.1, 0.08, 0, 0.55, FONDO / 2 + 0.36), B(0.08, 1.1, FONDO + 0.8, ANCHO / 2 + 0.36, 0.55, 0), B(0.08, 1.1, FONDO + 0.8, -ANCHO / 2 - 0.36, 0.55, 0));
  const piscinas = [];
  for (let i = 0; i < T - 1; i++) {
    const x = (TORRES[i].cx + TORRES[i + 1].cx) / 2;
    piscinas.push(B(8, 0.3, 14, x, 0.16, -6));
    madera.push(B(11, 0.12, 17, x, 0.06, -6));
  }
  if (T === 1) { piscinas.push(B(14, 0.3, 6, TORRES[0].cx, 0.16, 9)); madera.push(B(17, 0.12, 9, TORRES[0].cx, 0.06, 9)); }
  // pérgolas de acero sobre la terraza frontal
  for (const t of TORRES) {
    const z0 = 6, z1 = 13, x0 = t.cx - 9, x1 = t.cx + 9;
    for (const x of [x0, x1]) for (const z of [z0, z1]) acero.push(B(0.2, 3, 0.2, x, 1.5, z));
    for (let x = x0; x <= x1 + 0.01; x += 1.2) acero.push(B(0.08, 0.25, z1 - z0 + 0.4, x, 3.1, (z0 + z1) / 2));
    acero.push(B(x1 - x0 + 0.4, 0.3, 0.2, (x0 + x1) / 2, 3, z0), B(x1 - x0 + 0.4, 0.3, 0.2, (x0 + x1) / 2, 3, z1));
    madera.push(B(x1 - x0, 0.1, z1 - z0, (x0 + x1) / 2, 0.05, (z0 + z1) / 2));
  }
  // jardineras con árboles en el borde del parque
  const copas = [];
  for (let x = -ANCHO / 2 + 3; x <= ANCHO / 2 - 3; x += 6) {
    extra.push(B(2.2, 0.7, 2.2, x, 0.35, FONDO / 2 - 1.6));
    const c = new THREE.IcosahedronGeometry(1.5, 0); c.translate(x, 2.4, FONDO / 2 - 1.6); copas.push(c);
  }
  const grupoExtra = new THREE.Group();
  grupoExtra.add(malla(unir(piscinas), MAT.piscina), malla(unir(madera), MAT.madera), malla(unir(extra), MAT.concreto), malla(unir(copas), MAT.arbol));
  nuevaPieza(nv, 'podio', null, { acero: malla(unir(acero), MAT.acero), losa: malla(unir(losa), MAT.losa), extra: grupoExtra });
})();

// --- Torres ---
NIVELES.forEach((n, nv) => {
  if (n.tipo !== 'torre') return;
  const alto = n.piso >= Math.round((4 + NP) / 2);
  TORRES.forEach((t, ti) => {
    const xs = rango(t.cx - 9, t.cx + 9, LUZ), zs = rango(TZ - 9, TZ + 9, LUZ);
    const acero = [], rojo = [], losa = [], vidrio = [], mont = [];
    let kg = marco(acero, xs, zs, n.h, alto ? KG.HEB300 : KG.HEB400);
    // diagonales en X en la crujía central de dos caras: rigidizan la torre
    for (const z of [TZ - 9, TZ + 9]) {
      kg += diagonal(rojo, [t.cx - 3, 0.1, z], [t.cx + 3, n.h - LOSA - 0.1, z]) * KG.SHS200;
      kg += diagonal(rojo, [t.cx + 3, 0.1, z], [t.cx - 3, n.h - LOSA - 0.1, z]) * KG.SHS200;
    }
    for (const x of [t.cx - 9, t.cx + 9]) {
      kg += diagonal(rojo, [x, 0.1, TZ - 3], [x, n.h - LOSA - 0.1, TZ + 3]) * KG.SHS200;
      kg += diagonal(rojo, [x, 0.1, TZ + 3], [x, n.h - LOSA - 0.1, TZ - 3]) * KG.SHS200;
    }
    if (n.piso > 4) losa.push(B(LADO + 1.2, LOSA, LADO + 1.2, t.cx, -LOSA / 2 + 0.001, TZ));
    const encendidas = 0.12 + 0.36 * azar();
    fachada(vidrio, mont, t.cx - 9, t.cx + 9, TZ - 9, TZ + 9, n.h, encendidas, 0.6);
    acero.push(...mont);
    const p = nuevaPieza(nv, 'torre', ti, {
      acero: malla(unir(acero), MAT.acero),
      rojo: malla(unir(rojo), MAT.rojo),
      losa: malla(unir(losa), MAT.losa),
      fac: malla(unir(vidrio), MAT.vidrioDia, { sombra: false }),
    });
    p.kg = kg;
  });
});

// --- Cubiertas y coronas de las torres ---
const nvCubierta = NIVELES.length;   // índice virtual por encima del último piso
TORRES.forEach((t, ti) => {
  const losa = [B(LADO + 1.2, LOSA, LADO + 1.2, t.cx, -LOSA / 2, TZ)];
  const acero = [], rojo = [];
  const hc = 5;
  for (const x of [t.cx - 9, t.cx + 9]) for (const z of [TZ - 9, TZ + 9]) columnaH(acero, x, z, hc);
  for (const z of [TZ - 9, TZ + 9]) vigaI(acero, 'x', t.cx - 9, t.cx + 9, z, hc);
  for (const x of [t.cx - 9, t.cx + 9]) vigaI(acero, 'z', TZ - 9, TZ + 9, x, hc);
  for (const z of [TZ - 9, TZ + 9]) { diagonal(rojo, [t.cx - 9, 0.2, z], [t.cx, hc - 0.2, z]); diagonal(rojo, [t.cx + 9, 0.2, z], [t.cx, hc - 0.2, z]); }
  for (const x of [t.cx - 9, t.cx + 9]) { diagonal(rojo, [x, 0.2, TZ - 9], [x, hc - 0.2, TZ]); diagonal(rojo, [x, 0.2, TZ + 9], [x, hc - 0.2, TZ]); }
  acero.push(B(6, 3, 6, t.cx, 1.5, TZ));   // cuarto de máquinas
  const p = nuevaPieza(NIVELES.length - 1, 'cubierta', ti, {
    acero: malla(unir(acero), MAT.acero), rojo: malla(unir(rojo), MAT.rojo), losa: malla(unir(losa), MAT.losa),
  });
  p.grupo.position.y = TOPE;
  p.nv = nvCubierta;
});

const KG_TOTAL = PIEZAS.reduce((s, p) => s + p.kg, 0);

// --- Terreno con el hueco de la excavación, muros de tierra y tapa de excavación ---
const PROF = NS * HS + 0.6;
const terreno = (() => {
  const s = new THREE.Shape();
  s.moveTo(-500, -500); s.lineTo(500, -500); s.lineTo(500, 500); s.lineTo(-500, 500); s.lineTo(-500, -500);
  const h = new THREE.Path(), hx = ANCHO / 2 + 0.7, hz = FONDO / 2 + 0.7;
  h.moveTo(-hx, -hz); h.lineTo(-hx, hz); h.lineTo(hx, hz); h.lineTo(hx, -hz); h.lineTo(-hx, -hz);
  s.holes.push(h);
  const g = new THREE.ShapeGeometry(s);
  g.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(g, est(C.suelo, { roughness: 1 }));
  m.receiveShadow = true;
  escena.add(m);
  const hx2 = hx + 0.5, hz2 = hz + 0.5;
  const muros = malla(unir([
    B(2 * hx2, PROF, 1, 0, -PROF / 2, hz2), B(2 * hx2, PROF, 1, 0, -PROF / 2, -hz2),
    B(1, PROF, 2 * hz2, hx2, -PROF / 2, 0), B(1, PROF, 2 * hz2, -hx2, -PROF / 2, 0),
  ]), MAT.tierra, { sombra: false });
  escena.add(muros);
  return m;
})();
const tapa = new THREE.Mesh(new THREE.PlaneGeometry(ANCHO + 1.4, FONDO + 1.4).rotateX(-Math.PI / 2), MAT.tierraFresca);
tapa.receiveShadow = true;
tapa.visible = false;
escena.add(tapa);

// Curvas de nivel, calle, parque y vecinos (contexto)
const contexto = new THREE.Group();
escena.add(contexto);
(() => {
  const lm = new THREE.LineBasicMaterial({ color: C.linea, transparent: true, opacity: 0.35 });
  for (let k = 0; k < 7; k++) {
    const pts = [];
    for (let a = 0; a <= 64; a++) {
      const ang = (a / 64) * Math.PI * 2, r = 120 + k * 26 + 14 * Math.sin(ang * 3 + k) + 8 * Math.cos(ang * 5 - k);
      pts.push(new THREE.Vector3(Math.cos(ang) * r * 1.3, 0.02, Math.sin(ang) * r * 0.8 - 60));
    }
    contexto.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), lm));
  }
  const calle = new THREE.Mesh(new THREE.PlaneGeometry(900, 14).rotateX(-Math.PI / 2), est(0x1b1e21, { roughness: 1 }));
  calle.position.set(0, 0.015, FONDO / 2 + 10);
  calle.receiveShadow = true;
  contexto.add(calle);
  const raya = new THREE.Mesh(new THREE.PlaneGeometry(900, 0.25).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x8a8a80 }));
  raya.position.set(0, 0.03, FONDO / 2 + 10);
  contexto.add(raya);
  const parque = new THREE.Mesh(new THREE.PlaneGeometry(ANCHO + 120, 70).rotateX(-Math.PI / 2), est(C.parque, { roughness: 1 }));
  parque.position.set(0, 0.02, FONDO / 2 + 52);
  parque.receiveShadow = true;
  parque.userData.dia = C.parqueDia; parque.userData.noche = C.parque;
  contexto.add(parque);
  // árboles del parque
  const n = 140, copa = new THREE.IcosahedronGeometry(2.4, 0), tronco = new THREE.CylinderGeometry(0.18, 0.25, 3, 5);
  const copas = new THREE.InstancedMesh(copa, MAT.arbol, n), troncos = new THREE.InstancedMesh(tronco, MAT.madera, n);
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < n; i++) {
    const x = (azar() - 0.5) * (ANCHO + 110), z = FONDO / 2 + 22 + azar() * 58, s = 0.7 + azar() * 0.8;
    m4.compose(new THREE.Vector3(x, 3 + 2.2 * s, z), new THREE.Quaternion(), new THREE.Vector3(s, s * 1.1, s));
    copas.setMatrixAt(i, m4);
    m4.compose(new THREE.Vector3(x, 1.5, z), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
    troncos.setMatrixAt(i, m4);
  }
  copas.castShadow = troncos.castShadow = true;
  contexto.add(copas, troncos);
  // volúmenes vecinos
  const vec = [];
  for (let i = 0; i < 26; i++) {
    const lado = azar() < 0.5 ? -1 : 1, x = lado * (ANCHO / 2 + 18 + azar() * 90), z = -FONDO / 2 - 70 + azar() * 90;
    const w = 12 + azar() * 16, d = 12 + azar() * 16, h = 6 + azar() * 26;
    vec.push(B(w, h, d, x, h / 2, z));
  }
  for (let i = 0; i < 10; i++) { const w = 14 + azar() * 14, h = 8 + azar() * 30; vec.push(B(w, h, 14, -ANCHO / 2 - 20 + i * (ANCHO + 40) / 9, h / 2, -FONDO / 2 - 34 - azar() * 20)); }
  const vecinos = malla(unir(vec), est(C.vecino, { roughness: 0.95 }));
  vecinos.userData.dia = C.vecinoDia; vecinos.userData.noche = C.vecino;
  contexto.add(vecinos);
})();

// Grúas torre (solo en obra)
const GRUAS = TORRES.map((t) => {
  const g = new THREE.Group();
  const mastil = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1, 1.4).translate(0, 0.5, 0), MAT.grua);
  const pluma = new THREE.Mesh(new THREE.BoxGeometry(34, 1, 1).translate(9, 0, 0), MAT.grua);
  const contra = new THREE.Mesh(new THREE.BoxGeometry(3, 2.4, 2).translate(-7, -0.6, 0), MAT.concreto);
  const cable = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1, 0.06).translate(0, -0.5, 0), MAT.acero);
  cable.position.x = 18;
  g.add(mastil, pluma, contra, cable);
  [mastil, pluma, contra].forEach((m) => { m.castShadow = true; });
  g.position.set(t.cx, 0, TZ);
  g.visible = false;
  g.userData = { mastil, pluma, contra, cable };
  escena.add(g);
  return g;
});

// --- Apartamentos (ventas): 4 por piso de torre ---
const TIPOS = [
  { tip: '3 habitaciones · esquinero', m2: 86.4, dx: -4.5, dz: 4.5 },
  { tip: '2 habitaciones + estudio', m2: 72.8, dx: 4.5, dz: 4.5 },
  { tip: '2 habitaciones', m2: 64.3, dx: 4.5, dz: -4.5 },
  { tip: '1 habitación + balcón', m2: 48.9, dx: -4.5, dz: -4.5 },
];
const UNIDADES = [];
NIVELES.forEach((n, nv) => {
  if (n.tipo !== 'torre') return;
  TORRES.forEach((t, ti) => TIPOS.forEach((tp, k) => {
    const r = azar(), bajo = (n.piso - 4) / Math.max(1, NP - 4);
    const estado = r < 0.36 + 0.2 * (1 - bajo) ? 'vendido' : r < 0.5 + 0.12 * (1 - bajo) ? 'apartado' : 'disponible';
    UNIDADES.push({
      nv, torre: ti, piso: n.piso, num: n.piso * 100 + k + 1, ...tp,
      vista: tp.dz > 0 ? 'vista al parque' : 'vista a los cerros', estado,
      pos: new THREE.Vector3(t.cx + tp.dx, n.y + (HT - LOSA) / 2, TZ + tp.dz),
      precio: Math.round(tp.m2 * (7.1 + 0.09 * (n.piso - 4)) * (tp.dz > 0 ? 1.06 : 1)),   // millones COP, referencia
    });
  }));
});
const unidadesMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(8.4, HT - LOSA - 0.25, 8.4), MAT.unidad, UNIDADES.length);
unidadesMesh.visible = false;
escena.add(unidadesMesh);
const COLOR_ESTADO = { disponible: new THREE.Color(C.disponible), apartado: new THREE.Color(C.apartado), vendido: new THREE.Color(C.vendido) };
const filtros = { disponible: true, apartado: true, vendido: true };
let unidadSel = null;
function pintarUnidades() {
  const m4 = new THREE.Matrix4(), cero = new THREE.Matrix4().makeScale(0, 0, 0), blanco = new THREE.Color(0xffffff);
  UNIDADES.forEach((u, i) => {
    unidadesMesh.setMatrixAt(i, filtros[u.estado] ? m4.makeTranslation(u.pos.x, u.pos.y, u.pos.z) : cero);
    unidadesMesh.setColorAt(i, u === unidadSel ? blanco : COLOR_ESTADO[u.estado]);
  });
  unidadesMesh.instanceMatrix.needsUpdate = true;
  unidadesMesh.instanceColor.needsUpdate = true;
  unidadesMesh.computeBoundingSphere();
}
pintarUnidades();
const marcoSel = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(8.7, HT - 0.2, 8.7)), new THREE.LineBasicMaterial({ color: 0xffffff }));
marcoSel.visible = false;
escena.add(marcoSel);

// Volúmenes fantasma para el corte (contexto de lo que se quitó)
const fantasma = new THREE.Group();
(() => {
  const lm = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 });
  const caja = (w, h, d, x, y, z) => { const l = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), lm); l.position.set(x, y, z); fantasma.add(l); };
  caja(ANCHO, Y4, FONDO, 0, Y4 / 2, 0);
  TORRES.forEach((t) => caja(LADO, TOPE - Y4, LADO, t.cx, (TOPE + Y4) / 2, TZ));
  fantasma.visible = false;
  escena.add(fantasma);
})();

// Planta del nivel cortado (muros interiores, núcleos, cajones)
const planta = new THREE.Group();
escena.add(planta);
const ETIQUETAS = [];
const capaEtiquetas = document.getElementById('etiquetas');
function etiqueta(texto, pos, osc = false) {
  const el = document.createElement('div');
  el.className = 'cm-et' + (osc ? ' osc' : '');
  el.textContent = texto;
  capaEtiquetas.appendChild(el);
  ETIQUETAS.push({ el, pos });
}
function limpiarPlanta() {
  planta.children.slice().forEach((c) => { planta.remove(c); c.geometry?.dispose(); });
  ETIQUETAS.splice(0).forEach((e) => e.el.remove());
}
function dibujarPlanta(nv) {
  limpiarPlanta();
  const n = NIVELES[nv];
  if (!n) return 0;
  const y = n.y, muros = [], nucleos = [];
  let cajones = 0;
  if (n.tipo === 'sotano') {
    const pts = [], w = 2.5, x0 = -ANCHO / 2 + 1.5, cuantos = Math.floor((ANCHO - 3) / w);
    for (const [za, zb] of [[-14.6, -9.6], [-3.4, 1.6], [1.6, 6.6]]) {
      for (let i = 0; i <= cuantos; i++) pts.push(new THREE.Vector3(x0 + i * w, y + 0.03, za), new THREE.Vector3(x0 + i * w, y + 0.03, zb));
      cajones += cuantos;
    }
    // rampa y núcleos de escalera
    nucleos.push(B(6, 0.12, 6, ANCHO / 2 - 4.5, y + 0.06, 10.5));
    TORRES.forEach((t) => nucleos.push(B(5, n.h - LOSA, 5, t.cx, y + (n.h - LOSA) / 2, TZ)));
    planta.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xe9e6df, transparent: true, opacity: 0.75 })));
    etiqueta(`${cajones} cajones`, new THREE.Vector3(0, y + 0.5, -12), true);
    etiqueta('Rampa', new THREE.Vector3(ANCHO / 2 - 4.5, y + 0.8, 10.5));
  } else if (n.tipo === 'podio') {
    for (let x = -ANCHO / 2 + 6; x < ANCHO / 2; x += 6) muros.push(B(0.15, 2.8, 10, x, y + 1.4, 10));
    muros.push(B(ANCHO, 2.8, 0.15, 0, y + 1.4, 5));
    TORRES.forEach((t) => { nucleos.push(B(5, n.h - LOSA, 5, t.cx, y + (n.h - LOSA) / 2, TZ)); etiqueta(n.id === 'P1' ? `Lobby torre ${t.id}` : `Amenidades ${t.id}`, new THREE.Vector3(t.cx, y + 3, TZ + 5)); });
    if (n.id === 'P1') etiqueta('Locales comerciales', new THREE.Vector3(0, y + 3.2, 10), true);
  } else {
    TORRES.forEach((t) => {
      nucleos.push(B(5, n.h - LOSA, 5, t.cx, y + (n.h - LOSA) / 2, TZ));
      muros.push(B(18, 2.7, 0.15, t.cx, y + 1.35, TZ), B(0.15, 2.7, 18, t.cx, y + 1.35, TZ));
      // particiones interiores de cada apartamento
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
        muros.push(B(0.1, 2.7, 4.2, t.cx + sx * 4.5, y + 1.35, TZ + sz * 6.6), B(4.2, 2.7, 0.1, t.cx + sx * 6.6, y + 1.35, TZ + sz * 4.5));
      }
      TIPOS.forEach((tp, k) => etiqueta(String(n.piso * 100 + k + 1), new THREE.Vector3(t.cx + tp.dx * 1.15, y + 1.6, TZ + tp.dz * 1.15)));
    });
  }
  if (muros.length) planta.add(malla(unir(muros), est(0xf3f1ec)));
  if (nucleos.length) planta.add(malla(unir(nucleos), est(0x2c3136)));
  return cajones;
}

// =================================================================
// Ambientes de luz
// =================================================================
function cieloTextura(arriba, horizonte, abajo) {
  const cv = document.createElement('canvas'); cv.width = 4; cv.height = 256;
  const ctx = cv.getContext('2d'), gr = ctx.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, arriba); gr.addColorStop(0.58, horizonte); gr.addColorStop(1, abajo);
  ctx.fillStyle = gr; ctx.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const CIELOS = {
  noche: cieloTextura('#0b0e14', '#1d2430', '#16191c'),
  estudio: cieloTextura('#202428', '#2a2e33', '#16191c'),
  dorada: cieloTextura('#5f7fa6', '#f0b878', '#d89a6a'),
};
const pmrem = new THREE.PMREMGenerator(renderer);
const REFLEJOS = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
function ambiente(k) {
  escena.background = CIELOS[k];
  MAT.vidrioDia.envMap = k === 'noche' ? null : REFLEJOS;   // reflejos solo en el vidrio (barato en celulares)
  MAT.vidrioDia.needsUpdate = true;
  MAT.vidrioDia.opacity = k === 'dorada' ? 0.55 : 0.32;
  const dia = k === 'dorada';
  if (k === 'noche') {
    hemi.color.set(0x6f7f99); hemi.groundColor.set(0x14161a); hemi.intensity = 0.55;
    sol.color.set(0x9fb2d6); sol.intensity = 0.55; sol.position.set(-120, 160, 60);
    renderer.toneMappingExposure = 1.0;
    escena.fog = new THREE.Fog(0x16191c, 260, 700);
  } else if (k === 'estudio') {
    hemi.color.set(0xf2f0ea); hemi.groundColor.set(0x3a3a3a); hemi.intensity = 1.1;
    sol.color.set(0xfff4e6); sol.intensity = 1.9; sol.position.set(-90, 150, 110);
    renderer.toneMappingExposure = 1.0;
    escena.fog = new THREE.Fog(0x1d2125, 280, 750);
  } else {
    hemi.color.set(0xffe1bd); hemi.groundColor.set(0x4a3b2f); hemi.intensity = 1.0;
    sol.color.set(0xffb070); sol.intensity = 3.0; sol.position.set(-160, 60, 140);
    renderer.toneMappingExposure = 1.05;
    escena.fog = new THREE.Fog(0xe5b184, 240, 800);
  }
  terreno.material.color.set(dia ? C.sueloDia : C.suelo);
  contexto.traverse((o) => { if (o.userData.dia) o.material.color.set(dia ? o.userData.dia : o.userData.noche); });
  const vidrio = k === 'noche' ? MAT.vidrioNoche : MAT.vidrioDia;
  PIEZAS.forEach((p) => { if (p.fac && p.fac.material !== MAT.concreto) p.fac.material = vidrio; });
  MAT.piscina.emissiveIntensity = k === 'noche' ? 1.4 : 0.4;
}

// =================================================================
// Estado y visibilidad
// =================================================================
let modo = 'aerea';
let nvCorte = iNivel('P12') >= 0 ? iNivel('P12') : NIVELES.length - 1;
let tObra = 0.42, obraPlay = false;

// Programa de obra: cada capa recibe el instante (0–1) en que aparece.
const INICIO_TORRES = (() => {
  const EXC = 0.08, PS = 0.032, PP = 0.03;
  PIEZAS.forEach((p) => {
    const n = NIVELES[p.nv];
    if (p.zona === 'podio' && n?.tipo === 'sotano') {
      const t0 = EXC + p.nv * PS;   // del sótano más profundo hacia arriba
      p.t = { acero: t0, losa: t0 + 0.012, fac: t0 - 0.004, rojo: t0, extra: t0 };
    } else if (p.zona === 'podio') {
      const orden = p.nv - NS;
      const t0 = EXC + NS * PS + orden * PP;
      p.t = { acero: t0, losa: t0 + 0.012, fac: t0 + 0.03 + 0.04, rojo: t0, extra: t0 + 0.02 };
    }
  });
  const inicio = EXC + NS * PS + 4 * PP, desfase = 0.06, fin = 0.95, retraso = 0.07;
  const tramo = Math.max(0.2, fin - retraso - inicio - (T - 1) * desfase);
  const nTorre = NP - 3;
  PIEZAS.forEach((p) => {
    if (p.zona !== 'torre' && p.zona !== 'cubierta') return;
    const f = p.zona === 'cubierta' ? nTorre : NIVELES[p.nv].piso - 4;
    const t0 = inicio + p.torre * desfase + (f / nTorre) * tramo;
    p.t = { acero: t0, rojo: t0 + 0.006, losa: t0 + 0.02, fac: t0 + retraso, extra: t0 };
  });
  return inicio;
})();
const CAPAS = ['acero', 'rojo', 'losa', 'fac', 'extra'];
const crecer = (t, t0) => Math.min(1, Math.max(0, (t - t0) / 0.018));

function aplicarVisibilidad() {
  const enVentas = modo === 'ventas';
  PIEZAS.forEach((p) => {
    let visible = true;
    if (modo === 'corte') visible = p.nv <= nvCorte;
    p.grupo.visible = visible;
    for (const k of CAPAS) {
      const m = p[k];
      if (!m) continue;
      let s = 1, v = true;
      if (modo === 'obra') { s = crecer(tObra, p.t[k] ?? 0); v = s > 0.001; }
      if (modo === 'corte' && k === 'fac' && p.nv === nvCorte && p.fac.material !== MAT.concreto) v = false;
      if (enVentas && k === 'fac' && (p.zona === 'torre')) v = false;
      m.visible = v;
      m.scale.y = Math.max(s, 0.0001);
    }
  });
  unidadesMesh.visible = enVentas;
  marcoSel.visible = enVentas && !!unidadSel;
  fantasma.visible = modo === 'corte';
  tapa.visible = modo === 'obra';
  GRUAS.forEach((g) => { g.visible = false; });
  if (modo === 'obra') actualizarObra3D();
}

function actualizarObra3D() {
  const exc = Math.min(1, tObra / 0.08);
  tapa.position.y = -PROF * exc + 0.02;
  TORRES.forEach((t, ti) => {
    const piezas = PIEZAS.filter((p) => p.torre === ti && p.zona === 'torre');
    const hechas = piezas.filter((p) => tObra >= p.t.acero);
    const g = GRUAS[ti];
    const terminada = tObra > piezas[piezas.length - 1].t.fac + 0.02;
    g.visible = tObra >= piezas[0].t.acero - 0.04 && !terminada;
    const alto = hechas.length ? NIVELES[hechas[hechas.length - 1].nv].y + HT : Y4;
    const h = alto + 9;
    g.userData.mastil.scale.y = h;
    g.userData.pluma.position.y = h + 0.5;
    g.userData.contra.position.y = h + 0.5;
    g.userData.cable.position.y = h;
    g.userData.cable.scale.y = 7 + 3 * Math.sin(tObra * 90 + ti);
    g.rotation.y = tObra * 40 + ti * 1.7;
  });
}

// =================================================================
// Interfaz
// =================================================================
const $ = (id) => document.getElementById(id);
const card = $('card');
const fmt = (n, d = 0) => n.toLocaleString('es-CO', { maximumFractionDigits: d, minimumFractionDigits: d });
$('nombreProyecto').textContent = NOMBRE;
document.title = `${NOMBRE} · Centro de mando — AceroStudio`;

// Regla de niveles
const lista = $('listaNiveles');
NIVELES.slice().reverse().forEach((n) => {
  const li = document.createElement('li');
  li.innerHTML = `<button type="button" data-nv="${iNivel(n.id)}"><span>${cota(n.y)}</span><b>${n.id}</b></button>`;
  lista.appendChild(li);
});
lista.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-nv]');
  if (!b) return;
  if (modo !== 'corte') setModo('corte', { sinVuelo: true });
  setCorte(+b.dataset.nv);
});
function marcarRegla() {
  lista.querySelectorAll('button').forEach((b) => {
    const on = +b.dataset.nv === nvCorte;
    b.classList.toggle('activo', on);
    if (on) b.scrollIntoView({ block: 'nearest' });
  });
}

function setCorte(nv, { vuelo = true } = {}) {
  nvCorte = Math.max(0, Math.min(NIVELES.length - 1, nv));
  const n = NIVELES[nvCorte];
  const cajones = dibujarPlanta(nvCorte);
  aplicarVisibilidad();
  marcarRegla();
  const kgNivel = PIEZAS.filter((p) => p.nv === nvCorte).reduce((s, p) => s + p.kg, 0);
  const deptos = n.tipo === 'torre' ? T * 4 : 0;
  const area = n.tipo === 'torre' ? T * LADO * LADO : ANCHO * FONDO;
  card.innerHTML = `
    <div class="k"><span>Corte por nivel</span><span class="sim mono">N±0.00 = acceso</span></div>
    <h2>${n.nombre}</h2>
    <p class="mono">Cota ${cota(n.y)} m · altura libre ${fmt(n.h - LOSA, 2)} m</p>
    <div class="grid">
      <div class="celda"><span>Área</span><b class="mono">${fmt(area)} m²</b></div>
      <div class="celda"><span>Acero del nivel</span><b class="mono">${fmt(kgNivel / 1000, 1)} t</b></div>
      <div class="celda"><span>${n.tipo === 'sotano' ? 'Cajones' : n.tipo === 'torre' ? 'Apartamentos' : 'Uso'}</span><b class="mono">${n.tipo === 'sotano' ? cajones : n.tipo === 'torre' ? deptos : n.id === 'P1' ? 'Comercio' : 'Amenidades'}</b></div>
    </div>
    <div class="leyenda"><span><i style="background:#3a3f45"></i>Columnas HEB · vigas IPE</span><span><i style="background:#b8261c"></i>Diagonales SHS</span></div>`;
  if (vuelo) {
    const y = n.y, d = Math.max(ANCHO, 60) * (n.tipo === 'torre' ? 1 : 0.9);
    volar(new THREE.Vector3(d * 0.32, y + d * 0.95, d * 0.62), new THREE.Vector3(0, y, n.tipo === 'torre' ? TZ : 0), 1.1, { lejos: true });
  }
}

// Obra
const FASES = [
  [0, 'Excavación y contención', 'Se abre el predio hasta el fondo del sótano ' + NS + ' con muros de contención.'],
  [0.08, 'Sótanos', `Estructura de acero de S${NS} a S1, columnas HEB embebidas y losas sobre steel deck.`],
  [0.08 + NS * 0.032, 'Podio', 'Tres niveles de comercio y amenidades sobre una retícula de 6 × 6 m.'],
  [null, 'Torres', 'Las torres se montan en secuencia: primero el acero, luego la losa y al final la fachada.'],
  [0.955, 'Entrega', 'Fachadas cerradas, terraza con piscina y paisajismo terminados.'],
];
function faseActual(t) {
  const lista = FASES.map((f) => [f[0] ?? INICIO_TORRES, f[1], f[2]]);
  let f = lista[0];
  for (const x of lista) if (t >= x[0]) f = x;
  return f;
}
function estadoTorre(ti, t) {
  const piezas = PIEZAS.filter((p) => p.torre === ti && p.zona === 'torre');
  if (t < piezas[0].t.acero) return 'por iniciar';
  const ultima = piezas[piezas.length - 1];
  if (t >= ultima.t.fac + 0.02) return 'terminada';
  if (t >= ultima.t.acero) return 'fachada';
  const hechas = piezas.filter((p) => t >= p.t.acero);
  return 'acero · P' + NIVELES[hechas[hechas.length - 1].nv].piso;
}
function pintarObra() {
  const f = faseActual(tObra);
  const kg = PIEZAS.reduce((s, p) => s + p.kg * crecer(tObra, p.t.acero ?? 0), 0);
  const MESES = 30;
  card.innerHTML = `
    <div class="k"><span>Obra</span><span class="sim mono">simulación</span></div>
    <h2>${f[1]}</h2>
    <p>${f[2]}</p>
    <div class="fila"><span>Avance del programa · mes ${Math.max(1, Math.ceil(tObra * MESES))} de ${MESES}</span><b>${Math.round(tObra * 100)} %</b></div>
    <div class="barra"><i style="width:${tObra * 100}%"></i></div>
    <div class="fila"><span>Acero montado</span><b>${fmt(kg / 1000)} / ${fmt(KG_TOTAL / 1000)} t</b></div>
    <div class="grid" style="--n:${T}">${TORRES.map((t, i) => `<div class="celda"><span>Torre ${t.id}</span><b>${estadoTorre(i, tObra)}</b></div>`).join('')}</div>
    <div class="ctrl">
      <button type="button" class="play" id="obraPlay" aria-label="${obraPlay ? 'Pausar' : 'Reproducir'}">${obraPlay ? '❚❚' : '▶'}</button>
      <input type="range" id="obraT" min="0" max="1000" value="${Math.round(tObra * 1000)}" aria-label="Avance de obra">
    </div>`;
  $('obraPlay').onclick = () => { obraPlay = !obraPlay; if (obraPlay && tObra >= 0.999) tObra = 0; pintarObra(); };
  $('obraT').oninput = (e) => { obraPlay = false; tObra = e.target.value / 1000; aplicarVisibilidad(); pintarObraLigero(); };
}
// Actualiza solo textos y barra (sin rehacer el control deslizante mientras se arrastra)
function pintarObraLigero() {
  const r = $('obraT');
  if (!r) return pintarObra();
  const f = faseActual(tObra), kg = PIEZAS.reduce((s, p) => s + p.kg * crecer(tObra, p.t.acero ?? 0), 0);
  card.querySelector('h2').textContent = f[1];
  card.querySelector('p').textContent = f[2];
  const filas = card.querySelectorAll('.fila');
  filas[0].innerHTML = `<span>Avance del programa · mes ${Math.max(1, Math.ceil(tObra * 30))} de 30</span><b>${Math.round(tObra * 100)} %</b>`;
  filas[1].querySelector('b').textContent = `${fmt(kg / 1000)} / ${fmt(KG_TOTAL / 1000)} t`;
  card.querySelector('.barra i').style.width = tObra * 100 + '%';
  card.querySelectorAll('.grid .celda b').forEach((b, i) => { b.textContent = estadoTorre(i, tObra); });
  if (document.activeElement !== r) r.value = Math.round(tObra * 1000);
  $('obraPlay').textContent = obraPlay ? '❚❚' : '▶';
}

// Ventas
function conteo() {
  const c = { disponible: 0, apartado: 0, vendido: 0 };
  UNIDADES.forEach((u) => c[u.estado]++);
  return c;
}
const ETQ = { disponible: 'Disponible', apartado: 'Separado', vendido: 'Vendido' };
function pintarVentas() {
  if (unidadSel) return pintarFicha(unidadSel);
  const c = conteo(), tot = UNIDADES.length;
  card.innerHTML = `
    <div class="k"><span>Ventas · ${tot} apartamentos</span><span class="sim mono">simulación</span></div>
    <ul class="estados">${Object.keys(c).map((k) => `
      <li><button type="button" data-f="${k}" class="${filtros[k] ? '' : 'off'}" aria-pressed="${filtros[k]}">
        <span class="pt" style="background:#${COLOR_ESTADO[k].getHexString()}"></span><span>${ETQ[k]}</span><b>${c[k]}</b>
        <span class="b"><i style="width:${(c[k] / tot) * 100}%;background:#${COLOR_ESTADO[k].getHexString()}"></i></span>
      </button></li>`).join('')}</ul>
    <p style="margin-top:10px">Toca un apartamento para ver su ficha. Toca un estado para filtrarlo.</p>`;
  card.querySelectorAll('[data-f]').forEach((b) => { b.onclick = () => { filtros[b.dataset.f] = !filtros[b.dataset.f]; pintarUnidades(); pintarVentas(); }; });
}
function pintarFicha(u) {
  const t = TORRES[u.torre];
  const msg = encodeURIComponent(`Hola, me interesa el apartamento ${u.num} de la torre ${t.id} en ${NOMBRE} (${fmt(u.m2, 2)} m²).`);
  card.innerHTML = `
    <div class="k"><span>Torre ${t.id} · Apto ${u.num}</span><button type="button" class="cerrar" id="cerrarFicha">Cerrar</button></div>
    <h2>${u.tip}</h2>
    <p>${u.vista[0].toUpperCase() + u.vista.slice(1)} · estructura en acero</p>
    <div class="grid" style="--n:2">
      <div class="celda"><span>Área</span><b class="mono">${fmt(u.m2, 2)} m²</b></div>
      <div class="celda"><span>Piso</span><b class="mono">${u.piso}</b></div>
      <div class="celda"><span>Cota</span><b class="mono">${cota(NIVELES[u.nv].y)}</b></div>
      <div class="celda"><span>Estado (sim.)</span><b><i style="font-style:normal;color:#${COLOR_ESTADO[u.estado].getHexString()}">●</i> ${ETQ[u.estado]}</b></div>
    </div>
    <div class="fila"><span>Precio de referencia (sim.)</span><b>$ ${fmt(u.precio)} M</b></div>
    ${u.estado !== 'vendido' ? `<a class="cta" href="https://wa.me/${WHATSAPP}?text=${msg}" target="_blank" rel="noopener">Cotizar por WhatsApp →</a>` : ''}`;
  $('cerrarFicha').onclick = () => seleccionar(null);
}
function seleccionar(u, { vuelo = true } = {}) {
  unidadSel = u;
  pintarUnidades();
  marcoSel.visible = !!u;
  if (u) {
    marcoSel.position.copy(u.pos);
    if (vuelo) volar(u.pos.clone().add(new THREE.Vector3(38, 16, 58)), u.pos.clone(), 0.9, { lejos: true });
  }
  pintarVentas();
}

// Aérea
function pintarAerea() {
  card.innerHTML = `
    <div class="k"><span>Vista aérea</span><span class="sim mono">${cota(TOPE)} m</span></div>
    <h2>${NOMBRE}</h2>
    <p>${T} ${T === 1 ? 'torre' : 'torres'} de ${NP} pisos sobre un podio comercial, ${NS} sótanos. Todo en estructura de acero.</p>
    <div class="grid">
      <div class="celda"><span>Apartamentos</span><b class="mono">${UNIDADES.length}</b></div>
      <div class="celda"><span>Acero estructural</span><b class="mono">${fmt(KG_TOTAL / 1000)} t</b></div>
      <div class="celda"><span>Área construida</span><b class="mono">${fmt(T * LADO * LADO * (NP - 3) + ANCHO * FONDO * (3 + NS))} m²</b></div>
    </div>`;
}

// Dron
const xA = TORRES[0].cx, xB = TORRES[Math.min(1, T - 1)].cx, xZ = TORRES[T - 1].cx;
const xPiscina = T > 1 ? (xA + xB) / 2 : xA;
const DRON = [
  { p: [0, 24, 138], o: [0, 26, 0], t: 'Llegada desde el parque', s: `${T === 1 ? 'La torre' : 'Las ' + T + ' torres'} sobre el podio, de frente al parque` },
  { p: [-ANCHO / 2 - 18, 19, 50], o: [-ANCHO / 2 + 12, 6, 12], t: 'Plaza y locales', s: 'Fachada comercial de vidrio en el piso 1' },
  { p: [xPiscina + 6, 24, 30], o: [xPiscina, Y4, -6], t: 'Terraza con piscina', s: `Cota ${cota(Y4)}${T > 1 ? ', entre las torres A y B' : ''}` },
  { p: [xB + 24, Y4 + (TOPE - Y4) * 0.45, 22], o: [xB, Y4 + (TOPE - Y4) * 0.5, TZ], t: 'Acero a la vista', s: 'Diagonales que rigidizan cada torre ante el sismo' },
  { p: [xZ + 22, TOPE + 16, 14], o: [xZ, TOPE, TZ], t: 'Cubierta y corona', s: `Cota ${cota(TOPE)} · corona en acero` },
  { p: [ANCHO / 2 + 85, 70, 120], o: [0, 22, -4], t: 'Vista general', s: NOMBRE },
];
const curvaPos = new THREE.CatmullRomCurve3(DRON.map((k) => new THREE.Vector3(...k.p)), false, 'catmullrom', 0.3);
const curvaObj = new THREE.CatmullRomCurve3(DRON.map((k) => new THREE.Vector3(...k.o)), false, 'catmullrom', 0.3);
const DRON_SEG = 26;
let dron = { u: 0, play: false };
function pintarDron() {
  const i = Math.min(DRON.length - 1, Math.floor(dron.u * (DRON.length - 1) + 0.35));
  const k = DRON[i];
  card.innerHTML = `
    <div class="k"><span>Recorrido en dron</span><button type="button" class="cerrar" id="dronPlay">${dron.play ? 'Pausar' : dron.u >= 1 ? 'Repetir' : 'Seguir'}</button></div>
    <h2>${k.t}</h2>
    <p>${k.s}</p>
    <div class="fila"><span>Avance del recorrido</span><b>${Math.round(dron.u * 100)} %</b></div>
    <div class="barra"><i style="width:${dron.u * 100}%"></i></div>`;
  $('dronPlay').onclick = () => { if (dron.u >= 1) dron.u = 0; dron.play = !dron.play; controles.enabled = !dron.play; pintarDron(); };
}
let dronParada = -1, dronPct = -1;

// Cambio de pestaña
const VISTAS = {
  aerea: { amb: 'noche', cam: () => [new THREE.Vector3(ANCHO * 0.7 + 50, 78, 128), new THREE.Vector3(0, 24, -4)] },
  corte: { amb: 'estudio' },
  obra: { amb: 'estudio', cam: () => [new THREE.Vector3(ANCHO * 0.75 + 45, 70, 110), new THREE.Vector3(0, 8, -2)] },
  ventas: { amb: 'estudio', cam: () => [new THREE.Vector3(ANCHO * 0.35 + 20, Y4 + 30, 120), new THREE.Vector3(0, (Y4 + TOPE) / 2, TZ)] },
  dron: { amb: 'dorada' },
};
function setModo(m, { sinVuelo = false } = {}) {
  modo = m;
  document.querySelectorAll('.cm-tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.modo === m)));
  ambiente(VISTAS[m].amb);
  $('regla').classList.toggle('on', m === 'corte');
  if (m !== 'corte') limpiarPlanta();
  if (m !== 'ventas') unidadSel = null;
  if (m !== 'obra') obraPlay = false;
  if (m !== 'dron') { dron.play = false; controles.enabled = true; }
  aplicarVisibilidad();
  if (m === 'aerea') pintarAerea();
  if (m === 'corte') setCorte(nvCorte, { vuelo: !sinVuelo });
  if (m === 'obra') pintarObra();
  if (m === 'ventas') { pintarUnidades(); pintarVentas(); }
  if (m === 'dron') { dron = { u: 0, play: true }; dronParada = -1; controles.enabled = false; pintarDron(); }
  const v = VISTAS[m].cam;
  if (v && !sinVuelo) { const [p, o] = v(); volar(p, o, 1.2); }
}
document.querySelectorAll('.cm-tabs button').forEach((b) => b.addEventListener('click', () => { if (!reel) setModo(b.dataset.modo); }));

// Selección de apartamentos (clic sin arrastre)
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
let abajo = null;
renderer.domElement.addEventListener('pointerdown', (e) => {
  abajo = [e.clientX, e.clientY];
  if (modo === 'dron' && dron.play) { dron.play = false; controles.enabled = true; pintarDron(); }
  vuelo = null;
});
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!abajo || Math.hypot(e.clientX - abajo[0], e.clientY - abajo[1]) > 6 || modo !== 'ventas') return;
  const r = renderer.domElement.getBoundingClientRect();
  ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ptr, camara);
  const hit = ray.intersectObject(unidadesMesh)[0];
  seleccionar(hit ? UNIDADES[hit.instanceId] : null, { vuelo: false });
});

// Botones superiores
$('btnPantalla').onclick = () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen?.().catch(() => {});
};

// =================================================================
// Cámara: vuelos suaves
// =================================================================
let vuelo = null;
// En pantallas verticales la cámara se aleja para que quepa el conjunto
function volar(pos, obj, seg = 1.2, { lejos = false } = {}) {
  if (lejos && camara.aspect < 0.8) pos = obj.clone().add(pos.clone().sub(obj).multiplyScalar(1.6));
  vuelo = { p0: camara.position.clone(), o0: controles.target.clone(), p1: pos, o1: obj, t: 0, d: seg };
}
const suave = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// =================================================================
// Modo reel: ~32 s con subtítulos, en marco vertical
// =================================================================
const caption = $('caption');
let reel = null;
// Cada línea es texto; las palabras entre *asteriscos* van en acento.
function subtitulo(lineas) {
  caption.innerHTML = lineas.map((l) => `<span class="ln">${l.replace(/\*(.+?)\*/g, '<em>$1</em>')}</span>`).join('');
  caption.classList.add('on');
  return caption.querySelectorAll('.ln');
}
const espera = (ms) => new Promise((ok, no) => {
  const id = setTimeout(ok, ms);
  reel.cancelar.push(() => { clearTimeout(id); no(new Error('reel')); });
});
async function decir(lineas, msPorLinea = 900) {
  const ls = subtitulo(lineas);
  for (const l of ls) { l.classList.add('vista'); await espera(msPorLinea); }
}
async function animar(ms, fn) {
  const t0 = performance.now();
  while (true) {
    const u = Math.min(1, (performance.now() - t0) / ms);
    fn(u);
    if (u >= 1) return;
    await espera(30);
  }
}
async function guionReel() {
  const piso = iNivel('P12') >= 0 ? 'P12' : NIVELES[NIVELES.length - 1].id;
  setModo('aerea');
  await espera(300);
  await decir([`Así se ve *${NOMBRE}*`, 'antes de construirse:', `${T} torres de *${NP} pisos*`, 'en *estructura de acero*.'], 850);
  await espera(900);

  setModo('corte', { sinVuelo: true });
  setCorte(iNivel(piso));
  await decir(['Lo corto en *cualquier piso*…'], 900);
  const desde = iNivel(piso);
  await animar(2600, (u) => { const nv = Math.round(desde - u * desde); if (nv !== nvCorte) setCorte(nv, { vuelo: false }); });
  setCorte(0);
  await decir(['Lo corto en *cualquier piso*…', `y bajo hasta el *sótano ${NS}*.`], 1300);

  setModo('obra');
  tObra = 0; aplicarVisibilidad(); pintarObra();
  const ls = subtitulo(['Aquí veo la *obra completa*:', 'la excavación, los sótanos', 'y el *acero subiendo*.']);
  ls[0].classList.add('vista');
  await animar(7200, (u) => {
    tObra = u; aplicarVisibilidad(); pintarObraLigero();
    if (u > 0.25) ls[1].classList.add('vista');
    if (u > 0.55) ls[2].classList.add('vista');
  });
  await espera(600);

  setModo('ventas');
  await decir(['Cada apartamento tiene su *ficha*:'], 1200);
  const u = UNIDADES.find((x) => x.piso === Math.min(14, NP) && x.torre === Math.min(1, T - 1) && x.estado !== 'vendido') || UNIDADES[Math.floor(UNIDADES.length / 2)];
  seleccionar(u);
  await decir(['Cada apartamento tiene su *ficha*:', 'tipología, *metros* y estado.'], 1500);
  await espera(800);

  setModo('dron');
  await decir(['Y todo corre en *tiempo real*,', 'en el *navegador*.'], 1300);
  await animar(5200, () => {});
  await espera(400);

  dron.play = false;
  setModo('aerea');
  await decir([`*${NOMBRE}*:`, 'un centro de mando', 'para el *constructor*.', '— AceroStudio'], 800);
  await espera(2200);
}
async function iniciarReel() {
  if (reel) return detenerReel();
  reel = { cancelar: [] };
  document.body.classList.add('reel');
  $('btnReel').classList.add('on');
  $('btnReel').querySelector('span').textContent = 'Detener';
  redimensionar();
  try { await guionReel(); } catch (e) { if (e.message !== 'reel') console.error(e); }
  detenerReel();
}
function detenerReel() {
  if (!reel) return;
  reel.cancelar.forEach((f) => f());
  reel = null;
  document.body.classList.remove('reel');
  caption.classList.remove('on');
  $('btnReel').classList.remove('on');
  $('btnReel').querySelector('span').textContent = 'Modo reel';
  redimensionar();
}
$('btnReel').onclick = iniciarReel;
addEventListener('keydown', (e) => { if (e.key === 'Escape') detenerReel(); });

// =================================================================
// Bucle
// =================================================================
function redimensionar() {
  const w = app.clientWidth, h = app.clientHeight;
  renderer.setSize(w, h);
  camara.aspect = w / h;
  camara.fov = w / h < 0.8 ? 52 : 40;
  camara.updateProjectionMatrix();
}
addEventListener('resize', redimensionar);
redimensionar();

const reloj = new THREE.Clock();
const v3 = new THREE.Vector3();
function bucle() {
  requestAnimationFrame(bucle);
  const real = Math.min(0.5, reloj.getDelta());   // vuelos, obra y dron avanzan en tiempo real
  const dt = Math.min(0.05, real);

  if (vuelo) {
    vuelo.t += real / vuelo.d;
    const k = suave(Math.min(1, vuelo.t));
    camara.position.lerpVectors(vuelo.p0, vuelo.p1, k);
    controles.target.lerpVectors(vuelo.o0, vuelo.o1, k);
    if (vuelo.t >= 1) vuelo = null;
  }

  if (modo === 'obra' && obraPlay) {
    tObra = Math.min(1, tObra + real / 18);
    if (tObra >= 1) obraPlay = false;
    aplicarVisibilidad();
    pintarObraLigero();
  }

  if (modo === 'dron') {
    if (dron.play) {
      dron.u = Math.min(1, dron.u + real / DRON_SEG);
      const e = dron.u;
      camara.position.copy(curvaPos.getPoint(e));
      controles.target.copy(curvaObj.getPoint(e));
      const parada = Math.min(DRON.length - 1, Math.floor(e * (DRON.length - 1) + 0.35));
      const pct = Math.round(e * 100);
      if (parada !== dronParada) { dronParada = parada; pintarDron(); }
      else if (pct !== dronPct) { dronPct = pct; card.querySelector('.fila b').textContent = pct + ' %'; card.querySelector('.barra i').style.width = pct + '%'; }
      if (dron.u >= 1) { dron.play = false; controles.enabled = true; pintarDron(); }
    }
  }

  if (modo === 'aerea' && !vuelo) {
    // giro lento alrededor del conjunto
    const o = controles.target;
    v3.copy(camara.position).sub(o).applyAxisAngle(THREE.Object3D.DEFAULT_UP, dt * 0.04);
    camara.position.copy(o).add(v3);
  }

  if (controles.enabled) controles.update(); else camara.lookAt(controles.target);
  renderer.render(escena, camara);

  // etiquetas
  const w = app.clientWidth, h = app.clientHeight;
  for (const e of ETIQUETAS) {
    v3.copy(e.pos).project(camara);
    const fuera = v3.z > 1 || Math.abs(v3.x) > 1.05 || Math.abs(v3.y) > 1.05;
    e.el.style.display = fuera ? 'none' : '';
    if (!fuera) e.el.style.left = ((v3.x + 1) / 2) * w + 'px', e.el.style.top = ((1 - v3.y) / 2) * h + 'px';
  }
}

setModo('aerea');
camara.position.set(ANCHO * 1.4 + 120, 140, 220);
volar(new THREE.Vector3(ANCHO * 0.7 + 50, 78, 128), new THREE.Vector3(0, 24, -4), 2.2);
bucle();
requestAnimationFrame(() => $('cargando').classList.add('fuera'));
if (qs.get('reel') === '1') setTimeout(iniciarReel, 800);

// Para pruebas y capturas automáticas
window.centro = { setModo, setCorte, seleccionar, UNIDADES, NIVELES, PIEZAS, get tObra() { return tObra; }, set tObra(v) { tObra = v; aplicarVisibilidad(); if (modo === 'obra') pintarObra(); }, get dron() { return dron; }, iniciarReel, KG_TOTAL, MAT, renderer };
