// Detección del vano en la foto (fase 1, todo en el teléfono, sin servidor):
// 1) SlimSAM (versión liviana del Segment Anything de Meta, vía transformers.js) recorta la región que el usuario toca.
// 2) Un ajuste geométrico convierte ese recorte en un cuadrilátero de 4 esquinas (líneas del marco, perspectiva).
// El modelo (~14 MB) se descarga una sola vez de Hugging Face y el navegador lo guarda en caché.
import { useEffect, useRef, useState } from 'react';

const MODELO = 'Xenova/slimsam-77-uniform';
const TRANSFORMERS_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2/dist/transformers.min.js';
const LADO = 768; // la foto se reduce a este lado mayor antes de pasarla al modelo (SAM trabaja a 1024)

let cargando = null; // promesa única del modelo
const embebidos = new Map(); // foto (url) -> { entradas, embebido, W, H }

/* Carga perezosa del modelo; `alProgreso(0..1)` informa la descarga. */
function cargarModelo(alProgreso) {
  if (cargando) return cargando;
  cargando = (async () => {
    // se carga del CDN solo cuando hace falta: no pesa en la app ni en el repositorio (el motor .wasm también viene del CDN)
    const T = await import(/* @vite-ignore */ TRANSFORMERS_URL);
    const { SamModel, AutoProcessor, env } = T;
    env.allowLocalModels = false;
    const archivos = {};
    const progress_callback = (p) => {
      if (p.status === 'progress' && p.total) { archivos[p.file] = [p.loaded, p.total]; const v = Object.values(archivos); alProgreso?.(v.reduce((a, [l]) => a + l, 0) / v.reduce((a, [, t]) => a + t, 0)); }
    };
    const webgpu = typeof navigator !== 'undefined' && !!navigator.gpu && !!(await navigator.gpu.requestAdapter().catch(() => null));
    const opciones = webgpu ? { device: 'webgpu', dtype: 'fp16' } : { device: 'wasm', dtype: 'q8' };
    const [modelo, procesador] = await Promise.all([SamModel.from_pretrained(MODELO, { ...opciones, progress_callback }), AutoProcessor.from_pretrained(MODELO)]);
    return { modelo, procesador, RawImage: T.RawImage, Tensor: T.Tensor, webgpu };
  })();
  cargando.catch(() => { cargando = null; });
  return cargando;
}

function imagenReducida(url) {
  return new Promise((ok, mal) => {
    const i = new Image(); i.crossOrigin = 'anonymous';
    i.onload = () => { const k = Math.min(1, LADO / Math.max(i.naturalWidth, i.naturalHeight)); const c = document.createElement('canvas'); c.width = Math.round(i.naturalWidth * k); c.height = Math.round(i.naturalHeight * k); c.getContext('2d').drawImage(i, 0, 0, c.width, c.height); ok(c); };
    i.onerror = () => mal(new Error('No se pudo leer la foto')); i.src = url;
  });
}

/* Calcula (una vez por foto) el "embebido" de la imagen: es lo lento; luego cada toque tarda ~0,1 s. */
async function prepararFoto(url, alProgreso) {
  if (embebidos.has(url)) return embebidos.get(url);
  const p = (async () => {
    const m = await cargarModelo(alProgreso);
    const lienzo = await imagenReducida(url);
    const img = m.RawImage.fromCanvas(lienzo);
    const entradas = await m.procesador(img);
    const embebido = await m.modelo.get_image_embeddings(entradas);
    return { m, entradas, embebido, W: lienzo.width, H: lienzo.height };
  })();
  embebidos.set(url, p);
  p.catch(() => embebidos.delete(url));
  return p;
}

