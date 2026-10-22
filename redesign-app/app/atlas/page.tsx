import type { Metadata } from "next";
import WorldMap from "@/components/WorldMap";
import { SectionHeader, TraditionCard } from "@/components/ui";
import { TRADITIONS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Atlas del acero",
  description: "Doce tradiciones arquitectónicas del mundo, leídas desde sus detalles en acero.",
};

export default function AtlasPage() {
  const sorted = [...TRADITIONS].sort((a, b) => a.lng - b.lng);
  return (
    <main>
      <section className="blueprint border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionHeader
            fig="FIG. 04 — Atlas del acero"
            title="Doce maneras de construir con acero"
            lead="Cada tradición es un lenguaje de detalle: cómo une, cómo pliega, cómo envejece. Elige una y aplícala a cualquier obra; el precio refleja el oficio que exige."
          />
          <WorldMap traditions={TRADITIONS} />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((t, i) => (
            <TraditionCard key={t.id} tradition={t} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
