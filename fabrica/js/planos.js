// Planos de taller (SVG) de cada marca y placa, y etiquetas con código QR para cada unidad.
// Las cotas van en mm. Las vistas no son a escala en el canto (se exagera para que se lean los agujeros).
import { PROFILES, profileLabel, sectionOutline } from '../../studio/js/steel.js';
import qrcode from '../vendor/qrcode.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const fmt = (n) => Math.round(n).toLocaleString('es-CO');

// Colores de las láminas (estilo Ciudad de acero): tinta sobre papel claro para que se impriman bien.
const C = { papel: '#f6f4ef', tinta: '#1a1e2c', suave: '#6b7184', coral: '#d8574b', celeste: '#2a6aa6', placa: '#e9b44c' };

function cota(x1, x2, y, label, off = 16) {
  return `<g class="cota"><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/><line x1="${x1}" y1="${y - 5}" x2="${x1}" y2="${y + 5}"/><line x1="${x2}" y1="${y - 5}" x2="${x2}" y2="${y + 5}"/>` +
    `<text x="${(x1 + x2) / 2}" y="${y - 5}" text-anchor="middle">${label}</text></g>`;
}

function cajetin(W, H, filas, titulo) {
  const y = H - 74;
  let x = 24, s = `<rect x="16" y="${y}" width="${W - 32}" height="58" class="caja"/>`;
  s += `<text x="${x + 8}" y="${y + 24}" class="marca">${esc(titulo)}</text>`;
  x = 210;
  for (const [k, v] of filas) {
    s += `<text x="${x}" y="${y + 22}" class="k">${esc(k)}</text><text x="${x}" y="${y + 42}" class="v">${esc(v)}</text>`;
    x += Math.max(92, (W - 240) / filas.length);
  }
  return s;
}

const estilo = `<style>
  text{font-family:'DM Mono',ui-monospace,monospace;fill:${C.tinta};font-size:11px}
  .t{font-family:'Antonio','Arial Narrow',sans-serif;font-size:20px;letter-spacing:.02em}
  .marca{font-family:'Antonio','Arial Narrow',sans-serif;font-size:30px;fill:${C.coral}}
  .k{font-size:9px;fill:${C.suave};letter-spacing:.08em;text-transform:uppercase}.v{font-size:12.5px}
  .caja{fill:none;stroke:${C.tinta};stroke-width:1}
  .perfil{fill:#dfe3ea;stroke:${C.tinta};stroke-width:1.3}
  .eje{stroke:${C.suave};stroke-dasharray:10 4 2 4;stroke-width:.8}
  .ag{fill:#fff;stroke:${C.celeste};stroke-width:1.6}
  .pl{fill:${C.placa};fill-opacity:.55;stroke:${C.tinta};stroke-width:1}
  .cota line{stroke:${C.suave};stroke-width:.8}.cota text{font-size:10px;fill:${C.suave}}
  .vista{font-size:10px;fill:${C.suave};letter-spacing:.1em}
</style>`;

