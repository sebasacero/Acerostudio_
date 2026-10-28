// "Crear con IA": plano o boceto → modelo, foto de edificio → modelo y edificio paramétrico.
// La detección de planos corre local (detect.js); la lectura de fotos usa la función de visión en Supabase.
import { openDialog, numField, selField, readFields, loadImage, esc } from './ui.js';
import { detectWalls } from './detect.js';
import { wallsToElements, mergeGenerated, buildingFromParams, BUILDING_DEFAULTS, aiPlanToDetection, aiFacadeToParams } from './generate.js';
import { MATERIALS } from './palette.js';
import { fmt } from './model.js';

export const VISION_URL = 'https://tylylfrabjkaiukuilem.supabase.co/functions/v1/vision-arquitectura';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bHlsZnJhYmprYWl1a3VpbGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODAwNDAsImV4cCI6MjA5ODA1NjA0MH0.Bqe1f2QBUBMiLmLCfAeownFsHLpSpxg6qaAkgvTB3uE';

export async function askVision(tarea, dataURL, extra = {}) {
  const r = await fetch(VISION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: ANON, Authorization: `Bearer ${ANON}` },
    body: JSON.stringify({ tarea, imagen: dataURL, ...extra }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.resultado) throw new Error(j.error || `La IA de visión no respondió (${r.status}).`);
  return j.resultado;
}

const MAT_OPTS = Object.entries(MATERIALS).filter(([k]) => !['vidrio', 'rojo', 'vegetal'].includes(k)).map(([k, m]) => [k, m.name]);

const PRESETS = {
  torre: { label: 'Torre única', volumes: [{ x: 0, z: 0 }] },
  dos: { label: 'Dos torres desfasadas', volumes: [{ x: 0, z: 0, width: 3.4, depth: 11, floors: 4, bays: 1 }, { x: 3.4, z: 1.2, width: 3.2, depth: 10, floors: 5, bays: 1, wallMaterial: 'nogal' }] },
  barra: { label: 'Barra horizontal', volumes: [{ x: 0, z: 0, width: 18, depth: 8, floors: 2, bays: 6 }] },
  esquina: { label: 'Edificio en L', volumes: [{ x: 0, z: 0, width: 12, depth: 6, floors: 3, bays: 4 }, { x: 0, z: 6, width: 6, depth: 8, floors: 5, bays: 2 }] },
};

