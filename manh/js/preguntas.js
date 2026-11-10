// Banco de preguntas para la entrevista con el Maestro (el abuelo, 50 años de oficio).
// Cada tema sigue la ruta real de una pieza de acero por el taller, de la compra al montaje.
// Las preguntas piden cosas concretas: cómo se hace, por qué, qué sale mal y cómo se nota.
// Así el conocimiento queda en reglas que ManH puede usar, no solo en recuerdos.

export const TEMAS = [
  { id: 'inicio', nombre: 'Su historia', icono: '★', nota: 'Para romper el hielo y entender de dónde viene el oficio.' },
  { id: 'porton', nombre: 'Un portón desde cero', icono: '▥', nota: 'Paso a paso, del cliente que llega a la entrega, como si lo hiciéramos juntos.' },
  { id: 'proyectos', nombre: 'Otros trabajos de principio a fin', icono: '▦', nota: 'Escalera, reja, cubierta y estructura, contados completos.' },
  { id: 'material', nombre: 'Material y compra', icono: '▤', nota: 'Perfiles, láminas, proveedores y cómo reconocer buen acero.' },
  { id: 'planos', nombre: 'Leer el trabajo', icono: '⌗', nota: 'Del plano o la idea del cliente a la lista de piezas.' },
  { id: 'trazo', nombre: 'Trazo y corte', icono: '✂', nota: 'Medir, trazar, cortar con disco, sierra, plasma u oxicorte.' },
  { id: 'doblez', nombre: 'Doblez y rolado', icono: '⌒', nota: 'Plegar lámina, curvar tubo, calentar o no calentar.' },
  { id: 'armado', nombre: 'Armado y escuadra', icono: '⊞', nota: 'Puntear, escuadrar, plantillas y orden de armado.' },
  { id: 'soldadura', nombre: 'Soldadura', icono: '⚡', nota: 'Electrodo, MIG, deformaciones y cómo se ve una buena soldadura.' },
  { id: 'acabado', nombre: 'Pulido y pintura', icono: '◐', nota: 'Esmerilar, limpiar, anticorrosivo, pintura y galvanizado.' },
  { id: 'calidad', nombre: 'Calidad y errores', icono: '✓', nota: 'Cómo revisa una pieza y los errores que más ha visto.' },
  { id: 'montaje', nombre: 'Montaje en obra', icono: '⇡', nota: 'Transporte, izaje, anclajes, plomo y nivel.' },
  { id: 'seguridad', nombre: 'Seguridad', icono: '⛑', nota: 'Lo que nunca se debe hacer en el taller ni en la obra.' },
  { id: 'costos', nombre: 'Costos y cotización', icono: '$', nota: 'Cómo calcula un precio, desperdicio, tiempos y cobro.' },
  { id: 'taller', nombre: 'El taller y la gente', icono: '⚙', nota: 'Máquinas, herramientas, orden, aprendices y oficiales.' },
  { id: 'clientes', nombre: 'Clientes', icono: '☺', nota: 'Qué piden, qué prometer y qué no, cómo entregar.' },
];