// Plano de taller de una marca de perfil.
export function svgPieza(m, { proyecto = '', orden = '' } = {}) {
  const P = PROFILES[m.profile], W = 1100, H = 640, x0 = 60, x1 = W - 200, k = (x1 - x0) / m.length;
  const tanS = Math.tan((m.cuts.ws || 0) * Math.PI / 180), tanE = Math.tan((m.cuts.we || 0) * Math.PI / 180);
  const strip = (y, hpx, face, title) => {
    // la barra vista de frente con los cortes en ángulo
    const sx = Math.min(hpx * tanS, 120), ex = Math.min(hpx * tanE, 120);
    let s = `<text x="${x0}" y="${y - 34}" class="vista">${title}</text>`;
    s += `<polygon class="perfil" points="${x0 + sx},${y} ${x1},${y} ${x1 - ex},${y + hpx} ${x0},${y + hpx}"/>`;
    s += `<line class="eje" x1="${x0 - 20}" y1="${y + hpx / 2}" x2="${x1 + 20}" y2="${y + hpx / 2}"/>`;
    const faceW = face === 'v' ? P.h * 1000 : P.b * 1000;
    for (const h of m.holes.filter((h) => (face === 'v' ? h.face === 'v' : h.face !== 'v'))) {
      const cy = y + hpx - (h.y / faceW) * hpx;
      s += `<circle class="ag" cx="${x0 + h.x * k}" cy="${cy}" r="${Math.max(3.2, h.d * k * 1.4)}"/>`;
    }
    return s;
  };
  const hv = Math.max(46, Math.min(110, P.h * 1000 * 0.22)), hb = Math.max(34, Math.min(90, P.b * 1000 * 0.22));
  let body = `<rect width="${W}" height="${H}" fill="${C.papel}"/>${estilo}`;
  body += `<text x="${x0}" y="40" class="t">${esc(m.nombre)} ${esc(m.mark)} · ${esc(profileLabel(m.profile))}${m.tramo ? ` · tramo ${m.tramo}` : ''}</text>`;
  body += `<text x="${x0}" y="58" class="vista">PLANO DE TALLER · COTAS EN MM · ${esc(proyecto.toUpperCase())}</text>`;
  const yv = 120, yb = yv + hv + 90;
  body += strip(yv, hv, 'v', P.shape === 'I' ? 'VISTA DEL ALMA (CARA V)' : 'VISTA LATERAL (CARA V)');
  body += strip(yb, hb, 'o', P.shape === 'I' ? 'VISTA DEL ALA (CARAS O / U)' : 'VISTA SUPERIOR (CARA O)');
  // Placas soldadas: en los extremos o en su posición.
  for (const p of m.plates) {
    const at = p.at === 'inicio' ? 0 : p.at === 'fin' ? m.length : Math.min(m.length, Math.max(0, p.at));
    const px = x0 + at * k - (p.at === 'inicio' ? 7 : p.at === 'fin' ? 0 : 3);
    body += `<rect class="pl" x="${px}" y="${yv - 14}" width="7" height="${hv + 28}"/><text x="${px + 3}" y="${yv - 20}" text-anchor="middle" style="font-size:10px;fill:${C.coral}">${p.mark}</text>`;
  }
  // Cotas: longitud total y posiciones de grupos de agujeros (cotas acumuladas desde el inicio).
  body += cota(x0, x1, yb + hb + 56, `${fmt(m.length)} mm`);
  const xs = [...new Set(m.holes.map((h) => Math.round(h.x)))].sort((a, b) => a - b);
  let last = -1e9;
  xs.forEach((x, i) => {
    const px = x0 + x * k;
    if (px - last < 34 && i !== xs.length - 1) return;
    body += `<line x1="${px}" y1="${yb + hb + 6}" x2="${px}" y2="${yb + hb + 30}" stroke="${C.suave}" stroke-width=".8"/><text x="${px}" y="${yb + hb + 42}" text-anchor="middle" style="font-size:9.5px;fill:${C.suave}">${fmt(x)}</text>`;
    last = px;
  });
  if (m.cuts.ws) body += `<text x="${x0}" y="${yv + hv + 18}" style="font-size:10.5px;fill:${C.coral}">corte ${m.cuts.ws}°</text>`;
  if (m.cuts.we) body += `<text x="${x1}" y="${yv + hv + 18}" text-anchor="end" style="font-size:10.5px;fill:${C.coral}">corte ${m.cuts.we}°</text>`;
  // Sección.
  const sc = 120 / Math.max(P.h, P.b), cx = W - 95, cy = yv + 70;
  body += `<text x="${cx}" y="${yv - 10}" text-anchor="middle" class="vista">SECCIÓN</text>`;
  body += `<polygon class="perfil" points="${sectionOutline(P, 28).map(([u, v]) => `${cx + u * sc},${cy - v * sc}`).join(' ')}"/>`;
  if (P.shape !== 'I') body += `<polygon fill="${C.papel}" stroke="${C.tinta}" points="${sectionOutline({ ...P, h: P.h - 2 * P.t, b: P.b - 2 * P.t }, 28).map(([u, v]) => `${cx + u * sc},${cy - v * sc}`).join(' ')}"/>`;
  body += `<text x="${cx}" y="${cy + 84}" text-anchor="middle">${esc(profileLabel(m.profile))}</text>`;
  // Leyenda de agujeros y placas.
  const grupos = Object.entries(m.holes.reduce((o, h) => { const key = `Ø${h.d} cara ${h.face}`; o[key] = (o[key] || 0) + 1; return o; }, {}));
  let ly = yb + 10;
  for (const [g, n] of grupos) { body += `<text x="${cx - 80}" y="${ly}"><tspan fill="${C.celeste}">●</tspan> ${n} × ${g}</text>`; ly += 16; }
  const pg = Object.values(m.plates.reduce((o, p) => { (o[p.mark] ||= { ...p, n: 0 }).n++; return o; }, {}));
  for (const p of pg) { const t = `${p.n} × ${p.mark} ${p.note || ''}`; body += `<text x="${cx - 80}" y="${ly}"><tspan fill="${C.placa}">■</tspan> ${esc(t.length > 24 ? t.slice(0, 23) + '…' : t)}</text>`; ly += 16; }
  body += cajetin(W, H, [['Cantidad', m.qty], ['Longitud', `${fmt(m.length)} mm`], ['Peso unit.', `${m.kg} kg`], ['Calidad', m.grade], ['Pintura', `${m.paint} m²`], ['Agujeros', m.holes.length], ['Orden', orden]], m.mark);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${body}</svg>`;
}

// Plano de una placa: contorno, agujeros y cotas.
export function svgPlaca(p, { orden = '' } = {}) {
  const W = 760, H = 560, box = 300, k = box / Math.max(p.w, p.h), ox = 120, oy = 110;
  const X = (x) => ox + x * k, Y = (y) => oy + (p.h - y) * k;
  let body = `<rect width="${W}" height="${H}" fill="${C.papel}"/>${estilo}`;
  body += `<text x="40" y="44" class="t">${esc(p.nombre)} ${esc(p.mark)} · chapa ${p.t} mm</text>`;
  body += `<polygon class="pl" points="${p.outline.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')}"/>`;
  for (const h of p.holes) body += `<circle class="ag" cx="${X(h.x)}" cy="${Y(h.y)}" r="${Math.max(3, (h.d / 2) * k)}"/>`;
  body += cota(X(0), X(p.w), Y(0) + 34, `${p.w}`);
  body += `<g transform="rotate(-90 ${X(0) - 34} ${(Y(0) + Y(p.h)) / 2})">${cota(X(0) - 34 - (p.h * k) / 2, X(0) - 34 + (p.h * k) / 2, (Y(0) + Y(p.h)) / 2, `${p.h}`)}</g>`;
  let ly = oy;
  for (const h of p.holes) { body += `<text x="${ox + box + 60}" y="${ly}">Ø${h.d} · x ${h.x} · y ${h.y}</text>`; ly += 15; }
  body += `<text x="${ox + box + 60}" y="${ly + 10}" style="fill:${C.suave}">Va en: ${esc(p.en.join(', '))}</text>`;
  body += cajetin(W, H, [['Cantidad', p.qty], ['Medidas', `${p.w}×${p.h}`], ['Espesor', `${p.t} mm`], ['Peso unit.', `${p.kg} kg`], ['Orden', orden]], p.mark);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${body}</svg>`;
}

