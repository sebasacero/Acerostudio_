// Simulador de soldadura: entrada táctil (dedo hoy, Apple Pencil con presión e inclinación), dibujo, sonido e informe.
import { JUNTAS, PROCESOS, crearJunta, procesoPorId, nuevaSoldadura, iniciarArco, moverArco, cortarArco, evaluar, inclinacion, puntoEn } from './motor.js';
import { Vista, dibujarFondo, estampar, dibujarCalientes, dibujarArco, Particulas, dibujarPortaelectrodo, dibujarCorte, dibujarRitmo } from './dibujo.js';

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const leer = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const DESFASE = 46; // px: con el dedo el arco queda un poco arriba de la yema para ver el charco

const S = Object.assign({
  junta: 'tope', proceso: 'e6013', amp: 110, modo: 'practica', noche: false,
  guia: true, lente: true, careta: true, sonido: true, desfase: true, aceptarDedo: false,
}, leer('soldadura:ajustes', {}));
const guardarAjustes = () => guardar('soldadura:ajustes', S);

let J, P, st, vista, res = null;
let herramienta = 'soldar', lapizVisto = false, activo = null, tipoActivo = null, arcoMuerto = false;
let vivo = null, mira = null, calientes = [], picados = [], sucio = true, lectura = null, autoEval = 0;
const part = new Particulas();

// ---------- lienzos ----------
const lienzo = $('#lienzo'), ctx = lienzo.getContext('2d');
const capa = () => document.createElement('canvas');
const capas = { fondo: capa(), tinte: capa(), cordon: capa(), escoria: capa() };
const cx = Object.fromEntries(Object.entries(capas).map(([k, c]) => [k, c.getContext('2d')]));
const lente = $('#lente'), lctx = lente.getContext('2d');

function medir() {
  const r = $('#escena').getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  for (const c of [lienzo, ...Object.values(capas)]) { c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr); }
  lienzo.style.width = r.width + 'px'; lienzo.style.height = r.height + 'px';
  vista = new Vista(r.width, r.height, dpr, J);
  const ld = Math.min(2, dpr); lente.width = lente.height = 150 * ld;
  repintarTodo();
}

function repintarTodo() {
  dibujarFondo(cx.fondo, vista, J, S.noche ? 'noche' : 'dia');
  for (const k of ['tinte', 'cordon', 'escoria']) { cx[k].setTransform(1, 0, 0, 1, 0, 0); cx[k].clearRect(0, 0, capas[k].width, capas[k].height); }
  for (const g of st.gotas) estampar(cx, vista, g, P);
  for (const p of picados) picarEn(p, false);
  sucio = true;
}

// ---------- probeta ----------
function verEscena() { if (matchMedia('(max-width: 860px)').matches) $('#escena').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
function nuevaProbeta() {
  J = crearJunta(S.junta); P = procesoPorId(S.proceso);
  st = nuevaSoldadura(J, P, S.amp, (Math.random() * 1e9) | 0);
  res = null; calientes = []; picados = []; autoEval = 0; herramienta = 'soldar';
  $('#informe').hidden = true; $('#evaluar').disabled = true;
  pintarHerramienta();
  if (vista) { vista = new Vista(vista.w, vista.h, vista.dpr, J); repintarTodo(); }
  pintarPanel(); actualizarHud(null);
}

// ---------- entrada: Pointer Events (dedo, ratón y Apple Pencil) ----------
function punto(e) {
  const r = lienzo.getBoundingClientRect();
  const fx = e.clientX - r.left, fy = e.clientY - r.top;
  const desf = e.pointerType === 'touch' && S.desfase ? DESFASE : 0;
  const ax = fx, ay = fy - desf;
  const [x, y] = vista.aMm(ax, ay);
  const p = { t: e.timeStamp / 1000, x, y, px: [ax, ay], dedo: [fx, fy], tipo: e.pointerType };
  if (e.pointerType === 'pen') {
    p.presion = e.pressure || 0.0001;
    const inc = inclinacion(e), [dx, dy] = vista.dirMm(inc.dx, inc.dy);
    p.incl = { dx, dy, lean: inc.lean };
  }
  return p;
}

lienzo.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  if (e.pointerType === 'pen' && !lapizVisto) { lapizVisto = true; pintarEntrada(); avisar('Apple Pencil activo: la presión es el largo del arco y la inclinación, el ángulo del electrodo.'); }
  if (e.pointerType === 'touch' && lapizVisto && !S.aceptarDedo) return; // la mano se apoya en la pantalla
  if (activo != null) return;
  e.preventDefault();
  $('#inicio').hidden = true;
  sonido.despertar();
  activo = e.pointerId; tipoActivo = e.pointerType; arcoMuerto = false;
  try { lienzo.setPointerCapture(e.pointerId); } catch {}
  const p = punto(e);
  if (herramienta === 'piqueta') { picar(p); return; }
  if (res) { avisar('Esta probeta ya se evaluó. Toque «Otra probeta» para soldar de nuevo.'); $('#nueva').classList.add('latido'); setTimeout(() => $('#nueva').classList.remove('latido'), 1200); return; }
  clearTimeout(autoEval);
  lectura = iniciarArco(st, p);
  vivo = p; sucio = true;
  if (S.sonido) sonido.arco(true, P);
});

