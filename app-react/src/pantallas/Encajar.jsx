import { useEffect, useRef, useState } from 'react';
import Top, { Titulo } from '../Top.jsx';
import { useApp, m } from '../visita.jsx';
import { homografia } from '../medicion.js';
import { ProductoSVG, PRODUCTOS, DISENOS, TIPOS, ACABADOS } from '../producto.jsx';
import { useDetectorVano } from '../vision.js';
import EstadoIA from '../EstadoIA.jsx';

// Encajar: el producto dibujado se deforma (homografía CSS) hasta las 4 esquinas del vano marcado en la foto.
// Fase 1: al tocar el espacio, la IA (SlimSAM de Meta) recorta el vano y propone las 4 esquinas; se confirman o se arrastran.
export default function Encajar() {
  const { actual, actualizar, avisar } = useApp();
  const img = useRef(null), capa = useRef(null);
  const [caja, setCaja] = useState({ x: 0, y: 0, w: 1, h: 1 });
  const [apertura, setApertura] = useState(0);
  const arrastre = useRef(null);
  const det = useDetectorVano(actual?.foto); // la IA solo arranca cuando se toca la foto
  const [arrastrado, setArrastrado] = useState(null); // esquinas mientras se arrastra: se guardan en la visita solo al soltar
  const cuadro = useRef(0);
  const [mascara, setMascara] = useState(null); // recorte propuesto por la IA, mientras se confirma
  const [buscando, setBuscando] = useState(false);
  const cfg = actual?.producto || {};
  const vano = arrastrado || actual?.vano || [[0.3, 0.3], [0.7, 0.3], [0.7, 0.85], [0.3, 0.85]];

  useEffect(() => {
    const f = () => { const i = img.current; if (!i?.naturalWidth) return; const r = i.getBoundingClientRect(), k = Math.min(r.width / i.naturalWidth, r.height / i.naturalHeight), w = i.naturalWidth * k, h = i.naturalHeight * k; setCaja({ x: (r.width - w) / 2, y: (r.height - h) / 2, w, h }); };
    f(); addEventListener('resize', f); img.current?.addEventListener('load', f); return () => removeEventListener('resize', f);
  }, [actual?.foto]);

  const aPx = ([u, v]) => [caja.x + u * caja.w, caja.y + v * caja.h];
  const esqPx = vano.map(aPx);
  const BW = 400, BH = 400; // tamaño base del dibujo antes de deformar
  const set = (c) => actualizar({ producto: { ...cfg, ...c } });
  const bajar = (i) => (e) => { arrastre.current = i; e.target.setPointerCapture(e.pointerId); };
  // un cambio por cuadro de pantalla como mucho, y solo en estado local
  const mover = (e) => {
    if (arrastre.current == null) return;
    const { clientX, clientY } = e;
    if (cuadro.current) return; cuadro.current = requestAnimationFrame(() => {
      cuadro.current = 0; if (arrastre.current == null) return;
      const r = capa.current.getBoundingClientRect(); const u = Math.min(1, Math.max(0, (clientX - r.left - caja.x) / caja.w)), v = Math.min(1, Math.max(0, (clientY - r.top - caja.y) / caja.h));
      setArrastrado((a) => (a || vano).map((p, i) => (i === arrastre.current ? [u, v] : p)));
    });
  };
  const soltar = () => { if (arrastre.current == null) return; arrastre.current = null; cancelAnimationFrame(cuadro.current); cuadro.current = 0; if (arrastrado) actualizar({ vano: arrastrado }); setArrastrado(null); };
  // tocar la foto (fuera de las esquinas) = la IA busca el vano en ese punto
  // el resultado se muestra en la misma píldora donde se vio "Analizando la foto…", unos segundos
  const [aviso, setAviso] = useState(''); const reloj = useRef(0);
  const mostrarAviso = (t) => { setAviso(t); clearTimeout(reloj.current); reloj.current = setTimeout(() => setAviso(''), 4000); };
  async function tocarFoto(e) {
    if (e.target !== e.currentTarget || buscando) return;
    const r = capa.current.getBoundingClientRect(); const u = (e.clientX - r.left - caja.x) / caja.w, v = (e.clientY - r.top - caja.y) / caja.h;
    if (u < 0 || u > 1 || v < 0 || v > 1) return;
    if (det.estado === 'cargando') return avisar(`La IA se está preparando (${Math.round(det.progreso * 100)} %)`);
    if (det.estado === 'error') return avisar('La IA no está disponible en este equipo: arrastra las 4 esquinas');
    setBuscando(true);
    try {
      const res = await det.detectar(u, v);
      if (!res) { mostrarAviso('No encontré un espacio claro ahí: toca más al centro del vano'); return; }
      actualizar({ vano: res.esquinas }); setMascara(res.mascara);
    } catch (err) { console.warn(err); mostrarAviso('No se pudo analizar la foto: arrastra las esquinas'); }
    finally { setBuscando(false); }
  }
  const sinVano = !actual?.vano && det.estado !== 'error';
  const P = PRODUCTOS[cfg.producto] || PRODUCTOS.puerta;

  return (
    <section className="pantalla on" data-p="encajar" aria-label="Encajar">
      <Top paso="encajar"><a className="boton coral chico" href="#render">Video <span className="flecha-punteada"></span></a></Top>
      <div className="lienzo" onPointerMove={mover} onPointerUp={soltar} onPointerCancel={soltar}>
        {!actual?.foto ? <div className="vacio" style={{ border: 0, color: '#fff' }}><b>Sin foto</b><span>Toma la foto del vano para encajar el producto.</span><a className="boton linea chico" href="#camara">Ir a la cámara</a></div>
          : <>
            <img ref={img} className="foto" src={actual.foto} alt="Espacio del cliente" />
            {mascara && <img className="mascara" src={mascara} alt="" style={{ left: caja.x, top: caja.y, width: caja.w, height: caja.h }} />}
            {!sinVano && <div className="encaje" style={{ width: BW, height: BH, transform: homografia(esqPx, BW, BH), opacity: mascara ? 0.85 : 1 }}><ProductoSVG cfg={cfg} apertura={apertura} /></div>}
            <div className="capa" ref={capa}><svg onPointerDown={tocarFoto} style={{ cursor: 'crosshair' }}>
              {!sinVano && esqPx.map(([x, y], i) => <circle key={i} className="esquina" cx={x} cy={y} r="11" onPointerDown={bajar(i)} />)}
              {actual.medidas && <text className="cota" x={(esqPx[0][0] + esqPx[1][0]) / 2} y={esqPx[0][1] - 12} textAnchor="middle">{m(cfg.ancho)} × {m(cfg.alto)}</text>}
            </svg></div>
          </>}
        <Titulo sobre="encajar/." nombre={P.nombre} sub={`${m(cfg.ancho)} × ${m(cfg.alto)} · ${DISENOS[cfg.diseno] || ''}`} />
        {actual?.foto && <EstadoIA det={det} buscando={buscando} pista={aviso || (sinVano ? `Toca el espacio donde va ${cfg.producto === 'porton' ? 'el' : 'la'} ${P.nombre.toLowerCase()}` : 'Toca otro punto para volver a detectar')} />}
        {mascara && !buscando && <div className="confirmar-vano">
          <span>¿Es este el espacio?</span>
          <button className="si" onClick={() => { setMascara(null); avisar('Vano confirmado: ajusta las esquinas si hace falta'); }}>Sí, encajar</button>
          <button onClick={() => { setMascara(null); actualizar({ vano: null }); }}>Tocar otro</button>
        </div>}
      </div>
      <div className="ctrl">
        <h2 className="cursiva">Diseño <small>acero</small></h2>
        <div className="campo"><span className="lbl">producto</span><div className="seg seg3">{Object.entries(PRODUCTOS).map(([k, p]) => <button key={k} aria-pressed={cfg.producto === k} onClick={() => set({ producto: k, ancho: actual.medidas?.ancho || p.ancho[2], alto: actual.medidas?.alto || p.alto[2] })}>{p.nombre}</button>)}</div></div>
        {cfg.producto === 'porton' && <div className="campo"><span className="lbl">tipo</span><div className="seg">{Object.entries(TIPOS).map(([k, n]) => <button key={k} aria-pressed={cfg.tipo === k} onClick={() => set({ tipo: k })}>{n}</button>)}</div></div>}
        {cfg.producto !== 'ventana' && <div className="campo"><span className="lbl">diseño de la hoja</span><div className="seg seg3">{Object.entries(DISENOS).map(([k, n]) => <button key={k} aria-pressed={cfg.diseno === k} onClick={() => set({ diseno: k })}>{n}</button>)}</div></div>}
        <div className="campo"><span className="lbl">acabado</span><div className="muestras">{Object.entries(ACABADOS).map(([k, [n, c]]) => <button key={k} aria-pressed={cfg.acabado === k} onClick={() => set({ acabado: k })} style={{ '--c': c }} title={n} aria-label={n} />)}<span className="tag" style={{ alignSelf: 'center' }}>{ACABADOS[cfg.acabado]?.[0]}</span></div></div>
        <div className="fila2">
          <div className="campo"><label>ancho (m)</label><input type="number" step="0.01" value={cfg.ancho} onChange={(e) => set({ ancho: +e.target.value })} /></div>
          <div className="campo"><label>alto (m)</label><input type="number" step="0.01" value={cfg.alto} onChange={(e) => set({ alto: +e.target.value })} /></div>
        </div>
        {cfg.producto === 'porton' && <div className="deslizador"><label>apertura <output>{Math.round(apertura * 100)} %</output></label><input type="range" min="0" max="1" step="0.01" value={apertura} onChange={(e) => setApertura(+e.target.value)} /></div>}
        <button className="boton linea chico" onClick={() => { actualizar({ vano: null }); setMascara(null); avisar('Toca de nuevo el espacio'); }}>Volver a detectar el vano</button>
        <a className="boton coral" href="#render" style={{ justifyContent: 'space-between' }}>Ver en 3D y grabar el video <span className="flecha-punteada"></span></a>
        <p className="nota-tec">Toca el espacio en la foto: la IA de Meta (Segment Anything, versión liviana) lo recorta en el teléfono y propone las 4 esquinas; puedes arrastrarlas para afinar. La primera vez descarga el modelo (unos 14 MB).</p>
      </div>
    </section>
  );
}
