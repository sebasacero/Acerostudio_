#!/usr/bin/env node
// Servidor MCP de AceroStudio.
// Deja que Claude (o cualquier agente con MCP) diseñe con el mismo motor del Studio web:
// crear proyectos, dibujar muros, losas, columnas y vanos, leer planos e imágenes, generar edificios,
// sacar cantidades y planos, y mandar el modelo a Blender, Revit, SketchUp, 3ds Max o AutoCAD.
// El proyecto vive en un archivo .acero.json (el mismo que abre el Studio), que se guarda en cada cambio.
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve, dirname, join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { PNG } from 'pngjs';
import jpeg from 'jpeg-js';

import { emptyDoc, uid, polygonArea, wallLength } from '../studio/js/model.js';
import { columnSection } from '../studio/js/plan.js';
import { planDXF, planSVG } from '../studio/js/drawings.js';
import { solidsDocument, modelDXF3D } from '../studio/js/solids.js';
import { detectWalls } from '../studio/js/detect.js';
import { wallsToElements, mergeGenerated, buildingFromParams } from '../studio/js/generate.js';
import { MATERIALS } from '../studio/js/palette.js';
import { SHOT_INFO, SEQUENCES, videoPrompt } from '../studio/js/prompts.js';
import { PROFILES, steelBuilding, steelTakeoff, steelForWalls, steelColumn, member, STEEL_TYPES } from '../studio/js/steel.js';
import { modelIFC } from '../studio/js/ifc.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const CONNECTORS = join(HERE, '..', 'integraciones');

let path = resolve(process.env.ACEROSTUDIO_PROJECT || 'proyecto.acero.json');
let doc = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : emptyDoc();
const save = () => writeFileSync(path, JSON.stringify(doc, null, 2));

const slug = (s) => (s || 'proyecto').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'proyecto';
const level = (id) => doc.levels.find((l) => l.id === id || l.name === id) || doc.levels.find((l) => l.id === doc.activeLevel) || doc.levels[0];
const ok = (text, data) => ({ content: [{ type: 'text', text: data === undefined ? text : `${text}\n${JSON.stringify(data, null, 2)}` }] });
const fail = (text) => ({ content: [{ type: 'text', text }], isError: true });
const r3 = (v) => +(+v).toFixed(3);

const MAT = z.enum(Object.keys(MATERIALS)).describe('Material de la biblioteca de AceroStudio');
const PT = z.tuple([z.number(), z.number()]).describe('[x, z] en metros: x hacia el este, z hacia el sur');
const NIVEL = z.string().optional().describe('Id o nombre del nivel (por defecto el nivel activo)');
const PERFIL = z.enum(Object.keys(PROFILES)).describe('Perfil de acero del catálogo: IPE (vigas), HEB (columnas), SHS (tubo cuadrado), CHS (tubo circular)');
const ACERO = z.enum(['acero_grafito', 'acero_negro', 'acero_blanco', 'acero_galvanizado', 'acero_azul', 'acero_bronce', 'acero_purpura', 'corten']).describe('Acabado del acero');

function add(el) {
  el.id = uid();
  el.level = level(el.level).id;
  el.layer ||= el.type === 'column' || el.type === 'member' ? 'c_est' : el.type === 'box' ? 'c_mob' : 'c_arq';
  doc.elements.push(el);
  save();
  return el;
}