/* Segmenta la región que contiene el punto (u,v) en fracciones de la foto. Devuelve { mascara: Uint8Array, W, H, puntaje }. */
async function segmentar(url, u, v) {
  const prueba = globalThis.__segmentadorPrueba; // solo para pruebas automáticas sin descargar el modelo
  if (prueba) return prueba(url, u, v);
  const { m, entradas, embebido, W, H } = await prepararFoto(url);
  const pts = m.procesador.reshape_input_points([[[u * W, v * H]]], entradas.original_sizes, entradas.reshaped_input_sizes);
  const etiquetas = new m.Tensor('int64', [1n], [1, 1, 1]);
  const { pred_masks, iou_scores } = await m.modelo({ ...embebido, input_points: pts, input_labels: etiquetas });
  const [mascaras] = await m.procesador.post_process_masks(pred_masks, entradas.original_sizes, entradas.reshaped_input_sizes);
  const puntajes = iou_scores.data; let mejor = 0; for (let i = 1; i < puntajes.length; i++) if (puntajes[i] > puntajes[mejor]) mejor = i;
  const n = W * H; const datos = mascaras.data; const mascara = new Uint8Array(n);
  for (let i = 0; i < n; i++) mascara[i] = datos[mejor * n + i] ? 1 : 0;
  return { mascara, W, H, puntaje: puntajes[mejor] };
}

/* ---------- geometría: del recorte a 4 esquinas ---------- */

/* Componente conexa que contiene el punto tocado (o la más grande si el punto cae fuera). */
function componente(mask, W, H, sx, sy) {
  const vista = new Uint8Array(W * H); let mejor = null;
  const llenar = (s) => { const pila = [s], idx = []; vista[s] = 1; while (pila.length) { const p = pila.pop(); idx.push(p); const x = p % W, y = (p / W) | 0; for (const q of [x > 0 && p - 1, x < W - 1 && p + 1, y > 0 && p - W, y < H - 1 && p + W]) if (q !== false && mask[q] && !vista[q]) { vista[q] = 1; pila.push(q); } } return idx; };
  const semilla = sy * W + sx;
  if (mask[semilla]) return llenar(semilla);
  for (let i = 0; i < W * H; i++) if (mask[i] && !vista[i]) { const c = llenar(i); if (!mejor || c.length > mejor.length) mejor = c; }
  return mejor || [];
}
function envolvente(pts) { // casco convexo (cadena monótona)
  pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cruz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], hi = [];
  for (const p of pts) { while (lo.length >= 2 && cruz(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length >= 2 && cruz(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
  return lo.slice(0, -1).concat(hi.slice(0, -1));
}
const areaPoli = (q) => Math.abs(q.reduce((a, p, i) => { const r = q[(i + 1) % q.length]; return a + p[0] * r[1] - r[0] * p[1]; }, 0)) / 2;
function distSeg(p, a, b) { const dx = b[0] - a[0], dy = b[1] - a[1]; const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); }
function recta(pts) { // recta por mínimos cuadrados totales: punto medio + dirección principal
  const n = pts.length, mx = pts.reduce((a, p) => a + p[0], 0) / n, my = pts.reduce((a, p) => a + p[1], 0) / n;
  let sxx = 0, sxy = 0, syy = 0; for (const [x, y] of pts) { sxx += (x - mx) ** 2; sxy += (x - mx) * (y - my); syy += (y - my) ** 2; }
  const ang = 0.5 * Math.atan2(2 * sxy, sxx - syy); return { p: [mx, my], d: [Math.cos(ang), Math.sin(ang)] };
}
function cruce(r1, r2) { const det = r1.d[0] * r2.d[1] - r1.d[1] * r2.d[0]; if (Math.abs(det) < 1e-6) return null; const t = ((r2.p[0] - r1.p[0]) * r2.d[1] - (r2.p[1] - r1.p[1]) * r2.d[0]) / det; return [r1.p[0] + t * r1.d[0], r1.p[1] + t * r1.d[1]]; }
const convexo = (q) => { let s = 0; for (let i = 0; i < 4; i++) { const a = q[i], b = q[(i + 1) % 4], c = q[(i + 2) % 4]; const z = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]); if (z === 0) return false; if (s && Math.sign(z) !== s) return false; s = Math.sign(z); } return true; };

