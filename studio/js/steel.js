// Motor de estructuras de acero de AceroStudio: catálogo de perfiles, geometría de barras y
// generadores de edificios, naves y pabellones en acero. Sin Three.js: lo usan el Studio, los
// exportadores (sólidos, IFC) y el servidor MCP.
//
// Elemento `member` (barra de acero en 3D): { type: 'member', role, profile, p0: [x, y, z], p1: [x, y, z],
//   roll, w, h, material } con y relativo a la cota del nivel. `role`: viga, vigueta, diagonal, cordon,
//   montante, correa, parteluz, lamina. Los perfiles 'PL' (lámina o panel) usan w × h en metros.
import { emptyDoc, uid } from './model.js';

const r3 = (v) => +(+v).toFixed(3);

// Perfiles europeos (medidas en mm, masa en kg/m). I = IPE/HEB, SHS = tubo cuadrado, CHS = tubo circular.
const I = (h, b, tw, tf, kg) => ({ shape: 'I', h: h / 1000, b: b / 1000, tw: tw / 1000, tf: tf / 1000, kg });
const SHS = (a, t, kg) => ({ shape: 'SHS', h: a / 1000, b: a / 1000, t: t / 1000, kg });
const CHS = (d, t, kg) => ({ shape: 'CHS', h: d / 1000, b: d / 1000, t: t / 1000, kg });
export const PROFILES = {
  IPE200: I(200, 100, 5.6, 8.5, 22.4), IPE240: I(240, 120, 6.2, 9.8, 30.7), IPE270: I(270, 135, 6.6, 10.2, 36.1),
  IPE300: I(300, 150, 7.1, 10.7, 42.2), IPE360: I(360, 170, 8, 12.7, 57.1), IPE400: I(400, 180, 8.6, 13.5, 66.3),
  IPE450: I(450, 190, 9.4, 14.6, 77.6), IPE500: I(500, 200, 10.2, 16, 90.7), IPE600: I(600, 220, 12, 19, 122),
  HEB160: I(160, 160, 8, 13, 42.6), HEB200: I(200, 200, 9, 15, 61.3), HEB240: I(240, 240, 10, 17, 83.2),
  HEB280: I(280, 280, 10.5, 18, 103), HEB300: I(300, 300, 11, 19, 117), HEB360: I(360, 300, 12.5, 22.5, 142),
  HEB400: I(400, 300, 13.5, 24, 155), HEB500: I(500, 300, 14.5, 28, 187),
  SHS100: SHS(100, 6, 16.8), SHS120: SHS(120, 6, 20.7), SHS150: SHS(150, 8, 34.4), SHS200: SHS(200, 10, 57),
  SHS250: SHS(250, 10, 72.7), SHS300: SHS(300, 12, 106),
  CHS114: CHS(114.3, 6, 16), CHS168: CHS(168.3, 8, 31.6), CHS219: CHS(219.1, 10, 51.6), CHS273: CHS(273, 10, 64.9), CHS323: CHS(323.9, 12, 92.3),
};
export const PROFILE_GROUPS = [
  ['IPE (vigas)', Object.keys(PROFILES).filter((k) => k.startsWith('IPE'))],
  ['HEB (columnas)', Object.keys(PROFILES).filter((k) => k.startsWith('HEB'))],
  ['Tubo cuadrado', Object.keys(PROFILES).filter((k) => k.startsWith('SHS'))],
  ['Tubo circular', Object.keys(PROFILES).filter((k) => k.startsWith('CHS'))],
];
export const profileLabel = (k) => {
  const p = PROFILES[k];
  if (!p) return k;
  if (p.shape === 'SHS') return `Tubo □ ${Math.round(p.h * 1000)}×${Math.round(p.t * 1000)}`;
  if (p.shape === 'CHS') return `Tubo ○ ${Math.round(p.h * 1000 * 10) / 10}×${Math.round(p.t * 1000)}`;
  return `${k.slice(0, 3)} ${k.slice(3)}`;
};