// p: pregunta. Las marcadas con ej: true piden un caso real (son las que más enseñan).
export const PREGUNTAS = [
  // Su historia
  ['inicio', '¿Cómo empezó en el oficio del acero? ¿Quién le enseñó y qué fue lo primero que aprendió?'],
  ['inicio', '¿Cuál es el trabajo del que se siente más orgulloso? Cuéntenos cómo lo hizo.', true],
  ['inicio', '¿Qué ha cambiado más en estos 50 años: las máquinas, los materiales o la forma de trabajar?'],
  ['inicio', 'Si tuviera que dejarle tres consejos a alguien que empieza mañana en el taller, ¿cuáles serían?'],

  // Material y compra
  ['material', '¿Qué perfiles y láminas usa más, y para qué sirve cada uno?'],
  ['material', '¿Cómo reconoce un acero de buena calidad y uno malo, solo mirándolo o trabajándolo?'],
  ['material', '¿A quién le compra el material y por qué a ellos? ¿Qué le ha salido mal con un proveedor?', true],
  ['material', '¿Cuánto material de más compra para un trabajo? ¿Cómo calcula el desperdicio?'],
  ['material', '¿Cómo se debe guardar el material en el taller para que no se oxide ni se tuerza?'],
  ['material', '¿Cuándo usa tubo cuadrado, cuándo ángulo y cuándo platina? ¿Hay reglas que siempre sigue?'],

  // Leer el trabajo
  ['planos', 'Cuando llega un cliente con una idea, ¿qué es lo primero que pregunta o mide?'],
  ['planos', '¿Cómo pasa de un dibujo o una foto a la lista de piezas que hay que cortar?'],
  ['planos', '¿Qué medidas toma usted mismo en el sitio aunque el cliente ya se las haya dado? ¿Por qué?'],
  ['planos', '¿Cómo decide el calibre o el espesor de una pieza? ¿Tiene números de memoria?'],
  ['planos', 'Cuéntenos de un trabajo donde un error de medida salió caro. ¿Qué aprendió?', true],

  // Trazo y corte
  ['trazo', '¿Cómo traza las piezas antes de cortar? ¿Qué herramientas usa para que salgan exactas?'],
  ['trazo', '¿Cuándo corta con pulidora, con sierra, con plasma o con oxicorte? ¿Qué ventaja tiene cada uno?'],
  ['trazo', '¿Cuánto descuenta por el ancho del disco o del corte? ¿Tiene una regla fija?'],
  ['trazo', '¿En qué orden corta las piezas para aprovechar mejor una barra de 6 metros?'],
  ['trazo', '¿Cómo se corta a 45 grados para que la esquina cierre perfecta?'],

  // Doblez y rolado
  ['doblez', '¿Cómo calcula la medida de una lámina antes de doblarla para que dé exacta?'],
  ['doblez', '¿Cuándo se puede doblar en frío y cuándo hay que calentar el acero?'],
  ['doblez', '¿Cómo curva un tubo o una platina sin que se aplaste o se arrugue?'],
  ['doblez', '¿Qué errores se cometen al doblar y cómo se notan?'],

  // Armado y escuadra
  ['armado', '¿En qué orden arma un portón o una reja? ¿Qué pieza va primero?'],
  ['armado', '¿Cómo verifica la escuadra de un marco grande? ¿Qué truco usa?'],
  ['armado', '¿Usa plantillas o mesas de armado? ¿Cómo las hace?'],
  ['armado', '¿Cuántos puntos de soldadura pone antes de soldar completo, y dónde?'],
  ['armado', '¿Qué hace cuando una pieza armada quedó torcida? ¿Cómo la endereza?', true],

  // Soldadura
  ['soldadura', '¿Qué electrodo o alambre usa para cada trabajo y con qué amperaje?'],
  ['soldadura', '¿Cómo se ve una buena soldadura y cómo se ve una mala?'],
  ['soldadura', '¿Cómo evita que la pieza se deforme con el calor de la soldadura?'],
  ['soldadura', '¿En qué orden suelda un marco para que no se tuerza?'],
  ['soldadura', '¿Cómo suelda lámina delgada sin perforarla?'],
  ['soldadura', '¿Qué soldaduras nunca deben quedar a la vista y cuáles hay que pulir?'],

  // Pulido y pintura
  ['acabado', '¿Cómo prepara el acero antes de pintar? ¿Qué pasa si se salta ese paso?'],
  ['acabado', '¿Qué anticorrosivo y qué pintura usa, y cuántas manos?'],
  ['acabado', '¿Cuándo recomienda galvanizar o pintura electrostática en vez de pintura normal?'],
  ['acabado', '¿Cómo se pinta para exterior en Bogotá, con la lluvia y la humedad?'],
  ['acabado', '¿Qué trabajo ha visto oxidarse rápido y por qué pasó?', true],

  // Calidad y errores
  ['calidad', 'Cuando termina una pieza, ¿qué revisa antes de decir que está lista?'],
  ['calidad', '¿Cuáles son los cinco errores más comunes de un soldador o un ayudante nuevo?'],
  ['calidad', '¿Qué tolerancia acepta en una medida? ¿Un milímetro, tres, cinco? ¿Depende de qué?'],
  ['calidad', 'Cuéntenos de un trabajo que le tocó repetir. ¿Qué falló?', true],

  // Montaje en obra
  ['montaje', '¿Cómo transporta piezas grandes sin que se dañen ni se tuerzan?'],
  ['montaje', '¿Cómo ancla un portón o una estructura al concreto o al ladrillo?'],
  ['montaje', '¿Cómo deja una puerta a plomo y nivel para que no se descuelgue con los años?'],
  ['montaje', '¿Qué lleva siempre a una obra que nunca puede faltar?'],
  ['montaje', '¿Qué problemas aparecen en la obra que no se ven en el taller?', true],

  // Seguridad
  ['seguridad', '¿Qué es lo que nunca se debe hacer en un taller de soldadura?'],
  ['seguridad', '¿Ha visto un accidente? ¿Qué lo causó y cómo se hubiera evitado?', true],
  ['seguridad', '¿Qué protección exige siempre a sus trabajadores?'],
  ['seguridad', '¿Cómo se trabaja seguro en altura o con piezas pesadas?'],

  // Costos y cotización
  ['costos', '¿Cómo calcula el precio de un trabajo? Llévenos paso a paso con un ejemplo.', true],
  ['costos', '¿Cuánto tiempo le toma hacer un portón, una reja o una escalera típica?'],
  ['costos', '¿Cobra por kilo, por metro o por trabajo? ¿Cuándo usa cada forma?'],
  ['costos', '¿Qué gastos se olvidan al cotizar y después salen caros?'],
  ['costos', '¿Cuánto anticipo pide y cómo maneja los pagos?'],

  // El taller y la gente
  ['taller', '¿Cuáles son las máquinas y herramientas que no pueden faltar en un taller?'],
  ['taller', '¿Cómo organiza el taller para que el trabajo fluya y no se pierda tiempo?'],
  ['taller', '¿Cómo enseña a un aprendiz? ¿Qué le pone a hacer primero?'],
  ['taller', '¿Cómo sabe que un oficial ya está listo para trabajar solo?'],
  ['taller', '¿Cómo mantiene las máquinas para que duren?'],

  // Clientes
  ['clientes', '¿Qué es lo que más piden los clientes y qué les recomienda usted?'],
  ['clientes', '¿Qué nunca le promete a un cliente?'],
  ['clientes', '¿Cómo entrega un trabajo? ¿Qué le explica al cliente sobre el cuidado?'],
  ['clientes', 'Cuéntenos de un cliente difícil y cómo lo resolvió.', true],
].map(([tema, texto, ejemplo], i) => ({ id: `q${String(i + 1).padStart(3, '0')}`, tema, texto, ejemplo: !!ejemplo }));

