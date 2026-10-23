/**
 * js/presentacion.js
 * ─────────────────────────────────────────────────────────────
 * Generador de outputs para presentaciones (presentacion.html).
 * Toma una imagen ANTES y una DESPUÉS y produce, todo en el navegador:
 *  - Video tipo reel: una sola toma con acercamiento lento (como un
 *    dron), transición antes → después y cierre con logo.
 *  - Lámina PNG antes/después con título, datos y cuenta.
 *  - Portada PNG con la imagen DESPUÉS a sangre.
 * Además arma los prompts para generar las dos imágenes en estilo
 * "maqueta física a escala" con el mismo encuadre.
 * No sube nada a ningún servidor.
 * ─────────────────────────────────────────────────────────────
 */
(function(){

/* ============================================================
   CONFIGURACIÓN
============================================================ */
const PZ_FORMATS = {
  reel:  { w:1080, h:1920, ratio:'vertical 9:16' },
  post:  { w:1080, h:1350, ratio:'vertical 4:5' },
  slide: { w:1920, h:1080, ratio:'horizontal 16:9' }
};

// Línea de tiempo del video (segundos)
const PZ_T = {
  fadeIn: 0.5,
  transStart: 4.0,
  transEnd: 5.4,
  endStart: 9.2,
  total: 11.0
};
const PZ_FPS = 30;

const PZ_COLORS = {
  paper:'#0f1216', line:'rgba(140,182,255,.16)', ink:'#eef1f4', soft:'#8b96a5',
  hot1:'#FF4500', hot2:'#FF8C00', hot3:'#FFD700'
};

/* ============================================================
   DOM
============================================================ */
const $ = (id) => document.getElementById(id);
const canvas = $('pzCanvas');
const ctx = canvas.getContext('2d');
const statusEl = $('pzStatus');
const bar = $('pzBar');
const btnPlay = $('pzPlay');
const btnVideo = $('pzVideo');
const btnSheet = $('pzSheet');
const btnCover = $('pzCover');

/* ============================================================
   ESTADO
============================================================ */
const pzImgs = { antes:null, despues:null };
const pzLogo = new Image();
pzLogo.src = 'images/logo.png';

let pzPlaying = false;
let pzRecording = false;
let pzStartTs = 0;
let pzRaf = 0;

/* ============================================================
   UTILIDADES
============================================================ */
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const easeInOut = (v) => v < .5 ? 2*v*v : 1 - Math.pow(-2*v + 2, 2) / 2;
const easeOut = (v) => 1 - Math.pow(1 - v, 3);
const ramp = (t, a, b) => clamp01((t - a) / (b - a));

function pzVal(id){ return ($(id).value || '').trim(); }
function pzRadio(name){ return document.querySelector(`input[name="${name}"]:checked`).value; }
function pzFormat(){ return PZ_FORMATS[pzRadio('pzFormat')]; }
function pzReady(){ return pzImgs.antes && pzImgs.despues; }

function pzSetStatus(msg){ statusEl.textContent = msg || ''; }

function pzSlug(){
  const s = (pzVal('pzTitle') || 'presentacion').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return s || 'presentacion';
}

function pzDownload(blob, name){
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// Dibuja la imagen cubriendo el rectángulo (como object-fit: cover),
// con zoom >= 1 y desplazamiento pan (-1..1) dentro del sobrante.
function drawCover(c, img, x, y, w, h, zoom = 1, panX = 0, panY = 0){
  const s = Math.max(w / img.width, h / img.height) * zoom;
  const dw = img.width * s, dh = img.height * s;
  const dx = x + (w - dw) / 2 - panX * (dw - w) / 2;
  const dy = y + (h - dh) / 2 - panY * (dh - h) / 2;
  c.save();
  c.beginPath(); c.rect(x, y, w, h); c.clip();
  c.drawImage(img, dx, dy, dw, dh);
  c.restore();
}

function hotGradient(c, x0, x1){
  const g = c.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, PZ_COLORS.hot1);
  g.addColorStop(.5, PZ_COLORS.hot2);
  g.addColorStop(1, PZ_COLORS.hot3);
  return g;
}

// Rótulo tipo "fig-tag": caja oscura con texto mono, o térmica si hot = true
function drawTag(c, text, x, y, u, hot = false){
  c.save();
  c.font = `700 ${Math.round(26*u)}px "JetBrains Mono", monospace`;
  const padX = 16*u, h = 46*u;
  const w = c.measureText(text).width + padX*2;
  c.fillStyle = hot ? hotGradient(c, x, x + w) : 'rgba(15,18,22,.78)';
  c.fillRect(x, y, w, h);
  if (!hot){
    c.strokeStyle = 'rgba(238,241,244,.25)'; c.lineWidth = Math.max(1, 1.5*u);
    c.strokeRect(x, y, w, h);
  }
  c.fillStyle = hot ? '#1A1A1E' : PZ_COLORS.ink;
  c.textBaseline = 'middle';
  c.fillText(text, x + padX, y + h/2 + 1*u);
  c.restore();
  return w;
}

function drawLogo(c, x, y, h, align = 'left'){
  if (!pzLogo.complete || !pzLogo.naturalWidth) return 0;
  const w = h * pzLogo.naturalWidth / pzLogo.naturalHeight;
  const dx = align === 'center' ? x - w/2 : align === 'right' ? x - w : x;
  c.drawImage(pzLogo, dx, y, w, h);
  return w;
}

// Ajusta el texto a un ancho máximo partiéndolo en líneas
function wrapLines(c, text, maxW){
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  words.forEach(word => {
    const test = line ? `${line} ${word}` : word;
    if (c.measureText(test).width > maxW && line){ lines.push(line); line = word; }
    else line = test;
  });
  if (line) lines.push(line);
  return lines;
}

/* ============================================================
   FRAME DEL VIDEO
============================================================ */
function pzDrawFrame(t){
  const { w:W, h:H } = pzFormat();
  const u = Math.min(W, H) / 1080;
  const c = ctx;
  c.clearRect(0, 0, W, H);
  c.fillStyle = '#000'; c.fillRect(0, 0, W, H);

  // Cámara continua para las dos imágenes: acercamiento lento y leve
  // descenso, así el cambio se lee como una sola toma de dron.
  const cam = easeInOut(clamp01(t / PZ_T.endStart));
  const zoom = 1.02 + .16 * cam;
  const panX = -.25 + .5 * cam;
  const panY = -.35 + .7 * cam;

  const p = easeInOut(ramp(t, PZ_T.transStart, PZ_T.transEnd));
  const transition = pzRadio('pzTransition');

  if (p <= 0){
    drawCover(c, pzImgs.antes, 0, 0, W, H, zoom, panX, panY);
  } else if (p >= 1){
    drawCover(c, pzImgs.despues, 0, 0, W, H, zoom, panX, panY);
  } else if (transition === 'dissolve'){
    drawCover(c, pzImgs.antes, 0, 0, W, H, zoom, panX, panY);
    c.save(); c.globalAlpha = p;
    drawCover(c, pzImgs.despues, 0, 0, W, H, zoom, panX, panY);
    c.restore();
  } else {
    // Barrido diagonal con línea térmica
    drawCover(c, pzImgs.antes, 0, 0, W, H, zoom, panX, panY);
    const skew = H * .18;
    const edge = -skew + p * (W + skew * 2);
    c.save();
    c.beginPath();
    c.moveTo(0, 0); c.lineTo(edge + skew, 0); c.lineTo(edge - skew, H); c.lineTo(0, H);
    c.closePath(); c.clip();
    drawCover(c, pzImgs.despues, 0, 0, W, H, zoom, panX, panY);
    c.restore();
    c.save();
    c.strokeStyle = hotGradient(c, 0, W);
    c.lineWidth = 6 * u;
    c.shadowColor = 'rgba(255,140,0,.85)'; c.shadowBlur = 28 * u;
    c.beginPath(); c.moveTo(edge + skew, 0); c.lineTo(edge - skew, H); c.stroke();
    c.restore();
  }

  // Rótulos
  if ($('pzLabels').checked){
    const labelsIn = easeOut(ramp(t, .4, 1.1)) * (1 - ramp(t, PZ_T.endStart, PZ_T.endStart + .4));
    if (labelsIn > 0){
      const pad = 56 * u;
      c.save(); c.globalAlpha = labelsIn;

      // Degradado inferior para legibilidad
      const g = c.createLinearGradient(0, H * .62, 0, H);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.62)');
      c.fillStyle = g; c.fillRect(0, H * .62, W, H * .38);

      const mid = (PZ_T.transStart + PZ_T.transEnd) / 2;
      if (t < mid) drawTag(c, 'ANTES', pad, pad, u);
      else drawTag(c, 'DESPUÉS', pad, pad, u, true);

      const title = pzVal('pzTitle');
      const place = pzVal('pzPlace');
      let y = H - pad;
      if (place){
        c.font = `500 ${Math.round(26*u)}px "JetBrains Mono", monospace`;
        c.fillStyle = 'rgba(238,241,244,.8)';
        c.textBaseline = 'alphabetic';
        c.fillText(place.toUpperCase(), pad, y);
        y -= 46 * u;
      }
      if (title){
        c.font = `800 ${Math.round(64*u)}px "Archivo", sans-serif`;
        c.fillStyle = '#fff';
        const lines = wrapLines(c, title, W - pad * 2);
        for (let i = lines.length - 1; i >= 0; i--){
          c.fillText(lines[i], pad, y);
          y -= 70 * u;
        }
      }
      c.restore();
    }
  }

  // Fundido de entrada
  const fade = 1 - ramp(t, 0, PZ_T.fadeIn);
  if (fade > 0){ c.fillStyle = `rgba(0,0,0,${fade})`; c.fillRect(0, 0, W, H); }

  // Cierre
  if ($('pzEndCard').checked && t >= PZ_T.endStart){
    const k = easeOut(ramp(t, PZ_T.endStart, PZ_T.endStart + .7));
    c.fillStyle = `rgba(15,18,22,${.86 * k})`; c.fillRect(0, 0, W, H);
    const k2 = easeOut(ramp(t, PZ_T.endStart + .3, PZ_T.endStart + 1.1));
    c.save();
    c.globalAlpha = k2;
    const cy = H / 2 - 40 * u + (1 - k2) * 30 * u;
    drawLogo(c, W / 2, cy - 150 * u, 130 * u, 'center');
    const caption = pzVal('pzCaption');
    if (caption){
      c.font = `600 ${Math.round(48*u)}px "Space Grotesk", sans-serif`;
      c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'top';
      wrapLines(c, caption, W * .8).forEach((line, i) => c.fillText(line, W / 2, cy + 30 * u + i * 60 * u));
    }
    const handle = pzVal('pzHandle');
    if (handle){
      c.font = `500 ${Math.round(28*u)}px "JetBrains Mono", monospace`;
      c.fillStyle = PZ_COLORS.hot2; c.textAlign = 'center'; c.textBaseline = 'top';
      c.fillText(handle, W / 2, H - 150 * u);
    }
    c.restore();
  }
}

/* ============================================================
   VISTA PREVIA / REPRODUCCIÓN
============================================================ */
function pzTotal(){ return $('pzEndCard').checked ? PZ_T.total : PZ_T.endStart + .3; }

function pzResize(){
  const { w, h } = pzFormat();
  if (canvas.width !== w || canvas.height !== h){ canvas.width = w; canvas.height = h; }
}

function pzTick(ts){
  if (!pzStartTs) pzStartTs = ts;
  let t = (ts - pzStartTs) / 1000;
  const total = pzTotal();
  if (t >= total){
    if (pzRecording){ pzDrawFrame(total); bar.style.width = '100%'; return pzOnRecordEnd(); }
    pzStartTs = ts; t = 0;
  }
  pzDrawFrame(t);
  bar.style.width = `${(t / total) * 100}%`;
  pzRaf = requestAnimationFrame(pzTick);
}

function pzPlay(){
  if (!pzReady()) return;
  cancelAnimationFrame(pzRaf);
  pzResize();
  pzPlaying = true;
  pzStartTs = 0;
  btnPlay.textContent = '❚❚ Pausar';
  pzRaf = requestAnimationFrame(pzTick);
}

function pzStop(){
  cancelAnimationFrame(pzRaf);
  pzPlaying = false;
  btnPlay.textContent = '▶ Reproducir';
}

function pzRefresh(){
  $('pzEmpty').hidden = !!pzReady();
  [btnPlay, btnVideo, btnSheet, btnCover].forEach(b => b.disabled = !pzReady() || pzRecording);
  pzUpdatePrompts();
  if (!pzReady()) return;
  pzResize();
  // En reproducción el siguiente frame ya toma los cambios
  if (!pzPlaying) pzDrawFrame(PZ_T.transEnd + 1);
}

/* ============================================================
   EXPORTAR VIDEO (MediaRecorder sobre el canvas)
============================================================ */
let pzRecorder = null;
let pzChunks = [];

function pzPickMime(){
  if (typeof MediaRecorder === 'undefined') return null;
  const candidates = [
    'video/mp4;codecs=avc1.42E01E',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm'
  ];
  return candidates.find(m => MediaRecorder.isTypeSupported(m)) || null;
}

function pzExportVideo(){
  if (!pzReady() || pzRecording) return;
  const mime = pzPickMime();
  if (!mime || !canvas.captureStream){
    pzSetStatus('Este navegador no permite grabar video. Prueba con Chrome, Edge o Safari actualizado.');
    return;
  }
  pzStop();
  pzResize();
  pzDrawFrame(0);

  const stream = canvas.captureStream(PZ_FPS);
  const { w, h } = pzFormat();
  pzChunks = [];
  pzRecorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: w * h * 6 });
  pzRecorder.ondataavailable = (e) => { if (e.data && e.data.size) pzChunks.push(e.data); };
  pzRecorder.onstop = () => {
    const blob = new Blob(pzChunks, { type: mime });
    const ext = mime.startsWith('video/mp4') ? 'mp4' : 'webm';
    pzDownload(blob, `acero_${pzSlug()}_${pzRadio('pzFormat')}.${ext}`);
    pzRecording = false;
    stream.getTracks().forEach(tr => tr.stop());
    pzSetStatus(ext === 'webm'
      ? 'Video listo (.webm). Instagram lo acepta desde el computador; si necesitas .mp4, ábrelo en Safari o conviértelo.'
      : 'Video listo (.mp4).');
    pzRefresh();
  };

  pzRecording = true;
  pzRefresh();
  pzSetStatus('Grabando… mantén esta pestaña visible hasta que termine.');
  pzRecorder.start(250);
  pzStartTs = 0;
  pzPlaying = false;
  pzRaf = requestAnimationFrame(pzTick);
}

