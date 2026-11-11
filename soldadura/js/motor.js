// Motor del simulador de soldadura. Sin DOM: se prueba con  node soldadura/test.mjs
// Unidades: milímetros, segundos y amperios. La probeta mide 160 × 110 mm.
//
// Modelo (simplificado, pensado para practicar, no para certificar):
//   r  = amperaje / amperaje ideal del proceso
//   vi = velocidad ideal de avance a ese amperaje  (vel · r)
//   q  = calor por milímetro relativo al ideal     (r · vel / v)
// Con q alto el cordón sale ancho, alto y puede perforar; con q bajo sale delgado, frío y socavado.
// El Apple Pencil agrega presión (largo de arco) e inclinación (ángulo de avance y de trabajo).

export const PROCESOS = [
  { id: 'e6013', nombre: 'Electrodo E6013', corto: 'E6013', detalle: '1/8" (3,2 mm) · uso general, lámina y ornamentación',
    tipo: 'smaw', amp: [90, 130], ampIdeal: 110, vel: 3.5, ancho: 7, altura: 2.1, pen: 2.2,
    arco: { ideal: 3.2, max: 9, min: 0, nombre: 'Largo de arco' }, tecnica: 'arrastre', avance: [5, 20], escoria: true,
    revestimiento: '#b7a47e' },
  { id: 'e7018', nombre: 'Electrodo E7018', corto: 'E7018', detalle: '1/8" (3,2 mm) · bajo hidrógeno, estructura',
    tipo: 'smaw', amp: [100, 140], ampIdeal: 120, vel: 3, ancho: 8, altura: 2.4, pen: 2.8,
    arco: { ideal: 2.6, max: 8, min: 0, nombre: 'Largo de arco' }, tecnica: 'arrastre', avance: [5, 15], escoria: true,
    revestimiento: '#8e9196', poroso: 1.35 },
  { id: 'mig', nombre: 'MIG ER70S-6', corto: 'MIG', detalle: 'Alambre 0,9 mm · 75 Ar / 25 CO₂ · producción',
    tipo: 'gmaw', amp: [120, 180], ampIdeal: 150, vel: 6, ancho: 7, altura: 2, pen: 2.6,
    arco: { ideal: 12, max: 24, min: 4, nombre: 'Distancia de la boquilla' }, tecnica: 'empuje', avance: [5, 15], escoria: false },
];
export const procesoPorId = id => PROCESOS.find(p => p.id === id) || PROCESOS[0];

const ANCHO = 160, ALTO = 110;
function linea(x0, y0, x1, y1) { return [[x0, y0], [x1, y1]]; }
// antihorario en pantalla, así la normal del trayecto queda hacia afuera del tubo
function circulo(cx, cy, r, n = 160) {
  const pts = [];
  for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 - (i / n) * Math.PI * 2; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return pts;
}

// trabajo: inclinación lateral ideal (grados) hacia la normal del trayecto (+y en las rectas, hacia afuera en el tubo)
export const JUNTAS = [
  { id: 'tope', nombre: 'Junta a tope', codigo: '1G · plana', espesor: 6, abertura: 2, raiz: true,
    desc: 'Dos placas de 6 mm con bisel y 2 mm de abertura. El cordón debe llenar la raíz sin perforar.',
    trabajo: { ideal: 0, tol: 10 }, pts: linea(12, 55, 148, 55) },
  { id: 'filete', nombre: 'Filete en T', codigo: '2F · horizontal', espesor: 6,
    desc: 'Placa vertical sobre placa base. El electrodo va a 45°, partiendo el rincón en dos.',
    trabajo: { ideal: 45, tol: 12 }, pts: linea(12, 50, 148, 50) },
  { id: 'traslape', nombre: 'Junta traslapada', codigo: '1F · traslape', espesor: 4,
    desc: 'Una lámina de 4 mm sobre otra. Apunte al borde de la de arriba sin comérselo.',
    trabajo: { ideal: 30, tol: 12 }, pts: linea(12, 55, 148, 55) },
  { id: 'tubo', nombre: 'Tubo sobre placa', codigo: '2F · circular', espesor: 4,
    desc: 'Tubo de 2½" soldado a una placa. Un cordón alrededor sin perder el ritmo en la curva.',
    trabajo: { ideal: 45, tol: 12 }, centro: [80, 55], radio: 34, pts: circulo(80, 55, 34), cerrado: true },
];

