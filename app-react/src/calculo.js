// Ficha técnica y costos del producto sin pantalla: un simulador "ciego" (canvas de 2 px) que solo se usa para calcular.
// Si el equipo no deja crear WebGL, el simulador sigue calculando (sin3D) y la ficha sale igual.
import { crearSimulador } from '../../ornamentacion/js/porton.js';

let sim = null;
function asegurar() {
  if (sim) return sim;
  // lienzo sin WebGL a propósito: el simulador cae a su modo "sin3D" (solo cálculo) y no abre un segundo contexto de GPU
  const c = document.createElement('canvas'); c.width = 2; c.height = 2; c.getContext = () => null;
  sim = crearSimulador(c, { cfg: { paisaje: false } });
  return sim;
}
const MAPA_DISENO = { celosia: 'celosia', lanzas: 'lanzas', listones: 'listones', lamina: 'lamina', tablero: 'tablero' };

/* Devuelve { ficha, cuentas } para la configuración de la visita. */
export function calcular(cfg, prov = 'mundial') {
  const s = asegurar();
  s.set({ producto: cfg.producto, tipo: cfg.tipo || 'corredizo', diseno: MAPA_DISENO[cfg.diseno] || 'celosia', ancho: cfg.ancho, alto: cfg.alto, acabado: 'grafito' });
  try { return { ficha: s.ficha, cuentas: s.cuentas(prov) }; }
  catch (e) { console.warn('cálculo', e); return { ficha: s.ficha, cuentas: null }; }
}

export { ESTIMA, estimar } from './estima.js';
