// Pruebas del módulo de fabricación: node fabrica/test.mjs
import assert from 'node:assert/strict';
import { steelBuilding, PROFILES } from '../studio/js/steel.js';
import { ordenDeProduccion, archivosDeTaller } from './js/paquete.js';
import { nc1, zip } from './js/cnc.js';
import { MAX_BAR } from './js/despiece.js';

for (const tipo of ['edificio', 'nave', 'casa', 'pabellon']) {
  const op = ordenDeProduccion(steelBuilding({ tipo }), { orden: `OP-${tipo}` });
  const d = op.despiece;
  assert.ok(d.piezas.length > 20, `${tipo}: hay piezas`);
  assert.equal(new Set(d.piezas.map((p) => p.id)).size, d.piezas.length, `${tipo}: series únicas`);

  // Agujeros dentro de la pieza y de la cara; nada pasa de la barra comercial.
  for (const m of d.marcas) {
    const P = PROFILES[m.profile];
    assert.ok(m.length > 0 && m.length <= MAX_BAR, `${m.mark}: largo ${m.length}`);
    for (const h of m.holes) {
      assert.ok(h.x > 0 && h.x < m.length, `${tipo} ${m.mark}: agujero x=${h.x} fuera de ${m.length}`);
      const faceW = h.face === 'v' ? P.h * 1000 : P.b * 1000;
      assert.ok(h.y > 0 && h.y < faceW, `${tipo} ${m.mark}: agujero y=${h.y} fuera de la cara ${h.face} (${faceW})`);
    }
    assert.equal(m.units.length, m.qty);
  }
  for (const p of d.placas) for (const h of p.holes) assert.ok(h.x > h.d / 2 && h.x < p.w - h.d / 2 && h.y > h.d / 2 && h.y < p.h - h.d / 2, `${p.mark}: agujero fuera de la placa`);

  // Nesting de barras: cada pieza una sola vez y nada se pasa del largo comercial.
  const cortadas = op.barras.barras.flatMap((b) => b.cuts.map((c) => c.id));
  assert.deepEqual([...cortadas].sort(), d.piezas.map((p) => p.id).sort(), `${tipo}: todas las piezas se cortan una vez`);
  for (const b of op.barras.barras) assert.ok(b.used <= b.stock, `${b.codigo}: se pasa del largo`);

  // Nesting de láminas: dentro de la hoja y sin traslapes.
  for (const h of op.laminas.hojas) {
    for (const [i, a] of h.piezas.entries()) {
      assert.ok(a.x >= 0 && a.y >= 0 && a.x + a.w <= h.w && a.y + a.h <= h.h, `${h.codigo}: ${a.id} se sale`);
      for (const b of h.piezas.slice(i + 1)) assert.ok(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y, `${h.codigo}: ${a.id} y ${b.id} se traslapan`);
    }
  }
  assert.equal(op.laminas.hojas.reduce((s, h) => s + h.piezas.length, 0), d.resumen.placas, `${tipo}: todas las placas anidadas`);

  // Plan de taller: operaciones en orden por pieza y sin choques en cada máquina.
  for (const ops of Object.values(op.sim.jobs)) for (let i = 1; i < ops.length; i++) assert.ok(ops[i].start >= ops[i - 1].end, 'ruta en orden');
  const porUnidad = {};
  for (const o of op.sim.ops) (porUnidad[o.unidad] ||= []).push(o);
  for (const [u, ops] of Object.entries(porUnidad)) { ops.sort((a, b) => a.start - b.start); for (let i = 1; i < ops.length; i++) assert.ok(ops[i].start >= ops[i - 1].end, `${u}: dos piezas a la vez`); }

  // DSTV: bloques y encabezado de 24 líneas.
  const txt = nc1(d.marcas[0], { orden: op.orden }).split('\n');
  assert.equal(txt[0], 'ST');
  assert.ok(txt.includes('EN'));
  assert.equal(txt[2].trim(), op.orden);

  const files = archivosDeTaller(op);
  const z = zip(files);
  assert.equal(new DataView(z.buffer).getUint32(z.length - 22, true), 0x06054b50, 'zip con fin de directorio');
  console.log(`${tipo.padEnd(9)} ${String(d.resumen.piezas).padStart(4)} piezas · ${String(d.resumen.marcas).padStart(3)} marcas · ${(d.resumen.kg / 1000).toFixed(1).padStart(5)} t · ${op.barras.barras.length} barras ${(op.barras.aprovechamiento * 100).toFixed(1)} % · ${files.length} archivos · Cpk ${op.sim.calidad.cpk}`);
}
console.log('listo');
