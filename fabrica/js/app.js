// Página de fábrica: del modelo de acero del Studio a la planta, las máquinas y la obra.
import { steelBuilding, profileLabel, STEEL_TYPES } from '../../studio/js/steel.js';
import { ordenDeProduccion, archivosDeTaller, etiquetasHTML, urlPieza } from './paquete.js';
import { MAQ, hms, ruta } from './planta.js';
import { nc1, nc1Plate, dxfSheet, dxfPlate, csvCorte, csvPiezas, csvCompra, zip } from './cnc.js';
import { svgPieza, svgPlaca, qrSVG } from './planos.js';
import { crearGemelo, COLOR_ROL, COLOR_ESTADO } from './gemelo.js';
import { ROLE_NAME } from './despiece.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const num = (n, d = 0) => Number(n).toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });
const params = new URLSearchParams(location.search);
const STUDIO_KEY = 'acerostudio.proyecto.v1';
const ESTADOS = ['pendiente', 'fabricada', 'despachada', 'montada'];
const NOMBRE_ESTADO = { pendiente: 'Pendiente', fabricada: 'Fabricada', despachada: 'Despachada', montada: 'Montada' };

// ---------------------------------------------------------------------------------------------------
// Proyecto: el que está abierto en el Studio (mismo navegador) o uno de los generadores de acero.
function docDelStudio() {
  try {
    const d = JSON.parse(localStorage.getItem(STUDIO_KEY) || 'null');
    if (d && d.elements?.some((e) => (e.type === 'member' || e.type === 'column') && e.profile)) return d;
  } catch { /* sin almacenamiento */ }
  return null;
}
const studioDoc = docDelStudio();
const fuenteSel = $('#fuente');
const opciones = [...(studioDoc ? [['studio', `${studioDoc.name} (Studio)`]] : []), ...Object.entries(STEEL_TYPES).map(([k, v]) => [k, v])];
fuenteSel.innerHTML = opciones.map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');
fuenteSel.value = params.get('fuente') === 'studio' && studioDoc ? 'studio' : opciones.some(([k]) => k === params.get('tipo')) ? params.get('tipo') : (studioDoc ? 'studio' : 'edificio');

function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36).toUpperCase().slice(0, 5); }
function cargar() {
  const f = fuenteSel.value;
  const doc = f === 'studio' ? studioDoc : steelBuilding({ tipo: f });
  const firma = `${doc.name}|${doc.elements.length}|${doc.elements.filter((e) => e.profile).map((e) => e.profile).join('')}`;
  return ordenDeProduccion(doc, { orden: `OP-${hash(firma)}` });
}

// Seguimiento por pieza (en este navegador; con Supabase se comparte entre taller y obra: ver supabase/).
const store = {
  key: () => `acerostudio.fabrica.${op.orden}`,
  get() { try { return JSON.parse(localStorage.getItem(this.key()) || '{}'); } catch { return {}; } },
  set(id, e) { const s = this.get(); s[id] = e; try { localStorage.setItem(this.key(), JSON.stringify(s)); } catch { /* */ } gemelo.setEstados(s); if (tab === 'montaje') render(); },
};

let op = cargar(), tab = params.get('tab') || 'planta', t = 0, playing = false, vel = 1200, selMark = null, subPiezas = 'perfiles', selMaq = null;
const gemelo = crearGemelo($('#gemelo'), {
  onMaquina: (m) => { selMaq = m; if (tab === 'planta' || tab === 'cnc') render(); },
  onPieza: (id) => abrirPieza(id),
});

function base() {
  const u = new URL(location.href);
  u.search = fuenteSel.value === 'studio' ? '?fuente=studio' : `?tipo=${fuenteSel.value}`;
  return u.toString();
}

function nuevaOrden() {
  op = cargar();
  t = 0; selMark = null;
  $('#chip-orden').textContent = op.orden;
  $('#tiempo').max = op.sim.makespan;
  gemelo.setDatos(op);
  gemelo.setEstados(store.get());
  render();
}

