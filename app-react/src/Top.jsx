import { BotonLuz } from './store.jsx';

const MODOS = [['editor', 'Volumetría'], ['acero', 'Acero'], ['render', 'Render'], ['lamina', 'Lámina']];

/* Barra superior común: ruta de migas, segmento de modo (opcional) y acciones a la derecha. */
export default function Top({ ruta, modo, children }) {
  return (
    <div className="top">
      <div className="ruta">{ruta}</div>
      {modo && <nav className="segmento" aria-label="Modo">{MODOS.map(([r, t]) => <a key={r} href={'#' + r} className={modo === r ? 'on' : ''}>{t}</a>)}</nav>}
      <div className="der">{children}<BotonLuz />{modo && modo !== 'lamina' && <a className="boton coral chico" href="#exportar">Exportar</a>}</div>
    </div>
  );
}

export const Proyecto = ({ hoja }) => <><a href="#inicio">Proyectos</a> / <a href="#editor">Corredor de acero</a> / <b>{hoja}</b></>;
