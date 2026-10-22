import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { GoogleGenAI, Modality } from "https://esm.sh/@google/genai"

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

// Instrucciones fijas por modo — acotan el modelo sin importar que prompt
// llegue desde el frontend. 'espacio' y 'producto' solo transforman lo que ya
// existe; 'obra' es el único que puede AGREGAR algo (la obra en acero pedida).
const SYSTEM_RULES: Record<string, string> = {
  espacio: `
Eres un generador de imagenes especializado UNICAMENTE en rediseno de
interiores y fachadas de cafeterias.

Reglas obligatorias, sin excepcion:
- Mantén la estructura arquitectónica real: paredes, ventanas, puertas,
  columnas y proporciones del espacio NO cambian.
- Solo modifica acabados, colores, mobiliario, iluminación y decoración,
  según el estilo indicado.
- No agregues personas, logos, marcas ni texto que no estén ya en la imagen.
- El resultado debe ser una variación visual realista del MISMO espacio,
  no un espacio distinto ni un render genérico.
`,
  producto: `
Eres un generador de imagenes especializado UNICAMENTE en rediseno de
empaques y productos (bolsas de café, vasos, merchandising, etiquetas).

Reglas obligatorias, sin excepcion:
- Mantén la forma, el tamaño y la silueta real del producto: NO cambian.
- Solo modifica colores, materiales, tipografía, etiqueta/empaque e
  iluminación del producto, según el estilo indicado.
- No inventes marcas, logos ni texto que no estén ya en la imagen, salvo
  que el estilo pedido lo requiera explícitamente como parte del diseño.
- El resultado debe ser una variación visual realista del MISMO producto,
  no un producto distinto ni un render genérico.
`,
  obra: `
Eres un generador de imagenes especializado UNICAMENTE en arquitectura en
acero para locales comerciales (cafeterías, tiendas, terrazas, fachadas).

Reglas obligatorias, sin excepcion:
- Mantén la estructura existente: muros, ventanas, puertas, columnas y
  proporciones del lugar NO se demuelen ni se mueven.
- AGREGA o sustituye únicamente la obra en acero descrita en la instrucción
  (barra, pérgola, celosía, mezzanine, escalera, baranda, portón, letrero,
  marquesina, estantería, mesa o kiosko), integrada de forma constructivamente
  creíble: apoyos, uniones y anclajes visibles y coherentes.
- Representa con fidelidad el material y el acabado indicados (corten
  oxidado, inoxidable cepillado, galvanizado, pintura) y el lenguaje
  arquitectónico pedido.
- Escala realista respecto al mobiliario existente. No agregues personas,
  logos, marcas ni texto, salvo el letrero si esa es la obra pedida.
- El resultado debe ser una fotografía realista del MISMO lugar con la nueva
  obra, no un render genérico.
`,
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { prompt, image_base64, mime_type, mode } = await req.json()

    if (!image_base64) throw new Error("Imagen Base64 requerida")
    if (!prompt) throw new Error("Prompt requerido")

    const resolvedMode = mode === "producto" || mode === "obra" ? mode : "espacio"
    const systemRules = SYSTEM_RULES[resolvedMode]

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY")
    if (!geminiApiKey) {
      throw new Error("Falta configurar el secreto GEMINI_API_KEY en Supabase (supabase secrets set GEMINI_API_KEY=...)")
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey })

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        { text: `${systemRules}\n\nInstrucción del usuario: ${prompt}` },
        { inlineData: { mimeType: mime_type || "image/jpeg", data: image_base64 } }
      ],
      config: { responseModalities: [Modality.TEXT, Modality.IMAGE] }
    })

    const parts = aiResponse.candidates?.[0]?.content?.parts ?? []
    const imagePart = parts.find((p: any) => p.inlineData)

    if (!imagePart) {
      throw new Error("Gemini no devolvió ninguna imagen para esta solicitud")
    }

    const generatedMime = imagePart.inlineData.mimeType || "image/png"
    const ext = generatedMime.includes("png") ? "png" : "jpg"
    const imageBytes = Uint8Array.from(atob(imagePart.inlineData.data), c => c.charCodeAt(0))

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const fileName = `renders/${resolvedMode}_${Date.now()}.${ext}`
    const bucketName = "disenos-cafe"

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, imageBytes, {
        contentType: generatedMime,
        upsert: true,
      })

    if (uploadError) {
      throw new Error(`Storage error: ${uploadError.message}`)
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName)

    return new Response(
      JSON.stringify({
        imageUrl: data.publicUrl,
        prompt_used: prompt,
        mode: resolvedMode,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    )
  }
})
