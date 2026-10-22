import type { Metadata } from "next";
import { Suspense } from "react";
import Studio from "@/components/studio/Studio";

export const metadata: Metadata = {
  title: "Estudio",
  description: "Configura tu obra en acero: lenguaje del mundo, material, acabado y medidas, con presupuesto en vivo.",
};

function StudioFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <p className="fig mb-2">Estudio de detalle en acero</p>
      <p className="text-muted">Preparando la mesa de trabajo…</p>
    </div>
  );
}

export default function EstudioPage() {
  return (
    <main>
      <Suspense fallback={<StudioFallback />}>
        <Studio />
      </Suspense>
    </main>
  );
}
