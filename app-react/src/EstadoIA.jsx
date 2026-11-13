/* Aviso del estado de la IA sobre la foto: preparando, lista (con la pista de qué tocar) o no disponible. */
export default function EstadoIA({ det, buscando, pista }) {
  let txt, cls = '';
  if (det.estado === 'cargando') { txt = det.progreso < 1 ? `Bajando la IA ${Math.round(det.progreso * 100)} %` : 'Analizando la foto…'; cls = 'va'; }
  else if (buscando) { txt = 'Buscando el vano…'; cls = 'va'; }
  else if (det.estado === 'error' && det.error === 'cierre') return <div className="estado-ia mal" role="status"><i></i>La IA se cerró la última vez: usa las esquinas <button type="button" onClick={det.reintentar}>Reintentar</button></div>;
  else if (det.estado === 'error') { txt = 'IA no disponible: usa las esquinas'; cls = 'mal'; }
  else txt = pista;
  return <div className={'estado-ia ' + cls} role="status" aria-live="polite"><i></i>{txt}</div>;
}