export function crearJunta(id) {
  const j = JUNTAS.find(x => x.id === id) || JUNTAS[0];
  const pts = j.pts, cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { ...j, ancho: ANCHO, alto: ALTO, tray: { pts, cum, L: cum[cum.length - 1], cerrado: !!j.cerrado } };
}

// Proyecta un punto sobre el trayecto: s (mm desde el inicio), d (desvío con signo, + hacia la normal), tangente y normal.
export function proyectar(tray, x, y) {
  const { pts, cum } = tray;
  let mejor = null;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
    let t = ((x - ax) * dx + (y - ay) * dy) / l2; t = Math.max(0, Math.min(1, t));
    const px = ax + dx * t, py = ay + dy * t, dd = (x - px) ** 2 + (y - py) ** 2;
    if (!mejor || dd < mejor.dd) {
      const l = Math.sqrt(l2), tx = dx / l, ty = dy / l;
      mejor = { dd, s: cum[i - 1] + l * t, px, py, tx, ty };
    }
  }
  // normal: en rectas +y; en el tubo (antihorario en pantalla) hacia afuera
  const nx = -mejor.ty, ny = mejor.tx;
  const d = (x - mejor.px) * nx + (y - mejor.py) * ny;
  return { s: mejor.s, d, tx: mejor.tx, ty: mejor.ty, nx, ny, px: mejor.px, py: mejor.py };
}

export function puntoEn(tray, s) {
  const { pts, cum, L, cerrado } = tray;
  if (cerrado) s = ((s % L) + L) % L; else s = Math.max(0, Math.min(L, s));
  let i = 1; while (i < cum.length - 1 && cum[i] < s) i++;
  const t = (s - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1);
  return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
}

