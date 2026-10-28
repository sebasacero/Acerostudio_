// Exportadores: proyecto (.json), GLB, OBJ, planta DXF / SVG e imagen PNG.
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { planDXF, planSVG } from './drawings.js';

export { planDXF, planSVG };

export function download(data, filename, type = 'application/octet-stream') {
  const blob = data instanceof Blob ? data : new Blob([data], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export const slug = (s) => (s || 'proyecto').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'proyecto';

export function exportJSON(doc) {
  download(JSON.stringify(doc, null, 2), `${slug(doc.name)}.acero.json`, 'application/json');
}

// Solo exporta la geometría del modelo (sin rejilla, cotas ni ayudas).
export function exportableClone(root) {
  const c = root.clone(true);
  const drop = [];
  c.traverse((o) => { if (o.userData.isEdge || o.userData.isAnnotation || o.isCSS2DObject || !o.visible) drop.push(o); });
  drop.forEach((o) => o.parent && o.parent.remove(o));
  return c;
}

export async function exportGLB(root, doc) {
  const res = await new GLTFExporter().parseAsync(exportableClone(root), { binary: true });
  download(res, `${slug(doc.name)}.glb`, 'model/gltf-binary');
}

export function exportOBJ(root, doc) {
  download(new OBJExporter().parse(exportableClone(root)), `${slug(doc.name)}.obj`, 'text/plain');
}

export function exportPNG(renderer, scene, camera, doc, scale = 2) {
  const w = renderer.domElement.width, h = renderer.domElement.height;
  const prev = renderer.getPixelRatio();
  renderer.setPixelRatio(prev * scale);
  renderer.setSize(w / prev, h / prev, false);
  renderer.render(scene, camera);
  renderer.domElement.toBlob((b) => {
    download(b, `${slug(doc.name)}-render.png`, 'image/png');
    renderer.setPixelRatio(prev);
    renderer.setSize(w / prev, h / prev, false);
  }, 'image/png');
}
