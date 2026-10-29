/* ==========================================================================
   js/calculadora-acero.js — calculadora de estructura en acero de la portada
   Usa el mismo motor del Studio 3D (studio/js/steel.js): genera la estructura
   con los parámetros elegidos y devuelve toneladas de acero, área construida,
   kg/m² y los perfiles principales (predimensionamiento orientativo).
   Desde aquí se abre la misma estructura en el Studio (render en hora dorada),
   se cotiza por WhatsApp o se adjunta al chat "Sube una foto" (evento acero:calc).
   ========================================================================== */
import { steelBuilding, steelTakeoff, STEEL_DEFAULTS, profileLabel } from '../studio/js/steel.js';

const form = document.getElementById('steelCalc');
if (form) init();

function init() {
  const $ = (id) => document.getElementById(id);
  const lang = () => ((document.documentElement.lang || 'es').startsWith('en') ? 'en' : 'es');
  const num = (n, d = 0) => Number(n).toLocaleString(lang() === 'en' ? 'en-US' : 'es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });
  const TX = {
    es: {
      names: { edificio: 'Edificio en acero', casa: 'Casa en acero', nave: 'Nave en acero', pabellon: 'Pabellón en acero' },
      title: 'Estructura en acero · acero.studio', area: 'Área', steel: 'Acero', pieces: 'piezas', floors: 'pisos',
      wa: 'Hola, calculé mi estructura en acero en acero.studio y quiero cotizarla:',
      model: 'Esquema de la estructura en acero', front: 'frente', main: 'Perfiles principales',
    },
    en: {
      names: { edificio: 'Steel building', casa: 'Steel house', nave: 'Steel warehouse', pabellon: 'Steel pavilion' },
      title: 'Steel structure · acero.studio', area: 'Area', steel: 'Steel', pieces: 'pieces', floors: 'floors',
      wa: 'Hi, I sized my steel structure on acero.studio and would like a quote:',
      model: 'Diagram of the steel structure', front: 'front', main: 'Main sections',
    },
  };
  const t = () => TX[lang()];
  const inputs = ['frente', 'fondo', 'pisos', 'luz', 'largo'].reduce((o, k) => ((o[k] = $('sc_' + k)), o), {});
  let last = null;

  // Parámetros del motor a partir de los controles (crujías de ≈7,5 m en edificio y ≈5 m en casa).
  function params() {
    const tipo = form.querySelector('input[name="sc_tipo"]:checked')?.value || 'edificio';
    const frente = +inputs.frente.value, fondo = +inputs.fondo.value, pisos = +inputs.pisos.value;
    const name = t().names[tipo];
    if (tipo === 'edificio' || tipo === 'casa') {
      const m = tipo === 'casa' ? 5 : 7.5;
      const baysX = Math.max(1, Math.round(frente / m)), baysZ = Math.max(1, Math.round(fondo / m));
      return { tipo, name, floors: pisos, baysX, baysZ, spanX: +(frente / baysX).toFixed(2), spanZ: +(fondo / baysZ).toFixed(2) };
    }
    if (tipo === 'nave') return { tipo, name, span: +inputs.luz.value, length: +inputs.largo.value };
    return { tipo, name, width: frente, depth: fondo };
  }

  function visible(tipo) {
    form.querySelectorAll('[data-for]').forEach((el) => { el.hidden = !el.dataset.for.split(' ').includes(tipo); });
  }

  function update() {
    const p = params();
    visible(p.tipo);
    ['frente', 'fondo', 'pisos', 'luz', 'largo'].forEach((k) => { const o = $('sc_' + k + '_o'); if (o) o.value = num(inputs[k].value) + (k === 'pisos' ? '' : ' m'); });
    const doc = steelBuilding(p), tk = steelTakeoff(doc);
    last = { p, doc, tk };
    $('scTon').textContent = num(tk.kg / 1000, 1) + ' t';
    $('scArea').textContent = num(tk.area) + ' m²';
    $('scKgm2').textContent = num(tk.kgm2);
    $('scPieces').textContent = num(doc.elements.filter((e) => e.type === 'member' || e.type === 'column').length);
    $('scList').innerHTML = tk.rows.slice(0, 5).map((r) =>
      `<li><span>${profileLabel(r.perfil)}</span><span>${num(r.metros)} m</span><span>${num(r.kg / 1000, 1)} t</span></li>`).join('');
    $('scName').textContent = p.name;
    $('scModel').innerHTML = sketch(p);
    $('scOpen').href = studioLink(p);
    window.aceroCalcSummary = { data: p, text: summary() };
  }

  function summary() {
    const { p, tk, doc } = last;
    const prof = doc.meta?.perfiles ? Object.entries(doc.meta.perfiles).map(([k, v]) => `${k} ${[v].flat().join('/')}`).join(' · ') : '';
    return [
      t().title,
      `· ${p.name}${p.floors ? ` · ${p.floors} ${t().floors}` : ''}`,
      `· ${t().area}: ${num(tk.area)} m² · ${t().steel}: ${num(tk.kg / 1000, 1)} t (${num(tk.kgm2)} kg/m²)`,
      prof ? `· ${prof}` : '',
    ].filter(Boolean).join('\n');
  }

  function studioLink(p) {
    const q = new URLSearchParams();
    Object.entries(p).forEach(([k, v]) => { if (k in STEEL_DEFAULTS || k === 'tipo') q.set(k, v); });
    return 'studio/?' + q.toString();
  }

  // Esquema isométrico simplificado (columnas, vigas por nivel y losas) con cota del frente.
  function sketch(p) {
    const iso = window.aceroIso;
    if (!iso) return '';
    const { isoSVG, B } = iso;
    const k = 1 / 3, COL = '#2c3f8f', BEAM = '#3a3f45', SLAB = '#e9ecef';
    const items = [], marks = [];
    let W, D, H;
    if (p.tipo === 'edificio' || p.tipo === 'casa') {
      W = p.spanX * p.baysX * k; D = p.spanZ * p.baysZ * k;
      const g = (p.tipo === 'casa' ? 3.4 : 4.5) * k, fh = (p.tipo === 'casa' ? 3.2 : 3.6) * k;
      H = g + (p.floors - 1) * fh;
      const s = .12;
      for (let i = 0; i <= p.baysX; i++) for (let j = 0; j <= p.baysZ; j++) items.push(B(i * p.spanX * k - s / 2, j * p.spanZ * k - s / 2, 0, s, s, H + .1, COL, { sw: .8 }));
      for (let f = 0; f < p.floors; f++) {
        const z = g + f * fh;
        items.push(B(0, 0, z, W, D, .07, SLAB, { sw: .7, op: .85, l: 1 }));
        items.push(B(0, -.05, z - .12, W, .1, .12, BEAM, { sw: .5 }), B(-.05, 0, z - .12, .1, D, .12, BEAM, { sw: .5 }));
      }
    } else if (p.tipo === 'nave') {
      W = p.span * k; D = p.length * k; H = 7.5 * k;
      const n = Math.max(2, Math.round(p.length / 6));
      for (let i = 0; i <= n; i++) { const y = (i * D) / n; items.push(B(0, y, 0, .14, .14, H, COL, { sw: .8 }), B(W - .14, y, 0, .14, .14, H, COL, { sw: .8 }), B(0, y, H, W, .1, .18, BEAM, { sw: .6 })); }
      items.push(B(0, 0, H + .18, W, D, .05, SLAB, { sw: .7, op: .7, l: 1 }));
    } else {
      W = p.width * k; D = p.depth * k; H = 4.5 * k;
      const o = 3.5 * k, nx = Math.max(2, Math.round(p.width / 6)), nz = Math.max(1, Math.round(p.depth / 6));
      for (let i = 0; i <= nx; i++) for (let j = 0; j <= nz; j++) items.push(B((i * W) / nx, (j * D) / nz, 0, .12, .12, H, COL, { sw: .8 }));
      items.push(B(-o, -o, H, W + 2 * o, D + 2 * o, .14, '#d6dadd', { sw: .8, l: 1 }));
    }
    items.unshift(B(-.6, -.6, -.08, W + 1.2, D + 1.2, .08, '#f4f5f6', { sw: .6, l: 0 }));
    const front = p.tipo === 'nave' ? p.span : p.tipo === 'pabellon' ? p.width : p.spanX * p.baysX;
    marks.push({ t: 'cota', from: [0, -1, 0], to: [W, -1, 0], cls: 'd2' }, { t: 'text', at: [W / 2, -1, 0], s: `${num(front, 1)} m ${t().front}`, dx: 10, dy: -12, fs: 14, cls: 'd2' });
    marks.push({ t: 'circle', at: [0, 0, H * .55], r: [14, 22], cls: 'd3' }, { t: 'text', at: [0, 0, H * .55], s: [last.doc.meta?.perfiles?.columnas || ''].flat()[0], dx: -16, dy: -16, fs: 14, anchor: 'end', cls: 'd3' });
    return isoSVG(items, `${t().model}: ${p.name}`, 1.4, marks);
  }

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', (e) => e.preventDefault());

  $('scWa').addEventListener('click', () => {
    if (!last) return;
    const msg = t().wa + '\n\n' + summary();
    const link = typeof window.buildWaLink === 'function' ? window.buildWaLink(msg) : 'https://wa.me/573152125327?text=' + encodeURIComponent(msg);
    window.open(link, '_blank', 'noopener');
    window.gtag?.('event', 'steel_calc_whatsapp', { tipo: last.p.tipo, t: Math.round(last.tk.kg / 1000) });
  });
  $('scChat').addEventListener('click', () => {
    if (!last) return;
    window.dispatchEvent(new CustomEvent('acero:calc', { detail: window.aceroCalcSummary }));
    document.getElementById('rediseno')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.gtag?.('event', 'steel_calc_to_chat', { tipo: last.p.tipo });
  });
  $('scOpen').addEventListener('click', () => window.gtag?.('event', 'steel_calc_open_studio', { tipo: last?.p.tipo }));

  window.addEventListener('acero:lang', update);
  update();
}
