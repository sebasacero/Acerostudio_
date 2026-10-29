// Modelo de datos del proyecto: niveles, capas, elementos, historial y guardado.
// Unidades: metros. Ejes: X este, Z sur, Y arriba (planta = plano XZ).

const STORAGE_KEY = 'acerostudio.proyecto.v1';
const listeners = new Set();
const undoStack = [];
const redoStack = [];

export const uid = (p = 'e') => p + Math.random().toString(36).slice(2, 9);

export function emptyDoc() {
  return {
    version: 1,
    name: 'Proyecto sin título',
    units: 'm',
    levels: [{ id: 'n0', name: 'Piso 1', elev: 0, height: 3 }],
    layers: [
      { id: 'c_arq', name: 'Arquitectura', visible: true, locked: false },
      { id: 'c_est', name: 'Estructura', visible: true, locked: false },
      { id: 'c_mob', name: 'Mobiliario', visible: true, locked: false },
      { id: 'c_cot', name: 'Cotas', visible: true, locked: false },
      { id: 'c_ref', name: 'Referencias importadas', visible: true, locked: false },
    ],
    activeLevel: 'n0',
    activeLayer: 'c_arq',
    elements: [],
  };
}

// Local de ejemplo de la web: ~38 m², columna de acero central, dos ventanas y mueble en L.
export function sampleDoc() {
  const d = emptyDoc();
  d.name = 'Local de ejemplo · 38 m²';
  const W = 7.6, D = 5;
  const wall = (a, b, openings = []) => ({ id: uid(), type: 'wall', level: 'n0', layer: 'c_arq', material: 'yeso',
    a, b, height: 3, thickness: 0.2, openings });
  d.elements.push(
    { id: uid(), type: 'slab', level: 'n0', layer: 'c_arq', material: 'microcemento', thickness: 0.15,
      points: [[0, 0], [W, 0], [W, D], [0, D]] },
    wall([0, 0], [W, 0], [
      { id: uid(), kind: 'window', t: 2.2, width: 2.4, height: 1.6, sill: 0.9 },
      { id: uid(), kind: 'window', t: 5.6, width: 1.6, height: 1.6, sill: 0.9 },
    ]),
    wall([W, 0], [W, D]),
    wall([W, D], [0, D]),
    wall([0, D], [0, 0], [{ id: uid(), kind: 'door', t: 1.0, width: 1.0, height: 2.2, sill: 0 }]),
    { id: uid(), type: 'column', level: 'n0', layer: 'c_est', material: 'acero_azul', profile: 'I',
      x: 3.8, z: 2.2, w: 0.15, d: 0.3, height: 3, rotY: 0 },
    { id: uid(), type: 'box', level: 'n0', layer: 'c_mob', material: 'nogal', name: 'Mueble en L (frente)',
      x: 2.4, z: 4.45, w: 3.6, d: 0.7, h: 1.0, rotY: 0 },
    { id: uid(), type: 'box', level: 'n0', layer: 'c_mob', material: 'nogal', name: 'Mueble en L (lado)',
      x: 0.95, z: 3.25, w: 0.7, d: 1.7, h: 1.0, rotY: 0 },
    { id: uid(), type: 'box', level: 'n0', layer: 'c_mob', material: 'roble', name: 'Mesa comunal',
      x: 5.8, z: 3.6, w: 2.4, d: 0.9, h: 0.75, rotY: 0 },
    { id: uid(), type: 'dim', level: 'n0', layer: 'c_cot', a: [0, -0.1], b: [W, -0.1], offset: -0.7 },
    { id: uid(), type: 'dim', level: 'n0', layer: 'c_cot', a: [W + 0.1, 0], b: [W + 0.1, D], offset: 0.7 },
  );
  return d;
}

