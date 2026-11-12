import { useApp } from './store.jsx';
import { COLORES, COSTO_T, ETIQ, NOMBRES, semanas } from './datos.js';

/* Cabecera de la ficha de un complejo (id, nombre, uso) */
export function Cabecera({ conUso }) {
  const { actual } = useApp();
  const id = actual?.id || 'A', [n, uso] = NOMBRES[id];
  return <><h2 className="cursiva">complejo {id}/.</h2><div className="nombre">{n}</div>{conUso && <div className="uso">{uso} · acero estructural</div>}</>;
}

export const Kpi = ({ v, u, t, coral }) => <div className={'kpi' + (coral ? ' coral' : '')}><b>{v}<small>{u}</small></b><span>{t}</span></div>;

export function KpisEditor() {
  const { actual: c, fmt } = useApp();
  return <div className="kpis">
    <Kpi coral v={c ? fmt(c.ton) : '–'} u="t" t="acero estructural" />
    <Kpi v={c ? fmt(c.kgm2) : '–'} u="kg/m²" t="cuantía" />
    <Kpi v={c ? fmt(c.area) : '–'} u="m²" t="área construida" />
    <Kpi v={c ? fmt(c.pisos) : '–'} u="pisos" t={c ? `${fmt(c.altura, 1)} m de altura` : 'altura'} />
  </div>;
}

export function Kpis4() {
  const { actual: c, fmt } = useApp();
  return <div className="kpis4">
    <Kpi coral v={c ? fmt(c.ton) : '–'} u="t" t="acero" />
    <Kpi v={c ? fmt(c.kgm2) : '–'} u="kg/m²" t="cuantía" />
    <Kpi v={c ? fmt(c.ton * COSTO_T / 1000) : '–'} u="mil" t="USD montado" />
    <Kpi v={c ? semanas(c) : '–'} u="sem" t="de montaje" />
  </div>;
}

export function TablaPerfiles() {
  const { actual: c, fmt, PERFILES } = useApp();
  if (!c) return null;
  const filas = Object.entries(c.miembros);
  const tons = filas.map(([t]) => (c.metros?.[t] || 0) * PERFILES[t].kgm / 1000);
  return <>
    <div className="barra-acero barra">{filas.map(([t], i) => <span key={t} style={{ flex: tons[i], background: COLORES[t] }}></span>)}</div>
    <div className="tabla-wrap"><table>
      <thead><tr><th>Elemento · perfil</th><th className="n">piezas</th><th className="n">metros</th><th className="n">kg/m</th><th className="n">toneladas</th></tr></thead>
      <tbody>
        {filas.map(([t, k], i) => <tr key={t}><td><i className="rombo" style={{ background: COLORES[t] }}></i>{ETIQ[t]} · {PERFILES[t].nombre}</td><td className="n">{k}</td><td className="n">{fmt(c.metros?.[t] || 0)}</td><td className="n">{fmt(PERFILES[t].kgm, 1)}</td><td className="n">{fmt(tons[i], 1)}</td></tr>)}
        <tr><td><b style={{ fontWeight: 500 }}>Total</b></td><td className="n">{filas.reduce((s, [, k]) => s + k, 0)}</td><td className="n">{fmt(Object.values(c.metros || {}).reduce((s, m) => s + m, 0))}</td><td className="n"></td><td className="n" style={{ color: 'var(--coral)' }}>{fmt(c.ton, 1)}</td></tr>
      </tbody>
    </table></div>
  </>;
}

export function Gantt() {
  const { actual: c } = useApp();
  if (!c) return null;
  const S = semanas(c), tot = S + 2;
  const fases = [
    ['Anclajes y placas base', 0, 2, '#8fa0c4'],
    ['Columnas HEB', 1, Math.round(S * 0.45), '#ee7f74'],
    ['Vigas IPE + steel deck', 2, Math.round(S * 0.55), '#b6dbf8'],
    ...(c.miembros.cercha ? [['Cercha Warren (izaje)', Math.round(S * 0.45), 3, '#ffd27a']] : []),
    ['Riostras y nudos', Math.round(S * 0.5), Math.round(S * 0.35), '#8fa0c4'],
    ['Fachada y cierre', Math.round(S * 0.7), tot - Math.round(S * 0.7), 'var(--suave)'],
  ];
  return <div className="gantt">
    {fases.map(([n, a, d, col]) => <div className="g" key={n}><span>{n}</span><div className="pista"><i style={{ left: a / tot * 100 + '%', width: d / tot * 100 + '%', background: col }}></i></div></div>)}
    <div className="eje"><span></span><div><span>sem 0</span><span>{Math.round(tot / 2)}</span><span>{tot}</span></div></div>
  </div>;
}

export function Comparar() {
  const { actual: c, fmt } = useApp();
  if (!c) return null;
  const filas = [
    ['Peso propio', 1, 1.55, (v) => `${fmt(v * c.area * 0.42)} t`],
    ['Plazo', semanas(c), Math.round(semanas(c) * 1.6), (v) => `${v} sem`],
    ['CO₂ estructura', 1, 1.25, (v) => `${fmt(v * c.ton * 1.4)} t`],
  ];
  return <div className="comparar">
    {filas.map(([n, ac, co, f]) => { const m = Math.max(ac, co); return <div className="comp" key={n}><span className="seccion-tag" style={{ fontSize: 10 }}>{n}</span>
      <div className="lin"><span>acero</span><i style={{ width: ac / m * 100 + '%', background: 'var(--coral)' }}></i><em>{f(ac)}</em></div>
      <div className="lin"><span>concreto</span><i style={{ width: co / m * 100 + '%', background: 'rgba(var(--tinta-rgb),.3)' }}></i><em>{f(co)}</em></div></div>; })}
  </div>;
}
