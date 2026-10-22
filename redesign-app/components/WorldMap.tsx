import Link from "next/link";
import { WORLD_DOTS_PATH, WORLD_DOT_STEP, WORLD_VIEWBOX } from "@/lib/data/world-map";
import { BOGOTA, arcPath, project } from "@/lib/geo";
import type { Tradition } from "@/lib/types";

export default function WorldMap({
  traditions,
  selectedId,
  className = "",
}: {
  traditions: Tradition[];
  selectedId?: string;
  className?: string;
}) {
  const origin = project(BOGOTA.lat, BOGOTA.lng);

  return (
    <svg
      viewBox={`0 0 ${WORLD_VIEWBOX.width} ${WORLD_VIEWBOX.height}`}
      className={`w-full h-auto ${className}`}
      role="group"
      aria-label="Mapa de las tradiciones arquitectónicas en acero, conectadas con Bogotá"
    >
      <path
        aria-hidden="true"
        d={WORLD_DOTS_PATH}
        fill="none"
        stroke="#4a443d"
        strokeWidth={1.05}
        strokeLinecap="round"
        strokeDasharray={`0 ${WORLD_DOT_STEP}`}
      />

      {traditions.map((t) => {
        const selected = t.id === selectedId;
        return (
          <path
            aria-hidden="true"
            key={`arc-${t.id}`}
            d={arcPath(BOGOTA, t)}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={selected ? 0.7 : 0.3}
            strokeOpacity={selected ? 0.95 : selectedId ? 0.12 : 0.3}
            strokeDasharray="2 2"
            className={selected ? "arc-flow" : undefined}
          />
        );
      })}

      {traditions.map((t) => {
        const p = project(t.lat, t.lng);
        const selected = t.id === selectedId;
        return (
          <Link key={t.id} href={`/atlas/${t.id}`} aria-label={t.name}>
            <circle cx={p.x} cy={p.y} r={5} fill="transparent" aria-hidden="true" />
            <circle
              cx={p.x}
              cy={p.y}
              r={selected ? 2.4 : 1.6}
              fill={selected ? "var(--accent)" : "#f4f1ec"}
              stroke="var(--background)"
              strokeWidth={0.5}
            />
            <title>{t.name}</title>
          </Link>
        );
      })}

      <g aria-hidden="true">
        <circle cx={origin.x} cy={origin.y} r={1.5} fill="var(--accent)" className="pulse-ring" fillOpacity={0.6} />
        <circle cx={origin.x} cy={origin.y} r={2} fill="var(--accent)" />
        <text
        x={origin.x + 3.5}
        y={origin.y + 1.2}
        fill="var(--accent)"
        fontSize={3.4}
        fontFamily="var(--font-jetbrains-mono), monospace"
        letterSpacing={0.3}
      >
          BOG · 2.600 m
        </text>
      </g>
    </svg>
  );
}
