// AceroStudio · Ornamentación · simulador de portón eléctrico (Three.js 0.169, sin build)
// Unidades en metros. x = a lo largo del muro, y = altura, z = hacia la calle (+) / hacia el predio (−).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ---------- acero: perfiles y pesos reales (kg/m) ---------- */
export const PERFILES = {
  shs60: { nombre: 'Tubo cuadrado 60×60×3', kgm: 5.19 },
  t40: { nombre: 'Tubo cuadrado 40×40×2', kgm: 2.31 },
  b16: { nombre: 'Barra cuadrada 16 mm', kgm: 2.01 },
  l80: { nombre: 'Tubo rectangular 80×20×1,5', kgm: 2.25 },
  t20: { nombre: 'Tubo cuadrado 20×20×1,5', kgm: 0.84 },
  t4020: { nombre: 'Tubo rectangular 40×20×1,5', kgm: 1.31 },
  shs80: { nombre: 'Tubo cuadrado 80×80×3', kgm: 7.07 },
  lam: { nombre: 'Lámina cal. 18 (1,2 mm)', kgm2: 9.42 },
};
export const ACABADOS = {
  grafito: { nombre: 'Grafito', color: 0x464e62 },
  negro: { nombre: 'Negro mate', color: 0x1b1d25 },
  blanco: { nombre: 'Blanco', color: 0xf1f2f5 },
  celeste: { nombre: 'Celeste maqueta', color: 0xb6dbf8 },
  corten: { nombre: 'Óxido corten', color: 0xa45f3d },
};
export const TIPOS = { corredizo: 'Corredizo', batiente: 'Batiente', levadizo: 'Levadizo' };
export const DISENOS = { lanzas: 'Lanzas', listones: 'Listones', lamina: 'Lámina y rombos' };

const PAL = {
  noche: {
    fondo: 0x242936, suelo: 0x2b3145, anden: 0x3d4660, via: 0x262b3d, raya: 0x7c86a6, muro: 0x52627f, pilar: 0x5d6e8c,
    casa: 0x4d5f79, casa2: 0x445269, ruta: 0xe29699, arbol: 0x41607a, tronco: 0x39405a, carro: 0xbfe2fb, vidrio: 0x2a3550,
    ventana: 0xffd98a, tinta: 0x0b0d14, tintaOp: .55, hemiC: 0xa9b6e0, hemiS: 0x566080, hemiI: 2.3, solC: 0xc5d2ff, solI: 1.5,
    sol: [-9, 14, 11], lampara: 1, motor: 0xb6dbf8, mecanica: 0xd7dce8,
  },
  dia: {
    fondo: 0xeceef2, suelo: 0xe3e6ec, anden: 0xf6f7f9, via: 0xd3d7e0, raya: 0xffffff, muro: 0xffffff, pilar: 0xffffff,
    casa: 0xffffff, casa2: 0xf3f4f7, ruta: 0xf0a8a2, arbol: 0xdde6ec, tronco: 0xcfd4dd, carro: 0x8fc6f0, vidrio: 0x56627a,
    ventana: 0xc9d6e6, tinta: 0x1a1e2c, tintaOp: .32, hemiC: 0xffffff, hemiS: 0xc9cedb, hemiI: 1.35, solC: 0xfff4e2, solI: 2.3,
    sol: [10, 16, 9], lampara: 0, motor: 0x8fc6f0, mecanica: 0x9aa3b5,
  },
};

const UNIT = new THREE.BoxGeometry(1, 1, 1);
const CONO = new THREE.ConeGeometry(.027, .11, 4); CONO.rotateY(Math.PI / 4);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const suave = t => t * t * (3 - 2 * t);

