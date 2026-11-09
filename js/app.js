import { crearCiudad, fmt, PERFILES } from './ciudad.js';
// AceroStudio · App (UX/UI "Ciudad de acero"): navegación por pantallas y una escena 3D compartida.

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const movil = () => matchMedia('(max-width: 900px)').matches;
const FOTO_IA = window.FOTO_IA || 'images/app/render-ia-corredor.jpg';
const COSTO_T = 2400; // USD por tonelada montada (supuesto)

/* ---------------- dibujos isométricos (tarjetas de proyecto) ---------------- */
function rngS(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function isoSVG(svg, { semilla = 1, destacados = [], via = true, w = 320, h = 200, escala = 7 } = {}) {
  const R = rngS(semilla), cx = w / 2, cy = h * 0.42, c30 = 0.866, s30 = 0.5;
  const P = (x, y, z) => [cx + (x - z) * c30 * escala, cy + (x + z) * s30 * escala - y * escala];
  const cajas = [];
  for (let i = -4; i <= 4; i++) for (let j = -4; j <= 4; j++) {
    if (via && Math.abs(i - j * 0.6 - 0.5) < 0.9) continue;
    if (R() < 0.12) continue;
    const d = destacados.find((k) => k.i === i && k.j === j);
    const alto = d ? d.h : 1.2 + Math.pow(R(), 1.6) * 6.5;
    cajas.push({ x: i * 2.2, z: j * 2.2, w: 1.6 + R() * 0.3, d: 1.6 + R() * 0.3, h: alto, dest: !!d });
  }
  cajas.sort((a, b) => (a.x + a.z) - (b.x + b.z));
  const pts = (arr) => arr.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
  let out = `<rect width="${w}" height="${h}" fill="var(--iso-suelo)"/>`;
  if (via) {
    const a = P(-12, 0, -20), b = P(0.5 * 2.2, 0, 0), c = P(14, 0, 22);
    out += `<path d="M${a} Q${b} ${c}" fill="none" stroke="var(--iso-via)" stroke-width="${escala * 1.6}" opacity=".95"/>`;
    out += `<path d="M${a} Q${b} ${c}" fill="none" stroke="var(--iso-via-luz)" stroke-width="${escala * 0.18}" stroke-dasharray="3 6"/>`;
  }
  for (const k of cajas) {
    const x0 = k.x - k.w / 2, x1 = k.x + k.w / 2, z0 = k.z - k.d / 2, z1 = k.z + k.d / 2;
    const top = [P(x0, k.h, z0), P(x1, k.h, z0), P(x1, k.h, z1), P(x0, k.h, z1)];
    const izq = [P(x0, 0, z1), P(x1, 0, z1), P(x1, k.h, z1), P(x0, k.h, z1)];
    const der = [P(x1, 0, z0), P(x1, 0, z1), P(x1, k.h, z1), P(x1, k.h, z0)];
    if (k.dest) {
      const st = `stroke="var(--negro)" stroke-width="1.3" stroke-linejoin="round"`;
      out += `<polygon points="${pts(izq)}" fill="var(--iso-cel-2)" ${st}/><polygon points="${pts(der)}" fill="var(--iso-cel-3)" ${st}/><polygon points="${pts(top)}" fill="var(--iso-cel)" ${st}/>`;
      for (let y = 1.2; y < k.h; y += 1.2) { const a = P(x0, y, z1), b = P(x1, y, z1), c = P(x1, y, z0); out += `<polyline points="${pts([a, b, c])}" fill="none" stroke="var(--negro)" stroke-width=".6" opacity=".55"/>`; }
    } else {
      out += `<polygon points="${pts(izq)}" fill="var(--iso-lit)"/><polygon points="${pts(der)}" fill="var(--iso-shd)"/><polygon points="${pts(top)}" fill="var(--iso-top)"/>`;
    }
  }
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.innerHTML = out;
}
// tokens de dibujo (cambian con día/noche)
const css = document.createElement('style');
css.textContent = `:root{--iso-suelo:#262b3a;--iso-top:#4d5f79;--iso-lit:#4f5f79;--iso-shd:#363e51;--iso-via:#e29699;--iso-via-luz:#ffe9b8;--iso-cel:#bfe2fb;--iso-cel-2:#a5cdee;--iso-cel-3:#8fb9de}
body.dia{--iso-suelo:#e3e5ea;--iso-top:#ffffff;--iso-lit:#f1f2f6;--iso-shd:#d9dde5;--iso-via:#ee8a82;--iso-via-luz:#fff;--iso-cel:#bfe2fb;--iso-cel-2:#a9d4f6;--iso-cel-3:#92c1e8}`;
document.head.appendChild(css);

const PROYECTOS = [
  { n: 'Corredor de acero', l: 'Av. 26 · Bogotá', e: ['coral', 'con cliente'], t: 382, k: 64, a: 'hace 12 min', s: 7, d: [{ i: 1, j: 2, h: 7 }, { i: -2, j: -2, h: 5 }], href: '#editor' },
  { n: 'Torre escalonada', l: 'Chapinero · Bogotá', e: ['coral', 'con cliente'], t: 163, k: 57, a: 'hoy', s: 21, d: [{ i: 0, j: 0, h: 8.5 }], href: '#acero' },
  { n: 'Bodega Fontibón', l: 'nave 42 m de luz', e: ['amar', 'en diseño'], t: 96, k: 38, a: 'hoy', s: 4, d: [{ i: 0, j: 1, h: 2.4 }, { i: 1, j: 1, h: 2.4 }], via: false, href: '#nuevo' },
  { n: 'Casa Celosía', l: 'La Calera', e: ['ok', 'aprobado'], t: 21, k: 44, a: 'ayer', s: 11, d: [{ i: 0, j: 0, h: 2.8 }], via: false, href: '#render' },
  { n: 'Parque bajo el viaducto', l: 'Calle 80', e: ['amar', 'en diseño'], t: 58, k: 31, a: 'lun', s: 33, d: [{ i: 2, j: 2, h: 1.6 }, { i: 3, j: 2, h: 1.6 }], href: '#lamina' },
  { n: 'Faro Usaquén', l: 'torre de oficinas', e: ['', 'borrador'], t: 240, k: 69, a: 'sep', s: 9, d: [{ i: -1, j: 1, h: 9 }], href: '#editor' },
];
function pintarProyectos() {
  const cont = $('#proyectos');
  cont.innerHTML = PROYECTOS.map((p, i) => `<a class="proy" href="${p.href}"><div class="img"><svg id="iso${i}" aria-hidden="true"></svg><span class="chip ${p.e[0]}">${p.e[1]}</span></div>
    <div class="txt"><b>${p.n}</b><span>${p.l}</span><div class="datos"><span><i class="num">${fmt(p.t)}</i> t</span><span><i class="num">${p.k}</i> kg/m²</span><span>${p.a}</span></div></div></a>`).join('');
  PROYECTOS.forEach((p, i) => isoSVG($('#iso' + i), { semilla: p.s, destacados: p.d, via: p.via !== false }));
  isoSVG($('#heroIso'), { semilla: 7, destacados: [{ i: 1, j: 2, h: 8 }, { i: -2, j: -2, h: 6 }], w: 480, h: 300, escala: 9 });
  $$('.filtros button').forEach((b) => b.onclick = () => {
    $$('.filtros button').forEach((x) => x.classList.toggle('on', x === b));
    const f = b.textContent.toLowerCase();
    $$('.proy').forEach((el, i) => { el.hidden = !(f === 'todos' || PROYECTOS[i].e[1].startsWith(f.replace(/s$/, '').replace('aprobado', 'aprobado'))); });
  });
}

/* ---------------- escena compartida ---------------- */
let ciudad = null, A, B;
const escena = $('#escena');
const oculto = document.createElement('div');
oculto.style.cssText = 'position:absolute;left:0;top:0;width:1400px;height:900px;visibility:hidden;pointer-events:none;';
$('.vista').appendChild(oculto);

function asegurarCiudad() {
  if (ciudad) return ciudad;
  ciudad = crearCiudad($('#ciudad'), $('#capa'), { vista: 165, centro: [-16, 0, -4], deriva: false });
  [A, B] = ciudad.complejos;
  ciudad.alElegir((c) => fichas(c || A));
  ciudad.mostrarAcero(false);
  notas(true);
  $('#largo').textContent = fmt(ciudad.largoVia);
  $('#tonChat').textContent = fmt(A.ton + B.ton);
  $('#heroTon').textContent = `${fmt(A.ton + B.ton)} t`;
  $('#respA').textContent = `El complejo A pesa ${fmt(A.ton)} t de acero (${fmt(A.kgm2)} kg/m² sobre ${fmt(A.area)} m²). La cercha Warren del puente concentra buena parte: la resalté en la ficha.`;
  ciudad.elegir('A');
  $$('.uso-p').forEach((e) => { const t = e.dataset.t; const kg = ciudad.complejos.reduce((s, c) => s + (c.metros?.[t] || 0) * PERFILES[t].kgm, 0); e.textContent = `${fmt(kg / 1000, 1)} t en Corredor`; });
  window.ciudad = ciudad;
  return ciudad;
}
function notas(si) {
  if (!ciudad) return;
  if (!si) { ciudad.anotar([]); return; }
  const m = movil();
  ciudad.anotar([
    { complejo: 'A', at: A.ancla, dx: m ? -40 : 90, dy: -50, html: `complejo A/.<small>${fmt(A.ton)} t · ${fmt(A.kgm2)} kg/m²</small>` },
    { complejo: 'B', at: B.ancla, dx: m ? 40 : 90, dy: -40, html: `complejo B/.<small>${fmt(B.ton)} t · ${fmt(B.kgm2)} kg/m²</small>` },
    { tipo: 'zona', via: 0, u: 0.3, off: 24, html: 'zona “A”' },
    { tipo: 'zona', via: 0, u: 0.44, off: -24, html: 'zona “B”' },
    { tipo: 'zona', via: 1, u: 0.55, off: -24, html: 'zona “C”' },
  ]);
}

/* ---------------- fichas (todas las instancias) ---------------- */
const COLORES = { columna: '#ee7f74', viga: '#b6dbf8', riostra: '#8fa0c4', cercha: '#ffd27a' };
const ETIQ = { columna: 'Columnas', viga: 'Vigas', riostra: 'Riostras', cercha: 'Cercha Warren' };
const NOMBRES = { A: ['Puente habitable', 'vivienda + comercio'], B: ['Torre escalonada', 'oficinas + mirador'] };
const semanas = (c) => Math.max(4, Math.round(c.ton / 12));
let actual = null;
function setNum(sel, v) { $$(sel).forEach((el) => { if (el.firstChild) el.firstChild.textContent = v; }); }
function fichas(c) {
  actual = c;
  const [n, uso] = NOMBRES[c.id];
  $$('.fId').forEach((e) => (e.textContent = `complejo ${c.id}/.`));
  $$('.fNombre').forEach((e) => (e.textContent = n));
  $$('.fUso').forEach((e) => (e.textContent = `${uso} · acero estructural`));
  setNum('.kTon', fmt(c.ton)); setNum('.kKg', fmt(c.kgm2)); setNum('.kArea', fmt(c.area)); setNum('.kPisos', fmt(c.pisos));
  setNum('.kCosto', fmt(c.ton * COSTO_T / 1000)); setNum('.kSem', semanas(c));
  $$('.kAlt').forEach((e) => (e.textContent = `${fmt(c.altura, 1)} m de altura`));
  const filas = Object.entries(c.miembros);
  const tons = filas.map(([t]) => (c.metros?.[t] || 0) * PERFILES[t].kgm / 1000);
  $$('.barra').forEach((e) => (e.innerHTML = filas.map(([t], i) => `<span style="flex:${tons[i]};background:${COLORES[t]}"></span>`).join('')));
  $$('.perfiles').forEach((e) => (e.innerHTML = filas.map(([t, k], i) => `<tr><td><i class="rombo" style="background:${COLORES[t]}"></i>${ETIQ[t]} · ${PERFILES[t].nombre}</td><td class="n">${k}</td><td class="n">${fmt(c.metros?.[t] || 0)}</td><td class="n">${fmt(PERFILES[t].kgm, 1)}</td><td class="n">${fmt(tons[i], 1)}</td></tr>`).join('')
    + `<tr><td><b style="font-weight:500">Total</b></td><td class="n">${filas.reduce((s, [, k]) => s + k, 0)}</td><td class="n">${fmt(Object.values(c.metros || {}).reduce((s, m) => s + m, 0))}</td><td class="n"></td><td class="n" style="color:var(--coral)">${fmt(c.ton, 1)}</td></tr>`));
  // lámina
  $$('.lTon').forEach((e) => (e.textContent = fmt(c.ton))); $$('.lArea').forEach((e) => (e.textContent = fmt(c.area)));
  $$('.lPisos').forEach((e) => (e.textContent = fmt(c.pisos))); $$('.lSem').forEach((e) => (e.textContent = semanas(c)));
  $$('[data-comp]').forEach((b) => b.classList.toggle('on', b.dataset.comp === c.id));
  gantt(c); comparar(c);
}
function gantt(c) {
  const S = semanas(c), tot = S + 2;
  const fases = [
    ['Anclajes y placas base', 0, 2, '#8fa0c4'],
    ['Columnas HEB', 1, Math.round(S * 0.45), '#ee7f74'],
    ['Vigas IPE + steel deck', 2, Math.round(S * 0.55), '#b6dbf8'],
    ...(c.miembros.cercha ? [['Cercha Warren (izaje)', Math.round(S * 0.45), 3, '#ffd27a']] : []),
    ['Riostras y nudos', Math.round(S * 0.5), Math.round(S * 0.35), '#8fa0c4'],
    ['Fachada y cierre', Math.round(S * 0.7), tot - Math.round(S * 0.7), 'var(--suave)'],
  ];
  $('#gantt').innerHTML = fases.map(([n, a, d, col]) => `<div class="g"><span>${n}</span><div class="pista"><i style="left:${a / tot * 100}%;width:${d / tot * 100}%;background:${col}"></i></div></div>`).join('')
    + `<div class="eje"><span></span><div><span>sem 0</span><span>${Math.round(tot / 2)}</span><span>${tot}</span></div></div>`;
}
function comparar(c) {
  // cuantías típicas: estructura de acero vs pórticos de concreto (indicativo)
  const filas = [
    ['Peso propio', 1, 1.55, (v) => `${fmt(v * c.area * 0.42)} t`],
    ['Plazo', semanas(c), Math.round(semanas(c) * 1.6), (v) => `${v} sem`],
    ['CO₂ estructura', 1, 1.25, (v) => `${fmt(v * c.ton * 1.4)} t`],
  ];
  $('#comparar').innerHTML = filas.map(([n, ac, co, f]) => {
    const m = Math.max(ac, co);
    return `<div class="comp"><span class="seccion-tag" style="font-size:10px">${n}</span>
      <div class="lin"><span>acero</span><i style="width:${ac / m * 100}%;background:var(--coral)"></i><em>${f(ac)}</em></div>
      <div class="lin"><span>concreto</span><i style="width:${co / m * 100}%;background:rgba(var(--tinta-rgb),.3)"></i><em>${f(co)}</em></div></div>`;
  }).join('');
}

/* ---------------- luz día/noche ---------------- */
let hora = 1;
const SOL = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="16" cy="16" r="6" fill="currentColor"/><path d="M16 3v4M16 25v4M3 16h4M25 16h4M7 7l3 3M22 22l3 3M7 25l3-3M22 10l3-3"/></svg>';
const LUNA = '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M19.5 4.5a11.5 11.5 0 1 0 8 19.9A10 10 0 0 1 19.5 4.5z"/></svg>';
function aplicarHora(t) {
  hora = t;
  document.body.classList.toggle('dia', t < 0.5);
  ciudad?.aplicarHora(t);
  const min = 12 * 60 + Math.round(t * 450), s = `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`;
  $$('.horaOut').forEach((o) => (o.textContent = s)); $$('.horaMeta').forEach((o) => (o.textContent = s + ' hr'));
  $$('[data-hora]').forEach((r) => { if (+r.value !== Math.round(t * 100)) r.value = Math.round(t * 100); });
  $$('[data-modo]').forEach((b) => b.classList.toggle('on', (b.dataset.modo === '1') === (t >= 0.5)));
  $$('[data-luz]').forEach((b) => (b.innerHTML = t >= 0.5 ? SOL : LUNA));
  $('#saludo').textContent = t >= 0.5 ? 'buenas noches/.' : 'buenas tardes/.';
  $$('.estilo[data-estilo]').forEach((b) => { if (b.dataset.estilo !== 'foto') b.classList.toggle('on', (b.dataset.estilo === 'noche') === (t >= 0.5) && !fotoOn); });
}
function irA(v) {
  const de = hora, t0 = performance.now();
  (function paso(now) { const k = Math.min(1, (now - t0) / 700); aplicarHora(de + (v - de) * k); if (k < 1) requestAnimationFrame(paso); })(t0);
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-luz]'); if (b) irA(hora >= 0.5 ? 0 : 1);
  const m = e.target.closest('[data-modo]'); if (m) irA(+m.dataset.modo);
  const ac = e.target.closest('[data-acero]'); if (ac && ciudad) { const s = !ciudad.acero; ciudad.mostrarAcero(s); $$('[data-acero]').forEach((x) => x.setAttribute('aria-pressed', s)); }
  const nt = e.target.closest('[data-notas]'); if (nt) { const s = nt.getAttribute('aria-pressed') !== 'true'; nt.setAttribute('aria-pressed', s); notas(s); }
  const sm = e.target.closest('[data-simple]'); if (sm) sm.setAttribute('aria-pressed', sm.getAttribute('aria-pressed') !== 'true');
  const cp = e.target.closest('[data-comp]'); if (cp && ciudad) { ciudad.elegir(cp.dataset.comp); enfocarComplejo(cp.dataset.comp); }
  const ts = e.target.closest('[data-toast]'); if (ts) toast(ts.dataset.toast);
});
document.addEventListener('input', (e) => { if (e.target.matches('[data-hora]')) aplicarHora(e.target.value / 100); });

