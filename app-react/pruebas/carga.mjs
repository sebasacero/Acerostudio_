// Prueba de carga del simulador de pedidos (sin navegador): node pruebas/carga.mjs [n1,n2,...]
// Mide tiempo y memoria al generar N clientes y simular la cola, y reporta dónde se rompe el plazo del taller.
import { pruebaDeCarga, CAPACIDAD_BASE } from '../src/pedidos.js';
const tam = process.argv[2] ? process.argv[2].split(',').map(Number) : [100, 1000, 10000, 100000, 1000000];
console.log(`capacidad: ${CAPACIDAD_BASE.puestos} puestos × ${CAPACIDAD_BASE.horasDia} h × ${CAPACIDAD_BASE.eficiencia} = ${CAPACIDAD_BASE.puestos * CAPACIDAD_BASE.horasDia * CAPACIDAD_BASE.eficiencia} h/día · plazo ${CAPACIDAD_BASE.plazoPrometido} días`);
console.log('clientes\tpedidos\tgenerar\tsimular\ttarde\tdías\theap MB\tse rompe en');
for (const f of pruebaDeCarga(tam)) console.log(`${f.n}\t${f.pedidos}\t${f.msGenerar} ms\t${f.msSimular} ms\t${f.porcTarde} %\t${f.diasParaTerminar}\t${f.heapMB}\t${f.quiebre ? `pedido #${f.quiebre.posicion} (día ${f.quiebre.dia + 1})` : 'no'}`);
