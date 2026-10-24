// =================================================================
// EXPLORADOR 3D — AceroStudio
// Edificio procedural en Three.js que se recorre piso por piso:
// selector de pisos, vistas exterior / corte / planta, marcadores
// estilo "Visor Rojo" y un recorrido guiado con ascensor.
// =================================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ---------- Paleta (lápiz rojo + revenido del acero) ----------
const C = {
  papel: 0xe9e6df,
  suelo: 0xdcd8cf,
  losa: 0xf1eee8,
  muro: 0xe4dfd5,
  aceroOscuro: 0x26292d,
  acero: 0x8a9199,
  vidrio: 0xa9c2cc,
  rojo: 0xcf2a1f,
  pajizo: 0xd9b26a,
  bronce: 0xb4733a,
  purpura: 0x6e4a8a,
  azul: 0x2f4f8f,
  azulClaro: 0x6f9fc8,
  grisAcero: 0x9aa1a8,
  madera: 0xc9a77c,
  verde: 0x7f9a5a,
  verdeOscuro: 0x5d7a45,
  asfalto: 0x3a3d42,
  andén: 0xcfcac0,
};

// ---------- Geometría general ----------
const ANCHO = 32;      // x
const FONDO = 20;      // z
const ALTO = 4.2;      // altura de piso a piso
const LOSA = 0.35;
const NUCLEO = { x: 11, z: -5, lado: 3.2 };  // núcleo del ascensor

// ---------- Textos ----------
const TXT = {
  es: {
    proyecto: 'Edificio Taller · Bogotá',
    brujula: 'Brújula',
    pantalla: 'Pantalla completa',
    iniciarRuta: 'Iniciar recorrido',
    cancelarRuta: 'Cancelar recorrido',
    general: 'Vista general',
    generalTag: 'Vista general',
    generalTitulo: 'Edificio Taller',
    generalTexto: 'Cuatro niveles en acero y vidrio. Elige un piso, cambia a corte o planta, o inicia el recorrido.',
    piso: 'Piso',
    area: 'Área',
    altura: 'Altura',
    puestos: 'Puestos',
    avisoCalle: 'Entrando desde la calle',
    avisoAscensor: 'Continuamos cuando se abran las puertas',
    avisoLlegada: 'Has llegado a',
    cargando: 'Cargando modelo',
  },
  en: {
    proyecto: 'Workshop Building · Bogotá',
    brujula: 'Compass',
    pantalla: 'Fullscreen',
    iniciarRuta: 'Start route',
    cancelarRuta: 'Cancel route',
    general: 'Overview',
    generalTag: 'Overview',
    generalTitulo: 'Workshop Building',
    generalTexto: 'Four levels of steel and glass. Pick a floor, switch to section or plan, or start the route.',
    piso: 'Floor',
    area: 'Area',
    altura: 'Height',
    puestos: 'Seats',
    avisoCalle: 'Walking in from the street',
    avisoAscensor: 'We will continue after the doors open',
    avisoLlegada: 'You have reached',
    cargando: 'Loading model',
  },
};

// Datos de cada piso. `destino` es a dónde camina el recorrido al salir del ascensor.
const PISOS = [
  {
    id: 'G',
    nombre: { es: 'Lobby', en: 'Lobby' },
    texto: {
      es: 'Recepción a doble altura con el muro de revenido: seis placas de acero templadas de pajizo a azul.',
      en: 'Reception with the temper wall: six steel plates heat-tinted from straw to blue.',
    },
    area: 520, puestos: 24,
    destino: [2, -1],
    puntos: [
      { p: [-4, 1.4, 4], es: 'Recepción', en: 'Reception' },
      { p: [-8, 2.2, -9.2], es: 'Muro de revenido', en: 'Temper wall' },
      { p: [NUCLEO.x, 2.8, NUCLEO.z + 1.8], es: 'Ascensor', en: 'Elevator' },
    ],
  },
  {
    id: '1',
    nombre: { es: 'Taller de materiales', en: 'Materials lab' },
    texto: {
      es: 'Mesas de maqueta, muestrario de acabados y el banco de prototipos en acero.',
      en: 'Model tables, finish library and the steel prototyping bench.',
    },
    area: 610, puestos: 18,
    destino: [-6, 2],
    puntos: [
      { p: [-6, 1.3, 2], es: 'Mesa de maquetas', en: 'Model table' },
      { p: [-13, 1.8, -8.6], es: 'Muestrario', en: 'Material library' },
    ],
  },
  {
    id: '2',
    nombre: { es: 'Estudio creativo', en: 'Creative studio' },
    texto: {
      es: 'Planta libre con puestos de diseño y una sala de juntas de vidrio sobre la fachada.',
      en: 'Open plan design desks and a glass meeting room on the façade.',
    },
    area: 610, puestos: 32,
    destino: [-2, 3],
    puntos: [
      { p: [-10, 2.2, 5], es: 'Sala de juntas', en: 'Meeting room' },
      { p: [2, 1.3, -2], es: 'Puestos de diseño', en: 'Design desks' },
    ],
  },
  {
    id: '3',
    nombre: { es: 'Estrategia + terraza', en: 'Strategy + terrace' },
    texto: {
      es: 'Sala de estrategia, biblioteca de proyectos y salida a la terraza verde con pérgola de acero.',
      en: 'Strategy room, project library and access to the green roof with a steel pergola.',
    },
    area: 480, puestos: 14,
    destino: [-4, 0],
    puntos: [
      { p: [-4, 1.6, 0], es: 'Sala de estrategia', en: 'Strategy room' },
      { p: [6, ALTO + 1.6, 4], es: 'Terraza', en: 'Roof terrace' },
    ],
  },
];

