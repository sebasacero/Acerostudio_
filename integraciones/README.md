# Integraciones de AceroStudio

Conectores para llevar un modelo de AceroStudio (Studio web o servidor MCP) a los programas de diseño.

| Programa | Archivo que lee | Conector | Cómo |
|---|---|---|---|
| Revit 2022+ | `.ifc` | (no necesita) | Archivo › Abrir › IFC o Insertar › Vincular IFC: columnas, vigas y barras de acero entran como estructura con su perfil (IfcIShapeProfileDef, tubos huecos), material S355 y peso |
| Revit 2022+ (nativo) | `.acero.json` | `revit/acerostudio_revit.py` | pyRevit o RevitPythonShell: niveles, muros, losas, columnas (familia HEB/IPE si está cargada), vigas y cerchas de acero como armazón estructural, puertas y ventanas, en una transacción |
| ArchiCAD, Tekla, Solibri, visores BIM | `.ifc` | (no necesita) | IFC 4 Reference View |
| AutoCAD | `-planta.dxf`, `-3d.dxf` | (no necesita) | Abrir o insertar; capas MUROS, PUERTAS, VENTANAS, ESTRUCTURA, COTAS y caras 3D por material |
| SketchUp | `.acero-solids.json` | `sketchup/acerostudio_sketchup.rb` | Consola de Ruby `load "…"` o carpeta Plugins → Extensiones › AceroStudio |
| 3ds Max 2022+ | `.acero-solids.json` | `3dsmax/acerostudio_3dsmax.py` | Scripting › Run Script; materiales físicos y capas por nivel |
| Blender 3.6+ | `.acero-solids.json` | `blender/acerostudio_blender.py` | Complemento (Archivo › Importar, con "Escena comercial") o sin ventana: `blender -b -P acerostudio_blender.py -- modelo.acero-solids.json salida.blend render.png --cycles --ambiente=dorada --toma=heroe --muestras=96 --resolucion=2160` |

`acero-solids` es un JSON en metros con Z arriba: cada elemento del modelo se vuelve cajas (`center`, `size`, `rotZ`)
o prismas (`points`, `z`, `height`) con su material y su nivel; desde la versión 2 las barras de acero (vigas, diagonales,
cerchas, correas) llegan como mallas cerradas (`vertices`, `faces`) con su `profile`. Cualquier programa que sepa hacer una caja y una malla lo puede leer.

### Render fotorrealista en Blender
El conector arma la escena de venta sin tocar nada: acero pintado con laca, galvanizado y corten PBR con bisel de 4 mm,
vidrio con transmisión real, cielo físico (hora dorada o mediodía) o cielo de hora azul con interiores encendidos,
plaza y césped, árboles, cámara a 1,60 m con perspectiva de dos puntos (verticales rectas, lente descentrado), AgX y Cycles con eliminación de ruido.

El conector de Blender se probó con Blender 5.2 (bpy) importando, armando la escena comercial y renderizando con Cycles.
El IFC se validó con IfcOpenShell 0.9 (esquema IFC4 sin errores y toda la geometría construida); falta abrirlo en Revit.
Los de Revit, SketchUp y 3ds Max pasan revisión de sintaxis pero falta probarlos dentro de cada programa.
