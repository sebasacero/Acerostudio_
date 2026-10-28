// Geometría 2D de la planta (corte a 1,20 m): la usan el poché en pantalla y los exportadores SVG/DXF.
import { wallLength, fmt } from './model.js';
import { PROFILES, sectionOutline, memberFrame } from './steel.js';

const near = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.02;

// Prolonga medio espesor los extremos de un muro que tocan otro muro, para cerrar las esquinas.
export function wallExtents(doc, w) {
  const others = doc.elements.filter((e) => e.type === 'wall' && e.id !== w.id && e.level === w.level);
  const touches = (p) => others.some((o) => near(p, o.a) || near(p, o.b));
  return { start: touches(w.a) ? -w.thickness / 2 : 0, end: wallLength(w) + (touches(w.b) ? w.thickness / 2 : 0) };
}

export function wallFrame(w) {
  const L = wallLength(w) || 1e-6;
  const u = [(w.b[0] - w.a[0]) / L, (w.b[1] - w.a[1]) / L];
  const n = [-u[1], u[0]];
  const at = (s, o = 0) => [w.a[0] + u[0] * s + n[0] * o, w.a[1] + u[1] * s + n[1] * o];
  return { L, u, n, at };
}

// Tramos macizos del muro entre vanos, en coordenadas a lo largo del muro.
export function wallSpans(doc, w) {
  const { start, end } = wallExtents(doc, w);
  const L = wallLength(w);
  const ops = (w.openings || [])
    .map((o) => ({ ...o, s: Math.max(0, o.t - o.width / 2), e: Math.min(L, o.t + o.width / 2) }))
    .filter((o) => o.e > o.s)
    .sort((p, q) => p.s - q.s);
  const solid = [];
  let cur = start;
  for (const o of ops) {
    if (o.s > cur) solid.push([cur, o.s]);
    cur = Math.max(cur, o.e);
  }
  if (end > cur) solid.push([cur, end]);
  return { solid, openings: ops };
}

function rectPoly(cx, cz, w, d, rot = 0) {
  const c = Math.cos(rot), s = Math.sin(rot);
  return [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]]
    .map(([x, z]) => [cx + x * c - z * s, cz + x * s + z * c]);
}

// Proporciones de un IPE (ala ≈ 3,6 % y alma ≈ 2,4 % de la altura del perfil).
export const iProfile = (el) => ({ tf: Math.max(0.006, el.d * 0.036), tw: Math.max(0.004, el.d * 0.024) });

export function columnSection(el) {
  if (PROFILES[el.profile]) return PROFILES[el.profile].kg / 7850;
  if (el.profile === 'round') return Math.PI * (el.w / 2) ** 2;
  if (el.profile === 'I') { const { tf, tw } = iProfile(el); return 2 * el.w * tf + (el.d - 2 * tf) * tw; }
  return el.w * el.d;
}

export function columnPoly(el) {
  const rot = el.rotY || 0;
  if (PROFILES[el.profile]) {
    // Perfil del catálogo: el alma del HEB/IPE queda en Z (fondo), como el perfil I genérico.
    const c = Math.cos(rot), s = Math.sin(rot);
    return sectionOutline(PROFILES[el.profile], 28).map(([u, v]) => [el.x + u * c - v * s, el.z + u * s + v * c]);
  }
  if (el.profile === 'round') {
    return Array.from({ length: 28 }, (_, i) => {
      const a = (i / 28) * Math.PI * 2;
      return [el.x + Math.cos(a) * el.w / 2, el.z + Math.sin(a) * el.w / 2];
    });
  }
  if (el.profile === 'I') {
    const b = el.w / 2, h = el.d / 2, { tf, tw } = iProfile(el);
    const pts = [[-b, -h], [b, -h], [b, -h + tf], [tw / 2, -h + tf], [tw / 2, h - tf], [b, h - tf], [b, h],
      [-b, h], [-b, h - tf], [-tw / 2, h - tf], [-tw / 2, -h + tf], [-b, -h + tf]];
    const c = Math.cos(rot), s = Math.sin(rot);
    return pts.map(([x, z]) => [el.x + x * c - z * s, el.z + x * s + z * c]);
  }
  return rectPoly(el.x, el.z, el.w, el.d, rot);
}

