// Ventanas de animación, visor 3D interactivo e integraciones con Revit, AutoCAD, SketchUp, 3ds Max, Blender y MCP.
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { openDialog, selField, numField, readFields, esc } from './ui.js';
import { SHOTS, SEQUENCES, FORMATS, videoPrompt } from './animator.js';
import { download, slug, planDXF, exportableClone } from './exporters.js';
import { solidsDocument, modelDXF3D } from './solids.js';
import { polygonArea, fmt } from './model.js';

// --- animación automática ---
export function openAnimate(ctx) {
  const opts = [...Object.entries(SEQUENCES), ...Object.entries(SHOTS)].map(([k, s]) => [k, s.name]);
  const dlg = openDialog({
    title: 'Animación automática', kicker: 'Tomas de cámara · video · prompt para video IA',
    body: `<div class="fields">
        ${selField('shot', 'Toma', 'reel', opts)}
        ${selField('format', 'Formato', '9:16', Object.keys(FORMATS).map((f) => [f, { '16:9': '16:9 · YouTube, web', '9:16': '9:16 · Reels, TikTok', '1:1': '1:1 · feed' }[f]]))}
        ${numField('seconds', 'Duración (s)', 12, 1, 'min="3" max="60"')}
        ${selField('scale', 'Calidad', '1', [['1', 'Full HD'], ['0.5', 'Rápida (mitad)']])}
        <label class="f full"><span>Texto en pantalla</span><input data-k="title" value="${esc(ctx.model.doc.name)}"></label>
      </div>
      <div class="row"><button class="btn" data-prev>▶ Vista previa</button><button class="pill" data-rec>● Grabar video</button><button class="btn" data-key>Fotograma inicial (PNG)</button></div>
      <div class="card"><span class="k">Prompt para video con IA (Higgsfield, Kling, Runway, Veo)</span>
        <p class="mono prompt" data-prompt></p>
        <div class="row"><button class="btn sm" data-copy>Copiar prompt</button></div>
        <p class="empty">Sube el fotograma inicial y este prompt al generador de video: el movimiento de cámara y la arquitectura salen exactos del modelo; la IA agrega personas, luz y fotorrealismo.</p></div>`,
  });
  const box = dlg.el.querySelector('.dlg-body');
  const prompt = () => {
    const o = readFields(box);
    const p = videoPrompt(ctx.model.doc, o.shot, o.format);
    dlg.$('[data-prompt]').textContent = p;
    return p;
  };
  box.addEventListener('change', prompt);
  prompt();
  dlg.$('[data-copy]').addEventListener('click', () => navigator.clipboard?.writeText(prompt()).then(() => ctx.toast('Prompt copiado')));
  dlg.$('[data-key]').addEventListener('click', () => { const o = readFields(box); ctx.anim.keyframe(SEQUENCES[o.shot] ? SEQUENCES[o.shot].parts[0] : o.shot, o.format); });
  const go = (record) => {
    const o = readFields(box);
    dlg.close();
    const ok = ctx.anim.start(o.shot, { seconds: o.seconds || 10, record, format: o.format, scale: +o.scale, title: o.title });
    if (ok) ctx.toast(record ? `Grabando ${o.seconds} s · Esc para cancelar` : 'Vista previa · Esc para salir');
  };
  dlg.$('[data-prev]').addEventListener('click', () => go(false));
  dlg.$('[data-rec]').addEventListener('click', () => go(true));
}

// --- visor 3D interactivo: un solo .html con el modelo adentro, para compartir o subir a la web ---
export async function exportViewer(root, doc) {
  const glb = await new GLTFExporter().parseAsync(exportableClone(root), { binary: true });
  const b64 = await new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(',')[1]);
    r.readAsDataURL(new Blob([glb]));
  });
  const area = doc.elements.filter((e) => e.type === 'slab').reduce((s, e) => s + polygonArea(e.points), 0);
  const levels = [...doc.levels].sort((a, b) => a.elev - b.elev).map((l) => ({ name: l.name, top: +(l.elev + Math.min(1.4, l.height * 0.45)).toFixed(3) }));
  download(viewerHTML({ name: doc.name, area: fmt(area, 0), levels, b64 }), `${slug(doc.name)}-visor-3d.html`, 'text/html');
}

