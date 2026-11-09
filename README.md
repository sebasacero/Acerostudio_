# AceroStudio

Inteligencia de diseño para arquitectura en acero. De un lote, un plano o una frase a la volumetría,
la estructura predimensionada, el render que vende y las piezas listas para la planta.

**[acerostudio.com](https://www.acerostudio.com)** · Bogotá, 2.600 msnm

## Qué hay en este repositorio

| Parte | Ruta | Qué hace |
| --- | --- | --- |
| Portada | `index.html` | Web en estilo "Ciudad de acero": ciudad isométrica en vivo, modo día (maqueta blanca) y noche. |
| App | `app.html` | Flujo completo del producto en nueve pantallas: crear, editor con chat, ficha de acero, render, lámina de venta y exportación. |
| Studio 3D | `studio/` | Editor en el navegador: pórticos, naves, casas y pabellones con perfiles reales (HEB, IPE, tubos), plano a 3D, foto a volúmenes, toneladas en vivo, render comercial, IFC 4, DXF, GLB. |
| Fábrica | `fabrica/` | Del modelo a la planta: despiece con conexiones, nesting, DSTV/NC1 y DXF para las máquinas, planos de taller, etiquetas QR y montaje. |
| Explorador | `explorador.html` | Recorrido de un edificio piso a piso. |
| Presentaciones | `presentacion.html` | Láminas y reels de proyecto. |
| Conectores | `integraciones/` | Complementos para Revit, SketchUp, 3ds Max y Blender. |
| Servidor MCP | `mcp/` | Herramientas para que un asistente de IA cree, predimensione, exporte y fabrique estructuras. |
| IA de fotos | `supabase/` | Funciones y migraciones del backend. |

## Principios

- **Todo es acero.** Cualquier cosa que se genere sale con estructura en acero por defecto.
- **Los números van con el dibujo.** Toneladas, kg/m² y perfiles se recalculan con cada cambio. Son
  predimensionamiento orientativo: no reemplazan el cálculo de un ingeniero estructural.
- **Un solo sistema visual.** Pizarra de noche, maqueta blanca de día, coral como acento y celeste para
  el acero. Tipografías Antonio, Outfit y DM Mono. Los tokens viven en `css/volumetrico.css`.

## Correrlo en local

No hay paso de build: es HTML, CSS y módulos ES.

```bash
python3 -m http.server 8000     # y abre http://localhost:8000
node fabrica/test.mjs           # pruebas del núcleo de fabricación
cd mcp && npm install && npm test
```

Three.js 0.169 se carga desde jsDelivr por `importmap`. La rama `main` se publica sola en Vercel.
