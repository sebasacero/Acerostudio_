// Plano o boceto (imagen) → muros. Sin IA ni red: visión por computador clásica sobre los píxeles.
// 1. Tinta: umbral adaptativo (sirve para fotos de papel con sombras y para planos exportados).
// 2. Plano: una apertura morfológica borra lo delgado (mobiliario, cotas, texto, arcos de puerta)
//    y deja los muros gruesos. Boceto: cada trazo largo es un muro.
// 3. Bandas horizontales y verticales de tinta → segmentos con su espesor.
// 4. Se unen los colineales; los huecos cortos entre tramos se vuelven puertas o ventanas.
// 5. Escala en metros y extremos ajustados para que las esquinas cierren.
// Funciona con imágenes {data RGBA, width, height}: igual en el navegador (canvas) que en Node (pngjs).

export function inkMask({ data, width: W, height: H }, sensitivity = 0.5) {
  const gray = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
  const integ = integral(gray, W, H);
  const r = Math.max(8, Math.round(Math.max(W, H) / 40));
  const k = 0.06 + 0.22 * (1 - sensitivity); // más sensibilidad = acepta trazos más claros
  const otsu = otsuThreshold(gray);
  const mask = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const mean = boxMean(integ, W, H, x, y, r);
    const g = gray[y * W + x];
    if (g < mean * (1 - k) && g < otsu + 25 * sensitivity) mask[y * W + x] = 1;
  }
  return mask;
}

function integral(src, W, H) {
  const I = new Float64Array((W + 1) * (H + 1));
  for (let y = 1; y <= H; y++) {
    let row = 0;
    for (let x = 1; x <= W; x++) {
      row += src[(y - 1) * W + (x - 1)];
      I[y * (W + 1) + x] = I[(y - 1) * (W + 1) + x] + row;
    }
  }
  return I;
}
function boxSum(I, W, x0, y0, x1, y1) { // [x0, x1) × [y0, y1)
  const w = W + 1;
  return I[y1 * w + x1] - I[y0 * w + x1] - I[y1 * w + x0] + I[y0 * w + x0];
}
function boxMean(I, W, H, x, y, r) {
  const x0 = Math.max(0, x - r), y0 = Math.max(0, y - r), x1 = Math.min(W, x + r + 1), y1 = Math.min(H, y + r + 1);
  return boxSum(I, W, x0, y0, x1, y1) / ((x1 - x0) * (y1 - y0));
}
function otsuThreshold(gray) {
  const hist = new Float64Array(256);
  for (const g of gray) hist[Math.min(255, Math.max(0, g | 0))]++;
  const total = gray.length;
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sumB = 0, wB = 0, best = 0, th = 128;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (!wB) continue;
    const wF = total - wB;
    if (!wF) break;
    sumB += t * hist[t];
    const mB = sumB / wB, mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) ** 2;
    if (between > best) { best = between; th = t; }
  }
  return th;
}

// Apertura (erosión + dilatación) con un cuadrado de lado s: borra todo trazo más delgado que s.
export function openMask(mask, W, H, s) {
  if (s <= 1) return mask;
  const I = integral(mask, W, H);
  const full = s * s;
  const er = new Uint8Array(W * H);
  const h = Math.floor(s / 2);
  for (let y = h; y < H - (s - h) + 1; y++) for (let x = h; x < W - (s - h) + 1; x++) {
    if (boxSum(I, W, x - h, y - h, x - h + s, y - h + s) === full) er[y * W + x] = 1;
  }
  const IE = integral(er, W, H);
  const out = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!mask[y * W + x]) continue;
    const x0 = Math.max(0, x - (s - h - 1)), y0 = Math.max(0, y - (s - h - 1)), x1 = Math.min(W, x + h + 1), y1 = Math.min(H, y + h + 1);
    if (boxSum(IE, W, x0, y0, x1, y1) > 0) out[y * W + x] = 1;
  }
  return out;
}

// Grosor de trazo de cada píxel de tinta = la menor de sus corridas horizontal y vertical.
// El histograma tiene un pico para los trazos finos (mobiliario, texto, cotas) y otro para los muros.
export function strokeWidths(mask, W, H) {
  const hr = new Uint16Array(W * H), vr = new Uint16Array(W * H);
  for (let y = 0; y < H; y++) {
    let s = 0;
    for (let x = 0; x <= W; x++) {
      if (x < W && mask[y * W + x]) continue;
      for (let k = s; k < x; k++) hr[y * W + k] = x - s;
      s = x + 1;
    }
  }
  for (let x = 0; x < W; x++) {
    let s = 0;
    for (let y = 0; y <= H; y++) {
      if (y < H && mask[y * W + x]) continue;
      for (let k = s; k < y; k++) vr[k * W + x] = y - s;
      s = y + 1;
    }
  }
  const hist = new Float64Array(160);
  for (let i = 0; i < W * H; i++) if (mask[i]) hist[Math.min(159, Math.min(hr[i], vr[i]))]++;
  const p1 = hist.indexOf(Math.max(...hist.slice(1)));
  let p2 = 0, best = 0;
  for (let t = 1; t < 160; t++) {
    if (t * 2.2 > p1 && t < p1 * 2.2) continue;
    if (hist[t] >= hist[p1] * 0.12 && hist[t] > best) { best = hist[t]; p2 = t; }
  }
  if (p2) return { thin: Math.min(p1, p2), wall: Math.max(p1, p2) };
  const big = p1 >= Math.max(4, 0.008 * Math.max(W, H));
  return big ? { thin: 1, wall: p1 } : { thin: p1, wall: 0 };
}

