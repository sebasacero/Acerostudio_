// AceroStudio · Muebles desarmables en acero ("AceroStudio lego").
// Núcleo puro (sin DOM ni Three.js): catálogo paramétrico de sillas y mesas para cafetería, cómo se arma cada
// una, y el despiece de taller que se pasa tal cual al motor de Fábrica (nesting de barras y láminas, DXF, CSV).
//
// La regla del sistema: todo el catálogo se arma igual, como bloques. Dos marcos laterales que salen soldados
// de planta + travesaños que se atornillan + una tapa de lámina plegada. Una sola llave Allen de 4 mm y un solo
// tipo de tornillo (M6 cabeza botón). Las piezas con la misma medida son la misma marca aunque vayan en muebles
// distintos: el travesaño de la silla es el mismo del taburete.
//
// Unidades: geometría en metros (y hacia arriba, el piso en y = 0, +z hacia el frente); despiece en mm y kg.

export const PERFILES = {
  t25: { nombre: 'Tubo cuadrado 25×25×1,5 tipo mueble', forma: 'cuad', a: 0.025, esp: 0.0015, kgm: 1.06, barra: 6000, precioTramo: 39000 },
  t30: { nombre: 'Tubo cuadrado 30×30×1,5 tipo mueble', forma: 'cuad', a: 0.03, esp: 0.0015, kgm: 1.29, barra: 6000, precioTramo: 46000 },
  r76: { nombre: 'Tubo redondo 3" × 1,5 mm', forma: 'red', a: 0.0762, esp: 0.0015, kgm: 2.76, barra: 6000, precioTramo: 98000 },
};
export const LAMINAS = {
  c16: { nombre: 'Lámina Cold Rolled cal. 16 (1,5 mm)', t: 1.5, kgm2: 11.78, pliego: [2440, 1220], precioPliego: 265000 },
  c14: { nombre: 'Lámina Cold Rolled cal. 14 (1,9 mm)', t: 1.9, kgm2: 14.92, pliego: [2440, 1220], precioPliego: 330000 },
  p6: { nombre: 'Lámina Hot Rolled 1/4" (6 mm), corte láser', t: 6, kgm2: 47.1, pliego: [2440, 1220], precioPliego: 980000 },
};
export const HERRAJES = {
  m6x40: { nombre: 'Tornillo M6×40 cabeza botón Allen', corto: 'M6×40', precio: 700 },
  m6x16: { nombre: 'Tornillo M6×16 cabeza botón Allen', corto: 'M6×16', precio: 450 },
  ins: { nombre: 'Tuerca remachable M6 (va puesta de planta)', corto: 'inserto M6', precio: 350 },
  reg: { nombre: 'Regatón de acero con base de fieltro', corto: 'regatón', precio: 1800 },
  niv: { nombre: 'Nivelador M8 con base de acero', corto: 'nivelador', precio: 3500 },
  llave: { nombre: 'Llave Allen 4 mm (una por caja)', corto: 'llave 4 mm', precio: 1500 },
};
// Servicios y parámetros comerciales: precios de ejemplo en COP, por confirmar con cotizaciones del taller.
export const SERVICIOS = { laserM: 4500, doblez: 1500, pinturaM2: 22000, cordon: 2500, caja: 9000, margen: 0.35 };

export const ACABADOS = {
  negro: { nombre: 'Negro mate', hex: '#1d2028' },
  grafito: { nombre: 'Grafito', hex: '#4a5266' },
  blanco: { nombre: 'Blanco', hex: '#eef0f3' },
  coral: { nombre: 'Coral', hex: '#d8574b' },
  oliva: { nombre: 'Verde oliva', hex: '#5d6b4a' },
  celeste: { nombre: 'Celeste', hex: '#8fc6f0' },
  natural: { nombre: 'Acero natural', hex: '#9aa0a8' },
};
export const PERFORADOS = { liso: 'Lisa', puntos: 'Puntos Ø8', malla: 'Malla Ø5' };

// Catálogo. params: [mínimo, máximo, inicial] en mm.
export const PRODUCTOS = {
  silla: { nombre: 'Silla Pliegue', ref: 'S-01', tipo: 'silla', nota: 'Silla de comedor con respaldo curvo', params: { ancho: [400, 480, 420], fondo: [400, 460, 420], alto: [430, 470, 450], respaldo: [720, 860, 800] } },
  taburete: { nombre: 'Taburete Barra', ref: 'S-02', tipo: 'silla', nota: 'Para la barra, con reposapiés', params: { ancho: [380, 460, 420], fondo: [380, 460, 420], alto: [600, 780, 750] } },
  mesa: { nombre: 'Mesa Cuadra', ref: 'M-01', tipo: 'mesa', nota: 'Mesa de dos o cuatro puestos', params: { ancho: [600, 900, 700], fondo: [600, 900, 700], alto: [720, 760, 750] } },
  barra: { nombre: 'Mesa Barra', ref: 'M-02', tipo: 'mesa', nota: 'Mesa alta para ventana o pared', params: { ancho: [1000, 1800, 1200], fondo: [400, 600, 500], alto: [1000, 1100, 1050] } },
  pedestal: { nombre: 'Mesa Pedestal', ref: 'M-03', tipo: 'pedestal', nota: 'Redonda, base en cruz que encaja sin tornillos', params: { diametro: [600, 900, 700], alto: [720, 760, 750] } },
};
export const PARAM_NOMBRE = { ancho: 'Ancho', fondo: 'Fondo', alto: 'Alto', respaldo: 'Alto del respaldo', diametro: 'Diámetro' };