function pzOnRecordEnd(){
  cancelAnimationFrame(pzRaf);
  // Deja que el último frame entre al stream antes de cerrar
  setTimeout(() => { if (pzRecorder && pzRecorder.state !== 'inactive') pzRecorder.stop(); }, 300);
}

/* ============================================================
   LÁMINA PNG (antes / después)
============================================================ */
function pzDrawSheet(c, W, H){
  const u = Math.min(W, H) / 1080;
  const pad = 56 * u;
  const stacked = H >= W;

  // Fondo blueprint
  c.fillStyle = PZ_COLORS.paper; c.fillRect(0, 0, W, H);
  c.strokeStyle = PZ_COLORS.line; c.lineWidth = 1;
  const step = 48 * u;
  for (let x = 0; x <= W; x += step){ c.beginPath(); c.moveTo(x + .5, 0); c.lineTo(x + .5, H); c.stroke(); }
  for (let y = 0; y <= H; y += step){ c.beginPath(); c.moveTo(0, y + .5); c.lineTo(W, y + .5); c.stroke(); }

  // Cabecera
  const headH = 150 * u;
  drawLogo(c, pad, pad, 56 * u);
  c.textBaseline = 'alphabetic';
  c.font = `500 ${Math.round(20*u)}px "JetBrains Mono", monospace`;
  c.fillStyle = PZ_COLORS.soft;
  c.textAlign = 'right';
  c.fillText('FIG. 07 — ANTES / DESPUÉS', W - pad, pad + 22 * u);
  const place = pzVal('pzPlace');
  if (place) c.fillText(place.toUpperCase(), W - pad, pad + 54 * u);
  c.textAlign = 'left';
  const title = pzVal('pzTitle');
  if (title){
    c.font = `800 ${Math.round(52*u)}px "Archivo", sans-serif`;
    c.fillStyle = PZ_COLORS.ink;
    c.fillText(wrapLines(c, title, W - pad * 2)[0], pad, pad + headH - 18 * u);
  }

  // Pie
  const footH = 130 * u;
  const footY = H - pad - footH;
  c.fillStyle = 'rgba(140,182,255,.25)'; c.fillRect(pad, footY + 18 * u, W - pad * 2, 1.5 * u);
  const caption = pzVal('pzCaption');
  if (caption){
    c.font = `600 ${Math.round(34*u)}px "Space Grotesk", sans-serif`;
    c.fillStyle = PZ_COLORS.ink;
    c.fillText(wrapLines(c, caption, W - pad * 2)[0], pad, footY + 72 * u);
  }
  c.font = `500 ${Math.round(22*u)}px "JetBrains Mono", monospace`;
  const data = pzVal('pzData');
  if (data){ c.fillStyle = PZ_COLORS.soft; c.fillText(data, pad, footY + 116 * u); }
  const handle = pzVal('pzHandle');
  if (handle){ c.fillStyle = PZ_COLORS.hot2; c.textAlign = 'right'; c.fillText(handle, W - pad, footY + 116 * u); c.textAlign = 'left'; }

  // Paneles
  const top = pad + headH + 20 * u;
  const areaH = footY - top;
  const gap = 14 * u;
  let rects;
  if (stacked){
    const ph = (areaH - gap) / 2;
    rects = [[pad, top, W - pad * 2, ph], [pad, top + ph + gap, W - pad * 2, ph]];
  } else {
    const pw = (W - pad * 2 - gap) / 2;
    rects = [[pad, top, pw, areaH], [pad + pw + gap, top, pw, areaH]];
  }
  [[pzImgs.antes, 'ANTES', false], [pzImgs.despues, 'DESPUÉS', true]].forEach(([img, label, hot], i) => {
    const [x, y, w, h] = rects[i];
    drawCover(c, img, x, y, w, h);
    c.strokeStyle = 'rgba(238,241,244,.35)'; c.lineWidth = 1.5 * u; c.strokeRect(x, y, w, h);
    drawTag(c, label, x + 22 * u, y + 22 * u, u * .85, hot);
  });
}

