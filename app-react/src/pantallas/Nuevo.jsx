import { useEffect, useRef, useState } from 'react';
import Top from '../Top.jsx';
import { Slot, useApp } from '../store.jsx';
import { BASE } from '../datos.js';

const ENTRADAS = [
  ['Describir', 'Texto o voz: uso, pisos, lote.', <path d="M4 6h16M4 11h12M4 16h8" />],
  ['Plano o boceto', 'PDF, DWG o foto de una servilleta.', <path d="M3 3h18v18H3zM3 12h9V3M12 12v9" />],
  ['Foto de un edificio', 'La IA saca volúmenes y medidas.', <><rect x="2.5" y="5.5" width="19" height="14" rx="2" /><circle cx="12" cy="12.5" r="3.5" /></>],
  ['Lote en el mapa', 'Normativa y vecinos del sector.', <><path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></>],
];
const PASOS = ['Leyendo el lote y la normativa del sector', 'Volumetría: 3 opciones de masa', 'Estructura de acero por cada opción', 'Predimensionado y toneladas'];
const PROPUESTAS = [
  ['1 · torre', '298 t', <path d="M32 40V14l8-5 8 5v26l-8 4z" fill="var(--pizarra-3)" />],
  ['2 · puente', '382 t', <><path d="M18 40V10l8-4 8 4v30z" fill="var(--celeste)" stroke="var(--negro)" strokeWidth="2" /><path d="M34 18h28v8H34zM54 26v16h8V26" fill="var(--celeste)" stroke="var(--negro)" strokeWidth="2" /></>],
  ['3 · escalones', '341 t', <path d="M16 42V30h48v12zM24 30V20h32v10M32 20V10h16v10" fill="var(--pizarra-3)" />],
];
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Nuevo() {
  const { asegurarCiudad, mostrarAcero, notas, mem } = useApp();
  const [entrada, setEntrada] = useState(0);
  const [programa, setPrograma] = useState(mem.programa ?? 'Une la zona A con la B con un viaducto y pon vivienda encima. Quiero que se vea el acero.');
  const [usos, setUsos] = useState({ Vivienda: true, Comercio: true });
  const [pisos, setPisos] = useState(14);
  const [paso, setPaso] = useState(-1); // -1 sin empezar, 0..3 en curso, 4 listo
  const [propuesta, setPropuesta] = useState(1);
  const generando = useRef(false);

  useEffect(() => {
    const c = asegurarCiudad(); notas(true); mostrarAcero(true); c.camara(BASE, 700);
  }, []);

  const generar = async (e) => {
    e.preventDefault(); if (generando.current) return; generando.current = true;
    const c = asegurarCiudad();
    mostrarAcero(false); c.anotar([]);
    c.camara({ az: 20, el: 55, vista: 230, centro: [-16, 0, -4] }, 0);
    for (let i = 0; i < PASOS.length; i++) {
      setPaso(i);
      if (i === 1) c.camara({ az: 40, el: 44, vista: 180, centro: [-16, 0, -4] }, 1100);
      if (i === 2) { mostrarAcero(true); c.camara(BASE, 1100); }
      await espera(1100);
    }
    notas(true); setPaso(PASOS.length); generando.current = false;
  };
  const listo = paso >= PASOS.length, enCurso = paso >= 0 && !listo;
  const pct = listo ? 100 : paso < 0 ? 0 : (paso + 0.5) / PASOS.length * 100;

  return (
    <section className="pantalla on" data-p="nuevo" aria-label="Nuevo proyecto">
      <Top ruta={<><a href="#inicio">Proyectos</a> / <b>Nuevo proyecto</b></>}><span className="chip cel solo-escritorio">sistema: acero</span></Top>
      <form className="form-nuevo scroll" onSubmit={generar}>
        <ol className="pasos"><li className="ok">Entrada</li><li className={listo ? 'ok' : 'on'}>Programa</li><li className={listo ? 'on' : ''}>Propuestas</li></ol>
        <div className="campo">
          <span className="lbl">¿desde qué partes?/.</span>
          <div className="entradas" role="radiogroup">
            {ENTRADAS.map(([t, d, ic], i) => <button type="button" key={t} className={'entrada-op' + (entrada === i ? ' on' : '')} role="radio" aria-checked={entrada === i} onClick={() => setEntrada(i)}><svg viewBox="0 0 24 24">{ic}</svg><b>{t}</b><span>{d}</span></button>)}
          </div>
        </div>
        <div className="campo"><label htmlFor="txtNuevo">programa/.</label><textarea id="txtNuevo" rows="3" value={programa} onChange={(e) => { setPrograma(e.target.value); mem.programa = e.target.value; }} /></div>
        <div className="fila2">
          <div className="campo"><label htmlFor="lote">lote/.</label><input type="text" id="lote" defaultValue="Corredor Av. 26 · Bogotá" /></div>
          <div className="campo"><label htmlFor="area">área de lote/.</label><input type="text" id="area" defaultValue="2.400 m²" /></div>
        </div>
        <div className="campo"><span className="lbl">usos/.</span>
          <div className="usos" role="group" aria-label="Usos">{['Vivienda', 'Comercio', 'Oficinas', 'Mirador', 'Bodega'].map((u) => <button type="button" key={u} className={usos[u] ? 'on' : ''} onClick={() => setUsos({ ...usos, [u]: !usos[u] })}>{u}</button>)}</div>
        </div>
        <div className="campo"><label htmlFor="pisos">pisos máximos/. <output>{pisos}</output></label><input type="range" id="pisos" min="2" max="30" value={pisos} onChange={(e) => setPisos(+e.target.value)} /></div>
        <div className="sistema-fijo"><i></i><div><b>Estructura en acero estructural</b><span>Pórticos HEB + IPE, steel deck y cerchas donde haya luces grandes.</span></div></div>
        <button type="submit" className="boton coral" disabled={enCurso}>Generar 3 propuestas <span className="flecha-punteada"></span></button>
      </form>
      <Slot nombre="nuevo">
        <div className="generando sobre">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><span className="cursiva">generando/.</span><span className="tag">{listo ? '3 propuestas listas' : enCurso ? `paso ${paso + 1} de ${PASOS.length}` : 'listo para empezar'}</span></div>
          <div className="barra-prog"><i style={{ width: pct + '%' }}></i></div>
          <ol>{PASOS.map((p, i) => <li key={p} className={i < paso || listo ? 'ok' : i === paso ? 'va' : ''}>{p}</li>)}</ol>
          {listo && <div className="propuestas">
            {PROPUESTAS.map(([n, t, svg], i) => <button type="button" key={n} className={'propuesta' + (propuesta === i ? ' on' : '')} onClick={() => setPropuesta(i)}><svg viewBox="0 0 80 44">{svg}</svg><b>{n}</b>{t}</button>)}
          </div>}
          {listo && <a className="boton linea chico" href="#editor">Abrir propuesta {propuesta + 1} en el editor <span className="flecha-punteada"></span></a>}
        </div>
      </Slot>
    </section>
  );
}