function quantities() {
  const q = { losa_m2: 0, muro_ml: 0, muro_m2_neto: 0, concreto_m3: 0, acero_kg: 0, puertas: 0, ventanas: 0, columnas: 0 };
  for (const e of doc.elements) {
    if (e.type === 'slab') { const a = polygonArea(e.points); q.losa_m2 += a; q.concreto_m3 += a * e.thickness; }
    if (e.type === 'wall') {
      const L = wallLength(e), holes = e.openings.reduce((s, o) => s + o.width * o.height, 0);
      q.muro_ml += L; q.muro_m2_neto += L * e.height - holes;
      e.openings.forEach((o) => { if (o.kind === 'door') q.puertas++; else q.ventanas++; });
    }
    if (e.type === 'column') {
      q.columnas++;
      if (!(String(e.material).startsWith('acero') || e.material === 'corten')) q.concreto_m3 += columnSection(e) * e.height;
    }
  }
  const t = steelTakeoff(doc);
  q.acero_kg = t.kg;
  q.acero_kg_m2 = t.kgm2;
  q.cerramiento_metalico_m2 = t.cladding;
  return { ...Object.fromEntries(Object.entries(q).map(([k, v]) => [k, r3(v)])), despiece_acero: t.rows.map((r) => ({ perfil: r.perfil, piezas: r.piezas, metros: r3(r.metros), kg: r3(r.kg) })) };
}

function summary() {
  return {
    archivo: path, nombre: doc.name,
    niveles: doc.levels.map((l) => ({ id: l.id, nombre: l.name, cota: l.elev, altura: l.height, elementos: doc.elements.filter((e) => e.level === l.id).length })),
    nivel_activo: doc.activeLevel,
    elementos: doc.elements.length,
    cantidades: quantities(),
  };
}

function readImage(file) {
  const buf = readFileSync(file);
  const ext = extname(file).toLowerCase();
  if (ext === '.png') { const p = PNG.sync.read(buf); return { data: p.data, width: p.width, height: p.height }; }
  if (ext === '.jpg' || ext === '.jpeg') { const j = jpeg.decode(buf, { useTArray: true, maxMemoryUsageInMB: 1024 }); return { data: j.data, width: j.width, height: j.height }; }
  throw new Error('Formato no soportado: usa PNG o JPG');
}

// Reduce imágenes grandes (como el Studio) para que la detección sea rápida.
function downscale(img, max = 1400) {
  const s = Math.min(1, max / Math.max(img.width, img.height));
  if (s === 1) return img;
  const W = Math.round(img.width * s), H = Math.round(img.height * s), out = new Uint8ClampedArray(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const si = (Math.floor(y / s) * img.width + Math.floor(x / s)) * 4, di = (y * W + x) * 4;
    out[di] = img.data[si]; out[di + 1] = img.data[si + 1]; out[di + 2] = img.data[si + 2]; out[di + 3] = 255;
  }
  return { data: out, width: W, height: H };
}

function exportTo(format, file) {
  const lv = doc.activeLevel;
  const data = {
    json: () => JSON.stringify(doc, null, 2),
    solidos: () => JSON.stringify(solidsDocument(doc)),
    dxf: () => planDXF(doc, lv),
    dxf3d: () => modelDXF3D(doc),
    svg: () => planSVG(doc, lv),
    ifc: () => modelIFC(doc),
  }[format]();
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
  return file;
}

const server = new McpServer({ name: 'acerostudio', version: '0.2.0' });
const tool = (name, description, inputSchema, cb) => server.registerTool(name, { description, inputSchema }, async (args) => {
  try { return await cb(args); } catch (e) { return fail(`Error: ${e.message}`); }
});

tool('proyecto_nuevo', 'Crea un proyecto vacío de AceroStudio y lo guarda en un archivo .acero.json.', {
  nombre: z.string(), ruta: z.string().optional().describe('Archivo .acero.json (por defecto <nombre>.acero.json en la carpeta actual)'),
}, ({ nombre, ruta }) => {
  doc = emptyDoc(); doc.name = nombre;
  path = resolve(ruta || `${slug(nombre)}.acero.json`);
  save();
  return ok('Proyecto creado.', summary());
});

tool('proyecto_abrir', 'Abre un proyecto .acero.json existente (exportado del Studio web o creado aquí).', { ruta: z.string() }, ({ ruta }) => {
  const d = JSON.parse(readFileSync(resolve(ruta), 'utf8'));
  if (!Array.isArray(d.elements)) return fail('No es un proyecto de AceroStudio.');
  doc = Object.assign(emptyDoc(), d); path = resolve(ruta);
  return ok('Proyecto abierto.', summary());
});

