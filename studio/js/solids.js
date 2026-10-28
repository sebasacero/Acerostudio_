// Sólidos neutros del modelo (cajas y prismas) en coordenadas Z arriba, en metros.
// Es el formato de intercambio "acero-solids" que leen los conectores de Blender, SketchUp,
// 3ds Max y AutoCAD (DXF 3D): cualquier programa que sepa hacer una caja puede reconstruir el modelo.
// Convención: X este, Y norte, Z arriba. En el Studio la planta es XZ con Z al sur, así que Y = -z.
import { MATERIALS } from './palette.js';
import { wallFrame, wallSpans, columnPoly, boxPoly } from './plan.js';

const toZup = ([x, z]) => [x, -z];

export function modelSolids(doc) {
  const out = [];
  const levelOf = (id) => doc.levels.find((l) => l.id === id) || doc.levels[0];
  const visible = (e) => doc.layers.find((l) => l.id === e.layer)?.visible !== false;
  for (const el of doc.elements.filter(visible)) {
    const lvl = levelOf(el.level), elev = lvl.elev;
    const base = { element: el.id, type: el.type, level: lvl.name, name: el.name || '' };
    if (el.type === 'wall') {
      const f = wallFrame(el), H = el.height, T = el.thickness;
      const [ux, uy] = [f.u[0], -f.u[1]];
      const rotZ = Math.atan2(uy, ux);
      const piece = (s, e, z0, z1, mat, t = T, kind = 'muro') => {
        if (e - s < 1e-4 || z1 - z0 < 1e-4) return;
        const [cx, cy] = toZup(f.at((s + e) / 2));
        out.push({ ...base, kind, shape: 'box', material: mat, center: [cx, cy, elev + (z0 + z1) / 2], size: [e - s, t, z1 - z0], rotZ });
      };
      const { solid, openings } = wallSpans(doc, el);
      for (const [s, e] of solid) piece(s, e, 0, H, el.material);
      for (const o of openings) {
        const top = Math.min(H, o.sill + o.height);
        piece(o.s, o.e, 0, o.sill, el.material);
        piece(o.s, o.e, top, H, el.material);
        if (o.kind === 'window') piece(o.s, o.e, o.sill, top, 'vidrio', 0.02, 'vidrio');
      }
    } else if (el.type === 'slab') {
      out.push({ ...base, kind: 'losa', shape: 'prism', material: el.material, points: el.points.map(toZup), z: elev - el.thickness, height: el.thickness });
    } else if (el.type === 'column') {
      out.push({ ...base, kind: 'columna', shape: 'prism', material: el.material, points: columnPoly(el).map(toZup), z: elev, height: el.height });
    } else if (el.type === 'box') {
      out.push({ ...base, kind: 'volumen', shape: 'prism', material: el.material, points: boxPoly(el).map(toZup), z: elev + (el.y || 0), height: el.h });
    }
  }
  return out;
}

export function solidsDocument(doc) {
  const solids = modelSolids(doc);
  const used = [...new Set(solids.map((s) => s.material))];
  const materials = Object.fromEntries(used.map((k) => {
    const m = MATERIALS[k] || MATERIALS.concreto;
    return [k, { name: m.name, color: m.color, roughness: m.roughness, metalness: m.metalness, opacity: m.opacity ?? 1 }];
  }));
  return {
    format: 'acero-solids', version: 1, units: 'm', up: 'Z',
    project: doc.name,
    levels: doc.levels.map((l) => ({ name: l.name, elevation: l.elev, height: l.height })),
    materials, solids,
  };
}

// Vértices 3D de un sólido (para DXF 3D u otros formatos de malla).
export function solidFaces(s) {
  if (s.shape === 'box') {
    const [cx, cy, cz] = s.center, [L, T, H] = s.size, c = Math.cos(s.rotZ), n = Math.sin(s.rotZ);
    const P = (a, b, h) => [cx + a * c - b * n, cy + a * n + b * c, cz + h];
    const v = [];
    for (const h of [-H / 2, H / 2]) for (const [a, b] of [[-L / 2, -T / 2], [L / 2, -T / 2], [L / 2, T / 2], [-L / 2, T / 2]]) v.push(P(a, b, h));
    const quads = [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
    return quads.map((q) => q.map((i) => v[i]));
  }
  const pts = s.points, z0 = s.z, z1 = s.z + s.height;
  const faces = [];
  for (const tri of triangulate(pts)) {
    faces.push(tri.map((i) => [...pts[i], z1]));
    faces.push([...tri].reverse().map((i) => [...pts[i], z0]));
  }
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % pts.length];
    faces.push([[...p, z0], [...q, z0], [...q, z1], [...p, z1]]);
  });
  return faces;
}

// Triangulación por recorte de orejas (sirve para losas en L y perfiles I, que no son convexos).
export function triangulate(pts) {
  const area = pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  const idx = pts.map((_, i) => i);
  if (area < 0) idx.reverse();
  const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const inside = (p, a, b, c) => cross(a, b, p) >= 0 && cross(b, c, p) >= 0 && cross(c, a, p) >= 0;
  const tris = [];
  let guard = 0;
  while (idx.length > 3 && guard++ < 5000) {
    let cut = false;
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length];
      const a = pts[ia], b = pts[ib], c = pts[ic];
      if (cross(a, b, c) <= 1e-12) continue;
      if (idx.some((j) => j !== ia && j !== ib && j !== ic && inside(pts[j], a, b, c))) continue;
      tris.push([ia, ib, ic]);
      idx.splice(i, 1);
      cut = true;
      break;
    }
    if (!cut) break;
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]]);
  return tris;
}

// DXF 3D con caras 3DFACE por capa de material: AutoCAD, BricsCAD, Rhino y 3ds Max lo abren como sólido.
export function modelDXF3D(doc) {
  const out = ['0', 'SECTION', '2', 'ENTITIES'];
  for (const s of modelSolids(doc)) {
    const layer = `${s.kind}_${s.material}`.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    for (const f of solidFaces(s)) {
      const v = f.length === 3 ? [...f, f[2]] : f;
      out.push('0', '3DFACE', '8', layer);
      v.forEach((p, i) => out.push(String(10 + i), p[0], String(20 + i), p[1], String(30 + i), p[2]));
    }
  }
  out.push('0', 'ENDSEC', '0', 'EOF');
  return out.map((v) => (typeof v === 'number' ? v.toFixed(4) : v)).join('\n');
}
