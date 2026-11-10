// Base técnica del oficio: cálculos que ManH usa mientras el Maestro no haya enseñado su propia regla.
// Todo lo de aquí es conocimiento general del oficio (AWS D1.1/D1.3, fichas de máquinas láser de fibra,
// práctica de taller) y va marcado como "base técnica, por confirmar con el Maestro".
// Lo que el Maestro diga siempre pesa más: ver agente.js.

export const ORIGEN = 'Base técnica general (por confirmar con el Maestro)';

// ---------------- corte láser ----------------
// Velocidad típica de corte (m/min) y tiempo de perforación (s) en acero al carbono para un láser de
// fibra de 3 kW. Hasta 2 mm con nitrógeno o aire; desde 3 mm con oxígeno. Valores aproximados:
// cada taller tiene los suyos y se ajustan con la primera cotización real.
export const LASER_ACERO = [
  { mm: 0.9, vel: 28, perf: 0.15 },
  { mm: 1.2, vel: 22, perf: 0.2 },
  { mm: 1.5, vel: 16, perf: 0.3 },
  { mm: 2, vel: 10, perf: 0.4 },
  { mm: 2.5, vel: 7, perf: 0.5 },
  { mm: 3, vel: 3.6, perf: 0.8 },
  { mm: 4, vel: 3.0, perf: 1.0 },
  { mm: 5, vel: 2.6, perf: 1.3 },
  { mm: 6, vel: 2.2, perf: 1.6 },
  { mm: 8, vel: 1.6, perf: 2.2 },
  { mm: 10, vel: 1.2, perf: 3.0 },
  { mm: 12, vel: 0.9, perf: 4.0 },
];
export const CALIBRES = { 20: 0.9, 18: 1.2, 16: 1.5, 14: 1.9, 12: 2.5, 11: 3.0 };
const DENSIDAD = 7850; // kg/m³

function interp(mm) {
  const t = LASER_ACERO;
  if (mm <= t[0].mm) return t[0];
  if (mm >= t.at(-1).mm) return t.at(-1);
  const i = t.findIndex(f => f.mm >= mm), a = t[i - 1], b = t[i], k = (mm - a.mm) / (b.mm - a.mm);
  return { mm, vel: a.vel + (b.vel - a.vel) * k, perf: a.perf + (b.perf - a.perf) * k };
}

/**
 * Cotización de corte láser por tiempo de máquina, como cobran los talleres de servicio.
 * tiempo = (metros de corte ÷ velocidad) + perforaciones × tiempo de perforación + 1,5 s de recorrido por perforación
 * precio = tiempo × tarifa por segundo + material (si lo pone el taller) + alistamiento; con mínimo por pedido.
 */
export function cotizarLaser({
  espesorMm = 1.5, metrosCorte = 1, perforaciones = 1, piezas = 1,
  tarifaSegundo = 75, alistamiento = 15000, minimo = 30000,
  material = false, areaPiezaM2 = 0, aprovechamiento = 0.8, precioKg = 7500, margen = 0.3,
} = {}) {
  const f = interp(espesorMm);
  const segCorte = (metrosCorte / f.vel) * 60;
  const segPerf = perforaciones * (f.perf + 1.5);
  const segPieza = segCorte + segPerf;
  const segTotal = segPieza * piezas;
  const costoMaquina = segTotal * tarifaSegundo;
  const kgPieza = areaPiezaM2 * (espesorMm / 1000) * DENSIDAD;
  const kgCompra = material ? (kgPieza * piezas) / aprovechamiento : 0;
  const costoMaterial = kgCompra * precioKg;
  const costo = Math.max(minimo, costoMaquina + alistamiento + costoMaterial);
  const venta = costo / (1 - margen);
  return {
    espesorMm, velocidad: +f.vel.toFixed(2), segPerforacion: +f.perf.toFixed(2),
    segPieza: +segPieza.toFixed(1), minutosTotal: +(segTotal / 60).toFixed(1),
    costoMaquina: Math.round(costoMaquina), costoMaterial: Math.round(costoMaterial), kgCompra: +kgCompra.toFixed(1),
    alistamiento, costo: Math.round(costo), venta: Math.round(venta), porPieza: Math.round(venta / piezas),
    aplicoMinimo: costoMaquina + alistamiento + costoMaterial < minimo,
    consejos: consejosLaser(espesorMm, perforaciones, piezas, metrosCorte),
    origen: ORIGEN,
  };
}

