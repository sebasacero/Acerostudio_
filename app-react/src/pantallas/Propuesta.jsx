import { useEffect, useMemo, useState } from 'react';
import Top from '../Top.jsx';
import { useApp, fmt, cop, m } from '../visita.jsx';
import { calcular, estimar } from '../calculo.js';
import { PRODUCTOS } from '../producto.jsx';
import logo from '../../../images/logo-web.png';

// Documento formal de propuesta: datos del cliente, fotos (espacio y render), medidas, especificación, precio, plazo y condiciones.
// Se imprime a PDF desde el navegador (Compartir → Imprimir en iPhone) y se envía el enlace/PDF por WhatsApp.
const NOMBRES = { porton: 'Portón', puerta: 'Puerta', ventana: 'Ventana', reja: 'Reja', baranda: 'Baranda', estructura: 'Estructura' };
const DIS = { celosia: 'celosía de corte láser', lanzas: 'lanzas', listones: 'listones', lamina: 'rombos en lámina', tablero: 'tablero estampado' };

export default function Propuesta() {
  const { actual, actualizar, avisar } = useApp();
  const cfg = actual?.producto;
  const [calc, setCalc] = useState(null);
  const [plazo, setPlazo] = useState(actual?.propuesta?.plazo || 15);
  const [anticipo, setAnticipo] = useState(50);
  useEffect(() => { if (!cfg) return; try { setCalc(calcular(cfg)); } catch (e) { console.warn(e); setCalc(null); } }, [cfg?.producto, cfg?.tipo, cfg?.diseno, cfg?.ancho, cfg?.alto]);
  const est = cfg ? estimar(cfg) : null;
  const total = calc?.cuentas?.venta || est?.venta || 0;
  const kg = calc?.ficha?.kg || est?.kg || 0;
  const numero = actual?.propuesta?.numero || `AS-${new Date().getFullYear()}-${String((actual?.id || '').slice(-4)).toUpperCase()}`;
  const fecha = new Date(actual?.propuesta?.fecha || Date.now()).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  const grupos = calc?.cuentas?.grupos ? Object.entries(calc.cuentas.grupos) : [];
  const guardar = (estado) => { actualizar({ propuesta: { numero, fecha: new Date().toISOString(), total, plazo, anticipo, kg }, estado }); avisar(estado === 'pedido' ? 'Pedido confirmado: entra a la cola del taller' : 'Propuesta guardada'); };
  const whatsapp = () => {
    const tel = (actual.telefono || '').replace(/\D/g, '');
    const txt = `Hola ${actual.cliente}, te envío la propuesta ${numero} de AceroStudio: ${NOMBRES[cfg.producto]} en acero de ${m(cfg.ancho)} × ${m(cfg.alto)} por ${cop(total)} (instalado), entrega en ${plazo} días hábiles. Con 50 años de experiencia en acero. ¿Lo confirmamos?`;
    open(`https://wa.me/${tel}?text=${encodeURIComponent(txt)}`, '_blank');
  };
  if (!actual || !cfg) return <section className="pantalla on" data-p="propuesta"><Top paso="propuesta" /><div className="mesa"><div className="vacio"><b>Sin visita</b><a className="boton linea chico" href="#inicio">Crear una visita</a></div></div><div className="ctrl"></div></section>;
  return (
    <section className="pantalla on" data-p="propuesta" aria-label="Propuesta">
      <Top paso="propuesta"><button className="boton coral chico" onClick={() => print()}>Imprimir / PDF</button></Top>
      <div className="mesa">
        <article className="doc" id="documento">
          <div className="enc"><div><img src={logo} alt="ACERO" /><div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.12em', marginTop: 6, color: '#555' }}>ACEROSTUDIO · BOGOTÁ · 50 AÑOS EN ACERO</div></div>
            <div style={{ textAlign: 'right', fontSize: 12 }}><b>Propuesta {numero}</b><br />{fecha}<br />Válida 15 días</div></div>
          <div><h2>Cliente</h2><div className="grid3"><div><b>{actual.cliente}</b><br />{actual.direccion || 'Dirección por confirmar'}</div><div>{actual.telefono && <>WhatsApp {actual.telefono}</>}</div><div>Visita técnica: {new Date(actual.creada).toLocaleDateString('es-CO')}</div></div></div>
          <div><h1>{NOMBRES[cfg.producto]} en acero<br />{m(cfg.ancho)} × {m(cfg.alto)}</h1></div>
          <div className="fotos">
            <div style={{ backgroundImage: actual.foto ? `url(${actual.foto})` : undefined }}>{!actual.foto && 'foto del espacio'}<small>espacio actual</small></div>
            <div style={{ backgroundImage: actual.renderFoto ? `url(${actual.renderFoto})` : undefined }}>{!actual.renderFoto && 'render (guárdalo en Video)'}<small>propuesta en acero</small></div>
          </div>
          <div><h2>Medidas del vano</h2><div className="grid3"><div className="dato"><b>{m(cfg.ancho)}</b><span>ancho</span></div><div className="dato"><b>{m(cfg.alto)}</b><span>alto</span></div><div className="dato"><b>{actual.medidas?.fuente === 'webxr' ? 'sensor' : actual.medidas?.fuente || 'estimado'}</b><span>{actual.medidas?.precision || 'se confirma en obra'}</span></div></div></div>
          <div><h2>Especificación</h2>
            <table><tbody>
              <tr><td>Producto</td><td>{NOMBRES[cfg.producto]}{cfg.producto === 'porton' ? ` ${cfg.tipo} eléctrico` : ''}</td></tr>
              {cfg.producto !== 'ventana' && <tr><td>Relleno</td><td>{DIS[cfg.diseno] || cfg.diseno}</td></tr>}
              <tr><td>Estructura</td><td>Perfiles tubulares de acero estructural, soldadura MIG, pintura electrostática ({cfg.acabado})</td></tr>
              {calc?.ficha?.motor && cfg.producto === 'porton' && <tr><td>Automatismo</td><td>{calc.ficha.motor.modelo} · {calc.ficha.motor.dato} · fotoceldas y lámpara</td></tr>}
              <tr><td>Peso de acero</td><td>{fmt(kg)} kg</td></tr>
              <tr><td>Instalación</td><td>Incluida: anclaje en obra, nivelación y puesta en marcha</td></tr>
            </tbody></table></div>
          <div><h2>Valor</h2>
            <table><thead><tr><th>Concepto</th><th className="n">COP</th></tr></thead><tbody>
              {grupos.length ? grupos.map(([g, v]) => <tr key={g}><td>{g}</td><td className="n">{cop(v / (1 - (calc.cuentas.margen || 0.3)))}</td></tr>) : <tr><td>Fabricación e instalación</td><td className="n">{cop(total)}</td></tr>}
              <tr><td><b>Total instalado (IVA incluido)</b></td><td className="n"><span className="total">{cop(total)}</span></td></tr>
            </tbody></table></div>
          <div><h2>Plazo y condiciones</h2><p>Entrega e instalación en <b>{plazo} días hábiles</b> desde el anticipo del {anticipo} %; saldo contra entrega. Garantía de 2 años en estructura y pintura, 1 año en motor y electrónica. Precio sujeto a confirmación de medidas en obra. Incluye visita técnica, transporte en Bogotá y retiro de escombro menor.</p></div>
          <div className="firmas"><div>AceroStudio · 50 años de experiencia en acero</div><div>Aceptación del cliente · {actual.cliente}</div></div>
          <div className="pie"><span>acerostudio.com · +57 315 212 5327</span><span>{numero}</span></div>
        </article>
      </div>
      <div className="ctrl">
        <h2 className="cursiva">Propuesta <small>{numero}</small></h2>
        <div className="medidas-grandes"><div className="kpi coral"><b style={{ fontSize: 24 }}>{cop(total)}</b><span>total instalado</span></div><div className="kpi"><b>{fmt(kg)}<small>kg</small></b><span>acero</span></div></div>
        <div className="deslizador"><label>plazo (días hábiles) <output>{plazo}</output></label><input type="range" min="5" max="45" value={plazo} onChange={(e) => setPlazo(+e.target.value)} /></div>
        <div className="deslizador"><label>anticipo <output>{anticipo} %</output></label><input type="range" min="0" max="100" step="10" value={anticipo} onChange={(e) => setAnticipo(+e.target.value)} /></div>
        <button className="boton coral" onClick={() => { guardar('propuesta'); }} style={{ justifyContent: 'space-between' }}>Guardar propuesta <span className="flecha-punteada"></span></button>
        <div className="tresb"><button onClick={() => print()}>PDF</button><button onClick={whatsapp}>Enviar por WhatsApp</button><button onClick={() => guardar('pedido')}>Cliente aceptó → pedido</button></div>
        <p className="nota-tec">{calc?.cuentas ? 'Precio calculado con la base de precios de referencia de Ornamentación (Homecenter, G&J, Mundial de Perfiles) y margen del 30 %.' : 'Precio estimado por kg (sin la base de precios: el visor 3D no arrancó en este equipo).'} Pendiente: cargar precios reales y margen del taller.</p>
      </div>
    </section>
  );
}
