// Datos de materiales sin Three.js: los usan el Studio, los exportadores y el servidor MCP.
// Los aceros salen de la escala de revenido de la web (pajizo → bronce → púrpura → azul).

export const MATERIALS = {
  concreto:     { name: 'Concreto a la vista',  color: '#a7a9a8', roughness: 0.92, metalness: 0 },
  microcemento: { name: 'Microcemento claro',   color: '#e4e2dc', roughness: 0.8,  metalness: 0 },
  yeso:         { name: 'Pintura blanca mate',  color: '#f3f3f0', roughness: 0.95, metalness: 0 },
  ladrillo:     { name: 'Ladrillo a la vista',  color: '#a0522d', roughness: 0.9,  metalness: 0, texture: 'brick' },
  roble:        { name: 'Madera de roble',      color: '#c9a27a', roughness: 0.7,  metalness: 0, texture: 'wood' },
  nogal:        { name: 'Nogal',                color: '#7a4f33', roughness: 0.65, metalness: 0, texture: 'wood' },
  acero_azul:   { name: 'Acero pavonado azul',  color: '#2c3f8f', roughness: 0.35, metalness: 0.85 },
  acero_purpura:{ name: 'Acero púrpura',        color: '#6e3f86', roughness: 0.35, metalness: 0.85 },
  acero_bronce: { name: 'Acero bronceado',      color: '#b9783a', roughness: 0.35, metalness: 0.85 },
  acero_pajizo: { name: 'Acero pajizo',         color: '#e6c66e', roughness: 0.35, metalness: 0.85 },
  acero:        { name: 'Acero cepillado',      color: '#8d969e', roughness: 0.3,  metalness: 0.9 },
  corten:       { name: 'Acero corten',         color: '#8a4a2a', roughness: 0.85, metalness: 0.4 },
  vidrio:       { name: 'Vidrio claro',         color: '#bcd6ea', roughness: 0.05, metalness: 0, opacity: 0.35 },
  rojo:         { name: 'Lápiz rojo',           color: '#cf2a1f', roughness: 0.6,  metalness: 0 },
  vegetal:      { name: 'Vegetación',           color: '#4f8a55', roughness: 0.9,  metalness: 0 },
};
