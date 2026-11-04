// Salidas para las máquinas del taller y para compras:
// - DSTV / NC1: el formato que leen las líneas de corte y taladrado de perfiles (Ficep, Peddinghaus,
//   Voortman, Kaltenbach, Vernet Behringer…). Un archivo por marca, con cortes en ángulo y agujeros por cara.
// - DXF R12: contorno y agujeros de cada placa y láminas completas ya anidadas para plasma, láser u oxicorte.
// - CSV: lista de corte (barra por barra), lista de piezas y lista de compra.
// - ZIP sin compresión para bajar todo el paquete de taller de una vez (navegador y Node).
import { PROFILES, profileLabel } from '../../studio/js/steel.js';
import { paintPerM } from './despiece.js';

const f2 = (v) => (+v).toFixed(2).padStart(10);
const f3 = (v) => (+v).toFixed(3).padStart(10);

function radius(P) {
  if (P.shape === 'I') return P.b >= P.h * 0.8 ? P.h * 90 : P.h * 50; // r ≈ 9 % (HEB) o 5 % (IPE) del canto, en mm
  if (P.shape === 'SHS') return P.t * 2000;
  return 0;
}

// Archivo NC1 de una marca de perfil.
export function nc1(m, { orden = 'OP-001', proyecto = 'AceroStudio' } = {}) {
  const P = PROFILES[m.profile];
  const L = [];
  L.push('ST', `** AceroStudio · ${proyecto} · ${m.nombre}${m.tramo ? ` tramo ${m.tramo}` : ''}`);
  const code = P.shape === 'I' ? 'I' : P.shape === 'SHS' ? 'M' : 'RO';
  const t = P.shape === 'I' ? [P.h, P.b, P.tf, P.tw] : [P.h, P.b, P.t, P.t];
  L.push(`  ${orden}`, `  ${m.mark}`, '  1', `  ${m.mark}`, `  ${m.grade}`, `  ${m.qty}`, `  ${m.profile}`, `  ${code}`,
    f2(m.length), ...t.map((v) => f2(v * 1000)), f2(radius(P)), f3(P.kg), f3(paintPerM(P)),
    f3(m.cuts.ws), f3(m.cuts.we), f3(m.cuts.fs), f3(m.cuts.fe), `  ${m.nombre}`, `  ${m.plates.map((p) => p.mark).join(' ') || '-'}`, '  -', '  -');
  if (m.holes.length) {
    L.push('BO');
    for (const h of [...m.holes].sort((a, b) => a.face.localeCompare(b.face) || a.x - b.x || a.y - b.y)) L.push(`  ${h.face}${f2(h.x)}s${f2(h.y)}${f2(h.d)}`);
  }
  // Marcado con la marca de pieza (punzonado o tinta) en el alma, a 100 mm del inicio.
  L.push('SI', `  ${P.shape === 'I' ? 'v' : 'o'}${f2(100)}${f2(P.h * 500)}  0.00 10r${m.mark}`);
  L.push('EN');
  return L.join('\n') + '\n';
}

// NC1 de una placa (perfil B) con contorno AK y agujeros.
export function nc1Plate(p, { orden = 'OP-001' } = {}) {
  const L = ['ST', `** AceroStudio · ${p.nombre}`, `  ${orden}`, `  ${p.mark}`, '  1', `  ${p.mark}`, `  ${p.grade}`, `  ${p.qty}`, `  PL${p.t}*${p.w}`, '  B',
    f2(p.w), f2(p.h), f2(0), f2(p.t), f2(p.t), f2(0), f3(p.t * 7.85), f3(0.002 * (p.w + p.h)), f3(0), f3(0), f3(0), f3(0), `  ${p.nombre}`, `  ${p.en.join(' ')}`, '  -', '  -'];
  L.push('AK', ...[...p.outline, p.outline[0]].map(([x, y]) => `  v${f2(x)}${f2(y)}${f2(0)}`));
  if (p.holes.length) L.push('BO', ...p.holes.map((h) => `  v${f2(h.x)}s${f2(h.y)}${f2(h.d)}`));
  L.push('EN');
  return L.join('\n') + '\n';
}

// ---------------------------------------------------------------------------------------------------
// DXF R12 (ASCII): capas CORTE (contorno), AGUJEROS, MARCADO (texto que se graba o se marca con tinta).
function dxf(entities) {
  const layers = [['CORTE', 1], ['AGUJEROS', 5], ['MARCADO', 3], ['LAMINA', 8]];
  const head = ['0', 'SECTION', '2', 'HEADER', '9', '$INSUNITS', '70', '4', '0', 'ENDSEC', '0', 'SECTION', '2', 'TABLES', '0', 'TABLE', '2', 'LAYER', '70', String(layers.length),
    ...layers.flatMap(([n, c]) => ['0', 'LAYER', '2', n, '70', '0', '62', String(c), '6', 'CONTINUOUS']), '0', 'ENDTAB', '0', 'ENDSEC', '0', 'SECTION', '2', 'ENTITIES'];
  return [...head, ...entities, '0', 'ENDSEC', '0', 'EOF'].join('\n') + '\n';
}
const line = (layer, a, b) => ['0', 'LINE', '8', layer, '10', a[0].toFixed(2), '20', a[1].toFixed(2), '30', '0', '11', b[0].toFixed(2), '21', b[1].toFixed(2), '31', '0'];
const circle = (layer, c, r) => ['0', 'CIRCLE', '8', layer, '10', c[0].toFixed(2), '20', c[1].toFixed(2), '30', '0', '40', r.toFixed(2)];
const text = (layer, p, h, s) => ['0', 'TEXT', '8', layer, '10', p[0].toFixed(2), '20', p[1].toFixed(2), '30', '0', '40', String(h), '1', s];

