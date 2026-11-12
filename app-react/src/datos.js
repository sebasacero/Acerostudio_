// Datos de la app (proyectos de ejemplo, formatos, catálogo, sistema de diseño)
export const COSTO_T = 2400; // USD por tonelada montada (supuesto)
export const FOTO_IA = '/images/app/render-ia-corredor.jpg';

export const PROYECTOS = [
  { n: 'Corredor de acero', l: 'Av. 26 · Bogotá', e: ['coral', 'con cliente'], t: 382, k: 64, a: 'hace 12 min', s: 7, d: [{ i: 1, j: 2, h: 7 }, { i: -2, j: -2, h: 5 }], href: '#editor' },
  { n: 'Torre escalonada', l: 'Chapinero · Bogotá', e: ['coral', 'con cliente'], t: 163, k: 57, a: 'hoy', s: 21, d: [{ i: 0, j: 0, h: 8.5 }], href: '#acero' },
  { n: 'Bodega Fontibón', l: 'nave 42 m de luz', e: ['amar', 'en diseño'], t: 96, k: 38, a: 'hoy', s: 4, d: [{ i: 0, j: 1, h: 2.4 }, { i: 1, j: 1, h: 2.4 }], via: false, href: '#nuevo' },
  { n: 'Casa Celosía', l: 'La Calera', e: ['ok', 'aprobado'], t: 21, k: 44, a: 'ayer', s: 11, d: [{ i: 0, j: 0, h: 2.8 }], via: false, href: '#render' },
  { n: 'Parque bajo el viaducto', l: 'Calle 80', e: ['amar', 'en diseño'], t: 58, k: 31, a: 'lun', s: 33, d: [{ i: 2, j: 2, h: 1.6 }, { i: 3, j: 2, h: 1.6 }], href: '#lamina' },
  { n: 'Faro Usaquén', l: 'torre de oficinas', e: ['', 'borrador'], t: 240, k: 69, a: 'sep', s: 9, d: [{ i: -1, j: 1, h: 9 }], href: '#editor' },
];

export const COLORES = { columna: '#ee7f74', viga: '#b6dbf8', riostra: '#8fa0c4', cercha: '#ffd27a' };
export const ETIQ = { columna: 'Columnas', viga: 'Vigas', riostra: 'Riostras', cercha: 'Cercha Warren' };
export const NOMBRES = { A: ['Puente habitable', 'vivienda + comercio'], B: ['Torre escalonada', 'oficinas + mirador'] };
export const semanas = (c) => Math.max(4, Math.round(c.ton / 12));

export const FORMATOS = [
  ['IFC', 'Revit · ArchiCAD', 'IFC 4 con perfiles, niveles y propiedades de acero.', '6,2 MB', '#b6dbf8'],
  ['DXF', 'AutoCAD', 'Plantas y cortes en capas: ejes, columnas, vigas, cotas.', '1,8 MB', '#ee7f74'],
  ['SKP', 'SketchUp', 'Conector Ruby: volúmenes y estructura agrupados.', '9,4 MB', '#ffd27a'],
  ['BL', 'Blender', 'Escena de Cycles con luz de hora dorada y cámaras.', '22 MB', '#f3a35c'],
  ['3DS', '3ds Max', 'Script MAXScript con materiales de acero.', '7,1 MB', '#8fa0c4'],
  ['HTML', 'Visor web', 'Un solo archivo: ciudad, ficha y recorrido.', '2,3 MB', '#8fd6a8'],
  ['MP4', 'Reel 15 s', 'Animación automática 9:16 y 16:9.', '18 MB', '#e29699'],
  ['XLSX', 'Despiece', 'Perfiles, metros, kg y costo por elemento.', '84 KB', '#d0d6e4'],
];

export const CATALOGO = [
  ['HEB 200', 'HEB', 'Columnas de casas y naves', 200, 61.3], ['HEB 300', 'HEB', 'Columnas de torres', 300, 117], ['HEB 400', 'HEB', 'Columnas de planta baja', 400, 155],
  ['IPE 270', 'IPE', 'Vigas de piso, luces de 6 m', 270, 36.1], ['IPE 360', 'IPE', 'Vigas principales, luces de 8 m', 360, 57.1], ['IPE 450', 'IPE', 'Vigas de transferencia', 450, 77.6],
  ['SHS 150×8', 'Tubo cuadrado', 'Riostras y diagonales', 150, 34.4], ['CHS 219×10', 'Tubo redondo', 'Cerchas y puentes', 219, 51.6], ['UPN 200', 'UPN', 'Correas y bordes de losa', 200, 25.3],
];

export const SECC = {
  columna: '<path d="M20 10h60M20 82h60M50 10v72" stroke="var(--coral)" stroke-width="7" fill="none"/>',
  viga: '<path d="M30 8h40M30 84h40M50 8v76" stroke="var(--celeste)" stroke-width="5" fill="none"/>',
  riostra: '<rect x="22" y="12" width="56" height="68" fill="none" stroke="#8fa0c4" stroke-width="7"/>',
  cercha: '<circle cx="50" cy="46" r="34" fill="none" stroke="#ffd27a" stroke-width="7"/>',
};

export const MUESTRAS = [['Pizarra', '#363d56', 'fondo de noche'], ['Bloque', '#4d5f79', 'techos de ciudad'], ['Malva', '#5f5266', 'base de fachadas'], ['Coral', '#ee7f74', 'acción · viaducto'], ['Celeste', '#b6dbf8', 'lo que es tuyo'], ['Negro', '#0b0d14', 'contorno de acero'],
  ['Maqueta', '#ffffff', 'día · volumen'], ['Niebla', '#eceef2', 'día · fondo'], ['Grafito', '#1a1e2c', 'día · texto'], ['Ámbar', '#ffd27a', 'cerchas'], ['Hierro', '#8fa0c4', 'riostras'], ['Verde', '#8fd6a8', 'aprobado']];

export const PANTALLAS = ['inicio', 'nuevo', 'editor', 'acero', 'render', 'lamina', 'exportar', 'perfiles', 'sistema'];
export const BASE = { az: 45, el: 41, vista: 165, centro: [-16, 0, -4] };
export const movil = () => matchMedia('(max-width: 900px)').matches;