// Perfil de un elemento: del catálogo, o una lámina/panel PL de w × h.
export function profileOf(el) {
  const p = PROFILES[el.profile];
  if (p) return p;
  return { shape: 'PL', h: el.h || 0.01, b: el.w || 0.2, kg: (el.w || 0.2) * (el.h || 0.01) * 7850, plate: true };
}

// Contorno de la sección centrado en el eje, en coordenadas (u = ancho, v = alto). Los tubos van huecos
// solo en Three.js e IFC; aquí se devuelve el contorno exterior (y el interior por separado).
export function sectionOutline(p, n = 20) {
  if (p.shape === 'I') {
    const b = p.b / 2, h = p.h / 2, tf = p.tf, tw = p.tw / 2;
    return [[-b, -h], [b, -h], [b, -h + tf], [tw, -h + tf], [tw, h - tf], [b, h - tf], [b, h],
      [-b, h], [-b, h - tf], [-tw, h - tf], [-tw, -h + tf], [-b, -h + tf]];
  }
  if (p.shape === 'CHS') return Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return [Math.cos(a) * p.h / 2, Math.sin(a) * p.h / 2]; });
  const b = p.b / 2, h = p.h / 2;
  return [[-b, -h], [b, -h], [b, h], [-b, h]];
}
export function sectionHole(p, n = 20) {
  if (p.shape === 'CHS') return Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return [Math.cos(a) * (p.h / 2 - p.t), Math.sin(a) * (p.h / 2 - p.t)]; });
  if (p.shape === 'SHS') { const b = p.b / 2 - p.t, h = p.h / 2 - p.t; return [[-b, -h], [b, -h], [b, h], [-b, h]]; }
  return null;
}

// Sistema local de una barra: t = eje, v = "alto" del perfil (vertical en vigas), u = ancho.
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(...a) || 1; return a.map((x) => x / l); };
export function memberFrame(m) {
  const d = sub(m.p1, m.p0), L = Math.hypot(...d) || 1e-6, t = d.map((x) => x / L);
  let ref = Math.abs(t[1]) > 0.98 ? [0, 0, 1] : [0, 1, 0];
  let v = norm(sub(ref, t.map((x) => x * dot(ref, t))));
  let u = cross(v, t);
  if (m.roll) {
    const c = Math.cos(m.roll), s = Math.sin(m.roll);
    [u, v] = [u.map((x, i) => x * c + v[i] * s), v.map((x, i) => -u[i] * s + x * c)];
  }
  return { t, u, v, L };
}

// Peso de la barra en kg.
export const memberLength = (m) => Math.hypot(...sub(m.p1, m.p0));
export const memberKg = (m) => profileOf(m).kg * memberLength(m);

// Tamaños según luz y altura (predimensionamiento rápido, no reemplaza el cálculo estructural).
export function beamFor(span) {
  const need = span / 20; // canto ≈ L/20 para vigas de piso
  return ['IPE240', 'IPE270', 'IPE300', 'IPE360', 'IPE400', 'IPE450', 'IPE500', 'IPE600'].find((k) => PROFILES[k].h >= need) || 'IPE600';
}
export function columnFor(floors) {
  return floors <= 2 ? 'HEB200' : floors <= 4 ? 'HEB240' : floors <= 7 ? 'HEB300' : floors <= 11 ? 'HEB400' : 'HEB500';
}

// Columna del Studio con un perfil del catálogo (ancho/fondo coherentes con el perfil).
export function steelColumn(profile, x, z, height, extra = {}) {
  const p = PROFILES[profile];
  return { id: uid(), type: 'column', layer: 'c_est', material: 'acero_grafito', profile, x: r3(x), z: r3(z), w: p.b, d: p.h, height: r3(height), rotY: 0, ...extra };
}
export function member(role, profile, p0, p1, extra = {}) {
  return { id: uid(), type: 'member', layer: 'c_est', material: 'acero_grafito', role, profile, p0: p0.map(r3), p1: p1.map(r3), ...extra };
}

// ---------------------------------------------------------------------------------------------
// Generadores. Todos devuelven un documento completo del Studio.