function consejosLaser(mm, perf, piezas, m) {
  const c = [];
  if (perf / Math.max(m, 0.01) > 6) c.push('Muchas perforaciones para tan poco corte: cada agujero cuesta como medio metro de corte. Unir figuras pequeñas o hacerlas ranuras baja el precio.');
  if (mm >= 3) c.push('Desde 3 mm se corta con oxígeno: el borde queda con una capa de óxido que hay que limpiar con disco flap antes de soldar o pintar.');
  else c.push('Hasta 2 mm se corta con nitrógeno o aire: el borde queda limpio y se puede soldar o pintar directo.');
  if (piezas < 5) c.push('En pedidos pequeños pesa el mínimo y el alistamiento: conviene juntar varias piezas en la misma lámina (nesting).');
  c.push('Mandar el archivo en DXF a escala 1:1, en milímetros, con líneas cerradas y sin textos sueltos ni líneas dobles.');
  c.push('Agujeros con diámetro igual o mayor al espesor; si es menor, el láser los deforma.');
  return c;
}

// ---------------- ángulos de corte ----------------
/**
 * Corte a inglete: dos piezas que se encuentran formando un ángulo interior A se cortan cada una a la mitad.
 * Para un marco de n lados iguales, el ángulo interior es 180·(n−2)/n.
 * Devuelve el ángulo que se pone en la sierra (desde la escuadra, 0° = corte recto).
 */
export function anguloCorte({ anguloEntre = 90, lados = 0, perfilMm = 40 } = {}) {
  const interior = lados >= 3 ? (180 * (lados - 2)) / lados : anguloEntre;
  const cadaPieza = interior / 2;            // ángulo de la pieza respecto a su eje
  const sierra = 90 - cadaPieza;             // lo que marca la escala de una tronzadora o sierra
  const sobrante = perfilMm / Math.tan((cadaPieza * Math.PI) / 180); // lo que se come el inglete en el borde largo
  return {
    interior: +interior.toFixed(2), cadaPieza: +cadaPieza.toFixed(2), sierra: +sierra.toFixed(2),
    largoExtraMm: Math.round(sobrante),
    nota: lados >= 3
      ? `Marco de ${lados} lados: cada esquina cierra a ${dec(interior)}°; corte cada punta a ${dec(sierra)}° en la sierra.`
      : `Dos piezas a ${dec(interior)}°: corte cada una a ${dec(sierra)}° en la sierra para que la unión quede en la bisectriz.`,
    consejos: [
      'Medir siempre por el borde largo (la punta del inglete) y marcar con escuadra falsa o transportador, no a ojo.',
      `En un perfil de ${perfilMm} mm el inglete se come ${Math.round(sobrante)} mm en cada punta respecto al corte recto: súmelos al pedir material.`,
      'Descontar el ancho del disco (1,6 a 3 mm en tronzadora; 0,2 a 0,4 mm en láser) del lado del desperdicio, no de la pieza.',
      'Para tubo contra tubo en T o en ángulo (barandas, cerchas), en vez de inglete va boca de pescado: el láser de tubo la corta exacta.',
    ],
    origen: ORIGEN,
  };
}

// ---------------- dónde soldar ----------------
export const TRABAJOS = {
  porton: 'Portón o puerta',
  reja: 'Reja o baranda',
  viga: 'Viga o empalme de perfil',
  cercha: 'Cercha o estructura de techo',
  escalera: 'Escalera',
  lamina: 'Lámina delgada o forro',
};

