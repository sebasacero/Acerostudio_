// ManH · interfaz. Tres vistas: Conversar (el Maestro responde por voz), Equipo (revisar y preguntar)
// y Preguntar a ManH (el agente responde con lo que el Maestro enseñó).
import { TEMAS, PREGUNTAS, REPREGUNTAS, temaPorId } from './preguntas.js';
import { responder as responderAgente } from './agente.js';
import { TIPOS, siguientePregunta, cobertura, responderLocal, manualMarkdown, paquete, unir, recortar } from './conocimiento.js';
import * as A from './almacen.js';
import * as N from './nube.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const estado = {
  respuestas: [], pendientes: [], saltadas: [],
  ajustes: { nombre: '', leer: true, velocidad: 0.9, ia: '', modo: 'voz', noche: false },
  actual: null, temaHoy: null, sesion: 0,
  borrador: null, // { texto, audioBlob, fotos: [Blob] }
};

// ---------- arranque ----------
async function cargar() {
  try {
    [estado.respuestas, estado.pendientes] = await Promise.all([A.todas('respuestas'), A.todas('pendientes')]);
    Object.assign(estado.ajustes, (await A.leer('ajustes', 'ajustes')) || {});
    estado.saltadas = (await A.leer('ajustes', 'saltadas')) || [];
  } catch (e) { avisar('No se pudo abrir el almacén de este navegador. Lo grabado no quedará guardado.'); }
  const qs = new URLSearchParams(location.search);
  if (qs.get('clave')) { estado.ajustes.clave = qs.get('clave'); guardarAjustes(); history.replaceState(null, '', location.pathname + (qs.get('vista') ? '?vista=' + qs.get('vista') : '')); }
  N.configurar(estado.ajustes.clave);
  aplicarAjustes();
  pintarTodo();
  sincronizarYa();
  setInterval(sincronizarYa, 60000);
  addEventListener('online', sincronizarYa);
  if (new URLSearchParams(location.search).get('vista')) mostrarVista(new URLSearchParams(location.search).get('vista'));
}
let nube = { estado: 'apagada', total: 0 };
async function sincronizarYa() {
  if (!navigator.onLine) { nube.estado = 'sin-red'; pintarNube(); return; }
  nube.estado = 'subiendo'; pintarNube();
  try { const r = await N.sincronizar(estado); nube = { estado: 'ok', total: r.total, hora: new Date() }; if (r.nuevas || r.subidas) pintarTodo(); }
  catch (e) { nube.estado = e.status === 401 ? 'clave' : 'error'; }
  pintarNube();
}
const subir = r => N.activa() && N.subirRespuesta(r).then(() => { nube.total = Math.max(nube.total, estado.respuestas.filter(x => x.nube).length); pintarNube(); }).catch(() => { nube.estado = 'error'; pintarNube(); });
function pintarNube() {
  const sinSubir = estado.respuestas.filter(r => !r.subida || r.subida < (r.editada || r.fecha)).length;
  const t = { 'sin-red': `Sin internet. ${sinSubir} por subir; se suben solas al volver la señal.`, subiendo: 'Guardando en la base de datos…', clave: 'La clave del taller no es correcta.', error: `No se pudo conectar con la base de datos. ${sinSubir} por subir; se reintenta cada minuto.`, ok: sinSubir ? `${sinSubir} por subir…` : `Todo guardado en la base de datos del taller (${nube.total} ${nube.total === 1 ? 'respuesta' : 'respuestas'}).${N.puedeLeer() ? '' : ' Para ver aquí lo que grabaron otros celulares, escriba la clave del taller.'}` }[nube.estado];
  // al Maestro solo se le dice que todo quedó guardado; los detalles son para el equipo
  const corto = { ok: sinSubir ? 'Guardando…' : 'Todo lo que ha contado está guardado.', subiendo: 'Guardando…' }[nube.estado] || 'Todo queda guardado en este celular y se sube solo cuando haya internet.';
  $$('[data-nube]').forEach(n => { n.textContent = n.closest('.maestro') ? corto : t; n.dataset.estado = nube.estado; });
}
async function cargarAudio(el) {
  const id = el.dataset.audio || el.dataset.foto;
  let b = await A.leer('archivos', id).catch(() => null);
  if (b) { el.src = URL.createObjectURL(b); return; }
  try { const u = await N.urlArchivo(id); if (u) el.src = u; } catch {}
}
const guardarAjustes = () => A.guardar('ajustes', estado.ajustes, 'ajustes').catch(() => {});
const nombre = () => estado.ajustes.nombre || 'el Maestro';
const aNombre = () => estado.ajustes.nombre ? 'a ' + estado.ajustes.nombre : 'al Maestro';

