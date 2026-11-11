// Pruebas del motor del simulador:  node soldadura/test.mjs
import assert from 'node:assert/strict';
import { crearJunta, procesoPorId, nuevaSoldadura, iniciarArco, moverArco, cortarArco, evaluar, proyectar, puntoEn, arcoDesdePresion, inclinacion, JUNTAS } from './js/motor.js';

// Simula un cordón: recorre la junta a "factor" veces la velocidad ideal, con temblor lateral opcional.
function correr({ junta = 'tope', proceso = 'e6013', amp, factor = 1, desvio = 0, temblor = 0, lapiz = null, hasta = 1, semilla = 3 } = {}) {
  const J = crearJunta(junta), P = procesoPorId(proceso);
  amp ??= P.ampIdeal;
  const st = nuevaSoldadura(J, P, amp, semilla);
  const vi = P.vel * (amp / P.ampIdeal), v = vi * factor, L = J.tray.L * hasta, dt = 1 / 120;
  let t = 0, s = 0;
  const punto = s => { const [x, y] = puntoEn(J.tray, s), pr = proyectar(J.tray, x, y); const d = desvio + temblor * Math.sin(s * 0.9); return { x: x + pr.nx * d, y: y + pr.ny * d }; };
  const extra = () => lapiz ? { presion: lapiz.presion, incl: lapiz.incl } : {};
  iniciarArco(st, { t, ...punto(0), ...extra() });
  // un instante quieto para formar el charco
  for (let i = 0; i < 30; i++) { t += dt; moverArco(st, { t, ...punto(0), ...extra() }); }
  while (s < L) { t += dt; s = Math.min(L, s + v * dt); const r = moverArco(st, { t, ...punto(s), ...extra() }); if (!st.arco) break; }
  for (let i = 0; i < 40; i++) { t += dt; moverArco(st, { t, ...punto(s), ...extra() }); }
  cortarArco(st, t);
  return evaluar(st);
}

// geometría
for (const j of JUNTAS) { const J = crearJunta(j.id); assert.ok(J.tray.L > 100, `largo ${j.id}`); }
const T = crearJunta('tope');
assert.equal(Math.round(proyectar(T.tray, 50, 58).d), 3);
assert.equal(Math.round(proyectar(T.tray, 50, 58).s), 38);
const tubo = crearJunta('tubo'), [tx, ty] = puntoEn(tubo.tray, 10), pt = proyectar(tubo.tray, tx, ty);
assert.ok(Math.abs(pt.d) < 0.05);
// en el tubo la normal apunta hacia afuera del centro
assert.ok((tx - 80) * pt.nx + (ty - 55) * pt.ny > 0, 'normal hacia afuera');

// presión → arco
const e13 = procesoPorId('e6013');
assert.ok(Math.abs(arcoDesdePresion(e13, 0.4) - 3.2) < 0.2, 'presión 0,4 ≈ arco ideal');
assert.ok(arcoDesdePresion(e13, 0.1) > 6);
// inclinación desde tiltX/Y
const inc = inclinacion({ tiltX: 15, tiltY: 0 });
assert.ok(Math.abs(inc.lean - 15) < 0.5 && inc.dx > 0.99);

// cordón ideal con el dedo: aprobado
const bien = correr();
assert.ok(bien.aprobada, `ideal aprueba (total ${bien.total})`);
assert.ok(bien.total >= 85, `ideal puntaje alto ${bien.total}`);
assert.ok(bien.cobertura > 0.97);
assert.equal(bien.conLapiz, false);
assert.equal(bien.puntos.tecnica, undefined, 'sin lápiz no se califica técnica');

// muy rápido: delgado, socavado, frío
const rapido = correr({ factor: 2.2 });
assert.ok(!rapido.aprobada && rapido.total < bien.total - 20, `rápido ${rapido.total}`);
assert.ok(rapido.defectos.some(d => d.id === 'socavado'));
assert.ok(rapido.ancho < bien.ancho);

// muy lento en tope: perforación
const lento = correr({ factor: 0.3 });
assert.ok(lento.defectos.some(d => d.id === 'perforacion'), 'lento perfora');
assert.ok(!lento.aprobada);

// desviado de la junta
const torcido = correr({ desvio: 4.5 });
assert.ok(!torcido.aprobada, `desviado ${torcido.total}`);
assert.ok(torcido.puntos.alineacion < 30);

// junta sin terminar
const corto = correr({ hasta: 0.6 });
assert.ok(corto.defectos[0].id === 'incompleto' && !corto.aprobada);

// amperaje fuera de rango
const frio = correr({ amp: 70 });
assert.ok(frio.defectos.some(d => d.id === 'frio'));
assert.ok(frio.consejos.some(c => c.includes('70 A')));

// tubo completo
assert.ok(correr({ junta: 'tubo' }).aprobada, 'tubo ideal aprueba');
// MIG ideal
assert.ok(correr({ proceso: 'mig' }).aprobada, 'MIG ideal aprueba');

// lápiz: presión y ángulo correctos (arrastre de 12° en tope, a lo largo de +x)
const lapizBien = correr({ lapiz: { presion: 0.4, incl: { dx: 1, dy: 0, lean: 12 } } });
assert.ok(lapizBien.conLapiz && lapizBien.puntos.tecnica >= 80, `técnica ${lapizBien.puntos.tecnica}`);
assert.ok(lapizBien.aprobada);
// lápiz con arco largo: porosidad y técnica baja
const arcoLargo = correr({ lapiz: { presion: 0.05, incl: { dx: 1, dy: 0, lean: 12 } } });
assert.ok(arcoLargo.defectos.some(d => d.id === 'poro'), 'arco largo da poros');
assert.ok(arcoLargo.puntos.tecnica < 40);
// lápiz apretando: el electrodo se pega y se corta el arco
const pega = correr({ lapiz: { presion: 0.97, incl: { dx: 1, dy: 0, lean: 12 } } });
assert.ok(pega.pegados >= 1 && !pega.aprobada);
// filete con 45° hacia la placa base (+y)
const fil = correr({ junta: 'filete', lapiz: { presion: 0.4, incl: { dx: Math.SQRT1_2 * 0.27, dy: 0.96, lean: 46 } } });
assert.ok(fil.puntos.tecnica >= 60, `filete técnica ${fil.puntos.tecnica}`);

console.log('soldadura: todas las pruebas pasan', { ideal: bien.total, rapido: rapido.total, lento: lento.total, lapiz: lapizBien.total });