lienzo.addEventListener('pointermove', e => {
  if (e.pointerId !== activo) {
    if (e.pointerType === 'pen' && activo == null) { mira = punto(e); sucio = true; } // lápiz flotando (hover)
    return;
  }
  const evs = e.getCoalescedEvents?.() || [];
  for (const ev of (evs.length ? evs : [e])) {
    const p = punto(ev);
    if (herramienta === 'piqueta') { picar(p); continue; }
    if (!st.arco || arcoMuerto) continue;
    const r = moverArco(st, p);
    vivo = p;
    for (const g of r.nuevas) { estampar(cx, vista, g, P); calientes.push(g); }
    if (r.lectura) lectura = r.lectura;
    if (r.lectura?.evento === 'pegado') {
      arcoMuerto = true; sonido.arco(false); navigator.vibrate?.(60);
      avisar(P.tipo === 'smaw' ? '¡Se pegó el electrodo! Está apretando mucho. Levante y vuelva a arrancar.' : 'La boquilla tocó la pieza. Levante y deje más alambre afuera.');
    }
  }
  $('#evaluar').disabled = !st.gotas.length;
  pintarHerramienta();
  sucio = true;
});

function soltar(e) {
  if (e.pointerId !== activo) return;
  activo = null;
  if (herramienta === 'piqueta') return;
  if (st.arco) cortarArco(st, e.timeStamp / 1000);
  vivo = null; sonido.arco(false); sucio = true; pintarHerramienta();
  // si ya recorrió casi toda la junta, se evalúa solo
  if (!res && st.gotas.length) {
    const prev = evaluar(st);
    if (prev && prev.cobertura >= 0.95) autoEval = setTimeout(mostrarInforme, 700);
  }
}
lienzo.addEventListener('pointerup', soltar);
lienzo.addEventListener('pointercancel', soltar);
lienzo.addEventListener('pointerleave', e => { if (e.pointerType === 'pen') { mira = null; sucio = true; } });
lienzo.addEventListener('contextmenu', e => e.preventDefault());

// ---------- piqueta: quitar la escoria a golpes ----------
function picar(p) {
  const ult = picados[picados.length - 1];
  if (ult && Math.hypot(ult.x - p.x, ult.y - p.y) < 1.6) return;
  const g = { x: p.x, y: p.y, r: 2.6 + Math.random() * 2 };
  picados.push(g); picarEn(g, true);
}
function picarEn(g, efecto) {
  const e = cx.escoria; vista.mm(e);
  e.save(); e.globalCompositeOperation = 'destination-out';
  e.beginPath();
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, rr = g.r * (0.7 + ((i * 37) % 10) / 22); i ? e.lineTo(g.x + Math.cos(a) * rr, g.y + Math.sin(a) * rr) : e.moveTo(g.x + rr, g.y); }
  e.closePath(); e.fill(); e.restore();
  if (efecto) {
    const [px, py] = vista.aPx(g.x, g.y);
    for (let i = 0; i < 5; i++) part.chispas.push({ x: px, y: py, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 260, vida: 0, max: 0.35, escama: true });
    if (S.sonido) sonido.golpe();
    sucio = true;
  }
}
$('#quitarEscoria').onclick = () => {
  for (const g of st.gotas) { const p = { x: g.x, y: g.y, r: g.w * 0.9 }; picados.push(p); picarEn(p, false); }
  sucio = true; avisar('Escoria fuera: así se ve el cordón de verdad.');
};

