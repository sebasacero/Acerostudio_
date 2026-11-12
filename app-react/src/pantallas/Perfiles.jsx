import Top from '../Top.jsx';
import { useApp } from '../store.jsx';
import { CATALOGO, ETIQ, SECC } from '../datos.js';

export default function Perfiles() {
  const { fmt, PERFILES, listo, ciudad } = useApp();
  const enUso = (t) => { if (!listo) return 'en uso'; const kg = ciudad.current.complejos.reduce((s, c) => s + (c.metros?.[t] || 0) * PERFILES[t].kgm, 0); return `${fmt(kg / 1000, 1)} t en Corredor`; };
  return (
    <section className="pantalla on" data-p="perfiles" aria-label="Biblioteca de perfiles">
      <Top ruta={<><b>Biblioteca de perfiles</b> · catálogo de acero</>} />
      <div className="scroll"><div className="perfiles-pag">
        <div><span className="tag">perfiles en uso/.</span><h1 className="titulo-disp" style={{ fontSize: 'clamp(40px,4.6vw,64px)', marginTop: 8 }}>El acero de tus proyectos</h1></div>
        <div className="cat">
          {Object.entries(PERFILES).map(([t, p]) => <div className="perfil panel" key={t}><svg viewBox="0 0 100 92" dangerouslySetInnerHTML={{ __html: SECC[t] }} /><b>{p.nombre}</b><span>{ETIQ[t]}</span><div className="k"><span>{fmt(p.kgm, 1)} kg/m</span><span>{enUso(t)}</span></div></div>)}
        </div>
        <div><div className="cabecera"><h2 className="cursiva">catálogo/.</h2><span className="tag der">kg/m de catálogo europeo</span></div>
          <div className="tabla-wrap panel" style={{ padding: '4px 18px' }}><table>
            <thead><tr><th>Perfil</th><th>Familia</th><th>Uso típico</th><th className="n">altura mm</th><th className="n">kg/m</th></tr></thead>
            <tbody>{CATALOGO.map(([n, f, u, h, k]) => <tr key={n}><td><b style={{ fontWeight: 500 }}>{n}</b></td><td>{f}</td><td style={{ color: 'var(--suave)' }}>{u}</td><td className="n">{h}</td><td className="n">{fmt(k, 1)}</td></tr>)}</tbody>
          </table></div>
        </div>
      </div></div>
    </section>
  );
}
