import type { ReactNode } from "react";
import type { Unit } from "@/lib/types";

const STEEL_COLOR: Record<string, string> = {
  "acero-estructural": "#cfd3d6",
  "acero-corten": "#c0643a",
  "acero-galvanizado": "#9fb3c2",
  "acero-inox-304": "#eef3f6",
};
const WOOD = "#a0784f";
const GLASS = "rgba(0,229,255,0.18)";
const DIM = "var(--accent)";
const W = 400;
const H = 240;
const GROUND = 200;

function Dim({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g stroke={DIM} strokeWidth={0.6} fill={DIM}>
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} />
      <text x={(x1 + x2) / 2} y={y - 5} stroke="none" fontSize={8} textAnchor="middle" fontFamily="var(--font-jetbrains-mono), monospace">
        {label}
      </text>
    </g>
  );
}

function VDim({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) {
  return (
    <g stroke={DIM} strokeWidth={0.6} fill={DIM}>
      <line x1={x} y1={y1} x2={x} y2={y2} />
      <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} />
      <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} />
      <text x={x - 6} y={(y1 + y2) / 2} stroke="none" fontSize={8} textAnchor="end" dominantBaseline="middle" fontFamily="var(--font-jetbrains-mono), monospace">
        {label}
      </text>
    </g>
  );
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const fmt = (n: number) => n.toLocaleString("es-CO", { maximumFractionDigits: 1 });

function span(q: number, min: number, max: number, wMin = 120, wMax = 330) {
  const t = max > min ? (q - min) / (max - min) : 0.5;
  return wMin + (wMax - wMin) * Math.sqrt(Math.min(1, Math.max(0, t)));
}

