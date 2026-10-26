// AceroStudio Studio: escena, vistas, selección e interfaz.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { model, sampleDoc, emptyDoc, uid, fmt, wallLength, polygonArea, translateElement, putAsset } from './model.js';
import { MATERIALS } from './materials.js';
import { buildElement, setEdgesVisible, settings, parseAsset, registerAsset, setOnAssetReady } from './builders.js';
import { planGeometry, columnSection } from './plan.js';
import { createTools, DEFAULTS } from './tools.js';
import { createTour } from './tour.js';
import { download, slug, exportJSON, exportGLB, exportOBJ, planDXF, planSVG, exportPNG } from './exporters.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const vp = $('#vp');

// --- render ---
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
vp.prepend(renderer.domElement);
const labels = new CSS2DRenderer();
labels.domElement.className = 'labels';
vp.append(labels.domElement);

const scene = new THREE.Scene();
const BG = new THREE.Color('#e9ebed'), BG_PLAN = new THREE.Color('#ffffff');
scene.background = BG;
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.7;
scene.add(new THREE.HemisphereLight(0xffffff, 0x8d969e, 0.8));
const sun = new THREE.DirectionalLight(0xfff1dc, 2.4);
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.02;
scene.add(sun, sun.target);
const catcher = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.22 }));
catcher.rotation.x = -Math.PI / 2;
catcher.position.y = -0.002;
catcher.receiveShadow = true;
catcher.visible = false;
scene.add(catcher);

const grid = new THREE.Group();
const g1 = new THREE.GridHelper(80, 80, 0xa9b0b6, 0xc9ced3);
const g10 = new THREE.GridHelper(80, 8, 0x8d969e, 0x8d969e);
g1.material.transparent = g10.material.transparent = true;
g1.material.opacity = 0.7;
grid.add(g1, g10);
const axes = new THREE.Group();
const axisLine = (to, c) => new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), to]), new THREE.LineBasicMaterial({ color: c }));
axes.add(axisLine(new THREE.Vector3(3, 0.003, 0), 0xcf2a1f), axisLine(new THREE.Vector3(0, 0.003, 3), 0x2c3f8f));
grid.add(axes);
scene.add(grid);

const root = new THREE.Group(); root.name = 'Modelo';
const poche = new THREE.Group();
const overlay = new THREE.Group();
scene.add(root, poche, overlay);
const selBox = new THREE.BoxHelper(undefined, 0xcf2a1f);
selBox.material.depthTest = false;
selBox.renderOrder = 30;
selBox.visible = false;
scene.add(selBox);

// --- cámaras y vistas ---
const persp = new THREE.PerspectiveCamera(45, 1, 0.05, 3000);
persp.position.set(13, 10, 15);
const ortho = new THREE.OrthographicCamera(-10, 10, 10, -10, -2000, 2000);
const orbit3d = new OrbitControls(persp, renderer.domElement);
const orbit2d = new OrbitControls(ortho, renderer.domElement);
orbit3d.enableDamping = orbit2d.enableDamping = true;
orbit2d.enableRotate = false;
orbit2d.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
orbit2d.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN };
orbit2d.enabled = false;
let camera = persp, orbit = orbit3d, view = '3d';

const tc = new TransformControls(persp, renderer.domElement);
tc.showY = false;
tc.setSpace('world');
scene.add(tc.getHelper());
let dragStart = null;
tc.addEventListener('dragging-changed', (e) => { orbit.enabled = !e.value; });
tc.addEventListener('mouseDown', () => {
  const o = tc.object;
  dragStart = o && { pos: o.position.clone(), rot: o.rotation.y };
});
tc.addEventListener('mouseUp', () => {
  const o = tc.object, el = o && model.get(o.userData.elId);
  if (!el || !dragStart) return;
  const dx = o.position.x - dragStart.pos.x, dz = o.position.z - dragStart.pos.z, dr = o.rotation.y - dragStart.rot;
  dragStart = null;
  if (Math.abs(dx) + Math.abs(dz) + Math.abs(dr) < 1e-6) return;
  model.change(() => {
    translateElement(el, dx, dz);
    if (dr && 'rotY' in el) el.rotY = (el.rotY || 0) - dr;
  });
});
tc.addEventListener('objectChange', () => selBox.update());

