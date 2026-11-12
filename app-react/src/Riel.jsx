const I = {
  inicio: <path d="M3 11 12 4l9 7v9h-6v-6H9v6H3z" />,
  camara: <><rect x="3" y="6" width="18" height="13" rx="2" /><circle cx="12" cy="12.5" r="3.5" /><path d="M8 6l1.5-2h5L16 6" /></>,
  medir: <path d="M3 17 17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2" />,
  encajar: <><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M4 9h16M12 9v12M8 6h.01" /></>,
  render: <><path d="M4 5h16v14H4z" /><path d="M9 9l6 3-6 3z" /></>,
  propuesta: <><path d="M6 3h9l4 4v14H6z" /><path d="M9 11h7M9 14h7M9 17h5" /></>,
  pedidos: <><path d="M3 6h18M3 12h12M3 18h8" /><circle cx="18" cy="17" r="3" /><path d="M18 15.5V17l1 1" /></>,
};
const ITEMS = [['inicio', 'Visitas'], ['camara', 'Cámara', 'crear'], ['medir', 'Medir'], ['encajar', 'Encajar'], ['render', 'Video'], ['propuesta', 'Propuesta', 'solo-escritorio'], ['pedidos', 'Pedidos']];

export default function Riel({ ruta }) {
  return (
    <nav className="riel" aria-label="Navegación principal">
      <a className="logo-mini" href="#inicio" aria-label="AceroStudio, inicio"></a>
      {ITEMS.map(([r, txt, extra]) => <a key={r} href={'#' + r} className={[extra, ruta === r ? 'on' : ''].filter(Boolean).join(' ')}><svg viewBox="0 0 24 24">{I[r]}</svg><span>{txt}</span></a>)}
      <div className="esp"></div>
      <a href="/ornamentacion/" className="solo-escritorio" title="Simulador completo de ornamentación"><svg viewBox="0 0 24 24"><path d="M4 20V8l8-5 8 5v12zM9 20v-7h6v7" /></svg><span>Taller</span></a>
      <div className="avatar" title="Tu cuenta">SA</div>
    </nav>
  );
}
