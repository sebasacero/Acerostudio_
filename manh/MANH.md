# ManH · jefe de planta de AceroStudio

ManH es el agente encargado del funcionamiento de la fábrica y de todo el proceso productivo de AceroStudio.
Su conocimiento viene del **Maestro**: el abuelo de la familia, con 50 años de oficio en acero.

## Cómo aprende ManH (el método)

Hablar es lo más natural para alguien con 50 años de oficio, así que la captura es una **entrevista guiada por voz**, no un formulario:

1. **Conversar** (`manh/` en el celular del Maestro). La app le lee una pregunta en voz alta; él toca un botón grande y responde hablando, como si le explicara a un aprendiz. Se guarda su voz completa y, cuando el navegador puede, el texto al mismo tiempo. Si una pieza se explica mejor viéndola, toma una foto.
2. **Repreguntar.** Después de cada respuesta la app ofrece una repregunta corta: ¿por qué?, ¿qué pasa si se hace mal?, ¿un caso real?, ¿qué medida usa? Lo valioso de un experto casi nunca sale en la primera respuesta.
3. **Sesiones cortas.** Cada cinco respuestas la app le propone descansar. Quince o veinte minutos al día rinden más que una tarde entera.
4. **El chat con el equipo.** En la vista *Equipo*, cualquiera deja una pregunta para el Maestro ("¿cómo se suelda la bisagra para que no se descuelgue?"). Le sale de primera en su próxima conversación. Ese es el chat: ustedes escriben cuando necesitan algo y él contesta hablando cuando quiere.
5. **Revisar.** El equipo escucha cada audio, corrige la transcripción, escribe la regla en una línea y la clasifica (regla, dato, advertencia, historia, truco). Lo revisado pesa más cuando ManH responde.
6. **Cerrar el ciclo.** Cuando a ManH le preguntan algo que no sabe, lo dice y ofrece "Preguntárselo al Maestro"; la pregunta queda en la lista. Así ManH aprende justo lo que la fábrica necesita.

El banco inicial tiene 85 preguntas en 16 temas (incluye "Un portón desde cero" paso a paso) que siguen la ruta de una pieza por el taller: material y compra, leer el trabajo, trazo y corte, doblez, armado, soldadura, pintura, calidad, montaje, seguridad, costos, taller y gente, clientes, y su historia (`manh/js/preguntas.js`).

## Dónde queda el conocimiento

- En el dispositivo donde se graba (IndexedDB): respuestas, audios y fotos.
- **Base de ManH (.json)**, formato `acerostudio.manh/1`: lo que lee el agente.
- **Manual del Maestro (.md)**: el mismo conocimiento como libro, legible para cualquier persona y para cualquier modelo de IA.
- **Paquete con audios y fotos (.json)**: respaldo completo. En el celular se comparte por WhatsApp, correo o Drive; en el computador se importa en *Equipo → Importar paquete*.

Guarden siempre los audios originales: son la voz del abuelo y la fuente de verdad si una transcripción quedó mal.

## Cómo responde ManH

Sin servicio de IA (por defecto, sin costo): busca en las respuestas del Maestro y responde citando sus palabras, con el audio a un toque. Si no encuentra nada, dice que no sabe.

Con servicio de IA (opcional, función `supabase/functions/manh`, **no desplegada**): la búsqueda elige los fragmentos y el modelo redacta la respuesta usando solo esos fragmentos, con estas instrucciones:

```text
Eres ManH, jefe de planta de AceroStudio, una fábrica de estructuras y ornamentación en acero en Bogotá.
Tu conocimiento viene del Maestro, con 50 años de oficio. Responde solo con lo que está en los fragmentos
que te da el sistema, en español claro de taller, en frases cortas y con números concretos cuando los haya.
Di siempre de dónde sale ("Como enseña el Maestro…"). Si los fragmentos no alcanzan, dilo y propone
preguntárselo al Maestro; nunca inventes medidas, amperajes, espesores ni precios.
En seguridad, si hay riesgo para una persona, dilo primero.
Habla como habla el Maestro: en plural de taller ("hacemos", "compramos", "elaboramos"), directo, con frases
cortas y sin adornos. Usa sus palabras del oficio: elaborar, la obra, peinazo, perfil cuatro por ocho, tronzadora,
desperdicio, anticipo. Valores que siempre pesan en tus respuestas, porque son los suyos: responsabilidad con el
cliente, buena inversión de los anticipos, calidad en el trabajo, y lo que se fabrica tiene que funcionar
("si no sube, no baja o no corre, algo quedó mal instalado"). Prefiere lo probado (los mismos proveedores, por
calidad y precio) y ve las máquinas nuevas como una mejora, no como una amenaza. Tono sereno y respetuoso.
```

Esa forma de hablar y esos valores salen de sus primeras 14 respuestas (transcritas con ElevenLabs el 2026-11-10). Se afinan a medida que cuente más.

## Estructura del agente

ManH tiene cuatro piezas. El código está en `manh/js/agente.js` (reglas y herramientas) y `manh/js/oficio.js` (cálculos del oficio).

| Pieza | Qué es | Dónde vive |
| --- | --- | --- |
| Fuentes | 1) lo que dijo el Maestro y el equipo revisó, 2) lo que dijo sin revisar, 3) base técnica general. Cuando dos fuentes chocan, gana la de más arriba. | `manh_respuestas` en Supabase · `oficio.js` |
| Herramientas | `buscar_conocimiento`, `cotizar_corte_laser`, `angulo_de_corte`, `donde_soldar`, `preguntar_al_maestro`, cada una con su esquema JSON para un modelo con uso de herramientas. | `HERRAMIENTAS` en `agente.js` |
| Reglas | Seguridad primero; citar al Maestro; si solo hay base técnica, decirlo y ofrecer preguntárselo; nunca inventar medidas, amperajes ni precios; hablar como el taller. | `REGLAS` en `agente.js` y el prompt de arriba |
| Enrutador | Sin IA, lee la pregunta y elige la herramienta (por ejemplo, "cuánto cuesta cortar con láser 3 m en 2 mm" va a `cotizar_corte_laser`). Con IA, el modelo elige con los esquemas. | `enrutar()` en `agente.js` |

Toda respuesta que sale de la base técnica lleva el aviso "por confirmar con el Maestro" y un botón para dejarle la pregunta. Así la base técnica se va reemplazando por su experiencia.

### Base técnica inicial

- **Corte láser:** precio por tiempo de máquina. Tiempo = metros de corte ÷ velocidad según espesor + perforaciones × (tiempo de perforación + 1,5 s). Tarifa de referencia $75 por segundo (Magru, Bogotá), alistamiento $15.000 y mínimo $30.000 por pedido (supuestos ajustables). Velocidades de un láser de fibra de 3 kW en acero al carbono, de 22 m/min en 1,2 mm a 0,9 m/min en 12 mm.
- **Ángulos:** inglete = la mitad del ángulo interior; en la sierra se pone 90° menos eso. Marco de n lados: ángulo interior 180·(n−2)/n.
- **Soldadura:** dónde y en qué orden por tipo de trabajo (portón, reja, viga, cercha, escalera, lámina), filete mínimo según AWS D1.1 y electrodo por espesor.

## Próximos pasos

- Conectar ManH al módulo **Fábrica** (PR #12): que la planta autónoma consulte a ManH en cada estación (corte, soldadura, pintura) y muestre la regla del Maestro que aplica.
- Pasar a texto en la nube, solas, las grabaciones nuevas: `manh-sync` ya lo hace si existe el secreto `ELEVENLABS_API_KEY` (falta desplegar esta versión y poner el secreto).
- Cotizaciones reales de corte láser para ajustar la tarifa, el mínimo y las velocidades.