export const STEEL_DEFAULTS = {
  tipo: 'edificio',
  name: 'Edificio en acero',
  // edificio
  spanX: 7.5, baysX: 3, spanZ: 6, baysZ: 2, floors: 5, floorHeight: 3.6, groundHeight: 4.5,
  cantilever: 2.4, gallery: 1.2, facade: 'cortina', bracing: true, rooftop: true,
  // nave
  span: 20, length: 36, frameSpacing: 6, eave: 7.5, pitch: 0.12, truss: true,
  // pabellón
  width: 24, depth: 15, height: 4.5, overhang: 3.5,
  // materiales
  steel: 'acero_grafito', glass: 'vidrio', deck: 'losa_steeldeck', cladding: 'panel_metalico', soffit: 'roble',
};

export const STEEL_TYPES = {
  edificio: 'Edificio de pórticos de acero',
  nave: 'Nave / bodega con cerchas',
  pabellon: 'Pabellón / showroom',
  casa: 'Casa en acero con voladizo',
};

export function steelBuilding(params = {}) {
  const P = { ...STEEL_DEFAULTS, ...params };
  if (P.tipo === 'nave') return steelWarehouse(P);
  if (P.tipo === 'pabellon') return steelPavilion(P);
  if (P.tipo === 'casa') return steelFrame({ ...STEEL_DEFAULTS, spanX: 5, baysX: 3, spanZ: 4.5, baysZ: 2, floors: 2, floorHeight: 3.2, groundHeight: 3.4, cantilever: 4, gallery: 0.6, rooftop: false, bracing: true, name: 'Casa en acero', ...params, tipo: 'casa' });
  return steelFrame(P);
}

function levelsFor(doc, heights, roofName = 'Cubierta') {
  let elev = 0;
  doc.levels = heights.map((h, i) => {
    const l = { id: i ? uid('n') : 'n0', name: i < heights.length - 1 || !roofName ? `Piso ${i + 1}` : roofName, elev: r3(elev), height: h };
    elev += h;
    return l;
  });
  doc.activeLevel = 'n0';
  return doc.levels;
}

const rect = (x0, z0, x1, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map((p) => p.map(r3));

// Muro cortina: vidrio continuo entre losas con parteluces de acero cada `mod` metros.
function curtainWall(push, lvl, a, b, H, P, mod = 1.5) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < 0.3 || H < 0.5) return;
  push({ type: 'wall', level: lvl, layer: 'c_arq', material: P.glass, a: a.map(r3), b: b.map(r3), height: r3(H), thickness: 0.03, openings: [], curtain: true });
  const n = Math.max(1, Math.round(L / mod));
  const ux = (b[0] - a[0]) / L, uz = (b[1] - a[1]) / L, roll = Math.atan2(-uz, ux); // canto del parteluz ⟂ al vidrio
  for (let i = 0; i <= n; i++) {
    const x = a[0] + (ux * L * i) / n, z = a[1] + (uz * L * i) / n;
    push(member('parteluz', 'PL', [x, 0, z], [x, H, z], { level: lvl, w: 0.05, h: 0.16, roll: r3(roll), material: P.steel }));
  }
  push(member('parteluz', 'PL', [a[0], H - 0.05, a[1]], [b[0], H - 0.05, b[1]], { level: lvl, w: 0.1, h: 0.05, material: P.steel }));
}