// ---------- cuadro ----------
let ultimo = performance.now() / 1000, parpadeo = 0;
function cuadro(ts) {
  const t = ts / 1000, dt = Math.min(0.05, t - ultimo); ultimo = t;
  const enArco = st.arco && vivo && !arcoMuerto;
  if (enArco) {
    const fuerza = 0.8 + (S.amp / P.ampIdeal - 1) * 1.2 + (lectura?.arco ? (lectura.arco / P.arco.ideal - 1) * 0.6 : 0);
    part.emitir(vivo.px[0], vivo.px[1], Math.max(1, Math.round((P.tipo === 'gmaw' ? 2 : 3) * Math.max(0.4, fuerza))), Math.max(0.5, fuerza), P.tipo === 'gmaw');
    parpadeo = Math.random();
    if (S.sonido) sonido.chisporroteo(lectura, P);
  }
  const vivas = part.paso(dt);
  calientes = calientes.filter(g => t - g.t < 3.2);
  if (sucio || enArco || vivas || calientes.length) pintar(t, enArco);
  if (enArco || sucio) actualizarHud(enArco ? lectura : null, t);
  sucio = false;
  requestAnimationFrame(cuadro);
}

function pintar(t, enArco) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, lienzo.width, lienzo.height);
  ctx.drawImage(capas.fondo, 0, 0); ctx.drawImage(capas.tinte, 0, 0); ctx.drawImage(capas.cordon, 0, 0); ctx.drawImage(capas.escoria, 0, 0);
  const ayudas = S.modo === 'practica';
  if (ayudas && S.guia && !res) guias(t);
  dibujarCalientes(ctx, vista, calientes, t);
  if (enArco) {
    if (S.careta || !ayudas) { vista.px(ctx); ctx.fillStyle = 'rgba(6,26,16,.74)'; ctx.fillRect(0, 0, vista.w, vista.h); dibujarCalientes(ctx, vista, calientes.slice(-12), t); }
    const ancho = st.gotas.length ? st.gotas[st.gotas.length - 1].w : P.ancho;
    dibujarArco(ctx, vista, vivo, P, ancho, parpadeo, lectura?.arco ? lectura.arco / P.arco.ideal : 1);
  }
  part.dibujar(ctx, vista);
  if (vivo && tipoActivo === 'touch' && S.desfase && herramienta === 'soldar') dibujarPortaelectrodo(ctx, vista, vivo.px, vivo.dedo, P, enArco);
  if (mira && activo == null) {
    vista.px(ctx); ctx.strokeStyle = S.noche ? '#b6dbf8' : '#2a6aa6'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(mira.px[0], mira.px[1], 9, 0, Math.PI * 2); ctx.moveTo(mira.px[0] - 14, mira.px[1]); ctx.lineTo(mira.px[0] + 14, mira.px[1]); ctx.moveTo(mira.px[0], mira.px[1] - 14); ctx.lineTo(mira.px[0], mira.px[1] + 14); ctx.stroke();
  }
  // lente de la careta: el charco ampliado, lo que el soldador mira de verdad
  const verLente = enArco && ayudas && S.lente;
  lente.hidden = !verLente;
  if (verLente) {
    const d = vista.dpr, z = 34 * d;
    lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.fillStyle = '#000'; lctx.fillRect(0, 0, lente.width, lente.height);
    lctx.drawImage(lienzo, vivo.px[0] * d - z, vivo.px[1] * d - z, z * 2, z * 2, 0, 0, lente.width, lente.height);
  }
}

function guias(t) {
  vista.mm(ctx);
  ctx.save();
  ctx.strokeStyle = S.noche ? 'rgba(182,219,248,.55)' : 'rgba(42,106,166,.55)'; ctx.lineWidth = 0.35; ctx.setLineDash([2.2, 2.2]);
  ctx.beginPath(); J.tray.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.setLineDash([]);
  // guía de ritmo: un anillo que avanza a la velocidad ideal desde donde arrancó
  if (st.arco && st.dir && !arcoMuerto) {
    const vi = P.vel * (st.amp / P.ampIdeal), s = st.sInicio + st.dir * vi * Math.max(0, t - st.t0 - 0.5);
    if (J.tray.cerrado || (s >= 0 && s <= J.tray.L)) {
      const [x, y] = puntoEn(J.tray, s);
      ctx.strokeStyle = S.noche ? '#b6dbf8' : '#8fc6f0'; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.arc(x, y, P.ancho * 0.75, 0, Math.PI * 2); ctx.stroke();
    }
  }
  ctx.restore();
}