// ---------- Estado ----------
let idioma = 'es';
let pisoActivo = null;      // null = vista general
let modo = 'exterior';      // exterior | corte | planta
let ruta = null;            // estado del recorrido cuando está activo

// ---------- Escena ----------
const contenedor = document.getElementById('escena');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
contenedor.appendChild(renderer.domElement);

const escena = new THREE.Scene();
escena.background = new THREE.Color(C.papel);
escena.fog = new THREE.Fog(C.papel, 120, 260);

const camara = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 500);
camara.position.set(52, 34, 62);

const controles = new OrbitControls(camara, renderer.domElement);
controles.enableDamping = true;
controles.dampingFactor = 0.08;
controles.maxPolarAngle = Math.PI * 0.495;
controles.minDistance = 6;
controles.maxDistance = 220;
controles.target.set(0, 7, 0);

escena.add(new THREE.HemisphereLight(0xf7f4ee, 0xb9b2a3, 1.25));
const sol = new THREE.DirectionalLight(0xfff6e8, 2.1);
sol.position.set(-30, 50, 35);
sol.castShadow = true;
sol.shadow.mapSize.set(2048, 2048);
Object.assign(sol.shadow.camera, { left: -50, right: 50, top: 50, bottom: -50, near: 1, far: 140 });
sol.shadow.bias = -0.0005;
escena.add(sol);

// ---------- Fábrica de materiales y piezas ----------
const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05, ...extra });
const MAT = {
  losa: mat(C.losa),
  muro: mat(C.muro),
  aceroOscuro: mat(C.aceroOscuro, { roughness: 0.45, metalness: 0.6 }),
  acero: mat(C.acero, { roughness: 0.4, metalness: 0.7 }),
  vidrio: mat(C.vidrio, { transparent: true, opacity: 0.26, roughness: 0.1, metalness: 0.2, depthWrite: false }),
  madera: mat(C.madera),
  verde: mat(C.verde, { flatShading: true }),
  verdeOscuro: mat(C.verdeOscuro, { flatShading: true }),
  blanco: mat(0xf7f6f2),
  rojo: mat(C.rojo, { emissive: C.rojo, emissiveIntensity: 0.25 }),
};
const lineaMat = new THREE.LineBasicMaterial({ color: C.aceroOscuro, transparent: true, opacity: 0.35 });

function caja(w, h, d, material, x = 0, y = 0, z = 0, { sombra = true, bordes = false } = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y + h / 2, z);
  m.castShadow = sombra;
  m.receiveShadow = true;
  if (bordes) m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), lineaMat));
  return m;
}

function arbol(x, z, escala = 1) {
  const g = new THREE.Group();
  const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 4.5, 6), mat(0x6b5a48));
  tronco.position.y = 2.25;
  tronco.castShadow = true;
  g.add(tronco);
  const copas = [[0, 5.2, 0, 1.6], [0.9, 4.6, 0.4, 1.1], [-0.8, 4.8, -0.3, 1.2], [0.2, 6.1, -0.2, 1.0]];
  for (const [cx, cy, cz, r] of copas) {
    const c = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), Math.random() > 0.5 ? MAT.verde : MAT.verdeOscuro);
    c.position.set(cx, cy, cz);
    c.castShadow = true;
    g.add(c);
  }
  g.position.set(x, 0, z);
  g.scale.setScalar(escala);
  return g;
}

function planta(x, y, z, s = 1) {
  const g = new THREE.Group();
  g.add(caja(0.5 * s, 0.45 * s, 0.5 * s, MAT.aceroOscuro));
  const hoja = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5 * s, 0), MAT.verde);
  hoja.position.y = 0.95 * s;
  hoja.castShadow = true;
  g.add(hoja);
  g.position.set(x, y, z);
  return g;
}

function escritorio(x, y, z, rot = 0) {
  const g = new THREE.Group();
  g.add(caja(1.6, 0.05, 0.8, MAT.madera, 0, 0.72, 0));
  g.add(caja(0.05, 0.72, 0.7, MAT.aceroOscuro, -0.75, 0, 0, { sombra: false }));
  g.add(caja(0.05, 0.72, 0.7, MAT.aceroOscuro, 0.75, 0, 0, { sombra: false }));
  g.add(caja(0.55, 0.35, 0.03, MAT.aceroOscuro, 0, 0.77, -0.25));
  g.add(caja(0.5, 0.45, 0.5, MAT.acero, 0, 0, 0.65));
  g.position.set(x, y, z);
  g.rotation.y = rot;
  return g;
}

function cuartoVidrio(w, d, x, y, z) {
  const g = new THREE.Group();
  const h = ALTO - LOSA - 0.05;
  g.add(caja(w, h, d, MAT.vidrio, x, y, z, { sombra: false, bordes: true }));
  return g;
}