// Bandas de tinta en una dirección: corridas largas en filas consecutivas que se solapan.
function bands(mask, W, H, horizontal, minLen) {
  const N = horizontal ? H : W, M = horizontal ? W : H;
  const at = horizontal ? (row, i) => mask[row * W + i] : (row, i) => mask[i * W + row];
  const done = [];
  let active = [];
  for (let row = 0; row <= N; row++) {
    const runs = [];
    if (row < N) {
      let s = -1;
      for (let i = 0; i <= M; i++) {
        const on = i < M && at(row, i);
        if (on && s < 0) s = i;
        if (!on && s >= 0) { if (i - s >= minLen) runs.push([s, i]); s = -1; }
      }
    }
    const next = [];
    for (const [s, e] of runs) {
      const b = active.find((b) => !b.taken && Math.min(e, b.e) - Math.max(s, b.s) > 0.5 * Math.min(e - s, b.e - b.s));
      if (b) {
        b.taken = true;
        b.rows.push(row); b.ss.push(s); b.es.push(e);
        b.s = s; b.e = e;
        next.push(b);
      } else next.push({ rows: [row], ss: [s], es: [e], s, e, taken: true });
    }
    for (const b of active) if (!b.taken) done.push(b);
    next.forEach((b) => { b.taken = false; });
    active = next;
  }
  const median = (a) => { const v = [...a].sort((p, q) => p - q); return v[v.length >> 1]; };
  return done.map((b) => {
    const t0 = b.rows[0], t1 = b.rows[b.rows.length - 1] + 1;
    // Los bordes de la banda son más cortos por el antialias: se usa el percentil alto/bajo.
    const s = Math.min(...b.ss.slice().sort((p, q) => p - q).slice(0, Math.max(1, b.ss.length >> 1)));
    const e = Math.max(...b.es.slice().sort((p, q) => q - p).slice(0, Math.max(1, b.es.length >> 1)));
    return { horizontal, s: Math.min(s, median(b.ss)), e: Math.max(e, median(b.es)), c: (t0 + t1) / 2, t: t1 - t0 };
  });
}

const DEFAULTS = {
  mode: 'auto',          // 'plano' (muros gruesos), 'boceto' (trazos = muros) o 'auto'
  sensitivity: 0.5,
  widthM: null,          // ancho real del dibujo en metros (si no, se estima con el espesor de muro)
  wallThicknessM: 0.15,  // espesor de muro supuesto en bocetos
  maxGapM: 2.6,          // huecos más cortos que esto entre tramos colineales = vanos
  snapM: 0.05,
};

