// Exportador IFC4 (STEP) de AceroStudio: lo abren Revit, ArchiCAD, Tekla, BIMcollab, Solibri y cualquier
// visor BIM. Las columnas, vigas y barras de acero salen como IfcColumn / IfcBeam / IfcMember con su perfil
// paramétrico real (IfcIShapeProfileDef, tubos huecos), material "Acero estructural S355", peso y perfil en
// propiedades; losas, muros, vidrios y volúmenes salen como IfcSlab, IfcWall, IfcPlate y proxies.
// En Revit: Archivo › Abrir › IFC (o Insertar › Vincular IFC) y las vigas y columnas entran como estructura.
import { MATERIALS } from './palette.js';
import { PROFILES, profileOf, memberFrame, memberKg, profileLabel } from './steel.js';
import { modelSolids } from './solids.js';

const B64 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$';
function guid(rand) {
  let s = B64[Math.floor(rand() * 4)];
  for (let i = 0; i < 21; i++) s += B64[Math.floor(rand() * 64)];
  return s;
}
function seeded(str) {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
}
// Texto IFC: comillas dobladas y caracteres no ASCII como \X2\hhhh\X0\.
const str = (t) => (t == null ? '$' : `'${String(t).replace(/'/g, "''").replace(/\\/g, '\\\\').replace(/[^\x20-\x7e]+/g, (m) => `\\X2\\${[...m].map((c) => c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')).join('')}\\X0\\`)}'`);
const num = (n) => { const v = Math.abs(n) < 1e-9 ? 0 : +n; const t = Number.isInteger(v) ? `${v}.` : String(+v.toFixed(6)); return t.includes('.') || t.includes('E') ? t : `${t}.`; };
const vec = (a) => `(${a.map(num).join(',')})`;
const toIfc = ([x, y, z]) => [x, -z, y]; // Studio (Y arriba, Z sur) → IFC (Z arriba, Y norte)

const ROLE = {
  viga: ['IFCBEAM', '.BEAM.'], vigueta: ['IFCBEAM', '.JOIST.'], diagonal: ['IFCMEMBER', '.BRACE.'], cordon: ['IFCMEMBER', '.CHORD.'],
  baranda: ['IFCRAILING', '.HANDRAIL.'], montante: ['IFCMEMBER', '.STUD.'], correa: ['IFCMEMBER', '.PURLIN.'], parteluz: ['IFCMEMBER', '.MULLION.'], lamina: ['IFCPLATE', '.SHEET.'],
};

export function modelIFC(doc, { date = new Date() } = {}) {
  const rand = seeded(doc.name + doc.elements.length);
  const lines = [];
  let n = 0;
  const E = (s) => { lines.push(`#${++n}=${s};`); return `#${n}`; };
  const G = () => str(guid(rand));

  // Contexto, unidades y estructura espacial.
  const origin = E(`IFCCARTESIANPOINT(${vec([0, 0, 0])})`), zDir = E(`IFCDIRECTION(${vec([0, 0, 1])})`), xDir = E(`IFCDIRECTION(${vec([1, 0, 0])})`);
  const world = E(`IFCAXIS2PLACEMENT3D(${origin},${zDir},${xDir})`);
  const ctx = E(`IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.E-05,${world},$)`);
  const body = E(`IFCGEOMETRICREPRESENTATIONSUBCONTEXT('Body','Model',*,*,*,*,${ctx},$,.MODEL_VIEW.,$)`);
  const units = E(`IFCUNITASSIGNMENT((${[
    E('IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.)'), E('IFCSIUNIT(*,.AREAUNIT.,$,.SQUARE_METRE.)'),
    E('IFCSIUNIT(*,.VOLUMEUNIT.,$,.CUBIC_METRE.)'), E('IFCSIUNIT(*,.PLANEANGLEUNIT.,$,.RADIAN.)'), E('IFCSIUNIT(*,.MASSUNIT.,.KILO.,.GRAM.)'),
  ].join(',')}))`);
  const project = E(`IFCPROJECT(${G()},$,${str(doc.name)},${str('Modelado en AceroStudio · estructura en acero')},$,$,$,(${ctx}),${units})`);
  const place = (rel, p = [0, 0, 0], axis = null, ref = null) => {
    const pt = E(`IFCCARTESIANPOINT(${vec(p)})`);
    const ax = E(`IFCAXIS2PLACEMENT3D(${pt},${axis ? E(`IFCDIRECTION(${vec(axis)})`) : '$'},${ref ? E(`IFCDIRECTION(${vec(ref)})`) : '$'})`);
    return E(`IFCLOCALPLACEMENT(${rel},${ax})`);
  };
  const sitePl = place('$');
  const site = E(`IFCSITE(${G()},$,'Lote',$,$,${sitePl},$,$,.ELEMENT.,$,$,$,$,$)`);
  const bldPl = place(sitePl);
  const building = E(`IFCBUILDING(${G()},$,${str(doc.name)},$,$,${bldPl},$,$,.ELEMENT.,$,$,$)`);
  E(`IFCRELAGGREGATES(${G()},$,$,$,${project},(${site}))`);
  E(`IFCRELAGGREGATES(${G()},$,$,$,${site},(${building}))`);
  const storeys = {}, contents = {};
  for (const l of [...doc.levels].sort((a, b) => a.elev - b.elev)) {
    const pl = place(bldPl, [0, 0, l.elev]);
    storeys[l.id] = { id: E(`IFCBUILDINGSTOREY(${G()},$,${str(l.name)},$,$,${pl},$,$,.ELEMENT.,${num(l.elev)})`), pl, elev: l.elev };
    contents[l.id] = [];
  }
  E(`IFCRELAGGREGATES(${G()},$,$,$,${building},(${Object.values(storeys).map((s) => s.id).join(',')}))`);

  // Materiales (con color para los visores) y estilos por material.
  const mats = {}, styles = {};
  const matFor = (key = 'concreto') => {
    if (mats[key]) return mats[key];
    const m = MATERIALS[key] || MATERIALS.concreto;
    const steel = key.startsWith('acero') || key === 'corten' || key === 'panel_metalico';
    const name = steel && key !== 'panel_metalico' ? `Acero estructural S355 · ${m.name}` : m.name;
    mats[key] = { id: E(`IFCMATERIAL(${str(name)},$,${str(steel ? 'Steel' : key === 'vidrio' ? 'Glass' : key.includes('losa') || key === 'concreto' ? 'Concrete' : 'Other')})`), els: [] };
    const h = m.color.replace('#', ''), rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    const col = E(`IFCCOLOURRGB($,${rgb.map(num).join(',')})`);
    styles[key] = E(`IFCSURFACESTYLE(${str(m.name)},.BOTH.,(${E(`IFCSURFACESTYLESHADING(${col},${num(1 - (m.opacity ?? 1))})`)}))`);
    return mats[key];
  };
  const shape = (solid, key) => {
    matFor(key);
    E(`IFCSTYLEDITEM(${solid},(${styles[key]}),$)`);
    const rep = E(`IFCSHAPEREPRESENTATION(${body},'Body','SweptSolid',(${solid}))`);
    return E(`IFCPRODUCTDEFINITIONSHAPE($,$,(${rep}))`);
  };
  const extrude = (profile, depth) => E(`IFCEXTRUDEDAREASOLID(${profile},$,${zDir},${num(depth)})`);
  const polyProfile = (pts, name = null) => {
    const ps = pts.map((p) => E(`IFCCARTESIANPOINT(${vec(p)})`));
    return E(`IFCARBITRARYCLOSEDPROFILEDEF(.AREA.,${str(name)},${E(`IFCPOLYLINE((${[...ps, ps[0]].join(',')}))`)})`);
  };
  const profileDef = (key, p) => {
    if (p.shape === 'I') return E(`IFCISHAPEPROFILEDEF(.AREA.,${str(key)},$,${num(p.b)},${num(p.h)},${num(p.tw)},${num(p.tf)},$,$,$)`);
    if (p.shape === 'SHS') return E(`IFCRECTANGLEHOLLOWPROFILEDEF(.AREA.,${str(key)},$,${num(p.b)},${num(p.h)},${num(p.t)},$,$)`);
    if (p.shape === 'CHS') return E(`IFCCIRCLEHOLLOWPROFILEDEF(.AREA.,${str(key)},$,${num(p.h / 2)},${num(p.t)})`);
    return E(`IFCRECTANGLEPROFILEDEF(.AREA.,${str(key)},$,${num(p.b)},${num(p.h)})`);
  };
  const profCache = {};
  const profFor = (key, p) => (profCache[key + p.b + p.h] ||= profileDef(key, p));
  const props = (el, list) => {
    const vals = list.map(([k, v]) => E(`IFCPROPERTYSINGLEVALUE(${str(k)},$,${v},$)`));
    E(`IFCRELDEFINESBYPROPERTIES(${G()},$,$,$,(${el}),${E(`IFCPROPERTYSET(${G()},$,'Pset_AceroStudio',$,(${vals.join(',')}))`)})`);
  };
  const add = (lvl, el, key) => { contents[lvl].push(el); matFor(key).els.push(el); };
  const levelOf = (id) => storeys[id] ? id : doc.levels[0].id;

  const visible = (e) => doc.layers.find((l) => l.id === e.layer)?.visible !== false;
  let steelKg = 0;
  for (const el of doc.elements.filter(visible)) {
    const lid = levelOf(el.level), st = storeys[lid];
    if (el.type === 'column') {
      const p = PROFILES[el.profile];
      const c = Math.cos(el.rotY || 0), s = Math.sin(el.rotY || 0);
      const pl = place(st.pl, [el.x, -el.z, 0], [0, 0, 1], [c, -s, 0]);
      let prof;
      if (p) prof = profFor(el.profile, p);
      else if (el.profile === 'round') prof = E(`IFCCIRCLEPROFILEDEF(.AREA.,$,$,${num(el.w / 2)})`);
      else if (el.profile === 'I') prof = E(`IFCISHAPEPROFILEDEF(.AREA.,'I',$,${num(el.w)},${num(el.d)},${num(Math.max(0.004, el.d * 0.024))},${num(Math.max(0.006, el.d * 0.036))},$,$,$)`);
      else prof = E(`IFCRECTANGLEPROFILEDEF(.AREA.,$,$,${num(el.w)},${num(el.d)})`);
      const id = E(`IFCCOLUMN(${G()},$,${str(el.name || (p ? profileLabel(el.profile) : 'Columna'))},$,${str(el.profile)},${pl},${shape(extrude(prof, el.height), el.material)},$,.COLUMN.)`);
      add(lid, id, el.material);
      if (p) { const kg = p.kg * el.height; steelKg += kg; props(id, [['Perfil', `IFCLABEL(${str(el.profile)})`], ['Masa', `IFCMASSMEASURE(${num(kg)})`], ['Sistema', "IFCLABEL('Estructura en acero')"]]); }
    } else if (el.type === 'member') {
      const p = profileOf(el), { t, u, L } = memberFrame(el);
      const pl = place(st.pl, toIfc(el.p0), toIfc(t), toIfc(u));
      const key = PROFILES[el.profile] ? el.profile : `PL${Math.round(p.b * 1000)}x${Math.round(p.h * 1000)}`;
      const [ent, type] = ROLE[el.role] || ['IFCMEMBER', '.USERDEFINED.'];
      const id = E(`${ent}(${G()},$,${str(PROFILES[el.profile] ? profileLabel(el.profile) : el.role)},$,${str(key)},${pl},${shape(extrude(profFor(key, p), L), el.material)},$,${type})`);
      add(lid, id, el.material);
      if (PROFILES[el.profile]) { const kg = memberKg(el); steelKg += kg; props(id, [['Perfil', `IFCLABEL(${str(el.profile)})`], ['Masa', `IFCMASSMEASURE(${num(kg)})`], ['Longitud', `IFCLENGTHMEASURE(${num(L)})`]]); }
    } else if (el.type === 'slab') {
      const pl = place(st.pl, [0, 0, -el.thickness]);
      const roof = !doc.elements.some((e) => e.level === lid && (e.type === 'wall' || e.type === 'column') && e.height > 1.5) && doc.levels.at(-1)?.id === lid;
      const id = E(`IFCSLAB(${G()},$,${str(el.name || 'Losa')},$,$,${pl},${shape(extrude(polyProfile(el.points.map(([x, z]) => [x, -z])), el.thickness), el.material)},$,${roof ? '.ROOF.' : '.FLOOR.'})`);
      add(lid, id, el.material);
    }
  }
  // Muros, vidrios y volúmenes a partir de los sólidos neutros (ya cortados por los vanos).
  const byName = Object.fromEntries(doc.levels.map((l) => [l.name, l.id]));
  for (const s of modelSolids(doc)) {
    if (!['wall', 'box'].includes(s.type)) continue;
    const lid = levelOf(byName[s.level]), st = storeys[lid];
    let pl, solid;
    if (s.shape === 'box') {
      const [cx, cy, cz] = s.center, [Lx, Ty, Hz] = s.size;
      pl = place(st.pl, [cx, cy, cz - Hz / 2 - st.elev], [0, 0, 1], [Math.cos(s.rotZ), Math.sin(s.rotZ), 0]);
      solid = extrude(E(`IFCRECTANGLEPROFILEDEF(.AREA.,$,$,${num(Lx)},${num(Ty)})`), Hz);
    } else {
      pl = place(st.pl, [0, 0, s.z - st.elev]);
      solid = extrude(polyProfile(s.points), s.height);
    }
    const glass = s.material === 'vidrio' || s.material === 'policarbonato';
    const ent = s.type === 'box' ? `IFCBUILDINGELEMENTPROXY(${G()},$,${str(s.name || 'Volumen')},$,$,${pl},${shape(solid, s.material)},$,.ELEMENT.)`
      : glass ? `IFCPLATE(${G()},$,'Vidrio',$,$,${pl},${shape(solid, s.material)},$,.CURTAIN_PANEL.)`
        : `IFCWALL(${G()},$,${str(s.name || 'Muro')},$,$,${pl},${shape(solid, s.material)},$,.SOLID.)`;
    add(lid, E(ent), s.material);
  }
  for (const [lid, els] of Object.entries(contents)) if (els.length) E(`IFCRELCONTAINEDINSPATIALSTRUCTURE(${G()},$,$,$,(${els.join(',')}),${storeys[lid].id})`);
  for (const m of Object.values(mats)) if (m.els.length) E(`IFCRELASSOCIATESMATERIAL(${G()},$,$,$,(${m.els.join(',')}),${m.id})`);
  props(building, [['Sistema constructivo', "IFCLABEL('Estructura en acero')"], ['Acero estructural', `IFCMASSMEASURE(${num(steelKg)})`]]);

  const stamp = date.toISOString().slice(0, 19);
  return ['ISO-10303-21;', 'HEADER;', "FILE_DESCRIPTION(('ViewDefinition [ReferenceView_V1.2]'),'2;1');",
    `FILE_NAME(${str(`${doc.name}.ifc`)},'${stamp}',('AceroStudio'),('AceroStudio'),'AceroStudio Studio','AceroStudio','');`,
    "FILE_SCHEMA(('IFC4'));", 'ENDSEC;', 'DATA;', ...lines, 'ENDSEC;', 'END-ISO-10303-21;'].join('\n');
}
