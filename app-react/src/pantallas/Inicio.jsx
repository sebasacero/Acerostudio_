import { useState } from 'react';
import Top from '../Top.jsx';
import { useApp, m, cop } from '../visita.jsx';
import { irA } from '../App.jsx';

const ESTADO = { visita: ['amar', 'en visita'], propuesta: ['coral', 'propuesta enviada'], pedido: ['ok', 'pedido'] };

export default function Inicio() {
  const { visitas, actual, actualId, setActualId, crear, actualizar, borrar } = useApp();
  const [cliente, setCliente] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const nueva = (e) => { e.preventDefault(); crear({ cliente: cliente || 'Cliente sin nombre', direccion, telefono }); irA('camara'); };
  return (
    <section className="pantalla on" data-p="inicio" aria-label="Visitas">
      <Top ruta={<><b>Visitas</b> · 50 años en acero</>} />
      <div className="scroll"><div className="contenido">
        <div><span className="tag">app de visitas</span><h1 className="titulo-disp" style={{ fontSize: 'clamp(38px,4.6vw,60px)', marginTop: 8 }}>Mide, encaja y <em style={{ fontStyle: 'normal', color: 'var(--coral)' }}>vende</em> en la obra</h1>
          <p style={{ color: 'var(--suave)', maxWidth: '62ch', marginTop: 8 }}>Una visita = fotos y video del espacio, medidas del vano, el producto encajado en la foto, un video de cómo funciona, la propuesta formal y el pedido en la cola de producción.</p></div>
        <div className="dos">
          <div>
            <div className="cabecera"><h2 className="cursiva">visitas</h2><span className="tag der">{visitas.length} guardadas</span></div>
            {visitas.length === 0 ? <div className="vacio"><b>Aún no hay visitas</b><span>Crea la primera con los datos del cliente y abre la cámara.</span></div>
              : <div className="lista-visitas">{visitas.map((v) => (
                <button key={v.id} className={'panel visita' + (v.id === actualId ? ' on' : '')} onClick={() => { setActualId(v.id); }}>
                  <div className="img" style={{ backgroundImage: v.foto ? `url(${v.foto})` : undefined }}>{!v.foto && 'sin foto'}</div>
                  <div><b>{v.cliente}</b><span>{v.direccion || 'sin dirección'} · {v.medidas ? `${m(v.medidas.ancho)} × ${m(v.medidas.alto)}` : 'sin medidas'} · {v.producto?.producto}{v.propuesta ? ` · ${cop(v.propuesta.total)}` : ''}</span></div>
                  <span className={'chip ' + ESTADO[v.estado][0]}>{ESTADO[v.estado][1]}</span>
                </button>))}</div>}
            {actual && <div className="panel relleno" style={{ marginTop: 14 }}>
              <div className="cabecera" style={{ marginBottom: 0 }}><h2 className="cursiva">{actual.cliente}</h2><span className="tag der">{new Date(actual.creada).toLocaleDateString('es-CO')}</span></div>
              <div className="opciones">
                <a className="boton coral chico" href="#camara">Cámara</a>
                <a className="boton linea chico" href="#medir">Medir</a>
                <a className="boton linea chico" href="#encajar">Encajar</a>
                <a className="boton linea chico" href="#render">Video</a>
                <a className="boton linea chico" href="#propuesta">Propuesta</a>
                <button className="boton linea chico" onClick={() => { if (confirm('¿Borrar esta visita?')) borrar(actual.id); }}>Borrar</button>
              </div>
            </div>}
          </div>
          <form className="panel relleno" onSubmit={nueva}>
            <div className="cabecera" style={{ marginBottom: 0 }}><h2 className="cursiva">nueva visita</h2></div>
            <div className="campo"><label htmlFor="cli">cliente/.</label><input id="cli" type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nombre o empresa" /></div>
            <div className="campo"><label htmlFor="dir">dirección/.</label><input id="dir" type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Calle, barrio, ciudad" /></div>
            <div className="campo"><label htmlFor="tel">whatsapp/.</label><input id="tel" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+57 …" /></div>
            <button className="boton coral" type="submit" style={{ justifyContent: 'space-between' }}>Abrir la cámara <span className="flecha-punteada"></span></button>
            <p className="nota-tec">Las visitas se guardan en este dispositivo. El video queda en memoria mientras la app esté abierta; descárgalo o compártelo desde la pantalla Video.</p>
          </form>
        </div>
        <div className="tres">
          {[['1 · cámara', 'Foto y video del espacio con la cámara trasera, enfoque continuo, linterna y zoom cuando el teléfono lo permite.'], ['2 · medir', 'Con LiDAR o realidad aumentada donde el equipo lo tenga; si no, midiendo sobre la foto con una referencia conocida.'], ['3 · encajar y vender', 'El producto se encaja en el vano, se graba un video de cómo funciona, sale la propuesta formal y el pedido entra a la cola.']].map(([t, d]) => <div className="panel relleno" key={t}><span className="seccion-tag">{t}</span><span style={{ fontSize: 13.5, color: 'var(--suave)', lineHeight: 1.5 }}>{d}</span></div>)}
        </div>
      </div></div>
    </section>
  );
}