// ---------- Sitio ----------
const sitio = new THREE.Group();
escena.add(sitio);
{
  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat(C.suelo));
  suelo.rotation.x = -Math.PI / 2;
  suelo.receiveShadow = true;
  sitio.add(suelo);
  sitio.add(caja(ANCHO + 14, 0.12, FONDO + 12, mat(0xe2ded6), 0, 0, -1, { sombra: false }));
  sitio.add(caja(200, 0.04, 9, mat(C.asfalto), 0, 0, FONDO / 2 + 14, { sombra: false }));
  sitio.add(caja(200, 0.16, 3.2, mat(C.andén), 0, 0, FONDO / 2 + 8, { sombra: false }));
  // Líneas de cebra frente a la entrada
  for (let i = 0; i < 6; i++) sitio.add(caja(0.6, 0.06, 6, MAT.blanco, -14 + i * 1.2, 0, FONDO / 2 + 14, { sombra: false }));
  // Árboles, bancas y postes en el andén
  [-26, -14, 4, 18, 30].forEach((x, i) => sitio.add(arbol(x, FONDO / 2 + 8, 0.9 + (i % 3) * 0.12)));
  [-20, 24].forEach((x) => sitio.add(arbol(x, -FONDO / 2 - 5, 1.1)));
  [-20, 10, 24].forEach((x) => {
    sitio.add(caja(2.4, 0.45, 0.7, MAT.madera, x, 0.16, FONDO / 2 + 7.2));
    const poste = caja(0.12, 5, 0.12, MAT.aceroOscuro, x + 3, 0, FONDO / 2 + 9.2);
    sitio.add(poste);
  });
  // Jardineras
  sitio.add(caja(8, 0.6, 1.2, MAT.aceroOscuro, 4, 0, FONDO / 2 + 2.4));
  sitio.add(caja(7.8, 0.4, 1.0, MAT.verde, 4, 0.6, FONDO / 2 + 2.4));
  sitio.add(caja(6, 0.6, 1.2, MAT.aceroOscuro, -20, 0, FONDO / 2 + 2.4));
  sitio.add(caja(5.8, 0.4, 1.0, MAT.verde, -20, 0.6, FONDO / 2 + 2.4));
}

// Cabina del ascensor (fuera de los pisos para poder subirla)
const cabina = new THREE.Group();
cabina.add(caja(2.4, 0.12, 2.4, MAT.aceroOscuro));
cabina.add(caja(2.4, 2.7, 2.4, MAT.vidrio, 0, 0.12, 0, { sombra: false, bordes: true }));
cabina.add(caja(2.4, 0.12, 2.4, MAT.aceroOscuro, 0, 2.82, 0));
cabina.position.set(NUCLEO.x, LOSA, NUCLEO.z);
escena.add(cabina);

// ---------- Edificio ----------
const pisos = PISOS.map((datos, i) => construirPiso(datos, i));

function construirPiso(datos, i) {
  const g = new THREE.Group();
  const y0 = i * ALTO;
  const suelo = y0 + LOSA;
  const fachada = new THREE.Group();
  fachada.userData.fachada = true;

  // Losa
  g.add(caja(ANCHO, LOSA, FONDO, MAT.losa, 0, y0, 0, { bordes: true }));
  // Piso interior con acabado distinto por nivel
  const acabados = [0xd8d2c6, 0xcfc9be, 0xe2dccf, 0xd4cbbb];
  g.add(caja(ANCHO - 0.6, 0.02, FONDO - 0.6, mat(acabados[i]), 0, suelo, 0, { sombra: false }));

  // Columnas de acero
  for (let x = -ANCHO / 2 + 0.3; x <= ANCHO / 2; x += 7.85) {
    for (const z of [-FONDO / 2 + 0.3, 0, FONDO / 2 - 0.3]) {
      g.add(caja(0.32, ALTO - LOSA, 0.32, MAT.aceroOscuro, x, suelo, z));
    }
  }

  // Núcleo del ascensor (cuatro marcos + vidrio)
  g.add(caja(NUCLEO.lado, ALTO - LOSA, 0.25, MAT.muro, NUCLEO.x, suelo, NUCLEO.z - NUCLEO.lado / 2));
  g.add(caja(0.25, ALTO - LOSA, NUCLEO.lado, MAT.muro, NUCLEO.x + NUCLEO.lado / 2, suelo, NUCLEO.z));
  g.add(caja(0.25, ALTO - LOSA, NUCLEO.lado, MAT.muro, NUCLEO.x - NUCLEO.lado / 2, suelo, NUCLEO.z));
  g.add(caja(0.12, ALTO - LOSA, 0.12, MAT.rojo, NUCLEO.x - 1.3, suelo, NUCLEO.z + NUCLEO.lado / 2));
  g.add(caja(0.12, ALTO - LOSA, 0.12, MAT.rojo, NUCLEO.x + 1.3, suelo, NUCLEO.z + NUCLEO.lado / 2));

  // Fachada trasera e izquierda: muro macizo con franja de ventana
  const hMuro = 1.1;
  g.add(caja(ANCHO, hMuro, 0.3, MAT.muro, 0, suelo, -FONDO / 2));
  g.add(caja(ANCHO, 0.7, 0.3, MAT.muro, 0, y0 + ALTO - 0.7, -FONDO / 2));
  g.add(caja(ANCHO, ALTO - LOSA - hMuro - 0.7, 0.05, MAT.vidrio, 0, suelo + hMuro, -FONDO / 2, { sombra: false }));
  g.add(caja(0.3, hMuro, FONDO, MAT.muro, -ANCHO / 2, suelo, 0));
  g.add(caja(0.3, 0.7, FONDO, MAT.muro, -ANCHO / 2, y0 + ALTO - 0.7, 0));
  g.add(caja(0.05, ALTO - LOSA - hMuro - 0.7, FONDO, MAT.vidrio, -ANCHO / 2, suelo + hMuro, 0, { sombra: false }));

  // Fachada principal y lateral derecha: muro cortina + aletas verticales (se ocultan en corte)
  const hVidrio = ALTO - LOSA;
  fachada.add(caja(ANCHO, hVidrio, 0.06, MAT.vidrio, 0, suelo, FONDO / 2, { sombra: false }));
  fachada.add(caja(0.06, hVidrio, FONDO, MAT.vidrio, ANCHO / 2, suelo, 0, { sombra: false }));
  for (let x = -ANCHO / 2; x <= ANCHO / 2 + 0.01; x += 2) {
    fachada.add(caja(0.07, hVidrio, 0.45, MAT.acero, x, suelo, FONDO / 2 + 0.25));
  }
  for (let z = -FONDO / 2; z <= FONDO / 2 + 0.01; z += 2) {
    fachada.add(caja(0.45, hVidrio, 0.07, MAT.acero, ANCHO / 2 + 0.25, suelo, z));
  }
  // Baranda de piso (línea horizontal a 1 m)
  fachada.add(caja(ANCHO, 0.06, 0.1, MAT.aceroOscuro, 0, suelo + 1.0, FONDO / 2 + 0.06, { sombra: false }));
  g.add(fachada);

  // Interior según el uso
  const interior = [amoblarLobby, amoblarTaller, amoblarEstudio, amoblarEstrategia][i];
  interior(g, suelo);

  // Cubierta sobre el último piso
  if (i === PISOS.length - 1) construirCubierta(g, y0 + ALTO);

  // Materiales propios por piso para poder desvanecerlos sin afectar a los demás
  const propios = new Map();
  g.traverse((o) => {
    if (!o.material) return;
    if (!propios.has(o.material)) {
      const copia = o.material.clone();
      copia.userData.base = copia.opacity;
      copia.userData.transparente = copia.transparent;
      propios.set(o.material, copia);
    }
    o.material = propios.get(o.material);
  });

  g.userData = { indice: i, fachada, materiales: [...propios.values()], opacidad: 1, elevacion: 0, metaOpacidad: 1, metaElevacion: 0 };
  escena.add(g);
  return g;
}

