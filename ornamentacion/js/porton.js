// AceroStudio · Ornamentación · acceso en acero: portón eléctrico, puerta peatonal y pórtico (Three.js 0.169, sin build)
// Unidades en metros. x = a lo largo del muro, y = altura, z = hacia la calle (+) / hacia el predio (−).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { BD, PROVEEDORES } from './precios.js';

/* ---------- acero: perfiles y pesos reales ---------- */
// Perfiles comerciales, nombrados como las líneas de Mundial de Perfiles (Bogotá), el distribuidor inicial.
// Tubos y barras se compran en tramos de 6 m; láminas en pliegos de 1,22 × 2,44 m; tableros estampados de 2 × 1 m.
// Pesos teóricos por metro; los calibres finales se confirman con la cotización del distribuidor.
const ESTR = 'Tubería estructural', B6 = 6, PLIEGO = [1.22, 2.44];
export const PERFILES = {
  shs60: { nombre: 'Tubo estructural 60×60×2,5', kgm: 4.44, linea: ESTR, barra: B6 },
  t40: { nombre: 'Tubo cuadrado 40×40×2', kgm: 2.31, linea: ESTR, barra: B6 },
  b16: { nombre: 'Varilla cuadrada 5/8" (16 mm)', kgm: 2.01, linea: 'Varillas cuadradas', barra: B6 },
  l80: { nombre: 'Tubo rectangular 76×38×1,4 (3"×1½")', kgm: 2.5, linea: 'Tubería ornamentación', barra: B6 },
  t20: { nombre: 'Tubo cuadrado 20×20×1,5', kgm: 0.84, linea: 'Tubería para cerramientos', barra: B6 },
  t4020: { nombre: 'Tubo rectangular 40×20×1,1 cal. 18', kgm: 0.98, linea: 'Tubería ornamentación', barra: B6 },
  shs80: { nombre: 'Tubo estructural 75×75×3', kgm: 6.63, linea: ESTR, barra: B6 },
  shs150: { nombre: 'Tubo cuadrado 150×150×4', kgm: 18.0, linea: ESTR, barra: B6 },
  r200: { nombre: 'Tubo estructural 200×100×4', kgm: 18.0, linea: ESTR, barra: B6 },
  red50: { nombre: 'Tubo redondo 2" × 2 mm', kgm: 2.41, linea: ESTR, barra: B6 },
  pl6: { nombre: 'Platina 1/4" (6 mm)', kgm2: 47.1, linea: 'Platinas', pliego: PLIEGO },
  lam: { nombre: 'Lámina Cold Rolled cal. 18 (1,2 mm)', kgm2: 9.42, linea: 'Lámina C.R.', pliego: PLIEGO },
  lam14: { nombre: 'Lámina Cold Rolled cal. 14 (1,9 mm) corte láser', kgm2: 14.92, linea: 'Lámina C.R. + servicio de corte láser', pliego: PLIEGO },
  tab: { nombre: 'Tablero estampado 2 × 1 m', kgm2: 7.06, linea: 'Tableros metálicos estampados', tablero: [1, 2] },
};
// Equivalencias en el catálogo 2026 de La Campana (fabricante, Bogotá): referencia y kg por tramo de 6 m según sus tablas.
// Donde el catálogo no trae el peso se usa el teórico. Los tableros estampados solo los vende Mundial de Perfiles.
const LC = {
  shs60: { ref: 'Tubería estructural 70×70×2,5 mm (A500)', kg6: 32.16 }, t40: { ref: 'Tubería cerramiento 38×38 cal. 14 (1,9 mm)', kg6: 13.24 },
  b16: { ref: 'Barra lisa cuadrada 5/8"', kg6: 12.06 }, l80: { ref: 'Tubería ornamentación 3"×1½" cal. 18', kg6: 11.51 }, t20: { ref: 'Tubería tipo mueble cuadrada 3/4" cal. 18', kg6: 5.0 },
  t4020: { ref: 'Tubería ornamentación 2"×1" cal. 18', kg6: 7.61 }, shs80: { ref: 'Tubería estructural 90×90×3 mm (A500)', kg6: 49.56 }, shs150: { ref: 'Tubería estructural 150×150×4 mm (A500)', kg6: 111.48 },
  r200: { ref: 'Tubería estructural 200×100×4 mm (A500)', kg6: 111.48 }, red50: { ref: 'Tubería cerramiento redonda 2" cal. 14', kg6: 14.5 },
  pl6: { ref: 'Platina 1/4" A36 (tramo de 6 m)' }, lam: { ref: 'Lámina Cold Rolled cal. 18, 1,22 × 2,44 m' }, lam14: { ref: 'Lámina Cold Rolled cal. 14 + servicio de corte de plancha' }, tab: null,
};
export { PROVEEDORES, BD };
// Tableros estampados del catálogo de Mundial de Perfiles (2 × 1 m). Relieves simplificados a partir de su catálogo.
export const TABLEROS = { sahara: 'Sahara', galicia: 'Galicia clásico', galiciaoro: 'Galicia oro', galicia1: 'Galicia imperial I', galicia2: 'Galicia imperial II', atenas: 'Atenas', barcelona: 'Barcelona', cristal: 'Cristal', diamante: 'Diamante', estrella: 'Estrella', imperio: 'Imperio', medialuna: 'Media luna', medialunaarco: 'Media luna arco', milan: 'Milán', milenio: 'Milenio', montana: 'Montana', napoles: 'Nápoles I', napoles2: 'Nápoles II', sevilla: 'Sevilla', toscana: 'Toscana', turquia: 'Turquía', universal: 'Universal', valentina: 'Valentina', venecia: 'Venecia', troquelado: 'Media luna arco troquelado' };
// qué tableros llevan vidrio (hueco troquelado con vidrio)
export const TABLERO_VIDRIO = new Set(['cristal', 'galicia1', 'galicia2', 'universal', 'troquelado']);
export const ACABADOS = {
  grafito: { nombre: 'Grafito', color: 0x4a5266, metal: .55, rug: .3, capa: .6, piel: .13 },
  negro: { nombre: 'Negro mate', color: 0x1d2028, metal: .45, rug: .5, capa: .2, piel: .2 },
  blanco: { nombre: 'Blanco', color: 0xf1f2f5, metal: .1, rug: .28, capa: .7, piel: .11 },
  celeste: { nombre: 'Celeste maqueta', color: 0xb6dbf8, metal: .2, rug: .28, capa: .7, piel: .11 },
  corten: { nombre: 'Óxido corten', color: 0xa85f3a, metal: .5, rug: .88, capa: 0, piel: .7 },
};
// productos de la sección: [mínimo, máximo, inicial] de ancho y alto en metros
export const PRODUCTOS = {
  porton: { nombre: 'Portón', ancho: [2.6, 6, 4], alto: [1.8, 3, 2.3], pasos: null },
  puerta: { nombre: 'Puerta', ancho: [.8, 1.4, 1], alto: [1.9, 2.6, 2.1], pasos: ['Vano', 'Marco fijo', 'Marco de la hoja', 'Relleno', 'Herrajes'] },
  ventana: { nombre: 'Ventana', ancho: [.8, 3, 1.6], alto: [.6, 1.8, 1.2], pasos: ['Vano', 'Marco fijo', 'Naves', 'Vidrio', 'Herrajes'] },
  reja: { nombre: 'Reja', ancho: [.8, 3, 1.6], alto: [.6, 2.2, 1.2], pasos: ['Vano', 'Anclajes', 'Marco', 'Relleno'] },
  baranda: { nombre: 'Baranda', ancho: [1.2, 6, 3], alto: [.9, 1.2, 1.05], pasos: ['Losa', 'Postes', 'Marco', 'Relleno', 'Pasamanos'] },
  estructura: { nombre: 'Estructura', ancho: [2.5, 6, 4], alto: [2.2, 3.2, 2.6], pasos: ['Terreno', 'Columnas', 'Vigas', 'Cubierta'] },
};
export const TIPOS = { corredizo: 'Corredizo', batiente: 'Batiente', levadizo: 'Levadizo' };
export const DISENOS = { celosia: 'Celosía láser', lanzas: 'Lanzas', listones: 'Listones', lamina: 'Rombos', tablero: 'Tablero estampado' };
export const MOTIVOS = { cerros: 'Cerros', hojas: 'Hojas', ondas: 'Ondas', trama: 'Trama' };
export const PASOS = ['Terreno', 'Cimentación y riel', 'Pórtico', 'Marco de la hoja', 'Relleno', 'Motor', 'Seguridad', 'Puerta peatonal'];
// Parámetros comerciales (los precios unitarios vienen de la base de datos BD, ornamentacion/js/precios.js)
export const PRECIOS = { margen: .3, consumibles: .06, desperdicio: { barra: .05, pliego: .1 }, kwh: 920, descuento: { mundial: PROVEEDORES.mundial.descuento, campana: PROVEEDORES.campana.descuento } };

const PAL = {
  noche: {
    fondo: 0x1f2433, estudio: 0x2a3044, suelo: 0x2b3145, anden: 0x3f4862, via: 0x262b3d, raya: 0x7c86a6, muro: 0x55668a, casa: 0x4d5f79, casa2: 0x445269, ruta: 0xe29699,
    arbol: 0x41607a, tronco: 0x39405a, carro: 0xbfe2fb, vidrio: 0x232c44, cesped: 0x2f3b50, piel: 0xe9b89a, ropa: 0xee7f74,
    tinta: 0x0b0d14, tintaOp: .5, hemiC: 0x9aa8d6, hemiS: 0x4c5674, hemiI: 1.25, solC: 0xbccaff, solI: 1.25, sol: [-9, 14, 11], luces: 1, env: .34, expo: 1.12, motor: 0xb6dbf8, mecanica: 0xc9cfdc,
  },
  dia: {
    fondo: 0xeceef2, estudio: 0xe9ebf0, suelo: 0xe3e6ec, anden: 0xf6f7f9, via: 0xd3d7e0, raya: 0xffffff, muro: 0xffffff, casa: 0xffffff, casa2: 0xf1f3f6, ruta: 0xf0a8a2,
    arbol: 0xdbe5ec, tronco: 0xcfd4dd, carro: 0x8fc6f0, vidrio: 0x55617a, cesped: 0xdfe6e2, piel: 0xe9b89a, ropa: 0xe8736a,
    tinta: 0x1a1e2c, tintaOp: .3, hemiC: 0xffffff, hemiS: 0xc9cedb, hemiI: .95, solC: 0xfff1dc, solI: 2.6, sol: [10, 16, 9], luces: 0, env: .62, expo: 1.02, motor: 0x8fc6f0, mecanica: 0x9aa3b5,
  },
};

const UNIT = new THREE.BoxGeometry(1, 1, 1), BORDE = new THREE.EdgesGeometry(UNIT);
const CONO = new THREE.ConeGeometry(.027, .11, 4); CONO.rotateY(Math.PI / 4);
/* relieve fino del metal: 'piel' de la pintura electrostática y cepillado del galvanizado */
function texRelieve(tipo, rep) {
  const n = 128, cv = document.createElement('canvas'); cv.width = cv.height = n; const g = cv.getContext('2d'), im = g.createImageData(n, n);
  let h = new Float32Array(n * n), r = 7; const azar = () => (r = (r * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < n * n; i++) h[i] = azar();
  const pasada = (dx, dy) => { const o = new Float32Array(n * n); for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { let a = 0; for (let k = -1; k <= 1; k++) a += h[((y + k * dy + n) % n) * n + (x + k * dx + n) % n]; o[y * n + x] = a / 3; } h = o; };
  if (tipo === 'piel') { for (let i = 0; i < 3; i++) { pasada(1, 0); pasada(0, 1); } } else for (let i = 0; i < 14; i++) pasada(1, 0);
  const k = tipo === 'piel' ? 14 : 5;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const dx = (h[y * n + (x + 1) % n] - h[y * n + (x + n - 1) % n]) * k, dy = (h[((y + 1) % n) * n + x] - h[((y + n - 1) % n) * n + x]) * k, l = Math.hypot(dx, dy, 1), i = (y * n + x) * 4;
    im.data[i] = (-dx / l * .5 + .5) * 255; im.data[i + 1] = (-dy / l * .5 + .5) * 255; im.data[i + 2] = (1 / l * .5 + .5) * 255; im.data[i + 3] = 255;
  }
  g.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); t.anisotropy = 4; return t;
}
/* tubo estructural: sección con esquinas redondeadas (radio real del perfil), largo en z */
const TUBOS = new Map();
function geoTubo(a, b, l) {
  const k = `${a.toFixed(4)},${b.toFixed(4)},${l.toFixed(4)}`; let g = TUBOS.get(k); if (g) return g;
  const r = Math.min(.012, Math.min(a, b) * .17), x = a / 2, y = b / 2, f = new THREE.Shape();
  f.moveTo(-x + r, -y); f.lineTo(x - r, -y); f.absarc(x - r, -y + r, r, -Math.PI / 2, 0); f.lineTo(x, y - r); f.absarc(x - r, y - r, r, 0, Math.PI / 2);
  f.lineTo(-x + r, y); f.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI); f.lineTo(-x, -y + r); f.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5);
  g = new THREE.ExtrudeGeometry(f, { depth: l, bevelEnabled: false, curveSegments: 4 }); g.translate(0, 0, -l / 2); TUBOS.set(k, g); return g;
}
const QY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2), QX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2), EJEZ = new THREE.Vector3(0, 0, 1);
function tubo(grp, m, sx, sy, sz, x, y, z, rz = 0) {
  const o = sx >= sy && sx >= sz ? new THREE.Mesh(geoTubo(sz, sy, sx), m) : sy >= sz ? new THREE.Mesh(geoTubo(sx, sz, sy), m) : new THREE.Mesh(geoTubo(sx, sy, sz), m);
  if (sx >= sy && sx >= sz) o.quaternion.copy(QY); else if (sy >= sz) o.quaternion.copy(QX);
  if (rz) o.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(EJEZ, rz));
  o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; grp.add(o); return o;
}
/* cordón de soldadura: escamas a lo largo de la junta */
const CORDONES = new Map(), CORD = new Set();
function cordon(grp, m, x, y, z, eje, largo, r = .0045) {
  const k = largo.toFixed(3) + r; let g = CORDONES.get(k);
  if (!g) { g = new THREE.CylinderGeometry(r, r, largo, 7, Math.max(4, Math.round(largo / .0022)), false); const P = g.attributes.position;
    for (let i = 0; i < P.count; i++) { const yy = P.getY(i), e = 1 + .22 * Math.sin(yy / .0075 * 6.2832) + .06 * Math.sin(yy * 2311); P.setX(i, P.getX(i) * e); P.setZ(i, P.getZ(i) * e); }
    g.computeVertexNormals(); CORDONES.set(k, g); CORD.add(g); }
  const o = new THREE.Mesh(g, m); if (eje === 'x') o.rotation.z = Math.PI / 2; else if (eje === 'z') o.rotation.x = Math.PI / 2; o.position.set(x, y, z); o.castShadow = true; grp.add(o); return o;
}
const G_HEX = new THREE.CylinderGeometry(.011, .011, .009, 6), G_ARAN = new THREE.CylinderGeometry(.017, .017, .0025, 16), G_ESP = new THREE.CylinderGeometry(.006, .006, .03, 8);
function perno(grp, m, x, y, z) { for (const [g, dy] of [[G_ARAN, .00125], [G_HEX, .007], [G_ESP, .015]]) { const o = new THREE.Mesh(g, m); o.position.set(x, y + dy, z); o.castShadow = true; grp.add(o); } }
const G_PINON = (() => { const N = 14, f = new THREE.Shape(); for (let i = 0; i < N * 4; i++) { const a = (i - .5) / (N * 4) * 6.2832, r = i % 4 < 2 ? .0445 : .057; f[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); } f.closePath();
  const h = new THREE.Path(); h.absarc(0, 0, .012, 0, 6.2832, true); f.holes.push(h); const g = new THREE.ExtrudeGeometry(f, { depth: .03, bevelEnabled: false, curveSegments: 8 }); g.translate(0, 0, -.015); g.rotateX(Math.PI / 2); return g; })();
