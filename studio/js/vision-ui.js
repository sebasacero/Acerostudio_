// "Crear con IA": plano o boceto → modelo, foto de edificio → modelo y edificio paramétrico.
// La detección de planos corre local (detect.js); la lectura de fotos usa la función de visión en Supabase.
import { openDialog, field, numField, selField, readFields, loadImage, esc } from './ui.js';
import { detectWalls } from './detect.js';
import { wallsToElements, mergeGenerated, buildingFromParams, BUILDING_DEFAULTS, aiPlanToDetection, aiFacadeToParams } from './generate.js';
import { MATERIALS } from './palette.js';
import { steelBuilding, steelForWalls, steelTakeoff, STEEL_DEFAULTS, STEEL_TYPES } from './steel.js';
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

const STEEL_MATS = ['acero_grafito', 'acero_negro', 'acero_blanco', 'acero_galvanizado', 'acero_azul', 'acero_bronce', 'acero_purpura', 'corten'].map((k) => [k, MATERIALS[k].name]);
const SD = STEEL_DEFAULTS;

// Foto analizada por la IA → parámetros del edificio en acero (crujías de 6 a 8 m).
export function aiFacadeToSteel(r) {
  const v = r.volumenes.reduce((a, b) => (b.ancho * b.fondo * b.pisos > a.ancho * a.fondo * a.pisos ? b : a));
  const baysX = Math.max(1, Math.round(v.ancho / 7)), baysZ = Math.max(1, Math.round(v.fondo / 7));
  const floors = Math.max(1, Math.round(Math.max(...r.volumenes.map((x) => x.pisos))));
  const tipo = floors <= 1 && v.ancho > 15 ? 'pabellon' : floors <= 2 && v.ancho < 14 ? 'casa' : 'edificio';
  return { tipo, name: r.nombre || 'Edificio en acero desde foto', spanX: +(v.ancho / baysX).toFixed(2), baysX, spanZ: +(v.fondo / baysZ).toFixed(2), baysZ,
    floors, floorHeight: r.altura_piso || 3.6, groundHeight: Math.max(r.altura_piso || 3.6, v.primer_piso_vidriado ? 4.5 : 3.6), width: v.ancho, depth: v.fondo };
}

const PRESETS = {
  torre: { label: 'Torre única', volumes: [{ x: 0, z: 0 }] },
  dos: { label: 'Dos torres desfasadas', volumes: [{ x: 0, z: 0, width: 3.4, depth: 11, floors: 4, bays: 1 }, { x: 3.4, z: 1.2, width: 3.2, depth: 10, floors: 5, bays: 1, wallMaterial: 'nogal' }] },
  barra: { label: 'Barra horizontal', volumes: [{ x: 0, z: 0, width: 18, depth: 8, floors: 2, bays: 6 }] },
  esquina: { label: 'Edificio en L', volumes: [{ x: 0, z: 0, width: 12, depth: 6, floors: 3, bays: 4 }, { x: 0, z: 6, width: 6, depth: 8, floors: 5, bays: 2 }] },
};

