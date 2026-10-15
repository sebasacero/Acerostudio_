export type RedesignMode = "espacio" | "producto";

export const MODES: {
  id: RedesignMode;
  label: string;
  tagline: string;
  styles: string[];
}[] = [
  {
    id: "espacio",
    label: "Espacio",
    tagline: "Interior o fachada de tu cafetería",
    styles: ["Industrial", "Minimalista", "Cálido / Madera", "Escandinavo", "Tropical"],
  },
  {
    id: "producto",
    label: "Producto",
    tagline: "Empaque, etiqueta o merchandising",
    styles: ["Minimalista", "Premium / Dorado", "Artesanal / Kraft", "Pop / Colorido", "Eco"],
  },
];

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573152125327";

export const BUDGET_RANGES = [
  "Menos de $5.000.000 COP",
  "$5.000.000 – $15.000.000 COP",
  "$15.000.000 – $40.000.000 COP",
  "Más de $40.000.000 COP",
  "Aún no lo sé",
];
