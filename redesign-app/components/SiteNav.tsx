"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const NAV_LINKS = [
  { href: "/atlas", label: "Atlas" },
  { href: "/obras", label: "Obras y precios" },
  { href: "/detalles", label: "Detalles" },
  { href: "/estudio", label: "Estudio" },
];

export function NavLinks({ active, onNavigate }: { active?: string | null; onNavigate?: () => void }) {
  return (
    <>
      {NAV_LINKS.map((l) => {
        const isActive = active ? active === l.href || active.startsWith(`${l.href}/`) : false;
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={`font-mono text-[0.72rem] uppercase tracking-[0.14em] transition-colors ${
              isActive ? "text-accent" : "text-muted hover:text-foreground"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </>
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="hidden md:flex items-center gap-7" aria-label="Principal">
        <NavLinks active={pathname} />
      </nav>
      <button
        type="button"
        className="md:hidden corner border border-border px-3 py-2 font-mono text-[0.7rem] uppercase tracking-widest text-muted"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Cerrar" : "Menú"}
      </button>
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Principal móvil"
          className="md:hidden absolute left-0 right-0 top-full z-50 flex flex-col gap-5 border-b border-border bg-background/95 px-4 py-6 backdrop-blur"
        >
          <NavLinks active={pathname} onNavigate={() => setOpen(false)} />
        </nav>
      )}
    </>
  );
}
