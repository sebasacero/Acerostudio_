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
};

// Prompt en inglés para generadores de video con IA, a partir del modelo real y la toma elegida.
export function videoPrompt(doc, id, format = '16:9') {
  const walls = doc.elements.filter((e) => e.type === 'wall');
  const count = {};
  walls.forEach((w) => { count[w.material] = (count[w.material] || 0) + 1; });
  const mats = Object.entries(count).sort((a, b) => b[1] - a[1]).map(([k]) => EN[k]).filter(Boolean).slice(0, 2);
  const floors = doc.levels.length;
  const windows = walls.reduce((s, w) => s + (w.openings || []).filter((o) => o.kind === 'window').length, 0);
  const steel = doc.elements.some((e) => e.type === 'column' && String(e.material).startsWith('acero'));
  const shots = SEQUENCES[id] ? SEQUENCES[id].parts.map((p) => SHOT_INFO[p].en).join(', then ') : SHOT_INFO[id].en;
  const what = floors > 1 ? `A ${floors}-storey contemporary building` : 'A contemporary single-storey space';
  const look = [
    mats.length ? `facade in ${mats.join(' and ')}` : 'refined material palette',
    windows ? 'large floor-to-ceiling windows with slim dark steel frames, warm interior lighting' : 'clean solid volumes',
    steel ? 'exposed steel structure' : '',
    'set in a Bogotá urban street context at blue hour, pedestrians walking with natural motion blur, street trees',
    'keep the exact architecture, proportions and openings of the reference frame',
    'architectural photography, 24mm lens, smooth gimbal motion, photorealistic, high detail',
    `aspect ratio ${format}`,
  ].filter(Boolean).join(', ');
  return `${what}. Camera: ${shots}. ${look[0].toUpperCase()}${look.slice(1)}.`;
}