// ---------------------------------------------------------------------------------------------------
function kpis() {
  const r = op.despiece.resumen;
  return `<div class="kpis">
    <div><b>${num(r.kg / 1000, 1)}<small>t</small></b><span>acero</span></div>
    <div><b>${r.piezas}<small>pz</small></b><span>${r.marcas} marcas</span></div>
    <div><b>${num(op.sim.horasMaquina, 0)}<small>h</small></b><span>máquina</span></div>
    <div><b>${num(op.sim.makespan / 3600, 1)}<small>h</small></b><span>taller listo</span></div>
  </div>`;
}
function cabecera(sub) {
  return `<div class="sub">${esc(sub)}</div><h1>${esc(op.proyecto)}</h1>${kpis()}`;
}

const VISTAS = {
  planta() {
    const s = op.sim, max = Math.max(...s.maquinas.filter((m) => m.id !== 'almacen').map((m) => m.ocupado / m.n));
    const filas = s.maquinas.filter((m) => m.id !== 'almacen').map((m) => {
      const uso = m.ocupado / m.n / s.makespan;
      return `<div class="barra-uso ${m.id === s.cuello ? 'cuello' : ''} ${selMaq === m.id ? 'sel' : ''}" data-maq="${m.id}"><span>${esc(m.corto)}${m.n > 1 ? ` ×${m.n}` : ''}</span><div class="pista"><i style="width:${(m.ocupado / m.n / max) * 100}%"></i></div><em>${Math.round(uso * 100)} %</em></div>`;
    }).join('');
    const q = s.calidad;
    const maq = selMaq && MAQ[selMaq];
    let detalle = '';
    if (maq) {
      const ops = s.ops.filter((o) => o.maq === selMaq);
      detalle = `<h4>${esc(maq.nombre)}</h4><p class="nota">${ops.length} operaciones · ${hms(ops.reduce((a, o) => a + o.end - o.start, 0))} de máquina${maq.tol ? ` · mide cada pieza y se corrige sola (tolerancia ±${maq.tol} mm)` : ''}.</p>
        <table class="tabla"><thead><tr><th>Pieza</th><th>Inicio</th><th>Duración</th></tr></thead><tbody>${ops.slice(0, 12).map((o) => `<tr><td>${esc(o.job)}${o.kind !== selMaq && o.kind !== 'placa' ? ` <small style="color:var(--coral)">${esc(o.kind)}</small>` : ''}</td><td>${hms(o.start)}</td><td>${hms(o.end - o.start)}</td></tr>`).join('')}</tbody></table>`;
    }
    return cabecera('planta autónoma/.') + `
      <h4>Tiempo de máquina por estación</h4><div class="barras-uso">${filas}</div>
      <p class="nota">Cada pieza lleva su propia ruta: sin cambio de formato entre piezas distintas. El cuello de botella es <b>${esc(MAQ[s.cuello].nombre.toLowerCase())}</b>; el tiempo de máquina se reparte como cómputo, en colas por estación y en el orden de montaje.</p>
      ${detalle}
      <h4>Control de calidad en proceso</h4>
      <table class="tabla"><tbody>
        <tr><td>Mediciones (láser, palpador, escáner 3D)</td><td>${num(q.mediciones)}</td></tr>
        <tr><td>Autocorrecciones de máquina</td><td>${q.ajustes}</td></tr>
        <tr><td>Retrabajos (recorte o re-taladrado)</td><td>${q.recortes}</td></tr>
        <tr><td>Piezas repuestas</td><td>${q.rechazos}</td></tr>
        <tr><td>Capacidad del proceso Cpk</td><td>${q.cpk ?? '—'}</td></tr>
      </tbody></table>
      <h4>Costo de taller estimado</h4>
      <table class="tabla"><tbody>
        <tr><td>Acero en barra (${num(op.kgCompra / 1000, 1)} t)</td><td>USD ${num(op.costo.acero)}</td></tr>
        <tr><td>Lámina para placas (${num(op.laminas.kgLamina / 1000, 1)} t)</td><td>USD ${num(op.costo.placas)}</td></tr>
        <tr><td>Horas máquina</td><td>USD ${num(op.costo.maquina)}</td></tr>
        <tr><td>Pintura (${num(op.despiece.resumen.pintura)} m²)</td><td>USD ${num(op.costo.pintura)}</td></tr>
      </tbody><tfoot><tr><td>Total fabricado</td><td>USD ${num(op.costo.total)}</td></tr></tfoot></table>
      <p class="nota">Precios de referencia editables en <code>fabrica/js/paquete.js</code>. Predimensionamiento indicativo: las conexiones se verifican con el cálculo estructural antes de cortar.</p>`;
  },
  piezas() {
    const d = op.despiece;
    const lista = subPiezas === 'perfiles'
      ? `<table class="tabla"><thead><tr><th>Marca · perfil</th><th>Cant.</th><th>Largo</th><th>Aguj.</th><th>t</th></tr></thead><tbody>${d.marcas.map((m) => `<tr data-mark="${m.mark}" class="${selMark === m.mark ? 'sel' : ''}"><td><i class="rombo" style="background:${COLOR_ROL[m.role]}"></i>${m.mark} · ${esc(profileLabel(m.profile))}${m.tramo ? ` <small>${m.tramo}</small>` : ''}</td><td>${m.qty}</td><td>${num(m.length)}</td><td>${m.holes.length}</td><td>${num(m.kg * m.qty / 1000, 2)}</td></tr>`).join('')}</tbody>
        <tfoot><tr><td>Total perfiles</td><td>${d.resumen.piezas}</td><td>${num(d.resumen.metros)} m</td><td></td><td>${num(d.resumen.kgPerfiles / 1000, 1)}</td></tr></tfoot></table>`
      : `<table class="tabla"><thead><tr><th>Placa</th><th>Cant.</th><th>Medidas</th><th>e</th><th>kg</th></tr></thead><tbody>${d.placas.map((p) => `<tr data-mark="${p.mark}" class="${selMark === p.mark ? 'sel' : ''}"><td><i class="rombo" style="background:#e9b44c"></i>${p.mark} · ${esc(p.nombre)}</td><td>${p.qty}</td><td>${p.w}×${p.h}</td><td>${p.t}</td><td>${num(p.kg * p.qty)}</td></tr>`).join('')}</tbody>
        <tfoot><tr><td>Total placas</td><td>${d.resumen.placas}</td><td></td><td></td><td>${num(d.resumen.kgPlacas)}</td></tr></tfoot></table>`;
    const m = d.marcas.find((x) => x.mark === selMark), p = d.placas.find((x) => x.mark === selMark);
    const acc = m ? `<div class="acciones"><button class="boton coral" data-dl="nc1">DSTV ${m.mark}.nc1</button><button class="boton linea" data-dl="svg">Plano SVG</button></div>`
      : p ? `<div class="acciones"><button class="boton coral" data-dl="dxf">DXF ${p.mark}</button><button class="boton linea" data-dl="nc1">NC1</button><button class="boton linea" data-dl="svg">Plano SVG</button></div>` : '';
    return cabecera('despiece/.') + `<div class="subtabs"><button data-sub="perfiles" class="${subPiezas === 'perfiles' ? 'on' : ''}">Perfiles (${d.marcas.length})</button><button data-sub="placas" class="${subPiezas === 'placas' ? 'on' : ''}">Placas (${d.placas.length})</button></div>${lista}${acc}
      <p class="nota">Las conexiones salen del modelo: placas base y de empalme en columnas, placas de testa en vigas que llegan a columna, aletas para viguetas, cartelas para riostras y cortes en ángulo. Lo que pasa de 12 m se parte en tramos con empalme.</p>`;
  },
  corte() {
    const b = op.barras, l = op.laminas;
    return cabecera('optimización de corte/.') + `
      <h4>Compra de material</h4>
      <table class="tabla"><thead><tr><th>Material</th><th>Cant.</th><th>kg</th></tr></thead><tbody>
      ${b.compra.map((c) => `<tr><td>${esc(profileLabel(c.profile))} · ${c.stock / 1000} m</td><td>${c.n}</td><td>${num(c.kg)}</td></tr>`).join('')}
      ${Object.values(l.hojas.reduce((o, h) => { (o[h.t] ||= { t: h.t, n: 0 }).n++; return o; }, {})).map((x) => `<tr><td>Lámina ${x.t} mm · 3×1,5 m</td><td>${x.n}</td><td>${num(x.n * 3 * 1.5 * x.t * 7.85)}</td></tr>`).join('')}
      </tbody></table>
      <h4>Aprovechamiento</h4>
      <table class="tabla"><tbody>
        <tr><td>Barras (${b.barras.length} barras, ${b.cortes} cortes)</td><td>${num(b.aprovechamiento * 100, 1)} %</td></tr>
        <tr><td>Contando retales útiles que vuelven al almacén</td><td>${num(b.aprovechamientoConRetal * 100, 1)} %</td></tr>
        <tr><td>Retales ≥ 1 m</td><td>${b.retales.length}</td></tr>
        <tr><td>Láminas (${l.hojas.length})</td><td>${num(l.aprovechamiento * 100, 1)} %</td></tr>
      </tbody></table>
      <div class="acciones"><button class="boton coral" data-dl="corte">Lista de corte CSV</button><button class="boton linea" data-dl="compra">Lista de compra CSV</button></div>
      <p class="nota">Mejor ajuste decreciente por perfil en barras de 6 y 12 m, 3 mm de sierra y 10 mm de despunte. Las placas se anidan por espesor con giro de 90° y 12 mm entre piezas para la antorcha.</p>`;
  },
  cnc() {
    const d = op.despiece;
    const archivo = (k, t, s, b = 'Bajar') => `<div class="archivo"><b>${t}</b><span>${s}</span><button data-dl="${k}">${b}</button></div>`;
    return cabecera('máquinas/.') + `<div class="archivos">
      ${archivo('zip', 'Paquete de taller completo', `${op.orden}.zip · DSTV, DXF, planos, listas, etiquetas y orden.json`)}
      ${archivo('nc1all', 'DSTV / NC1 · línea de corte y taladrado', `${d.marcas.length + d.placas.length} programas · Ficep, Peddinghaus, Voortman, Kaltenbach`)}
      ${archivo('laminas', 'DXF de láminas anidadas · plasma o láser', `${op.laminas.hojas.length} láminas listas para cortar`)}
      ${archivo('placas', 'DXF por placa', `${d.placas.length} placas con agujeros y marcado`)}
      ${archivo('piezas', 'Lista de piezas CSV', 'marcas, perfiles, cortes, agujeros, pesos y pintura')}
      ${archivo('etiquetas', 'Etiquetas QR para imprimir', `${d.piezas.length} etiquetas de 100 × 56 mm`, 'Abrir')}
      ${archivo('json', 'Orden de producción (JSON)', 'para el agente de taller y el seguimiento')}
    </div>
    <h4>Agente de taller</h4>
    <p class="nota" style="margin-top:0">Corre en el PC del taller (Node 20, sin instalar nada) y alimenta cada máquina por carpeta caliente, en el orden de montaje. Lee la medición que deja la máquina y calcula la compensación para la siguiente pieza.</p>
    <pre class="terminal">node fabrica/agente/agente.mjs paquete --tipo ${fuenteSel.value === 'studio' ? 'edificio' : fuenteSel.value} --salida ./ordenes
node fabrica/agente/agente.mjs maquina \\
  --orden ./ordenes/${op.orden}/orden.json \\
  --maquina sierra --carpeta /red/sierra-1</pre>`;
  },
  montaje() {
    const s = store.get(), d = op.despiece;
    const pisos = [...new Set(d.piezas.map((p) => p.levelName))];
    const cuenta = (lst) => Object.fromEntries(ESTADOS.map((e) => [e, lst.filter((p) => (s[p.id] || 'pendiente') === e).length]));
    const total = cuenta(d.piezas);
    const barra = (c, n) => `<div class="progreso">${['montada', 'despachada', 'fabricada'].map((e) => `<i style="width:${(c[e] / n) * 100}%;background:${COLOR_ESTADO[e]}"></i>`).join('')}</div>`;
    return cabecera('montaje en obra/.') + `
      <div class="estados-leyenda">${['fabricada', 'despachada', 'montada'].map((e) => `<span><i style="background:${COLOR_ESTADO[e]}"></i>${NOMBRE_ESTADO[e]} ${total[e]}</span>`).join('')}<span>Pendiente ${total.pendiente}</span></div>
      ${barra(total, d.piezas.length)}
      <div class="acciones"><button class="boton coral" id="btn-escanear">Escanear QR</button><button class="boton linea" id="btn-fabricadas">Marcar lo fabricado según la planta</button></div>
      <h4>Secuencia de montaje por piso</h4>
      ${pisos.map((n) => { const lst = d.piezas.filter((p) => p.levelName === n); const c = cuenta(lst); return `<div class="piso"><header><span>${esc(n)}</span><em>${c.montada}/${lst.length} montadas</em></header>${barra(c, lst.length)}<div class="chips">${lst.map((p) => `<button data-pieza="${p.id}" data-e="${s[p.id] || 'pendiente'}" title="${esc(ROLE_NAME[p.role])} · #${p.seq}">${p.id}</button>`).join('')}</div></div>`; }).join('')}
      <p class="nota">Cada etiqueta lleva un QR que abre la ficha de la pieza en el celular: ruta por el taller, certificado del escáner y botones para marcarla despachada o montada.</p>`;
  },
};

