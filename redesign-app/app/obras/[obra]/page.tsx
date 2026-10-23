import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlueprintReveal from "@/components/BlueprintReveal";
import WorkDrawing from "@/components/studio/WorkDrawing";
import { PriceNote, PriceRange, Tag } from "@/components/ui";
import {
  COMPLEMENT_BY_ID,
  CONNECTION_BY_ID,
  FINISH_BY_ID,
  PROFILES,
  TRADITIONS,
  UNIT_LABEL,
  WORKS,
  WORK_BY_ID,
  estimateFor,
  defaultSelection,
  materialsFor,
  pickFinish,
  typicalEstimate,
} from "@/lib/catalog";
import { formatRangeShort } from "@/lib/pricing";

export function generateStaticParams() {
  return WORKS.map((w) => ({ obra: w.id }));
}

export async function generateMetadata({ params }: PageProps<"/obras/[obra]">): Promise<Metadata> {
  const { obra } = await params;
  const work = WORK_BY_ID[obra];
  if (!work) return {};
  const e = typicalEstimate(work);
  return {
    title: work.name,
    description: `${work.description} Proyecto típico: ${formatRangeShort(e.perUnit)} por ${UNIT_LABEL[work.unit].long}.`,
  };
}

const PROFILE_BY_DESIGNATION = Object.fromEntries(PROFILES.map((p) => [p.designation, p]));

export default async function ObraPage({ params }: PageProps<"/obras/[obra]">) {
  const { obra } = await params;
  const work = WORK_BY_ID[obra];
  if (!work) notFound();

  const unit = UNIT_LABEL[work.unit];
  const typical = typicalEstimate(work);
  const byTradition = TRADITIONS.map((t) => ({ t, e: typicalEstimate(work, t) })).sort(
    (a, b) => a.e.central - b.e.central,
  );
  const byMaterial = materialsFor(work).map((m) => {
    const base = defaultSelection(work);
    return { m, e: estimateFor({ ...base, material: m, finish: pickFinish(work, m) }) };
  });
  const minC = byTradition[0].e.central;
  const maxC = byTradition[byTradition.length - 1].e.central;

  return (
    <main>
      <section className="blueprint border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="fig mb-3">
              <Link href="/obras" className="hover:underline">Obras</Link> / {work.category}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{work.name}</h1>
            <p className="mt-4 max-w-2xl text-muted">{work.description}</p>
          </div>
          <div className="corner self-end border border-border bg-panel p-6">
            <p className="fig mb-2">Proyecto típico · {work.quantity.default.toLocaleString("es-CO")} {unit.short}</p>
            <PriceRange range={typical.total} size="lg" />
            <p className="mt-2 font-mono text-xs text-muted">
              {formatRangeShort(typical.perUnit)} por {unit.long}
            </p>
            <p className="mt-1 font-mono text-xs text-faint">
              ≈{Math.round(typical.steelKg).toLocaleString("es-CO")} kg de acero · {typical.days.low}–{typical.days.high} días de taller
            </p>
            <PriceNote className="mt-4" />
            <Link
              href={`/estudio?obra=${work.id}`}
              className="mt-5 block bg-accent px-4 py-3 text-center font-medium text-background"
            >
              Configurar en el estudio →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <BlueprintReveal>
          <WorkDrawing
            workId={work.id}
            materialId={work.defaultMaterialId}
            quantity={work.quantity.default}
            unit={work.unit}
            min={work.quantity.min}
            max={work.quantity.max}
            title={work.name}
          />
        </BlueprintReveal>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2">
        <div>
          <p className="fig mb-3">FIG. 01 — Anatomía en acero</p>
          <h2 className="text-2xl font-semibold tracking-tight">Cómo se construye</h2>
          <p className="mt-3 text-sm text-muted">{work.structuralSystem}</p>
          <p className="mt-3 text-sm text-muted">{work.weightRationale}</p>

          <h3 className="fig mt-8 mb-3 text-muted">Perfiles típicos</h3>
          <table className="w-full text-sm">
            <tbody>
              {work.profiles.map((d) => {
                const p = PROFILE_BY_DESIGNATION[d];
                return (
                  <tr key={d} className="border-t border-border">
                    <td className="py-2 pr-4">{d}</td>
                    <td className="py-2 text-right font-mono text-xs text-muted">
                      {p ? `${p.kgPerM.toLocaleString("es-CO")} kg/m` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h3 className="fig mt-8 mb-3 text-muted">Uniones</h3>
          <ul className="grid gap-3">
            {work.connectionIds.map((id) => {
              const c = CONNECTION_BY_ID[id];
              if (!c) return null;
              return (
                <li key={id} className="border-l border-accent/40 pl-3">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-sm text-muted">{c.whenToUse}</p>
                </li>
              );
            })}
          </ul>

          <h3 className="fig mt-8 mb-3 text-muted">Complementos</h3>
          <ul className="flex flex-wrap gap-2">
            {work.complements.map((wc) => {
              const c = COMPLEMENT_BY_ID[wc.id];
              if (!c) return null;
              return (
                <li key={wc.id}>
                  <Tag>
                    {c.name.split("(")[0].trim()} {wc.optional ? "· opcional" : "· incluido"}
                  </Tag>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="fig mb-3">FIG. 02 — Una obra, doce lenguajes</p>
          <h2 className="text-2xl font-semibold tracking-tight">Cuánto cambia el precio según la referencia</h2>
          <p className="mt-3 text-sm text-muted">
            Mismo proyecto típico, mismo material y acabado; solo cambia el oficio que exige cada tradición.
            En el estudio puedes adoptar también su material preferido.
          </p>
          <ul className="mt-6 grid gap-2">
            {byTradition.map(({ t, e }) => {
              const pct = maxC > minC ? ((e.central - minC) / (maxC - minC)) * 100 : 0;
              return (
                <li key={t.id}>
                  <Link
                    href={`/estudio?obra=${work.id}&lenguaje=${t.id}`}
                    className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border border-border px-3 py-2 hover:border-accent/50"
                  >
                    <span className="text-sm group-hover:text-accent">{t.name}</span>
                    <span className="font-mono text-xs tabular-nums">{formatRangeShort(e.total)}</span>
                    <span className="col-span-2 h-px bg-border">
                      <span className="block h-px bg-accent" style={{ width: `${Math.max(4, pct)}%` }} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="fig mt-10 mb-3">FIG. 03 — Materiales posibles</p>
          <ul className="grid gap-2">
            {byMaterial.map(({ m, e }) => (
              <li key={m.id} className="flex items-center justify-between gap-4 border-t border-border py-2 text-sm">
                <span>
                  {m.short}
                  <span className="ml-2 font-mono text-[0.65rem] text-faint">{FINISH_BY_ID[pickFinish(work, m).id].name}</span>
                </span>
                <span className="font-mono text-xs tabular-nums">{formatRangeShort(e.total)}</span>
              </li>
            ))}
          </ul>

          <p className="fig mt-10 mb-3">Norma y mantenimiento</p>
          <p className="text-sm text-muted">{work.nsr10}</p>
          <p className="mt-3 text-sm text-muted">{work.maintenance}</p>
        </div>
      </section>
    </main>
  );
}
