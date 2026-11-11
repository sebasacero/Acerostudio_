// Dibujo del simulador en canvas 2D. El banco y la interfaz van planos (estilo Ciudad de acero);
// las placas, el cordón, la escoria y el arco se dibujan realistas, que es donde va la mirada.

const lim = (v, a, b) => Math.max(a, Math.min(b, v));
function azar(semilla) {
  let a = (semilla * 4294967296) >>> 0 || 1;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

// ---------- vista: mm de la probeta → px de pantalla ----------
export class Vista {
  constructor(anchoCss, altoCss, dpr, junta) {
    this.w = anchoCss; this.h = altoCss; this.dpr = dpr;
    const W = junta.ancho, H = junta.alto, m = 18;
    // en pantallas verticales la probeta se gira para que la junta corra de arriba a abajo
    this.rot = altoCss > anchoCss * 1.15;
    const aw = this.rot ? H : W, ah = this.rot ? W : H;
    this.k = Math.min((anchoCss - m * 2) / aw, (altoCss - m * 2) / ah);
    this.ox = (anchoCss - aw * this.k) / 2; this.oy = (altoCss - ah * this.k) / 2;
    this.H = H;
  }
  aPx(x, y) { return this.rot ? [this.ox + (this.H - y) * this.k, this.oy + x * this.k] : [this.ox + x * this.k, this.oy + y * this.k]; }
  aMm(px, py) { return this.rot ? [(py - this.oy) / this.k, this.H - (px - this.ox) / this.k] : [(px - this.ox) / this.k, (py - this.oy) / this.k]; }
  // vector de pantalla → vector en mm (solo rotación)
  dirMm(dx, dy) { return this.rot ? [dy, -dx] : [dx, dy]; }
  mm(ctx) {
    const k = this.k * this.dpr, d = this.dpr;
    if (this.rot) ctx.setTransform(0, k, -k, 0, (this.ox + this.H * this.k) * d, this.oy * d);
    else ctx.setTransform(k, 0, 0, k, this.ox * d, this.oy * d);
  }
  px(ctx) { ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); }
}

// ---------- placas de acero ----------
function placa(ctx, x, y, w, h, semilla, op = {}) {
  const R = azar(semilla);
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const g = ctx.createLinearGradient(x, y, x + w * 0.6, y + h);
  g.addColorStop(0, op.claro || '#7f8892'); g.addColorStop(0.5, op.medio || '#6b747e'); g.addColorStop(1, op.oscuro || '#5b636d');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  // cascarilla de laminación: manchas azul-grisáceas
  for (let i = 0; i < 70; i++) {
    const cx = x + R() * w, cy = y + R() * h, r = 1.5 + R() * 8;
    const m = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    const c = R() < 0.65 ? `rgba(34,44,60,${0.05 + R() * 0.09})` : `rgba(170,178,190,${0.04 + R() * 0.07})`;
    m.addColorStop(0, c); m.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = m; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }
  // grano fino: poros y brillos de la cascarilla
  for (let i = 0; i < w * h * 0.16; i++) {
    const s = 0.12 + R() * 0.3;
    ctx.fillStyle = R() < 0.5 ? `rgba(255,255,255,${0.04 + R() * 0.08})` : `rgba(8,12,18,${0.05 + R() * 0.1})`;
    ctx.fillRect(x + R() * w, y + R() * h, s, s);
  }
  // líneas de laminación a lo largo
  for (let i = 0; i < 260; i++) {
    const yy = y + R() * h, xx = x + R() * w, l = 4 + R() * 40;
    ctx.strokeStyle = R() < 0.5 ? `rgba(255,255,255,${0.025 + R() * 0.05})` : `rgba(10,14,20,${0.03 + R() * 0.06})`;
    ctx.lineWidth = 0.05 + R() * 0.12;
    ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + l, yy + (R() - 0.5) * 0.3); ctx.stroke();
  }
  // franja esmerilada junto a la junta (preparación antes de soldar)
  if (op.esmeril) {
    const [ey0, ey1] = op.esmeril, gy = ctx.createLinearGradient(0, ey0, 0, ey1);
    const haciaJunta = op.esmerilHacia === 'abajo';
    gy.addColorStop(haciaJunta ? 0 : 1, 'rgba(200,206,214,0)'); gy.addColorStop(haciaJunta ? 0.55 : 0.45, 'rgba(196,203,212,.55)'); gy.addColorStop(haciaJunta ? 1 : 0, 'rgba(214,220,228,.85)');
    ctx.fillStyle = gy; ctx.fillRect(x, ey0, w, ey1 - ey0);
    for (let i = 0; i < 260; i++) {
      const cx = x + R() * w, cy = ey0 + R() * (ey1 - ey0), r = 2 + R() * 5, a0 = R() * Math.PI;
      ctx.strokeStyle = `rgba(255,255,255,${0.05 + R() * 0.12})`; ctx.lineWidth = 0.05 + R() * 0.08;
      ctx.beginPath(); ctx.arc(cx, cy, r, a0, a0 + 0.7 + R()); ctx.stroke();
    }
  }
  ctx.restore();
  // cantos
  ctx.lineWidth = 0.35;
  ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y); ctx.lineTo(x + w, y); ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.stroke();
}

