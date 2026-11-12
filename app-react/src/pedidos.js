// Simulador de compras y cola de pedidos del taller de ornamentación.
// Modelo: cada pedido necesita horas de taller (según kg) y pasa por la celda (puestos en paralelo). La cola se atiende
// por orden de llegada; el plazo prometido es fijo (días). Se mide cuántos pedidos salen tarde y cuánto backlog se acumula.
import { estimar } from './estima.js';

export const CAPACIDAD_BASE = { puestos: 8, horasDia: 9, diasSemana: 6, eficiencia: 0.8, plazoPrometido: 15 /* días hábiles */ };
export const MIX_BASE = { porton: 0.25, puerta: 0.3, ventana: 0.2, reja: 0.15, baranda: 0.1 };
const RANGOS = { porton: [[2.6, 6], [1.8, 3]], puerta: [[0.8, 1.4], [1.9, 2.6]], ventana: [[0.8, 3], [0.6, 1.8]], reja: [[0.8, 3], [0.6, 2.2]], baranda: [[1.2, 6], [0.9, 1.2]] };

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function elegir(R, mix) { const r = R(); let acc = 0; for (const [k, p] of Object.entries(mix)) { acc += p; if (r <= acc) return k; } return 'puerta'; }

/* Genera N clientes sintéticos (pedidos) distribuidos en `dias` días. */
export function generarClientes(n, { dias = 30, mix = MIX_BASE, semilla = 7, conversion = 0.45 } = {}) {
  const R = rng(semilla), lista = [];
  for (let i = 0; i < n; i++) {
    const producto = elegir(R, mix), [[a0, a1], [h0, h1]] = RANGOS[producto];
    const cfg = { producto, ancho: +(a0 + R() * (a1 - a0)).toFixed(2), alto: +(h0 + R() * (h1 - h0)).toFixed(2), tipo: 'corredizo', diseno: 'celosia' };
    const e = estimar(cfg);
    lista.push({ id: 'C' + String(i + 1).padStart(5, '0'), cliente: `Cliente ${i + 1}`, dia: Math.floor(R() * dias), producto, cfg, kg: e.kg, horas: e.horas, venta: e.venta, compra: R() < conversion });
  }
  return lista.sort((a, b) => a.dia - b.dia);
}

/* Simula la cola: devuelve pedidos con día de inicio/fin estimado, retraso y métricas por día. */
export function simularCola(clientes, cap = CAPACIDAD_BASE) {
  const t0 = performance.now();
  const horasDia = cap.puestos * cap.horasDia * cap.eficiencia; // horas de taller disponibles por día hábil
  const pedidos = clientes.filter((c) => c.compra).map((c) => ({ ...c }));
  // cola FIFO: cada pedido ocupa la planta a partir del día en que termina el anterior (modelo de un solo flujo con capacidad total)
  let libreEn = 0; // día (fraccional) en que la planta queda libre
  const porDia = [];
  for (const p of pedidos) {
    const inicio = Math.max(p.dia, libreEn), duracion = p.horas / horasDia;
    p.inicio = inicio; p.fin = inicio + duracion; libreEn = p.fin;
    p.entrega = Math.ceil(p.fin); p.plazo = p.dia + cap.plazoPrometido; p.retraso = Math.max(0, p.entrega - p.plazo); p.espera = inicio - p.dia;
    const d = p.dia; porDia[d] = porDia[d] || { dia: d, pedidos: 0, horas: 0, venta: 0 }; porDia[d].pedidos++; porDia[d].horas += p.horas; porDia[d].venta += p.venta;
  }
  const dias = Math.max(pedidos.length ? Math.ceil(libreEn) : 0, porDia.length);
  for (let d = 0; d < dias; d++) porDia[d] = porDia[d] || { dia: d, pedidos: 0, horas: 0, venta: 0 };
  // backlog por día: horas pendientes al final de cada día
  let acumuladas = 0; for (let d = 0; d < dias; d++) { acumuladas += porDia[d].horas; const hechas = Math.min(acumuladas, horasDia * (d + 1)); porDia[d].backlog = acumuladas - hechas; }
  const tarde = pedidos.filter((p) => p.retraso > 0);
  const resumen = {
    clientes: clientes.length, pedidos: pedidos.length, venta: pedidos.reduce((a, b) => a + b.venta, 0), kg: pedidos.reduce((a, b) => a + b.kg, 0), horas: pedidos.reduce((a, b) => a + b.horas, 0),
    horasDia, diasParaTerminar: Math.ceil(libreEn), tarde: tarde.length, retrasoMax: pedidos.reduce((a, p) => Math.max(a, p.retraso), 0) /* sin spread: con cientos de miles de pedidos el spread rompe la pila */, esperaMedia: pedidos.length ? pedidos.reduce((a, b) => a + b.espera, 0) / pedidos.length : 0,
    ocupacion: dias ? Math.min(1, pedidos.reduce((a, b) => a + b.horas, 0) / (horasDia * dias)) : 0, ms: performance.now() - t0,
    puntoDeQuiebre: null,
  };
  // ¿dónde se rompe? primer pedido que sale tarde
  const primero = tarde[0]; if (primero) resumen.puntoDeQuiebre = { pedido: primero.id, dia: primero.dia, posicion: pedidos.indexOf(primero) + 1 };
  return { pedidos, porDia, resumen };
}

/* Prueba de carga: corre la simulación con tamaños crecientes y reporta tiempos y dónde empieza a fallar. */
export function pruebaDeCarga(tamanos = [100, 500, 1000, 5000, 20000], opciones = {}) {
  const filas = [];
  for (const n of tamanos) {
    const t0 = performance.now(); const cl = generarClientes(n, opciones); const tGen = performance.now() - t0;
    const { resumen } = simularCola(cl, opciones.capacidad || CAPACIDAD_BASE);
    const mem = globalThis.process?.memoryUsage?.().heapUsed;
    filas.push({ n, pedidos: resumen.pedidos, msGenerar: +tGen.toFixed(1), msSimular: +resumen.ms.toFixed(1), tarde: resumen.tarde, porcTarde: resumen.pedidos ? +(resumen.tarde / resumen.pedidos * 100).toFixed(1) : 0, diasParaTerminar: resumen.diasParaTerminar, retrasoMax: resumen.retrasoMax, quiebre: resumen.puntoDeQuiebre, heapMB: mem ? +(mem / 1048576).toFixed(1) : null });
  }
  return filas;
}
