# AceroStudio — Estudio de arquitectura en acero (Next.js)

Herramienta para diseñar obras en acero con lenguajes arquitectónicos del
mundo y ver el precio de cada obra antes de cotizar. Usa el mismo proyecto
Supabase que el sitio principal (`acero-press`, ver
[`../supabase/README.md`](../supabase/README.md)).

## Secciones

| Ruta | Qué es |
|---|---|
| `/` | Portada: método, mapa de lenguajes y lista de precios. |
| `/obras` | Las 12 obras con precio por unidad y de un proyecto típico. |
| `/obras/[obra]` | Ficha de la obra: anatomía en acero (perfiles con kg/m, uniones, complementos), precio en los 12 lenguajes, materiales posibles, NSR-10 y mantenimiento. |
| `/atlas` | Mapa dot-matrix con 12 tradiciones conectadas con Bogotá. |
| `/atlas/[tradicion]` | Lámina del lenguaje: filosofía, uso del acero, detalles, paleta, referentes reales y precios de las 12 obras con ese oficio. |
| `/detalles` | Biblioteca: perfiles, uniones, materiales ($/kg), acabados (durabilidad, mantenimiento, precio), clima de Bogotá, norma y límites de los precios. |
| `/estudio` | Configurador: obra, lenguaje, cantidad, material, acabado, complementos y protección al fuego, con dibujo paramétrico, presupuesto por partidas con fórmula auditable, ficha técnica, render con IA de la obra en tu espacio y cotización. El estado vive en la URL (enlace compartible) y se imprime como lámina. |
| `/rediseno` | Rediseño rápido con IA de un espacio o un producto (herramienta anterior). |

## Cómo se calcula el precio

`lib/pricing.ts`, con tests en `lib/pricing.test.ts`:

1. **Estructura**: kg de acero (peso medio por unidad × cantidad) × COP/kg
   fabricado e instalado. El COP/kg se toma dentro de la franja del
   material según el *grado de fabricación* de la obra (0 = estructura
   repetitiva, 1 = pieza pequeña, a la vista y con mucho detalle). Incluye
   anticorrosivo base, transporte y montaje.
2. **Oficio** del lenguaje elegido: +0–35% sobre la estructura.
3. **Acabado** por m² de superficie (o por kg en galvanizado en caliente) y,
   si aplica, protección intumescente.
4. **Complementos** (tableros, vidrio, LED, steel deck, anclajes…).
5. **Movilización** fija por obra.
6. +10% imprevistos, +8% diseño y dirección AceroStudio, +19% IVA.
7. Se muestra como rango de −20% a +30% sobre el valor central.

La calibración se prueba contra benchmarks de mercado: el costo directo de
cada obra típica debe caer dentro del rango investigado
(`npm test` imprime la tabla).

### De dónde salen los números

`research/*.json` guarda la investigación (oct-2026) con sus fuentes y su
nivel de confianza, revisada por un verificador independiente. Los módulos
`lib/data/catalog-data.ts` y `lib/data/traditions.ts` se generan desde ahí
(`npm run gen:catalog`, `npm run gen:traditions`); la calibración propia
(grado de fabricación, movilización, compatibilidad material–acabado) está en
`scripts/gen_catalog.py`. Para actualizar precios, edita el JSON o la
calibración, regenera y corre `npm test`.

Los precios son estimaciones de orden de magnitud: no incluyen diseño
estructural firmado, licencias ni obra civil.

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm test           # motor de precios + estado del estudio
npm run lint && npm run build
```

Next.js 16 con Cache Components: las páginas de catálogo y atlas se
prerenderizan con `generateStaticParams`; `/estudio` usa `useSearchParams`
dentro de `Suspense`.

> Desde el entorno de desarrollo en la nube no se pudo probar end-to-end la
> subida a Storage, el render con Gemini ni el envío de la cotización desde
> el navegador (el sandbox bloquea `*.supabase.co`). La inserción anónima en
> `quote_requests` sí se verificó en la base de datos. Prueba el flujo
> completo una vez desplegado.

## Deploy

Vercel con **Root Directory = `redesign-app`** y las variables de
`.env.example`.
