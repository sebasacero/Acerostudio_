// Biblioteca de materiales de AceroStudio Studio.
import * as THREE from 'three';
import { MATERIALS } from './palette.js';

export { MATERIALS };

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
