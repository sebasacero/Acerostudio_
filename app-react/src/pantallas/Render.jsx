import { useEffect, useRef, useState } from 'react';
import Top, { Proyecto } from '../Top.jsx';
import { Slot, useApp, Hora, ConmAcero, Conm } from '../store.jsx';
import { BASE, FOTO_IA } from '../datos.js';

const TOMAS = [
  { id: 'aerea', n: 'aérea', info: 'isométrica · 41°', cam: () => BASE },
  { id: 'puente', n: 'puente habitable', info: 'complejo A · 30°', cam: (A) => ({ az: 24, el: 28, vista: 88, centro: [A.pos[0] + 10, 16, A.pos[2]] }) },
  { id: 'viaducto', n: 'sobre el viaducto', info: 'rasante · 20°', cam: () => ({ az: 78, el: 20, vista: 120, centro: [-20, 6, 10] }) },
  { id: 'torre', n: 'torre escalonada', info: 'complejo B · 36°', cam: (A, B) => ({ az: 60, el: 36, vista: 84, centro: [B.pos[0] - 4, 14, B.pos[2]] }) },
  { id: 'cenital', n: 'cenital', info: 'planta · 70°', cam: () => ({ az: 45, el: 70, vista: 210, centro: [-16, 0, -4] }) },
];
const PX = { '16:9': '3840 × 2160', '4:5': '2160 × 2700', '9:16': '2160 × 3840', '1:1': '2880 × 2880' };
const ESTILOS = [['maqueta', 'Maqueta blanca', 'Volumen limpio para revisar masa'], ['noche', 'Ciudad de noche', 'Viaducto coral, estructura a la vista'], ['foto', 'Fotorrealista IA', 'Para vender: luz real, gente, vida']];