let tt;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2600); }

/* ---------------- cámaras por pantalla ---------------- */
const BASE = { az: 45, el: 41, vista: 165, centro: [-16, 0, -4] };
function enfocarComplejo(id, ms = 700) {
  const c = id === 'B' ? B : A;
  return ciudad.camara({ az: id === 'B' ? 58 : 32, el: 34, vista: movil() ? 110 : 92, centro: [c.pos[0] + (id === 'A' ? 10 : -4), 14, c.pos[2]] }, ms);
}
const TOMAS = [
  { id: 'aerea', n: 'aérea', info: 'isométrica · 41°', cam: () => BASE },
  { id: 'puente', n: 'puente habitable', info: 'complejo A · 30°', cam: () => ({ az: 24, el: 28, vista: 88, centro: [A.pos[0] + 10, 16, A.pos[2]] }) },
  { id: 'viaducto', n: 'sobre el viaducto', info: 'rasante · 20°', cam: () => ({ az: 78, el: 20, vista: 120, centro: [-20, 6, 10] }) },
  { id: 'torre', n: 'torre escalonada', info: 'complejo B · 36°', cam: () => ({ az: 60, el: 36, vista: 84, centro: [B.pos[0] - 4, 14, B.pos[2]] }) },
  { id: 'cenital', n: 'cenital', info: 'planta · 70°', cam: () => ({ az: 45, el: 70, vista: 210, centro: [-16, 0, -4] }) },
];
let tomaSel = 0, fotoOn = false, tomasListas = false;

