// ManH · nube: sube cada respuesta, audio y foto a la base de datos del taller (Supabase, función manh-sync)
// y trae lo que grabaron otros dispositivos. Sin clave del taller no hace nada: la app sigue local.
import * as A from './almacen.js';

export const ENDPOINT = 'https://tylylfrabjkaiukuilem.supabase.co/functions/v1/manh-sync';
let clave = '';
export const configurar = c => { clave = (c || '').trim(); };
export const activa = () => !!clave;

const dispositivo = (() => {
  try { let d = localStorage.getItem('manh-dispositivo'); if (!d) { d = A.id('d'); localStorage.setItem('manh-dispositivo', d); } return d; } catch { return 'sin-id'; }
})();

async function llamar(accion, datos = {}) {
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-clave-taller': clave },
    body: JSON.stringify({ accion, dispositivo, ...datos }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || `Error ${r.status}`), { status: r.status });
  return j;
}

const base64 = async blob => (await A.aDataURL(blob)).split(',')[1];

// Sube una respuesta y sus archivos. Marca r.subida para no repetir.
export async function subirRespuesta(r) {
  if (!activa()) return false;
  const limpia = { ...r }; delete limpia.subida; delete limpia.nube;
  await llamar('respuesta', { respuesta: limpia });
  for (const [id, tipo] of [[r.audio, 'audio'], ...(r.fotos || []).map(f => [f, 'foto'])]) {
    if (!id) continue;
    const blob = await A.leer('archivos', id).catch(() => null);
    if (!blob) continue; // ya está solo en la nube
    await llamar('archivo', { id, respuestaId: r.id, tipo, mime: blob.type, base64: await base64(blob) });
  }
  r.subida = r.editada || r.fecha;
  r.nube = true;
  await A.guardar('respuestas', r).catch(() => {});
  return true;
}
export const subirPendiente = async q => { if (activa()) { await llamar('pendiente', { pendiente: q }); q.subida = true; await A.guardar('pendientes', q).catch(() => {}); } };
export const borrarRemoto = (tipo, id) => activa() ? llamar('borrar', { tipo, id }).catch(() => {}) : null;
export const urlArchivo = async id => activa() ? (await llamar('url', { id })).url : null;

// Sube todo lo que falte (incluye lo grabado antes de tener la nube) y trae lo de los demás.
export async function sincronizar(estado) {
  if (!activa() || !navigator.onLine) return null;
  let subidas = 0;
  for (const r of estado.respuestas) {
    if (r.subida && r.subida >= (r.editada || r.fecha)) continue;
    await subirRespuesta(r); subidas++;
  }
  for (const q of estado.pendientes) if (!q.subida) await subirPendiente(q);
  const remoto = await llamar('listar');
  const locales = new Map(estado.respuestas.map(r => [r.id, r]));
  let nuevas = 0;
  for (const rr of remoto.respuestas) {
    const l = locales.get(rr.id);
    const tR = rr.editada || rr.fecha, tL = l ? (l.editada || l.fecha) : -1;
    if (!l || tR > tL) {
      const r = { ...rr, subida: tR };
      if (l) Object.assign(l, r); else { estado.respuestas.push(r); nuevas++; }
      await A.guardar('respuestas', l || r).catch(() => {});
    }
  }
  const pend = new Set(estado.pendientes.map(q => q.id));
  for (const q of remoto.pendientes) if (!pend.has(q.id)) { const n = { ...q, subida: true }; estado.pendientes.push(n); await A.guardar('pendientes', n).catch(() => {}); }
  // lo borrado en otro dispositivo
  const enNube = new Set(remoto.respuestas.map(r => r.id));
  for (const r of [...estado.respuestas]) if (r.subida && !enNube.has(r.id)) {
    estado.respuestas.splice(estado.respuestas.indexOf(r), 1); await A.borrar('respuestas', r.id).catch(() => {});
  }
  return { subidas, nuevas, total: remoto.respuestas.length };
}
