import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import SiteNav, { NavLinks } from "@/components/SiteNav";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "AceroStudio — Estudio de arquitectura en acero",
    template: "%s · AceroStudio",
  },
  description:
    "Estudio de arquitectura en acero desde Bogotá. Doce lenguajes constructivos del mundo, detalles en acero y el precio de cada obra antes de cotizar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CO"
      className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="no-print sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
          <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-lg font-semibold tracking-tight">ACERO</span>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent">studio</span>
            </Link>
            <Suspense
              fallback={
                <nav className="hidden md:flex items-center gap-7" aria-label="Principal">
                  <NavLinks />
                </nav>
              }
            >
              <SiteNav />
            </Suspense>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="no-print border-t border-border">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
            <div>
              <p className="fig mb-2">El Taller · Bogotá · 2.600 msnm</p>
              <p className="text-sm text-muted">
                Nacimos en el taller de herrería ornamental de la familia Acero. Hoy diseñamos
                arquitectura en acero con lo mejor del mundo y precios a la vista.
              </p>
            </div>
            <div className="text-sm text-muted">
              <p className="fig mb-2">Precios</p>
              <p>
                Rangos de referencia con IVA, calculados paramétricamente. Sujetos a visita técnica,
                diseño estructural y licencias cuando apliquen.
              </p>
            </div>
            <div className="text-sm text-muted">
              <p className="fig mb-2">Contacto</p>
              <p>hola@acerostudio.co</p>
              <p>instagram.com/acero.press</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
