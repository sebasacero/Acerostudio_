// Orden de producción completa a partir de un modelo del Studio, y el paquete de taller con todos los
// archivos (lo usan la página de fábrica para bajar el .zip y el agente Node para dejarlo en la red del taller).
import { profileLabel } from '../../studio/js/steel.js';
import { despiece } from './despiece.js';
import { nestBars, nestPlates } from './nesting.js';
import { simular } from './planta.js';
import { nc1, nc1Plate, dxfPlate, dxfSheet, csvPiezas, csvCorte, csvCompra } from './cnc.js';
import { svgPieza, svgPlaca, svgEtiqueta } from './planos.js';

export const PRECIOS = { aceroKg: 1.15, placaKg: 1.3, horaMaquina: 38, pinturaM2: 6.5 }; // USD, referencia editable

export function ordenDeProduccion(doc, opts = {}) {
  const orden = opts.orden || `OP-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}`;
  const d = despiece(doc, { orden });
  const barras = nestBars(d, opts.nesting);
  const laminas = nestPlates(d, opts.laminas);
  const sim = simular(d, opts.simulacion);
  const P = { ...PRECIOS, ...(opts.precios || {}) };
  const kgCompra = barras.compra.reduce((s, c) => s + c.kg, 0);
  const costo = {
    acero: kgCompra * P.aceroKg, placas: laminas.kgLamina * P.placaKg, maquina: sim.horasMaquina * P.horaMaquina, pintura: d.resumen.pintura * P.pinturaM2,
  };
  costo.total = costo.acero + costo.placas + costo.maquina + costo.pintura;
  return { orden, proyecto: doc.name || 'Proyecto', creada: new Date().toISOString(), despiece: d, barras, laminas, sim, costo, precios: P, kgCompra };
}

export function archivosDeTaller(op, { base = 'https://www.acerostudio.com/fabrica/' } = {}) {
  const d = op.despiece, ctx = { orden: op.orden, proyecto: op.proyecto };
  const files = [];
  const add = (name, data) => files.push({ name: `${op.orden}/${name}`, data });
  add('LEEME.txt', leeme(op));
  add('orden.json', JSON.stringify({ orden: op.orden, proyecto: op.proyecto, creada: op.creada, resumen: d.resumen, marcas: d.marcas, placas: d.placas, piezas: d.piezas, barras: op.barras.barras.map(({ kgm, ...b }) => b), laminas: op.laminas.hojas, costo: op.costo }, null, 1));
  add('listas/piezas.csv', csvPiezas(d));
  add('listas/corte_barras.csv', csvCorte(op.barras));
  add('listas/compra.csv', csvCompra(op.barras, op.laminas));
  for (const m of d.marcas) {
    add(`cnc/dstv/${m.mark}.nc1`, nc1(m, ctx));
    add(`planos/${m.mark}.svg`, svgPieza(m, ctx));
  }
  for (const p of d.placas) {
    add(`cnc/dstv/${p.mark}.nc1`, nc1Plate(p, ctx));
    add(`cnc/dxf/placas/${p.mark}.dxf`, dxfPlate(p));
    add(`planos/${p.mark}.svg`, svgPlaca(p, ctx));
  }
  for (const h of op.laminas.hojas) add(`cnc/dxf/laminas/${h.codigo}_chapa${h.t}.dxf`, dxfSheet(h, d.placas));
  add('etiquetas.html', etiquetasHTML(op, base));
  return files;
}

export const urlPieza = (base, orden, id) => `${base}${base.includes('?') ? '&' : '?'}orden=${encodeURIComponent(orden)}&pieza=${encodeURIComponent(id)}`;

export function etiquetasHTML(op, base) {
  const marks = Object.fromEntries(op.despiece.marcas.map((m) => [m.mark, m]));
  const tags = op.despiece.piezas.map((pz) => `<div class="e">${svgEtiqueta(pz, marks[pz.mark], urlPieza(base, op.orden, pz.id))}</div>`).join('\n');
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Etiquetas ${op.orden}</title>
<style>@page{size:A4;margin:8mm}body{margin:0;font-family:sans-serif}.g{display:grid;grid-template-columns:repeat(2,100mm);gap:4mm}.e svg{width:100mm;height:56mm;display:block}.e{break-inside:avoid}</style>
</head><body><div class="g">${tags}</div></body></html>`;
}

function leeme(op) {
  const r = op.despiece.resumen;
  return `AceroStudio · Paquete de taller ${op.orden}
Proyecto: ${op.proyecto}
${r.piezas} piezas de perfil en ${r.marcas} marcas · ${r.placas} placas en ${r.marcasPlaca} marcas · ${(r.kg / 1000).toFixed(1)} t · ${r.agujeros} agujeros

cnc/dstv/*.nc1          Un archivo DSTV por marca para la línea de corte y taladrado (Ficep, Peddinghaus,
                        Voortman, Kaltenbach…). Las placas también van en NC1 (perfil B con contorno AK).
cnc/dxf/placas/*.dxf    Cada placa sola (contorno en capa CORTE, agujeros en AGUJEROS, marca en MARCADO).
cnc/dxf/laminas/*.dxf   Láminas de ${op.laminas.hojas[0]?.w || 3000}×${op.laminas.hojas[0]?.h || 1500} ya anidadas: van directo al plasma o láser.
listas/corte_barras.csv Qué pieza sale de qué barra comercial y en qué posición (optimizado, kerf 3 mm).
listas/compra.csv       Barras y láminas a comprar.
listas/piezas.csv       Lista de piezas y placas con pesos y pintura.
planos/*.svg            Plano de taller de cada marca y placa.
etiquetas.html          Etiquetas con QR para imprimir y pegar en cada pieza (abre la ficha y el seguimiento).
orden.json              Todo lo anterior en un archivo, para el agente de máquinas y el seguimiento.

Perfiles principales: ${op.despiece.marcas.map((m) => profileLabel(m.profile)).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
Predimensionamiento indicativo: las conexiones deben verificarse con el cálculo estructural antes de cortar.
`;
}