function pzDrawCover(c, W, H){
  const u = Math.min(W, H) / 1080;
  const pad = 64 * u;
  drawCover(c, pzImgs.despues, 0, 0, W, H, 1.04);
  const g = c.createLinearGradient(0, H * .45, 0, H);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.75)');
  c.fillStyle = g; c.fillRect(0, H * .45, W, H * .55);
  const gt = c.createLinearGradient(0, 0, 0, H * .2);
  gt.addColorStop(0, 'rgba(0,0,0,.45)'); gt.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = gt; c.fillRect(0, 0, W, H * .2);

  drawLogo(c, pad, pad, 60 * u);
  const handle = pzVal('pzHandle');
  if (handle){
    c.font = `500 ${Math.round(24*u)}px "JetBrains Mono", monospace`;
    c.fillStyle = '#fff'; c.textAlign = 'right'; c.textBaseline = 'top';
    c.fillText(handle, W - pad, pad + 16 * u);
    c.textAlign = 'left';
  }

  c.textBaseline = 'alphabetic';
  let y = H - pad;
  const place = pzVal('pzPlace');
  if (place){
    c.font = `500 ${Math.round(26*u)}px "JetBrains Mono", monospace`;
    c.fillStyle = PZ_COLORS.hot2;
    c.fillText(place.toUpperCase(), pad, y);
    y -= 56 * u;
  }
  const caption = pzVal('pzCaption');
  if (caption){
    c.font = `500 ${Math.round(36*u)}px "Space Grotesk", sans-serif`;
    c.fillStyle = 'rgba(255,255,255,.88)';
    const lines = wrapLines(c, caption, W - pad * 2);
    for (let i = lines.length - 1; i >= 0; i--){ c.fillText(lines[i], pad, y); y -= 46 * u; }
    y -= 14 * u;
  }
  const title = pzVal('pzTitle');
  if (title){
    c.font = `800 ${Math.round(88*u)}px "Archivo", sans-serif`;
    c.fillStyle = '#fff';
    const lines = wrapLines(c, title, W - pad * 2);
    for (let i = lines.length - 1; i >= 0; i--){ c.fillText(lines[i], pad, y); y -= 92 * u; }
  }
}

