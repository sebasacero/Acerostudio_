import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import WorldMap from "@/components/WorldMap";
import { Palette, PriceNote, Tag, WorkCard } from "@/components/ui";
import { FINISH_BY_ID, MATERIAL_BY_ID, TRADITIONS, TRADITION_BY_ID, WORKS } from "@/lib/catalog";
import { BOGOTA, distanceKm } from "@/lib/geo";

export function generateStaticParams() {
  return TRADITIONS.map((t) => ({ tradicion: t.id }));
}

export async function generateMetadata({ params }: PageProps<"/atlas/[tradicion]">): Promise<Metadata> {
  const { tradicion } = await params;
  const t = TRADITION_BY_ID[tradicion];
  if (!t) return {};
  return { title: t.name, description: t.philosophy };
}

export default async function TradicionPage({ params }: PageProps<"/atlas/[tradicion]">) {
  const { tradicion } = await params;
  const t = TRADITION_BY_ID[tradicion];
  if (!t) notFound();

  const km = Math.round(distanceKm(BOGOTA, t) / 100) * 100;

  return (
    <main>
      <section className="blueprint border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="fig mb-3">
              <Link href="/atlas" className="hover:underline">Atlas</Link> / {t.region} · {t.era}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{t.name}</h1>
            <p className="mt-4 text-lg text-muted">{t.philosophy}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {t.cities.map((c) => (
                <Tag key={c}>{c}</Tag>
              ))}
            </div>
            <div className="mt-6 max-w-sm">
              <Palette colors={t.palette} />
              <p className="mt-2 font-mono text-[0.65rem] text-faint">
                {t.palette.map((p) => `${p.name} ${p.hex}`).join(" · ")}
              </p>
            </div>
          </div>
          <div className="self-center">
            <WorldMap traditions={TRADITIONS} selectedId={t.id} />
            <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-faint">
              BOG → {t.cities[0]} · {km.toLocaleString("es-CO")} km de ideas
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2">
        <div>
          <p className="fig mb-3">FIG. 01 — Lenguaje del acero</p>
          <p className="text-muted">{t.steelLanguage}</p>

          <p className="fig mt-8 mb-3">Detalles característicos</p>
          <ol className="grid gap-3">
            {t.signatureDetails.map((d, i) => (
              <li key={d} className="grid grid-cols-[auto_1fr] gap-3 text-sm">
                <span className="font-mono text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-muted">{d}</span>
              </li>
            ))}
          </ol>

          <p className="fig mt-8 mb-3">Materiales y acabados</p>
          <div className="flex flex-wrap gap-2">
            {t.preferredMaterialIds.map((id) => MATERIAL_BY_ID[id] && <Tag key={id}>{MATERIAL_BY_ID[id].short}</Tag>)}
            {t.preferredFinishIds.map((id) => FINISH_BY_ID[id] && <Tag key={id}>{FINISH_BY_ID[id].name}</Tag>)}
          </div>
          <ul className="mt-3 text-sm text-muted">
            {t.materials.map((m) => (
              <li key={m}>· {m}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="fig mb-3">FIG. 02 — Referentes</p>
          <ul className="grid gap-3">
            {t.works.map((w) => (
              <li key={w.name} className="border-t border-border pt-3">
                <p className="font-medium">{w.name}</p>
                <p className="font-mono text-xs text-muted">
                  {w.architect} · {w.city} · {w.year}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">Arquitectos: {t.architects.join(", ")}.</p>

          <div className="corner mt-8 border border-border bg-panel p-5">
            <p className="fig mb-2">Oficio ×{t.complexityFactor.toLocaleString("es-CO", { minimumFractionDigits: 2 })}</p>
            <p className="text-sm text-muted">{t.complexityRationale}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <p className="fig mb-3">FIG. 03 — Precios en este lenguaje</p>
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">Las {WORKS.length} obras con el oficio de {t.cities[0]}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORKS.map((w, i) => (
            <WorkCard key={w.id} work={w} index={i} tradition={t} />
          ))}
        </div>
        <PriceNote className="mt-6" />
      </section>
    </main>
  );
}
