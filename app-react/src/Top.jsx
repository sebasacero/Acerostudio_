import { useApp } from './visita.jsx';

const SOL = <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="16" cy="16" r="6" fill="currentColor" /><path d="M16 3v4M16 25v4M3 16h4M25 16h4M7 7l3 3M22 22l3 3M7 25l3-3M22 10l3-3" /></svg>;
const LUNA = <svg viewBox="0 0 32 32" fill="currentColor"><path d="M19.5 4.5a11.5 11.5 0 1 0 8 19.9A10 10 0 0 1 19.5 4.5z" /></svg>;
const FLUJO = [['camara', 'Cámara'], ['medir', 'Medir'], ['encajar', 'Encajar'], ['render', 'Video'], ['propuesta', 'Propuesta']];

/* Barra superior: ruta, pasos del flujo de la visita y acciones. */
export default function Top({ ruta, paso, children }) {
  const { dia, setDia, actual } = useApp();
  return (
    <div className="top">
      <div className="ruta">{ruta ?? <><a href="#inicio">Visitas</a> / <b>{actual?.cliente || 'Sin cliente'}</b></>}</div>
      {paso && <nav className="segmento" aria-label="Pasos">{FLUJO.map(([r, t]) => <a key={r} href={'#' + r} className={paso === r ? 'on' : ''}>{t}</a>)}</nav>}
      <div className="der">{children}<button className="luz" aria-label="Cambiar día o noche" onClick={() => setDia(!dia)}>{dia ? LUNA : SOL}</button></div>
    </div>
  );
}
