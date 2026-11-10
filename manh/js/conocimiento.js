// Núcleo puro de ManH: elegir la siguiente pregunta, buscar en lo que contó el Maestro
// y exportar el conocimiento. Sin DOM ni almacenamiento, para poder probarlo en Node.
import { TEMAS, PREGUNTAS, temaPorId } from './preguntas.js';

export const TIPOS = {
  regla: 'Regla del oficio',
  dato: 'Dato o medida',
  advertencia: 'Advertencia',
  historia: 'Historia',
  truco: 'Truco',
};

// ---------- siguiente pregunta ----------
// Primero las que pidió el equipo (las urgentes antes), luego el banco en orden de temas.
export function siguientePregunta(respuestas, pendientes = [], saltadas = [], temaElegido = null) {
  const hechas = new Set(respuestas.map(r => r.preguntaId));
  const fuera = new Set(saltadas);
  const libres = q => !hechas.has(q.id) && !fuera.has(q.id) && (!temaElegido || q.tema === temaElegido);
  const delEquipo = pendientes.filter(libres).sort((a, b) => (b.urgente ? 1 : 0) - (a.urgente ? 1 : 0) || a.fecha - b.fecha);
  if (delEquipo.length) return delEquipo[0];
  return PREGUNTAS.find(libres) || null;
}

export function cobertura(respuestas, pendientes = []) {
  return TEMAS.map(t => {
    const total = PREGUNTAS.filter(q => q.tema === t.id).length + pendientes.filter(q => q.tema === t.id).length;
    const ids = new Set(respuestas.filter(r => r.tema === t.id).map(r => r.preguntaId));
    return { ...t, total, respondidas: ids.size, avance: total ? Math.min(1, ids.size / total) : 0 };
  });
}

// ---------- búsqueda ----------
const VACIAS = new Set(('a al algo algun alguna alguno ante antes aqui asi cada como con cual cuales cuando de del desde donde dos el ella ellos en entre era es esa ese eso esta este esto fue ha hace hay la las le les lo los mas me mi mucho muy nada ni no nos o otra otro para pero poco por porque que se ser si sin sobre solo son su sus tambien tan tanto te tiene todo toda todos tu un una uno unos y ya yo usted ustedes debo debe deben puedo puede hago hacer hacerlo como cuanto cuanta cuantos cuantas mejor bien manh maestro abuelo').split(' '));

export function normalizar(t) {
  return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ\s]/g, ' ');
}

// Raíz sencilla en español: quita plurales y terminaciones comunes para que "soldaduras" encuentre "soldar".
export function raiz(p) {
  let w = p;
  for (const suf of ['amientos', 'imientos', 'amiento', 'imiento', 'aciones', 'adoras', 'adores', 'ación', 'acion', 'adora', 'ador', 'aduras', 'adura', 'ando', 'iendo', 'ados', 'adas', 'idos', 'idas', 'ado', 'ada', 'ido', 'ida', 'ar', 'er', 'ir', 'es', 's', 'a', 'o', 'e']) {
    if (w.length - suf.length >= 4 && w.endsWith(suf)) { w = w.slice(0, -suf.length); break; }
  }
  return w;
}

export function terminos(t) {
  return normalizar(t).split(/\s+/).filter(w => w && (w.length > 2 || /\d/.test(w)) && !VACIAS.has(w)).map(raiz);
}

function textoDe(r) { return [r.pregunta, r.texto, r.resumen, (r.etiquetas || []).join(' '), temaPorId(r.tema).nombre].join(' '); }

// BM25 sobre las respuestas del Maestro. Devuelve las mejores con su puntaje.
export function buscar(consulta, respuestas, n = 3) {
  const q = [...new Set(terminos(consulta))];
  if (!q.length || !respuestas.length) return [];
  const docs = respuestas.map(r => ({ r, t: terminos(textoDe(r)) }));
  const prom = docs.reduce((s, d) => s + d.t.length, 0) / docs.length || 1;
  const df = Object.fromEntries(q.map(w => [w, docs.filter(d => d.t.includes(w)).length]));
  const k1 = 1.4, b = 0.7, N = docs.length;
  return docs.map(({ r, t }) => {
    let s = 0;
    for (const w of q) {
      const f = t.filter(x => x === w).length;
      if (!f) continue;
      const idf = Math.log(1 + (N - df[w] + 0.5) / (df[w] + 0.5));
      s += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * t.length / prom));
    }
    if (r.tipo === 'regla' || r.tipo === 'advertencia') s *= 1.15; // lo revisado y clasificado pesa más
    if (r.estado === 'revisada') s *= 1.1;
    return { r, s };
  }).filter(x => x.s > 0.35).sort((a, b) => b.s - a.s).slice(0, n);
}

