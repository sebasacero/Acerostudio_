import { test } from "node:test";
import assert from "node:assert/strict";
import { MATERIAL_BY_ID, TRADITIONS, WORKS, WORK_BY_ID } from "./catalog.ts";
import { clampQuantity, initialState, parseState, reduce, serializeState } from "./studio-state.ts";

const params = (q: string) => new URLSearchParams(q);

test("round-trips through the URL", () => {
  for (const w of WORKS) {
    let s = initialState(w.id, TRADITIONS[3].id);
    const opt = w.complements.find((c) => c.optional);
    if (opt) s = reduce(s, { type: "extra", id: opt.id, on: true });
    s = reduce(s, { type: "quantity", quantity: w.quantity.max });
    if (w.fireProtectionApplies) s = reduce(s, { type: "fire", on: true });
    assert.deepEqual(parseState(params(serializeState(s))), s, w.id);
  }
});

test("rejects unknown or incompatible params instead of crashing", () => {
  const s = parseState(params("obra=nope&lenguaje=x&material=acero-inox-304&acabado=patina-corten&cantidad=abc&extras=foo,bar&fuego=1"));
  assert.equal(s.workId, WORKS[0].id);
  assert.ok(MATERIAL_BY_ID[s.materialId].finishIds.includes(s.finishId));
  assert.equal(s.quantity, WORKS[0].quantity.default);
  assert.deepEqual(s.extras, []);
  assert.equal(s.fire, WORKS[0].fireProtectionApplies);
});

test("quantity snaps to step and clamps to range", () => {
  const w = WORKS.find((x) => x.quantity.step !== 1) ?? WORKS[0];
  assert.equal(clampQuantity(w.id, w.quantity.max * 10), w.quantity.max);
  assert.equal(clampQuantity(w.id, -5), w.quantity.min);
  const q = clampQuantity(w.id, w.quantity.min + w.quantity.step * 0.6);
  assert.equal(q, +(w.quantity.min + w.quantity.step).toFixed(2));
});

test("changing material keeps a compatible finish", () => {
  for (const w of WORKS) {
    for (const mId of w.materialIds) {
      const s = reduce(initialState(w.id), { type: "material", materialId: mId });
      assert.ok(MATERIAL_BY_ID[mId].finishIds.includes(s.finishId), `${w.id}/${mId}`);
    }
  }
});

test("fire protection only sticks on works where it applies", () => {
  const noFire = WORKS.find((w) => !w.fireProtectionApplies)!;
  assert.equal(reduce(initialState(noFire.id), { type: "fire", on: true }).fire, false);
  const fire = WORKS.find((w) => w.fireProtectionApplies)!;
  assert.equal(reduce(initialState(fire.id), { type: "fire", on: true }).fire, true);
});

test("switching work resets work-specific choices", () => {
  const a = WORKS[0];
  const b = WORKS[1];
  let s = reduce(initialState(a.id), { type: "quantity", quantity: a.quantity.max });
  s = reduce(s, { type: "work", workId: b.id });
  assert.equal(s.quantity, WORK_BY_ID[b.id].quantity.default);
  assert.deepEqual(s.extras, []);
});