/* ---------------- render ---------------- */
async function capturarTomas() {
  if (tomasListas) return; tomasListas = true;
  const prev = ciudad.vistaActual; const imgs = [];
  for (const t of TOMAS) { await ciudad.camara(t.cam(), 0); imgs.push(ciudad.foto(0.7)); }
  // miniaturas de estilo
  const h0 = hora; ciudad.aplicarHora(0); await ciudad.camara(TOMAS[0].cam(), 0); $('#eMaqueta').style.backgroundImage = `url(${ciudad.foto(0.7)})`;
  ciudad.aplicarHora(1); $('#eNoche').style.backgroundImage = `url(${imgs[0]})`; ciudad.aplicarHora(h0);
  $('#eFoto').style.backgroundImage = `url(${FOTO_IA})`;
  await ciudad.camara(prev, 0);
  $('#tomas').innerHTML = TOMAS.map((t, i) => `<button class="toma${i === tomaSel ? ' on' : ''}" data-toma="${i}" role="option"><span class="img" style="background-image:url(${imgs[i]})"><small>${String(i + 1).padStart(2, '0')}</small></span>${t.n}</button>`).join('')
    + `<button class="toma nueva" data-toast="Toma guardada desde la vista actual"><span class="img">+</span>guardar vista actual</button>`;
  $$('[data-toma]').forEach((b) => b.onclick = () => elegirToma(+b.dataset.toma));
}
function elegirToma(i, ms = 800) {
  tomaSel = i; const t = TOMAS[i];
  $$('[data-toma]').forEach((b) => b.classList.toggle('on', +b.dataset.toma === i));
  $('#tomaNombre').textContent = t.n + '/.'; $('#tomaInfo').textContent = 'cámara ' + t.info;
  return ciudad.camara(t.cam(), ms);
}
function marco(f) {
  const [a, b] = f.split(':').map(Number);
  const slot = $('[data-slot="render"]'); const W = slot.clientWidth * 0.92, H = slot.clientHeight * 0.82;
  const k = Math.min(W / a, H / b); const m = $('#marco'); m.style.width = a * k + 'px'; m.style.height = b * k + 'px';
  const px = { '16:9': '3840 × 2160', '4:5': '2160 × 2700', '9:16': '2160 × 3840', '1:1': '2880 × 2880' }[f];
  $('#marcoTxt').textContent = `${f} · ${px}`;
}
let formato = '16:9';
$$('.formatos [data-f]').forEach((b) => b.onclick = () => { formato = b.dataset.f; $$('.formatos [data-f]').forEach((x) => x.classList.toggle('on', x === b)); marco(formato); });
$$('.estilo[data-estilo]').forEach((b) => b.onclick = () => {
  $$('.estilo[data-estilo]').forEach((x) => x.classList.toggle('on', x === b));
  fotoOn = b.dataset.estilo === 'foto';
  const f = $('#fotoIA'); f.style.backgroundImage = `url(${FOTO_IA})`; f.classList.toggle('on', fotoOn);
  if (!fotoOn) irA(b.dataset.estilo === 'noche' ? 1 : 0);
});
const cola = [];
function pintarCola() {
  $('#cola').innerHTML = cola.map((c) => `<div class="trabajo"><i style="background-image:url(${c.img})"></i><div>${c.n}<small>${c.f} · ${c.estilo}</small></div><span class="chip ${c.listo ? 'ok' : 'amar'}">${c.listo ? 'listo' : c.pct + '%'}</span></div>`).join('') || '<span class="aviso" style="margin:0">Nada en cola. Elige una toma y genera.</span>';
}
$('#btnRender').onclick = () => {
  const est = $('.estilo.on')?.querySelector('b').textContent || 'Ciudad de noche';
  const job = { n: TOMAS[tomaSel].n, f: formato, estilo: est, img: fotoOn ? FOTO_IA : ciudad.foto(0.6), pct: 0, listo: false };
  cola.unshift(job); pintarCola();
  const iv = setInterval(() => { job.pct = Math.min(100, job.pct + 9 + Math.round(Math.random() * 12)); if (job.pct >= 100) { job.listo = true; clearInterval(iv); toast(`Render 4K listo: ${job.n}`); } pintarCola(); }, 380);
};