function sombra(ctx, vista, dibujar) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 14 * vista.dpr;
  const [sx, sy] = vista.rot ? [-1, 1] : [1, 1];
  ctx.shadowOffsetX = 4 * vista.dpr * (vista.rot ? -sy : sx); ctx.shadowOffsetY = 6 * vista.dpr;
  ctx.fillStyle = '#555'; dibujar(); ctx.restore();
}

function punteado(ctx, x, y, w, semilla) { // punto de armado (tack) en una punta
  const R = azar(semilla);
  for (let i = 0; i < 7; i++) {
    const cx = x + (i - 3) * 0.9, r = w * (0.36 + R() * 0.06);
    const g = ctx.createRadialGradient(cx - 0.6, y - 1, 0.2, cx, y, r);
    g.addColorStop(0, '#d6d1c8'); g.addColorStop(0.5, '#7b7368'); g.addColorStop(1, '#3a342e');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, y, r * 0.55, r, 0, 0, Math.PI * 2); ctx.fill();
  }
}

export function dibujarFondo(ctx, vista, junta, tema) {
  const W = junta.ancho, H = junta.alto;
  vista.px(ctx);
  const dia = tema === 'dia';
  ctx.fillStyle = dia ? '#d9dde4' : '#2c3247'; ctx.fillRect(0, 0, vista.w, vista.h);
  // banco plano: rejilla de mesa de soldar (figuras planas)
  ctx.fillStyle = dia ? '#cdd2da' : '#262b3e';
  const paso = 46;
  for (let x = (vista.w % paso) / 2; x < vista.w; x += paso) for (let y = (vista.h % paso) / 2; y < vista.h; y += paso) ctx.fillRect(x - 3, y - 3, 6, 6);
  vista.mm(ctx);
  const id = junta.id;
  if (id === 'tope') {
    sombra(ctx, vista, () => { ctx.fillRect(0, 0, W, 54); ctx.fillRect(0, 56, W, H - 56); });
    placa(ctx, 0, 0, W, 54, 0.11, { esmeril: [40, 51.4], esmerilHacia: 'abajo' });
    placa(ctx, 0, 56, W, H - 56, 0.23, { esmeril: [58.6, 70], esmerilHacia: 'arriba' });
    // biseles a 30°: cara de la placa de arriba en sombra, la de abajo recibe luz
    let g = ctx.createLinearGradient(0, 51.4, 0, 54); g.addColorStop(0, '#8b9199'); g.addColorStop(1, '#3d424a');
    ctx.fillStyle = g; ctx.fillRect(0, 51.4, W, 2.6);
    g = ctx.createLinearGradient(0, 56, 0, 58.6); g.addColorStop(0, '#5d636c'); g.addColorStop(1, '#c4cad2');
    ctx.fillStyle = g; ctx.fillRect(0, 56, W, 2.6);
    g = ctx.createLinearGradient(0, 54, 0, 56); g.addColorStop(0, '#0d0f12'); g.addColorStop(0.5, '#1c1f24'); g.addColorStop(1, '#0d0f12');
    ctx.fillStyle = g; ctx.fillRect(0, 54, W, 2);
    punteado(ctx, 4, 55, 6, 0.4); punteado(ctx, W - 4, 55, 6, 0.6);
  } else if (id === 'filete') {
    sombra(ctx, vista, () => ctx.fillRect(0, 0, W, H));
    placa(ctx, 0, 0, W, H, 0.31, { esmeril: [50, 62], esmerilHacia: 'arriba' });
    // sombra del alma sobre la base
    let g = ctx.createLinearGradient(0, 50, 0, 60); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 50, W, 10);
    // alma vertical vista en perspectiva: cara frontal y canto superior
    placa(ctx, 0, 21.5, W, 28.5, 0.47, { claro: '#a3a9b1', medio: '#878e97', oscuro: '#5b616a', esmeril: [40, 50], esmerilHacia: 'abajo' });
    g = ctx.createLinearGradient(0, 21.5, 0, 50); g.addColorStop(0, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(0,0,0,.35)');
    ctx.fillStyle = g; ctx.fillRect(0, 21.5, W, 28.5);
    g = ctx.createLinearGradient(0, 18, 0, 21.5); g.addColorStop(0, '#d5dae0'); g.addColorStop(1, '#9aa1a9');
    ctx.fillStyle = g; ctx.fillRect(0, 18, W, 3.5);
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 49.6, W, 0.6);
    punteado(ctx, 4, 50.5, 5, 0.5); punteado(ctx, W - 4, 50.5, 5, 0.7);
  } else if (id === 'traslape') {
    sombra(ctx, vista, () => ctx.fillRect(0, 30, W, H - 30));
    placa(ctx, 0, 30, W, H - 30, 0.53, { claro: '#6e7781', medio: '#5d6670', oscuro: '#4f5761', esmeril: [55, 66], esmerilHacia: 'arriba' });
    let g = ctx.createLinearGradient(0, 55, 0, 61); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 55, W, 6);
    sombra(ctx, vista, () => ctx.fillRect(0, 0, W, 54));
    placa(ctx, 0, 0, W, 53.6, 0.67, { claro: '#9aa2ab', medio: '#88909a', oscuro: '#778089', esmeril: [44, 53.6], esmerilHacia: 'abajo' });
    g = ctx.createLinearGradient(0, 53.6, 0, 55); g.addColorStop(0, '#6c727b'); g.addColorStop(1, '#2f333a');
    ctx.fillStyle = g; ctx.fillRect(0, 53.6, W, 1.4);
    punteado(ctx, 4, 55, 5, 0.8); punteado(ctx, W - 4, 55, 5, 0.9);
  } else if (id === 'tubo') {
    const [cx, cy] = junta.centro, ro = junta.radio - 2.2, ri = ro - 4;
    sombra(ctx, vista, () => ctx.fillRect(0, 0, W, H));
    placa(ctx, 0, 0, W, H, 0.71);
    // esmerilado en anillo alrededor del tubo
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, ro + 11, 0, Math.PI * 2); ctx.arc(cx, cy, ro, 0, Math.PI * 2, true); ctx.clip();
    let g = ctx.createRadialGradient(cx, cy, ro, cx, cy, ro + 11); g.addColorStop(0, 'rgba(206,212,220,.7)'); g.addColorStop(1, 'rgba(206,212,220,0)');
    ctx.fillStyle = g; ctx.fillRect(cx - ro - 12, cy - ro - 12, (ro + 12) * 2, (ro + 12) * 2); ctx.restore();
    // sombra del tubo
    ctx.save(); ctx.filter = `blur(${2.5 * vista.k * vista.dpr / 4}px)`;
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.arc(cx + 2.5, cy + 3.5, ro + 0.8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    // pared del tubo
    g = ctx.createLinearGradient(cx - ro, cy - ro, cx + ro, cy + ro);
    g.addColorStop(0, '#d9dee4'); g.addColorStop(0.35, '#a0a7b0'); g.addColorStop(0.7, '#6c737c'); g.addColorStop(1, '#4a5058');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, ro, 0, Math.PI * 2); ctx.arc(cx, cy, ri, 0, Math.PI * 2, true); ctx.fill('evenodd');
    // interior del tubo
    g = ctx.createRadialGradient(cx + 3, cy + 4, 2, cx, cy, ri);
    g.addColorStop(0, '#07080a'); g.addColorStop(0.75, '#1d2026'); g.addColorStop(1, '#4b5159');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, ri, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 0.3; ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(cx, cy, ri + 0.2, Math.PI * 0.1, Math.PI * 1.1); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.beginPath(); ctx.arc(cx, cy, ro, 0, Math.PI * 2); ctx.stroke();
    // puntos de armado a 90°
    for (const a of [0.25, 1.25]) { const x = cx + Math.cos(a * Math.PI) * junta.radio, y = cy + Math.sin(a * Math.PI) * junta.radio;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a * Math.PI); punteado(ctx, 0, 0, 4.5, a); ctx.restore(); }
  }
}

