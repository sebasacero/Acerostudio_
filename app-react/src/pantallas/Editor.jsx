import { useEffect, useRef, useState } from 'react';
import Top from '../Top.jsx';
import { Slot, useApp, SegLuz, Hora, ConmAcero } from '../store.jsx';
import { Cabecera, KpisEditor } from '../Ficha.jsx';
import { BASE, movil } from '../datos.js';

const HERR = [
  ['Seleccionar', <path d="M4 3 L15 10 L10 11 L8 16 Z" />], ['Orbitar', <><ellipse cx="10" cy="10" rx="8" ry="4" /><circle cx="10" cy="10" r="2" /></>],
  ['Empujar o tirar', <path d="M4 13l6-3 6 3-6 3zM10 3v7M7 6l3-3 3 3" />], ['Corte', <path d="M3 13 L10 9 L17 13 L10 17Z M10 3 V9" />], ['Medir', <path d="M3 15 L15 3 M5 13 l2 2 M8 10 l2 2 M11 7 l2 2" />],
];

export default function Editor() {
  const { asegurarCiudad, mostrarAcero, notas, listo, ciudad, fmt, horaTxt, irA, mem } = useApp();
  const [herr, setHerr] = useState(0);
  const [panel, setPanel] = useState('chat');
  const [texto, setTexto] = useState('Haz el puente 6 m más largo');
  const [extra, setExtra] = useState(mem.chat || []); // mensajes añadidos en la sesión
  const hilo = useRef(null);

  useEffect(() => {
    const c = asegurarCiudad(); mostrarAcero(false); notas(true);
    c.camara(movil() ? { ...BASE, centro: [-24, 0, 12] } : BASE, 700);
  }, []);
  useEffect(() => { if (hilo.current) hilo.current.scrollTop = hilo.current.scrollHeight; }, [extra]);

  const [A, B] = listo ? ciudad.current.complejos : [null, null];
  const responder = (v) => {
    const pensando = { yo: v, ia: null };
    const lista = [...extra, pensando]; setExtra(lista); mem.chat = lista;
    setTimeout(() => {
      let txt = `Hecho: alargué el puente 6 m. La cercha Warren pasa de 28 a 34 m de luz y el complejo A sube a ${fmt(A.ton * 1.06)} t (+${fmt(A.ton * 0.06, 1)} t).`;
      if (/noche/i.test(v)) { txt = 'Cambié a la luz de las 19:30. Abre Render para sacar la toma en 4K.'; irA(1); }
      if (/pisos/i.test(v)) txt = `Bajé 2 pisos al complejo A: quedan ${A.pisos - 2} pisos y ${fmt(A.ton * 0.87)} t de acero (−13%).`;
      if (/l[aá]mina/i.test(v)) txt = 'Preparé la lámina de venta del complejo A. Está en la pestaña Lámina.';
      const lista2 = lista.map((m) => (m === pensando ? { ...m, ia: txt } : m)); setExtra(lista2); mem.chat = lista2;
    }, 900);
  };
  const enviar = (e) => { e.preventDefault(); const v = texto.trim(); if (!v) return; responder(v); setTexto(''); };

  return (
    <section className="pantalla on" data-p="editor" data-panel={panel} aria-label="Editor">
      <Top ruta={<><a href="#inicio">Proyectos</a> / <b>Corredor de acero</b> / propuesta 2</>} modo="editor"><span className="chip solo-escritorio">guardado</span></Top>
      <aside className="chat">
        <header><h2 className="cursiva">chat de diseño/.</h2><span className="tag">propuesta 2</span></header>
        <div className="hilo" ref={hilo}>
          <div className="msg yo">Une la zona A con la B con un viaducto y pon vivienda encima. Quiero que se vea el acero.
            <div className="adjunto"><svg viewBox="0 0 54 38"><rect x=".5" y=".5" width="53" height="37" fill="none" stroke="currentColor" opacity=".4" /><path d="M4 30C14 26 18 18 26 16S44 8 50 6" fill="none" stroke="var(--coral)" strokeWidth="3" /></svg><div>plano_lote_av26.pdf<small>2 páginas · escala 1:500</small></div></div>
          </div>
          <div className="msg ia"><div className="quien">AceroStudio</div>Listo. Tracé un viaducto elevado a 7 m y dos complejos en acero sobre los bordes del recorrido.
            <ul className="pasos-ia">
              <li><b>Viaducto</b> de <span className="num">{listo ? fmt(ciudad.current.largoVia) : '–'}</span> m con pilas cada 13 m</li>
              <li><b>Complejo A</b>: torre + puente habitable con cercha Warren</li>
              <li><b>Complejo B</b>: torre escalonada con pórticos arriostrados</li>
              <li><b>Acero</b> predimensionado: <span className="num">{A ? fmt(A.ton + B.ton) : '–'}</span> t</li>
            </ul>
          </div>
          <div className="msg yo">Muéstrame cuánto pesa el complejo A.</div>
          <div className="msg ia"><div className="quien">AceroStudio</div>{A ? `El complejo A pesa ${fmt(A.ton)} t de acero (${fmt(A.kgm2)} kg/m² sobre ${fmt(A.area)} m²). La cercha Warren del puente concentra buena parte: la resalté en la ficha.` : '–'}</div>
          {extra.map((m, i) => <div key={i} style={{ display: 'contents' }}><div className="msg yo">{m.yo}</div><div className="msg ia"><div className="quien">AceroStudio</div>{m.ia ?? <span className="tag">pensando…</span>}</div></div>)}
        </div>
        <div className="sugerencias">{['Render de noche', 'Baja 2 pisos', 'Lámina de venta'].map((s) => <button key={s} onClick={() => responder(s)}>{s}</button>)}</div>
        <form className="entrada" onSubmit={enviar}>
          <label htmlFor="txtChat" className="tag" hidden>mensaje</label>
          <textarea id="txtChat" placeholder="Pide un cambio, sube un plano o una foto…" value={texto} onChange={(e) => setTexto(e.target.value)} />
          <div className="fila"><span>PLANO · FOTO · PDF · VOZ</span><button className="enviar" aria-label="Enviar">↑</button></div>
        </form>
      </aside>
      <Slot nombre="editor">
        <dl className="meta meta-lienzo sobre"><dt>hora</dt><dd>{horaTxt} hr</dd><dt>volumetría</dt><dd>2da propuesta</dd><dt>sistema</dt><dd>acero estructural</dd></dl>
        <div className="herr sobre" role="toolbar" aria-label="Herramientas">
          {HERR.map(([t, svg], i) => <button key={t} className={herr === i ? 'on' : ''} title={t} aria-label={t} onClick={() => setHerr(i)}><svg viewBox="0 0 20 20">{svg}</svg></button>)}
        </div>
        <div className="barra-baja sobre">
          <SegLuz /><Hora /><ConmAcero />
          <div className="escala"><b></b>20 m</div>
        </div>
      </Slot>
      <div className="pest-movil segmento" role="tablist"><button className={panel === 'chat' ? 'on' : ''} onClick={() => setPanel('chat')}>Chat</button><button className={panel === 'ficha' ? 'on' : ''} onClick={() => setPanel('ficha')}>Ficha</button></div>
      <aside className="ficha">
        <Cabecera conUso />
        <KpisEditor />
        <div className="acciones">
          <a className="boton linea" href="#acero">Ver ficha de acero completa <span className="flecha-punteada"></span></a>
          <a className="boton coral" href="#lamina">Generar lámina de venta <span className="flecha-punteada"></span></a>
        </div>
        <p className="aviso">Toca un complejo en la ciudad para ver su ficha. Arrastra para orbitar y usa la rueda para acercar.</p>
      </aside>
    </section>
  );
}
