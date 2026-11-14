// Pruebas de Muebles: node muebles/test.mjs
import assert from 'node:assert/strict';
import { PRODUCTOS, CAFETERIA, construir, despiece, costo, caja, desarrollo, dxfHoja, dxfPieza, csvMuebles, paramsIniciales } from './js/kit.js';
import { nestBars, nestPlates } from '../fabrica/js/nesting.js';
import { csvCorte, zip } from '../fabrica/js/cnc.js';

for (const id of Object.keys(PRODUCTOS)) {
  const m = construir(id, {}, { perforado: 'puntos' });
  assert.ok(m.comps.length >= 4, `${id}: componentes`);
  for (const c of m.comps) assert.ok(c.paso >= 1, `${id}: ${c.id} sin paso`);
  for (const h of m.herr) assert.ok(h.paso >= 1, `${id}: herraje sin paso`);
  const cj = caja(m);
  assert.ok(cj.h < 320 && cj.l < 1900, `${id}: caja plana ${JSON.stringify(cj)}`);
  for (const c of m.comps) for (const p of c.partes) if (p.t !== 'tubo') {
    const d = desarrollo(p);
    for (const h of d.holes) assert.ok(h.x > 0 && h.x < d.w && h.y > 0 && h.y < d.h, `${id} ${p.nombre}: agujero fuera`);
  }
  console.log(id.padEnd(9), m.comps.length, 'componentes,', m.pasos.length, 'pasos,', m.herr.length, 'herrajes, caja', cj);
}
const pedido = CAFETERIA.map((l) => ({ ...l, cfg: { perforado: 'puntos' } }));
const d = despiece(pedido);
const B = nestBars(d, { stock: [6000] }), P = nestPlates(d, { sheet: { w: 2440, h: 1220 } });
assert.equal(B.cortes, d.marcas.reduce((s, m) => s + m.qty, 0));
const cs = costo(d, B, P);
assert.ok(cs.costo > 0 && cs.venta > cs.costo);
assert.ok(d.resumen.compartidas.length >= 2, 'piezas compartidas entre muebles');
const files = [{ name: 'corte.csv', data: csvCorte(B) }, { name: 'piezas.csv', data: csvMuebles(d) }, ...P.hojas.map((h) => ({ name: `${h.codigo}.dxf`, data: dxfHoja(h, d.placas) })), ...d.placas.map((p) => ({ name: `${p.mark}.dxf`, data: dxfPieza(p) }))];
assert.ok(zip(files).length > 1000);
console.log('Cafetería:', d.resumen, '\nbarras', B.barras.length, 'aprov', B.aprovechamiento.toFixed(3), 'hojas', P.hojas.length, P.aprovechamiento.toFixed(3), '\ncosto', cs.costo, 'venta', cs.venta);
console.log(d.marcas.map((m) => `${m.mark} ${m.nombre} ${m.length}×${m.qty} ${m.en}`).join('\n'));
console.log(d.placas.map((m) => `${m.mark} ${m.nombre} ${m.w}×${m.h}×${m.t} ×${m.qty} ${m.en}`).join('\n'));
console.log('ok');
