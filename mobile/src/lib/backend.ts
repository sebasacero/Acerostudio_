import { createClient } from "@supabase/supabase-js";
import * as FileSystem from "expo-file-system/legacy";
import type { ScanResult } from "../../modules/lidar-scanner";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
export const WHATSAPP_NUMBER = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER ?? "573152125327";

export const supabase = createClient(url, anon);
const BUCKET = "disenos-cafe";

async function upload(localUri: string, path: string, contentType: string): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(localUri, { encoding: "base64" });
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, { contentType });
  if (error) throw new Error(`No se pudo subir ${path}: ${error.message}`);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function uploadScan(scan: ScanResult): Promise<{ photoUrl: string; meshUrl: string }> {
  const stamp = Date.now();
  const [photoUrl, meshUrl] = await Promise.all([
    upload(scan.photoUri, `originales/lidar_${stamp}.jpg`, "image/jpeg"),
    upload(scan.meshUri, `escaneos/lidar_${stamp}.obj`, "text/plain"),
  ]);
  return { photoUrl, meshUrl };
}

export async function generateRender(photoUri: string, prompt: string): Promise<string> {
  const image_base64 = await FileSystem.readAsStringAsync(photoUri, { encoding: "base64" });
  const res = await fetch(`${url}/functions/v1/generar-dise-o`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: anon, Authorization: `Bearer ${anon}` },
    body: JSON.stringify({ prompt, image_base64, mime_type: "image/jpeg", mode: "espacio" }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) throw new Error(json.error || "No se pudo generar la propuesta.");
  return json.imageUrl as string;
}

export async function saveQuote(input: {
  style: string;
  photoUrl: string;
  meshUrl: string;
  renderUrl: string | null;
  floorAreaM2: number;
  notes: string;
}) {
  const { error } = await supabase.from("quote_requests").insert({
    mode: "espacio",
    style: input.style,
    original_photo_url: input.photoUrl,
    generated_image_url: input.renderUrl,
    notes: input.notes,
    scan_mesh_url: input.meshUrl,
    space_area_m2: input.floorAreaM2,
    unit: "m2",
    quantity: input.floorAreaM2,
  });
  if (error) throw new Error(error.message);
}