function resize() {
  const w = vp.clientWidth, h = vp.clientHeight;
  renderer.setSize(w, h);
  labels.setSize(w, h);
  persp.aspect = w / h;
  persp.updateProjectionMatrix();
  const s = 10;
  ortho.left = -s * w / h; ortho.right = s * w / h; ortho.top = s; ortho.bottom = -s;
  ortho.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(vp);

function modelBounds() {
  const b = new THREE.Box3();
  root.children.forEach((o) => { if (o.visible && !o.userData.isAnnotation) b.expandByObject(o); });
  if (b.isEmpty()) b.set(new THREE.Vector3(-4, 0, -4), new THREE.Vector3(4, 3, 4));
  return b;
}

function setView(v, fit = true) {
  view = v;
  $$('[data-view]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.view === v));
  const b = modelBounds(), c = b.getCenter(new THREE.Vector3()), size = b.getSize(new THREE.Vector3());
  orbit.enabled = false;
  if (v === '3d') {
    camera = persp; orbit = orbit3d;
    if (fit) {
      const r = Math.max(size.x, size.y, size.z, 4);
      orbit3d.target.copy(c);
      persp.position.copy(c).add(new THREE.Vector3(0.75, 1.15, 1.0).multiplyScalar(r * 1.15));
    }
  } else {
    camera = ortho; orbit = orbit2d;
    const elev = model.level().elev;
    const t = fit ? c : orbit2d.target.clone();
    if (v === 'planta') {
      ortho.position.set(t.x, elev + 200, t.z + 0.001);
      orbit2d.target.set(t.x, elev, t.z);
    } else if (v === 'alzado') {
      ortho.position.set(t.x, c.y, t.z + 200);
      orbit2d.target.set(t.x, c.y, t.z);
    } else {
      ortho.position.set(t.x + 200, c.y, t.z);
      orbit2d.target.set(t.x, c.y, t.z);
    }
    ortho.up.set(0, 1, 0);
    ortho.lookAt(orbit2d.target);
    if (fit) {
      const span = v === 'planta' ? Math.max(size.x * vp.clientHeight / vp.clientWidth, size.z) : Math.max(size.y, (v === 'alzado' ? size.x : size.z) * vp.clientHeight / vp.clientWidth);
      ortho.zoom = 20 / (Math.max(span, 3) * 1.35);
      ortho.updateProjectionMatrix();
    }
  }
  orbit.enabled = true;
  orbit.update();
  tc.camera = camera;
  scene.background = v === '3d' ? BG : BG_PLAN;
  grid.visible = v !== 'alzado' && v !== 'lateral';
  updateSection();
}

// --- corte y poché ---
const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1.2);
const INK = new THREE.MeshBasicMaterial({ color: 0x16191c, side: THREE.DoubleSide });
const INK_L = new THREE.LineBasicMaterial({ color: 0x16191c });

function updateSection() {
  const on = $('#secOn').checked || view === 'planta';
  const h = model.level().elev + parseFloat($('#secH').value);
  $('#secVal').textContent = fmt(parseFloat($('#secH').value)) + ' m';
  clip.constant = h;
  renderer.clippingPlanes = on ? [clip] : [];
  buildPoche(on ? h : null);
}

function buildPoche(h) {
  poche.traverse((o) => o.geometry?.dispose());
  poche.clear();
  if (h == null) return;
  const g = planGeometry(model.doc);
  const y = h - 0.002;
  for (const c of g.cut) {
    const shape = new THREE.Shape(c.pts.map(([x, z]) => new THREE.Vector2(x, z)));
    const m = new THREE.Mesh(new THREE.ShapeGeometry(shape), INK);
    m.rotation.x = Math.PI / 2;
    m.position.y = y;
    poche.add(m);
  }
  const segs = [];
  const P = (p) => new THREE.Vector3(p[0], y, p[1]);
  g.lines.forEach((l) => segs.push(P(l.a), P(l.b)));
  g.arcs.forEach((a) => {
    for (let i = 0; i < 16; i++) {
      const t0 = a.from + (a.to - a.from) * i / 16, t1 = a.from + (a.to - a.from) * (i + 1) / 16;
      if (i % 2) continue;
      segs.push(P([a.c[0] + Math.cos(t0) * a.r, a.c[1] + Math.sin(t0) * a.r]), P([a.c[0] + Math.cos(t1) * a.r, a.c[1] + Math.sin(t1) * a.r]));
    }
  });
  if (segs.length) poche.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(segs), INK_L));
}

