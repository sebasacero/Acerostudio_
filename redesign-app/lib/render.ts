import { EDGE_FUNCTIONS_URL, supabase } from "./supabase";

export type RenderMode = "espacio" | "producto" | "obra";

const BUCKET = "disenos-cafe";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadOriginal(file: File, mode: RenderMode): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `originales/${mode}_${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type || "image/jpeg" });
  if (error) throw new Error(`No se pudo subir la foto: ${error.message}`);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function generateRender(file: File, prompt: string, mode: RenderMode): Promise<string> {
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const res = await fetch(`${EDGE_FUNCTIONS_URL}/generar-dise-o`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: anon, Authorization: `Bearer ${anon}` },
    body: JSON.stringify({ prompt, image_base64: await fileToBase64(file), mime_type: file.type, mode }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) throw new Error(json.error || "No se pudo generar el diseño.");
  return json.imageUrl as string;
}