function plateEntities(p, ox = 0, oy = 0, rot = false) {
  const tr = ([x, y]) => (rot ? [ox + y, oy + x] : [ox + x, oy + y]);
  const out = [];
  const o = p.outline;
  for (let i = 0; i < o.length; i++) out.push(...line('CORTE', tr(o[i]), tr(o[(i + 1) % o.length])));
  for (const h of p.holes) out.push(...circle('AGUJEROS', tr([h.x, h.y]), h.d / 2));
  const c = tr([p.w / 2, p.h / 2]);
  out.push(...text('MARCADO', [c[0] - 18, c[1] - 6], 12, p.mark));
  return out;
}
export const dxfPlate = (p) => dxf(plateEntities(p));
// Lámina completa con todas sus placas anidadas: es el programa que va directo al plasma o láser.
export function dxfSheet(hoja, placas) {
  const byMark = Object.fromEntries(placas.map((p) => [p.mark, p]));
  const ents = [...line('LAMINA', [0, 0], [hoja.w, 0]), ...line('LAMINA', [hoja.w, 0], [hoja.w, hoja.h]), ...line('LAMINA', [hoja.w, hoja.h], [0, hoja.h]), ...line('LAMINA', [0, hoja.h], [0, 0])];
  for (const it of hoja.piezas) ents.push(...plateEntities(byMark[it.mark], it.x, it.y, it.rot));
  ents.push(...text('LAMINA', [10, hoja.h + 20], 20, `${hoja.codigo} · chapa ${hoja.t} mm · ${hoja.w}x${hoja.h} · ${hoja.piezas.length} placas`));
  return dxf(ents);
}

// ---------------------------------------------------------------------------------------------------
const csv = (rows) => rows.map((r) => r.map((v) => (/[;"\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v)).join(';')).join('\n') + '\n';
const n1 = (v) => String(Math.round(v * 10) / 10).replace('.', ',');

export function csvPiezas(d) {
  return csv([['Marca', 'Elemento', 'Perfil', 'Calidad', 'Cant.', 'Longitud mm', 'Corte inicio °', 'Corte fin °', 'Agujeros', 'Placas soldadas', 'kg/u', 'kg total', 'Pintura m²'],
    ...d.marcas.map((m) => [m.mark, m.nombre + (m.tramo ? ` (tramo ${m.tramo})` : ''), profileLabel(m.profile), m.grade, m.qty, m.length, n1(m.cuts.ws), n1(m.cuts.we), m.holes.length, m.plates.map((p) => p.mark).join(' '), n1(m.kg), n1(m.kg * m.qty), n1(m.paint * m.qty)]),
    [], ['Placa', 'Tipo', 'Espesor mm', 'Ancho mm', 'Alto mm', 'Cant.', 'Agujeros', 'Va en', 'kg/u', 'kg total'],
    ...d.placas.map((p) => [p.mark, p.nombre, p.t, p.w, p.h, p.qty, p.holes.length, p.en.join(' '), n1(p.kg), n1(p.kg * p.qty)])]);
}
export function csvCorte(nest) {
  const rows = [['Barra', 'Perfil', 'Largo comercial mm', 'Origen', 'Corte', 'Pieza', 'Marca', 'Largo mm', 'Posición mm', 'Sobrante mm']];
  for (const b of nest.barras) b.cuts.forEach((c, i) => rows.push([b.codigo, b.profile, b.stock, b.retal || 'nueva', i + 1, c.id, c.mark, c.len, c.at, i === b.cuts.length - 1 ? b.stock - b.used : '']));
  return csv(rows);
}
export function csvCompra(nest, plates) {
  return csv([['Material', 'Cantidad', 'kg aprox.'], ...nest.compra.map((c) => [`${profileLabel(c.profile)} barra de ${c.stock / 1000} m`, c.n, c.kg]),
    ...Object.values(plates.hojas.reduce((o, h) => { const k = h.t; o[k] = o[k] || [`Lámina ${h.t} mm de ${h.w}x${h.h}`, 0, 0]; o[k][1]++; o[k][2] += Math.round(h.w * h.h * h.t * 7.85e-6); return o; }, {}))]);
}

// ---------------------------------------------------------------------------------------------------
// ZIP sin compresión (método 0). Recibe [{ name, data: string | Uint8Array }] y devuelve Uint8Array.
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (u8) => { let c = 0xffffffff; for (let i = 0; i < u8.length; i++) c = CRC[(c ^ u8[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
export function zip(files) {
  const enc = new TextEncoder(), parts = [], central = [];
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name), data = typeof f.data === 'string' ? enc.encode(f.data) : f.data, crc = crc32(data);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
    h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true);
    parts.push(new Uint8Array(h.buffer), name, data);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true);
    c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
    central.push(new Uint8Array(c.buffer), name);
    offset += 30 + name.length + data.length;
  }
  const size = central.reduce((s, p) => s + p.length, 0);
  const e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, size, true); e.setUint32(16, offset, true);
  const all = [...parts, ...central, new Uint8Array(e.buffer)], out = new Uint8Array(all.reduce((s, p) => s + p.length, 0));
  let o = 0;
  for (const p of all) { out.set(p, o); o += p.length; }
  return out;
}