function amoblarLobby(g, y) {
  // Recepción en bronce
  g.add(caja(5, 1.1, 1, mat(C.bronce, { metalness: 0.6, roughness: 0.35 }), -4, y, 4));
  g.add(caja(5.2, 0.06, 1.2, MAT.blanco, -4, y + 1.1, 4));
  // Muro de revenido: seis placas de acero templado
  const revenido = [C.pajizo, C.bronce, C.purpura, C.azul, C.azulClaro, C.grisAcero];
  revenido.forEach((color, k) => {
    g.add(caja(1.5, 2.8, 0.08, mat(color, { metalness: 0.75, roughness: 0.3 }), -12 + k * 1.65, y + 0.4, -FONDO / 2 + 0.5));
  });
  // Sala de espera
  g.add(caja(3.2, 0.45, 1, MAT.aceroOscuro, 2, y, 5.5));
  g.add(caja(3.2, 0.5, 0.25, MAT.aceroOscuro, 2, y + 0.45, 6.1));
  g.add(caja(1.2, 0.4, 1.2, MAT.madera, 2, y, 3.8));
  g.add(planta(-9, y, 6, 1.4));
  g.add(planta(6, y, 7, 1.2));
  g.add(planta(-14, y, 2, 1.3));
  // Torniquetes hacia el ascensor
  for (let k = 0; k < 3; k++) g.add(caja(0.2, 1, 1.4, MAT.acero, 7 + k * 1.2, y, 0));
}

function amoblarTaller(g, y) {
  // Mesas de maqueta con maquetas encima
  for (let k = 0; k < 3; k++) {
    const x = -10 + k * 5;
    g.add(caja(3.6, 0.9, 1.8, MAT.madera, x, y, 2));
    g.add(caja(0.8, 0.6, 0.6, MAT.blanco, x - 0.6, y + 0.9, 2, { bordes: true }));
    g.add(caja(0.5, 1.0, 0.5, MAT.blanco, x + 0.6, y + 0.9, 1.8, { bordes: true }));
  }
  // Muestrario de acabados (estantería con muestras de colores de revenido)
  g.add(caja(8, 2.4, 0.6, MAT.aceroOscuro, -11, y, -FONDO / 2 + 0.8));
  const revenido = [C.pajizo, C.bronce, C.purpura, C.azul, C.azulClaro, C.grisAcero];
  for (let f = 0; f < 3; f++) {
    for (let k = 0; k < 10; k++) {
      g.add(caja(0.5, 0.45, 0.1, mat(revenido[(k + f) % 6], { metalness: 0.7, roughness: 0.35 }), -14.6 + k * 0.78, y + 0.3 + f * 0.7, -FONDO / 2 + 1.15, { sombra: false }));
    }
  }
  // Banco de prototipos en acero
  g.add(caja(6, 0.95, 1.4, MAT.acero, 3, y, -6));
  g.add(caja(1, 0.5, 0.8, MAT.rojo, 2, y + 0.95, -6));
  g.add(planta(-14, y, 7));
  g.add(planta(6, y, 7));
}

function amoblarEstudio(g, y) {
  // Filas de puestos
  for (let fila = 0; fila < 3; fila++) {
    for (let k = 0; k < 5; k++) {
      g.add(escritorio(-2 + k * 2, y, -6 + fila * 3.2));
    }
  }
  // Sala de juntas de vidrio sobre la fachada
  g.add(cuartoVidrio(7, 5, -10, y, 5.5));
  g.add(caja(4.5, 0.75, 1.6, MAT.madera, -10, y, 5.5));
  for (let k = 0; k < 4; k++) {
    g.add(caja(0.5, 0.45, 0.5, mat([C.pajizo, C.azul, C.bronce, C.purpura][k]), -11.6 + k * 1.1, y, 4.2));
    g.add(caja(0.5, 0.45, 0.5, mat([C.azul, C.pajizo, C.purpura, C.bronce][k]), -11.6 + k * 1.1, y, 6.8));
  }
  g.add(planta(4.5, y, 6, 1.3));
  g.add(planta(-14, y, -6, 1.2));
}