/* ---------------- lámina ---------------- */
async function fotoLamina() {
  const prev = ciudad.vistaActual, h0 = hora, ac = ciudad.acero;
  const noche = $('#hoja').classList.contains('dia') ? 0 : 1;
  ciudad.aplicarHora(noche); ciudad.mostrarAcero(true); ciudad.anotar([]);
  await ciudad.camara({ az: 28, el: 30, vista: 100, centro: [A.pos[0] + 8, 16, A.pos[2] - 4] }, 0);
  $('#hojaFoto').style.backgroundImage = `url(${ciudad.foto(0.85)})`;
  ciudad.aplicarHora(h0); ciudad.mostrarAcero(ac); notas(true); await ciudad.camara(prev, 0);
}
$$('[data-hoja]').forEach((b) => b.onclick = () => {
  $$('[data-hoja]').forEach((x) => x.classList.toggle('on', x === b));
  $('#hoja').classList.toggle('dia', b.dataset.hoja === 'dia'); fotoLamina();
});
$('#copiar').onclick = async () => {
  const txt = 'https://' + $('#enlace').textContent;
  try { await navigator.clipboard.writeText(txt); toast('Enlace copiado'); }
  catch { const r = document.createRange(); r.selectNodeContents($('#enlace')); getSelection().removeAllRanges(); getSelection().addRange(r); toast('Selecciona y copia el enlace'); }
};

