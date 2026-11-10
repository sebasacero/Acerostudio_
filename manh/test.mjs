// Pruebas del núcleo de ManH:  node manh/test.mjs
import assert from 'node:assert/strict';
import { TEMAS, PREGUNTAS } from './js/preguntas.js';
import { siguientePregunta, cobertura, buscar, responderLocal, manualMarkdown, paquete, unir, terminos } from './js/conocimiento.js';

const r = (id, tema, pregunta, texto, extra = {}) => ({ id, preguntaId: id, tema, pregunta, texto, fecha: 1, estado: 'borrador', ...extra });
const base = [
  r('q030', 'soldadura', '¿Qué electrodo usa?', 'Para lámina delgada uso electrodo 6013 de 3/32 a unos 70 amperios. Para estructura, 7018 bien seco.'),
  r('q036', 'acabado', '¿Cómo prepara el acero antes de pintar?', 'Se esmerila, se limpia con thinner y se aplica anticorrosivo el mismo día, si no se oxida.'),
  r('q049', 'seguridad', '¿Qué nunca se debe hacer?', 'Nunca soldar cerca de canecas con combustible ni sin careta.', { tipo: 'advertencia' }),
];

// banco de preguntas
assert.ok(PREGUNTAS.length >= 60, 'banco con suficientes preguntas');
assert.equal(new Set(PREGUNTAS.map(q => q.id)).size, PREGUNTAS.length, 'ids únicos');
for (const q of PREGUNTAS) assert.ok(TEMAS.some(t => t.id === q.tema), `tema válido ${q.tema}`);
for (const t of TEMAS) assert.ok(PREGUNTAS.some(q => q.tema === t.id), `tema con preguntas ${t.id}`);

// siguiente pregunta: primero las del equipo, urgentes antes
const pend = [{ id: 'p1', tema: 'taller', texto: 'normal', fecha: 1 }, { id: 'p2', tema: 'taller', texto: 'urgente', fecha: 2, urgente: true }];
assert.equal(siguientePregunta([], pend).id, 'p2');
assert.equal(siguientePregunta([], []).id, 'q001');
assert.equal(siguientePregunta([r('q001', 'inicio', '', '')], [], ['q002']).id, 'q001b'); // la segunda mitad de una pregunta doble sale justo después
assert.equal(siguientePregunta([r('q001', 'inicio', '', ''), r('q001b', 'inicio', '', '')], [], ['q002']).id, 'q003');
assert.equal(siguientePregunta([], [], [], 'soldadura').tema, 'soldadura');

// cobertura
const cob = cobertura(base);
assert.equal(cob.find(t => t.id === 'soldadura').respondidas, 1);

// raíces: soldaduras ~ soldar ~ soldadura
assert.deepEqual(terminos('soldaduras'), terminos('soldar'));

// búsqueda
assert.equal(buscar('¿qué electrodo para lámina?', base)[0].r.id, 'q030');
assert.equal(buscar('cómo pinto para que no se oxide', base)[0].r.id, 'q036');
assert.equal(buscar('es peligroso soldar con careta', base)[0].r.id, 'q049');
assert.equal(buscar('cuánto cobro por kilo', base).length, 0);

const si = responderLocal('amperios para soldar lámina', base, 'don Hernando');
assert.ok(si.sabe && si.texto.includes('don Hernando') && si.texto.includes('6013'));
const no = responderLocal('cómo cotizo una escalera', base);
assert.equal(no.sabe, false);

// exportación
const md = manualMarkdown(base, 'don Hernando');
assert.ok(md.includes('## Soldadura') && md.includes('> Para lámina delgada'));
const p = paquete(base, pend, { nombre: 'don Hernando' });
assert.equal(p.formato, 'acerostudio.manh/1');
assert.equal(p.respuestas.length, 3);

// unir: gana la edición más reciente
const editada = { ...base[0], texto: 'corregido', editada: 5 };
const u = unir(base, [editada, r('q099', 'taller', 'x', 'y')]);
assert.equal(u.nuevas, 1); assert.equal(u.actualizadas, 1);
assert.equal(u.lista.find(x => x.id === 'q030').texto, 'corregido');

console.log(`ManH: ${PREGUNTAS.length} preguntas en ${TEMAS.length} temas · pruebas OK`);

// ---------- base técnica y agente ----------
const { cotizarLaser, anguloCorte, dondeSoldar, fileteMinimo } = await import('./js/oficio.js');
const { enrutar, responder, HERRAMIENTAS } = await import('./js/agente.js');

// láser: 1 m en 2 mm a 10 m/min = 6 s + 1 perforación (0,4 + 1,5 s) = 7,9 s → $592 a $75/s; aplica el mínimo
const c1 = cotizarLaser({ espesorMm: 2, metrosCorte: 1, perforaciones: 1 });
assert.equal(c1.segPieza, 7.9); assert.ok(c1.aplicoMinimo); assert.equal(c1.costo, 30000);
const c2 = cotizarLaser({ espesorMm: 6, metrosCorte: 4, perforaciones: 10, piezas: 50, alistamiento: 0, minimo: 0 });
assert.ok(c2.costoMaquina > 0 && c2.venta > c2.costo);
assert.ok(cotizarLaser({ espesorMm: 6, metrosCorte: 1 }).segPieza > cotizarLaser({ espesorMm: 1.5, metrosCorte: 1 }).segPieza, 'más grueso, más lento');

// ángulos
assert.equal(anguloCorte({ anguloEntre: 90 }).sierra, 45);
assert.equal(anguloCorte({ lados: 6 }).sierra, 30);
assert.equal(anguloCorte({ lados: 8 }).sierra, 22.5);
assert.equal(anguloCorte({ anguloEntre: 90, perfilMm: 40 }).largoExtraMm, 40);

// soldadura
assert.equal(fileteMinimo(4), 3); assert.equal(fileteMinimo(10), 5);
assert.ok(dondeSoldar({ trabajo: 'viga' }).reglas.some(x => /apoyos/.test(x)));

// enrutador
assert.equal(enrutar('¿Cuánto cuesta cortar con láser 3 m en lámina de 2 mm con 12 perforaciones?').herramienta, 'cotizar_corte_laser');
assert.deepEqual(enrutar('cuanto cobran por cortar con laser 3 m calibre 14 con 12 perforaciones').args.espesorMm, 1.9);
assert.equal(enrutar('¿A qué ángulo corto un marco hexagonal?').args.lados, 6);
assert.equal(enrutar('¿Dónde soldar el empalme de una viga?').args.trabajo, 'viga');
assert.equal(enrutar('¿qué electrodo para lámina?').herramienta, 'buscar_conocimiento');
assert.ok(HERRAMIENTAS.every(h => h.nombre && h.parametros?.type === 'object'));
const rb = responder('¿A qué ángulo corto un marco hexagonal?', base, 'don Hernando');
assert.ok(rb.base && rb.texto.includes('30') && rb.preguntarAlMaestro);
const rm = responder('¿Dónde soldar con electrodo la lámina?', base, 'don Hernando');
assert.ok(rm.aviso.includes('don Hernando dijo'), 'cita al Maestro cuando sabe algo del tema');

console.log('ManH: base técnica y agente · pruebas OK');