// Lienzo de cada pestaña.
function lienzo() {
  const capa = $('#capa-svg'), can = $('#gemelo'), rep = $('#reproductor'), ev = $('#eventos'), ley = $('#leyenda');
  const svgMode = tab === 'piezas' || tab === 'corte';
  capa.hidden = !svgMode; can.style.visibility = svgMode ? 'hidden' : 'visible';
  rep.hidden = !(tab === 'planta' || tab === 'cnc'); ev.hidden = rep.hidden; ley.hidden = svgMode;
  gemelo.setModo(tab === 'montaje' ? 'estructura' : 'planta');
  if (tab === 'montaje') ley.innerHTML = `<span class="tag">montaje/.</span>${['fabricada', 'despachada', 'montada'].map((e) => `<span><i style="background:${COLOR_ESTADO[e]}"></i>${NOMBRE_ESTADO[e]}</span>`).join('')}`;
  else ley.innerHTML = `<span class="tag">piezas/.</span>${[...new Set(op.despiece.piezas.map((p) => p.role))].map((r) => `<span><i style="background:${COLOR_ROL[r]}"></i>${ROLE_NAME[r]}s</span>`).join('')}`;
  if (tab === 'piezas') {
    const m = op.despiece.marcas.find((x) => x.mark === selMark), p = op.despiece.placas.find((x) => x.mark === selMark);
    const mk = m || p || op.despiece.marcas[0];
    capa.innerHTML = `<h3>plano de taller/.</h3>${m || !p ? svgPieza(mk, op) : svgPlaca(p, op)}`;
  }
  if (tab === 'corte') capa.innerHTML = svgCorte();
}