tool('proyecto_resumen', 'Niveles, número de elementos y cantidades (m² de losa, muros, concreto, kg de acero, vanos).', {}, () => ok('Resumen del proyecto:', summary()));

tool('proyecto_elementos', 'Lista los elementos de un nivel con su id, tipo y medidas principales.', { nivel: NIVEL }, ({ nivel }) => {
  const l = level(nivel);
  return ok(`Elementos de ${l.name}:`, doc.elements.filter((e) => e.level === l.id).map((e) => {
    if (e.type === 'wall') return { id: e.id, tipo: 'muro', desde: e.a, hasta: e.b, largo: r3(wallLength(e)), espesor: e.thickness, altura: e.height, vanos: e.openings.length };
    if (e.type === 'slab') return { id: e.id, tipo: 'losa', area: r3(polygonArea(e.points)) };
    return { id: e.id, tipo: e.type, x: e.x, z: e.z, nombre: e.name };
  }));
});

tool('agregar_nivel', 'Agrega un nivel (piso) encima del más alto, o en la cota indicada.', {
  nombre: z.string().optional(), cota: z.number().optional(), altura: z.number().default(3), copiar_de: NIVEL.describe('Si se indica, copia muros, losas y columnas de ese nivel'),
}, ({ nombre, cota, altura, copiar_de }) => {
  const top = doc.levels.reduce((a, b) => (b.elev > a.elev ? b : a));
  const l = { id: uid('n'), name: nombre || `Piso ${doc.levels.length + 1}`, elev: cota ?? r3(top.elev + top.height), height: altura };
  doc.levels.push(l);
  if (copiar_de) {
    const src = level(copiar_de).id;
    doc.elements.filter((e) => e.level === src && e.type !== 'import' && e.type !== 'dim').forEach((e) => {
      const c = JSON.parse(JSON.stringify(e)); c.id = uid(); c.level = l.id; (c.openings || []).forEach((o) => { o.id = uid('v'); });
      doc.elements.push(c);
    });
  }
  doc.activeLevel = l.id;
  save();
  return ok('Nivel creado y activo.', l);
});

tool('agregar_muro', 'Dibuja un muro recto por su eje. Para cerrar esquinas, termina un muro donde empieza el siguiente.', {
  desde: PT, hasta: PT, altura: z.number().default(3), espesor: z.number().default(0.15), material: MAT.default('yeso'), nivel: NIVEL,
}, ({ desde, hasta, altura, espesor, material, nivel }) => {
  const el = add({ type: 'wall', a: desde, b: hasta, height: altura, thickness: espesor, material, openings: [], level: nivel });
  return ok(`Muro ${el.id} de ${r3(wallLength(el))} m.`);
});

tool('agregar_vano', 'Abre una puerta o ventana en un muro existente.', {
  muro: z.string().describe('Id del muro'), tipo: z.enum(['puerta', 'ventana']),
  distancia: z.number().describe('Distancia en metros desde el inicio del muro hasta el centro del vano'),
  ancho: z.number().default(0.9), alto: z.number().optional(), antepecho: z.number().optional(),
}, ({ muro, tipo, distancia, ancho, alto, antepecho }) => {
  const w = doc.elements.find((e) => e.id === muro && e.type === 'wall');
  if (!w) return fail('No existe ese muro.');
  const door = tipo === 'puerta';
  const o = { id: uid('v'), kind: door ? 'door' : 'window', t: distancia, width: ancho, height: alto ?? (door ? 2.1 : 1.4), sill: antepecho ?? (door ? 0 : 0.9) };
  w.openings.push(o); save();
  return ok(`${door ? 'Puerta' : 'Ventana'} ${o.id} en el muro ${muro}.`);
});