/* ---------------- nuevo proyecto ---------------- */
$$('.entrada-op').forEach((b) => b.onclick = () => $$('.entrada-op').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); }));
$$('.entrada-chip').forEach((b) => b.onclick = () => $$('.entrada-chip').forEach((x) => x.classList.toggle('on', x === b)));
$$('.usos button').forEach((b) => b.onclick = () => b.classList.toggle('on'));
$('#pisos').oninput = (e) => ($('#pisosOut').textContent = e.target.value);
$('#pedidoInicio').onsubmit = (e) => { e.preventDefault(); $('#txtNuevo').value = $('#txtInicio').value; location.hash = 'nuevo'; };
let generando = false;
$('#formNuevo').onsubmit = async (e) => {
  e.preventDefault(); if (generando) return; generando = true;
  const lis = $$('#genPasos li'); lis.forEach((l) => (l.className = '')); $('#propuestas').hidden = true; $('#abrirProp').hidden = true;
  $$('.pasos li').forEach((l, i) => (l.className = i < 2 ? 'ok' : 'on'));
  ciudad.mostrarAcero(false); ciudad.anotar([]);
  ciudad.camara({ az: 20, el: 55, vista: 230, centro: [-16, 0, -4] }, 0);
  for (let i = 0; i < lis.length; i++) {
    lis[i].className = 'va'; $('#genPct').textContent = `paso ${i + 1} de ${lis.length}`; $('#genBarra').style.width = ((i + 0.5) / lis.length * 100) + '%';
    if (i === 1) ciudad.camara({ az: 40, el: 44, vista: 180, centro: [-16, 0, -4] }, 1100);
    if (i === 2) { ciudad.mostrarAcero(true); ciudad.camara(BASE, 1100); }
    await new Promise((r) => setTimeout(r, 1100));
    lis[i].className = 'ok';
  }
  $('#genBarra').style.width = '100%'; $('#genPct').textContent = '3 propuestas listas';
  notas(true); $('#propuestas').hidden = false; $('#abrirProp').hidden = false; generando = false;
};
$$('.propuesta').forEach((b) => b.onclick = () => $$('.propuesta').forEach((x) => x.classList.toggle('on', x === b)));