// Edificio de pórticos: columnas HEB, vigas IPE en ambas direcciones, viguetas, losa sobre steel deck,
// arriostramiento en X a la vista en los testeros, muro cortina retranqueado (galería) y voladizo al frente.
function steelFrame(P) {
  const doc = emptyDoc();
  doc.name = P.name;
  const nF = Math.max(1, Math.round(P.floors));
  const heights = [P.groundHeight, ...Array(nF - 1).fill(P.floorHeight), 1.2];
  const levels = levelsFor(doc, heights);
  const W = P.spanX * P.baysX, D = P.spanZ * P.baysZ, cv = Math.max(0, P.cantilever || 0);
  const col = P.column || columnFor(nF), beamX = P.beamX || beamFor(P.spanX), beamZ = P.beamZ || beamFor(P.spanZ + cv * 0.6);
  const joist = P.spanZ > 7 ? 'IPE270' : 'IPE240';
  const deck = 0.14, edge = 0.15;
  const push = (o) => doc.elements.push({ id: uid(), ...o });
  const xs = Array.from({ length: P.baysX + 1 }, (_, i) => i * P.spanX);
  const zs = Array.from({ length: P.baysZ + 1 }, (_, i) => i * P.spanZ);

  // Plaza de acceso (planta baja).
  push({ type: 'slab', level: 'n0', layer: 'c_arq', material: 'microcemento', thickness: 0.2, name: 'Plaza', ground: true, points: rect(-3, -3, W + 3, D + cv + 5) });

  for (let f = 0; f < nF; f++) {
    const lvl = levels[f].id, H = levels[f].height, top = levels[f + 1].id;
    const cant = f >= 1 ? cv : 0; // el voladizo empieza en el segundo piso
    for (const x of xs) for (const z of zs) push({ ...steelColumn(col, x, z, H), level: lvl, material: P.steel });
    // Vigas principales (dirección X) y secundarias (dirección Z) bajo la losa del piso de arriba.
    const yX = H - deck - PROFILES[beamX].h / 2, yZ = H - deck - PROFILES[beamZ].h / 2;
    const cantTop = cv; // la losa de arriba (piso f + 2) ya vuela: el voladizo cuelga de estas vigas
    for (const z of zs) push({ ...member('viga', beamX, [0, yX, z], [W, yX, z]), level: lvl, material: P.steel });
    if (cantTop) push({ ...member('viga', beamX, [0, yX, D + cantTop], [W, yX, D + cantTop]), level: lvl, material: P.steel });
    for (const x of xs) push({ ...member('viga', beamZ, [x, yZ, 0], [x, yZ, D + cantTop]), level: lvl, material: P.steel });
    const yJ = H - deck - PROFILES[joist].h / 2;
    for (let i = 0; i < P.baysX; i++) {
      const nj = Math.max(1, Math.round(P.spanX / 2.5));
      for (let k = 1; k < nj; k++) {
        const x = xs[i] + (P.spanX * k) / nj;
        push({ ...member('vigueta', joist, [x, yJ, 0], [x, yJ, D + cantTop]), level: lvl, material: P.steel });
      }
    }
    // Arriostramiento en X a la vista en los testeros (crujía central).
    if (P.bracing) {
      const zb = Math.floor(P.baysZ / 2), z0 = zs[zb], z1 = zs[zb + 1] ?? zs[zb];
      const yb = H - deck - PROFILES[beamZ].h;
      for (const x of [0, W]) {
        push({ ...member('diagonal', 'SHS150', [x, 0.1, z0], [x, yb, z1]), level: lvl, material: P.steel });
        push({ ...member('diagonal', 'SHS150', [x, 0.1, z1], [x, yb, z0]), level: lvl, material: P.steel });
      }
    }
    // Losa del piso de arriba (incluye la cubierta) con canto de borde a la vista.
    push({ type: 'slab', level: top, layer: 'c_est', material: P.deck, thickness: deck, points: rect(-edge, -edge, W + edge, D + cantTop + edge) });

    // Fachada: muro cortina retranqueado (galería exterior) para dejar el acero a la vista.
    const g = Math.min(P.gallery, P.spanZ / 3), gH = H - deck - (f === 0 ? 0 : 0);
    const zf = D + cant - (cant ? 0.6 : g); // frente (sur)
    const x0 = g, x1 = W - g, zb0 = g;
    curtainWall(push, lvl, [x0, zf], [x1, zf], gH, P);
    curtainWall(push, lvl, [x1, zf], [x1, zb0], gH, P);
    curtainWall(push, lvl, [x0, zb0], [x0, zf], gH, P);
    if (f === 0) curtainWall(push, lvl, [x1, zb0], [x0, zb0], gH, P);
    else push({ type: 'wall', level: lvl, layer: 'c_arq', material: P.cladding, a: [x1, zb0].map(r3), b: [x0, zb0].map(r3), height: r3(gH), thickness: 0.12, openings: [] });
    // Baranda de vidrio en el borde de la galería y del voladizo.
    if (f >= 1) {
      const rail = (a, b) => push({ type: 'wall', level: lvl, layer: 'c_arq', material: P.glass, a: a.map(r3), b: b.map(r3), height: 1.05, thickness: 0.02, openings: [] });
      rail([-0.05, D + cant + 0.05], [W + 0.05, D + cant + 0.05]);
    }
    // Celosía de lamas verticales de acero en la fachada oriental (opcional).
    if (P.facade === 'celosia') {
      for (let z = 0.3; z < D + cant; z += 0.45) push({ ...member('lamina', 'PL', [W + 0.35, 0, z], [W + 0.35, H - deck, z], { w: 0.04, h: 0.3, roll: Math.PI / 2 }), level: lvl, material: P.steel });
    }
  }
  // Cubierta: baranda perimetral y pérgola de acero sobre media terraza.
  const roof = levels[nF].id, Dt = D + cv;
  // Baranda de acero: pasamanos tubular y parales cada 1,5 m.
  const rail = (a, b) => {
    push({ ...member('baranda', 'PL', [a[0], 1.1, a[1]], [b[0], 1.1, b[1]], { w: 0.06, h: 0.05 }), level: roof, material: P.steel });
    push({ ...member('baranda', 'PL', [a[0], 0.55, a[1]], [b[0], 0.55, b[1]], { w: 0.03, h: 0.03 }), level: roof, material: P.steel });
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / 1.5));
    for (let i = 0; i < n; i++) {
      const x = a[0] + ((b[0] - a[0]) * i) / n, z = a[1] + ((b[1] - a[1]) * i) / n;
      push({ ...member('baranda', 'PL', [x, 0, z], [x, 1.1, z], { w: 0.05, h: 0.05 }), level: roof, material: P.steel });
    }
  };
  rail([0, 0], [W, 0]); rail([W, 0], [W, Dt]); rail([W, Dt], [0, Dt]); rail([0, Dt], [0, 0]);
  if (P.rooftop) {
    const ph = 3, px0 = W / 2, px1 = W - 0.6, pz0 = 0.6, pz1 = Dt - 0.6;
    for (const x of [px0, px1]) for (const z of [pz0, pz1]) push({ ...steelColumn('SHS150', x, z, ph), level: roof, material: P.steel });
    for (const z of [pz0, pz1]) push({ ...member('viga', 'IPE240', [px0 - 0.5, ph, z], [px1 + 0.5, ph, z]), level: roof, material: P.steel });
    for (let x = px0 - 0.4; x <= px1 + 0.4; x += 0.6) push({ ...member('lamina', 'PL', [x, ph + 0.17, pz0 - 0.5], [x, ph + 0.17, pz1 + 0.5], { w: 0.05, h: 0.2 }), level: roof, material: P.steel });
    push({ type: 'box', level: roof, layer: 'c_mob', material: 'roble', name: 'Deck de madera', x: r3((px0 + px1) / 2), z: r3(Dt / 2), w: r3(px1 - px0 + 1), d: r3(pz1 - pz0), h: 0.05, rotY: 0 });
  }
  doc.meta = { sistema: 'acero', tipo: P.tipo, area: r3(W * D + (nF - 1) * W * (D + cv)), perfiles: { columnas: col, vigas: [beamX, beamZ], viguetas: joist } };
  return doc;
}

