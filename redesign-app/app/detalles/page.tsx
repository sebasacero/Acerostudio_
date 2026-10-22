import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui";
import { BOGOTA_NOTES, CODE_NOTES, CONNECTIONS, FINISHES, MATERIALS, PRICING_META, PROFILES } from "@/lib/catalog";
import { formatCop } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Detalles constructivos en acero",
  description: "Perfiles, uniones, acabados y norma NSR-10 para construir en acero en Bogotá.",
};

const families = Array.from(new Set(PROFILES.map((p) => p.family)));

export default function DetallesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <SectionHeader
        fig="FIG. 05 — Biblioteca de detalles"
        title="El acero, pieza por pieza"
        lead="Lo que usamos para calcular cada obra: perfiles con su peso por metro, uniones, acabados y lo que exige la norma en Colombia."
      />

      <section className="mb-16" aria-labelledby="perfiles">
        <h2 id="perfiles" className="fig mb-4">01 · Perfiles disponibles en Colombia</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {families.map((f) => (
            <div key={f} className="border border-border bg-panel">
              <p className="border-b border-border px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted">{f}</p>
              <table className="w-full text-sm">
                <tbody>
                  {PROFILES.filter((p) => p.family === f).map((p) => (
                    <tr key={p.designation} className="border-t border-border first:border-t-0 align-top">
                      <td className="px-4 py-2 whitespace-nowrap">{p.designation}</td>
                      <td className="px-4 py-2 text-right font-mono text-xs tabular-nums text-accent whitespace-nowrap">
                        {p.kgPerM.toLocaleString("es-CO")} kg/m
                      </td>
                      <td className="hidden px-4 py-2 text-xs text-muted lg:table-cell">{p.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16" aria-labelledby="uniones">
        <h2 id="uniones" className="fig mb-4">02 · Uniones</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CONNECTIONS.map((c) => (
            <article key={c.id} className="corner border border-border bg-panel p-5">
              <h3 className="font-medium">{c.name}</h3>
              <p className="mt-2 text-sm text-muted">{c.description}</p>
              <p className="mt-3 border-t border-border pt-3 text-xs text-muted">
                <span className="text-accent">Cuándo:</span> {c.whenToUse}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-16" aria-labelledby="materiales">
        <h2 id="materiales" className="fig mb-4">03 · Materiales y su precio por kilo</h2>
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-panel font-mono text-[0.65rem] uppercase tracking-widest text-muted">
              <tr>
                <th className="px-4 py-2 text-left font-normal">Material</th>
                <th className="px-4 py-2 text-right font-normal">Materia prima / kg</th>
                <th className="px-4 py-2 text-right font-normal">Fabricado e instalado / kg</th>
              </tr>
            </thead>
            <tbody>
              {MATERIALS.map((m) => (
                <tr key={m.id} className="border-t border-border align-top">
                  <td className="px-4 py-3">
                    <p>{m.name}</p>
                    <p className="mt-1 text-xs text-faint">Confianza {m.confidence}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs tabular-nums whitespace-nowrap">
                    {formatCop(m.materialPerKg.low)} – {formatCop(m.materialPerKg.high)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs tabular-nums whitespace-nowrap text-accent">
                    {formatCop(m.installedPerKg.low)} – {formatCop(m.installedPerKg.high)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-faint">
          El precio instalado incluye anticorrosivo base, transporte y montaje. Sube cuando la pieza es pequeña, está a la vista y lleva mucho detalle.
        </p>
      </section>

      <section className="mb-16" aria-labelledby="acabados">
        <h2 id="acabados" className="fig mb-4">04 · Acabados</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {FINISHES.map((f) => (
            <article key={f.id} className="border border-border bg-panel p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-medium">{f.name}</h3>
                <span className="font-mono text-xs text-accent whitespace-nowrap">
                  {f.durabilityYears.low}–{f.durabilityYears.high} años
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{f.description}</p>
              <dl className="mt-3 grid gap-1 border-t border-border pt-3 text-xs text-muted">
                <div>
                  <dt className="inline text-foreground">Ideal para: </dt>
                  <dd className="inline">{f.bestFor}</dd>
                </div>
                <div>
                  <dt className="inline text-foreground">Mantenimiento: </dt>
                  <dd className="inline">{f.maintenance}</dd>
                </div>
                <div>
                  <dt className="inline text-foreground">Precio: </dt>
                  <dd className="inline font-mono">
                    {formatCop(f.price.low)} – {formatCop(f.price.high)} / {f.unit === "kg" ? "kg" : "m²"}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-16 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="fig mb-4">05 · Construir en Bogotá</h2>
          <ul className="grid gap-3 text-sm text-muted">
            {BOGOTA_NOTES.map((n) => (
              <li key={n} className="border-l border-accent/40 pl-3">{n}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="fig mb-4">06 · Norma y licencias</h2>
          <ul className="grid gap-3 text-sm text-muted">
            {CODE_NOTES.map((n) => (
              <li key={n} className="border-l border-rust/60 pl-3">{n}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="transparencia" className="corner border border-border bg-panel p-6">
        <h2 id="transparencia" className="fig mb-4">07 · Transparencia: límites de nuestros precios ({PRICING_META.asOf})</h2>
        <ul className="grid gap-2 text-sm text-muted">
          {PRICING_META.caveats.map((c) => (
            <li key={c}>· {c}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