/* ---------------- chat ---------------- */
$('#formChat').onsubmit = (e) => {
  e.preventDefault(); const t = $('#txtChat'); const v = t.value.trim(); if (!v) return;
  responder(v); t.value = '';
};
function responder(v) {
  const h = $('#hilo');
  h.insertAdjacentHTML('beforeend', `<div class="msg yo"></div>`); h.lastElementChild.textContent = v;
  h.insertAdjacentHTML('beforeend', `<div class="msg ia"><div class="quien">AceroStudio</div><span class="tag">pensando…</span></div>`);
  const r = h.lastElementChild; h.scrollTop = h.scrollHeight;
  setTimeout(() => {
    let txt = `Hecho: alargué el puente 6 m. La cercha Warren pasa de 28 a 34 m de luz y el complejo A sube a ${fmt(A.ton * 1.06)} t (+${fmt(A.ton * 0.06, 1)} t).`;
    if (/noche/i.test(v)) { txt = 'Cambié a la luz de las 19:30. Abre Render para sacar la toma en 4K.'; irA(1); }
    if (/pisos/i.test(v)) txt = `Bajé 2 pisos al complejo A: quedan ${A.pisos - 2} pisos y ${fmt(A.ton * 0.87)} t de acero (−13%).`;
    if (/l[aá]mina/i.test(v)) txt = 'Preparé la lámina de venta del complejo A. Está en la pestaña Lámina.';
    r.innerHTML = `<div class="quien">AceroStudio</div>${txt}`; h.scrollTop = h.scrollHeight;
  }, 900);
}
$$('[data-sug]').forEach((b) => b.onclick = () => responder(b.textContent));
$$('.pest-movil [data-panel]').forEach((b) => b.onclick = () => {
  b.closest('.pantalla').dataset.panel = b.dataset.panel;
  $$('.pest-movil [data-panel]').forEach((x) => x.classList.toggle('on', x === b));
});