// ---------- tablero en vivo ----------
const hud = $('#hud');
function actualizarHud(l) {
  const practica = S.modo === 'practica';
  hud.hidden = !practica;
  $('#chipExamen').hidden = practica;
  if (!practica) return;
  const vel = $('#hVel'), des = $('#hDes');
  if (!l) { $('#hVelMarca').style.left = '50%'; $('#hDesMarca').style.left = '50%'; vel.dataset.estado = ''; des.dataset.estado = ''; $('#hVelTxt').textContent = '—'; $('#hDesTxt').textContent = '—'; }
  else {
    const sv = l.sv, est = !st.dir ? 'charco' : sv < 0.75 ? 'lento' : sv > 1.35 ? 'rapido' : 'bien';
    vel.dataset.estado = est;
    $('#hVelTxt').textContent = est === 'charco' ? 'formando charco' : `${l.v.toFixed(1)} mm/s · ${est === 'bien' ? 'bien' : est === 'lento' ? 'lento' : 'rápido'}`;
    $('#hVelMarca').style.left = `${Math.max(0, Math.min(100, sv / 2 * 100))}%`;
    const d = l.d, ancho = (st.gotas[st.gotas.length - 1]?.w || P.ancho) / 2;
    des.dataset.estado = Math.abs(d) < ancho * 0.35 ? 'bien' : Math.abs(d) < ancho - 0.8 ? 'cerca' : 'fuera';
    $('#hDesTxt').textContent = Math.abs(d) < 0.3 ? 'centrado' : `${Math.abs(d).toFixed(1)} mm ${lado(d)}`;
    $('#hDesMarca').style.left = `${50 + Math.max(-50, Math.min(50, d / 8 * 50))}%`;
  }
  const lap = $('#hLapiz'); lap.hidden = !(l && l.arco != null);
  if (l && l.arco != null) {
    const ar = l.arco / P.arco.ideal;
    $('#hArco').textContent = `${l.arco.toFixed(1)} mm ${ar < 0.6 ? '· corto' : ar > 1.5 ? '· largo' : ''}`;
    $('#hArco').dataset.estado = ar < 0.6 || ar > 1.5 ? 'mal' : 'bien';
    if (l.avance != null) {
      const av = P.tecnica === 'arrastre' ? l.avance : -l.avance, okA = av >= P.avance[0] - 3 && av <= P.avance[1] + 5;
      $('#hAng').textContent = `${Math.round(Math.abs(l.avance))}° ${l.avance >= 0 ? 'arrastre' : 'empuje'} · ${Math.round(l.trabajo)}° lateral`;
      $('#hAng').dataset.estado = okA && Math.abs(l.trabajo - J.trabajo.ideal) <= J.trabajo.tol ? 'bien' : 'mal';
    }
  }
}
function lado(d) {
  // + es hacia la normal del trayecto; se traduce a lo que el usuario ve en pantalla
  if (J.tray.cerrado) return d > 0 ? 'afuera' : 'adentro';
  if (vista.rot) return d > 0 ? 'a la izquierda' : 'a la derecha';
  return d > 0 ? 'abajo' : 'arriba';
}

