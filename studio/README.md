# AceroStudio Studio

Software de diseño arquitectónico que corre en el navegador, con la identidad de la web
(lápiz rojo, escala de revenido del acero, tipografías Bricolage Grotesque y DM Mono).
No necesita instalación ni compilación: es HTML + módulos de JavaScript con Three.js desde CDN.

Se abre en `/studio/` (por ejemplo `https://www.acerostudio.com/studio/`).

## Qué hace hoy (v0.2)

| Área | Funciones |
|---|---|
| Modelado | Muros encadenados con esquinas cerradas, losas, volúmenes, columnas de acero (perfil I, rectangular o circular), puertas y ventanas que abren el muro de verdad |
| Precisión | Ajuste a extremos, puntos medios, vértices y ejes; rejilla de 1 cm a 1 m; casilla de medidas estilo SketchUp (escribe `3,5` o `6x4,5` y Enter); Shift bloquea el eje |
| Edición | Seleccionar, mover y rotar con gizmo, duplicar, eliminar, deshacer/rehacer (200 pasos), propiedades numéricas de cada elemento y de cada vano |
| Organización | Capas (mostrar, bloquear, renombrar, capa activa) y niveles (cota, altura libre, duplicar nivel para armar edificios piso por piso) |
| Vistas | 3D en perspectiva, planta con corte a +1,20 m y poché negro, alzado y lateral ortogonales, plano de corte ajustable en 3D, aristas tipo dibujo |
| Documentación | Cotas en lápiz rojo; planta exportable a SVG 1:100 y DXF (AutoCAD, Revit, ArchiCAD, LibreCAD, Rhino) |
| Recorrido | Sobrevuelo cinemático de 18 s con el sol avanzando de 7:00 a 17:00 que aterriza dentro del espacio; modo caminar a 1,60 m con colisiones contra muros, vidrios y muebles (WASD o flechas, arrastrar para mirar, Shift corre, botones táctiles en celular) |
| Render | Modo render con sombras suaves, materiales PBR (aceros revenidos, corten, concreto, ladrillo, maderas, vidrio) y sol real de Bogotá por hora y fecha |
| Datos | Cuantificación en vivo: m² de losa, metros y área neta de muro, concreto, kg de acero, puertas y ventanas; descarga en CSV |
| Archivos | Proyecto `.acero.json`, importar GLB / glTF / OBJ (se convierte mm o cm a m y se guarda en el navegador), exportar GLB, OBJ y PNG |
| Guardado | Autoguardado en el navegador; los modelos importados se guardan en IndexedDB |
| Imagen → 3D | Menú **Crear ✦**: plano o boceto (foto o escaneo) → muros, puertas y ventanas detectados en el navegador, con escala automática por espesor de muro o por ancho real; uno o varios pisos. Foto de edificio → volúmenes, pisos, crujías y material con la IA de visión |
| Edificio paramétrico | Torre, dos torres desfasadas, barra o L: frente, fondo, pisos, altura, ventanas, vitrina en primer piso, estructura de acero, cubierta; volúmenes editables en JSON |
| Animación automática | Seis tomas (contrapicado, órbita 360°, acercamiento, sobrevuelo, día completo, de planta a 3D) y un reel de tres tomas; video MP4/WebM en 16:9, 9:16 o 1:1 con la marca de AceroStudio; fotograma inicial y prompt para Higgsfield, Kling, Runway o Veo |
| Modelo interactivo | Visor 3D en un solo `.html` (girar, cortar por piso, sol, pantalla completa) para mandar al cliente o subir a la web |
| Complementos | Conectores para Revit (pyRevit), SketchUp (Ruby), 3ds Max (pymxs) y Blender (complemento o sin ventana) en `../integraciones/`; AutoCAD por DXF 2D y DXF 3D |
| MCP | `../mcp/server.mjs`: Claude u otro agente crea y edita proyectos, lee planos, genera edificios, exporta y manda el modelo a cada programa |

## Atajos

`V` seleccionar · `W` muro · `L` losa · `B` volumen · `C` columna · `P` puerta · `N` ventana · `M` cota ·
`K` caminar · `G` mover · `R` rotar · `Supr` eliminar · `Ctrl+Z` / `Ctrl+Y` · `Ctrl+D` duplicar · `Ctrl+S` guardar · `1`-`4` vistas · `F` encuadrar · `Esc` terminar

## Hoja de ruta

La meta es llegar a lo que hoy resuelven SketchUp, Revit y ArchiCAD, pero con la IA de AceroStudio adentro
(foto → modelo → propuesta → cotización por WhatsApp).

### v0.2 · Modelado completo
- Empujar/tirar caras (push/pull) y losas poligonales de cualquier forma
- Cubiertas (planas, a una y dos aguas), escaleras y rampas paramétricas
- Muros curvos, muros compuestos por capas (estructura, aislamiento, acabado)
- Biblioteca de mobiliario y equipamiento (cocina, baños, oficina, comercio)
- Selección múltiple, grupos y componentes reutilizables

### v0.3 · BIM e intercambio
- Importar y exportar IFC (web-ifc) para trabajar con Revit y ArchiCAD
- Importar DXF/DWG como referencia en planta para calcar
- Planos y cortes generados automáticamente, láminas con rótulo AceroStudio y exportación a PDF
- Tablas de cuantificación por material y presupuesto con precios de Bogotá

### v0.4 · IA de AceroStudio
- ~~Foto del espacio → modelo 3D aproximado~~ (hecho en v0.2: plano/boceto → muros local, fachada → volúmenes con IA)
- Foto de interior → muros, ventanas y columnas (necesita estimación de profundidad)
- Propuestas de distribución que respetan la estructura (lo que la web llama "lo que no se mueve")
- Cambio de estilo en un clic (minimalista, industrial, cálido, escandinavo, tropical) sobre el modelo
- Mapa de calor de circulación sobre la planta con la escala de revenido
- Render fotorrealista con IA a partir de la vista 3D

### v0.5 · Colaboración y entrega
- Proyectos en la nube (Supabase) con versiones y enlace para compartir con el cliente
- Comentarios en lápiz rojo sobre el modelo
- Recorrido virtual y realidad aumentada en el celular (WebXR / USDZ)
- ~~Presentaciones y reels generados desde el modelo~~ (hecho en v0.2: animación automática y visor interactivo)

## Arquitectura de módulos

Los módulos sin Three.js (`model`, `plan`, `palette`, `drawings`, `solids`, `detect`, `generate`, `prompts`)
corren igual en el navegador y en Node: el servidor MCP usa exactamente el mismo motor que el Studio.

| Módulo | Qué hace |
|---|---|
| `detect.js` | Plano/boceto → muros: umbral adaptativo, apertura morfológica, bandas, vanos y esquinas |
| `generate.js` | Muros detectados → elementos; edificio paramétrico por volúmenes; respuestas de la IA → modelo |
| `solids.js` | Formato neutro `acero-solids` (cajas y prismas Z arriba) y DXF 3D |
| `animator.js` / `prompts.js` | Tomas de cámara, grabación de video y prompts para video con IA |
| `vision-ui.js`, `panels.js`, `ui.js` | Ventanas de Crear ✦, animación, visor e integraciones |

La IA de visión es la función `supabase/functions/vision-arquitectura` (Claude con visión y salida JSON estricta).
Para activarla: `supabase secrets set ANTHROPIC_API_KEY=…` y `supabase functions deploy vision-arquitectura`.
Mientras no esté desplegada, la detección local de planos y el modo paramétrico funcionan sin red.