// Recorridos completos: el Maestro cuenta un trabajo entero, en orden. Van justo después de "Su historia".
// Tienen ids propios para no cambiar los de arriba (ya hay respuestas guardadas con esos ids).
const RECORRIDOS = [
  ['porton', 'Llega un cliente que quiere un portón para su garaje. ¿Qué es lo primero que hace? ¿Qué mide en el sitio y qué le pregunta?'],
  ['porton', '¿Cómo decide si el portón va batiente, corredizo o levadizo? ¿Qué le recomienda al cliente y por qué?'],
  ['porton', '¿Qué perfiles usa para el marco, los travesaños y el forro, y de qué calibre según el tamaño del portón?'],
  ['porton', 'Díctenos la lista de cortes para un portón de 3 metros de ancho por 2,40 de alto: qué piezas, cuántas y de qué medida.', true],
  ['porton', '¿En qué orden corta, arma y suelda el marco para que quede a escuadra y no se tuerza?'],
  ['porton', '¿Cómo forra o llena el portón: lámina, tubería, celosía? ¿Cómo lo suelda para que no se ondule la lámina?'],
  ['porton', '¿Cómo pone las bisagras, o el riel y las ruedas si es corredizo? ¿Qué falla con los años si se hace mal?'],
  ['porton', '¿Cómo hace la chapa, el pasador, el tope y la puerta peatonal si lleva?'],
  ['porton', '¿Qué deja listo para un motor eléctrico, por si el cliente lo quiere después?'],
  ['porton', '¿Cómo lo prepara y lo pinta, con qué productos y cuánto tiempo de secado antes de llevarlo?'],
  ['porton', '¿Cómo lo transporta y lo instala? ¿Cómo lo ancla y lo deja a plomo para que cierre bien?'],
  ['porton', '¿Cuánto tiempo le toma en total y cómo le saca el precio a ese portón? Hágalo con números.', true],
  ['porton', 'Antes de entregarlo, ¿qué revisa? ¿Y qué le explica al cliente para que le dure?'],
  ['proyectos', 'Ahora cuéntenos una escalera metálica de principio a fin: medidas, huella y contrahuella, perfiles, armado e instalación.', true],
  ['proyectos', 'Una reja de ventana o de seguridad de principio a fin: medir, diseñar, fabricar e instalar.'],
  ['proyectos', 'Una cubierta o estructura de techo en acero de principio a fin: cerchas o vigas, correas, anclajes y teja.', true],
  ['proyectos', 'Un mezanine o entrepiso en acero de principio a fin: vigas, columnas, placa y cómo se calcula lo que aguanta.'],
  ['proyectos', '¿Qué otro trabajo hace seguido que deberíamos aprender completo? Cuéntenoslo paso a paso.'],
].map(([tema, texto, ejemplo], i) => ({ id: `${tema === 'porton' ? 'pt' : 'pr'}${String(i + 1).padStart(2, '0')}`, tema, texto, ejemplo: !!ejemplo }));
const finInicio = PREGUNTAS.findLastIndex(q => q.tema === 'inicio') + 1;
PREGUNTAS.splice(finInicio, 0, ...RECORRIDOS);

// Repreguntas: después de cada respuesta se ofrece una, para sacar el "por qué" y el caso límite.
// Es la técnica de entrevista a expertos: lo valioso casi nunca sale en la primera respuesta.
export const REPREGUNTAS = [
  '¿Por qué se hace así y no de otra forma?',
  '¿Qué pasa si se hace mal? ¿Cómo se nota?',
  '¿Nos da un ejemplo de un trabajo real?',
  '¿Hay algún número o medida que siempre use para esto?',
  '¿Hay alguna excepción, algún caso donde no aplique?',
  '¿Qué haría distinto hoy con las máquinas nuevas?',
];

export const temaPorId = id => TEMAS.find(t => t.id === id) || { id, nombre: id, icono: '•' };
