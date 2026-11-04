// Planta autónoma: cada pieza lleva su propia ruta por el taller (sin cambio de formato por pieza: un lote de
// 100 piezas distintas corre igual que 100 iguales) y el tiempo de máquina se reparte como cómputo, con una
// cola por máquina. Cada máquina mide lo que acaba de hacer (láser de longitud en la sierra, palpador en la
// línea de taladrado, escáner 3D al final) y se corrige sola: compensa su desvío para la siguiente pieza,
// recorta si quedó larga y repone la pieza si quedó corta.
//
// Todo es determinista (semilla) para que la simulación del navegador y la del agente Node coincidan.
import { PROFILES } from '../../studio/js/steel.js';
import { paintPerM } from './despiece.js';

// Distribución del taller en metros (x, z) para el gemelo digital; `n` = máquinas iguales en paralelo.
export const MAQUINAS = [
  { id: 'almacen', nombre: 'Almacén de barras', corto: 'Almacén', n: 1, pos: [0, 0], size: [5, 10, 1.2] },
  { id: 'sierra', nombre: 'Sierra de cinta CNC', corto: 'Sierra', n: 2, pos: [9, 0], size: [3, 2.2, 2.2], tol: 2 },
  { id: 'taladro', nombre: 'Línea de taladrado 3 ejes', corto: 'Taladro', n: 1, pos: [16, 0], size: [5, 2.6, 2.8], tol: 1.5 },
  { id: 'plasma', nombre: 'Mesa de plasma CNC', corto: 'Plasma', n: 1, pos: [9, 9], size: [6, 3, 1.4], tol: 1.5 },
  { id: 'granalla', nombre: 'Granalladora de perfiles', corto: 'Granalla', n: 1, pos: [23, 0], size: [4, 3.4, 3.6] },
  { id: 'soldadura', nombre: 'Celda robot de soldadura', corto: 'Robot', n: 3, pos: [30, 0], size: [3.2, 3.2, 2.6] },
  { id: 'pintura', nombre: 'Línea de pintura airless', corto: 'Pintura', n: 2, pos: [37, 0], size: [5, 3.4, 3.4] },
  { id: 'qc', nombre: 'Escáner 3D de control', corto: 'Escáner', n: 1, pos: [44, 0], size: [3, 3, 3], tol: 2 },
  { id: 'despacho', nombre: 'Patio de despacho', corto: 'Despacho', n: 1, pos: [51, 0], size: [6, 10, 0.4] },
];
export const MAQ = Object.fromEntries(MAQUINAS.map((m) => [m.id, m]));
const TRASLADO = 25; // s de puente grúa o transportador entre estaciones

// Semilla y ruido gaussiano.
export function rng(seed = 7) {
  let a = seed >>> 0;
  const u = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  u.gauss = (s = 1) => Math.sqrt(-2 * Math.log(u() || 1e-9)) * Math.cos(2 * Math.PI * u()) * s;
  return u;
}

// Tiempos de máquina en segundos (estimados de taller; se ajustan con los tiempos reales que reporta el agente).
export const TIEMPOS = {
  sierra: (m) => { const area = PROFILES[m.profile].kg / 7.85e-3; return 35 + (1 + (m.cuts.ws || m.cuts.we ? 1 : 0)) * area / 45; },
  taladro: (m) => 40 + m.holes.length * 16 + new Set(m.holes.map((h) => h.face)).size * 25,
  plasma: (p) => 20 + (2 * (p.w + p.h)) / (p.t > 15 ? 14 : 26) + p.holes.length * 7,
  granalla: (m) => 25 + m.length / 1000 * 28,
  soldadura: (m, placas) => 60 + placas.reduce((s, p) => s + 150 + p.t * 9, 0) + (m.welded ? 220 : 0),
  pintura: (m) => 60 + paintPerM(PROFILES[m.profile]) * m.length / 1000 * 55,
  qc: (m) => 45 + m.holes.length,
  despacho: () => 30,
};

// Ruta de una pieza: sus estaciones según lo que necesita.
export function ruta(m) {
  const r = ['sierra'];
  if (m.holes.length) r.push('taladro');
  r.push('granalla');
  if (m.plates.length || m.welded) r.push('soldadura');
  r.push('pintura', 'qc', 'despacho');
  return r;
}