export default function Render() {
  const { asegurarCiudad, notas, hora, irA, noche, avisar, mem } = useApp();
  const [tomas, setTomas] = useState(mem.tomas || null); // { imgs, maqueta, noche }
  const [toma, setToma] = useState(mem.toma ?? 0);
  const [formato, setFormato] = useState(mem.formato || '16:9');
  const [foto, setFoto] = useState(mem.foto || false);
  const [autos, setAutos] = useState(true);
  const [notasOn, setNotasOn] = useState(true);
  const [cola, setCola] = useState(mem.cola || []);
  const [marco, setMarco] = useState({ w: 0, h: 0 });
  const slotRef = useRef(null);

  const estilo = foto ? 'foto' : noche ? 'noche' : 'maqueta';

  useEffect(() => {
    const c = asegurarCiudad(); notas(true);
    (async () => {
      let t = mem.tomas;
      if (!t) {
        const [A, B] = c.complejos, prev = c.vistaActual, imgs = [];
        for (const k of TOMAS) { await c.camara(k.cam(A, B), 0); imgs.push(c.foto(0.7)); }
        c.aplicarHora(0); await c.camara(TOMAS[0].cam(), 0); const maqueta = c.foto(0.7); c.aplicarHora(hora);
        await c.camara(prev, 0);
        t = mem.tomas = { imgs, maqueta, noche: imgs[0] };
      }
      setTomas(t); elegirToma(mem.toma ?? 0, 600);
    })();
  }, []);
  useEffect(() => { const f = () => { const s = slotRef.current?.querySelector('.slot') || document.querySelector('[data-slot="render"]'); if (!s) return; const [a, b] = formato.split(':').map(Number); const k = Math.min(s.clientWidth * 0.92 / a, s.clientHeight * 0.82 / b); setMarco({ w: a * k, h: b * k }); }; f(); addEventListener('resize', f); return () => removeEventListener('resize', f); }, [formato]);

  const elegirToma = (i, ms = 800) => {
    const c = asegurarCiudad(); const [A, B] = c.complejos;
    setToma(i); mem.toma = i; return c.camara(TOMAS[i].cam(A, B), ms);
  };
  const elegirEstilo = (e) => { const f = e === 'foto'; setFoto(f); mem.foto = f; if (!f) irA(e === 'noche' ? 1 : 0); };
  const renderizar = () => {
    const c = asegurarCiudad();
    const job = { id: Date.now(), n: TOMAS[toma].n, f: formato, estilo: ESTILOS.find((x) => x[0] === estilo)[1], img: foto ? FOTO_IA : c.foto(0.6), pct: 0, listo: false };
    let lista = [job, ...cola]; setCola(lista); mem.cola = lista;
    const iv = setInterval(() => {
      job.pct = Math.min(100, job.pct + 9 + Math.round(Math.random() * 12));
      if (job.pct >= 100) { job.listo = true; clearInterval(iv); avisar(`Render 4K listo: ${job.n}`); }
      lista = lista.map((x) => (x.id === job.id ? { ...job } : x)); mem.cola = lista; setCola(lista);
    }, 380);
  };
  const miniatura = (e) => (e === 'maqueta' ? tomas?.maqueta : e === 'noche' ? tomas?.noche : FOTO_IA);

  return (
    <section className="pantalla on" data-p="render" aria-label="Render" ref={slotRef}>
      <Top ruta={<Proyecto hoja="Render" />} modo="render" />
      <div className="tomas" role="listbox" aria-label="Tomas">
        {tomas && TOMAS.map((t, i) => <button key={t.id} className={'toma' + (toma === i ? ' on' : '')} role="option" aria-selected={toma === i} onClick={() => elegirToma(i)}><span className="img" style={{ backgroundImage: `url(${tomas.imgs[i]})` }}><small>{String(i + 1).padStart(2, '0')}</small></span>{t.n}</button>)}
        {tomas && <button className="toma nueva" onClick={() => avisar('Toma guardada desde la vista actual')}><span className="img">+</span>guardar vista actual</button>}
      </div>
      <Slot nombre="render">
        <div className={'foto-ia sobre' + (foto ? ' on' : '')} style={{ backgroundImage: `url(${FOTO_IA})` }}><span className="chip cel sello" style={{ background: 'rgba(var(--vidrio-rgb),.8)' }}>fotorrealista · IA</span></div>
        <div className="marco sobre"><div style={{ width: marco.w, height: marco.h }}><span>{formato} · {PX[formato]}</span></div></div>
      </Slot>
      <div className="ctrl">
        <div><h2 className="cursiva">{TOMAS[toma].n}/.</h2><span className="tag">cámara {TOMAS[toma].info}</span></div>
        <div className="estilos" role="radiogroup" aria-label="Estilo">
          {ESTILOS.map(([id, n, d]) => <button key={id} className={'estilo' + (estilo === id ? ' on' : '')} role="radio" aria-checked={estilo === id} onClick={() => elegirEstilo(id)}><i style={{ backgroundImage: miniatura(id) ? `url(${miniatura(id)})` : undefined }}></i><div><b>{n}</b>{d}</div></button>)}
        </div>
        <div className="campo"><span className="lbl">formato/.</span>
          <div className="formatos" role="group" aria-label="Formato">
            {[['16:9', 16, 9], ['4:5', 10, 12], ['9:16', 8, 14], ['1:1', 11, 11]].map(([f, w, h]) => <button key={f} className={formato === f ? 'on' : ''} onClick={() => { setFormato(f); mem.formato = f; }}><i style={{ width: w, height: h }}></i>{f}</button>)}
          </div>
        </div>
        <Hora style={{ maxWidth: 'none' }} />
        <div className="toggles">
          <ConmAcero texto="estructura a la vista" className="conm" />
          <Conm texto="autos en el viaducto" on={autos} onChange={setAutos} />
          <Conm texto="anotaciones tipo plano" on={notasOn} onChange={(s) => { setNotasOn(s); notas(s); }} />
        </div>
        <button className="boton coral" style={{ justifyContent: 'space-between' }} onClick={renderizar}>Generar render 4K <span className="flecha-punteada"></span></button>
        <div className="cola"><span className="seccion-tag">cola de render/.</span>
          <div>{cola.length ? cola.map((c) => <div className="trabajo" key={c.id}><i style={{ backgroundImage: `url(${c.img})` }}></i><div>{c.n}<small>{c.f} · {c.estilo}</small></div><span className={'chip ' + (c.listo ? 'ok' : 'amar')}>{c.listo ? 'listo' : c.pct + '%'}</span></div>) : <span className="aviso" style={{ margin: 0 }}>Nada en cola. Elige una toma y genera.</span>}</div>
        </div>
      </div>
    </section>
  );
}
