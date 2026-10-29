// Animación automática: tomas de cámara arquitectónicas sobre el modelo, grabadas a video
// (MP4 si el navegador lo permite, si no WebM) en 16:9, 9:16 para reels o 1:1, con la marca de AceroStudio.
// También arma el prompt y el fotograma inicial para llevar la toma a un generador de video con IA
// (Higgsfield, Kling, Runway, Veo…): el modelo da la geometría exacta y la IA el fotorrealismo.
import * as THREE from 'three';
import { SHOT_INFO, SEQUENCES, videoPrompt } from './prompts.js';
import { slug, download } from './exporters.js';

export { SEQUENCES, videoPrompt };

const ease = (t) => t * t * (3 - 2 * t);
const lerp = THREE.MathUtils.lerp;

// Cada toma: k ∈ [0, 1] → posición, punto de mira y hora del sol. g = geometría del modelo.
export const SHOTS = {
  contrapicado: {
    ...SHOT_INFO.contrapicado,
    f: (k, g) => ({ pos: g.P(lerp(-0.25, 0.2, k) * g.s.x, g.elev + lerp(0.9, 2.4, k), g.s.z / 2 + Math.max(2.2, g.r * 0.32)), look: g.P(0, g.top * lerp(0.75, 0.9, k), 0), hour: lerp(17.4, 17.9, k) }),
  },
  orbita: {
    ...SHOT_INFO.orbita,
    f: (k, g) => { const a = 0.6 + k * Math.PI * 2, R = g.r * 1.55 * g.k; return { pos: g.P(Math.cos(a) * R, g.top * 0.55 + R * 0.42, Math.sin(a) * R), look: g.P(0, g.top * 0.4, 0), hour: 15.5 }; },
  },
  acercamiento: {
    ...SHOT_INFO.acercamiento,
    f: (k, g) => { const d = lerp(g.r * 2.4, g.r * 0.75, ease(k)) * g.k; return { pos: g.P(g.s.x * 0.08, g.elev + Math.max(1.6, g.top * 0.35), g.s.z / 2 + d), look: g.P(0, g.top * 0.45, g.s.z / 2), hour: 16.5 }; },
  },
  sobrevuelo: {
    ...SHOT_INFO.sobrevuelo,
    f: (k, g) => {
      const R = g.r * g.k;
      g.curve ||= new THREE.CatmullRomCurve3([
        g.P(R * 1.8, g.top + R * 1.1, -R * 1.4), g.P(-R * 1.5, g.top + R * 0.7, -R * 0.6),
        g.P(-R * 1.2, g.top + R * 0.35, R * 1.2), g.P(g.s.x * 0.2, g.elev + 1.7, g.s.z / 2 + R * 0.9),
      ], false, 'centripetal');
      return { pos: g.curve.getPointAt(ease(k)), look: g.P(0, lerp(g.top * 0.4, g.top * 0.5, k), 0), hour: lerp(9, 17, k) };
    },
  },
  dia: {
    ...SHOT_INFO.dia,
    f: (k, g) => ({ pos: g.P(g.r * 1.3 * g.k, g.top * 0.6 + g.r * 0.6 * g.k, g.r * 1.5 * g.k), look: g.P(0, g.top * 0.35, 0), hour: lerp(6.2, 17.8, k) }),
  },
  planta: {
    ...SHOT_INFO.planta,
    f: (k, g) => { const e = ease(k), R = g.r * 1.7 * g.k; return { pos: g.P(R * 0.8 * e, g.top + R * lerp(1.6, 0.6, e), 0.01 + R * 1.0 * e), look: g.P(0, g.top * 0.3 * e, 0), hour: 12 }; },
  },
};

export const FORMATS = { '16:9': [1920, 1080], '9:16': [1080, 1920], '1:1': [1080, 1080] };

