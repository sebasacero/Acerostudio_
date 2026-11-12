// Estimación rápida de kg, precio y horas de taller por producto (sin 3D; sirve para simulaciones masivas y como respaldo).
/* Estimación rápida sin 3D (para simulaciones masivas): kg y precio por m² según producto. */
export const ESTIMA = { porton: { kgm2: 42, pesoFijo: 95, cop_kg: 38000, horas_kg: 0.09 }, puerta: { kgm2: 34, pesoFijo: 12, cop_kg: 36000, horas_kg: 0.1 }, ventana: { kgm2: 22, pesoFijo: 6, cop_kg: 34000, horas_kg: 0.11 }, reja: { kgm2: 26, pesoFijo: 4, cop_kg: 32000, horas_kg: 0.08 }, baranda: { kgm2: 30, pesoFijo: 8, cop_kg: 35000, horas_kg: 0.1 }, estructura: { kgm2: 60, pesoFijo: 120, cop_kg: 30000, horas_kg: 0.06 } };
export function estimar(cfg) {
  const e = ESTIMA[cfg.producto] || ESTIMA.puerta, kg = e.pesoFijo + e.kgm2 * cfg.ancho * cfg.alto;
  return { kg, venta: kg * e.cop_kg, horas: kg * e.horas_kg };
}
