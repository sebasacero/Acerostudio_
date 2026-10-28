// Herramientas de dibujo: muro, losa, volumen, columna, puerta, ventana y cota.
// Un clic sin arrastre es una acción de la herramienta; arrastrar orbita o desplaza la vista.
import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { model, uid, fmt, wallLength } from './model.js';
import { wallFrame } from './plan.js';
import { PROFILES, member } from './steel.js';

const RED = 0xcf2a1f;
const ghostMat = new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0.28, depthWrite: false });
const lineMat = new THREE.LineBasicMaterial({ color: RED, depthTest: false });
const markerMat = new THREE.MeshBasicMaterial({ color: RED, depthTest: false });

export const DEFAULTS = {
  wall: { height: 3, thickness: 0.15, material: 'yeso' },
  slab: { thickness: 0.15, material: 'concreto' },
  box: { h: 1, material: 'roble' },
  column: { profile: 'HEB240', material: 'acero_grafito' },
  beam: { profile: 'IPE300', material: 'acero_grafito' },
  door: { width: 0.9, height: 2.1, sill: 0 },
  window: { width: 1.2, height: 1.4, sill: 0.9 },
};

function colDims() {
  const d = DEFAULTS.column, p = PROFILES[d.profile];
  return p ? { profile: d.profile, w: p.b, d: p.h } : { profile: d.profile, w: d.w || 0.2, d: d.d || 0.2 };
}

// "4,5" → 4.5 · "4x3" / "4;3" → [4, 3]
export function parseVCB(text) {
  const parts = String(text).trim().split(/\s*[x×;*]\s*/i).map((p) => parseFloat(p.replace(',', '.')));
  return parts.filter((n) => Number.isFinite(n));
}

