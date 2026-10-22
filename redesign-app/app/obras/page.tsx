import type { Metadata } from "next";
import Link from "next/link";
import { PriceNote, SectionHeader, WorkCard } from "@/components/ui";
import { FEES, WORKS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Obras y precios",
  description: "Las 12 obras en acero que diseñamos, con el precio de referencia de cada una.",
};

export default function ObrasPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <SectionHeader
        fig="FIG. 02 — Lista de precios"
        title="Obras en acero y lo que cuestan"
        lead={
          <>
            Cada tarjeta muestra el precio por unidad y un proyecto típico con el lenguaje más
            sencillo. Abre una obra para ver su anatomía y cómo cambia el precio con cada lenguaje,
            o configúrala a tu medida en el <Link href="/estudio" className="text-accent hover:underline">estudio</Link>.
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WORKS.map((w, i) => (
          <WorkCard key={w.id} work={w} index={i} />
        ))}
      </div>

      <aside className="corner mt-10 grid gap-6 border border-border bg-panel p-6 md:grid-cols-[1fr_2fr]">
        <div>
          <p className="fig mb-2">Cómo leer estos precios</p>
          <PriceNote />
        </div>
        <ul className="grid gap-2 text-sm text-muted">
          <li>· Acero suministrado, fabricado e instalado por kilo, según el tamaño y el detalle de la pieza.</li>
          <li>· Acabado, complementos (madera, vidrio, LED…) y movilización a obra.</li>
          <li>
            · {FEES.contingencyPct}% de imprevistos, {FEES.designFeePct}% de diseño y dirección de AceroStudio e IVA del{" "}
            {FEES.ivaPct}%.
          </li>
          <li>· No incluye diseño estructural firmado, licencias ni obra civil. Rango de −{FEES.bandLowPct}% a +{FEES.bandHighPct}%.</li>
        </ul>
      </aside>
    </main>
  );
}