const G_RUEDA = new THREE.LatheGeometry([[.012, -.016], [.05, -.016], [.05, -.011], [.041, 0], [.05, .011], [.05, .016], [.012, .016]].map(p => new THREE.Vector2(...p)), 28);
const G_FIJOS = new Set([G_HEX, G_ARAN, G_ESP, G_PINON, G_RUEDA]);
/* lámina de corte láser con espesor real: cada perforación es un hueco de verdad */
function geoLamina(p, esp = .003) {
  const f = new THREE.Shape(); f.moveTo(0, 0); f.lineTo(p.L, 0); f.lineTo(p.L, p.H); f.lineTo(0, p.H); f.closePath();
  for (const h of p.huecos) { const c = new THREE.Path();
    if (h.t === 'c') c.absarc(h.x, h.y, h.r, 0, 6.2832, true);
    else if (h.t === 'e') c.absellipse(h.x, h.y, h.rx, h.ry, 0, 6.2832, true, h.a);
    else { c.moveTo(h.x - h.rx, h.y); c.lineTo(h.x, h.y + h.ry); c.lineTo(h.x + h.rx, h.y); c.lineTo(h.x, h.y - h.ry); c.closePath(); }
    f.holes.push(c); }
  const g = new THREE.ExtrudeGeometry(f, { depth: esp, bevelEnabled: false, curveSegments: 8 }); g.translate(-p.L / 2, -p.H / 2, -esp / 2); return g;
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), suave = t => t * t * (3 - 2 * t), mix = (a, b, t) => a + (b - a) * t;
function azar(s) { let a = (s * 2654435761) >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* ---------- celosía paramétrica: lista de perforaciones para textura, peso y DXF ---------- */
export function patron(L, H, { motivo = 'cerros', densidad = .075, apertura = .7, semilla = 3 } = {}) {
  const r0 = azar(semilla), f = [r0() * 6.28, r0() * 6.28, r0() * 6.28, r0()], c = densidad, m = .055, huecos = [];
  const cols = Math.max(2, Math.floor((L - 2 * m) / c)), filas = Math.max(2, Math.floor((H - 2 * m) / (c * .866)));
  const dx = (L - 2 * m) / cols, dy = (H - 2 * m) / filas;
  const cresta = u => .5 + .2 * Math.sin(u * 5.1 + f[0]) + .1 * Math.sin(u * 11.7 + f[1]) + .045 * Math.sin(u * 23 + f[2]);
  for (let j = 0; j < filas; j++) for (let i = 0; i < cols - (j % 2); i++) {
    const x = m + dx * (i + .5 + (j % 2) * .5), y = m + dy * (j + .5), u = x / L, v = y / H, R = Math.min(dx, dy / .866) * .47;
    let k, h;
    if (motivo === 'cerros') {
      const d = v - cresta(u), d2 = v - (cresta(u * .7 + .4) - .2);
      k = d > 0 ? .5 + .5 * suave(clamp(d * 4, 0, 1)) : d2 > 0 ? .34 - .12 * suave(clamp(-d * 5, 0, 1)) : .12;
      h = { t: 'c', x, y, r: R * k * apertura * 1.3 };
    } else if (motivo === 'hojas') {
      const a = 1.1 * Math.sin(u * 4.2 + f[0]) + .9 * Math.cos(v * 5.3 + f[1] + u * 2), foco = Math.hypot(u - (.25 + .5 * f[3]), (v - .62) * .8);
      k = clamp(1.05 - foco * 1.25, .16, 1) * mix(.55, 1, v);
      h = { t: 'e', x, y, rx: R * 1.02 * k * (.5 + apertura * .7), ry: R * .4 * k * (.5 + apertura * .7), a };
    } else if (motivo === 'ondas') {
      const w = .5 + .5 * Math.sin(v * 9 + 2.6 * Math.sin(u * 5 + f[0]) + f[1]);
      k = mix(.14, 1, suave(w)) * mix(.5, 1, v);
      h = { t: 'e', x, y, rx: R * .34 * (.6 + k * .5) * (.5 + apertura * .7), ry: R * 1.05 * k * (.5 + apertura * .7), a: .35 * Math.sin(u * 5 + f[0]) };
    } else {
      k = mix(.14, 1, suave(clamp((v - .12) / .8 + .12 * Math.sin(u * 7 + f[0]), 0, 1)));
      h = { t: 'r', x, y, rx: R * 1.08 * k * (.45 + apertura * .75), ry: R * 1.08 * k * (.45 + apertura * .75) };
    }
    if ((h.r ?? Math.min(h.rx, h.ry)) > .0035) huecos.push(h);
  }
  let area = 0, corte = 0;
  for (const h of huecos) {
    if (h.t === 'c') { area += Math.PI * h.r * h.r; corte += 2 * Math.PI * h.r; }
    else if (h.t === 'e') { area += Math.PI * h.rx * h.ry; corte += Math.PI * (3 * (h.rx + h.ry) - Math.sqrt((3 * h.rx + h.ry) * (h.rx + 3 * h.ry))); }
    else { area += 2 * h.rx * h.ry; corte += 4 * Math.hypot(h.rx, h.ry); }
  }
  return { L, H, huecos, abierto: area / (L * H), corte: corte + 2 * (L + H) };
}
function pintarPatron(p, ppm) {
  const cv = document.createElement('canvas'); cv.width = Math.round(p.L * ppm); cv.height = Math.round(p.H * ppm);
  const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.fillStyle = '#000';
  for (const h of p.huecos) {
    const x = h.x * ppm, y = cv.height - h.y * ppm; g.beginPath();
    if (h.t === 'c') g.arc(x, y, h.r * ppm, 0, 6.2832);
    else if (h.t === 'e') g.ellipse(x, y, h.rx * ppm, h.ry * ppm, -h.a, 0, 6.2832);
    else { g.moveTo(x - h.rx * ppm, y); g.lineTo(x, y - h.ry * ppm); g.lineTo(x + h.rx * ppm, y); g.lineTo(x, y + h.ry * ppm); g.closePath(); }
    g.fill();
  }
  return cv;
}
export function dxfPatron(p) { // DXF R12 en milímetros: contorno y perforaciones
  const o = ['0', 'SECTION', '2', 'ENTITIES'], n = v => (v * 1000).toFixed(2);
  const poli = (pts, capa) => { o.push('0', 'POLYLINE', '8', capa, '66', '1', '70', '1'); for (const [x, y] of pts) o.push('0', 'VERTEX', '8', capa, '10', n(x), '20', n(y)); o.push('0', 'SEQEND'); };
  poli([[0, 0], [p.L, 0], [p.L, p.H], [0, p.H]], 'CONTORNO');
  for (const h of p.huecos) {
    if (h.t === 'c') o.push('0', 'CIRCLE', '8', 'CORTE', '10', n(h.x), '20', n(h.y), '40', n(h.r));
    else if (h.t === 'r') poli([[h.x - h.rx, h.y], [h.x, h.y - h.ry], [h.x + h.rx, h.y], [h.x, h.y + h.ry]], 'CORTE');
    else { const pts = []; for (let i = 0; i < 20; i++) { const t = i / 20 * 6.2832, ex = h.rx * Math.cos(t), ey = h.ry * Math.sin(t); pts.push([h.x + ex * Math.cos(h.a) - ey * Math.sin(h.a), h.y + ex * Math.sin(h.a) + ey * Math.cos(h.a)]); } poli(pts, 'CORTE'); }
  }
  o.push('0', 'ENDSEC', '0', 'EOF'); return o.join('\n');
}

// relieve de un tablero estampado: molduras, figuras levantadas y huecos con vidrio, en fracciones (u, v) de la hoja L × H.
// Cada modelo del catálogo de Mundial de Perfiles se describe con piezas: P panel, A panel de arco, O óvalo, G retícula de figuras,
// L líneas, W ondas, S medio punto (abanico), V vidrio. Simplificación del relieve real para la vista 3D.
const T_ = {
  sahara: [['P', .11, .06, .46, .37], ['P', .54, .06, .89, .37], ['P', .11, .43, .46, .76], ['P', .54, .43, .89, .76], ['P', .11, .81, .46, .94], ['P', .54, .81, .89, .94]],
  galicia: [['A', .12, .44, .88, .93, .05], ['O', .5, .665, .2, .145], ['P', .12, .07, .88, .37], ['O', .33, .22, .12, .1], ['O', .67, .22, .12, .1]],
  galiciaoro: [['A', .12, .44, .88, .93, .05], ['O', .5, .665, .2, .145], ['P', .12, .07, .88, .37, .06], ['O', .5, .22, .3, .1]],
  galicia1: [['A', .12, .44, .88, .93, .05], ['V', 'oval', .5, .67, .19, .17], ['P', .12, .07, .88, .37, .06], ['O', .5, .22, .3, .1]],
  galicia2: [['A', .12, .44, .88, .93, .05], ['V', 'oval', .5, .67, .19, .17], ['P', .12, .07, .88, .37], ['O', .33, .22, .12, .1], ['O', .67, .22, .12, .1]],
  atenas: [['P', .22, .53, .78, .95], ['P', .32, .6, .68, .88], ['G', 'pir', 1, 1, .42, .67, .58, .81], ['P', .22, .06, .78, .46], ['P', .32, .12, .68, .4], ['G', 'pir', 1, 1, .42, .19, .58, .33]],
  barcelona: [['A', .2, .68, .45, .95, .35], ['A', .55, .68, .8, .95, .35], ['A', .2, .37, .45, .64, .35], ['A', .55, .37, .8, .64, .35], ['A', .2, .06, .45, .33, .35], ['A', .55, .06, .8, .33, .35]],
  cristal: [['A', .14, .47, .86, .95, .06], ['V', 'oval', .5, .71, .17, .18], ['P', .14, .07, .86, .4], ['G', 'pir', 1, 1, .38, .15, .62, .32]],
  diamante: [['G', 'pir', 3, 8, .2, .05, .8, .95]],
  estrella: [['G', 'estrella', 3, 8, .2, .05, .8, .95]],
  imperio: [['G', 'cuad', 3, 8, .2, .05, .8, .95]],
  medialuna: [['S', .5, .78, .3, .16], ['A', .2, .4, .45, .74, .3], ['A', .55, .4, .8, .74, .3], ['P', .25, .08, .75, .35], ['G', 'cuad', 2, 2, .3, .11, .7, .32]],
  medialunaarco: [['S', .5, .78, .3, .16], ['V', 'arco', .2, .4, .45, .74, .3], ['V', 'arco', .55, .4, .8, .74, .3], ['P', .25, .08, .75, .35], ['G', 'cuad', 2, 2, .3, .11, .7, .32]],
  troquelado: [['V', 'semi', .5, .78, .3, .16], ['V', 'arco', .2, .4, .45, .74, .3], ['V', 'arco', .55, .4, .8, .74, .3], ['P', .25, .08, .75, .35], ['G', 'cuad', 2, 2, .3, .11, .7, .32]],
  milan: [['G', 'pir', 3, 7, .1, .06, .9, .94]],
  milenio: [['W', .22], ['W', .42], ['W', .62], ['W', .82]],
  montana: [['A', .22, .36, .78, .93, .07], ['O', .5, .68, .14, .18], ['A', .22, .07, .47, .3, .3], ['A', .53, .07, .78, .3, .3]],
  napoles: [['L', .28], ['L', .72], ['O', .88, .5, .022, .011]],
  napoles2: [['L', .2], ['L', .4], ['L', .6], ['L', .8]],
  sevilla: [['G', 'flor', 3, 7, .1, .06, .9, .94]],
  toscana: [['G', 'cuad', 3, 7, .1, .06, .9, .94], ['G', 'pir', 3, 7, .1, .06, .9, .94, .5]],
  turquia: [['A', .15, .5, .85, .94, .07], ['A', .23, .56, .77, .88, .07], ['P', .15, .07, .85, .43], ['P', .36, .16, .64, .34]],
  universal: [['A', .14, .47, .86, .95, .06], ['V', 'oval', .5, .71, .17, .18], ['A', .18, .07, .48, .4, .3], ['A', .52, .07, .82, .4, .3]],
  valentina: [['A', .14, .46, .86, .94, .07], ['A', .2, .5, .8, .9, .07], ['O', .5, .7, .16, .17], ['A', .18, .07, .48, .4, .3], ['A', .52, .07, .82, .4, .3]],
  venecia: [['G', 'cuad', 3, 8, .22, .05, .78, .95, .62]],
};
function relieveTablero(modelo, L, H) {
  const g = new THREE.Group(), fig = [], spec = T_[modelo] || T_.sahara;
  const pts = (x0, y0, x1, y1) => [x0 * L, y0 * H, x1 * L, y1 * H];
  const rect = (x0, y0, x1, y1, r = .012) => { const s = new THREE.Shape(); [x0, y0, x1, y1] = pts(x0, y0, x1, y1); r = Math.min(r, (x1 - x0) / 2.2, (y1 - y0) / 2.2); s.moveTo(x0 + r, y0); s.lineTo(x1 - r, y0); s.quadraticCurveTo(x1, y0, x1, y0 + r); s.lineTo(x1, y1 - r); s.quadraticCurveTo(x1, y1, x1 - r, y1); s.lineTo(x0 + r, y1); s.quadraticCurveTo(x0, y1, x0, y1 - r); s.lineTo(x0, y0 + r); s.quadraticCurveTo(x0, y0, x0 + r, y0); return s; };
  const arco = (x0, y0, x1, y1, f) => { const s = new THREE.Shape(); [x0, y0, x1, y1] = pts(x0, y0, x1, y1); const a = f * (y1 - y0); s.moveTo(x0, y0); s.lineTo(x1, y0); s.lineTo(x1, y1 - a); s.quadraticCurveTo((x0 + x1) / 2, y1 + a, x0, y1 - a); s.lineTo(x0, y0); return s; };
  const ovalo = (cx, cy, rx, ry) => { const s = new THREE.Shape(); s.absellipse(cx * L, cy * H, rx * L, ry * H, 0, Math.PI * 2, false); return s; };
  const semi = (cx, cy, rx, ry) => { const s = new THREE.Shape(); s.absellipse(cx * L, cy * H, rx * L, ry * H, 0, Math.PI, false); s.lineTo((cx - rx) * L, cy * H); return s; };
  const estrella = (cx, cy, r, n, k) => { const s = new THREE.Shape(); for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * Math.PI * 2 + Math.PI / 2, rr = i % 2 ? r * k : r; i ? s.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : s.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } s.closePath(); return s; };
  const hueco = (sh, d) => { const p = sh.getPoints(48), c = p.reduce((a, q) => a.add(q), new THREE.Vector2()).divideScalar(p.length), h = new THREE.Path(); p.forEach((q, i) => { const v = q.clone().sub(c), l = v.length(); v.multiplyScalar(Math.max(.1, (l - d) / l)).add(c); i ? h.lineTo(v.x, v.y) : h.moveTo(v.x, v.y); }); sh.holes.push(h); return sh; };
  const pon = (sh, alto = .007, ch = .012, vidrio = false) => fig.push([sh, alto, ch, vidrio]);
  const marco = (sh, alto = .007, ch = .014) => pon(hueco(sh, .04), alto, ch); // moldura: figura con el centro hundido
  for (const f of spec) {
    const [t, ...a] = f;
    if (t === 'P') marco(rect(a[0], a[1], a[2], a[3], a[4] || .012));
    else if (t === 'A') marco(arco(a[0], a[1], a[2], a[3], a[4] ?? .06));
    else if (t === 'O') pon(ovalo(a[0], a[1], a[2], a[3]), .008, Math.min(.02, a[2] * L * .3));
    else if (t === 'S') { marco(semi(a[0], a[1], a[2], a[3])); for (let i = 1; i < 4; i++) { const an = Math.PI * i / 4; pon(rect(a[0] - .004, a[1], a[0] + .004, a[1] + a[3] * .9, .002), .003, .003); fig[fig.length - 1].push([a[0] * L, a[1] * H, an - Math.PI / 2]); } }
    else if (t === 'L') pon(rect(.03, a[0] - .005, .97, a[0] + .005, .003), .002, .004);
    else if (t === 'W') { const s = new THREE.Shape(); const n = 40; for (let i = 0; i <= n; i++) { const x = (.04 + .92 * i / n) * L, y = (a[0] + Math.sin(i / n * Math.PI * 2) * .012) * H; i ? s.lineTo(x, y + .004) : s.moveTo(x, y + .004); } for (let i = n; i >= 0; i--) { const x = (.04 + .92 * i / n) * L, y = (a[0] + Math.sin(i / n * Math.PI * 2) * .012) * H; s.lineTo(x, y - .004); } s.closePath(); pon(s, .002, .003); }
    else if (t === 'V') { const forma = a[0]; const sh = forma === 'oval' ? ovalo(a[1], a[2], a[3], a[4]) : forma === 'semi' ? semi(a[1], a[2], a[3], a[4]) : arco(a[1], a[2], a[3], a[4], a[5]); pon(sh, .009, .012); pon(sh.clone ? sh : sh, 0, 0, true); }
    else if (t === 'G') { const [forma, nx, ny, u0, v0, u1, v1, esc = .72] = a, cw = (u1 - u0) / nx, ch = (v1 - v0) / ny, lado = Math.min(cw * L, ch * H) * esc;
      for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const cx = (u0 + cw * (i + .5)) * L, cy = (v0 + ch * (j + .5)) * H, h = lado / 2;
        if (forma === 'pir') pon(rect(cx / L - h / L, cy / H - h / H, cx / L + h / L, cy / H + h / H, .003), .006, h * .9);
        else if (forma === 'cuad') pon(rect(cx / L - h / L, cy / H - h / H, cx / L + h / L, cy / H + h / H, h * .35), .005, h * .3);
        else if (forma === 'flor') { pon(estrella(cx, cy, h, 8, .62), .004, h * .3); pon(ovalo(cx / L, cy / H, h * .28 / L, h * .28 / H), .004, h * .12); }
        else pon(estrella(cx, cy, h, 8, .45), .005, h * .35);
      } }
  }
  for (const [sh, alto, ch, vidrio, rot] of fig) {
    if (vidrio) { const m = new THREE.Mesh(new THREE.ShapeGeometry(sh, 24)); m.userData.vidrio = true; m.position.z = .0015; g.add(m); continue; }
    const geo = new THREE.ExtrudeGeometry(sh, { depth: .0008, bevelEnabled: true, bevelThickness: alto, bevelSize: Math.max(.0005, ch), bevelOffset: -ch, bevelSegments: 2, curveSegments: 16 });
    const m = new THREE.Mesh(geo); m.castShadow = m.receiveShadow = true; if (rot) { m.position.set(rot[0], rot[1], 0); m.rotation.z = rot[2]; geo.translate(-rot[0], -rot[1], 0); } g.add(m);
  }
  return g;
}
function nuevoAcc() {
  const items = {}, porG = {}; let piezas = 0, corte = 0, pintura = 0;
  const aG = (yo, clave, campo, v, n) => { const g = yo.alias[yo.g] || yo.g, o = ((porG[g] ||= {})[clave] ||= { m: 0, m2: 0, n: 0 }); o[campo] += v; o.n += n; };
  return {
    g: 'Pórtico', alias: {},
    add(p, m, n = 1) { aG(this, p, 'm', m * n, n); (items[p] ||= { m: 0, n: 0 }); items[p].m += m * n; items[p].n += n; piezas += n; pintura += m * n * .22; },
    lamina(m2, clave = 'lam', abierto = 0, mCorte = 0, unidades = 1) { aG(this, clave, 'm2', m2 * (1 - abierto), 1); (items[clave] ||= { m2: 0, n: 0, bruto: 0, u: 0 }); items[clave].m2 += m2 * (1 - abierto); items[clave].bruto += m2; items[clave].u += unidades; items[clave].n++; piezas++; corte += mCorte; pintura += m2 * 2 * (1 - abierto); },
    total() {
      let kg = 0, m = 0; const lista = [];
      for (const [k, v] of Object.entries(items)) {
        const p = PERFILES[k], w = p.kgm2 ? v.m2 * p.kgm2 : v.m * p.kgm; kg += w; if (!p.kgm2) m += v.m;
        lista.push({ clave: k, nombre: p.nombre, cantidad: p.kgm2 ? v.m2 : v.m, unidad: p.kgm2 ? 'm²' : 'm', n: v.n, kg: w });
      }
      lista.sort((a, b) => b.kg - a.kg);
      const grupos = {};
      for (const [g, it] of Object.entries(porG)) { const l = Object.entries(it).map(([k, v]) => { const p = PERFILES[k]; return { clave: k, nombre: p.nombre, cantidad: p.kgm2 ? v.m2 : v.m, unidad: p.kgm2 ? 'm²' : 'm', n: v.n, kg: (p.kgm2 ? v.m2 * p.kgm2 : v.m * p.kgm) * 1.04 }; }).sort((a, b) => b.kg - a.kg); grupos[g] = { kg: l.reduce((a, b) => a + b.kg, 0), piezas: l.reduce((a, b) => a + b.n, 0), lista: l }; }
      // pedido al proveedor: tramos de 6 m con 5 % de desperdicio, pliegos con 10 %, tableros por unidad
      const compra = prov => Object.entries(items).map(([k, v]) => {
        const p = PERFILES[k], lc = prov === 'campana' ? LC[k] : undefined, it = BD.dePerfil(k), base = { clave: k, nombre: lc ? lc.ref : p.nombre, linea: lc ? 'La Campana' : p.linea, falta: lc === null, bd: it?.id, ref: it ? BD.precio(it.id) : 0, fuente: it?.fuente };
        if (p.barra) { const c = Math.max(1, Math.ceil(v.m * 1.05 / p.barra)); return { ...base, cant: c, unidad: c === 1 ? 'tramo de 6 m' : 'tramos de 6 m', kg: c * (lc?.kg6 || p.barra * p.kgm) }; }
        if (p.tablero) return { ...base, nombre: p.nombre, cant: v.u, unidad: v.u === 1 ? 'tablero' : 'tableros', kg: v.u * p.tablero[0] * p.tablero[1] * p.kgm2 };
        const a = p.pliego[0] * p.pliego[1], c = Math.max(1, Math.ceil(v.bruto * 1.1 / a)), frac = v.bruto * 1.1 / a;
        return frac < .5 && k === 'pl6' ? { ...base, cant: Math.max(1, Math.ceil(v.n)), unidad: 'platinas cortadas a medida', kg: v.bruto * p.kgm2 } : { ...base, cant: c, unidad: c === 1 ? 'pliego 1,22 × 2,44 m' : 'pliegos 1,22 × 2,44 m', kg: c * a * p.kgm2 };
      }).sort((a, b) => b.kg - a.kg);
      return { kg: kg * 1.04, metros: m, piezas, lista, corte, pintura, grupos, compra: compra('mundial'), pedido: compra }; // +4 % soldadura y herrajes
    },
  };
}
function motorRecomendado(tipo, kg, W) {
  if (tipo === 'corredizo') return kg <= 380 ? { modelo: 'Corredizo 400 kg', dato: 'kit residencial · cremallera y controles', inom: 5.2, bd: 'motor-corr-400' } : kg <= 760 ? { modelo: 'Corredizo 800 kg', dato: 'cremallera y controles · 24 V', inom: 7.4, bd: 'motor-corr-800' } : { modelo: 'Corredizo 1.200 kg', dato: 'cremallera y controles', inom: 8.6, bd: 'motor-corr-1200' };
  if (tipo === 'batiente') return kg / 2 <= 200 ? { modelo: 'Pistones 200 kg por hoja', dato: 'electromecánicos · con batería', inom: 3.2, bd: 'motor-bat-200' } : { modelo: 'Brazos 350 kg por hoja', dato: 'electromecánicos · 24 V', inom: 4.6, bd: 'motor-bat-350' };
  return { modelo: 'Motor de garaje 1/2 HP', dato: 'riel de cadena · con fotocelda', inom: 3.0, bd: 'motor-lev' };
}