function rellenarHuecos(en, W, H) { // marca como fondo lo que se alcanza desde el marco; el resto es parte del recorte
  const fuera = new Uint8Array(W * H), pila = [];
  const sembrar = (i) => { if (!en[i] && !fuera[i]) { fuera[i] = 1; pila.push(i); } };
  for (let x = 0; x < W; x++) { sembrar(x); sembrar((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { sembrar(y * W); sembrar(y * W + W - 1); }
  while (pila.length) { const p = pila.pop(), x = p % W, y = (p / W) | 0; if (x > 0) sembrar(p - 1); if (x < W - 1) sembrar(p + 1); if (y > 0) sembrar(p - W); if (y < H - 1) sembrar(p + W); }
  for (let i = 0; i < W * H; i++) if (!fuera[i]) en[i] = 1;
}

/* Del recorte (máscara) a un cuadrilátero [TL, TR, BR, BL] en fracciones de la foto. */
export function cuadrilatero(mask, W, H, u = 0.5, v = 0.5) {
  const comp = componente(mask, W, H, Math.min(W - 1, Math.max(0, Math.round(u * W))), Math.min(H - 1, Math.max(0, Math.round(v * H))));
  if (comp.length < W * H * 0.002) return null; // nada útil
  const en = new Uint8Array(W * H); for (const i of comp) en[i] = 1;
  rellenarHuecos(en, W, H); // reflejos o vidrios dejan huecos dentro del recorte: solo cuenta el contorno exterior
  const borde = []; for (let i = 0; i < W * H; i++) { if (!en[i]) continue; const x = i % W, y = (i / W) | 0; if (x === 0 || y === 0 || x === W - 1 || y === H - 1 || !en[i - 1] || !en[i + 1] || !en[i - W] || !en[i + W]) borde.push([x, y]); }
  const casco = envolvente(borde);
  // esquinas iniciales: extremos en las diagonales
  const ext = (f) => casco.reduce((a, p) => (f(p) > f(a) ? p : a), casco[0]);
  let q = [ext((p) => -p[0] - p[1]), ext((p) => p[0] - p[1]), ext((p) => p[0] + p[1]), ext((p) => p[1] - p[0])];
  // refinar: cada lado se ajusta a los puntos del borde cercanos a él y las esquinas son los cruces de esas rectas
  const tol = Math.hypot(W, H) * 0.04;
  const lados = [0, 1, 2, 3].map((k) => borde.filter((p) => distSeg(p, q[k], q[(k + 1) % 4]) < tol));
  if (lados.every((l) => l.length >= 8)) {
    const r = lados.map(recta);
    const n = [3, 0, 1, 2].map((k, i) => cruce(r[k], r[i]));
    const dentro = n.every((p) => p && p[0] > -0.05 * W && p[0] < 1.05 * W && p[1] > -0.05 * H && p[1] < 1.05 * H);
    if (dentro && convexo(n) && areaPoli(n) > areaPoli(casco) * 0.8 && areaPoli(n) < areaPoli(casco) * 1.3) q = n;
  }
  const esquinas = q.map(([x, y]) => [Math.min(1, Math.max(0, x / W)), Math.min(1, Math.max(0, y / H))]);
  return { esquinas, relleno: areaPoli(casco) ? comp.length / areaPoli(casco) : 0 };
}

/* Máscara → imagen (celeste translúcida) para mostrarla sobre la foto. */
export function mascaraUrl(mask, W, H) {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); const d = g.createImageData(W, H);
  for (let i = 0; i < W * H; i++) if (mask[i]) { d.data[i * 4] = 143; d.data[i * 4 + 1] = 198; d.data[i * 4 + 2] = 240; d.data[i * 4 + 3] = 110; }
  g.putImageData(d, 0, 0); return c.toDataURL();
}

/* Hook: prepara la IA para la foto actual y expone detectar(u, v). */
export function useDetectorVano(foto) {
  const [estado, setEstado] = useState('inactivo'); // inactivo | cargando | lista | error
  const [progreso, setProgreso] = useState(0);
  const [error, setError] = useState('');
  const vivo = useRef(true);
  useEffect(() => {
    vivo.current = true;
    if (!foto) return;
    if (globalThis.__segmentadorPrueba) { setEstado('lista'); return; }
    setEstado('cargando'); setError('');
    prepararFoto(foto, (p) => vivo.current && setProgreso(p)).then(() => vivo.current && setEstado('lista')).catch((e) => { if (!vivo.current) return; console.warn('detector', e); setEstado('error'); setError(e.message || String(e)); });
    return () => { vivo.current = false; };
  }, [foto]);
  async function detectar(u, v) {
    const r = await segmentar(foto, u, v);
    const q = cuadrilatero(r.mascara, r.W, r.H, u, v);
    if (!q) return null;
    return { ...q, puntaje: r.puntaje, mascara: mascaraUrl(r.mascara, r.W, r.H) };
  }
  return { estado, progreso, error, detectar };
}