export function createAnimator(ctx) {
  const cam = ctx.camera;
  let run = null; // { shot, t, dur, rec, comp, g, wasRender, onEnd }

  function geometry() {
    const b = ctx.bounds(), c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3());
    const elev = b.min.y, top = b.max.y;
    // En formatos verticales la cámara se aleja para que el edificio quepa a lo ancho.
    const k = Math.max(1, 0.95 / cam.aspect);
    return { c, s, elev, top, k, r: Math.max(s.x, s.z, top - elev, 4), P: (x, y, z) => new THREE.Vector3(c.x + x, y, c.z + z) };
  }

  function sample(id, k, g) {
    const seq = SEQUENCES[id];
    if (!seq) return { ...SHOTS[id].f(k, g), part: SHOTS[id].name };
    const n = seq.parts.length, i = Math.min(n - 1, Math.floor(k * n));
    const part = seq.parts[i];
    if (g.part !== part) { g.part = part; g.curve = null; }
    return { ...SHOTS[part].f(k * n - i, g), part: SHOTS[part].name };
  }

  function start(id, { seconds = 10, record = false, format = '16:9', scale = 1, title = '', onEnd } = {}) {
    stop(false);
    ctx.prepare();
    const wasRender = ctx.isRender();
    if (!wasRender) ctx.setRender(true);
    run = { id, t: 0, dur: seconds, wasRender, onEnd, title, record };
    if (record) {
      const [W, H] = FORMATS[format].map((v) => Math.round(v * scale));
      ctx.renderer.setPixelRatio(1);
      ctx.renderer.setSize(W, H, false);
      cam.aspect = W / H;
      cam.updateProjectionMatrix();
      const comp = document.createElement('canvas');
      comp.width = W; comp.height = H;
      const types = ['video/mp4;codecs=avc1.640028', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'];
      const mime = types.find((t) => window.MediaRecorder?.isTypeSupported?.(t));
      if (!mime) { ctx.toast('Este navegador no puede grabar video'); stop(); return false; }
      const stream = comp.captureStream(30);
      const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: Math.round(W * H * 30 * 0.12) });
      const chunks = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      rec.onstop = () => {
        const ext = mime.startsWith('video/mp4') ? 'mp4' : 'webm';
        download(new Blob(chunks, { type: mime.split(';')[0] }), `${slug(ctx.docName())}-${slug(id)}-${format.replace(':', 'x')}.${ext}`);
        ctx.toast(`Video listo (.${ext})`);
      };
      rec.start(250);
      Object.assign(run, { rec, comp, g2: comp.getContext('2d'), W, H });
    }
    run.g = geometry();
    document.body.classList.add('animating');
    return true;
  }

  function stop(restore = true) {
    if (!run) return;
    const r = run;
    run = null;
    document.body.classList.remove('animating');
    if (r.rec && r.rec.state !== 'inactive') r.rec.stop();
    if (!r.wasRender) ctx.setRender(false);
    ctx.resize();
    if (restore) {
      ctx.orbit.target.copy(r.g.c);
      ctx.orbit.update();
    }
    r.onEnd?.();
  }

  function update(dt) {
    if (!run) return false;
    run.t = Math.min(1, run.t + dt / run.dur);
    const s = sample(run.id, run.t, run.g);
    cam.position.copy(s.pos);
    cam.lookAt(s.look);
    ctx.setSunHour(s.hour);
    run.caption = `${s.part} · ${String(Math.floor(s.hour)).padStart(2, '0')}:${String(Math.floor((s.hour % 1) * 60)).padStart(2, '0')}`;
    if (run.t >= 1) { run.ending = true; }
    return true;
  }

  // Después de cada render: compone el cuadro con la marca y lo manda al grabador.
  function afterRender() {
    if (!run) return;
    if (run.g2) {
      const { g2: g, W, H } = run, u = Math.min(W, H) / 1080;
      g.drawImage(ctx.renderer.domElement, 0, 0, W, H);
      g.fillStyle = 'rgba(15,17,19,.62)';
      g.font = `800 ${Math.round(40 * u)}px "Bricolage Grotesque", system-ui, sans-serif`;
      const mark = 'acero', dot = '.', st = 'studio';
      const x = 44 * u, y = 78 * u;
      const w1 = g.measureText(mark).width, w2 = g.measureText(dot).width;
      g.fillRect(x - 16 * u, y - 48 * u, w1 + w2 + g.measureText(st).width + 32 * u, 66 * u);
      g.fillStyle = '#fff'; g.fillText(mark, x, y);
      g.fillStyle = '#cf2a1f'; g.fillText(dot, x + w1, y);
      g.fillStyle = '#fff'; g.fillText(st, x + w1 + w2, y);
      g.font = `500 ${Math.round(24 * u)}px "DM Mono", ui-monospace, monospace`;
      const line = [run.title, run.caption].filter(Boolean).join('  ·  ');
      const lw = g.measureText(line).width;
      g.fillStyle = 'rgba(15,17,19,.62)';
      g.fillRect(0, H - 100 * u, lw + 90 * u, 52 * u);
      g.fillStyle = '#cf2a1f'; g.fillRect(0, H - 100 * u, 8 * u, 52 * u);
      g.fillStyle = '#fff'; g.fillText(line, 40 * u, H - 64 * u);
      g.fillStyle = '#cf2a1f'; g.fillRect(0, H - 10 * u, W * run.t, 10 * u);
    }
    if (run.ending) stop();
  }

  // Fotograma inicial en alta resolución para un generador de video con IA.
  function keyframe(id, format = '16:9') {
    ctx.prepare();
    const wasRender = ctx.isRender();
    if (!wasRender) ctx.setRender(true);
    const [W, H] = FORMATS[format];
    ctx.renderer.setPixelRatio(1);
    ctx.renderer.setSize(W, H, false);
    cam.aspect = W / H;
    cam.updateProjectionMatrix();
    const s = sample(id, 0, geometry());
    cam.position.copy(s.pos); cam.lookAt(s.look); ctx.setSunHour(s.hour);
    ctx.draw();
    ctx.renderer.domElement.toBlob((b) => {
      download(b, `${slug(ctx.docName())}-${slug(id)}-fotograma.png`, 'image/png');
      if (!wasRender) ctx.setRender(false);
      ctx.resize();
    }, 'image/png');
  }

  return { start, stop, update, afterRender, keyframe, get active() { return !!run; }, get recording() { return !!run?.rec; } };
}
