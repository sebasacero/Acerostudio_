import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FEES,
  FINISH_BY_ID,
  MATERIAL_BY_ID,
  TRADITIONS,
  WORKS,
  defaultSelection,
  estimateFor,
  finishesFor,
  materialsFor,
  pickFinish,
} from "./catalog.ts";
import type { Tradition } from "./types.ts";

const NEUTRAL: Tradition = { ...TRADITIONS[0], id: "neutral", name: "Neutral", complexityFactor: 1 };

test("catalog ids are consistent", () => {
  assert.equal(WORKS.length, 12);
  assert.equal(TRADITIONS.length, 12);
  for (const w of WORKS) {
    assert.ok(MATERIAL_BY_ID[w.defaultMaterialId], `${w.id}: default material`);
    assert.ok(FINISH_BY_ID[w.defaultFinishId], `${w.id}: default finish`);
    assert.ok(materialsFor(w).length === w.materialIds.length, `${w.id}: material ids`);
    assert.ok(w.quantity.min <= w.quantity.default && w.quantity.default <= w.quantity.max, `${w.id}: quantity`);
    assert.ok(w.kgPerUnit.low > 0 && w.kgPerUnit.low <= w.kgPerUnit.high, `${w.id}: kg range`);
    assert.ok(w.fabricationGrade >= 0 && w.fabricationGrade <= 1, `${w.id}: grade`);
    for (const m of materialsFor(w)) {
      assert.ok(finishesFor(m).length > 0, `${w.id}/${m.id}: has finishes`);
      assert.ok(m.finishIds.includes(pickFinish(w, m).id), `${w.id}/${m.id}: picked finish compatible`);
    }
  }
  for (const t of TRADITIONS) {
    assert.ok(t.complexityFactor >= 1 && t.complexityFactor <= 1.35, `${t.id}: factor`);
    for (const p of t.palette) assert.match(p.hex, /^#[0-9a-fA-F]{6}$/, `${t.id}: hex`);
  }
});

test("installed COP/kg always exceeds raw material COP/kg", () => {
  for (const m of Object.values(MATERIAL_BY_ID)) {
    assert.ok(m.installedPerKg.low > m.materialPerKg.low, m.id);
    assert.ok(m.installedPerKg.high > m.materialPerKg.high, m.id);
  }
});

test("fees, IVA and band are applied in order", () => {
  const e = estimateFor(defaultSelection(WORKS[0], NEUTRAL));
  const construction = e.lines.reduce((s, l) => s + l.amount, 0);
  assert.ok(Math.abs(construction - e.construction) < 1e-6);
  assert.ok(Math.abs(e.contingency - construction * FEES.contingencyPct / 100) < 1e-6);
  assert.ok(Math.abs(e.designFee - construction * FEES.designFeePct / 100) < 1e-6);
  assert.ok(Math.abs(e.iva - (construction + e.contingency + e.designFee) * FEES.ivaPct / 100) < 1e-6);
  assert.ok(Math.abs(e.central - (construction + e.contingency + e.designFee + e.iva)) < 1e-6);
  assert.ok(e.total.low < e.central && e.central < e.total.high);
  assert.ok(Math.abs(e.perUnit.low * WORKS[0].quantity.default - e.total.low) < 1e-6);
});

test("price grows with quantity while per-unit price falls (fixed mobilization)", () => {
  for (const w of WORKS) {
    const a = defaultSelection(w, NEUTRAL);
    const small = estimateFor({ ...a, quantity: w.quantity.min });
    const large = estimateFor({ ...a, quantity: w.quantity.max });
    assert.ok(large.central > small.central, w.id);
    if (w.quantity.max > w.quantity.min) assert.ok(large.perUnit.low < small.perUnit.low, w.id);
  }
});

test("complexity factor, optional complements and fire protection only add cost when they apply", () => {
  const w = WORKS.find((x) => x.fireProtectionApplies)!;
  const base = defaultSelection(w, NEUTRAL);
  const plain = estimateFor(base);
  const crafted = estimateFor({ ...base, tradition: { ...NEUTRAL, complexityFactor: 1.3 } });
  assert.ok(crafted.central > plain.central);
  assert.ok(crafted.lines.some((l) => l.key === "craft"));
  assert.ok(!plain.lines.some((l) => l.key === "craft"));

  const optional = w.complements.find((c) => c.optional);
  if (optional) {
    const withOpt = estimateFor({ ...base, optionalComplementIds: [optional.id] });
    assert.ok(withOpt.central > plain.central);
  }
  assert.ok(estimateFor({ ...base, fireProtection: true }).central > plain.central);

  const noFire = WORKS.find((x) => !x.fireProtectionApplies)!;
  const s = defaultSelection(noFire, NEUTRAL);
  assert.equal(estimateFor({ ...s, fireProtection: true }).central, estimateFor(s).central);
});

test("calibration: typical construction cost per unit lands inside the researched benchmark", () => {
  const report: string[] = [];
  let outside = 0;
  for (const w of WORKS) {
    const sel = { ...defaultSelection(w, NEUTRAL), material: MATERIAL_BY_ID[w.defaultMaterialId] };
    sel.finish = pickFinish(w, sel.material);
    const e = estimateFor(sel);
    const perUnit = e.construction / sel.quantity;
    const { low, high } = w.benchmarkPerUnit;
    const ok = perUnit >= low && perUnit <= high;
    if (!ok) outside++;
    report.push(
      `${ok ? "OK " : "OUT"} ${w.id.padEnd(18)} ${Math.round(perUnit).toLocaleString("es-CO").padStart(12)} /${w.unit}  bench ${low.toLocaleString("es-CO")}–${high.toLocaleString("es-CO")}`,
    );
  }
  console.log(report.join("\n"));
  assert.equal(outside, 0, "some works fall outside their benchmark");
});