export function openCreate(ctx, tab = 'plano') {
  const dlg = openDialog({
    title: 'Crear modelo 3D', kicker: 'IA AceroStudio · imagen, dibujo o parámetros', wide: true,
    body: `<div class="seg" role="tablist">
        <button data-t="plano">Plano o boceto</button><button data-t="foto">Foto de edificio</button><button data-t="param">Paramétrico</button>
      </div>
      <section data-p="plano">
        <p class="empty">Sube la foto de un boceto a mano o la imagen de un plano. AceroStudio separa muros de mobiliario y texto, detecta puertas y ventanas y levanta el modelo.</p>
        <div class="split">
          <div class="drop" data-drop="plano"><canvas data-cv="plano"></canvas><span>Arrastra la imagen aquí o <b>elige un archivo</b></span><input type="file" accept="image/*" data-file="plano" hidden></div>
          <div class="col">
            <div class="fields">
              ${selField('mode', 'Tipo de dibujo', 'auto', [['auto', 'Detectar solo'], ['plano', 'Plano (muros gruesos)'], ['boceto', 'Boceto (trazos = muros)']])}
              <label class="f"><span>Sensibilidad</span><input type="range" min="0" max="1" step="0.05" value="0.5" data-k="sensitivity"></label>
              ${numField('widthM', 'Ancho real (m)', '', 0.1, 'placeholder="auto"')}
              ${numField('height', 'Altura de piso (m)', 3, 0.1)}
              ${numField('floors', 'Pisos', 1, 1, 'min="1" max="40"')}
              ${selField('material', 'Muros', 'yeso', MAT_OPTS)}
            </div>
            <div class="card mono out" data-out="plano">Sin imagen todavía.</div>
            <label class="tg"><input type="checkbox" data-replace checked> Reemplazar el proyecto actual</label>
            <div class="row"><button class="btn" data-ai="plano">✦ Leer con IA (visión)</button><button class="pill" data-go="plano" disabled>Crear modelo 3D</button></div>
          </div>
        </div>
      </section>
      <section data-p="foto" hidden>
        <p class="empty">Sube una foto o un render de un edificio. La IA lo descompone en volúmenes, pisos, crujías y materiales; ajusta lo que quieras en Paramétrico antes de crear.</p>
        <div class="split">
          <div class="drop" data-drop="foto"><canvas data-cv="foto"></canvas><span>Arrastra la foto aquí o <b>elige un archivo</b></span><input type="file" accept="image/*" data-file="foto" hidden></div>
          <div class="col">
            <label class="f"><span>Indicaciones (opcional)</span><input data-notes placeholder="ej. son 5 pisos, el lote mide 7 m de frente"></label>
            <div class="card" data-out="foto"><p class="empty">Sin análisis todavía.</p></div>
            <div class="row"><button class="pill" data-ai="foto" disabled>✦ Analizar con IA</button></div>
          </div>
        </div>
      </section>
      <section data-p="param" hidden>
        <div class="fields four">
          ${selField('preset', 'Tipología', 'torre', Object.entries(PRESETS).map(([k, p]) => [k, p.label]))}
          ${numField('width', 'Frente (m)', BUILDING_DEFAULTS.width)}
          ${numField('depth', 'Fondo (m)', BUILDING_DEFAULTS.depth)}
          ${numField('floors', 'Pisos', BUILDING_DEFAULTS.floors, 1, 'min="1" max="60"')}
          ${numField('floorHeight', 'Altura de piso', BUILDING_DEFAULTS.floorHeight)}
          ${numField('bays', 'Ventanas por piso', BUILDING_DEFAULTS.bays, 1, 'min="1"')}
          ${numField('windowWidth', 'Ancho ventana', BUILDING_DEFAULTS.windowWidth)}
          ${numField('windowHeight', 'Alto ventana', BUILDING_DEFAULTS.windowHeight)}
          ${selField('wallMaterial', 'Fachada', BUILDING_DEFAULTS.wallMaterial, MAT_OPTS)}
          ${selField('structure', 'Estructura', 'acero', [['acero', 'Columnas de acero'], ['none', 'Muros portantes']])}
          <label class="f"><span>Primer piso</span><select data-k="groundGlass"><option value="1">Vitrina (vidriado)</option><option value="">Puerta y ventanas</option></select></label>
          ${numField('sideWindows', 'Ventanas laterales', 0, 1, 'min="0"')}
        </div>
        <label class="f full"><span>Volúmenes (avanzado · JSON: x, z, width, depth, floors, bays, wallMaterial…)</span><textarea data-vol rows="4" spellcheck="false"></textarea></label>
        <div class="card mono out" data-out="param"></div>
        <div class="row"><button class="pill" data-go="param">Crear edificio</button></div>
      </section>`,
  });
  const { $, $$ } = dlg;
  const state = { plano: null, foto: null, det: null };

  const show = (t) => {
    $$('[data-t]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.t === t));
    $$('[data-p]').forEach((p) => { p.hidden = p.dataset.p !== t; });
  };
  $$('[data-t]').forEach((b) => b.addEventListener('click', () => show(b.dataset.t)));
  show(tab);

  // --- entrada de imágenes ---
  for (const kind of ['plano', 'foto']) {
    const drop = $(`[data-drop="${kind}"]`), input = $(`[data-file="${kind}"]`);
    drop.addEventListener('click', () => input.click());
    drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('over'));
    drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('over'); if (e.dataTransfer.files[0]) take(kind, e.dataTransfer.files[0]); });
    input.addEventListener('change', () => { if (input.files[0]) take(kind, input.files[0]); input.value = ''; });
  }
  async function take(kind, file) {
    try {
      state[kind] = await loadImage(file);
    } catch { return ctx.toast('No se pudo leer la imagen'); }
    $(`[data-drop="${kind}"]`).classList.add('has');
    if (kind === 'plano') runDetect();
    else { drawPreview('foto'); $('[data-ai="foto"]').disabled = false; }
  }
  function drawPreview(kind, det) {
    const src = state[kind].canvas, cv = $(`[data-cv="${kind}"]`);
    cv.width = src.width; cv.height = src.height;
    const g = cv.getContext('2d');
    g.drawImage(src, 0, 0);
    if (!det || !det.scale) return;
    g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(0, 0, cv.width, cv.height);
    const P = ([x, z]) => [det.origin[0] + x / det.scale, det.origin[1] + z / det.scale];
    for (const w of det.walls) {
      const [ax, ay] = P(w.a), [bx, by] = P(w.b);
      g.strokeStyle = '#cf2a1f'; g.lineCap = 'square';
      g.lineWidth = Math.max(3, w.thickness / det.scale);
      g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke();
      const L = Math.hypot(bx - ax, by - ay) || 1, ux = (bx - ax) / L, uy = (by - ay) / L;
      for (const o of w.openings) {
        const c = o.t / det.scale, h = o.width / det.scale / 2;
        g.strokeStyle = o.kind === 'door' ? '#2c3f8f' : '#5b8fc7';
        g.lineWidth = Math.max(3, w.thickness / det.scale) + 4;
        g.beginPath(); g.moveTo(ax + ux * (c - h), ay + uy * (c - h)); g.lineTo(ax + ux * (c + h), ay + uy * (c + h)); g.stroke();
      }
    }
  }

  // --- plano o boceto ---
  const planoBox = $('[data-p="plano"]');
  function runDetect() {
    if (!state.plano) return;
    const o = readFields(planoBox);
    const det = detectWalls(state.plano.data, { mode: o.mode, sensitivity: o.sensitivity, widthM: o.widthM || null });
    state.det = det;
    drawPreview('plano', det);
    const ops = det.walls.reduce((s, w) => s + w.openings.length, 0);
    $('[data-out="plano"]').innerHTML = det.walls.length
      ? `<b>${det.walls.length}</b> muros · <b>${ops}</b> vanos · ${fmt(det.width, 1)} × ${fmt(det.depth, 1)} m<br><span class="mute">${det.mode === 'plano' ? 'Plano: muros gruesos, se ignoró lo delgado' : 'Boceto: cada trazo largo es un muro'}${o.widthM ? '' : ' · escala estimada, escribe el ancho real para afinar'}</span>`
      : 'No encontré muros. Sube la sensibilidad o cambia el tipo de dibujo.';
    $('[data-go="plano"]').disabled = !det.walls.length;
  }
  planoBox.querySelectorAll('[data-k="mode"],[data-k="sensitivity"],[data-k="widthM"]').forEach((i) => i.addEventListener('change', runDetect));
  $('[data-go="plano"]').addEventListener('click', () => {
    const o = readFields(planoBox);
    const gen = wallsToElements(state.det, { height: o.height || 3, floors: Math.max(1, Math.round(o.floors || 1)), material: o.material });
    const replace = $('[data-replace]').checked;
    ctx.model.change((doc) => {
      mergeGenerated(doc, gen, { replace });
      if (replace) doc.name = state.det.mode === 'ia' ? 'Modelo desde plano (IA)' : 'Modelo desde plano';
    }, 'load');
    ctx.after();
    ctx.toast(`Modelo creado · ${state.det.walls.length} muros${gen.levels.length > 1 ? ` · ${gen.levels.length} pisos` : ''}`);
    dlg.close();
  });
  $('[data-ai="plano"]').addEventListener('click', async (e) => {
    if (!state.plano) return ctx.toast('Primero sube una imagen');
    const b = e.currentTarget; b.disabled = true; b.textContent = 'Leyendo el plano…';
    try {
      const o = readFields(planoBox);
      const r = await askVision('plano', state.plano.dataURL, o.widthM ? { ancho_m: o.widthM } : {});
      state.det = aiPlanToDetection(r);
      drawPreview('plano');
      $('[data-out="plano"]').innerHTML = `<b>IA:</b> ${state.det.walls.length} muros · ${fmt(r.ancho_m, 1)} × ${fmt(r.fondo_m, 1)} m<br><span class="mute">${esc(r.notas)}</span>`;
      $('[data-go="plano"]').disabled = !state.det.walls.length;
    } catch (err) { ctx.toast(err.message); }
    b.disabled = false; b.textContent = '✦ Leer con IA (visión)';
  });

  // --- foto de edificio ---
  $('[data-ai="foto"]').addEventListener('click', async (e) => {
    const b = e.currentTarget; b.disabled = true; b.textContent = 'Analizando el edificio…';
    try {
      const r = await askVision('fachada', state.foto.dataURL, { notas: $('[data-notes]').value || undefined });
      const p = aiFacadeToParams(r);
      fillParams(p);
      $('[data-out="foto"]').innerHTML = `<b>${esc(r.nombre)}</b> · ${r.volumenes.length} volumen(es) · ${Math.max(...r.volumenes.map((v) => v.pisos))} pisos
        <p class="empty">${esc(r.descripcion)}</p><span class="k">Prompt de render / video</span><p class="mono prompt">${esc(r.prompt_render)}</p>
        <div class="row"><button class="btn sm" data-copy>Copiar prompt</button><button class="pill" data-build>Crear modelo 3D</button></div>`;
      ctx.lastPrompt = r.prompt_render;
      $('[data-copy]').addEventListener('click', () => navigator.clipboard?.writeText(r.prompt_render).then(() => ctx.toast('Prompt copiado')));
      $('[data-build]').addEventListener('click', () => build(p));
    } catch (err) { $('[data-out="foto"]').innerHTML = `<p class="empty">${esc(err.message)}</p><p class="empty">Mientras se activa la IA de visión puedes armar el edificio en <b>Paramétrico</b> mirando la foto.</p>`; }
    b.disabled = false; b.textContent = '✦ Analizar con IA';
  });

  // --- paramétrico ---
  const paramBox = $('[data-p="param"]');
  const volArea = $('[data-vol]');
  function fillParams(p) {
    Object.entries(p).forEach(([k, v]) => { const i = paramBox.querySelector(`[data-k="${k}"]`); if (i) i.value = typeof v === 'boolean' ? (v ? '1' : '') : v; });
    if (p.volumes) volArea.value = JSON.stringify(p.volumes, null, 1);
    summary();
  }
  function params() {
    const o = readFields(paramBox);
    o.groundGlass = !!o.groundGlass;
    let volumes = null;
    try { volumes = volArea.value.trim() ? JSON.parse(volArea.value) : null; } catch { /* se valida en summary */ }
    return { ...o, volumes: Array.isArray(volumes) ? volumes : PRESETS[o.preset].volumes };
  }
  function summary() {
    let ok = true;
    try { if (volArea.value.trim()) ok = Array.isArray(JSON.parse(volArea.value)); } catch { ok = false; }
    const d = buildingFromParams(params());
    const area = d.elements.filter((e) => e.type === 'slab').reduce((s, e) => s + Math.abs((e.points[2][0] - e.points[0][0]) * (e.points[2][1] - e.points[0][1])), 0);
    $('[data-out="param"]').innerHTML = `${ok ? '' : '<b style="color:var(--red-l)">JSON de volúmenes inválido · se usa la tipología</b><br>'}${d.levels.length} pisos · ${fmt(area, 0)} m² construidos · ${d.elements.filter((e) => e.type === 'wall').length} muros`;
  }
  paramBox.querySelector('[data-k="preset"]').addEventListener('change', (e) => { volArea.value = JSON.stringify(PRESETS[e.target.value].volumes, null, 1); summary(); });
  paramBox.addEventListener('input', summary);
  volArea.value = JSON.stringify(PRESETS.torre.volumes, null, 1);
  summary();
  $('[data-go="param"]').addEventListener('click', () => build(params()));

  function build(p) {
    const d = buildingFromParams(p);
    ctx.model.load(d);
    ctx.after();
    ctx.toast(`Edificio creado · ${d.levels.length} pisos`);
    dlg.close();
  }
  return dlg;
}
