"use client";

import { useRef, useState } from "react";
import { supabase, EDGE_FUNCTIONS_URL } from "@/lib/supabase";
import { MODES, WHATSAPP_NUMBER, BUDGET_RANGES, type RedesignMode } from "@/lib/constants";

type Step = "upload" | "style" | "generating" | "result" | "quote" | "done";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function RedesignTool() {
  const [step, setStep] = useState<Step>("upload");
  const [mode, setMode] = useState<RedesignMode>("espacio");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [originalPhotoUrl, setOriginalPhotoUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [budgetRange, setBudgetRange] = useState(BUDGET_RANGES[0]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeMode = MODES.find((m) => m.id === mode)!;

  function onPickFile(f: File | null) {
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setStyle(null);
    setGeneratedImageUrl(null);
    setError(null);
    setStep("style");
  }

  async function generate() {
    if (!file || !style) return;
    setStep("generating");
    setError(null);

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `originales/${mode}_${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("disenos-cafe")
        .upload(path, file, { contentType: file.type || "image/jpeg" });
      if (uploadError) throw new Error(`No se pudo subir la foto: ${uploadError.message}`);

      const { data: publicUrlData } = supabase.storage.from("disenos-cafe").getPublicUrl(path);
      setOriginalPhotoUrl(publicUrlData.publicUrl);

      const image_base64 = await fileToBase64(file);
      const prompt =
        mode === "espacio"
          ? `Rediseña este espacio de cafetería en estilo ${style}.`
          : `Rediseña este producto/empaque en estilo ${style}.`;

      const res = await fetch(`${EDGE_FUNCTIONS_URL}/generar-dise-o`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
        body: JSON.stringify({ prompt, image_base64, mime_type: file.type, mode }),
      });

      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "No se pudo generar el diseño.");

      setGeneratedImageUrl(json.imageUrl);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal. Intenta de nuevo.");
      setStep("style");
    }
  }

  async function submitQuote() {
    if (!originalPhotoUrl || !style) return;
    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from("quote_requests").insert({
        mode,
        style,
        original_photo_url: originalPhotoUrl,
        generated_image_url: generatedImageUrl,
        contact_name: contactName || null,
        contact_phone: contactPhone || null,
        contact_email: contactEmail || null,
        budget_range: budgetRange,
        notes: notes || null,
      });
      if (insertError) throw new Error(insertError.message);

      const lines = [
        `Hola equipo de acero.studio 👋`,
        ``,
        `Quiero cotizar un rediseño de ${mode === "espacio" ? "mi espacio" : "mi producto"} en estilo *${style}*.`,
        contactName ? `Nombre: ${contactName}` : null,
        budgetRange ? `Presupuesto estimado: ${budgetRange}` : null,
        notes ? `Notas: ${notes}` : null,
        ``,
        `Foto original: ${originalPhotoUrl}`,
        generatedImageUrl ? `Propuesta generada: ${generatedImageUrl}` : null,
      ].filter(Boolean);

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(url, "_blank");
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar la cotización.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep("upload");
    setFile(null);
    setPreviewUrl(null);
    setStyle(null);
    setOriginalPhotoUrl(null);
    setGeneratedImageUrl(null);
    setError(null);
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Selector de modo */}
      <div className="flex gap-2 mb-6 font-mono text-xs uppercase tracking-widest">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMode(m.id);
              reset();
            }}
            className={`px-4 py-2 border rounded-sm transition-colors ${
              mode === m.id
                ? "border-accent text-accent bg-accent/10"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="text-muted text-sm mb-8">{activeMode.tagline}</p>

      <div className="border border-border rounded-md bg-panel p-6">
        {error && (
          <p className="mb-4 text-sm text-red-400 border border-red-400/30 bg-red-400/10 rounded-sm px-3 py-2">
            {error}
          </p>
        )}

        {step === "upload" && (
          <div
            className="border border-dashed border-border rounded-sm py-16 text-center cursor-pointer hover:border-accent/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-foreground font-medium">📷 Sube una foto para empezar</p>
            <p className="text-muted text-sm mt-2">
              {mode === "espacio"
                ? "Interior o fachada, tal como está hoy."
                : "El empaque, etiqueta o producto tal como es hoy."}
            </p>
          </div>
        )}

        {step === "style" && previewUrl && (
          <div className="grid gap-6 md:grid-cols-2">
            <img src={previewUrl} alt="Foto subida" className="rounded-sm w-full object-cover" />
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
                Elige un estilo
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {activeMode.styles.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`px-3 py-1.5 text-sm border rounded-full transition-colors ${
                      style === s
                        ? "border-accent text-accent bg-accent/10"
                        : "border-border text-muted hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                disabled={!style}
                onClick={generate}
                className="w-full py-2.5 rounded-sm bg-accent text-background font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Generar diseño →
              </button>
              <button
                onClick={reset}
                className="w-full py-2 mt-2 text-sm text-muted hover:text-foreground"
              >
                Elegir otra foto
              </button>
            </div>
          </div>
        )}

        {step === "generating" && (
          <div className="py-16 text-center">
            <div className="inline-block h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-foreground">Generando tu propuesta en estilo {style}…</p>
            <p className="text-muted text-sm mt-1">Puede tardar unos segundos.</p>
          </div>
        )}

        {step === "result" && previewUrl && generatedImageUrl && (
          <div>
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">Antes</p>
                <img src={previewUrl} alt="Antes" className="rounded-sm w-full object-cover" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
                  Después · {style}
                </p>
                <img src={generatedImageUrl} alt="Después" className="rounded-sm w-full object-cover" />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep("quote")}
                className="flex-1 py-2.5 rounded-sm bg-accent text-background font-medium"
              >
                Cotizar este diseño →
              </button>
              <button
                onClick={() => setStep("style")}
                className="px-4 py-2.5 text-sm border border-border rounded-sm text-muted hover:text-foreground"
              >
                Probar otro estilo
              </button>
            </div>
          </div>
        )}

        {step === "quote" && (
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent mb-4">
              Cuéntanos cómo contactarte
            </p>
            <div className="grid gap-3 mb-4">
              <input
                className="bg-background border border-border rounded-sm px-3 py-2 text-sm"
                placeholder="Nombre"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
              <input
                className="bg-background border border-border rounded-sm px-3 py-2 text-sm"
                placeholder="WhatsApp / teléfono"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
              <input
                className="bg-background border border-border rounded-sm px-3 py-2 text-sm"
                placeholder="Email (opcional)"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
              <select
                className="bg-background border border-border rounded-sm px-3 py-2 text-sm"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
              >
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <textarea
                className="bg-background border border-border rounded-sm px-3 py-2 text-sm"
                placeholder="Notas (opcional)"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <button
              disabled={submitting}
              onClick={submitQuote}
              className="w-full py-2.5 rounded-sm bg-accent text-background font-medium disabled:opacity-40"
            >
              {submitting ? "Enviando…" : "Enviar a WhatsApp →"}
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="py-10 text-center">
            <p className="text-foreground font-medium mb-2">¡Listo! 🎉</p>
            <p className="text-muted text-sm mb-6">
              Tu cotización quedó registrada y abrimos WhatsApp para que hables con nuestro equipo.
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 text-sm border border-border rounded-sm text-muted hover:text-foreground"
            >
              Rediseñar otra cosa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