export function crearSimulador(canvas, opt = {}) {
  const cfg = Object.assign({
    producto: 'porton', tipo: 'corredizo', diseno: 'celosia', modelo: 'sahara', motivo: 'cerros', densidad: .075, apertura: .7, semilla: 3, ancho: 4, alto: 2.3, acabado: 'grafito',
    paisaje: false, tiempo: 9, autocierre: true, pausa: 5, fotocelda: true, lampara: true, bateria: true, solar: true, ciclosDia: 12, dia: false, brillo: true,
  }, opt.cfg);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: !!opt.captura });
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0, 40, 85);
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; pm.dispose();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 200);
  const controls = new OrbitControls(camera, canvas);
  Object.assign(controls, { enableDamping: true, dampingFactor: .08, maxPolarAngle: Math.PI * .495, minDistance: .4, maxDistance: 40, enablePan: false });

  const hemi = new THREE.HemisphereLight(0xffffff, 0x333333, 1), sol = new THREE.DirectionalLight(0xffffff, 1);
  sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); sol.shadow.bias = -.0003; sol.shadow.normalBias = .025;
  Object.assign(sol.shadow.camera, { left: -17, right: 17, top: 17, bottom: -17, near: 1, far: 60 });
  scene.add(hemi, sol, sol.target);

  /* materiales por rol, para cambiar día/noche sin reconstruir */
  const M = {}, mat = (rol, extra) => (M[rol] ||= new THREE.MeshStandardMaterial({ roughness: .92, metalness: 0, ...extra }));
  // el entorno sigue plano (figuras y colores); el metal responde a la luz como metal de verdad
  const nPiel = texRelieve('piel', 26), nCepillo = texRelieve('cepillo', 9);
  const mAcero = new THREE.MeshPhysicalMaterial({ metalness: .35, roughness: .4, clearcoat: .4, clearcoatRoughness: .28, envMapIntensity: 2.1, normalMap: nPiel, normalScale: new THREE.Vector2(.14, .14) });
  const mPanel = mAcero, mPanelP = mAcero;
  const mMotor = new THREE.MeshPhysicalMaterial({ metalness: .05, roughness: .42, clearcoat: .5, clearcoatRoughness: .25 });
  const mMec = new THREE.MeshStandardMaterial({ metalness: 1, roughness: .26, envMapIntensity: 2.4, normalMap: nCepillo, normalScale: new THREE.Vector2(.35, .35) }); // galvanizado e inoxidable
  const mOscuro = new THREE.MeshStandardMaterial({ color: 0x1c1f29, roughness: .7, metalness: .2 });
  const mConcreto = new THREE.MeshStandardMaterial({ color: 0x8b93a6, roughness: 1 });
  const emis = (c, e) => new THREE.MeshStandardMaterial({ color: c, emissive: e, emissiveIntensity: 0, roughness: .6 });
  const mBaliza = emis(0x7a5a1e, 0xffa41c), mLed = emis(0xfff1cf, 0xffd08a), mVentana = emis(0xc9d6e6, 0xffc66b), mFaro = emis(0xffffff, 0xfff3c4), mFarol = emis(0xfff1cf, 0xffe2b0), mTecla = emis(0x20242e, 0x7fd6a4), mNum = emis(0xfff1cf, 0xffd08a);
  const mHaz = new THREE.MeshBasicMaterial({ color: 0xee7f74, transparent: true, opacity: .55 }), mStop = new THREE.MeshBasicMaterial({ color: 0xee5a4a });
  const mSolar = new THREE.MeshStandardMaterial({ color: 0x1b2a55, metalness: .6, roughness: .25 });
  const mLinea = new THREE.LineBasicMaterial({ transparent: true });
  const luzBaliza = new THREE.PointLight(0xffa41c, 0, 7, 2), luzLed = [0, 1, 2].map(() => new THREE.SpotLight(0xffd9a0, 0, 7, .95, .7, 1.4)), luzPatio = new THREE.PointLight(0xffc98a, 0, 12, 1.5), luzFarol = new THREE.PointLight(0xffe2b0, 0, 16, 1.5);
  scene.add(luzBaliza, luzPatio, luzFarol, ...luzLed, ...luzLed.map(l => l.target));

  const entorno = new THREE.Group(), porton = new THREE.Group(), carro = new THREE.Group(), persona = new THREE.Group();
  scene.add(entorno, porton, carro, persona);
  const caja = (grp, m, sx, sy, sz, x, y, z, borde) => {
    const o = new THREE.Mesh(UNIT, m); o.scale.set(sx, sy, sz); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; grp.add(o);
    if (borde) { const e = new THREE.LineSegments(BORDE, mLinea); e.scale.copy(o.scale); e.position.copy(o.position); grp.add(e); }
    return o;
  };
  const limpiar = g => { for (const o of [...g.children]) { limpiar(o); g.remove(o); if (o.geometry && ![UNIT, CONO, BORDE].includes(o.geometry) && !G_FIJOS.has(o.geometry)) o.geometry.dispose(); } };

  /* ---------- estado ---------- */
  const S = { p: 0, v: 0, estado: 'cerrado', objetivo: 0, tPausa: 0, tMov: 0, ciclos: 0, corriente: .05, tBaliza: 0, bloqueada: false, reloj: 0, golpe: 0, red: true, bat: .92, whCiclo: 0, placa: 0, q: 0, qObj: 0, tPuerta: 0 };
  const car = { z: 6.4, v: 0, objetivo: 6.4, prueba: false, pruebaHecha: false, pulsado: false };
  const per = { fase: 0, x: -11, z: 1.6, t: 0, rumbo: 0, paso: 0 };
  const vis = { paso: PASOS.length - 1, montaje: false, despiece: 0 };
  let geo = {}, ficha = {}, partes = {}, grupos = [], oyentes = [], texturas = [];
  const evento = (tipo, texto) => oyentes.forEach(f => f(tipo, texto, S.reloj));
  const LARGO = 4.2, MITAD = LARGO / 2, Z_FUERA = 6.4, Z_DENTRO = -7.4, Z_HAZ = .32, PEAT = 1.0, COL = .15;

  /* grupo de montaje: aparece en su paso y se separa en la vista de despiece */
  function grupo(nombre, paso, exp, padre = porton, ancla = [0, 0, 0], detalle = '') {
    const g = new THREE.Group(); g.userData = { nombre, paso, exp: new THREE.Vector3(...exp), base: new THREE.Vector3(), a: 1, ancla: new THREE.Vector3(...ancla), detalle };
    padre.add(g); grupos.push(g); return g;
  }

  /* ---------- una hoja: devuelve marco y relleno por separado ---------- */
  function hoja(L, H, diseno, acc, arco, mP, pasoM = 3, pasoR = 4, t = .06) {
    const raiz = new THREE.Group(), li = L - 2 * t, pf = t < .05 ? 't40' : 'shs60';
    const gm = grupo('Marco', pasoM, [0, 0, 1.3], raiz, [L * .25, H, 0], t < .05 ? 'tubo 40×40×2' : 'tubo 60×60×3'), gr = grupo('Relleno', pasoR, [0, 0, 2.6], raiz, [L * .7, H * .75, 0], DISENOS[diseno].toLowerCase());
    const B = (g, sx, sy, sz, x, y, z = 0, rz = 0) => { acc.g = g.userData.nombre; return tubo(g, mAcero, sx, sy, sz, x, y, z, rz); };
    const esquinas = yT => { for (const x of [t, L - t]) for (const y of [t, yT]) { for (const z of [-t / 2, t / 2]) cordon(gm, mAcero, x, y + (y < H / 2 ? -t / 2 : t / 2), z, 'y', t - .012); cordon(gm, mAcero, x + (x < L / 2 ? .002 : -.002), y + (y < H / 2 ? .002 : -.002), 0, 'z', t - .014); } };
    const tes = (x, a, y0, y1, z) => { for (const y of [y0, y1]) for (const s of [-1, 1]) cordon(gm, mAcero, x + s * a / 2, y, z, 'z', a - .008, .0038); };
    if (diseno === 'tablero') { // tablero estampado sobre marco de tubo, como lo vende Mundial de Perfiles
      B(gm, t, H, t, t / 2, H / 2); B(gm, t, H, t, L - t / 2, H / 2); acc.add(pf, H, 2);
      B(gm, li, t, t, L / 2, t / 2); B(gm, li, t, t, L / 2, H - t / 2); acc.add(pf, li, 2);
      B(gm, li, .04, .02, L / 2, H * .42, -.008); acc.add('t4020', li); esquinas(H - t);
      gr.userData.detalle = 'tablero ' + (TABLEROS[cfg.modelo] || 'Sahara') + ' 2 × 1 m';
      const z0 = t / 2 + .0012, base = new THREE.Mesh(UNIT, mP); base.scale.set(L, H, .0024); base.position.set(L / 2, H / 2, z0); base.castShadow = base.receiveShadow = true; base.userData.lamina = true; gr.add(base);
      const relieve = relieveTablero(cfg.modelo, L, H); relieve.position.z = z0 + .0012; relieve.children.forEach(o => { o.material = o.userData.vidrio ? mVidrio : mP; o.userData.lamina = !o.userData.vidrio; if (o.userData.vidrio) o.castShadow = false; }); gr.add(relieve);
      for (const x of [.004, L - .004]) for (let i = 0; i <= 4; i++) cordon(gr, mAcero, x, .1 + (H - .2) * i / 4, z0, 'y', .025, .003);
      acc.g = 'Relleno'; acc.lamina(L * H, 'tab', 0, 0, Math.ceil(L / 1.005) * Math.ceil(H / 2.005));
    } else if (diseno === 'celosia') {
      B(gm, t, H, t, t / 2, H / 2); B(gm, t, H, t, L - t / 2, H / 2); acc.add(pf, H, 2);
      B(gm, li, t, t, L / 2, t / 2); B(gm, li, t, t, L / 2, H - t / 2); acc.add(pf, li, 2);
      const nI = Math.max(0, Math.ceil(li / 1.25) - 1);
      for (let i = 1; i <= nI; i++) { B(gm, .04, H - 2 * t, .04, t + li * i / (nI + 1), H / 2, -.012); acc.add('t40', H - 2 * t); tes(t + li * i / (nI + 1), .04, t, H - t, -.012); }
      esquinas(H - t);
      const pw = li + .04, ph = H - 2 * t + .04, p = patron(pw, ph, cfg);
      const pl = new THREE.Mesh(geoLamina(p), mP); pl.position.set(L / 2, H / 2, .0125); pl.userData.lamina = true; pl.castShadow = pl.receiveShadow = true; gr.add(pl);
      for (let i = 0, n = Math.max(2, Math.round(pw / .28)); i <= n; i++) for (const y of [t - .008, H - t + .008]) cordon(gr, mAcero, t - .02 + .03 + (pw - .06) * i / n, y, .0145, 'x', .022, .003); // puntos de soldadura de la lámina
      acc.g = 'Relleno'; acc.lamina(pw * ph, 'lam14', p.abierto, p.corte); raiz.userData.patron = p;
    } else if (diseno === 'lanzas') {
      const yT = arco ? H - .52 : H - .2, yM = .52;
      B(gm, t, yT + t / 2, t, t / 2, (yT + t / 2) / 2); B(gm, t, yT + t / 2, t, L - t / 2, (yT + t / 2) / 2); acc.add(pf, yT + t / 2, 2);
      B(gm, li, t, t, L / 2, t / 2); B(gm, li, t, t, L / 2, yT); acc.add(pf, li, 2);
      B(gm, li, .04, .04, L / 2, yM); acc.add('t40', li); esquinas(yT - t / 2);
      B(gr, li, yM - t - .02, .012, L / 2, (t + yM - .02) / 2); acc.lamina(li * (yM - t - .02));
      const n = Math.max(2, Math.round(li / .115) - 1), paso = li / (n + 1);
      for (let i = 1; i <= n; i++) {
        const x = t + paso * i, d = (L - x) / L, top = arco ? yT + .14 + .3 * (1 - d * d) : H - .11;
        B(gr, .016, top - yM, .016, x, (top + yM) / 2); acc.add('b16', top - yM);
        const c = new THREE.Mesh(CONO, mAcero); c.position.set(x, top + .055, 0); c.castShadow = true; gr.add(c);
        B(gr, .034, .028, .034, x, (yM + yT) / 2);
      }
    } else if (diseno === 'listones') {
      B(gm, t, H, t, t / 2, H / 2); B(gm, t, H, t, L - t / 2, H / 2); acc.add(pf, H, 2);
      const nI = Math.max(0, Math.ceil(li / 1.5) - 1);
      for (let i = 1; i <= nI; i++) { B(gm, .04, H - .04, .04, t + li * i / (nI + 1), H / 2, -.022); acc.add('t40', H - .04); }
      for (const x of [t / 2, L - t / 2]) for (const y of [.004, H - .004]) cordon(gm, mAcero, x, y, 0, 'z', t - .014);
      const n = Math.floor((H + .03) / .11), paso = H / n;
      for (let i = 0; i < n; i++) { B(gr, li, paso - .03, .02, L / 2, paso * (i + .5), .01); acc.add('l80', li); }
    } else {
      const yS = H * .64;
      B(gm, t, H, t, t / 2, H / 2); B(gm, t, H, t, L - t / 2, H / 2); acc.add(pf, H, 2);
      B(gm, li, t, t, L / 2, t / 2); B(gm, li, t, t, L / 2, H - t / 2); acc.add(pf, li, 2);
      B(gm, li, .04, .04, L / 2, yS); acc.add('t40', li); esquinas(H - t);
      B(gr, li, yS - t - .02, .012, L / 2, (t + yS - .02) / 2); acc.lamina(li * (yS - t - .02));
      const nR = Math.max(1, Math.round(li / .8) - 1);
      for (let i = 1; i <= nR; i++) { B(gr, .04, yS - t - .02, .02, t + li * i / (nR + 1), (t + yS - .02) / 2, .014); acc.add('t4020', yS - t - .02); }
      const y0 = yS + .02, y1 = H - t, k = Math.max(2, Math.round(li / .42)), dx = li / k, dy = y1 - y0, len = Math.hypot(dx, dy), ang = Math.atan2(dy, dx);
      for (let i = 0; i < k; i++) { const xm = t + dx * (i + .5), ym = (y0 + y1) / 2; B(gr, len, .02, .02, xm, ym, 0, i % 2 ? -ang : ang); B(gr, len, .02, .02, xm, ym, 0, i % 2 ? ang : -ang); acc.add('t20', len, 2); }
    }
    return raiz;
  }

  /* ---------- construcción ---------- */
  function construir() {
    limpiar(entorno); limpiar(porton); TUBOS.clear(); CORDONES.clear(); CORD.clear(); texturas.forEach(t => t.dispose()); texturas = []; grupos = []; partes = {};
    const { ancho: W, alto: H, tipo } = cfg, hp = H + .42, xd = W / 2 + COL / 2, xi = -xd - PEAT - COL, xp = -xd - COL / 2 - PEAT / 2;
    geo = { W, H, hp, xd, xi, xp };
    /* entorno: en Ornamentación solo va el producto sobre un piso de estudio; el paisaje queda como opción (cfg.paisaje) */
    const piso = (rol, sx, sz, x, z, y) => { const o = new THREE.Mesh(UNIT, mat(rol)); o.scale.set(sx, .02, sz); o.position.set(x, y, z); o.receiveShadow = true; entorno.add(o); return o; };
    partes.ventanas = [];
    if (!cfg.paisaje) piso('estudio', 170, 170, 0, 0, -.012);
    else {
    piso('suelo', 170, 170, 0, 0, -.012); piso('anden', 64, 2.4, 0, 1.6, 0); piso('via', 170, 7.5, 0, 6.55, -.004); piso('cesped', 29.6, 12.2, 0, -6.3, -.002);
    for (let x = -30; x <= 30; x += 3.2) piso('raya', 1.5, .12, x, 6.55, .002);
    piso('ruta', W - .1, 12.5, 0, -3.45, .004); piso('ruta', W - .1, 1.3, 0, 3.45, .002); piso('anden', PEAT + .3, 5.2, xp, -2.7, .003);
    const ml = 15 + xi - COL / 2, mr = 15 - xd - COL / 2;
    caja(entorno, mat('muro'), ml, H + .1, .22, xi - COL / 2 - ml / 2, (H + .1) / 2, 0, true); caja(entorno, mat('muro'), mr, H + .1, .22, xd + COL / 2 + mr / 2, (H + .1) / 2, 0, true);
    for (const s of [-1, 1]) caja(entorno, mat('muro'), .22, H + .1, 12.4, s * 14.9, (H + .1) / 2, -6.2, true);
    const casa = (rol, sx, sy, sz, x, z, y0 = 0) => caja(entorno, mat(rol), sx, sy, sz, x, y0 + sy / 2, z, true);
    casa('casa', 10, 3.1, 6.5, -1.5, -14.6); casa('casa2', 8.4, 3, 7.4, -.2, -14.3, 3.1); casa('casa', 5.2, 3.2, 5.4, 6.1, -13.6); casa('casa2', 3.2, 2.2, 3.4, -4.6, -17.2, 6.1);
    casa('casa2', 9, 9.5, 11, -22, -9); casa('casa', 7, 5.5, 9, 22.5, -8); casa('casa2', 10, 13, 9, 21, -23); casa('casa', 12, 7, 8, -20, -25); casa('casa', 8, 6, 8, -33, -6); casa('casa2', 9, 11, 9, 33, -14); casa('casa2', 9, 7, 7, 6, -28);
    partes.ventanas = [];
    for (const [w, h, x, y, z] of [[3.6, 2.1, -4, 1.35, -11.33], [2.2, 2.1, .2, 1.35, -11.33], [6.6, 1.7, -.4, 4.55, -10.58], [3.4, 1.5, 6.1, 1.75, -10.88]]) { partes.ventanas.push(caja(entorno, mVentana, w, h, .06, x, y, z)); for (let i = 1; i < Math.round(w / 1.1); i++) caja(entorno, mOscuro, .04, h, .08, x - w / 2 + i * w / Math.round(w / 1.1), y, z); }
    for (const [x, z, s] of [[-8.6, -5, 1.25], [9.4, -6.5, 1.05], [-10.5, 1.7, .85], [11.5, 1.7, .85], [-11.5, -9.5, .95], [12.4, -2.2, .7]]) {
      caja(entorno, mat('tronco'), .18 * s, 1.6 * s, .18 * s, x, .8 * s, z);
      const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15 * s, 0), mat('arbol', { flatShading: true })); c.position.set(x, 2.3 * s, z); c.castShadow = true; entorno.add(c);
    }
    caja(entorno, mOscuro, .09, 4.6, .09, 7.8, 2.3, 2.5); caja(entorno, mOscuro, .09, .07, 1.1, 7.8, 4.6, 3); caja(entorno, mFarol, .22, .05, .42, 7.8, 4.55, 3.4); luzFarol.position.set(7.8, 4.3, 3.4);
    for (const z of [-2.2, -5.4]) for (const s of [-1, 1]) { caja(entorno, mOscuro, .07, .34, .07, s * (W / 2 + .22), .17, z); caja(entorno, mLed, .075, .05, .075, s * (W / 2 + .22), .36, z); }
    luzPatio.position.set(0, 1.1, -2.4); luzFarol.position.set(7.8, 4.3, 3.4);
    }

    if (!vis.montaje) vis.paso = pasos().length - 1;
    if (cfg.producto !== 'porton') return construirProducto();
    /* acceso */
    const acc = nuevoAcc(), Bm = (g, m, sx, sy, sz, x, y, z) => m === mAcero ? tubo(g, m, sx, sy, sz, x, y, z) : caja(g, m, sx, sy, sz, x, y, z);
    const gBase = grupo('Cimentación', 1, [0, 0, 0], porton, [xd, .05, .5], 'dados de concreto');
    for (const x of [xi, -xd, xd]) Bm(gBase, mConcreto, .42, .08, .42, x, .02, 0);
    acc.g = 'Pórtico'; const gPor = grupo('Pórtico', 2, [0, 1.5, 0], porton, [xp, hp + .2, 0], 'tubo 150×150 y viga 200×150');
    for (const x of [xi, -xd, xd]) {
      Bm(gPor, mAcero, COL, hp - .066, COL, x, .066 + (hp - .066) / 2, 0); acc.add('shs150', hp);
      tubo(gPor, mAcero, .3, .012, .3, x, .066, 0); // platina de anclaje con cuatro pernos
      for (const a of [-1, 1]) for (const b of [-1, 1]) perno(gPor, mMec, x + a * .115, .072, b * .115);
      for (const s of [-1, 1]) { cordon(gPor, mAcero, x, .074, s * COL / 2, 'x', COL - .03, .0055); cordon(gPor, mAcero, x + s * COL / 2, .074, 0, 'z', COL - .03, .0055); cordon(gPor, mAcero, x, hp - .002, s * COL / 2, 'x', COL - .03, .0055); }
    }
    const lv = xd - xi + COL; Bm(gPor, mAcero, lv, .2, COL, (xd + xi) / 2, hp + .1, 0); acc.add('r200', lv);
    Bm(gPor, mAcero, PEAT + .7, .05, 1.25, xp, hp + .225, .3); acc.lamina((PEAT + .7) * 1.25, 'lam14'); // marquesina
    Bm(gPor, mLed, lv - .5, .015, .03, (xd + xi) / 2, hp - .008, .05);
    luzLed.forEach((l, i) => { const x = mix(xi + .6, xd - .6, i / 2); l.position.set(x, hp - .05, .35); l.target.position.set(x, 0, .9); });
    const gSeg = grupo('Seguridad y acceso', 6, [0, .3, 3.9], porton, [xd, .62, Z_HAZ], 'fotoceldas, cámara, teclado, lámpara');
    for (const x of [-xd + COL / 2 + .03, xd - COL / 2 - .03]) Bm(gSeg, mOscuro, .06, .12, .06, x, .5, Z_HAZ);
    partes.haz = Bm(gSeg, mHaz, W - .1, .012, .012, 0, .5, Z_HAZ); partes.haz.castShadow = false;
    Bm(gSeg, mOscuro, .03, .14, .03, xd, hp + .27, .0); const bal = new THREE.Mesh(new THREE.CylinderGeometry(.055, .065, .1, 10), mBaliza); bal.position.set(xd, hp + .39, 0); gSeg.add(bal); luzBaliza.position.set(xd, hp + .6, .4);
    Bm(gSeg, mOscuro, .1, .08, .2, xd - .7, hp - .06, .16); const lente = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .05, 10), mMec); lente.rotation.x = 1.1; lente.position.set(xd - .7, hp - .09, .27); gSeg.add(lente); // cámara de placas
    Bm(gSeg, mOscuro, .1, .2, .035, -xd, 1.32, COL / 2 + .018); partes.tecla = Bm(gSeg, mTecla, .07, .1, .01, -xd, 1.3, COL / 2 + .04); // teclado
    if (cfg.paisaje) Bm(gSeg, mMotor, .3, .4, .12, xd + .55, 1.4, -.17); else Bm(gSeg, mMotor, .26, .36, .1, xd, 1.4, -COL / 2 - .05); // tablero de control
    const cvN = document.createElement('canvas'); cvN.width = 256; cvN.height = 96; const gN = cvN.getContext('2d'); gN.fillStyle = '#fff'; gN.fillRect(0, 0, 256, 96); gN.fillStyle = '#000'; gN.font = '700 64px Antonio, Arial Narrow, sans-serif'; gN.textAlign = 'center'; gN.textBaseline = 'middle'; gN.fillText('24 – 18', 128, 52);
    const tN = new THREE.CanvasTexture(cvN); texturas.push(tN); const mPlaca = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: .55, roughness: .42, alphaMap: tN, alphaTest: .5 }); partes.mPlaca = mPlaca;
    if (cfg.paisaje) { Bm(gSeg, mNum, .62, .22, .01, xd + 1.1, 1.62, .125); const pn = new THREE.Mesh(new THREE.PlaneGeometry(.66, .25), mPlaca); pn.position.set(xd + 1.1, 1.62, .14); gSeg.add(pn); }
    if (cfg.solar) { const ps = new THREE.Mesh(UNIT, mSolar); ps.scale.set(1.05, .03, .68); ps.position.set(xp, hp + .33, .22); ps.rotation.x = .22; ps.castShadow = true; gSeg.add(ps); }
    // puerta peatonal
    const gPea = grupo('Puerta peatonal', 7, [-.9, 0, 2], porton, [xp, H * .9, 0], 'chapa eléctrica y brazo hidráulico');
    const pivP = new THREE.Group(); pivP.position.set(xi + COL / 2 + .012, .05, 0); gPea.add(pivP); partes.pivP = pivP;
    acc.alias = { Marco: 'Puerta peatonal', Relleno: 'Puerta peatonal' }; pivP.add(hoja(PEAT - .03, H - .05, cfg.diseno, acc, false, mPanelP, 7, 7)); acc.alias = {}; Bm(pivP, mOscuro, .05, .11, .03, PEAT - .09, 1.05, -.045);
    { const cil = (r, l, x, y, z, ejeZ) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, l, 18), mMec); if (ejeZ) o.rotation.x = Math.PI / 2; o.position.set(x, y, z); o.castShadow = true; pivP.add(o); return o; };
      cil(.013, .46, PEAT - .09, 1.12, .075); for (const y of [.95, 1.29]) cil(.007, .05, PEAT - .09, y, .052, true); // manija tubular
      for (const y of [.28, (H - .05) / 2, H - .38]) { cil(.011, .1, -.011, y, .036); cil(.0125, .004, -.011, y, .036); Bm(pivP, mMec, .05, .09, .004, .02, y, .032); } // bisagras de barril
    }
    grupos = grupos.filter(g => g.parent?.parent !== pivP); // la puerta se monta como una sola pieza
    const gMot = grupo('Motor', 5, [.9, .4, -1.8], porton, [0, 0, 0], ''), kgAntes = acc.total().kg;

    if (tipo === 'corredizo') {
      const L = W + .5, zc = -.3, T = W + .04; geo.T = T; geo.zona = [-.5, -.1];
      const h = hoja(L, H - .1, cfg.diseno, acc, false, mPanel); h.position.set(-W / 2 - .1, .1, zc); porton.add(h); partes.hoja = h;
      Bm(gBase, mConcreto, 2 * W + 1.8, .05, .3, W / 2 + .35, 0, zc); Bm(gBase, mMec, 2 * W + 1.6, .006, .06, W / 2 + .35, .028, zc); { const r = new THREE.Mesh(new THREE.CylinderGeometry(.009, .009, 2 * W + 1.6, 12), mMec); r.rotation.z = Math.PI / 2; r.position.set(W / 2 + .35, .037, zc); r.castShadow = true; gBase.add(r); }
      const gh = grupo('Cremallera y ruedas', 5, [0, 0, -.9], h, [L * .5, .34, 0], 'módulo M4');
      partes.ruedas = [.5, L - .5].map(x => { const r = new THREE.Mesh(G_RUEDA, mMec); r.rotation.x = Math.PI / 2; r.position.set(x, -.013, 0); r.castShadow = true; gh.add(r); return r; });
      const yc = .34; Bm(gh, mMec, L - .1, .03, .028, L / 2, yc, -.047);
      const nd = Math.floor((L - .1) / .034), dientes = new THREE.InstancedMesh(UNIT, mMec, nd), tm = new THREE.Matrix4();
      for (let i = 0; i < nd; i++) { tm.makeScale(.016, .014, .028); tm.setPosition(.06 + i * .034, yc - .021, -.047); dientes.setMatrixAt(i, tm); } gh.add(dientes);
      const mx = W / 2 + .62, mz = zc - .19;
      Bm(gBase, mConcreto, .5, .06, .42, mx, .01, mz); Bm(gMot, mOscuro, .34, .02, .26, mx, .05, mz); Bm(gMot, mMotor, .28, .3, .2, mx, .21, mz); Bm(gMot, mOscuro, .28, .035, .2, mx, .377, mz);
      const pin = new THREE.Mesh(G_PINON, mMec); pin.castShadow = true; pin.rotation.x = Math.PI / 2; pin.position.set(mx, .1 + yc - .028 - .052, zc - .047);
      gMot.add(pin); for (const a of [-1, 1]) for (const b of [-1, 1]) perno(gMot, mMec, mx + a * .14, .06, mz + b * .1); partes.pinon = pin; Bm(gMot, mMec, .03, .03, .1, mx, pin.position.y, zc - .11);
      Bm(gMot, mMec, .05, .05, .3, W / 2 + .1, H + .08, -.2); Bm(gMot, mOscuro, .05, .1, .03, W / 2 + .1, H, zc + .05); Bm(gMot, mOscuro, .05, .1, .03, W / 2 + .1, H, zc - .05);
      Bm(gMot, mMec, .08, H * .5, .08, -W / 2 - .2, H * .25, zc - .09); Bm(gMot, mMec, .08, .5, .08, W / 2 + .5 + W + .5, .25, zc);
      gMot.userData.ancla.set(mx, .42, mz); geo.pmin = (1.18 + W / 2) / T;
    } else if (tipo === 'batiente') {
      const L = W / 2 - .015; geo.L = L; geo.zona = [-L - .1, .1]; geo.pmin = .955; partes.hojas = []; partes.brazos = [];
      for (const s of [-1, 1]) {
        const piv = new THREE.Group(); piv.position.set(s * W / 2, .07, 0); porton.add(piv); piv.add(hoja(L, H - .07, cfg.diseno, acc, cfg.diseno === 'lanzas', mPanel));
        for (const y of [.3, H - .55]) Bm(gMot, mMec, .05, .12, .05, s * W / 2, y, -.02);
        const A = new THREE.Vector3(s * (W / 2 + .1), .85, -.27), br = new THREE.Group(); br.position.copy(A); gMot.add(br);
        Bm(gMot, mOscuro, .12, .05, .2, A.x, A.y - .07, -.17); Bm(br, mMotor, .085, .1, .46, 0, 0, .25);
        const vast = Bm(br, mMec, .03, .03, 1, 0, 0, .5), punta = new THREE.Object3D(); punta.position.set(.72, .85 - .07, s < 0 ? -.06 : .06); piv.add(punta);
        partes.hojas.push({ piv, s }); partes.brazos.push({ br, vast, punta });
      }
      Bm(gBase, mMec, .12, .05, .12, 0, .025, -.06); gMot.userData.ancla.set(-W / 2 - .1, 1, -.4);
    } else {
      const L = W - .03, D = H + .5; geo.zona = [-.75, .12]; geo.pmin = Math.acos(clamp(1 - 1.6 / H, -1, 1)) / (86 * Math.PI / 180); geo.D = D;
      const piv = new THREE.Group(); piv.position.set(-L / 2, 0, 0); porton.add(piv); piv.add(hoja(L, H - .02, cfg.diseno, acc, false, mPanel)); partes.piv = piv;
      acc.g = 'Pórtico'; for (const s of [-1, 1]) { Bm(gPor, mAcero, .06, .06, D, s * (W / 2 - .05), H + .08, -D / 2 - COL / 2); acc.add('shs60', D); Bm(gPor, mAcero, .08, H + .1, .08, s * (W / 2 - .05), (H + .1) / 2, -D); acc.add('shs80', H + .1); }
      Bm(gPor, mAcero, W, .08, .08, 0, H + .08, -D); acc.add('shs80', W);
      Bm(gMot, mMec, .05, .04, D - .1, 0, H + .25, -D / 2 - .02); Bm(gMot, mMotor, .3, .16, .42, 0, H + .23, -D - .1); Bm(gMot, mOscuro, .3, .02, .42, 0, H + .32, -D - .1);
      partes.carroRiel = Bm(gMot, mOscuro, .1, .07, .16, 0, H + .2, 0); partes.biela = Bm(gMot, mMec, .025, .025, 1, 0, 0, 0); gMot.userData.ancla.set(0, H + .36, -D - .1);
    }
    geo.anclaFoto = new THREE.Vector3(xd - COL / 2 - .03, .58, Z_HAZ); geo.anclaCam = new THREE.Vector3(xd - .7, hp - .02, .2); geo.anclaTecla = new THREE.Vector3(-xd, 1.44, .1); geo.anclaMotor = gMot.userData.ancla;
    geo.xPuerta = xp; geo.patron = (partes.hoja || partes.piv?.children[0] || partes.hojas?.[0].piv.children[0])?.userData.patron || null;
    for (const g of grupos) g.userData.base.copy(g.position);
    const t = acc.total(), rec = motorRecomendado(tipo, t.kg - kgAntes, W); gMot.userData.detalle = rec.modelo.toLowerCase();
    ficha = { ...t, kgHoja: t.kg - kgAntes, motor: rec, tipo, ancho: W, alto: H, hojas: tipo === 'batiente' ? 2 : 1, abierto: geo.patron?.abierto || 0 };
    Object.assign(S, { p: 0, v: 0, estado: 'cerrado', objetivo: 0, tPausa: 0, q: 0, qObj: 0 });
    Object.assign(car, { z: Z_FUERA, v: 0, objetivo: Z_FUERA, prueba: false }); Object.assign(per, { fase: 0, x: -11, z: 1.6 });
    aplicar(); tema(cfg.dia); entintar();
  }

  function construirCarro() {
    const c = (m, sx, sy, sz, x, y, z, b) => caja(carro, m, sx, sy, sz, x, y, z, b);
    c(mat('carro', { roughness: .45, metalness: .3 }), 1.8, .62, LARGO, 0, .62, 0, true); c(M.carro, 1.62, .5, 2.2, 0, 1.17, .25, true);
    c(mat('vidrio', { roughness: .15, metalness: .6 }), 1.64, .36, 2.0, 0, 1.17, .25); c(M.vidrio, 1.5, .36, 2.22, 0, 1.17, .25);
    for (const x of [-.86, .86]) for (const z of [-1.3, 1.35]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(.33, .33, .22, 16), mOscuro); r.rotation.z = Math.PI / 2; r.position.set(x, .33, z); r.castShadow = true; carro.add(r); }
    for (const x of [-.62, .62]) { c(mFaro, .34, .12, .04, x, .7, -MITAD - .01); c(mStop, .3, .1, .04, x, .72, MITAD + .01); }
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 96; const g = cv.getContext('2d'); g.fillStyle = '#ffd400'; g.fillRect(0, 0, 256, 96); g.strokeStyle = '#111'; g.lineWidth = 6; g.strokeRect(5, 5, 246, 86); g.fillStyle = '#111'; g.font = '700 58px Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('ACR·247', 128, 50);
    const mp = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv) }); mp.map.colorSpace = THREE.SRGBColorSpace;
    for (const s of [-1, 1]) { const pl = new THREE.Mesh(new THREE.PlaneGeometry(.42, .16), mp); pl.position.set(0, .5, s * (MITAD + .012)); if (s < 0) pl.rotation.y = Math.PI; carro.add(pl); }
    const f = new THREE.SpotLight(0xfff0c8, 0, 16, .5, .6, 1.4); f.position.set(0, .8, -MITAD); f.target.position.set(0, .2, -MITAD - 6); carro.add(f, f.target); partes0.faros = f;
    // persona
    const pm_ = mat('ropa'), pp = mat('piel');
    const cu = new THREE.Mesh(new THREE.CapsuleGeometry(.17, .5, 4, 10), pm_); cu.position.y = 1.12; const ca = new THREE.Mesh(new THREE.SphereGeometry(.125, 14, 10), pp); ca.position.y = 1.66;
    partes0.piernas = [-1, 1].map(s => { const p = new THREE.Group(); p.position.set(s * .085, .8, 0); const m = new THREE.Mesh(new THREE.CapsuleGeometry(.07, .62, 4, 8), mOscuro); m.position.y = -.38; p.add(m); persona.add(p); return p; });
    persona.add(cu, ca); persona.traverse(o => { if (o.isMesh) o.castShadow = true; }); persona.visible = false;
  }
  const partes0 = {};

  /* ---------- aplicar posiciones ---------- */
  const vA = new THREE.Vector3(), vB = new THREE.Vector3();
  function aplicar() {
    if (cfg.producto !== 'porton') return partes.mover?.(suave(S.q));
    const { p } = S, { W, H } = geo;
    if (cfg.tipo === 'corredizo') { const x = p * geo.T; partes.hoja.position.x = -W / 2 - .1 + x; partes.pinon.rotation.y = -x / .052; partes.ruedas.forEach(r => r.rotation.y = -x / .05); }
    else if (cfg.tipo === 'batiente') {
      const th = p * Math.PI / 2; partes.hojas.forEach(({ piv, s }) => piv.rotation.y = s < 0 ? th : Math.PI - th); porton.updateMatrixWorld(true);
      partes.brazos.forEach(({ br, vast, punta }) => { punta.getWorldPosition(vB); br.lookAt(vB); const d = vB.distanceTo(br.getWorldPosition(vA)); vast.scale.z = d; vast.position.z = d / 2; });
    } else {
      const fi = p * 86 * Math.PI / 180, yb = (H - .02) * (1 - Math.cos(fi)); partes.piv.position.y = yb; partes.piv.rotation.x = -fi;
      const zt = -(H - .02) * Math.sin(fi), cz = Math.min(-.45, zt - .42); partes.carroRiel.position.z = cz;
      vA.set(0, H + .17, cz); vB.set(0, H - .05, zt - .02); partes.biela.position.copy(vA).add(vB).multiplyScalar(.5); partes.biela.lookAt(partes.biela.parent.localToWorld(vB.clone())); partes.biela.scale.z = vA.distanceTo(vB);
    }
    partes.pivP.rotation.y = S.q * 1.48;
    carro.position.z = car.z; persona.position.set(per.x, 0, per.z); persona.rotation.y = per.rumbo;
    partes0.piernas.forEach((l, i) => l.rotation.x = Math.sin(per.paso) * .55 * (i ? 1 : -1));
  }

  /* ---------- día / noche y energía ---------- */
  function tema(dia) {
    cfg.dia = !!dia; const P = dia ? PAL.dia : PAL.noche, L = P.luces, red = S.red ? 1 : 0, propia = S.red || cfg.bateria ? 1 : 0;
    for (const [rol, m] of Object.entries(M)) if (P[rol] !== undefined) m.color.setHex(P[rol]);
    scene.background = new THREE.Color(P.fondo); scene.fog.color.setHex(P.fondo); scene.environmentIntensity = P.env; renderer.toneMappingExposure = P.expo;
    hemi.color.setHex(P.hemiC); hemi.groundColor.setHex(P.hemiS); hemi.intensity = P.hemiI; sol.color.setHex(P.solC); sol.intensity = P.solI; sol.position.set(...P.sol);
    mLinea.color.setHex(P.tinta); mLinea.opacity = P.tintaOp; mTinta.color.setHex(dia ? 0x1a1e2c : 0xdfe6f5);
    const A = ACABADOS[cfg.acabado], col = A.color, pl = !!cfg.plano; // modo plano: el metal vuelve a color liso, como el entorno
    Object.assign(mAcero, { metalness: pl ? 0 : A.metal, roughness: pl ? 1 : A.rug, clearcoat: pl ? 0 : A.capa, envMapIntensity: pl ? .5 : 2.1 }); mAcero.normalScale.setScalar(pl ? 0 : A.piel);
    Object.assign(mMec, { metalness: pl ? 0 : 1, roughness: pl ? 1 : .26, envMapIntensity: pl ? .5 : 2.4 }); mMec.normalScale.setScalar(pl ? 0 : .35); mMotor.clearcoat = pl ? 0 : .5; mMotor.roughness = pl ? 1 : .42; mAcero.color.setHex(col); mPanel.color.setHex(col); mPanelP.color.setHex(col); partes.mPlaca?.color.setHex(col);
    mMotor.color.setHex(P.motor); mMec.color.setHex(P.mecanica);
    mVentana.color.setHex(dia ? 0xc9d6e6 : 0x39425c); mVentana.emissiveIntensity = L * red * .95; mFarol.emissiveIntensity = L * red * 2.4; luzFarol.intensity = cfg.paisaje ? L * red * 22 : 0;
    mLed.emissiveIntensity = L * propia * 2.6; mNum.emissiveIntensity = L * propia * 1.8; luzLed.forEach(l => l.intensity = L * propia * 9); luzPatio.intensity = cfg.paisaje ? L * propia * 7 : 0;
    mTecla.emissiveIntensity = propia * (dia ? .6 : 1.6); mFaro.emissiveIntensity = L * 2.2; if (partes0.faros) partes0.faros.intensity = L * 24;
  }
  function energia(red) { if (S.red === red) return; S.red = red; evento(red ? 'estado' : 'alerta', red ? 'Volvió la energía de la red' : cfg.bateria ? 'Corte de energía: sigue con batería' : 'Corte de energía: sin batería, usa el desbloqueo manual'); tema(cfg.dia); }

  /* ---------- órdenes ---------- */
  function cmd(orden, origen = 'Control') {
    if (cfg.producto !== 'porton') { S.qObj = orden === 'abrir' ? 1 : orden === 'cerrar' ? 0 : orden === 'detener' ? S.q : S.qObj ? 0 : 1; return; }
    const mov = S.estado === 'abriendo' || S.estado === 'cerrando';
    if (orden === 'pulso') orden = S.estado === 'cerrado' ? 'abrir' : S.estado === 'abierto' ? 'cerrar' : mov ? 'detener' : (S.objetivo === 1 ? 'cerrar' : 'abrir');
    if (!S.red && (!cfg.bateria || S.bat < .03) && orden !== 'detener') return evento('alerta', 'Sin energía: el motor no responde');
    if (orden === 'abrir' && S.p < 1) { S.objetivo = 1; if (S.estado !== 'abriendo') { S.estado = 'abriendo'; S.tMov = 0; evento('orden', `${origen}: abrir`); } }
    else if (orden === 'cerrar' && S.p > 0) {
      if (cfg.fotocelda && S.bloqueada) return evento('alerta', 'Fotocelda ocupada: no cierra');
      S.objetivo = 0; if (S.estado !== 'cerrando') { S.estado = 'cerrando'; S.tMov = 0; evento('orden', `${origen}: cerrar`); }
    } else if (orden === 'detener' && mov) { S.estado = 'detenido'; evento('orden', `${origen}: detener`); }
  }
  function mandarCarro(a) {
    car.prueba = false; car.pulsado = false; car.oculto = false;
    if (a === 'auto') a = car.z > 0 ? 'entrar' : 'salir';
    car.objetivo = a === 'entrar' ? Z_DENTRO : Z_FUERA; evento('carro', a === 'entrar' ? 'Llega un carro a la entrada' : 'El carro sale del predio');
  }
  function prueba() {
    if (!cfg.fotocelda) { cfg.fotocelda = true; evento('orden', 'Fotocelda activada para la prueba'); }
    if (car.z < 0) { car.z = Z_FUERA; car.v = 0; } car.oculto = false;
    Object.assign(car, { objetivo: Z_DENTRO, prueba: true, pruebaHecha: false, pulsado: false }); evento('carro', 'Prueba: se ordena cerrar con el carro cruzando');
  }
  function visitante() { Object.assign(per, { fase: 1, x: geo.xPuerta - 6.5, z: 1.7, t: 0, rumbo: Math.PI / 2 }); persona.visible = true; S.qObj = 0; evento('carro', 'Llega un visitante a pie'); }
  function abrirPuerta(origen = 'App') { if (!S.red && !cfg.bateria) return evento('alerta', 'Sin energía: la chapa eléctrica no abre'); S.qObj = 1; S.tPuerta = 0; evento('orden', `${origen}: puerta peatonal abierta`); }

  /* ---------- un paso de simulación ---------- */
  function step(dt) {
    S.reloj += dt;
    if (cfg.producto !== 'porton') { // productos sin automatismo: solo abren a mano, se montan y se despiezan
      S.q += clamp(S.qObj - S.q, -dt / 1.6, dt / 1.6); S.p = S.q; S.estado = S.q <= 0 ? 'cerrado' : S.q >= 1 ? 'abierto' : S.qObj ? 'abriendo' : 'cerrando'; carro.visible = false; mBaliza.emissiveIntensity = 0; luzBaliza.intensity = 0;
      for (const g of grupos) { const u = g.userData, ver = !vis.montaje || vis.paso >= u.paso; u.a = clamp(u.a + (ver ? dt / .75 : -dt / .3), 0, 1); g.visible = u.a > .001; const e = 1 - suave(u.a); g.position.copy(u.base).addScaledVector(u.exp, vis.despiece); g.position.y += e * 1.6; g.scale.setScalar(.82 + .18 * suave(u.a)); }
      return aplicar();
    }
    const frente = car.z - MITAD, cola = car.z + MITAD, [z0, z1] = geo.zona;
    const hayCarro = !car.oculto && !vis.montaje && vis.despiece < .05; carro.visible = hayCarro && (cfg.paisaje || Math.abs(car.v) > .01 || (car.z < Z_FUERA - .05 && car.z > Z_DENTRO + .05));
    S.bloqueada = hayCarro && frente < Z_HAZ && cola > Z_HAZ;
    const enZona = hayCarro && frente < z1 && cola > z0, paso = geo.pmin + .012;
    if (Math.abs(car.objetivo - car.z) > .005 || Math.abs(car.v) > .01) {
      const dir = Math.sign(car.objetivo - car.z) || 1; let meta = car.objetivo;
      if (car.prueba) {
        const espera = 2.6 + MITAD;
        if (!car.pruebaHecha) {
          if (S.estado !== 'abierto') { meta = espera; if (car.z - espera < .3 && !car.pulsado) { car.pulsado = true; cmd('abrir', 'Control remoto'); } }
          else if (frente < 2.25) { car.pruebaHecha = true; cmd('cerrar', 'Tablero'); }
        }
      } else if (!enZona && S.p < paso) {
        const linea = dir < 0 ? z1 + MITAD + .75 : z0 - MITAD - .5;
        if (dir < 0 ? car.z >= linea - .02 : car.z <= linea + .02) {
          meta = linea;
          if (Math.abs(car.z - linea) < .25 && !car.pulsado && S.estado !== 'abriendo') { car.pulsado = true; if (dir < 0) { S.placa = 3.2; evento('estado', 'Cámara: placa ACR·247 autorizada'); cmd('abrir', 'Lectura de placa'); } else cmd('abrir', 'Sensor de salida'); }
        }
      }
      const vmax = car.prueba && cola > Z_HAZ ? 1.1 : 2.4, dist = Math.abs(meta - car.z), vd = Math.sign(meta - car.z) * Math.min(vmax, Math.sqrt(2 * 2.2 * dist));
      car.v += clamp(vd - car.v, -4.5 * dt, 4.5 * dt); car.z += car.v * dt;
      if (dist < .01 && Math.abs(car.v) < .05 && meta === car.objetivo) { car.z = car.objetivo; car.v = 0; car.prueba = false; }
    }
    S.placa = Math.max(0, S.placa - dt);
    // visitante a pie
    if (per.fase) {
      const ir = (x, z, v = 1.25) => { const dx = x - per.x, dz = z - per.z, d = Math.hypot(dx, dz); if (d < .04) return true; per.rumbo = Math.atan2(dx, dz); const s = Math.min(d, v * dt); per.x += dx / d * s; per.z += dz / d * s; per.paso += dt * 9; return false; };
      const xp = geo.xPuerta;
      if (per.fase === 1 && ir(xp + .12, 1.05)) { per.fase = 2; per.t = 0; per.rumbo = Math.PI; }
      else if (per.fase === 2) { per.t += dt; per.paso *= .8; if (per.t > 1.3) { per.fase = 3; evento('estado', 'Teclado: clave correcta'); abrirPuerta('Teclado'); } }
      else if (per.fase === 3) { if (S.qObj === 0) per.fase = 0; else if (S.q > .85) per.fase = 4; }
      else if (per.fase === 4 && ir(xp + .05, -2.2)) { per.fase = 5; }
      else if (per.fase === 5 && ir(xp, -4.6)) { per.fase = 0; per.paso = 0; per.rumbo = Math.PI; persona.visible = false; }
    }
    const enPuerta = per.fase >= 3 && per.z < .9 && per.z > -1.4;
    S.q += clamp(S.qObj - S.q, -dt / 1.1, dt / .8);
    if (S.qObj === 1 && S.q >= 1) { if (enPuerta || per.fase === 3) S.tPuerta = 0; else { S.tPuerta += dt; if (S.tPuerta > 1.6) { S.qObj = 0; evento('estado', 'Puerta peatonal cerrada'); } } }
    // seguridades
    if (S.estado === 'cerrando') {
      if (cfg.fotocelda && S.bloqueada) { S.estado = 'abriendo'; S.objetivo = 1; S.tMov = 0; evento('alerta', 'Fotocelda interrumpida: invierte y abre'); }
      else if (enZona && S.p <= geo.pmin) { S.p = Math.max(S.p, geo.pmin - .004); S.v = 0; S.golpe = .5; S.estado = 'abriendo'; S.objetivo = 1; S.tMov = 0; evento('alerta', 'Obstáculo detectado por esfuerzo: invierte'); }
    }
    if (S.estado === 'abierto' && cfg.autocierre) { if (S.bloqueada || enZona) S.tPausa = 0; else { S.tPausa += dt; if (S.tPausa >= cfg.pausa) { S.tPausa = 0; cmd('cerrar', 'Cierre automático'); } } } else S.tPausa = 0;
    // motor: arranque y parada suaves (con batería va más despacio)
    const lento = S.red ? 1 : .72, rampa = Math.min(.9, cfg.tiempo * .18), vmax = lento / (cfg.tiempo - rampa), a = vmax / rampa, mov = S.estado === 'abriendo' || S.estado === 'cerrando';
    if (mov) {
      const d = S.objetivo - S.p, vd = Math.sign(d) * Math.min(vmax, Math.sqrt(2 * a * Math.abs(d)) + .004);
      S.v += clamp(vd - S.v, -2 * a * dt, 2 * a * dt); S.p += S.v * dt; S.tMov += dt;
      if ((S.objetivo === 1 && S.p >= 1) || (S.objetivo === 0 && S.p <= 0)) { S.p = S.objetivo; S.v = 0; S.estado = S.objetivo ? 'abierto' : 'cerrado'; if (!S.objetivo) S.ciclos++; evento('estado', S.objetivo ? 'Portón abierto' : 'Portón cerrado'); S.tBaliza = 1; }
    } else if (S.v) { S.v -= clamp(S.v, -3 * a * dt, 3 * a * dt); S.p = clamp(S.p + S.v * dt, 0, 1); }
    const inom = ficha.motor.inom; S.golpe = Math.max(0, S.golpe - dt);
    const obj = mov ? inom * (.38 + .5 * Math.abs(S.v) / vmax) * (1 + 1.3 * Math.exp(-S.tMov * 5)) + (S.golpe ? inom * 1.2 : 0) + .06 * Math.sin(S.reloj * 31) : .12;
    S.corriente += (obj - S.corriente) * Math.min(1, dt * 14);
    // batería de respaldo: 2 × 12 V 7 Ah ≈ 168 Wh
    const w = S.corriente * 24; if (!S.red) S.bat = Math.max(0, S.bat - w * dt / 3600 / 168); else S.bat = Math.min(1, S.bat + dt * .0004);
    if (cfg.solar && cfg.dia) S.bat = Math.min(1, S.bat + dt * .0006);
    S.tBaliza = Math.max(0, S.tBaliza - dt);
    const destello = cfg.lampara && (mov || S.tBaliza > 0) && (S.reloj * 2.2) % 1 < .5;
    mBaliza.emissiveIntensity = destello ? 4 : 0; luzBaliza.intensity = destello ? (cfg.dia ? 3 : 16) : 0;
    partes.haz.visible = cfg.fotocelda; mHaz.opacity = S.bloqueada ? .95 : .5; mHaz.color.setHex(S.bloqueada ? 0xff3b2e : 0xee7f74);
    mTecla.emissive.setHex(per.fase === 2 ? 0xffd08a : 0x7fd6a4);
    // montaje y despiece
    for (const g of grupos) {
      const u = g.userData, ver = !vis.montaje || vis.paso >= u.paso; u.a = clamp(u.a + (ver ? dt / .75 : -dt / .3), 0, 1);
      g.visible = u.a > .001; const e = 1 - suave(u.a); g.position.copy(u.base).addScaledVector(u.exp, vis.despiece); g.position.y += e * 2.4; g.scale.setScalar(.82 + .18 * suave(u.a));
    }
    aplicar();
  }

  /* ---------- otros productos de ornamentación: puerta, ventana, reja, baranda, estructura ---------- */
  const mVidrio = new THREE.MeshPhysicalMaterial({ color: 0xbfe0ee, metalness: 0, roughness: .04, transparent: true, opacity: .26, envMapIntensity: 3, side: THREE.DoubleSide, depthWrite: false });
  function construirProducto() {
    const { ancho: W, alto: H, producto: pr } = cfg, acc = nuevoAcc(), y0 = pr === 'ventana' || pr === 'reja' ? .9 : 0, T = (g, ...a) => tubo(g, mAcero, ...a);
    const cil = (g, m, r, l, x, y, z, eje) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, l, 20), m); if (eje === 'x') o.rotation.z = Math.PI / 2; else if (eje === 'z') o.rotation.x = Math.PI / 2; o.position.set(x, y, z); o.castShadow = true; g.add(o); return o; };
    const platina = (g, x, y, z, sx = .12, sz = .12) => { T(g, sx, .008, sz, x, y + .004, z); acc.g = g.userData.nombre; acc.lamina(sx * sz, 'pl6'); for (const a of [-1, 1]) for (const b of [-1, 1]) perno(g, mMec, x + a * (sx / 2 - .022), y + .008, z + b * (sz / 2 - .022)); };
    let detH = [[.5, 1.2, 1.2], [0, 1, 0]], detS = [[.5, .4, .8], [0, .1, 0]]; partes.mover = null;
    if (pr === 'puerta') {
      const t = .06, gF = grupo('Marco fijo', 1, [0, 0, -.9], porton, [W / 2, H * .8, 0], 'tubo 60×60×3 anclado al vano'); acc.g = 'Marco fijo';
      for (const s of [-1, 1]) { T(gF, t, H, t, s * (W / 2 - t / 2), H / 2, 0); acc.add('shs60', H); platina(gF, s * (W / 2 - t / 2), 0, 0, .14, .1); for (const z of [-t / 2, t / 2]) cordon(gF, mAcero, s * (W / 2 - t / 2), .01, z, 'x', t - .012); cordon(gF, mAcero, s * (W / 2 - t), H - t, 0, 'z', t - .014); }
      T(gF, W - 2 * t, t, t, 0, H - t / 2, 0); acc.g = 'Marco fijo'; acc.add('shs60', W - 2 * t);
      const piv = new THREE.Group(); piv.position.set(-W / 2 + t + .006, .012, 0); porton.add(piv); const L = W - 2 * t - .012, Hh = H - t - .02;
      piv.add(hoja(L, Hh, cfg.diseno, acc, false, mAcero, 2, 3, .04));
      const gH = grupo('Herrajes', 4, [0, 0, 1.4], piv, [L - .08, 1.2, .08], 'bisagras, manija y chapa');
      cil(gH, mMec, .013, .5, L - .075, 1.08, .07); for (const y of [.9, 1.26]) cil(gH, mMec, .007, .05, L - .075, y, .045, 'z');
      caja(gH, mOscuro, .05, .14, .035, L - .02, 1.02, 0); for (const y of [.25, Hh / 2, Hh - .3]) { cil(gH, mMec, .011, .1, -.008, y, .03); caja(gH, mMec, .045, .09, .004, .018, y, .022); }
      partes.mover = q => { piv.rotation.y = q * 1.45; }; detH = [[W / 2 - .7, 1.3, 1.5], [W / 2 - .16, 1.08, 0]]; detS = [[W / 2 + .45, .38, .75], [W / 2 - t / 2, .1, 0]];
    } else if (pr === 'ventana') {
      const t = .04, gF = grupo('Marco fijo', 1, [0, 0, -.8], porton, [W / 2, y0 + H, 0], 'tubo 40×40×2'); acc.g = 'Marco fijo';
      for (const s of [-1, 1]) { T(gF, t, H, t * 1.6, s * (W / 2 - t / 2), y0 + H / 2, 0); acc.add('t40', H); } for (const y of [t / 2, H - t / 2]) { T(gF, W - 2 * t, t, t * 1.6, 0, y0 + y, 0); acc.add('t40', W - 2 * t); }
      for (const sx of [-1, 1]) for (const sy of [0, 1]) for (const z of [-.032, .032]) cordon(gF, mAcero, sx * (W / 2 - t), y0 + (sy ? H - t / 2 : t / 2), z, 'y', t - .01, .0035);
      const lw = (W - 2 * t) / 2 + .02, lh = H - 2 * t - .008, b = .025, naves = [];
      for (const [k, z] of [[-1, -.014], [1, .014]]) {
        const nv = new THREE.Group(); nv.position.set(k < 0 ? -W / 2 + t : -.02, y0 + t + .004, z); porton.add(nv); naves.push(nv);
        const gN = grupo('Naves', 2, [0, 0, 1.1 + (k > 0 ? .5 : 0)], nv, [lw / 2, lh, 0], 'tubo 40×20 corredizo'); acc.g = 'Naves';
        for (const x of [b / 2, lw - b / 2]) { T(gN, b, lh, .02, x, lh / 2, 0); acc.add('t4020', lh); } for (const y of [b / 2, lh - b / 2]) { T(gN, lw - 2 * b, b, .02, lw / 2, y, 0); acc.add('t4020', lw - 2 * b); }
        const gV = grupo('Vidrio', 3, [0, 0, 2 + (k > 0 ? .5 : 0)], nv, [lw / 2, lh / 2, 0], 'templado 6 mm'); const v = new THREE.Mesh(UNIT, mVidrio); v.scale.set(lw - 2 * b + .01, lh - 2 * b + .01, .006); v.position.set(lw / 2, lh / 2, 0); gV.add(v);
        if (k > 0) { const gH = grupo('Herrajes', 4, [0, 0, 2.9], nv, [.03, lh / 2, .03], 'manija, cierre y rodachinas'); cil(gH, mMec, .008, .16, .0125, lh / 2, .026); for (const y of [-.06, .06]) cil(gH, mMec, .005, .02, .0125, lh / 2 + y, .016, 'z'); for (const x of [.08, lw - .08]) cil(gH, mMec, .012, .012, x, -.002, 0, 'z'); }
      }
      partes.mover = q => { naves[1].position.x = -.02 - q * (lw - .07); }; detH = [[-.5, y0 + H / 2 + .2, 1.2], [0, y0 + H / 2, 0]]; detS = [[W / 2 + .35, y0 + .25, .6], [W / 2 - t, y0 + .03, 0]];
    } else if (pr === 'reja') {
      const gA = grupo('Anclajes', 1, [0, 0, -.8], porton, [W / 2, y0 + H, -.04], 'platina 6 mm con perno de expansión'); acc.g = 'Anclajes';
      for (const sx of [-1, 1]) for (const y of [.12, H - .12]) { T(gA, .09, .05, .006, sx * (W / 2 + .03), y0 + y, -.02); acc.lamina(.09 * .05, 'pl6'); const pn = new THREE.Group(); pn.position.set(sx * (W / 2 + .05), y0 + y, -.017); pn.rotation.x = Math.PI / 2; gA.add(pn); perno(pn, mMec, 0, 0, 0); cordon(gA, mAcero, sx * (W / 2 + .001), y0 + y, -.018, 'y', .045, .0035); }
      const h = hoja(W, H, cfg.diseno, acc, cfg.diseno === 'lanzas', mAcero, 2, 3, .04); h.position.set(-W / 2, y0, 0); porton.add(h);
      detH = [[-.6, y0 + H / 2 + .25, 1.3], [0, y0 + H / 2, 0]]; detS = [[W / 2 + .4, y0 + .3, .6], [W / 2, y0 + .12, 0]];
    } else if (pr === 'baranda') {
      const n = Math.max(1, Math.ceil(W / 1.25)), bay = W / n, pt = .04, gP = grupo('Postes', 1, [0, 0, -.8], porton, [-W / 2, H, 0], 'tubo 40×40×2 con platina'); acc.g = 'Postes';
      caja(entorno, mConcreto, W + .5, .16, .5, 0, -.08, -.1);
      for (let i = 0; i <= n; i++) { const x = -W / 2 + bay * i; T(gP, pt, H - .008, pt, x, .008 + (H - .008) / 2, 0); acc.g = 'Postes'; acc.add('t40', H); platina(gP, x, 0, 0, .11, .11); for (const s of [-1, 1]) { cordon(gP, mAcero, x, .012, s * pt / 2, 'x', pt - .008, .004); cordon(gP, mAcero, x + s * pt / 2, .012, 0, 'z', pt - .008, .004); } }
      for (let i = 0; i < n; i++) { const h = hoja(bay - pt - .03, H - .2, cfg.diseno, acc, false, mAcero, 2, 3, .04); h.position.set(-W / 2 + bay * i + pt / 2 + .015, .1, 0); porton.add(h); }
      const gM = grupo('Pasamanos', 4, [0, .9, 0], porton, [0, H + .06, 0], 'tubo redondo 2"'); acc.g = 'Pasamanos'; cil(gM, mAcero, .025, W + .1, 0, H + .028, 0, 'x'); acc.add('red50', W + .1);
      for (let i = 0; i <= n; i++) cordon(gM, mAcero, -W / 2 + bay * i, H + .004, 0, 'x', pt, .004);
      detH = [[-.3, H + .5, 1.3], [0, H - .1, 0]]; detS = [[-W / 2 + .45, .35, .8], [-W / 2, .08, 0]];
    } else {
      const D = Math.min(3.2, W * .8), c = .08, gC = grupo('Columnas', 1, [0, 0, 0], porton, [W / 2, H * .5, D / 2], 'tubo 80×80×3 con platina y pernos'); acc.g = 'Columnas';
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const x = sx * (W / 2 - c / 2), z = sz * (D / 2 - c / 2); caja(gC, mConcreto, .34, .08, .34, x, .02, z); T(gC, c, H - .066, c, x, .066 + (H - .066) / 2, z); acc.g = 'Columnas'; acc.add('shs80', H); T(gC, .22, .012, .22, x, .066, z); acc.lamina(.22 * .22, 'pl6'); for (const a of [-1, 1]) for (const b of [-1, 1]) perno(gC, mMec, x + a * .085, .072, z + b * .085); for (const s of [-1, 1]) { cordon(gC, mAcero, x, .074, z + s * c / 2, 'x', c - .02); cordon(gC, mAcero, x + s * c / 2, .074, z, 'z', c - .02); } }
      const gV = grupo('Vigas', 2, [0, .9, 0], porton, [0, H + .1, D / 2], 'tubo 80×80×3'); acc.g = 'Vigas';
      for (const sz of [-1, 1]) { T(gV, W + .3, c, c, 0, H + c / 2, sz * (D / 2 - c / 2)); acc.add('shs80', W + .3); for (const sx of [-1, 1]) cordon(gV, mAcero, sx * (W / 2 - c / 2), H + .002, sz * (D / 2 - c), 'x', c - .02); }
      for (const sx of [-1, 1]) { T(gV, c, c, D - 2 * c, sx * (W / 2 - c / 2), H + c / 2, 0); acc.add('shs80', D - 2 * c); }
      const gT = grupo('Cubierta', 3, [0, 2, 0], porton, [0, H + .2, 0], 'listones 80×20 a 45°'); acc.g = 'Cubierta';
      const nl = Math.floor((W + .2) / .16); for (let i = 0; i <= nl; i++) { const o = T(gT, .02, .08, D + .3, -W / 2 - .1 + (W + .2) * i / nl, H + c + .04, 0); o.rotateZ(.5); acc.add('l80', D + .3); }
      detH = [[W / 2 + 1.1, H + .5, D / 2 + 1.3], [W / 2 - .1, H, D / 2 - .1]]; detS = [[W / 2 + .5, .42, D / 2 + .7], [W / 2 - c / 2, .1, D / 2 - c / 2]];
    }
    const top = y0 + H; geo = { W, H, hp: top, xd: W / 2, xi: -W / 2, xp: 0, T: 1, zona: [0, 0], pmin: 0, cy: y0 + H / 2, R: Math.max(W, H, 1.3), detH, detS, xPuerta: 0, patron: null };
    porton.traverse(o => { if (o.userData.patron && !geo.patron) geo.patron = o.userData.patron; });
    for (const k of ['anclaFoto', 'anclaCam', 'anclaTecla', 'anclaMotor']) geo[k] = new THREE.Vector3(0, top, 0);
    for (const g of grupos) g.userData.base.copy(g.position);
    const t = acc.total(); ficha = { ...t, kgHoja: t.kg, motor: { modelo: 'Manual', dato: 'sin automatismo', inom: 0 }, tipo: pr, ancho: W, alto: H, hojas: 1, abierto: geo.patron?.abierto || 0 };
    Object.assign(S, { p: 0, v: 0, estado: 'cerrado', objetivo: 0, tPausa: 0, q: 0, qObj: 0 }); Object.assign(per, { fase: 0 }); persona.visible = false; carro.visible = false; luzLed.forEach(l => l.position.set(0, top + 1.2, 1.5)) ; luzLed.forEach(l => l.target.position.set(0, y0 + H / 2, 0));
    partes.mover?.(0); tema(cfg.dia); entintar();
  }

  /* ---------- cámara y render ---------- */
  const vistas = () => {
    const { W, H } = geo, t = cfg.tipo;
    if (cfg.producto !== 'porton') { const { R, cy, detH, detS } = geo, o = [0, cy, 0];
      return { calle: [[R * 1.25 + .7, cy + R * .45, R * 1.9 + 1.1], o], frente: [[-R * .8, cy + .25, R * 1.9 + 1.1], o], predio: [[R * 1.1, cy + R * .4, -(R * 1.9 + 1.1)], o], motor: detH, herrajes: detH, soldadura: detS,
        aerea: [[R * .5, R * 3.2 + 3, R * 2], [0, 0, 0]], despiece: [[R * 1.7 + 1.6, cy + R * .6, R * 2.6 + 2.6], [0, cy, .9]], alzado: [[0, cy, R * 3.4 + 3], o] }; }
    return {
      calle: [[W * .9 + 4.4, 5.2, 13 + W], [-.6, H * .45, .5]], predio: [[W * .9 + 3.5, 3.6, -(7.5 + W * .7)], [-.4, H * .45, 0]],
      frente: [[-7, 2.7, 9 + W * .6], [-1.2, H * .5, 0]],
      motor: t === 'corredizo' ? [[W / 2 + 2.7, 1.5, -3.1], [W / 2 + .5, .4, -.4]] : t === 'batiente' ? [[-W / 2 + 2.3, 2, -3.4], [-W / 2 + .25, .85, -.3]] : [[W / 2 + 3.4, H + 2.4, -H - 4.6], [0, H, -H / 2]],
      herrajes: [[geo.xi + .1, 1.38, 1.75], [geo.xi + .72, 1.1, 0]], soldadura: [[geo.xd + .5, .42, .8], [geo.xd, .13, 0]],
      aerea: [[5, 17, 13], [0, 0, -1.5]], despiece: [[W * .8 + 5, 4.2, 8.6 + W * .8], [-.3, H * .6, 1.3]], alzado: [[-.6, H * .55, 15 + W * 1.5], [-.6, H * .55, 0]],
    };
  };
  let vuelo = null;
  function vista(nombre, inmediata) {
    const [p, o] = vistas()[nombre] || vistas().calle, k = camera.aspect < 1 ? 1 + (1 - camera.aspect) * 1.25 : 1;
    const obj = new THREE.Vector3(...o), pos = obj.clone().add(new THREE.Vector3(...p).sub(obj).multiplyScalar(k));
    if (inmediata) { camera.position.copy(pos); controls.target.copy(obj); controls.update(); vuelo = null; } else vuelo = { p0: camera.position.clone(), o0: controls.target.clone(), p1: pos, o1: obj, t: 0 };
  }
  let composer = null, bloom = null, tam = [1, 1, 1], sinBrillo = false;
  function armarComposer() {
    const [w, h, dpr] = tam;
    // En iPhone (WebKit) el búfer de punto flotante con antialias multimuestra no siempre está disponible: el resultado es un visor vacío en modo noche.
    // Se usa medio punto flotante solo si la extensión existe; si no, búfer de 8 bits con el mismo antialias.
    const gl = renderer.getContext(), flotante = !!gl.getExtension('EXT_color_buffer_float') || !!gl.getExtension('EXT_color_buffer_half_float');
    const rt = new THREE.WebGLRenderTarget(w * dpr, h * dpr, { samples: 4, type: flotante ? THREE.HalfFloatType : THREE.UnsignedByteType });
    composer = new EffectComposer(renderer, rt); composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(w, h), .32, .55, 1.05); composer.addPass(bloom); composer.addPass(new OutputPass());
  }
  renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); sinBrillo = true; composer = null; });
  renderer.domElement.addEventListener('webglcontextrestored', () => { sinBrillo = false; });
  function render(dt = 0) {
    if (vuelo) { vuelo.t = Math.min(1, vuelo.t + dt / .9); const e = suave(vuelo.t); camera.position.lerpVectors(vuelo.p0, vuelo.p1, e); controls.target.lerpVectors(vuelo.o0, vuelo.o1, e); if (vuelo.t >= 1) vuelo = null; }
    if (controls.enabled) controls.update(); marcar();
    if (cfg.brillo && !cfg.dia && !sinBrillo) { if (!composer) armarComposer(); composer.render(); } else renderer.render(scene, camera);
  }
  function medida(w, h, dpr = Math.min(1.75, window.devicePixelRatio || 1)) { tam = [w, h, dpr]; renderer.setPixelRatio(dpr); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); if (composer) { composer.setPixelRatio(dpr); composer.setSize(w, h); } }
  const vP = new THREE.Vector3(), rayo = new THREE.Raycaster(), vD = new THREE.Vector3();
  function tapado(v) { const d = vD.copy(v).sub(camera.position).length(); rayo.set(camera.position, vD.normalize()); rayo.far = d - .45; return rayo.intersectObjects([entorno, porton], true).some(i => i.object.isMesh && i.object.visible && i.object !== partes.haz && !i.object.userData.lamina); }
  function aPantalla(v, w, h) { vP.copy(v).project(camera); return { x: (vP.x * .5 + .5) * w, y: (-vP.y * .5 + .5) * h, visible: vP.z < 1 && Math.abs(vP.x) < 1.05 && Math.abs(vP.y) < 1.05 }; }
  function etiquetas() { // grupos visibles con su punto de anclaje en el mundo
    const vistos = new Set();
    return grupos.filter(g => g.visible && g.userData.a > .6 && !vistos.has(g.userData.nombre) && vistos.add(g.userData.nombre)).map((g, i) => ({ n: i + 1, nombre: g.userData.nombre, detalle: g.userData.detalle, paso: g.userData.paso, kg: ficha.grupos?.[g.userData.nombre]?.kg || 0, piezas: ficha.grupos?.[g.userData.nombre]?.piezas || 0, lista: ficha.grupos?.[g.userData.nombre]?.lista || [], pos: g.localToWorld(g.userData.ancla.clone()) }));
  }
  /* marca una pieza del despiece con un recuadro */
  const cajaSel = new THREE.Box3(), marco = new THREE.Box3Helper(cajaSel, 0xee7f74); marco.visible = false; marco.material.depthTest = false; marco.renderOrder = 9; scene.add(marco); let sel = null;
  const mTinta = new THREE.LineBasicMaterial({ color: 0x1a1e2c, transparent: true, opacity: .85 });
  function entintar() { // modo plano: aristas a tinta sobre color liso, como un plano de taller
    const quitar = []; porton.traverse(o => { if (o.userData.tinta) quitar.push(o); }); quitar.forEach(o => { o.parent.remove(o); o.geometry.dispose(); });
    if (!cfg.plano) return; const con = []; porton.traverse(o => { if (o.isMesh && (o.material === mAcero || o.material === mMec || o.material === mMotor) && !CORD.has(o.geometry)) con.push(o); });
    for (const o of con) { const l = new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry, 28), mTinta); l.userData.tinta = true; o.add(l); }
  }
  function pasos() { return PRODUCTOS[cfg.producto].pasos || PASOS; }
  function resaltar(nombre) { sel = nombre || null; marco.visible = false; }
  function marcar() { if (!sel) return; cajaSel.makeEmpty(); for (const g of grupos) if (g.userData.nombre === sel && g.visible) cajaSel.expandByObject(g); marco.visible = !cajaSel.isEmpty(); if (marco.visible) cajaSel.expandByScalar(.03);
  }

  /* ---------- energía, costo y ganancia con la base de datos de precios ---------- */
  const $p = id => BD.precio(id), es1 = n => n.toLocaleString('es-CO', { maximumFractionDigits: 1 });
  function cuentas(prov = 'mundial') {
    const f = ficha, P = PRECIOS, pMov = f.motor.inom * .7 * 24, whCiclo = pMov * 2 * cfg.tiempo / 3600, reposo = 3.5;
    const kwhMes = (whCiclo * cfg.ciclosDia + reposo * 24) * 30 / 1000, ciclosBat = Math.floor(168 * .8 / (whCiclo + .05)), esP = cfg.producto === 'porton';
    const pv = PROVEEDORES[prov], desc = P.descuento[prov] ?? pv.descuento, ped = f.pedido(prov);
    // material: cada renglón del pedido al precio de referencia de la base de datos, menos el descuento supuesto del proveedor
    const material = ped.map(r => { const it = r.bd && BD.item(r.bd), u = it ? (it.perfil === 'pl6' ? r.kg / it.kg : r.cant) : 0, bruto = u * (r.ref || 0); return { ...r, unidades: u, bruto, costo: bruto * (1 - desc), fuente: it?.fuente }; });
    const mat = material.reduce((a, b) => a + b.costo, 0), kgCompra = ped.reduce((a, b) => a + b.kg, 0), envioGratis = pv.envio > 0 && mat >= pv.envio;
    const L = (nombre, detalle, valor, grupo) => ({ nombre, detalle, valor, grupo });
    const items = material.filter(m => !m.falta || prov !== 'campana').map(m => L(m.nombre, `${m.clave === 'pl6' ? es1(m.kg) + ' kg' : m.unidades + ' ' + m.unidad} · ${m.fuente ? BD.fuentes[m.fuente].nombre : 'sin referencia'}${desc ? ` · −${Math.round(desc * 100)} %` : ''}`, m.costo, 'Material'));
    if (prov === 'campana') for (const m of material.filter(m => m.falta)) items.push(L(m.nombre, `${m.unidades} ${m.unidad} · se compra en Mundial de Perfiles`, m.bruto * (1 - P.descuento.mundial), 'Material'));
    items.push(L('Consumibles', 'electrodos, discos y anticorrosivo', mat * P.consumibles, 'Material'));
    if (f.corte) items.push(L('Corte láser de la celosía', `${Math.round(f.corte)} m de corte · ${BD.fuentes.magru.nombre}`, f.corte * $p('corte-laser'), 'Servicios'));
    items.push(L('Pintura electrostática', `${f.pintura.toFixed(1)} m²`, f.pintura * $p('pintura-electro'), 'Servicios'));
    if (esP) {
      items.push(L(f.motor.modelo, 'motor, tarjeta y controles · ' + BD.fuentes[BD.item(f.motor.bd).fuente].nombre, $p(f.motor.bd), 'Automatismo'));
      if (cfg.tipo === 'corredizo') { items.push(L('Ruedas y guía', '2 ruedas de 250 kg y guía de nylon', 2 * $p('rueda-porton') + $p('guia-porton'), 'Automatismo')); if (f.motor.bd === 'motor-corr-850') items.push(L('Cremallera', `${(cfg.ancho + .5).toFixed(1)} m`, (cfg.ancho + .5) * $p('cremallera'), 'Automatismo')); }
      if (cfg.bateria && f.motor.bd !== 'motor-bat-200') items.push(L('Batería de respaldo', '24 V 7 Ah', $p('bateria-24v'), 'Automatismo'));
      items.push(L('Fotoceldas y lámpara', 'kit de seguridad', $p('fotocelda') + $p('lampara'), 'Seguridad'));
      items.push(L('Acceso inteligente', 'cámara de placas, teclado y cerradura eléctrica', $p('camara-placas') + $p('teclado') + $p('cerradura-elec'), 'Seguridad'));
      items.push(L('Puerta peatonal', 'cerradura, manija y bisagras', $p('cerradura-ppal') + $p('manija-inox') + 3 * $p('bisagra-barril'), 'Herrajes'));
      if (cfg.solar) items.push(L('Panel solar 50 W', 'con regulador', $p('solar-50w'), 'Automatismo'));
    } else if (cfg.producto === 'puerta') items.push(L('Herrajes de la puerta', 'cerradura principal, manija y 3 bisagras', $p('cerradura-ppal') + $p('manija-inox') + 3 * $p('bisagra-barril'), 'Herrajes'));
    else if (cfg.producto === 'ventana') items.push(L('Vidrio y herrajes', `vidrio templado 6 mm ${(cfg.ancho * cfg.alto).toFixed(1)} m², rodachinas y cierre`, cfg.ancho * cfg.alto * $p('vidrio-6') + $p('rodachina') + $p('cerradura-sobreponer'), 'Herrajes'));
    else if (cfg.producto === 'reja') items.push(L('Anclajes', '4 pernos de expansión', 4 * $p('anclaje-expansion'), 'Herrajes'));
    else if (cfg.producto === 'baranda') items.push(L('Anclajes', `${Math.ceil(cfg.ancho / 1.25) + 1} platinas con 4 pernos`, (Math.ceil(cfg.ancho / 1.25) + 1) * 4 * $p('anclaje-expansion'), 'Herrajes'));
    else items.push(L('Anclajes', '4 platinas con pernos de expansión', 16 * $p('anclaje-expansion'), 'Herrajes'));
    items.push(L('Mano de obra de taller', `${Math.round(f.kg)} kg fabricados`, f.kg * $p('mano-obra'), 'Mano de obra'));
    items.push(L(esP ? 'Instalación y puesta en marcha' : 'Instalación', 'anclaje en obra', $p(esP ? 'instalacion-porton' : cfg.producto === 'estructura' ? 'instalacion-estructura' : 'instalacion-menor'), 'Mano de obra'));
    const costo = items.reduce((a, b) => a + b.valor, 0), venta = costo / (1 - P.margen), ganancia = venta - costo;
    const grupos = {}; for (const it of items) grupos[it.grupo] = (grupos[it.grupo] || 0) + it.valor;
    return { prov, whCiclo, kwhMes, costoMes: kwhMes * (cfg.solar ? .15 : 1) * P.kwh, ciclosBat, items, grupos, material: mat, kgCompra, costo, venta, ganancia, margen: P.margen, envioGratis, faltan: ped.filter(r => r.falta).length, ventaKg: f.kg ? venta / f.kg : 0, total: venta };
  }
  function ganancia(prov = 'mundial') { return cuentas(prov); }

  construirCarro(); construir(); vista('calle', true);
  canvas.addEventListener('pointerdown', () => { vuelo = null; });

  return {
    pasos, resaltar, plano(v) { cfg.plano = !!v; tema(cfg.dia); entintar(); },
    cfg, S, car, per, vis, camera, controls, renderer, scene, step, render, medida, vista, cmd, prueba, visitante, abrirPuerta, energia, tema, aPantalla, tapado, etiquetas, cuentas, ganancia,
    carro: mandarCarro, verCarro(v) { car.oculto = !v; },
    montaje(activo, paso) { vis.montaje = activo; if (paso !== undefined) vis.paso = clamp(paso, 0, pasos().length - 1); if (activo && paso === 0) for (const g of grupos) g.userData.a = 0; },
    set(c) { const re = ['producto', 'tipo', 'diseno', 'modelo', 'ancho', 'alto', 'motivo', 'densidad', 'apertura', 'semilla', 'solar'].some(k => k in c && c[k] !== cfg[k]); Object.assign(cfg, c); if (re) construir(); else tema(cfg.dia); },
    dxf() { return geo.patron ? dxfPatron(geo.patron) : ''; },
    get ficha() { return ficha; }, get geo() { return geo; },
    alEvento(f) { oyentes.push(f); },
    telemetria() {
      const v = Math.abs(S.v), t = cfg.tipo;
      return {
        estado: S.estado, apertura: S.p, corriente: S.corriente, potencia: S.corriente * 24, velocidad: t === 'corredizo' ? v * geo.T * 100 : v * (t === 'batiente' ? 90 : 86), unidadVel: t === 'corredizo' ? 'cm/s' : '°/s',
        ciclos: S.ciclos, pausa: S.estado === 'abierto' && cfg.autocierre ? Math.max(0, cfg.pausa - S.tPausa) : null, bloqueada: S.bloqueada, carroDentro: car.z < 0, red: S.red, bat: S.bat, placa: S.placa > 0, puerta: S.q,
      };
    },
  };
}
