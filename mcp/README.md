# Servidor MCP de AceroStudio

Deja que Claude (Claude Desktop, Claude Code) u otro agente con MCP diseñe con el motor de AceroStudio.

```bash
cd mcp && npm install
npm test   # prueba de humo: arranca el servidor y llama todas las herramientas
```

Configuración en Claude Desktop (`claude_desktop_config.json`) o en `.mcp.json` de Claude Code:

```json
{
  "mcpServers": {
    "acerostudio": {
      "command": "node",
      "args": ["/ruta/al/repo/mcp/server.mjs"],
      "env": { "ACEROSTUDIO_PROJECT": "/ruta/mi-proyecto.acero.json", "BLENDER": "/ruta/a/blender" }
    }
  }
}
```

| Herramienta | Qué hace |
|---|---|
| `proyecto_nuevo`, `proyecto_abrir`, `proyecto_resumen`, `proyecto_elementos` | Crear, abrir y leer proyectos `.acero.json` (los mismos del Studio web) |
| `generar_estructura_acero` | **Sistema por defecto.** Edificio de pórticos, casa con voladizo, nave con cerchas o pabellón, todo en acero (HEB, IPE, tubos, arriostramientos, steel deck, muro cortina); devuelve toneladas, kg/m² y despiece por perfil |
| `agregar_nivel`, `agregar_muro`, `agregar_vano`, `agregar_losa`, `agregar_columna` (perfil HEB/tubo), `agregar_viga` (IPE, diagonales, correas), `agregar_volumen`, `eliminar_elemento` | Modelar elemento por elemento |
| `generar_edificio` | Volumetría con muros (estudio de masa) por parámetros o por volúmenes |
| `plano_a_modelo` | PNG/JPG de un plano o boceto → muros, puertas y ventanas, con columnas HEB y vigas IPE (`estructura_acero`, activo por defecto) |
| `exportar` | `ifc` (IFC 4 para Revit, ArchiCAD, Tekla), `json`, `solidos`, `dxf` (planta), `dxf3d`, `svg` |
| `enviar_a` | Carpeta lista para Blender, Revit (IFC + conector), SketchUp, 3ds Max o AutoCAD; con Blender instalado crea el `.blend` y, con `render`, un render fotorrealista en Cycles (`ambiente`: dorada, mediodia, azul; `toma`: heroe, frontal, aerea) sin abrir la interfaz |
| `prompt_video` | Prompt para Higgsfield, Kling, Runway o Veo según el modelo y la toma |

Ejemplos de pedido a Claude:
- *"Genera una nave en acero de 24 m de luz y 48 m de largo con cerchas, y mándala a Blender con render en hora azul."*
- *"Lee plano.jpg, levántalo en dos pisos de 2,8 m con estructura de acero y expórtalo a IFC para Revit."*
