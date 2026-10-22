"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import {
  COMPLEMENT_BY_ID,
  FINISH_BY_ID,
  MATERIAL_BY_ID,
  TRADITIONS,
  UNIT_LABEL,
  WORKS,
  estimateFor,
  finishesFor,
  materialsFor,
  pickMaterial,
} from "@/lib/catalog";
import { formatCopShort, formatRangeShort, mid } from "@/lib/pricing";
import {
  parseState,
  reduce,
  serializeState,
  toSelection,
  type StudioAction,
  type StudioState,
} from "@/lib/studio-state";
import { Palette } from "@/components/ui";
import Budget from "./Budget";
import QuoteForm from "./QuoteForm";
import RenderPanel, { type RenderResult } from "./RenderPanel";
import TechSheet from "./TechSheet";
import WorkDrawing from "./WorkDrawing";

type Action = StudioAction | { type: "reset"; state: StudioState };

function studioReducer(s: StudioState, a: Action): StudioState {
  return a.type === "reset" ? a.state : reduce(s, a);
}

function Delta({ value, selected }: { value: number; selected?: boolean }) {
  if (selected) return <span className="font-mono text-[0.65rem] text-faint">actual</span>;
  if (Math.abs(value) < 1000) return <span className="whitespace-nowrap font-mono text-[0.65rem] text-faint">mismo precio</span>;
  const up = value > 0;
  return (
    <span className={`whitespace-nowrap font-mono text-[0.65rem] tabular-nums ${up ? "text-rust" : "text-accent"}`}>
      {up ? "+" : "−"}
      {formatCopShort(Math.abs(value))}
    </span>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`step-${n}`} className="border-t border-border py-6 first:border-t-0 first:pt-0">
      <h2 id={`step-${n}`} className="fig mb-4">
        {n} — {title}
      </h2>
      {children}
    </section>
  );
}

const optionCls = (active: boolean) =>
  `w-full border px-3 py-2 text-left transition-colors ${
    active ? "border-accent bg-accent/10" : "border-border hover:border-accent/40"
  }`;