/* ---------------- exportar, perfiles, sistema ---------------- */
const FORMATOS = [
  ['IFC', 'Revit · ArchiCAD', 'IFC 4 con perfiles, niveles y propiedades de acero.', '6,2 MB', '#b6dbf8'],
  ['DXF', 'AutoCAD', 'Plantas y cortes en capas: ejes, columnas, vigas, cotas.', '1,8 MB', '#ee7f74'],
  ['SKP', 'SketchUp', 'Conector Ruby: volúmenes y estructura agrupados.', '9,4 MB', '#ffd27a'],
  ['BL', 'Blender', 'Escena de Cycles con luz de hora dorada y cámaras.', '22 MB', '#f3a35c'],
  ['3DS', '3ds Max', 'Script MAXScript con materiales de acero.', '7,1 MB', '#8fa0c4'],
  ['HTML', 'Visor web', 'Un solo archivo: ciudad, ficha y recorrido.', '2,3 MB', '#8fd6a8'],
  ['MP4', 'Reel 15 s', 'Animación automática 9:16 y 16:9.', '18 MB', '#e29699'],
  ['XLSX', 'Despiece', 'Perfiles, metros, kg y costo por elemento.', '84 KB', '#d0d6e4'],
];
$('#formatosExp').innerHTML = FORMATOS.map(([s, n, d, p, c], i) => `<div class="fx" id="fx${i}"><span class="ico" style="background:${c}">${s}</span><b>${n}</b><p>${d}</p><div class="pie"><span>${p}</span><button class="bajar" data-fx="${i}">Preparar</button></div></div>`).join('');
$$('[data-fx]').forEach((b) => b.onclick = () => {
  const fx = $('#fx' + b.dataset.fx); if (fx.classList.contains('listo')) { toast('Este prototipo no descarga archivos; en el Studio real sí.'); return; }
  b.textContent = 'Preparando…'; b.disabled = true;
  setTimeout(() => { fx.classList.add('listo'); b.textContent = 'Listo ✓'; b.disabled = false; }, 1200);
});
const CATALOGO = [
  ['HEB 200', 'HEB', 'Columnas de casas y naves', 200, 61.3], ['HEB 300', 'HEB', 'Columnas de torres', 300, 117], ['HEB 400', 'HEB', 'Columnas de planta baja', 400, 155],
  ['IPE 270', 'IPE', 'Vigas de piso, luces de 6 m', 270, 36.1], ['IPE 360', 'IPE', 'Vigas principales, luces de 8 m', 360, 57.1], ['IPE 450', 'IPE', 'Vigas de transferencia', 450, 77.6],
  ['SHS 150×8', 'Tubo cuadrado', 'Riostras y diagonales', 150, 34.4], ['CHS 219×10', 'Tubo redondo', 'Cerchas y puentes', 219, 51.6], ['UPN 200', 'UPN', 'Correas y bordes de losa', 200, 25.3],
];
$('#catalogo').innerHTML = CATALOGO.map(([n, f, u, h, k]) => `<tr><td><b style="font-weight:500">${n}</b></td><td>${f}</td><td style="color:var(--suave)">${u}</td><td class="n">${h}</td><td class="n">${fmt(k, 1)}</td></tr>`).join('');
const SECC = {
  columna: '<path d="M20 10h60M20 82h60M50 10v72" stroke="var(--coral)" stroke-width="7" fill="none"/>',
  viga: '<path d="M30 8h40M30 84h40M50 8v76" stroke="var(--celeste)" stroke-width="5" fill="none"/>',
  riostra: '<rect x="22" y="12" width="56" height="68" fill="none" stroke="#8fa0c4" stroke-width="7"/>',
  cercha: '<circle cx="50" cy="46" r="34" fill="none" stroke="#ffd27a" stroke-width="7"/>',
};
$('#cat').innerHTML = Object.entries(PERFILES).map(([t, p]) => `<div class="perfil panel"><svg viewBox="0 0 100 92">${SECC[t]}</svg><b>${p.nombre}</b><span>${ETIQ[t]}</span><div class="k"><span>${fmt(p.kgm, 1)} kg/m</span><span class="uso-p" data-t="${t}">en uso</span></div></div>`).join('');
const MUESTRAS = [['Pizarra', '#363d56', 'fondo de noche'], ['Bloque', '#4d5f79', 'techos de ciudad'], ['Malva', '#5f5266', 'base de fachadas'], ['Coral', '#ee7f74', 'acción · viaducto'], ['Celeste', '#b6dbf8', 'lo que es tuyo'], ['Negro', '#0b0d14', 'contorno de acero'],
  ['Maqueta', '#ffffff', 'día · volumen'], ['Niebla', '#eceef2', 'día · fondo'], ['Grafito', '#1a1e2c', 'día · texto'], ['Ámbar', '#ffd27a', 'cerchas'], ['Hierro', '#8fa0c4', 'riostras'], ['Verde', '#8fd6a8', 'aprobado']];