export const model = {
  doc: emptyDoc(),
  selection: null,

  on(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  emit(reason) { listeners.forEach((fn) => fn(reason)); },

  get(id) { return this.doc.elements.find((e) => e.id === id); },
  level(id = this.doc.activeLevel) { return this.doc.levels.find((l) => l.id === id) || this.doc.levels[0]; },
  layer(id) { return this.doc.layers.find((l) => l.id === id); },

  // Toda modificación pasa por aquí para poder deshacerla.
  change(fn, reason = 'edit') {
    undoStack.push(JSON.stringify(this.doc));
    if (undoStack.length > 200) undoStack.shift();
    redoStack.length = 0;
    fn(this.doc);
    this.save();
    this.emit(reason);
  },
  undo() {
    if (!undoStack.length) return;
    redoStack.push(JSON.stringify(this.doc));
    this.doc = JSON.parse(undoStack.pop());
    if (this.selection && !this.get(this.selection)) this.selection = null;
    this.save();
    this.emit('history');
  },
  redo() {
    if (!redoStack.length) return;
    undoStack.push(JSON.stringify(this.doc));
    this.doc = JSON.parse(redoStack.pop());
    this.save();
    this.emit('history');
  },
  load(doc, reason = 'load') {
    undoStack.length = 0;
    redoStack.length = 0;
    this.doc = Object.assign(emptyDoc(), doc);
    this.selection = null;
    this.save();
    this.emit(reason);
  },
  add(el) {
    el.id ||= uid();
    el.level ||= this.doc.activeLevel;
    el.layer ||= this.doc.activeLayer;
    this.change((d) => d.elements.push(el), 'add');
    return el;
  },
  remove(id) {
    this.change((d) => { d.elements = d.elements.filter((e) => e.id !== id); }, 'remove');
    if (this.selection === id) this.select(null);
  },
  update(id, patch) {
    this.change(() => Object.assign(this.get(id), patch), 'update');
  },
  select(id) {
    this.selection = id;
    this.emit('select');
  },
  save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.doc)); } catch { /* sin almacenamiento */ }
  },
  restore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { this.doc = Object.assign(emptyDoc(), JSON.parse(raw)); return true; }
    } catch { /* sin almacenamiento */ }
    return false;
  },
};

// --- geometría de apoyo ---

export const wallLength = (w) => Math.hypot(w.b[0] - w.a[0], w.b[1] - w.a[1]);

export function polygonArea(pts) {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, z1] = pts[i], [x2, z2] = pts[(i + 1) % pts.length];
    s += x1 * z2 - x2 * z1;
  }
  return Math.abs(s) / 2;
}

export const fmt = (n, dec = 2) => Number(n).toLocaleString('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: dec });

// Traslada un elemento en planta (dx, dz).
export function translateElement(el, dx, dz) {
  const mv = (p) => [p[0] + dx, p[1] + dz];
  if (el.type === 'wall' || el.type === 'dim') { el.a = mv(el.a); el.b = mv(el.b); }
  else if (el.type === 'slab') el.points = el.points.map(mv);
  else if (el.type === 'member') { el.p0 = [el.p0[0] + dx, el.p0[1], el.p0[2] + dz]; el.p1 = [el.p1[0] + dx, el.p1[1], el.p1[2] + dz]; }
  else { el.x += dx; el.z += dz; }
}

// Archivos importados (GLB/OBJ) en IndexedDB para que sobrevivan a la recarga.
const DB = 'acerostudio-assets';
function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore('files');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
export async function putAsset(id, buffer) {
  try {
    const db = await idb();
    await new Promise((res, rej) => {
      const tx = db.transaction('files', 'readwrite');
      tx.objectStore('files').put(buffer, id);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
  } catch { /* sin IndexedDB: el modelo solo vive en esta sesión */ }
}
export async function getAsset(id) {
  try {
    const db = await idb();
    return await new Promise((res, rej) => {
      const r = db.transaction('files').objectStore('files').get(id);
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
  } catch { return null; }
}
