// Gemelo digital en isométrico (Canvas 2D, sin Three.js): la planta con sus máquinas y cada pieza moviéndose
// por su ruta, y la estructura en obra coloreada por estado de montaje. Mismo lenguaje visual que la Ciudad
// de acero: volúmenes planos con tres tonos, anotaciones en cursiva con guía punteada y datos en mono.
import { MAQUINAS, MAQ, estadoEn } from './planta.js';
import { PROFILES } from '../../studio/js/steel.js';

const C30 = Math.cos(Math.PI / 6), S30 = 0.5;
export const COLOR_ROL = { columna: '#ee7f74', viga: '#b6dbf8', vigueta: '#d9e2f1', diagonal: '#9aa3d4', cordon: '#ffd700', montante: '#f2c94c', correa: '#8fd6a8' };
export const COLOR_ESTADO = { pendiente: null, fabricada: '#b6dbf8', despachada: '#ffd700', montada: '#ee7f74' };
const FLUJO = ['almacen', 'sierra', 'taladro', 'granalla', 'soldadura', 'pintura', 'qc', 'despacho'];

const css = (k) => getComputedStyle(document.body).getPropertyValue(k).trim();
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const m = (c) => Math.max(0, Math.min(255, Math.round(f >= 0 ? c + (255 - c) * f : c * (1 + f))));
  return `rgb(${m(r)},${m(g)},${m(b)})`;
}

// Posición de cada unidad de máquina en planta (las máquinas en paralelo se reparten en z).
export function unidadesPlanta() {
  const out = {};
  for (const M of MAQUINAS) {
    const gap = 1.4;
    for (let i = 0; i < M.n; i++) {
      const id = `${M.id}${M.n > 1 ? '-' + (i + 1) : ''}`;
      const z = M.pos[1] + (i - (M.n - 1) / 2) * (M.size[1] + gap);
      out[id] = { id, maq: M.id, x: M.pos[0], z, w: M.size[0], d: M.size[1], h: M.size[2] };
    }
  }
  return out;
}

