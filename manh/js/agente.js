// Estructura del agente ManH: fuentes de conocimiento, herramientas y reglas de respuesta.
// Funciona sin IA (enrutador local) y está lista para un modelo con uso de herramientas:
// HERRAMIENTAS lleva el nombre, la descripción y el esquema JSON de cada una.
import { responderLocal, buscar, recortar } from './conocimiento.js';
import { cotizarLaser, anguloCorte, dondeSoldar, CALIBRES, TRABAJOS, pesos, dec, ORIGEN } from './oficio.js';

// Orden de autoridad cuando dos fuentes dicen cosas distintas.
export const FUENTES = [
  { id: 'maestro-revisado', nombre: 'Lo que dijo el Maestro, revisado por el equipo', peso: 3 },
  { id: 'maestro', nombre: 'Lo que dijo el Maestro (transcripción sin revisar)', peso: 2 },
  { id: 'base-tecnica', nombre: ORIGEN, peso: 1 },
];

export const REGLAS = [
  'Seguridad primero: si hay riesgo para una persona, eso va antes que todo.',
  'Responder con lo que enseñó el Maestro y decir de dónde sale.',
  'Si solo hay base técnica general, decirlo y proponer preguntárselo al Maestro.',
  'Nunca inventar medidas, amperajes, espesores ni precios.',
  'Hablar como el taller: directo, frases cortas, palabras del oficio.',
];

export const HERRAMIENTAS = [
  {
    nombre: 'buscar_conocimiento',
    descripcion: 'Busca en lo que el Maestro ha contado (respuestas por voz transcritas y revisadas).',
    parametros: { type: 'object', properties: { consulta: { type: 'string' } }, required: ['consulta'] },
  },
  {
    nombre: 'cotizar_corte_laser',
    descripcion: 'Calcula tiempo de máquina y precio de un corte láser en acero al carbono según espesor, metros de corte y perforaciones.',
    parametros: { type: 'object', properties: {
      espesorMm: { type: 'number' }, metrosCorte: { type: 'number' }, perforaciones: { type: 'integer' }, piezas: { type: 'integer' },
      tarifaSegundo: { type: 'number', description: 'COP por segundo de máquina' }, material: { type: 'boolean' }, areaPiezaM2: { type: 'number' },
    }, required: ['espesorMm', 'metrosCorte'] },
  },
  {
    nombre: 'angulo_de_corte',
    descripcion: 'Ángulo de sierra para cortes a inglete según el ángulo entre piezas o el número de lados de un marco.',
    parametros: { type: 'object', properties: { anguloEntre: { type: 'number' }, lados: { type: 'integer' }, perfilMm: { type: 'number' } } },
  },
  {
    nombre: 'donde_soldar',
    descripcion: 'Dónde y cómo soldar según el tipo de trabajo, con filete mínimo y electrodo por espesor.',
    parametros: { type: 'object', properties: { trabajo: { type: 'string', enum: Object.keys(TRABAJOS) }, espesorMm: { type: 'number' }, estructural: { type: 'boolean' } }, required: ['trabajo'] },
  },
  {
    nombre: 'preguntar_al_maestro',
    descripcion: 'Deja una pregunta en la lista del Maestro para su próxima conversación.',
    parametros: { type: 'object', properties: { pregunta: { type: 'string' }, tema: { type: 'string' } }, required: ['pregunta'] },
  },
];