// Nave o bodega: pórticos de acero cada `frameSpacing`, cerchas (o vigas IPE a dos aguas), correas,
// cubierta metálica con franja traslúcida en la cumbrera, fachada de panel y testero de vidrio con marquesina.
function steelWarehouse(P) {
  const doc = emptyDoc();
  doc.name = P.name === STEEL_DEFAULTS.name ? 'Nave en acero' : P.name;
  const L = P.length, S = P.span, E = P.eave, rise = (S / 2) * P.pitch;
  const levels = levelsFor(doc, [E + rise + 1], null);
  const lvl = levels[0].id;
  const push = (o) => doc.elements.push({ id: uid(), level: lvl, ...o });
  const st = P.steel;
  const nFr = Math.max(2, Math.round(L / P.frameSpacing)), sp = L / nFr;
  const roofY = (x) => E + rise * (1 - Math.abs(x - S / 2) / (S / 2));
  const depth = P.truss ? Math.max(1.2, S / 14) : PROFILES.IPE500.h;

  push({ type: 'slab', layer: 'c_arq', material: 'concreto', thickness: 0.2, name: 'Plaza y piso de nave', ground: true, points: rect(-4, -6, S + 4, L + 4) });
  for (let i = 0; i <= nFr; i++) {
    const z = i * sp;
    for (const x of [0, S]) push({ ...steelColumn('HEB300', x, z, E), material: st });
    if (P.truss) {
      // Cercha tipo Pratt: cordón superior a dos aguas, cordón inferior horizontal, montantes y diagonales.
      const yb = E - depth, n = Math.max(6, Math.round(S / 2) * 2);
      push(member('cordon', 'SHS200', [0, E, z], [S / 2, E + rise, z], { material: st }));
      push(member('cordon', 'SHS200', [S / 2, E + rise, z], [S, E, z], { material: st }));
      push(member('cordon', 'SHS150', [0, yb, z], [S, yb, z], { material: st }));
      for (let k = 1; k < n; k++) {
        const x = (S * k) / n, xp = (S * (k < n / 2 ? k - 1 : k + 1)) / n;
        push(member('montante', 'SHS100', [x, yb, z], [x, roofY(x), z], { material: st }));
        push(member('diagonal', 'SHS100', [x, yb, z], [xp, roofY(xp), z], { material: st }));
      }
      push(member('montante', 'SHS100', [0, yb, z], [0, E, z], { material: st }));
      push(member('montante', 'SHS100', [S, yb, z], [S, E, z], { material: st }));
    } else {
      const off = PROFILES.IPE500.h / 2;
      push(member('viga', 'IPE500', [0, E - off, z], [S / 2, E + rise - off, z], { material: st }));
      push(member('viga', 'IPE500', [S / 2, E + rise - off, z], [S, E - off, z], { material: st }));
    }
  }
  // Correas cada ~1,5 m y cubierta metálica (con franja traslúcida en la cumbrera).
  const nP = Math.max(3, Math.round(S / 2 / 1.5));
  for (let k = 0; k <= nP * 2; k++) {
    const x = (S * k) / (nP * 2), y = roofY(x) + 0.12;
    push(member('correa', 'SHS100', [x, y, -0.3], [x, y, L + 0.3], { material: 'acero_galvanizado' }));
  }
  const panelY = 0.2, ov = 0.6, drop = (rise * ov) / (S / 2), sky = 1.2;
  for (const [xa, dir] of [[-ov, 1], [S + ov, -1]]) {
    const ya = E - drop + panelY, xr = S / 2 - dir * sky, yr = roofY(xr) + panelY, yb = E + rise + panelY;
    push(member('lamina', 'PL', [xa, ya, L / 2], [xr, yr, L / 2], { w: L + 0.8, h: 0.06, material: P.cladding }));
    push(member('lamina', 'PL', [xr, yr, L / 2], [S / 2, yb, L / 2], { w: L + 0.8, h: 0.04, material: 'policarbonato' }));
  }
  // Fachadas: panel metálico en los lados largos con ventanería alta corrida, testero frontal de vidrio.
  const band = 1.4, wallH = E - 0.2;
  for (const x of [-0.18, S + 0.18]) {
    push({ type: 'wall', layer: 'c_arq', material: P.cladding, a: [x, 0], b: [x, L], height: r3(wallH), thickness: 0.1,
      openings: [{ id: uid('v'), kind: 'window', t: L / 2, width: r3(L - 2), height: band, sill: r3(wallH - band - 0.6) }] });
  }
  push({ type: 'wall', layer: 'c_arq', material: P.cladding, a: [0, -0.18], b: [S, -0.18], height: r3(wallH), thickness: 0.1, openings: [] });
  curtainWall(push, lvl, [0, L + 0.25], [S, L + 0.25], E - 0.1, P, 1.8);
  // Testeros triangulares: lamas verticales de panel que siguen la pendiente.
  for (const z of [-0.18, L + 0.18]) {
    for (let x = 0.25; x < S; x += 0.5) {
      const y1 = roofY(x) - 0.05;
      if (y1 > E) push(member('lamina', 'PL', [x, E - 0.1, z], [x, y1, z], { w: 0.5, h: 0.06, material: P.cladding }));
    }
  }
  // Marquesina de acceso en voladizo sobre el testero de vidrio.
  const mw = Math.min(10, S * 0.5), mx = S / 2, my = 4.2;
  for (const x of [mx - mw / 2, mx + mw / 2, mx]) push(member('viga', 'IPE300', [x, my, L + 0.25], [x, my, L + 3.6], { material: st }));
  push(member('lamina', 'PL', [mx - mw / 2 - 0.2, my + 0.18, L + 1.9], [mx + mw / 2 + 0.2, my + 0.18, L + 1.9], { w: 3.6, h: 0.08, material: 'acero_blanco' }));
  doc.meta = { sistema: 'acero', tipo: 'nave', area: r3(S * L), perfiles: { columnas: 'HEB300', cubierta: P.truss ? 'Cercha SHS' : 'IPE500' } };
  return doc;
}

