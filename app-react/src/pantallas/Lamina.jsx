import { useEffect, useState } from 'react';
import Top, { Proyecto } from '../Top.jsx';
import { useApp } from '../store.jsx';
import { semanas } from '../datos.js';
import logo from '../../../images/logo-web.png';

export default function Lamina() {
  const { asegurarCiudad, notas, acero, hora, actual, fmt, avisar, mem } = useApp();
  const [dia, setDia] = useState(mem.hojaDia || false);
  const [foto, setFoto] = useState(mem.hojaFoto || '');
  const enlace = 'acerostudio.com/v/corredor-acero-a';

  useEffect(() => {
    const c = asegurarCiudad(); const [A] = c.complejos;
    (async () => {
      const prev = c.vistaActual;
      c.aplicarHora(dia ? 0 : 1); c.mostrarAcero(true); c.anotar([]);
      await c.camara({ az: 28, el: 30, vista: 100, centro: [A.pos[0] + 8, 16, A.pos[2] - 4] }, 0);
      const f = c.foto(0.85); setFoto(f); mem.hojaFoto = f;
      c.aplicarHora(hora); c.mostrarAcero(acero); notas(true); await c.camara(prev, 0);
    })();
  }, [dia]);

  const copiar = async () => {
    try { await navigator.clipboard.writeText('https://' + enlace); avisar('Enlace copiado'); }
    catch { avisar('Selecciona y copia el enlace'); }
  };
  const c = actual;
  return (
    <section className="pantalla on" data-p="lamina" aria-label="Lámina de venta">
      <Top ruta={<Proyecto hoja="Lámina de venta" />} modo="lamina"><button className="boton coral chico" onClick={() => avisar('Lámina enviada a Constructora Andina')}>Enviar al cliente</button></Top>
      <div className="mesa">
        <article className={'hoja' + (dia ? ' dia' : '')}>
          <div className="foto" style={{ backgroundImage: foto ? `url(${foto})` : undefined }}><dl className="meta"><dt>hora</dt><dd>{dia ? '12:00' : '19:30'} hr</dd><dt>sistema</dt><dd>acero estructural</dd></dl></div>
          <div className="txt">
            <span className="eyebrow">corredor de acero · complejo A/.</span>
            <h2>Puente<br />habitable</h2>
            <p>Vivienda y comercio sobre el viaducto de la Av. 26. Una cercha Warren de acero cruza la vía y deja la planta libre: luz en los cuatro lados y montaje en <span>{c ? semanas(c) : 18}</span> semanas.</p>
            <div className="hk">
              <div><b className="c">{c ? fmt(c.ton) : '219'}</b>toneladas de acero</div>
              <div><b>{c ? fmt(c.area) : '3.098'}</b>m² construidos</div>
              <div><b>{c ? fmt(c.pisos) : '14'}</b>pisos</div>
              <div><b>–35%</b>peso frente a concreto</div>
            </div>
            <div className="cta"><span>Agenda una visita al modelo 3D</span><span>→</span></div>
            <div className="pie"><img src={logo} alt="ACERO" /><span>acerostudio.com</span></div>
          </div>
        </article>
      </div>
      <div className="ctrl">
        <div><h2 className="cursiva">lámina/.</h2><span className="tag">plantilla y envío</span></div>
        <div className="estilos" role="radiogroup" aria-label="Plantilla">
          <button className={'estilo' + (!dia ? ' on' : '')} role="radio" aria-checked={!dia} onClick={() => { setDia(false); mem.hojaDia = false; }}><i style={{ background: '#2b3040' }}></i><div><b>Venta · noche</b>A3 horizontal, ciudad iluminada</div></button>
          <button className={'estilo' + (dia ? ' on' : '')} role="radio" aria-checked={dia} onClick={() => { setDia(true); mem.hojaDia = true; }}><i style={{ background: '#f4f5f8', border: '1px solid #ccd' }}></i><div><b>Venta · maqueta</b>A3 horizontal, fondo claro</div></button>
        </div>
        <div className="campo"><span className="lbl">también como/.</span>
          <div className="formatos">{['Post 4:5', 'Historia 9:16', 'Ficha técnica PDF', 'Reel 15 s'].map((f) => <button key={f} onClick={() => avisar(`${f}: se genera desde la misma escena`)}>{f}</button>)}</div>
        </div>
        <div className="envio"><span className="seccion-tag">enlace para el cliente/.</span>
          <div className="link-copia"><span>{enlace}</span><button className="boton linea chico" type="button" onClick={copiar}>Copiar</button></div>
          <span className="aviso" style={{ margin: 0 }}>Abre el visor 3D con la lámina y la ficha de acero, sin instalar nada.</span>
        </div>
        <div className="vistas"><span className="seccion-tag">lo que vio el cliente/.</span>
          <div>Constructora Andina<span>3 visitas · hoy</span></div>
          <div>Tiempo en la ficha de acero<span>4 min 12 s</span></div>
          <div>Pidió el render de noche<span>sí</span></div>
        </div>
      </div>
    </section>
  );
}
