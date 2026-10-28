// Planos 2D sin Three.js (DXF y SVG): los usan el Studio y el servidor MCP.
import { planGeometry } from './plan.js';
import { polygonArea, fmt } from './model.js';

// --- planta en DXF (R12 ASCII, lo abren AutoCAD, BricsCAD, LibreCAD, Rhino, ArchiCAD y Revit) ---
export function planDXF(doc, levelId) {
  const g = planGeometry(doc, levelId);
  const out = ['0', 'SECTION', '2', 'ENTITIES'];
  const P = ([x, z]) => [x, -z]; // en CAD el norte es +Y
  const line = (layer, a, b) => {
    const [x1, y1] = P(a), [x2, y2] = P(b);
    out.push('0', 'LINE', '8', layer, '10', x1, '20', y1, '30', 0, '11', x2, '21', y2, '31', 0);
  };
  const poly = (layer, pts) => pts.forEach((p, i) => line(layer, p, pts[(i + 1) % pts.length]));
  g.cut.forEach((c) => poly(c.layer, c.pts));
  g.outline.forEach((c) => poly(c.layer, c.pts));
  g.lines.forEach((l) => line(l.layer, l.a, l.b));
  g.arcs.forEach((a) => {
    const [cx, cy] = P(a.c);
    let s = -a.to * 180 / Math.PI, e = -a.from * 180 / Math.PI;
    out.push('0', 'ARC', '8', a.layer, '10', cx, '20', cy, '30', 0, '40', a.r, '50', s, '51', e);
  });
  g.dims.forEach((d) => {
    line('COTAS', d.a, d.a2); line('COTAS', d.b, d.b2); line('COTAS', d.a2, d.b2);
    const [x, y] = P(d.mid);
    out.push('0', 'TEXT', '8', 'COTAS', '10', x, '20', y + 0.08, '30', 0, '40', 0.15, '1', d.text, '72', 1, '11', x, '21', y + 0.08, '31', 0);
  });
  out.push('0', 'ENDSEC', '0', 'EOF');
  return out.map((v) => (typeof v === 'number' ? v.toFixed(4) : v)).join('\n');
}

// --- planta en SVG con el estilo de la web: poché negro y cotas en lápiz rojo ---
export function planSVG(doc, levelId) {
  const g = planGeometry(doc, levelId);
  const all = [...g.cut, ...g.outline].flatMap((c) => c.pts)
    .concat(g.lines.flatMap((l) => [l.a, l.b]), g.dims.flatMap((d) => [d.a2, d.b2]));
  if (!all.length) all.push([0, 0], [1, 1]);
  const xs = all.map((p) => p[0]), zs = all.map((p) => p[1]);
  const pad = 1;
  const minX = Math.min(...xs) - pad, minZ = Math.min(...zs) - pad;
  const W = Math.max(...xs) - minX + pad, H = Math.max(...zs) - minZ + pad + 0.8;
  const S = 100; // 1 m = 100 unidades (1:100 en mm)
  const p = ([x, z]) => `${((x - minX) * S).toFixed(1)},${((z - minZ) * S).toFixed(1)}`;
  const level = doc.levels.find((l) => l.id === levelId) || doc.levels[0];
  const area = doc.elements.filter((e) => e.type === 'slab' && e.level === level.id).reduce((s, e) => s + polygonArea(e.points), 0);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${(W * S).toFixed(0)} ${(H * S).toFixed(0)}" width="${(W * 10).toFixed(0)}mm" height="${(H * 10).toFixed(0)}mm">`;
  s += `<rect width="100%" height="100%" fill="#ffffff"/>`;
  s += `<g fill="none" stroke="#8d969e" stroke-width="1.5">${g.outline.map((c) => `<polygon points="${c.pts.map(p).join(' ')}"/>`).join('')}</g>`;
  s += `<g fill="#16191c" stroke="#16191c" stroke-width="1">${g.cut.map((c) => `<polygon points="${c.pts.map(p).join(' ')}"/>`).join('')}</g>`;
  s += `<g stroke="#16191c" stroke-width="1.5" fill="none">${g.lines.map((l) => `<line x1="${p(l.a).split(',')[0]}" y1="${p(l.a).split(',')[1]}" x2="${p(l.b).split(',')[0]}" y2="${p(l.b).split(',')[1]}"/>`).join('')}`;
  s += g.arcs.map((a) => {
    const [x0, y0] = p([a.c[0] + Math.cos(a.from) * a.r, a.c[1] + Math.sin(a.from) * a.r]).split(',');
    const [x1, y1] = p([a.c[0] + Math.cos(a.to) * a.r, a.c[1] + Math.sin(a.to) * a.r]).split(',');
    const sweep = ((a.to - a.from + Math.PI * 3) % (Math.PI * 2)) - Math.PI > 0 ? 1 : 0;
    return `<path d="M${x0} ${y0} A${a.r * S} ${a.r * S} 0 0 ${sweep} ${x1} ${y1}" stroke-dasharray="6 5"/>`;
  }).join('') + '</g>';
  s += `<g stroke="#cf2a1f" stroke-width="2" fill="#cf2a1f" font-family="DM Mono, monospace" font-size="22">`;
  g.dims.forEach((d) => {
    const [ax, ay] = p(d.a2).split(','), [bx, by] = p(d.b2).split(',');
    const [ex, ey] = p(d.a).split(','), [fx, fy] = p(d.b).split(',');
    const [mx, my] = p(d.mid).split(',');
    const ang = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;
    const rot = ang > 90 || ang < -90 ? ang + 180 : ang;
    s += `<line x1="${ex}" y1="${ey}" x2="${ax}" y2="${ay}" stroke-width="1" opacity=".7"/><line x1="${fx}" y1="${fy}" x2="${bx}" y2="${by}" stroke-width="1" opacity=".7"/>`;
    s += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"/>`;
    [[ax, ay], [bx, by]].forEach(([x, y]) => { s += `<path d="M${x} ${+y - 6} L${+x + 6} ${y} L${x} ${+y + 6} L${x - 6} ${y} Z" stroke="none"/>`; });
    s += `<text x="${mx}" y="${my}" dy="-10" text-anchor="middle" stroke="none" transform="rotate(${rot.toFixed(1)} ${mx} ${my})">${d.text}</text>`;
  });
  s += '</g>';
  const ty = (H * S - 30).toFixed(0);
  s += `<g font-family="DM Mono, monospace" font-size="20" fill="#16191c"><text x="30" y="${ty}">${escapeXML(doc.name)} · ${escapeXML(level.name)} · planta a +1,20 m · ${fmt(area)} m² · esc. 1:100</text></g>`;
  s += `<rect x="0" y="${(H * S - 8).toFixed(0)}" width="100%" height="8" fill="#cf2a1f"/></svg>`;
  return s;
}

const escapeXML = (t) => String(t).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
