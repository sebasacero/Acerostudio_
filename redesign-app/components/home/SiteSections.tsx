import Link from "next/link";
import { SectionHeader } from "@/components/ui";

const MARQUEE =
  "Taza #012.847 · Etiopía Yirgacheffe · 1:15 · 92°C · Colombia Huila · 抽出 / extracción · Brasil Cerrado · #aceropress50k · Bourbon Rosado · AeroPress Go™ · Pink Bourbon · ";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border" id="inicio">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-36">
        <p className="fig mb-4">FIG. 00 — Estudio de arquitectura en acero · Bogotá · 2.600 msnm</p>
        <h1 className="glow max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Diseña tu espacio. Con inteligencia, con acero, con precio a la vista.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          Doce lenguajes constructivos del mundo, cada detalle en acero explicado y el presupuesto
          de cada obra antes de pedir una cotización.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/estudio" className="btn-accent px-5 py-3 font-medium">
            Abrir el estudio →
          </Link>
          <Link href="/obras" className="corner border border-border px-5 py-3 hover:border-accent/50">
            Ver precios de obras
          </Link>
        </div>
      </div>
      <div className="hairline" aria-hidden="true" />
    </section>
  );
}

export function Marquee() {
  return (
    <div className="overflow-hidden border-b border-border bg-panel/60 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted" aria-hidden="true">
      <div className="whitespace-nowrap">{MARQUEE.repeat(3)}</div>
    </div>
  );
}

const TECH = [
  { tag: "Visión computacional", body: "Analiza la foto real de tu local y detecta zonas muertas y cuellos de botella." },
  { tag: "Flujo de clientes", body: "Mapas de calor de circulación para ubicar barra, mesas y zonas de alto tráfico." },
  { tag: "Generación 3D", body: "Propuestas visuales que respetan paredes, ventanas y columnas tal como están." },
  { tag: "72 h de diagnóstico", body: "Del diagnóstico a la propuesta en tres días, no en semanas." },
];

export function Tecnologia() {
  return (
    <section id="tecnologia" className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeader
        fig="FIG. 03 — Tecnología · IA aplicada"
        title={<>Tu espacio, diseñado <span className="text-accent">con inteligencia</span>.</>}
        lead="IA, datos y diseño al servicio de cada espacio. Del espacio físico a la presencia digital."
      />
      <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-4">
        {TECH.map((t) => (
          <div key={t.tag} className="bg-background p-6">
            <p className="font-mono text-xs text-accent">{t.tag}</p>
            <p className="mt-3 text-sm text-muted">{t.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-border bg-panel p-6">
        <div>
          <p className="fig mb-1">FIG. 00 — Cómo funciona</p>
          <p className="font-medium">Tu cafetería, reinventada antes de mover un ladrillo.</p>
          <p className="text-sm text-muted">Sube una foto, elige un estilo, la IA genera la propuesta y cotizas por WhatsApp.</p>
        </div>
        <Link href="/rediseno" className="btn-accent px-4 py-2.5 text-sm font-medium">
          Rediseño rápido →
        </Link>
      </div>
    </section>
  );
}

const B2B = [
  { t: "Cadenas y franquicias", b: "Estandarización de imagen e interiorismo para múltiples sedes. Análisis visual automatizado y propuestas conceptuales masivas." },
  { t: "Estudios de arquitectura", b: "Aceleración de anteproyectos con IA. Iteraciones estéticas rápidas y análisis de flujos comerciales para presentar a clientes." },
  { t: "Real estate y comercial", b: "Visualización de potencial para locales desocupados. Renders inmediatos para agilizar el arriendo o la venta." },
  { t: "Gastronomía y hospitality", b: "Optimización visual de barras, zonas de alto tráfico y comedores. Layouts técnicos para maximizar capacidad y experiencia." },
];

export function B2b() {
  return (
    <section id="b2b" className="border-y border-border blueprint">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeader
          fig="FIG. 05 — Servicios corporativos"
          title="Soluciones enterprise"
          lead="Infraestructura visual e inteligencia espacial para cadenas, firmas de arquitectura y desarrolladores que buscan acelerar la conversión de sus proyectos."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {B2B.map((x) => (
            <article key={x.t} className="corner border border-border bg-panel p-5">
              <h3 className="font-medium">{x.t}</h3>
              <p className="mt-2 text-sm text-muted">{x.b}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const POSTS = [
  { cat: "Arquitectura", t: "Los 6 principios de arquitectura que hacen que una cafetería se sienta bien", b: "Flujo de circulación, zonificación barra-mesas, acústica y luz natural definen la experiencia antes que cualquier elección de color." },
  { cat: "IA + Rediseño", t: "Cómo funciona un rediseño con IA: de la foto a la propuesta en 3 pasos", b: "Subes una foto real, eliges un estilo y la IA genera una propuesta manteniendo paredes, ventanas y columnas tal como están." },
  { cat: "Interiorismo", t: "Materiales que sí funcionan en un café de especialidad: acero, madera y concreto", b: "El acero visto resiste el uso diario y comunica honestidad de proceso; la madera cálida equilibra la frialdad del metal." },
  { cat: "Tendencias 2026", t: "Las 5 tendencias de diseño de interiores que van a dominar las cafeterías en 2026", b: "Minimalismo cálido, materiales honestos, iluminación circadiana y biofilia urbana lideran el cambio." },
];

export function Blog() {
  return (
    <section id="blog" className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeader fig="FIG. 06 — Contenido técnico" title="Conocimiento" lead="Arquitectura, interiorismo y rediseño con IA aplicados al café de especialidad, escrito desde Bogotá." />
      <div className="grid gap-4 md:grid-cols-2">
        {POSTS.map((p) => (
          <article key={p.t} className="border border-border bg-panel p-5">
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-accent">{p.cat}</p>
            <h3 className="mt-2 font-medium">{p.t}</h3>
            <p className="mt-2 text-sm text-muted">{p.b}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Instagram() {
  return (
    <section id="instagram" className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-10">
        <div>
          <p className="fig mb-1">Reto activo · #aceropress50k</p>
          <p className="text-muted">50.000 tazas, un método de extracción: AeroPress. Sigue el reto en Instagram.</p>
        </div>
        <a
          href="https://instagram.com/acero.press"
          target="_blank"
          rel="noopener noreferrer"
          className="corner border border-border px-4 py-2 font-mono text-xs uppercase tracking-widest hover:border-accent/50"
        >
          @acero.press →
        </a>
      </div>
    </section>
  );
}