function pzExportPng(kind){
  if (!pzReady()) return;
  const { w, h } = pzFormat();
  const off = document.createElement('canvas');
  off.width = w; off.height = h;
  const c = off.getContext('2d');
  if (kind === 'sheet') pzDrawSheet(c, w, h);
  else pzDrawCover(c, w, h);
  off.toBlob(blob => {
    pzDownload(blob, `acero_${pzSlug()}_${kind === 'sheet' ? 'lamina' : 'portada'}_${pzRadio('pzFormat')}.png`);
    pzSetStatus(kind === 'sheet' ? 'Lámina descargada.' : 'Portada descargada.');
  }, 'image/png');
}

/* ============================================================
   PROMPTS (estilo maqueta física a escala)
============================================================ */
function pzUpdatePrompts(){
  const style = pzRadio('pzStyle');
  const site = pzVal('pzSite') || 'el lugar de la foto adjunta';
  const program = pzVal('pzProgram') || 'la propuesta de diseño';
  const ratio = pzFormat().ratio;

  const look = style === 'maqueta'
    ? `Fotografía realista de una maqueta arquitectónica física a escala 1:200, hecha a mano, sobre una mesa de estudio. ` +
      `Materiales de maqueta: edificios de ladrillo terracota con ventanas recortadas, concreto gris, asfalto gris mate, ` +
      `árboles y vegetación de maqueta, autos y personas en miniatura pintadas a mano. ` +
      `Luz de estudio cálida y suave con sombras definidas, poca profundidad de campo con efecto tilt-shift en los bordes, colores terrosos y apagados.`
    : `Fotografía arquitectónica realista tomada con un dron, luz natural de media tarde, colores naturales y sombras suaves, nivel de detalle alto.`;

  const camera = `Vista aérea en picada a unos 45 grados, como tomada con un dron que avanza hacia el centro del lugar. Formato ${ratio}. Sin texto, sin logos y sin marcas de agua.`;

  $('pzPromptAntes').value =
    `${look}\n\nLa escena muestra el estado actual: ${site}. Se ve descuidado y sin uso, con pocas personas.\n\n${camera}\n\n` +
    `Si adjunto una foto del lugar, respeta su geometría: vías, edificios y estructuras en la misma posición.`;

  $('pzPromptDespues').value =
    `Usa la imagen ANTES adjunta como base. Mantén exactamente el mismo encuadre, ángulo de cámara, escala, edificios, vías y estructuras existentes.\n\n` +
    `Transforma solo el área de intervención en ${program}. ` +
    (style === 'maqueta'
      ? `Mismo lenguaje de maqueta: pisos de concreto claro, superficies deportivas en terracota con líneas blancas, gravilla y arena ocre, madera natural en pérgolas y bancas, vegetación de maqueta abundante y muchas personas en miniatura usando el espacio (caminando, jugando, sentadas). Misma luz de estudio cálida y efecto tilt-shift.`
      : `Materiales reales: concreto claro, madera natural, vegetación nativa abundante y personas usando el espacio. Misma luz y misma hora del día.`) +
    `\n\n${camera}`;
}

