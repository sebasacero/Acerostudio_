// Textos de tomas y prompts para video con IA (sin Three.js: los usa también el servidor MCP).

export const SHOT_INFO = {
  contrapicado: { name: 'Contrapicado ascendente', en: 'slow rising low-angle shot from the sidewalk looking up the facade' },
  orbita: { name: 'Órbita 360°', en: 'smooth 360-degree drone orbit around the building' },
  acercamiento: { name: 'Acercamiento a fachada', en: 'slow push-in dolly toward the main facade' },
  sobrevuelo: { name: 'Sobrevuelo y aterrizaje', en: 'cinematic drone flyover descending to street level at the entrance' },
  dia: { name: 'Día completo (time-lapse)', en: 'static three-quarter view, time-lapse of the sun moving from sunrise to sunset' },
  planta: { name: 'De planta a 3D', en: 'top-down plan view that tilts into a three-quarter aerial perspective' },
};

export const SEQUENCES = {
  reel: { name: 'Reel completo (3 tomas)', parts: ['contrapicado', 'acercamiento', 'orbita'] },
};

const EN = {
  concreto: 'exposed board-formed concrete', microcemento: 'light microcement', yeso: 'white plaster', ladrillo: 'red clay brick',
  roble: 'vertical oak timber cladding', nogal: 'dark walnut timber cladding', acero_azul: 'blued steel', acero_purpura: 'heat-tempered purple steel',
  acero_bronce: 'bronze-tempered steel', acero_pajizo: 'straw-tempered steel', acero: 'brushed steel', corten: 'weathering corten steel',
  acero_grafito: 'charcoal-painted structural steel', acero_negro: 'black micaceous structural steel', acero_blanco: 'white-painted structural steel',
  acero_galvanizado: 'hot-dip galvanized steel', panel_metalico: 'standing-seam metal cladding', vidrio: 'full-height low-iron glass curtain wall',
};
const TYPE_EN = {
  edificio: 'exposed steel moment-frame building with HEB columns, IPE beams and X-bracing',
  casa: 'steel-frame house with a dramatic cantilevered upper volume',
  nave: 'long-span steel warehouse with tubular roof trusses and portal frames',
  pabellon: 'minimal steel pavilion with slender tubular columns and a razor-thin cantilevered roof',
};

// Prompt en inglés para generadores de video con IA, a partir del modelo real y la toma elegida.
export function videoPrompt(doc, id, format = '16:9') {
  const walls = doc.elements.filter((e) => e.type === 'wall');
  const count = {};
  walls.forEach((w) => { count[w.material] = (count[w.material] || 0) + 1; });
  const mats = Object.entries(count).sort((a, b) => b[1] - a[1]).map(([k]) => EN[k]).filter(Boolean).slice(0, 2);
  const floors = doc.levels.length;
  const windows = walls.reduce((s, w) => s + (w.openings || []).filter((o) => o.kind === 'window').length, 0);
  const steelEls = doc.elements.filter((e) => (e.type === 'column' || e.type === 'member') && String(e.material).startsWith('acero'));
  const steel = steelEls.length > 0;
  const finish = EN[steelEls[0]?.material] || 'structural steel';
  const shots = SEQUENCES[id] ? SEQUENCES[id].parts.map((p) => SHOT_INFO[p].en).join(', then ') : SHOT_INFO[id].en;
  const kind = TYPE_EN[doc.meta?.tipo];
  const stories = doc.levels.filter((l) => doc.elements.some((e) => e.level === l.id && (e.type === 'wall' || e.type === 'column') && (e.height || 0) > 2)).length || floors;
  const what = kind ? `A ${stories > 1 ? `${stories}-storey ` : ''}${kind}` : stories > 1 ? `A ${stories}-storey steel-structure building` : 'A steel-structure single-storey space';
  const look = [
    mats.length ? `facade in ${mats.join(' and ')}` : 'refined material palette',
    windows || doc.elements.some((e) => e.curtain) ? 'floor-to-ceiling glazing with slim steel mullions, warm interior lighting glowing through the glass' : 'clean solid volumes',
    steel ? `expressed ${finish} structure, crisp steel connections and shadow lines, the steel is the hero of the image` : '',
    'set in a Bogotá urban context at golden hour turning into blue hour, pedestrians walking with natural motion blur, mature trees',
    'keep the exact architecture, proportions and openings of the reference frame',
    'award-winning architectural photography for a real-estate launch, two-point perspective, 24mm tilt-shift lens, smooth gimbal motion, photorealistic, high detail, aspirational mood',
    `aspect ratio ${format}`,
  ].filter(Boolean).join(', ');
  return `${what}. Camera: ${shots}. ${look[0].toUpperCase()}${look.slice(1)}.`;
}