function aplicarAjustes() {
  document.body.classList.toggle('dia', !estado.ajustes.noche);
  $$('[data-nombre]').forEach(n => n.textContent = estado.ajustes.nombre || 'Maestro');
  $('#ajNombre').value = estado.ajustes.nombre;
  $('#ajLeer').checked = estado.ajustes.leer;
  $('#ajVel').value = estado.ajustes.velocidad; $('#ajVelOut').textContent = estado.ajustes.velocidad;
  $('#ajIA').value = estado.ajustes.ia;
  $('#ajClave').value = estado.ajustes.clave || '';
  $$('.modo button').forEach(b => b.setAttribute('aria-pressed', b.dataset.modo === estado.ajustes.modo));
}

// ---------- vistas ----------
function mostrarVista(v) {
  $$('.pestanas button').forEach(b => b.setAttribute('aria-selected', b.dataset.vista === v));
  $$('section.vista').forEach(s => s.hidden = s.dataset.vista !== v);
  if (v !== 'maestro') { pararVoz(); detenerGrabacion(true); }
  else if (!$('[data-paso="fin"]').hidden) paso('inicio');
  pintarTodo();
  scrollTo(0, 0);
}
$$('.pestanas button').forEach(b => b.onclick = () => mostrarVista(b.dataset.vista));
$('#tema').onclick = () => { estado.ajustes.noche = !estado.ajustes.noche; aplicarAjustes(); guardarAjustes(); };

function pintarTodo() { pintarInicio(); pintarEquipo(); pintarFichaManh(); }

// ================= CONVERSAR =================
const paso = p => { $$('.maestro .paso').forEach(s => s.hidden = s.dataset.paso !== p); scrollTo(0, 0); };

function pintarInicio() {
  const n = estado.respuestas.length;
  const temasConAlgo = new Set(estado.respuestas.map(r => r.tema)).size;
  $('#resumenInicio').textContent = n
    ? `ManH ya aprendió ${n} ${n === 1 ? 'cosa' : 'cosas'} de usted, en ${temasConAlgo} ${temasConAlgo === 1 ? 'tema' : 'temas'}. ${estado.pendientes.filter(q => !estado.respuestas.some(r => r.preguntaId === q.id)).length ? 'El equipo le dejó preguntas nuevas.' : 'Sigamos donde íbamos.'}`
    : 'Vamos a enseñarle a ManH todo lo que usted sabe del acero. Le hago una pregunta, usted me contesta hablando, como si le explicara a un aprendiz. Cada pregunta toma dos o tres minutos.';
  const cob = cobertura(estado.respuestas, estado.pendientes);
  $('#temasElegir').innerHTML = cob.map(t => `<button data-tema="${t.id}"><i>${t.icono}</i>${esc(t.nombre)}<small>${t.respondidas} de ${t.total}</small></button>`).join('');
  $$('#temasElegir button').forEach(b => b.onclick = () => { estado.temaHoy = b.dataset.tema; empezar(); });
}

$$('.modo button').forEach(b => b.onclick = () => { estado.ajustes.modo = b.dataset.modo; aplicarAjustes(); guardarAjustes(); });
$('#empezar').onclick = () => { estado.temaHoy = null; empezar(); };
$('#empezarPorton').onclick = () => { estado.temaHoy = 'porton'; empezar(); };
$('#otraVez').onclick = () => { estado.temaHoy = null; empezar(); };

function empezar() { estado.sesion = 0; preguntar(); }

function preguntar(q) {
  q = q || siguientePregunta(estado.respuestas, estado.pendientes, estado.saltadas, estado.temaHoy)
         || (estado.temaHoy && (estado.temaHoy = null, siguientePregunta(estado.respuestas, estado.pendientes, estado.saltadas)));
  if (!q) { terminar('Ya respondió todas las preguntas que tenemos. El equipo irá dejando más.'); return; }
  estado.actual = q;
  estado.borrador = { texto: '', audioBlob: null, fotos: [] };
  const t = temaPorId(q.tema);
  $('#chipTema').textContent = `${t.icono}  ${t.nombre}`;
  const hechas = estado.respuestas.length;
  $('#cuenta').textContent = `${hechas} respondidas`;
  $('#deQuien').hidden = !q.pidio; $('#deQuien').textContent = q.pidio ? `${q.pidio} le pregunta:` : '';
  $('#textoPregunta').textContent = q.texto;
  const voz = estado.ajustes.modo === 'voz';
  ponerModo(voz);
  $('#escrito').value = '';
  reiniciarMicrofono();
  paso('pregunta');
  if (estado.ajustes.leer) leerEnVoz(q.texto);
}