function azar(semilla) {
  let a = semilla >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const lim = (v, a, b) => Math.max(a, Math.min(b, v));
const GRADO = 180 / Math.PI;

// Presión del lápiz (0–1) → largo de arco o distancia de boquilla (mm). Presión ~0,4 es lo ideal.
export function arcoDesdePresion(proceso, p) {
  const a = proceso.arco;
  return a.min + (a.max - a.min) * (1 - lim(p, 0, 1)) ** 2;
}
// Inclinación del lápiz → vector hacia donde se inclina la parte de arriba (en pantalla) y cuánto se aleja de la vertical (°).
export function inclinacion(ev) {
  if (ev.altitudeAngle != null && ev.azimuthAngle != null && !(ev.altitudeAngle === Math.PI / 2 && !ev.tiltX && !ev.tiltY)) {
    return { dx: Math.cos(ev.azimuthAngle), dy: Math.sin(ev.azimuthAngle), lean: 90 - ev.altitudeAngle * GRADO };
  }
  const tx = Math.tan((ev.tiltX || 0) / GRADO), ty = Math.tan((ev.tiltY || 0) / GRADO), m = Math.hypot(tx, ty);
  if (m < 1e-6) return { dx: 0, dy: 0, lean: 0 };
  return { dx: tx / m, dy: ty / m, lean: Math.atan(m) * GRADO };
}

export function nuevaSoldadura(junta, proceso, amp, semilla = 7) {
  return { junta, proceso, amp, gotas: [], cordones: 0, eventos: [], arco: false, buf: [], ult: null, rnd: azar(semilla),
    dir: 0, t0: 0, sInicio: 0, tiempoArco: 0, chispas: 0, pegadoDesde: 0 };
}

export function iniciarArco(st, p) {
  st.arco = true; st.buf = [p]; st.calorDesde = 0; st.cordones++; st.t0 = p.t; st.dir = 0; st.pegadoDesde = 0;
  const pr = proyectar(st.junta.tray, p.x, p.y); st.sInicio = pr.s; st.sUlt = pr.s;
  if (st.cordones > 1) st.eventos.push({ tipo: 'reinicio', s: pr.s, t: p.t });
  st.ult = null;
  return lectura(st, p, pr, 0);
}

export function cortarArco(st, t, motivo = 'levanto') {
  if (!st.arco) return;
  st.arco = false;
  const g = st.gotas[st.gotas.length - 1];
  if (g && g.cordon === st.cordones) {
    // cráter: si se levanta corriendo, queda hundido
    const v = st.vUlt || 0, vi = st.proceso.vel * (st.amp / st.proceso.ampIdeal);
    g.crater = motivo !== 'pegado' && v > vi * 0.6 ? 'abierto' : 'lleno';
  }
  st.eventos.push({ tipo: motivo, s: st.sUlt, t });
}

// p: { t, x, y, presion?: 0–1 (solo lápiz), incl?: {dx,dy,lean} en mm (solo lápiz) }
export function moverArco(st, p) {
  if (!st.arco) return { nuevas: [], lectura: null };
  const pr = proyectar(st.junta.tray, p.x, p.y);
  st.buf.push(p);
  while (st.buf.length > 2 && p.t - st.buf[1].t > 0.22) st.buf.shift();
  const a = st.buf[0], dt = p.t - a.t;
  let v = dt > 0.04 ? Math.hypot(p.x - a.x, p.y - a.y) / dt : (st.vUlt ?? 0);
  st.vUlt = v;
  // dirección de avance sobre la junta (se fija después del primer milímetro)
  if (!st.dir) {
    let ds = pr.s - st.sInicio; if (st.junta.tray.cerrado && Math.abs(ds) > st.junta.tray.L / 2) ds -= Math.sign(ds) * st.junta.tray.L;
    if (Math.abs(ds) > 1) st.dir = Math.sign(ds);
  }
  st.sUlt = pr.s;
  const nuevas = [];
  const sale = lectura(st, p, pr, v);
  if (sale.pegado) { cortarArco(st, p.t, 'pegado'); sale.evento = 'pegado'; return { nuevas, lectura: sale }; }
  const paso = 0.7, u = st.ult;
  const dist = u ? Math.hypot(p.x - u.x, p.y - u.y) : Infinity;
  if (!u || dist >= paso || p.t - u.t >= 0.22) {
    // si se saltó mucho (movimiento rápido), rellenar con gotas intermedias
    const n = u && dist < 40 ? Math.max(1, Math.floor(dist / paso)) : 1;
    for (let k = 1; k <= n; k++) {
      const f = n === 1 ? 1 : k / n;
      const x = u && n > 1 ? u.x + (p.x - u.x) * f : p.x, y = u && n > 1 ? u.y + (p.y - u.y) * f : p.y;
      const prk = n > 1 ? proyectar(st.junta.tray, x, y) : pr;
      const g = gota(st, { ...p, x, y }, prk, v, sale);
      if (u && dist < paso * 0.5) g.quieto = true; // mismo punto: suma calor, no otra onda
      st.gotas.push(g); nuevas.push(g);
    }
    st.ult = { x: p.x, y: p.y, t: p.t };
  }
  st.tiempoArco = p.t - st.t0;
  return { nuevas, lectura: sale };
}

function lectura(st, p, pr, v) {
  const P = st.proceso, r = st.amp / P.ampIdeal, vi = P.vel * r;
  const out = { v, vi, sv: v / vi, d: pr.d, s: pr.s, arco: null, avance: null, trabajo: null, pegado: false };
  if (p.presion != null) {
    out.arco = arcoDesdePresion(P, p.presion);
    const corto = P.tipo === 'smaw' ? out.arco < P.arco.ideal * 0.3 : out.arco < P.arco.min + 1;
    if (corto) { st.pegadoDesde ||= p.t; if (p.t - st.pegadoDesde > 0.3) out.pegado = true; }
    else st.pegadoDesde = 0;
  }
  if (p.incl && p.incl.lean > 0.5) {
    const tx = pr.tx * (st.dir || 1), ty = pr.ty * (st.dir || 1);
    const sn = Math.sin(p.incl.lean / GRADO);
    // componentes de la inclinación: a lo largo del avance (+ = arrastre) y hacia la normal de la junta
    out.avance = Math.asin(lim(sn * (p.incl.dx * tx + p.incl.dy * ty), -1, 1)) * GRADO;
    out.trabajo = Math.asin(lim(sn * (p.incl.dx * pr.nx + p.incl.dy * pr.ny), -1, 1)) * GRADO;
  } else if (p.incl) { out.avance = 0; out.trabajo = 0; }
  return out;
}

function gota(st, p, pr, v, lec) {
  const P = st.proceso, J = st.junta, R = st.rnd;
  const r = st.amp / P.ampIdeal, vi = P.vel * r;
  const vEf = Math.max(v, 0.35);
  let q = r * P.vel / vEf;
  const arranque = p.t - st.t0 < 0.6;
  if (arranque) q = Math.min(q, 1.5);
  const qa = lim(q, 0.25, 3.2);
  const fa = lec.arco != null ? lim(lec.arco / P.arco.ideal, 0.4, 3) : 1;
  const w = P.ancho * Math.sqrt(r) * Math.min(qa, 2.2) ** 0.33 * fa ** 0.22 * (1 + (R() - 0.5) * 0.06);
  const h = P.altura * qa ** 0.5 / r ** 0.15 / fa ** 0.25;
  const pen = P.pen * r ** 1.4 * qa ** 0.2 / fa ** 0.3;
  const sv = vEf / vi, def = [];
  const ampMax = P.amp[1], ampMin = P.amp[0];
  if (sv > 1.5 || (st.amp > ampMax * 1.04 && R() < 0.5)) def.push('socavado');
  if (q < 0.55 || st.amp < ampMin * 0.95) def.push('frio');
  // el calor tiene que sostenerse: una pausa corta para llenar el cráter no perfora
  if (q > 2.0 && !arranque) st.calorDesde ||= p.t; else st.calorDesde = 0;
  const sostenido = st.calorDesde ? p.t - st.calorDesde : 0;
  if (sostenido > 0.7 && q > 2.4 && r > 0.9 && J.raiz) def.push('perforacion');
  else if (sostenido > 0.5) def.push('sobremonta');
  if (lec.arco != null && lec.arco > P.arco.ideal * (P.poroso || 1.6) && R() < 0.3) def.push('poro');
  if (Math.abs(pr.d) > w / 2 - 0.8) def.push(Math.abs(pr.d) > w / 2 + 3 ? 'fuera' : 'desviado');
  if (P.escoria && lec.avance != null && lec.avance < -5 && R() < 0.35) def.push('escoria');
  if (lec.trabajo != null && Math.abs(lec.trabajo - J.trabajo.ideal) > J.trabajo.tol * 2 && R() < 0.4) def.push(J.trabajo.ideal ? 'pierna' : 'socavado');
  // chispas y salpicadura: suben con amperaje alto y arco largo
  const salp = lim((r - 1) * 2.5 + (fa - 1) * 1.6 + (P.tipo === 'gmaw' ? -0.3 : 0.1), 0, 3);
  return { x: p.x, y: p.y, s: pr.s, d: pr.d, tx: pr.tx * (st.dir || 1), ty: pr.ty * (st.dir || 1), v, sv, q, w, h, pen, t: p.t,
    arco: lec.arco, avance: lec.avance, trabajo: lec.trabajo, def, salp, cordon: st.cordones, semilla: R() };
}

// ---------------- evaluación ----------------
const NOMBRES = {
  socavado: 'Socavado', frio: 'Cordón frío / falta de fusión', perforacion: 'Perforación', sobremonta: 'Sobremonta excesiva',
  poro: 'Porosidad', desviado: 'Fuera de la junta (falta de fusión lateral)', fuera: 'Arco fuera de la junta',
  escoria: 'Escoria atrapada', pierna: 'Piernas desiguales', reinicio: 'Reinicios', crater: 'Cráter sin llenar',
  pegado: 'Electrodo pegado', incompleto: 'Junta sin terminar',
};
export const nombreDefecto = k => NOMBRES[k] || k;
const CRITICOS = new Set(['perforacion', 'fuera', 'incompleto']);

export function evaluar(st) {
  const J = st.junta, P = st.proceso, L = J.tray.L, gs = st.gotas;
  const r = st.amp / P.ampIdeal, vi = P.vel * r;
  if (!gs.length) return null;
  // cobertura en tramos de 1 mm
  const n = Math.ceil(L), cub = new Uint8Array(n);
  for (const g of gs) {
    if (Math.abs(g.d) > g.w / 2 + 0.5) continue;
    const a = Math.floor(g.s - 0.6), b = Math.ceil(g.s + 0.6);
    for (let i = a; i <= b; i++) { const k = J.tray.cerrado ? ((i % n) + n) % n : i; if (k >= 0 && k < n) cub[k] = 1; }
  }
  // en las rectas se perdonan 4 mm en cada punta (inicio y remate)
  const ini = J.tray.cerrado ? 0 : 4, fin = J.tray.cerrado ? n : n - 4;
  let c = 0; for (let i = ini; i < fin; i++) c += cub[i];
  const cobertura = c / (fin - ini);

  const vale = gs.filter(g => Math.abs(g.d) <= g.w / 2 + 3);
  const prom = a => a.reduce((x, y) => x + y, 0) / (a.length || 1);
  const desvio = prom(vale.map(g => Math.abs(g.d)));
  const anchos = vale.map(g => g.w), wm = prom(anchos);
  const cv = Math.sqrt(prom(anchos.map(w => (w - wm) ** 2))) / (wm || 1);
  const enRitmo = vale.filter(g => g.sv >= 0.75 && g.sv <= 1.35).length / (vale.length || 1);
  const reinicios = Math.max(0, st.cordones - 1);
  const crateres = gs.filter(g => g.crater === 'abierto').length;
  const pegados = st.eventos.filter(e => e.tipo === 'pegado').length;

  const pts = {};
  pts.cobertura = lim((cobertura - 0.6) / 0.38, 0, 1) * 100;
  pts.alineacion = lim(1 - (desvio - 0.4) / (wm / 2 - 0.4 || 1), 0, 1) * 100;
  pts.ritmo = lim((enRitmo - 0.25) / 0.65, 0, 1) * 100;
  pts.uniformidad = lim(1 - (cv - 0.05) / 0.3, 0, 1) * 100;
  pts.continuidad = lim(100 - reinicios * 12 - crateres * 8 - pegados * 10, 0, 100);
  const conLapiz = gs.some(g => g.arco != null);
  if (conLapiz) {
    const tec = gs.filter(g => g.arco != null);
    const arcoOk = g => g.arco >= P.arco.ideal * 0.6 && g.arco <= P.arco.ideal * 1.5;
    const anguloOk = g => {
      if (g.avance == null) return true;
      const av = P.tecnica === 'arrastre' ? g.avance : -g.avance;
      return av >= P.avance[0] - 3 && av <= P.avance[1] + 5 && Math.abs(g.trabajo - J.trabajo.ideal) <= J.trabajo.tol;
    };
    // cuenta solo lo que tuvo arco y ángulo bien al mismo tiempo
    const ok = tec.filter(g => arcoOk(g) && anguloOk(g)).length / tec.length;
    pts.tecnica = lim((ok - 0.2) / 0.7, 0, 1) * 100;
  }
  const pesos = { cobertura: 20, alineacion: 20, ritmo: 20, uniformidad: 15, continuidad: 10, tecnica: 15 };
  let suma = 0, peso = 0;
  for (const k in pts) { suma += pts[k] * pesos[k]; peso += pesos[k]; }
  let total = suma / peso;

  // defectos: fracción del largo afectado y posición aproximada
  const defectos = {};
  for (const g of gs) for (const d of g.def) (defectos[d] ||= []).push(g.s);
  const lista = Object.entries(defectos).map(([k, ss]) => ({ id: k, nombre: nombreDefecto(k), largo: Math.min(L, ss.length * 0.7),
    desde: Math.min(...ss), hasta: Math.max(...ss), critico: CRITICOS.has(k) }))
    .filter(d => d.largo >= (d.id === 'poro' || d.id === 'perforacion' ? 0.7 : 3))
    .sort((a, b) => b.largo - a.largo);
  if (cobertura < 0.95) lista.unshift({ id: 'incompleto', nombre: nombreDefecto('incompleto'), largo: (1 - cobertura) * L, critico: true });
  if (crateres) lista.push({ id: 'crater', nombre: nombreDefecto('crater'), largo: crateres, cuenta: crateres });
  if (pegados) lista.push({ id: 'pegado', nombre: nombreDefecto('pegado'), largo: pegados, cuenta: pegados });
  const lateral = (defectos.desviado?.length || 0) * 0.7 / L;
  const penalizacion = lista.reduce((a, d) => a + (d.critico ? 18 : ['socavado', 'frio', 'escoria', 'poro'].includes(d.id) ? Math.min(10, d.largo / L * 40) : 0), 0);
  total = lim(total - penalizacion, 0, 100);

  const pen = prom(vale.map(g => g.pen)), alto = prom(vale.map(g => g.h));
  const aprobada = total >= 70 && cobertura >= 0.95 && !lista.some(d => d.critico) && lateral < 0.05;
  const res = {
    total: Math.round(total), aprobada, puntos: Object.fromEntries(Object.entries(pts).map(([k, v]) => [k, Math.round(v)])), conLapiz,
    cobertura, desvio, ancho: wm, cv, enRitmo, vi, vMedia: prom(vale.map(g => g.v)), reinicios, crateres, pegados,
    penetracion: pen, sobremonta: alto, espesor: J.espesor, defectos: lista, tiempo: gs.length ? gs[gs.length - 1].t - gs[0].t : 0,
    perfil: perfilVelocidad(gs, L, vi),
  };
  res.consejos = consejos(res, st);
  return res;
}

function perfilVelocidad(gs, L, vi) {
  const n = 40, sum = new Float64Array(n), cnt = new Uint16Array(n);
  for (const g of gs) { const i = Math.min(n - 1, Math.max(0, Math.floor(g.s / L * n))); sum[i] += g.sv; cnt[i]++; }
  return Array.from(sum, (s, i) => cnt[i] ? s / cnt[i] : null);
}

function consejos(res, st) {
  const P = st.proceso, J = st.junta, out = [];
  const lento = res.vMedia < res.vi * 0.8, rapido = res.vMedia > res.vi * 1.3;
  if (res.cobertura < 0.95) out.push(`Le faltó ${Math.round((1 - res.cobertura) * 100)} % de la junta. Corra el cordón de punta a punta${J.tray.cerrado ? ' y cierre la vuelta encima del arranque' : ''}.`);
  if (rapido) out.push(`Va rápido: ${res.vMedia.toFixed(1)} mm/s cuando el ritmo es ${res.vi.toFixed(1)} mm/s. Mire el charco y avance solo cuando moje los dos bordes.`);
  if (lento) out.push(`Va lento: ${res.vMedia.toFixed(1)} mm/s contra ${res.vi.toFixed(1)} mm/s. El calor se acumula, el cordón engorda${J.raiz ? ' y la raíz se puede perforar' : ''}.`);
  if (res.desvio > 1.2) out.push(`Se desvía ${res.desvio.toFixed(1)} mm de la junta en promedio. Apoye la muñeca o el meñique y mire adelante del charco, no la punta.`);
  if (res.cv > 0.15) out.push('El ancho cambia mucho: el ritmo no es parejo. Cuente en voz baja para llevar el mismo paso.');
  if (st.amp < P.amp[0]) out.push(`${st.amp} A es poco para ${P.corto}: suba a ${P.amp[0]}–${P.amp[1]} A o el cordón queda frío y montado.`);
  if (st.amp > P.amp[1]) out.push(`${st.amp} A es mucho para ${P.corto}: baje a ${P.amp[0]}–${P.amp[1]} A, hay socavado y salpicadura.`);
  if (res.reinicios > 1) out.push(`Hubo ${res.reinicios} reinicios. Cada parada deja un empate: arranque un poco antes del cráter anterior.`);
  if (res.crateres) out.push('Al terminar, deténgase un instante para llenar el cráter antes de levantar.');
  if (res.pegados) out.push(P.tipo === 'smaw' ? 'El electrodo se pegó: está apretando demasiado. Mantenga el arco del grueso del electrodo.' : 'La boquilla tocó la pieza: deje unos 12 mm de alambre afuera.');
  const d = res.defectos.map(x => x.id);
  if (d.includes('poro')) out.push(P.id === 'e7018' ? 'Porosidad: el 7018 pide arco corto y electrodo seco del horno.' : 'Porosidad: el arco está largo. Acérquese un poco.');
  if (d.includes('escoria')) out.push('Escoria atrapada: con electrodo se suelda arrastrando, la punta mirando hacia el cordón ya hecho.');
  if (d.includes('pierna')) out.push(`En ${J.nombre.toLowerCase()} el ángulo de trabajo va a ${J.trabajo.ideal}°; si se cae, una pierna queda más larga que la otra.`);
  if (!out.length) out.push(res.aprobada ? 'Cordón parejo y bien puesto. Pruebe el modo examen o otra junta.' : 'Va por buen camino: repita la misma probeta hasta que el ritmo le salga sin pensarlo.');
  return out.slice(0, 4);
}