// ---------- cordón: cada gota deja una onda, color de revenido, salpicadura y escoria ----------
export function estampar(capas, vista, g, proceso) {
  const { tinte, cordon, escoria } = capas, R = azar(g.semilla);
  const ang = Math.atan2(g.ty, g.tx), w = g.w;
  if (g.def.includes('fuera')) { // golpes de arco sobre la placa
    vista.mm(cordon); cordon.fillStyle = 'rgba(30,30,34,.5)';
    cordon.beginPath(); cordon.arc(g.x + (R() - 0.5), g.y + (R() - 0.5), 0.5 + R() * 0.6, 0, Math.PI * 2); cordon.fill();
    return;
  }
  // revenido (colores de temple) alrededor del cordón
  vista.mm(tinte);
  const rt = w * (0.95 + Math.min(g.q, 3) * 0.45);
  const t = tinte.createRadialGradient(g.x, g.y, w * 0.3, g.x, g.y, rt);
  t.addColorStop(0, 'rgba(205,165,95,.04)'); t.addColorStop(0.35, 'rgba(150,92,60,.032)');
  t.addColorStop(0.6, 'rgba(92,62,130,.026)'); t.addColorStop(0.82, 'rgba(60,98,160,.018)'); t.addColorStop(1, 'rgba(60,98,160,0)');
  tinte.fillStyle = t; tinte.fillRect(g.x - rt, g.y - rt, rt * 2, rt * 2);

  if (g.quieto && !g.def.includes('perforacion')) return; // quieto en el mismo punto: solo calor
  vista.mm(cordon);
  const c = cordon;
  c.save(); c.translate(g.x, g.y); c.rotate(ang);
  const frio = g.def.includes('frio'), alto = lim(g.h / 2.2, 0.6, 1.8);
  const rx = w * (frio ? 0.26 : 0.34), ry = w / 2;
  // socavado: canal oscuro en los bordes
  if (g.def.includes('socavado')) {
    c.strokeStyle = 'rgba(12,12,14,.42)'; c.lineWidth = 0.38; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-0.35, -ry - 0.3); c.lineTo(0.35, -ry - 0.3); c.moveTo(-0.35, ry + 0.3); c.lineTo(0.35, ry + 0.3); c.stroke();
  }
  const mig = proceso.tipo === 'gmaw';
  // sombreado de lado a lado: pies oscuros que se funden con la placa, lomo con brillo
  const gr = c.createLinearGradient(0, -ry, 0, ry);
  const lomo = lim(0.3 - (alto - 1) * 0.06, 0.2, 0.36);
  gr.addColorStop(0, 'rgba(52,56,62,.85)');
  gr.addColorStop(0.1, mig ? '#7d6f5e' : '#69707a');
  gr.addColorStop(lomo, mig ? '#e6d8b9' : '#cdd3d9');
  gr.addColorStop(lomo + 0.14, mig ? '#b4a17f' : '#a3aab3');
  gr.addColorStop(0.72, mig ? '#857560' : '#767d86');
  gr.addColorStop(0.92, '#4c5158');
  gr.addColorStop(1, 'rgba(44,47,52,.85)');
  c.fillStyle = gr;
  c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); c.fill();
  // onda de solidificación: arco en el borde de atrás (lo que queda visible bajo la gota siguiente)
  c.strokeStyle = `rgba(18,20,24,${frio ? 0.5 : 0.17})`; c.lineWidth = frio ? 0.22 : 0.12;
  c.beginPath(); c.ellipse(0, 0, rx, ry * 0.92, 0, Math.PI * 0.62, Math.PI * 1.38); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.09)'; c.lineWidth = 0.1;
  c.beginPath(); c.ellipse(0.18, 0, rx, ry * 0.85, 0, Math.PI * 0.68, Math.PI * 1.32); c.stroke();
  // MIG: matices azul/dorado de óxido en la superficie
  if (mig && R() < 0.5) { c.fillStyle = R() < 0.5 ? 'rgba(90,110,170,.18)' : 'rgba(200,150,70,.18)'; c.beginPath(); c.ellipse(R() - 0.5, (R() - 0.5) * ry, rx * 0.6, ry * 0.4, 0, 0, Math.PI * 2); c.fill(); }
  if (g.def.includes('poro')) {
    const py = (R() - 0.5) * ry, pr = 0.25 + R() * 0.35;
    c.fillStyle = '#0b0b0d'; c.beginPath(); c.arc(0, py, pr, 0, Math.PI * 2); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 0.08; c.beginPath(); c.arc(0, py, pr + 0.06, Math.PI * 0.9, Math.PI * 1.7); c.stroke();
  }
  if (g.def.includes('perforacion')) {
    const hr = w * 0.28;
    const h = c.createRadialGradient(0, 0, 0, 0, 0, hr * 1.6);
    h.addColorStop(0, '#000'); h.addColorStop(0.55, '#050506'); h.addColorStop(0.75, '#3a2a22'); h.addColorStop(1, 'rgba(58,42,34,0)');
    c.fillStyle = h; c.beginPath(); c.ellipse(0, 0, hr * 1.3, hr * 1.6, 0, 0, Math.PI * 2); c.fill();
  }
  c.restore();
  // salpicadura: bolitas soldadas alrededor
  const n = Math.floor(g.salp * 0.9 + R() * (0.35 + g.salp * 0.5));
  for (let i = 0; i < n; i++) {
    const a = R() * Math.PI * 2, dist = w * (0.75 + R() * 2.4), r = 0.15 + R() * 0.35;
    const x = g.x + Math.cos(a) * dist, y = g.y + Math.sin(a) * dist;
    const s = c.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    s.addColorStop(0, '#e9e5dc'); s.addColorStop(0.5, '#6e675e'); s.addColorStop(1, '#25221f');
    c.fillStyle = s; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
  }
  // escoria del electrodo: costra vítrea encima del cordón
  if (proceso.escoria && escoria) {
    vista.mm(escoria);
    const e = escoria; e.save(); e.translate(g.x, g.y); e.rotate(ang);
    const es = e.createRadialGradient(-rx * 0.2, -ry * 0.4, 0, 0, 0, ry * 1.15);
    const tono = proceso.id === 'e7018' ? ['#6d6962', '#3c3934', '#1d1b18'] : ['#6f5638', '#3b2c1d', '#1b140d'];
    es.addColorStop(0, tono[0]); es.addColorStop(0.55, tono[1]); es.addColorStop(1, tono[2]);
    e.fillStyle = es; e.beginPath(); e.ellipse(0, 0, rx * 1.12, ry * 1.12, 0, 0, Math.PI * 2); e.fill();
    if (R() < 0.35) { e.strokeStyle = 'rgba(10,8,6,.6)'; e.lineWidth = 0.1; e.beginPath(); e.moveTo(-rx, (R() - 0.5) * ry); e.lineTo(rx, (R() - 0.5) * ry * 1.6); e.stroke(); }
    if (R() < 0.5) { e.fillStyle = 'rgba(255,240,220,.22)'; e.beginPath(); e.ellipse(-rx * 0.2, -ry * 0.45, rx * 0.4, ry * 0.12, 0, 0, Math.PI * 2); e.fill(); }
    e.restore();
  }
}