export function createTools(ctx) {
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const overlay = ctx.overlay;
  let current = null;
  let last = null; // último punto ajustado
  let downAt = null;

  const liveDiv = document.createElement('div');
  liveDiv.className = 'live-label';
  const live = new CSS2DObject(liveDiv);
  live.visible = false;

  const marker = new THREE.Mesh(new THREE.OctahedronGeometry(0.06), markerMat);
  marker.renderOrder = 20;
  marker.visible = false;

  function clearOverlay() {
    overlay.clear();
    overlay.add(live, marker);
    live.visible = false;
  }
  clearOverlay();

  function setLive(text, p) {
    if (!text) { live.visible = false; return; }
    liveDiv.textContent = text;
    live.position.copy(p);
    live.visible = true;
  }

  function pointer(ev) {
    const r = ctx.dom.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, ctx.camera());
    return { sx: ev.clientX - r.left, sy: ev.clientY - r.top };
  }

  function ground() {
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -ctx.elev());
    const p = new THREE.Vector3();
    return ray.ray.intersectPlane(plane, p) ? p : null;
  }

  function toScreen(x, z) {
    const v = new THREE.Vector3(x, ctx.elev(), z).project(ctx.camera());
    const r = ctx.dom.getBoundingClientRect();
    return [(v.x + 1) / 2 * r.width, (1 - v.y) / 2 * r.height];
  }

  function snapCandidates() {
    const lv = model.doc.activeLevel, out = [];
    for (const e of model.doc.elements) {
      if (e.level !== lv) continue;
      if (e.type === 'wall') {
        out.push({ p: e.a, k: 'extremo' }, { p: e.b, k: 'extremo' }, { p: [(e.a[0] + e.b[0]) / 2, (e.a[1] + e.b[1]) / 2], k: 'punto medio' });
      } else if (e.type === 'slab') e.points.forEach((p) => out.push({ p, k: 'vértice' }));
      else if (e.type === 'column') out.push({ p: [e.x, e.z], k: 'eje de columna' });
    }
    return out;
  }

  // Ajuste: extremos y puntos medios > ejes ortogonales desde el punto anterior > rejilla.
  function snap(raw, from, sx, sy, shift) {
    let best = null, bd = 14;
    for (const c of snapCandidates()) {
      const [x, y] = toScreen(c.p[0], c.p[1]);
      const d = Math.hypot(x - sx, y - sy);
      if (d < bd) { bd = d; best = c; }
    }
    if (best) return { x: best.p[0], z: best.p[1], kind: best.k };
    const g = ctx.grid();
    const r = (v) => +(Math.round(v / g) * g).toFixed(4);
    let x = r(raw.x), z = r(raw.z), kind = '';
    if (from) {
      const dx = x - from[0], dz = z - from[1];
      const ang = Math.abs(Math.atan2(dz, dx) * 180 / Math.PI) % 90;
      if (shift || ang < 4 || ang > 86) {
        if (Math.abs(dx) > Math.abs(dz)) { z = from[1]; kind = 'eje X'; } else { x = from[0]; kind = 'eje Z'; }
      }
    }
    return { x, z, kind };
  }

  function pickWall() {
    const objs = [];
    ctx.root.children.forEach((o) => { const el = model.get(o.userData.elId); if (el?.type === 'wall' && o.visible) objs.push(o); });
    const hit = ray.intersectObjects(objs, true)[0];
    if (!hit) return null;
    let o = hit.object;
    while (o && !o.userData.elId) o = o.parent;
    return { el: model.get(o.userData.elId), point: hit.point };
  }

  // --- definición de herramientas ---
  const T = {};

  T.select = { hint: '<b>Seleccionar</b> · clic en un elemento para editarlo y moverlo con el gizmo · <b>R</b> rota · <b>Supr</b> elimina · <b>Ctrl+D</b> duplica' };

  T.wall = {
    hint: '<b>Muro</b> · clic para empezar y clic en cada esquina · escribe la longitud y Enter · <b>Shift</b> bloquea el eje · <b>Esc</b> o doble clic termina',
    vcb: 'Longitud',
    pts: [],
    start() { this.pts = []; this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), ghostMat); this.mesh.visible = false; overlay.add(this.mesh); },
    move(p) {
      if (!this.pts.length) return;
      const a = this.pts.at(-1), L = Math.hypot(p.x - a[0], p.z - a[1]);
      this.preview(a, [p.x, p.z], L);
    },
    preview(a, b, L) {
      const d = DEFAULTS.wall, m = this.mesh;
      m.visible = L > 0.001;
      m.scale.set(Math.max(L, 0.001), d.height, d.thickness);
      m.position.set((a[0] + b[0]) / 2, ctx.elev() + d.height / 2, (a[1] + b[1]) / 2);
      m.rotation.y = -Math.atan2(b[1] - a[1], b[0] - a[0]);
      setLive(fmt(L) + ' m', new THREE.Vector3((a[0] + b[0]) / 2, ctx.elev() + d.height + 0.1, (a[1] + b[1]) / 2));
    },
    click(p) {
      const q = [p.x, p.z];
      if (this.pts.length) this.commit(this.pts.at(-1), q);
      if (this.pts.length > 1 && Math.hypot(q[0] - this.pts[0][0], q[1] - this.pts[0][1]) < 1e-3) return this.finish();
      this.pts.push(q);
    },
    commit(a, b) {
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 0.01) return;
      const d = DEFAULTS.wall;
      model.add({ type: 'wall', a: [...a], b: [...b], height: d.height, thickness: d.thickness, material: d.material, openings: [] });
    },
    vcbInput(nums) {
      if (!this.pts.length || !last || !nums.length) return;
      const a = this.pts.at(-1);
      let dx = last.x - a[0], dz = last.z - a[1];
      const L0 = Math.hypot(dx, dz);
      if (L0 < 1e-6) { dx = 1; dz = 0; } else { dx /= L0; dz /= L0; }
      const b = [+(a[0] + dx * nums[0]).toFixed(4), +(a[1] + dz * nums[0]).toFixed(4)];
      this.commit(a, b);
      this.pts.push(b);
    },
    finish() { this.pts = []; this.mesh.visible = false; setLive(null); },
  };

  function rectTool(kind) {
    return {
      hint: kind === 'slab'
        ? '<b>Losa</b> · clic en una esquina y clic en la opuesta · o escribe <b>ancho x fondo</b> (ej. 6x4,5) y Enter'
        : '<b>Volumen</b> · clic en una esquina y clic en la opuesta · o escribe <b>ancho x fondo</b> y Enter · ajusta la altura en Propiedades',
      vcb: 'Ancho x fondo',
      p0: null,
      start() { this.p0 = null; this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), ghostMat); this.mesh.visible = false; overlay.add(this.mesh); },
      move(p) {
        if (!this.p0) return;
        this.show(this.p0, [p.x, p.z]);
      },
      show(a, b) {
        const w = Math.abs(b[0] - a[0]), d = Math.abs(b[1] - a[1]);
        const h = kind === 'slab' ? DEFAULTS.slab.thickness : DEFAULTS.box.h;
        this.mesh.visible = w > 0 && d > 0;
        this.mesh.scale.set(Math.max(w, 0.001), h, Math.max(d, 0.001));
        this.mesh.position.set((a[0] + b[0]) / 2, ctx.elev() + (kind === 'slab' ? -h / 2 : h / 2), (a[1] + b[1]) / 2);
        setLive(`${fmt(w)} × ${fmt(d)} m · ${fmt(w * d)} m²`, new THREE.Vector3((a[0] + b[0]) / 2, ctx.elev() + h + 0.1, (a[1] + b[1]) / 2));
      },
      click(p) {
        if (!this.p0) { this.p0 = [p.x, p.z]; return; }
        this.commit(this.p0, [p.x, p.z]);
      },
      commit(a, b) {
        const x0 = Math.min(a[0], b[0]), x1 = Math.max(a[0], b[0]), z0 = Math.min(a[1], b[1]), z1 = Math.max(a[1], b[1]);
        if (x1 - x0 < 0.01 || z1 - z0 < 0.01) return;
        if (kind === 'slab') {
          model.add({ type: 'slab', thickness: DEFAULTS.slab.thickness, material: DEFAULTS.slab.material, points: [[x0, z0], [x1, z0], [x1, z1], [x0, z1]] });
        } else {
          const el = model.add({ type: 'box', name: 'Volumen', x: (x0 + x1) / 2, z: (z0 + z1) / 2, w: x1 - x0, d: z1 - z0, h: DEFAULTS.box.h, rotY: 0, material: DEFAULTS.box.material });
          model.select(el.id);
        }
        this.finish();
      },
      vcbInput(nums) {
        if (!this.p0 || nums.length < 2) return ctx.toast('Escribe ancho x fondo, por ejemplo 6x4,5');
        const sx = last && last.x < this.p0[0] ? -1 : 1, sz = last && last.z < this.p0[1] ? -1 : 1;
        this.commit(this.p0, [this.p0[0] + sx * nums[0], this.p0[1] + sz * nums[1]]);
      },
      finish() { this.p0 = null; this.mesh.visible = false; setLive(null); },
    };
  }
  T.slab = rectTool('slab');
  T.box = rectTool('box');

  T.column = {
    hint: '<b>Columna</b> · clic para ubicarla (perfil I de acero por defecto; cámbialo en Propiedades)',
    start() { const d = colDims(); this.mesh = new THREE.Mesh(new THREE.BoxGeometry(d.w, model.level().height, d.d), ghostMat); overlay.add(this.mesh); },
    move(p) { this.mesh.position.set(p.x, ctx.elev() + model.level().height / 2, p.z); },
    click(p) {
      const d = colDims();
      model.add({ type: 'column', profile: d.profile, x: p.x, z: p.z, w: d.w, d: d.d, height: model.level().height, rotY: 0, material: d.material, layer: 'c_est' });
    },
  };

  function openingTool(kind) {
    return {
      hint: kind === 'door'
        ? '<b>Puerta</b> · pasa el cursor sobre un muro y haz clic · medidas en Propiedades del muro'
        : '<b>Ventana</b> · pasa el cursor sobre un muro y haz clic · ancho, alto y antepecho en Propiedades del muro',
      vcb: 'Ancho',
      start() { this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), ghostMat); this.mesh.visible = false; overlay.add(this.mesh); this.target = null; },
      hover() {
        const hit = pickWall();
        this.target = null;
        this.mesh.visible = false;
        if (!hit) return;
        const w = hit.el, f = wallFrame(w), d = DEFAULTS[kind];
        const t = (hit.point.x - w.a[0]) * f.u[0] + (hit.point.z - w.a[1]) * f.u[1];
        const L = wallLength(w);
        if (d.width > L) return;
        const tc = Math.min(L - d.width / 2, Math.max(d.width / 2, Math.round(t / ctx.grid()) * ctx.grid()));
        this.target = { w, t: tc };
        const c = f.at(tc), elev = model.level(w.level).elev;
        this.mesh.visible = true;
        this.mesh.scale.set(d.width, d.height, w.thickness + 0.06);
        this.mesh.position.set(c[0], elev + d.sill + d.height / 2, c[1]);
        this.mesh.rotation.y = -Math.atan2(f.u[1], f.u[0]);
        setLive(`${kind === 'door' ? 'Puerta' : 'Ventana'} ${fmt(d.width)} m · a ${fmt(tc - d.width / 2)} m del extremo`, new THREE.Vector3(c[0], elev + d.sill + d.height + 0.15, c[1]));
      },
      click() {
        if (!this.target) return ctx.toast('Haz clic sobre un muro');
        const { w, t } = this.target, d = DEFAULTS[kind];
        const clash = (w.openings || []).some((o) => Math.abs(o.t - t) < (o.width + d.width) / 2);
        if (clash) return ctx.toast('Se cruza con otro vano de este muro');
        model.change(() => { model.get(w.id).openings.push({ id: uid('v'), kind, t, width: d.width, height: d.height, sill: d.sill }); });
        model.select(w.id);
      },
      vcbInput(nums) { if (nums[0] > 0.2) { DEFAULTS[kind].width = nums[0]; ctx.toast(`Ancho de ${kind === 'door' ? 'puerta' : 'ventana'}: ${fmt(nums[0])} m`); } },
    };
  }
  T.door = openingTool('door');
  T.window = openingTool('window');

  // Viga de acero entre dos puntos, colgada bajo el nivel superior (cara superior a 12 cm de la losa).
  T.beam = {
    hint: '<b>Viga de acero</b> · clic en el primer apoyo y clic en el segundo · el perfil se elige en el panel',
    start() {
      this.a = null;
      this.line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), lineMat);
      this.line.renderOrder = 20;
      this.line.visible = false;
      overlay.add(this.line);
    },
    y() { return model.level().height - (PROFILES[DEFAULTS.beam.profile]?.h || 0.3) / 2 - 0.12; },
    move(p) {
      if (!this.a) return;
      const y = ctx.elev() + this.y();
      this.line.geometry.setFromPoints([new THREE.Vector3(this.a[0], y, this.a[1]), new THREE.Vector3(p.x, y, p.z)]);
      this.line.visible = true;
      setLive(`${DEFAULTS.beam.profile} · ${fmt(Math.hypot(p.x - this.a[0], p.z - this.a[1]))} m`, new THREE.Vector3((this.a[0] + p.x) / 2, y, (this.a[1] + p.z) / 2));
    },
    click(p) {
      if (!this.a) { this.a = [p.x, p.z]; return; }
      if (Math.hypot(p.x - this.a[0], p.z - this.a[1]) < 0.05) return;
      const y = this.y();
      model.add(member('viga', DEFAULTS.beam.profile, [this.a[0], y, this.a[1]], [p.x, y, p.z], { material: DEFAULTS.beam.material }));
      this.a = [p.x, p.z]; // encadena vigas como los muros
    },
    finish() { this.a = null; this.line.visible = false; setLive(null); },
  };
  T.dim = {
    hint: '<b>Cota</b> · clic en el primer punto, clic en el segundo y clic para separar la línea de cota',
    start() {
      this.pts = [];
      this.line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), lineMat);
      this.line.renderOrder = 20;
      this.line.visible = false;
      overlay.add(this.line);
    },
    move(p) {
      if (!this.pts.length) return;
      const a = this.pts[0], b = this.pts[1] || [p.x, p.z];
      let off = 0;
      if (this.pts[1]) off = this.offsetFor(p);
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-6, n = [-(b[1] - a[1]) / L, (b[0] - a[0]) / L];
      const y = ctx.elev() + 0.02;
      this.line.geometry.setFromPoints([new THREE.Vector3(a[0] + n[0] * off, y, a[1] + n[1] * off), new THREE.Vector3(b[0] + n[0] * off, y, b[1] + n[1] * off)]);
      this.line.visible = true;
      setLive(fmt(L) + ' m', new THREE.Vector3((a[0] + b[0]) / 2 + n[0] * off, y, (a[1] + b[1]) / 2 + n[1] * off));
    },
    offsetFor(p) {
      const [a, b] = this.pts, L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-6;
      return (p.x - a[0]) * -(b[1] - a[1]) / L + (p.z - a[1]) * (b[0] - a[0]) / L;
    },
    click(p) {
      if (this.pts.length < 2) { this.pts.push([p.x, p.z]); return; }
      model.add({ type: 'dim', a: this.pts[0], b: this.pts[1], offset: this.offsetFor(p), layer: 'c_cot' });
      this.finish();
    },
    finish() { this.pts = []; this.line.visible = false; setLive(null); },
  };

  // --- gestor ---
  function activate(name) {
    current?.finish?.();
    clearOverlay();
    current = T[name] ? Object.assign(T[name], { name }) : T.select;
    current.start?.();
    ctx.setHint(current.hint);
    ctx.setVCB(current.vcb || null);
  }

  function handle(ev, isClick) {
    if (!current || current === T.select) return false;
    const { sx, sy } = pointer(ev);
    if (current.hover) {
      current.hover();
      if (isClick) current.click();
      return true;
    }
    const raw = ground();
    if (!raw) { ctx.snapTag(null); return true; }
    const from = current.pts?.length ? current.pts.at(-1) : current.p0 || null;
    const s = snap(raw, from, sx, sy, ev.shiftKey);
    const p = new THREE.Vector3(s.x, ctx.elev(), s.z);
    last = p;
    marker.visible = true;
    marker.position.copy(p);
    ctx.coords(p);
    ctx.snapTag(s.kind ? { text: s.kind, x: sx, y: sy } : null);
    if (isClick) current.click(p); else current.move?.(p);
    return true;
  }

  ctx.dom.addEventListener('pointerdown', (ev) => { downAt = [ev.clientX, ev.clientY, ev.button]; });
  ctx.dom.addEventListener('pointermove', (ev) => {
    if (current && current !== T.select) handle(ev, false);
    else { pointer(ev); const g = ground(); if (g) ctx.coords(g); }
  });
  ctx.dom.addEventListener('pointerup', (ev) => {
    if (!downAt) return;
    const moved = Math.hypot(ev.clientX - downAt[0], ev.clientY - downAt[1]);
    const btn = downAt[2];
    downAt = null;
    if (moved > 5 || btn !== 0) return;
    if (current && current !== T.select) {
      if (ctx.isElevation()) return ctx.toast('Dibuja en la vista 3D o en Planta');
      handle(ev, true);
    } else {
      pointer(ev);
      ctx.pick(ray);
    }
  });
  ctx.dom.addEventListener('dblclick', () => current?.finish?.());
  ctx.dom.addEventListener('pointerleave', () => { marker.visible = false; ctx.snapTag(null); });

  return {
    activate,
    get name() { return current?.name || 'select'; },
    cancel() { current?.finish?.(); if (current?.start && current !== T.select) { clearOverlay(); current.start(); } },
    vcb(text) { current?.vcbInput?.(parseVCB(text)); },
  };
}