function amoblarEstrategia(g, y) {
  // Sala de estrategia (caja de vidrio central)
  g.add(cuartoVidrio(9, 6, -4, y, 0));
  g.add(caja(6, 0.75, 2, MAT.aceroOscuro, -4, y, 0));
  for (let k = 0; k < 5; k++) {
    g.add(caja(0.5, 0.45, 0.5, MAT.rojo, -6.2 + k * 1.1, y, -1.4));
    g.add(caja(0.5, 0.45, 0.5, MAT.acero, -6.2 + k * 1.1, y, 1.4));
  }
  // Biblioteca de proyectos
  g.add(caja(10, 2.6, 0.5, MAT.madera, -6, y, -FONDO / 2 + 0.7));
  // Lounge
  g.add(caja(3, 0.45, 1, mat(C.azul), 6, y, 5));
  g.add(caja(1, 0.4, 1, MAT.madera, 6, y, 3.4));
  g.add(planta(-13, y, 6, 1.3));
  g.add(planta(4, y, -6, 1.1));
}

function construirCubierta(g, y) {
  g.add(caja(ANCHO, LOSA, FONDO, MAT.losa, 0, y, 0, { bordes: true }));
  const techo = y + LOSA;
  // Baranda perimetral
  g.add(caja(ANCHO, 0.06, 0.06, MAT.aceroOscuro, 0, techo + 1.05, FONDO / 2 - 0.1, { sombra: false }));
  g.add(caja(ANCHO, 0.06, 0.06, MAT.aceroOscuro, 0, techo + 1.05, -FONDO / 2 + 0.1, { sombra: false }));
  g.add(caja(0.06, 0.06, FONDO, MAT.aceroOscuro, ANCHO / 2 - 0.1, techo + 1.05, 0, { sombra: false }));
  g.add(caja(0.06, 0.06, FONDO, MAT.aceroOscuro, -ANCHO / 2 + 0.1, techo + 1.05, 0, { sombra: false }));
  for (let x = -ANCHO / 2; x <= ANCHO / 2; x += 2) g.add(caja(0.05, 1.05, 0.05, MAT.aceroOscuro, x, techo, FONDO / 2 - 0.1, { sombra: false }));
  // Jardín
  g.add(caja(12, 0.5, 8, MAT.verde, -8, techo, -3));
  g.add(caja(6, 0.5, 4, MAT.verde, 10, techo, 6));
  g.add(planta(-12, techo + 0.5, -5, 1.6));
  g.add(planta(-5, techo + 0.5, -1, 1.4));
  // Pérgola de acero
  for (const [x, z] of [[2, 1], [10, 1], [2, 7], [10, 7]]) g.add(caja(0.18, 3, 0.18, MAT.aceroOscuro, x, techo, z));
  for (let x = 2; x <= 10.01; x += 0.8) g.add(caja(0.08, 0.2, 6.2, MAT.aceroOscuro, x, techo + 3, 4));
  g.add(caja(8.2, 0.2, 0.18, MAT.aceroOscuro, 6, techo + 2.85, 1));
  g.add(caja(8.2, 0.2, 0.18, MAT.aceroOscuro, 6, techo + 2.85, 7));
  g.add(caja(4, 0.75, 1.4, MAT.madera, 6, techo, 4));
  // Sobrecubierta del ascensor
  g.add(caja(NUCLEO.lado, 2.6, NUCLEO.lado, MAT.muro, NUCLEO.x, techo, NUCLEO.z));
}

// ---------- Marcadores (estilo Visor Rojo) ----------
const capaEtiquetas = document.getElementById('etiquetas');
const marcadores = [];

function crearMarcador({ pos, texto, piso, tipo, alClic }) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'ex-marcador oculto';
  el.innerHTML = '<span class="rombo"></span><span class="tag"></span>';
  el.addEventListener('click', (e) => { e.stopPropagation(); alClic(m); });
  capaEtiquetas.appendChild(el);
  const m = { el, pos: new THREE.Vector3(...pos), texto, piso, tipo };
  marcadores.push(m);
  return m;
}

PISOS.forEach((datos, i) => {
  // Un marcador por piso en la esquina de la fachada (vista general)
  crearMarcador({
    pos: [ANCHO / 2 + 0.8, i * ALTO + ALTO / 2, FONDO / 2 + 0.8],
    texto: () => `${datos.id} · ${datos.nombre[idioma]}`,
    piso: i,
    tipo: 'piso',
    alClic: () => seleccionarPiso(i),
  });
  // Puntos de interés dentro del piso
  datos.puntos.forEach((p) => {
    crearMarcador({
      pos: [p.p[0], i * ALTO + LOSA + p.p[1], p.p[2]],
      texto: () => p[idioma],
      piso: i,
      tipo: 'punto',
      alClic: (m) => enfocarPunto(m),
    });
  });
});

