// Dibujo frontal del producto (SVG) para encajarlo en la foto. Unidades: metros → el SVG usa viewBox en cm.
import { PRODUCTOS, DISENOS, TIPOS } from '../../ornamentacion/js/porton.js';
export { PRODUCTOS, DISENOS, TIPOS };

export const ACABADOS = { grafito: ['Grafito', '#2b2f36', '#4a505c'], negro: ['Negro mate', '#15171b', '#2a2d33'], corten: ['Corten', '#8a4a2b', '#b8673f'], blanco: ['Blanco', '#e9eaec', '#c9ccd2'], verde: ['Verde botella', '#1f3a2e', '#2f5a46'] };

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

/* Relleno de la hoja según el diseño, en un rectángulo [x,y,w,h] en cm. */
function relleno(diseno, x, y, w, h, c, seed = 3) {
  const out = [];
  if (diseno === 'listones') { for (let i = x + 6; i < x + w - 3; i += 9) out.push(<rect key={i} x={i} y={y + 2} width="4" height={h - 4} fill={c[1]} stroke={c[2]} strokeWidth=".6" />); }
  else if (diseno === 'lanzas') { for (let i = x + 7; i < x + w - 3; i += 11) out.push(<g key={i}><rect x={i} y={y + 2} width="2.2" height={h - 4} fill={c[2]} /><path d={`M${i + 1.1} ${y - 4} l3 7 h-6z`} fill={c[2]} /></g>); out.push(<rect key="h" x={x} y={y + h * 0.45} width={w} height="2.5" fill={c[2]} />); }
  else if (diseno === 'lamina') { for (let j = y + 6; j < y + h - 4; j += 10) for (let i = x + 6; i < x + w - 4; i += 10) out.push(<path key={i + '-' + j} d={`M${i} ${j - 4} l4 4 l-4 4 l-4 -4z`} fill="none" stroke={c[2]} strokeWidth="1" />); out.push(<rect key="f" x={x} y={y} width={w} height={h} fill={c[1]} opacity=".55" />); }
  else if (diseno === 'tablero') { for (let j = y + 5; j < y + h - 8; j += 22) for (let i = x + 5; i < x + w - 8; i += 22) out.push(<rect key={i + '-' + j} x={i} y={j} width="17" height="17" rx="2" fill={c[1]} stroke={c[2]} strokeWidth="1" />); }
  else { // celosía láser: lámina llena con perforaciones orgánicas
    out.push(<rect key="f" x={x} y={y} width={w} height={h} fill={c[1]} />);
    const R = rng(seed); const n = Math.round(w * h / 90);
    for (let k = 0; k < n; k++) { const r = 1.2 + R() * 2.4, px = x + 4 + R() * (w - 8), py = y + 4 + R() * (h - 8); out.push(<ellipse key={k} cx={px} cy={py} rx={r} ry={r * (0.6 + R() * 0.6)} fill="rgba(0,0,0,.55)" />); }
  }
  return out;
}

/* El producto completo: marco + hojas. `ancho`/`alto` en m. */
export function ProductoSVG({ cfg, apertura = 0, style }) {
  const W = Math.round(cfg.ancho * 100), H = Math.round(cfg.alto * 100), c = ACABADOS[cfg.acabado] || ACABADOS.grafito;
  const marco = cfg.producto === 'baranda' ? 4 : 6;
  const hojas = cfg.producto === 'porton' && cfg.tipo === 'batiente' ? 2 : 1;
  const hw = (W - marco * 2) / hojas;
  const des = cfg.producto === 'porton' && cfg.tipo === 'corredizo' ? apertura * hw : 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none" style={style} aria-hidden="true">
      <defs><linearGradient id="metal" x1="0" x2="1"><stop offset="0" stopColor={c[2]} /><stop offset=".5" stopColor={c[1]} /><stop offset="1" stopColor={c[2]} /></linearGradient></defs>
      {/* marco fijo */}
      <rect x="0" y="0" width={W} height={H} fill="none" stroke="url(#metal)" strokeWidth={marco * 2} />
      {Array.from({ length: hojas }).map((_, i) => {
        const x = marco + i * hw + (i === 0 ? des : -des);
        return <g key={i} transform={cfg.tipo === 'batiente' && cfg.producto === 'porton' ? `translate(${i === 0 ? marco : W - marco} 0) scale(${1 - apertura * 0.85 * (1)} 1) translate(${i === 0 ? -marco : -(W - marco)} 0)` : ''}>
          <rect x={x} y={marco} width={hw} height={H - marco * 2} fill="none" stroke={c[2]} strokeWidth="4" />
          {cfg.producto === 'ventana' ? <rect x={x + 3} y={marco + 3} width={hw - 6} height={H - marco * 2 - 6} fill="rgba(182,219,248,.28)" stroke={c[2]} strokeWidth="1" /> : relleno(cfg.diseno, x + 3, marco + 3, hw - 6, H - marco * 2 - 6, c, cfg.semilla || 3)}
          {cfg.producto === 'puerta' && <circle cx={x + hw - 10} cy={H / 2} r="2.2" fill="#d8dadf" />}
        </g>;
      })}
      {cfg.producto === 'porton' && cfg.tipo === 'levadizo' && <rect x={marco} y={marco} width={W - marco * 2} height={(H - marco * 2) * apertura} fill="rgba(0,0,0,.35)" />}
    </svg>
  );
}