// Respuesta de ManH sin IA externa: cita al Maestro con sus propias palabras.
export function responderLocal(consulta, respuestas, nombreMaestro = 'el Maestro') {
  const hall = buscar(consulta, respuestas, 3);
  if (!hall.length) {
    return { sabe: false, texto: `Todavía no sé eso. No está en lo que me ha contado ${nombreMaestro}. ¿Se lo pregunto en la próxima conversación?`, fuentes: [] };
  }
  const [mejor] = hall;
  const frase = recortar(mejor.r.resumen || mejor.r.texto, 420);
  return {
    sabe: true,
    texto: `Esto me enseñó ${nombreMaestro} cuando le preguntamos «${mejor.r.pregunta}»: ${frase}`,
    fuentes: hall.map(h => h.r),
  };
}

export function recortar(t, n) {
  t = String(t || '').trim();
  if (t.length <= n) return t;
  const corte = t.slice(0, n);
  const fin = Math.max(corte.lastIndexOf('. '), corte.lastIndexOf('; '));
  return (fin > n * 0.5 ? corte.slice(0, fin + 1) : corte.replace(/\s+\S*$/, '') + '…');
}

// ---------- exportación ----------
const fechaCorta = ms => new Date(ms).toISOString().slice(0, 10);

// Manual del Maestro en Markdown: es el archivo de conocimiento que se le da a ManH (y a cualquier persona).
export function manualMarkdown(respuestas, nombreMaestro = 'el Maestro') {
  const lineas = [
    `# Manual del Maestro · conocimiento de ${nombreMaestro} para ManH`,
    '',
    `Generado el ${fechaCorta(Date.now())} con ${respuestas.length} respuestas. Cada entrada es lo que dijo ${nombreMaestro}, con sus palabras.`,
    'Las marcadas como Regla o Advertencia ya fueron revisadas por el equipo.',
    '',
  ];
  for (const t of TEMAS) {
    const del = respuestas.filter(r => r.tema === t.id).sort((a, b) => a.fecha - b.fecha);
    if (!del.length) continue;
    lineas.push(`## ${t.nombre}`, '');
    for (const r of del) {
      const tipo = r.tipo ? ` · ${TIPOS[r.tipo]}` : '';
      lineas.push(`### ${r.pregunta}`, '', `_${fechaCorta(r.fecha)}${tipo}${r.estado === 'revisada' ? ' · revisada' : ''}_`, '');
      if (r.resumen) lineas.push(`**En corto:** ${r.resumen}`, '');
      lineas.push(...String(r.texto || '(solo audio, falta transcribir)').split('\n').map(l => `> ${l}`), '');
      if ((r.etiquetas || []).length) lineas.push(`Etiquetas: ${r.etiquetas.join(', ')}`, '');
    }
  }
  return lineas.join('\n');
}

// Paquete JSON: la base de conocimiento de ManH. Los audios y fotos van aparte (opcionales).
export function paquete(respuestas, pendientes, ajustes, adjuntos = null) {
  return {
    formato: 'acerostudio.manh/1',
    exportado: new Date().toISOString(),
    maestro: ajustes?.nombre || '',
    respuestas: respuestas.map(({ audio, fotos, ...r }) => ({ ...r, audio: audio || null, fotos: fotos || [] })),
    pendientes,
    adjuntos, // { id: dataURL } si se pidió con audios y fotos
  };
}

// Une un paquete importado con lo que ya hay (por id; gana la versión editada más reciente).
export function unir(actuales, entrantes) {
  const m = new Map(actuales.map(r => [r.id, r]));
  let nuevas = 0, actualizadas = 0;
  for (const r of entrantes || []) {
    const ya = m.get(r.id);
    if (!ya) { m.set(r.id, r); nuevas++; }
    else if ((r.editada || r.fecha) > (ya.editada || ya.fecha)) { m.set(r.id, r); actualizadas++; }
  }
  return { lista: [...m.values()], nuevas, actualizadas };
}
