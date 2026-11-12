import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { crearCiudad, fmt, PERFILES } from '../../js/ciudad.js';
import { BASE, movil } from './datos.js';

// Estado compartido de la app: la escena 3D (una sola, se mueve entre pantallas), la hora, el acero visible, etc.
const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const SOL = <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="16" cy="16" r="6" fill="currentColor" /><path d="M16 3v4M16 25v4M3 16h4M25 16h4M7 7l3 3M22 22l3 3M7 25l3-3M22 10l3-3" /></svg>;
const LUNA = <svg viewBox="0 0 32 32" fill="currentColor"><path d="M19.5 4.5a11.5 11.5 0 1 0 8 19.9A10 10 0 0 1 19.5 4.5z" /></svg>;

export function horaTexto(t) {
  const min = 12 * 60 + Math.round(t * 450);
  return `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`;
}

export function AppProvider({ children }) {
  const [hora, setHoraEstado] = useState(() => (new URLSearchParams(location.search).has('dia') ? 0 : 1));
  const [acero, setAceroEstado] = useState(false);
  const [notasOn, setNotasOn] = useState(true);
  const [actualId, setActualId] = useState('A');
  const [listo, setListo] = useState(false);
  const [toast, setToastTxt] = useState('');
  const ciudadRef = useRef(null);
  const horaRef = useRef(hora);
  const escenaEl = useMemo(() => {
    const d = document.createElement('div'); d.id = 'escena';
    d.innerHTML = '<canvas id="ciudad"></canvas><div class="iso-capa" id="capa"></div>';
    return d;
  }, []);
  const parking = useMemo(() => {
    const d = document.createElement('div');
    d.style.cssText = 'position:absolute;left:0;top:0;width:1400px;height:900px;visibility:hidden;pointer-events:none;overflow:hidden';
    return d;
  }, []);
  // El parqueadero vive en <body>; la escena solo se guarda ahí si ningún Slot la tomó antes (los efectos de los hijos corren primero).
  useLayoutEffect(() => { document.body.appendChild(parking); if (!escenaEl.parentNode) parking.appendChild(escenaEl); return () => parking.remove(); }, [parking, escenaEl]);

  const aplicarHora = useCallback((t) => {
    horaRef.current = t; setHoraEstado(t);
    document.body.classList.toggle('dia', t < 0.5);
    ciudadRef.current?.aplicarHora(t);
  }, []);
  useEffect(() => { document.body.classList.toggle('dia', hora < 0.5); }, []);

  const irA = useCallback((v) => {
    const de = horaRef.current, t0 = performance.now();
    (function paso(now) { const k = Math.min(1, (now - t0) / 700); aplicarHora(de + (v - de) * k); if (k < 1) requestAnimationFrame(paso); })(t0);
  }, [aplicarHora]);

  const notas = useCallback((si) => {
    const c = ciudadRef.current; if (!c) return;
    setNotasOn(si);
    if (!si) { c.anotar([]); return; }
    const [A, B] = c.complejos, m = movil();
    c.anotar([
      { complejo: 'A', at: A.ancla, dx: m ? -40 : 90, dy: -50, html: `complejo A/.<small>${fmt(A.ton)} t · ${fmt(A.kgm2)} kg/m²</small>` },
      { complejo: 'B', at: B.ancla, dx: m ? 40 : 90, dy: -40, html: `complejo B/.<small>${fmt(B.ton)} t · ${fmt(B.kgm2)} kg/m²</small>` },
      { tipo: 'zona', via: 0, u: 0.3, off: 24, html: 'zona “A”' },
      { tipo: 'zona', via: 0, u: 0.44, off: -24, html: 'zona “B”' },
      { tipo: 'zona', via: 1, u: 0.55, off: -24, html: 'zona “C”' },
    ]);
  }, []);

  const asegurarCiudad = useCallback(() => {
    if (ciudadRef.current) return ciudadRef.current;
    const c = crearCiudad(escenaEl.querySelector('#ciudad'), escenaEl.querySelector('#capa'), { vista: 165, centro: [-16, 0, -4], deriva: false });
    ciudadRef.current = c;
    c.alElegir((k) => setActualId((k || c.complejos[0]).id));
    c.mostrarAcero(false);
    c.aplicarHora(horaRef.current);
    c.elegir('A');
    window.ciudad = c;
    setListo(true);
    return c;
  }, [escenaEl]);

  const mostrarAcero = useCallback((si) => { ciudadRef.current?.mostrarAcero(si); setAceroEstado(si); }, []);
  const enfocarComplejo = useCallback((id, ms = 700) => {
    const c = ciudadRef.current; if (!c) return Promise.resolve();
    const k = c.complejos[id === 'B' ? 1 : 0];
    return c.camara({ az: id === 'B' ? 58 : 32, el: 34, vista: movil() ? 110 : 92, centro: [k.pos[0] + (id === 'A' ? 10 : -4), 14, k.pos[2]] }, ms);
  }, []);
  const elegirComplejo = useCallback((id) => { ciudadRef.current?.elegir(id); enfocarComplejo(id); }, [enfocarComplejo]);

  const mem = useRef({}); // memoria entre pantallas (tomas capturadas, cola de render, chat…)
  const tt = useRef();
  const avisar = useCallback((msg) => { setToastTxt(msg); clearTimeout(tt.current); tt.current = setTimeout(() => setToastTxt(''), 2600); }, []);

  const complejos = listo ? ciudadRef.current.complejos : null;
  const actual = complejos ? complejos.find((c) => c.id === actualId) || complejos[0] : null;

  const valor = {
    hora, aplicarHora, irA, noche: hora >= 0.5, iconoLuz: hora >= 0.5 ? SOL : LUNA, horaTxt: horaTexto(hora),
    acero, mostrarAcero, notasOn, notas, actual, actualId, elegirComplejo, enfocarComplejo,
    ciudad: ciudadRef, listo, asegurarCiudad, escenaEl, parking, BASE, movil, fmt, PERFILES, toast, avisar, mem: mem.current,
  };
  return <Ctx.Provider value={valor}>{children}<div className={'toast' + (toast ? ' on' : '')} role="status" aria-live="polite">{toast}</div></Ctx.Provider>;
}