// ---------- informe ----------
function mostrarInforme() {
  if (activo != null) return;
  res = evaluar(st);
  if (!res) { avisar('Primero suelde: toque el inicio de la junta y avance.'); return; }
  const inf = $('#informe');
  $('#iTotal').textContent = res.total;
  const ver = $('#iVeredicto'); ver.textContent = res.aprobada ? 'Aprobada' : 'No aprobada'; ver.dataset.ok = res.aprobada;
  $('#iDetalle').textContent = `${J.nombre} ${J.codigo} · ${P.corto} a ${S.amp} A · ${res.conLapiz ? 'Apple Pencil' : 'dedo'} · ${S.modo === 'examen' ? 'examen' : 'práctica'} · ${res.tiempo.toFixed(0)} s de arco`;
  const NOMBRE = { cobertura: 'Junta completa', alineacion: 'Sobre la junta', ritmo: 'Ritmo de avance', uniformidad: 'Ancho parejo', continuidad: 'Sin cortes', tecnica: 'Arco y ángulo' };
  $('#iPuntos').innerHTML = Object.entries(res.puntos).map(([k, v]) => `<li><span>${NOMBRE[k]}</span><b>${v}</b><i style="--v:${v}%"></i></li>`).join('')
    + (res.conLapiz ? '' : '<li class="nota">Con Apple Pencil también se califican el largo de arco y el ángulo.</li>');
  $('#iDatos').innerHTML = [
    ['Velocidad media', `${res.vMedia.toFixed(1)} mm/s`, `ideal ${res.vi.toFixed(1)}`],
    ['Desvío medio', `${res.desvio.toFixed(1)} mm`, ''],
    ['Ancho del cordón', `${res.ancho.toFixed(1)} mm`, `±${Math.round(res.cv * 100)} %`],
    ['Cobertura', `${Math.round(res.cobertura * 100)} %`, ''],
  ].map(([a, b, c]) => `<div><dt>${a}</dt><dd>${b}${c ? ` <small>${c}</small>` : ''}</dd></div>`).join('');
  $('#iDefectos').innerHTML = res.defectos.length
    ? res.defectos.map(d => `<li data-critico="${!!d.critico}"><b>${d.nombre}</b><span>${d.cuenta ? `${d.cuenta} ${d.cuenta === 1 ? 'vez' : 'veces'}` : d.desde != null ? `${Math.round(d.largo)} mm · de ${Math.round(d.desde)} a ${Math.round(d.hasta)} mm` : `${Math.round(d.largo)} mm`}</span></li>`).join('')
    : '<li data-critico="false"><b>Sin defectos visibles</b><span>inspección visual</span></li>';
  $('#iConsejos').innerHTML = res.consejos.map(c => `<li>${c}</li>`).join('');
  $('#picarAhora').hidden = !P.escoria;
  inf.hidden = false;
  requestAnimationFrame(() => {
    dibujarCorte($('#iCorte'), res, J, P, S.noche ? 'noche' : 'dia');
    dibujarRitmo($('#iRitmo'), res.perfil, S.noche ? 'noche' : 'dia');
    inf.scrollTop = 0; $('#iTotal').focus?.();
  });
  const h = leer('soldadura:historial', []);
  h.unshift({ f: Date.now(), junta: J.id, proceso: P.id, amp: S.amp, total: res.total, ok: res.aprobada, modo: S.modo, lapiz: res.conLapiz });
  guardar('soldadura:historial', h.slice(0, 30));
  pintarHistorial();
  $('#evaluar').disabled = true;
}
$('#evaluar').onclick = mostrarInforme;
$('#cerrarInforme').onclick = () => { $('#informe').hidden = true; };
$('#otraDesdeInforme').onclick = nuevaProbeta;
$('#nueva').onclick = nuevaProbeta;
$('#picarAhora').onclick = () => { $('#informe').hidden = true; herramienta = 'piqueta'; pintarHerramienta(); avisar('Pique la escoria pasando el dedo por el cordón, o toque «Quitar toda».'); };
$$('[data-herr]').forEach(b => b.onclick = () => { herramienta = b.dataset.herr; pintarHerramienta(); });
function pintarHerramienta() {
  $$('[data-herr]').forEach(b => b.setAttribute('aria-pressed', b.dataset.herr === herramienta));
  $('#quitarEscoria').hidden = herramienta !== 'piqueta';
  $('#herramientas').hidden = !(P?.escoria && st?.gotas.length) || st?.arco;
  lienzo.dataset.herr = herramienta;
}

