// Render comercial del Studio: cielo físico con reflejos reales en el acero y el vidrio, ambientes
// (hora dorada, mediodía, hora azul con interiores encendidos), entorno con árboles y personas a escala,
// oclusión ambiental, bloom y viñeta, tomas de cámara de fotografía de arquitectura (perspectiva de dos
// puntos) y exportación de imagen HD o lámina de venta con la ficha del proyecto.
import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { getMaterial } from './materials.js';

export const MOODS = {
  dorada: {
    name: 'Hora dorada', hour: 16.6, sun: '#ffb062', sunI: 6, hemi: ['#ffe2c4', '#7a6a58', 0.7], exposure: 0.62, env: 1,
    sky: { turbidity: 4, rayleigh: 1.8, mieCoefficient: 0.006, mieDirectionalG: 0.86 }, grad: ['#2d5a9a', '#93b1d0', '#f6c48e', 1.25], fog: '#d9c4ae',
    ground: ['#b9b2a6', '#74834f'], tree: '#55693d', glow: 0.08, bloom: 0.22,
  },
  mediodia: {
    name: 'Mediodía', hour: 11.5, sun: '#fff6ea', sunI: 5.5, hemi: ['#dfeeff', '#6f6a60', 0.6], exposure: 0.5, env: 1,
    sky: { turbidity: 2.5, rayleigh: 1.1, mieCoefficient: 0.004, mieDirectionalG: 0.8 }, fog: '#cfdbe6',
    ground: ['#b4afa7', '#6d8551'], tree: '#4f6a37', glow: 0, bloom: 0.08,
  },
  azul: {
    name: 'Hora azul', hour: 18.4, night: true, sun: '#9db4ff', sunI: 0.6, hemi: ['#5a7cc3', '#1a1d26', 0.7], exposure: 0.8, env: 0.9,
    sky: { turbidity: 4, rayleigh: 3, mieCoefficient: 0.004, mieDirectionalG: 0.8 }, grad: ['#0b1a3d', '#2f4f8f', '#e3a86f', 1.6], fog: '#1d2a4a',
    ground: ['#6b6e74', '#232a22'], tree: '#1f2b1c', glow: 1.3, bloom: 0.55,
  },
};