function ponerModo(voz) {
  $('#zonaVoz').hidden = !voz; $('#zonaTexto').hidden = voz;
  $('#cambiarModo').textContent = voz ? 'Prefiero escribir' : 'Prefiero hablar';
}
$('#cambiarModo').onclick = () => { detenerGrabacion(true); reiniciarMicrofono(); ponerModo($('#zonaVoz').hidden); };

// --- voz: leer la pregunta ---
function leerEnVoz(texto) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = 'es-CO'; u.rate = +estado.ajustes.velocidad || 0.9;
  const voces = speechSynthesis.getVoices();
  u.voice = voces.find(v => /es[-_](CO|MX|US|419)/i.test(v.lang)) || voces.find(v => /^es/i.test(v.lang)) || null;
  speechSynthesis.speak(u);
}
const pararVoz = () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); };
$('#escuchar').onclick = () => leerEnVoz(estado.actual?.texto || '');

// --- voz: grabar la respuesta (audio completo + texto en vivo) ---
const Reconocedor = window.SpeechRecognition || window.webkitSpeechRecognition;
const graba = { activo: false, rec: null, med: null, trozos: [], final: '', inicio: 0, reloj: null, flujo: null, destino: null };

function reiniciarMicrofono() {
  $('#microfono').classList.remove('grabando');
  $('#microfono').setAttribute('aria-label', 'Tocar para hablar');
  $('#indicacion').textContent = 'Toque el botón y hable con calma';
  $('#reloj').hidden = true; $('#enVivo').textContent = '';
}

async function iniciarGrabacion(destino = 'respuesta') {
  pararVoz();
  Object.assign(graba, { activo: true, trozos: [], final: '', inicio: Date.now(), destino });
  try {
    graba.flujo = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    const tipo = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'].find(t => window.MediaRecorder?.isTypeSupported?.(t)) || '';
    graba.med = new MediaRecorder(graba.flujo, tipo ? { mimeType: tipo } : undefined);
    graba.med.ondataavailable = e => e.data.size && graba.trozos.push(e.data);
    graba.med.start(1000);
    if (destino === 'respuesta') { tono(880, 0.18); navigator.vibrate?.(120); }
  } catch (e) {
    graba.med = null;
    if (!Reconocedor) { graba.activo = false; avisar('No hay permiso para usar el micrófono. Puede responder escribiendo.'); return false; }
  }
  if (Reconocedor) {
    const rec = new Reconocedor();
    rec.lang = 'es-CO'; rec.continuous = true; rec.interimResults = true;
    rec.onresult = e => {
      let prov = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) graba.final += (graba.final ? ' ' : '') + r[0].transcript.trim();
        else prov += r[0].transcript;
      }
      mostrarEnVivo(graba.final + (prov ? ' ' + prov : ''));
    };
    rec.onend = () => { if (graba.activo && graba.rec === rec) try { rec.start(); } catch {} }; // Chrome corta tras silencios
    rec.onerror = e => { if (e.error === 'not-allowed') { graba.rec = null; } };
    graba.rec = rec;
    try { rec.start(); } catch {}
  }
  graba.reloj = setInterval(() => {
    const s = Math.floor((Date.now() - graba.inicio) / 1000);
    const txt = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    if (graba.destino === 'respuesta') $('#reloj').textContent = txt;
  }, 500);
  return true;
}

// Un "bip" corto y una vibración: el Maestro sabe que ya lo estamos escuchando (antes preguntaba "¿ya le puedo hablar?").
let ctxAudio;
function tono(hz, seg) {
  try {
    ctxAudio = ctxAudio || new (window.AudioContext || window.webkitAudioContext)();
    const o = ctxAudio.createOscillator(), g = ctxAudio.createGain(), t = ctxAudio.currentTime;
    o.frequency.value = hz; o.connect(g); g.connect(ctxAudio.destination);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.3, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + seg);
    o.start(t); o.stop(t + seg + 0.02);
  } catch {}
}

function mostrarEnVivo(t) {
  if (graba.destino === 'respuesta') $('#enVivo').textContent = recortar(t, 600);
  else $('#consulta').value = t;
}

function detenerGrabacion(descartar = false) {
  if (!graba.activo) return Promise.resolve(null);
  graba.activo = false;
  clearInterval(graba.reloj);
  const rec = graba.rec; graba.rec = null;
  try { rec?.stop(); } catch {}
  return new Promise(ok => {
    const cerrar = () => {
      graba.flujo?.getTracks().forEach(t => t.stop());
      if (descartar) return ok(null);
      const audio = graba.trozos.length ? new Blob(graba.trozos, { type: graba.med?.mimeType || 'audio/webm' }) : null;
      // dar un momento al reconocedor para entregar la última frase
      setTimeout(() => ok({ audio, texto: graba.final.trim(), segundos: Math.round((Date.now() - graba.inicio) / 1000) }), 350);
    };
    if (graba.med && graba.med.state !== 'inactive') { graba.med.onstop = cerrar; graba.med.stop(); } else cerrar();
  });
}

