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
| `agregar_nivel`, `agregar_muro`, `agregar_vano`, `agregar_losa`, `agregar_columna`, `agregar_volumen`, `eliminar_elemento` | Modelar elemento por elemento |
| `generar_edificio` | Edificio completo por parámetros o por volúmenes (torres) |
| `plano_a_modelo` | PNG/JPG de un plano o boceto → muros, puertas y ventanas |
| `exportar` | `json`, `solidos`, `dxf` (planta), `dxf3d`, `svg` |
| `enviar_a` | Carpeta lista para Blender, Revit, SketchUp, 3ds Max o AutoCAD con el conector; con Blender instalado crea el `.blend` y el render sin abrir la interfaz |
| `prompt_video` | Prompt para Higgsfield, Kling, Runway o Veo según el modelo y la toma |

Ejemplo de pedido a Claude: *"Lee plano.jpg, levántalo en dos pisos de 2,8 m, muros de ladrillo, y mándalo a Blender con render."*
