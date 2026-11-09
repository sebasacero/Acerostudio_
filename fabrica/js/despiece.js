// Despiece de taller: convierte el modelo de acero del Studio (barras `member` y columnas con perfil del
// catálogo) en piezas fabricables. Detecta las conexiones entre barras y de ellas saca longitudes de corte,
// ángulos de corte, agujeros, placas soldadas (base, testa, empalme, aleta, cartela), marcas de pieza,
// número de serie de cada unidad y el orden de montaje en obra. Sin DOM ni Three.js: lo usan la página
// de fábrica, el agente de máquinas (Node) y las pruebas.
//
// Unidades de salida: milímetros, kilos y m². Coordenadas DSTV: x a lo largo de la barra desde el extremo
// inicial, y desde el borde de la cara (alma 'v', ala superior 'o', ala inferior 'u', cara trasera 'h').
import { PROFILES, profileLabel } from '../../studio/js/steel.js';

export const GRADE = 'S275JR';
export const MAX_BAR = 12000; // barra comercial más larga: lo que pase de aquí se empalma
const STRUCT = ['viga', 'vigueta', 'diagonal', 'cordon', 'montante', 'correa'];
const PREFIX = { columna: 'C', viga: 'V', vigueta: 'VG', diagonal: 'D', cordon: 'CR', montante: 'M', correa: 'CO' };
export const ROLE_NAME = { columna: 'Columna', viga: 'Viga', vigueta: 'Vigueta', diagonal: 'Riostra', cordon: 'Cordón', montante: 'Montante', correa: 'Correa' };
const ROLE_ORDER = ['columna', 'viga', 'cordon', 'montante', 'diagonal', 'vigueta', 'correa'];
export const PLATE_NAME = { PB: 'Placa base', PE: 'Placa de empalme', PT: 'Placa de testa', PA: 'Aleta de cortante', CT: 'Cartela', PC: 'Placa de cabeza' };

const mm = (m) => Math.round(m * 1000);
const r1 = (v) => Math.round(v * 10) / 10;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);

// Código de perfil DSTV: I (doble T), M (tubo rectangular), RO (tubo redondo), B (chapa).
export const dstvCode = (p) => (p.shape === 'I' ? 'I' : p.shape === 'SHS' ? 'M' : p.shape === 'CHS' ? 'RO' : 'B');
// Superficie de pintura por metro lineal (m²/m).
export function paintPerM(p) {
  if (p.shape === 'I') return 2 * p.h + 4 * p.b - 2 * p.tw;
  if (p.shape === 'SHS') return 4 * p.h;
  if (p.shape === 'CHS') return Math.PI * p.h;
  return 2 * (p.b + p.h);
}

// Barras estructurales del documento en coordenadas de mundo.
export function structuralBars(doc) {
  const elev = Object.fromEntries((doc.levels || []).map((l, i) => [l.id, { elev: l.elev || 0, idx: i, name: l.name }]));
  const bars = [];
  for (const e of doc.elements || []) {
    const L = elev[e.level] || { elev: 0, idx: 0, name: 'Piso 1' };
    if (e.type === 'column' && PROFILES[e.profile]) {
      bars.push({ src: e.id, role: 'columna', profile: e.profile, a: [e.x, L.elev, e.z], b: [e.x, L.elev + e.height, e.z], level: e.level, levelIdx: L.idx, levelName: L.name, rotY: e.rotY || 0 });
    } else if (e.type === 'member' && PROFILES[e.profile] && STRUCT.includes(e.role)) {
      bars.push({ src: e.id, role: e.role, profile: e.profile, a: [e.p0[0], e.p0[1] + L.elev, e.p0[2]], b: [e.p1[0], e.p1[1] + L.elev, e.p1[2]], level: e.level, levelIdx: L.idx, levelName: L.name });
    }
  }
  return bars;
}

// Punto `q` respecto al segmento a-b: parámetro t (0..1) y distancia al eje.
function project(q, a, b) {
  const d = sub(b, a), L2 = d[0] ** 2 + d[1] ** 2 + d[2] ** 2 || 1e-9;
  const t = ((q[0] - a[0]) * d[0] + (q[1] - a[1]) * d[1] + (q[2] - a[2]) * d[2]) / L2;
  const p = [a[0] + d[0] * t, a[1] + d[1] * t, a[2] + d[2] * t];
  return { t, dist: len(sub(q, p)), L: Math.sqrt(L2) };
}

