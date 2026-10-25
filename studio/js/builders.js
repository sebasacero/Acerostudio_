// Convierte cada elemento del modelo en objetos de Three.js.
import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { getMaterial } from './materials.js';
import { model, getAsset, fmt } from './model.js';
import { wallFrame, wallSpans, columnPoly, dimGeometry } from './plan.js';

const INK = new THREE.LineBasicMaterial({ color: 0x16191c, transparent: true, opacity: 0.55 });
const RED = new THREE.LineBasicMaterial({ color: 0xcf2a1f, depthTest: false, transparent: true });
export const settings = { edges: true };

// UV a escala real (1 unidad de textura ≈ 0,6 m) para que ladrillo y madera no se estiren.
function worldUV(geo, w, h, d, size = 0.6) {
  const uv = geo.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) {
    const i = f * 4 + k;
    uv.setXY(i, uv.getX(i) * dims[f][0] / size, uv.getY(i) * dims[f][1] / size);
  }
  return geo;
}

function addEdges(mesh) {
  const e = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 25), INK);
  e.userData.isEdge = true;
  e.visible = settings.edges;
  e.raycast = () => {};
  mesh.add(e);
  return mesh;
}

function box(w, h, d, cx, cy, cz, mat) {
  const m = new THREE.Mesh(worldUV(new THREE.BoxGeometry(w, h, d), w, h, d), mat);
  m.position.set(cx, cy, cz);
  m.castShadow = m.receiveShadow = true;
  return addEdges(m);
}

function prism(pts, height, mat) {
  const shape = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, z)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
  geo.rotateX(Math.PI / 2); // la forma queda en XZ y la extrusión baja desde y=0
  geo.translate(0, height, 0);
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = m.receiveShadow = true;
  return addEdges(m);
}

function label(text, cls = 'dim-label') {
  const div = document.createElement('div');
  div.className = cls;
  div.textContent = text;
  return new CSS2DObject(div);
}

const B = {
  wall(el, elev) {
    const g = new THREE.Group();
    const f = wallFrame(el);
    g.position.set(el.a[0], elev, el.a[1]);
    g.rotation.y = -Math.atan2(f.u[1], f.u[0]);
    const H = el.height, T = el.thickness, mat = getMaterial(el.material);
    const { solid, openings } = wallSpans(model.doc, el);
    for (const [s, e] of solid) g.add(box(e - s, H, T, (s + e) / 2, H / 2, 0, mat));
    for (const o of openings) {
      const w = o.e - o.s, top = Math.min(H, o.sill + o.height);
      if (o.sill > 0) g.add(box(w, o.sill, T, (o.s + o.e) / 2, o.sill / 2, 0, mat));
      if (top < H) g.add(box(w, H - top, T, (o.s + o.e) / 2, (H + top) / 2, 0, mat));
      if (o.kind === 'window') {
        g.add(box(w, top - o.sill, 0.02, (o.s + o.e) / 2, (o.sill + top) / 2, 0, getMaterial('vidrio')));
        g.add(box(w, 0.04, T + 0.04, (o.s + o.e) / 2, o.sill + 0.02, 0, getMaterial('acero')));
      } else {
        g.add(box(0.04, top - o.sill - 0.01, w, o.s + 0.02, (o.sill + top) / 2, T / 2 + w / 2, getMaterial('roble')));
      }
    }
    return g;
  },
  slab(el, elev) {
    const m = prism(el.points, el.thickness, getMaterial(el.material));
    m.position.y = elev - el.thickness;
    return m;
  },
  column(el, elev) {
    const pts = columnPoly({ ...el, x: 0, z: 0, rotY: 0 });
    const m = prism(pts, el.height, getMaterial(el.material));
    const g = new THREE.Group();
    g.add(m);
    g.position.set(el.x, elev, el.z);
    g.rotation.y = -(el.rotY || 0);
    return g;
  },
  box(el, elev) {
    const g = new THREE.Group();
    g.add(box(el.w, el.h, el.d, 0, el.h / 2, 0, getMaterial(el.material)));
    g.position.set(el.x, elev + (el.y || 0), el.z);
    g.rotation.y = -(el.rotY || 0);
    return g;
  },
  dim(el, elev) {
    const g = new THREE.Group();
    const { a2, b2, text, mid } = dimGeometry(el);
    const y = elev + 0.02;
    const v = (p) => new THREE.Vector3(p[0], y, p[1]);
    const geo = new THREE.BufferGeometry().setFromPoints([v(el.a), v(a2), v(el.b), v(b2), v(a2), v(b2)]);
    const line = new THREE.LineSegments(geo, RED);
    line.renderOrder = 10;
    g.add(line);
    const l = label(text);
    l.position.copy(v(mid));
    g.add(l);
    g.userData.isAnnotation = true;
    return g;
  },
  import(el, elev) {
    const g = new THREE.Group();
    g.position.set(el.x, elev + (el.y || 0), el.z);
    g.rotation.y = -(el.rotY || 0);
    g.scale.setScalar(el.scale || 1);
    const tpl = assets.get(el.asset);
    if (tpl) {
      const c = tpl.clone(true);
      c.traverse((o) => { o.userData.shared = true; });
      g.add(c);
    }
    else loadAsset(el);
    return g;
  },
};

export function buildElement(el) {
  const lvl = model.level(el.level);
  const obj = (B[el.type] || (() => new THREE.Group()))(el, lvl ? lvl.elev : 0);
  obj.userData.elId = el.id;
  return obj;
}

export function setEdgesVisible(root, on) {
  settings.edges = on;
  root.traverse((o) => { if (o.userData.isEdge) o.visible = on; });
}

// --- modelos importados ---
export const assets = new Map();
const pending = new Set();
export let onAssetReady = () => {};
export const setOnAssetReady = (fn) => { onAssetReady = fn; };

export async function parseAsset(buffer, format) {
  if (format === 'obj') {
    const obj = new OBJLoader().parse(new TextDecoder().decode(buffer));
    obj.traverse((o) => { if (o.isMesh) o.material = getMaterial('concreto'); });
    return obj;
  }
  const gltf = await new GLTFLoader().parseAsync(buffer, '');
  return gltf.scene;
}

export function registerAsset(id, obj) {
  obj.traverse((o) => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
  assets.set(id, obj);
}

async function loadAsset(el) {
  if (pending.has(el.asset)) return;
  pending.add(el.asset);
  const buf = await getAsset(el.asset);
  if (!buf) return;
  try {
    registerAsset(el.asset, await parseAsset(buf, el.format));
    onAssetReady();
  } catch (e) { console.warn('No se pudo cargar el modelo importado', e); }
}

export { fmt };