export function crearGemelo(canvas, { onMaquina, onPieza } = {}) {
  const ctx = canvas.getContext('2d');
  const U = unidadesPlanta();
  let modo = 'planta', op = null, t = 0, estados = {}, sel = null, selMaq = null, dpr = 1;
  const vista = { s: 14, ox: 0, oy: 0, fit: true };
  const P = (x, z, y = 0) => [vista.ox + (x - z) * C30 * vista.s, vista.oy + ((x + z) * S30 - y) * vista.s];

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, r.width * dpr); canvas.height = Math.max(1, r.height * dpr);
    if (vista.fit) encuadrar();
    draw();
  }
  function encuadrar() {
    const r = canvas.getBoundingClientRect();
    let pts;
    if (modo === 'planta') pts = Object.values(U).flatMap((u) => [[u.x - u.w / 2, u.z - u.d / 2, 0], [u.x + u.w / 2, u.z + u.d / 2, 0], [u.x - u.w / 2, u.z + u.d / 2, u.h + 3], [u.x + u.w / 2, u.z - u.d / 2, u.h + 3]]);
    else pts = (op?.despiece.piezas || []).flatMap((p) => [[p.a[0], p.a[2], p.a[1]], [p.b[0], p.b[2], p.b[1]]]);
    if (!pts.length) return;
    const xs = pts.map(([x, z]) => (x - z) * C30), ys = pts.map(([x, z, y]) => (x + z) * S30 - y);
    const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
    const padTop = r.width < 700 ? 40 : 90, padBot = 80;
    vista.s = Math.min((r.width - 60) / w, (r.height - padTop - padBot) / h);
    vista.ox = r.width / 2 - ((Math.max(...xs) + Math.min(...xs)) / 2) * vista.s;
    vista.oy = padTop + (r.height - padTop - padBot) / 2 - ((Math.max(...ys) + Math.min(...ys)) / 2) * vista.s;
  }

  function poly(pts, fill, stroke) {
    ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
  }
  // Caja con tres caras visibles (arriba, cara x+ y cara z+).
  function caja(x, z, w, d, y0, h, color, edge) {
    const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2, y1 = y0 + h;
    poly([P(x0, z1, y0), P(x1, z1, y0), P(x1, z1, y1), P(x0, z1, y1)], shade(color, -0.28), edge);
    poly([P(x1, z0, y0), P(x1, z1, y0), P(x1, z1, y1), P(x1, z0, y1)], shade(color, -0.12), edge);
    poly([P(x0, z0, y1), P(x1, z0, y1), P(x1, z1, y1), P(x0, z1, y1)], shade(color, 0.12), edge);
  }
  let cajas = [];
  function nota(x, y, titulo, dato, dx = 0, dy = -46) {
    const tinta = css('--tinta') || '#fff';
    const chico = canvas.getBoundingClientRect().width < 640;
    if (chico) { dy *= 0.6; dato = ''; }
    ctx.save();
    // Si la etiqueta pisa a otra ya dibujada en este cuadro, sube hasta quedar libre.
    ctx.font = `italic 400 ${chico ? 12 : 14}px Outfit, sans-serif`;
    const ancho = Math.max(ctx.measureText(titulo).width, dato.length * 6.4) + 10, alto = chico ? 16 : 32;
    const caja = () => ({ x0: x + dx - ancho / 2, x1: x + dx + ancho / 2, y1: y + dy, y0: y + dy - alto });
    const choca = (a) => cajas.some((b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0);
    for (let i = 0; i < 8 && choca(caja()); i++) dy -= chico ? 9 : 12;
    cajas.push(caja());
    ctx.strokeStyle = tinta; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx, y + dy); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = tinta; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.font = `italic 400 ${chico ? 12 : 14}px Outfit, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText(titulo, x + dx, y + dy - (chico ? 5 : 18));
    ctx.font = '500 10px "DM Mono", monospace'; ctx.fillStyle = css('--celeste-txt') || '#b6dbf8';
    ctx.fillText(dato.toUpperCase(), x + dx, y + dy - 5);
    ctx.restore();
  }

  function drawPlanta() {
    cajas = [];
    const dia = document.body.classList.contains('dia');
    const base = dia ? '#f4f5f8' : '#424a66', maqColor = dia ? '#ffffff' : '#525b7a', edge = dia ? 'rgba(26,30,44,.12)' : 'rgba(255,255,255,.05)';
    // Piso de la nave con retícula de ejes cada 3 m.
    const X0 = -4, X1 = 56, Z0 = -9, Z1 = 14;
    poly([P(X0, Z0), P(X1, Z0), P(X1, Z1), P(X0, Z1)], base);
    ctx.strokeStyle = dia ? 'rgba(26,30,44,.07)' : 'rgba(255,255,255,.06)'; ctx.lineWidth = 1;
    for (let x = X0; x <= X1; x += 3) { ctx.beginPath(); ctx.moveTo(...P(x, Z0)); ctx.lineTo(...P(x, Z1)); ctx.stroke(); }
    for (let z = Z0; z <= Z1; z += 3) { ctx.beginPath(); ctx.moveTo(...P(X0, z)); ctx.lineTo(...P(X1, z)); ctx.stroke(); }
    // Columnas de la nave (el taller también es de acero).
    for (let x = X0; x <= X1; x += 12) for (const z of [Z0, Z1]) caja(x, z, 0.4, 0.4, 0, 7, dia ? '#d9dde6' : '#5a6385', null);
    // Transportador: flujo principal y ramal de placas.
    ctx.save(); ctx.strokeStyle = css('--coral') || '#ee7f74'; ctx.lineWidth = 1.6; ctx.setLineDash([6, 5]);
    const cen = (m) => { const us = Object.values(U).filter((u) => u.maq === m); return [us.reduce((s, u) => s + u.x, 0) / us.length, us.reduce((s, u) => s + u.z, 0) / us.length]; };
    ctx.beginPath(); FLUJO.forEach((m, i) => { const [x, z] = cen(m); const p = P(x, z, 0.05); i ? ctx.lineTo(...p) : ctx.moveTo(...p); }); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(...P(...cen('plasma'), 0.05)); ctx.lineTo(...P(cen('plasma')[0], 0, 0.05)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(...P(...cen('plasma'), 0.05)); ctx.lineTo(...P(cen('soldadura')[0], cen('plasma')[1], 0.05)); ctx.lineTo(...P(...cen('soldadura'), 0.05)); ctx.stroke();
    ctx.restore();

    const est = op ? estadoEn(op.sim, t) : {};
    const enUnidad = {}, cola = {}, espera = [], listas = [], transito = [];
    for (const [id, s] of Object.entries(est)) {
      if (s.estado === 'proceso') (enUnidad[s.unidad] ||= []).push([id, s]);
      else if (s.estado === 'espera') espera.push(id);
      else if (s.estado === 'lista') listas.push(id);
      else if (s.estado === 'transito') { const m = U[s.a]?.maq; if (m && s.f >= 1) cola[m] = (cola[m] || 0) + 1; transito.push([id, s]); }
    }
    // Placas en el plasma.
    const plasmaActivo = op && op.sim.ops.some((o) => o.maq === 'plasma' && o.start <= t && t <= o.end);
    const piezas = op ? Object.fromEntries(op.despiece.piezas.map((p) => [p.id, p])) : {};
    const items = Object.values(U).sort((a, b) => a.x + a.z - (b.x + b.z));
    const busyColor = css('--coral') || '#ee7f74';
    for (const u of items) {
      const activo = (enUnidad[u.id] || []).length || (u.maq === 'plasma' && plasmaActivo);
      const esSel = selMaq === u.maq;
      if (u.maq === 'almacen' || u.maq === 'despacho') {
        caja(u.x, u.z, u.w, u.d, 0, 0.15, dia ? '#e3e6ee' : '#4b5474', edge);
        // racks
        for (let i = 0; i < 3; i++) caja(u.x - u.w / 2 + 0.6 + i * 1.9, u.z, 0.25, u.d - 0.6, 0, u.h, maqColor, edge);
        const lista = u.maq === 'almacen' ? espera : listas;
        const n = lista.length, filas = Math.min(14, Math.ceil(n / 3));
        for (let k = 0; k < filas; k++) for (let i = 0; i < Math.min(3, n - k * 3); i++) {
          const pz = piezas[lista[k * 3 + i]];
          caja(u.x - u.w / 2 + 1.5 + i * 1.6, u.z, 0.9, Math.min(u.d - 1, (pz?.length || 6000) / 1200), 0.2 + k * 0.32, 0.24, COLOR_ROL[pz?.role] || '#b6dbf8', null);
        }
        continue;
      }
      caja(u.x, u.z, u.w, u.d, 0, u.h * 0.55, esSel ? shade(maqColor, 0.15) : maqColor, edge);
      caja(u.x + u.w * 0.12, u.z - u.d * 0.1, u.w * 0.55, u.d * 0.6, u.h * 0.55, u.h * 0.45, activo ? busyColor : (dia ? '#cfd8e6' : '#6d779c'), edge);
      // pieza en proceso sobre la máquina
      for (const [id] of enUnidad[u.id] || []) {
        const pz = piezas[id];
        caja(u.x - u.w * 0.2, u.z + u.d * 0.28, Math.min(u.w * 1.6, (pz.length / 1000) * 0.55 + 0.6), 0.32, u.h * 0.55, 0.3, COLOR_ROL[pz.role] || '#fff', null);
      }
    }
    // Piezas en tránsito (puente grúa o rodillos) entre estaciones.
    for (const [id, s] of transito) {
      const pz = piezas[id], a = U[s.de], b = U[s.a];
      if (!a || !b) continue;
      const f = Math.min(1, s.f), x = a.x + (b.x - a.x) * f, z = a.z + (b.z - a.z) * f + (f >= 1 ? b.d / 2 + 0.8 : 0);
      caja(x, z, Math.min(3.5, pz.length / 2500 + 0.5), 0.3, 0.6, 0.28, COLOR_ROL[pz.role] || '#fff', null);
    }
    // Anotaciones.
    const sim = op?.sim;
    const ya = new Set();
    for (const u of items) {
      if (ya.has(u.maq)) continue;
      ya.add(u.maq);
      const M = MAQ[u.maq], us = Object.values(U).filter((v) => v.maq === u.maq);
      const top = us[0], px = P(top.x, top.z - top.d / 2, top.h);
      const uso = sim ? sim.maquinas.find((m) => m.id === u.maq) : null;
      const dato = u.maq === 'almacen' ? `${espera.length} piezas por cortar` : u.maq === 'despacho' ? `${listas.length} listas para obra` : `${M.n > 1 ? M.n + ' × ' : ''}${uso ? Math.round((uso.ocupado / M.n / (sim.makespan || 1)) * 100) : 0} % uso${cola[u.maq] ? ' · cola ' + cola[u.maq] : ''}`;
      const alt = { sierra: -84, granalla: -104, pintura: -104, despacho: -70, soldadura: -36, taladro: -36, plasma: -36, qc: -40, almacen: -36 }[u.maq] ?? -40;
      nota(px[0], px[1], M.corto, dato, 0, alt);
    }
  }

  function drawEstructura() {
    if (!op) return;
    const dia = document.body.classList.contains('dia');
    const pz = [...op.despiece.piezas].sort((a, b) => (a.centro[0] + a.centro[2]) - (b.centro[0] + b.centro[2]) || a.centro[1] - b.centro[1]);
    // sombra del lote
    ctx.lineCap = 'round';
    for (const p of pz) {
      const e = estados[p.id] || 'pendiente';
      const a = P(p.a[0], p.a[2], p.a[1]), b = P(p.b[0], p.b[2], p.b[1]);
      const w = Math.max(1.2, PROFILES[p.profile].h * vista.s * 0.9);
      const c = COLOR_ESTADO[e];
      ctx.strokeStyle = c || (dia ? 'rgba(26,30,44,.22)' : 'rgba(255,255,255,.2)');
      ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke();
      if (sel === p.id) { ctx.strokeStyle = dia ? '#1a1e2c' : '#fff'; ctx.lineWidth = w + 3; ctx.globalAlpha = .9; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); ctx.globalAlpha = 1; }
    }
    if (sel) {
      const p = op.despiece.piezas.find((q) => q.id === sel);
      if (p) { const c = P(p.centro[0], p.centro[2], p.centro[1]); nota(c[0], c[1], p.id, `${p.levelName} · montaje #${p.seq}`, 30, -50); }
    }
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, r.width, r.height);
    if (modo === 'planta') drawPlanta(); else drawEstructura();
  }

  // Interacción: arrastrar para mover, rueda o pellizco para acercar, clic para elegir.
  let drag = null, moved = false;
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, ox: vista.ox, oy: vista.oy }; moved = false; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.hypot(dx, dy) > 4) moved = true; vista.ox = drag.ox + dx; vista.oy = drag.oy + dy; vista.fit = false; draw(); });
  canvas.addEventListener('pointerup', (e) => { drag = null; if (!moved) pick(e); });
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, f = Math.exp(-e.deltaY * 0.0015);
    vista.ox = mx - (mx - vista.ox) * f; vista.oy = my - (my - vista.oy) * f; vista.s *= f; vista.fit = false; draw();
  }, { passive: false });
  canvas.addEventListener('dblclick', () => { vista.fit = true; encuadrar(); draw(); });

  function pick(e) {
    const r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    if (modo === 'planta') {
      let best = null;
      for (const u of Object.values(U)) {
        const c = P(u.x, u.z, u.h / 2), d = Math.hypot(c[0] - mx, c[1] - my);
        if (d < Math.max(30, u.w * vista.s * 0.8) && (!best || d < best.d)) best = { d, u };
      }
      selMaq = best ? best.u.maq : null;
      onMaquina?.(selMaq);
      draw();
    } else if (op) {
      let best = null;
      for (const p of op.despiece.piezas) {
        const a = P(p.a[0], p.a[2], p.a[1]), b = P(p.b[0], p.b[2], p.b[1]);
        const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy || 1;
        const k = Math.max(0, Math.min(1, ((mx - a[0]) * dx + (my - a[1]) * dy) / L2));
        const d = Math.hypot(a[0] + dx * k - mx, a[1] + dy * k - my);
        if (d < 10 && (!best || d < best.d)) best = { d, p };
      }
      if (best) { sel = best.p.id; onPieza?.(sel); draw(); }
    }
  }

  new ResizeObserver(resize).observe(canvas);
  return {
    setModo(m) { if (m !== modo) { modo = m; vista.fit = true; encuadrar(); draw(); } },
    setDatos(o) { op = o; vista.fit = true; encuadrar(); draw(); },
    setTiempo(v) { t = v; if (modo === 'planta') draw(); },
    setEstados(e) { estados = e; if (modo === 'estructura') draw(); },
    seleccionar(id) { sel = id; draw(); },
    seleccionarMaquina(m) { selMaq = m; draw(); },
    draw, resize,
  };
}