tool('agregar_losa', 'Losa o piso a partir de su contorno en planta (cualquier polígono).', {
  puntos: z.array(PT).min(3), espesor: z.number().default(0.15), material: MAT.default('concreto'), nivel: NIVEL,
}, ({ puntos, espesor, material, nivel }) => {
  const el = add({ type: 'slab', points: puntos, thickness: espesor, material, level: nivel });
  return ok(`Losa ${el.id} de ${r3(polygonArea(puntos))} m².`);
});

tool('agregar_columna', 'Columna de acero con perfil de catálogo (HEB, tubo cuadrado o circular). Para concreto usa perfil "rect" o "round" con material concreto.', {
  x: z.number(), z: z.number(), perfil: z.union([PERFIL, z.enum(['rect', 'round'])]).default('HEB240'), ancho: z.number().default(0.3), fondo: z.number().default(0.3),
  altura: z.number().optional().describe('Por defecto la altura del nivel'), material: MAT.default('acero_grafito'), rotacion_grados: z.number().default(0), nivel: NIVEL,
}, (a) => {
  const h = a.altura ?? level(a.nivel).height;
  const base = PROFILES[a.perfil] ? steelColumn(a.perfil, a.x, a.z, h) : { type: 'column', x: a.x, z: a.z, profile: a.perfil, w: a.ancho, d: a.fondo, height: h };
  const el = add({ ...base, material: a.material, rotY: (a.rotacion_grados * Math.PI) / 180, level: a.nivel });
  return ok(`Columna ${el.id} (${el.profile}).`);
});

tool('agregar_viga', 'Viga, diagonal o barra de acero entre dos puntos 3D. y es la altura del eje sobre la cota del nivel; si se omite, la viga queda bajo la losa del nivel de arriba.', {
  desde: z.array(z.number()).min(2).max(3).describe('[x, z] o [x, y, z] en metros'), hasta: z.array(z.number()).min(2).max(3),
  perfil: PERFIL.default('IPE300'), funcion: z.enum(['viga', 'vigueta', 'diagonal', 'cordon', 'montante', 'correa']).default('viga'),
  material: ACERO.default('acero_grafito'), nivel: NIVEL,
}, (a) => {
  const l = level(a.nivel), y = l.height - PROFILES[a.perfil].h / 2 - 0.12;
  const p3 = (p) => (p.length === 3 ? p : [p[0], y, p[1]]);
  const el = add({ ...member(a.funcion, a.perfil, p3(a.desde), p3(a.hasta)), material: a.material, level: a.nivel });
  return ok(`${a.funcion} ${el.id} ${a.perfil}.`);
});

tool('generar_estructura_acero', 'Sistema por defecto de AceroStudio: genera un proyecto completo en acero (columnas HEB, vigas IPE, viguetas, arriostramientos, cerchas, losa sobre steel deck, muro cortina) y devuelve toneladas y despiece. Reemplaza el proyecto actual.', {
  tipo: z.enum(Object.keys(STEEL_TYPES)).default('edificio').describe(Object.entries(STEEL_TYPES).map(([k, v]) => `${k}: ${v}`).join(' · ')),
  nombre: z.string().optional(),
  luz_frente: z.number().optional().describe('edificio/casa: luz entre columnas al frente (m)'), crujias_frente: z.number().int().optional(),
  luz_fondo: z.number().optional(), crujias_fondo: z.number().int().optional(),
  pisos: z.number().int().optional(), altura_piso: z.number().optional(), altura_planta_baja: z.number().optional(),
  voladizo: z.number().optional().describe('edificio/casa: voladizo al frente desde el segundo piso (m)'),
  fachada: z.enum(['cortina', 'celosia']).optional(), arriostramiento: z.boolean().optional(), terraza: z.boolean().optional(),
  luz_nave: z.number().optional().describe('nave: luz libre (m)'), largo: z.number().optional().describe('nave: largo (m)'),
  altura_alero: z.number().optional(), cerchas: z.boolean().optional().describe('nave: cerchas tubulares (true) o vigas IPE (false)'),
  frente: z.number().optional().describe('pabellón'), fondo: z.number().optional().describe('pabellón'), altura: z.number().optional().describe('pabellón'), alero: z.number().optional().describe('pabellón: voladizo de la cubierta'),
  acabado: ACERO.optional(),
}, (a) => {
  const P = { tipo: a.tipo, name: a.nombre, spanX: a.luz_frente, baysX: a.crujias_frente, spanZ: a.luz_fondo, baysZ: a.crujias_fondo, floors: a.pisos,
    floorHeight: a.altura_piso, groundHeight: a.altura_planta_baja, cantilever: a.voladizo, facade: a.fachada, bracing: a.arriostramiento, rooftop: a.terraza,
    span: a.luz_nave, length: a.largo, eave: a.altura_alero, truss: a.cerchas, width: a.frente, depth: a.fondo, height: a.altura, overhang: a.alero, steel: a.acabado };
  Object.keys(P).forEach((k) => P[k] === undefined && delete P[k]);
  const keepPath = path;
  doc = steelBuilding(P);
  path = keepPath; save();
  const t = steelTakeoff(doc);
  return ok(`${doc.name}: ${r3(t.kg / 1000)} t de acero, ${r3(t.area)} m², ${r3(t.kgm2)} kg/m² (predimensionamiento orientativo).`, summary());
});

