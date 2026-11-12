import { useMemo, useState } from 'react';
import Top from '../Top.jsx';
import { useApp, fmt, cop } from '../visita.jsx';
import { CAPACIDAD_BASE, MIX_BASE, generarClientes, simularCola, pruebaDeCarga } from '../pedidos.js';
import { estimar } from '../calculo.js';

// Simulador de compras (antes de que existan los pedidos reales) y cola de producción: qué pasa si llegan N clientes
// por mes con la capacidad actual del taller, y dónde se rompe (primer pedido que sale tarde, backlog, tiempo de cálculo).
export default function Pedidos() {
  const { visitas } = useApp();
  const [clientesMes, setClientesMes] = useState(120);
  const [conversion, setConversion] = useState(0.45);
  const [puestos, setPuestos] = useState(CAPACIDAD_BASE.puestos);
  const [horasDia, setHorasDia] = useState(CAPACIDAD_BASE.horasDia);
  const [plazo, setPlazo] = useState(CAPACIDAD_BASE.plazoPrometido);
  const [mixPorton, setMixPorton] = useState(MIX_BASE.porton);
  const [carga, setCarga] = useState(null);
  const [corriendo, setCorriendo] = useState(false);
  const [verTodos, setVerTodos] = useState(false);

  const cap = { ...CAPACIDAD_BASE, puestos, horasDia, plazoPrometido: plazo };
  const mix = useMemo(() => { const resto = 1 - mixPorton; return { porton: mixPorton, puerta: resto * 0.4, ventana: resto * 0.27, reja: resto * 0.2, baranda: resto * 0.13 }; }, [mixPorton]);
  // pedidos reales (visitas con propuesta) + simulados
  const reales = useMemo(() => visitas.filter((v) => v.propuesta).map((v, i) => { const e = estimar(v.producto); return { id: v.propuesta.numero, cliente: v.cliente, dia: 0, producto: v.producto.producto, cfg: v.producto, kg: e.kg, horas: e.horas, venta: v.propuesta.total, compra: v.estado === 'pedido', real: true }; }), [visitas]);
  const sim = useMemo(() => { const cl = [...reales, ...generarClientes(clientesMes, { dias: 26, mix, conversion })]; return simularCola(cl, cap); }, [reales, clientesMes, mix, conversion, puestos, horasDia, plazo]);
  const { resumen, porDia, pedidos } = sim;
  const maxH = Math.max(1, ...porDia.map((d) => d.horas), resumen.horasDia);

  const correrCarga = () => {
    setCorriendo(true);
    setTimeout(() => { const t0 = performance.now(); const filas = pruebaDeCarga([100, 500, 1000, 5000, 20000, 100000], { capacidad: cap, mix, conversion }); setCarga({ filas, total: performance.now() - t0 }); setCorriendo(false); }, 30);
  };
  const lista = verTodos ? pedidos : pedidos.slice(0, 40);

  return (
    <section className="pantalla on" data-p="pedidos" aria-label="Pedidos">
      <Top ruta={<><b>Pedidos</b> · simulador de compras y cola del taller</>} />
      <div className="scroll"><div className="contenido">
        <div className="kpis-ped">
          <div className="kpi coral"><b>{resumen.pedidos}<small>pedidos</small></b><span>de {resumen.clientes} clientes al mes ({reales.length} reales)</span></div>
          <div className="kpi"><b>{cop(resumen.venta).replace('$ ', '')}<small>COP</small></b><span>venta estimada del mes</span></div>
          <div className="kpi"><b>{resumen.tarde}<small>tarde</small></b><span>{resumen.pedidos ? Math.round(resumen.tarde / resumen.pedidos * 100) : 0} % fuera del plazo de {plazo} días</span></div>
          <div className="kpi"><b>{resumen.diasParaTerminar}<small>días</small></b><span>para despachar todo · ocupación {Math.round(resumen.ocupacion * 100)} %</span></div>
        </div>
        <div className="dos">
          <div className="panel relleno">
            <div className="cabecera" style={{ marginBottom: 0 }}><h2 className="cursiva">horas de taller por día de llegada/.</h2><span className="tag der">capacidad {fmt(resumen.horasDia)} h/día</span></div>
            <div className="grafica">{porDia.slice(0, 60).map((d) => <i key={d.dia} className={d.horas > resumen.horasDia ? 'alerta' : ''} style={{ height: (d.horas / maxH * 100) + '%' }} title={`día ${d.dia + 1}: ${d.pedidos} pedidos · ${fmt(d.horas)} h`}></i>)}</div>
            <div className="eje-g"><span>día 1</span><span>día {Math.min(60, porDia.length)}</span></div>
            <div className="cabecera" style={{ marginBottom: 0 }}><h2 className="cursiva">backlog (horas pendientes)/.</h2></div>
            <div className="grafica" style={{ height: 70 }}>{porDia.slice(0, 60).map((d) => <i key={d.dia} className="cap" style={{ height: (d.backlog / Math.max(1, ...porDia.map((x) => x.backlog)) * 100) + '%' }}></i>)}</div>
            {resumen.puntoDeQuiebre ? <p className="aviso" style={{ margin: 0, color: 'var(--coral)' }}>Se rompe el plazo en el pedido #{resumen.puntoDeQuiebre.posicion} ({resumen.puntoDeQuiebre.pedido}, llegado el día {resumen.puntoDeQuiebre.dia + 1}); retraso máximo {resumen.retrasoMax} días; espera media {fmt(resumen.esperaMedia, 1)} días.</p>
              : <p className="aviso" style={{ margin: 0, color: 'var(--ok)' }}>Con esta capacidad todos los pedidos salen dentro del plazo.</p>}
          </div>
          <div className="panel relleno">
            <div className="cabecera" style={{ marginBottom: 0 }}><h2 className="cursiva">qué pasaría si/.</h2></div>
            <div className="deslizador"><label>clientes al mes/. <output>{clientesMes}</output></label><input type="range" min="10" max="1000" step="10" value={clientesMes} onChange={(e) => setClientesMes(+e.target.value)} /></div>
            <div className="deslizador"><label>conversión a pedido/. <output>{Math.round(conversion * 100)} %</output></label><input type="range" min="0.05" max="1" step="0.05" value={conversion} onChange={(e) => setConversion(+e.target.value)} /></div>
            <div className="deslizador"><label>portones en el mix/. <output>{Math.round(mixPorton * 100)} %</output></label><input type="range" min="0" max="1" step="0.05" value={mixPorton} onChange={(e) => setMixPorton(+e.target.value)} /></div>
            <div className="deslizador"><label>puestos de la celda/. <output>{puestos}</output></label><input type="range" min="1" max="24" value={puestos} onChange={(e) => setPuestos(+e.target.value)} /></div>
            <div className="deslizador"><label>horas por día/. <output>{horasDia}</output></label><input type="range" min="4" max="16" value={horasDia} onChange={(e) => setHorasDia(+e.target.value)} /></div>
            <div className="deslizador"><label>plazo prometido (días)/. <output>{plazo}</output></label><input type="range" min="3" max="45" value={plazo} onChange={(e) => setPlazo(+e.target.value)} /></div>
            <p className="nota-tec">Modelo: horas de taller por pedido según kg (0,06 a 0,11 h/kg según producto), celda en paralelo con {Math.round(CAPACIDAD_BASE.eficiencia * 100)} % de eficiencia, cola por orden de llegada. Ajusta estos supuestos con los tiempos reales del taller (ManH los puede aprender).</p>
          </div>
        </div>
        <div className="panel relleno">
          <div className="cabecera" style={{ marginBottom: 0 }}><h2 className="cursiva">prueba de carga/.</h2><span className="tag der">100 a 100.000 clientes</span><button className="boton coral chico" onClick={correrCarga} disabled={corriendo}>{corriendo ? 'Corriendo…' : 'Correr prueba'}</button></div>
          {carga && <div className="tabla-wrap"><table className="tabla-ped"><thead><tr><th>clientes</th><th className="n">pedidos</th><th className="n">generar</th><th className="n">simular</th><th className="n">tarde</th><th className="n">días</th><th>se rompe en</th></tr></thead>
            <tbody>{carga.filas.map((f) => <tr key={f.n}><td>{fmt(f.n)}</td><td className="n">{fmt(f.pedidos)}</td><td className="n">{f.msGenerar} ms</td><td className="n">{f.msSimular} ms</td><td className="n" style={{ color: f.porcTarde > 0 ? 'var(--coral)' : 'inherit' }}>{f.porcTarde} %</td><td className="n">{f.diasParaTerminar}</td><td>{f.quiebre ? `pedido #${f.quiebre.posicion}, día ${f.quiebre.dia + 1}` : 'no se rompe'}</td></tr>)}</tbody></table>
            <p className="aviso">Total {fmt(carga.total)} ms en este dispositivo. El cálculo escala lineal; lo que se rompe primero es el taller (plazo), no el código. La lista de abajo se corta a 40 filas para que la pantalla siga fluida.</p></div>}
        </div>
        <div className="panel relleno">
          <div className="cabecera" style={{ marginBottom: 0 }}><h2 className="cursiva">cola de pedidos/.</h2><span className="tag der">{pedidos.length} en cola</span>{pedidos.length > 40 && <button className="boton linea chico" onClick={() => setVerTodos(!verTodos)}>{verTodos ? 'Ver 40' : 'Ver todos'}</button>}</div>
          <div className="tabla-wrap"><table className="tabla-ped"><thead><tr><th>pedido</th><th>producto</th><th className="n">kg</th><th className="n">venta</th><th className="n">llega</th><th className="n">entrega</th><th className="n">plazo</th></tr></thead>
            <tbody>{lista.map((p) => <tr key={p.id}><td><i className={'estado-ped' + (p.retraso ? ' tarde' : p.real ? ' listo' : '')}></i>{p.id}{p.real && <span className="chip ok" style={{ marginLeft: 8 }}>real</span>}</td><td>{p.producto} {p.cfg.ancho}×{p.cfg.alto}</td><td className="n">{fmt(p.kg)}</td><td className="n">{cop(p.venta)}</td><td className="n">día {p.dia + 1}</td><td className="n">día {p.entrega}</td><td className="n" style={{ color: p.retraso ? 'var(--coral)' : 'inherit' }}>{p.retraso ? `+${p.retraso} d` : 'a tiempo'}</td></tr>)}</tbody></table></div>
        </div>
      </div></div>
    </section>
  );
}