/* ---------- una hoja de portón: origen abajo a la izquierda, x 0..L, y 0..H ---------- */
function hoja(L, H, diseno, mat, acc, arco) {
  const g = new THREE.Group(), t = .06, li = L - 2 * t;
  const B = (sx, sy, sz, x, y, z = 0, rz = 0) => {
    const m = new THREE.Mesh(UNIT, mat); m.scale.set(sx, sy, sz); m.position.set(x, y, z); m.rotation.z = rz;
    m.castShadow = m.receiveShadow = true; g.add(m); return m;
  };
  if (diseno === 'lanzas') {
    const yT = arco ? H - .52 : H - .2, yM = .52;
    B(t, yT + t / 2, t, t / 2, (yT + t / 2) / 2); B(t, yT + t / 2, t, L - t / 2, (yT + t / 2) / 2); acc.add('shs60', yT + t / 2, 2);
    B(li, t, t, L / 2, t / 2); B(li, t, t, L / 2, yT); acc.add('shs60', li, 2);
    B(li, .04, .04, L / 2, yM); acc.add('t40', li);
    B(li, yM - t - .02, .012, L / 2, (t + yM - .02) / 2); acc.lamina(li * (yM - t - .02));
    const n = Math.max(2, Math.round(li / .115) - 1), paso = li / (n + 1);
    for (let i = 1; i <= n; i++) {
      const x = t + paso * i, d = (L - x) / L, top = arco ? yT + .14 + .3 * (1 - d * d) : H - .11;
      B(.016, top - yM, .016, x, (top + yM) / 2); acc.add('b16', top - yM);
      const c = new THREE.Mesh(CONO, mat); c.position.set(x, top + .055, 0); c.castShadow = true; g.add(c);
      B(.034, .028, .034, x, (yM + yT) / 2);
    }
  } else if (diseno === 'listones') {
    B(t, H, t, t / 2, H / 2); B(t, H, t, L - t / 2, H / 2); acc.add('shs60', H, 2);
    const nI = Math.max(0, Math.ceil(li / 1.5) - 1);
    for (let i = 1; i <= nI; i++) { B(.04, H - .04, .04, t + li * i / (nI + 1), H / 2, -.022); acc.add('t40', H - .04); }
    const n = Math.floor((H + .03) / .11), paso = H / n;
    for (let i = 0; i < n; i++) { B(li, paso - .03, .02, L / 2, paso * (i + .5), .01); acc.add('l80', li); }
  } else {
    const yS = H * .64;
    B(t, H, t, t / 2, H / 2); B(t, H, t, L - t / 2, H / 2); acc.add('shs60', H, 2);
    B(li, t, t, L / 2, t / 2); B(li, t, t, L / 2, H - t / 2); acc.add('shs60', li, 2);
    B(li, .04, .04, L / 2, yS); acc.add('t40', li);
    B(li, yS - t - .02, .012, L / 2, (t + yS - .02) / 2); acc.lamina(li * (yS - t - .02));
    const nR = Math.max(1, Math.round(li / .8) - 1);
    for (let i = 1; i <= nR; i++) { B(.04, yS - t - .02, .02, t + li * i / (nR + 1), (t + yS - .02) / 2, .014); acc.add('t4020', yS - t - .02); }
    const y0 = yS + .02, y1 = H - t, k = Math.max(2, Math.round(li / .42)), dx = li / k, dy = y1 - y0, len = Math.hypot(dx, dy), ang = Math.atan2(dy, dx);
    for (let i = 0; i < k; i++) {
      const xm = t + dx * (i + .5), ym = (y0 + y1) / 2;
      B(len, .02, .02, xm, ym, 0, i % 2 ? -ang : ang); B(len, .02, .02, xm, ym, 0, i % 2 ? ang : -ang); acc.add('t20', len, 2);
    }
  }
  return g;
}

function nuevoAcc() {
  const items = {}; let piezas = 0;
  return {
    items,
    add(p, m, n = 1) { (items[p] ||= { m: 0, n: 0 }); items[p].m += m * n; items[p].n += n; piezas += n; },
    lamina(m2) { (items.lam ||= { m2: 0, n: 0 }); items.lam.m2 += m2; items.lam.n++; piezas++; },
    total() {
      let kg = 0, m = 0; const lista = [];
      for (const [k, v] of Object.entries(items)) {
        const p = PERFILES[k], w = k === 'lam' ? v.m2 * p.kgm2 : v.m * p.kgm; kg += w; if (k !== 'lam') m += v.m;
        lista.push({ clave: k, nombre: p.nombre, cantidad: k === 'lam' ? v.m2 : v.m, unidad: k === 'lam' ? 'm²' : 'm', n: v.n, kg: w });
      }
      lista.sort((a, b) => b.kg - a.kg);
      return { kg: kg * 1.04, metros: m, piezas, lista }; // +4 % soldadura y herrajes
    },
  };
}

function motorRecomendado(tipo, kg, W) {
  if (tipo === 'corredizo') return kg <= 380 ? { modelo: 'Corredizo 600 kg', dato: '1/2 HP · cremallera M4', inom: 2.6 } : { modelo: 'Corredizo 1.000 kg', dato: '3/4 HP · cremallera M4', inom: 3.6 };
  if (tipo === 'batiente') return W / 2 <= 2.5 ? { modelo: 'Par de brazos 2,5 m', dato: 'electromecánicos · 24 V', inom: 3.2 } : { modelo: 'Par de brazos 4 m', dato: 'electromecánicos · 230 V', inom: 2.4 };
  return kg <= 160 ? { modelo: 'Motor de techo 1.000 N', dato: 'riel de cadena · 24 V', inom: 3.0 } : { modelo: 'Motor de techo 1.200 N', dato: 'riel de cadena · 24 V', inom: 3.8 };
}

