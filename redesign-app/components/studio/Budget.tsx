"use client";

import { useState } from "react";
import { FEES } from "@/lib/catalog";
import { formatCop, formatRangeShort, type Estimate } from "@/lib/pricing";

export default function Budget({
  estimate,
  unitShort,
  meta,
}: {
  estimate: Estimate;
  unitShort: string;
  meta: { label: string; value: string }[];
}) {
  const [showFormula, setShowFormula] = useState(false);
  const e = estimate;

  return (
    <section aria-labelledby="presupuesto" className="print-sheet border border-border bg-panel">
      <div className="grid grid-cols-2 border-b border-border sm:grid-cols-4">
        {meta.map((m) => (
          <div key={m.label} className="border-r border-border px-3 py-2 last:border-r-0">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">{m.label}</p>
            <p className="truncate text-xs" title={m.value}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p id="presupuesto" className="fig mb-1 scroll-mt-40">Presupuesto estimado · con IVA</p>
            <p className="text-3xl font-semibold tabular-nums tracking-tight md:text-4xl" aria-live="polite">
              {formatRangeShort(e.total)}
            </p>
            <p className="mt-1 font-mono text-xs text-muted">
              {formatRangeShort(e.perUnit)} / {unitShort} · ≈{Math.round(e.steelKg).toLocaleString("es-CO")} kg de acero ·{" "}
              {e.days.low}–{e.days.high} días de taller
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowFormula((v) => !v)}
            aria-pressed={showFormula}
            className="no-print border border-border px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted hover:text-foreground"
          >
            {showFormula ? "Ocultar fórmula" : "Ver fórmula"}
          </button>
        </div>

        <table className="mt-5 w-full text-sm">
          <tbody>
            {e.lines.map((l) => (
              <tr key={l.key} className="border-t border-border align-top">
                <td className="py-2 pr-3">
                  <p>{l.label}</p>
                  <p className="font-mono text-[0.68rem] text-faint">{showFormula ? l.formula : l.detail}</p>
                </td>
                <td className="py-2 text-right font-mono text-xs tabular-nums whitespace-nowrap">{formatCop(l.amount)}</td>
              </tr>
            ))}
            <tr className="border-t border-foreground/30">
              <td className="py-2 pr-3 text-muted">Costo directo de obra</td>
              <td className="py-2 text-right font-mono text-xs tabular-nums">{formatCop(e.construction)}</td>
            </tr>
            <tr className="border-t border-border">
              <td className="py-2 pr-3 text-muted">Imprevistos · {FEES.contingencyPct}%</td>
              <td className="py-2 text-right font-mono text-xs tabular-nums">{formatCop(e.contingency)}</td>
            </tr>
            <tr className="border-t border-border">
              <td className="py-2 pr-3 text-muted">Diseño y dirección AceroStudio · {FEES.designFeePct}%</td>
              <td className="py-2 text-right font-mono text-xs tabular-nums">{formatCop(e.designFee)}</td>
            </tr>
            <tr className="border-t border-border">
              <td className="py-2 pr-3 text-muted">IVA · {FEES.ivaPct}%</td>
              <td className="py-2 text-right font-mono text-xs tabular-nums">{formatCop(e.iva)}</td>
            </tr>
            <tr className="border-t border-foreground/30">
              <td className="py-2 pr-3 font-medium">Valor central</td>
              <td className="py-2 text-right font-mono text-sm tabular-nums text-accent">{formatCop(e.central)}</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-xs text-faint">
          Rango de −{FEES.bandLowPct}% a +{FEES.bandHighPct}% sobre el valor central (estimación de orden de magnitud).
          No incluye diseño estructural firmado, licencias, obra civil ni desmontes. Sujeto a visita técnica.
        </p>
      </div>
    </section>
  );
}