$('#microfono').onclick = async () => {
  if (!graba.activo) {
    if (await iniciarGrabacion('respuesta')) {
      $('#microfono').classList.add('grabando');
      $('#microfono').setAttribute('aria-label', 'Tocar para terminar');
      $('#indicacion').textContent = 'Ya lo estoy escuchando. Hable tranquilo; toque otra vez cuando termine.';
      $('#reloj').hidden = false;
    }
  } else {
    $('#indicacion').textContent = 'Guardando…';
    const r = await detenerGrabacion();
    reiniciarMicrofono();
    if (!r || (!r.audio && !r.texto)) { avisar('No se escuchó nada. Intente otra vez, un poco más cerca del celular.'); return; }
    estado.borrador.audioBlob = r.audio;
    estado.borrador.texto = [estado.borrador.texto, r.texto].filter(Boolean).join('\n');
    revisar();
  }
};

$('#listoTexto').onclick = () => {
  const t = $('#escrito').value.trim();
  if (!t) { avisar('Escriba algo antes de guardar, o toque «Esta no la sé».'); return; }
  estado.borrador.texto = t; revisar();
};

function revisar() {
  const b = estado.borrador;
  $('#revPregunta').textContent = estado.actual.texto;
  $('#revTexto').value = b.texto;
  const a = $('#revAudio');
  if (b.audioBlob) { a.src = URL.createObjectURL(b.audioBlob); a.hidden = false; } else { a.removeAttribute('src'); a.hidden = true; }
  $('#revNota').textContent = b.audioBlob && !b.texto
    ? 'Su voz quedó grabada. Este celular no pasó la voz a texto; el equipo la transcribe después, no se preocupe.'
    : b.audioBlob ? 'Su voz quedó grabada completa. Si el texto tiene errores no importa: el equipo lo corrige escuchando el audio.' : '';
  pintarFotos();
  paso('revisar');
}
function pintarFotos() { $('#revFotos').innerHTML = estado.borrador.fotos.map(f => `<img src="${URL.createObjectURL(f)}" alt="Foto de la respuesta">`).join(''); }
$('#foto').onchange = e => { const f = e.target.files?.[0]; if (f) { estado.borrador.fotos.push(f); pintarFotos(); } e.target.value = ''; };
$('#regrabar').onclick = () => { estado.borrador = { texto: '', audioBlob: null, fotos: [] }; reiniciarMicrofono(); paso('pregunta'); };

$('#guardar').onclick = async () => {
  const b = estado.borrador, q = estado.actual;
  const r = {
    id: A.id('r'), preguntaId: q.id, tema: q.tema, pregunta: q.texto, padre: q.padre || null, pidio: q.pidio || null,
    texto: $('#revTexto').value.trim(), resumen: '', tipo: null, etiquetas: [], estado: 'borrador',
    autor: nombre(), fecha: Date.now(), audio: null, fotos: [],
  };
  try {
    if (b.audioBlob) { r.audio = A.id('a'); await A.guardar('archivos', b.audioBlob, r.audio); }
    for (const f of b.fotos) { const fid = A.id('f'); await A.guardar('archivos', f, fid); r.fotos.push(fid); }
    await A.guardar('respuestas', r);
  } catch (e) { avisar('No se pudo guardar en este dispositivo.'); }
  estado.respuestas.push(r);
  subir(r);
  estado.sesion++;
  // repregunta: una de la lista, distinta cada vez; no se repregunta una repregunta
  if (!q.padre) {
    const rp = elegirRepregunta(q);
    estado.repregunta = { id: `${q.id}~${rp.slice(1, 12)}`, tema: q.tema, texto: `Siga contando. ${rp}`, padre: q.id, contexto: q.texto, pista: rp };
    $('#textoRepregunta').textContent = rp;
    paso('repregunta');
    if (estado.ajustes.leer) leerEnVoz('Guardado. ¿Quiere seguir contando sobre esto? Si quiere, cuéntenos también: ' + rp);
  } else seguir();
};

