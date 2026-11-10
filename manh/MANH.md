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

El banco inicial tiene 67 preguntas en 14 temas que siguen la ruta de una pieza por el taller: material y compra, leer el trabajo, trazo y corte, doblez, armado, soldadura, pintura, calidad, montaje, seguridad, costos, taller y gente, clientes, y su historia (`manh/js/preguntas.js`).

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
```

## Próximos pasos

- Conectar ManH al módulo **Fábrica** (PR #12): que la planta autónoma consulte a ManH en cada estación (corte, soldadura, pintura) y muestre la regla del Maestro que aplica.
- Sincronizar entre el celular del Maestro y el equipo con una tabla en Supabase, para no mover archivos a mano.
- Transcribir con un servicio de voz a texto los audios que el celular no transcribió.