export function simular(despiece, { semilla = 7, calibracion = 0.9, desgaste = 0.05, ruido = 0.45 } = {}) {
  const R = rng(semilla);
  const marks = Object.fromEntries(despiece.marcas.map((m) => [m.mark, m]));
  const plates = Object.fromEntries(despiece.placas.map((p) => [p.mark, p]));
  const units = {}; // disponibilidad y estado de cada máquina
  for (const M of MAQUINAS) units[M.id] = Array.from({ length: M.n }, (_, i) => ({ id: `${M.id}${M.n > 1 ? '-' + (i + 1) : ''}`, libre: 0, ocupado: 0, desvio: M.tol ? R.gauss(calibracion) : 0, trabajos: 0 }));
  const ops = [], eventos = [], jobs = {}, calidad = { mediciones: 0, ajustes: 0, recortes: 0, rechazos: 0, desvios: [] };
  const ev = (t, maq, pieza, tipo, msg) => eventos.push({ t: Math.round(t), maq, pieza, tipo, msg });

  const correr = (maqId, job, listo, dur, kind) => {
    const us = units[maqId];
    const u = us.reduce((a, b) => (b.libre < a.libre ? b : a));
    const start = Math.max(listo, u.libre), end = start + dur;
    u.libre = end; u.ocupado += dur; u.trabajos++;
    const op = { job, maq: maqId, unidad: u.id, start: Math.round(start), end: Math.round(end), kind };
    ops.push(op); (jobs[job] ||= []).push(op);
    return { u, start, end };
  };
  // Medición en proceso y corrección automática (sierra: longitud; taladro: posición de agujeros; plasma: contorno).
  const medir = (maqId, u, pieza, t, objetivo) => {
    const tol = MAQ[maqId].tol;
    u.desvio += R.gauss(desgaste) + (maqId === 'sierra' ? desgaste * 0.4 : 0); // desgaste de la hoja o de la broca
    const dev = u.desvio + R.gauss(ruido);
    calidad.mediciones++; calidad.desvios.push(+dev.toFixed(2));
    let resultado = 'ok';
    if (Math.abs(dev) > tol) {
      if (maqId === 'sierra' && dev > 0) { resultado = 'recorte'; calidad.recortes++; ev(t, u.id, pieza, 'recorte', `${objetivo} quedó ${dev.toFixed(1)} mm larga: se recorta en la misma sierra`); }
      else if (maqId === 'taladro') { resultado = 'retrabajo'; calidad.recortes++; ev(t, u.id, pieza, 'retrabajo', `agujero corrido ${dev.toFixed(1)} mm: se tapa con soldadura y se vuelve a taladrar`); }
      else { resultado = 'rechazo'; calidad.rechazos++; ev(t, u.id, pieza, 'rechazo', `desvío ${dev.toFixed(1)} mm fuera de ±${tol} mm: se repone la pieza`); }
    } else ev(t, u.id, pieza, 'medicion', `${objetivo}: ${dev >= 0 ? '+' : ''}${dev.toFixed(1)} mm (tolerancia ±${tol})`);
    if (Math.abs(u.desvio) > tol * 0.35) {
      const antes = u.desvio;
      u.desvio = u.desvio * 0.12 + R.gauss(0.08);
      calidad.ajustes++;
      ev(t, u.id, pieza, 'ajuste', `se corrige sola: compensa ${(-antes + u.desvio).toFixed(1)} mm para la siguiente pieza`);
    }
    return { dev, resultado };
  };

  const piezas = [...despiece.piezas].sort((a, b) => a.seq - b.seq);
  for (const pz of piezas) {
    const m = marks[pz.mark];
    // Placas de esta pieza: plasma (con su propia medición) y quedan esperando en la celda de soldadura.
    let placasListas = 0;
    const misPlacas = m.plates.map((p) => plates[p.mark]);
    misPlacas.forEach((p, i) => {
      const id = `${pz.id}/${p.mark}·${i + 1}`;
      let r = correr('plasma', id, 0, TIEMPOS.plasma(p), 'placa');
      const q = medir('plasma', r.u, id, r.end, `${p.mark} ${p.w}×${p.h}`);
      if (q.resultado === 'rechazo') r = correr('plasma', id, r.end, TIEMPOS.plasma(p), 'reposicion');
      placasListas = Math.max(placasListas, r.end + TRASLADO);
    });
    let t = 0;
    for (const st of ruta(m)) {
      let dur = TIEMPOS[st](m, misPlacas);
      const listo = st === 'soldadura' ? Math.max(t, placasListas) : t;
      let r = correr(st, pz.id, listo, dur, st);
      if (st === 'sierra' || st === 'taladro') {
        const q = medir(st, r.u, pz.id, r.end, st === 'sierra' ? `${pz.id} L=${m.length}` : `${pz.id} ${m.holes.length} agujeros`);
        if (q.resultado === 'recorte') r = correr(st, pz.id, r.end, 45, 'recorte');
        if (q.resultado === 'retrabajo') r = correr(st, pz.id, r.end, 150, 'retrabajo');
        if (q.resultado === 'rechazo') r = correr(st, pz.id, r.end, dur, 'reposicion');
      }
      if (st === 'qc') {
        const dev = R.gauss(0.5);
        ev(r.end, r.u.id, pz.id, 'certificado', `escaneo 3D conforme: desvío máx. ${Math.abs(dev).toFixed(1)} mm · EN 1090 EXC2`);
        pz.qc = +Math.abs(dev).toFixed(2);
      }
      t = r.end + TRASLADO;
    }
  }
  const makespan = Math.max(...ops.map((o) => o.end));
  const maquinas = MAQUINAS.map((M) => ({ ...M, unidades: units[M.id].map((u) => ({ id: u.id, ocupado: Math.round(u.ocupado), trabajos: u.trabajos, uso: makespan ? u.ocupado / makespan : 0 })), ocupado: Math.round(units[M.id].reduce((s, u) => s + u.ocupado, 0)) }));
  const horasMaquina = maquinas.reduce((s, M) => s + M.ocupado, 0) / 3600;
  eventos.sort((a, b) => a.t - b.t);
  const cuello = maquinas.filter((M) => M.id !== 'despacho').reduce((a, b) => (b.ocupado / b.n > a.ocupado / a.n ? b : a));
  return { ops, jobs, eventos, maquinas, makespan, horasMaquina, cuello: cuello.id, calidad: { ...calidad, cpk: cpk(calidad.desvios, 2) } };
}