export function openCreate(ctx, tab = 'acero') {
  const dlg = openDialog({
    title: 'Crear modelo 3D', kicker: 'IA AceroStudio · imagen, dibujo o parámetros', wide: true,
    body: `<div class="seg" role="tablist">
        <button data-t="acero">Estructura en acero</button><button data-t="plano">Plano o boceto</button><button data-t="foto">Foto de edificio</button><button data-t="param">Volumetría</button>
      </div>
      <section data-p="acero" hidden>
        <p class="empty">Todo en AceroStudio se construye en acero: columnas HEB, vigas IPE, tubos, cerchas, arriostramientos y losa sobre steel deck, predimensionados por luz y número de pisos. Al crear, se abre el render comercial en hora dorada.</p>
        <div class="fields four">
          ${selField('tipo', 'Tipología', 'edificio', Object.entries(STEEL_TYPES))}
          ${field('name', 'Nombre', 'Edificio en acero')}
          ${selField('steel', 'Acabado del acero', SD.steel, STEEL_MATS)}
          ${selField('facade', 'Fachada', SD.facade, [['cortina', 'Muro cortina'], ['celosia', 'Cortina + celosía de acero']])}
        </div>
        <div class="fields four" data-for="edificio casa">
          ${numField('spanX', 'Luz al frente (m)', SD.spanX)}
          ${numField('baysX', 'Crujías al frente', SD.baysX, 1, 'min="1" max="12"')}
          ${numField('spanZ', 'Luz al fondo (m)', SD.spanZ)}
          ${numField('baysZ', 'Crujías al fondo', SD.baysZ, 1, 'min="1" max="8"')}
          ${numField('floors', 'Pisos', SD.floors, 1, 'min="1" max="40"')}
          ${numField('groundHeight', 'Altura planta baja', SD.groundHeight)}
          ${numField('floorHeight', 'Altura de piso', SD.floorHeight)}
          ${numField('cantilever', 'Voladizo al frente (m)', SD.cantilever)}
          ${numField('gallery', 'Galería (retroceso del vidrio)', SD.gallery)}
          ${selField('bracing', 'Arriostramiento', '1', [['1', 'Cruces de San Andrés a la vista'], ['', 'Sin arriostramiento visible']])}
          ${selField('rooftop', 'Cubierta', '1', [['1', 'Terraza con pérgola de acero'], ['', 'Cubierta plana']])}
        </div>
        <div class="fields four" data-for="nave" hidden>
          ${numField('span', 'Luz libre (m)', SD.span)}
          ${numField('length', 'Largo (m)', SD.length)}
          ${numField('frameSpacing', 'Separación de pórticos', SD.frameSpacing)}
          ${numField('eave', 'Altura al alero', SD.eave)}
          ${numField('pitch', 'Pendiente (m/m)', SD.pitch, 0.01)}
          ${selField('truss', 'Cubierta', '1', [['1', 'Cerchas tubulares'], ['', 'Vigas IPE de alma llena']])}
        </div>
        <div class="fields four" data-for="pabellon" hidden>
          ${numField('width', 'Frente (m)', SD.width)}
          ${numField('depth', 'Fondo (m)', SD.depth)}
          ${numField('height', 'Altura libre (m)', SD.height)}
          ${numField('overhang', 'Alero en voladizo (m)', SD.overhang)}
        </div>
        <div class="card mono out" data-out="acero"></div>
        <div class="row"><button class="pill" data-go="acero">Crear en acero</button></div>
      </section>
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
            <label class="tg"><input type="checkbox" data-steel checked> Estructura de acero (columnas HEB y vigas IPE)</label>
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
    const steel = $('[data-steel]').checked;
    ctx.model.change((doc) => {
      mergeGenerated(doc, gen, { replace });
      if (steel) doc.elements.push(...steelForWalls({ ...doc, elements: gen.elements, levels: doc.levels }));
      if (replace) doc.name = state.det.mode === 'ia' ? 'Modelo en acero desde plano (IA)' : 'Modelo en acero desde plano';
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
        <div class="row"><button class="btn sm" data-copy>Copiar prompt</button><button class="btn" data-build>Volumetría</button><button class="pill" data-steelbuild>Crear en acero</button></div>`;
      ctx.lastPrompt = r.prompt_render;
      $('[data-copy]').addEventListener('click', () => navigator.clipboard?.writeText(r.prompt_render).then(() => ctx.toast('Prompt copiado')));
      $('[data-build]').addEventListener('click', () => build(p));
      $('[data-steelbuild]').addEventListener('click', () => { fillSteel(aiFacadeToSteel(r)); show('acero'); });
    } catch (err) { $('[data-out="foto"]').innerHTML = `<p class="empty">${esc(err.message)}</p><p class="empty">Mientras se activa la IA de visión puedes armar el edificio en <b>Paramétrico</b> mirando la foto.</p>`; }
    b.disabled = false; b.textContent = '✦ Analizar con IA';
  });

  // --- estructura en acero ---
  const steelBox = $('[data-p="acero"]');
  function steelParams() {
    const o = readFields(steelBox);
    for (const k of ['bracing', 'rooftop', 'truss']) o[k] = !!o[k];
    return o;
  }
  function fillSteel(p) {
    Object.entries(p).forEach(([k, v]) => { const i = steelBox.querySelector(`[data-k="${k}"]`); if (i) i.value = typeof v === 'boolean' ? (v ? '1' : '') : v; });
    steelSummary();
  }
  function steelSummary() {
    const p = steelParams();
    steelBox.querySelectorAll('[data-for]').forEach((f) => { f.hidden = !f.dataset.for.split(' ').includes(p.tipo); });
    steelBox.querySelector('[data-k="facade"]').closest('label').hidden = !['edificio', 'casa'].includes(p.tipo);
    const d = steelBuilding(p), t = steelTakeoff(d);
    const prof = d.meta?.perfiles ? Object.entries(d.meta.perfiles).map(([k, v]) => `${k} ${[v].flat().join('/')}`).join(' · ') : '';
    $('[data-out="acero"]').innerHTML = `<b>${fmt(t.kg / 1000, 1)} t</b> de acero · <b>${fmt(t.area, 0)} m²</b> · ${fmt(t.kgm2, 0)} kg/m² · ${d.elements.filter((e) => e.type === 'member' || e.type === 'column').length} piezas<br><span class="mute">${prof} · predimensionamiento orientativo, no reemplaza el cálculo estructural</span>`;
  }
  steelBox.addEventListener('input', steelSummary);
  steelBox.querySelector('[data-k="tipo"]').addEventListener('change', (e) => {
    const n = steelBox.querySelector('[data-k="name"]');
    if (/^(Edificio|Nave|Pabellón|Casa) en acero$/.test(n.value)) n.value = { edificio: 'Edificio en acero', nave: 'Nave en acero', pabellon: 'Pabellón en acero', casa: 'Casa en acero' }[e.target.value];
    if (e.target.value === 'casa') fillSteel({ spanX: 5, baysX: 3, spanZ: 4.5, baysZ: 2, floors: 2, groundHeight: 3.4, floorHeight: 3.2, cantilever: 4, gallery: 0.6, rooftop: false });
    else if (e.target.value === 'edificio') fillSteel({ spanX: SD.spanX, baysX: SD.baysX, spanZ: SD.spanZ, baysZ: SD.baysZ, floors: SD.floors, groundHeight: SD.groundHeight, floorHeight: SD.floorHeight, cantilever: SD.cantilever, gallery: SD.gallery, rooftop: true });
    else steelSummary();
  });
  steelSummary();
  $('[data-go="acero"]').addEventListener('click', () => {
    const d = steelBuilding(steelParams());
    ctx.model.load(d);
    ctx.after();
    ctx.showcase?.();
    const t = steelTakeoff(d);
    ctx.toast(`${d.name} · ${fmt(t.kg / 1000, 1)} t de acero · ${fmt(t.area, 0)} m²`);
    dlg.close();
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