// Pabellón o showroom: columnas tubulares esbeltas, losa de cubierta delgada en voladizo sobre emparrillado
// de vigas IPE, cielo de madera y vidrio de piso a techo.
function steelPavilion(P) {
  const doc = emptyDoc();
  doc.name = P.name === STEEL_DEFAULTS.name ? 'Pabellón en acero' : P.name;
  const H = P.height, W = P.width, D = P.depth, O = P.overhang;
  const levels = levelsFor(doc, [H, 1], 'Cubierta');
  const lvl = levels[0].id, roof = levels[1].id;
  const push = (o) => doc.elements.push({ id: uid(), level: lvl, ...o });
  const nx = Math.max(1, Math.round(W / 6)), nz = Math.max(1, Math.round(D / 6));
  const beam = 'IPE400', bh = PROFILES[beam].h, plate = 0.25;
  push({ type: 'slab', layer: 'c_arq', material: 'microcemento', thickness: 0.3, name: 'Plataforma', ground: true, points: rect(-O - 2, -O - 2, W + O + 2, D + O + 4) });
  for (let i = 0; i <= nx; i++) for (let k = 0; k <= nz; k++) push({ ...steelColumn('CHS219', (W * i) / nx, (D * k) / nz, H - plate - bh), material: P.steel });
  const y = H - plate - bh / 2;
  for (let k = 0; k <= nz; k++) push(member('viga', beam, [-O, y, (D * k) / nz], [W + O, y, (D * k) / nz], { material: P.steel }));
  for (let i = 0; i <= nx * 2; i++) push(member('vigueta', 'IPE300', [-O + ((W + 2 * O) * i) / (nx * 2), y + 0.05, -O], [-O + ((W + 2 * O) * i) / (nx * 2), y + 0.05, D + O], { material: P.steel }));
  // Cubierta: losa delgada blanca con canto de acero y cielo de madera bajo el voladizo.
  doc.elements.push({ id: uid(), type: 'slab', level: roof, layer: 'c_est', material: 'acero_blanco', thickness: plate, points: rect(-O, -O, W + O, D + O) });
  push({ type: 'box', layer: 'c_arq', material: P.soffit, name: 'Cielo de madera', x: W / 2, z: D / 2, w: W + 2 * O - 0.1, d: D + 2 * O - 0.1, h: 0.03, y: r3(H - plate - bh - 0.04), rotY: 0 });
  const gh = H - plate - bh - 0.05, g = 0.8;
  curtainWall(push, lvl, [g, g], [W - g, g], gh, P, 2);
  curtainWall(push, lvl, [W - g, g], [W - g, D - g], gh, P, 2);
  curtainWall(push, lvl, [W - g, D - g], [g, D - g], gh, P, 2);
  curtainWall(push, lvl, [g, D - g], [g, g], gh, P, 2);
  doc.meta = { sistema: 'acero', tipo: 'pabellon', area: r3(W * D), perfiles: { columnas: 'CHS219', vigas: beam } };
  return doc;
}

