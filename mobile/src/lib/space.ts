import type { SpaceMeasurement } from "../../modules/lidar-scanner";

export type SpaceScale = "pequeno" | "mediano" | "grande";

// Umbrales de un café: <25 m² es una barra o kiosko, >80 m² admite mezzanine y zonas.
export function classifySpace(m: SpaceMeasurement): SpaceScale {
  if (m.floorAreaM2 < 25) return "pequeno";
  if (m.floorAreaM2 < 80) return "mediano";
  return "grande";
}

export const SCALE_LABEL: Record<SpaceScale, string> = {
  pequeno: "Espacio pequeño",
  mediano: "Espacio mediano",
  grande: "Espacio grande",
};

// Obras del catálogo web (redesign-app) que tienen sentido para cada escala.
export const SUGGESTED_WORKS: Record<SpaceScale, string[]> = {
  pequeno: ["barra-cafe", "estanteria", "senaletica-corten", "mesa"],
  mediano: ["barra-cafe", "fachada-celosia", "baranda", "marquesina", "porton"],
  grande: ["mezzanine", "escalera", "pergola", "fachada-celosia", "kiosko-modular"],
};

const fmt = (n: number) => n.toFixed(1).replace(".", ",");

export function describeSpace(m: SpaceMeasurement): string {
  return `${fmt(m.floorAreaM2)} m² de piso · ${fmt(m.widthM)} × ${fmt(m.depthM)} m · ${fmt(m.heightM)} m de alto`;
}

// Prompt para la Edge Function generar-dise-o (modo 'espacio'): las medidas
// reales del LiDAR evitan que el modelo invente proporciones.
export function buildPrompt(m: SpaceMeasurement, style: string): string {
  const scale = classifySpace(m);
  const guidance: Record<SpaceScale, string> = {
    pequeno:
      "Es un espacio pequeño: prioriza una barra compacta, almacenamiento vertical, espejos y luz para ampliar visualmente; nada de mobiliario voluminoso.",
    mediano:
      "Es un espacio mediano: zonifica barra, mesas y una zona de alto tráfico; mantén circulaciones de al menos 0,9 m.",
    grande:
      "Es un espacio grande: propone zonas diferenciadas (barra, salón, zona de trabajo) y aprovecha la altura con elementos en acero como entrepiso o iluminación lineal.",
  };
  return (
    `Rediseña este espacio de cafetería en estilo ${style}. ` +
    `Medidas reales obtenidas con LiDAR: ${fmt(m.floorAreaM2)} m² de piso, ` +
    `${fmt(m.widthM)} m de ancho, ${fmt(m.depthM)} m de fondo y ${fmt(m.heightM)} m de altura libre. ` +
    `Respeta estas proporciones exactamente. ${guidance[scale]}`
  );
}
