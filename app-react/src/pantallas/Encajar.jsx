import { useEffect, useRef, useState } from 'react';
import Top, { Titulo } from '../Top.jsx';
import { useApp, m } from '../visita.jsx';
import { homografia } from '../medicion.js';
import { ProductoSVG, PRODUCTOS, DISENOS, TIPOS, ACABADOS } from '../producto.jsx';

// Encajar: el producto dibujado se deforma (homografía CSS) hasta las 4 esquinas del vano marcado en la foto.
// Las esquinas se pueden arrastrar; el tamaño real viene de las medidas.
export default function Encajar() {
  const { actual, actualizar, avisar } = useApp();
  const img = useRef(null), capa = useRef(null);
  const [caja, setCaja] = useState({ x: 0, y: 0, w: 1, h: 1 });
  const [apertura, setApertura] = useState(0);
  const arrastre = useRef(null);
  const cfg = actual?.producto || {};
  const vano = actual?.vano || [[0.3, 0.3], [0.7, 0.3], [0.7, 0.85], [0.3, 0.85]];

  useEffect(() => {
    const f = () => { const i = img.current; if (!i?.naturalWidth) return; const r = i.getBoundingClientRect(), k = Math.min(r.width / i.naturalWidth, r.height / i.naturalHeight), w = i.naturalWidth * k, h = i.naturalHeight * k; setCaja({ x: (r.width - w) / 2, y: (r.height - h) / 2, w, h }); };
    f(); addEventListener('resize', f); img.current?.addEventListener('load', f); return () => removeEventListener('resize', f);
  }, [actual?.foto]);

  const aPx = ([u, v]) => [caja.x + u * caja.w, caja.y + v * caja.h];
  const esqPx = vano.map(aPx);
  const BW = 400, BH = 400; // tamaño base del dibujo antes de deformar
  const set = (c) => actualizar({ producto: { ...cfg, ...c } });
  const bajar = (i) => (e) => { arrastre.current = i; e.target.setPointerCapture(e.pointerId); };
  const mover = (e) => {
    if (arrastre.current == null) return;
    const r = capa.current.getBoundingClientRect(); const u = Math.min(1, Math.max(0, (e.clientX - r.left - caja.x) / caja.w)), v = Math.min(1, Math.max(0, (e.clientY - r.top - caja.y) / caja.h));
    const n = vano.map((p, i) => (i === arrastre.current ? [u, v] : p)); actualizar({ vano: n });
  };
  const soltar = () => { arrastre.current = null; };
  const P = PRODUCTOS[cfg.producto] || PRODUCTOS.puerta;

  return (
    <section className="pantalla on" data-p="encajar" aria-label="Encajar">
      <Top paso="encajar"><a className="boton coral chico" href="#render">Video <span className="flecha-punteada"></span></a></Top>
      <div className="lienzo" onPointerMove={mover} onPointerUp={soltar}>
        {!actual?.foto ? <div className="vacio" style={{ border: 0, color: '#fff' }}><b>Sin foto</b><span>Toma la foto del vano para encajar el producto.</span><a className="boton linea chico" href="#camara">Ir a la cámara</a></div>
          : <>
            <img ref={img} className="foto" src={actual.foto} alt="Espacio del cliente" />
            <div className="encaje" style={{ width: BW, height: BH, transform: homografia(esqPx, BW, BH) }}><ProductoSVG cfg={cfg} apertura={apertura} /></div>
            <div className="capa" ref={capa}><svg>
              {esqPx.map(([x, y], i) => <circle key={i} className="esquina" cx={x} cy={y} r="9" onPointerDown={bajar(i)} />)}
              {actual.medidas && <text className="cota" x={(esqPx[0][0] + esqPx[1][0]) / 2} y={esqPx[0][1] - 12} textAnchor="middle">{m(cfg.ancho)} × {m(cfg.alto)}</text>}
            </svg></div>
          </>}
        <Titulo sobre="encajar/." nombre={P.nombre} sub={`${m(cfg.ancho)} × ${m(cfg.alto)} · ${DISENOS[cfg.diseno] || ''}${!actual?.vano && actual?.foto ? ' · arrastra las esquinas al vano' : ''}`} />
      </div>
      <div className="ctrl">
        <h2 className="cursiva">Diseño <small>acero</small></h2>
        <div className="campo"><span className="lbl">producto</span><div className="seg seg3">{Object.entries(PRODUCTOS).map(([k, p]) => <button key={k} aria-pressed={cfg.producto === k} onClick={() => set({ producto: k, ancho: actual.medidas?.ancho || p.ancho[2], alto: actual.medidas?.alto || p.alto[2] })}>{p.nombre}</button>)}</div></div>
        {cfg.producto === 'porton' && <div className="campo"><span className="lbl">tipo</span><div className="seg">{Object.entries(TIPOS).map(([k, n]) => <button key={k} aria-pressed={cfg.tipo === k} onClick={() => set({ tipo: k })}>{n}</button>)}</div></div>}
        {cfg.producto !== 'ventana' && <div className="campo"><span className="lbl">diseño de la hoja</span><div className="seg">{Object.entries(DISENOS).map(([k, n]) => <button key={k} aria-pressed={cfg.diseno === k} onClick={() => set({ diseno: k })}>{n}</button>)}</div></div>}
        <div className="campo"><span className="lbl">acabado</span><div className="muestras">{Object.entries(ACABADOS).map(([k, [n, c]]) => <button key={k} aria-pressed={cfg.acabado === k} onClick={() => set({ acabado: k })} style={{ '--c': c }} title={n} aria-label={n} />)}<span className="tag" style={{ alignSelf: 'center' }}>{ACABADOS[cfg.acabado]?.[0]}</span></div></div>
        <div className="fila2">
          <div className="campo"><label>ancho (m)</label><input type="number" step="0.01" value={cfg.ancho} onChange={(e) => set({ ancho: +e.target.value })} /></div>
          <div className="campo"><label>alto (m)</label><input type="number" step="0.01" value={cfg.alto} onChange={(e) => set({ alto: +e.target.value })} /></div>
        </div>
        {cfg.producto === 'porton' && <div className="deslizador"><label>apertura <output>{Math.round(apertura * 100)} %</output></label><input type="range" min="0" max="1" step="0.01" value={apertura} onChange={(e) => setApertura(+e.target.value)} /></div>}
        <button className="boton linea chico" onClick={() => { actualizar({ vano: null }); avisar('Esquinas reiniciadas'); }}>Reiniciar esquinas</button>
        <a className="boton coral" href="#render" style={{ justifyContent: 'space-between' }}>Ver en 3D y grabar el video <span className="flecha-punteada"></span></a>
        <p className="nota-tec">El dibujo es una vista frontal deformada a la perspectiva de la foto (sirve para mostrarle al cliente en el sitio). El render con metal real y el video salen en el paso siguiente.</p>
      </div>
    </section>
  );
}