export function detectWalls(img, options = {}) {
  const o = { ...DEFAULTS, ...options };
  const { width: W, height: H } = img;
  const raw = inkMask(img, o.sensitivity);
  const sw = strokeWidths(raw, W, H);
  let mode = o.mode;
  if (mode === 'auto') mode = sw.wall >= 4 ? 'plano' : 'boceto';
  const mask = mode === 'plano' ? openMask(raw, W, H, Math.max(3, Math.min(Math.round(sw.thin * 2 + 1), Math.floor(sw.wall * 0.45)))) : raw;
  const minLen = Math.max(8, Math.round(Math.max(W, H) * 0.035), (mode === 'plano' ? sw.wall : sw.thin) * 3);
  const minT = mode === 'plano' ? Math.max(2, Math.round(sw.wall * 0.5)) : 1;
  let segs = [...bands(mask, W, H, true, minLen), ...bands(mask, W, H, false, minLen)]
    .filter((b) => b.t >= minT && b.t <= Math.max(6, (mode === 'plano' ? sw.wall : sw.thin) * 3) && b.e - b.s >= minLen);
  if (!segs.length) return { walls: [], mode, scale: 0, origin: [0, 0], width: 0, depth: 0, strokes: sw, mask: raw };

  // Escala: metros por píxel.
  const minX = Math.min(...segs.map((b) => (b.horizontal ? b.s : b.c - b.t / 2)));
  const maxX = Math.max(...segs.map((b) => (b.horizontal ? b.e : b.c + b.t / 2)));
  const minY = Math.min(...segs.map((b) => (b.horizontal ? b.c - b.t / 2 : b.s)));
  const maxY = Math.max(...segs.map((b) => (b.horizontal ? b.c + b.t / 2 : b.e)));
  const medT = segs.map((b) => b.t).sort((a, b) => a - b)[segs.length >> 1];
  let mpp;
  if (o.widthM > 0) mpp = o.widthM / (maxX - minX);
  else if (mode === 'plano') mpp = 0.2 / medT; // muro típico de 20 cm
  else mpp = 10 / (maxX - minX);              // boceto sin escala: 10 m de frente
  const thick = (t) => (mode === 'plano' ? snap(t * mpp, 0.05, 0.1) : o.wallThicknessM);

  // A metros con origen en la esquina superior izquierda (x → este, y de imagen → z sur).
  let walls = segs.map((b) => ({
    horizontal: b.horizontal,
    c: (b.c - (b.horizontal ? minY : minX)) * mpp,
    s: (b.s - (b.horizontal ? minX : minY)) * mpp,
    e: (b.e - (b.horizontal ? minX : minY)) * mpp,
    t: thick(b.t),
    gaps: [],
  }));
  walls = mergeCollinear(walls, o.maxGapM);
  closeCorners(walls);
  const W2 = (maxX - minX) * mpp, D2 = (maxY - minY) * mpp;
  const q = (v) => snap(v, o.snapM);
  const out = walls.filter((w) => w.e - w.s > 0.3).map((w) => {
    const a = w.horizontal ? [q(w.s), q(w.c)] : [q(w.c), q(w.s)];
    const b = w.horizontal ? [q(w.e), q(w.c)] : [q(w.c), q(w.e)];
    const exterior = w.c < w.t * 1.5 || w.c > (w.horizontal ? D2 : W2) - w.t * 1.5;
    const openings = w.gaps.map(([gs, ge]) => {
      const width = q(ge - gs);
      const kind = exterior && width >= 1.15 ? 'window' : 'door';
      return { kind, t: q((gs + ge) / 2 - w.s), width };
    }).filter((g) => g.width >= 0.5);
    return { a, b, thickness: w.t, openings, exterior };
  });
  return { walls: out, mode, scale: mpp, origin: [minX, minY], width: W2, depth: D2, strokes: sw, mask };
}

function snap(v, step, min = -Infinity) { return +Math.max(min, Math.round(v / step) * step).toFixed(4); }

function mergeCollinear(walls, maxGap) {
  const res = [];
  for (const hz of [true, false]) {
    const group = walls.filter((w) => w.horizontal === hz).sort((a, b) => a.c - b.c || a.s - b.s);
    const used = new Set();
    for (let i = 0; i < group.length; i++) {
      if (used.has(i)) continue;
      const w = { ...group[i], gaps: [] };
      used.add(i);
      let grew = true;
      while (grew) {
        grew = false;
        for (let j = 0; j < group.length; j++) {
          if (used.has(j)) continue;
          const v = group[j];
          if (Math.abs(v.c - w.c) > Math.max(w.t, v.t) * 0.75) continue;
          const overlap = Math.min(w.e, v.e) - Math.max(w.s, v.s);
          const gap = -overlap;
          if (overlap > -0.02 || gap <= maxGap) {
            if (overlap <= -0.02) w.gaps.push(v.s > w.e ? [w.e, v.s] : [v.e, w.s]);
            w.c = (w.c * (w.e - w.s) + v.c * (v.e - v.s)) / ((w.e - w.s) + (v.e - v.s));
            w.t = Math.max(w.t, v.t);
            w.s = Math.min(w.s, v.s); w.e = Math.max(w.e, v.e);
            w.gaps.push(...v.gaps);
            used.add(j);
            grew = true;
          }
        }
      }
      w.gaps = w.gaps.filter(([a, b]) => b > a).sort((p, q) => p[0] - q[0]);
      res.push(w);
    }
  }
  return res;
}

// Lleva cada extremo al eje del muro perpendicular más cercano para que las esquinas cierren.
function closeCorners(walls) {
  for (const w of walls) {
    const perp = walls.filter((v) => v.horizontal !== w.horizontal);
    for (const end of ['s', 'e']) {
      const p = w[end];
      let best = null, bd = Infinity;
      for (const v of perp) {
        const reach = Math.max(w.t, v.t) * 1.5 + 0.15;
        if (w.c < v.s - reach || w.c > v.e + reach) continue;
        const d = Math.abs(v.c - p);
        if (d < reach && d < bd) { bd = d; best = v; }
      }
      if (best) {
        w[end] = best.c;
        // y el perpendicular se alarga hasta este muro si se quedaba corto
        if (w.c < best.s) best.s = w.c; else if (w.c > best.e) best.e = w.c;
      }
    }
  }
}
