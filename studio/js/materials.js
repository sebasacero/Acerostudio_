// Biblioteca de materiales de AceroStudio Studio.
// Los aceros salen de la escala de revenido de la web (pajizo → bronce → púrpura → azul).
import * as THREE from 'three';

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

const cache = new Map();

function proceduralTexture(kind, color) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = color;
  g.fillRect(0, 0, 256, 256);
  if (kind === 'brick') {
    g.strokeStyle = 'rgba(235,225,210,.85)';
    g.lineWidth = 6;
    for (let r = 0; r < 8; r++) {
      const y = r * 32;
      g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke();
      for (let k = 0; k < 4; k++) {
        const x = k * 64 + (r % 2 ? 32 : 0);
        g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 32); g.stroke();
      }
    }
  } else if (kind === 'wood') {
    for (let i = 0; i < 60; i++) {
      g.strokeStyle = `rgba(60,35,15,${0.05 + Math.random() * 0.12})`;
      g.lineWidth = 1 + Math.random() * 2;
      const y = Math.random() * 256;
      g.beginPath(); g.moveTo(0, y);
      g.bezierCurveTo(80, y + Math.random() * 8 - 4, 170, y + Math.random() * 8 - 4, 256, y);
      g.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function getMaterial(key) {
  if (!MATERIALS[key]) key = 'concreto';
  if (cache.has(key)) return cache.get(key);
  const m = MATERIALS[key];
  const mat = new THREE.MeshStandardMaterial({
    color: m.texture ? '#ffffff' : m.color,
    roughness: m.roughness,
    metalness: m.metalness,
    transparent: m.opacity != null,
    opacity: m.opacity ?? 1,
    side: m.opacity != null ? THREE.DoubleSide : THREE.FrontSide,
    polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
  });
  if (m.texture) mat.map = proceduralTexture(m.texture, m.color);
  mat.name = key;
  cache.set(key, mat);
  return mat;
}