// Repregunta que no se repita: cada una se usa una vez antes de volver a salir, "¿qué haría distinto
// con las máquinas nuevas?" solo una vez en total (ya la contestó), y según el tema se prefiere la que más enseña.
const PREFERIDA = { inicio: 2, costos: 3, material: 3, planos: 3, trazo: 3, doblez: 3, soldadura: 1, seguridad: 1, calidad: 1, acabado: 0, porton: 2, proyectos: 3 };
function elegirRepregunta(q) {
  const usos = REPREGUNTAS.map(rp => estado.respuestas.filter(r => r.preguntaId?.includes(`~${rp.slice(1, 12)}`)).length);
  const posibles = REPREGUNTAS.map((rp, i) => ({ rp, i, n: usos[i] })).filter(x => !(/máquinas nuevas/.test(x.rp) && x.n >= 1));
  const menos = Math.min(...posibles.map(x => x.n));
  // la de "máquinas nuevas" solo si no queda otra: ya la contestó y casi no enseña oficio
  const libres = posibles.filter(x => x.n === menos).sort((x, y) => /máquinas/.test(x.rp) - /máquinas/.test(y.rp)).filter((x, _, l) => l.length === 1 || !/máquinas/.test(x.rp));
  const pref = libres.find(x => x.i === PREFERIDA[q.tema]);
  return (pref || libres[(estado.respuestas.length + q.id.length) % libres.length]).rp;
}

function seguir() {
  if (estado.sesion > 0 && estado.sesion % 5 === 0) { terminar(`Lleva ${estado.sesion} respuestas hoy. Puede descansar o seguir otro rato.`); return; }
  preguntar();
}
$('#siguiente').onclick = seguir;
$('#contestarRepregunta').onclick = () => {
  const rp = estado.repregunta;
  preguntar({ ...rp, texto: `Siga contando sobre «${recortar(rp.contexto, 90)}». Si quiere, cuéntenos también: ${rp.pista}` });
};
$('#saltar').onclick = async () => {
  detenerGrabacion(true);
  estado.saltadas.push(estado.actual.id);
  A.guardar('ajustes', estado.saltadas, 'saltadas').catch(() => {});
  preguntar();
};
$('#terminar').onclick = $('#terminar2').onclick = () => { detenerGrabacion(true); terminar(); };
function terminar(msg) {
  pararVoz();
  $('#resumenFin').textContent = msg || (estado.sesion
    ? `Hoy le enseñó ${estado.sesion} ${estado.sesion === 1 ? 'cosa' : 'cosas'} a ManH. Todo quedó guardado con su voz.`
    : 'Cuando quiera seguimos. Todo lo anterior quedó guardado.');
  paso('fin');
  pintarTodo();
}

// ================= EQUIPO =================
function pintarEquipo() {
  const cob = cobertura(estado.respuestas, estado.pendientes);
  const total = cob.reduce((s, t) => s + t.total, 0), hechas = cob.reduce((s, t) => s + t.respondidas, 0);
  $('#totalResp').textContent = `${estado.respuestas.length} respuestas · ${Math.round(100 * hechas / (total || 1))} %`;
  $('#mapa').innerHTML = cob.map(t => `<li><i>${t.icono}</i><span>${esc(t.nombre)}</span><small>${t.respondidas}/${t.total}</small><div class="barra-a"><span style="width:${(t.avance * 100).toFixed(0)}%"></span></div></li>`).join('');
  if (!$('#nuevaTema').options.length) {
    const ops = TEMAS.map(t => `<option value="${t.id}">${esc(t.nombre)}</option>`).join('');
    $('#nuevaTema').innerHTML = ops; $('#filtroTema').insertAdjacentHTML('beforeend', ops);
  }
  const abiertas = estado.pendientes.filter(q => !estado.respuestas.some(r => r.preguntaId === q.id));
  $('#pendientes').innerHTML = abiertas.map(q => `<li><span>${q.urgente ? '<b>URGENTE · </b>' : ''}${esc(q.texto)}${q.pidio ? ` <small class="nota">· ${esc(q.pidio)}</small>` : ''}</span><button type="button" data-quitar="${q.id}" aria-label="Quitar pregunta">×</button></li>`).join('');
  $$('[data-quitar]').forEach(b => b.onclick = async () => {
    estado.pendientes = estado.pendientes.filter(q => q.id !== b.dataset.quitar);
    await A.borrar('pendientes', b.dataset.quitar).catch(() => {}); N.borrarRemoto('pendiente', b.dataset.quitar); pintarTodo();
  });
  pintarRespuestas();
}