// Cafetería minimalista de ejemplo: lo que se pide de una vez.
export const CAFETERIA = [
  { id: 'mesa', cant: 3 }, { id: 'silla', cant: 8 }, { id: 'pedestal', cant: 2 }, { id: 'barra', cant: 1 }, { id: 'taburete', cant: 3 },
];

export function paramsIniciales(id) {
  return Object.fromEntries(Object.entries(PRODUCTOS[id].params).map(([k, v]) => [k, v[2]]));
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const r1 = (v) => Math.round(v * 10) / 10;

// ---------------------------------------------------------------------------------------------------
// Contornos planos (mm) que comparten el DXF y el visor 3D.
export function contornoRect(w, h, alivio = 0) {
  if (!alivio) return [[0, 0], [w, 0], [w, h], [0, h]];
  const a = alivio;
  return [[a, 0], [w - a, 0], [w - a, a], [w, a], [w, h - a], [w - a, h - a], [w - a, h], [a, h], [a, h - a], [0, h - a], [0, a], [a, a]];
}
export function contornoCirc(d, n = 72) {
  return Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return [d / 2 + Math.cos(t) * d / 2, d / 2 + Math.sin(t) * d / 2]; });
}
// Platina con ranura central (para encajar en cruz) y pestañas que entran en las ranuras de una placa.
export function contornoPlatina(w, h, { ranura = null, pestanas = null } = {}) {
  const abajo = [], arriba = [];
  const feat = (lado) => {
    const out = [];
    if (ranura && ranura.desde === lado) out.push({ x0: w / 2 - ranura.ancho / 2, x1: w / 2 + ranura.ancho / 2, d: -ranura.alto });
    if (pestanas && pestanas.lado === lado) for (const x of pestanas.xs) out.push({ x0: x - pestanas.w / 2, x1: x + pestanas.w / 2, d: pestanas.h });
    return out.sort((p, q) => p.x0 - q.x0);
  };
  abajo.push([0, 0]);
  for (const f of feat('abajo')) { const y = -f.d; abajo.push([f.x0, 0], [f.x0, y], [f.x1, y], [f.x1, 0]); }
  abajo.push([w, 0]);
  arriba.push([w, h]);
  for (const f of feat('arriba').reverse()) { const y = h + f.d; arriba.push([f.x1, h], [f.x1, y], [f.x0, y], [f.x0, h]); }
  arriba.push([0, h]);
  return [...abajo, ...arriba];
}
// Perforaciones de una tapa (mm, relativas al centro). Deja libre un margen y los puntos de tornillo.
export function perforaciones(tipo, w, h, { margen = 45, circular = false, libres = [] } = {}) {
  if (!tipo || tipo === 'liso') return [];
  const paso = tipo === 'puntos' ? 24 : 13, d = tipo === 'puntos' ? 8 : 5;
  const out = [];
  const nx = Math.floor((w - 2 * margen) / paso), ny = Math.floor((h - 2 * margen) / (paso * 0.866));
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx - (j % 2); i++) {
    const x = -((nx) * paso) / 2 + i * paso + (j % 2) * paso / 2, y = -(ny * paso * 0.866) / 2 + j * paso * 0.866;
    if (circular && Math.hypot(x, y) > w / 2 - margen) continue;
    if (libres.some(([lx, ly]) => Math.hypot(x - lx, y - ly) < 22)) continue;
    out.push([+x.toFixed(1), +y.toFixed(1), d]);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------
// Constructor: devuelve los componentes (lo que llega en la caja), los herrajes y los pasos de armado.
function nuevo() {
  const comps = [], herr = [];
  const comp = (id, nombre, explode, extra = {}) => { const c = { id, nombre, explode, partes: [], ...extra }; comps.push(c); return c; };
  const tubo = (c, perfil, a, b, nombre, ag = 0) => c.partes.push({ t: 'tubo', perfil, a, b, nombre, ag });
  const her = (tipo, p, d, comp, extra = {}) => herr.push({ tipo, p, d, comp, ...extra });
  return { comps, herr, comp, tubo, her };
}

function silla(P, cfg, conRespaldo, conReposapies) {
  const A = P.ancho / 1000, F = P.fondo / 1000, H = P.alto / 1000, R = (P.respaldo || 0) / 1000;
  const a = 0.025, xL = A / 2 - a / 2, zF = F / 2 - a / 2, top = H - 0.0015, yT = top - a / 2;
  const { comps, herr, comp, tubo, her } = nuevo();
  const yBajo = Math.min(0.16, H * 0.3);
  for (const [lado, s] of [['izquierdo', -1], ['derecho', 1]]) {
    const c = comp(`marco-${s < 0 ? 'i' : 'd'}`, `Marco lateral ${lado}`, [s * 0.36, 0, 0], { soldado: true, grupo: 'marco' });
    tubo(c, 't25', [s * xL, 0, zF], [s * xL, top, zF], 'Pata delantera', 2);
    tubo(c, 't25', [s * xL, 0, -zF], [s * xL, conRespaldo ? R : top, -zF], conRespaldo ? 'Pata trasera con respaldo' : 'Pata trasera', conRespaldo ? 4 : 2);
    tubo(c, 't25', [s * xL, yT, -zF + a / 2], [s * xL, yT, zF - a / 2], 'Travesaño lateral', 0);
    tubo(c, 't25', [s * xL, yBajo, -zF + a / 2], [s * xL, yBajo, zF - a / 2], 'Travesaño lateral bajo', 0);
    c.cordones = 8;
  }
  for (const [n, s] of [['delantero', 1], ['trasero', -1]]) {
    const c = comp(`trav-${s > 0 ? 'f' : 't'}`, `Travesaño ${n}`, [0, 0.04, s * 0.34], { grupo: 'travesano' });
    tubo(c, 't25', [-xL + a / 2, yT, s * zF], [xL - a / 2, yT, s * zF], 'Travesaño', 4);
    for (const sx of [-1, 1]) her('m6x40', [sx * A / 2, yT, s * zF], [sx, 0, 0], c.id);
  }
  if (conReposapies) {
    const yR = Math.round(H * 0.38 * 1000) / 1000;
    const c = comp('repos', 'Reposapiés', [0, 0, 0.38], { grupo: 'travesano' });
    tubo(c, 't25', [-xL + a / 2, yR, zF], [xL - a / 2, yR, zF], 'Travesaño', 4);
    for (const sx of [-1, 1]) her('m6x40', [sx * A / 2, yR, zF], [sx, 0, 0], c.id);
  }
  const W = Math.round(P.ancho + 4), D = Math.round(P.fondo + 4), torn = [[-(W / 2 - 70), -(D / 2 - 12.5)], [W / 2 - 70, -(D / 2 - 12.5)], [-(W / 2 - 70), D / 2 - 12.5], [W / 2 - 70, D / 2 - 12.5]];
  const asiento = comp('asiento', 'Asiento', [0, 0.36, 0], { grupo: 'tapa' });
  asiento.partes.push({ t: 'chapa', mat: 'c16', nombre: 'Asiento plegado', forma: 'rect', w: W, h: D, plegue: 18, y: H, centro: [0, 0], perf: perforaciones(cfg.perforado, W, D, { margen: 50, libres: torn }), agujeros: torn.map(([x, y]) => [x, y, 6.6]) });
  for (const [x, y] of torn) her('m6x16', [x / 1000, H, y / 1000], [0, 1, 0], 'asiento');
  if (conRespaldo) {
    const hR = 170, yR = R - hR / 2000 - 0.012, wR = Math.round(P.ancho + 4);
    const c = comp('respaldo', 'Respaldo', [0, 0.16, 0.32], { grupo: 'tapa' });
    const tR = [[-(wR / 2 - 12.5), -45], [wR / 2 - 12.5, -45], [-(wR / 2 - 12.5), 45], [wR / 2 - 12.5, 45]];
    c.partes.push({ t: 'chapa', mat: 'c16', nombre: 'Respaldo curvo', forma: 'rect', vertical: true, w: wR, h: hR, plegue: 0, curva: 0.9, y: yR, z: -F / 2 + a + 0.00075, centro: [0, 0], perf: perforaciones(cfg.perforado, wR, hR, { margen: 32, libres: tR }), agujeros: tR.map(([x, y]) => [x, y, 6.6]) });
    for (const [x, y] of tR) her('m6x16', [x / 1000, yR + y / 1000, -F / 2 + a + 0.0015], [0, 0, 1], 'respaldo');
  }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) her('reg', [sx * xL, 0, sz * zF], [0, -1, 0], `marco-${sx < 0 ? 'i' : 'd'}`);
  const pasos = [
    { titulo: 'Marcos laterales', texto: 'Saca los dos marcos laterales de la caja y párelos de frente, con las patas largas atrás.', comps: ['marco-i', 'marco-d'] },
    { titulo: 'Travesaños', texto: 'Pon el travesaño delantero y el trasero entre los marcos. Un tornillo M6×40 por punta, sin apretar del todo.', comps: ['trav-f', 'trav-t'] },
  ];
  if (conReposapies) pasos.push({ titulo: 'Reposapiés', texto: 'El reposapiés es el mismo travesaño: va adelante, abajo, con dos tornillos M6×40.', comps: ['repos'] });
  pasos.push({ titulo: 'Asiento', texto: 'Apoya el asiento: el pliegue abraza el marco. Cuatro tornillos M6×16 y ahora sí aprieta todo.', comps: ['asiento'] });
  if (conRespaldo) pasos.push({ titulo: 'Respaldo', texto: 'El respaldo curvo va por delante de las patas traseras, con cuatro tornillos M6×16.', comps: ['respaldo'] });
  pasos.push({ titulo: 'Regatones', texto: 'Voltea la silla y mete los cuatro regatones a presión.', comps: [], herr: ['reg'] });
  return { comps, herr, pasos, alto: Math.max(H, R) };
}