const proyectado = new THREE.Vector3();
function actualizarMarcadores() {
  for (const m of marcadores) {
    const piso = pisos[m.piso];
    const visible = !ruta && piso.visible && piso.userData.opacidad > 0.6 &&
      (pisoActivo === null ? m.tipo === 'piso' : m.tipo === 'punto' && m.piso === pisoActivo);
    proyectado.copy(m.pos);
    proyectado.y += piso.userData.elevacion;
    proyectado.project(camara);
    const detras = proyectado.z > 1;
    m.el.classList.toggle('oculto', !visible || detras);
    if (!visible || detras) continue;
    const x = (proyectado.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-proyectado.y * 0.5 + 0.5) * window.innerHeight;
    m.el.style.transform = `translate(${x - 5}px, ${y - 7}px)`;
    const tag = m.el.querySelector('.tag');
    const t = m.texto();
    if (tag.textContent !== t) tag.textContent = t;
  }
}

// ---------- Cámara animada ----------
const viaje = { activo: false, t: 0, dur: 1, desdePos: new THREE.Vector3(), haciaPos: new THREE.Vector3(), desdeObj: new THREE.Vector3(), haciaObj: new THREE.Vector3() };
const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function volarA(pos, objetivo, dur = 1.4) {
  viaje.desdePos.copy(camara.position);
  viaje.desdeObj.copy(controles.target);
  viaje.haciaPos.copy(pos);
  viaje.haciaObj.copy(objetivo);
  viaje.t = 0;
  viaje.dur = dur;
  viaje.activo = true;
}

function vistaPara(indice, tipoVista = modo) {
  const y = indice === null ? 7 : indice * ALTO + 1.5;
  const objetivo = new THREE.Vector3(0, y, 0);
  let off;
  if (tipoVista === 'planta') off = new THREE.Vector3(0, 46, 0.01);
  else if (tipoVista === 'corte') off = new THREE.Vector3(4, 14, 40);
  else off = indice === null ? new THREE.Vector3(42, 24, 50) : new THREE.Vector3(30, 34, 34);
  // En pantallas verticales la cámara se aleja para que quepa el edificio
  const lejos = Math.min(2.6, Math.max(1, 1.1 / camara.aspect));
  off.multiplyScalar(lejos);
  // y se apunta un poco más abajo del centro para que la ficha no tape el modelo
  if (lejos > 1 && tipoVista !== 'planta') objetivo.y -= 3;
  return { pos: objetivo.clone().add(off), objetivo };
}

// ---------- Interfaz ----------
const $ = (id) => document.getElementById(id);
const t = (k) => TXT[idioma][k];

function pintarListaPisos() {
  const ul = $('listaPisos');
  ul.innerHTML = '';
  [...PISOS].reverse().forEach((datos) => {
    const i = PISOS.indexOf(datos);
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.className = pisoActivo === i ? 'activo' : '';
    b.innerHTML = `<strong>${datos.id}</strong><span>${datos.nombre[idioma]}</span>`;
    b.addEventListener('click', () => seleccionarPiso(pisoActivo === i ? null : i));
    li.appendChild(b);
    ul.appendChild(li);
  });
}

function pintarFicha(extra) {
  const datos = pisoActivo === null ? null : PISOS[pisoActivo];
  $('fichaTag').textContent = datos ? `${t('piso')} ${datos.id}` : t('generalTag');
  $('fichaTitulo').textContent = extra?.titulo ?? (datos ? datos.nombre[idioma] : t('generalTitulo'));
  $('fichaTexto').textContent = datos ? datos.texto[idioma] : t('generalTexto');
  const dl = $('fichaDatos');
  dl.innerHTML = '';
  const filas = datos
    ? [[t('area'), `${datos.area} m²`], [t('altura'), `${ALTO} m`], [t('puestos'), datos.puestos]]
    : [[t('area'), `${PISOS.reduce((s, p) => s + p.area, 0)} m²`], [t('altura'), `${(PISOS.length * ALTO).toFixed(1)} m`], [t('puestos'), PISOS.reduce((s, p) => s + p.puestos, 0)]];
  for (const [k, v] of filas) {
    const d = document.createElement('div');
    d.innerHTML = `<dt>${k}</dt><dd>${v}</dd>`;
    dl.appendChild(d);
  }
  $('migas').textContent = datos ? `${t('piso')} ${datos.id} · ${datos.nombre[idioma]}` : t('general');
  const btn = $('btnRuta');
  btn.classList.toggle('cancelar', !!ruta);
  btn.firstElementChild.textContent = ruta ? t('cancelarRuta') : t('iniciarRuta');
}

function pintarTextos() {
  document.documentElement.lang = idioma;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $('btnIdioma').textContent = idioma === 'es' ? 'EN' : 'ES';
  pintarListaPisos();
  pintarFicha();
}

function aplicarVisibilidad(tope = pisoActivo) {
  pisos.forEach((p, i) => {
    const arriba = tope !== null && i > tope;
    p.userData.metaOpacidad = arriba ? 0 : 1;
    p.userData.metaElevacion = arriba ? 14 + (i - tope) * 5 : 0;
    // En corte y planta se retira la fachada que da a la cámara
    p.userData.fachada.visible = modo === 'exterior' && !ruta;
  });
}

function seleccionarPiso(i) {
  if (ruta) cancelarRuta();
  pisoActivo = i;
  aplicarVisibilidad();
  const v = vistaPara(i);
  volarA(v.pos, v.objetivo);
  marcadores.forEach((m) => m.el.classList.remove('abierto'));
  pintarListaPisos();
  pintarFicha();
}

function cambiarModo(nuevo) {
  modo = nuevo;
  document.querySelectorAll('.ex-modos button').forEach((b) => b.classList.toggle('activo', b.dataset.modo === modo));
  aplicarVisibilidad();
  const v = vistaPara(pisoActivo);
  volarA(v.pos, v.objetivo);
}