tool('agregar_volumen', 'Volumen o mueble (caja) centrado en x, z.', {
  x: z.number(), z: z.number(), ancho: z.number(), fondo: z.number(), alto: z.number(), elevacion: z.number().default(0),
  material: MAT.default('roble'), nombre: z.string().optional(), rotacion_grados: z.number().default(0), nivel: NIVEL,
}, (a) => {
  const el = add({ type: 'box', x: a.x, z: a.z, w: a.ancho, d: a.fondo, h: a.alto, y: a.elevacion, material: a.material, name: a.nombre, rotY: (a.rotacion_grados * Math.PI) / 180, level: a.nivel });
  return ok(`Volumen ${el.id}.`);
});

tool('eliminar_elemento', 'Elimina un elemento por su id.', { id: z.string() }, ({ id }) => {
  const n = doc.elements.length;
  doc.elements = doc.elements.filter((e) => e.id !== id);
  save();
  return n === doc.elements.length ? fail('No existe ese elemento.') : ok('Eliminado.');
});

const VOL = z.object({
  x: z.number(), z: z.number(), width: z.number(), depth: z.number(), floors: z.number().int(),
  bays: z.number().int().optional(), wallMaterial: MAT.optional(), groundGlass: z.boolean().optional(),
});
tool('generar_edificio', 'Volumetría con muros de fachada y ventanas (estudio de masa). Para el sistema por defecto de AceroStudio (estructura en acero) usa generar_estructura_acero. Reemplaza el proyecto actual.', {
  nombre: z.string().default('Edificio generado'),
  frente: z.number().default(6), fondo: z.number().default(12), pisos: z.number().int().default(4), altura_piso: z.number().default(3.2),
  ventanas_por_piso: z.number().int().default(2), ancho_ventana: z.number().default(1.6), alto_ventana: z.number().default(2.2),
  material_fachada: MAT.default('roble'), primer_piso_vitrina: z.boolean().default(true), estructura: z.enum(['acero', 'none']).default('acero'),
  volumenes: z.array(VOL).optional().describe('Varios cuerpos o torres; x, z = esquina noroeste. Si se da, reemplaza frente/fondo/pisos.'),
}, (a) => {
  const keepPath = path;
  doc = buildingFromParams({
    name: a.nombre, width: a.frente, depth: a.fondo, floors: a.pisos, floorHeight: a.altura_piso, bays: a.ventanas_por_piso,
    windowWidth: a.ancho_ventana, windowHeight: a.alto_ventana, wallMaterial: a.material_fachada, groundGlass: a.primer_piso_vitrina,
    structure: a.estructura, volumes: a.volumenes,
  });
  path = keepPath; save();
  return ok('Edificio generado.', summary());
});

