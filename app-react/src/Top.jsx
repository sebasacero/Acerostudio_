import { useApp } from './visita.jsx';
import logo from '../../images/logo-web.png';

const SOL = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></svg>;
const LUNA = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>;
const FLUJO = [['camara', 'Cámara'], ['medir', 'Medir'], ['encajar', 'Encajar'], ['render', 'Video'], ['propuesta', 'Propuesta']];

/* Barra superior como la del simulador de Ornamentación: marca, ruta, pasos del flujo y día/noche. */
export default function Top({ ruta, paso, children }) {
  const { dia, setDia, actual } = useApp();
  return (
    <div className="top">
      <a className="marca" href="#inicio" aria-label="AceroStudio, visitas"><img src={logo} alt="ACERO" /><span>.studio</span></a>
      <div className="ruta">{ruta ?? <><a href="#inicio">Visitas</a> / <b>{actual?.cliente || 'Sin cliente'}</b></>}</div>
      {paso && <nav className="segmento" aria-label="Pasos">{FLUJO.map(([r, t]) => <a key={r} href={'#' + r} className={paso === r ? 'on' : ''}>{t}</a>)}</nav>}
      <div className="der">{children}<button className="luz" aria-label={dia ? 'Cambiar a noche' : 'Cambiar a día'} onClick={() => setDia(!dia)}>{dia ? SOL : LUNA}</button></div>
    </div>
  );
}

/* Título sobre el lienzo, como "ornamentación/. PUERTA · 1,00 × 2,10 M" del simulador. */
export function Titulo({ sobre, nombre, sub }) {
  return (
    <div className="titulo-lienzo"><em>{sobre}</em><h1>{nombre}</h1>{sub && <p>{sub}</p>}</div>
  );
}
