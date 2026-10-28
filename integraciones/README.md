# Integraciones de AceroStudio

Conectores para llevar un modelo de AceroStudio (Studio web o servidor MCP) a los programas de diseño.

| Programa | Archivo que lee | Conector | Cómo |
|---|---|---|---|
| Revit 2022+ | `.acero.json` | `revit/acerostudio_revit.py` | pyRevit o RevitPythonShell: crea niveles, muros, losas, columnas, puertas y ventanas nativos en una transacción |
| AutoCAD | `-planta.dxf`, `-3d.dxf` | (no necesita) | Abrir o insertar; capas MUROS, PUERTAS, VENTANAS, ESTRUCTURA, COTAS y caras 3D por material |
| SketchUp | `.acero-solids.json` | `sketchup/acerostudio_sketchup.rb` | Consola de Ruby `load "…"` o carpeta Plugins → Extensiones › AceroStudio |
| 3ds Max 2022+ | `.acero-solids.json` | `3dsmax/acerostudio_3dsmax.py` | Scripting › Run Script; materiales físicos y capas por nivel |
| Blender 3.6+ | `.acero-solids.json` | `blender/acerostudio_blender.py` | Complemento (Archivo › Importar) o sin ventana: `blender -b -P acerostudio_blender.py -- modelo.acero-solids.json salida.blend [render.png]` |

`acero-solids` es un JSON en metros con Z arriba: cada elemento del modelo se vuelve cajas (`center`, `size`, `rotZ`)
o prismas (`points`, `z`, `height`) con su material y su nivel. Cualquier programa que sepa hacer una caja lo puede leer.

El conector de Blender se probó con Blender 5.2 (bpy) importando, guardando el `.blend` y renderizando con Cycles.
Los de Revit, SketchUp y 3ds Max pasan revisión de sintaxis pero falta probarlos dentro de cada programa.