$('#muestras').innerHTML = MUESTRAS.map(([n, c, u]) => `<div class="muestra"><i style="background:${c}"></i><b style="font-weight:500">${n}</b><small>${c} · ${u}</small></div>`).join('');

/* ---------------- router ---------------- */
const CON_ESCENA = ['nuevo', 'editor', 'acero', 'render'];
const VALIDAS = ['inicio', 'nuevo', 'editor', 'acero', 'render', 'lamina', 'exportar', 'perfiles', 'sistema'];
let pantallaActual = null;
async function ir() {
  let p = location.hash.slice(1); if (!VALIDAS.includes(p)) p = 'inicio';
  if (p === pantallaActual) return; pantallaActual = p;
  $$('.pantalla').forEach((s) => s.classList.toggle('on', s.dataset.p === p));
  $$('.riel [data-r]').forEach((a) => a.classList.toggle('on', a.dataset.r === p));
  const slot = $(`[data-slot="${p}"]`);
  (slot || oculto).prepend(escena);
  if (!CON_ESCENA.includes(p) && p !== 'lamina') return;
  asegurarCiudad(); aplicarHora(hora);
  $('#fotoIA').classList.toggle('on', p === 'render' && fotoOn);
  if (p === 'editor') { ciudad.mostrarAcero(false); notas(true); await ciudad.camara(movil() ? { ...BASE, centro: [-24, 0, 12] } : BASE, 700); }
  if (p === 'acero') { ciudad.mostrarAcero(true); notas(true); await enfocarComplejo(actual?.id || 'A'); }
  if (p === 'nuevo') { notas(true); ciudad.mostrarAcero(true); ciudad.camara(BASE, 700); }
  if (p === 'render') { await capturarTomas(); marco(formato); elegirToma(tomaSel, 600); pintarCola(); }
  if (p === 'lamina') { await fotoLamina(); }
  $$('[data-acero]').forEach((x) => x.setAttribute('aria-pressed', ciudad.acero));
}
addEventListener('hashchange', ir);
addEventListener('resize', () => { if (pantallaActual === 'render') marco(formato); });

pintarProyectos();
aplicarHora(new URLSearchParams(location.search).has('dia') ? 0 : 1);
ir();
