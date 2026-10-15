import RedesignTool from "@/components/RedesignTool";

export default function Home() {
  return (
    <main className="flex-1 px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
          FIG. 01 — Herramienta de rediseño
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold mb-3">
          Rediseña tu espacio o producto con IA
        </h1>
        <p className="text-muted">
          Sube una foto real, elige un estilo y recibe una propuesta generada
          en segundos. Luego cotiza directo con nuestro equipo.
        </p>
      </div>
      <RedesignTool />
    </main>
  );
}
