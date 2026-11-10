// ManH · sincronización de las respuestas del Maestro con la base de datos (sin IA, sin créditos).
// Tablas: manh_respuestas, manh_pendientes, manh_archivos (RLS sin políticas: solo esta función).
// Audios y fotos en el bucket privado "manh-archivos".
// Acceso: encabezado x-clave-taller; se compara su sha256 con manh_config.clave_taller_sha256.
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-clave-taller",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "content-type": "application/json" } });

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const BUCKET = "manh-archivos";
let hashClave: string | null = null;

async function sha256(t: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function autorizado(req: Request) {
  const c = req.headers.get("x-clave-taller") || "";
  if (!c) return false;
  if (!hashClave) {
    const { data } = await sb.from("manh_config").select("valor").eq("clave", "clave_taller_sha256").single();
    hashClave = data?.valor ?? null;
  }
  return !!hashClave && (await sha256(c)) === hashClave;
}

// Voz a texto en la nube (el celular Android no transcribe mientras graba). Solo si el secreto
// ELEVENLABS_API_KEY existe; sin él no hace nada. Escribe el texto solo si la respuesta llegó vacía.
const CLAVE_VOZ = Deno.env.get("ELEVENLABS_API_KEY");
async function transcribir(respuestaId: string, bytes: Uint8Array, mime: string) {
  try {
    const { data: r } = await sb.from("manh_respuestas").select("texto").eq("id", respuestaId).maybeSingle();
    if (!r || String(r.texto ?? "").trim()) return;
    const form = new FormData();
    form.append("model_id", "scribe_v1");
    form.append("language_code", "spa");
    form.append("tag_audio_events", "false");
    form.append("file", new Blob([bytes], { type: mime || "audio/webm" }), "respuesta.webm");
    const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", { method: "POST", headers: { "xi-api-key": CLAVE_VOZ! }, body: form });
    if (!res.ok) { console.error("voz a texto", res.status, await res.text()); return; }
    const texto = String((await res.json()).text ?? "").trim();
    if (!texto) return;
    const ahora = new Date().toISOString();
    await sb.from("manh_respuestas").update({ texto, editada: ahora, actualizado: ahora }).eq("id", respuestaId).eq("texto", "");
  } catch (e) { console.error("voz a texto", e); }
}

const ms = (v: unknown) => (v ? new Date(Number(v)).toISOString() : null);
const deMs = (v: string | null) => (v ? new Date(v).getTime() : null);
const TIPOS = new Set(["regla", "dato", "advertencia", "historia", "truco"]);

// deno-lint-ignore no-explicit-any
function filaRespuesta(r: any, dispositivo: string) {
  return {
    id: String(r.id), pregunta_id: String(r.preguntaId), tema: String(r.tema), pregunta: String(r.pregunta),
    texto: String(r.texto ?? ""), resumen: String(r.resumen ?? ""), tipo: TIPOS.has(r.tipo) ? r.tipo : null,
    etiquetas: Array.isArray(r.etiquetas) ? r.etiquetas.map(String) : [], estado: r.estado === "revisada" ? "revisada" : "borrador",
    autor: r.autor ?? null, pidio: r.pidio ?? null, padre: r.padre ?? null,
    audio_path: r.audio ? `${r.audio}` : null, fotos: Array.isArray(r.fotos) ? r.fotos.map(String) : [],
    dispositivo, fecha: ms(r.fecha) ?? new Date().toISOString(), editada: ms(r.editada), actualizado: new Date().toISOString(),
  };
}
// deno-lint-ignore no-explicit-any
function aCliente(f: any) {
  return {
    id: f.id, preguntaId: f.pregunta_id, tema: f.tema, pregunta: f.pregunta, texto: f.texto, resumen: f.resumen, tipo: f.tipo,
    etiquetas: f.etiquetas, estado: f.estado, autor: f.autor, pidio: f.pidio, padre: f.padre, audio: f.audio_path, fotos: f.fotos,
    fecha: deMs(f.fecha), editada: deMs(f.editada), nube: true,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Solo POST" }, 405);
  // Subir no pide clave (el celular del Maestro sube solo). Leer, escuchar y borrar sí: solo la familia.
  const familia = await autorizado(req);
  try {
    const b = await req.json();
    const disp = String(b.dispositivo ?? "").slice(0, 80);
    if (!familia && !["respuesta", "archivo", "pendiente"].includes(b.accion)) return json({ error: "Clave del taller incorrecta" }, 401);
    switch (b.accion) {
      case "respuesta": {
        const fila = filaRespuesta(b.respuesta, disp);
        // no pisar una versión editada más reciente
        const { data: ya } = await sb.from("manh_respuestas").select("editada,fecha,dispositivo").eq("id", fila.id).maybeSingle();
        // sin clave, cada celular solo puede tocar lo que él mismo subió
        if (ya && !familia && ya.dispositivo !== disp) return json({ error: "Sin permiso" }, 403);
        const tNueva = deMs(fila.editada) ?? deMs(fila.fecha)!, tVieja = ya ? (deMs(ya.editada) ?? deMs(ya.fecha)!) : -1;
        if (tNueva >= tVieja) { const { error } = await sb.from("manh_respuestas").upsert(fila); if (error) throw error; }
        return json({ ok: true });
      }
      case "archivo": {
        const { id, respuestaId, tipo, mime, base64 } = b;
        if (!/^[a-z]-[a-z0-9-]+$/i.test(id) || !["audio", "foto"].includes(tipo)) throw new Error("Archivo inválido");
        if (typeof base64 !== "string" || base64.length > 20_000_000) throw new Error("Archivo muy grande");
        if (!familia) {
          const { data: ya } = await sb.from("manh_archivos").select("id").eq("id", id).maybeSingle();
          if (ya) return json({ ok: true }); // ya está; sin clave no se reemplaza
        }
        const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        const ext = tipo === "foto" ? (mime?.includes("png") ? "png" : "jpg") : (mime?.includes("mp4") ? "m4a" : "webm");
        const path = `${tipo}s/${id}.${ext}`;
        const up = await sb.storage.from(BUCKET).upload(path, bytes, { contentType: mime || undefined, upsert: true });
        if (up.error) throw up.error;
        const { error } = await sb.from("manh_archivos").upsert({ id, respuesta_id: respuestaId ?? null, tipo, path, mime, bytes: bytes.length });
        if (error) throw error;
        if (tipo === "audio" && respuestaId && CLAVE_VOZ) {
          // @ts-ignore EdgeRuntime existe en Supabase: deja terminar la transcripción después de responder
          const tarea = transcribir(String(respuestaId), bytes, mime);
          // deno-lint-ignore no-explicit-any
          (globalThis as any).EdgeRuntime?.waitUntil ? (globalThis as any).EdgeRuntime.waitUntil(tarea) : await tarea;
        }
        return json({ ok: true, path });
      }
      case "pendiente": {
        const q = b.pendiente;
        const { error } = await sb.from("manh_pendientes").upsert({ id: String(q.id), tema: String(q.tema), texto: String(q.texto), pidio: q.pidio ?? null, urgente: !!q.urgente, fecha: ms(q.fecha) ?? new Date().toISOString() });
        if (error) throw error;
        return json({ ok: true });
      }
      case "borrar": {
        const tabla = b.tipo === "pendiente" ? "manh_pendientes" : "manh_respuestas";
        const { error } = await sb.from(tabla).delete().eq("id", String(b.id));
        if (error) throw error;
        return json({ ok: true });
      }
      case "listar": {
        const [r, p, a] = await Promise.all([
          sb.from("manh_respuestas").select("*").order("fecha"),
          sb.from("manh_pendientes").select("*").order("fecha"),
          sb.from("manh_archivos").select("id"),
        ]);
        if (r.error || p.error || a.error) throw r.error || p.error || a.error;
        return json({
          respuestas: r.data.map(aCliente),
          pendientes: p.data.map((q) => ({ id: q.id, tema: q.tema, texto: q.texto, pidio: q.pidio, urgente: q.urgente, fecha: deMs(q.fecha) })),
          archivos: a.data.map((x) => x.id),
        });
      }
      case "url": {
        const { data: f } = await sb.from("manh_archivos").select("path").eq("id", String(b.id)).maybeSingle();
        if (!f) return json({ error: "No existe" }, 404);
        const { data, error } = await sb.storage.from(BUCKET).createSignedUrl(f.path, 3600);
        if (error) throw error;
        return json({ url: data.signedUrl });
      }
      default:
        return json({ error: "Acción desconocida" }, 400);
    }
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 400);
  }
});
