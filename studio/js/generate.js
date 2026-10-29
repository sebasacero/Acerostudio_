// Generadores de modelo: muros detectados (plano/boceto) → elementos, y edificio paramétrico
// (lo que devuelve la IA al leer una foto de fachada, o lo que el usuario llena a mano).
import { emptyDoc, uid } from './model.js';
import { steelColumn, columnFor } from './steel.js';

const r3 = (v) => +(+v).toFixed(3);

// Muros detectados (detect.js o la IA) → niveles y elementos listos para el proyecto.
export function wallsToElements(det, opts = {}) {
  const o = { height: 3, floors: 1, material: 'yeso', slab: true, slabMaterial: 'concreto', elev: 0, levelPrefix: 'Piso', origin: [0, 0], ...opts };
  const levels = [], elements = [];
  for (let f = 0; f < o.floors; f++) {
    const id = uid('n');
    levels.push({ id, name: `${o.levelPrefix} ${f + 1}`, elev: r3(o.elev + f * o.height), height: o.height });
    const mv = (p) => [r3(p[0] + o.origin[0]), r3(p[1] + o.origin[1])];
    if (o.slab && det.width > 0 && det.depth > 0) {
      elements.push({ id: uid(), type: 'slab', level: id, layer: 'c_arq', material: o.slabMaterial, thickness: 0.15,
        points: [[0, 0], [det.width, 0], [det.width, det.depth], [0, det.depth]].map(mv) });
    }
    for (const w of det.walls) {
      elements.push({
        id: uid(), type: 'wall', level: id, layer: 'c_arq', material: w.material || o.material,
        a: mv(w.a), b: mv(w.b), height: o.height, thickness: w.thickness || 0.15,
        openings: (w.openings || []).filter((op) => f === 0 || op.kind === 'window').map((op) => opening(op, o.height)),
      });
    }
  }
  return { levels, elements };
}

function opening(op, H) {
  const door = op.kind === 'door';
  const height = op.height ?? (door ? 2.1 : Math.min(1.5, H - 1.2));
  const sill = op.sill ?? (door ? 0 : 0.9);
  return { id: uid('v'), kind: door ? 'door' : 'window', t: r3(op.t), width: r3(op.width), height: r3(Math.min(height, H - sill - 0.05)), sill: r3(sill) };
}

// Añade lo generado a un proyecto (o lo reemplaza) dejando activo el primer nivel nuevo.
export function mergeGenerated(doc, gen, { replace = false } = {}) {
  if (replace) {
    doc.levels = gen.levels;
    doc.elements = gen.elements;
    doc.activeLevel = gen.levels[0]?.id || doc.activeLevel;
    return doc;
  }
  // Sin reemplazar: cada piso nuevo cae en el nivel existente de la misma cota, si lo hay.
  const map = {};
  for (const l of gen.levels) {
    const same = doc.levels.find((x) => Math.abs(x.elev - l.elev) < 0.01);
    if (same) map[l.id] = same.id; else doc.levels.push(l);
  }
  doc.elements.push(...gen.elements.map((e) => ({ ...e, level: map[e.level] || e.level })));
  doc.activeLevel = map[gen.levels[0]?.id] || gen.levels[0]?.id || doc.activeLevel;
  return doc;
}

export const BUILDING_DEFAULTS = {
  name: 'Edificio generado',
  width: 6, depth: 12, floors: 4, floorHeight: 3.2,
  wallThickness: 0.25, wallMaterial: 'roble', slabMaterial: 'concreto',
  bays: 2, windowWidth: 1.6, windowHeight: 2.2, sill: 0.3,
  groundGlass: true, backWindows: true, sideWindows: 0,
  structure: 'acero', roof: true,
};

