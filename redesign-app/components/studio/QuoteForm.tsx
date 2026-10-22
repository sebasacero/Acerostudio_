"use client";

import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatCop, formatRangeShort, type Estimate } from "@/lib/pricing";
import { supabase } from "@/lib/supabase";
import type { StudioState } from "@/lib/studio-state";
import type { Finish, Material, Tradition, Work } from "@/lib/types";

export default function QuoteForm({
  state,
  work,
  material,
  finish,
  tradition,
  estimate,
  unitShort,
  shareUrl,
  photoUrl,
  renderUrl,
}: {
  state: StudioState;
  work: Work;
  material: Material;
  finish: Finish;
  tradition: Tradition;
  estimate: Estimate;
  unitShort: string;
  shareUrl: string;
  photoUrl: string | null;
  renderUrl: string | null;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waUrl, setWaUrl] = useState<string | null>(null);

  const canSend = name.trim().length > 1 && (phone.trim().length >= 7 || /\S+@\S+\.\S+/.test(email));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    setSending(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from("quote_requests").insert({
        mode: "obra",
        style: tradition.name,
        original_photo_url: photoUrl,
        generated_image_url: renderUrl,
        contact_name: name.trim(),
        contact_phone: phone.trim() || null,
        contact_email: email.trim() || null,
        budget_range: formatRangeShort(estimate.total),
        notes: notes.trim() || null,
        work_id: work.id,
        tradition_id: tradition.id,
        material_id: material.id,
        finish_id: finish.id,
        quantity: state.quantity,
        unit: work.unit,
        estimate_low: Math.round(estimate.total.low),
        estimate_high: Math.round(estimate.total.high),
        estimate_breakdown: {
          lines: estimate.lines.map((l) => ({ key: l.key, label: l.label, amount: Math.round(l.amount) })),
          construction: Math.round(estimate.construction),
          contingency: Math.round(estimate.contingency),
          designFee: Math.round(estimate.designFee),
          iva: Math.round(estimate.iva),
          central: Math.round(estimate.central),
          extras: state.extras,
          fireProtection: state.fire,
          url: shareUrl,
        },
      });
      if (insertError) throw new Error(insertError.message);

      const msg = [
        "Hola equipo de AceroStudio 👋",
        "",
        `Quiero cotizar: *${work.name}* · ${state.quantity.toLocaleString("es-CO")} ${unitShort}`,
        `Lenguaje: ${tradition.name}`,
        `Material: ${material.short} · ${finish.name}`,
        `Estimado de la herramienta: ${formatRangeShort(estimate.total)} (central ${formatCop(estimate.central)})`,
        `Nombre: ${name.trim()}`,
        notes.trim() ? `Notas: ${notes.trim()}` : null,
        "",
        `Configuración: ${shareUrl}`,
        renderUrl ? `Propuesta IA: ${renderUrl}` : null,
      ]
        .filter((l) => l !== null)
        .join("\n");
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank", "noopener");
      setWaUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar la cotización.");
    } finally {
      setSending(false);
    }
  }

  if (waUrl) {
    return (
      <section className="no-print corner border border-accent/40 bg-panel p-6 text-center">
        <p className="fig mb-2">Sellado en El Taller</p>
        <p className="font-medium">Tu solicitud quedó registrada.</p>
        <p className="mt-2 text-sm text-muted">
          Un arquitecto del estudio te contactará para agendar la visita técnica.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-accent hover:underline"
        >
          Abrir el resumen en WhatsApp →
        </a>
      </section>
    );
  }

  const field = "w-full border border-border bg-background px-3 py-2 text-sm placeholder:text-faint focus:border-accent focus:outline-none";

  return (
    <form onSubmit={submit} aria-labelledby="cotizar" className="no-print border border-border bg-panel p-5">
      <p id="cotizar" className="fig mb-2">Solicitar cotización formal</p>
      <p className="mb-4 text-sm text-muted">
        Enviamos esta configuración exacta a nuestro taller. Sin compromiso: el siguiente paso es una visita técnica.
      </p>
      {error && <p className="mb-3 border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">{error}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-xs text-muted">
          Nombre *
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </label>
        <label className="grid gap-1 text-xs text-muted">
          WhatsApp / teléfono
          <input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" />
        </label>
        <label className="grid gap-1 text-xs text-muted sm:col-span-2">
          Email
          <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <label className="grid gap-1 text-xs text-muted sm:col-span-2">
          Notas (dirección, plazos, medidas…)
          <textarea className={field} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
      </div>
      <p className="mt-2 text-xs text-faint">Necesitamos tu nombre y un teléfono o email para responderte.</p>
      <button
        type="submit"
        disabled={!canSend || sending}
        className="mt-4 w-full bg-accent py-2.5 font-medium text-background disabled:cursor-not-allowed disabled:opacity-40"
      >
        {sending ? "Enviando…" : "Enviar cotización por WhatsApp →"}
      </button>
    </form>
  );
}