// --- modo render: sol real de Bogotá ---
let renderMode = false;
function sunDir(hour, doy, lat = 4.6) {
  const r = Math.PI / 180;
  const dec = 23.44 * Math.sin(r * (360 / 365) * (doy - 81)) * r;
  const H = (hour - 12) * 15 * r, phi = lat * r;
  const el = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
  const az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi)) + Math.PI;
  return new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.max(Math.sin(el), 0.05), -Math.cos(az) * Math.cos(el)).normalize();
}
function updateSun() {
  const hr = parseFloat($('#sunH').value), doy = parseInt($('#sunD').value, 10);
  $('#sunVal').textContent = `${String(Math.floor(hr)).padStart(2, '0')}:${String(Math.round((hr % 1) * 60)).padStart(2, '0')}`;
  const b = modelBounds(), c = b.getCenter(new THREE.Vector3()), r = Math.max(b.getSize(new THREE.Vector3()).length(), 10);
  const d = renderMode ? sunDir(hr, doy) : new THREE.Vector3(0.5, 0.8, 0.35).normalize();
  sun.position.copy(c).addScaledVector(d, r * 1.5);
  sun.target.position.copy(c);
  const s = sun.shadow.camera;
  s.left = s.bottom = -r; s.right = s.top = r; s.near = 0.1; s.far = r * 4;
  s.updateProjectionMatrix();
}
function setRender(on) {
  renderMode = on;
  $('#renderBtn').setAttribute('aria-pressed', on);
  $('#sunBox').hidden = !on;
  renderer.shadowMap.enabled = on;
  sun.castShadow = on;
  catcher.visible = on;
  catcher.position.y = model.level().elev - 0.002;
  scene.traverse((o) => { if (o.material) o.material.needsUpdate = true; });
  updateSun();
}

// --- construcción del modelo ---
function rebuild() {
  root.traverse((o) => {
    if (o.geometry && !o.userData.shared) o.geometry.dispose();
    if (o.isCSS2DObject) o.element.remove(); // CSS2DRenderer no limpia etiquetas de grupos eliminados
  });
  root.clear();
  const d = model.doc;
  for (const el of d.elements) {
    const lay = model.layer(el.layer);
    const obj = buildElement(el);
    obj.visible = lay?.visible !== false;
    obj.traverse((o) => { if (o.isCSS2DObject) o.visible = obj.visible; });
    root.add(obj);
  }
  const lvl = model.level();
  grid.position.y = lvl.elev + 0.001;
  setEdgesVisible(root, settings.edges);
  attachSelection();
  updateSection();
  updateSun();
  renderSide();
  $('#pname').value = d.name;
}
setOnAssetReady(rebuild);

function objFor(id) { return root.children.find((o) => o.userData.elId === id); }

function attachSelection() {
  const el = model.selection && model.get(model.selection);
  const obj = el && objFor(el.id);
  tc.detach();
  selBox.visible = false;
  if (!obj) return;
  selBox.setFromObject(obj);
  selBox.visible = true;
  const lay = model.layer(el.layer);
  if (tools.name === 'select' && !lay?.locked && el.type !== 'dim') {
    tc.attach(obj);
    tc.setTranslationSnap(gridStep());
    tc.setRotationSnap(THREE.MathUtils.degToRad(15));
    if (!['box', 'column', 'import'].includes(el.type)) tc.setMode('translate');
  }
}

function pick(ray) {
  if (tour.active) return;
  if (tc.dragging || tc.axis) return;
  const objs = root.children.filter((o) => o.visible && !model.layer(model.get(o.userData.elId)?.layer)?.locked);
  const hit = ray.intersectObjects(objs, true).find((h) => !h.object.userData.isEdge);
  let o = hit?.object;
  while (o && !o.userData.elId) o = o.parent;
  model.select(o ? o.userData.elId : null);
}

// --- herramientas ---
const gridStep = () => parseFloat($('#grid').value);
const tools = createTools({
  dom: renderer.domElement,
  root, overlay,
  camera: () => camera,
  elev: () => model.level().elev,
  grid: gridStep,
  isElevation: () => view === 'alzado' || view === 'lateral',
  setHint: (h) => { $('#hint').innerHTML = h; },
  setVCB: (label) => { $('#vcb').hidden = !label; $('#vcbLbl').textContent = label || ''; $('#vcbIn').value = ''; },
  snapTag: (t) => { const el = $('#snapTag'); el.hidden = !t; if (t) { el.textContent = t.text; el.style.left = t.x + 'px'; el.style.top = t.y + 'px'; } },
  coords: (p) => { $('#coords').textContent = `x ${fmt(p.x)} · z ${fmt(p.z)}`; },
  toast,
  pick,
});