/* ============================================================
   CARGA DE IMÁGENES
============================================================ */
function pzLoadImage(file, key, drop){
  if (!file || !file.type.startsWith('image/')){
    pzSetStatus('El archivo no es una imagen.');
    return;
  }
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    pzImgs[key] = img;
    const thumb = drop.querySelector('img');
    thumb.src = url; thumb.hidden = false;
    drop.classList.add('has-img');
    pzSetStatus('');
    pzRefresh();
    if (pzReady() && !pzPlaying && !pzRecording) pzPlay();
  };
  img.onerror = () => pzSetStatus('No se pudo leer la imagen.');
  img.src = url;
}

function pzBindDrop(dropId, inputId, key){
  const drop = $(dropId);
  const input = $(inputId);
  input.addEventListener('change', () => { pzLoadImage(input.files[0], key, drop); input.value = ''; });
  drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop.addEventListener('drop', (e) => {
    e.preventDefault(); drop.classList.remove('over');
    pzLoadImage(e.dataTransfer.files[0], key, drop);
  });
}

/* ============================================================
   LISTENERS
============================================================ */
pzBindDrop('dropAntes', 'fileAntes', 'antes');
pzBindDrop('dropDespues', 'fileDespues', 'despues');

$('pzForm').addEventListener('input', () => { if (!pzRecording) pzRefresh(); });
document.querySelectorAll('input[name="pzStyle"], #pzSite, #pzProgram')
  .forEach(el => el.addEventListener('input', pzUpdatePrompts));

btnPlay.addEventListener('click', () => pzPlaying ? (pzStop(), pzRefresh()) : pzPlay());
btnVideo.addEventListener('click', pzExportVideo);
btnSheet.addEventListener('click', () => pzExportPng('sheet'));
btnCover.addEventListener('click', () => pzExportPng('cover'));

document.querySelectorAll('.pz-copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    const ta = $(btn.dataset.target);
    try { await navigator.clipboard.writeText(ta.value); }
    catch { ta.select(); document.execCommand('copy'); }
    btn.textContent = 'Copiado';
    setTimeout(() => { btn.textContent = 'Copiar'; }, 1500);
  });
});

// Las fuentes del canvas tienen que estar cargadas antes de dibujar texto
pzLogo.onload = () => { if (pzReady() && !pzPlaying) pzRefresh(); };
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
  ['800 20px "Archivo"', '600 20px "Space Grotesk"', '500 20px "JetBrains Mono"', '700 20px "JetBrains Mono"']
    .forEach(f => document.fonts && document.fonts.load(f));
  pzRefresh();
});

})();