// Ángulo de corte DSTV (0 = corte recto) para que el extremo apoye en un plano horizontal o vertical.
function cutAngle(bar, against) {
  const d = sub(bar.b, bar.a), L = len(d) || 1;
  const horiz = Math.hypot(d[0], d[2]) / L; // coseno del ángulo con la horizontal
  const toH = Math.acos(Math.min(1, horiz)) * 180 / Math.PI; // ángulo con la horizontal
  if (against === 'horizontal') return r1(toH < 0.5 || Math.abs(90 - toH) < 0.5 ? 0 : 90 - toH);
  if (against === 'vertical') return r1(toH < 0.5 ? 0 : toH);
  return 0;
}

// Contorno rectangular de una placa con agujeros (coordenadas de placa en mm, origen en una esquina).
function plate(type, w, h, t, holes = [], extra = {}) {
  return { kind: 'placa', type, w: Math.round(w), h: Math.round(h), t, holes: holes.map((o) => ({ x: Math.round(o.x), y: Math.round(o.y), d: o.d })), outline: [[0, 0], [Math.round(w), 0], [Math.round(w), Math.round(h)], [0, Math.round(h)]], kg: +(w / 1000 * h / 1000 * t / 1000 * 7850).toFixed(2), ...extra };
}
const grid = (w, h, nx, ny, ex, ey, d) => {
  const out = [];
  for (let i = 0; i < nx; i++) for (let k = 0; k < ny; k++) out.push({ x: nx === 1 ? w / 2 : ex + ((w - 2 * ex) * i) / (nx - 1), y: ny === 1 ? h / 2 : ey + ((h - 2 * ey) * k) / (ny - 1), d });
  return out;
};