export default function Studio() {
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(studioReducer, searchParams, parseState);
  const lastWritten = useRef<string | null>(null);
  const [render, setRender] = useState<RenderResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Links from other pages (e.g. the nav) change the URL without remounting: re-sync then.
  const incoming = searchParams.toString();
  useEffect(() => {
    if (lastWritten.current !== null && incoming !== lastWritten.current) {
      dispatch({ type: "reset", state: parseState(searchParams) });
    }
  }, [incoming, searchParams]);

  const qs = serializeState(state);
  useEffect(() => {
    lastWritten.current = qs;
    window.history.replaceState(null, "", `/estudio?${qs}`);
  }, [qs]);

  const sel = toSelection(state);
  const { work, material, finish, tradition } = sel;
  const unit = UNIT_LABEL[work.unit];
  const est = estimateFor(sel);

  const deltaFor = (a: StudioAction) => estimateFor(toSelection(reduce(state, a))).central - est.central;

  const act = (a: StudioAction) => {
    if (a.type === "material") {
      const next = reduce(state, a);
      if (next.finishId !== state.finishId) {
        setNotice(`El acabado cambió a ${FINISH_BY_ID[next.finishId].name} porque ${MATERIAL_BY_ID[next.materialId].short} no admite el anterior.`);
      } else setNotice(null);
    } else if (a.type !== "finish") setNotice(null);
    dispatch(a);
  };

  const preferred = tradition.preferredMaterialIds.filter((id) => work.materialIds.includes(id));
  const suggested = preferred.length > 0 && !preferred.includes(state.materialId) ? pickMaterial(work, tradition) : null;
  const renderUrl = render && render.configKey === qs ? render.renderUrl : null;
  const shareUrl = typeof window === "undefined" ? `/estudio?${qs}` : `${window.location.origin}/estudio?${qs}`;
  const today = new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 lg:pb-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="fig mb-2">Estudio de detalle en acero</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{work.name}</h1>
          <p className="text-sm text-muted">
            {tradition.name} · {material.short} · {finish.name}
          </p>
        </div>
        <div className="no-print flex gap-2">
          <button type="button" onClick={copyLink} className="border border-border px-3 py-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted hover:text-foreground">
            {copied ? "Enlace copiado" : "Compartir enlace"}
          </button>
          <button type="button" onClick={() => window.print()} className="border border-border px-3 py-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted hover:text-foreground">
            Imprimir lámina
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] print:block">
        {/* Controles */}
        <aside className="no-print border border-border bg-panel p-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <Step n="01" title="¿Qué quieres construir?">
            <label className="sr-only" htmlFor="obra">Obra</label>
            <select
              id="obra"
              value={state.workId}
              onChange={(e) => act({ type: "work", workId: e.target.value })}
              className="w-full border border-border bg-background px-3 py-2 text-sm"
            >
              {WORKS.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-muted">{work.description}</p>
          </Step>

          <Step n="02" title="Elige un lenguaje del mundo">
            <ul className="grid max-h-72 gap-1.5 overflow-y-auto pr-1">
              {TRADITIONS.map((t) => (
                <li key={t.id}>
                  <button type="button" aria-pressed={t.id === state.traditionId} onClick={() => act({ type: "tradition", traditionId: t.id })} className={optionCls(t.id === state.traditionId)}>
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm leading-tight">{t.name}</span>
                      <Delta value={deltaFor({ type: "tradition", traditionId: t.id })} selected={t.id === state.traditionId} />
                    </span>
                    <span className="mt-1.5 flex items-center gap-2">
                      <span className="w-20"><Palette colors={t.palette} /></span>
                      <span className="font-mono text-[0.6rem] text-faint">Oficio ×{t.complexityFactor.toFixed(2).replace(".", ",")}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {suggested && (
              <button
                type="button"
                onClick={() => act({ type: "tradition", traditionId: tradition.id, adoptMaterial: true })}
                className="mt-3 w-full border border-dashed border-accent/50 px-3 py-2 text-left text-xs text-accent"
              >
                Este lenguaje suele usar {suggested.short}. Adoptarlo{" "}
                <Delta value={deltaFor({ type: "tradition", traditionId: tradition.id, adoptMaterial: true })} />
              </button>
            )}
            <Link href={`/atlas/${tradition.id}`} className="mt-3 inline-block font-mono text-[0.65rem] uppercase tracking-widest text-muted hover:text-accent">
              Ver lámina del lenguaje →
            </Link>
          </Step>

          <Step n="03" title="Medidas y acabados">
            <label htmlFor="cantidad" className="flex items-baseline justify-between text-sm">
              <span>Cantidad</span>
              <span className="font-mono text-accent">
                {state.quantity.toLocaleString("es-CO")} {unit.short}
              </span>
            </label>
            <input
              id="cantidad"
              type="range"
              min={work.quantity.min}
              max={work.quantity.max}
              step={work.quantity.step}
              value={state.quantity}
              onChange={(e) => act({ type: "quantity", quantity: Number(e.target.value) })}
              className="mt-2 w-full"
            />
            <div className="flex justify-between font-mono text-[0.6rem] text-faint">
              <span>{work.quantity.min} {unit.short}</span>
              <span>{work.quantity.max} {unit.short}</span>
            </div>

            <p className="mb-2 mt-5 text-sm">Material</p>
            <div className="grid gap-1.5">
              {materialsFor(work).map((m) => (
                <button key={m.id} type="button" aria-pressed={m.id === state.materialId} onClick={() => act({ type: "material", materialId: m.id })} className={optionCls(m.id === state.materialId)}>
                  <span className="flex items-center justify-between gap-2 text-sm">
                    <span>{m.short}</span>
                    <Delta value={deltaFor({ type: "material", materialId: m.id })} selected={m.id === state.materialId} />
                  </span>
                </button>
              ))}
            </div>

            <p className="mb-2 mt-5 text-sm">Acabado</p>
            <div className="grid gap-1.5">
              {finishesFor(material).map((f) => (
                <button key={f.id} type="button" aria-pressed={f.id === state.finishId} onClick={() => act({ type: "finish", finishId: f.id })} className={optionCls(f.id === state.finishId)}>
                  <span className="flex items-center justify-between gap-2 text-sm">
                    <span>{f.name}</span>
                    <Delta value={deltaFor({ type: "finish", finishId: f.id })} selected={f.id === state.finishId} />
                  </span>
                  <span className="font-mono text-[0.6rem] text-faint">
                    {f.durabilityYears.low}–{f.durabilityYears.high} años · {formatCopShort(mid(f.price))}/{f.unit === "kg" ? "kg" : "m²"}
                  </span>
                </button>
              ))}
            </div>
            {material.id === "acero-corten" && (
              <p className="mt-2 text-xs text-muted">El corten no se pinta: se deja oxidar hasta formar su propia piel protectora.</p>
            )}
            {notice && <p className="mt-2 text-xs text-accent" role="status">{notice}</p>}

            {work.complements.length > 0 && (
              <>
                <p className="mb-2 mt-5 text-sm">Complementos</p>
                <ul className="grid gap-1.5">
                  {work.complements.map((wc) => {
                    const c = COMPLEMENT_BY_ID[wc.id];
                    if (!c) return null;
                    const replacedBy = work.complements.find((o) => o.replaces === wc.id && state.extras.includes(o.id));
                    const on = wc.optional ? state.extras.includes(wc.id) : !replacedBy;
                    const status = replacedBy
                      ? `reemplazado por ${COMPLEMENT_BY_ID[replacedBy.id].name.split("(")[0].trim().toLowerCase()}`
                      : wc.replaces
                        ? `en lugar de ${COMPLEMENT_BY_ID[wc.replaces].name.split("(")[0].trim().toLowerCase()}`
                        : wc.optional
                          ? wc.group
                            ? "opcional · una opción"
                            : "opcional"
                          : "incluido";
                    return (
                      <li key={wc.id}>
                        <label className={`flex cursor-pointer items-start gap-2 border px-3 py-2 text-sm ${on ? "border-accent/40" : "border-border"} ${wc.optional ? "" : "cursor-default opacity-80"}`}>
                          <input
                            type="checkbox"
                            checked={on}
                            disabled={!wc.optional}
                            onChange={(e) => act({ type: "extra", id: wc.id, on: e.target.checked })}
                            className="mt-1 accent-[var(--accent)]"
                          />
                          <span className="flex-1">
                            <span className="block leading-tight">{c.name.split("(")[0].trim()}</span>
                            <span className="font-mono text-[0.6rem] text-faint">{status}</span>
                          </span>
                          {wc.optional && (
                            <Delta
                              value={on ? -deltaFor({ type: "extra", id: wc.id, on: false }) : deltaFor({ type: "extra", id: wc.id, on: true })}
                            />
                          )}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {work.fireProtectionApplies && (
              <label className="mt-4 flex cursor-pointer items-start gap-2 border border-border px-3 py-2 text-sm">
                <input type="checkbox" checked={state.fire} onChange={(e) => act({ type: "fire", on: e.target.checked })} className="mt-1" />
                <span className="flex-1">
                  Protección al fuego (intumescente)
                  <span className="block text-xs text-muted">Según el uso, la NSR-10 (Título J) puede exigirla; el ingeniero lo confirma.</span>
                </span>
                <Delta value={state.fire ? -deltaFor({ type: "fire", on: false }) : deltaFor({ type: "fire", on: true })} />
              </label>
            )}
          </Step>
        </aside>

        {/* Lámina */}
        <div className="grid min-w-0 content-start gap-6">
          <div className="no-print sticky top-[57px] z-30 hidden items-center justify-between gap-6 border border-border bg-background/95 px-5 py-3 backdrop-blur lg:flex">
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-faint">Presupuesto estimado · con IVA</p>
              <p className="text-2xl font-semibold tabular-nums tracking-tight">{formatRangeShort(est.total)}</p>
            </div>
            <p className="font-mono text-xs text-muted">
              {formatRangeShort(est.perUnit)} / {unit.short}
              <br />≈{Math.round(est.steelKg).toLocaleString("es-CO")} kg · {est.days.low}–{est.days.high} días
            </p>
            <div className="flex gap-2">
              <a href="#presupuesto" className="border border-border px-3 py-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted hover:text-foreground">
                Desglose
              </a>
              <a href="#cotizar" className="bg-accent px-4 py-2 text-sm font-medium text-background">
                Cotizar
              </a>
            </div>
          </div>

          <section aria-label="Elevación paramétrica" className="print-sheet corner border border-border bg-panel blueprint">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <p className="fig">FIG. 02 — Elevación paramétrica</p>
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-faint">Esquemático · S/E</p>
            </div>
            <div className="px-4 py-4">
              <WorkDrawing
                workId={work.id}
                materialId={material.id}
                quantity={state.quantity}
                unit={work.unit}
                min={work.quantity.min}
                max={work.quantity.max}
                title={work.name}
              />
            </div>
          </section>

          <Budget
            estimate={est}
            unitShort={unit.short}
            meta={[
              { label: "Obra", value: `${work.name} · ${state.quantity.toLocaleString("es-CO")} ${unit.short}` },
              { label: "Lenguaje", value: tradition.name },
              { label: "Material", value: `${material.short} · ${finish.name}` },
              { label: "Fecha · Rev.", value: `${today} · A` },
            ]}
          />

          <TechSheet work={work} material={material} finish={finish} tradition={tradition} />

          <div className="no-print grid gap-6 xl:grid-cols-2">
            <div>
              <h2 className="fig mb-3">04 — Tu espacio</h2>
              <RenderPanel
                work={work}
                material={material}
                finish={finish}
                tradition={tradition}
                configKey={qs}
                onRender={setRender}
              />
            </div>
            <div id="cotizar" className="scroll-mt-40">
              <h2 className="fig mb-3">05 — Cotizar</h2>
              <QuoteForm
                state={state}
                work={work}
                material={material}
                finish={finish}
                tradition={tradition}
                estimate={est}
                unitShort={unit.short}
                shareUrl={shareUrl}
                photoUrl={render?.photoUrl ?? null}
                renderUrl={renderUrl}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Barra de precio en móvil */}
      <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-faint">Estimado con IVA</p>
            <p className="text-lg font-semibold tabular-nums">{formatRangeShort(est.total)}</p>
          </div>
          <a href="#cotizar" className="bg-accent px-4 py-2 text-sm font-medium text-background">
            Cotizar
          </a>
        </div>
      </div>
    </div>
  );
}
