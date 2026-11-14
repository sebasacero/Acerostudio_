# Muebles desarmables en acero ("AceroStudio lego")

Sillas, taburetes y mesas para cafetería que llegan en caja plana y se arman como bloques: dos marcos
laterales que salen soldados y pintados de planta, travesaños que se atornillan y una tapa de lámina plegada.
Una sola llave Allen de 4 mm y un solo tipo de tornillo (M6 cabeza botón) para todo el catálogo.

- `index.html` + `js/muebles.js`: visor 3D (Three.js 0.169 por importmap, sin build) en el estilo claro de
  Ornamentación. Vistas: mueble, la caja (piezas numeradas acostadas), unión (detalle del tornillo) y cafetería.
  Despiece explosionado, armado paso a paso animado e instructivo imprimible con un dibujo por paso.
- `js/kit.js`: núcleo puro (también corre en Node). Catálogo paramétrico (S-01 silla, S-02 taburete,
  M-01 mesa, M-02 mesa barra, M-03 mesa pedestal), pasos de armado, caja plana, despiece y costo.
  El despiece sale con el formato de `fabrica/js/despiece.js`, así que usa el mismo `nestBars` (tramos de 6 m)
  y `nestPlates` (pliegos de 1,22 × 2,44 m), `csvCorte` y `zip` de la Fábrica.
- Paquete de taller (.zip): lista de corte por barra, piezas, costo, DXF de cada lámina (capas CORTE,
  AGUJEROS, DOBLEZ, MARCADO) y DXF de cada pliego anidado.
- Enlaces: `?mueble=silla|taburete|mesa|barra|pedestal`, `&acabado=`, `&perforado=liso|puntos|malla`,
  `&vista=kit|union|cafeteria`, `&explota=0..1`, `&paso=N`, `&tab=armado|desp|cafe`.
- Pruebas: `node muebles/test.mjs`.

Pendiente: precios reales (los de `SERVICIOS`, `PERFILES.precioTramo` y `LAMINAS.precioPliego` son de
ejemplo), prototipo físico para validar holguras y rigidez, y probar el visor en Safari/iPhone.
