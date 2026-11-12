import { useState } from 'react';
import Top from '../Top.jsx';
import Iso from '../Iso.jsx';
import { useApp } from '../store.jsx';
import { PROYECTOS } from '../datos.js';
import { irAPantalla } from '../App.jsx';

const FILTROS = ['Todos', 'En diseño', 'Con cliente', 'Aprobados'];
const PLANTILLAS = [
  ['Nave industrial', 'luces de 20 a 60 m', <><path d="M20 46V22l22-10 22 10v24z" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M20 22l44 0M42 12v34" stroke="currentColor" strokeDasharray="3 3" fill="none" /></>],
  ['Torre en pórticos', '6 a 30 pisos', <path d="M44 50V8h32v42M44 18h32M44 28h32M44 38h32M60 8v42" fill="none" stroke="currentColor" strokeWidth="1.4" />],
  ['Puente peatonal', 'cercha Warren', <path d="M14 40h92M14 30h92M14 40l10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" />],
  ['Casa en acero', '1 a 3 pisos, steel deck', <><path d="M30 48V26l30-14 30 14v22zM30 26h60" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M48 48V34h24v14" fill="none" stroke="currentColor" strokeWidth="1.4" /></>],
];
const ENTRADAS = [
  ['Describir', <path d="M2 4h12M2 8h9M2 12h6" />], ['Plano', <path d="M2 2h12v12H2zM2 8h6V2M8 8v6" />],
  ['Foto', <><rect x="1.5" y="3.5" width="13" height="10" rx="1" /><circle cx="8" cy="8.5" r="2.5" /></>],
  ['Lote en mapa', <><path d="M8 15s5-4.5 5-8.5a5 5 0 0 0-10 0C3 10.5 8 15 8 15z" /><circle cx="8" cy="6.5" r="1.8" /></>],
];

export default function Inicio() {
  const { noche, listo, ciudad, fmt, mem } = useApp();
  const [filtro, setFiltro] = useState('Todos');
  const [entrada, setEntrada] = useState(0);
  const [texto, setTexto] = useState(mem.pedido ?? 'Edificio de vivienda de 8 pisos en un lote de 24 × 36 m en Chapinero, con local comercial en primer piso y terraza.');
  const ton = listo ? ciudad.current.complejos.reduce((s, c) => s + c.ton, 0) : 382;
  const visibles = PROYECTOS.filter((p) => filtro === 'Todos' || p.e[1].startsWith(filtro.toLowerCase().replace(/s$/, '')));
  const enviar = (e) => { e.preventDefault(); mem.programa = texto; irAPantalla('nuevo'); };
  return (
    <section className="pantalla on" data-p="inicio" aria-label="Inicio">
      <Top ruta={<><b>Inicio</b> · Estudio Acero</>}><span className="chip solo-escritorio">plan estudio · 3 asientos</span></Top>
      <div className="scroll"><div className="inicio">
        <div className="hola">
          <div>
            <span className="tag">{noche ? 'buenas noches/.' : 'buenas tardes/.'}</span>
            <h1 className="titulo-disp">¿Qué levantamos <em>en acero</em> hoy?</h1>
            <form className="pedido" onSubmit={enviar}>
              <label className="seccion-tag" htmlFor="txtInicio" style={{ display: 'block', marginBottom: 6 }}>describe el proyecto/.</label>
              <textarea id="txtInicio" rows="2" value={texto} onChange={(e) => { setTexto(e.target.value); mem.pedido = e.target.value; }} />
              <div className="fila">
                {ENTRADAS.map(([t, ic], i) => <button type="button" key={t} className={'entrada-chip' + (entrada === i ? ' on' : '')} onClick={() => setEntrada(i)}><svg viewBox="0 0 16 16">{ic}</svg>{t}</button>)}
                <button type="submit" className="boton coral chico">Crear en acero <span className="flecha-punteada"></span></button>
              </div>
            </form>
          </div>
          <a className="mini-ciudad" href="#editor" aria-label="Abrir Corredor de acero">
            <Iso semilla={7} destacados={[{ i: 1, j: 2, h: 8 }, { i: -2, j: -2, h: 6 }]} w={480} h={300} escala={9} />
            <dl className="meta"><dt>último</dt><dd>Corredor de acero</dd><dt>editado</dt><dd>hace 12 min</dd></dl>
            <div className="nota"><b className="num">{fmt(ton)} t</b>de acero en 2 complejos</div>
          </a>
        </div>

        <div className="cifras">
          <div className="cifra coral"><b className="num">1.240<small>t</small></b><span>acero diseñado este año</span></div>
          <div className="cifra"><b className="num">6<small>activos</small></b><span>proyectos en diseño</span></div>
          <div className="cifra"><b className="num">14<small>láminas</small></b><span>enviadas a clientes</span></div>
          <div className="cifra"><b className="num">62<small>kg/m²</small></b><span>cuantía media del estudio</span></div>
        </div>

        <div className="dos-col">
          <div>
            <div className="cabecera">
              <h2 className="cursiva">proyectos/.</h2>
              <div className="filtros" role="group" aria-label="Filtrar proyectos">{FILTROS.map((f) => <button key={f} className={filtro === f ? 'on' : ''} onClick={() => setFiltro(f)}>{f}</button>)}</div>
            </div>
            <div className="proyectos">
              {visibles.map((p) => (
                <a className="proy" href={p.href} key={p.n}>
                  <div className="img"><Iso semilla={p.s} destacados={p.d} via={p.via !== false} /><span className={'chip ' + p.e[0]}>{p.e[1]}</span></div>
                  <div className="txt"><b>{p.n}</b><span>{p.l}</span><div className="datos"><span><i className="num">{fmt(p.t)}</i> t</span><span><i className="num">{p.k}</i> kg/m²</span><span>{p.a}</span></div></div>
                </a>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gap: 26, alignContent: 'start' }}>
            <div>
              <div className="cabecera"><h2 className="cursiva">actividad/.</h2><span className="tag der">hoy</span></div>
              <ul className="actividad">
                <li><i className="c"></i><div>Cliente <b>Constructora Andina</b> abrió la lámina de <b>Torre escalonada</b><br /><span>3 veces · 4 min en la ficha de acero</span></div><small>10:42</small></li>
                <li><i></i><div>La IA terminó <b>3 propuestas</b> para <b>Bodega Fontibón</b><br /><span>nave de 42 m de luz con cercha Pratt</span></div><small>09:15</small></li>
                <li><i className="o"></i><div><b>Casa Celosía</b> aprobada por el cliente<br /><span>IFC enviado al ingeniero estructural</span></div><small>ayer</small></li>
                <li><i></i><div>Render 4K de noche listo en <b>Corredor de acero</b><br /><span>toma aérea · 16:9</span></div><small>ayer</small></li>
              </ul>
            </div>
            <div>
              <div className="cabecera"><h2 className="cursiva">empezar desde/.</h2></div>
              <div className="plantillas">
                {PLANTILLAS.map(([n, d, svg]) => <a className="plantilla" href="#nuevo" key={n}><svg viewBox="0 0 120 54">{svg}</svg><b>{n}</b><span>{d}</span></a>)}
              </div>
            </div>
          </div>
        </div>
      </div></div>
    </section>
  );
}