// ---------- panel ----------
const ICONO = {
  tope: '<path d="M2 14h12.5l1.5-4h0M21.5 14H34" /><path d="M2 14v6h13v-6M21 14v6h13v-6" /><path d="M16.5 10l1.5 4M19.5 10 18 14" />',
  filete: '<path d="M3 20h30v4H3zM16 4h4v16h-4z" /><path d="M20 20l3-3" />',
  traslape: '<path d="M3 18h30v4H3zM3 13h18v5H3z" /><path d="M21 18l2.5-1.5" />',
  tubo: '<ellipse cx="18" cy="18" rx="8" ry="8" /><ellipse cx="18" cy="18" rx="5" ry="5" /><circle cx="18" cy="18" r="11" stroke-dasharray="2 2" />',
};
function pintarPanel() {
  $('#juntas').innerHTML = JUNTAS.map(j => `<button role="radio" aria-checked="${j.id === S.junta}" data-junta="${j.id}"><svg viewBox="0 0 36 30" aria-hidden="true">${ICONO[j.id]}</svg><b>${j.nombre}</b><small>${j.codigo}</small></button>`).join('');
  $$('[data-junta]').forEach(b => b.onclick = () => { S.junta = b.dataset.junta; guardarAjustes(); nuevaProbeta(); verEscena(); });
  $('#descJunta').textContent = J.desc;
  $('#procesos').innerHTML = PROCESOS.map(p => `<button role="radio" aria-checked="${p.id === S.proceso}" data-proceso="${p.id}"><b>${p.nombre}</b><small>${p.detalle}</small></button>`).join('');
  $$('[data-proceso]').forEach(b => b.onclick = () => {
    S.proceso = b.dataset.proceso; const np = procesoPorId(S.proceso);
    S.amp = np.ampIdeal; guardarAjustes(); nuevaProbeta(); verEscena();
  });
  const amp = $('#amp');
  amp.value = S.amp;
  pintarAmp();
  $$('[data-modo]').forEach(b => b.setAttribute('aria-selected', b.dataset.modo === S.modo));
  for (const k of ['guia', 'lente', 'careta', 'sonido', 'desfase', 'aceptarDedo']) { const c = $(`#o-${k}`); if (c) c.checked = !!S[k]; }
  $('.ayudas').classList.toggle('apagadas', S.modo === 'examen');
  pintarEntrada(); pintarHistorial();
}
function pintarAmp() {
  const amp = $('#amp'), min = +amp.min, max = +amp.max;
  $('#ampVal').textContent = `${S.amp} A`;
  amp.style.setProperty('--a', `${(P.amp[0] - min) / (max - min) * 100}%`);
  amp.style.setProperty('--b', `${(P.amp[1] - min) / (max - min) * 100}%`);
  const fuera = S.amp < P.amp[0] ? 'bajo' : S.amp > P.amp[1] ? 'alto' : '';
  $('#ampRec').innerHTML = `Recomendado para ${P.corto}: <b>${P.amp[0]}–${P.amp[1]} A</b>. Ritmo ideal a ${S.amp} A: <b>${(P.vel * S.amp / P.ampIdeal).toFixed(1)} mm/s</b>${fuera ? ` · <em>amperaje ${fuera}</em>` : ''}.`;
}
$('#amp').addEventListener('input', e => { S.amp = +e.target.value; st.amp = S.amp; pintarAmp(); guardarAjustes(); });
$$('[data-modo]').forEach(b => b.onclick = () => { S.modo = b.dataset.modo; guardarAjustes(); pintarPanel(); actualizarHud(null); sucio = true; avisar(S.modo === 'examen' ? 'Modo examen: sin guía, sin lente y con careta. Un solo intento por probeta.' : 'Modo práctica: guía de ritmo, lente y tablero en vivo.'); });
for (const k of ['guia', 'lente', 'careta', 'sonido', 'desfase', 'aceptarDedo']) {
  const c = $(`#o-${k}`); if (c) c.onchange = () => { S[k] = c.checked; guardarAjustes(); sucio = true; };
}
function pintarEntrada() {
  $('#entrada').innerHTML = lapizVisto
    ? '<b>Apple Pencil</b> · presión = largo de arco, inclinación = ángulo del electrodo. La mano apoyada en la pantalla no suelda.'
    : '<b>Dedo</b> · se califican recorrido, ritmo y pulso. Con Apple Pencil se suman el arco y el ángulo, sin cambiar nada.';
  $('#filaAceptarDedo').hidden = !lapizVisto;
}
function pintarHistorial() {
  const h = leer('soldadura:historial', []);
  $('#historial').innerHTML = h.length ? h.slice(0, 6).map(x => {
    const j = JUNTAS.find(j => j.id === x.junta), p = procesoPorId(x.proceso);
    const f = new Date(x.f).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
    return `<li data-ok="${x.ok}"><b>${x.total}</b><span>${j?.nombre || x.junta} · ${p.corto} ${x.amp} A${x.lapiz ? ' · lápiz' : ''}${x.modo === 'examen' ? ' · examen' : ''}</span><small>${f}</small></li>`;
  }).join('') : '<li class="vacio">Aún no hay pruebas. La primera queda aquí.</li>';
}