function pintarRespuestas() {
  const ft = $('#filtroTema').value, fe = $('#filtroEstado').value;
  const lista = estado.respuestas.filter(r => (!ft || r.tema === ft) && (!fe || r.estado === fe)).sort((a, b) => b.fecha - a.fecha);
  const cont = $('#respuestas');
  if (!lista.length) {
    cont.innerHTML = `<div class="vacio">${estado.respuestas.length ? 'No hay respuestas con ese filtro.' : `Todavía no hay respuestas. Abra <b>Conversar</b> en el celular ${esc(estado.ajustes.nombre ? "de " + estado.ajustes.nombre : "del Maestro")} y toque «Empezar a conversar».`}</div>`;
    return;
  }
  cont.innerHTML = lista.map(r => `
    <article class="tarjeta${r.estado === 'revisada' ? ' revisada' : ''}" data-id="${r.id}">
      <header><h3>${esc(r.pregunta)}</h3><span class="meta-r">${temaPorId(r.tema).icono} ${esc(temaPorId(r.tema).nombre)} · ${new Date(r.fecha).toLocaleDateString('es-CO')}</span></header>
      ${r.pidio ? `<p class="nota">Pregunta de ${esc(r.pidio)}</p>` : ''}
      ${r.audio ? `<audio controls preload="none" data-audio="${r.audio}"></audio>` : ''}
      ${r.fotos?.length ? `<div class="fotos" data-fotos="${r.fotos.join(',')}"></div>` : ''}
      <textarea rows="4" data-campo="texto" aria-label="Transcripción">${esc(r.texto)}</textarea>
      <input data-campo="resumen" placeholder="En corto, la regla o el dato (opcional)" value="${esc(r.resumen)}" aria-label="Resumen">
      <div class="pie">
        <select data-campo="tipo" aria-label="Tipo de conocimiento"><option value="">¿Qué es?</option>${Object.entries(TIPOS).map(([k, v]) => `<option value="${k}"${r.tipo === k ? ' selected' : ''}>${v}</option>`).join('')}</select>
        <label class="check"><input type="checkbox" data-campo="estado"${r.estado === 'revisada' ? ' checked' : ''}> Revisada</label>
        <button class="borrar" data-borrar>Borrar</button>
      </div>
    </article>`).join('');
  // audios y fotos desde IndexedDB
  $$('[data-audio]').forEach(el => cargarAudio(el));
  $$('[data-fotos]').forEach(async el => {
    el.innerHTML = el.dataset.fotos.split(',').map(f => `<img data-foto="${f}" alt="Foto del Maestro">`).join('');
    el.querySelectorAll('img').forEach(cargarAudio);
  });
  $$('.tarjeta').forEach(t => {
    const r = estado.respuestas.find(x => x.id === t.dataset.id);
    t.querySelectorAll('[data-campo]').forEach(c => c.onchange = async () => {
      const campo = c.dataset.campo;
      r[campo] = campo === 'estado' ? (c.checked ? 'revisada' : 'borrador') : c.value.trim() || (campo === 'tipo' ? null : '');
      r.editada = Date.now();
      t.classList.toggle('revisada', r.estado === 'revisada');
      await A.guardar('respuestas', r).catch(() => {});
      subir(r);
      pintarFichaManh();
    });
    t.querySelector('[data-borrar]').onclick = async () => {
      if (!confirm('¿Borrar esta respuesta y su audio? No se puede deshacer.')) return;
      estado.respuestas = estado.respuestas.filter(x => x.id !== r.id);
      await A.borrar('respuestas', r.id).catch(() => {});
      N.borrarRemoto('respuesta', r.id);
      for (const f of [r.audio, ...(r.fotos || [])].filter(Boolean)) await A.borrar('archivos', f).catch(() => {});
      pintarTodo();
    };
  });
}
$('#filtroTema').onchange = $('#filtroEstado').onchange = pintarRespuestas;

let temaManual = false;
$('#nuevaTema').onchange = () => { temaManual = true; };
$('#nuevaTexto').oninput = e => { if (!temaManual) $('#nuevaTema').value = adivinarTema(e.target.value); };
$('#formPregunta').onsubmit = async e => {
  e.preventDefault();
  const texto = $('#nuevaTexto').value.trim();
  if (!texto) return;
  const q = { id: A.id('p'), tema: $('#nuevaTema').value, texto, pidio: $('#nuevaQuien').value.trim() || 'El equipo', urgente: $('#nuevaUrgente').checked, fecha: Date.now() };
  estado.pendientes.push(q);
  await A.guardar('pendientes', q).catch(() => {});
  N.subirPendiente(q).catch(() => {});
  $('#nuevaTexto').value = ''; $('#nuevaUrgente').checked = false; temaManual = false;
  avisar(`Listo. Se la pregunto ${aNombre()} en la próxima conversación.`);
  pintarTodo();
};

