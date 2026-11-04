# AceroStudio · Fábrica

Del modelo de acero a la planta y a la obra. Lo que se diseña en el Studio (o con los generadores de
edificio, casa, nave y pabellón) sale de aquí listo para fabricar:

| Paso | Qué hace | Archivo |
| --- | --- | --- |
| Despiece | Cada barra del modelo se vuelve una pieza con marca (C1, V3, D2…), número de serie (V3-007), longitud de corte, cortes en ángulo, agujeros por cara y placas soldadas. Las conexiones salen de la geometría: placa base o de empalme en columnas, placa de testa en vigas que llegan a columna, aletas para viguetas, cartelas para riostras. Lo que pasa de 12 m se parte en tramos con empalme. | `js/despiece.js` |
| Nesting | Barras: mejor ajuste decreciente en barras de 6 y 12 m (kerf 3 mm, despunte 10 mm); los retales ≥ 1 m vuelven al almacén. Placas: por espesor, en láminas de 3000 × 1500 mm con giro. | `js/nesting.js` |
| Máquinas | DSTV / NC1 por marca para líneas de corte y taladrado (Ficep, Peddinghaus, Voortman, Kaltenbach…), DXF R12 de cada placa y de las láminas ya anidadas para plasma o láser, CSV de corte, piezas y compra, ZIP con todo. | `js/cnc.js` |
| Planos | Plano de taller SVG de cada marca y placa; etiqueta de 100 × 56 mm con QR por pieza. | `js/planos.js` |
| Planta | Cada pieza lleva su propia ruta (sierra → taladro → granalla → robot de soldadura → pintura → escáner 3D → despacho), sin cambio de formato entre piezas distintas. El tiempo de máquina se reparte como cómputo, en colas por estación y en el orden de montaje. Cada máquina mide lo que hizo y se corrige sola. | `js/planta.js` |
| Gemelo digital | La planta en isométrico estilo Ciudad de acero con las piezas moviéndose, y la estructura coloreada por estado de montaje. | `js/gemelo.js` |
| Obra | El QR abre la ficha de la pieza en el celular: ruta, certificado del escáner y botones fabricada / despachada / montada. | `js/app.js` |

## Usarlo

- Web: `fabrica/` (o desde el Studio: menú Archivo → **Fabricar**). `?tipo=edificio|casa|nave|pabellon` o `?fuente=studio` para el proyecto abierto en el Studio.
- Agente de taller (Node 20, sin dependencias):

```
node fabrica/agente/agente.mjs paquete --tipo edificio --pisos 6 --salida ./ordenes [--zip]
node fabrica/agente/agente.mjs paquete --proyecto mi-proyecto.acero.json --salida ./ordenes
node fabrica/agente/agente.mjs simular --tipo nave
node fabrica/agente/agente.mjs maquina --orden ./ordenes/OP-XXXX/orden.json --maquina sierra --carpeta /red/sierra-1
```

  El modo `maquina` usa carpeta caliente: entrega un programa NC1 a la vez en orden de montaje, lee
  `<pieza>.medida` (`{"desvio": mm}`) si el software de la máquina la deja, calcula la compensación y,
  con `SUPABASE_URL` y `SUPABASE_KEY`, publica cada evento en `fab_eventos`.
- MCP: herramienta `fabricar` en `mcp/server.mjs`.
- Pruebas: `node fabrica/test.mjs` (geometría de agujeros, nesting sin traslapes, plan sin choques, ZIP).

## Lo que falta para producción real

- **Cálculo de conexiones**: las placas y pernos son predimensionamiento tipo; un ingeniero debe verificar
  cada conexión (o importarlas de Tekla/IDEA StatiCa) antes de cortar.
- **Postprocesador por marca de máquina**: el NC1 es estándar DSTV; cada línea suele pedir ajustes
  (orígenes, marcado, contornos). Probar con la máquina real del taller.
- **Seguimiento compartido**: el estado de las piezas vive en el navegador. La migración
  `supabase/migrations/20261104000000_fabrica.sql` lo lleva a la nube (no está aplicada).
- **Tiempos de máquina**: son estimados; el agente debe ir reemplazándolos por los tiempos reales.