function enfocarPunto(m) {
  marcadores.forEach((o) => o.el.classList.toggle('abierto', o === m));
  const objetivo = m.pos.clone();
  const pos = objetivo.clone().add(camara.position.clone().sub(controles.target).setLength(14));
  pos.y = Math.max(pos.y, objetivo.y + 6);
  volarA(pos, objetivo, 1.1);
  pintarFicha({ titulo: m.texto() });
}

let avisoTimer;
function avisar(texto, ms = 2600) {
  const el = $('aviso');
  el.textContent = texto;
  el.classList.add('visible');
  clearTimeout(avisoTimer);
  if (ms) avisoTimer = setTimeout(() => el.classList.remove('visible'), ms);
}

// ---------- Recorrido guiado ----------
function crearPersona() {
  const g = new THREE.Group();
  const cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 1.2, 10), MAT.rojo);
  cuerpo.position.y = 0.6 + 0.35;
  const piernas = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.35 + 0.4, 10), MAT.aceroOscuro);
  piernas.position.y = 0.37;
  const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), MAT.blanco);
  cabeza.position.y = 1.78;
  for (const p of [cuerpo, piernas, cabeza]) { p.castShadow = true; g.add(p); }
  // Halo rojo bajo los pies
  const halo = new THREE.Mesh(new THREE.RingGeometry(0.45, 0.6, 32), new THREE.MeshBasicMaterial({ color: C.rojo, transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = 0.03;
  g.add(halo);
  return g;
}

function lineaRoja(puntos) {
  const geo = new THREE.BufferGeometry().setFromPoints(puntos.map((p) => p.clone().setY(p.y + 0.06)));
  const linea = new THREE.Line(geo, new THREE.LineDashedMaterial({ color: C.rojo, dashSize: 0.5, gapSize: 0.3 }));
  linea.computeLineDistances();
  return linea;
}

function iniciarRuta() {
  const destino = pisoActivo ?? 2;
  pisoActivo = destino;
  const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const suelo0 = LOSA;
  const sueloN = destino * ALTO + LOSA;
  const frente = v3(NUCLEO.x, suelo0, NUCLEO.z + NUCLEO.lado / 2 + 1.2);
  const tramoCalle = [v3(-8, 0.16, FONDO / 2 + 9), v3(-8, suelo0, FONDO / 2 + 1), v3(-8, suelo0, FONDO / 2 - 2), v3(4, suelo0, 1.5), frente, v3(NUCLEO.x, suelo0, NUCLEO.z)];
  const [dx, dz] = PISOS[destino].destino;
  const tramoPiso = [v3(NUCLEO.x, sueloN, NUCLEO.z), v3(NUCLEO.x, sueloN, NUCLEO.z + NUCLEO.lado / 2 + 1.2), v3(dx, sueloN, dz)];

  const persona = crearPersona();
  persona.position.copy(tramoCalle[0]);
  escena.add(persona);
  const lineas = [lineaRoja(tramoCalle)];
  if (destino > 0) lineas.push(lineaRoja(tramoPiso));
  lineas.forEach((l) => escena.add(l));

  const pasos = [{ tipo: 'caminar', puntos: tramoCalle, aviso: t('avisoCalle') }];
  if (destino > 0) {
    pasos.push({ tipo: 'puertas', dur: 0.9, aviso: t('avisoAscensor') });
    pasos.push({ tipo: 'subir', desde: suelo0, hasta: sueloN, dur: 1.4 + destino * 0.9 });
    pasos.push({ tipo: 'puertas', dur: 0.9 });
    pasos.push({ tipo: 'caminar', puntos: tramoPiso });
  } else {
    pasos[0].puntos = tramoCalle.slice(0, 4).concat([v3(dx, suelo0, dz)]);
  }

  ruta = { persona, lineas, pasos, paso: 0, t: 0, destino, nivel: 0 };
  aplicarVisibilidad(0);
  pintarListaPisos();
  pintarFicha();
  empezarPaso();
}

function empezarPaso() {
  const p = ruta.pasos[ruta.paso];
  ruta.t = 0;
  if (p.aviso) avisar(p.aviso, p.tipo === 'puertas' ? 0 : 2600);
  else if (p.tipo === 'caminar') $('aviso').classList.remove('visible');
  if (p.tipo === 'caminar') {
    p.largos = [];
    p.total = 0;
    for (let k = 1; k < p.puntos.length; k++) {
      const l = p.puntos[k].distanceTo(p.puntos[k - 1]);
      p.largos.push(l);
      p.total += l;
    }
    p.dur = p.total / 3.2; // m/s acelerado para el recorrido
  }
}

const temp = new THREE.Vector3();
function avanzarRuta(dt) {
  const p = ruta.pasos[ruta.paso];
  ruta.t += dt;
  const f = Math.min(ruta.t / p.dur, 1);
  const persona = ruta.persona;

  if (p.tipo === 'caminar') {
    let d = f * p.total;
    let k = 0;
    while (k < p.largos.length - 1 && d > p.largos[k]) { d -= p.largos[k]; k++; }
    const a = p.puntos[k];
    const b = p.puntos[k + 1];
    persona.position.lerpVectors(a, b, Math.min(d / p.largos[k], 1));
    persona.rotation.y = Math.atan2(b.x - a.x, b.z - a.z);
    persona.children[0].position.y = 0.95 + Math.abs(Math.sin(ruta.t * 9)) * 0.05;
  } else if (p.tipo === 'subir') {
    const y = THREE.MathUtils.lerp(p.desde, p.hasta, suave(f));
    persona.position.y = y;
    cabina.position.y = y;
  }

  // Corte dinámico: solo se ven los pisos hasta el nivel donde está la persona
  const nivel = Math.min(Math.floor((persona.position.y + 0.5) / ALTO), PISOS.length - 1);
  if (nivel !== ruta.nivel) { ruta.nivel = nivel; aplicarVisibilidad(nivel); }

  // La cámara sigue a la persona por detrás y arriba
  const objetivo = temp.copy(persona.position).add(new THREE.Vector3(0, 1.4, 0));
  const deseada = objetivo.clone().add(new THREE.Vector3(9, 8, 15));
  camara.position.lerp(deseada, 1 - Math.pow(0.04, dt));
  controles.target.lerp(objetivo, 1 - Math.pow(0.02, dt));

  if (f >= 1) {
    ruta.paso++;
    if (ruta.paso >= ruta.pasos.length) return terminarRuta();
    empezarPaso();
  }
}

function terminarRuta() {
  const destino = ruta.destino;
  avisar(`${t('avisoLlegada')} ${PISOS[destino].nombre[idioma]}`, 3000);
  limpiarRuta(false);
}

function cancelarRuta() {
  $('aviso').classList.remove('visible');
  limpiarRuta(true);
}

function limpiarRuta(devolverCabina) {
  if (!ruta) return;
  escena.remove(ruta.persona);
  ruta.lineas.forEach((l) => escena.remove(l));
  ruta = null;
  if (devolverCabina) cabina.position.y = LOSA;
  aplicarVisibilidad();
  pintarFicha();
  const v = vistaPara(pisoActivo);
  volarA(v.pos, v.objetivo, 1.6);
}

// ---------- Eventos ----------
$('btnRuta').addEventListener('click', () => (ruta ? cancelarRuta() : iniciarRuta()));
$('btnIdioma').addEventListener('click', () => { idioma = idioma === 'es' ? 'en' : 'es'; pintarTextos(); });
$('btnBrujula').addEventListener('click', () => { const v = vistaPara(pisoActivo); volarA(v.pos, v.objetivo, 1.2); });
$('btnPantalla').addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen?.();
});
document.querySelectorAll('.ex-modos button').forEach((b) => b.addEventListener('click', () => cambiarModo(b.dataset.modo)));

