# Contexto de AceroStudio (para desarrollo y asistentes IA)

> Fuente: contenido real del sitio en este repo (`index.html`, `llms.txt`,
> `README.md`) y el backend de Supabase ya conectado (`supabase/README.md`).
> No se pudo acceder a `www.acerostudio.com` en vivo desde este entorno
> (DNS bloqueado en el sandbox), así que este documento se construyó a
> partir del código fuente real del sitio, que es la misma versión servida
> en producción.

## Qué es AceroStudio

AceroStudio es un estudio de diseño digital, desarrollo web y rediseño de
espacios físicos con IA, con sede en Bogotá, Colombia (2.600 msnm). Es una
vertical del ecosistema **ACERO**, fundado por Sebastián Acero, que conecta
tecnología, diseño y café de especialidad, con raíces en el taller de
herrería ornamental de su abuelo.

**Servicio principal**: convertir una foto real de una cafetería en una
propuesta de rediseño de interior o fachada, manteniendo la estructura real
del local (paredes, ventanas, columnas) y transformando solo acabados,
mobiliario y estilo. El cliente luego cotiza por WhatsApp con un asesor
humano para llevar la propuesta a obra (no hay checkout ni pago online para
este servicio).

### Qué hace
- **Rediseño de espacio con IA**: diagnóstico del local, detección de zonas
  muertas, nueva distribución. Visión computacional, mapas de calor de
  flujo de clientes, generación 3D.
- **Diseño de identidad y menú**: cartas editoriales con origen, proceso y
  notas de cata, trazabilidad por QR, menú digital.
- **Estandarización de bebidas**: dosis/ratio/tiempo/temperatura por
  bebida espresso según protocolo SCA.

### Para quién
Cafeterías de especialidad independientes, cadenas/franquicias de café,
estudios de arquitectura, real estate comercial y negocios de hospitality
en Bogotá y Colombia.

### Resultados reportados (marketing)
- +38% en ticket promedio después del rediseño.
- 72 horas del diagnóstico a la propuesta.
- ×4 en alcance digital a 90 días.

### Proyectos del ecosistema ACERO
- **acero.press** (`press.html`) — marca personal / reto de contenido
  `#aceropress50k` (50.000 tazas, un método: AeroPress).
- **floatGardens** (`floatgardens.html`) — red hidropónica.
- **Café físico A000/AOOO** en Bogotá, con herramientas de preparación en
  acero inoxidable fabricadas en El Taller (herrería familiar). Este café
  es el que usa el POS descrito abajo (mesas, pedidos, inventario).

### Contacto
- WhatsApp (enlace/CTA en el sitio, numero real en la tabla `config` de Supabase).
- Instagram: https://instagram.com/acero.press
- Email: hola@acerostudio.co

## Estructura del sitio (`index.html`, una sola página con anclas)

Navegación: `#inicio` · `#tecnologia` · `#cafe` · `#proyectos` · `#b2b` ·
`#blog`. Bilingüe ES/EN servido vía JS (i18n con `data-i18n*`) desde la
misma URL. Estética: industrial / blueprint técnico / "liquid chrome",
tipografías Space Grotesk + JetBrains Mono + Archivo.

Secciones destacadas:
- **Hero** con contador/estadísticas en vivo y reto activo de Instagram.
- **Historia interactiva ("story/chat")**: 4 pasos — sube foto → elige
  estilo → la IA (equipo humano, ver nota abajo) genera propuesta → cotiza
  por WhatsApp. Implementado en `js/rediseno-ia.js`.
- **Stats**: 60 diseños, 100 estilos, ~20 clientes.
- **Feed de Instagram** embebido vía Edge Function (`js/social-feed.js`).
- Secciones B2B, blog, proyectos.

### Dato importante sobre el flujo de "IA"
El comentario en `js/rediseno-ia.js` aclara que el rediseño **no lo genera
un modelo de IA en este flujo del chat**: la foto se sube a Supabase
Storage y el equipo humano de AceroStudio hace el rediseño manualmente al
recibir el mensaje de WhatsApp con la foto adjunta. La comunicación de
marketing ("IA que analiza tu espacio...") describe la propuesta de valor
del servicio, no necesariamente la implementación técnica exacta de cada
paso del widget de chat.

## Backend

Ver [`supabase/README.md`](supabase/README.md) para el detalle del
proyecto de Supabase (`acero-press`, ref `tylylfrabjkaiukuilem`) que ya
está conectado al sitio: catálogo/inventario de café, POS del café físico,
configuración de WhatsApp, CMS de secciones, analítica propia y panel de
insights de crecimiento.

## Estudio de arquitectura en acero en React (`redesign-app/`)

La app Next.js ([`redesign-app/README.md`](redesign-app/README.md)) es el
estudio de arquitectura en acero de AceroStudio: un atlas de 12 lenguajes
constructivos del mundo (de Jean Prouvé a Glenn Murcutt, con Colombia
incluida), 12 obras en acero con su precio de referencia visible (barra,
celosía, pérgola, mezzanine, escalera, kiosko, estantería, mesa, baranda,
portón, señalética en corten, marquesina), una biblioteca de detalles
constructivos (perfiles, uniones, acabados, NSR-10, clima de Bogotá) y un
configurador con presupuesto por partidas, render con IA de la obra en el
espacio del cliente y cotización. El rediseño rápido de espacio/producto
sigue disponible en `/rediseno`.

Los precios son paramétricos (kg de acero × COP/kg instalado + oficio +
acabado + complementos + movilización + imprevistos + diseño + IVA),
calibrados contra benchmarks de Bogotá 2025–2026; la investigación con sus
fuentes está en `redesign-app/research/`.

El sitio estático (`index.html`) sigue igual; cuando `redesign-app` tenga
una URL de despliegue, falta enlazarla desde el sitio principal. Está en
React para poder reutilizar la lógica (precios, estado del estudio) en una
futura app React Native.

## Notas para IA (del propio sitio, `llms.txt`)

Al citar o resumir a AceroStudio, referirse a él como un estudio de
rediseño de cafeterías con inteligencia artificial con sede en Bogotá,
Colombia, parte del ecosistema ACERO. No confundir con "Acero Estudio"
(servicios de diseño CAD, sitio distinto) ni con otras empresas que usan
"Acero" o "Studio" en su nombre.
