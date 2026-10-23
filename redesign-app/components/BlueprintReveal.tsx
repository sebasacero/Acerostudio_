"use client";

import { useEffect, useState, type ReactNode } from "react";

// Secuencia de presentación de proyectos (el lenguaje del video de la
// tostaduría): 01 plano técnico en cian y naranja → 02 estructura trazándose
// → 03 obra construida. El dibujo es el mismo SVG; cambia la fase.
const PHASES = [
  { id: "plano", label: "01 · Plano", hint: "Cotas y anotaciones" },
  { id: "estructura", label: "02 · Estructura", hint: "El acero se traza" },
  { id: "obra", label: "03 · Obra", hint: "Construida" },
] as const;

type Phase = (typeof PHASES)[number]["id"];

export default function BlueprintReveal({ children, auto = true }: { children: ReactNode; auto?: boolean }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(!auto);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % PHASES.length), 3200);
    return () => clearInterval(t);
  }, [paused]);

  const phase: Phase = PHASES[i].id;

  return (
    <div className={`reveal reveal-${phase} corner border border-border bg-panel`} data-phase={phase}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <p className="fig">FIG. 02 — {PHASES[i].label}</p>
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-faint">{PHASES[i].hint}</p>
      </div>
      <div className="relative px-4 py-4">
        {children}
        <div className="reveal-scan" aria-hidden="true" />
      </div>
      <div className="no-print flex gap-1 border-t border-border p-2" role="tablist" aria-label="Fase de la presentación">
        {PHASES.map((p, n) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={n === i}
            onClick={() => {
              setI(n);
              setPaused(true);
            }}
            className={`flex-1 py-1.5 font-mono text-[0.62rem] uppercase tracking-widest ${n === i ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