// Edificio por volúmenes (torres). Cada volumen hereda los valores generales y puede cambiarlos:
// { x, z, width, depth, floors, bays, wallMaterial, ... } con x, z = esquina noroeste en metros.
export function buildingFromParams(params = {}) {
  const P = { ...BUILDING_DEFAULTS, ...params };
  const volumes = (P.volumes?.length ? P.volumes : [{ x: 0, z: 0 }]).map((v) => ({ ...P, ...v, volumes: undefined }));
  const fh = P.floorHeight;
  const nLevels = Math.max(...volumes.map((v) => v.floors));
  const doc = emptyDoc();
  doc.name = P.name;
  doc.levels = Array.from({ length: nLevels }, (_, i) => ({ id: i ? uid('n') : 'n0', name: i ? `Piso ${i + 1}` : 'Piso 1', elev: r3(i * fh), height: fh }));
  doc.activeLevel = 'n0';
  for (const v of volumes) {
    const x0 = v.x || 0, z0 = v.z || 0, x1 = x0 + v.width, z1 = z0 + v.depth;
    for (let f = 0; f < v.floors; f++) {
      const lvl = doc.levels[f].id;
      const el = (o) => doc.elements.push({ id: uid(), level: lvl, layer: 'c_arq', ...o });
      el({ type: 'slab', material: v.slabMaterial, thickness: 0.2, points: [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map((p) => p.map(r3)) });
      const wall = (a, b, ops) => el({ type: 'wall', material: v.wallMaterial, a: a.map(r3), b: b.map(r3), height: fh, thickness: v.wallThickness, openings: ops });
      const front = facadeOpenings(v.width, v.bays, v, f === 0 && v.groundGlass ? 'shop' : f === 0 ? 'entry' : 'upper', fh);
      wall([x0, z1], [x1, z1], front); // frente a la calle (sur)
      wall([x1, z1], [x1, z0], spaced(v.depth, v.sideWindows, v, fh));
      wall([x1, z0], [x0, z0], v.backWindows ? spaced(v.width, v.bays, v, fh) : []);
      wall([x0, z0], [x0, z1], spaced(v.depth, v.sideWindows, v, fh));
      if (v.structure === 'acero' && v.depth > 7) {
        const n = Math.ceil(v.depth / 6);
        for (let k = 1; k < n; k++) {
          el(steelColumn(columnFor(v.floors), (x0 + x1) / 2, z0 + (v.depth * k) / n, fh));
        }
      }
    }
    if (v.roof) {
      doc.elements.push({ id: uid(), type: 'box', level: doc.levels[v.floors - 1].id, layer: 'c_arq', material: 'concreto', name: 'Cubierta',
        x: r3((x0 + x1) / 2), z: r3((z0 + z1) / 2), w: r3(v.width + 0.1), d: r3(v.depth + 0.1), h: 0.22, y: fh, rotY: 0 });
    }
  }
  return doc;
}

function spaced(L, n, v, H) {
  if (!n) return [];
  const w = Math.min(v.windowWidth, L / n - 0.4);
  if (w < 0.5) return [];
  return Array.from({ length: n }, (_, i) => opening({ kind: 'window', t: (L * (i + 0.5)) / n, width: w, height: v.windowHeight, sill: v.sill + 0.5 }, H));
}

function facadeOpenings(L, n, v, mode, H) {
  const bay = L / Math.max(1, n);
  const w = Math.max(0.6, Math.min(v.windowWidth, bay - 0.3));
  if (mode !== 'upper' && n <= 1) {
    // Fachada angosta: puerta a un lado y, si es vitrina, vidrio en el resto del frente.
    const door = opening({ kind: 'door', t: 0.75, width: 1.0, height: 2.4 }, H);
    const rest = L - 1.25 - 0.3;
    if (mode === 'shop' && rest >= 0.8) return [door, opening({ kind: 'window', t: 1.25 + rest / 2, width: rest, height: H - 0.6, sill: 0.1 }, H)];
    return rest >= 0.8 ? [door, opening({ kind: 'window', t: 1.25 + rest / 2, width: Math.min(rest, v.windowWidth), height: v.windowHeight, sill: v.sill + 0.5 }, H)] : [door];
  }
  return Array.from({ length: Math.max(1, n) }, (_, i) => {
    const t = bay * (i + 0.5);
    if (mode !== 'upper' && i === 0) return opening({ kind: 'door', t, width: Math.min(1.2, w), height: 2.4 }, H);
    if (mode === 'shop') return opening({ kind: 'window', t, width: w, height: H - 0.6, sill: 0.1 }, H);
    return opening({ kind: 'window', t, width: w, height: v.windowHeight, sill: v.sill }, H);
  });
}

// Respuestas de la función de visión (supabase/functions/vision-arquitectura) → formatos de arriba.
export function aiPlanToDetection(r) {
  return {
    width: r.ancho_m, depth: r.fondo_m, mode: 'ia',
    walls: r.muros.map((m) => ({
      a: [m.x1, m.z1], b: [m.x2, m.z2], thickness: m.espesor || 0.15,
      openings: m.vanos.map((v) => ({ kind: v.tipo === 'puerta' ? 'door' : 'window', t: v.centro_desde_inicio, width: v.ancho })),
    })),
  };
}

export function aiFacadeToParams(r) {
  return {
    name: r.nombre || 'Edificio desde foto',
    floorHeight: r.altura_piso || 3.2,
    volumes: r.volumenes.map((v) => ({
      x: v.x, z: v.z, width: v.ancho, depth: v.fondo, floors: Math.max(1, Math.round(v.pisos)), bays: Math.max(1, Math.round(v.crujias)),
      windowWidth: v.ancho_ventana, windowHeight: v.alto_ventana, sill: v.antepecho, groundGlass: v.primer_piso_vidriado, wallMaterial: v.material,
    })),
  };
}
