import { useEffect } from 'react';
import Top, { Proyecto } from '../Top.jsx';
import { Slot, useApp, SegLuz } from '../store.jsx';
import { Cabecera, Kpis4, TablaPerfiles, Gantt, Comparar } from '../Ficha.jsx';

const CAPAS = [['Columnas', '#ee7f74'], ['Vigas', '#b6dbf8'], ['Riostras', '#8fa0c4'], ['Cercha Warren', '#ffd27a']];
const UNIONES = [
  ['Placa base', '4 pernos M24', <><rect x="30" y="44" width="30" height="6" fill="none" stroke="currentColor" /><path d="M38 44V6h14v38" fill="none" stroke="var(--coral)" strokeWidth="1.6" /><circle cx="34" cy="47" r="1.6" fill="currentColor" /><circle cx="56" cy="47" r="1.6" fill="currentColor" /><path d="M20 54h50" stroke="currentColor" strokeDasharray="3 3" /></>],
  ['Viga–columna', 'apernada, placa extendida', <><path d="M24 4v50M36 4v50" stroke="var(--coral)" strokeWidth="1.6" /><path d="M36 22h46M36 34h46" stroke="var(--celeste)" strokeWidth="1.6" /><rect x="36" y="20" width="8" height="16" fill="none" stroke="currentColor" /><circle cx="40" cy="25" r="1.4" fill="currentColor" /><circle cx="40" cy="31" r="1.4" fill="currentColor" /></>],
  ['Nudo de cercha', 'soldado en taller', <><path d="M6 46h78M6 12h78" stroke="var(--celeste)" strokeWidth="1.6" /><path d="M14 46l18-34 18 34 18-34" fill="none" stroke="#ffd27a" strokeWidth="1.6" /><circle cx="32" cy="12" r="4" fill="none" stroke="currentColor" /></>],
];

export default function Acero() {
  const { asegurarCiudad, mostrarAcero, notas, enfocarComplejo, actualId, elegirComplejo } = useApp();
  useEffect(() => { asegurarCiudad(); mostrarAcero(true); notas(true); enfocarComplejo(actualId); }, []);
  return (
    <section className="pantalla on" data-p="acero" aria-label="Ficha de acero">
      <Top ruta={<Proyecto hoja="Acero" />} modo="acero" />
      <Slot nombre="acero">
        <div className="panelito capas sobre" aria-label="Capas de estructura">
          <span className="tag" style={{ marginBottom: 4 }}>capas/.</span>
          {CAPAS.map(([n, c]) => <label key={n}><input type="checkbox" defaultChecked disabled /><i style={{ background: c }}></i>{n}</label>)}
        </div>
        <div className="barra-baja sobre">
          <div className="panelito seg" role="group" aria-label="Complejo">{['A', 'B'].map((id) => <button key={id} className={actualId === id ? 'on' : ''} onClick={() => elegirComplejo(id)}>complejo {id}</button>)}</div>
          <SegLuz />
          <div className="escala"><b></b>20 m</div>
        </div>
      </Slot>
      <div className="panel-acero">
        <Cabecera />
        <Kpis4 />
        <div className="bloque"><h3 className="seccion-tag">perfiles/.</h3><TablaPerfiles /></div>
        <div className="bloque"><h3 className="seccion-tag">montaje por semanas/.</h3><Gantt /></div>
        <div className="bloque"><h3 className="seccion-tag">acero frente a concreto/.</h3><Comparar /></div>
        <div className="bloque">
          <h3 className="seccion-tag">uniones tipo/.</h3>
          <div className="uniones">{UNIONES.map(([n, d, svg]) => <div className="union" key={n}><svg viewBox="0 0 90 58">{svg}</svg><b>{n}</b><span>{d}</span></div>)}</div>
        </div>
        <p className="aviso">Predimensionado indicativo con perfiles reales (kg/m de catálogo). Costo supuesto: USD 2.400 por tonelada montada. Comparación con concreto según cuantías típicas; el diseño final lo firma un ingeniero estructural.</p>
      </div>
    </section>
  );
}