// ---------------------------------------------------------------------------------------------------
// Despiece completo. Devuelve { orden, piezas (unidades con serie), marcas (piezas iguales agrupadas),
// placas (marcas de chapa), resumen }.
export function despiece(doc, { orden = 'OP-001', grade = GRADE, tolConn = 0.3 } = {}) {
  const bars = structuralBars(doc);
  const isTruss = doc.meta?.tipo === 'nave';
  const cols = bars.filter((b) => b.role === 'columna');
  const units = [];

  for (const bar of bars) {
    const P = PROFILES[bar.profile];
    const L0 = len(sub(bar.b, bar.a));
    const u = { role: bar.role, profile: bar.profile, P, bar, holes: [], plates: [], cuts: { ws: 0, we: 0, fs: 0, fe: 0 }, cutStart: 0, cutEnd: 0, notes: [] };
    const vertical = Math.abs(bar.b[1] - bar.a[1]) / (L0 || 1) > 0.98;
    const horizontal = Math.abs(bar.b[1] - bar.a[1]) < 0.02;

    if (bar.role === 'columna') {
      const ground = bar.a[1] < 0.05;
      const bw = mm(P.b) + 200, bh = mm(P.h) + 200;
      u.plates.push(ground
        ? plate('PB', bw, bh, 25, grid(bw, bh, 2, 2, 50, 50, 26), { at: 'inicio', note: '4 pernos de anclaje Ø24' })
        : plate('PE', mm(P.b) + 60, mm(P.h) + 60, 20, grid(mm(P.b) + 60, mm(P.h) + 60, 2, 2, 40, 40, 22), { at: 'inicio', note: 'empalme con la columna de abajo' }));
      const above = cols.some((c) => c !== bar && Math.abs(c.a[0] - bar.b[0]) < 0.05 && Math.abs(c.a[2] - bar.b[2]) < 0.05 && Math.abs(c.a[1] - bar.b[1]) < 0.05);
      const pw = mm(P.b) + 60, ph = mm(P.h) + 60;
      u.plates.push(above
        ? plate('PE', pw, ph, 20, grid(pw, ph, 2, 2, 40, 40, 22), { at: 'fin', note: 'empalme con la columna de arriba' })
        : plate('PC', mm(P.b), mm(P.h), 12, [], { at: 'fin', note: 'tapa de cabeza' }));
      // las placas se sueldan a tope: el perfil va completo menos el espesor de las placas
      u.deductStart = ground ? 25 : 20;
      u.deductEnd = above ? 20 : 12;
      // Agujeros de las vigas que llegan a la columna: grupo de 4 en el ala (viga en Z) o en el alma (viga en X).
      for (const o of bars) {
        if (o === bar || o.role === 'columna') continue;
        for (const [end, q] of [['a', o.a], ['b', o.b]]) {
          if (Math.abs(q[0] - bar.a[0]) > tolConn || Math.abs(q[2] - bar.a[2]) > tolConn) continue;
          const y = q[1] - bar.a[1];
          if (y < -0.05 || y > L0 + 0.3) continue;
          const other = end === 'a' ? o.b : o.a, dir = sub(other, q);
          const alongZ = Math.abs(dir[2]) > Math.abs(dir[0]);
          if (o.role === 'diagonal' && !isTruss) { u.plates.push(plate('CT', 300, 250, 10, grid(300, 250, 1, 2, 0, 70, 22), { at: Math.max(0, mm(y) - u.deductStart), note: `cartela de riostra ${o.profile}` })); continue; }
          if (!['viga', 'cordon'].includes(o.role)) continue;
          const OP = PROFILES[o.profile], pitch = Math.max(80, mm(OP.h) - 80), x = mm(Math.min(y, L0));
          const face = alongZ ? (dir[2] > 0 ? 'o' : 'u') : 'v', faceW = alongZ ? mm(P.b) : mm(P.h) - 2 * mm(P.tf || 0), g = Math.min(100, faceW - 50);
          for (const dx of [-pitch / 2, pitch / 2]) for (const dy of [-g / 2, g / 2]) u.holes.push({ face, x: x + dx - u.deductStart, y: faceW / 2 + dy, d: 22 });
        }
      }
      u.holes = dedupeHoles(u.holes);
    } else {
      // Extremos: ¿llegan a una columna, a otra barra (viga principal o cordón) o están libres?
      for (const [which, q] of [['inicio', bar.a], ['fin', bar.b]]) {
        const col = cols.find((c) => Math.abs(c.a[0] - q[0]) < tolConn && Math.abs(c.a[2] - q[2]) < tolConn && q[1] >= c.a[1] - 0.05 && q[1] <= c.b[1] + 0.3);
        let deduct = 0;
        if (col && !vertical) {
          const CP = PROFILES[col.profile], d = sub(which === 'inicio' ? bar.b : bar.a, q);
          const alongZ = Math.abs(d[2]) > Math.abs(d[0]);
          if (bar.role === 'diagonal' && !isTruss) {
            deduct = 40; // holgura hasta la cartela
            const hl = { face: 'o', y: mm(P.b) / 2, d: 22 };
            u.holes.push({ ...hl, x: which === 'inicio' ? 60 : -60, rel: which }, { ...hl, x: which === 'inicio' ? 140 : -140, rel: which });
            setCut(u, which, cutAngle(bar, 'horizontal'));
          } else {
            deduct = (alongZ ? mm(CP.h) / 2 : mm(CP.tw ?? CP.t) / 2) + 5 + 15;
            const ph = mm(P.h) + 100, pw = mm(P.b) + 20, pitch = Math.max(80, mm(P.h) - 80);
            u.plates.push(plate('PT', pw, ph, 15, [-1, 1].flatMap((sy) => [-1, 1].map((sx) => ({ x: pw / 2 + sx * Math.min(50, pw / 2 - 30), y: ph / 2 + sy * pitch / 2, d: 22 }))), { at: which, note: `testa a ${col.profile}` }));
            if (!horizontal) setCut(u, which, cutAngle(bar, 'vertical'));
          }
        } else if (!col && bar.role !== 'correa') {
          // ¿apoya en el alma de otra barra? (vigueta sobre viga, montante o diagonal sobre cordón)
          const host = bars.find((o) => o !== bar && o.role !== 'columna' && (o.role === 'viga' || o.role === 'cordon') && (() => { const pr = project(q, o.a, o.b); return pr.t > 0.01 && pr.t < 0.99 && pr.dist < PROFILES[o.profile].h / 2 + 0.25; })());
          if (host) {
            const HP = PROFILES[host.profile];
            if (isTruss || bar.role === 'montante') {
              deduct = mm(HP.h) / 2;
              setCut(u, which, cutAngle(bar, 'horizontal'));
              u.weldedTo = u.weldedTo || host;
            } else {
              deduct = mm(HP.tw || HP.t || 0.01) / 2 + 10;
              u.holes.push(...[-35, 35].map((dy) => ({ face: 'v', x: which === 'inicio' ? 40 : -40, y: mm(P.h) / 2 + dy, d: 18, rel: which })));
              (host.tabs ||= []).push({ at: project(q, host.a, host.b).t, profile: bar.profile });
            }
          }
        }
        if (which === 'inicio') u.deductStart = Math.round(deduct); else u.deductEnd = Math.round(deduct);
      }
    }
    u.length = Math.max(50, mm(L0) - (u.deductStart || 0) - (u.deductEnd || 0));
    units.push(u);
  }

  // Aletas de cortante soldadas en las vigas principales donde apoyan viguetas (2 agujeros Ø18 cada una).
  for (const u of units) {
    for (const t of u.bar.tabs || []) {
      const x = Math.round(t.at * mm(len(sub(u.bar.b, u.bar.a)))) - (u.deductStart || 0);
      u.plates.push(plate('PA', 90, Math.max(140, mm(PROFILES[t.profile].h) - 60), 10, grid(90, Math.max(140, mm(PROFILES[t.profile].h) - 60), 1, 2, 0, 35, 18), { at: x, note: `aleta para vigueta ${t.profile}` }));
    }
  }
  // Agujeros relativos al extremo final: pasarlos a coordenada desde el inicio.
  for (const u of units) u.holes = u.holes.map((h) => (h.rel === 'fin' ? { face: h.face, x: u.length + h.x, y: h.y, d: h.d } : { face: h.face, x: h.x, y: h.y, d: h.d })).filter((h) => h.x > 0 && h.x < u.length);

  // Barras más largas que la barra comercial: se parten en tramos iguales con empalme atornillado.
  const pieces = [];
  for (const u of units) {
    const n = Math.ceil(u.length / MAX_BAR);
    if (n <= 1) { pieces.push(u); continue; }
    const seg = Math.round(u.length / n);
    for (let i = 0; i < n; i++) {
      const s = { ...u, length: i === n - 1 ? u.length - seg * (n - 1) : seg, tramo: `${i + 1}/${n}`, holes: [], plates: [], cuts: { ...u.cuts } };
      const x0 = i * seg;
      s.holes = u.holes.filter((h) => h.x >= x0 && h.x < x0 + s.length).map((h) => ({ ...h, x: h.x - x0 }));
      s.plates = u.plates.filter((p) => (p.at === 'inicio' && i === 0) || (p.at === 'fin' && i === n - 1) || (typeof p.at === 'number' && p.at >= x0 && p.at < x0 + s.length)).map((p) => (typeof p.at === 'number' ? { ...p, at: p.at - x0 } : p));
      if (i > 0) { s.cuts.ws = 0; s.cuts.fs = 0; s.holes.push(...spliceHoles(u.P, 'inicio', s.length)); }
      if (i < n - 1) { s.cuts.we = 0; s.cuts.fe = 0; s.holes.push(...spliceHoles(u.P, 'fin', s.length)); }
      pieces.push(s);
    }
  }

  // Marcas: piezas idénticas (perfil, longitud, cortes, agujeros y placas) comparten marca.
  const sig = (u) => [u.role, u.profile, u.length, u.cuts.ws, u.cuts.we, u.cuts.fs, u.cuts.fe, u.holes.map((h) => `${h.face}${Math.round(h.x)},${Math.round(h.y)},${h.d}`).sort().join(';'), u.plates.map((p) => `${p.type}${p.w}x${p.h}x${p.t}@${p.at}`).sort().join(';')].join('|');
  const plateSig = (p) => `${p.type}|${p.w}|${p.h}|${p.t}|${p.holes.map((h) => `${h.x},${h.y},${h.d}`).sort().join(';')}`;
  pieces.sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role) || a.profile.localeCompare(b.profile) || b.length - a.length);
  const marks = new Map(), plateMarks = new Map(), counters = {};
  for (const u of pieces) {
    const s = sig(u);
    if (!marks.has(s)) {
      const pre = PREFIX[u.role];
      counters[pre] = (counters[pre] || 0) + 1;
      marks.set(s, {
        mark: `${pre}${counters[pre]}`, role: u.role, nombre: ROLE_NAME[u.role], profile: u.profile, perfil: profileLabel(u.profile), code: dstvCode(u.P), grade,
        length: u.length, cuts: u.cuts, holes: u.holes.map((h) => ({ ...h, x: Math.round(h.x), y: Math.round(h.y) })), tramo: u.tramo || null, welded: !!u.weldedTo,
        kgm: u.P.kg, kg: +(u.P.kg * u.length / 1000).toFixed(1), paint: +(paintPerM(u.P) * u.length / 1000).toFixed(2), plates: [], qty: 0, units: [],
      });
    }
    const M = marks.get(s);
    M.qty++;
    u.markRef = M;
    if (!M.qty0) {
      M.qty0 = 1;
      for (const p of u.plates) {
        const ps = plateSig(p);
        if (!plateMarks.has(ps)) plateMarks.set(ps, { ...p, mark: `P${plateMarks.size + 1}`, nombre: PLATE_NAME[p.type], grade, qty: 0, en: new Set() });
        M.plates.push({ mark: plateMarks.get(ps).mark, at: p.at, note: p.note, type: p.type });
      }
    }
    for (const p of M.plates) { const pm = [...plateMarks.values()].find((x) => x.mark === p.mark); pm.qty++; pm.en.add(M.mark); }
  }

  // Unidades con número de serie y orden de montaje (por piso, rol y cercanía al origen).
  pieces.sort((a, b) => a.bar.levelIdx - b.bar.levelIdx || ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role) || (a.bar.a[0] + a.bar.a[2]) - (b.bar.a[0] + b.bar.a[2]));
  const serials = {};
  const piezas = pieces.map((u, i) => {
    const M = u.markRef;
    serials[M.mark] = (serials[M.mark] || 0) + 1;
    const id = `${M.mark}-${String(serials[M.mark]).padStart(3, '0')}`;
    M.units.push(id);
    const c = [(u.bar.a[0] + u.bar.b[0]) / 2, (u.bar.a[1] + u.bar.b[1]) / 2, (u.bar.a[2] + u.bar.b[2]) / 2].map((v) => +v.toFixed(2));
    return { id, mark: M.mark, role: u.role, profile: u.profile, length: u.length, kg: +(M.kg + M.plates.reduce((s, p) => s + plateKg(plateMarks, p.mark), 0)).toFixed(1), level: u.bar.level, levelName: u.bar.levelName, levelIdx: u.bar.levelIdx, seq: i + 1, centro: c, a: u.bar.a.map((v) => +v.toFixed(3)), b: u.bar.b.map((v) => +v.toFixed(3)), src: u.bar.src, tramo: u.tramo || null };
  });
  const marcas = [...marks.values()].map(({ qty0, ...m }) => m);
  const placas = [...plateMarks.values()].map((p) => ({ ...p, en: [...p.en] }));

  const kgPerfiles = marcas.reduce((s, m) => s + m.kg * m.qty, 0), kgPlacas = placas.reduce((s, p) => s + p.kg * p.qty, 0);
  const resumen = {
    orden, proyecto: doc.name || 'Proyecto', tipo: doc.meta?.tipo || null, grade,
    piezas: piezas.length, marcas: marcas.length, placas: placas.reduce((s, p) => s + p.qty, 0), marcasPlaca: placas.length,
    agujeros: marcas.reduce((s, m) => s + m.holes.length * m.qty, 0) + placas.reduce((s, p) => s + p.holes.length * p.qty, 0),
    kgPerfiles: Math.round(kgPerfiles), kgPlacas: Math.round(kgPlacas), kg: Math.round(kgPerfiles + kgPlacas),
    pintura: Math.round(marcas.reduce((s, m) => s + m.paint * m.qty, 0)), metros: Math.round(marcas.reduce((s, m) => s + m.length * m.qty, 0) / 1000),
    pisos: [...new Set(piezas.map((p) => p.levelName))],
  };
  return { orden, resumen, marcas, placas, piezas };
}

function plateKg(plateMarks, mark) { for (const p of plateMarks.values()) if (p.mark === mark) return p.kg; return 0; }
function setCut(u, which, a) { if (which === 'inicio') { u.cuts.ws = a; u.cuts.fs = 0; } else { u.cuts.we = a; u.cuts.fe = 0; } }
function dedupeHoles(hs) { const seen = new Set(); return hs.filter((h) => { const k = `${h.face}${Math.round(h.x)},${Math.round(h.y)}`; if (seen.has(k)) return false; seen.add(k); return true; }); }
// Empalme de tramos: 4 agujeros Ø22 en el alma (o cara) a 50 y 120 mm del extremo.
function spliceHoles(P, which, L) {
  const face = P.shape === 'I' ? 'v' : 'o', w = mm(P.shape === 'I' ? P.h : P.b);
  return [50, 120].flatMap((x) => [-1, 1].map((s) => ({ face, x: which === 'inicio' ? x : L - x, y: w / 2 + s * Math.min(60, w / 4), d: 22 })));
}