function zoom(factor) {
  const dir = camara.position.clone().sub(controles.target).multiplyScalar(factor);
  volarA(controles.target.clone().add(dir), controles.target.clone(), 0.5);
}
$('zoomMas').addEventListener('click', () => zoom(0.75));
$('zoomMenos').addEventListener('click', () => zoom(1.3));

// Clic sobre el modelo: selecciona el piso tocado (sin confundir con arrastrar)
const rayo = new THREE.Raycaster();
let inicioClic = null;
renderer.domElement.addEventListener('pointerdown', (e) => { inicioClic = [e.clientX, e.clientY]; viaje.activo = false; });
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!inicioClic || ruta) return;
  const movido = Math.hypot(e.clientX - inicioClic[0], e.clientY - inicioClic[1]);
  inicioClic = null;
  if (movido > 5) return;
  const punto = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  rayo.setFromCamera(punto, camara);
  const golpes = rayo.intersectObjects(pisos.filter((p) => p.visible), true);
  for (const g of golpes) {
    let o = g.object;
    while (o && o.userData.indice === undefined) o = o.parent;
    if (o && o.userData.indice !== pisoActivo) return seleccionarPiso(o.userData.indice);
    if (o) return;
  }
});

window.addEventListener('resize', () => {
  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && ruta) cancelarRuta();
  const n = PISOS.findIndex((p) => p.id.toLowerCase() === e.key.toLowerCase());
  if (n >= 0 && !e.metaKey && !e.ctrlKey) seleccionarPiso(n);
});

// ---------- Bucle ----------
const reloj = new THREE.Clock();
function animar() {
  const dt = Math.min(reloj.getDelta(), 0.05);

  // Pisos: elevar y desvanecer los que quedan por encima del seleccionado
  for (const p of pisos) {
    const u = p.userData;
    u.opacidad += (u.metaOpacidad - u.opacidad) * Math.min(dt * 5, 1);
    u.elevacion += (u.metaElevacion - u.elevacion) * Math.min(dt * 4, 1);
    if (Math.abs(u.opacidad - u.metaOpacidad) < 0.005) u.opacidad = u.metaOpacidad;
    p.position.y = u.elevacion;
    p.visible = u.opacidad > 0.01;
    for (const m of u.materiales) {
      const transparente = m.userData.transparente || u.opacidad < 1;
      if (m.transparent !== transparente) { m.transparent = transparente; m.needsUpdate = true; }
      m.opacity = m.userData.base * u.opacidad;
    }
  }

  if (ruta) {
    avanzarRuta(dt);
  } else if (viaje.activo) {
    viaje.t += dt / viaje.dur;
    const k = suave(Math.min(viaje.t, 1));
    camara.position.lerpVectors(viaje.desdePos, viaje.haciaPos, k);
    controles.target.lerpVectors(viaje.desdeObj, viaje.haciaObj, k);
    if (viaje.t >= 1) viaje.activo = false;
  }

  controles.enabled = !ruta;
  controles.update();
  renderer.render(escena, camara);
  actualizarMarcadores();
  requestAnimationFrame(animar);
}

pintarTextos();
aplicarVisibilidad();
// Entrada: la cámara se acerca desde lejos
camara.position.set(90, 60, 110);
const inicio = vistaPara(null);
volarA(inicio.pos, inicio.objetivo, 2.2);
animar();
requestAnimationFrame(() => $('cargando').classList.add('listo'));
