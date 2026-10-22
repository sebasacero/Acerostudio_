import {
  BOGOTA_NOTES,
  CODE_NOTES,
  COMPLEMENTS,
  CONNECTIONS,
  FINISHES,
  MATERIALS,
  PRICING_META,
  PROFILES,
  WORKS,
} from "./data/catalog-data.ts";
import { TRADITIONS } from "./data/traditions.ts";
import { estimate, type Estimate, type PricingCatalog, type Selection } from "./pricing.ts";
import type { Fees, Finish, Material, Tradition, Work } from "./types.ts";

export { BOGOTA_NOTES, CODE_NOTES, COMPLEMENTS, CONNECTIONS, FINISHES, MATERIALS, PRICING_META, PROFILES, TRADITIONS, WORKS };

export const FEES: Fees = {
  ivaPct: 19,
  designFeePct: 8,
  contingencyPct: 10,
  bandLowPct: 20,
  bandHighPct: 30,
};

// Sin prototipo: ids que vienen de la URL como "constructor" o "toString" no deben resolver.
const byId = <T extends { id: string }>(list: T[]) =>
  Object.assign(Object.create(null), Object.fromEntries(list.map((x) => [x.id, x]))) as Record<string, T>;

export const WORK_BY_ID = byId(WORKS);
export const MATERIAL_BY_ID = byId(MATERIALS);
export const FINISH_BY_ID = byId(FINISHES);
export const COMPLEMENT_BY_ID = byId(COMPLEMENTS);
export const TRADITION_BY_ID = byId(TRADITIONS);
export const CONNECTION_BY_ID = byId(CONNECTIONS);

export const PRICING_CATALOG: PricingCatalog = {
  complements: COMPLEMENT_BY_ID,
  fireFinish: FINISH_BY_ID["intumescente"],
  fees: FEES,
};

export const UNIT_LABEL: Record<Work["unit"], { short: string; long: string }> = {
  ml: { short: "ml", long: "metro lineal" },
  m2: { short: "m²", long: "metro cuadrado" },
  und: { short: "und", long: "unidad" },
};

// Tradición más neutra (menor factor de oficio): base de comparación para "precio desde".
export const BASELINE_TRADITION: Tradition = TRADITIONS.reduce((a, b) =>
  b.complexityFactor < a.complexityFactor ? b : a,
);

export function finishesFor(material: Material): Finish[] {
  return material.finishIds.map((id) => FINISH_BY_ID[id]).filter(Boolean);
}

export function materialsFor(work: Work): Material[] {
  return work.materialIds.map((id) => MATERIAL_BY_ID[id]).filter(Boolean);
}

export function pickMaterial(work: Work, tradition?: Tradition): Material {
  const preferred = tradition?.preferredMaterialIds.find((id) => work.materialIds.includes(id));
  return MATERIAL_BY_ID[preferred ?? work.defaultMaterialId] ?? materialsFor(work)[0];
}

export function pickFinish(work: Work, material: Material, tradition?: Tradition): Finish {
  const allowed = material.finishIds;
  if (allowed.includes(work.defaultFinishId)) return FINISH_BY_ID[work.defaultFinishId];
  const preferred = tradition?.preferredFinishIds.find((id) => allowed.includes(id));
  return FINISH_BY_ID[preferred ?? allowed[0]];
}

export function defaultSelection(work: Work, tradition: Tradition = BASELINE_TRADITION): Selection {
  const material = MATERIAL_BY_ID[work.defaultMaterialId] ?? pickMaterial(work, tradition);
  return {
    work,
    material,
    finish: pickFinish(work, material, tradition),
    tradition,
    quantity: work.quantity.default,
    optionalComplementIds: [],
    fireProtection: false,
  };
}

export function estimateFor(sel: Selection): Estimate {
  return estimate(sel, PRICING_CATALOG);
}

export function typicalEstimate(work: Work, tradition: Tradition = BASELINE_TRADITION): Estimate {
  return estimateFor(defaultSelection(work, tradition));
}