// ---------------------------------------------------------------------------------------------
// Estructura de acero para un modelo de muros (plano o boceto → 3D): columnas HEB en las esquinas y
// cruces de muros, vigas IPE de borde sobre cada muro y losa sobre steel deck en cada piso.
export function steelForWalls(doc, { column, maxSpan = 7.5, steel = 'acero_grafito' } = {}) {
  const out = [];
  const levelIds = [...new Set(doc.elements.filter((e) => e.type === 'wall').map((e) => e.level))];
  for (const lid of levelIds) {
    const lvl = doc.levels.find((l) => l.id === lid);
    const walls = doc.elements.filter((e) => e.type === 'wall' && e.level === lid && !e.curtain);
    const pts = [];
    const addPt = (p) => { if (!pts.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.3)) pts.push(p); };
    let longest = 0;
    for (const w of walls) {
      const L = Math.hypot(w.b[0] - w.a[0], w.b[1] - w.a[1]);
      longest = Math.max(longest, L);
      addPt(w.a); addPt(w.b);
      const n = Math.ceil(L / maxSpan);
      for (let k = 1; k < n; k++) addPt([w.a[0] + ((w.b[0] - w.a[0]) * k) / n, w.a[1] + ((w.b[1] - w.a[1]) * k) / n]);
    }
    const prof = column || columnFor(doc.levels.length);
    for (const p of pts) out.push({ ...steelColumn(prof, p[0], p[1], lvl.height), level: lid, material: steel });
    const beam = beamFor(Math.min(longest, maxSpan));
    const y = lvl.height - PROFILES[beam].h / 2 - 0.12;
    for (const w of walls) out.push({ ...member('viga', beam, [w.a[0], y, w.a[1]], [w.b[0], y, w.b[1]]), level: lid, material: steel });
  }
  return out;
}

