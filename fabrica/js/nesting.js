// Optimización de corte (nesting).
// - Barras (1D): por perfil, acomoda las piezas en barras comerciales de 6 y 12 m con mejor ajuste
//   decreciente, descontando el espesor de la sierra (kerf) y los despuntes; los retazos útiles (≥ 1 m)
//   vuelven al almacén como retal con su código.
// - Chapas (2D): por espesor, acomoda las placas en láminas de 3000 × 1500 mm por estantes, con giro de 90°
//   y separación para la antorcha de plasma o el láser.
export const BAR_STOCK = [12000, 6000];
export const SHEET = { w: 3000, h: 1500 };

export function nestBars(despiece, { stock = BAR_STOCK, kerf = 3, trim = 10, retalMin = 1000, retales = [] } = {}) {
  const byProfile = {};
  for (const m of despiece.marcas) for (const id of m.units) (byProfile[m.profile] ||= []).push({ id, mark: m.mark, len: m.length, kgm: m.kgm });
  const barras = [];
  for (const [profile, items] of Object.entries(byProfile)) {
    items.sort((a, b) => b.len - a.len);
    const open = [];
    // Retales del almacén primero (se gastan antes de abrir barra nueva).
    for (const r of retales.filter((r) => r.profile === profile)) open.push({ profile, stock: r.len, retal: r.id, cuts: [], used: trim });
    for (const it of items) {
      const need = it.len + kerf;
      let best = null;
      for (const b of open) { const free = b.stock - b.used; if (free >= need && (!best || free < best.stock - best.used)) best = b; }
      if (!best) {
        const L = Math.max(...stock);
        if (need + trim > L) throw new Error(`La pieza ${it.id} (${it.len} mm) no cabe en una barra de ${L} mm`);
        best = { profile, stock: L, cuts: [], used: trim };
        open.push(best);
      }
      best.cuts.push({ id: it.id, mark: it.mark, len: it.len, at: best.used });
      best.used += need;
    }
    // Barra más corta posible para cada patrón.
    for (const b of open) {
      if (!b.cuts.length) continue;
      if (!b.retal) b.stock = [...stock].sort((x, y) => x - y).find((s) => s >= b.used) || b.stock;
      const sobra = b.stock - b.used;
      b.retalSale = sobra >= retalMin ? { len: sobra, id: `R-${profile}-${sobra}` } : null;
      b.desperdicio = b.retalSale ? 0 : sobra;
      b.kgm = items[0].kgm;
      barras.push(b);
    }
  }
  barras.forEach((b, i) => { b.n = i + 1; b.codigo = `B${String(i + 1).padStart(3, '0')}`; });
  const compra = {};
  for (const b of barras.filter((b) => !b.retal)) { const k = `${b.profile} × ${b.stock / 1000} m`; compra[k] = compra[k] || { profile: b.profile, stock: b.stock, n: 0, kg: 0 }; compra[k].n++; compra[k].kg += b.stock / 1000 * b.kgm; }
  const neto = barras.reduce((s, b) => s + b.cuts.reduce((t, c) => t + c.len, 0), 0);
  const bruto = barras.reduce((s, b) => s + b.stock, 0);
  const desperdicio = barras.reduce((s, b) => s + b.desperdicio, 0);
  return {
    barras, compra: Object.values(compra).map((c) => ({ ...c, kg: Math.round(c.kg) })),
    retales: barras.filter((b) => b.retalSale).map((b) => ({ ...b.retalSale, profile: b.profile })),
    aprovechamiento: bruto ? neto / bruto : 1, aprovechamientoConRetal: bruto ? (bruto - desperdicio) / bruto : 1, desperdicio, cortes: barras.reduce((s, b) => s + b.cuts.length, 0),
  };
}

export function nestPlates(despiece, { sheet = SHEET, gap = 12, margin = 15 } = {}) {
  const byT = {};
  for (const p of despiece.placas) for (let i = 0; i < p.qty; i++) (byT[p.t] ||= []).push({ id: `${p.mark}-${String(i + 1).padStart(3, '0')}`, mark: p.mark, w: p.w, h: p.h, t: p.t });
  const hojas = [];
  for (const [t, items] of Object.entries(byT)) {
    // estantes: piezas ordenadas por su lado corto (la altura del estante) de mayor a menor
    items.forEach((it) => { if (it.h > it.w) [it.w, it.h, it.rot] = [it.h, it.w, true]; });
    items.sort((a, b) => b.h - a.h || b.w - a.w);
    let hoja = null, shelfY = 0, shelfH = 0, x = 0;
    const nueva = () => { hoja = { t: +t, w: sheet.w, h: sheet.h, piezas: [] }; hojas.push(hoja); shelfY = margin; shelfH = 0; x = margin; };
    nueva();
    for (const it of items) {
      if (it.w > sheet.w - 2 * margin || it.h > sheet.h - 2 * margin) throw new Error(`La placa ${it.id} no cabe en la lámina`);
      if (x + it.w > sheet.w - margin) { shelfY += shelfH + gap; x = margin; shelfH = 0; }
      if (shelfY + it.h > sheet.h - margin) nueva();
      hoja.piezas.push({ id: it.id, mark: it.mark, x, y: shelfY, w: it.w, h: it.h, rot: !!it.rot });
      x += it.w + gap; shelfH = Math.max(shelfH, it.h);
    }
  }
  hojas.forEach((h, i) => { h.codigo = `H${String(i + 1).padStart(2, '0')}`; h.uso = h.piezas.reduce((s, p) => s + p.w * p.h, 0) / (h.w * h.h); });
  const area = hojas.reduce((s, h) => s + h.w * h.h, 0), neta = hojas.reduce((s, h) => s + h.uso * h.w * h.h, 0);
  return { hojas, aprovechamiento: area ? neta / area : 1, kgLamina: Math.round(hojas.reduce((s, h) => s + h.w * h.h * h.t * 7.85e-6, 0)) };
}