// ---------- lectura de números en la pregunta ----------
const num = s => +String(s).replace(',', '.');
function espesorDe(t) {
  const cal = t.match(/cal(?:ibre)?\.?\s*(\d{2})/);
  if (cal && CALIBRES[cal[1]]) return CALIBRES[cal[1]];
  const mm = t.match(/(\d+(?:[.,]\d+)?)\s*mm/);
  if (mm) return num(mm[1]);
  const pulg = t.match(/(\d)\s*\/\s*(\d+)\s*(?:"|pulg)/);
  if (pulg) return +(25.4 * pulg[1] / pulg[2]).toFixed(1);
  return null;
}
const metrosDe = t => { const m = t.match(/(\d+(?:[.,]\d+)?)\s*(?:m\b|metros)/); return m ? num(m[1]) : null; };
const enteroAntes = (t, re) => { const m = t.match(new RegExp(`(\\d+)\\s*${re}`)); return m ? +m[1] : null; };

/** Decide qué herramienta usar para una pregunta escrita o hablada. */
export function enrutar(consulta) {
  const t = String(consulta).toLowerCase();
  if (/l[aá]ser/.test(t) && /(cotiz|cu[aá]nto|precio|cobr|vale|cuesta)/.test(t)) {
    return { herramienta: 'cotizar_corte_laser', args: {
      espesorMm: espesorDe(t) ?? 1.5, metrosCorte: metrosDe(t) ?? 1,
      perforaciones: enteroAntes(t, '(?:perforaciones|agujeros|huecos)') ?? 2, piezas: enteroAntes(t, '(?:piezas|unidades)') ?? 1,
    } };
  }
  if (/([aá]ngulo|inglete|grados|escuadra falsa)/.test(t) && /(cort|sierra|tronzadora|marco|esquina|inglete)/.test(t)) {
    const lados = /hex[aá]gon/.test(t) ? 6 : /oct[aá]gon/.test(t) ? 8 : /pent[aá]gon/.test(t) ? 5 : /tri[aá]ngul/.test(t) ? 3 : (enteroAntes(t, 'lados') || 0);
    const g = t.match(/(\d+(?:[.,]\d+)?)\s*(?:°|grados)/);
    return { herramienta: 'angulo_de_corte', args: { anguloEntre: g ? num(g[1]) : 90, lados, perfilMm: espesorDe(t) && espesorDe(t) > 10 ? espesorDe(t) : 40 } };
  }
  if (/(d[oó]nde|c[oó]mo|qu[eé] electrodo|amperaje).*(sold)|sold.*(d[oó]nde|empalme|uni[oó]n)/.test(t)) {
    const trabajo = /port[oó]n|puerta/.test(t) ? 'porton' : /reja|baranda/.test(t) ? 'reja' : /viga|empalm/.test(t) ? 'viga'
      : /cercha|techo|cubierta/.test(t) ? 'cercha' : /escaler/.test(t) ? 'escalera' : /l[aá]mina|forro/.test(t) ? 'lamina' : 'porton';
    return { herramienta: 'donde_soldar', args: { trabajo, espesorMm: espesorDe(t) ?? 2, estructural: /estructur|viga|cercha|columna/.test(t) } };
  }
  return { herramienta: 'buscar_conocimiento', args: { consulta } };
}

/** Ejecuta la herramienta y arma una respuesta con la voz de ManH. Lo del Maestro va primero. */
export function responder(consulta, respuestas, nombreMaestro = 'el Maestro') {
  const ruta = enrutar(consulta);
  const delMaestro = responderLocal(consulta, respuestas, nombreMaestro);
  if (ruta.herramienta === 'buscar_conocimiento') return { ...delMaestro, herramienta: ruta.herramienta };

  let texto = '', detalle = [];
  if (ruta.herramienta === 'cotizar_corte_laser') {
    const c = cotizarLaser(ruta.args), a = ruta.args;
    texto = `Corte láser de ${a.piezas} ${a.piezas === 1 ? 'pieza' : 'piezas'} en ${dec(a.espesorMm)} mm, ${dec(a.metrosCorte)} m de corte y ${a.perforaciones} perforaciones cada una: `
      + `${dec(c.minutosTotal)} min de máquina, costo ${pesos(c.costo)}${c.aplicoMinimo ? ' (aplica el mínimo)' : ''}, precio de venta ${pesos(c.venta)}.`;
    detalle = [`Velocidad usada: ${dec(c.velocidad)} m/min; perforación ${dec(c.segPerforacion)} s. Tarifa de $75 por segundo de máquina.`, ...c.consejos];
  } else if (ruta.herramienta === 'angulo_de_corte') {
    const r = anguloCorte(ruta.args);
    texto = r.nota; detalle = r.consejos;
  } else if (ruta.herramienta === 'donde_soldar') {
    const r = dondeSoldar(ruta.args);
    texto = `${r.trabajo}, ${dec(ruta.args.espesorMm)} mm: ${r.reglas[0] || ''} Filete mínimo ${r.filete} mm. ${r.electrodo}, ${r.amperios}.`;
    detalle = [...r.reglas.slice(1), ...r.generales];
  }
  const aviso = delMaestro.sabe
    ? `Además, sobre esto ${nombreMaestro} dijo: ${recortar(delMaestro.fuentes[0].resumen || delMaestro.fuentes[0].texto, 200)}`
    : `Esto es base técnica general; ${nombreMaestro} todavía no me lo ha enseñado. ¿Se lo pregunto para confirmarlo?`;
  return { sabe: true, base: true, herramienta: ruta.herramienta, texto, detalle, aviso, fuentes: delMaestro.fuentes, preguntarAlMaestro: !delMaestro.sabe };
}

export { buscar };