// Cantidades de acero del proyecto: kg de estructura por perfil, m² de cerramiento metálico y área construida.
export const STRUCTURAL_ROLES = ['viga', 'vigueta', 'diagonal', 'cordon', 'montante', 'correa'];
export function steelTakeoff(doc) {
  const by = {};
  let kg = 0, cladding = 0;
  for (const e of doc.elements) {
    let k = 0, key = null, len = 0;
    if (e.type === 'member' && !STRUCTURAL_ROLES.includes(e.role) && !PROFILES[e.profile]) {
      if (e.role === 'lamina') cladding += (e.w || 0) * memberLength(e);
      continue;
    }
    if (e.type === 'member') { key = e.profile === 'PL' ? `PL ${Math.round((e.w || 0) * 1000)}×${Math.round((e.h || 0) * 1000)}` : e.profile; len = memberLength(e); k = memberKg(e); }
    else if (e.type === 'column' && (e.material?.startsWith('acero') || e.material === 'corten')) {
      key = PROFILES[e.profile] ? e.profile : `Columna ${e.profile}`;
      len = e.height;
      k = PROFILES[e.profile] ? PROFILES[e.profile].kg * e.height : columnArea(e) * e.height * 7850;
    }
    if (!key) continue;
    by[key] ||= { perfil: key, piezas: 0, metros: 0, kg: 0 };
    by[key].piezas++; by[key].metros += len; by[key].kg += k;
    kg += k;
  }
  const area = doc.meta?.area || doc.elements.filter((e) => e.type === 'slab').reduce((s, e) => s + polyArea(e.points), 0);
  return { kg, cladding, area, kgm2: area ? kg / area : 0, rows: Object.values(by).sort((a, b) => b.kg - a.kg) };
}

function polyArea(pts) {
  let s = 0;
  for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; s += p[0] * q[1] - q[0] * p[1]; }
  return Math.abs(s) / 2;
}

function columnArea(el) {
  if (el.profile === 'round') return Math.PI * (el.w / 2) ** 2;
  if (el.profile === 'I') { const tf = Math.max(0.006, el.d * 0.036), tw = Math.max(0.004, el.d * 0.024); return 2 * el.w * tf + (el.d - 2 * tf) * tw; }
  return el.w * el.d;
}