const REGLAS_SOLDAR = {
  porton: [
    'Marco: soldar las cuatro esquinas a tope completo después de puntear y medir diagonales iguales.',
    'Orden: puntear todo, revisar escuadra, soldar esquinas opuestas en cruz (1-3, luego 2-4) para que no se tuerza.',
    'Forro de lámina: cordones cortos de 25 a 40 mm cada 150 a 200 mm, saltando de un lado a otro; nunca un cordón corrido, ondula la lámina.',
    'Bisagras: sobre una platina de refuerzo soldada al marco, no directo en la pared delgada del tubo; cordón por los tres lados.',
    'Travesaño donde va la chapa o el motor: soldadura completa y una platina de respaldo, ahí se concentra el esfuerzo.',
  ],
  reja: [
    'Barrotes al marco: soldar por los dos lados del barrote, no solo por el frente; por detrás se oxida si queda abierto.',
    'Anclajes a muro: soldar la platina de anclaje al marco antes de instalar, con cordón completo.',
    'En barandas, las uniones van en los postes, no a mitad del pasamanos.',
  ],
  viga: [
    'Un empalme de viga va donde el esfuerzo es menor: en una viga apoyada en sus extremos, cerca de los apoyos, nunca en la mitad de la luz.',
    'En vigas continuas, el empalme va a una quinta o una cuarta parte de la luz desde el apoyo, donde el momento cambia de signo.',
    'Empalme de alma y aletas con penetración completa (bisel en V a partir de 6 mm) o con platinas de empalme a ambos lados.',
    'No soldar en el doblez de un perfil formado en frío ni a menos de 2 espesores de él: ahí el acero ya está endurecido y se fisura.',
  ],
  cercha: [
    'Las barras se unen en los nudos y sus ejes deben cruzarse en un mismo punto; si no, la soldadura trabaja doblada.',
    'Cordón superior e inferior de una sola pieza entre nudos; si hay que empalmar, hacerlo cerca de un nudo, no a mitad de tramo.',
    'Tubo con tubo: corte boca de pescado y cordón alrededor de todo el contorno.',
  ],
  escalera: [
    'Peldaños a las zancas con cordón por debajo y por los lados; la cara de pisada se deja limpia.',
    'Empalmes de zanca en el descanso, nunca a media rampa.',
    'Placas base al piso y al entrepiso con soldadura completa y anclajes mecánicos, no solo soldadas a una platina embebida pequeña.',
  ],
  lamina: [
    'Lámina de 0,9 a 1,5 mm: MIG con alambre de 0,8 mm o electrodo 6013 de 2,4 mm (3/32") a bajo amperaje.',
    'Cordones intermitentes y alternados; enfriar entre pasadas. Puntos cada 50 mm antes de soldar.',
    'Soldar del centro hacia afuera para que la deformación salga por los bordes.',
  ],
};

// Filete mínimo según la pieza más gruesa (AWS D1.1, tabla de tamaños mínimos), en mm.
export function fileteMinimo(espesorMm) {
  if (espesorMm <= 6) return 3;
  if (espesorMm <= 12) return 5;
  if (espesorMm <= 20) return 6;
  return 8;
}

export function electrodo(espesorMm, estructural = false) {
  if (espesorMm < 2) return { proceso: 'MIG con alambre ER70S-6 de 0,8 mm, o electrodo 6013 de 2,4 mm (3/32")', amperios: '60–90 A' };
  if (espesorMm < 5) return { proceso: estructural ? 'Electrodo 7018 de 2,4 a 3,2 mm (3/32" a 1/8")' : 'Electrodo 6013 de 3,2 mm (1/8") o MIG 0,9 mm', amperios: '90–130 A' };
  return { proceso: 'Electrodo 7018 de 3,2 a 4 mm (1/8" a 5/32"), en varias pasadas; MIG 1,0 a 1,2 mm', amperios: '120–170 A' };
}

export function dondeSoldar({ trabajo = 'porton', espesorMm = 2, estructural = false } = {}) {
  const e = electrodo(espesorMm, estructural);
  return {
    trabajo: TRABAJOS[trabajo] || trabajo,
    reglas: REGLAS_SOLDAR[trabajo] || [],
    filete: fileteMinimo(espesorMm),
    electrodo: e.proceso, amperios: e.amperios,
    generales: [
      'Limpiar óxido, pintura y grasa 2 cm alrededor de la unión antes de soldar.',
      'Soldar en la unión, nunca a mitad de un tramo, y lejos de dobleces y agujeros.',
      'El tamaño del filete no pasa del espesor de la pieza más delgada.',
      'Si la pieza es galvanizada, quitar el zinc o soldar con ventilación: el humo es tóxico.',
    ],
    origen: ORIGEN,
  };
}

export const pesos = n => '$' + Math.round(n).toLocaleString('es-CO');
export const dec = (n, d = 1) => (+n).toLocaleString('es-CO', { maximumFractionDigits: d });
