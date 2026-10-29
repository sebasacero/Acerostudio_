/* ==========================================================================
   js/acero.js — diagramas y piezas interactivas de la portada
   Motor isométrico del diseño "Lápiz Rojo" con marcas rojas digitales (elipse
   con esquineros, rombos, flechas, cotas y etiquetas DM Mono), la secuencia de
   4 pasos del inicio, el selector de estilos, la escala de revenido, los
   pictogramas, el visor del render con rombos y la barra fija de móvil.
   Los textos que cambian por idioma salen de TXT[es|en]; al cambiar de idioma
   (evento "acero:lang") se vuelven a dibujar.
   ========================================================================== */
(function () {
  'use strict';

  var lang = function () { return (document.documentElement.lang || 'es').indexOf('en') === 0 ? 'en' : 'es'; };
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- motor isométrico ---------- */
  var INK = '#16191c', RED = '#cf2a1f';
  function shade(hex, k) { var n = parseInt(hex.slice(1), 16); return 'rgb(' + Math.round(((n >> 16) & 255) * k) + ',' + Math.round(((n >> 8) & 255) * k) + ',' + Math.round((n & 255) * k) + ')'; }
  function f(n) { return n.toFixed(1); }
  function dia(x, y, r, fill) { return '<path d="M' + f(x) + ' ' + f(y - r) + ' L' + f(x + r) + ' ' + f(y) + ' L' + f(x) + ' ' + f(y + r) + ' L' + f(x - r) + ' ' + f(y) + ' Z" fill="' + (fill || RED) + '"/>'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function markSVG(m, P, grow) {
    var w = m.w || 1.8;
    var st = 'fill="none" stroke="' + RED + '" stroke-width="' + w + '" stroke-linecap="square" stroke-linejoin="miter" pathLength="1"';
    var c = m.cls ? ' ' + m.cls : '';
    var p, q, a, x, y;
    if (m.t === 'circle') {
      p = P.apply(null, m.at); x = p[0]; y = p[1];
      var rx = m.r[0], ry = m.r[1], bx = rx * 1.22, by = ry * 1.32, k = Math.min(10, rx * .35);
      grow(x - bx - 4, y - by - 4); grow(x + bx + 4, y + by + 4);
      var br = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(function (s) {
        return 'M' + f(x + s[0] * bx) + ' ' + f(y + s[1] * by - s[1] * k) + ' L' + f(x + s[0] * bx) + ' ' + f(y + s[1] * by) + ' L' + f(x + s[0] * bx - s[0] * k) + ' ' + f(y + s[1] * by);
      }).join(' ');
      return '<ellipse class="dr' + c + '" cx="' + f(x) + '" cy="' + f(y) + '" rx="' + rx + '" ry="' + ry + '" ' + st + '/><path class="dr' + c + '" d="' + br + '" ' + st + '/><g class="dot">' + dia(x, y, 2.6) + '</g>';
    }
    if (m.t === 'arrow') {
      p = P.apply(null, m.from); q = P.apply(null, m.to); grow(p[0], p[1]); grow(q[0], q[1]);
      var mx = (p[0] + q[0]) / 2 + (m.bend || 0) * (q[1] - p[1]) * .3, my = (p[1] + q[1]) / 2 - (m.bend || 0) * (q[0] - p[0]) * .3;
      a = Math.atan2(q[1] - my, q[0] - mx); var L = 9, ex = q[0] - Math.cos(a) * 6, ey = q[1] - Math.sin(a) * 6;
      return '<path class="dr' + c + '" d="M' + f(p[0]) + ' ' + f(p[1]) + ' Q' + f(mx) + ' ' + f(my) + ' ' + f(ex) + ' ' + f(ey) + '" ' + st + '/>' + dia(p[0], p[1], 3.4) +
        '<path class="tag' + c + '" d="M' + f(q[0]) + ' ' + f(q[1]) + ' L' + f(q[0] - L * Math.cos(a - .42)) + ' ' + f(q[1] - L * Math.sin(a - .42)) + ' L' + f(q[0] - L * .6 * Math.cos(a)) + ' ' + f(q[1] - L * .6 * Math.sin(a)) + ' L' + f(q[0] - L * Math.cos(a + .42)) + ' ' + f(q[1] - L * Math.sin(a + .42)) + ' Z" fill="' + RED + '"/>';
    }
    if (m.t === 'check') {
      p = P.apply(null, m.at); x = p[0]; y = p[1];
      var kk = (m.s || 1) * .8, r = 13 * kk; grow(x - r - 3, y - r - 3); grow(x + r + 3, y + r + 3);
      return '<path class="tag' + c + '" d="M' + f(x) + ' ' + f(y - r) + ' L' + f(x + r) + ' ' + f(y) + ' L' + f(x) + ' ' + f(y + r) + ' L' + f(x - r) + ' ' + f(y) + ' Z" fill="#fff" stroke="' + RED + '" stroke-width="1.6"/><path class="dr' + c + '" d="M' + f(x - 5 * kk) + ' ' + f(y) + ' L' + f(x - 1.2 * kk) + ' ' + f(y + 4 * kk) + ' L' + f(x + 5.5 * kk) + ' ' + f(y - 4 * kk) + '" ' + st + ' stroke-width="2.2"/>';
    }
    if (m.t === 'line') {
      p = P.apply(null, m.from); q = P.apply(null, m.to); grow(p[0], p[1]); grow(q[0], q[1]);
      return '<path d="M' + f(p[0]) + ' ' + f(p[1]) + ' L' + f(q[0]) + ' ' + f(q[1]) + '" fill="none" stroke="' + RED + '" stroke-width="1.6" stroke-dasharray="7 5"/>' + dia(p[0], p[1], 3) + dia(q[0], q[1], 3);
    }
    if (m.t === 'cota') {
      p = P.apply(null, m.from); q = P.apply(null, m.to);
      a = Math.atan2(q[1] - p[1], q[0] - p[0]); var nx = -Math.sin(a) * 7, ny = Math.cos(a) * 7;
      grow(p[0] - 8, p[1] - 8); grow(q[0] + 8, q[1] + 8);
      return '<path class="dr' + c + '" d="M' + f(p[0]) + ' ' + f(p[1]) + ' L' + f(q[0]) + ' ' + f(q[1]) + '" ' + st + ' stroke-width="1.4"/><path d="M' + f(p[0] - nx) + ' ' + f(p[1] - ny) + ' L' + f(p[0] + nx) + ' ' + f(p[1] + ny) + ' M' + f(q[0] - nx) + ' ' + f(q[1] - ny) + ' L' + f(q[0] + nx) + ' ' + f(q[1] + ny) + '" stroke="' + RED + '" stroke-width="1.4"/>' + dia(p[0], p[1], 3.2) + dia(q[0], q[1], 3.2);
    }
    if (m.t === 'text') {
      p = P.apply(null, m.at); x = p[0]; y = p[1];
      var fs = Math.round((m.fs || 13) * .66), s = String(m.s).toUpperCase(), tw = s.length * fs * .64 + 14, th = fs + 9;
      var tx = x + (m.dx || 0), ty = y + (m.dy || 0), end = m.anchor === 'end', bx2 = end ? tx - tw : tx, by2 = ty - th + 4;
      grow(bx2 - 2, by2 - 2); grow(bx2 + tw + 2, by2 + th + 2);
      var lx = end ? bx2 + tw : bx2, ly = by2 + th / 2;
      return '<g class="tag' + c + '"><path d="M' + f(x) + ' ' + f(y) + ' L' + f(lx) + ' ' + f(ly) + '" stroke="' + RED + '" stroke-width="1" opacity=".75"/><rect x="' + f(bx2) + '" y="' + f(by2) + '" width="' + f(tw) + '" height="' + th + '" fill="#fff" stroke="' + RED + '" stroke-width="1.1"/><rect x="' + f(bx2) + '" y="' + f(by2) + '" width="2.5" height="' + th + '" fill="' + RED + '"/><text x="' + f(bx2 + tw / 2 + 1.5) + '" y="' + f(by2 + th / 2 + fs * .36) + '" font-family="DM Mono,monospace" font-weight="500" font-size="' + fs + '" letter-spacing=".06em" fill="' + RED + '" text-anchor="middle">' + esc(s) + '</text></g>';
    }
    return '';
  }

  function isoSVG(items, label, pad, marks) {
    pad = pad == null ? 1.2 : pad; marks = marks || [];
    var S = 20, P = function (x, y, z) { return [(x - y) * 0.866 * S, ((x + y) * 0.5 - z) * S]; };
    var minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    var grow = function (x, y) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); };
    var sorted = items.slice().sort(function (a, b) { return (a.l || 0) - (b.l || 0) || ((a.x + a.w / 2 + a.y + a.d / 2) - (b.x + b.w / 2 + b.y + b.d / 2)) || a.z - b.z; });
    var out = '';
    sorted.forEach(function (it) {
      var x = it.x, y = it.y, z = it.z, w = it.w, d = it.d, h = it.h;
      var faces = [
        [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]],
        [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]],
        [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]
      ];
      var ks = [1, .86, .72];
      faces.forEach(function (fc, i) {
        var pts = fc.map(function (pt) { var q = P(pt[0], pt[1], pt[2]); grow(q[0], q[1]); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ');
        var fill = it.ghost ? 'none' : shade(it.c, ks[i]);
        out += '<polygon points="' + pts + '" fill="' + fill + '" stroke="' + (it.ghost ? '#7d858c' : INK) + '" stroke-width="' + (it.sw || 1.3) + '" stroke-linejoin="round"' + (it.ghost ? ' stroke-dasharray="4 3"' : '') + (it.op ? ' fill-opacity="' + it.op + '"' : '') + '/>';
      });
    });
    var mk = marks.map(function (m) { return markSVG(m, P, grow); }).join('');
    var p = pad * S;
    return '<svg viewBox="' + (minX - p).toFixed(0) + ' ' + (minY - p).toFixed(0) + ' ' + (maxX - minX + 2 * p).toFixed(0) + ' ' + (maxY - minY + 2 * p).toFixed(0) + '" role="img" aria-label="' + esc(label) + '">' + out + (mk ? '<g class="pencil" filter="url(#rglow)">' + mk + '</g>' : '') + '</svg>';
  }
  function B(x, y, z, w, d, h, c, o) { var b = { x: x, y: y, z: z, w: w, d: d, h: h, c: c }; for (var k in (o || {})) b[k] = o[k]; return b; }
  window.aceroIso = { isoSVG: isoSVG, B: B };

  /* ---------- paleta ---------- */
  var STRAW = '#e6c66e', BRONZE = '#b9783a', PURPLE = '#6e3f86', BLUE = '#2c3f8f', STEEL = '#8d969e', STEEL_L = '#d9dde1';
  var heatColor = function (t) { return t > 1 ? '#2c3f8f' : t > .75 ? '#6e3f86' : t > .5 ? '#8e4f4a' : t > .3 ? '#b9783a' : t > .15 ? '#d9ab52' : t > .05 ? '#f1e3a5' : '#f4f5f6'; };

  /* ---------- textos por idioma ---------- */
  var TXT = {
    es: {
      step: 'Paso {n} de 4',
      hero: [
        { t: 'Tu espacio hoy', c: 'Así llega la foto: mesas sueltas y un pasillo que se cruza con la entrada.', leg: [['#dfe2e5', 'Espacio actual']] },
        { t: 'Lo que no se mueve', c: 'Muros, ventanas y la columna de acero se quedan donde están. El mobiliario queda en punteado.', leg: [[BLUE, 'Estructura fija'], ['none', 'Mobiliario actual']] },
        { t: 'Nueva distribución', c: 'El tráfico de personas se pinta como temperatura de revenido: pajizo es poco, azul es mucho. Las mesas van a la ventana y aparece una mesa comunal.', leg: [['scale', 'Pajizo → azul: tráfico']] },
        { t: 'La propuesta', c: 'Estilo cálido: madera, luz de 2.700 K y la columna de acero en bronce. Lista para cotizar por WhatsApp.', leg: [[BRONZE, 'Columna bronceada']] }
      ],
      hmarks: ['se cruzan', 'no se mueve', 'a la ventana', 'mesa comunal', 'listo para cotizar'],
      iso: 'Maqueta axonométrica del espacio: ',
      styleIso: 'Maqueta del espacio en estilo ',
      styles: {
        'Minimalista': ['Minimalista', [['Piso', 'Microcemento claro'], ['Muros', 'Pintura blanca mate'], ['Mueble en L', 'Laca gris perla'], ['Columna', 'Acero pintado gris claro']], 'Pocos objetos y superficies continuas. La columna de acero se pinta casi como el muro.'],
        'Industrial': ['Industrial', [['Piso', 'Concreto pulido'], ['Muros', 'Ladrillo a la vista'], ['Mueble en L', 'Acero negro'], ['Columna', 'Acero pavonado azul']], 'Materiales a la vista y la columna en acero pavonado. Es el estilo más cercano al nombre del estudio.'],
        'Cálido': ['Cálido', [['Piso', 'Madera de roble'], ['Muros', 'Estuco arena'], ['Mueble en L', 'Nogal'], ['Columna', 'Acero bronceado']], 'Tonos de madera y luz cálida de 2.700 K. La columna toma el bronce del revenido.'],
        'Escandinavo': ['Escandinavo', [['Piso', 'Pino natural'], ['Muros', 'Blanco roto'], ['Mueble en L', 'Laminado blanco'], ['Columna', 'Acero pajizo claro']], 'Madera clara, blanco y un acento verde. Mucha luz natural desde las dos ventanas.'],
        'Tropical': ['Tropical', [['Piso', 'Baldosa de terrazo'], ['Muros', 'Verde selva'], ['Mueble en L', 'Caña y mostaza'], ['Columna', 'Acero púrpura']], 'Color, plantas grandes y fibras naturales. La columna se vuelve un acento púrpura.']
      },
      temper: [['Pajizo claro', 'Fondos y resaltados suaves.'], ['Pajizo', 'Cifras y etiquetas de paso.'], ['Pajizo oscuro', 'Mapa de calor, tráfico bajo.'], ['Bronce', 'Lo nuevo de cada propuesta.'], ['Marrón púrpura', 'Transición en franjas.'], ['Púrpura', 'Datos y tecnología.'], ['Azul', 'Estructura y acción principal.'], ['Azul claro', 'Detalles técnicos.'], ['Gris acero', 'Neutros y superficies.']],
      inBrand: 'En la marca: ',
      beam: 'Perfil IPE 300 en color ',
      marks: [['Círculo', 'Revisar este punto'], ['Flecha', 'Mover o abrir hacia allá'], ['Cota', 'Medida que no cambia'], ['Visto bueno', 'Aprobado, se construye']],
      plate: ['cortar', 'Ø 12', '800 mm'],
      chatread: 'columna',
      copied: 'Número copiado', copy: 'Copiar número', selectCopy: 'Selecciona y copia',
      close: 'Cerrar ×',
      hs: [
        { t: 'Columna HEB 300', s: 'Pórtico · 117 kg/m', li: ['5 pisos · planta baja de 4,5 m', 'Acabado grafito, también corten o pavonado', 'Unión con placa base y pernos'] },
        { t: 'Viga IPE 400', s: 'Luz de 7,5 m · canto ≈ L/20', li: ['Losa sobre steel deck', 'Viguetas IPE 240 cada crujía', 'Voladizo de 2,4 m al frente'] },
        { t: 'Cruces de San Andrés', s: 'Arriostramiento a la vista', li: ['Tubo SHS 150', 'Rigidez lateral sin muros', 'La estructura es la fachada'] },
        { t: 'Pérgola de acero', s: 'Cubierta transitable', li: ['Tubos SHS 100 cada 0,6 m', 'Sombra en la terraza', 'Opcional en el Studio'] },
        { t: 'Muro cortina', s: 'Galería retrocedida 1,2 m', li: ['Vidrio de piso a techo', 'Parteluces de acero', 'Luz de hora dorada en el render'] }
      ]
    },
    en: {
      step: 'Step {n} of 4',
      hero: [
        { t: 'Your space today', c: 'This is how the photo arrives: loose tables and an aisle that crosses the entrance.', leg: [['#dfe2e5', 'Current space']] },
        { t: 'What stays put', c: 'Walls, windows and the steel column stay where they are. Furniture is shown dashed.', leg: [[BLUE, 'Fixed structure'], ['none', 'Current furniture']] },
        { t: 'New layout', c: 'Foot traffic is painted as tempering temperature: straw is low, blue is high. Tables move to the window and a communal table appears.', leg: [['scale', 'Straw → blue: traffic']] },
        { t: 'The proposal', c: 'Warm style: wood, 2,700 K light and the steel column in bronze. Ready to quote on WhatsApp.', leg: [[BRONZE, 'Bronzed column']] }
      ],
      hmarks: ['paths cross', 'stays put', 'to the window', 'communal table', 'ready to quote'],
      iso: 'Axonometric model of the space: ',
      styleIso: 'Model of the space in style ',
      styles: {
        'Minimalista': ['Minimalist', [['Floor', 'Light microcement'], ['Walls', 'Matte white paint'], ['L unit', 'Pearl grey lacquer'], ['Column', 'Light grey painted steel']], 'Few objects and continuous surfaces. The steel column is painted almost like the wall.'],
        'Industrial': ['Industrial', [['Floor', 'Polished concrete'], ['Walls', 'Exposed brick'], ['L unit', 'Black steel'], ['Column', 'Blued steel']], 'Exposed materials and a blued-steel column. The style closest to the studio name.'],
        'Cálido': ['Warm', [['Floor', 'Oak wood'], ['Walls', 'Sand stucco'], ['L unit', 'Walnut'], ['Column', 'Bronzed steel']], 'Wood tones and warm 2,700 K light. The column takes the bronze of tempering.'],
        'Escandinavo': ['Scandinavian', [['Floor', 'Natural pine'], ['Walls', 'Off-white'], ['L unit', 'White laminate'], ['Column', 'Light straw steel']], 'Light wood, white and a green accent. Plenty of daylight from both windows.'],
        'Tropical': ['Tropical', [['Floor', 'Terrazzo tile'], ['Walls', 'Jungle green'], ['L unit', 'Cane and mustard'], ['Column', 'Purple steel']], 'Color, big plants and natural fibers. The column becomes a purple accent.']
      },
      temper: [['Light straw', 'Backgrounds and soft highlights.'], ['Straw', 'Figures and step labels.'], ['Dark straw', 'Heat map, low traffic.'], ['Bronze', 'What is new in each proposal.'], ['Purple brown', 'Transitions in bands.'], ['Purple', 'Data and technology.'], ['Blue', 'Structure and main action.'], ['Light blue', 'Technical details.'], ['Steel grey', 'Neutrals and surfaces.']],
      inBrand: 'In the brand: ',
      beam: 'IPE 300 section in ',
      marks: [['Circle', 'Check this point'], ['Arrow', 'Move or open that way'], ['Dimension', 'A measure that does not change'], ['Check', 'Approved, it gets built']],
      plate: ['cut', 'Ø 12', '800 mm'],
      chatread: 'column',
      copied: 'Number copied', copy: 'Copy number', selectCopy: 'Select and copy',
      close: 'Close ×',
      hs: [
        { t: 'HEB 300 column', s: 'Frame · 117 kg/m', li: ['5 floors · 4.5 m ground floor', 'Graphite finish, also corten or blued', 'Base plate and anchor bolts'] },
        { t: 'IPE 400 beam', s: '7.5 m span · depth ≈ L/20', li: ['Slab on steel deck', 'IPE 240 joists in every bay', '2.4 m cantilever at the front'] },
        { t: 'X bracing', s: 'Exposed bracing', li: ['SHS 150 tube', 'Lateral stiffness without walls', 'The structure is the façade'] },
        { t: 'Steel pergola', s: 'Walkable roof', li: ['SHS 100 tubes every 0.6 m', 'Shade on the terrace', 'Optional in the Studio'] },
        { t: 'Curtain wall', s: 'Gallery set back 1.2 m', li: ['Floor-to-ceiling glass', 'Steel mullions', 'Golden-hour light in the render'] }
      ]
    }
  };
  var T = function () { return TXT[lang()]; };

  /* ---------- el espacio de ejemplo (local de ~38 m² con columna de acero) ---------- */
  var NEUTRAL = { floor: '#dfe2e5', wall: '#f5f6f7', unit: '#c9cdd1', top: '#d6dadd', table: '#e8eaec', chair: '#bfc4c9', glass: '#d3e0ee', plant: '#b7c0c6', col: STEEL };
  var STYLES = {
    'Minimalista': { floor: '#eeeeec', wall: '#ffffff', unit: '#e3e4e4', top: '#fafafa', table: '#ffffff', chair: '#cfd1d3', glass: '#cfe0f2', plant: '#9fb9a0', col: '#c9ced3', sw: ['#eeeeec', '#ffffff', '#e3e4e4', '#c9ced3'] },
    'Industrial': { floor: '#8f9296', wall: '#a0522d', unit: '#33373b', top: '#5a5f64', table: '#6a4e3a', chair: '#2b2e31', glass: '#bcd0e4', plant: '#5f8a5d', col: '#2c3f8f', sw: ['#8f9296', '#a0522d', '#33373b', '#2c3f8f'] },
    'Cálido': { floor: '#d3ad86', wall: '#f1e1cc', unit: '#a8693f', top: '#e9cfae', table: '#c98b55', chair: '#8e5733', glass: '#d8e6ef', plant: '#6f9a5e', col: '#b9783a', sw: ['#d3ad86', '#f1e1cc', '#a8693f', '#b9783a'] },
    'Escandinavo': { floor: '#e5dac6', wall: '#f7f7f5', unit: '#ffffff', top: '#e5dac6', table: '#dcc6a3', chair: '#8fb3a0', glass: '#cfe0f2', plant: '#7ea58a', col: '#f1e3a5', sw: ['#e5dac6', '#f7f7f5', '#ffffff', '#f1e3a5'] },
    'Tropical': { floor: '#e6d3b3', wall: '#2f7d5b', unit: '#e0a944', top: '#f6e6c4', table: '#f0a37a', chair: '#c46b44', glass: '#c9e9e4', plant: '#2f9a4f', col: '#6e3f86', sw: ['#e6d3b3', '#2f7d5b', '#e0a944', '#6e3f86'] }
  };
  var OLD_TABLES = [[3.2, 2.2], [6.8, 2.0], [8.3, 4.2], [6.6, 4.6], [3.6, 3.6]];
  var NEW_TABLES = [[3.7, 0.8], [5.2, 0.8], [7.7, 0.8]];
  function space(state, pal) {
    var it = [], structure = state === 2, ghost = state === 2 ? { ghost: 1 } : {};
    var struct = function (c) { return structure ? BLUE : c; };
    it.push(B(0, 0, -.3, 10, 7, .3, pal.floor, { l: 0 }));
    if (state === 3) {
      for (var i = 0; i < 10; i++) for (var j = 0; j < 7; j++) {
        var door = Math.hypot(i + .5 - 0.2, j + .5 - 5.5), unit = Math.hypot(i + .5 - 3, j + .5 - 5), win = Math.hypot(i + .5 - 6, j + .5 - 0.6);
        var t = Math.max(0, 1 - door / 4) * .9 + Math.max(0, 1 - unit / 3) * .7 + Math.max(0, 1 - win / 3.4) * .35;
        it.push(B(i, j, 0, 1, 1, .02, heatColor(t), { l: 1, sw: .6 }));
      }
    }
    var W = struct(pal.wall), G = structure ? '#9db0de' : pal.glass;
    it.push(B(0, -.3, 0, 3.4, .3, 3, W, { l: 2 }), B(3.4, -.3, 0, 3.4, .3, 1, W, { l: 2 }), B(3.4, -.25, 1, 3.4, .2, 1.6, G, { l: 2, op: .85 }), B(3.4, -.3, 2.6, 3.4, .3, .4, W, { l: 2 }),
      B(6.8, -.3, 0, .9, .3, 3, W, { l: 2 }), B(7.7, -.3, 0, 2, .3, 1, W, { l: 2 }), B(7.7, -.25, 1, 2, .2, 1.6, G, { l: 2, op: .85 }), B(7.7, -.3, 2.6, 2, .3, .4, W, { l: 2 }), B(9.7, -.3, 0, .3, .3, 3, W, { l: 2 }));
    it.push(B(-.3, -.3, 0, .3, 5.1, 3, W, { l: 2 }), B(-.3, 4.8, 2.3, .3, 1.4, .7, W, { l: 2 }), B(-.3, 6.2, 0, .3, .8, 3, W, { l: 2 }));
    var cc = structure ? BLUE : pal.col; // columna de acero (perfil I)
    it.push(B(5, 3.3, 0, .5, .08, 3, cc, { l: 3 }), B(5.21, 3.38, 0, .08, .34, 3, cc, { l: 3 }), B(5, 3.72, 0, .5, .08, 3, cc, { l: 3 }));
    it.push(B(1, 5.6, 0, 4.2, .8, 1, pal.unit, Object.assign({ l: 3 }, ghost)), B(1, 3.2, 0, .8, 2.4, 1, pal.unit, Object.assign({ l: 3 }, ghost)));
    if (state !== 2) it.push(B(1, 5.6, 1, 4.2, .8, .08, pal.top, { l: 3 }), B(1, 3.2, 1, .8, 2.4, .08, pal.top, { l: 3 }));
    if (state <= 2) {
      OLD_TABLES.forEach(function (p) { it.push(B(p[0], p[1], 0, .9, .9, .75, pal.table, Object.assign({ l: 3 }, ghost)), B(p[0] + 1, p[1] + .2, 0, .45, .45, .45, pal.chair, Object.assign({ l: 3 }, ghost)), B(p[0] + .2, p[1] + 1, 0, .45, .45, .45, pal.chair, Object.assign({ l: 3 }, ghost))); });
    } else {
      NEW_TABLES.forEach(function (p) { it.push(B(p[0], p[1], 0, 1.1, .9, .75, pal.table, { l: 3 }), B(p[0] + .3, p[1] + 1.05, 0, .45, .45, .45, pal.chair, { l: 3 })); });
      it.push(B(6.4, 3.6, 0, 2.6, 1, .75, pal.table, { l: 3 }));
      [6.6, 7.4, 8.2].forEach(function (x) { it.push(B(x, 4.75, 0, .45, .45, .45, pal.chair, { l: 3 })); });
      if (state >= 4) it.push(B(9.1, 6.1, 0, .6, .6, .5, '#c46b44', { l: 3 }), B(9.15, 6.15, .5, .5, .5, 1.1, pal.plant, { l: 3 }), B(.3, .3, 0, .6, .6, .5, '#c46b44', { l: 3 }), B(.35, .35, .5, .5, .5, 1.3, pal.plant, { l: 3 }));
    }
    return it;
  }
  function heroMarks(i) {
    var m = T().hmarks;
    return [
      [{ t: 'circle', at: [7.4, 3.9, .6], r: [62, 34] }, { t: 'text', at: [9.4, 3.4, 1.2], s: m[0], dx: 30, dy: -14, fs: 14, cls: 'd2' }],
      [{ t: 'circle', at: [5.25, 3.5, 3.1], r: [18, 12] }, { t: 'text', at: [5.25, 3.5, 3.1], s: m[1], dx: 16, dy: -14, fs: 14 }, { t: 'check', at: [5.1, -.3, 3.3], cls: 'd2' }, { t: 'check', at: [8.7, -.3, 3.3], cls: 'd3' }],
      [{ t: 'arrow', from: [4.4, 3.3, .9], to: [4.6, 1.4, 1.1], bend: .6 }, { t: 'text', at: [4.6, 1.4, 1.1], s: m[2], dx: -14, dy: -12, fs: 14, anchor: 'end', cls: 'd2' }, { t: 'circle', at: [7.7, 4.1, .8], r: [48, 22], cls: 'd3' }, { t: 'text', at: [9, 5.4, 0], s: m[3], dx: 6, dy: 20, fs: 14 }],
      [{ t: 'check', at: [9.6, 6.6, 2.4], s: 1.4 }, { t: 'text', at: [9.6, 6.6, 2.4], s: m[4], dx: 26, dy: -4, fs: 15, cls: 'd2' }, { t: 'cota', from: [0, 7.6, 0], to: [10, 7.6, 0], cls: 'd3' }, { t: 'text', at: [5, 7.6, 0], s: '≈ 38 m²', dx: -14, dy: 26, fs: 15 }]
    ][i];
  }

  /* ---------- inicio: secuencia de 4 pasos ---------- */
  var heroSvg = $('heroSvg'), seq = $('seq');
  var heroI = 0, auto = null, barEl = null;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function stopAuto() { if (auto) { clearInterval(auto); auto = null; } }
  function buildSeq() {
    if (!seq) return;
    seq.innerHTML = '';
    T().hero.forEach(function (h, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = '<span class="n">' + (i + 1) + '</span><span>' + esc(h.t) + '</span>';
      b.onclick = function () { stopAuto(); setHero(i); };
      seq.appendChild(b);
    });
    barEl = document.createElement('div'); barEl.className = 'bar'; barEl.innerHTML = '<i></i>'; seq.appendChild(barEl);
  }
  function setHero(i, instant) {
    if (!heroSvg) return;
    heroI = i; var h = T().hero[i];
    var pal = i === 3 ? STYLES['Cálido'] : NEUTRAL;
    var old = heroSvg.querySelector('svg'); if (old && !instant) old.classList.add('fade');
    setTimeout(function () { heroSvg.innerHTML = isoSVG(space(i + 1, pal), T().iso + h.t, 1.2, heroMarks(i)); }, old && !instant ? 180 : 0);
    $('heroTitle').textContent = h.t;
    $('heroStep').textContent = T().step.replace('{n}', i + 1);
    $('heroDesc').textContent = h.c;
    $('heroLegend').innerHTML = h.leg.map(function (l) {
      return l[0] === 'scale' ? '<span>' + esc(l[1]) + '<i class="scale" style="background:linear-gradient(90deg,#f1e3a5,#d9ab52,#b9783a,#6e3f86,#2c3f8f)"></i></span>'
        : '<span>' + esc(l[1]) + '<i style="background:' + (l[0] === 'none' ? 'transparent' : l[0]) + ';' + (l[0] === 'none' ? 'border-style:dashed' : '') + '"></i></span>';
    }).join('');
    seq.querySelectorAll('button').forEach(function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    var bi = barEl.firstChild; bi.style.transform = 'translateX(' + i * 100 + '%)'; bi.style.backgroundPosition = i * 33.3 + '% 0';
  }

  /* ---------- selector de estilos ---------- */
  var chips = $('styleChips'), curStyle = 'Industrial';
  function buildChips() {
    if (!chips) return;
    chips.innerHTML = '';
    Object.keys(STYLES).forEach(function (n) {
      var b = document.createElement('button');
      b.className = 'chip-s'; b.type = 'button'; b.dataset.s = n;
      b.innerHTML = '<i style="background:' + STYLES[n].col + '"></i>' + esc(T().styles[n][0]);
      b.onclick = function () { setStyle(n); };
      chips.appendChild(b);
    });
  }
  function setStyle(n) {
    if (!chips) return;
    curStyle = n; var s = STYLES[n], tx = T().styles[n];
    chips.querySelectorAll('.chip-s').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.s === n ? 'true' : 'false'); });
    $('styleTitle').textContent = tx[0];
    $('styleSvg').innerHTML = isoSVG(space(4, s), T().styleIso + tx[0]);
    $('mats').innerHTML = tx[1].map(function (m, k) { return '<div><i style="background:' + s.sw[k] + '"></i><span class="mono">' + esc(m[0]) + '</span><span>' + esc(m[1]) + '</span></div>'; }).join('');
    $('styleNote').textContent = tx[2];
    var link = $('styleTry'); if (link) link.dataset.style = tx[0];
  }

  /* ---------- escala de revenido ---------- */
  var TEMPER = [[204, '#f1e3a5'], [216, '#e6c66e'], [227, '#d9ab52'], [243, '#b9783a'], [254, '#8e4f4a'], [266, '#6e3f86'], [288, '#2c3f8f'], [316, '#5b8fc7'], [330, '#8d969e']];
  var sw = $('swatches'), range = $('temp');
  function ibeam(c, len) { len = len || 6; return [B(0, 0, 0, len, 1.5, .11, c), B(0, .7, .11, len, .1, 2.78, c), B(0, 0, 2.89, len, 1.5, .11, c)]; }
  function buildSwatches() {
    if (!sw) return;
    sw.innerHTML = '';
    TEMPER.forEach(function (tc, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.style.background = tc[1]; b.style.color = i >= 4 && i <= 7 ? '#fff' : INK; b.textContent = tc[0] + '°';
      b.setAttribute('aria-label', tc[0] + ' °C, ' + T().temper[i][0]);
      b.onclick = function () { range.value = i; setTemp(i); };
      sw.appendChild(b);
    });
  }
  function setTemp(i) {
    if (!sw) return;
    i = +i; var tc = TEMPER[i], tx = T().temper[i];
    $('tVal').textContent = tc[0] + ' °C';
    $('tVal').style.color = tc[1] === '#f1e3a5' || tc[1] === '#e6c66e' ? '#b08f2e' : tc[1];
    $('tName').textContent = tx[0];
    $('tUse').textContent = T().inBrand + tx[1];
    sw.querySelectorAll('button').forEach(function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    $('beam').innerHTML = isoSVG(ibeam(tc[1]), T().beam + tx[0], .8);
  }
  if (range) range.addEventListener('input', function () { setTemp(range.value); });

  /* ---------- pictogramas ---------- */
  var PICS = {
    camera: function () { return isoSVG([B(0, 0, 0, 2.4, 1.2, 1.5, '#33373b'), B(.7, 1.2, .3, .9, .5, .9, STEEL), B(1.7, .1, 1.5, .5, .4, .25, BRONZE)], 'Cámara'); },
    palette: function () { return isoSVG([B(0, 0, 0, 1, 1, 1, '#f1e3a5'), B(1.2, 0, 0, 1, 1, 1, STRAW), B(2.4, 0, 0, 1, 1, 1, BRONZE), B(.6, .6, 1, 1, 1, 1, PURPLE), B(1.8, .6, 1, 1, 1, 1, BLUE)], 'Cubos con los colores del revenido'); },
    frame: function () {
      var a = [B(0, 0, 0, 4.2, 3, .1, STEEL_L)];
      [[0, 0], [4, 0], [0, 2.8], [4, 2.8]].forEach(function (p) { a.push(B(p[0], p[1], .1, .2, .2, 2.6, BLUE)); });
      a.push(B(0, 0, 2.7, 4.2, .2, .2, BLUE), B(0, 2.8, 2.7, 4.2, .2, .2, BLUE), B(0, 0, 2.7, .2, 3, .2, BLUE), B(4, 0, 2.7, .2, 3, .2, BLUE), B(0, 0, 2.9, 4.2, 3, .08, '#ffffff', { op: .6 }));
      return isoSVG(a, 'Pórtico de acero predimensionado');
    },
    phone: function () { return isoSVG([B(0, 0, 0, 1.3, .2, 2.5, INK), B(.12, .2, .25, 1.06, .02, 2, '#ffffff'), B(1.8, .5, 1.2, 1.4, .3, .8, '#ffffff'), B(1.9, .8, 1.3, .5, .1, .3, STRAW)], 'Teléfono con mensaje'); },
    chain: function () { return isoSVG([0, 1.7, 3.4].map(function (x) { return B(x, 0, 0, 1.2, 1.2, 1.2, '#fff'); }).concat([0, 1.7, 3.4].map(function (x) { return B(x, 0, 1.2, 1.2, 1.2, .08, BRONZE); })), 'Tres locales iguales'); },
    arq: function () { return isoSVG([B(0, 0, 0, 3.2, 2.4, 2, '#fff', { ghost: 1 }), B(.8, .6, 0, 1.6, 1.2, 1.2, BLUE)], 'Volumen punteado con modelo azul'); },
    towers: function () { return isoSVG([B(0, 0, 0, 1, 1, 2.4, STEEL_L), B(1.3, 0, 0, 1, 1, 3.8, '#fff'), B(2.6, 0, 0, 1, 1, 1.6, STEEL_L), B(1.3, 1.2, 0, 1, 1, .8, PURPLE)], 'Torres con un local en púrpura'); },
    tables: function () { return isoSVG([B(0, 0, 0, 3.6, 1, .75, BRONZE), B(.3, 1.3, 0, .5, .5, .45, STEEL), B(1.5, 1.3, 0, .5, .5, .45, STEEL), B(2.7, 1.3, 0, .5, .5, .45, STEEL), B(.3, -.8, 0, .5, .5, .45, STEEL), B(1.5, -.8, 0, .5, .5, .45, STEEL), B(2.7, -.8, 0, .5, .5, .45, STEEL)], 'Mesa larga con sillas'); },
    chatread: function () { return isoSVG(space(2, NEUTRAL), 'Lectura del espacio con estructura en azul y la columna marcada en rojo', .6, [{ t: 'circle', at: [5.25, 3.5, 3.1], r: [18, 12] }, { t: 'text', at: [5.25, 3.5, 3.1], s: T().chatread, dx: 16, dy: -12, fs: 14 }]); },
    plate: function () {
      var p = T().plate;
      return isoSVG([B(0, 0, 0, 8, 5, .25, '#c9ced3'), B(2, 1.5, .25, .5, .5, .01, '#33373b', { l: 1 }), B(5.6, 3, .25, .5, .5, .01, '#33373b', { l: 1 })], 'Placa de acero con marcas de corte, perforación y medida en lápiz rojo', 1, [
        { t: 'line', from: [4.2, 0, .26], to: [4.2, 5, .26] }, { t: 'text', at: [4.2, 0, .26], s: p[0], dx: 6, dy: -8, fs: 15 },
        { t: 'circle', at: [2.25, 1.75, .26], r: [22, 13], cls: 'd2' }, { t: 'circle', at: [5.85, 3.25, .26], r: [22, 13], cls: 'd2' }, { t: 'text', at: [5.85, 3.25, .26], s: p[1], dx: 34, dy: 6, fs: 15 },
        { t: 'cota', from: [0, 5.5, 0], to: [8, 5.5, 0], cls: 'd3' }, { t: 'text', at: [4, 5.5, 0], s: p[2], dx: -10, dy: 24, fs: 15 },
        { t: 'check', at: [8.4, 5.6, .3], s: 1.2, cls: 'd3' }]);
    },
    crown: function () { var a = [B(0, 0, 0, 6, 3, .15, STEEL_L), B(.2, .2, .15, 5.6, 2.6, 1.5, '#d3e0ee', { op: .8 }), B(0, 0, 1.65, 6, 3, .15, '#fff')]; [0.6, 2.2, 3.8, 5.4].forEach(function (x) { a.push(B(x, -.25, 0, .15, .15, 2.6, BLUE), B(x, 3.1, 0, .15, .15, 2.6, BLUE), B(x, -.25, 2.45, .15, 3.5, .15, BLUE)); }); return isoSVG(a, 'Caja de vidrio colgada de pórticos de acero azules'); },
    pompidou: function () { var a = [B(0, 0, 0, 5, 2.4, 2.6, '#f5f6f7')]; [0, 1, 2, 3, 4, 5].forEach(function (x) { a.push(B(x, 2.4, 0, .1, .3, 2.6, STEEL)); }); [.6, 1.3, 2].forEach(function (z) { a.push(B(0, 2.7, z, 5, .12, .12, STEEL)); }); a.push(B(.4, 2.9, 0, .3, .3, 2.6, BLUE), B(1.6, 2.9, 0, .3, .3, 2.6, '#1fae73'), B(2.8, 2.9, 0, .3, .3, 2.6, '#e6c66e'), B(4, 2.9, 0, .3, .3, 2.6, '#c0392b')); return isoSVG(a, 'Volumen con estructura y ductos de colores por fuera'); },
    corten: function () { return isoSVG([B(0, 0, 0, 1.4, 1.4, 1.4, '#e0a96a'), B(1.7, 0, 0, 1.4, 1.4, 1.4, '#b9783a'), B(3.4, 0, 0, 1.4, 1.4, 1.4, '#8a4a26'), B(5.1, 0, 0, 1.4, 1.4, 1.4, '#5e331d')], 'Cuatro cubos de corten oxidándose con los años'); },
    via: function () { var a = []; for (var k = 0; k < 6; k++) { var h = .5 + k * .55; a.push(B(k * .8, 0, 0, .8, 2.4, h, k % 2 ? '#cfd5da' : '#e7eaed')); } a.push(B(0, 2.4, 0, 4.8, .2, .4, BLUE)); return isoSVG(a, 'Volumen que sube en diagonal como VIA 57 West'); }
  };
  function drawPics() { document.querySelectorAll('[data-iso]').forEach(function (el) { var fn = PICS[el.dataset.iso]; if (fn) el.innerHTML = fn(); }); }

  /* ---------- lápiz de carpintero y leyenda de marcas ---------- */
  var PENCIL = '<svg viewBox="0 0 620 90" role="img" aria-label="Lápiz rojo de carpintero dibujado en líneas rojas luminosas">' +
    '<g filter="url(#rglow)" fill="none" stroke="#cf2a1f" stroke-linejoin="miter"><path d="M40 22 H520 V68 H40 Z" stroke-width="2"/><path d="M58 22 V68 M40 45 H520" stroke-width="1" opacity=".55"/>' +
    '<path d="M520 22 L571 38 M520 68 L571 51" stroke-width="2"/><path d="M571 38 L582 45 L571 51 Z" fill="#cf2a1f" stroke-width="1.6"/><path d="M590 45 H612" stroke-width="2.4" stroke-dasharray="1" pathLength="1" class="dr"/></g>' +
    '<path d="M532 26 L532 64 M546 30 L546 60" stroke="#cf2a1f" stroke-width="1" stroke-dasharray="3 3" opacity=".6"/><path d="M612 39 L618 45 L612 51 L606 45 Z" fill="#cf2a1f" filter="url(#rglow)"/>' +
    '<text x="76" y="37" font-family="DM Mono,monospace" font-size="11" letter-spacing="3" fill="#cf2a1f">ACERO · STUDIO · TALLER · BOGOTÁ</text>' +
    '<text x="76" y="61" font-family="DM Mono,monospace" font-size="10" letter-spacing="2" fill="#5f666d">LÁPIZ ROJO · CARPINTERO · 2H</text></svg>';
  document.querySelectorAll('[data-pencil]').forEach(function (el) { el.classList.add('pencil'); el.innerHTML = PENCIL; });
  function drawMarks() {
    var box = $('marks'); if (!box) return;
    var st = 'fill="none" stroke="' + RED + '" stroke-width="1.8" stroke-linejoin="miter"';
    var G = [
      '<ellipse cx="23" cy="18" rx="13" ry="9" ' + st + '/><path d="M5 6 V2 H9 M37 2 H41 V6 M41 30 V34 H37 M9 34 H5 V30" ' + st + '/>' + dia(23, 18, 2.4),
      '<path d="M6 28 Q20 8 36 12" ' + st + '/>' + dia(6, 28, 3) + '<path d="M42 13 L33 7 L35 13 L32 18 Z" fill="' + RED + '"/>',
      '<path d="M6 18 H40" ' + st + ' stroke-width="1.4"/><path d="M6 11 V25 M40 11 V25" ' + st + ' stroke-width="1.4"/>' + dia(6, 18, 3) + dia(40, 18, 3),
      '<path d="M23 3 L38 18 L23 33 L8 18 Z" ' + st + ' stroke-width="1.4"/><path d="M17 18 L21.5 22.5 L29.5 13.5" ' + st + ' stroke-width="2.2"/>'
    ];
    box.innerHTML = T().marks.map(function (m, i) { return '<div><svg viewBox="0 0 46 36" aria-hidden="true"><g filter="url(#rglow)">' + G[i] + '</g></svg><span><b>' + esc(m[0]) + '</b><span class="mute">' + esc(m[1]) + '</span></span></div>'; }).join('');
  }

  /* ---------- visor del render: rombos con etiqueta ---------- */
  var HS = [[34.8, 77], [58, 57], [31.5, 62], [64, 15], [68, 40]];
  var visorFig = $('visorFig'), panel = $('hsPanel'), openHs = -1;
  function buildHotspots() {
    if (!visorFig) return;
    visorFig.querySelectorAll('.hs').forEach(function (b) { b.remove(); });
    HS.forEach(function (p, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'hs'; b.style.left = p[0] + '%'; b.style.top = p[1] + '%';
      b.setAttribute('aria-label', T().hs[i].t); b.setAttribute('aria-pressed', 'false');
      b.onclick = function () { openHs === i ? closeHs() : showHs(i); };
      visorFig.appendChild(b);
    });
  }
  function showHs(i) {
    openHs = i; var h = T().hs[i], p = HS[i];
    panel.innerHTML = '<span class="t">' + esc(h.t) + '</span><span class="s">' + esc(h.s) + '</span><ul>' + h.li.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul><button type="button" class="x">' + esc(T().close) + '</button>';
    panel.querySelector('.x').onclick = closeHs;
    var right = p[0] > 55;
    panel.style.left = right ? 'auto' : 'calc(' + p[0] + '% + 22px)';
    panel.style.right = right ? 'calc(' + (100 - p[0]) + '% + 22px)' : 'auto';
    panel.style.top = 'calc(' + Math.min(p[1], 62) + '% - 20px)';
    panel.hidden = false;
    visorFig.querySelectorAll('.hs').forEach(function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
  }
  function closeHs() {
    openHs = -1; if (panel) panel.hidden = true;
    if (visorFig) visorFig.querySelectorAll('.hs').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openHs >= 0) closeHs(); });

  /* ---------- copiar número ---------- */
  var copyBtn = $('copyBtn');
  if (copyBtn) copyBtn.addEventListener('click', function () {
    var num = $('waNum'), t = num.textContent.replace(/\s/g, '');
    var ok = function () { copyBtn.textContent = T().copied; setTimeout(function () { copyBtn.textContent = T().copy; }, 1800); };
    var fallback = function () { var r = document.createRange(); r.selectNodeContents(num); var s = getSelection(); s.removeAllRanges(); s.addRange(r); copyBtn.textContent = T().selectCopy; };
    try { navigator.clipboard.writeText(t).then(ok, fallback); } catch (err) { fallback(); }
  });

  /* ---------- "Sube una foto": baja al chat y abre la galería ---------- */
  document.querySelectorAll('[data-upload]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var sec = $('rediseno'); if (!sec) return;
      e.preventDefault();
      sec.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      if (el.dataset.upload === 'open') { var g = $('fileGallery'); if (g) g.click(); }
    });
  });
  var styleTry = $('styleTry');
  if (styleTry) styleTry.addEventListener('click', function () {
    var input = $('textInput');
    if (input && !input.value) input.value = (lang() === 'en' ? 'I want to try the style: ' : 'Quiero probar el estilo: ') + (styleTry.dataset.style || '');
  });

  /* ---------- cabecera y barra fija de móvil ---------- */
  var hdr = document.querySelector('.site-hdr'), mbar = $('mbar'), chatSec = $('rediseno');
  function onScroll() {
    if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 10);
    if (mbar && chatSec) {
      var r = chatSec.getBoundingClientRect();
      mbar.classList.toggle('hide', r.top < window.innerHeight * .6 && r.bottom > 0);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- dibujar y redibujar por idioma ---------- */
  function drawAll() {
    stopAuto(); buildSeq(); setHero(heroI, true);
    if (!reduce && seq) auto = setInterval(function () { setHero((heroI + 1) % 4); }, 3600);
    buildChips(); setStyle(curStyle);
    buildSwatches(); if (range) setTemp(range.value);
    drawPics(); drawMarks(); buildHotspots(); closeHs();
  }
  drawAll();
  window.addEventListener('acero:lang', drawAll);
})();
