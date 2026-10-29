// Visión arquitectónica de AceroStudio: imagen → datos de modelo 3D.
//   tarea "plano":   foto o escaneo de un plano / boceto → muros con vanos, en metros.
//   tarea "fachada": foto o render de un edificio → volúmenes, pisos, crujías, materiales y un prompt de render.
// El Studio (studio/js/vision-ui.js) convierte la respuesta en el modelo con generate.js.
// Secreto requerido: ANTHROPIC_API_KEY  (supabase secrets set ANTHROPIC_API_KEY=...)
import Anthropic from "npm:@anthropic-ai/sdk";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MATERIALES = ["concreto", "microcemento", "yeso", "ladrillo", "roble", "nogal", "acero_azul", "acero_purpura",
  "acero_bronce", "acero_pajizo", "acero", "corten", "vidrio"];

const num = { type: "number" };
const PLANO_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["ancho_m", "fondo_m", "muros", "notas"],
  properties: {
    ancho_m: num,
    fondo_m: num,
    muros: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["x1", "z1", "x2", "z2", "espesor", "vanos"],
        properties: {
          x1: num, z1: num, x2: num, z2: num, espesor: num,
          vanos: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["tipo", "centro_desde_inicio", "ancho"],
              properties: { tipo: { type: "string", enum: ["puerta", "ventana"] }, centro_desde_inicio: num, ancho: num },
            },
          },
        },
      },
    },
    notas: { type: "string" },
  },
};

const FACHADA_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["nombre", "altura_piso", "volumenes", "estilo", "descripcion", "prompt_render"],
  properties: {
    nombre: { type: "string" },
    altura_piso: num,
    volumenes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["x", "z", "ancho", "fondo", "pisos", "crujias", "ancho_ventana", "alto_ventana", "antepecho", "primer_piso_vidriado", "material"],
        properties: {
          x: num, z: num, ancho: num, fondo: num,
          pisos: { type: "integer" }, crujias: { type: "integer" },
          ancho_ventana: num, alto_ventana: num, antepecho: num,
          primer_piso_vidriado: { type: "boolean" },
          material: { type: "string", enum: MATERIALES },
        },
      },
    },
    estilo: { type: "string" },
    descripcion: { type: "string" },
    prompt_render: { type: "string" },
  },
};

const SYSTEM = `Eres el motor de visión de AceroStudio, una inteligencia de diseño arquitectónico.
Lees imágenes de arquitectura y devuelves geometría medible en metros para reconstruir un modelo 3D.
Ejes: x hacia la derecha de la imagen (este), z hacia abajo de la imagen (sur); origen en la esquina superior izquierda del dibujo.
Si no hay cotas, estima con medidas típicas: puerta 0,9 m, muro exterior 0,2 m, interior 0,12 m, altura de piso 3 m.
Responde solo con los datos pedidos; en "notas" o "descripcion" explica supuestos en español, en una o dos frases.`;

const TAREAS: Record<string, { schema: unknown; pedido: (b: Body) => string }> = {
  plano: {
    schema: PLANO_SCHEMA,
    pedido: (b) => `Esta imagen es un plano o boceto en planta. Devuelve cada muro como su eje (x1,z1)→(x2,z2) en metros, con su espesor y sus vanos (puertas y ventanas) medidos a lo largo del muro desde (x1,z1).
Une los muros en las esquinas (los extremos deben coincidir). Ignora mobiliario, cotas y texto.${b.ancho_m ? ` El ancho total del dibujo es ${b.ancho_m} m.` : ""}${b.notas ? ` Indicaciones del usuario: ${b.notas}` : ""}`,
  },
  fachada: {
    schema: FACHADA_SCHEMA,
    pedido: (b) => `Esta imagen es una fotografía o render de un edificio. Descompónlo en volúmenes prismáticos (torres o cuerpos) vistos en planta, con su posición (x, z de la esquina noroeste, la calle queda al sur), ancho, fondo, número de pisos, crujías de ventanas en la fachada, medidas de ventana y material principal de fachada (elige de la lista).
Estima el fondo aunque no se vea. En "prompt_render" escribe en inglés un prompt fotorrealista para generar la imagen final o un video de cámara del edificio reinterpretado con estructura de acero a la vista (columnas HEB, vigas IPE, vidrio de piso a techo, uniones limpias), nivel fotografía de arquitectura para venta: hora dorada o azul, lente 24 mm con perspectiva de dos puntos, entorno, personas.${b.notas ? ` Indicaciones del usuario: ${b.notas}` : ""}`,
  },
};

type Body = { tarea?: string; imagen?: string; media_type?: string; ancho_m?: number; notas?: string };

const client = new Anthropic(); // lee ANTHROPIC_API_KEY

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...cors, "Content-Type": "application/json" } });
  try {
    const body = (await req.json()) as Body;
    const tarea = TAREAS[body.tarea ?? ""];
    if (!tarea || !body.imagen) return json({ error: "Envía tarea ('plano' o 'fachada') e imagen (base64 o data URL)." }, 400);
    const m = /^data:(image\/[a-z+]+);base64,(.*)$/s.exec(body.imagen);
    const data = m ? m[2] : body.imagen;
    const media_type = (m ? m[1] : body.media_type || "image/jpeg") as "image/jpeg" | "image/png" | "image/webp" | "image/gif";
    if (data.length > 7_000_000) return json({ error: "Imagen muy grande: redúcela a menos de 5 MB." }, 413);

    const res = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      output_config: { effort: "medium", format: { type: "json_schema", schema: tarea.schema } },
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type, data } },
          { type: "text", text: tarea.pedido(body) },
        ],
      }],
    } as never);

    if (res.stop_reason === "refusal") return json({ error: "La IA no pudo procesar esta imagen." }, 422);
    const text = res.content.find((c: { type: string }) => c.type === "text") as { text: string } | undefined;
    if (!text) return json({ error: "Respuesta vacía de la IA." }, 502);
    return json({ tarea: body.tarea, resultado: JSON.parse(text.text) });
  } catch (err) {
    console.error(err);
    if (err instanceof Anthropic.APIError) return json({ error: `IA: ${err.message}` }, err.status ?? 502);
    return json({ error: "No se pudo analizar la imagen." }, 500);
  }
});
