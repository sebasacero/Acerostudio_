import { useEffect, useRef, useState } from 'react';
import Top, { Titulo } from '../Top.jsx';
import { useApp } from '../visita.jsx';
import { irA } from '../App.jsx';

// Cámara optimizada para la visita: cámara trasera, resolución elegible, enfoque continuo, linterna y zoom
// (cuando el teléfono expone esas capacidades), foto JPEG y video con MediaRecorder a alta tasa de bits.
const RES = { '720p': [1280, 720], '1080p': [1920, 1080], '4K': [3840, 2160] };
function mimeVideo() {
  if (typeof MediaRecorder === 'undefined') return null;
  for (const t of ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']) if (MediaRecorder.isTypeSupported(t)) return t;
  return '';
}

export default function Camara() {
  const { actual, actualizar, crear, avisar, videos } = useApp();
  const video = useRef(null), stream = useRef(null), rec = useRef(null), trozos = useRef([]), cronometro = useRef(null);
  const [res, setRes] = useState('1080p');
  const [estado, setEstado] = useState('arrancando'); // arrancando | lista | sin-camara
  const [error, setError] = useState('');
  const [caps, setCaps] = useState({});
  const [linterna, setLinterna] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [grabando, setGrabando] = useState(false);
  const [modo, setModo] = useState('foto'); // foto | video
  const [segundos, setSegundos] = useState(0);
  const [fotos, setFotos] = useState(() => (actual?.fotos || (actual?.foto ? [actual.foto] : [])));
  const [videoUrl, setVideoUrl] = useState(() => (actual && videos[actual.id]?.url) || null);

  useEffect(() => { if (!actual) crear({ cliente: 'Cliente sin nombre' }); }, []);

  async function abrir() {
    cerrar();
    setEstado('arrancando'); setError('');
    if (!navigator.mediaDevices?.getUserMedia) { setEstado('sin-camara'); setError('Este navegador no permite usar la cámara. En iPhone abre la app en Safari.'); return; }
    const [w, h] = RES[res];
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: { ideal: 'environment' }, width: { ideal: w }, height: { ideal: h }, frameRate: { ideal: 30 } } });
      stream.current = s; video.current.srcObject = s; await video.current.play().catch(() => {});
      const t = s.getVideoTracks()[0]; const c = t.getCapabilities ? t.getCapabilities() : {};
      setCaps(c);
      // optimizaciones: enfoque continuo y balance de blancos automático cuando se pueden pedir
      const adv = [];
      if (c.focusMode?.includes('continuous')) adv.push({ focusMode: 'continuous' });
      if (c.whiteBalanceMode?.includes('continuous')) adv.push({ whiteBalanceMode: 'continuous' });
      if (adv.length) await t.applyConstraints({ advanced: adv }).catch(() => {});
      setEstado('lista');
    } catch (e) { setEstado('sin-camara'); setError(e.name === 'NotAllowedError' ? 'Sin permiso para la cámara. Permítela en el navegador y vuelve a intentar.' : `No se pudo abrir la cámara (${e.name}).`); }
  }
  function cerrar() { stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null; }
  useEffect(() => { abrir(); return () => { cerrar(); clearInterval(cronometro.current); }; }, [res]);

  const pista = () => stream.current?.getVideoTracks()[0];
  const alternarLinterna = async () => { const t = pista(); if (!t) return; try { await t.applyConstraints({ advanced: [{ torch: !linterna }] }); setLinterna(!linterna); } catch { avisar('Este equipo no deja controlar la linterna desde el navegador'); } };
  const cambiarZoom = async (z) => { setZoom(z); const t = pista(); if (!t) return; try { await t.applyConstraints({ advanced: [{ zoom: z }] }); } catch {} };

  function foto() {
    const v = video.current; if (!v?.videoWidth) return avisar('La cámara aún no entrega imagen');
    const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0);
    const jpg = c.toDataURL('image/jpeg', 0.86);
    // miniatura liviana para guardar en el teléfono (localStorage ≈ 5 MB); la foto completa queda en la visita actual
    const m = document.createElement('canvas'); const k = Math.min(1, 1600 / c.width); m.width = c.width * k; m.height = c.height * k; m.getContext('2d').drawImage(c, 0, 0, m.width, m.height);
    const guardada = m.toDataURL('image/jpeg', 0.8);
    const lista = [guardada, ...fotos].slice(0, 4); setFotos(lista);
    actualizar({ foto: guardada, fotos: lista, fotoAncho: m.width, fotoAlto: m.height, medidas: null, vano: null });
    avisar('Foto guardada en la visita');
    void jpg;
  }
  function grabar() {
    if (grabando) { rec.current?.stop(); return; }
    const tipo = mimeVideo(); if (tipo === null || !stream.current) return avisar('Este navegador no graba video');
    trozos.current = [];
    const r = new MediaRecorder(stream.current, { mimeType: tipo || undefined, videoBitsPerSecond: res === '4K' ? 20e6 : res === '1080p' ? 8e6 : 4e6 });
    r.ondataavailable = (e) => { if (e.data.size) trozos.current.push(e.data); };
    r.onstop = () => {
      clearInterval(cronometro.current); setGrabando(false);
      const blob = new Blob(trozos.current, { type: r.mimeType }); const url = URL.createObjectURL(blob);
      videos[actual.id] = { url, blob, tipo: r.mimeType, duracion: segundos };
      setVideoUrl(url); actualizar({ video: { tipo: r.mimeType, duracion: segundos, bytes: blob.size } }); avisar(`Video de ${segundos} s listo`);
    };
    r.start(500); rec.current = r; setGrabando(true); setSegundos(0);
    cronometro.current = setInterval(() => setSegundos((s) => s + 1), 1000);
  }
  const compartir = async () => {
    const v = videos[actual.id]; if (!v) return;
    const ext = v.tipo.includes('mp4') ? 'mp4' : 'webm'; const archivo = new File([v.blob], `visita-${actual.cliente}.${ext}`, { type: v.tipo });
    if (navigator.canShare?.({ files: [archivo] })) { try { await navigator.share({ files: [archivo], title: 'Visita AceroStudio' }); return; } catch {} }
    const a = document.createElement('a'); a.href = v.url; a.download = archivo.name; a.click();
  };

  return (
    <section className="pantalla on" data-p="camara" aria-label="Cámara">
      <Top paso="camara"><a className="boton coral chico" href="#medir">Medir <span className="flecha-punteada"></span></a></Top>
      <div className="lienzo">
        <video ref={video} playsInline muted autoPlay />
        {estado !== 'lista' && <div className="vacio" style={{ position: 'absolute', inset: 'auto 20px', border: 0, color: '#fff' }}>
          {estado === 'arrancando' ? <span>Abriendo la cámara…</span> : <><b>Sin cámara</b><span>{error}</span><button className="boton linea chico" onClick={abrir}>Reintentar</button></>}
        </div>}
        <Titulo sobre="cámara/." nombre={actual?.cliente || 'Visita'} sub={<>{res} · {modo}{grabando && <span className="tiempo-rec"> ● REC {String(Math.floor(segundos / 60)).padStart(2, '0')}:{String(segundos % 60).padStart(2, '0')}</span>}</>} />
        {/* barra inferior de la cámara: opciones arriba, modos y disparador abajo (como la cámara del teléfono) */}
        <div className="barra-cam">
          <div className="opc-cam">
            <div className="seg chico" role="group" aria-label="Resolución">{Object.keys(RES).map((r) => <button key={r} aria-pressed={res === r} onClick={() => setRes(r)}>{r}</button>)}</div>
            <button className={'opc' + (linterna ? ' on' : '')} onClick={alternarLinterna} aria-pressed={linterna} disabled={!caps.torch}>luz</button>
            {caps.zoom ? <label className="zoom-cam">zoom <input type="range" min={caps.zoom.min} max={Math.min(caps.zoom.max, 5)} step="0.1" value={zoom} onChange={(e) => cambiarZoom(+e.target.value)} aria-label="Zoom" /><output>{zoom.toFixed(1)}×</output></label> : <span className="opc" aria-disabled="true">zoom</span>}
          </div>
          <div className="modos-cam">
            <div className="seg" role="tablist" aria-label="Modo"><button role="tab" aria-pressed={modo === 'foto'} onClick={() => setModo('foto')} disabled={grabando}>Foto</button><button role="tab" aria-pressed={modo === 'video'} onClick={() => setModo('video')}>Video</button><a role="tab" href="#medir">Medir</a></div>
            {modo === 'foto'
              ? <button className="disparo" onClick={foto} aria-label="Tomar foto" />
              : <button className={'disparo video' + (grabando ? ' on' : '')} onClick={grabar} aria-label={grabando ? 'Parar video' : 'Grabar video'}><i></i></button>}
            <div className="ultima" style={{ backgroundImage: fotos[0] ? `url(${fotos[0]})` : undefined }} aria-hidden="true">{!fotos[0] && (videoUrl ? '▶' : '')}</div>
          </div>
        </div>
      </div>
      <div className="ctrl">
        <h2 className="cursiva">Cámara <small>{actual?.cliente}</small></h2>
        <div><span className="seccion-tag">fotos de la visita</span>
          <div className="galeria" style={{ marginTop: 8 }}>
            {fotos.map((f, i) => <div key={i} className={'img' + (i === 0 ? ' on' : '')} style={{ backgroundImage: `url(${f})` }} onClick={() => { const l = [f, ...fotos.filter((x) => x !== f)]; setFotos(l); actualizar({ foto: f, fotos: l, medidas: null, vano: null }); }} />)}
            {videoUrl && <div className="img"><video src={videoUrl} muted playsInline controls /></div>}
            {!fotos.length && !videoUrl && <div className="img">toma una foto del vano</div>}
          </div>
        </div>
        {videoUrl && <button className="boton linea" onClick={compartir} style={{ justifyContent: 'space-between' }}>Compartir o descargar el video <span className="flecha-punteada"></span></button>}
        <a className="boton coral" href="#medir" style={{ justifyContent: 'space-between' }}>Medir el vano <span className="flecha-punteada"></span></a>
        <p className="nota-tec">Consejos: pon el teléfono horizontal y de frente al vano, incluye el piso y una referencia de medida conocida (puerta, baldosa, un metro). Con buena luz el enfoque continuo mantiene nítido el video.</p>
        <p className="nota-tec">Capacidades de este equipo: {['focusMode', 'torch', 'zoom', 'whiteBalanceMode'].filter((k) => caps[k]).join(', ') || 'básicas (el navegador no expone enfoque, linterna ni zoom)'}.</p>
      </div>
    </section>
  );
}