tool('plano_a_modelo', 'Lee la imagen de un plano o un boceto (PNG o JPG) y levanta los muros con sus puertas y ventanas.', {
  imagen: z.string().describe('Ruta del PNG o JPG'),
  ancho_m: z.number().optional().describe('Ancho real del dibujo en metros (si no, se estima con el espesor de muro)'),
  modo: z.enum(['auto', 'plano', 'boceto']).default('auto'), sensibilidad: z.number().min(0).max(1).default(0.5),
  pisos: z.number().int().default(1), altura: z.number().default(3), material: MAT.default('yeso'), reemplazar: z.boolean().default(true),
  estructura_acero: z.boolean().default(true).describe('Columnas HEB en esquinas y cruces, vigas IPE sobre los muros'),
}, (a) => {
  const det = detectWalls(downscale(readImage(resolve(a.imagen))), { mode: a.modo, sensitivity: a.sensibilidad, widthM: a.ancho_m || null });
  if (!det.walls.length) return fail('No encontré muros: prueba otra sensibilidad o el modo boceto.');
  const gen = wallsToElements(det, { height: a.altura, floors: a.pisos, material: a.material });
  mergeGenerated(doc, gen, { replace: a.reemplazar });
  if (a.estructura_acero) doc.elements.push(...steelForWalls({ ...doc, elements: gen.elements }));
  if (a.reemplazar) doc.name = `Modelo en acero desde ${basename(a.imagen)}`;
  save();
  return ok(`Detecté ${det.walls.length} muros y ${det.walls.reduce((s, w) => s + w.openings.length, 0)} vanos (${det.mode}), ${r3(det.width)} × ${r3(det.depth)} m${a.ancho_m ? '' : ', escala estimada'}.`, summary());
});

tool('exportar', 'Exporta el proyecto: ifc (IFC4 BIM: Revit, ArchiCAD, Tekla, con columnas y vigas de acero con perfil real), json (Studio), solidos (Blender/SketchUp/3ds Max), dxf (planta 2D del nivel activo), dxf3d (modelo 3D), svg (planta 1:100).', {
  formato: z.enum(['ifc', 'json', 'solidos', 'dxf', 'dxf3d', 'svg']), ruta: z.string().optional(),
}, ({ formato, ruta }) => {
  const ext = { ifc: '.ifc', json: '.acero.json', solidos: '.acero-solids.json', dxf: '-planta.dxf', dxf3d: '-3d.dxf', svg: '-planta.svg' }[formato];
  return ok(`Exportado: ${exportTo(formato, resolve(ruta || `${slug(doc.name)}${ext}`))}`);
});

function findBlender(custom) {
  for (const c of [custom, process.env.BLENDER, 'blender', '/Applications/Blender.app/Contents/MacOS/Blender', 'C:\\Program Files\\Blender Foundation\\Blender 4.2\\blender.exe']) {
    if (!c) continue;
    const r = spawnSync(c, ['--version'], { encoding: 'utf8' });
    if (r.status === 0) return c;
  }
  return null;
}