function mesa(P, cfg, conReposapies) {
  const A = P.ancho / 1000, F = P.fondo / 1000, H = P.alto / 1000;
  const a = 0.03, xL = A / 2 - 0.04, zL = F / 2 - 0.04, under = H - 0.0019, yT = under - a / 2, piso = 0.012;
  const { comps, herr, comp, tubo, her } = nuevo();
  for (const [lado, s] of [['izquierdo', -1], ['derecho', 1]]) {
    const c = comp(`marco-${s < 0 ? 'i' : 'd'}`, `Marco lateral ${lado}`, [s * 0.42, 0, 0], { soldado: true, grupo: 'marco' });
    for (const sz of [-1, 1]) tubo(c, 't30', [s * xL, piso, sz * zL], [s * xL, under, sz * zL], 'Pata', 2);
    tubo(c, 't30', [s * xL, yT, -zL + a / 2], [s * xL, yT, zL - a / 2], 'Faldón corto', 0);
    if (conReposapies) tubo(c, 't30', [s * xL, 0.3, -zL + a / 2], [s * xL, 0.3, zL - a / 2], 'Travesaño bajo', 0);
    c.cordones = conReposapies ? 8 : 4;
  }
  for (const [n, s] of [['delantero', 1], ['trasero', -1]]) {
    const c = comp(`fald-${s > 0 ? 'f' : 't'}`, `Faldón ${n}`, [0, 0.05, s * 0.36], { grupo: 'travesano' });
    tubo(c, 't30', [-xL + a / 2, yT, s * zL], [xL - a / 2, yT, s * zL], 'Faldón largo', 6);
    for (const sx of [-1, 1]) her('m6x40', [sx * (xL + a / 2), yT, s * zL], [sx, 0, 0], c.id);
  }
  if (conReposapies) {
    const c = comp('repos', 'Reposapiés', [0, 0, 0.4], { grupo: 'travesano' });
    tubo(c, 't30', [-xL + a / 2, 0.3, zL], [xL - a / 2, 0.3, zL], 'Reposapiés', 4);
    for (const sx of [-1, 1]) her('m6x40', [sx * (xL + a / 2), 0.3, zL], [sx, 0, 0], 'repos');
  }
  const W = Math.round(P.ancho), D = Math.round(P.fondo);
  const xs = A > 1 ? [-0.32, 0, 0.32].map((k) => k * (A - 0.2)) : [-(xL - 0.09), xL - 0.09];
  const torn = xs.flatMap((x) => [-1, 1].map((sz) => [Math.round(x * 1000), sz * Math.round(zL * 1000)]));
  const tapa = comp('tablero', 'Tablero', [0, 0.38, 0], { grupo: 'tapa' });
  tapa.partes.push({ t: 'chapa', mat: 'c14', nombre: 'Tablero plegado', forma: 'rect', w: W, h: D, plegue: 25, y: H, centro: [0, 0], perf: [], agujeros: [], insertos: torn.length });
  for (const [x, z] of torn) her('m6x40', [x / 1000, yT - a / 2, z / 1000], [0, -1, 0], 'tablero', { vis: 0.031 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) her('niv', [sx * xL, 0, sz * zL], [0, -1, 0], `marco-${sx < 0 ? 'i' : 'd'}`);
  const pasos = [
    { titulo: 'Marcos laterales', texto: 'Los dos marcos laterales salen soldados de planta. Párelos frente a frente.', comps: ['marco-i', 'marco-d'] },
    { titulo: 'Faldones', texto: 'Une los marcos con el faldón delantero y el trasero: un tornillo M6×40 por punta.', comps: ['fald-f', 'fald-t'] },
  ];
  if (conReposapies) pasos.push({ titulo: 'Reposapiés', texto: 'El reposapiés va adelante, a 30 cm del piso, con dos tornillos M6×40.', comps: ['repos'] });
  pasos.push({ titulo: 'Tablero', texto: `Voltea la estructura sobre el tablero y atornilla desde abajo: ${torn.length} tornillos M6×40 a las tuercas remachables.`, comps: ['tablero'] });
  pasos.push({ titulo: 'Niveladores', texto: 'Enrosca los cuatro niveladores y nivela la mesa en el sitio.', comps: [], herr: ['niv'] });
  return { comps, herr, pasos, alto: H };
}

function pedestal(P, cfg) {
  const Dm = P.diametro / 1000, H = P.alto / 1000;
  const { comps, herr, comp, her } = nuevo();
  const Lb = Math.round(clamp(P.diametro * 0.82, 520, 680)), hb = 80, e = 6, y0 = 0.012;
  const rT = 58, tabX = [Lb / 2 - 50, Lb / 2 + 50];
  const baseA = comp('base-a', 'Platina de base A', [0, 0, 0.3], { grupo: 'base' });
  baseA.partes.push({ t: 'platina', mat: 'p6', nombre: 'Platina de base (ranura arriba)', w: Lb, h: hb, y: y0, rotY: 0, ranura: { desde: 'arriba', ancho: 6.5, alto: hb / 2 }, pestanas: { lado: 'arriba', xs: tabX, w: 20, h: e } });
  const baseB = comp('base-b', 'Platina de base B', [0.3, 0, 0], { grupo: 'base' });
  baseB.partes.push({ t: 'platina', mat: 'p6', nombre: 'Platina de base (ranura abajo)', w: Lb, h: hb, y: y0, rotY: Math.PI / 2, ranura: { desde: 'abajo', ancho: 6.5, alto: hb / 2 }, pestanas: { lado: 'arriba', xs: tabX, w: 20, h: e } });
  const yPC = y0 + hb / 1000;
  const ranuras = [[50, 0, 20.5, 6.5], [-50, 0, 20.5, 6.5], [0, 50, 6.5, 20.5], [0, -50, 6.5, 20.5]];
  const a45 = [45, 135, 225, 315].map((g) => [Math.round(rT * Math.cos(g * Math.PI / 180) * 10) / 10, Math.round(rT * Math.sin(g * Math.PI / 180) * 10) / 10]);
  const placa = comp('placa', 'Placa central', [0, 0.16, 0], { grupo: 'base' });
  placa.partes.push({ t: 'disco', mat: 'p6', nombre: 'Placa central', d: 160, y: yPC, ranuras, agujeros: a45.map(([x, z]) => [x, z, 6.6]) });
  const yB1 = yPC + e / 1000, yTop = H - 0.0019, yPCab = yTop - e / 1000, yB2 = yPCab - e / 1000;
  const col = comp('columna', 'Columna', [0, 0.34, 0], { soldado: true, grupo: 'columna' });
  col.partes.push({ t: 'disco', mat: 'p6', nombre: 'Brida', d: 150, y: yB1, ranuras: [], agujeros: a45.map(([x, z]) => [x, z, 6.6]) });
  col.partes.push({ t: 'tubo', perfil: 'r76', a: [0, yB1 + e / 1000, 0], b: [0, yB2, 0], nombre: 'Columna', ag: 0 });
  col.partes.push({ t: 'disco', mat: 'p6', nombre: 'Brida', d: 150, y: yB2, ranuras: [], agujeros: a45.map(([x, z]) => [x, z, 6.6]) });
  col.cordones = 2;
  const dC = Math.round(clamp(P.diametro * 0.55, 340, 460)), rO = dC / 2 - 25;
  const ext = [0, 90, 180, 270].map((g) => [Math.round(rO * Math.cos(g * Math.PI / 180)), Math.round(rO * Math.sin(g * Math.PI / 180))]);
  const cab = comp('cabeza', 'Placa de cabeza', [0, 0.2, 0], { grupo: 'columna' });
  cab.partes.push({ t: 'disco', mat: 'p6', nombre: 'Placa de cabeza', d: dC, y: yPCab, ranuras: [], agujeros: [...a45, ...ext].map(([x, z]) => [x, z, 6.6]) });
  const tapa = comp('tablero', 'Tablero', [0, 0.36, 0], { grupo: 'tapa' });
  tapa.partes.push({ t: 'chapa', mat: 'c14', nombre: 'Tablero redondo plegado', forma: 'circ', w: Math.round(P.diametro), h: Math.round(P.diametro), plegue: 25, y: H, centro: [0, 0], perf: [], agujeros: [], insertos: 4 });
  for (const [x, z] of a45) her('m6x16', [x / 1000, yB1 + e / 1000, z / 1000], [0, 1, 0], 'columna');
  for (const [x, z] of a45) her('m6x16', [x / 1000, yB2, z / 1000], [0, -1, 0], 'cabeza', { vis: 0.0118 });
  for (const [x, z] of ext) her('m6x16', [x / 1000, yPCab, z / 1000], [0, -1, 0], 'tablero', { vis: 0.0075 });
  for (const [x, z] of [[Lb / 2 - 25, 0], [-(Lb / 2 - 25), 0], [0, Lb / 2 - 25], [0, -(Lb / 2 - 25)]]) her('niv', [x / 1000, 0, z / 1000], [0, -1, 0], x ? 'base-a' : 'base-b');
  const pasos = [
    { titulo: 'Base en cruz', texto: 'Encaja las dos platinas por sus ranuras, como bloques: sin tornillos.', comps: ['base-a', 'base-b'] },
    { titulo: 'Placa central', texto: 'Baja la placa central: sus cuatro ranuras reciben las pestañas y la cruz queda trabada.', comps: ['placa'] },
    { titulo: 'Columna', texto: 'Pon la columna sobre la placa y asegúrala con cuatro tornillos M6×16.', comps: ['columna'] },
    { titulo: 'Placa de cabeza', texto: 'Atornilla la placa de cabeza a la brida de arriba: cuatro M6×16 desde abajo.', comps: ['cabeza'] },
    { titulo: 'Tablero', texto: 'Apoya el tablero y atorníllalo desde abajo con cuatro M6×16.', comps: ['tablero'] },
    { titulo: 'Niveladores', texto: 'Enrosca los cuatro niveladores en las puntas de la cruz.', comps: [], herr: ['niv'] },
  ];
  return { comps, herr, pasos, alto: H };
}

// Mueble completo, listo para el visor y el despiece.
export function construir(id, params = {}, cfg = {}) {
  const prod = PRODUCTOS[id];
  if (!prod) throw new Error(`Producto desconocido: ${id}`);
  const P = { ...paramsIniciales(id) };
  for (const [k, v] of Object.entries(params)) if (prod.params[k]) P[k] = clamp(+v, prod.params[k][0], prod.params[k][1]);
  const c = { perforado: 'puntos', ...cfg };
  if (id === 'silla' && P.respaldo < P.alto + 260) P.respaldo = P.alto + 260;
  const m = prod.tipo === 'silla' ? silla(P, c, id === 'silla', id === 'taburete') : prod.tipo === 'mesa' ? mesa(P, c, id === 'barra') : pedestal(P, c);
  // número de paso de cada componente y herraje
  m.pasos.forEach((p, i) => {
    p.n = i + 1;
    for (const cid of p.comps) { const k = m.comps.find((x) => x.id === cid); if (k) k.paso = i + 1; }
  });
  for (const h of m.herr) {
    const p = m.pasos.find((s) => (s.herr || []).includes(h.tipo)) || m.pasos.find((s) => s.comps.includes(h.comp));
    h.paso = p ? p.n : m.pasos.length;
  }
  for (const p of m.pasos) {
    const cuenta = {};
    for (const h of m.herr.filter((x) => x.paso === p.n)) cuenta[h.tipo] = (cuenta[h.tipo] || 0) + 1;
    p.cuenta = cuenta;
    p.herramienta = cuenta.m6x40 || cuenta.m6x16 ? 'Llave Allen 4 mm' : cuenta.niv || cuenta.reg ? 'A mano' : 'Sin herramienta';
  }
  m.comps.forEach((k, i) => { k.n = i + 1; });
  return { id, producto: prod, params: P, cfg: c, ...m };
}

// ---------------------------------------------------------------------------------------------------
// Medidas de cada parte (mm) para despiece, caja plana y DXF.
const L3 = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
export function largoTubo(p) { return Math.round(L3(p.a, p.b) * 1000); }

// Plano plano (desarrollo) de una parte de lámina: contorno, agujeros y datos de corte.
export function desarrollo(p) {
  const mat = LAMINAS[p.mat];
  if (p.t === 'chapa') {
    const pl = p.plegue || 0;
    if (p.forma === 'circ') {
      const d = p.w + 2 * pl, c = d / 2;
      const holes = [...p.perf, ...p.agujeros].map(([x, y, dd]) => ({ x: r1(c + x), y: r1(c + y), d: dd }));
      return { w: Math.round(d), h: Math.round(d), t: mat.t, outline: contornoCirc(d), holes, dobleces: pl ? 1 : 0, rolado: !!pl };
    }
    const curva = p.curva ? p.w : p.w; // el respaldo se rola: el desarrollo conserva el ancho
    const w = curva + 2 * pl, h = p.h + 2 * pl;
    const holes = [...p.perf, ...p.agujeros].map(([x, y, dd]) => ({ x: r1(w / 2 + x), y: r1(h / 2 + y), d: dd }));
    return { w: Math.round(w), h: Math.round(h), t: mat.t, outline: contornoRect(Math.round(w), Math.round(h), pl), holes, dobleces: pl ? 4 : 0, rolado: !!p.curva };
  }
  if (p.t === 'platina') {
    const outline = contornoPlatina(p.w, p.h, p);
    const ys = outline.map((q) => q[1]), y0 = Math.min(...ys);
    return { w: p.w, h: Math.round(Math.max(...ys) - y0), t: mat.t, outline: outline.map(([x, y]) => [x, y - y0]), holes: [], dobleces: 0 };
  }
  if (p.t === 'disco') {
    const c = p.d / 2;
    const holes = p.agujeros.map(([x, y, d]) => ({ x: r1(c + x), y: r1(c + y), d }));
    const ranuras = p.ranuras.map(([x, y, w, h]) => ({ x: c + x - w / 2, y: c + y - h / 2, w, h }));
    return { w: p.d, h: p.d, t: mat.t, outline: contornoCirc(p.d), holes, ranuras, dobleces: 0 };
  }
  return null;
}
const perim = (o) => o.reduce((s, q, i) => s + Math.hypot(o[(i + 1) % o.length][0] - q[0], o[(i + 1) % o.length][1] - q[1]), 0);
const area = (o) => Math.abs(o.reduce((s, q, i) => s + q[0] * o[(i + 1) % o.length][1] - o[(i + 1) % o.length][0] * q[1], 0)) / 2;

// Caja plana: medidas de la caja en la que viaja el mueble desarmado.
export function caja(m) {
  const dims = m.comps.map((c) => {
    const pts = [];
    for (const p of c.partes) {
      if (p.t === 'tubo') { const r = PERFILES[p.perfil].a / 2; for (const q of [p.a, p.b]) pts.push([q[0] - r, q[1] - r, q[2] - r], [q[0] + r, q[1] + r, q[2] + r]); }
      else if (p.t === 'chapa' && p.vertical) { pts.push([-p.w / 2000, p.y - p.h / 2000, p.z - 0.01], [p.w / 2000, p.y + p.h / 2000, p.z + 0.06]); }
      else if (p.t === 'chapa') pts.push([-p.w / 2000, p.y - (p.plegue + 2) / 1000, -p.h / 2000], [p.w / 2000, p.y, p.h / 2000]);
      else if (p.t === 'platina') pts.push([-p.w / 2000, p.y, -0.004], [p.w / 2000, p.y + p.h / 1000, 0.004]);
      else if (p.t === 'disco') pts.push([-p.d / 2000, p.y, -p.d / 2000], [p.d / 2000, p.y + 0.006, p.d / 2000]);
    }
    const mn = [0, 1, 2].map((k) => Math.min(...pts.map((q) => q[k]))), mx = [0, 1, 2].map((k) => Math.max(...pts.map((q) => q[k])));
    return [0, 1, 2].map((k) => Math.round((mx[k] - mn[k]) * 1000)).sort((x, y) => y - x);
  });
  const L = Math.max(...dims.map((d) => d[0])) + 40, A = Math.max(...dims.map((d) => d[1])) + 40;
  const H = dims.reduce((s, d) => s + d[2] + 6, 0) + 50;
  return { l: L, a: A, h: H, litros: Math.round(L * A * H / 1e6) };
}

// ---------------------------------------------------------------------------------------------------
// Despiece de un pedido: [{ id, params, cfg, cant }] → marcas de tubo y de lámina, herrajes, servicios y costo.
// Sale con el mismo formato que fabrica/js/despiece.js para usar nestBars, nestPlates, dxfSheet y csvCorte.
export function despiece(pedido, { orden = 'OP-MUEBLES' } = {}) {
  const tubos = new Map(), chapas = new Map(), herrajes = {}, usos = new Map();
  let cordones = 0, pintura = 0, kgTotal = 0, unidades = 0;
  const muebles = [];
  for (const linea of pedido) {
    if (!linea.cant) continue;
    const m = linea.mueble || construir(linea.id, linea.params, linea.cfg);
    muebles.push({ m, cant: linea.cant });
    unidades += linea.cant;
    for (const c of m.comps) {
      cordones += (c.cordones || 0) * linea.cant;
      for (const p of c.partes) {
        if (p.t === 'tubo') {
          const P = PERFILES[p.perfil], len = largoTubo(p), key = `${p.perfil}|${len}`;
          if (!tubos.has(key)) tubos.set(key, { profile: p.perfil, perfil: P.nombre, length: len, nombres: new Set(), qty: 0, kgm: P.kgm, ag: p.ag, en: new Set() });
          const T = tubos.get(key); T.qty += linea.cant; T.nombres.add(p.nombre); T.en.add(m.producto.ref);
          pintura += (P.forma === 'red' ? Math.PI * P.a : 4 * P.a) * len / 1000 * linea.cant;
        } else {
          const d = desarrollo(p), key = `${p.mat}|${d.w}|${d.h}|${p.nombre.replace(/ \(.*\)/, '')}|${d.holes.length}|${(p.ranura || {}).desde || ''}`;
          if (!chapas.has(key)) {
            const neta = area(d.outline) - d.holes.reduce((s, h) => s + Math.PI * h.d * h.d / 4, 0) - (d.ranuras || []).reduce((s, r) => s + r.w * r.h, 0);
            const corte = perim(d.outline) + d.holes.reduce((s, h) => s + Math.PI * h.d, 0) + (d.ranuras || []).reduce((s, r) => s + 2 * (r.w + r.h), 0);
            chapas.set(key, { mat: p.mat, nombre: p.nombre, ...d, qty: 0, kg: +(neta / 1e6 * LAMINAS[p.mat].kgm2).toFixed(2), corte: Math.round(corte), en: new Set(), insertos: p.insertos || 0 });
          }
          const C = chapas.get(key); C.qty += linea.cant; C.en.add(m.producto.ref);
          pintura += 2 * C.w * C.h / 1e6 * linea.cant;
        }
      }
    }
    for (const h of m.herr) herrajes[h.tipo] = (herrajes[h.tipo] || 0) + linea.cant;
    herrajes.llave = (herrajes.llave || 0) + linea.cant;
  }
  // marcas: tubos T1…, láminas L1…, platinas y placas de 6 mm P1…
  const marcas = [...tubos.values()].sort((a, b) => a.profile.localeCompare(b.profile) || b.length - a.length).map((t, i) => {
    const mark = `T${i + 1}`, units = Array.from({ length: t.qty }, (_, k) => `${mark}-${String(k + 1).padStart(3, '0')}`);
    return { mark, profile: t.profile, perfil: t.perfil, nombre: [...t.nombres].join(' / '), length: t.length, qty: t.qty, units, kgm: t.kgm, kg: +(t.kgm * t.length / 1000).toFixed(2), agujeros: t.ag, en: [...t.en], cuts: { ws: 0, we: 0, fs: 0, fe: 0 }, holes: [], plates: [] };
  });
  let nL = 0, nP = 0;
  const placas = [...chapas.values()].sort((a, b) => a.t - b.t || b.w * b.h - a.w * a.h).map((c) => ({ ...c, mark: c.t >= 6 ? `P${++nP}` : `L${++nL}`, en: [...c.en], grade: c.t >= 6 ? 'A36' : 'SAE 1008' }));
  const compartidas = [...marcas, ...placas].filter((x) => x.en.length > 1);
  for (const x of [...marcas, ...placas]) usos.set(x.mark, x.en);
  const kgTubos = marcas.reduce((s, m) => s + m.kg * m.qty, 0), kgLam = placas.reduce((s, p) => s + p.kg * p.qty, 0);
  kgTotal = kgTubos + kgLam;
  const resumen = {
    orden, unidades, marcas: marcas.length + placas.length, piezas: marcas.reduce((s, m) => s + m.qty, 0) + placas.reduce((s, p) => s + p.qty, 0),
    kgTubos: r1(kgTubos), kgLaminas: r1(kgLam), kg: r1(kgTotal), pintura: r1(pintura), cordones,
    corteLaser: r1(placas.reduce((s, p) => s + p.corte * p.qty, 0) / 1000), dobleces: placas.reduce((s, p) => s + p.dobleces * p.qty, 0),
    tornillos: (herrajes.m6x40 || 0) + (herrajes.m6x16 || 0), compartidas: compartidas.map((x) => ({ mark: x.mark, nombre: x.nombre, en: x.en })),
    metros: r1(marcas.reduce((s, m) => s + m.length * m.qty, 0) / 1000),
  };
  return { orden, resumen, marcas, placas, herrajes, muebles };
}

// Costo con precios de ejemplo: tramos y pliegos que salen del nesting de Fábrica + herrajes + servicios.
export function costo(d, nestB, nestP) {
  const lineas = [];
  for (const c of nestB.compra) lineas.push({ grupo: 'Material', nombre: `${PERFILES[c.profile].nombre}, tramo de 6 m`, cant: c.n, unit: PERFILES[c.profile].precioTramo });
  const hojas = {};
  for (const h of nestP.hojas) { const mat = Object.entries(LAMINAS).find(([, L]) => L.t === h.t)?.[0]; hojas[mat] = (hojas[mat] || 0) + 1; }
  for (const [mat, n] of Object.entries(hojas)) lineas.push({ grupo: 'Material', nombre: `${LAMINAS[mat].nombre}, pliego 1,22 × 2,44 m`, cant: n, unit: LAMINAS[mat].precioPliego });
  const ins = d.marcas.reduce((s, m) => s + (m.agujeros || 0) * m.qty, 0) + d.placas.reduce((s, p) => s + (p.insertos || 0) * p.qty, 0);
  for (const [k, n] of Object.entries(d.herrajes)) lineas.push({ grupo: 'Herrajes', nombre: HERRAJES[k].nombre, cant: n, unit: HERRAJES[k].precio });
  if (ins) lineas.push({ grupo: 'Herrajes', nombre: HERRAJES.ins.nombre, cant: ins, unit: HERRAJES.ins.precio });
  lineas.push({ grupo: 'Planta', nombre: 'Corte láser (m de corte)', cant: d.resumen.corteLaser, unit: SERVICIOS.laserM });
  lineas.push({ grupo: 'Planta', nombre: 'Dobleces en plegadora', cant: d.resumen.dobleces, unit: SERVICIOS.doblez });
  lineas.push({ grupo: 'Planta', nombre: 'Cordones de soldadura de los marcos', cant: d.resumen.cordones, unit: SERVICIOS.cordon });
  lineas.push({ grupo: 'Planta', nombre: 'Pintura electrostática (m²)', cant: d.resumen.pintura, unit: SERVICIOS.pinturaM2 });
  lineas.push({ grupo: 'Planta', nombre: 'Caja plana con instructivo', cant: d.resumen.unidades, unit: SERVICIOS.caja });
  for (const l of lineas) l.total = Math.round(l.cant * l.unit);
  const total = lineas.reduce((s, l) => s + l.total, 0);
  return { lineas, costo: total, venta: Math.round(total * (1 + SERVICIOS.margen) / 1000) * 1000, margen: SERVICIOS.margen };
}

// CSV de piezas del pedido (separador ; como Fábrica).
export function csvMuebles(d) {
  const q = (v) => (/[;"\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v);
  const n1 = (v) => String(Math.round(v * 10) / 10).replace('.', ',');
  const rows = [['Marca', 'Pieza', 'Material', 'Cant.', 'Largo / medida mm', 'Insertos o agujeros', 'kg/u', 'kg total', 'Va en']];
  for (const m of d.marcas) rows.push([m.mark, m.nombre, m.perfil, m.qty, m.length, m.agujeros, n1(m.kg), n1(m.kg * m.qty), m.en.join(' ')]);
  for (const p of d.placas) rows.push([p.mark, p.nombre, LAMINAS[p.mat].nombre, p.qty, `${p.w} × ${p.h} (desarrollo)`, p.holes.length + (p.ranuras || []).length, n1(p.kg), n1(p.kg * p.qty), p.en.join(' ')]);
  rows.push([], ['Herraje', 'Cant.']);
  for (const [k, n] of Object.entries(d.herrajes)) rows.push([HERRAJES[k].nombre, n]);
  return rows.map((r) => r.map(q).join(';')).join('\n') + '\n';
}

// DXF R12 (mm): una pieza de lámina o una hoja anidada completa, con contorno, agujeros, ranuras y marca.
function dxfEnt(p, ox = 0, oy = 0, rot = false) {
  const tr = ([x, y]) => (rot ? [ox + y, oy + x] : [ox + x, oy + y]), f = (v) => v.toFixed(2), out = [];
  const lin = (capa, a, b) => out.push('0', 'LINE', '8', capa, '10', f(a[0]), '20', f(a[1]), '30', '0', '11', f(b[0]), '21', f(b[1]), '31', '0');
  const o = p.outline;
  for (let i = 0; i < o.length; i++) lin('CORTE', tr(o[i]), tr(o[(i + 1) % o.length]));
  for (const h of p.holes) { const c = tr([h.x, h.y]); out.push('0', 'CIRCLE', '8', 'AGUJEROS', '10', f(c[0]), '20', f(c[1]), '30', '0', '40', f(h.d / 2)); }
  for (const r of p.ranuras || []) { const q = [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h]]; for (let i = 0; i < 4; i++) lin('CORTE', tr(q[i]), tr(q[(i + 1) % 4])); }
  if (p.dobleces && !p.rolado) { const a = (p.w - p.outline[1][0]); for (const [x0, y0, x1, y1] of [[a, a, p.w - a, a], [p.w - a, a, p.w - a, p.h - a], [p.w - a, p.h - a, a, p.h - a], [a, p.h - a, a, a]]) lin('DOBLEZ', tr([x0, y0]), tr([x1, y1])); }
  const c = tr([p.w / 2, Math.min(p.h - 20, p.h / 2 + 30)]);
  out.push('0', 'TEXT', '8', 'MARCADO', '10', f(c[0] - 20), '20', f(c[1]), '30', '0', '40', '12', '1', p.mark);
  return out;
}
function dxfDoc(ents) {
  const capas = [['CORTE', 1], ['AGUJEROS', 5], ['DOBLEZ', 2], ['MARCADO', 3], ['LAMINA', 8]];
  return ['0', 'SECTION', '2', 'HEADER', '9', '$INSUNITS', '70', '4', '0', 'ENDSEC', '0', 'SECTION', '2', 'TABLES', '0', 'TABLE', '2', 'LAYER', '70', String(capas.length),
    ...capas.flatMap(([n, c]) => ['0', 'LAYER', '2', n, '70', '0', '62', String(c), '6', 'CONTINUOUS']), '0', 'ENDTAB', '0', 'ENDSEC', '0', 'SECTION', '2', 'ENTITIES', ...ents, '0', 'ENDSEC', '0', 'EOF'].join('\n') + '\n';
}
export const dxfPieza = (p) => dxfDoc(dxfEnt(p));
export function dxfHoja(hoja, placas) {
  const by = Object.fromEntries(placas.map((p) => [p.mark, p])), f = (v) => v.toFixed(2), ents = [];
  const q = [[0, 0], [hoja.w, 0], [hoja.w, hoja.h], [0, hoja.h]];
  for (let i = 0; i < 4; i++) ents.push('0', 'LINE', '8', 'LAMINA', '10', f(q[i][0]), '20', f(q[i][1]), '30', '0', '11', f(q[(i + 1) % 4][0]), '21', f(q[(i + 1) % 4][1]), '31', '0');
  for (const it of hoja.piezas) ents.push(...dxfEnt(by[it.mark], it.x, it.y, it.rot));
  ents.push('0', 'TEXT', '8', 'LAMINA', '10', '10', '20', f(hoja.h + 20), '30', '0', '40', '20', '1', `${hoja.codigo} · lámina ${hoja.t} mm · ${hoja.w}x${hoja.h} · ${hoja.piezas.length} piezas`);
  return dxfDoc(ents);
}