// ---------- tema ----------
function aplicarTema() { document.body.classList.toggle('dia', !S.noche); $('#tema').setAttribute('aria-label', S.noche ? 'Cambiar a modo día' : 'Cambiar a modo noche'); }
$('#tema').onclick = () => { S.noche = !S.noche; guardarAjustes(); aplicarTema(); repintarTodo(); };

// ---------- avisos ----------
let tAviso = 0;
function avisar(txt) { const a = $('#aviso'); a.textContent = txt; a.classList.add('ver'); clearTimeout(tAviso); tAviso = setTimeout(() => a.classList.remove('ver'), 4200); }

// ---------- sonido: chisporroteo del arco con Web Audio (sin archivos) ----------
const sonido = {
  ac: null,
  despertar() {
    if (!S.sonido) return;
    if (!this.ac) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      const ac = this.ac = new AC();
      const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const fuente = (filtro, f, q) => { const s = ac.createBufferSource(); s.buffer = buf; s.loop = true; const b = ac.createBiquadFilter(); b.type = filtro; b.frequency.value = f; b.Q.value = q; const g = ac.createGain(); g.gain.value = 0; s.connect(b).connect(g); s.start(); return { b, g }; };
      this.master = ac.createGain(); this.master.gain.value = 0.9; this.master.connect(ac.destination);
      this.siseo = fuente('bandpass', 2600, 0.7); this.siseo.g.connect(this.master);
      this.chasquido = fuente('highpass', 3200, 0.5); this.chasquido.g.connect(this.master);
      const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 120; const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500;
      this.zumbido = ac.createGain(); this.zumbido.gain.value = 0; o.connect(lp).connect(this.zumbido).connect(this.master); o.start();
    }
    this.ac.resume?.();
  },
  arco(on, P) {
    if (!this.ac) return;
    const t = this.ac.currentTime;
    this.siseo.g.gain.setTargetAtTime(on ? 0.16 : 0, t, on ? 0.02 : 0.05);
    this.zumbido.gain.setTargetAtTime(on && P?.tipo === 'gmaw' ? 0.05 : 0, t, 0.03);
    if (!on) this.chasquido.g.gain.setTargetAtTime(0, t, 0.03);
  },
  chisporroteo(l, P) {
    if (!this.ac) return;
    const t = this.ac.currentTime, largo = l?.arco ? l.arco / P.arco.ideal : 1;
    // el "tocino friéndose" de un arco bien llevado: chasquidos cortos y parejos; arco largo = siseo más fuerte y agudo
    this.chasquido.g.gain.setValueAtTime(Math.random() < 0.35 ? 0.08 + Math.random() * 0.22 : 0.02, t);
    this.siseo.b.frequency.setTargetAtTime(2200 + Math.min(2, largo) * 900, t, 0.05);
    this.siseo.g.gain.setTargetAtTime(0.1 + Math.min(2.2, largo) * 0.07, t, 0.05);
  },
  golpe() {
    if (!this.ac) return;
    const t = this.ac.currentTime, o = this.ac.createOscillator(), g = this.ac.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(2400 + Math.random() * 900, t);
    g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.1);
  },
};

// ---------- arranque ----------
aplicarTema();
J = crearJunta(S.junta); P = procesoPorId(S.proceso);
if (S.amp < 40 || S.amp > 240) S.amp = P.ampIdeal;
nuevaProbeta();
new ResizeObserver(() => medir()).observe($('#escena'));
medir();
requestAnimationFrame(cuadro);
document.addEventListener('visibilitychange', () => { if (document.hidden) sonido.ac?.suspend(); });
// para pruebas automáticas
window.__soldadura = { get st() { return st; }, get res() { return res; }, get vista() { return vista; }, S };