function cpk(xs, tol) {
  if (xs.length < 2) return null;
  const mu = xs.reduce((s, x) => s + x, 0) / xs.length, sd = Math.sqrt(xs.reduce((s, x) => s + (x - mu) ** 2, 0) / (xs.length - 1)) || 1e-6;
  return +Math.min((tol - mu) / (3 * sd), (mu + tol) / (3 * sd)).toFixed(2);
}

// Dónde está cada pieza en el instante t (para el gemelo digital): estación actual, en tránsito o lista.
export function estadoEn(sim, t) {
  const out = {};
  for (const [id, list] of Object.entries(sim.jobs)) {
    if (id.includes('/')) continue; // las placas se muestran solo en el plasma
    let s = { estado: 'espera', maq: 'almacen' };
    for (let i = 0; i < list.length; i++) {
      const o = list[i];
      if (t < o.start) { s = i === 0 ? { estado: 'espera', maq: 'almacen' } : { estado: 'transito', de: list[i - 1].unidad, a: o.unidad, f: Math.min(1, (t - list[i - 1].end) / TRASLADO) }; break; }
      if (t <= o.end) { s = { estado: 'proceso', maq: o.maq, unidad: o.unidad, f: (t - o.start) / (o.end - o.start || 1), kind: o.kind }; break; }
      s = { estado: o.maq === 'despacho' ? 'lista' : 'transito', maq: o.maq, unidad: o.unidad };
    }
    out[id] = s;
  }
  return out;
}

export const hms = (s) => { s = Math.round(s); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h ? `${h} h ${String(m).padStart(2, '0')} min` : `${m} min ${String(s % 60).padStart(2, '0')} s`; };