function setTool(name) {
  tools.activate(name);
  $$('[data-tool]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.tool === name));
  attachSelection();
  renderProps();
}

// --- panel lateral ---
const TYPE = { wall: 'Muro', slab: 'Losa', column: 'Columna', box: 'Volumen', dim: 'Cota', import: 'Modelo importado' };
const esc = (t) => String(t ?? '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
const num = (k, label, v, step = 0.01, extra = '') => `<label class="f"><span>${label}</span><input type="number" step="${step}" data-k="${k}" value="${+(+v).toFixed(4)}" ${extra}></label>`;
const matSelect = (v) => `<label class="f full"><span>Material</span><select data-k="material">${Object.entries(MATERIALS).map(([k, m]) => `<option value="${k}" ${k === v ? 'selected' : ''}>${m.name}</option>`).join('')}</select></label>`;
const sel = (k, label, v, opts) => `<label class="f"><span>${label}</span><select data-k="${k}">${opts.map(([val, t]) => `<option value="${val}" ${val === v ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>`;

function renderProps() {
  const el = model.selection && model.get(model.selection);
  const p = $('#props');
  if (!el) {
    const tool = tools.name;
    const d = DEFAULTS[tool];
    p.innerHTML = `<span class="k">Nada seleccionado</span><h3>${esc(model.doc.name)}</h3>
      <p class="empty">Elige una herramienta y dibuja sobre la rejilla. Haz clic en un elemento con <b>Seleccionar</b> para editar sus medidas, su material y su capa.</p>
      ${d ? `<div class="card"><span class="k">Valores por defecto · ${{ wall: 'muro', slab: 'losa', box: 'volumen', column: 'columna', door: 'puerta', window: 'ventana' }[tool]}</span><div class="fields" data-defaults="${tool}">${Object.entries(d).map(([k, v]) => k === 'material' ? matSelect(v) : k === 'profile' ? sel('profile', 'Perfil', v, [['I', 'Perfil I (IPE)'], ['rect', 'Rectangular'], ['round', 'Circular']]) : num(k, { height: 'Altura', thickness: 'Espesor', h: 'Altura', w: 'Ancho', d: 'Fondo', width: 'Ancho', sill: 'Antepecho' }[k] || k, v)).join('')}</div></div>` : ''}
      <div class="card"><span class="k">Atajos</span><p class="empty mono">V seleccionar · W muro · L losa · B volumen · C columna · P puerta · N ventana · M cota · G mover · R rotar · Supr eliminar · Ctrl+Z deshacer · Ctrl+D duplicar · K caminar · 1-4 vistas · F encuadrar</p></div>`;
    return;
  }
  const layerOpts = model.doc.layers.map((l) => [l.id, l.name]);
  const levelOpts = model.doc.levels.map((l) => [l.id, l.name]);
  let f = `<label class="f full"><span>Nombre</span><input data-k="name" value="${esc(el.name || '')}" placeholder="${TYPE[el.type]}"></label>`;
  if (el.type === 'wall') {
    f += num('length', 'Longitud', wallLength(el)) + num('height', 'Altura', el.height) + num('thickness', 'Espesor', el.thickness) + matSelect(el.material);
  } else if (el.type === 'slab') {
    f += num('thickness', 'Espesor', el.thickness) + `<label class="f"><span>Área</span><input disabled value="${fmt(polygonArea(el.points))} m²"></label>` + matSelect(el.material);
  } else if (el.type === 'column') {
    f += sel('profile', 'Perfil', el.profile, [['I', 'Perfil I (IPE)'], ['rect', 'Rectangular'], ['round', 'Circular']]) + num('height', 'Altura', el.height)
      + num('w', el.profile === 'round' ? 'Diámetro' : 'Ancho (ala)', el.w) + num('d', 'Fondo (alto perfil)', el.d) + num('rotDeg', 'Rotación °', (el.rotY || 0) * 180 / Math.PI, 1) + matSelect(el.material);
  } else if (el.type === 'box') {
    f += num('w', 'Ancho', el.w) + num('d', 'Fondo', el.d) + num('h', 'Altura', el.h) + num('y', 'Elevación', el.y || 0) + num('rotDeg', 'Rotación °', (el.rotY || 0) * 180 / Math.PI, 1) + matSelect(el.material);
  } else if (el.type === 'dim') {
    f += num('offset', 'Separación', el.offset || 0) + `<label class="f"><span>Medida</span><input disabled value="${fmt(Math.hypot(el.b[0] - el.a[0], el.b[1] - el.a[1]))} m"></label>`;
  } else if (el.type === 'import') {
    f += num('scale', 'Escala', el.scale || 1, 0.001) + num('y', 'Elevación', el.y || 0) + num('rotDeg', 'Rotación °', (el.rotY || 0) * 180 / Math.PI, 1);
  }
  f += sel('layer', 'Capa', el.layer, layerOpts) + sel('level', 'Nivel', el.level, levelOpts);
  let ops = '';
  if (el.type === 'wall') {
    ops = `<div class="card"><div class="hd"><span class="k">Vanos (${el.openings.length})</span><span class="mono mute">medidas en m</span></div>${el.openings.length ? '' : '<p class="empty">Usa las herramientas Puerta o Ventana sobre este muro.</p>'}
      ${el.openings.map((o, i) => `<div class="fields" data-op="${i}">${sel('kind', 'Tipo', o.kind, [['window', 'Ventana'], ['door', 'Puerta']])}${num('t', 'Eje desde inicio', o.t)}${num('width', 'Ancho', o.width)}${num('height', 'Alto', o.height)}${num('sill', 'Antepecho', o.sill)}<label class="f"><span>&nbsp;</span><button class="btn sm danger" data-delop="${i}">Quitar vano</button></label></div>`).join('<hr style="border:0;border-top:1px solid var(--line);width:100%">')}</div>`;
  }
  p.innerHTML = `<span class="k">${TYPE[el.type]} · ${esc(el.id)}</span><h3>${esc(el.name || TYPE[el.type])}</h3>
    <div class="fields" data-el="${el.id}">${f}</div>${ops}
    <div class="row"><button class="btn" data-act="dup">Duplicar</button><button class="btn danger" data-act="del">Eliminar</button></div>`;
}

$('#props').addEventListener('change', (e) => {
  const t = e.target, k = t.dataset.k;
  if (!k) return;
  const defs = t.closest('[data-defaults]');
  if (defs) {
    DEFAULTS[defs.dataset.defaults][k] = t.type === 'number' ? parseFloat(t.value) : t.value;
    tools.activate(tools.name);
    return;
  }
  const el = model.get(model.selection);
  if (!el) return;
  const v = t.type === 'number' ? parseFloat(t.value) : t.value;
  if (t.type === 'number' && !Number.isFinite(v)) return;
  const opRow = t.closest('[data-op]');
  model.change(() => {
    if (opRow) { el.openings[+opRow.dataset.op][k] = v; return; }
    if (k === 'length') {
      const L = wallLength(el) || 1, s = v / L;
      el.b = [el.a[0] + (el.b[0] - el.a[0]) * s, el.a[1] + (el.b[1] - el.a[1]) * s];
    } else if (k === 'rotDeg') el.rotY = v * Math.PI / 180;
    else el[k] = v;
  });
});
$('#props').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.delop) model.change(() => { model.get(model.selection).openings.splice(+b.dataset.delop, 1); });
  if (b.dataset.act === 'del') deleteSelection();
  if (b.dataset.act === 'dup') duplicateSelection();
});

const EYE = '<svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const LOCK = '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

function renderLayers() {
  const d = model.doc;
  $('#layers').innerHTML = `<span class="k">Capas · la activa recibe lo que dibujas</span><div class="list">${d.layers.map((l) => `
    <div class="li ${l.id === d.activeLayer ? 'on' : ''}" data-layer="${l.id}">
      <input type="radio" name="al" ${l.id === d.activeLayer ? 'checked' : ''} aria-label="Capa activa" style="accent-color:var(--red)">
      <input value="${esc(l.name)}" data-rename aria-label="Nombre de la capa">
      <button class="ic ${l.visible ? '' : 'off'}" data-vis title="Mostrar u ocultar">${EYE}</button>
      <button class="ic ${l.locked ? '' : 'off'}" data-lock title="Bloquear">${LOCK}</button>
    </div>`).join('')}</div>
    <div class="row"><button class="btn" data-addlayer>+ Nueva capa</button></div>
    <p class="empty mono">${d.elements.length} elementos en el proyecto</p>`;
}
$('#layers').addEventListener('click', (e) => {
  const row = e.target.closest('[data-layer]');
  if (e.target.closest('[data-addlayer]')) return model.change((d) => { const id = uid('c'); d.layers.push({ id, name: `Capa ${d.layers.length + 1}`, visible: true, locked: false }); d.activeLayer = id; });
  if (!row) return;
  const id = row.dataset.layer;
  if (e.target.closest('[data-vis]')) model.change(() => { const l = model.layer(id); l.visible = !l.visible; });
  else if (e.target.closest('[data-lock]')) model.change(() => { const l = model.layer(id); l.locked = !l.locked; });
  else if (e.target.type === 'radio') model.change((d) => { d.activeLayer = id; });
});
$('#layers').addEventListener('change', (e) => {
  if (e.target.dataset.rename == null) return;
  const id = e.target.closest('[data-layer]').dataset.layer;
  model.change(() => { model.layer(id).name = e.target.value || 'Capa'; });
});

function renderLevels() {
  const d = model.doc;
  $('#levels').innerHTML = `<span class="k">Niveles · el activo es el que ves en planta</span><div class="list">${d.levels.map((l) => `
    <div class="card ${l.id === d.activeLevel ? 'on' : ''}" data-level="${l.id}" style="${l.id === d.activeLevel ? 'border-color:var(--red)' : ''}">
      <div class="hd"><label class="tg"><input type="radio" name="lv" ${l.id === d.activeLevel ? 'checked' : ''}> <b>${esc(l.name)}</b></label>
      <span class="mono mute">${d.elements.filter((e) => e.level === l.id).length} elem.</span></div>
      <div class="fields"><label class="f full"><span>Nombre</span><input data-lk="name" value="${esc(l.name)}"></label>
      ${['elev', 'height'].map((k) => `<label class="f"><span>${k === 'elev' ? 'Cota de piso' : 'Altura libre'}</span><input type="number" step="0.05" data-lk="${k}" value="${l[k]}"></label>`).join('')}</div>
    </div>`).join('')}</div>
    <div class="row"><button class="btn" data-addlevel>+ Nivel vacío</button><button class="btn" data-duplevel>Duplicar nivel activo</button></div>
    <p class="empty">Duplicar copia muros, losas, columnas y vanos al nivel de arriba: así se arma un edificio piso por piso.</p>`;
}
function addLevel(copy) {
  model.change((d) => {
    const top = d.levels.reduce((a, b) => (b.elev > a.elev ? b : a));
    const id = uid('n');
    d.levels.push({ id, name: `Piso ${d.levels.length + 1}`, elev: +(top.elev + top.height).toFixed(3), height: top.height });
    if (copy) {
      const src = d.activeLevel;
      d.elements.filter((e) => e.level === src && e.type !== 'import').forEach((e) => {
        const c = JSON.parse(JSON.stringify(e));
        c.id = uid(); c.level = id;
        (c.openings || []).forEach((o) => { o.id = uid('v'); });
        d.elements.push(c);
      });
    }
    d.activeLevel = id;
  });
  toast(copy ? 'Nivel duplicado' : 'Nivel creado');
}
$('#levels').addEventListener('click', (e) => {
  if (e.target.closest('[data-addlevel]')) return addLevel(false);
  if (e.target.closest('[data-duplevel]')) return addLevel(true);
  const card = e.target.closest('[data-level]');
  if (card && e.target.type === 'radio') model.change((d) => { d.activeLevel = card.dataset.level; });
});
$('#levels').addEventListener('change', (e) => {
  const k = e.target.dataset.lk;
  if (!k) return;
  const id = e.target.closest('[data-level]').dataset.level;
  model.change((d) => { const l = d.levels.find((x) => x.id === id); l[k] = k === 'name' ? e.target.value : parseFloat(e.target.value) || 0; });
});

function quantities() {
  const els = model.doc.elements;
  const q = { area: 0, wallLen: 0, wallArea: 0, wallVol: 0, doors: 0, windows: 0, cols: 0, steelKg: 0, concrete: 0, boxes: 0 };
  for (const e of els) {
    if (e.type === 'slab') { const a = polygonArea(e.points); q.area += a; q.concrete += a * e.thickness; }
    if (e.type === 'wall') {
      const L = wallLength(e), holes = e.openings.reduce((s, o) => s + o.width * o.height, 0);
      q.wallLen += L; q.wallArea += L * e.height - holes; q.wallVol += (L * e.height - holes) * e.thickness;
      e.openings.forEach((o) => { if (o.kind === 'door') q.doors++; else q.windows++; });
    }
    if (e.type === 'column') {
      q.cols++;
      const sec = columnSection(e);
      if (e.material.startsWith('acero') || e.material === 'corten') q.steelKg += sec * e.height * 7850; else q.concrete += sec * e.height;
    }
    if (e.type === 'box') q.boxes++;
  }
  return q;
}
function renderQty() {
  const q = quantities();
  $('#qty').innerHTML = `<span class="k">Cuantificación en vivo · todo el proyecto</span>
    <div class="big"><div><strong>${fmt(q.area, 1)}</strong><span class="mono">m² de losa</span></div><div><strong>${fmt(q.wallLen, 1)}</strong><span class="mono">m lineales de muro</span></div>
    <div><strong>${q.doors + q.windows}</strong><span class="mono">vanos</span></div><div><strong>${fmt(q.steelKg, 0)}</strong><span class="mono">kg de acero</span></div></div>
    <div class="qty"><div>Área neta de muro</div><div>${fmt(q.wallArea)} m²</div><div>Volumen de muro</div><div>${fmt(q.wallVol)} m³</div>
    <div>Concreto (losas y columnas)</div><div>${fmt(q.concrete)} m³</div><div>Puertas</div><div>${q.doors}</div><div>Ventanas</div><div>${q.windows}</div>
    <div>Columnas</div><div>${q.cols}</div><div>Volúmenes / mobiliario</div><div>${q.boxes}</div><div>Niveles</div><div>${model.doc.levels.length}</div></div>
    <button class="btn" data-csv>Descargar cantidades (.csv)</button>
    <p class="empty">Las cantidades son estimadas a partir del modelo (acero a 7.850 kg/m³). Sirven para cotizar, no reemplazan el presupuesto de obra.</p>`;
}
$('#qty').addEventListener('click', (e) => {
  if (!e.target.closest('[data-csv]')) return;
  const q = quantities();
  const rows = [['Concepto', 'Cantidad', 'Unidad'], ['Losas', q.area, 'm2'], ['Muros (longitud)', q.wallLen, 'm'], ['Muros (área neta)', q.wallArea, 'm2'], ['Muros (volumen)', q.wallVol, 'm3'],
    ['Concreto', q.concrete, 'm3'], ['Acero estructural', q.steelKg, 'kg'], ['Puertas', q.doors, 'un'], ['Ventanas', q.windows, 'un'], ['Columnas', q.cols, 'un']];
  download('﻿' + rows.map((r) => r.map((v) => (typeof v === 'number' ? v.toFixed(2).replace('.', ',') : v)).join(';')).join('\n'), `${slug(model.doc.name)}-cantidades.csv`, 'text/csv');
});

function renderSide() {
  renderProps(); renderLayers(); renderLevels(); renderQty();
  const n = model.doc.elements.length;
  $('#stat').textContent = `${model.level().name} · ${n} elementos`;
}
$$('[data-tab]').forEach((b) => b.addEventListener('click', () => {
  $$('[data-tab]').forEach((x) => x.setAttribute('aria-selected', x === b));
  $$('[data-pane]').forEach((p) => { p.hidden = p.dataset.pane !== b.dataset.tab; });
}));

// --- acciones ---
function deleteSelection() { if (model.selection) model.remove(model.selection); }
function duplicateSelection() {
  const el = model.get(model.selection);
  if (!el) return;
  const c = JSON.parse(JSON.stringify(el));
  c.id = uid();
  (c.openings || []).forEach((o) => { o.id = uid('v'); });
  translateElement(c, 0.5, 0.5);
  model.add(c);
  model.select(c.id);
}

let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2400);
}

async function importModel(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const format = ext === 'obj' ? 'obj' : 'glb';
  try {
    const buf = await file.arrayBuffer();
    const obj = await parseAsset(buf, format);
    const id = uid('a');
    registerAsset(id, obj);
    await putAsset(id, buf);
    const b = new THREE.Box3().setFromObject(obj), size = b.getSize(new THREE.Vector3());
    const big = Math.max(size.x, size.y, size.z);
    const scale = big > 500 ? 0.001 : big > 80 ? 0.01 : 1; // mm o cm → m
    const c = b.getCenter(new THREE.Vector3());
    obj.position.set(-c.x, -b.min.y, -c.z); // centrado y apoyado en el piso
    const t = orbit.target;
    const el = model.add({ type: 'import', name: file.name, asset: id, format, x: +t.x.toFixed(2), z: +t.z.toFixed(2), y: 0, rotY: 0, scale, layer: 'c_ref' });
    model.select(el.id);
    toast(scale !== 1 ? `Importado · convertido de ${scale === 0.001 ? 'mm' : 'cm'} a m` : 'Modelo importado');
    setView(view);
  } catch (err) {
    console.error(err);
    toast('No se pudo leer el archivo. Prueba con GLB o con glTF embebido.');
  }
}

async function readJSON(file) {
  try {
    const doc = JSON.parse(await file.text());
    if (!Array.isArray(doc.elements)) throw new Error('formato');
    model.load(doc);
    setView('3d');
    toast('Proyecto abierto');
  } catch { toast('El archivo no es un proyecto de AceroStudio'); }
}

const ACTIONS = {
  new: () => { if (confirm('¿Empezar un proyecto nuevo? El actual se reemplaza (guárdalo antes si lo necesitas).')) { model.load(emptyDoc()); setView('3d'); } },
  sample: () => { model.load(sampleDoc()); setView('3d'); },
  open: () => $('#fileJSON').click(),
  save: () => exportJSON(model.doc),
  import: () => $('#fileModel').click(),
  glb: () => exportGLB(root, model.doc).catch(() => toast('No se pudo exportar GLB')),
  obj: () => exportOBJ(root, model.doc),
  dxf: () => download(planDXF(model.doc, model.doc.activeLevel), `${slug(model.doc.name)}-${slug(model.level().name)}.dxf`, 'application/dxf'),
  svg: () => download(planSVG(model.doc, model.doc.activeLevel), `${slug(model.doc.name)}-${slug(model.level().name)}.svg`, 'image/svg+xml'),
  png: () => { selBox.visible = false; tc.detach(); exportPNG(renderer, scene, camera, model.doc); attachSelection(); },
};
$$('[data-act]', $('.dd')).forEach((b) => b.addEventListener('click', () => { b.closest('details').open = false; ACTIONS[b.dataset.act](); }));
$('#fileJSON').addEventListener('change', (e) => { if (e.target.files[0]) readJSON(e.target.files[0]); e.target.value = ''; });
$('#fileModel').addEventListener('change', (e) => { if (e.target.files[0]) importModel(e.target.files[0]); e.target.value = ''; });
vp.addEventListener('dragover', (e) => e.preventDefault());
vp.addEventListener('drop', (e) => {
  e.preventDefault();
  const f = e.dataTransfer.files[0];
  if (!f) return;
  if (f.name.endsWith('.json')) readJSON(f); else importModel(f);
});

$('#undo').addEventListener('click', () => model.undo());
$('#redo').addEventListener('click', () => model.redo());
$$('[data-view]').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));
$$('[data-tool]').forEach((b) => b.addEventListener('click', () => setTool(b.dataset.tool)));
$('#renderBtn').addEventListener('click', () => setRender(!renderMode));
$('#sunH').addEventListener('input', updateSun);
$('#sunD').addEventListener('change', updateSun);
$('#secOn').addEventListener('change', updateSection);
$('#secH').addEventListener('input', updateSection);
$('#edgesOn').addEventListener('change', (e) => setEdgesVisible(root, e.target.checked));
$('#grid').addEventListener('change', () => { tc.setTranslationSnap(gridStep()); });
$('#pname').addEventListener('change', (e) => model.change((d) => { d.name = e.target.value || 'Proyecto sin título'; }));
$('#vcb').addEventListener('submit', (e) => { e.preventDefault(); tools.vcb($('#vcbIn').value); $('#vcbIn').value = ''; });

const KEYS = { v: 'select', w: 'wall', l: 'slab', b: 'box', c: 'column', p: 'door', n: 'window', m: 'dim' };
addEventListener('keydown', (e) => {
  const typing = /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName) && document.activeElement.id !== 'vcbIn';
  if (typing) return;
  const k = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); return e.shiftKey ? model.redo() : model.undo(); }
  if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); return model.redo(); }
  if ((e.ctrlKey || e.metaKey) && k === 'd') { e.preventDefault(); return duplicateSelection(); }
  if ((e.ctrlKey || e.metaKey) && k === 's') { e.preventDefault(); return exportJSON(model.doc); }
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  // Con una herramienta activa, los números van a la casilla de medidas (como en SketchUp).
  if (document.activeElement.id !== 'vcbIn' && /^[0-9.,]$/.test(e.key) && !$('#vcb').hidden) { $('#vcbIn').focus(); return; }
  if (document.activeElement.id === 'vcbIn') { if (e.key === 'Escape') { $('#vcbIn').blur(); tools.cancel(); } return; }
  if (e.key === 'Escape') { tools.cancel(); if (tools.name === 'select') model.select(null); return; }
  if (e.key === 'Delete' || e.key === 'Backspace') return deleteSelection();
  if (k === 'k') return $('#walkBtn').click();
  if (KEYS[k]) return setTool(KEYS[k]);
  if (k === 'g') tc.setMode('translate');
  if (k === 'r') { const el = model.get(model.selection); if (el && ['box', 'column', 'import'].includes(el.type)) { tc.setMode('rotate'); tc.showX = tc.showZ = false; tc.showY = true; } }
  if (k === 'g') { tc.showX = tc.showZ = true; tc.showY = false; }
  if (k === 'f') setView(view);
  if (['1', '2', '3', '4'].includes(k)) setView(['3d', 'planta', 'alzado', 'lateral'][+k - 1]);
});

// --- arranque ---
model.on((reason) => {
  if (reason === 'select') { attachSelection(); renderProps(); return; }
  rebuild();
});
const restored = model.restore();
if (!restored) model.doc = sampleDoc();
resize();
rebuild();
setTool('select');
setView('3d');
if (!restored) toast('Abrimos el local de ejemplo · 38 m²');

const tour = createTour({
  camera: persp, orbit: orbit3d, dom: renderer.domElement, root,
  bounds: modelBounds,
  elev: () => model.level().elev,
  setView: (v) => { setTool('select'); model.select(null); setView(v); },
  isRender: () => renderMode,
  setRender,
  setSunHour: (h) => { $('#sunH').value = h; updateSun(); },
});
$('#tourBtn').addEventListener('click', () => tour.play());
$('#walkBtn').addEventListener('click', () => { setTool('select'); model.select(null); setView('3d', false); tour.walk(false); });

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  if (!tour.update(Math.min(clock.getDelta(), 0.1))) orbit.update();
  renderer.render(scene, camera);
  labels.render(scene, camera);
});

// Para pruebas y depuración desde la consola.
window.studio = { model, scene, cam: () => camera, tour: () => tour, setView, setTool, setRender, planSVG: () => planSVG(model.doc, model.doc.activeLevel), planDXF: () => planDXF(model.doc, model.doc.activeLevel) };