/* Lienzo de la escena compartida: al montarse trae el <div id="escena"> y al desmontarse lo devuelve al parqueadero. */
export function Slot({ nombre, children }) {
  const { escenaEl, parking } = useApp();
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current; el.prepend(escenaEl);
    return () => { parking.appendChild(escenaEl); };
  }, [escenaEl, parking]);
  return <div className="slot" data-slot={nombre} ref={ref}>{children}</div>;
}

/* Botón de luz (día / noche) */
export function BotonLuz() {
  const { irA, noche, iconoLuz } = useApp();
  return <button className="luz" aria-label="Cambiar día o noche" onClick={() => irA(noche ? 0 : 1)}>{iconoLuz}</button>;
}

/* Segmento día / noche */
export function SegLuz() {
  const { irA, noche } = useApp();
  return <div className="panelito seg" role="group" aria-label="Modo de luz"><button className={noche ? '' : 'on'} onClick={() => irA(0)}>día</button><button className={noche ? 'on' : ''} onClick={() => irA(1)}>noche</button></div>;
}

/* Deslizador de hora */
export function Hora({ style }) {
  const { hora, aplicarHora, horaTxt } = useApp();
  return <div className="panelito hora" style={style}><span className="tag">hora/.</span><input type="range" min="0" max="100" value={Math.round(hora * 100)} aria-label="Hora del día" onChange={(e) => aplicarHora(e.target.value / 100)} /><output className="horaOut">{horaTxt}</output></div>;
}

/* Conmutador "ver estructura" */
export function ConmAcero({ texto = 'ver estructura', className = 'panelito conm' }) {
  const { acero, mostrarAcero } = useApp();
  return <button className={className} aria-pressed={acero} onClick={() => mostrarAcero(!acero)}><i></i>{texto}</button>;
}

export function Conm({ texto, on, onChange }) {
  return <button className="conm" aria-pressed={on} onClick={() => onChange(!on)}><i></i>{texto}</button>;
}