export const boxPoly = (el) => rectPoly(el.x, el.z, el.w, el.d, el.rotY || 0);

export function dimGeometry(el) {
  const L = Math.hypot(el.b[0] - el.a[0], el.b[1] - el.a[1]) || 1e-6;
  const n = [-(el.b[1] - el.a[1]) / L, (el.b[0] - el.a[0]) / L];
  const o = el.offset || 0;
  const a2 = [el.a[0] + n[0] * o, el.a[1] + n[1] * o];
  const b2 = [el.b[0] + n[0] * o, el.b[1] + n[1] * o];
  return { a2, b2, L, n, text: fmt(L) + ' m', mid: [(a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2] };
}

export function planGeometry(doc, levelId = doc.activeLevel) {
  const visible = (e) => e.level === levelId && doc.layers.find((l) => l.id === e.layer)?.visible !== false;
  const els = doc.elements.filter(visible);
  const out = { cut: [], outline: [], lines: [], arcs: [], dims: [], texts: [] };
  for (const el of els) {
    if (el.type === 'wall') {
      const f = wallFrame(el), t = el.thickness / 2;
      const { solid, openings } = wallSpans(doc, el);
      for (const [s, e] of solid) out.cut.push({ layer: 'MUROS', pts: [f.at(s, -t), f.at(e, -t), f.at(e, t), f.at(s, t)] });
      for (const o of openings) {
        if (o.kind === 'window') {
          out.lines.push({ layer: 'VENTANAS', a: f.at(o.s, -t), b: f.at(o.e, -t) }, { layer: 'VENTANAS', a: f.at(o.s, t), b: f.at(o.e, t) });
          out.lines.push({ layer: 'VENTANAS', a: f.at(o.s, 0), b: f.at(o.e, 0) });
        } else {
          // Hoja de puerta abierta 90° hacia el lado positivo de la normal, con su arco.
          const hinge = f.at(o.s, t), tip = f.at(o.s, t + (o.e - o.s));
          out.lines.push({ layer: 'PUERTAS', a: hinge, b: tip });
          const a0 = Math.atan2(f.u[1], f.u[0]), a1 = Math.atan2(f.n[1], f.n[0]);
          out.arcs.push({ layer: 'PUERTAS', c: hinge, r: o.e - o.s, from: a0, to: a1 });
        }
      }
    } else if (el.type === 'column') out.cut.push({ layer: 'ESTRUCTURA', pts: columnPoly(el) });
    else if (el.type === 'slab') out.outline.push({ layer: 'LOSAS', pts: el.points });
    else if (el.type === 'member' && el.role !== 'parteluz') {
      // Barras en planta: contorno de su proyección (vigas por encima del corte, en capa ESTRUCTURA).
      const { u } = memberFrame(el), half = (PROFILES[el.profile]?.b ?? el.w ?? 0.1) / 2;
      const a = [el.p0[0], el.p0[2]], b = [el.p1[0], el.p1[2]];
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 0.05) {
        const o = [u[0] * half, u[2] * half];
        out.outline.push({ layer: 'ESTRUCTURA', pts: [[a[0] - o[0], a[1] - o[1]], [b[0] - o[0], b[1] - o[1]], [b[0] + o[0], b[1] + o[1]], [a[0] + o[0], a[1] + o[1]]] });
      }
    }
    else if (el.type === 'box') out.outline.push({ layer: 'MOBILIARIO', pts: boxPoly(el) });
    else if (el.type === 'dim') {
      const g = dimGeometry(el);
      out.dims.push({ layer: 'COTAS', ...g, a: el.a, b: el.b });
    }
  }
  return out;
}