export function crearSimulador(canvas, opt = {}) {
  const cfg = Object.assign({ tipo: 'corredizo', diseno: 'lanzas', ancho: 4, alto: 2.2, acabado: 'grafito', tiempo: 9, autocierre: true, pausa: 5, fotocelda: true, lampara: true, dia: false }, opt.cfg);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: !!opt.captura });
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0, 38, 80);
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 200);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = .08; controls.maxPolarAngle = Math.PI * .495; controls.minDistance = 2.2; controls.maxDistance = 38; controls.enablePan = false;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x333333, 1), sol = new THREE.DirectionalLight(0xffffff, 1);
  sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); sol.shadow.bias = -.0004; sol.shadow.normalBias = .02;
  Object.assign(sol.shadow.camera, { left: -17, right: 17, top: 17, bottom: -17, near: 1, far: 60 });
  scene.add(hemi, sol, sol.target);

  /* materiales por rol, para cambiar día/noche sin reconstruir */
  const M = {}, mat = (rol, extra) => (M[rol] ||= new THREE.MeshLambertMaterial(extra || {}));
  const mAcero = new THREE.MeshStandardMaterial({ metalness: .3, roughness: .5 });
  const mMotor = new THREE.MeshStandardMaterial({ metalness: .1, roughness: .6 });
  const mMec = new THREE.MeshStandardMaterial({ metalness: .5, roughness: .4 });
  const mOscuro = new THREE.MeshStandardMaterial({ color: 0x1c1f29, roughness: .8 });
  const mBaliza = new THREE.MeshStandardMaterial({ color: 0x7a5a1e, emissive: 0xffa41c, emissiveIntensity: 0 });
  const mLamp = new THREE.MeshStandardMaterial({ color: 0xfff1cf, emissive: 0xffd98a, emissiveIntensity: 0 });
  const mHaz = new THREE.MeshBasicMaterial({ color: 0xee7f74, transparent: true, opacity: .55 });
  const mFaro = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff3c4, emissiveIntensity: 0 });
  const mLinea = new THREE.LineBasicMaterial({ transparent: true });
  const luzBaliza = new THREE.PointLight(0xffa41c, 0, 7, 2), luzL1 = new THREE.PointLight(0xffd9a0, 0, 11, 1.6), luzL2 = luzL1.clone();
  scene.add(luzBaliza, luzL1, luzL2);

  const entorno = new THREE.Group(), porton = new THREE.Group(), carro = new THREE.Group();
  scene.add(entorno, porton, carro);
  const caja = (grp, m, sx, sy, sz, x, y, z, borde) => {
    const o = new THREE.Mesh(UNIT, m); o.scale.set(sx, sy, sz); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; grp.add(o);
    if (borde) { const e = new THREE.LineSegments(BORDE, mLinea); e.scale.copy(o.scale); e.position.copy(o.position); grp.add(e); }
    return o;
  };
  const BORDE = new THREE.EdgesGeometry(UNIT);
  const limpiar = g => { for (const o of [...g.children]) { g.remove(o); if (o.geometry && o.geometry !== UNIT && o.geometry !== CONO && o.geometry !== BORDE) o.geometry.dispose(); } };

  /* ---------- estado del automatismo ---------- */
  const S = { p: 0, v: 0, estado: 'cerrado', objetivo: 0, tPausa: 0, tMov: 0, ciclos: 0, corriente: .05, tBaliza: 0, bloqueada: false, reloj: 0, golpe: 0 };
  const car = { z: 6.4, v: 0, objetivo: 6.4, dentro: false, prueba: false, pruebaHecha: false, pulsado: false };
  let geo = {}, ficha = {}, partes = {}, oyentes = [];
  const evento = (tipo, texto) => oyentes.forEach(f => f(tipo, texto, S.reloj));
  const LARGO = 4.2, MITAD = LARGO / 2, Z_FUERA = 6.4, Z_DENTRO = -7.4, Z_HAZ = .32;

  /* ---------- construcción ---------- */
  function construir() {
    limpiar(entorno); limpiar(porton); partes = {};
    const { ancho: W, alto: H, tipo } = cfg, hp = H + (tipo === 'levadizo' ? .34 : .26), px = W / 2 + .2;
    // suelo, andén, vía, entrada
    const piso = (rol, sx, sz, x, z, y) => { const o = new THREE.Mesh(UNIT, mat(rol)); o.scale.set(sx, .02, sz); o.position.set(x, y, z); o.receiveShadow = true; entorno.add(o); return o; };
    piso('suelo', 160, 160, 0, 0, -.012); piso('anden', 60, 2.4, 0, 1.6, 0); piso('via', 160, 7.5, 0, 6.55, -.004);
    for (let x = -28; x <= 28; x += 3.2) piso('raya', 1.5, .12, x, 6.55, .002);
    piso('ruta', W - .1, 12.5, 0, -3.45, .004); piso('ruta', W - .1, 1.3, 0, 3.45, .002);
    // muro y pilares
    for (const s of [-1, 1]) {
      const largo = 15 - px - .2; caja(entorno, mat('muro'), largo, H + .1, .22, s * (px + .2 + largo / 2), (H + .1) / 2, 0, true);
      caja(entorno, mat('pilar'), .4, hp, .4, s * px, hp / 2, 0, true);
      caja(entorno, mat('pilar'), .5, .06, .5, s * px, hp + .03, 0);
      caja(entorno, mLamp, .16, .16, .16, s * px, hp + .14, 0);
      caja(entorno, mOscuro, .07, .12, .06, s * (px - .2 - .035), .5, Z_HAZ); // fotoceldas
    }
    luzL1.position.set(-px, hp + .5, .5); luzL2.position.set(px, hp + .5, .5);
    partes.haz = caja(entorno, mHaz, W - .07, .012, .012, 0, .5, Z_HAZ); partes.haz.castShadow = false;
    // baliza
    caja(entorno, mOscuro, .03, .16, .03, px + .13, hp + .14, .13);
    const bal = new THREE.Mesh(new THREE.CylinderGeometry(.055, .065, .1, 10), mBaliza); bal.position.set(px + .13, hp + .27, .13); entorno.add(bal);
    luzBaliza.position.set(px + .13, hp + .5, .4);
    // casa y vecinos (volúmenes de maqueta)
    const casa = (rol, sx, sy, sz, x, z) => caja(entorno, mat(rol), sx, sy, sz, x, sy / 2, z, true);
    casa('casa', 9.5, 6.2, 6.5, -1.5, -14.5); casa('casa2', 5.5, 3.3, 5.2, 5.6, -13.4); casa('casa', 3.2, 8.6, 3.4, -4.4, -17.6);
    casa('casa2', 9, 9.5, 11, -21, -9); casa('casa', 7, 5.5, 9, 21.5, -8); casa('casa2', 10, 13, 9, 20, -22); casa('casa', 12, 7, 8, -19, -24);
    casa('casa', 8, 6, 8, -32, -6); casa('casa2', 9, 11, 9, 32, -14); casa('casa2', 9, 7, 7, 6, -27);
    for (const [x, y, w] of [[-4.4, 4.4, 2.2], [-1, 4.4, 2.2], [-4.4, 1.6, 2.2], [-1, 1.6, 2.2]]) caja(entorno, mat('ventana', { emissive: 0 }), w, 1.3, .06, x, y, -11.23);
    caja(entorno, mat('ventana'), 2.6, 1.2, .06, 5.6, 1.7, -10.78);
    // árboles
    for (const [x, z, s] of [[-7.5, -5, 1.2], [8.6, -6.5, 1], [-9.5, 1.7, .8], [10.5, 1.7, .8], [-6, -9, .9]]) {
      caja(entorno, mat('tronco'), .18 * s, 1.6 * s, .18 * s, x, .8 * s, z);
      const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15 * s, 0), mat('arbol', { flatShading: true })); c.position.set(x, 2.3 * s, z); c.castShadow = true; entorno.add(c);
    }

    /* ----- portón ----- */
    const acc = nuevoAcc(); geo = { W, H, hp, px };
    const Bm = (m, sx, sy, sz, x, y, z, grp = porton) => caja(grp, m, sx, sy, sz, x, y, z);
    if (tipo === 'corredizo') {
      const L = W + .5, zc = -.3, T = W + .04; geo.T = T; geo.zona = [-.5, -.1];
      const h = hoja(L, H - .1, cfg.diseno, mAcero, acc); h.position.set(-W / 2 - .1, .1, zc); porton.add(h); partes.hoja = h;
      Bm(mMec, 2 * W + 1.6, .02, .05, W / 2 + .35, .02, zc); // riel
      partes.ruedas = [.5, L - .5].map(x => { const r = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .03, 14), mMec); r.rotation.x = Math.PI / 2; r.position.set(x, -.04, 0); h.add(r); return r; });
      // cremallera con dientes
      const yc = .34; Bm(mMec, L - .1, .03, .028, L / 2, yc, -.047, h);
      const nd = Math.floor((L - .1) / .034), dientes = new THREE.InstancedMesh(UNIT, mMec, nd), tm = new THREE.Matrix4();
      for (let i = 0; i < nd; i++) { tm.makeScale(.016, .014, .028); tm.setPosition(.06 + i * .034, yc - .021, -.047); dientes.setMatrixAt(i, tm); }
      h.add(dientes);
      // motor con piñón
      const mx = W / 2 + .62, mz = zc - .19;
      Bm(mOscuro, .34, .02, .26, mx, .03, mz); Bm(mMotor, .28, .3, .2, mx, .19, mz); Bm(mOscuro, .28, .035, .2, mx, .357, mz);
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(.052, .052, .03, 10), mMec); pin.rotation.x = Math.PI / 2; pin.position.set(mx, .1 + yc - .028 - .052, zc - .047);
      const marca = new THREE.Mesh(UNIT, mOscuro); marca.scale.set(.02, .034, .05); marca.position.set(.03, 0, 0); pin.add(marca); porton.add(pin); partes.pinon = pin;
      Bm(mMec, .03, .03, .1, mx, pin.position.y, zc - .11);
      // guía superior y tope
      Bm(mMec, .05, .05, .34, W / 2 + .1, H + .06, -.2); Bm(mOscuro, .05, .1, .03, W / 2 + .1, H - .02, zc + .05); Bm(mOscuro, .05, .1, .03, W / 2 + .1, H - .02, zc - .05);
      Bm(mMec, .08, H * .5, .08, -W / 2 - .22, H * .25, zc); Bm(mMec, .08, .5, .08, W / 2 + .5 + W + .5, .25, zc);
      geo.anclaMotor = new THREE.Vector3(mx, .38, mz); geo.pmin = (1.18 + W / 2) / T;
    } else if (tipo === 'batiente') {
      const L = W / 2 - .015; geo.L = L; geo.zona = [-L - .1, .1]; geo.pmin = .955; partes.hojas = []; partes.brazos = [];
      for (const s of [-1, 1]) {
        const piv = new THREE.Group(); piv.position.set(s * W / 2, .07, 0); porton.add(piv);
        piv.add(hoja(L, H - .07, cfg.diseno, mAcero, acc, cfg.diseno === 'lanzas'));
        for (const y of [.3, H - .55]) Bm(mMec, .05, .12, .05, s * (W / 2 + .0), y, -.02); // bisagras
        const A = new THREE.Vector3(s * (W / 2 + .1), .85, -.27), br = new THREE.Group(); br.position.copy(A); porton.add(br);
        Bm(mOscuro, .12, .05, .1, A.x, A.y - .07, -.24);
        Bm(mMotor, .085, .1, .46, 0, 0, .25, br);
        const vast = Bm(mMec, .03, .03, 1, 0, 0, .5, br);
        const punta = new THREE.Object3D(); punta.position.set(.72, .85 - .07, s < 0 ? -.06 : .06); piv.add(punta);
        partes.hojas.push({ piv, s }); partes.brazos.push({ br, vast, punta });
      }
      Bm(mMec, .12, .05, .12, 0, .025, -.06); // tope central
      geo.anclaMotor = new THREE.Vector3(-W / 2 - .1, 1, -.4);
    } else {
      const L = W - .03, D = H + .5; geo.zona = [-.75, .12]; geo.pmin = Math.acos(clamp(1 - 1.6 / H, -1, 1)) / (86 * Math.PI / 180);
      const piv = new THREE.Group(); piv.position.set(-L / 2, 0, 0); porton.add(piv); piv.add(hoja(L, H - .02, cfg.diseno, mAcero, acc)); partes.piv = piv;
      Bm(mAcero, W + .8, .1, .1, 0, H + .16, .0); acc.add('shs80', W + .8);
      for (const s of [-1, 1]) {
        Bm(mAcero, .06, .06, D, s * (W / 2 - .05), H + .08, -D / 2); acc.add('shs60', D);
        Bm(mAcero, .08, H + .1, .08, s * (W / 2 - .05), (H + .1) / 2, -D); acc.add('shs80', H + .1);
      }
      Bm(mAcero, W, .08, .08, 0, H + .08, -D); acc.add('shs80', W);
      Bm(mMec, .05, .04, D - .1, 0, H + .25, -D / 2 - .02); // riel del motor
      Bm(mMotor, .3, .16, .42, 0, H + .23, -D - .1); Bm(mOscuro, .3, .02, .42, 0, H + .32, -D - .1);
      partes.carroRiel = Bm(mOscuro, .1, .07, .16, 0, H + .2, 0); partes.biela = Bm(mMec, .025, .025, 1, 0, 0, 0);
      geo.D = D; geo.anclaMotor = new THREE.Vector3(0, H + .36, -D - .1);
    }
    geo.anclaFoto = new THREE.Vector3(px - .23, .56, Z_HAZ); geo.anclaBaliza = new THREE.Vector3(px + .13, hp + .34, .13);
    // ficha de acero
    const t = acc.total(), rec = motorRecomendado(tipo, t.kg, W);
    ficha = { ...t, motor: rec, tipo, ancho: W, alto: H, hojas: tipo === 'batiente' ? 2 : 1 };
    Object.assign(S, { p: 0, v: 0, estado: 'cerrado', objetivo: 0, tPausa: 0 });
    Object.assign(car, { z: Z_FUERA, v: 0, objetivo: Z_FUERA, dentro: false, prueba: false });
    aplicar(); tema(cfg.dia);
  }

  function construirCarro() {
    const c = (m, sx, sy, sz, x, y, z, b) => caja(carro, m, sx, sy, sz, x, y, z, b);
    c(mat('carro'), 1.8, .62, LARGO, 0, .62, 0, true); c(mat('carro'), 1.62, .5, 2.2, 0, 1.17, .25, true);
    c(mat('vidrio'), 1.64, .36, 2.0, 0, 1.17, .25); c(mat('vidrio'), 1.5, .36, 2.22, 0, 1.17, .25);
    for (const x of [-.86, .86]) for (const z of [-1.3, 1.35]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(.33, .33, .22, 16), mOscuro); r.rotation.z = Math.PI / 2; r.position.set(x, .33, z); r.castShadow = true; carro.add(r); }
    for (const x of [-.62, .62]) { c(mFaro, .34, .12, .04, x, .7, -MITAD - .01); c(new THREE.MeshBasicMaterial({ color: 0xee5a4a }), .3, .1, .04, x, .72, MITAD + .01); }
    const f = new THREE.SpotLight(0xfff0c8, 0, 16, .5, .6, 1.4); f.position.set(0, .8, -MITAD); f.target.position.set(0, .2, -MITAD - 6); carro.add(f, f.target); partes0.faros = f;
  }
  const partes0 = {};

  /* ---------- aplicar la posición p (0 cerrado · 1 abierto) a la geometría ---------- */
  const vA = new THREE.Vector3(), vB = new THREE.Vector3();
  function aplicar() {
    const { p } = S, { W, H } = geo;
    if (cfg.tipo === 'corredizo') {
      const x = p * geo.T; partes.hoja.position.x = -W / 2 - .1 + x;
      partes.pinon.rotation.y = -x / .052; partes.ruedas.forEach(r => r.rotation.y = -x / .05);
    } else if (cfg.tipo === 'batiente') {
      const th = p * Math.PI / 2;
      partes.hojas.forEach(({ piv, s }) => piv.rotation.y = s < 0 ? th : Math.PI - th);
      porton.updateMatrixWorld(true);
      partes.brazos.forEach(({ br, vast, punta }) => { punta.getWorldPosition(vB); br.lookAt(vB); const d = vB.distanceTo(br.position); vast.scale.z = d; vast.position.z = d / 2; });
    } else {
      const fi = p * 86 * Math.PI / 180, yb = (H - .02) * (1 - Math.cos(fi));
      partes.piv.position.y = yb; partes.piv.rotation.x = -fi;
      const zt = -(H - .02) * Math.sin(fi), yt = H - .02;
      const cz = Math.min(-.45, zt - .42); partes.carroRiel.position.z = cz;
      vA.set(0, H + .17, cz); vB.set(0, yt - .03, zt - .02);
      partes.biela.position.copy(vA).add(vB).multiplyScalar(.5); partes.biela.lookAt(vB); partes.biela.scale.z = vA.distanceTo(vB);
    }
    carro.position.z = car.z;
  }

  /* ---------- día / noche ---------- */
  function tema(dia) {
    cfg.dia = !!dia; const P = dia ? PAL.dia : PAL.noche;
    for (const [rol, m] of Object.entries(M)) if (P[rol] !== undefined) m.color.setHex(P[rol]);
    if (M.ventana) { M.ventana.emissive.setHex(dia ? 0 : 0xffc66b); M.ventana.emissiveIntensity = dia ? 0 : .9; }
    scene.background = new THREE.Color(P.fondo); scene.fog.color.setHex(P.fondo);
    hemi.color.setHex(P.hemiC); hemi.groundColor.setHex(P.hemiS); hemi.intensity = P.hemiI;
    sol.color.setHex(P.solC); sol.intensity = P.solI; sol.position.set(...P.sol);
    mLinea.color.setHex(P.tinta); mLinea.opacity = P.tintaOp;
    mAcero.color.setHex(ACABADOS[cfg.acabado].color); mMotor.color.setHex(P.motor); mMec.color.setHex(P.mecanica);
    mLamp.emissiveIntensity = P.lampara * 2.2; luzL1.intensity = luzL2.intensity = P.lampara * 9;
    mFaro.emissiveIntensity = P.lampara * 2.5; if (partes0.faros) partes0.faros.intensity = P.lampara * 60;
  }

  /* ---------- órdenes ---------- */
  function cmd(orden, origen = 'Control') {
    const mov = S.estado === 'abriendo' || S.estado === 'cerrando';
    if (orden === 'pulso') orden = S.estado === 'cerrado' ? 'abrir' : S.estado === 'abierto' ? 'cerrar' : mov ? 'detener' : (S.objetivo === 1 ? 'cerrar' : 'abrir');
    if (orden === 'abrir' && S.p < 1) { S.objetivo = 1; if (S.estado !== 'abriendo') { S.estado = 'abriendo'; S.tMov = 0; evento('orden', `${origen}: abrir`); } }
    else if (orden === 'cerrar' && S.p > 0) {
      if (cfg.fotocelda && S.bloqueada) return evento('alerta', 'Fotocelda ocupada: no cierra');
      S.objetivo = 0; if (S.estado !== 'cerrando') { S.estado = 'cerrando'; S.tMov = 0; evento('orden', `${origen}: cerrar`); }
    } else if (orden === 'detener' && mov) { S.estado = 'detenido'; evento('orden', `${origen}: detener`); }
  }
  function mandarCarro(a) {
    car.prueba = false; car.pulsado = false;
    if (a === 'auto') a = car.z > 0 ? 'entrar' : 'salir';
    car.objetivo = a === 'entrar' ? Z_DENTRO : Z_FUERA; evento('carro', a === 'entrar' ? 'Llega un carro a la entrada' : 'El carro sale del predio');
  }
  function prueba() {
    if (!cfg.fotocelda) { cfg.fotocelda = true; evento('orden', 'Fotocelda activada para la prueba'); }
    if (car.z < 0) { car.z = Z_FUERA; car.v = 0; }
    Object.assign(car, { objetivo: Z_DENTRO, prueba: true, pruebaHecha: false, pulsado: false });
    evento('carro', 'Prueba: se ordena cerrar con el carro cruzando');
  }

  /* ---------- un paso de simulación ---------- */
  function step(dt) {
    S.reloj += dt;
    const frente = car.z - MITAD, cola = car.z + MITAD, [z0, z1] = geo.zona;
    S.bloqueada = frente < Z_HAZ && cola > Z_HAZ;
    const enZona = frente < z1 && cola > z0, paso = geo.pmin + .012;
    // carro
    if (Math.abs(car.objetivo - car.z) > .005 || Math.abs(car.v) > .01) {
      const dir = Math.sign(car.objetivo - car.z) || 1; let meta = car.objetivo;
      if (car.prueba) { // prueba de fotocelda: espera a que abra, arranca y se ordena cerrar mientras cruza
        const espera = 2.6 + MITAD;
        if (!car.pruebaHecha) {
          if (S.estado !== 'abierto') { meta = espera; if (car.z - espera < .3 && !car.pulsado) { car.pulsado = true; cmd('abrir', 'Control remoto'); } }
          else if (frente < 2.25) { car.pruebaHecha = true; cmd('cerrar', 'Tablero'); }
        }
      } else if (!enZona && S.p < paso) { // espera antes de la zona de barrido
        const linea = dir < 0 ? z1 + MITAD + .75 : z0 - MITAD - .5;
        if (dir < 0 ? car.z >= linea - .02 : car.z <= linea + .02) {
          meta = linea;
          if (Math.abs(car.z - linea) < .25 && !car.pulsado && S.estado !== 'abriendo') { car.pulsado = true; cmd('abrir', 'Control remoto'); }
        }
      }
      const vmax = car.prueba && cola > Z_HAZ ? 1.1 : 2.4, dist = Math.abs(meta - car.z), vd = Math.sign(meta - car.z) * Math.min(vmax, Math.sqrt(2 * 2.2 * dist));
      car.v += clamp(vd - car.v, -4.5 * dt, 4.5 * dt); car.z += car.v * dt;
      if (dist < .01 && Math.abs(car.v) < .05 && meta === car.objetivo) { car.z = car.objetivo; car.v = 0; car.prueba = false; }
    }
    // seguridades
    if (S.estado === 'cerrando') {
      if (cfg.fotocelda && S.bloqueada) { S.estado = 'abriendo'; S.objetivo = 1; S.tMov = 0; evento('alerta', 'Fotocelda interrumpida: invierte y abre'); }
      else if (enZona && S.p <= geo.pmin) { S.p = Math.max(S.p, geo.pmin - .004); S.v = 0; S.golpe = .5; S.estado = 'abriendo'; S.objetivo = 1; S.tMov = 0; evento('alerta', 'Obstáculo detectado por esfuerzo: invierte'); }
    }
    // cierre automático
    if (S.estado === 'abierto' && cfg.autocierre) {
      if (S.bloqueada || enZona) S.tPausa = 0; else { S.tPausa += dt; if (S.tPausa >= cfg.pausa) { S.tPausa = 0; cmd('cerrar', 'Cierre automático'); } }
    } else S.tPausa = 0;
    // motor: arranque y parada suaves
    const rampa = Math.min(.9, cfg.tiempo * .18), vmax = 1 / (cfg.tiempo - rampa), a = vmax / rampa, mov = S.estado === 'abriendo' || S.estado === 'cerrando';
    if (mov) {
      const d = S.objetivo - S.p, vd = Math.sign(d) * Math.min(vmax, Math.sqrt(2 * a * Math.abs(d)) + .004);
      S.v += clamp(vd - S.v, -2 * a * dt, 2 * a * dt); S.p += S.v * dt; S.tMov += dt;
      if ((S.objetivo === 1 && S.p >= 1) || (S.objetivo === 0 && S.p <= 0)) {
        S.p = S.objetivo; S.v = 0; S.estado = S.objetivo ? 'abierto' : 'cerrado';
        if (!S.objetivo) S.ciclos++; evento('estado', S.objetivo ? 'Portón abierto' : 'Portón cerrado'); S.tBaliza = 1;
      }
    } else if (S.v) { S.v -= clamp(S.v, -3 * a * dt, 3 * a * dt); S.p = clamp(S.p + S.v * dt, 0, 1); }
    // corriente simulada
    const inom = ficha.motor.inom; S.golpe = Math.max(0, S.golpe - dt);
    const obj = mov ? inom * (.38 + .5 * Math.abs(S.v) / vmax) * (1 + 1.3 * Math.exp(-S.tMov * 5)) + (S.golpe ? inom * 1.2 : 0) + .06 * Math.sin(S.reloj * 31) : .05;
    S.corriente += (obj - S.corriente) * Math.min(1, dt * 14);
    // baliza y haz
    S.tBaliza = Math.max(0, S.tBaliza - dt);
    const destello = cfg.lampara && (mov || S.tBaliza > 0) && (S.reloj * 2.2) % 1 < .5;
    mBaliza.emissiveIntensity = destello ? 3 : 0; luzBaliza.intensity = destello ? (cfg.dia ? 3 : 14) : 0;
    partes.haz.visible = cfg.fotocelda; mHaz.opacity = S.bloqueada ? .95 : .5; mHaz.color.setHex(S.bloqueada ? 0xff3b2e : 0xee7f74);
    aplicar();
  }

  /* ---------- cámara ---------- */
  const vistas = () => {
    const { W, H } = geo, t = cfg.tipo;
    return {
      calle: [[W * .9 + 5, 5.6, 13.5 + W], [0, H * .4, .5]],
      predio: [[W * .9 + 3.5, 3.6, -(7.5 + W * .7)], [0, H * .45, 0]],
      motor: t === 'corredizo' ? [[W / 2 + 2.7, 1.5, -3.1], [W / 2 + .5, .4, -.4]] : t === 'batiente' ? [[-W / 2 + 2.3, 2, -3.4], [-W / 2 + .25, .85, -.3]] : [[W / 2 + 3.4, H + 2.4, -H - 4.6], [0, H, -H / 2]],
      aerea: [[5, 17, 13], [0, 0, -1.5]],
    };
  };
  let vuelo = null;
  function vista(nombre, inmediata) {
    const [p, o] = vistas()[nombre] || vistas().calle, k = camera.aspect < 1 ? 1 + (1 - camera.aspect) * 1.25 : 1;
    const pos = new THREE.Vector3(...o).add(new THREE.Vector3(...p).sub(new THREE.Vector3(...o)).multiplyScalar(k)), obj = new THREE.Vector3(...o);
    if (inmediata) { camera.position.copy(pos); controls.target.copy(obj); controls.update(); vuelo = null; }
    else vuelo = { p0: camera.position.clone(), o0: controls.target.clone(), p1: pos, o1: obj, t: 0 };
  }
  function render(dt = 0) {
    if (vuelo) { vuelo.t = Math.min(1, vuelo.t + dt / .9); const e = suave(vuelo.t); camera.position.lerpVectors(vuelo.p0, vuelo.p1, e); controls.target.lerpVectors(vuelo.o0, vuelo.o1, e); if (vuelo.t >= 1) vuelo = null; }
    if (controls.enabled) controls.update();
    renderer.render(scene, camera);
  }
  function medida(w, h, dpr = Math.min(2, window.devicePixelRatio || 1)) { renderer.setPixelRatio(dpr); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  const vP = new THREE.Vector3();
  const rayo = new THREE.Raycaster(), vD = new THREE.Vector3();
  function tapado(v) { // ¿hay algo entre la cámara y el punto?
    const d = vD.copy(v).sub(camera.position).length(); rayo.set(camera.position, vD.normalize()); rayo.far = d - .45;
    return rayo.intersectObjects([entorno, porton], true).some(i => i.object.isMesh && i.object !== partes.haz);
  }
  function aPantalla(v, w, h) { vP.copy(v).project(camera); return { x: (vP.x * .5 + .5) * w, y: (-vP.y * .5 + .5) * h, visible: vP.z < 1 && Math.abs(vP.x) < 1.05 && Math.abs(vP.y) < 1.05 }; }

  construirCarro(); construir(); vista('calle', true);
  canvas.addEventListener('pointerdown', () => { vuelo = null; });

  return {
    cfg, S, car, camera, controls, renderer, scene, step, render, medida, vista, cmd, prueba, tema, aPantalla, tapado,
    carro: mandarCarro, verCarro(v) { carro.visible = v; },
    set(c) { const re = ['tipo', 'diseno', 'ancho', 'alto'].some(k => k in c && c[k] !== cfg[k]); Object.assign(cfg, c); if (re) construir(); else tema(cfg.dia); },
    get ficha() { return ficha; }, get geo() { return geo; },
    alEvento(f) { oyentes.push(f); },
    telemetria() {
      const v = Math.abs(S.v), t = cfg.tipo;
      return {
        estado: S.estado, apertura: S.p, corriente: S.corriente, potencia: S.corriente * (ficha.motor.dato.includes('24 V') ? 24 : 230) * (ficha.motor.dato.includes('24 V') ? 1 : .8),
        velocidad: t === 'corredizo' ? v * geo.T * 100 : v * (t === 'batiente' ? 90 : 86), unidadVel: t === 'corredizo' ? 'cm/s' : '°/s',
        ciclos: S.ciclos, pausa: S.estado === 'abierto' && cfg.autocierre ? Math.max(0, cfg.pausa - S.tPausa) : null, bloqueada: S.bloqueada, carroDentro: car.z < 0,
      };
    },
  };
}