function svgCorte() {
  const W = 980, rowH = 20, marks = Object.fromEntries(op.despiece.marcas.map((m) => [m.mark, m]));
  let y = 0, out = '';
  const groups = op.barras.barras.reduce((o, b) => { (o[b.profile] ||= []).push(b); return o; }, {});
  for (const [prof, bars] of Object.entries(groups)) {
    let s = `<text x="0" y="14" class="g">${esc(profileLabel(prof))} · ${bars.length} barras</text>`;
    bars.forEach((b, i) => {
      const yy = 24 + i * (rowH + 4), k = (W - 90) / 12000;
      s += `<text x="0" y="${yy + 14}" class="c">${b.codigo}</text><rect x="60" y="${yy}" width="${b.stock * k}" height="${rowH}" class="stock"/>`;
      for (const c of b.cuts) s += `<rect x="${60 + c.at * k}" y="${yy}" width="${Math.max(1, c.len * k)}" height="${rowH}" fill="${COLOR_ROL[marks[c.mark].role]}" class="cut"/>${c.len * k > 34 ? `<text x="${60 + c.at * k + 5}" y="${yy + 14}" class="m">${c.mark}</text>` : ''}`;
      if (b.retalSale) s += `<text x="${60 + b.used * k + 4}" y="${yy + 14}" class="r">retal ${b.retalSale.len}</text>`;
    });
    const h = 24 + bars.length * (rowH + 4) + 10;
    out += `<svg viewBox="0 0 ${W} ${h}" width="${W}" style="box-shadow:none;margin:0 0 10px">${estiloCorte}<g>${s}</g></svg>`;
    y += h;
  }
  const hojas = op.laminas.hojas.map((h) => {
    const k = 300 / h.w;
    return `<svg viewBox="-2 -18 ${h.w * k + 4} ${h.h * k + 22}" width="${h.w * k + 4}" style="display:inline-block;margin:0 10px 12px 0;box-shadow:none">${estiloCorte}<text x="0" y="-6" class="c">${h.codigo} · ${h.t} mm · ${Math.round(h.uso * 100)} %</text><rect width="${h.w * k}" height="${h.h * k}" class="stock"/>${h.piezas.map((p) => `<rect x="${p.x * k}" y="${p.y * k}" width="${p.w * k}" height="${p.h * k}" fill="#e9b44c" fill-opacity=".8" stroke="#1a1e2c" stroke-width=".4"/>${p.w * k > 22 ? `<text x="${(p.x + p.w / 2) * k}" y="${(p.y + p.h / 2) * k + 3}" text-anchor="middle" class="m">${p.mark}</text>` : ''}`).join('')}</svg>`;
  }).join('');
  return `<h3>barras comerciales/.</h3>${out}<h3>láminas anidadas/.</h3><div>${hojas}</div>`;
}
const estiloCorte = `<style>.g{font:italic 400 14px Outfit,sans-serif;fill:var(--texto)}.c{font:10px 'DM Mono',monospace;fill:var(--suave)}.m{font:500 9.5px 'DM Mono',monospace;fill:#1a1e2c}.r{font:9.5px 'DM Mono',monospace;fill:var(--suave)}.stock{fill:rgba(var(--tinta-rgb),.07);stroke:rgba(var(--tinta-rgb),.25);stroke-dasharray:3 3}.cut{stroke:var(--pizarra-2);stroke-width:1}</style>`;

