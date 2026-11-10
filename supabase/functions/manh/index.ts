// ManH · redacción opcional con IA. NO desplegada: consume créditos de Anthropic.
// La página manh/ ya eligió los fragmentos del Maestro con su búsqueda local; aquí solo se redactan.
// Secreto requerido: ANTHROPIC_API_KEY  (supabase secrets set ANTHROPIC_API_KEY=...)
// Desplegar solo con OK del dueño:  supabase functions deploy manh
import Anthropic from "npm:@anthropic-ai/sdk";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SISTEMA = `Eres ManH, jefe de planta de AceroStudio, una fábrica de estructuras y ornamentación en acero en Bogotá.
Tu conocimiento viene del Maestro, con 50 años de oficio. Responde solo con lo que está en los fragmentos
que te da el sistema, en español claro de taller, en frases cortas y con números concretos cuando los haya.
Di siempre de dónde sale ("Como enseña el Maestro…"). Si los fragmentos no alcanzan, dilo y propone
preguntárselo al Maestro; nunca inventes medidas, amperajes, espesores ni precios.
En seguridad, si hay riesgo para una persona, dilo primero.`;

type Fuente = { id: string; tema: string; pregunta: string; texto: string; resumen?: string; tipo?: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { pregunta, maestro = "el Maestro", fuentes = [] } = await req.json() as { pregunta: string; maestro?: string; fuentes: Fuente[] };
    if (!pregunta || !Array.isArray(fuentes)) throw new Error("Falta la pregunta o los fragmentos");
    const contexto = fuentes.slice(0, 6).map((f, i) =>
      `<fragmento n="${i + 1}" tema="${f.tema}" tipo="${f.tipo ?? ""}">\nPregunta que se le hizo: ${f.pregunta}\n${f.resumen ? `Resumen revisado: ${f.resumen}\n` : ""}Lo que dijo ${maestro}: ${f.texto}\n</fragmento>`).join("\n");
    const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-5-5",
      max_tokens: 700,
      system: SISTEMA.replaceAll("el Maestro", maestro),
      messages: [{ role: "user", content: `${contexto}\n\nPregunta del taller: ${pregunta}` }],
    });
    const respuesta = msg.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("\n").trim();
    return new Response(JSON.stringify({ respuesta }), { headers: { ...cors, "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), { status: 400, headers: { ...cors, "content-type": "application/json" } });
  }
});