function viewerHTML({ name, area, levels, b64 }) {
  const e = (t) => String(t).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${e(name)} · visor 3D · AceroStudio</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=DM+Mono:wght@400;500&display=swap">
<style>
:root{--bg:#0f1113;--panel:rgba(15,17,19,.82);--line:#3a4046;--tx:#e6e8ea;--mute:#8d969e;--red:#cf2a1f}
*{box-sizing:border-box}html,body{margin:0;height:100%;background:#e9ebed;overflow:hidden;font-family:"Bricolage Grotesque",system-ui,sans-serif;color:var(--tx)}
canvas{display:block;touch-action:none}
.box{position:fixed;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:10px 14px;backdrop-filter:blur(6px)}
.info{left:16px;top:16px;max-width:calc(100% - 32px)}
.info h1{margin:0;font-size:20px;letter-spacing:-.02em}
.mono{font-family:"DM Mono",monospace;font-size:12px;color:var(--mute)}
.ctl{left:50%;bottom:calc(16px + env(safe-area-inset-bottom));transform:translateX(-50%);display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center;width:max-content;max-width:calc(100% - 32px)}
button{all:unset;cursor:pointer;font-family:"DM Mono",monospace;font-size:12px;padding:7px 11px;border-radius:999px;border:1px solid var(--line);color:var(--tx)}
button[aria-pressed=true]{background:var(--red);border-color:var(--red);color:#fff}
.made{right:16px;top:16px;font-family:"DM Mono",monospace;font-size:12px;text-decoration:none;color:var(--tx)}
.made b{font-family:"Bricolage Grotesque";font-weight:800;font-size:15px}.made i{font-style:normal;color:var(--red)}
.load{position:fixed;inset:0;display:grid;place-items:center;font-family:"DM Mono",monospace;color:#16191c}
</style>
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/"}}</script>
</head><body>
<div class="load" id="load">Cargando modelo…</div>
<div class="box info"><h1>${e(name)}</h1><div class="mono">${area} m² · ${levels.length} ${levels.length === 1 ? 'nivel' : 'niveles'} · arrastra para girar</div></div>
<a class="box made" href="https://www.acerostudio.com/studio/" target="_blank" rel="noopener">Hecho con <b>acero<i>.</i>studio</b></a>
<div class="box ctl" id="ctl"><button data-l="-1" aria-pressed="true">Todo</button>${levels.map((l, i) => `<button data-l="${i}">${e(l.name)}</button>`).join('')}<button id="spin" aria-pressed="true">Girar</button><button id="sun">Sol</button><button id="fs">Pantalla completa</button></div>
<script type="module">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
const LEVELS = ${JSON.stringify(levels)};
const B64 = "${b64}";
const r = new THREE.WebGLRenderer({ antialias: true });
r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.toneMapping = THREE.ACESFilmicToneMapping; r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.prepend(r.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color('#e9ebed');
scene.environment = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.7;
scene.add(new THREE.HemisphereLight(0xffffff, 0x8d969e, 0.8));
const sun = new THREE.DirectionalLight(0xfff1dc, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0004; scene.add(sun, sun.target);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.22 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
const cam = new THREE.PerspectiveCamera(45, 1, 0.05, 3000);
const orbit = new OrbitControls(cam, r.domElement); orbit.enableDamping = true; orbit.autoRotate = true; orbit.autoRotateSpeed = 0.8;
const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e5);
r.clippingPlanes = [clip];
const buf = Uint8Array.from(atob(B64), (c) => c.charCodeAt(0)).buffer;
const gltf = await new GLTFLoader().parseAsync(buf, '');
const model = gltf.scene; model.traverse((o) => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; o.material.side = THREE.DoubleSide; } });
scene.add(model);
const box = new THREE.Box3().setFromObject(model), c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
const R = Math.max(s.x, s.y, s.z, 4);
ground.position.y = box.min.y - 0.002;
orbit.target.copy(c); cam.position.copy(c).add(new THREE.Vector3(0.75, 0.9, 1).multiplyScalar(R * 1.25));
let hour = 10;
function setSun() { const a = (hour - 6) / 12 * Math.PI; sun.position.set(c.x + Math.cos(a) * R * 1.5, c.y + Math.max(0.15, Math.sin(a)) * R * 1.6, c.z + R * 0.5); sun.target.position.copy(c);
  const sc = sun.shadow.camera; sc.left = sc.bottom = -R * 1.2; sc.right = sc.top = R * 1.2; sc.far = R * 6; sc.updateProjectionMatrix(); }
setSun();
document.getElementById('load').remove();
function resize() { r.setSize(innerWidth, innerHeight); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
document.querySelectorAll('[data-l]').forEach((b) => b.onclick = () => {
  document.querySelectorAll('[data-l]').forEach((x) => x.setAttribute('aria-pressed', x === b));
  const i = +b.dataset.l; clip.constant = i < 0 ? 1e5 : LEVELS[i].top;
});
const spin = document.getElementById('spin');
spin.onclick = () => { orbit.autoRotate = !orbit.autoRotate; spin.setAttribute('aria-pressed', orbit.autoRotate); };
r.domElement.addEventListener('pointerdown', () => { orbit.autoRotate = false; spin.setAttribute('aria-pressed', false); });
const sunB = document.getElementById('sun'); let sunAnim = false;
sunB.onclick = () => { sunAnim = !sunAnim; sunB.setAttribute('aria-pressed', sunAnim); };
document.getElementById('fs').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
const clock = new THREE.Clock();
r.setAnimationLoop(() => { const dt = clock.getDelta(); if (sunAnim) { hour = 6 + ((hour - 6 + dt * 1.5) % 12); setSun(); } orbit.update(); r.render(scene, cam); });
</script></body></html>`;
}

// --- integraciones ---
const SCRIPTS = {
  revit: 'revit/acerostudio_revit.py',
  sketchup: 'sketchup/acerostudio_sketchup.rb',
  max: '3dsmax/acerostudio_3dsmax.py',
  blender: 'blender/acerostudio_blender.py',
};

async function downloadScript(key, toast) {
  const path = SCRIPTS[key];
  try {
    const r = await fetch(new URL(`../../integraciones/${path}`, import.meta.url));
    if (!r.ok) throw new Error(r.status);
    download(await r.text(), path.split('/').pop(), 'text/plain');
  } catch {
    toast('No encontré el conector en este servidor; descárgalo del repositorio (carpeta integraciones/).');
  }
}

export function openIntegrations(ctx) {
  const name = slug(ctx.model.doc.name);
  const cards = [
    { k: 'revit', t: 'Revit', d: 'Muros, losas, columnas, puertas y ventanas nativos de Revit con pyRevit o RevitPythonShell.', files: [['json', 'Proyecto .acero.json'], ['script:revit', 'Conector acerostudio_revit.py'], ['dxf', 'Planta DXF (vincular CAD)']] },
    { k: 'autocad', t: 'AutoCAD', d: 'Planta 2D por capas (muros, puertas, ventanas, cotas) y modelo 3D en caras 3DFACE.', files: [['dxf', 'Planta 2D (.dxf)'], ['dxf3d', 'Modelo 3D (.dxf)']] },
    { k: 'sketchup', t: 'SketchUp', d: 'Grupos por elemento, materiales y etiquetas por nivel. Ventana › Consola de Ruby o Extension Manager.', files: [['solids', 'Modelo .acero-solids.json'], ['script:sketchup', 'Conector acerostudio_sketchup.rb']] },
    { k: 'max', t: '3ds Max', d: 'Cajas y prismas editables con materiales físicos, por capas de nivel. Scripting › Run Script.', files: [['solids', 'Modelo .acero-solids.json'], ['script:max', 'Conector acerostudio_3dsmax.py'], ['glb', 'GLB (glTF)']] },
    { k: 'blender', t: 'Blender', d: 'Colecciones por nivel, materiales PBR y cámara; también corre sin ventana para renders por lote.', files: [['solids', 'Modelo .acero-solids.json'], ['script:blender', 'Conector acerostudio_blender.py'], ['glb', 'GLB (glTF)']] },
  ];
  const mcp = `{
  "mcpServers": {
    "acerostudio": {
      "command": "node",
      "args": ["<ruta al repo>/mcp/server.mjs"]
    }
  }
}`;
  const dlg = openDialog({
    title: 'Conectar con tus programas', kicker: 'Complementos y MCP', wide: true,
    body: `<div class="grid-cards">${cards.map((c) => `<div class="card"><h3>${c.t}</h3><p class="empty">${c.d}</p><div class="row">${c.files.map(([f, l]) => `<button class="btn sm" data-f="${f}">${l}</button>`).join('')}</div></div>`).join('')}
      <div class="card"><h3>Claude y agentes (MCP)</h3><p class="empty">El servidor MCP de AceroStudio deja que Claude u otro agente cree proyectos, lea planos, genere edificios, exporte y mande el modelo a Blender, Revit, SketchUp, 3ds Max o AutoCAD.</p>
      <pre class="mono code">${esc(mcp)}</pre><div class="row"><button class="btn sm" data-copy>Copiar configuración</button></div></div></div>`,
  });
  const doc = ctx.model.doc;
  const act = {
    json: () => download(JSON.stringify(doc, null, 2), `${name}.acero.json`, 'application/json'),
    solids: () => download(JSON.stringify(solidsDocument(doc)), `${name}.acero-solids.json`, 'application/json'),
    dxf: () => download(planDXF(doc, doc.activeLevel), `${name}-planta.dxf`, 'application/dxf'),
    dxf3d: () => download(modelDXF3D(doc), `${name}-3d.dxf`, 'application/dxf'),
    glb: () => ctx.exportGLB(),
  };
  dlg.$$('[data-f]').forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.f;
    if (f.startsWith('script:')) downloadScript(f.slice(7), ctx.toast); else act[f]();
  }));
  dlg.$('[data-copy]').addEventListener('click', () => navigator.clipboard?.writeText(mcp).then(() => ctx.toast('Configuración copiada')));
}
