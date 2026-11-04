#!/usr/bin/env node
// Agente de taller de AceroStudio. Corre en el PC del taller (Node 20+, sin dependencias) y conecta el modelo
// con las máquinas:
//
//   node agente.mjs paquete --tipo edificio --pisos 6 --salida ./ordenes
//   node agente.mjs paquete --proyecto mi-proyecto.acero.json --salida ./ordenes
//       Despiece, nesting, DSTV/NC1, DXF, planos, etiquetas y orden.json (lo mismo que baja la web).
//
//   node agente.mjs simular --tipo nave
//       Plan de taller: ruta de cada pieza, cola por máquina, horas máquina y control de calidad.
//
//   node agente.mjs maquina --orden ./ordenes/OP-xxxx/orden.json --maquina sierra --carpeta /red/sierra-1
//       Carpeta caliente: entrega a la máquina los programas NC1 de su cola, uno a la vez y en el orden de
//       montaje. Cuando la máquina termina, borra el programa y (si su software lo permite) deja
//       <pieza>.medida con {"desvio": mm}. El agente registra la medición, calcula la compensación para la
//       siguiente pieza y, si hay Supabase configurado (SUPABASE_URL y SUPABASE_KEY), publica el evento en
//       la tabla fab_eventos para el seguimiento en la web.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { steelBuilding, STEEL_DEFAULTS } from '../../studio/js/steel.js';
import { ordenDeProduccion, archivosDeTaller } from '../js/paquete.js';
import { zip, nc1, nc1Plate } from '../js/cnc.js';
import { ruta, hms, MAQ } from '../js/planta.js';

const args = process.argv.slice(2);
const cmd = args[0];
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i < 0 ? d : args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true; };

function cargarModelo() {
  if (opt('proyecto')) return JSON.parse(readFileSync(resolve(opt('proyecto')), 'utf8'));
  const p = { tipo: opt('tipo', 'edificio') };
  for (const k of Object.keys(STEEL_DEFAULTS)) if (opt(k) !== undefined && k !== 'tipo') p[k] = isNaN(+opt(k)) ? opt(k) : +opt(k);
  if (opt('pisos')) p.floors = +opt('pisos');
  return steelBuilding(p);
}

async function publicar(evento) {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_KEY;
  if (!url || !key) return;
  try {
    await fetch(`${url}/rest/v1/fab_eventos`, { method: 'POST', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(evento) });
  } catch (e) { console.warn('  (sin conexión con Supabase, el evento queda en el registro local)', e.message); }
}

if (cmd === 'paquete') {
  const doc = cargarModelo();
  const op = ordenDeProduccion(doc, { orden: opt('orden') });
  const files = archivosDeTaller(op);
  const out = resolve(opt('salida', './ordenes'));
  if (opt('zip')) {
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, `${op.orden}.zip`), zip(files));
  } else {
    for (const f of files) { const p = join(out, f.name); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, f.data); }
  }
  const r = op.despiece.resumen;
  console.log(`${op.orden} · ${op.proyecto}`);
  console.log(`  ${r.piezas} piezas (${r.marcas} marcas) · ${r.placas} placas · ${(r.kg / 1000).toFixed(1)} t · ${r.agujeros} agujeros`);
  console.log(`  ${op.barras.barras.length} barras, aprovechamiento ${(op.barras.aprovechamiento * 100).toFixed(1)} % · ${op.laminas.hojas.length} láminas`);
  console.log(`  ${files.length} archivos en ${out}${opt('zip') ? ` (${op.orden}.zip)` : `/${op.orden}`}`);
} else if (cmd === 'simular') {
  const op = ordenDeProduccion(cargarModelo());
  const s = op.sim;
  console.log(`${op.proyecto}: ${op.despiece.resumen.piezas} piezas · taller listo en ${hms(s.makespan)} · ${s.horasMaquina.toFixed(1)} h máquina · cuello: ${MAQ[s.cuello].nombre}`);
  for (const m of s.maquinas) console.log(`  ${m.nombre.padEnd(28)} ${m.unidades.map((u) => `${String(Math.round(u.uso * 100)).padStart(3)} %`).join(' ')}  ${hms(m.ocupado)}`);
  console.log(`  calidad: ${s.calidad.mediciones} mediciones, ${s.calidad.ajustes} autocorrecciones, ${s.calidad.recortes} retrabajos, ${s.calidad.rechazos} reposiciones, Cpk ${s.calidad.cpk}`);
  for (const e of s.eventos.filter((e) => e.tipo !== 'medicion').slice(0, Number(opt('eventos', 12)))) console.log(`  ${hms(e.t).padStart(14)}  ${e.maq.padEnd(10)} ${e.pieza.padEnd(16)} ${e.msg}`);
} else if (cmd === 'maquina') {
  const orden = JSON.parse(readFileSync(resolve(opt('orden')), 'utf8'));
  const maquina = opt('maquina', 'sierra'), carpeta = resolve(opt('carpeta', `./maquina-${maquina}`)), cada = Number(opt('cada', 2)) * 1000;
  mkdirSync(carpeta, { recursive: true });
  const marks = Object.fromEntries(orden.marcas.map((m) => [m.mark, m]));
  const cola = maquina === 'plasma'
    ? orden.placas.map((p) => ({ id: p.mark, programa: `${p.mark}.nc1`, data: nc1Plate(p, orden) }))
    : orden.piezas.filter((pz) => ruta(marks[pz.mark]).includes(maquina)).sort((a, b) => a.seq - b.seq).map((pz) => ({ id: pz.id, programa: `${pz.id}.nc1`, data: nc1({ ...marks[pz.mark], qty: 1 }, orden) }));
  let i = 0, compensacion = 0;
  console.log(`Agente ${MAQ[maquina]?.nombre || maquina}: ${cola.length} programas en cola → ${carpeta}`);
  const tick = async () => {
    const pendientes = readdirSync(carpeta).filter((f) => f.endsWith('.nc1'));
    for (const f of readdirSync(carpeta).filter((f) => f.endsWith('.medida'))) {
      const id = f.replace(/\.medida$/, ''), { desvio = 0 } = JSON.parse(readFileSync(join(carpeta, f), 'utf8'));
      const tol = MAQ[maquina]?.tol || 2;
      const tipo = Math.abs(desvio) > tol ? 'rechazo' : 'medicion';
      if (Math.abs(desvio) > tol * 0.35) compensacion -= desvio * 0.85;
      const ev = { orden: orden.orden, pieza: id, maquina, tipo, desvio, compensacion: +compensacion.toFixed(2), t: new Date().toISOString() };
      console.log(`  ${id}: ${desvio >= 0 ? '+' : ''}${desvio} mm ${tipo === 'rechazo' ? '→ fuera de tolerancia, reponer' : 'ok'} · compensación ${ev.compensacion} mm`);
      writeFileSync(join(carpeta, 'compensacion.json'), JSON.stringify({ maquina, mm: ev.compensacion }));
      await publicar(ev);
      unlinkSync(join(carpeta, f));
    }
    if (!pendientes.length && i < cola.length) {
      const job = cola[i++];
      writeFileSync(join(carpeta, job.programa), job.data);
      console.log(`→ ${job.programa} (${i}/${cola.length})`);
      await publicar({ orden: orden.orden, pieza: job.id, maquina, tipo: 'inicio', t: new Date().toISOString() });
    }
    if (i >= cola.length && !pendientes.length) { console.log('Cola terminada.'); return; }
    setTimeout(tick, cada);
  };
  tick();
} else {
  console.log(readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 19).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
}
