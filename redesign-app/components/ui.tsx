import Link from "next/link";
import type { ReactNode } from "react";
import { formatRangeShort } from "@/lib/pricing";
import { UNIT_LABEL, typicalEstimate } from "@/lib/catalog";
import type { Range, Tradition, Work } from "@/lib/types";

export function SectionHeader({ fig, title, lead }: { fig: string; title: ReactNode; lead?: ReactNode }) {
  return (
    <header className="mb-8 max-w-3xl">
      <p className="fig mb-3">{fig}</p>
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
      {lead && <p className="mt-3 text-muted">{lead}</p>}
    </header>
  );
}

export function PriceRange({ range, size = "md" }: { range: Range; size?: "sm" | "md" | "lg" }) {
  const cls = size === "lg" ? "text-3xl md:text-4xl" : size === "sm" ? "text-sm" : "text-lg";
  return <span className={`${cls} font-semibold tabular-nums tracking-tight`}>{formatRangeShort(range)}</span>;
}

export function PriceNote({ className = "" }: { className?: string }) {
  return (
    <p className={`font-mono text-[0.65rem] uppercase tracking-[0.12em] text-faint ${className}`}>
      Rango de referencia con IVA · sujeto a visita técnica
    </p>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center border border-border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted">
      {children}
    </span>
  );
}

export function WorkCard({ work, index, tradition }: { work: Work; index: number; tradition?: Tradition }) {
  const e = typicalEstimate(work, tradition);
  const unit = UNIT_LABEL[work.unit].short;
  const href = tradition ? `/estudio?obra=${work.id}&lenguaje=${tradition.id}` : `/obras/${work.id}`;
  return (
    <Link
      href={href}
      className="corner group flex flex-col border border-border bg-panel p-5 transition-colors hover:border-accent/50"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="fig">FIG. {String(index + 1).padStart(2, "0")} — {work.category}</p>
        <span className="font-mono text-[0.65rem] text-faint">{unit}</span>
      </div>
      <h3 className="text-lg font-medium leading-snug group-hover:text-accent transition-colors">{work.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{work.description}</p>
      <div className="mt-auto pt-5">
        <p className="font-mono text-[0.7rem] text-muted">
          <span className="text-foreground">{formatRangeShort(e.perUnit)}</span> / {unit} · típico
        </p>
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <PriceRange range={e.total} />
        </div>
        <p className="mt-1 font-mono text-[0.65rem] text-faint">
          Proyecto típico · {work.quantity.default.toLocaleString("es-CO")} {unit} · ≈{Math.round(e.steelKg).toLocaleString("es-CO")} kg · {e.days.low}–{e.days.high} días
        </p>
      </div>
    </Link>
  );
}

export function Palette({ colors }: { colors: { name: string; hex: string }[] }) {
  return (
    <div className="flex">
      {colors.map((c) => (
        <span
          key={c.hex + c.name}
          title={`${c.name} ${c.hex}`}
          className="h-4 flex-1 first:rounded-l-sm last:rounded-r-sm"
          style={{ backgroundColor: c.hex }}
        />
      ))}
    </div>
  );
}

export function TraditionCard({ tradition, index }: { tradition: Tradition; index: number }) {
  return (
    <Link
      href={`/atlas/${tradition.id}`}
      className="corner group flex flex-col border border-border bg-panel p-5 transition-colors hover:border-accent/50"
    >
      <p className="fig mb-3">
        L.{String(index + 1).padStart(2, "0")} — {tradition.cities[0]}
      </p>
      <h3 className="text-lg font-medium leading-snug group-hover:text-accent transition-colors">{tradition.name}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted">{tradition.philosophy}</p>
      <div className="mt-auto pt-5">
        <Palette colors={tradition.palette} />
        <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-faint">
          Oficio ×{tradition.complexityFactor.toLocaleString("es-CO", { minimumFractionDigits: 2 })} · {tradition.era}
        </p>
      </div>
    </Link>
  );
}