const Vignette = {
  uniforms: { tDiffuse: { value: null }, amount: { value: 0.32 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float amount; varying vec2 vUv;
    void main(){ vec4 c = texture2D(tDiffuse, vUv); vec2 d = vUv - 0.5; float v = smoothstep(0.85, 0.2, length(d * vec2(1.0, 0.8)));
      c.rgb *= mix(1.0 - amount, 1.0, v); gl_FragColor = c; }`,
};

// Generador pseudoaleatorio con semilla: el entorno sale igual en cada render del mismo proyecto.
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function groundTexture(inner, outer) {
  const c = document.createElement('canvas');
  c.width = c.height = 1024;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(512, 512, 0, 512, 512, 512);
  grd.addColorStop(0, inner); grd.addColorStop(0.07, inner); grd.addColorStop(0.12, outer); grd.addColorStop(1, outer);
  g.fillStyle = grd; g.fillRect(0, 0, 1024, 1024);
  // Grano sutil para que el piso no se vea plástico.
  const img = g.getImageData(0, 0, 1024, 1024), d = img.data, r = rng(7);
  for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * 14; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function createLook({ renderer, scene, sun, hemi, catcher, grid, bounds: modelBounds, root }) {
  // Encuadre y entorno sobre el edificio, sin la plaza ni el piso exterior.
  const bounds = () => {
    const b = new THREE.Box3();
    root.children.forEach((o) => { if (o.visible && !o.userData.ground && !o.userData.isAnnotation) b.expandByObject(o); });
    return b.isEmpty() ? modelBounds() : b;
  };
  const L = { mood: 'dorada', entourage: true, on: false };
  const sky = new Sky();
  sky.scale.setScalar(2500);
  sky.visible = false;
  scene.add(sky);
  const skyScene = new THREE.Scene();
  const skyEnv = new Sky();
  skyEnv.scale.setScalar(1000);
  skyScene.add(skyEnv);
  // Cielo de degradado (hora dorada y hora azul): del cenit al horizonte encendido, controlado como en una foto.
  const nightMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color() }, mid: { value: new THREE.Color() }, low: { value: new THREE.Color() }, gain: { value: 1 } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position.z = gl_Position.w; }',
    fragmentShader: `uniform vec3 top; uniform vec3 mid; uniform vec3 low; uniform float gain; varying vec3 vP;
      void main(){ float h = vP.y; vec3 c = h > 0.08 ? mix(mid, top, smoothstep(0.08, 0.7, h)) : mix(low, mid, smoothstep(-0.02, 0.08, h));
        gl_FragColor = vec4(c * gain, 1.0); }`,
  });
  const night = new THREE.Mesh(new THREE.SphereGeometry(2400, 32, 16), nightMat);
  const nightEnv = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), nightMat);
  night.visible = false;
  scene.add(night);
  skyScene.add(nightEnv);
  const pmrem = new THREE.PMREMGenerator(renderer);
  let envRT = null, lastEnv = '', lastEnvT = 0;
  const prev = { env: scene.environment, envI: scene.environmentIntensity, bg: scene.background };

  const ground = new THREE.Mesh(new THREE.CircleGeometry(1, 96), new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.visible = false;
  scene.add(ground);
  const extras = new THREE.Group();
  extras.visible = false;
  scene.add(extras);
  let extrasKey = '';

  // --- postproceso ---
  const target = new THREE.WebGLRenderTarget(16, 16, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, target);
  const dummy = new THREE.PerspectiveCamera();
  const renderPass = new RenderPass(scene, dummy);
  const ao = new GTAOPass(scene, dummy, 16, 16);
  ao.blendIntensity = 0.85;
  const bloom = new UnrealBloomPass(new THREE.Vector2(16, 16), 0.2, 0.55, 0.88);
  const vignette = new ShaderPass(Vignette);
  composer.addPass(renderPass); composer.addPass(ao); composer.addPass(bloom); composer.addPass(new OutputPass()); composer.addPass(vignette);
  const size = new THREE.Vector2(), have = new THREE.Vector2();

  function sunVector(dir) {
    const m = MOODS[L.mood];
    if (!m.night) return dir.clone();
    // Hora azul: el sol ya se ocultó (−4°) por el occidente; la luz que queda es fría y difusa.
    const az = Math.atan2(dir.x, dir.z), el = THREE.MathUtils.degToRad(-4);
    return new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
  }

  function updateSky(dir) {
    if (!L.on) return;
    const m = MOODS[L.mood], s = sunVector(dir);
    sky.visible = skyEnv.visible = !m.grad;
    night.visible = nightEnv.visible = !!m.grad;
    if (m.grad) { ['top', 'mid', 'low'].forEach((k, i) => nightMat.uniforms[k].value.set(m.grad[i])); nightMat.uniforms.gain.value = m.grad[3]; }
    for (const k of [sky, skyEnv]) {
      Object.entries(m.sky).forEach(([key, v]) => { k.material.uniforms[key].value = v; });
      k.material.uniforms.sunPosition.value.copy(s);
    }
    const key = `${L.mood}|${s.x.toFixed(2)}|${s.y.toFixed(2)}|${s.z.toFixed(2)}`, now = performance.now();
    if (key !== lastEnv && now - lastEnvT > 120) {
      lastEnv = key; lastEnvT = now;
      envRT?.dispose();
      envRT = pmrem.fromScene(skyScene, 0, 0.1, 2000);
      scene.environment = envRT.texture;
    }
  }

  function applyMood() {
    const m = MOODS[L.mood];
    renderer.toneMappingExposure = m.exposure;
    scene.environmentIntensity = m.env;
    sun.color.set(m.sun); sun.intensity = m.sunI;
    hemi.color.set(m.hemi[0]); hemi.groundColor.set(m.hemi[1]); hemi.intensity = m.hemi[2];
    const r = Math.max(bounds().getSize(new THREE.Vector3()).length(), 20);
    scene.fog = new THREE.Fog(m.fog, r * 5, r * 16);
    ground.material.map?.dispose();
    ground.material.map = groundTexture(...m.ground);
    ground.material.needsUpdate = true;
    bloom.strength = m.bloom;
    // Interiores encendidos detrás del vidrio (sobre todo en hora azul).
    for (const k of ['vidrio', 'policarbonato']) {
      const mat = getMaterial(k);
      mat.emissive = new THREE.Color(k === 'vidrio' ? '#ffbf80' : '#fff1d6');
      mat.emissiveIntensity = m.glow * (k === 'vidrio' ? 1 : 0.6);
    }
    extras.traverse((o) => { if (o.userData.tree) o.material.color.set(m.tree); });
    lightWindows();
    lastEnv = '';
  }

  // Oficinas encendidas al azar: tres intensidades de luz interior detrás del vidrio.
  const LIT = [1, 0.5, 0.12];
  const glassVariants = LIT.map(() => getMaterial('vidrio').clone());
  function lightWindows() {
    const base = getMaterial('vidrio'), m = MOODS[L.mood];
    glassVariants.forEach((g, i) => { g.copy(base); g.emissiveIntensity = base.emissiveIntensity * LIT[i]; });
    const r = rng(11);
    root.traverse((o) => {
      if (!o.isMesh) return;
      if (o.material === base || glassVariants.includes(o.material)) o.material = L.on && m.glow > 0.5 ? glassVariants[Math.floor(r() * 3)] : base;
    });
  }

  function placeExtras() {
    const b = bounds(), c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3());
    const key = [c.x, c.z, s.x, s.z, b.min.y].map((v) => v.toFixed(1)).join('|');
    const R = Math.max(s.x, s.z) / 2 + 4;
    ground.scale.setScalar(R * 14);
    ground.position.set(c.x, b.min.y - 0.02, c.z);
    if (key === extrasKey) return;
    extrasKey = key;
    extras.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    extras.clear();
    const r = rng(Math.round(s.x * 100 + s.z * 7));
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#4a3b2e', roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: MOODS[L.mood].tree, roughness: 0.85, flatShading: true });
    const personMat = new THREE.MeshStandardMaterial({ color: '#3a3d42', roughness: 0.8 });
    const y0 = b.min.y;
    const front = c.z + s.z / 2;
    const tree = (x, z, h) => {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * h / 7, 0.18 * h / 7, h * 0.45, 7), trunkMat);
      t.position.set(x, y0 + h * 0.225, z);
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(h * 0.32, 1), leafMat);
      crown.scale.set(1, 0.85 + r() * 0.3, 1);
      crown.position.set(x, y0 + h * 0.62, z);
      crown.rotation.y = r() * Math.PI;
      crown.userData.tree = true;
      for (const m of [t, crown]) { m.castShadow = m.receiveShadow = true; extras.add(m); }
    };
    let n = 0, guard = 0;
    while (n < 18 && guard++ < 400) {
      const a = r() * Math.PI * 2, d = R + 2 + r() * R * 1.4;
      const x = c.x + Math.cos(a) * d * (s.x / 2 + 6) / R, z = c.z + Math.sin(a) * d * (s.z / 2 + 6) / R;
      if (z > front - 2 && Math.abs(x - c.x) < s.x * 1.3) continue; // la fachada principal queda despejada
      tree(x, z, 5 + r() * 4);
      n++;
    }
    // Personas a escala (estilo maqueta) en la plaza de acceso.
    for (let i = 0; i < 9; i++) {
      const x = c.x + (r() - 0.5) * s.x * 0.9, z = front + 1.2 + r() * 5;
      const h = 1.62 + r() * 0.2;
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, h - 0.62, 4, 10), personMat);
      body.position.set(x, y0 + (h - 0.24) / 2, z);
      body.scale.z = 0.7;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), personMat);
      head.position.set(x, y0 + h - 0.1, z);
      for (const m of [body, head]) { m.castShadow = true; extras.add(m); }
    }
  }

  function setOn(on) {
    L.on = on;
    sky.visible = on && !MOODS[L.mood].grad;
    night.visible = on && !!MOODS[L.mood].grad;
    ground.visible = on;
    extras.visible = on && L.entourage;
    if (catcher) catcher.visible = false;
    if (on) {
      scene.background = null;
      applyMood();
      placeExtras();
    } else {
      scene.environment = prev.env; scene.environmentIntensity = prev.envI; scene.fog = null;
      renderer.toneMappingExposure = 1.05;
      sun.color.set('#fff1dc'); sun.intensity = 2.4;
      hemi.color.set('#ffffff'); hemi.groundColor.set('#8d969e'); hemi.intensity = 0.8;
      for (const k of ['vidrio', 'policarbonato']) getMaterial(k).emissiveIntensity = 0;
      lightWindows();
      lastEnv = '';
    }
    hideEdges();
  }
  function hideEdges() { if (L.on) root.traverse((o) => { if (o.userData.isEdge) o.visible = false; }); }
  const refresh = () => { if (L.on) { placeExtras(); hideEdges(); lightWindows(); } };

  function render(camera) {
    if (!L.on || !camera.isPerspectiveCamera) { renderer.render(scene, camera); return; }
    renderer.getDrawingBufferSize(size);
    if (!size.equals(have)) {
      have.copy(size);
      composer.setPixelRatio(1);
      composer.setSize(size.x, size.y);
    }
    renderPass.camera = camera;
    ao.camera = camera;
    const gv = grid?.visible;
    if (grid) grid.visible = false;
    composer.render();
    if (grid) grid.visible = gv;
  }

  // Tomas de fotografía de arquitectura. Las de peatón usan perspectiva de dos puntos: la cámara mira
  // horizontal (verticales rectas) y el encuadre se desplaza hacia arriba como un lente descentrable.
  function frame(kind, camera, orbit) {
    const b = bounds(), c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3());
    const H = b.max.y - b.min.y, y0 = b.min.y;
    camera.clearViewOffset();
    const shots = {
      heroe: { az: 0.62, eye: 1.6, fov: 38, fit: 1.05, shift: true },
      frontal: { az: 0.06, eye: 1.6, fov: 34, fit: 1.08, shift: true },
      aerea: { az: 0.75, elev: 0.55, fov: 34, fit: 1.25 },
      detalle: { az: 0.9, eye: 1.4, fov: 22, fit: 0.45, shift: true, close: true },
    };
    const k = shots[kind] || shots.heroe;
    camera.fov = k.fov;
    camera.updateProjectionMatrix();
    const tanV = Math.tan(THREE.MathUtils.degToRad(k.fov / 2)), tanH = tanV * camera.aspect;
    // La cámara se pone del lado del sol para ver la fachada iluminada (con algo de luz rasante).
    const side = sun.position.x - c.x >= 0 ? 1 : -1;
    const dirXZ = new THREE.Vector3(Math.sin(k.az * side), 0, Math.cos(k.az)); // desde el frente (+z)
    const halfW = (Math.abs(dirXZ.z) * s.x + Math.abs(dirXZ.x) * s.z) / 2;
    if (k.elev) {
      const R = Math.max(halfW / tanH, (H / 2 + s.z / 4) / tanV) * k.fit + Math.max(s.x, s.z) / 2;
      const pos = c.clone().addScaledVector(dirXZ, R * Math.cos(k.elev));
      pos.y = c.y + R * Math.sin(k.elev);
      camera.position.copy(pos);
      orbit.target.copy(c);
      camera.lookAt(c);
      return;
    }
    // Distancia: que quepa el alto; el ancho cabe si no obliga a ver el edificio diminuto (naves y
    // pabellones largos se dejan salir un poco del cuadro, como en la fotografía de arquitectura).
    const eyeY = y0 + k.eye;
    const Dw = (halfW / tanH) * k.fit, Dv = (H * 1.1) / (2 * tanV), Dlow = H / (0.42 * 2 * tanV);
    let D = Math.max(Dv, Math.min(Dw, Dlow));
    if (k.close) D = Math.max(6, Math.min(Dw, Math.max(s.x, s.z) * 0.6));
    const front = new THREE.Vector3(c.x + (k.close ? s.x / 2 : 0) * Math.sign(dirXZ.x), eyeY, c.z + s.z / 2);
    const halfDepth = (Math.abs(dirXZ.x) * s.x + Math.abs(dirXZ.z) * s.z) / 2;
    const pos = k.close ? front.clone().addScaledVector(dirXZ, D + 2) : new THREE.Vector3(c.x, eyeY, c.z).addScaledVector(dirXZ, D + halfDepth);
    pos.y = eyeY;
    camera.position.copy(pos);
    const look = new THREE.Vector3(k.close ? front.x : c.x, eyeY, k.close ? front.z : c.z);
    orbit.target.copy(look);
    camera.lookAt(look);
    camera.updateMatrixWorld();
    if (!k.shift) return;
    // Desplazamiento: centra verticalmente entre el piso y la cubierta sin inclinar la cámara.
    const top = new THREE.Vector3(look.x, k.close ? y0 + Math.min(H, 9) : b.max.y, look.z).project(camera).y;
    const bot = new THREE.Vector3(look.x, y0, look.z).project(camera).y;
    const shiftNdc = Math.min(0.95, (top + bot) / 2 + 0.06);
    const w = 1000, h = Math.round(w / camera.aspect);
    camera.setViewOffset(w, h, 0, -shiftNdc * h / 2, w, h);
  }

  return {
    get mood() { return L.mood; }, get on() { return L.on; }, get entourage() { return L.entourage; },
    setOn, render, frame, updateSky, hideEdges,
    setMood(m) { L.mood = m; if (L.on) applyMood(); },
    setEntourage(v) { L.entourage = v; extras.visible = L.on && v; },
    refresh,
  };
}