export default function WorkDrawing({
  workId,
  materialId,
  quantity,
  unit,
  min,
  max,
  title,
}: {
  workId: string;
  materialId: string;
  quantity: number;
  unit: Unit;
  min: number;
  max: number;
  title: string;
}) {
  const s = STEEL_COLOR[materialId] ?? STEEL_COLOR["acero-estructural"];
  const u = unit === "m2" ? "m²" : unit;
  const label = `${fmt(quantity)} ${u}`;
  const w = span(quantity, min, max);
  const x0 = (W - w) / 2;
  const x1 = x0 + w;
  let body: ReactNode = null;

  switch (workId) {
    case "barra-cafe": {
      const n = Math.max(2, Math.round(quantity) + 1);
      const top = 120;
      body = (
        <>
          <rect x={x0 - 4} y={top - 8} width={w + 8} height={8} fill={WOOD} />
          <rect x={x0} y={top} width={w} height={GROUND - top} fill="none" stroke={s} strokeWidth={1.4} />
          {range(n).map((i) => {
            const x = x0 + (w * i) / (n - 1);
            return <line key={i} x1={x} y1={top} x2={x} y2={GROUND} stroke={s} strokeWidth={1.2} />;
          })}
          {range(Math.floor(w / 9)).map((i) =>
            range(6).map((j) => <circle key={`${i}-${j}`} cx={x0 + 6 + i * 9} cy={top + 14 + j * 11} r={1.1} fill={s} opacity={0.55} />),
          )}
          <Dim x1={x0} x2={x1} y={top - 22} label={label} />
          <VDim x={x0 - 14} y1={top - 8} y2={GROUND} label="1,05 m" />
        </>
      );
      break;
    }
    case "fachada-celosia": {
      const top = 40;
      const n = Math.round(w / 9);
      body = (
        <>
          <rect x={x0} y={top} width={w} height={GROUND - top} fill="none" stroke={s} strokeWidth={1.6} />
          {range(n).map((i) => (
            <rect key={i} x={x0 + 4 + i * 9} y={top + 3} width={3} height={GROUND - top - 6} fill={s} opacity={0.75} />
          ))}
          <line x1={x0} y1={top + (GROUND - top) / 2} x2={x1} y2={top + (GROUND - top) / 2} stroke={s} strokeWidth={1.2} />
          <Dim x1={x0} x2={x1} y={top - 12} label={label} />
        </>
      );
      break;
    }
    case "pergola": {
      const top = 90;
      const posts = Math.max(2, Math.round(w / 110) + 1);
      body = (
        <>
          {range(posts).map((i) => {
            const x = x0 + (w * i) / (posts - 1);
            return <rect key={i} x={x - 3} y={top} width={6} height={GROUND - top} fill={s} />;
          })}
          <rect x={x0 - 14} y={top - 10} width={w + 28} height={10} fill={s} />
          {range(Math.round((w + 28) / 12)).map((i) => (
            <rect key={i} x={x0 - 12 + i * 12} y={top - 20} width={5} height={8} fill={s} opacity={0.8} />
          ))}
          <Dim x1={x0} x2={x1} y={top - 32} label={label} />
          <VDim x={x0 - 22} y1={top - 10} y2={GROUND} label="2,8 m" />
        </>
      );
      break;
    }
    case "mezzanine": {
      const deck = 110;
      const cols = Math.max(2, Math.round(w / 100) + 1);
      body = (
        <>
          <rect x={x0} y={deck} width={w} height={8} fill="#5f5a54" />
          <rect x={x0} y={deck + 8} width={w} height={10} fill="none" stroke={s} strokeWidth={1.4} />
          {range(cols).map((i) => {
            const x = x0 + (w * i) / (cols - 1);
            return <rect key={i} x={x - 3} y={deck + 18} width={6} height={GROUND - deck - 18} fill={s} />;
          })}
          <line x1={x0} y1={deck - 30} x2={x1} y2={deck - 30} stroke={s} strokeWidth={1.2} />
          {range(Math.round(w / 40) + 1).map((i) => (
            <line key={i} x1={x0 + i * 40} y1={deck - 30} x2={x0 + i * 40} y2={deck} stroke={s} strokeWidth={0.8} />
          ))}
          <line x1={x1 + 6} y1={deck} x2={x1 + 50} y2={GROUND} stroke={s} strokeWidth={2} />
          <Dim x1={x0} x2={x1} y={deck - 42} label={label} />
          <VDim x={x0 - 14} y1={deck} y2={GROUND} label="2,6 m" />
        </>
      );
      break;
    }
    case "escalera": {
      const steps = 14;
      const sx = 120;
      const sy = GROUND;
      const run = 12;
      const rise = 10;
      body = (
        <>
          {range(steps).map((i) => (
            <rect key={i} x={sx + i * run} y={sy - (i + 1) * rise} width={run + 2} height={3} fill={WOOD} />
          ))}
          <line x1={sx} y1={sy} x2={sx + steps * run} y2={sy - steps * rise} stroke={s} strokeWidth={3} />
          <line x1={sx} y1={sy - 36} x2={sx + steps * run} y2={sy - steps * rise - 36} stroke={s} strokeWidth={1.2} />
          {range(5).map((i) => {
            const x = sx + (i * steps * run) / 4;
            const y = sy - (i * steps * rise) / 4;
            return <line key={i} x1={x} y1={y} x2={x} y2={y - 36} stroke={s} strokeWidth={0.8} />;
          })}
          <VDim x={sx - 14} y1={sy - steps * rise} y2={sy} label="3,0 m" />
          <text x={W - 40} y={40} fill={DIM} fontSize={9} textAnchor="end" fontFamily="var(--font-jetbrains-mono), monospace">
            × {fmt(quantity)} tramo{quantity === 1 ? "" : "s"}
          </text>
        </>
      );
      break;
    }
    case "kiosko-modular": {
      const kx = 120;
      const kw = 160;
      const top = 80;
      body = (
        <>
          <rect x={kx - 20} y={top - 10} width={kw + 40} height={10} fill={s} />
          <rect x={kx} y={top} width={kw} height={GROUND - top} fill="none" stroke={s} strokeWidth={1.6} />
          <rect x={kx + 14} y={top + 20} width={kw - 28} height={45} fill={GLASS} stroke={s} strokeWidth={0.8} />
          <rect x={kx + 10} y={top + 65} width={kw - 20} height={6} fill={WOOD} />
          {range(8).map((i) => (
            <line key={i} x1={kx + 10 + i * 20} y1={top + 80} x2={kx + 10 + i * 20} y2={GROUND - 4} stroke={s} strokeWidth={0.6} opacity={0.6} />
          ))}
          <VDim x={kx - 30} y1={top - 10} y2={GROUND} label="3,0 m" />
          <text x={W - 40} y={40} fill={DIM} fontSize={9} textAnchor="end" fontFamily="var(--font-jetbrains-mono), monospace">
            × {fmt(quantity)} módulo{quantity === 1 ? "" : "s"}
          </text>
        </>
      );
      break;
    }
    case "estanteria": {
      const top = 50;
      const bays = Math.max(1, Math.round(quantity));
      body = (
        <>
          {range(bays + 1).map((i) => {
            const x = x0 + (w * i) / bays;
            return <line key={i} x1={x} y1={top} x2={x} y2={GROUND} stroke={s} strokeWidth={1.6} />;
          })}
          {range(5).map((j) => (
            <rect key={j} x={x0} y={top + 6 + j * 34} width={w} height={4} fill={WOOD} />
          ))}
          <Dim x1={x0} x2={x1} y={top - 12} label={label} />
          <VDim x={x0 - 14} y1={top} y2={GROUND} label="2,1 m" />
        </>
      );
      break;
    }
    case "mesa": {
      const tx = 130;
      const tw = 140;
      const top = 130;
      body = (
        <>
          <rect x={tx - 10} y={top - 6} width={tw + 20} height={6} fill={WOOD} />
          <path d={`M${tx} ${top} L${tx + 18} ${GROUND} M${tx + tw} ${top} L${tx + tw - 18} ${GROUND}`} stroke={s} strokeWidth={2.4} />
          <line x1={tx + 9} y1={top + 40} x2={tx + tw - 9} y2={top + 40} stroke={s} strokeWidth={1.2} />
          <Dim x1={tx - 10} x2={tx + tw + 10} y={top - 18} label="1,2 m" />
          <VDim x={tx - 24} y1={top - 6} y2={GROUND} label="0,75 m" />
          <text x={W - 40} y={40} fill={DIM} fontSize={9} textAnchor="end" fontFamily="var(--font-jetbrains-mono), monospace">
            × {fmt(quantity)} mesa{quantity === 1 ? "" : "s"}
          </text>
        </>
      );
      break;
    }
    case "baranda": {
      const top = 110;
      const posts = Math.max(2, Math.round(w / 40) + 1);
      body = (
        <>
          <line x1={x0} y1={top} x2={x1} y2={top} stroke={s} strokeWidth={3} />
          {range(posts).map((i) => {
            const x = x0 + (w * i) / (posts - 1);
            return <line key={i} x1={x} y1={top} x2={x} y2={GROUND} stroke={s} strokeWidth={2} />;
          })}
          {range(Math.round(w / 10)).map((i) => (
            <line key={i} x1={x0 + 5 + i * 10} y1={top + 8} x2={x0 + 5 + i * 10} y2={GROUND - 8} stroke={s} strokeWidth={0.7} opacity={0.7} />
          ))}
          <Dim x1={x0} x2={x1} y={top - 14} label={label} />
          <VDim x={x0 - 14} y1={top} y2={GROUND} label="1,0 m" />
        </>
      );
      break;
    }
    case "porton": {
      const top = 50;
      const pw = Math.min(260, w);
      const px = (W - pw) / 2;
      body = (
        <>
          <rect x={px} y={top} width={pw} height={GROUND - top} fill="none" stroke={s} strokeWidth={2.4} />
          {range(Math.round(pw / 14)).map((i) => (
            <rect key={i} x={px + 6 + i * 14} y={top + 6} width={6} height={GROUND - top - 12} fill={s} opacity={0.6} />
          ))}
          <circle cx={px + pw * 0.3} cy={top} r={4} fill="none" stroke={DIM} strokeWidth={0.8} />
          <circle cx={px + pw * 0.3} cy={GROUND} r={4} fill="none" stroke={DIM} strokeWidth={0.8} />
          <line x1={px + pw * 0.3} y1={top} x2={px + pw * 0.3} y2={GROUND} stroke={DIM} strokeWidth={0.5} strokeDasharray="3 3" />
          <Dim x1={px} x2={px + pw} y={top - 12} label={label} />
        </>
      );
      break;
    }
    case "senaletica-corten": {
      const top = 60;
      body = (
        <>
          <rect x={90} y={top} width={220} height={80} fill="none" stroke={s} strokeWidth={2} />
          <text x={200} y={top + 54} textAnchor="middle" fontSize={40} fontWeight={700} fill="none" stroke={s} strokeWidth={1.2} letterSpacing={6}>
            ACERO
          </text>
          <line x1={140} y1={top + 80} x2={140} y2={GROUND} stroke={s} strokeWidth={3} />
          <line x1={260} y1={top + 80} x2={260} y2={GROUND} stroke={s} strokeWidth={3} />
          <Dim x1={90} x2={310} y={top - 12} label="≈1,6 m" />
          <text x={W - 40} y={30} fill={DIM} fontSize={9} textAnchor="end" fontFamily="var(--font-jetbrains-mono), monospace">
            × {fmt(quantity)} letrero{quantity === 1 ? "" : "s"}
          </text>
        </>
      );
      break;
    }
    case "marquesina": {
      const wall = 90;
      const top = 110;
      const proj = Math.min(250, w * 0.8);
      body = (
        <>
          <rect x={wall - 12} y={30} width={12} height={GROUND - 30} fill="#3a3632" />
          <rect x={wall} y={top} width={proj} height={6} fill={s} />
          <rect x={wall} y={top - 4} width={proj} height={4} fill={GLASS} />
          <line x1={wall} y1={top - 60} x2={wall + proj * 0.85} y2={top} stroke={s} strokeWidth={1.2} />
          <Dim x1={wall} x2={wall + proj} y={top + 24} label={label} />
          <VDim x={wall - 22} y1={top} y2={GROUND} label="2,6 m" />
        </>
      );
      break;
    }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto max-h-[300px] w-full" role="img" aria-label={`Esquema de ${title}, ${label}`}>
      <defs>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#4a443d" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x={20} y={GROUND} width={W - 40} height={8} fill="url(#hatch)" />
      <line x1={20} y1={GROUND} x2={W - 20} y2={GROUND} stroke="#6b645c" strokeWidth={0.8} />
      {body}
    </svg>
  );
}
