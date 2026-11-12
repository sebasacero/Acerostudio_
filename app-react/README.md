# AceroStudio · App de visitas (React)

La app que usa el equipo en la obra: **cámara → medir → encajar → video → propuesta → pedido**. Se publica compilada en `/app/` (www.acerostudio.com/app/), la fuente vive aquí.

```
npm install        # una vez
npm run dev        # desarrollo en http://localhost:5173/app/
npm run build      # compila a ../app/ (se versiona: Vercel sirve estático, sin build)
node pruebas/carga.mjs 100,1000,100000   # prueba de carga del simulador de pedidos
```

## Pantallas (`src/pantallas/`)

| Pantalla | Qué hace | Qué usa |
|---|---|---|
| Visitas | Lista de visitas (cliente, foto, medidas, estado) y alta de una nueva | `localStorage` (`acero-visitas`) |
| Cámara | Cámara trasera con resolución 720p/1080p/4K, enfoque y balance continuos, linterna y zoom si el teléfono los expone; foto JPEG y video con `MediaRecorder` (mp4 en Safari, webm en Chrome) | `getUserMedia`, `MediaRecorder`, Web Share |
| Medir | **AR del navegador** (WebXR hit-test, Android/Chrome) o **medición sobre la foto** con una referencia conocida (metro, puerta, baldosa) marcando las 4 esquinas del vano; también a mano | `src/medicion.js` |
| Encajar | El producto (portón, puerta, ventana, reja, baranda; diseño y acabado) dibujado y deformado a la perspectiva del vano (homografía CSS); esquinas arrastrables | `src/producto.jsx` |
| Video | Render con metal realista del simulador de Ornamentación **sobre la foto del cliente**, comandos (abrir, cerrar, puerta peatonal) y **video con subtítulos** de cómo funciona (canvas compuesto + `MediaRecorder`), para enviar por WhatsApp | `ornamentacion/js/porton.js` |
| Propuesta | Documento formal: cliente, fotos (espacio y render), medidas con fuente y precisión, especificación, valor por grupos (base de precios de Ornamentación, margen 30 %), plazo, condiciones, firmas; PDF por impresión, texto para WhatsApp; "cliente aceptó" lo convierte en pedido | `src/calculo.js` |
| Pedidos | Simulador de compras (clientes/mes, conversión, mix, puestos, horas, plazo) y cola del taller con backlog y primer pedido que sale tarde; **prueba de carga** de 100 a 100.000 clientes | `src/pedidos.js` |

## LiDAR

El navegador del iPhone no expone el LiDAR: solo una app nativa (ARKit) lo lee. Las medidas se guardan con `fuente` (`lidar` / `webxr` / `referencia` / `manual`) y `precision`, así la versión nativa (Capacitor + plugin ARKit) solo tiene que escribir el mismo objeto. Mientras tanto: AR del navegador en Android y medición sobre la foto en iPhone.

## Prueba de carga (resultado en el contenedor)

Capacidad base: 8 puestos × 9 h × 80 % = 57,6 h/día, plazo prometido 15 días hábiles.

| clientes | pedidos | generar | simular | tarde | se rompe en |
|---|---|---|---|---|---|
| 100 | 48 | 0,8 ms | 0,3 ms | 0 % | no |
| 1.000 | 445 | 5 ms | 0,7 ms | 89 % | pedido #49 (día 4) |
| 100.000 | 45.268 | 172 ms | 46 ms | 99,9 % | pedido #48 (día 1) |
| 1.000.000 | 451.231 | 1,9 s | 0,36 s | 100 % | pedido #48 (día 1) |

Lo que se rompe primero es el **taller** (a partir de ~50 pedidos en el mes el plazo de 15 días deja de cumplirse), no el código. En el código apareció un fallo real a 1.000.000 de clientes (`Math.max(...spread)` desbordaba la pila con 450.000 pedidos); ya está corregido. La lista de la pantalla Pedidos se corta a 40 filas para que el teléfono siga fluido.

## Notas

- Reutiliza `css/volumetrico.css`, `css/app.css`, `ornamentacion/js/porton.js` y `precios.js` de la raíz (una sola fuente de verdad). `vite.config.js` resuelve `three` y `three/addons` desde este `node_modules`.
- `porton.js` ganó `cfg.fondo` (textura de fondo) para poner la foto del cliente detrás del producto; el piso del estudio pasa a solo-sombra.
- Probado en Chromium (escritorio y 390 px) con cámara falsa. Falta probar en iPhone (Safari) y Android reales: cámara, MediaRecorder y WebXR.
