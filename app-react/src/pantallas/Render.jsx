import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Top, { Titulo } from '../Top.jsx';
import { useApp, m, cop } from '../visita.jsx';
import { crearSimulador } from '../../../ornamentacion/js/porton.js';

// Render con metal real (simulador 3D de Ornamentación) sobre la foto del cliente, y video del producto funcionando
// con subtítulos que explican qué hace: se graba desde un canvas compuesto (3D + rótulos) con MediaRecorder.
const MAPA_DISENO = { celosia: 'celosia', lanzas: 'lanzas', listones: 'listones', lamina: 'lamina', tablero: 'tablero' };
function mimeVideo() { if (typeof MediaRecorder === 'undefined') return null; for (const t of ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm']) if (MediaRecorder.isTypeSupported(t)) return t; return ''; }

function guionDe(cfg, ficha) {
  const nombre = { porton: 'Portón', puerta: 'Puerta', ventana: 'Ventana', reja: 'Reja', baranda: 'Baranda' }[cfg.producto] || 'Producto';
  const tam = `${cfg.ancho.toFixed(2)} × ${cfg.alto.toFixed(2)} m`;
  if (cfg.producto === 'porton') return [
    { t: 0, txt: `${nombre} ${cfg.tipo} en acero · ${tam}`, vista: 'calle', cmd: null },
    { t: 3, txt: 'Abre desde el control o la app del celular', cmd: 'abrir', vista: 'calle' },
    { t: 8, txt: `Motor ${ficha?.motor?.modelo || 'eléctrico'} con batería de respaldo`, vista: 'motor' },
    { t: 12, txt: 'La fotocelda detiene el cierre si alguien pasa', cmd: 'cerrar', vista: 'calle' },
    { t: 17, txt: 'Puerta peatonal independiente con chapa eléctrica', cmd: 'puerta', vista: 'herrajes' },
    { t: 21, txt: `${Math.round(ficha?.kg || 0)} kg de acero · pintura electrostática · 50 años de experiencia`, vista: 'calle' },
    { t: 25, fin: true },
  ];
  return [
    { t: 0, txt: `${nombre} en acero · ${tam}`, vista: 'calle' },
    { t: 3, txt: 'Marco fijo anclado al vano, hoja con relleno de ' + (cfg.diseno || 'celosía'), vista: 'frente' },
    { t: 7, txt: cfg.producto === 'ventana' ? 'Vidrio templado de 6 mm y herrajes' : 'Herrajes y cerradura de seguridad', cmd: cfg.producto === 'puerta' ? 'puerta' : null, vista: 'herrajes' },
    { t: 11, txt: `${Math.round(ficha?.kg || 0)} kg de acero · pintura electrostática · 50 años de experiencia`, vista: 'calle' },
    { t: 15, fin: true },
  ];
}

export default function Render() {
  const { actual, actualizar, avisar, videos, dia } = useApp();
  const canvas = useRef(null), sim = useRef(null), raf = useRef(0), textura = useRef(null), despierta = useRef(null), alDibujar = useRef(null);
  const [listo, setListo] = useState(false);
  const [sin3D, setSin3D] = useState('');
  const [ficha, setFicha] = useState(null);
  const [conFoto, setConFoto] = useState(!!actual?.foto);
  const [grabando, setGrabando] = useState(false);
  const [sub, setSub] = useState('');
  const [progreso, setProgreso] = useState(0);
  const [pasoGuion, setPasoGuion] = useState(-1);
  const [videoUrl, setVideoUrl] = useState(() => (actual && videos['r' + actual.id]?.url) || null);
  const cfg = actual?.producto;

  useEffect(() => {
    if (!cfg) return;
    const c = canvas.current;
    // la foto del cliente va como fondo de la escena (cfg.fondo) desde el inicio, así el piso del estudio solo recibe sombra
    let tx = null;
    if (actual.foto) { tx = new THREE.TextureLoader().load(actual.foto, () => despierta.current?.()); tx.colorSpace = THREE.SRGBColorSpace; textura.current = tx; }
    // sin bloom ni búfer preservado: los dos cuestan mucha GPU en el teléfono; la foto y el video se toman justo después de dibujar
    const s = crearSimulador(c, { cfg: { producto: cfg.producto, tipo: cfg.tipo || 'corredizo', diseno: MAPA_DISENO[cfg.diseno] || 'celosia', ancho: cfg.ancho, alto: cfg.alto, acabado: 'grafito', paisaje: false, dia, fondo: tx, brillo: false } });
    sim.current = s; if (s.sin3D) setSin3D(s.sin3D);
    const tactil = matchMedia('(pointer: coarse)').matches;
    // en el teléfono: sombras a 1024 (no 2048) y como mucho 1,5× de densidad de píxeles
    if (tactil) s.scene.traverse((o) => { if (o.isDirectionalLight && o.shadow) { o.shadow.mapSize.set(1024, 1024); o.shadow.map?.dispose(); o.shadow.map = null; } });
    // Dibujo bajo demanda: solo mientras algo se mueve (cámara, portón, puerta, carro, visitante) o se graba.
    // Quieto, el bucle se duerme y la GPU descansa; un toque, un comando o un cambio lo despiertan.
    let t0 = 0, firma = '', quieto = 0, durmiendo = true;
    const firmaDe = () => { const p = s.camera.position, S = s.S; return [p.x, p.y, p.z, S.p, S.q, S.tPausa, S.tPuerta, s.car.z, s.per.x, s.per.z, s.per.fase].map((n) => (+n || 0).toFixed(3)).join(); };
    const bucle = (t) => {
      const dt = t0 ? Math.min(0.05, (t - t0) / 1000) : 1 / 60; t0 = t;
      s.step(dt); s.render(dt); alDibujar.current?.();
      const f = firmaDe(); quieto = f === firma ? quieto + dt : Math.min(quieto, 0); firma = f;
      const moviendo = s.S.estado === 'abriendo' || s.S.estado === 'cerrando';
      if (!alDibujar.current && !moviendo && quieto > 0.6) { durmiendo = true; t0 = 0; return; }
      raf.current = requestAnimationFrame(bucle);
    };
    function despertar() { quieto = -1.2; // tras despertar dibuja al menos ~2 s (animaciones de armado que la firma no ve)
      if (durmiendo && !document.hidden) { durmiendo = false; raf.current = requestAnimationFrame(bucle); } }
    despierta.current = despertar;
    const ajustar = () => { const r = c.parentElement.getBoundingClientRect(); s.medida(r.width, r.height, Math.min(tactil ? 1.5 : 1.75, devicePixelRatio || 1)); despertar(); };
    const alVer = () => { if (document.hidden) { cancelAnimationFrame(raf.current); durmiendo = true; t0 = 0; } else despertar(); };
    const obs = new ResizeObserver(ajustar); obs.observe(c.parentElement);
    ajustar(); document.addEventListener('visibilitychange', alVer);
    for (const ev of ['pointerdown', 'pointermove', 'wheel']) c.addEventListener(ev, despertar, { passive: true });
    setFicha(s.ficha); setListo(true);
    return () => { cancelAnimationFrame(raf.current); obs.disconnect(); document.removeEventListener('visibilitychange', alVer); despierta.current = null; alDibujar.current = null; s.renderer.dispose?.(); if (!c.isConnected) s.renderer.forceContextLoss?.(); tx?.dispose(); }; // libera la GPU al salir de la pantalla (no en el doble montaje de desarrollo)
  }, []);
  useEffect(() => { const s = sim.current; if (!s) return; s.cfg.fondo = conFoto ? textura.current : null; s.set({ dia, semilla: (s.cfg.semilla || 3) }); despierta.current?.(); }, [conFoto, dia]);

  const vista = (n) => { sim.current?.vista(n); despierta.current?.(); };
  const cmd = (c) => { const s = sim.current; if (!s) return; if (c === 'puerta') s.abrirPuerta('App'); else s.cmd(c, 'App'); despierta.current?.(); };

  async function grabar() {
    const s = sim.current; if (!s || s.sin3D) return avisar('Sin 3D en este equipo no se puede grabar el video');
    const tipo = mimeVideo(); if (tipo === null) return avisar('Este navegador no graba video');
    const guion = guionDe(cfg, s.ficha), dur = guion[guion.length - 1].t;
    // canvas compuesto: 3D + subtítulo + marca, 1280×720
    const comp = document.createElement('canvas'); comp.width = 1280; comp.height = 720; const g = comp.getContext('2d');
    const stream = comp.captureStream(30); const r = new MediaRecorder(stream, { mimeType: tipo || undefined, videoBitsPerSecond: 6e6 }); const trozos = [];
    r.ondataavailable = (e) => { if (e.data.size) trozos.push(e.data); };
    r.onstop = () => {
      const blob = new Blob(trozos, { type: r.mimeType }), url = URL.createObjectURL(blob);
      videos['r' + actual.id] = { url, blob, tipo: r.mimeType, duracion: dur }; setVideoUrl(url);
      actualizar({ render: { duracion: dur, bytes: blob.size, tipo: r.mimeType } }); setGrabando(false); setSub(''); setPasoGuion(-1); avisar('Video del producto listo');
    };
    setGrabando(true); s.vista('calle', true); r.start(500);
    const inicio = performance.now(); let i = 0, subt = '', ultimoProg = 0;
    await new Promise((fin) => {
      // el cuadro se compone justo después de dibujar el 3D (en el mismo bucle), así no hace falta preservar el búfer de WebGL
      alDibujar.current = () => {
        const t = (performance.now() - inicio) / 1000;
        while (i < guion.length && guion[i].t <= t) { const p = guion[i]; if (p.fin) { alDibujar.current = null; fin(); return; } subt = p.txt; setSub(p.txt); setPasoGuion(i); if (p.vista) s.vista(p.vista); if (p.cmd) cmd(p.cmd); i++; }
        if (t - ultimoProg > 0.25) { ultimoProg = t; setProgreso(t / dur); } // la barra no necesita 60 renders por segundo
        g.drawImage(canvas.current, 0, 0, comp.width, comp.height);
        if (subt) { g.font = '500 30px Outfit, sans-serif'; const w = g.measureText(subt).width + 48; g.fillStyle = 'rgba(11,13,16,.8)'; g.fillRect((comp.width - w) / 2, 620, w, 62); g.fillStyle = '#ee7f74'; g.fillRect((comp.width - w) / 2, 620, 4, 62); g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText(subt, (comp.width - w) / 2 + 28, 651); }
        g.font = '600 18px DM Mono, monospace'; g.fillStyle = 'rgba(255,255,255,.85)'; g.textBaseline = 'alphabetic'; g.fillText('ACERO.STUDIO · ' + (actual.cliente || ''), 28, 44);
      };
      despierta.current?.();
    });
    r.stop(); setProgreso(1);
  }
  const compartir = async () => {
    const v = videos['r' + actual.id]; if (!v) return;
    const ext = v.tipo.includes('mp4') ? 'mp4' : 'webm'; const archivo = new File([v.blob], `${cfg.producto}-${actual.cliente}.${ext}`, { type: v.tipo });
    if (navigator.canShare?.({ files: [archivo] })) { try { await navigator.share({ files: [archivo], title: 'Así funciona tu ' + cfg.producto, text: 'Video de AceroStudio' }); return; } catch {} }
    const a = document.createElement('a'); a.href = v.url; a.download = archivo.name; a.click();
  };
  const fotoRender = () => { const s = sim.current; if (!s) return; s.render(0); const url /* inmediatamente después de dibujar: no requiere preserveDrawingBuffer */ = canvas.current.toDataURL('image/jpeg', 0.9); actualizar({ renderFoto: url }); avisar('Render guardado en la visita'); };
  const guion = cfg ? guionDe(cfg, ficha) : [];

  return (
    <section className="pantalla on" data-p="render" aria-label="Video">
      <Top paso="render"><a className="boton coral chico" href="#propuesta">Propuesta <span className="flecha-punteada"></span></a></Top>
      <div className="lienzo">
        <canvas ref={canvas} className="vista3d" />
        {sin3D && <div className="vacio" style={{ position: 'absolute', border: 0, color: '#fff' }}><b>El visor 3D no arrancó</b><span>{sin3D}</span></div>}
        {sub && <div className="subtitulo">{sub}</div>}
        <Titulo sobre="video/." nombre={cfg?.producto || 'Producto'} sub={<>{cfg ? `${m(cfg.ancho)} × ${m(cfg.alto)} · metal realista` : ''}{grabando && <span className="tiempo-rec"> ● GRABANDO</span>}</>} />
        <div className="vistas-cam">{['calle', 'frente', 'motor', 'herrajes', 'predio', 'aerea'].map((v) => <button key={v} onClick={() => vista(v)}>{v}</button>)}</div>
      </div>
      <div className="ctrl">
        <h2 className="cursiva">Render y video <small>{cfg?.producto}</small></h2>
        {cfg?.producto === 'porton' && <div className="campo"><span className="lbl">mando</span><div className="tresb"><button onClick={() => cmd('abrir')}>Abrir</button><button onClick={() => cmd('cerrar')}>Cerrar</button><button onClick={() => cmd('parar')}>Parar</button><button onClick={() => cmd('puerta')}>Puerta peatonal</button></div></div>}
        {cfg?.producto === 'puerta' && <div className="campo"><span className="lbl">mando</span><div className="tresb"><button onClick={() => cmd('puerta')}>Abrir la puerta</button></div></div>}
        <label className="conm" style={{ fontSize: 13 }} onClick={() => setConFoto(!conFoto)} aria-pressed={conFoto}><i></i>foto del cliente de fondo</label>
        <div>
          <span className="seccion-tag">guion del video</span>
          <ol className="guion" style={{ marginTop: 8 }}>{guion.filter((p) => !p.fin).map((p, i) => <li key={i} className={i === pasoGuion ? 'on' : ''}><b>{String(p.t).padStart(2, '0')} s</b><span>{p.txt}</span></li>)}</ol>
        </div>
        {grabando && <div className="barra-progreso"><i style={{ width: progreso * 100 + '%' }}></i></div>}
        <button className="boton coral" disabled={grabando || !listo} onClick={grabar} style={{ justifyContent: 'space-between' }}>{grabando ? 'Grabando…' : `Grabar video de ${guion.length ? guion[guion.length - 1].t : 0} s`} <span className="flecha-punteada"></span></button>
        <div className="dosb"><button onClick={fotoRender}>Guardar render (foto)</button>{videoUrl && <button onClick={compartir}>Enviar video al cliente</button>}</div>
        {videoUrl && <video src={videoUrl} controls playsInline style={{ width: '100%', borderRadius: 4 }} />}
        {ficha && <p className="nota-tec">{Math.round(ficha.kg)} kg de acero · {ficha.hojas} hoja{ficha.hojas > 1 ? 's' : ''} · {ficha.motor?.modelo}. Precio estimado en la propuesta.</p>}
      </div>
    </section>
  );
}
