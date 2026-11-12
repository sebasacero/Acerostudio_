import { useEffect, useRef, useState } from 'react';
import Top from '../Top.jsx';
import { useApp, m } from '../visita.jsx';
import { REFERENCIAS, hayAR, medirAR, escalaPorReferencia, medidasVano } from '../medicion.js';

// Medir el vano: AR (WebXR) si el equipo lo permite; si no, sobre la foto con una referencia conocida.
const PASOS = ['Marca los dos extremos de la referencia', 'Toca la esquina superior izquierda del vano', 'Esquina superior derecha', 'Esquina inferior derecha', 'Esquina inferior izquierda'];

export default function Medir() {
  const { actual, actualizar, avisar } = useApp();
  const [ar, setAr] = useState(false);
  const [ref, setRef] = useState(REFERENCIAS[0][1]);
  const [pts, setPts] = useState([]); // [r1, r2, tl, tr, br, bl] en fracción de la imagen
  const [manual, setManual] = useState({ ancho: actual?.medidas?.ancho ?? 1, alto: actual?.medidas?.alto ?? 2.1 });
  const img = useRef(null), svg = useRef(null);
  const [caja, setCaja] = useState({ x: 0, y: 0, w: 1, h: 1 }); // rectángulo real de la imagen dentro del lienzo (object-fit: contain)

  useEffect(() => { hayAR().then(setAr); }, []);
  useEffect(() => {
    const f = () => { const i = img.current; if (!i?.naturalWidth) return; const r = i.getBoundingClientRect(), k = Math.min(r.width / i.naturalWidth, r.height / i.naturalHeight), w = i.naturalWidth * k, h = i.naturalHeight * k; setCaja({ x: (r.width - w) / 2, y: (r.height - h) / 2, w, h }); };
    f(); addEventListener('resize', f); img.current?.addEventListener('load', f); return () => removeEventListener('resize', f);
  }, [actual?.foto]);

  const paso = pts.length < 2 ? 0 : pts.length - 1; // índice del paso en curso
  const aPx = ([u, v]) => [caja.x + u * caja.w, caja.y + v * caja.h];
  const tocar = (e) => {
    if (pts.length >= 6) return;
    const r = svg.current.getBoundingClientRect(); const u = (e.clientX - r.left - caja.x) / caja.w, v = (e.clientY - r.top - caja.y) / caja.h;
    if (u < 0 || u > 1 || v < 0 || v > 1) return;
    const n = [...pts, [u, v]]; setPts(n);
    if (n.length === 6) terminar(n);
  };
  function terminar(n) {
    const W = actual.fotoAncho || img.current.naturalWidth, H = actual.fotoAlto || img.current.naturalHeight;
    const px = n.map(([u, v]) => [u * W, v * H]);
    const pxm = escalaPorReferencia(px[0], px[1], ref);
    const med = medidasVano(px.slice(2), pxm);
    actualizar({ medidas: { ancho: +med.ancho.toFixed(2), alto: +med.alto.toFixed(2), fuente: 'referencia', precision: med.precision }, vano: n.slice(2), producto: { ...actual.producto, ancho: +med.ancho.toFixed(2), alto: +med.alto.toFixed(2) } });
    avisar(`Vano de ${med.ancho.toFixed(2)} × ${med.alto.toFixed(2)} m`);
  }
  const lanzarAR = () => {
    const tramos = [];
    medirAR({ alMedir: (d) => tramos.push(d), alCerrar: () => {
      if (tramos.length >= 2) { const [ancho, alto] = tramos; actualizar({ medidas: { ancho: +ancho.toFixed(2), alto: +alto.toFixed(2), fuente: 'webxr', precision: '±1 cm (sensor del teléfono)' }, producto: { ...actual.producto, ancho: +ancho.toFixed(2), alto: +alto.toFixed(2) } }); avisar(`AR: ${ancho.toFixed(2)} × ${alto.toFixed(2)} m`); }
      else avisar('Marca al menos ancho (2 puntos) y alto (2 puntos más)');
    } }).iniciar().catch((e) => avisar('No se pudo abrir la realidad aumentada: ' + e.message));
  };
  const guardarManual = () => { actualizar({ medidas: { ...manual, fuente: 'manual', precision: 'según flexómetro' }, producto: { ...actual.producto, ...manual } }); avisar('Medidas guardadas'); };
  const sinFoto = !actual?.foto;

  return (
    <section className="pantalla on" data-p="medir" aria-label="Medir">
      <Top paso="medir"><a className="boton coral chico" href="#encajar">Encajar <span className="flecha-punteada"></span></a></Top>
      <div className="lienzo">
        {sinFoto ? <div className="vacio" style={{ border: 0, color: '#fff' }}><b>Sin foto</b><span>Toma una foto del vano en la cámara, o escribe las medidas a mano.</span><a className="boton linea chico" href="#camara">Ir a la cámara</a></div>
          : <><img ref={img} className="foto" src={actual.foto} alt="Espacio del cliente" />
            <div className="capa"><svg ref={svg} onPointerDown={tocar} style={{ cursor: pts.length < 6 ? 'crosshair' : 'default' }}>
              {pts.length >= 2 && <line className="linea-ref" x1={aPx(pts[0])[0]} y1={aPx(pts[0])[1]} x2={aPx(pts[1])[0]} y2={aPx(pts[1])[1]} />}
              {pts.length >= 2 && <text className="cota" x={(aPx(pts[0])[0] + aPx(pts[1])[0]) / 2} y={(aPx(pts[0])[1] + aPx(pts[1])[1]) / 2 - 8} textAnchor="middle">{ref} m</text>}
              {pts.length > 2 && <polygon className="vano-poly" points={pts.slice(2).map((p) => aPx(p).join(',')).join(' ')} />}
              {pts.map((p, i) => <circle key={i} className={'punto' + (i < 2 ? ' ref' : '')} cx={aPx(p)[0]} cy={aPx(p)[1]} r="7" />)}
              {actual.medidas && pts.length === 6 && <><text className="cota" x={(aPx(pts[2])[0] + aPx(pts[3])[0]) / 2} y={aPx(pts[2])[1] - 12} textAnchor="middle">{m(actual.medidas.ancho)}</text><text className="cota" x={aPx(pts[3])[0] + 12} y={(aPx(pts[3])[1] + aPx(pts[4])[1]) / 2}>{m(actual.medidas.alto)}</text></>}
            </svg></div></>}
        <div className="sello-cam"><span className="chip">{ar ? 'AR disponible' : 'medición sobre foto'}</span>{actual?.medidas && <span className="chip cel">{actual.medidas.fuente}</span>}</div>
      </div>
      <div className="ctrl">
        <div><h2 className="cursiva">medir/.</h2><span className="tag">{actual?.cliente}</span></div>
        <div className="medidas-grandes">
          <div className="kpi coral"><b>{actual?.medidas ? actual.medidas.ancho.toFixed(2) : '–'}<small>m</small></b><span>ancho del vano</span></div>
          <div className="kpi"><b>{actual?.medidas ? actual.medidas.alto.toFixed(2) : '–'}<small>m</small></b><span>alto del vano</span></div>
        </div>
        {actual?.medidas && <span className="aviso" style={{ margin: 0 }}>Precisión estimada: {actual.medidas.precision}.</span>}
        {ar && <button className="boton coral" onClick={lanzarAR} style={{ justifyContent: 'space-between' }}>Medir con el sensor (AR) <span className="flecha-punteada"></span></button>}
        {!sinFoto && <>
          <div className="campo"><label htmlFor="refsel">referencia en la foto/.</label><select id="refsel" value={ref} onChange={(e) => setRef(+e.target.value)}>{REFERENCIAS.map(([n, v]) => <option key={n} value={v}>{n}</option>)}</select></div>
          <ol className="pasos-med">{PASOS.map((p, i) => <li key={p} className={pts.length >= (i === 0 ? 2 : i + 2) ? 'ok' : i === paso ? 'on' : ''}>{p}</li>)}</ol>
          <button className="boton linea chico" onClick={() => setPts([])}>Empezar de nuevo</button>
        </>}
        <div className="campo"><span className="lbl">o a mano (flexómetro)/.</span>
          <div className="fila2"><input type="number" step="0.01" min="0.3" value={manual.ancho} onChange={(e) => setManual({ ...manual, ancho: +e.target.value })} aria-label="Ancho en metros" /><input type="number" step="0.01" min="0.3" value={manual.alto} onChange={(e) => setManual({ ...manual, alto: +e.target.value })} aria-label="Alto en metros" /></div>
          <button className="boton linea chico" onClick={guardarManual}>Guardar ancho × alto</button>
        </div>
        <p className="nota-tec"><b>LiDAR:</b> el iPhone no deja que el navegador lea el LiDAR; solo una app nativa (ARKit) lo hace. Esta pantalla usa la realidad aumentada del navegador cuando existe (Android/Chrome) y, si no, mide sobre la foto con una referencia. El dato queda guardado con su fuente y precisión, listo para que la versión nativa lo reemplace por LiDAR.</p>
      </div>
    </section>
  );
}