// ajustes
$('#ajNombre').onchange = e => { estado.ajustes.nombre = e.target.value.trim(); aplicarAjustes(); guardarAjustes(); pintarTodo(); };
$('#ajLeer').onchange = e => { estado.ajustes.leer = e.target.checked; guardarAjustes(); };
$('#ajVel').oninput = e => { estado.ajustes.velocidad = +e.target.value; $('#ajVelOut').textContent = e.target.value; guardarAjustes(); };
$('#ajClave').onchange = e => { estado.ajustes.clave = e.target.value.trim(); N.configurar(estado.ajustes.clave); guardarAjustes(); sincronizarYa(); };
$('#ajIA').onchange = e => { estado.ajustes.ia = e.target.value.trim(); guardarAjustes(); };

// exportar / importar
function descargar(nombreArchivo, contenido, tipo) {
  const blob = contenido instanceof Blob ? contenido : new Blob([contenido], { type: tipo });
  const archivo = new File([blob], nombreArchivo, { type: blob.type });
  // en el celular: abrir "compartir" (WhatsApp, correo, Drive); en computador: descargar
  if (navigator.canShare?.({ files: [archivo] }) && matchMedia('(pointer: coarse)').matches) {
    navigator.share({ files: [archivo], title: nombreArchivo }).catch(() => {});
    return;
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombreArchivo; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
const hoy = () => new Date().toISOString().slice(0, 10);
$('#expManual').onclick = () => descargar(`manual-del-maestro-${hoy()}.md`, manualMarkdown(estado.respuestas, nombre()), 'text/markdown');
$('#expJson').onclick = () => descargar(`manh-conocimiento-${hoy()}.json`, JSON.stringify(paquete(estado.respuestas, estado.pendientes, estado.ajustes), null, 2), 'application/json');
$('#expTodo').onclick = async () => {
  avisar('Preparando el paquete con audios…');
  const adj = {};
  for (const r of estado.respuestas) for (const f of [r.audio, ...(r.fotos || [])].filter(Boolean)) {
    const b = await A.leer('archivos', f).catch(() => null); if (b) adj[f] = await A.aDataURL(b);
  }
  descargar(`manh-paquete-completo-${hoy()}.json`, JSON.stringify(paquete(estado.respuestas, estado.pendientes, estado.ajustes, adj)), 'application/json');
};
$('#importar').onchange = async e => {
  const f = e.target.files?.[0]; e.target.value = '';
  if (!f) return;
  try {
    const p = JSON.parse(await f.text());
    if (p.formato !== 'acerostudio.manh/1') throw new Error('formato');
    for (const [k, url] of Object.entries(p.adjuntos || {})) await A.guardar('archivos', await A.deDataURL(url), k);
    const u = unir(estado.respuestas, p.respuestas);
    for (const r of u.lista) await A.guardar('respuestas', r);
    estado.respuestas = u.lista;
    const up = unir(estado.pendientes, p.pendientes);
    for (const q of up.lista) await A.guardar('pendientes', q);
    estado.pendientes = up.lista;
    if (p.maestro && !estado.ajustes.nombre) { estado.ajustes.nombre = p.maestro; guardarAjustes(); aplicarAjustes(); }
    avisar(`Importado: ${u.nuevas} respuestas nuevas, ${u.actualizadas} actualizadas.`);
    pintarTodo();
  } catch { avisar('Ese archivo no es un paquete de ManH.'); }
};

// ================= MANH =================
function pintarFichaManh() {
  const n = estado.respuestas.length;
  const temas = [...new Set(estado.respuestas.map(r => temaPorId(r.tema).nombre.toLowerCase()))];
  $('#manhSabe').textContent = n
    ? `Aprendió ${n} ${n === 1 ? 'cosa' : 'cosas'} de ${nombre()}: ${temas.slice(0, 5).join(', ')}${temas.length > 5 ? '…' : ''}. Responde solo con eso y dice cuándo no sabe.`
    : `Aún no sabe nada: está esperando la primera conversación con ${nombre()}.`;
  if (!$('#chat').children.length) agregarMsg('manh', `Hola, soy ManH. Me encargo del funcionamiento de la fábrica y del proceso productivo. Todo lo que sé me lo enseñó ${nombre()}. Pregúnteme lo que necesite del taller.`);
}

function agregarMsg(quien, html) {
  const d = document.createElement('div');
  d.className = `msg ${quien}`;
  d.innerHTML = (quien === 'manh' ? '<span class="quien">ManH</span>' : '') + html;
  $('#chat').append(d);
  d.scrollIntoView({ block: 'end', behavior: 'smooth' });
  return d;
}

async function preguntarManh(consulta) {
  agregarMsg('yo', esc(consulta));
  let resp = responderAgente(consulta, estado.respuestas, nombre());
  // Con servicio de IA configurado, ManH redacta usando solo los fragmentos del Maestro encontrados.
  if (estado.ajustes.ia && resp.sabe && !resp.base) {
    try {
      const r = await fetch(estado.ajustes.ia, { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ pregunta: consulta, maestro: nombre(), fuentes: resp.fuentes.map(({ id, tema, pregunta, texto, resumen, tipo }) => ({ id, tema, pregunta, texto, resumen, tipo })) }) });
      if (r.ok) { const j = await r.json(); if (j.respuesta) resp = { ...resp, texto: j.respuesta }; }
    } catch {}
  }
  let html = `<p>${esc(resp.texto)}</p>`;
  if (resp.detalle?.length) html += `<ul class="detalle">${resp.detalle.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  if (resp.aviso) html += `<p class="aviso-base">${esc(resp.aviso)}</p>`;
  const d = agregarMsg('manh', html);
  if (resp.fuentes.length && !resp.base) {
    const f = document.createElement('div'); f.className = 'fuentes';
    f.innerHTML = resp.fuentes.map(r => `<div class="fuente"><b>${esc(temaPorId(r.tema).nombre)} · ${esc(recortar(r.pregunta, 90))}</b>${r.audio ? `<audio controls preload="none" data-audio="${r.audio}"></audio>` : ''}</div>`).join('');
    d.append(f);
    f.querySelectorAll('[data-audio]').forEach(el => cargarAudio(el));
  }
  // lo que ManH no sabe (o solo sabe por la base técnica) se convierte en pregunta para el Maestro
  if (!resp.sabe || resp.preguntarAlMaestro) {
    const b = document.createElement('button'); b.className = 'boton coral'; b.textContent = `Preguntárselo ${aNombre()}`;
    b.onclick = async () => {
      const q = { id: A.id('p'), tema: adivinarTema(consulta), texto: consulta.endsWith('?') ? consulta : `¿${consulta.replace(/^¿/, '')}?`, pidio: 'ManH', urgente: false, fecha: Date.now() };
      estado.pendientes.push(q); await A.guardar('pendientes', q).catch(() => {}); N.subirPendiente(q).catch(() => {});
      b.disabled = true; b.textContent = 'Anotada para la próxima conversación'; pintarTodo();
    };
    d.append(b);
  }
}
$$('[data-sugerencia]').forEach(b => b.onclick = () => preguntarManh(b.textContent.trim()));
function adivinarTema(t) {
  const n = t.toLowerCase();
  const claves = { soldadura: /sold|electrodo|mig|amper/, trazo: /cort|disco|plasma|trazo/, acabado: /pint|anticorros|galvan|oxid|pul/, doblez: /dobl|curv|rol/, armado: /arm|escuadra|plantilla/, montaje: /mont|anclaj|obra|instal/, costos: /prec|cobr|cotiz|cost|kilo/, material: /perfil|lamin|tubo|angulo|platina|proveedor|calibre/, seguridad: /segur|accident|proteccion/, calidad: /tolerancia|revis|error|calidad/, clientes: /client/ };
  return Object.entries(claves).find(([, re]) => re.test(n))?.[0] || 'taller';
}
$('#formManh').onsubmit = e => { e.preventDefault(); const c = $('#consulta').value.trim(); if (c) { $('#consulta').value = ''; preguntarManh(c); } };
$('#micManh').onclick = async () => {
  if (!Reconocedor) { avisar('Este navegador no pasa la voz a texto. Escriba la pregunta.'); return; }
  if (!graba.activo) { if (await iniciarGrabacion('manh')) $('#micManh').classList.add('grabando'); }
  else { const r = await detenerGrabacion(); $('#micManh').classList.remove('grabando'); if (r?.texto) { $('#consulta').value = ''; preguntarManh(r.texto); } }
};

// ---------- utilidades ----------
let tAviso;
function avisar(t) { const a = $('#aviso'); a.textContent = t; a.hidden = false; clearTimeout(tAviso); tAviso = setTimeout(() => a.hidden = true, 4200); }

window.__manh = { estado, preguntar, preguntarManh, PREGUNTAS };
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => {};
cargar();

// Actualización sola: si se publica una versión nueva, la app se recarga cuando el Maestro
// está en la pantalla de inicio o de fin (nunca a mitad de una respuesta). Así no tiene que hacer nada.
let versionCargada = null;
async function revisarVersion() {
  try {
    const v = (await (await fetch('version.json?t=' + Date.now(), { cache: 'no-store' })).json()).version;
    if (!versionCargada) { versionCargada = v; return; }
    const quieto = !$('[data-paso="inicio"]').hidden || !$('[data-paso="fin"]').hidden || $('.vista.maestro').hidden;
    if (v !== versionCargada && quieto && !graba.activo) location.reload();
  } catch {}
}
revisarVersion();
setInterval(revisarVersion, 5 * 60 * 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { revisarVersion(); sincronizarYa(); } });