function render() {
  $$('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
  $('#ficha').innerHTML = VISTAS[tab]();
  lienzo();
}

// ---------------------------------------------------------------------------------------------------
// Descargas.
function bajar(data, nombre, tipo = 'text/plain') {
  const blob = data instanceof Blob ? data : new Blob([data], { type: tipo });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: nombre });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
function abrirEtiquetas() {
  const w = window.open('', '_blank');
  if (w) { w.document.write(etiquetasHTML(op, base())); w.document.close(); } else bajar(etiquetasHTML(op, base()), `${op.orden}-etiquetas.html`, 'text/html');
}
const DESCARGAS = {
  zip: () => bajar(new Blob([zip(archivosDeTaller(op, { base: base() }))], { type: 'application/zip' }), `${op.orden}.zip`),
  nc1all: () => bajar(new Blob([zip([...op.despiece.marcas.map((m) => ({ name: `${m.mark}.nc1`, data: nc1(m, op) })), ...op.despiece.placas.map((p) => ({ name: `${p.mark}.nc1`, data: nc1Plate(p, op) }))])], { type: 'application/zip' }), `${op.orden}-dstv.zip`),
  laminas: () => bajar(new Blob([zip(op.laminas.hojas.map((h) => ({ name: `${h.codigo}_chapa${h.t}.dxf`, data: dxfSheet(h, op.despiece.placas) })))], { type: 'application/zip' }), `${op.orden}-laminas-dxf.zip`),
  placas: () => bajar(new Blob([zip(op.despiece.placas.map((p) => ({ name: `${p.mark}.dxf`, data: dxfPlate(p) })))], { type: 'application/zip' }), `${op.orden}-placas-dxf.zip`),
  piezas: () => bajar(csvPiezas(op.despiece), `${op.orden}-piezas.csv`, 'text/csv'),
  corte: () => bajar(csvCorte(op.barras), `${op.orden}-corte.csv`, 'text/csv'),
  compra: () => bajar(csvCompra(op.barras, op.laminas), `${op.orden}-compra.csv`, 'text/csv'),
  etiquetas: abrirEtiquetas,
  json: () => bajar(archivosDeTaller(op).find((f) => f.name.endsWith('orden.json')).data, `${op.orden}.json`, 'application/json'),
  nc1: () => { const m = op.despiece.marcas.find((x) => x.mark === selMark), p = op.despiece.placas.find((x) => x.mark === selMark); bajar(m ? nc1(m, op) : nc1Plate(p, op), `${selMark}.nc1`); },
  dxf: () => { const p = op.despiece.placas.find((x) => x.mark === selMark); bajar(dxfPlate(p), `${p.mark}.dxf`, 'application/dxf'); },
  svg: () => { const m = op.despiece.marcas.find((x) => x.mark === selMark), p = op.despiece.placas.find((x) => x.mark === selMark); bajar(m ? svgPieza(m, op) : svgPlaca(p, op), `${selMark}.svg`, 'image/svg+xml'); },
};

