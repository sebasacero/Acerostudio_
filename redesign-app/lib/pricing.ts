import type { Complement, Fees, Finish, Material, Range, Tradition, Work } from "./types.ts";

export interface Selection {
  work: Work;
  material: Material;
  finish: Finish;
  tradition: Tradition;
  quantity: number;
  optionalComplementIds: string[];
  fireProtection: boolean;
}

export interface PricingCatalog {
  complements: Record<string, Complement>;
  fireFinish: Finish;
  fees: Fees;
}

export interface LineItem {
  key: string;
  label: string;
  detail: string;
  formula: string;
  amount: number;
}

export interface Estimate {
  lines: LineItem[];
  construction: number;
  contingency: number;
  designFee: number;
  iva: number;
  central: number;
  total: Range;
  perUnit: Range;
  steelKg: number;
  ratePerKg: number;
  days: Range;
}

export const mid = (r: Range) => (r.low + r.high) / 2;

const lerp = (r: Range, t: number) => r.low + (r.high - r.low) * Math.min(1, Math.max(0, t));

const num = (n: number, digits = 1) => n.toLocaleString("es-CO", { maximumFractionDigits: digits });

const cop = (n: number) => `$${Math.round(n).toLocaleString("es-CO")}`;

const u = (unit: string) => (unit === "m2" ? "m²" : unit);

// Precio por kg fabricado e instalado (incluye anticorrosivo base, transporte y montaje).
// La franja depende del tamaño y del detalle de la pieza: estructura repetitiva abajo,
// carpintería metálica fina y a la vista arriba.
export function installedRate(work: Work, material: Material) {
  return lerp(material.installedPerKg, work.fabricationGrade);
}

export function estimate(sel: Selection, catalog: PricingCatalog): Estimate {
  const { work, material, finish, tradition, quantity } = sel;
  const { fees } = catalog;
  const lines: LineItem[] = [];

  const kgPerUnit = mid(work.kgPerUnit);
  const steelKg = kgPerUnit * quantity;
  const rate = installedRate(work, material);
  const steel = steelKg * rate;
  lines.push({
    key: "steel",
    label: `Estructura en ${material.short}`,
    detail: `${num(steelKg, 0)} kg fabricados e instalados`,
    formula: `${num(kgPerUnit)} kg/${u(work.unit)} × ${num(quantity)} ${u(work.unit)} × ${cop(rate)}/kg`,
    amount: steel,
  });

  if (tradition.complexityFactor > 1) {
    const pct = tradition.complexityFactor - 1;
    lines.push({
      key: "craft",
      label: `Oficio · ${tradition.name}`,
      detail: `+${Math.round(pct * 100)}% de taller por precisión y detalle`,
      formula: `${cop(steel)} × ${num(pct * 100, 0)}%`,
      amount: steel * pct,
    });
  }

  const area = work.finishAreaPerUnit * quantity;
  const finishPrice = mid(finish.price);
  const finishCost = finish.unit === "kg" ? steelKg * finishPrice : area * finishPrice;
  lines.push({
    key: "finish",
    label: `Acabado · ${finish.name}`,
    detail: finish.unit === "kg" ? `sobre ${num(steelKg, 0)} kg` : `${num(area)} m² de superficie`,
    formula:
      finish.unit === "kg"
        ? `${num(steelKg, 0)} kg × ${cop(finishPrice)}/kg`
        : `${num(area)} m² × ${cop(finishPrice)}/m²`,
    amount: finishCost,
  });

  if (sel.fireProtection && work.fireProtectionApplies) {
    const firePrice = mid(catalog.fireFinish.price);
    lines.push({
      key: "fire",
      label: `Protección al fuego · ${catalog.fireFinish.name}`,
      detail: `${num(area)} m² de superficie`,
      formula: `${num(area)} m² × ${cop(firePrice)}/m²`,
      amount: area * firePrice,
    });
  }

  for (const wc of work.complements) {
    if (wc.optional && !sel.optionalComplementIds.includes(wc.id)) continue;
    const c = catalog.complements[wc.id];
    if (!c) continue;
    const qty = wc.qtyPerUnit * quantity;
    const price = mid(c.price);
    lines.push({
      key: `complement:${c.id}`,
      label: c.name,
      detail: `${num(qty)} ${u(c.unit)}`,
      formula: `${num(wc.qtyPerUnit, 2)} ${u(c.unit)}/${u(work.unit)} × ${num(quantity)} ${u(work.unit)} × ${cop(price)}/${u(c.unit)}`,
      amount: qty * price,
    });
  }

  lines.push({
    key: "mobilization",
    label: "Movilización, izaje y puesta en obra",
    detail: "costo fijo por obra",
    formula: `${cop(work.mobilization)} por obra`,
    amount: work.mobilization,
  });

  const construction = lines.reduce((s, l) => s + l.amount, 0);
  const contingency = construction * (fees.contingencyPct / 100);
  const designFee = construction * (fees.designFeePct / 100);
  const iva = (construction + contingency + designFee) * (fees.ivaPct / 100);
  const central = construction + contingency + designFee + iva;
  const total = { low: central * (1 - fees.bandLowPct / 100), high: central * (1 + fees.bandHighPct / 100) };

  const ratio = quantity / work.quantity.default;
  const dayScale = Math.max(0.6, Math.pow(ratio, 0.6));
  const days = {
    low: Math.max(1, Math.ceil(work.fabricationDays.low * dayScale)),
    high: Math.max(1, Math.ceil(work.fabricationDays.high * dayScale)),
  };

  return {
    lines,
    construction,
    contingency,
    designFee,
    iva,
    central,
    total,
    perUnit: { low: total.low / quantity, high: total.high / quantity },
    steelKg,
    ratePerKg: rate,
    days,
  };
}

export function roundCop(n: number): number {
  if (n >= 10_000_000) return Math.round(n / 100_000) * 100_000;
  if (n >= 1_000_000) return Math.round(n / 10_000) * 10_000;
  return Math.round(n / 1_000) * 1_000;
}

export function formatCop(n: number): string {
  return `$${roundCop(n).toLocaleString("es-CO")}`;
}

export function formatCopShort(n: number): string {
  const v = roundCop(n);
  if (v >= 1_000_000) return `$${(v / 1_000_000).toLocaleString("es-CO", { maximumFractionDigits: 1 })} M`;
  return `$${(v / 1_000).toLocaleString("es-CO", { maximumFractionDigits: 0 })} mil`;
}

export function formatRangeShort(r: Range): string {
  return `${formatCopShort(r.low)} – ${formatCopShort(r.high)}`;
}
