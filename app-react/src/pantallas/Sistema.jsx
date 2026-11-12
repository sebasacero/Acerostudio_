import Top from '../Top.jsx';
import { MUESTRAS } from '../datos.js';

const FLUJO = [['inicio', 'Inicio', 'Pide un proyecto o retoma uno.'], ['nuevo', 'Crear', 'Texto, plano, foto o lote. 3 propuestas.'], ['editor', 'Diseñar', 'Chat + ciudad 3D. Toca un complejo.'], ['acero', 'Acero', 'Perfiles, toneladas, montaje, costo.'], ['render', 'Render', 'Tomas, hora, estilo, 4K.'], ['lamina', 'Vender', 'Lámina, enlace al cliente, exportar.']];
const PRINCIPIOS = [
  ['La ciudad siempre a la vista', 'Cada pantalla de proyecto muestra el modelo. Los paneles flotan en vidrio sobre la escena.'],
  ['El acero es el protagonista', 'Todo se diseña en acero por defecto. Celeste con contorno negro marca lo que es tuyo.'],
  ['Coral es la acción', 'Un solo botón coral por pantalla: el siguiente paso del flujo.'],
  ['Anotar como en plano', 'Flechas punteadas, "/." al final y datos en mono. Nada de íconos de relleno.'],
  ['Cifras reales, siempre', 'Toneladas, kg/m², metros y semanas salen del modelo, con su supuesto escrito.'],
  ['Día revisa, noche vende', 'Maqueta blanca para pensar la masa; ciudad nocturna para presentar.'],
];

export default function Sistema() {
  return (
    <section className="pantalla on" data-p="sistema" aria-label="Sistema de diseño">
      <Top ruta={<><b>Sistema de diseño</b> · Ciudad de acero</>} />
      <div className="scroll"><div className="sistema">
        <div><span className="tag">ux/ui de la app/.</span><h1 className="titulo-disp" style={{ margin: '8px 0 14px' }}>Ciudad de acero</h1>
          <p className="intro">La app es una maqueta viva: la ciudad isométrica siempre está detrás, el acero se resalta en celeste con contorno negro y el viaducto coral marca la acción. De noche se trabaja y se vende; de día se revisa la masa como en maqueta blanca.</p></div>
        <div><div className="cabecera"><h2 className="cursiva">flujo/.</h2><span className="tag der">de la idea a la obra</span></div>
          <div className="flujo">{FLUJO.map(([r, b, s], i) => <a href={'#' + r} key={r}><small>{String(i + 1).padStart(2, '0')}</small><b>{b}</b><span>{s}</span></a>)}</div>
        </div>
        <div><div className="cabecera"><h2 className="cursiva">color/.</h2><span className="tag der">medido de la referencia</span></div>
          <div className="muestras">{MUESTRAS.map(([n, c, u]) => <div className="muestra" key={n}><i style={{ background: c }}></i><b style={{ fontWeight: 500 }}>{n}</b><small>{c} · {u}</small></div>)}</div>
        </div>
        <div><div className="cabecera"><h2 className="cursiva">tipografía/.</h2></div>
          <div className="tipos">
            <div className="tipo"><small>Antonio 500 · títulos</small><span className="titulo-disp" style={{ fontSize: 56 }}>Puente habitable</span></div>
            <div className="tipo"><small>Outfit itálica · secciones</small><span className="cursiva" style={{ fontSize: 22 }}>complejo A/.</span></div>
            <div className="tipo"><small>Outfit 300 · texto</small><span style={{ fontSize: 15, lineHeight: 1.55 }}>Tracé un viaducto elevado a 7 m y dos complejos en acero sobre los bordes del recorrido.</span></div>
            <div className="tipo"><small>DM Mono · datos y rótulos</small><span className="tag" style={{ fontSize: 12 }}>219 T · 71 KG/M² · HEB 300</span></div>
          </div>
        </div>
        <div><div className="cabecera"><h2 className="cursiva">componentes/.</h2></div>
          <div className="componentes">
            <div className="comp-box panel"><span className="seccion-tag">botones/.</span><div className="fila"><span className="boton coral chico">Generar lámina <span className="flecha-punteada"></span></span><span className="boton linea chico">Render 4K</span></div><div className="fila"><span className="chip">IFC 4</span><span className="chip ok">aprobado</span><span className="chip coral">con cliente</span><span className="chip amar">en diseño</span></div></div>
            <div className="comp-box panel"><span className="seccion-tag">controles/.</span><div className="fila"><div className="panelito seg"><button className="on">día</button><button>noche</button></div><button className="panelito conm" aria-pressed="true"><i></i>ver estructura</button></div><div className="segmento" style={{ width: 'max-content', maxWidth: '100%' }}><a className="on">Acero</a><a>Render</a><a>Lámina</a></div></div>
            <div className="comp-box panel"><span className="seccion-tag">anotación tipo plano/.</span>
              <div className="callout-demo"><svg viewBox="0 0 300 120" style={{ width: '100%', height: '100%', color: 'var(--tinta)' }}><circle cx="40" cy="96" r="3.2" fill="currentColor" /><path d="M40 96V40h120" fill="none" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1.3" /><path d="M152 35l8 5-8 5" fill="none" stroke="currentColor" strokeWidth="1.4" /><text x="168" y="40" fontFamily="Outfit" fontStyle="italic" fontSize="16" fill="currentColor">complejo A/.</text><text x="168" y="58" fontFamily="DM Mono" fontSize="10" letterSpacing="1" fill="var(--celeste-txt)">219 T · 71 KG/M²</text></svg></div>
            </div>
            <div className="comp-box panel"><span className="seccion-tag">cifra/.</span><div className="kpis" style={{ border: 0 }}><div className="kpi coral" style={{ borderBottom: 0 }}><b>219<small>t</small></b><span>acero estructural</span></div><div className="kpi" style={{ borderBottom: 0 }}><b>71<small>kg/m²</small></b><span>cuantía</span></div></div></div>
            <div className="comp-box panel"><span className="seccion-tag">mensaje de la IA/.</span><div className="msg ia"><div className="quien">AceroStudio</div>El complejo A pesa 219 t. La cercha concentra buena parte.</div><div className="msg yo">Baja 2 pisos</div></div>
            <div className="comp-box panel"><span className="seccion-tag">estado de proceso/.</span><div className="generando" style={{ position: 'static', width: 'auto', background: 'none', border: 0, padding: 0, backdropFilter: 'none' }}><ol><li className="ok">Volumetría</li><li className="va">Estructura de acero</li><li>Predimensionado</li></ol></div></div>
          </div>
        </div>
        <div><div className="cabecera"><h2 className="cursiva">principios/.</h2></div>
          <div className="principios">{PRINCIPIOS.map(([b, s]) => <div className="principio" key={b}><b>{b}</b><span>{s}</span></div>)}</div>
        </div>
      </div></div>
    </section>
  );
}