// ---------------------------------------------------------------------------------------------------
// Ficha de pieza: lo que abre el QR de la etiqueta.
function abrirPieza(id) {
  const pz = op.despiece.piezas.find((p) => p.id === id);
  if (!pz) { alert(`No encuentro la pieza ${id} en ${op.orden}`); return; }
  const m = op.despiece.marcas.find((x) => x.mark === pz.mark), ops = op.sim.jobs[pz.id] || [], estado = store.get()[pz.id] || 'pendiente';
  gemelo.seleccionar(pz.id);
  const dlg = $('#tarjeta');
  dlg.innerHTML = `<button class="cerrar" data-cerrar>×</button>
    <div class="cab">${qrSVG(urlPieza(base(), op.orden, pz.id), { size: 120 })}<div><h2>${pz.id}</h2><p>${esc(ROLE_NAME[pz.role])} · ${esc(profileLabel(pz.profile))}<br>L ${num(pz.length)} mm · ${num(pz.kg, 1)} kg · ${esc(pz.levelName)}<br>Montaje #${pz.seq}${pz.tramo ? ` · tramo ${pz.tramo}` : ''}</p></div></div>
    <ol class="ruta-pieza">${ops.map((o) => `<li class="${o.kind !== o.maq ? 'extra' : ''}"><span>${esc(MAQ[o.maq].nombre)}${o.kind !== o.maq ? ` · ${esc(o.kind)}` : ''}</span><em>${o.unidad} · ${hms(o.start)}</em></li>`).join('')}</ol>
    <p class="nota">${pz.qc != null ? `Escaneo 3D conforme: desvío máximo ${pz.qc} mm (EN 1090 EXC2).` : ''} Placas: ${Object.entries(m.plates.reduce((o, p) => { o[p.mark] = (o[p.mark] || 0) + 1; return o; }, {})).map(([k, n]) => (n > 1 ? `${n} × ${k}` : k)).join(', ') || 'ninguna'}. Agujeros: ${m.holes.length}.</p>
    <div class="estados">${['fabricada', 'despachada', 'montada'].map((e) => `<button data-estado="${e}" class="${estado === e ? 'on' : ''}">${NOMBRE_ESTADO[e]}</button>`).join('')}</div>`;
  $$('[data-estado]', dlg).forEach((b) => b.onclick = () => { store.set(pz.id, b.dataset.estado); abrirPieza(pz.id); });
  if (!dlg.open) dlg.showModal();
}

