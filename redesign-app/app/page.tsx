import Link from "next/link";
import WorldMap from "@/components/WorldMap";
import { PriceNote, SectionHeader, WorkCard } from "@/components/ui";
import { FEES, TRADITIONS, UNIT_LABEL, WORKS, typicalEstimate } from "@/lib/catalog";
import { formatRangeShort } from "@/lib/pricing";

const STEPS = [
  { n: "01", title: "Elige un lenguaje del mundo", body: "Doce tradiciones constructivas en acero, de Jean Prouvé a Glenn Murcutt, explicadas por sus detalles." },
  { n: "02", title: "Diseña la obra en acero", body: "Barra, celosía, pérgola, mezzanine… con perfiles, uniones y acabados pensados para Bogotá." },
  { n: "03", title: "Mira el precio en vivo", body: "Presupuesto por partidas: kilos de acero, oficio, acabado, complementos, imprevistos, diseño e IVA." },
  { n: "04", title: "Visualízala y cotiza", body: "Sube una foto de tu espacio, genera la propuesta con IA y envía la cotización a nuestro taller." },
];

export default function Home() {
  return (
    <main>
      <section className="blueprint border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div>
            <p className="fig mb-4">FIG. 00 — Estudio de arquitectura en acero · Bogotá</p>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Arquitectura en acero, con el mundo como referencia y el precio a la vista.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Diseña tu obra con doce lenguajes constructivos del mundo, entiende cada detalle en
              acero y conoce cuánto cuesta antes de pedir una cotización.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/estudio" className="bg-accent px-5 py-3 font-medium text-background">
                Abrir el estudio →
              </Link>
              <Link href="/obras" className="corner border border-border px-5 py-3 text-foreground hover:border-accent/50">
                Ver precios de obras
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <dt className="text-faint uppercase tracking-widest">Obras</dt>
                <dd className="mt-1 text-2xl text-foreground">{WORKS.length}</dd>
              </div>
              <div>
                <dt className="text-faint uppercase tracking-widest">Lenguajes</dt>
                <dd className="mt-1 text-2xl text-foreground">{TRADITIONS.length}</dd>
              </div>
              <div>
                <dt className="text-faint uppercase tracking-widest">IVA</dt>
                <dd className="mt-1 text-2xl text-foreground">incl.</dd>
              </div>
            </dl>
          </div>
          <div className="self-center">
            <WorldMap traditions={TRADITIONS} />
            <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-faint">
              FIG. 00.1 — 12 lenguajes conectados con el taller en Bogotá ·{" "}
              <Link href="/atlas" className="text-accent hover:underline">
                explorar el atlas
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-panel/60" aria-label="Lista de precios">
        <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 py-4 font-mono text-[0.72rem]">
          {WORKS.map((w) => {
            const e = typicalEstimate(w);
            return (
              <Link key={w.id} href={`/obras/${w.id}`} className="shrink-0 whitespace-nowrap text-muted hover:text-foreground">
                <span className="text-foreground">{w.name}</span> · {formatRangeShort(e.perUnit)}/{UNIT_LABEL[w.unit].short}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeader
          fig="FIG. 01 — Método"
          title="De la referencia al presupuesto, sin cajas negras"
          lead="Cada número sale de una fórmula que puedes abrir y auditar en el estudio."
        />
        <ol className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="bg-background p-6">
              <p className="font-mono text-sm text-accent">{s.n}</p>
              <h3 className="mt-3 font-medium">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <SectionHeader
          fig="FIG. 02 — Obras"
          title="Precio de cada obra que podemos diseñar"
          lead={`Proyecto típico con el lenguaje más sencillo. Incluye ${FEES.contingencyPct}% de imprevistos, ${FEES.designFeePct}% de diseño y dirección e IVA del ${FEES.ivaPct}%.`}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORKS.slice(0, 6).map((w, i) => (
            <WorkCard key={w.id} work={w} index={i} />
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <PriceNote />
          <Link href="/obras" className="font-mono text-xs uppercase tracking-widest text-accent hover:underline">
            Ver las {WORKS.length} obras →
          </Link>
        </div>
      </section>

      <section className="border-t border-border blueprint">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <p className="fig mb-3">FIG. 03 — El Taller</p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Tres generaciones de oficio en acero</h2>
            <p className="mt-4 text-muted">
              AceroStudio nace del taller de herrería ornamental del abuelo de la familia Acero.
              Ese conocimiento de soldadura, plegado y acabado es la base de cada detalle que
              diseñamos, y la razón por la que podemos dar precios honestos: sabemos cuánto pesa
              y cuánto cuesta hacer bien cada pieza.
            </p>
          </div>
          <div className="corner self-center border border-border bg-panel p-6">
            <p className="fig mb-3">¿Solo quieres reimaginar tu espacio o tu empaque?</p>
            <p className="text-muted">
              El rediseño rápido con IA transforma una foto de tu café o de tu producto en una
              propuesta en segundos.
            </p>
            <Link href="/rediseno" className="mt-5 inline-block font-mono text-xs uppercase tracking-widest text-accent hover:underline">
              Rediseño rápido →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
