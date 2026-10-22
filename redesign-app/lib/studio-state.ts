import {
  BASELINE_TRADITION,
  FINISH_BY_ID,
  MATERIAL_BY_ID,
  TRADITION_BY_ID,
  WORKS,
  WORK_BY_ID,
  pickFinish,
  pickMaterial,
} from "./catalog.ts";
import type { Selection } from "./pricing.ts";

export interface StudioState {
  workId: string;
  traditionId: string;
  materialId: string;
  finishId: string;
  quantity: number;
  extras: string[];
  fire: boolean;
}

type Params = { get(name: string): string | null };

export function clampQuantity(workId: string, q: number): number {
  const { min, max, step } = WORK_BY_ID[workId].quantity;
  if (!Number.isFinite(q)) return WORK_BY_ID[workId].quantity.default;
  const snapped = Math.round((q - min) / step) * step + min;
  return Math.min(max, Math.max(min, +snapped.toFixed(2)));
}

export function initialState(workId?: string, traditionId?: string): StudioState {
  const work = WORK_BY_ID[workId ?? ""] ?? WORKS[0];
  const tradition = TRADITION_BY_ID[traditionId ?? ""] ?? BASELINE_TRADITION;
  // Mismo material que el "proyecto típico" del catálogo; el del lenguaje se adopta a pedido.
  const material = MATERIAL_BY_ID[work.defaultMaterialId] ?? pickMaterial(work, tradition);
  return {
    workId: work.id,
    traditionId: tradition.id,
    materialId: material.id,
    finishId: pickFinish(work, material, tradition).id,
    quantity: work.quantity.default,
    extras: [],
    fire: false,
  };
}

export function parseState(params: Params): StudioState {
  const base = initialState(params.get("obra") ?? undefined, params.get("lenguaje") ?? undefined);
  const work = WORK_BY_ID[base.workId];
  const tradition = TRADITION_BY_ID[base.traditionId];

  const materialId = params.get("material");
  const material =
    materialId && work.materialIds.includes(materialId) ? MATERIAL_BY_ID[materialId] : MATERIAL_BY_ID[base.materialId];

  const finishId = params.get("acabado");
  const finish =
    finishId && material.finishIds.includes(finishId) ? FINISH_BY_ID[finishId] : pickFinish(work, material, tradition);

  const q = params.get("cantidad");
  let state: StudioState = {
    workId: work.id,
    traditionId: tradition.id,
    materialId: material.id,
    finishId: finish.id,
    quantity: q === null || q.trim() === "" ? work.quantity.default : clampQuantity(work.id, Number(q)),
    extras: [],
    fire: work.fireProtectionApplies && params.get("fuego") === "1",
  };
  for (const id of (params.get("extras") ?? "").split(",")) {
    state = reduce(state, { type: "extra", id, on: true });
  }
  return state;
}

export function serializeState(s: StudioState): string {
  const p = new URLSearchParams();
  p.set("obra", s.workId);
  p.set("lenguaje", s.traditionId);
  p.set("material", s.materialId);
  p.set("acabado", s.finishId);
  p.set("cantidad", String(s.quantity));
  if (s.extras.length) p.set("extras", s.extras.join(","));
  if (s.fire) p.set("fuego", "1");
  return p.toString();
}

export type StudioAction =
  | { type: "work"; workId: string }
  | { type: "tradition"; traditionId: string; adoptMaterial?: boolean }
  | { type: "material"; materialId: string }
  | { type: "finish"; finishId: string }
  | { type: "quantity"; quantity: number }
  | { type: "extra"; id: string; on: boolean }
  | { type: "fire"; on: boolean };

export function reduce(s: StudioState, a: StudioAction): StudioState {
  const work = WORK_BY_ID[s.workId];
  const tradition = TRADITION_BY_ID[s.traditionId];
  switch (a.type) {
    case "work":
      return WORK_BY_ID[a.workId] ? initialState(a.workId, s.traditionId) : s;
    case "tradition": {
      const t = TRADITION_BY_ID[a.traditionId];
      if (!t) return s;
      if (!a.adoptMaterial) return { ...s, traditionId: t.id };
      const material = pickMaterial(work, t);
      return { ...s, traditionId: t.id, materialId: material.id, finishId: pickFinish(work, material, t).id };
    }
    case "material": {
      if (!work.materialIds.includes(a.materialId)) return s;
      const material = MATERIAL_BY_ID[a.materialId];
      const finishId = material.finishIds.includes(s.finishId) ? s.finishId : pickFinish(work, material, tradition).id;
      return { ...s, materialId: material.id, finishId };
    }
    case "finish":
      return MATERIAL_BY_ID[s.materialId].finishIds.includes(a.finishId) ? { ...s, finishId: a.finishId } : s;
    case "quantity":
      return { ...s, quantity: clampQuantity(s.workId, a.quantity) };
    case "extra": {
      const wc = work.complements.find((c) => c.id === a.id && c.optional);
      if (!wc) return s;
      if (!a.on) return { ...s, extras: s.extras.filter((x) => x !== a.id) };
      const sameGroup = new Set(
        wc.group ? work.complements.filter((c) => c.group === wc.group && c.id !== wc.id).map((c) => c.id) : [],
      );
      return { ...s, extras: [...s.extras.filter((x) => !sameGroup.has(x) && x !== a.id), a.id] };
    }
    case "fire":
      return { ...s, fire: work.fireProtectionApplies && a.on };
  }
}

export function toSelection(s: StudioState): Selection {
  return {
    work: WORK_BY_ID[s.workId],
    tradition: TRADITION_BY_ID[s.traditionId],
    material: MATERIAL_BY_ID[s.materialId],
    finish: FINISH_BY_ID[s.finishId],
    quantity: s.quantity,
    optionalComplementIds: s.extras,
    fireProtection: s.fire,
  };
}