async function escanear() {
  const dlg = $('#escaner'), video = $('#cam');
  dlg.showModal();
  if (!('BarcodeDetector' in window) || !navigator.mediaDevices?.getUserMedia) { video.hidden = true; $('#codigo').focus(); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.hidden = false; video.srcObject = stream; await video.play();
    const det = new window.BarcodeDetector({ formats: ['qr_code'] });
    const loop = async () => {
      if (!dlg.open) { stream.getTracks().forEach((t) => t.stop()); return; }
      const [c] = await det.detect(video).catch(() => []);
      if (c) {
        stream.getTracks().forEach((t) => t.stop()); dlg.close();
        try { const u = new URL(c.rawValue); abrirPieza(u.searchParams.get('pieza')); } catch { abrirPieza(c.rawValue.trim()); }
        return;
      }
      requestAnimationFrame(loop);
    };
    loop();
  } catch { video.hidden = true; $('#codigo').focus(); }
}

// ---------------------------------------------------------------------------------------------------
// Reproducción de la planta y eventos de calidad.
let ultimo = 0, eventosVistos = -1;
function pintarEventos() {
  const ev = op.sim.eventos;
  let i = ev.findIndex((e) => e.t > t); if (i < 0) i = ev.length;
  if (i === eventosVistos) return;
  eventosVistos = i;
  const hasta = ev.slice(0, i);
  const importantes = [...hasta.filter((e) => !['medicion', 'certificado'].includes(e.tipo)).slice(-3), ...hasta.filter((e) => e.tipo === 'certificado').slice(-1)].sort((a, b) => b.t - a.t);
  $('#eventos').innerHTML = importantes.map((e) => `<div class="evento ${e.tipo}"><small>${hms(e.t)} · ${esc(e.maq)} · ${esc(e.pieza)}</small>${esc(e.msg)}</div>`).join('');
}
function setT(v) {
  t = Math.max(0, Math.min(op.sim.makespan, v));
  $('#tiempo').value = t;
  $('#reloj').innerHTML = `${hms(t)}<span class="tot"> / ${hms(op.sim.makespan)}</span>`;
  gemelo.setTiempo(t);
  pintarEventos();
}
function frame(now) {
  const dt = Math.min(0.1, (now - ultimo) / 1000); ultimo = now;
  if (playing) { setT(t + dt * vel); if (t >= op.sim.makespan) { playing = false; $('#play').textContent = '▶'; } }
  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------------------------------------------
document.addEventListener('click', (e) => {
  const b = e.target.closest('button, tr[data-mark], .barra-uso');
  if (!b) return;
  if (b.dataset.tab) { tab = b.dataset.tab; render(); return; }
  if (b.dataset.sub) { subPiezas = b.dataset.sub; selMark = null; render(); return; }
  if (b.dataset.mark) { selMark = b.dataset.mark; render(); return; }
  if (b.dataset.maq) { selMaq = selMaq === b.dataset.maq ? null : b.dataset.maq; gemelo.seleccionarMaquina(selMaq); render(); return; }
  if (b.dataset.dl) { DESCARGAS[b.dataset.dl](); return; }
  if (b.dataset.pieza) { abrirPieza(b.dataset.pieza); return; }
  if (b.hasAttribute('data-cerrar')) { b.closest('dialog').close(); return; }
  if (b.id === 'btn-escanear') { escanear(); return; }
  if (b.id === 'btn-fabricadas') {
    const s = store.get();
    for (const pz of op.despiece.piezas) { const o = (op.sim.jobs[pz.id] || []).at(-1); if (o && o.end <= t && (s[pz.id] || 'pendiente') === 'pendiente') store.set(pz.id, 'fabricada'); }
    if (t === 0) alert('Mueve la línea de tiempo de la planta: se marcan como fabricadas las piezas que ya salieron del escáner.');
    return;
  }
});
$('#form-codigo').addEventListener('submit', () => { const v = $('#codigo').value.trim().toUpperCase(); if (v) setTimeout(() => abrirPieza(v), 50); });
$('#btn-zip').onclick = DESCARGAS.zip;
$('#play').onclick = () => { playing = !playing; if (playing && t >= op.sim.makespan) setT(0); $('#play').textContent = playing ? '❚❚' : '▶'; };
$('#tiempo').oninput = (e) => setT(+e.target.value);
$$('#velocidades button').forEach((b) => b.onclick = () => { vel = +b.dataset.v; $$('#velocidades button').forEach((x) => x.classList.toggle('on', x === b)); });
fuenteSel.onchange = () => { history.replaceState(null, '', base()); nuevaOrden(); };
$('#dianoche').onclick = () => { document.body.classList.toggle('dia'); try { localStorage.setItem('acerostudio.dia', document.body.classList.contains('dia') ? '1' : ''); } catch { /* */ } gemelo.draw(); if (tab === 'corte') lienzo(); };
try { if (localStorage.getItem('acerostudio.dia')) document.body.classList.add('dia'); } catch { /* */ }

nuevaOrden();
setT(+params.get('t') || Math.round(op.sim.makespan * 0.18));
requestAnimationFrame((n) => { ultimo = n; frame(n); });
if (params.get('pieza')) abrirPieza(params.get('pieza'));
window.fabrica = { get op() { return op; }, setT, abrirPieza, gemelo, render, set tab(v) { tab = v; render(); } };
