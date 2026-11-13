import { useEffect, useRef, useState } from 'react';
import Top, { Titulo } from '../Top.jsx';
import { useApp } from '../visita.jsx';
import { irA } from '../App.jsx';
import { PRODUCTOS } from '../producto.jsx';

// Qué se hace con la foto: medir el vano o encajar un producto en el espacio.
const DESTINOS = [['medir', 'Medir'], ['puerta', 'Puerta'], ['porton', 'Portón'], ['estructura', 'Estructura']];
const MANTENER_MS = 350; // mantener oprimido más que esto = video

// Cámara optimizada para la visita: cámara trasera a 1080p, enfoque y balance de blancos continuos
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
  const res = '1080p'; // fija: buen detalle sin videos pesados para WhatsApp
  const [estado, setEstado] = useState('arrancando'); // arrancando | lista | sin-camara
  const [error, setError] = useState('');
  const [caps, setCaps] = useState({});
  const [grabando, setGrabando] = useState(false);
  const [destino, setDestino] = useState(() => (actual?.producto?.producto && actual.producto.producto !== 'puerta' && DESTINOS.some(([k]) => k === actual.producto.producto) ? actual.producto.producto : 'medir'));
  const pulsado = useRef(null), seg = useRef(0);
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
  // con la app en segundo plano (o el teléfono bloqueado) la cámara y el micrófono se apagan; al volver se reabren
  useEffect(() => {
    const f = () => { if (document.hidden) { if (rec.current?.state === 'recording') rec.current.stop(); cerrar(); } else if (!stream.current) abrir(); };
    document.addEventListener('visibilitychange', f); return () => document.removeEventListener('visibilitychange', f);
  }, []);


  // brillo medio (0..255) de una muestra pequeña: en iPhone el primer cuadro tras despertar la cámara a veces sale negro
  function brillo(c) {
    const t = document.createElement('canvas'); t.width = 32; t.height = 24; const g = t.getContext('2d', { willReadFrequently: true }); g.drawImage(c, 0, 0, 32, 24);
    const d = g.getImageData(0, 0, 32, 24).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11; return s / (d.length / 4);
  }
  async function foto(intento = 0) {
    const v = video.current; if (!v?.videoWidth) return avisar('La cámara aún no entrega imagen');
    if (v.paused) await v.play().catch(() => {});
    // se reduce directo del video a 1600 px (antes se codificaba además un JPEG completo que nunca se usaba)
    const k = Math.min(1, 1600 / v.videoWidth); const m = document.createElement('canvas'); m.width = Math.round(v.videoWidth * k); m.height = Math.round(v.videoHeight * k);
    m.getContext('2d').drawImage(v, 0, 0, m.width, m.height);
    if (brillo(m) < 6) {
      // cuadro negro: se espera un cuadro nuevo de la cámara y se reintenta; si sigue negro, es la luz o el lente tapado
      if (intento < 3) return new Promise((ok) => setTimeout(ok, 180)).then(() => foto(intento + 1));
      return avisar('La foto salió negra: revisa que el lente no esté tapado y que haya luz');
    }
    const guardada = m.toDataURL('image/jpeg', 0.82);
    const lista = [guardada, ...fotos].slice(0, 4); setFotos(lista);
    actualizar({ foto: guardada, fotos: lista, fotoAncho: m.width, fotoAlto: m.height, medidas: null, vano: null });
    seguir(destino);
  }
  // lleva la foto al paso elegido: medir el vano o encajar el producto en el espacio
  function seguir(d) {
    if (d === 'medir') return irA('medir');
    const P = PRODUCTOS[d]; const med = actual?.medidas;
    actualizar((v) => ({ producto: { ...v.producto, producto: d, ancho: med?.ancho || P.ancho[2], alto: med?.alto || P.alto[2] } }));
    irA('encajar');
  }
  // un solo disparador: tocar = foto, mantener oprimido = video (se graba mientras se mantiene)
  const bajar = (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); pulsado.current = setTimeout(() => { pulsado.current = 'video'; grabar(); }, MANTENER_MS); };
  const subir = () => { if (pulsado.current === 'video') { rec.current?.stop(); } else if (pulsado.current) { clearTimeout(pulsado.current); foto(); } pulsado.current = null; };
  const cancelar = () => { if (pulsado.current === 'video') rec.current?.stop(); else clearTimeout(pulsado.current); pulsado.current = null; };
  function grabar() {
    if (grabando) { rec.current?.stop(); return; }
    const tipo = mimeVideo(); if (tipo === null || !stream.current) return avisar('Este navegador no graba video');
    trozos.current = [];
    const r = new MediaRecorder(stream.current, { mimeType: tipo || undefined, videoBitsPerSecond: res === '4K' ? 20e6 : res === '1080p' ? 8e6 : 4e6 });
    r.ondataavailable = (e) => { if (e.data.size) trozos.current.push(e.data); };
    r.onstop = () => {
      clearInterval(cronometro.current); setGrabando(false);
      const blob = new Blob(trozos.current, { type: r.mimeType }); const url = URL.createObjectURL(blob);
      const dur = seg.current;
      videos[actual.id] = { url, blob, tipo: r.mimeType, duracion: dur };
      setVideoUrl(url); actualizar({ video: { tipo: r.mimeType, duracion: dur, bytes: blob.size } }); avisar(`Video de ${dur} s guardado en la visita`);
    };
    r.start(500); rec.current = r; setGrabando(true); setSegundos(0); seg.current = 0;
    cronometro.current = setInterval(() => { seg.current += 1; setSegundos(seg.current); }, 1000);
  }
  const compartir = async () => {
    const v = videos[actual.id]; if (!v) return;
    const ext = v.tipo.includes('mp4') ? 'mp4' : 'webm'; const archivo = new File([v.blob], `visita-${actual.cliente}.${ext}`, { type: v.tipo });
    if (navigator.canShare?.({ files: [archivo] })) { try { await navigator.share({ files: [archivo], title: 'Visita AceroStudio' }); return; } catch {} }
    const a = document.createElement('a'); a.href = v.url; a.download = archivo.name; a.click();
  };

  return (
    <section className="pantalla on" data-p="camara" aria-label="Cámara">
      <Top paso="camara" />
      <div className="lienzo">
        <video ref={video} playsInline muted autoPlay />
        {estado !== 'lista' && <div className="vacio" style={{ position: 'absolute', inset: 'auto 20px', border: 0, color: '#fff' }}>
          {estado === 'arrancando' ? <span>Abriendo la cámara…</span> : <><b>Sin cámara</b><span>{error}</span><button className="boton linea chico" onClick={abrir}>Reintentar</button></>}
        </div>}
        <Titulo sobre="cámara/." nombre={actual?.cliente || 'Visita'} sub={<>{grabando ? '' : 'toca: foto · mantén: video'}{grabando && <span className="tiempo-rec"> ● REC {String(Math.floor(segundos / 60)).padStart(2, '0')}:{String(segundos % 60).padStart(2, '0')}</span>}</>} />
        {/* barra inferior de la cámara: opciones arriba, modos y disparador abajo (como la cámara del teléfono) */}
        <div className="barra-cam">
          {(fotos.length > 0 || videoUrl) && <div className="tira" aria-label="Fotos de la visita">
            {fotos.map((f, i) => <button key={i} className={'mini' + (i === 0 ? ' on' : '')} style={{ backgroundImage: `url(${f})` }} onClick={() => { const l = [f, ...fotos.filter((x) => x !== f)]; setFotos(l); actualizar({ foto: f, fotos: l, medidas: null, vano: null }); }} aria-label={`Foto ${i + 1}`} />)}
            {videoUrl && <button className="mini vid" onClick={compartir} aria-label="Compartir el video">▶<small>{actual?.video?.duracion ?? segundos} s</small></button>}
          </div>}
          <div className="modos-cam">
            <div className="seg destinos" role="radiogroup" aria-label="Qué hacer con la foto">{DESTINOS.map(([k, t]) => <button key={k} role="radio" aria-checked={destino === k} aria-pressed={destino === k} onClick={() => setDestino(k)} disabled={grabando}>{t}</button>)}</div>
            <div className="fila-disparo">
              <span className="pista-disparo">{grabando ? 'suelta para parar' : destino === 'medir' ? 'foto → medir' : `foto → ${DESTINOS.find(([k]) => k === destino)[1].toLowerCase()}`}</span>
              <button className={'disparo' + (grabando ? ' video on' : '')} onPointerDown={bajar} onPointerUp={subir} onPointerCancel={cancelar} onContextMenu={(e) => e.preventDefault()} aria-label="Tocar para foto, mantener para video"><i></i></button>
              <button className="ultima" onClick={() => fotos[0] && seguir(destino)} style={{ backgroundImage: fotos[0] ? `url(${fotos[0]})` : undefined }} aria-label="Usar la última foto">{!fotos[0] && 'sin foto'}</button>
            </div>
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
        <p className="nota-tec">Capacidades de este equipo: {['focusMode', 'whiteBalanceMode'].filter((k) => caps[k]).join(', ') || 'básicas (el navegador no expone enfoque, linterna ni zoom)'}.</p>
      </div>
    </section>
  );
}
