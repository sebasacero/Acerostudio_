import { useMemo } from 'react';
// Dibujo isométrico de ciudad (tarjetas de proyecto y portada): mismo algoritmo que la app estática.
function rngS(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

export function isoMarkup({ semilla = 1, destacados = [], via = true, w = 320, h = 200, escala = 7 } = {}) {
  const R = rngS(semilla), cx = w / 2, cy = h * 0.42, c30 = 0.866, s30 = 0.5;
  const P = (x, y, z) => [cx + (x - z) * c30 * escala, cy + (x + z) * s30 * escala - y * escala];
  const cajas = [];
  for (let i = -4; i <= 4; i++) for (let j = -4; j <= 4; j++) {
    if (via && Math.abs(i - j * 0.6 - 0.5) < 0.9) continue;
    if (R() < 0.12) continue;
    const d = destacados.find((k) => k.i === i && k.j === j);
    const alto = d ? d.h : 1.2 + Math.pow(R(), 1.6) * 6.5;
    cajas.push({ x: i * 2.2, z: j * 2.2, w: 1.6 + R() * 0.3, d: 1.6 + R() * 0.3, h: alto, dest: !!d });
  }
  cajas.sort((a, b) => (a.x + a.z) - (b.x + b.z));
  const pts = (arr) => arr.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
  let out = `<rect width="${w}" height="${h}" fill="var(--iso-suelo)"/>`;
  if (via) {
    const a = P(-12, 0, -20), b = P(0.5 * 2.2, 0, 0), c = P(14, 0, 22);
    out += `<path d="M${a} Q${b} ${c}" fill="none" stroke="var(--iso-via)" stroke-width="${escala * 1.6}" opacity=".95"/>`;
    out += `<path d="M${a} Q${b} ${c}" fill="none" stroke="var(--iso-via-luz)" stroke-width="${escala * 0.18}" stroke-dasharray="3 6"/>`;
  }
  for (const k of cajas) {
    const x0 = k.x - k.w / 2, x1 = k.x + k.w / 2, z0 = k.z - k.d / 2, z1 = k.z + k.d / 2;
    const top = [P(x0, k.h, z0), P(x1, k.h, z0), P(x1, k.h, z1), P(x0, k.h, z1)];
    const izq = [P(x0, 0, z1), P(x1, 0, z1), P(x1, k.h, z1), P(x0, k.h, z1)];
    const der = [P(x1, 0, z0), P(x1, 0, z1), P(x1, k.h, z1), P(x1, k.h, z0)];
    if (k.dest) {
      const st = `stroke="var(--negro)" stroke-width="1.3" stroke-linejoin="round"`;
      out += `<polygon points="${pts(izq)}" fill="var(--iso-cel-2)" ${st}/><polygon points="${pts(der)}" fill="var(--iso-cel-3)" ${st}/><polygon points="${pts(top)}" fill="var(--iso-cel)" ${st}/>`;
      for (let y = 1.2; y < k.h; y += 1.2) { const a = P(x0, y, z1), b = P(x1, y, z1), c = P(x1, y, z0); out += `<polyline points="${pts([a, b, c])}" fill="none" stroke="var(--negro)" stroke-width=".6" opacity=".55"/>`; }
    } else {
      out += `<polygon points="${pts(izq)}" fill="var(--iso-lit)"/><polygon points="${pts(der)}" fill="var(--iso-shd)"/><polygon points="${pts(top)}" fill="var(--iso-top)"/>`;
    }
  }
  return { w, h, out };
}

export default function Iso(props) {
  const { w, h, out } = useMemo(() => isoMarkup(props), [props.semilla, props.via, props.w, props.h, props.escala]);
  return <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" dangerouslySetInnerHTML={{ __html: out }} />;
}
