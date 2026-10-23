import type { Metadata } from "next";
import RedesignTool from "@/components/RedesignTool";

export const metadata: Metadata = {
  title: "Rediseño rápido con IA",
  description: "Sube una foto de tu cafetería o de tu producto, elige un estilo y recibe una propuesta generada con IA.",
};

export default function RedisenoPage() {
  return (
    <main className="px-4 py-12 md:py-20">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <p className="fig mb-3">FIG. R — Rediseño rápido</p>
        <h1 className="mb-3 text-3xl font-semibold md:text-4xl">Rediseña tu espacio o producto con IA</h1>
        <p className="text-muted">
          Sube una foto real, elige un estilo y recibe una propuesta generada en segundos. Luego
          cotiza directo con nuestro equipo.
        </p>
      </div>
      <div className="mx-auto mb-8 max-w-3xl overflow-hidden border border-border">
        <video className="h-56 w-full object-cover opacity-80" src="/rediseno.mp4" autoPlay muted loop playsInline aria-hidden="true" />
      </div>
      <RedesignTool />
    </main>
  );
}