tool('enviar_a', 'Prepara el modelo para otro programa: escribe los archivos y el conector en una carpeta. Con Blender instalado, además crea el .blend (y un render si se pide) sin abrir la interfaz.', {
  programa: z.enum(['blender', 'revit', 'sketchup', '3dsmax', 'autocad']),
  carpeta: z.string().optional().describe('Carpeta de salida (por defecto ./<proyecto>-<programa>)'),
  render: z.boolean().default(false).describe('Solo Blender: render fotorrealista con Cycles (escena comercial: cielo, entorno, cámara con perspectiva de dos puntos)'),
  ambiente: z.enum(['dorada', 'mediodia', 'azul']).default('dorada').describe('Solo Blender: hora dorada, mediodía u hora azul con interiores encendidos'),
  toma: z.enum(['heroe', 'frontal', 'aerea']).default('heroe'), muestras: z.number().int().default(96), resolucion: z.enum(['1080', '1440', '2160']).default('1080'),
  blender_ruta: z.string().optional(),
}, ({ programa, carpeta, render, ambiente, toma, muestras, resolucion, blender_ruta }) => {
  const out = resolve(carpeta || `${slug(doc.name)}-${programa}`);
  mkdirSync(out, { recursive: true });
  const base = join(out, slug(doc.name));
  const files = [];
  const copy = (rel) => { const dst = join(out, basename(rel)); copyFileSync(join(CONNECTORS, rel), dst); files.push(dst); };
  let steps = '';
  if (programa === 'revit') {
    files.push(exportTo('ifc', `${base}.ifc`), exportTo('json', `${base}.acero.json`), exportTo('dxf', `${base}-planta.dxf`));
    copy('revit/acerostudio_revit.py');
    steps = 'En Revit: Archivo › Abrir › IFC (o Insertar › Vincular IFC) con el .ifc: columnas, vigas y barras de acero entran como estructura con su perfil. Alternativa nativa: pyRevit o RevitPythonShell con acerostudio_revit.py y el .acero.json (niveles, muros, losas, columnas, vigas y vanos).';
  } else if (programa === 'autocad') {
    files.push(exportTo('dxf', `${base}-planta.dxf`), exportTo('dxf3d', `${base}-3d.dxf`));
    steps = 'Abre los DXF en AutoCAD (ABRIR o INSERTAR). La planta trae capas MUROS, PUERTAS, VENTANAS, ESTRUCTURA y COTAS; el 3D trae caras por material.';
  } else {
    files.push(exportTo('solidos', `${base}.acero-solids.json`));
    copy({ blender: 'blender/acerostudio_blender.py', sketchup: 'sketchup/acerostudio_sketchup.rb', '3dsmax': '3dsmax/acerostudio_3dsmax.py' }[programa]);
    steps = {
      blender: 'En Blender: Scripting › abrir acerostudio_blender.py › Ejecutar, o instálalo como complemento (Archivo › Importar › AceroStudio).',
      sketchup: 'En SketchUp: Ventana › Consola de Ruby › load "ruta/acerostudio_sketchup.rb"; queda en Extensiones › AceroStudio.',
      '3dsmax': 'En 3ds Max: Scripting › Run Script… › acerostudio_3dsmax.py y elige el .acero-solids.json.',
    }[programa];
    if (programa === 'blender') {
      const bin = findBlender(blender_ruta);
      if (bin) {
        const args = ['-b', '-P', join(CONNECTORS, 'blender/acerostudio_blender.py'), '--', `${base}.acero-solids.json`, `${base}.blend`];
        if (render) args.push(`${base}-render.png`, '--cycles', `--ambiente=${ambiente}`, `--toma=${toma}`, `--muestras=${muestras}`, `--resolucion=${resolucion}`);
        const r = spawnSync(bin, args, { encoding: 'utf8', timeout: 15 * 60 * 1000 });
        if (r.status === 0) { files.push(`${base}.blend`); if (render) files.push(`${base}-render.png`); steps = `Blender creó ${base}.blend${render ? ' y el render' : ''}. ${steps}`; }
        else steps = `Blender falló (${(r.stderr || '').slice(-400)}). ${steps}`;
      } else steps = `No encontré Blender en este equipo (define BLENDER o blender_ruta para generar el .blend automáticamente). ${steps}`;
    }
  }
  return ok(steps, { carpeta: out, archivos: files });
});

tool('prompt_video', 'Prompt en inglés para un generador de video con IA (Higgsfield, Kling, Runway, Veo) basado en el modelo y la toma de cámara.', {
  toma: z.enum([...Object.keys(SEQUENCES), ...Object.keys(SHOT_INFO)]).default('reel'), formato: z.enum(['16:9', '9:16', '1:1']).default('9:16'),
}, ({ toma, formato }) => ok(videoPrompt(doc, toma, formato)));

await server.connect(new StdioServerTransport());
