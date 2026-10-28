// Datos de materiales sin Three.js: los usan el Studio, los exportadores y el servidor MCP.
// Acero grafito es el material estructural por defecto; los aceros de color salen de la escala de revenido de la web (pajizo → bronce → púrpura → azul).

export const MATERIALS = {
  concreto:     { name: 'Concreto a la vista',  color: '#a7a9a8', roughness: 0.92, metalness: 0 },
  microcemento: { name: 'Microcemento claro',   color: '#e4e2dc', roughness: 0.8,  metalness: 0 },
  yeso:         { name: 'Pintura blanca mate',  color: '#f3f3f0', roughness: 0.95, metalness: 0 },
  ladrillo:     { name: 'Ladrillo a la vista',  color: '#a0522d', roughness: 0.9,  metalness: 0, texture: 'brick' },
  roble:        { name: 'Madera de roble',      color: '#c9a27a', roughness: 0.7,  metalness: 0, texture: 'wood' },
  nogal:        { name: 'Nogal',                color: '#7a4f33', roughness: 0.65, metalness: 0, texture: 'wood' },
  // Acero estructural (sistema por defecto de AceroStudio).
  acero_grafito:{ name: 'Acero pintado grafito',  color: '#2a2d31', roughness: 0.38, metalness: 0.6 },
  acero_negro:  { name: 'Acero negro micáceo',  color: '#17181a', roughness: 0.45, metalness: 0.55 },
  acero_blanco: { name: 'Acero pintado blanco', color: '#eceeef', roughness: 0.4,  metalness: 0.15 },
  acero_galvanizado: { name: 'Acero galvanizado', color: '#aab2b9', roughness: 0.32, metalness: 0.95 },
  panel_metalico: { name: 'Panel metálico ondulado', color: '#4a5056', roughness: 0.42, metalness: 0.7, texture: 'ribs' },
  losa_steeldeck: { name: 'Losa sobre steel deck', color: '#c4c6c4', roughness: 0.85, metalness: 0 },
  policarbonato: { name: 'Policarbonato traslúcido', color: '#e8eef0', roughness: 0.3, metalness: 0, opacity: 0.55 },
  acero_azul:   { name: 'Acero pavonado azul',  color: '#2c3f8f', roughness: 0.35, metalness: 0.85 },
  acero_purpura:{ name: 'Acero púrpura',        color: '#6e3f86', roughness: 0.35, metalness: 0.85 },
  acero_bronce: { name: 'Acero bronceado',      color: '#b9783a', roughness: 0.35, metalness: 0.85 },
  acero_pajizo: { name: 'Acero pajizo',         color: '#e6c66e', roughness: 0.35, metalness: 0.85 },
  acero:        { name: 'Acero cepillado',      color: '#8d969e', roughness: 0.3,  metalness: 0.9 },
  corten:       { name: 'Acero corten',         color: '#8a4a2a', roughness: 0.85, metalness: 0.4 },
  vidrio:       { name: 'Vidrio de fachada',    color: '#5f7787', roughness: 0.03, metalness: 0.2, opacity: 0.5 },
  rojo:         { name: 'Lápiz rojo',           color: '#cf2a1f', roughness: 0.6,  metalness: 0 },
  vegetal:      { name: 'Vegetación',           color: '#4f8a55', roughness: 0.9,  metalness: 0 },
};