// QR como SVG (módulos en un solo path).
export function qrSVG(texto, { size = 140, color = C.tinta, fondo = '#fff' } = {}) {
  const q = qrcode(0, 'M');
  q.addData(texto);
  q.make();
  const n = q.getModuleCount(), m = 2, s = size / (n + 2 * m);
  let d = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${((c + m) * s).toFixed(2)} ${((r + m) * s).toFixed(2)}h${s.toFixed(2)}v${s.toFixed(2)}h-${s.toFixed(2)}z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${fondo}"/><path d="${d}" fill="${color}"/></svg>`;
}

// Etiqueta de pieza 100 × 60 mm: QR con el enlace de la pieza, marca grande, perfil, largo, peso y piso.
export function svgEtiqueta(pz, m, url) {
  const qr = qrSVG(url, { size: 200 }).replace('<svg ', '<svg x="12" y="12" ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 224" width="400" height="224"><rect width="400" height="224" rx="10" fill="#fff" stroke="${C.tinta}"/>${estilo}${qr}` +
    `<text x="226" y="58" class="marca" style="font-size:40px">${esc(pz.id)}</text>` +
    `<text x="228" y="84" class="v">${esc(m.nombre)} · ${esc(profileLabel(m.profile))}</text>` +
    `<text x="228" y="106" class="v">L ${fmt(m.length)} mm · ${pz.kg} kg</text>` +
    `<text x="228" y="128" class="v">${esc(pz.levelName)} · montaje #${pz.seq}</text>` +
    `<text x="228" y="150" class="k">${esc(m.grade)} · ${m.plates.map((p) => p.mark).join(' ')}</text>` +
    `<text x="228" y="200" class="k">AceroStudio · fábrica</text></svg>`;
}
