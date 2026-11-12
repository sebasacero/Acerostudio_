/* Aviso del estado de la IA sobre la foto: preparando, lista (con la pista de qué tocar) o no disponible. */
export default function EstadoIA({ det, buscando, pista }) {
  let txt, cls = '';
  if (buscando) { txt = 'Buscando el vano…'; cls = 'va'; }
  else if (det.estado === 'cargando') { txt = `Preparando la IA ${Math.round(det.progreso * 100)} %`; cls = 'va'; }
  else if (det.estado === 'error') { txt = 'IA no disponible: usa las esquinas'; cls = 'mal'; }
  else txt = pista;
  return <div className={'estado-ia ' + cls} role="status" aria-live="polite"><i></i>{txt}</div>;
}
