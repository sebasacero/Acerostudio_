const I = {
  inicio: <path d="M3 11 12 4l9 7v9h-6v-6H9v6H3z" />,
  editor: <path d="M12 3 21 8v8l-9 5-9-5V8z M12 13 21 8 M12 13 3 8 M12 13v8" />,
  nuevo: <path d="M12 5v14M5 12h14" />,
  acero: <path d="M5 4h14M5 20h14M12 4v16M8 4v2M16 4v2M8 18v2M16 18v2" />,
  render: <><rect x="3" y="6" width="18" height="13" rx="2" /><circle cx="12" cy="12.5" r="3.5" /><path d="M8 6l1.5-2h5L16 6" /></>,
  lamina: <><rect x="3" y="5" width="18" height="14" /><path d="M13 5v14M15.5 9h3M15.5 12h3" /></>,
  exportar: <path d="M12 3v12M7 10l5 5 5-5M4 19h16" />,
  fabrica: <path d="M3 20V10l6 3V10l6 3V6h6v14z M7 17h2M12 17h2M17 17h2" />,
  perfiles: <><path d="M4 5h16M4 19h16M12 5v14" /><path d="M15 9h4v6h-4z" /></>,
  sistema: <><circle cx="7" cy="7" r="3" /><circle cx="17" cy="7" r="3" /><rect x="4" y="14" width="6" height="6" /><path d="M17 14l3.5 6h-7z" /></>,
};
const ITEMS = [
  ['inicio', 'Inicio'], ['editor', 'Diseñar'], ['nuevo', 'Crear', 'crear'], ['acero', 'Acero'], ['render', 'Render'],
  ['lamina', 'Lámina', 'solo-escritorio'], ['exportar', 'Exportar', 'solo-escritorio'],
];

export default function Riel({ ruta }) {
  const enlace = ([r, txt, extra]) => <a key={r} href={'#' + r} className={[extra, ruta === r ? 'on' : ''].filter(Boolean).join(' ')}><svg viewBox="0 0 24 24">{I[r]}</svg><span>{txt}</span></a>;
  return (
    <nav className="riel" aria-label="Navegación principal">
      <a className="logo-mini" href="#inicio" aria-label="AceroStudio, inicio"></a>
      {ITEMS.map(enlace)}
      <a href="/fabrica/" className="solo-escritorio" title="Fábrica: despiece, CNC y montaje"><svg viewBox="0 0 24 24">{I.fabrica}</svg><span>Fábrica</span></a>
      <div className="esp"></div>
      {enlace(['perfiles', 'Perfiles', 'solo-escritorio'])}
      {enlace(['sistema', 'Sistema'])}
      <div className="avatar" title="Tu cuenta">SA</div>
    </nav>
  );
}
