"use client";

import { useRef, useState } from "react";
import { generateRender, uploadOriginal } from "@/lib/render";
import type { Finish, Material, Tradition, Work } from "@/lib/types";

export interface RenderResult {
  photoUrl: string;
  renderUrl: string;
}

export default function RenderPanel({
  work,
  material,
  finish,
  tradition,
  onRender,
}: {
  work: Work;
  material: Material;
  finish: Finish;
  tradition: Tradition;
  onRender: (r: RenderResult) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [render, setRender] = useState<{ url: string; caption: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const caption = `${work.name} · ${material.short} · ${finish.name} · ${tradition.name}`;

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const photoUrl = await uploadOriginal(file, "obra");
      const prompt =
        `Integra en este espacio: ${work.name.toLowerCase()} (${work.description}) ` +
        `en ${material.short} con acabado ${finish.name.toLowerCase()}, ` +
        `siguiendo el lenguaje arquitectónico de ${tradition.name}. ` +
        `Detalles constructivos visibles: ${tradition.signatureDetails.slice(0, 2).join("; ")}. ` +
        `Keywords: ${tradition.promptKeywords}.`;
      const renderUrl = await generateRender(file, prompt, "obra");
      setRender({ url: renderUrl, caption });
      onRender({ photoUrl, renderUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo generar la propuesta.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="render" className="no-print border border-border bg-panel p-5">
      <p id="render" className="fig mb-2">Míralo en tu espacio</p>
      <p className="mb-4 text-sm text-muted">
        Sube una foto de tu local o fachada y la IA integra esta obra con el material, el acabado y el
        lenguaje elegidos, sin cambiar la estructura existente.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setFile(f);
          setPreview(URL.createObjectURL(f));
          setRender(null);
          setError(null);
        }}
      />
      {error && <p className="mb-3 border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-[4/3] items-center justify-center overflow-hidden border border-dashed border-border text-sm text-muted hover:border-accent/50"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Foto de tu espacio" className="h-full w-full object-cover" />
          ) : (
            "📷 Subir foto del espacio"
          )}
        </button>
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-border bg-background">
          {busy ? (
            <div className="text-center">
              <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <p className="text-sm text-muted">Generando propuesta…</p>
            </div>
          ) : render ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={render.url} alt={`Propuesta: ${render.caption}`} className="h-full w-full object-cover" />
              <p className="absolute bottom-0 left-0 right-0 bg-background/80 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-accent">
                FIG. 06 — {render.caption}
              </p>
            </>
          ) : (
            <p className="px-4 text-center text-sm text-faint">Aquí aparecerá la propuesta</p>
          )}
        </div>
      </div>
      <button
        type="button"
        disabled={!file || busy}
        onClick={run}
        className="mt-3 w-full bg-accent py-2.5 font-medium text-background disabled:cursor-not-allowed disabled:opacity-40"
      >
        {render ? "Generar otra versión" : "Generar propuesta con IA"}
      </button>
    </section>
  );
}