// ---------- en vivo: cordón aún caliente, charco, arco, chispas, humo ----------
export function colorCalor(T) { // T 1 → recién depositado, 0 → frío
  if (T > 0.75) return [255, 236 + (T - 0.75) * 76, 190 + (T - 0.75) * 260];
  if (T > 0.4) return [255, 120 + (T - 0.4) * 330, 40 + (T - 0.4) * 400];
  return [110 + T * 360, 20 + T * 250, 8 + T * 80];
}

export function dibujarCalientes(ctx, vista, calientes, ahora) {
  vista.mm(ctx);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const g of calientes) {
    const T = Math.exp(-(ahora - g.t) / 0.85);
    if (T < 0.04) continue;
    const [r, gg, b] = colorCalor(T), rad = g.w * (0.48 + T * 0.25);
    const gr = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, rad);
    gr.addColorStop(0, `rgba(${r | 0},${gg | 0},${b | 0},${0.55 * T})`); gr.addColorStop(1, `rgba(${r | 0},${gg | 0},${b | 0},0)`);
    ctx.fillStyle = gr; ctx.fillRect(g.x - rad, g.y - rad, rad * 2, rad * 2);
  }
  ctx.restore();
}

export function dibujarArco(ctx, vista, p, proceso, ancho, parpadeo, arcoLargo = 1) {
  vista.mm(ctx);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const mig = proceso.tipo === 'gmaw';
  // resplandor del arco
  const R = 26 * (0.85 + parpadeo * 0.3) * lim(arcoLargo, 0.7, 1.6);
  let g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R);
  g.addColorStop(0, mig ? 'rgba(210,225,255,.55)' : 'rgba(255,225,170,.5)'); g.addColorStop(0.25, mig ? 'rgba(150,175,255,.18)' : 'rgba(255,170,90,.16)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(p.x - R, p.y - R, R * 2, R * 2);
  // charco
  const r = ancho * 0.62;
  g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 1.6);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.28, 'rgba(255,250,225,.95)'); g.addColorStop(0.55, 'rgba(255,190,90,.7)'); g.addColorStop(1, 'rgba(255,90,20,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(p.x, p.y, r * 1.6, r * 1.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export class Particulas {
  constructor() { this.chispas = []; this.humo = []; }
  emitir(px, py, n, fuerza, mig) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = (120 + Math.random() * 520) * fuerza;
      this.chispas.push({ x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, vida: 0, max: 0.18 + Math.random() * (mig ? 0.4 : 0.7) });
    }
    if (Math.random() < (mig ? 0.15 : 0.45)) this.humo.push({ x: px + (Math.random() - 0.5) * 10, y: py, r: 6, vida: 0, max: 2 + Math.random() * 1.5, vx: (Math.random() - 0.5) * 14 });
  }
  paso(dt) {
    for (const c of this.chispas) { c.vida += dt; c.vx *= 0.985; c.vy = c.vy * 0.985 + 380 * dt; c.x += c.vx * dt; c.y += c.vy * dt; }
    this.chispas = this.chispas.filter(c => c.vida < c.max);
    for (const h of this.humo) { h.vida += dt; h.y -= 22 * dt; h.x += h.vx * dt; h.r += 18 * dt; }
    this.humo = this.humo.filter(h => h.vida < h.max);
    return this.chispas.length + this.humo.length;
  }
  dibujar(ctx, vista) {
    vista.px(ctx);
    for (const h of this.humo) {
      const a = 0.11 * (1 - h.vida / h.max);
      const g = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, h.r);
      g.addColorStop(0, `rgba(200,202,208,${a})`); g.addColorStop(1, 'rgba(200,202,208,0)');
      ctx.fillStyle = g; ctx.fillRect(h.x - h.r, h.y - h.r, h.r * 2, h.r * 2);
    }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (const c of this.chispas) {
      if (c.escama) continue;
      const T = 1 - c.vida / c.max, [r, g, b] = colorCalor(0.45 + T * 0.55);
      ctx.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${0.35 + T * 0.65})`; ctx.lineWidth = 0.8 + T * 1.1;
      ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x - c.vx * 0.022, c.y - c.vy * 0.022); ctx.stroke();
    }
    ctx.restore();
    // escamas de escoria que salta con la piqueta
    for (const c of this.chispas) if (c.escama) {
      ctx.fillStyle = `rgba(40,32,24,${1 - c.vida / c.max})`;
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.vida * 20); ctx.fillRect(-2.5, -1.5, 5, 3); ctx.restore();
    }
  }
}

// electrodo o antorcha que sostiene el dedo (cuando el punto de arco va desplazado sobre el dedo)
export function dibujarPortaelectrodo(ctx, vista, arcoPx, dedoPx, proceso, caliente) {
  vista.px(ctx);
  const [ax, ay] = arcoPx, [fx, fy] = dedoPx;
  const dx = fx - ax, dy = fy - ay, l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
  ctx.save(); ctx.lineCap = 'round';
  if (proceso.tipo === 'gmaw') {
    // boquilla de cobre y alambre
    ctx.strokeStyle = '#b9c0c7'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + ux * 8, ay + uy * 8); ctx.stroke();
    const g = ctx.createLinearGradient(ax - uy * 7, ay + ux * 7, ax + uy * 7, ay - ux * 7);
    g.addColorStop(0, '#5b3a1d'); g.addColorStop(0.45, '#e6a96a'); g.addColorStop(1, '#6d4523');
    ctx.strokeStyle = g; ctx.lineWidth = 13; ctx.beginPath(); ctx.moveTo(ax + ux * 10, ay + uy * 10); ctx.lineTo(fx, fy); ctx.stroke();
  } else {
    const g = ctx.createLinearGradient(ax - uy * 3, ay + ux * 3, ax + uy * 3, ay - ux * 3);
    g.addColorStop(0, '#5d564b'); g.addColorStop(0.5, proceso.revestimiento || '#b7a47e'); g.addColorStop(1, '#4a443b');
    ctx.strokeStyle = g; ctx.lineWidth = 5.5; ctx.beginPath(); ctx.moveTo(ax + ux * 3, ay + uy * 3); ctx.lineTo(fx, fy); ctx.stroke();
    ctx.strokeStyle = caliente ? '#ffb15a' : '#3b3b3e'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + ux * 4, ay + uy * 4); ctx.stroke();
  }
  ctx.restore();
}

// ---------- informe: corte transversal (macro con ataque químico) ----------
export function dibujarCorte(cv, res, junta, proceso, tema) {
  const dpr = Math.min(2, window.devicePixelRatio || 1), W = cv.clientWidth, H = cv.clientHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.fillStyle = tema === 'dia' ? '#eceef2' : '#2c3247'; c.fillRect(0, 0, W, H);
  const e = junta.espesor, k = Math.min(W / 46, H / (e + 9)), ox = W / 2, oy = H * 0.42;
  const X = x => ox + x * k, Y = y => oy + y * k;
  const base = c.createLinearGradient(0, Y(0), 0, Y(e)); base.addColorStop(0, '#c9cdd2'); base.addColorStop(1, '#aeb3ba');
  const w = res.ancho, h = Math.min(res.sobremonta, 5), p = Math.min(res.penetracion, e + 1.5);
  const zona = (pts) => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y))); c.closePath(); };
  const metal = () => { const g = c.createLinearGradient(0, Y(-h), 0, Y(p)); g.addColorStop(0, '#8d9299'); g.addColorStop(1, '#6f747c'); return g; };
  c.lineWidth = 1;
  let soldadura;
  if (junta.id === 'tope') {
    zona([[-22, 0], [-1 - e * 0.58, 0], [-1, e - 1.5], [-1, e], [-22, e]]); c.fillStyle = base; c.fill();
    zona([[22, 0], [1 + e * 0.58, 0], [1, e - 1.5], [1, e], [22, e]]); c.fill();
    const fondo = Math.min(p * 1.15, e + 1.2), ancho = w / 2;
    soldadura = [[-ancho, 0], [-ancho * 0.5, -h * 0.9], [0, -h], [ancho * 0.5, -h * 0.9], [ancho, 0], [1.2, fondo * 0.85], [0.6, fondo], [-0.6, fondo], [-1.2, fondo * 0.85]];
  } else {
    // filete / tubo / traslape: placa base y placa encima o vertical
    zona([[-22, 0], [22, 0], [22, e], [-22, e]]); c.fillStyle = base; c.fill();
    if (junta.id === 'traslape') { zona([[-22, -e], [0, -e], [0, 0], [-22, 0]]); c.fill(); }
    else { zona([[-e, -12], [0, -12], [0, 0], [-e, 0]]); c.fill(); }
    const pierna = w * 0.72, conv = (h - 2) * 0.6, pe = Math.min(p * 0.5, e * 0.6);
    const alto = junta.id === 'traslape' ? Math.min(pierna, e + 1) : pierna;
    soldadura = [[0, -alto], [pierna * 0.5 + conv * 0.3, -alto * 0.5 - conv * 0.3], [pierna, 0], [pierna * 0.6, pe * 0.7], [0.4, pe], [-0.6, pe * 0.6], [-0.8, -alto * 0.9]];
  }
  // zona afectada por el calor
  c.save(); c.filter = `blur(${k * 0.9}px)`; zona(soldadura.map(([x, y]) => [x * 1.35, y * 1.2 + (y > 0 ? 0.8 : 0)])); c.fillStyle = 'rgba(80,86,95,.55)'; c.fill(); c.restore();
  zona(soldadura); c.fillStyle = metal(); c.fill();
  // granos columnares
  c.save(); zona(soldadura); c.clip(); c.strokeStyle = 'rgba(40,44,50,.35)'; c.lineWidth = 0.6;
  for (let i = -14; i <= 14; i++) { c.beginPath(); c.moveTo(X(i * 0.6), Y(p + 1)); c.quadraticCurveTo(X(i * 0.45), Y(0), X(0), Y(-h * 0.4)); c.stroke(); }
  c.restore();
  // defectos marcados en el corte
  const ids = res.defectos.map(d => d.id);
  c.fillStyle = '#121316';
  if (ids.includes('poro')) for (const [x, y] of [[-0.8, -h * 0.3], [0.9, 0.6]]) { c.beginPath(); c.arc(X(x), Y(y), k * 0.25, 0, Math.PI * 2); c.fill(); }
  if (ids.includes('escoria')) { c.beginPath(); c.ellipse(X(0.6), Y(0.8), k * 0.6, k * 0.18, 0.3, 0, Math.PI * 2); c.fill(); }
  // cotas
  const tinta = tema === 'dia' ? '#1a1e2c' : '#eef1f8';
  c.strokeStyle = tinta; c.fillStyle = tinta; c.font = '500 11px "DM Mono", monospace'; c.lineWidth = 1;
  const cota = (x1, y1, x2, y2, txt, tx, ty, al = 'left') => { c.beginPath(); c.moveTo(X(x1), Y(y1)); c.lineTo(X(x2), Y(y2)); c.stroke(); c.textAlign = al; c.fillText(txt, tx, ty); };
  const xr = junta.id === 'tope' ? w / 2 + 3 : w * 0.72 + 3;
  cota(xr, -h, xr, 0, `sobremonta ${res.sobremonta.toFixed(1)} mm`, X(xr) + 6, Y(-h / 2) + 4);
  cota(xr, 0, xr, p, `penetración ${res.penetracion.toFixed(1)} mm`, X(xr) + 6, Y(p / 2) + 6);
  c.textAlign = 'left'; c.fillStyle = tema === 'dia' ? '#5f6679' : '#aab3c9';
  c.fillText(`placa ${e} mm · cordón ${w.toFixed(1)} mm de ancho`, 10, H - 10);
}

// ---------- informe: ritmo a lo largo de la junta ----------
export function dibujarRitmo(cv, perfil, tema) {
  const dpr = Math.min(2, window.devicePixelRatio || 1), W = cv.clientWidth, H = cv.clientHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
  const dia = tema === 'dia', tinta = dia ? '#1a1e2c' : '#eef1f8', suave = dia ? '#5f6679' : '#aab3c9';
  c.clearRect(0, 0, W, H);
  const top = 10, bot = H - 20, Y = r => bot - (lim(r, 0, 2.5) / 2.5) * (bot - top), X = i => 8 + i / (perfil.length - 1) * (W - 16);
  c.fillStyle = dia ? 'rgba(31,138,85,.14)' : 'rgba(127,214,164,.16)'; c.fillRect(8, Y(1.35), W - 16, Y(0.75) - Y(1.35));
  c.strokeStyle = suave; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(8, Y(1)); c.lineTo(W - 8, Y(1)); c.stroke(); c.setLineDash([]);
  c.strokeStyle = dia ? '#e8736a' : '#ee7f74'; c.lineWidth = 2; c.lineJoin = 'round'; c.beginPath();
  let abierto = false;
  perfil.forEach((r, i) => { if (r == null) { abierto = false; return; } abierto ? c.lineTo(X(i), Y(r)) : c.moveTo(X(i), Y(r)); abierto = true; });
  c.stroke();
  c.fillStyle = suave; c.font = '10px "DM Mono", monospace';
  c.fillText('rápido', 10, top + 9); c.fillText('lento', 10, bot - 3);
  c.fillStyle = tinta; c.textAlign = 'right'; c.fillText('inicio → fin de la junta', W - 8, H - 5);
}
