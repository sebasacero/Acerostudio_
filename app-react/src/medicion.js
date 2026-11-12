// Medición: realidad aumentada (WebXR hit-test) cuando el equipo la tiene y, si no, medición sobre la foto con una referencia conocida.
import * as THREE from 'three';

export const REFERENCIAS = [['Un metro (flexómetro)', 1], ['Puerta estándar (ancho 0,90 m)', 0.9], ['Baldosa 60 cm', 0.6], ['Baldosa 30 cm', 0.3], ['Hoja carta (27,9 cm)', 0.279], ['Ladrillo (29 cm)', 0.29]];

export async function hayAR() {
  try { return !!(navigator.xr && await navigator.xr.isSessionSupported('immersive-ar')); } catch { return false; }
}

// En un iPhone el LiDAR no se expone al navegador: solo lo lee una app nativa (ARKit). Lo que sí hay en Android/Chrome es
// WebXR con hit-test (usa el sensor de profundidad/ToF si el teléfono lo tiene). Esta función abre esa sesión, pone un retículo
// sobre la superficie real y mide la distancia entre toques consecutivos. Devuelve los puntos y distancias al cerrar.
export function medirAR({ alMedir, alCerrar }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(devicePixelRatio); renderer.setSize(innerWidth, innerHeight); renderer.xr.enabled = true;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
  const reticulo = new THREE.Mesh(new THREE.RingGeometry(0.04, 0.05, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xee7f74 }));
  reticulo.matrixAutoUpdate = false; reticulo.visible = false; scene.add(reticulo);
  const puntos = [], marcas = new THREE.Group(); scene.add(marcas);
  const matPunto = new THREE.MeshBasicMaterial({ color: 0xb6dbf8 });
  let hitSource = null, refSpace = null, sesion = null;
  const panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:9999;background:rgba(11,13,16,.85);color:#fff;padding:12px 18px;font:14px Outfit,sans-serif;border-left:2px solid #ee7f74;display:flex;gap:14px;align-items:center';
  const txt = document.createElement('span'); txt.textContent = 'Apunta a una superficie y toca para marcar';
  const cerrarBtn = document.createElement('button'); cerrarBtn.textContent = 'Terminar'; cerrarBtn.style.cssText = 'background:#ee7f74;color:#1d1420;border:0;padding:8px 14px;border-radius:3px;font-weight:500';
  panel.append(txt, cerrarBtn);

  function colocar() {
    if (!reticulo.visible) return;
    const p = new THREE.Vector3().setFromMatrixPosition(reticulo.matrix); puntos.push(p);
    const esfera = new THREE.Mesh(new THREE.SphereGeometry(0.015, 16, 16), matPunto); esfera.position.copy(p); marcas.add(esfera);
    if (puntos.length >= 2) {
      const a = puntos[puntos.length - 2], d = a.distanceTo(p);
      marcas.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, p]), new THREE.LineBasicMaterial({ color: 0xee7f74 })));
      txt.textContent = `Último tramo: ${d.toFixed(2)} m · ${puntos.length} puntos`; alMedir?.(d, puntos.length);
    } else txt.textContent = 'Primer punto marcado. Toca el segundo para medir';
  }
  const controller = renderer.xr.getController(0); controller.addEventListener('select', colocar); scene.add(controller);

  async function iniciar() {
    sesion = await navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: { root: document.body } });
    document.body.appendChild(panel);
    renderer.xr.setReferenceSpaceType('local'); await renderer.xr.setSession(sesion);
    refSpace = await sesion.requestReferenceSpace('viewer');
    hitSource = await sesion.requestHitTestSource({ space: refSpace });
    sesion.addEventListener('end', () => { panel.remove(); renderer.setAnimationLoop(null); renderer.dispose(); alCerrar?.(puntos); });
    cerrarBtn.onclick = () => sesion.end();
    renderer.setAnimationLoop((t, frame) => {
      if (frame && hitSource) {
        const local = renderer.xr.getReferenceSpace(); const hits = frame.getHitTestResults(hitSource);
        if (hits.length) { reticulo.visible = true; reticulo.matrix.fromArray(hits[0].getPose(local).transform.matrix); } else reticulo.visible = false;
      }
      renderer.render(scene, camera);
    });
  }
  return { iniciar, puntos };
}

/* ---------- medición sobre la foto ---------- */
// Supone que la referencia y el vano están en el mismo plano (la fachada o el muro) y de frente a la cámara.
// px por metro = largo de la referencia en píxeles / largo real. Con las 4 esquinas del vano saca ancho y alto medios.
export const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export function escalaPorReferencia(p1, p2, largoReal) { return dist(p1, p2) / largoReal; } // px/m
export function medidasVano(esquinas, pxm) {
  const [tl, tr, br, bl] = esquinas;
  const ancho = (dist(tl, tr) + dist(bl, br)) / 2 / pxm, alto = (dist(tl, bl) + dist(tr, br)) / 2 / pxm;
  // ortogonalidad: cuánto difieren los lados opuestos (0 = rectángulo perfecto visto de frente)
  const desv = Math.max(Math.abs(dist(tl, tr) - dist(bl, br)) / dist(tl, tr), Math.abs(dist(tl, bl) - dist(tr, br)) / dist(tl, bl));
  return { ancho, alto, precision: desv < 0.04 ? '±2 cm (de frente)' : desv < 0.12 ? '±5 cm (algo de perspectiva)' : '±10 cm o más: toma la foto de frente', desv };
}
// Homografía del cuadrado unitario a 4 esquinas (para CSS matrix3d): devuelve la matriz 4×4 en orden column-major.
export function homografia(esq, w, h) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = esq; // TL TR BR BL en píxeles
  // de (0,0)(w,0)(w,h)(0,h) a las esquinas
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const det = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / det, hh = (dx1 * dy3 - dx3 * dy1) / det;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0, d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0;
  // H mapea (u,v) en [0,1]; escalamos por w, h
  const H = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, c, f, 0, 1];
  return `matrix3d(${H.map((n) => n.toFixed(6)).join(',')})`;
}
