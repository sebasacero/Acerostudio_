// AceroStudio · Ornamentación · base de datos de productos y precios de referencia en Colombia (COP).
// Precios públicos tomados el 2026-11-10 de tiendas en línea colombianas; donde no hay precio público, estimado y marcado como tal.
// Los distribuidores del taller (Mundial de Perfiles, La Campana) no publican precios: se modelan como descuento sobre esta lista.
export const FUENTES = {
  hc: { nombre: 'Homecenter', detalle: 'tienda en línea, precio al público con IVA · Colombia', url: 'https://www.homecenter.com.co/' },
  gyj: { nombre: 'G&J Ferreterías', detalle: 'tienda en línea, lista Bogotá · tramos de 6 m', url: 'https://gyj.com.co/bogota_65/' },
  ml: { nombre: 'Mercado Libre Colombia', detalle: 'listados de vendedores, precio típico', url: 'https://listado.mercadolibre.com.co/' },
  magru: { nombre: 'Magru (Bogotá)', detalle: 'servicio de corte láser desde $75 por segundo, sin material', url: 'https://magru.com.co/' },
  cc: { nombre: 'Comando Construcciones', detalle: 'guía de precios de portones 2026, mano de obra', url: 'https://www.comandoconstrucciones.com/portones-automaticos-colombia/' },
  lc: { nombre: 'La Campana', detalle: 'catálogo 2026: pesos por tramo; no publica precios', url: 'https://lacampana.co/' },
  mp: { nombre: 'Mundial de Perfiles', detalle: 'catálogo de tableros estampados; no publica precios', url: 'https://www.mundialdeperfiles.co/' },
  est: { nombre: 'Estimado AceroStudio', detalle: 'sin precio público: estimado con el precio por kilo del mercado, para confirmar con cotización', url: '' },
};
export const CATEGORIAS = { tubo: 'Tubería', perfil: 'Perfiles y barras', lamina: 'Láminas y tableros', motor: 'Motores y automatismo', herraje: 'Herrajes y seguridad', consumible: 'Consumibles', servicio: 'Servicios', mano: 'Mano de obra e instalación' };
// unidad: lo que se compra. kg: peso de esa unidad. perfil: clave del PERFILES del simulador que abastece.
export const ITEMS = [
  // tubería (tramos de 6 m)
  { id: 'tubo-20x20-145', cat: 'tubo', nombre: 'Tubo cuadrado 3/4" (20 mm) × 1,45 mm tipo mueble', unidad: 'tramo 6 m', kg: 5.0, precio: 43009, fuente: 'gyj', fecha: '2026-11-10', perfil: 't20' },
  { id: 'tubo-25x25-11', cat: 'tubo', nombre: 'Tubo cuadrado 1" (25 mm) × 1,1 mm cerrajería', unidad: 'tramo 6 m', kg: 5.0, precio: 25500, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'tubo-40x40-15', cat: 'tubo', nombre: 'Tubo cuadrado 40×40 × 1,5 mm cal. 16', unidad: 'tramo 6 m', kg: 10.6, precio: 65000, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'tubo-40x40-2', cat: 'tubo', nombre: 'Tubo cuadrado 40×40 × 2 mm cal. 14', unidad: 'tramo 6 m', kg: 13.9, precio: 125250, fuente: 'hc', fecha: '2026-11-10', perfil: 't40' },
  { id: 'tubo-50x50-2', cat: 'tubo', nombre: 'Tubo estructural 50×50 × 2 mm HR50', unidad: 'tramo 6 m', kg: 17.8, precio: 115900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'tubo-60x60-2', cat: 'tubo', nombre: 'Tubo estructural 60×60 × 2 mm HR50', unidad: 'tramo 6 m', kg: 21.6, precio: 130300, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'tubo-60x60-25', cat: 'tubo', nombre: 'Tubo estructural 60×60 × 2,5 mm HR50', unidad: 'tramo 6 m', kg: 26.6, precio: 162000, fuente: 'hc', fecha: '2026-11-10', perfil: 'shs60' },
  { id: 'tubo-70x70-2', cat: 'tubo', nombre: 'Tubo estructural 70×70 × 2 mm HR50', unidad: 'tramo 6 m', kg: 25.4, precio: 189900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'tubo-75x75-3', cat: 'tubo', nombre: 'Tubo estructural 75×75 × 3 mm negro', unidad: 'tramo 6 m', kg: 39.8, precio: 334213, fuente: 'gyj', fecha: '2026-11-10', perfil: 'shs80' },
  { id: 'tubo-100x100-2', cat: 'tubo', nombre: 'Tubo estructural 100×100 × 2 mm HR50', unidad: 'tramo 6 m', kg: 36.6, precio: 194900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'tubo-100x100-25', cat: 'tubo', nombre: 'Tubo estructural 100×100 × 2,5 mm cal. 12', unidad: 'tramo 6 m', kg: 45.4, precio: 230900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'tubo-150x150-4', cat: 'tubo', nombre: 'Tubo estructural 150×150 × 4 mm negro', unidad: 'tramo 6 m', kg: 108, precio: 903500, fuente: 'gyj', fecha: '2026-11-10', perfil: 'shs150' },
  { id: 'tubo-200x100-4', cat: 'tubo', nombre: 'Tubo estructural 200×100 × 4 mm negro', unidad: 'tramo 6 m', kg: 108, precio: 887566, fuente: 'gyj', fecha: '2026-11-10', perfil: 'r200' },
  { id: 'tubo-40x20-11', cat: 'tubo', nombre: 'Tubo rectangular 40×20 × 1,1 mm cal. 18', unidad: 'tramo 6 m', kg: 5.9, precio: 31100, fuente: 'hc', fecha: '2026-11-10', perfil: 't4020' },
  { id: 'tubo-50x25-11', cat: 'tubo', nombre: 'Tubo rectangular 50×25 × 1,1 mm cal. 18', unidad: 'tramo 6 m', kg: 7.6, precio: 32900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'tubo-76x38-14', cat: 'tubo', nombre: 'Tubo rectangular 76×38 (3"×1½") × 1,4 mm cerrajería', unidad: 'tramo 6 m', kg: 15.0, precio: 68700, fuente: 'hc', fecha: '2026-11-10', perfil: 'l80' },
  { id: 'tubo-100x40-19', cat: 'tubo', nombre: 'Tubo rectangular 100×40 × 1,9 mm cerrajería', unidad: 'tramo 6 m', kg: 24.7, precio: 117100, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'tubo-red-2-2', cat: 'tubo', nombre: 'Tubo redondo 2" × 2 mm cerramiento negro', unidad: 'tramo 6 m', kg: 14.5, precio: 125901, fuente: 'gyj', fecha: '2026-11-10', perfil: 'red50' },
  { id: 'tubo-red-112-15', cat: 'tubo', nombre: 'Tubo redondo 1½" × 1,5 mm cerramiento negro', unidad: 'tramo 6 m', kg: 8.4, precio: 80287, fuente: 'gyj', fecha: '2026-11-10' },
  // perfiles y barras
  { id: 'barra-cuad-58', cat: 'perfil', nombre: 'Barra cuadrada 5/8" (16 mm) lisa', unidad: 'tramo 6 m', kg: 12.1, precio: 59900, fuente: 'hc', fecha: '2026-11-10', perfil: 'b16' },
  { id: 'barra-red-58', cat: 'perfil', nombre: 'Barra redonda lisa 5/8" A36', unidad: 'tramo 6 m', kg: 9.4, precio: 50069, fuente: 'gyj', fecha: '2026-11-10' },
  { id: 'platina-14x112', cat: 'perfil', nombre: 'Platina 1/4" × 1½" (6 × 38 mm)', unidad: 'tramo 6 m', kg: 11.4, precio: 70750, fuente: 'hc', fecha: '2026-11-10', perfil: 'pl6' },
  { id: 'platina-18x2', cat: 'perfil', nombre: 'Platina 1/8" × 2" (3 × 51 mm)', unidad: 'tramo 6 m', kg: 7.3, precio: 45942, fuente: 'gyj', fecha: '2026-11-10' },
  { id: 'platina-14x6', cat: 'perfil', nombre: 'Platina 1/4" × 6" (6 × 152 mm) para anclajes', unidad: 'tramo 6 m', kg: 45.6, precio: 261574, fuente: 'gyj', fecha: '2026-11-10' },
  { id: 'angulo-114x18', cat: 'perfil', nombre: 'Ángulo 1¼" × 1/8"', unidad: 'tramo 6 m', kg: 9.0, precio: 52537, fuente: 'gyj', fecha: '2026-11-10' },
  { id: 'angulo-2x18', cat: 'perfil', nombre: 'Ángulo 2" × 1/8"', unidad: 'tramo 6 m', kg: 14.6, precio: 84491, fuente: 'gyj', fecha: '2026-11-10' },
  { id: 'angulo-2x14', cat: 'perfil', nombre: 'Ángulo 2" × 1/4"', unidad: 'tramo 6 m', kg: 28.2, precio: 166592, fuente: 'gyj', fecha: '2026-11-10' },
  { id: 'marco-puerta', cat: 'perfil', nombre: 'Marco puerta corriente cal. 18 (perfil de ornamentación)', unidad: 'tramo 6 m', kg: 8.65, precio: 62000, fuente: 'est', fecha: '2026-11-10', nota: 'peso del catálogo La Campana; precio estimado a $7.200/kg' },
  { id: 'pasamanos', cat: 'perfil', nombre: 'Pasamanos cal. 20 (perfil de ornamentación)', unidad: 'tramo 6 m', kg: 4.16, precio: 32000, fuente: 'est', fecha: '2026-11-10', nota: 'peso del catálogo La Campana; precio estimado' },
  // láminas y tableros
  { id: 'lam-cr-18', cat: 'lamina', nombre: 'Lámina Cold Rolled cal. 18 (1,2 mm) 1,22 × 2,44 m', unidad: 'pliego', kg: 28.6, precio: 215000, fuente: 'est', fecha: '2026-11-10', perfil: 'lam', nota: 'sin precio público en línea; estimado a $7.500/kg' },
  { id: 'lam-cr-14', cat: 'lamina', nombre: 'Lámina Cold Rolled cal. 14 (1,9 mm) 1,22 × 2,44 m', unidad: 'pliego', kg: 44.9, precio: 330000, fuente: 'est', fecha: '2026-11-10', perfil: 'lam14', nota: 'sin precio público en línea; estimado a $7.350/kg' },
  { id: 'lam-hr-14', cat: 'lamina', nombre: 'Lámina Hot Rolled 1/4" (6 mm) 1,22 × 2,44 m', unidad: 'pliego', kg: 140, precio: 980000, fuente: 'est', fecha: '2026-11-10', nota: 'estimado a $7.000/kg' },
  { id: 'lam-alfajor-25', cat: 'lamina', nombre: 'Lámina alfajor 2,5 mm 1 × 3 m', unidad: 'pliego', kg: 66, precio: 520000, fuente: 'est', fecha: '2026-11-10', nota: 'estimado' },
  { id: 'tablero-2x1', cat: 'lamina', nombre: 'Tablero estampado 2 × 1 m cal. 20 (Sahara, Galicia, Milán…)', unidad: 'tablero', kg: 14.1, precio: 95000, fuente: 'est', fecha: '2026-11-10', perfil: 'tab', nota: 'Mundial de Perfiles no publica precio; estimado' },
  { id: 'tablero-80x100', cat: 'lamina', nombre: 'Tablero estampado 80 × 100 cm (medida especial)', unidad: 'tablero', kg: 5.6, precio: 48000, fuente: 'est', fecha: '2026-11-10', nota: 'estimado' },
  // motores y automatismo
  { id: 'motor-corr-400', cat: 'motor', nombre: 'Motor corredizo 400 kg Elite MC4, kit residencial con cremallera y controles', unidad: 'kit', precio: 771900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'motor-corr-800', cat: 'motor', nombre: 'Motor corredizo 800 kg Elite MC8 con cremallera y controles', unidad: 'kit', precio: 1125900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'motor-corr-850', cat: 'motor', nombre: 'Motor corredizo 850 kg Accessmatic Bulldozer', unidad: 'unidad', precio: 1155900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'motor-corr-1200', cat: 'motor', nombre: 'Motor corredizo 1.200 kg Elite MC12 con cremallera y controles', unidad: 'kit', precio: 1799900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'motor-bat-200', cat: 'motor', nombre: 'Motor batiente de pistones Elite TW25, hasta 200 kg por hoja, con batería', unidad: 'kit 2 hojas', precio: 1313900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'motor-bat-350', cat: 'motor', nombre: 'Motor batiente de brazos 350 kg por hoja (kit)', unidad: 'kit 2 hojas', precio: 2650000, fuente: 'ml', fecha: '2026-11-10' },
  { id: 'motor-lev', cat: 'motor', nombre: 'Motor de garaje 1/2 HP SC901 con fotocelda', unidad: 'kit', precio: 989900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'cremallera', cat: 'motor', nombre: 'Cremallera galvanizada', unidad: 'm', precio: 68900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'rueda-porton', cat: 'motor', nombre: 'Rueda para portón 58 mm, 250 kg', unidad: 'unidad', precio: 33900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'guia-porton', cat: 'motor', nombre: 'Guía superior portón corredizo 35 mm nylon', unidad: 'unidad', precio: 34900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'bateria-24v', cat: 'motor', nombre: 'Batería de respaldo 24 V 7 Ah (par de 12 V)', unidad: 'par', precio: 160000, fuente: 'est', fecha: '2026-11-10', nota: 'estimado' },
  { id: 'solar-50w', cat: 'motor', nombre: 'Panel solar 50 W con regulador', unidad: 'kit', precio: 280000, fuente: 'est', fecha: '2026-11-10', nota: 'estimado; en Homecenter solo hay lámparas solares' },
  // herrajes y seguridad
  { id: 'fotocelda', cat: 'herraje', nombre: 'Fotoceldas para portón (par)', unidad: 'par', precio: 79900, fuente: 'ml', fecha: '2026-11-10' },
  { id: 'lampara', cat: 'herraje', nombre: 'Lámpara destellante 24 V', unidad: 'unidad', precio: 65000, fuente: 'ml', fecha: '2026-11-10' },
  { id: 'cerradura-elec', cat: 'herraje', nombre: 'Cerradura eléctrica de sobreponer (combo)', unidad: 'unidad', precio: 425900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'cerradura-ppal', cat: 'herraje', nombre: 'Cerradura principal 4 pasadores con manija', unidad: 'unidad', precio: 362900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'cerradura-sobreponer', cat: 'herraje', nombre: 'Cerradura de sobreponer Yale 105', unidad: 'unidad', precio: 88900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'manija-inox', cat: 'herraje', nombre: 'Manija tubular acero inoxidable 256–316 mm', unidad: 'unidad', precio: 19900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'bisagra-barril', cat: 'herraje', nombre: 'Bisagra de barril 1" soldable', unidad: 'unidad', precio: 12000, fuente: 'est', fecha: '2026-11-10', nota: 'estimado' },
  { id: 'teclado', cat: 'herraje', nombre: 'Teclado de clave para control de acceso', unidad: 'unidad', precio: 180000, fuente: 'ml', fecha: '2026-11-10' },
  { id: 'camara-placas', cat: 'herraje', nombre: 'Cámara lectora de placas (LPR)', unidad: 'unidad', precio: 950000, fuente: 'ml', fecha: '2026-11-10' },
  { id: 'rodachina', cat: 'herraje', nombre: 'Rodachinas de ventana corrediza (par)', unidad: 'par', precio: 24000, fuente: 'est', fecha: '2026-11-10', nota: 'estimado' },
  { id: 'vidrio-6', cat: 'herraje', nombre: 'Vidrio templado 6 mm incoloro', unidad: 'm²', precio: 165000, fuente: 'est', fecha: '2026-11-10', nota: 'estimado vidriería Bogotá' },
  { id: 'anclaje-expansion', cat: 'herraje', nombre: 'Perno de expansión 1/2" × 4"', unidad: 'unidad', precio: 4500, fuente: 'est', fecha: '2026-11-10', nota: 'estimado' },
  // consumibles
  { id: 'electrodo-6013', cat: 'consumible', nombre: 'Electrodo 6013 × 1/8"', unidad: 'kg', precio: 22900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'disco-corte', cat: 'consumible', nombre: 'Disco de corte metal 4½" (set × 10)', unidad: 'set 10', precio: 23900, fuente: 'hc', fecha: '2026-11-10' },
  { id: 'anticorrosivo', cat: 'consumible', nombre: 'Pintura anticorrosiva gris Corrotec', unidad: 'galón', precio: 80900, fuente: 'hc', fecha: '2026-11-10' },
  // servicios
  { id: 'corte-laser', cat: 'servicio', nombre: 'Corte láser de lámina cal. 14', unidad: 'm de corte', precio: 4500, fuente: 'magru', fecha: '2026-11-10', nota: 'derivado de $75/segundo a ~1 m/min, sin material' },
  { id: 'pintura-electro', cat: 'servicio', nombre: 'Pintura electrostática en polvo', unidad: 'm²', precio: 38000, fuente: 'est', fecha: '2026-11-10', nota: 'estimado talleres Bogotá' },
  { id: 'galvanizado', cat: 'servicio', nombre: 'Galvanizado en caliente', unidad: 'kg', precio: 4800, fuente: 'est', fecha: '2026-11-10', nota: 'estimado' },
  // mano de obra e instalación
  { id: 'mano-obra', cat: 'mano', nombre: 'Mano de obra de taller: corte, soldadura y armado', unidad: 'kg fabricado', precio: 6200, fuente: 'est', fecha: '2026-11-10', nota: 'estimado AceroStudio' },
  { id: 'instalacion-porton', cat: 'mano', nombre: 'Instalación de portón eléctrico y puesta en marcha', unidad: 'obra', precio: 600000, fuente: 'cc', fecha: '2026-11-10', nota: 'guía: $300.000 a $900.000' },
  { id: 'instalacion-menor', cat: 'mano', nombre: 'Instalación de puerta, ventana, reja o baranda', unidad: 'obra', precio: 250000, fuente: 'est', fecha: '2026-11-10', nota: 'estimado' },
  { id: 'instalacion-estructura', cat: 'mano', nombre: 'Montaje de estructura liviana', unidad: 'obra', precio: 750000, fuente: 'est', fecha: '2026-11-10', nota: 'estimado' },
];
// Proveedores del taller: ninguno publica precios; se modelan como descuento sobre la lista de referencia (ajustable).
export const PROVEEDORES = {
  mundial: { nombre: 'Mundial de Perfiles', tipo: 'distribuidor · Bogotá (Carvajal, Pastranita, Bosa)', contacto: 'https://wa.me/573105722638', envio: 0, descuento: .08, nota: 'Tableros estampados, perfilería y tubería; corte láser y doblado. No publica precios: cotiza por WhatsApp.' },
  campana: { nombre: 'La Campana', tipo: 'fabricante · 9 sedes en Bogotá y 5 ciudades', contacto: 'https://lacampana.co/productos/', envio: 4000000, descuento: .15, nota: 'Fabrica la tubería y los perfiles (A500, A36); crédito, envío gratis en Bogotá desde $ 4.000.000 y corte de plancha. Tampoco publica precios: cotiza con un asesor.' },
};
const porId = Object.fromEntries(ITEMS.map(i => [i.id, i])), porPerfil = Object.fromEntries(ITEMS.filter(i => i.perfil).map(i => [i.perfil, i]));
const ajustes = {}; // precios cambiados por el usuario (id → precio)
export const BD = {
  actualizado: '2026-11-10', items: ITEMS, fuentes: FUENTES, categorias: CATEGORIAS, ajustes,
  item: id => porId[id], dePerfil: k => porPerfil[k],
  precio(id) { return ajustes[id] ?? porId[id]?.precio ?? 0; },
  ajustar(id, v) { if (v === null || v === undefined || v === '' || +v === porId[id]?.precio) delete ajustes[id]; else ajustes[id] = +v; },
  cargar(o) { for (const [k, v] of Object.entries(o || {})) if (porId[k]) ajustes[k] = +v; },
  csv() { return [['id', 'categoria', 'producto', 'unidad', 'kg', 'precio_cop', 'precio_ajustado', 'fuente', 'fecha', 'nota'], ...ITEMS.map(i => [i.id, CATEGORIAS[i.cat], i.nombre, i.unidad, i.kg ?? '', i.precio, ajustes[i.id] ?? '', FUENTES[i.fuente].nombre, i.fecha, i.nota || ''])].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n'); },
};
