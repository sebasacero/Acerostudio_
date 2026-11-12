import { useState } from 'react';
import Top from '../Top.jsx';
import { useApp } from '../store.jsx';
import { FORMATOS } from '../datos.js';

export default function Exportar() {
  const { avisar, mem } = useApp();
  const [estado, setEstado] = useState(mem.exportado || {}); // i -> 'prep' | 'listo'
  const preparar = (i) => {
    if (estado[i] === 'listo') { avisar('Este prototipo no descarga archivos; en el Studio real sí.'); return; }
    setEstado((e) => ({ ...e, [i]: 'prep' }));
    setTimeout(() => setEstado((e) => { const n = { ...e, [i]: 'listo' }; mem.exportado = n; return n; }), 1200);
  };
  return (
    <section className="pantalla on" data-p="exportar" aria-label="Exportar">
      <Top ruta={<><a href="#inicio">Proyectos</a> / <a href="#editor">Corredor de acero</a> / <b>Exportar</b></>} />
      <div className="scroll"><div className="exportar">
        <div><span className="tag">corredor de acero · propuesta 2/.</span><h1 className="titulo-disp" style={{ marginTop: 8 }}>Llévalo a tu software</h1></div>
        <div className="formatos-exp">
          {FORMATOS.map(([s, n, d, p, c], i) => <div className={'fx' + (estado[i] === 'listo' ? ' listo' : '')} key={s}><span className="ico" style={{ background: c }}>{s}</span><b>{n}</b><p>{d}</p><div className="pie"><span>{p}</span><button className="bajar" disabled={estado[i] === 'prep'} onClick={() => preparar(i)}>{estado[i] === 'prep' ? 'Preparando…' : estado[i] === 'listo' ? 'Listo ✓' : 'Preparar'}</button></div></div>)}
        </div>
        <div className="siguiente">
          <a className="panel" href="/studio/?tipo=edificio"><span className="tag">editar/.</span><b>Abrir en Studio 3D</b><span>Ajusta perfiles, luces y pisos en el editor y saca el render comercial.</span><em>Abrir el Studio <span className="flecha-punteada"></span></em></a>
          <a className="panel" href="/fabrica/"><span className="tag">producir/.</span><b>Enviar a Fábrica</b><span>Despiece con conexiones, nesting, DSTV/NC1 para las máquinas y etiquetas QR de montaje.</span><em>Entrar a la planta <span className="flecha-punteada"></span></em></a>
        </div>
        <div className="paquete">
          <div><div className="cabecera"><h2 className="cursiva">paquete para obra/.</h2><span className="tag der">zip · 48 MB</span></div>
            <div className="arbol panel"><b>corredor-acero_p2/</b>{'\n'}├── <b>modelo</b>/corredor.ifc           IFC 4 · Revit, ArchiCAD{'\n'}├── <b>planos</b>/plantas_1-100.dxf      AutoCAD{'\n'}├── <b>planos</b>/cortes.pdf             A1 · 6 láminas{'\n'}├── <b>acero</b>/despiece.xlsx           perfiles, metros, kg{'\n'}├── <b>acero</b>/uniones.pdf             placa base, viga–columna{'\n'}├── <b>render</b>/aerea_noche_4k.png{'\n'}├── <b>render</b>/reel_15s.mp4{'\n'}└── <b>visor</b>/corredor.html           abre en cualquier navegador</div>
          </div>
          <div><div className="cabecera"><h2 className="cursiva">conectar por MCP/.</h2><span className="tag der">16 herramientas</span></div>
            <div className="mcp panel">
              <p>Tu asistente de IA puede crear y editar este proyecto directamente: pedir toneladas, cambiar pisos o exportar a Blender.</p>
              <code>npx acerostudio-mcp --proyecto corredor-acero</code>
              <div className="fila" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{['crear_estructura', 'predimensionar', 'exportar_ifc', 'render'].map((t) => <span className="chip" key={t}>{t}</span>)}</div>
            </div>
          </div>
        </div>
      </div></div>
    </section>
  );
}
