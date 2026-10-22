import type { Complement, Connection, Finish, Material, Profile, Work } from "../types.ts";

// Generado desde la investigación de precios (Bogotá, 2025–2026) y la calibración descrita en README.md.
export const MATERIALS: Material[] = [
  {
    "id": "acero-estructural",
    "name": "Acero estructural ASTM A36 / A572 Gr50 (perfiles, tubería estructural HR50, platina, lámina HR)",
    "short": "acero estructural A36/A572",
    "materialPerKg": {
      "low": 4000,
      "high": 6500
    },
    "installedPerKg": {
      "low": 11000,
      "high": 28000
    },
    "finishIds": [
      "anticorrosivo-esmalte",
      "epoxico-poliuretano",
      "electrostatica",
      "galvanizado-caliente"
    ],
    "notes": "Material: un distribuidor publica 4.200–5.200 COP/kg para perfilería y tubería (2026). Al detal, Homecenter Bogotá vende tubo HR50 de 6 m así: 120x60x2 mm a 174.300 COP (~33 kg, ≈5.250 COP/kg), 60x60x2 a 130.300 COP (≈5.950 COP/kg), 50x50x2 a 115.900 COP (≈6.400 COP/kg) y 70x70x2 a 189.900 COP (~25,6 kg, ≈7.400 COP/kg). El techo de 6.500 refleja la compra al detal o en volúmenes pequeños, que es lo típico de un estudio. Fabricado+instalado (con pintura, transporte y montaje): MEISA (fabricante, guía 2026) da 10.900–13.000 COP/kg para estructura estándar tipo bodega, 13.000–17.000 para edificación o entrepiso y 17.000–25.000 para estructura especial. MEISA advierte que el precio por kg sube con la complejidad y no con el peso, y que baja con el tonelaje. Por eso el trabajo arquitectónico pequeño y a la vista (barras, celosías, escaleras) queda en la franja alta o por encima, y el techo se fija en 28.000. El SMMLV 2026 subió ~23% (1.750.905 COP), lo que encarece la mano de obra frente a 2025.",
    "confidence": "media"
  },
  {
    "id": "acero-corten",
    "name": "Acero patinable / corten ASTM A588 / A242 (lámina y platina)",
    "short": "acero corten",
    "materialPerKg": {
      "low": 7500,
      "high": 13000
    },
    "installedPerKg": {
      "low": 20000,
      "high": 42000
    },
    "finishIds": [
      "patina-corten"
    ],
    "notes": "No hay lista de precios colombiana: una búsqueda de verificación (oct-2026) solo devolvió proveedores mexicanos. En Colombia el corten casi no se produce en formatos arquitectónicos y se importa, o se pide a distribuidores de aceros planos. Lo estimé en 1,7–2,5 veces el precio del A36, más mínimos de compra por lámina. Para fabricarlo hacen falta electrodos o alambre compatibles (de baja aleación, patinables) y suele cortarse con láser; de ahí el rango fabricado más alto. No incluye pátina acelerada.",
    "confidence": "baja"
  },
  {
    "id": "acero-galvanizado",
    "name": "Acero galvanizado (lámina/tubería galvanizada de fábrica o perfil galvanizado en caliente tras fabricación)",
    "short": "acero galvanizado",
    "materialPerKg": {
      "low": 5000,
      "high": 7500
    },
    "installedPerKg": {
      "low": 14000,
      "high": 30000
    },
    "finishIds": [
      "electrostatica",
      "epoxico-poliuretano"
    ],
    "notes": "MinCIT fijó el 22-ene-2025 un antidumping definitivo a la lámina galvanizada y galvalume china: 41,74% en lámina lisa de hasta 2,5 mm y 94,64% en las subpartidas 7210.41 y 7210.61 (corrugada/bobina), sobre valor FOB. Aparte, un examen quinquenal mantiene 47,62% sobre la lámina lisa galvanizada 7210.49. Estas medidas sostienen el precio local. El rango fabricado+instalado supone galvanizado en caliente después de fabricar (≈2.000–3.800 COP/kg adicionales) y reparación de soldaduras con galvanizado en frío. El rango de material es estimado: no hay lista colombiana verificable.",
    "confidence": "baja"
  },
  {
    "id": "acero-inox-304",
    "name": "Acero inoxidable AISI 304 (lámina 2B/satinada, tubo, platina)",
    "short": "acero inoxidable 304",
    "materialPerKg": {
      "low": 13000,
      "high": 20000
    },
    "installedPerKg": {
      "low": 45000,
      "high": 95000
    },
    "finishIds": [
      "inox-cepillado"
    ],
    "notes": "G&J (Bogotá) vende lámina 304 2B de 1220x2440. La de 1,5 mm cuesta 510.859 COP (~35,4 kg, ≈14.400 COP/kg) y la de 1,2 mm 413.729 COP (≈14.600 COP/kg), pero la publicación tiene ~340 días. El tubo ornamental y la lámina satinada o espejo cuestan más por kg, y el precio sigue al níquel. Fabricado: soldadura TIG, decapado y pulido, con mano de obra 2–3 veces la del acero al carbono. Referencia de mercado (Comando 2026): baranda en inox 304 instalada desde 280.000 COP/ml en Bogotá y 350.000–500.000 COP/ml en Medellín.",
    "confidence": "baja"
  }
];

export const FINISHES: Finish[] = [
  {
    "id": "anticorrosivo-esmalte",
    "name": "Anticorrosivo alquídico + esmalte sintético",
    "unit": "m2",
    "price": {
      "low": 15000,
      "high": 38000
    },
    "description": "Limpieza mecánica (SSPC-SP2/SP3), 2 manos de anticorrosivo alquídico (≈50 µm) y 2 de esmalte sintético (≈50 µm). Es el sistema más económico; en Bogotá el UV alto lo decolora y la condensación nocturna acelera la corrosión en bordes y soldaduras.",
    "durabilityYears": {
      "low": 3,
      "high": 8
    },
    "maintenance": "En exterior: retoques anuales en golpes y bordes, repintura completa cada 3–5 años. En interior: repintura cada 7–8 años.",
    "bestFor": "Interiores secos, mobiliario y estructura oculta con presupuesto ajustado.",
    "confidence": "baja"
  },
  {
    "id": "epoxico-poliuretano",
    "name": "Sistema epóxico + poliuretano alifático",
    "unit": "m2",
    "price": {
      "low": 38000,
      "high": 85000
    },
    "description": "Chorro abrasivo a grado SA 2½ (SSPC-SP10), imprimante epóxico rico en zinc o epoxi-poliamida (≈75 µm), intermedio epóxico de alto espesor (≈100 µm) y acabado de poliuretano alifático resistente al UV (≈50–75 µm). Sistema de 200–250 µm para corrosividad C3, durabilidad alta según ISO 12944.",
    "durabilityYears": {
      "low": 12,
      "high": 20
    },
    "maintenance": "Lavado con agua y jabón neutro 1–2 veces al año; inspección anual y retoque inmediato de golpes; nueva capa de poliuretano hacia los 8–10 años para recuperar color y brillo.",
    "bestFor": "Estructura a la vista en exterior: pérgolas, marquesinas, escaleras, mezzanines y fachadas de alto tráfico.",
    "confidence": "baja"
  },
  {
    "id": "electrostatica",
    "name": "Pintura electrostática en polvo (poliéster)",
    "unit": "m2",
    "price": {
      "low": 25000,
      "high": 65000
    },
    "description": "Desengrase, fosfatado o pretratamiento nanocerámico y polvo poliéster de grado exterior (60–80 µm) curado en horno a 180–200 °C. Acabado uniforme con amplia gama RAL y texturas. El tamaño de pieza está limitado por el horno (típicamente 6 m de largo).",
    "durabilityYears": {
      "low": 8,
      "high": 15
    },
    "maintenance": "Limpieza con paño húmedo y jabón neutro; no usar solventes ni abrasivos. Los daños se retocan con pintura líquida compatible (no se puede repolvorear en sitio). En exterior se recomienda sobre galvanizado (sistema dúplex).",
    "bestFor": "Mobiliario, barras, estanterías, mesas, barandas y portones con color de marca.",
    "confidence": "baja"
  },
  {
    "id": "galvanizado-caliente",
    "name": "Galvanizado por inmersión en caliente",
    "unit": "kg",
    "price": {
      "low": 2000,
      "high": 3800
    },
    "description": "Inmersión de la pieza terminada en zinc fundido (ASTM A123 / ISO 1461), con recubrimiento metalúrgico de 70–100 µm que protege también por dentro de los tubos. En atmósfera urbana C2–C3 como la de Bogotá el zinc se consume lentamente. Exige diseñar perforaciones de venteo/drenaje y limita el tamaño de la pieza a la cuba.",
    "durabilityYears": {
      "low": 30,
      "high": 60
    },
    "maintenance": "Prácticamente nulo: inspección cada 2–3 años y retoque de cortes o soldaduras de obra con pintura rica en zinc. Para color, aplicar dúplex (galvanizado + electrostática o poliuretano).",
    "bestFor": "Exteriores expuestos: fachadas, pérgolas, marquesinas, portones, estructura de kioskos y subestructuras ocultas.",
    "confidence": "baja"
  },
  {
    "id": "patina-corten",
    "name": "Pátina natural o acelerada de acero corten",
    "unit": "m2",
    "price": {
      "low": 25000,
      "high": 75000
    },
    "description": "Capa de óxido estable y adherente que se forma en aceros ASTM A588/A242 con ciclos de mojado y secado. Puede acelerarse con soluciones oxidantes en taller. En Bogotá, por la humedad persistente y el secado lento, la pátina tarda 2–4 años en estabilizarse y no se forma bien en zonas resguardadas o permanentemente húmedas; en interiores requiere pátina acelerada y sellado.",
    "durabilityYears": {
      "low": 20,
      "high": 50
    },
    "maintenance": "Mantener drenajes libres y evitar hojas o tierra acumuladas; controlar la escorrentía de óxido (goteros, gravilla). En interior, renovar el sellador (barniz o cera) cada 1–2 años. No pintar parcialmente.",
    "bestFor": "Señalética, celosías y fachadas expuestas a la lluvia y bien ventiladas, jardineras y piezas escultóricas.",
    "confidence": "baja"
  },
  {
    "id": "inox-cepillado",
    "name": "Acero inoxidable 304 cepillado",
    "unit": "m2",
    "price": {
      "low": 30000,
      "high": 95000
    },
    "description": "Acabado satinado (grano 180–320) sobre AISI 304; resiste el contacto con alimentos, el café y la limpieza frecuente. Después de soldar exige decapado y pasivado. En exterior con contaminación vehicular puede presentar manchas superficiales (tea staining); para ese caso se recomienda 316.",
    "durabilityYears": {
      "low": 25,
      "high": 50
    },
    "maintenance": "Limpieza con agua y detergente neutro en el sentido del grano, de 2 a 4 veces al año en exterior. Evitar lana de acero común y cloro. Repasivar si aparecen puntos de óxido.",
    "bestFor": "Barras de café, frentes de servicio, mesas de trabajo, pasamanos y piezas en contacto con alimentos o con alto tráfico de manos.",
    "confidence": "baja"
  },
  {
    "id": "intumescente",
    "name": "Pintura intumescente (protección contra fuego)",
    "unit": "m2",
    "price": {
      "low": 35000,
      "high": 240000
    },
    "description": "Recubrimiento que se expande con el calor y aísla el acero durante 30–90 minutos (R30–R90), con espesor según el factor de sección Hp/A. Va sobre un imprimante compatible y con acabado de sello. La base agua es solo para interior; para exterior se usa base solvente o epóxica.",
    "durabilityYears": {
      "low": 10,
      "high": 20
    },
    "maintenance": "Inspección anual de golpes y desprendimientos; reparar con el mismo producto hasta el espesor certificado; renovar la capa de acabado cada 5–8 años. No lijar ni perforar sin reparar.",
    "bestFor": "Estructura principal de mezzanines y escaleras en locales con público, cuando el Título J de NSR-10 exige resistencia al fuego.",
    "confidence": "baja"
  }
];

export const COMPLEMENTS: Complement[] = [
  {
    "id": "tablero-madera",
    "name": "Tablero de madera (maciza tipo flor morado/roble/teca o contrachapado premium, 30–50 mm, con laca o aceite)",
    "unit": "m2",
    "price": {
      "low": 250000,
      "high": 950000
    },
    "notes": "El extremo bajo es contrachapado o madera de reforestación (pino o eucalipto tratado); el alto, madera maciza tropical certificada con acabado poliuretano o aceite. Estimación propia, sin fuente directa."
  },
  {
    "id": "tablero-cuarzo",
    "name": "Tablero / mesón de cuarzo aglomerado (12–30 mm) instalado",
    "unit": "m2",
    "price": {
      "low": 900000,
      "high": 1900000
    },
    "notes": "IKEA Colombia vende el mesón a medida en cuarzo de 1,2 cm de espesor, no de 20–30 mm, a 850.000–1.600.000 COP/m² (ODENSBERG blanco ≈1.250.000; RYDSNÄS 1.600.000), solo material: la instalación y la personalización se cobran aparte. Una guía de Ibagué de 2026 da 550.000–1.000.000+ COP por ml instalado (≈0,6 m de fondo, es decir ≈920.000–1.670.000 COP/m²; la conversión es mía). Las marcas premium, los espesores de 20–30 mm, los cantos especiales o el lavaplatos bajo cubierta suben al techo del rango."
  },
  {
    "id": "vidrio-templado",
    "name": "Vidrio templado o laminado de seguridad 8–10 mm (o 4+4 / 5+5 laminado) instalado",
    "unit": "m2",
    "price": {
      "low": 280000,
      "high": 750000
    },
    "notes": "Diseños y Estructuras JH (Bogotá) publica marquesina en vidrio laminado 3+3 desde 450.000 COP/m² + IVA, sobre aluminio, y ofrece templado de 8, 10 y 12 mm. El piso de 280.000 COP/m² (templado simple en puerta o divisiones) no se pudo verificar en la fuente. Para cubiertas o marquesinas conviene laminado templado (8+8 o más), que cuesta más. No incluye la estructura de acero ni los herrajes especiales tipo spider."
  },
  {
    "id": "policarbonato",
    "name": "Policarbonato alveolar 6–10 mm o compacto 4–6 mm (solo cerramiento + perfilería de fijación)",
    "unit": "m2",
    "price": {
      "low": 70000,
      "high": 300000
    },
    "notes": "Incremento solo por la lámina. Según la tabla de pérgolas de Comando (2026), la pérgola abierta cuesta 300–420k/m², con alveolar 6 mm 480–600k/m² y con compacto 4 mm 580–720k/m²: el delta va de ≈180k (alveolar) a ≈300k/m² (compacto). El alveolar básico con perfil H/U parte de ~70k/m² (estimación propia)."
  },
  {
    "id": "lamina-perforada",
    "name": "Lámina perforada en acero (cal. 18–14), cortada, fijada a bastidor",
    "unit": "m2",
    "price": {
      "low": 200000,
      "high": 520000
    },
    "notes": "Vialambre (Bogotá) vende la lámina perforada cal. 18 de 2x1 m a 391.100 COP con IVA (≈195.000 COP/m², solo material); otra publicación la da a 365.099 COP. Es una lámina tipo exhibidor (cold rolled), no un panel arquitectónico. El extremo alto suma corte a medida, plegado de bordes e instalación sobre la subestructura. No incluye pintura; el bastidor estructural se cobra aparte."
  },
  {
    "id": "steel-deck-concreto",
    "name": "Losa en steel deck (lámina colaborante cal. 22–20) + malla electrosoldada + concreto 3000 psi, e≈10–12 cm",
    "unit": "m2",
    "price": {
      "low": 150000,
      "high": 300000
    },
    "notes": "Solo la losa, sin las vigas de acero (esas se cuentan por kg). No encontré precio colombiano publicado: es una estimación propia para Bogotá (lámina, malla, concreto, conectores y mano de obra). Se quitó la referencia brasileña (SINAPI) porque no se pudo verificar."
  },
  {
    "id": "led-lineal",
    "name": "Iluminación LED lineal (perfil de aluminio con difusor + cinta 24V + driver + instalación)",
    "unit": "ml",
    "price": {
      "low": 60000,
      "high": 220000
    },
    "notes": "El extremo bajo es cinta comercial con perfil básico; el alto, cinta de alto CRI (≥90) con perfil empotrado o un sistema dimerizable. Estimación propia, sin fuente directa."
  },
  {
    "id": "anclajes-quimicos",
    "name": "Anclaje químico (varilla roscada 1/2\"–5/8\" + adhesivo epóxico tipo HIT/Sikadur), perforación e instalación",
    "unit": "und",
    "price": {
      "low": 35000,
      "high": 120000
    },
    "notes": "Precio por punto de anclaje. Una placa base con 4 anclajes suele costar 150k–450k. Si el anclaje es estructural, lo tiene que definir un ingeniero bajo NSR-10. Estimación propia."
  },
  {
    "id": "corte-laser-cnc",
    "name": "Corte láser / CNC de patrón decorativo en lámina de acero 2–6 mm (solo corte)",
    "unit": "m2",
    "price": {
      "low": 70000,
      "high": 480000
    },
    "notes": "Los talleres de Bogotá cobran por tiempo de corte, no por m². Magru (Fontibón) publica desde 75 COP por segundo sin material (≈4.500 COP/min, ≈270.000 COP/h) y corta CR cal. 24–14 y HR de 3 mm a 3/8\". La conversión a m² es mía: un patrón simple (~15 min/m²) sale en ≈70k/m², y uno denso con muchas perforaciones en 6 mm (60–100 min/m²) llega a 270–480k/m². Hay que sumar el material, el archivo vectorial y los mínimos por pedido."
  }
];

export const WORKS: Work[] = [
  {
    "id": "barra-cafe",
    "name": "Barra de café en acero",
    "category": "Mobiliario de servicio",
    "unit": "ml",
    "description": "Barra de servicio con bastidor de tubo estructural, frente en lámina lisa, perforada o calada y tablero de madera o cuarzo. Toma referencias de los bares de pie italianos (banco de espresso), los kissaten japoneses de madera y metal oscuro, y la herencia de la ornamentación forjada de El Taller.",
    "quantity": {
      "default": 4,
      "min": 1.5,
      "max": 15,
      "step": 0.5
    },
    "structuralSystem": "Bastidor espacial de tubo cuadrado con montantes cada 0,60 m, travesaños superiores e inferiores, ángulos de apoyo para el tablero y anclaje a piso con placas y anclajes químicos. Altura de 1,05–1,10 m y fondo de 0,60–0,70 m.",
    "profiles": [
      "Tubo cuadrado 50x50x2",
      "Tubo cuadrado 40x40x2",
      "Ángulo L 1-1/2\" x 1/8\"",
      "Tubo redondo 1-1/2\" (48,3 mm) x 2.0"
    ],
    "connectionIds": [
      "soldadura-filete",
      "placa-base-anclaje-quimico",
      "anclaje-mecanico-expansivo"
    ],
    "materialIds": [
      "acero-estructural",
      "acero-inox-304",
      "acero-corten",
      "acero-galvanizado"
    ],
    "defaultMaterialId": "acero-estructural",
    "defaultFinishId": "electrostatica",
    "kgPerUnit": {
      "low": 35,
      "high": 65
    },
    "fabricationGrade": 0.85,
    "mobilization": 1000000,
    "finishAreaPerUnit": 4.5,
    "complements": [
      {
        "id": "tablero-madera",
        "qtyPerUnit": 0.65,
        "optional": false
      },
      {
        "id": "tablero-cuarzo",
        "qtyPerUnit": 0.65,
        "optional": true,
        "replaces": "tablero-madera"
      },
      {
        "id": "lamina-perforada",
        "qtyPerUnit": 1,
        "optional": true
      },
      {
        "id": "led-lineal",
        "qtyPerUnit": 1,
        "optional": true
      },
      {
        "id": "corte-laser-cnc",
        "qtyPerUnit": 0.3,
        "optional": true
      },
      {
        "id": "anclajes-quimicos",
        "qtyPerUnit": 2,
        "optional": false
      }
    ],
    "fireProtectionApplies": false,
    "nsr10": "Se considera elemento no estructural (NSR-10 A.9): debe anclarse al piso para resistir la fuerza sísmica de diseño Fp, sobre todo si carga una máquina de espresso (60–90 kg) o molinos. Verificar el soporte de los equipos y que no haya volcamiento.",
    "maintenance": "Limpieza diaria con detergente neutro; en zonas de salpicadura de agua y leche preferir inox 304 o epóxico. Revisar los sellos del tablero y los retoques de pintura en el zócalo (golpes de pies y traperos) cada 6 meses.",
    "fabricationDays": {
      "low": 8,
      "high": 15
    },
    "weightRationale": "Por ml: ≈9,6 m de tubo 50x50x2 (2,93 kg/m) ≈ 28 kg, más frente en lámina cal. 16 (11,8 kg/m² x 1,05 m²) ≈ 12 kg, más reposapiés y ángulos (≈4 kg). Con frente calado o inox el peso sube a ≈65 kg/ml.",
    "benchmarkPerUnit": {
      "low": 1200000,
      "high": 5500000
    }
  },
  {
    "id": "fachada-celosia",
    "name": "Fachada / celosía metálica",
    "category": "Envolvente",
    "unit": "m2",
    "description": "Piel de lamas, platinas o lámina perforada/calada sobre una subestructura anclada a la edificación; filtra luz, da privacidad y construye identidad. Inspirada en la mashrabiya árabe, el jali indio y las celosías modernistas de Brasil y México, reinterpretadas en acero.",
    "quantity": {
      "default": 20,
      "min": 4,
      "max": 300,
      "step": 1
    },
    "structuralSystem": "Subestructura de montantes de tubo rectangular cada 1,0–1,2 m anclados a losas o vigas (no a mampostería no reforzada), con agujeros ovalados que absorben la deriva sísmica; sobre ella van lamas de platina cada 80–120 mm o paneles de lámina perforada o calada por CNC.",
    "profiles": [
      "Tubo rectangular 100x50x2",
      "Tubo cuadrado 75x75x3",
      "Platina 2\" x 1/4\"",
      "Platina 1-1/2\" x 1/4\"",
      "Ángulo L 2\" x 1/4\""
    ],
    "connectionIds": [
      "soldadura-filete",
      "placa-base-anclaje-quimico",
      "anclaje-mecanico-expansivo",
      "pernada-a325-cortante",
      "pasador-pivote"
    ],
    "materialIds": [
      "acero-estructural",
      "acero-corten",
      "acero-galvanizado",
      "acero-inox-304"
    ],
    "defaultMaterialId": "acero-estructural",
    "defaultFinishId": "galvanizado-caliente",
    "kgPerUnit": {
      "low": 15,
      "high": 40
    },
    "fabricationGrade": 0.55,
    "mobilization": 2500000,
    "finishAreaPerUnit": 2,
    "complements": [
      {
        "id": "lamina-perforada",
        "qtyPerUnit": 1,
        "optional": true
      },
      {
        "id": "corte-laser-cnc",
        "qtyPerUnit": 1,
        "optional": true
      },
      {
        "id": "anclajes-quimicos",
        "qtyPerUnit": 0.8,
        "optional": false
      },
      {
        "id": "led-lineal",
        "qtyPerUnit": 0.3,
        "optional": true
      }
    ],
    "fireProtectionApplies": false,
    "nsr10": "Elemento no estructural de fachada (NSR-10 A.9): se diseña para la fuerza sísmica Fp y el viento (Título B, B.6), y sus anclajes deben acomodar la deriva de piso sin desprenderse. Los anclajes van a concreto. Cambiar una fachada puede requerir licencia de construcción en modalidad de modificación; en inmuebles BIC o sectores de interés cultural se necesita además el concepto del IDPC.",
    "maintenance": "Inspección anual de anclajes y uniones; lavado con agua a baja presión para retirar el hollín de la ciudad. Evitar perfiles horizontales que acumulen agua; dejar drenajes en los tubos.",
    "fabricationDays": {
      "low": 12,
      "high": 25
    },
    "weightRationale": "Por m²: subestructura de tubo 100x50x2 (≈1,3 m/m² x 4,5 kg/m ≈ 6 kg) más ménsulas (≈1,5 kg) más lamas de platina 2\"x1/4\" cada 100 mm (10 m/m² x 2,53 ≈ 25 kg) o lámina perforada de 2 mm con 40% de vacío (≈9 kg).",
    "benchmarkPerUnit": {
      "low": 350000,
      "high": 1800000
    }
  },
  {
    "id": "pergola",
    "name": "Pérgola / cubierta ligera",
    "category": "Cubiertas y exteriores",
    "unit": "m2",
    "description": "Pórtico de columnas y vigas con correas o lamas, abierta o con cubierta de policarbonato o vidrio, para terrazas de café. Retoma la pérgola mediterránea, el engawa japonés y las galerías tropicales de Jean Prouvé, en acero de sección esbelta.",
    "quantity": {
      "default": 25,
      "min": 6,
      "max": 200,
      "step": 1
    },
    "structuralSystem": "Pórticos de columnas de tubo cuadrado o HEA con vigas IPE o tubo rectangular, correas o lamas cada 0,5–1,0 m y estabilidad lateral mediante conexiones a momento, arriostramiento en cruz o anclaje a la fachada existente. Luces típicas de 4–6 m.",
    "profiles": [
      "Tubo cuadrado 100x100x4",
      "HEA 100",
      "IPE 160",
      "IPE 200",
      "Tubo rectangular 100x50x2",
      "Perfil C 150x50x15x2",
      "Tubo redondo 4\" SCH 40 (114,3 x 6,02 mm)"
    ],
    "connectionIds": [
      "placa-base-anclaje-quimico",
      "placa-base-pernos-embebidos",
      "pernada-a325-momento",
      "conexion-momento-soldada",
      "soldadura-filete",
      "tornillo-autoperforante",
      "tensor-varilla-horquilla"
    ],
    "materialIds": [
      "acero-estructural",
      "acero-galvanizado",
      "acero-corten"
    ],
    "defaultMaterialId": "acero-estructural",
    "defaultFinishId": "epoxico-poliuretano",
    "kgPerUnit": {
      "low": 14,
      "high": 30
    },
    "fabricationGrade": 0.35,
    "mobilization": 2000000,
    "finishAreaPerUnit": 1.1,
    "complements": [
      {
        "id": "policarbonato",
        "qtyPerUnit": 1.05,
        "optional": true,
        "group": "cubierta"
      },
      {
        "id": "vidrio-templado",
        "qtyPerUnit": 1,
        "optional": true,
        "group": "cubierta"
      },
      {
        "id": "tablero-madera",
        "qtyPerUnit": 0.5,
        "optional": true
      },
      {
        "id": "led-lineal",
        "qtyPerUnit": 0.4,
        "optional": true
      },
      {
        "id": "anclajes-quimicos",
        "qtyPerUnit": 0.65,
        "optional": false
      }
    ],
    "fireProtectionApplies": false,
    "nsr10": "Diseño según NSR-10 F.2 (acero) y F.4 (correas formadas en frío). Cargas: cubierta liviana (B.4), viento (B.6) y granizo (B.4.8.3): en Bogotá, por estar a más de 2.000 m s. n. m., la carga de granizo es obligatoria y es mayor en cubiertas de poca pendiente (verificar el valor exacto en el Título B). Si se usa vidrio en cubierta debe ser de seguridad laminado (templado-laminado, Título K). Una cubierta fija que aumente el área construida o cubra un aislamiento puede requerir licencia.",
    "maintenance": "Limpiar las canales y la cubierta antes de cada temporada de lluvias (marzo y septiembre); revisar los tornillos y sellos del policarbonato cada año; retocar la pintura en las uniones columna-placa, donde se acumula agua.",
    "fabricationDays": {
      "low": 10,
      "high": 20
    },
    "weightRationale": "Ejemplo de 5x5 m: 4 columnas de 2,7 m en tubo 100x100x4 (127 kg) + 2 vigas IPE 160 de 5 m (158 kg) + correas/lamas de tubo 100x50x2 cada 0,5 m (≈50 m, 225 kg) + placas (20 kg) ≈ 530 kg / 25 m² ≈ 21 kg/m². Con correas cada 1,0 m baja a ≈16 kg/m².",
    "benchmarkPerUnit": {
      "low": 300000,
      "high": 1300000
    }
  },
  {
    "id": "mezzanine",
    "name": "Mezzanine estructural",
    "category": "Estructura",
    "unit": "m2",
    "description": "Entrepiso metálico que duplica el área útil del local (zona de tostión, coworking o mesas) con vigas a la vista y losa en steel deck o tablero de madera. Retoma la tradición de los lofts industriales de Nueva York y los micro-cafés de doble altura de Tokio.",
    "quantity": {
      "default": 20,
      "min": 6,
      "max": 150,
      "step": 1
    },
    "structuralSystem": "Sistema de vigas principales IPE/W y viguetas cada 1,0–1,25 m sobre columnas HEA o de tubo con placa base; losa de steel deck de 2\" con concreto (≈10 cm de espesor total) y conectores de cortante, o tablero de madera sobre perfil C. Estabilidad lateral con pórticos a momento, riostras o anclaje a muros de concreto.",
    "profiles": [
      "IPE 240",
      "IPE 200",
      "IPE 160",
      "W10x12 (W250x17.9)",
      "HEA 160",
      "HEA 140",
      "Tubo cuadrado 100x100x4",
      "UPN 160"
    ],
    "connectionIds": [
      "conexion-articulada-aleta",
      "pernada-a325-cortante",
      "pernada-a325-momento",
      "conexion-momento-soldada",
      "soldadura-penetracion-completa",
      "placa-base-anclaje-quimico",
      "placa-base-pernos-embebidos",
      "conector-cortante-studs"
    ],
    "materialIds": [
      "acero-estructural"
    ],
    "defaultMaterialId": "acero-estructural",
    "defaultFinishId": "epoxico-poliuretano",
    "kgPerUnit": {
      "low": 40,
      "high": 70
    },
    "fabricationGrade": 0.25,
    "mobilization": 3000000,
    "finishAreaPerUnit": 1.6,
    "complements": [
      {
        "id": "steel-deck-concreto",
        "qtyPerUnit": 1,
        "optional": false
      },
      {
        "id": "tablero-madera",
        "qtyPerUnit": 1,
        "optional": true
      },
      {
        "id": "anclajes-quimicos",
        "qtyPerUnit": 0.8,
        "optional": false
      },
      {
        "id": "led-lineal",
        "qtyPerUnit": 0.5,
        "optional": true
      }
    ],
    "fireProtectionApplies": true,
    "nsr10": "Es una estructura y requiere diseño de un ingeniero civil con matrícula profesional (Ley 400 de 1997) según NSR-10 F.2 y F.3 (provisiones sísmicas). Bogotá está en zona de amenaza sísmica intermedia (Aa = 0,15; Av = 0,20) y se aplica la microzonificación (Decreto 523 de 2010). Carga viva según el uso (Tabla B.4.2.1-1; restaurantes y áreas de público ≈5,0 kN/m²). Verificar deflexión (L/360 por carga viva) y vibración de piso. Necesita licencia de construcción (modalidad ampliación o modificación) ante curaduría urbana y verificación de la cimentación existente; puede requerir protección contra fuego (Título J) y barandas (Título K).",
    "maintenance": "Inspección anual de uniones pernadas (torque), soldaduras y placas base; revisar fisuras en la losa y en el grout. Retocar el epóxico en zonas de roce. Si lleva intumescente, inspeccionar golpes cada año.",
    "fabricationDays": {
      "low": 18,
      "high": 35
    },
    "weightRationale": "Ejemplo de 4x5 m: 2 vigas IPE 240 de 5 m (307 kg) + 5 viguetas IPE 160 de 4 m (316 kg) + 4 columnas HEA 160 de 3 m (365 kg) + conexiones (≈10%, 100 kg) ≈ 1.090 kg / 20 m² ≈ 54 kg/m²; con apoyo en muros baja a ≈40 y con luces largas o almacenamiento sube a ≈70.",
    "benchmarkPerUnit": {
      "low": 570000,
      "high": 1400000
    }
  },
  {
    "id": "escalera",
    "name": "Escalera metálica",
    "category": "Circulación",
    "unit": "und",
    "description": "Tramo recto de escalera de un nivel (≈3 m de altura, 1,0 m de ancho) con zancas laterales o central y peldaños en lámina plegada, alfajor o madera. Se inspira en las escaleras plegadas escandinavas, las de Carlo Scarpa y la estética de las escaleras de servicio industriales. La baranda se cotiza como obra aparte (baranda).",
    "quantity": {
      "default": 1,
      "min": 1,
      "max": 6,
      "step": 1
    },
    "structuralSystem": "Dos zancas (UPN, platina o tubo rectangular) apoyadas en la losa inferior y en el borde del mezzanine o la losa superior; peldaños en lámina plegada o alfajor de 1/8\"–3/16\" sobre ángulos soldados, o zanca central con peldaños en voladizo. ≈17 contrahuellas de ≈17,6 cm y huella ≥ 28 cm.",
    "profiles": [
      "UPN 160",
      "UPN 200",
      "Tubo rectangular 150x50x3",
      "Platina 3\" x 3/8\"",
      "Ángulo L 2\" x 3/16\""
    ],
    "connectionIds": [
      "soldadura-filete",
      "soldadura-penetracion-completa",
      "placa-base-anclaje-quimico",
      "pernada-a325-cortante"
    ],
    "materialIds": [
      "acero-estructural",
      "acero-galvanizado",
      "acero-inox-304"
    ],
    "defaultMaterialId": "acero-estructural",
    "defaultFinishId": "epoxico-poliuretano",
    "kgPerUnit": {
      "low": 280,
      "high": 520
    },
    "fabricationGrade": 0.6,
    "mobilization": 1800000,
    "finishAreaPerUnit": 18,
    "complements": [
      {
        "id": "tablero-madera",
        "qtyPerUnit": 4.8,
        "optional": true
      },
      {
        "id": "anclajes-quimicos",
        "qtyPerUnit": 8,
        "optional": false
      },
      {
        "id": "led-lineal",
        "qtyPerUnit": 5,
        "optional": true
      },
      {
        "id": "corte-laser-cnc",
        "qtyPerUnit": 1,
        "optional": true
      }
    ],
    "fireProtectionApplies": true,
    "nsr10": "Diseño estructural según NSR-10 F.2, con carga viva igual o mayor a la del uso al que sirve (Título B). Geometría y ancho según los medios de evacuación del Título K (huella, contrahuella uniforme, ancho libre según la carga de ocupación; verificar Capítulo K.3). Verificar vibración y rigidez lateral. Si es parte de un mezzanine nuevo, va incluida en la licencia de construcción.",
    "maintenance": "Revisar el antideslizante de los peldaños cada 6 meses y renovar las cintas o recubrimientos; retocar la pintura en las narices de los peldaños; ajustar los anclajes al año del montaje.",
    "fabricationDays": {
      "low": 10,
      "high": 18
    },
    "weightRationale": "2 zancas UPN 160 de 5,4 m (203 kg) + 16 peldaños de alfajor 1/8\" de 0,36 m² (≈158 kg) + ángulos de apoyo L2\"x3/16\" (29 kg) + placas (15 kg) ≈ 400 kg por tramo.",
    "benchmarkPerUnit": {
      "low": 3500000,
      "high": 16000000
    }
  },
  {
    "id": "kiosko-modular",
    "name": "Kiosko / módulo de café en acero",
    "category": "Arquitectura modular",
    "unit": "und",
    "description": "Módulo autónomo de 6–15 m² con estructura metálica, cerramientos de lámina y vidrio, ventana de servicio abatible y cubierta liviana; transportable en camión e izable con grúa. Toma como referencia la Maison Tropicale de Jean Prouvé, los yatai japoneses y los kioskos parisinos de hierro.",
    "quantity": {
      "default": 1,
      "min": 1,
      "max": 10,
      "step": 1
    },
    "structuralSystem": "Marco rígido espacial con columnas de tubo cuadrado en las esquinas, vigas perimetrales de tubo rectangular arriba y abajo, viguetas de piso y cubierta en perfil C, cerramientos de lámina cal. 18 sobre bastidor y puntos de izaje. Se apoya en dados o placas niveladoras con anclaje.",
    "profiles": [
      "Tubo cuadrado 100x100x4",
      "Tubo rectangular 150x50x3",
      "Perfil C 100x50x15x2",
      "Perfil C 150x50x15x2",
      "Tubo cuadrado 50x50x2",
      "Ángulo L 2\" x 3/16\""
    ],
    "connectionIds": [
      "conexion-momento-soldada",
      "soldadura-filete",
      "pernada-a325-cortante",
      "placa-base-pernos-embebidos",
      "placa-base-anclaje-quimico",
      "tornillo-autoperforante"
    ],
    "materialIds": [
      "acero-estructural",
      "acero-galvanizado",
      "acero-corten"
    ],
    "defaultMaterialId": "acero-estructural",
    "defaultFinishId": "epoxico-poliuretano",
    "kgPerUnit": {
      "low": 650,
      "high": 1800
    },
    "fabricationGrade": 0.35,
    "mobilization": 3000000,
    "finishAreaPerUnit": 75,
    "complements": [
      {
        "id": "vidrio-templado",
        "qtyPerUnit": 3,
        "optional": true
      },
      {
        "id": "tablero-madera",
        "qtyPerUnit": 9,
        "optional": true
      },
      {
        "id": "tablero-cuarzo",
        "qtyPerUnit": 1,
        "optional": true
      },
      {
        "id": "led-lineal",
        "qtyPerUnit": 12,
        "optional": true
      },
      {
        "id": "lamina-perforada",
        "qtyPerUnit": 4,
        "optional": true
      },
      {
        "id": "corte-laser-cnc",
        "qtyPerUnit": 2,
        "optional": true
      },
      {
        "id": "anclajes-quimicos",
        "qtyPerUnit": 8,
        "optional": false
      }
    ],
    "fireProtectionApplies": true,
    "nsr10": "Estructura liviana según NSR-10 F.2/F.4: verificar volcamiento y deslizamiento por sismo y viento (B.6), granizo en cubierta y las fuerzas de izaje y transporte. En predio privado puede requerir licencia de construcción si es permanente; en espacio público necesita permiso de aprovechamiento económico (Marco Regulatorio del Aprovechamiento Económico del Espacio Público, Decreto Distrital 552 de 2018 y normas que lo modifiquen; DADEP/IDU según el caso). Las instalaciones eléctricas deben cumplir RETIE.",
    "maintenance": "Revisar sellos de cubierta y ventanas antes de las temporadas de lluvia; inspeccionar la corrosión en la base (zona de salpicadura) y en las bisagras de la ventana de servicio cada 6 meses; reapretar pernos después de cada traslado.",
    "fabricationDays": {
      "low": 20,
      "high": 35
    },
    "weightRationale": "Módulo de 3x3x2,7 m: columnas 100x100x4 (127 kg) + vigas perimetrales 150x50x3 (215 kg) + viguetas C (147 kg) + cerramientos cal. 18 (135 kg) + cubierta (60 kg) + piso alfajor (245 kg) + marcos (40 kg) ≈ 970 kg; un módulo de 6 m² pesa ≈650 kg y uno de 15 m² con piso metálico ≈1.800 kg.",
    "benchmarkPerUnit": {
      "low": 9000000,
      "high": 48000000
    }
  },
  {
    "id": "estanteria",
    "name": "Estantería / exhibidor de producto",
    "category": "Mobiliario de exhibición",
    "unit": "ml",
    "description": "Exhibidor de piso a techo para café en grano, métodos de preparación y merchandising, con montantes metálicos y repisas de lámina plegada o madera. Referencias: el sistema modular de Dieter Rams (Vitsoe 606), las estanterías de las tiendas de té de Kioto y los anaqueles de las ferreterías tradicionales.",
    "quantity": {
      "default": 3,
      "min": 1,
      "max": 20,
      "step": 0.5
    },
    "structuralSystem": "Montantes de tubo o platina cada 0,9–1,0 m anclados a piso y muro (antivuelco), con 4–6 repisas en lámina cal. 14 plegada o tablero de madera sobre ángulos; altura de 2,1–2,4 m y fondo de 0,30–0,40 m.",
    "profiles": [
      "Tubo cuadrado 40x40x2",
      "Platina 2\" x 1/4\"",
      "Ángulo L 1-1/2\" x 1/8\"",
      "Tubo rectangular 40x20x1.5"
    ],
    "connectionIds": [
      "soldadura-filete",
      "anclaje-mecanico-expansivo",
      "placa-base-anclaje-quimico",
      "pernada-a325-cortante"
    ],
    "materialIds": [
      "acero-estructural",
      "acero-inox-304",
      "acero-corten",
      "acero-galvanizado"
    ],
    "defaultMaterialId": "acero-estructural",
    "defaultFinishId": "electrostatica",
    "kgPerUnit": {
      "low": 18,
      "high": 45
    },
    "fabricationGrade": 0.75,
    "mobilization": 600000,
    "finishAreaPerUnit": 3.5,
    "complements": [
      {
        "id": "tablero-madera",
        "qtyPerUnit": 1.75,
        "optional": true
      },
      {
        "id": "vidrio-templado",
        "qtyPerUnit": 0.7,
        "optional": true
      },
      {
        "id": "led-lineal",
        "qtyPerUnit": 3,
        "optional": true
      },
      {
        "id": "anclajes-quimicos",
        "qtyPerUnit": 3,
        "optional": false
      }
    ],
    "fireProtectionApplies": false,
    "nsr10": "Elemento no estructural (NSR-10 A.9): en Bogotá es obligatorio el anclaje antivuelco a muro o placa para la fuerza sísmica Fp. Indicar la carga máxima por repisa y usar bordes o retenedores para que los productos no caigan durante un sismo.",
    "maintenance": "Limpieza semanal con paño húmedo; verificar el anclaje a muro una vez al año; no sobrecargar las repisas por encima de la capacidad indicada.",
    "fabricationDays": {
      "low": 6,
      "high": 12
    },
    "weightRationale": "Por ml: ≈4,9 m de montante 40x40x2 (11 kg) + 5 repisas con ángulos L1-1/2\"x1/8\" (18 kg) o lámina cal. 14 plegada (≈31 kg) + arriostramiento (≈3 kg).",
    "benchmarkPerUnit": {
      "low": 450000,
      "high": 1700000
    }
  },
  {
    "id": "mesa",
    "name": "Mesa de acero con tablero",
    "category": "Mobiliario",
    "unit": "und",
    "description": "Mesa de café (0,60–0,80 m) o mesa comunal (hasta 2,4x0,9 m) con base de tubo o pedestal con disco de platina y tablero de madera o cuarzo. Referencias: el mueble tubular de la Bauhaus, el bistró parisino de pedestal y la mesa de taller de la ornamentación colombiana.",
    "quantity": {
      "default": 4,
      "min": 1,
      "max": 40,
      "step": 1
    },
    "structuralSystem": "Bastidor de 4 patas en tubo cuadrado con cerco perimetral, o pedestal de tubo redondo con base de disco de platina de 3/8\" (Ø 450 mm) y cruceta superior. Niveladores en las patas.",
    "profiles": [
      "Tubo cuadrado 40x40x2",
      "Tubo cuadrado 25x25x1.5",
      "Tubo redondo 2\" (60,3 mm) x 2.5",
      "Platina 2\" x 1/4\""
    ],
    "connectionIds": [
      "soldadura-filete",
      "anclaje-mecanico-expansivo"
    ],
    "materialIds": [
      "acero-estructural",
      "acero-inox-304",
      "acero-corten",
      "acero-galvanizado"
    ],
    "defaultMaterialId": "acero-estructural",
    "defaultFinishId": "electrostatica",
    "kgPerUnit": {
      "low": 12,
      "high": 35
    },
    "fabricationGrade": 0.8,
    "mobilization": 400000,
    "finishAreaPerUnit": 1.2,
    "complements": [
      {
        "id": "tablero-madera",
        "qtyPerUnit": 0.56,
        "optional": false
      },
      {
        "id": "tablero-cuarzo",
        "qtyPerUnit": 0.56,
        "optional": true,
        "replaces": "tablero-madera"
      }
    ],
    "fireProtectionApplies": false,
    "nsr10": "No aplica diseño estructural NSR-10 por ser mobiliario. Verificar la estabilidad al volcamiento del pedestal (regla práctica de taller, no de norma: diámetro de la base ≥ 0,6 veces el lado del tablero).",
    "maintenance": "Revisar niveladores y tornillos del tablero cada 6 meses; en terrazas preferir galvanizado + electrostática (dúplex) y tablero tratado para exterior.",
    "fabricationDays": {
      "low": 5,
      "high": 10
    },
    "weightRationale": "Mesa de 4 patas de 0,7 m: ≈5,7 m de tubo 40x40x2 (13 kg) + placas (1 kg) ≈ 14 kg. Pedestal: tubo 2\" (3 kg) + disco Ø450 de 3/8\" (12 kg) + cruceta ≈ 17 kg. Mesa comunal de 2,4 m ≈ 35 kg.",
    "benchmarkPerUnit": {
      "low": 700000,
      "high": 3800000
    }
  },
  {
    "id": "baranda",
    "name": "Baranda / pasamanos",
    "category": "Protección y circulación",
    "unit": "ml",
    "description": "Baranda de protección en bordes de mezzanine, escaleras y terrazas, con parales de platina o tubo, pasamanos redondo y relleno de barrotes, vidrio o lámina perforada. Desde la reja colonial bogotana forjada en El Taller hasta los pasamanos minimalistas de Carlo Scarpa.",
    "quantity": {
      "default": 8,
      "min": 1,
      "max": 80,
      "step": 0.5
    },
    "structuralSystem": "Parales cada 1,0–1,2 m empotrados con placa base y anclajes químicos (típicamente 4 por paral en montaje de piso, 2–4 en montaje de canto) a losa o viga de borde, pasamanos continuo y relleno con aberturas pequeñas (barrotes de varilla cuadrada cada ≤ 10 cm, vidrio templado-laminado o lámina perforada).",
    "profiles": [
      "Tubo cuadrado 50x50x2",
      "Platina 3\" x 3/8\"",
      "Tubo redondo 1-1/2\" (48,3 mm) x 2.0",
      "Tubo rectangular 40x20x1.5",
      "Varilla cuadrada 1/2\"",
      "Tubo cuadrado 25x25x1.5"
    ],
    "connectionIds": [
      "soldadura-filete",
      "placa-base-anclaje-quimico",
      "anclaje-mecanico-expansivo"
    ],
    "materialIds": [
      "acero-estructural",
      "acero-inox-304",
      "acero-galvanizado",
      "acero-corten"
    ],
    "defaultMaterialId": "acero-estructural",
    "defaultFinishId": "electrostatica",
    "kgPerUnit": {
      "low": 8,
      "high": 22
    },
    "fabricationGrade": 0.5,
    "mobilization": 800000,
    "finishAreaPerUnit": 1,
    "complements": [
      {
        "id": "vidrio-templado",
        "qtyPerUnit": 0.9,
        "optional": true,
        "group": "relleno"
      },
      {
        "id": "lamina-perforada",
        "qtyPerUnit": 0.9,
        "optional": true,
        "group": "relleno"
      },
      {
        "id": "led-lineal",
        "qtyPerUnit": 1,
        "optional": true
      },
      {
        "id": "anclajes-quimicos",
        "qtyPerUnit": 3.6,
        "optional": false
      }
    ],
    "fireProtectionApplies": false,
    "nsr10": "Las barandas se diseñan para una carga lineal horizontal en el pasamanos y una carga concentrada según el Título B (del orden de 0,75 kN/m; verificar el valor vigente). Altura y aberturas según el Título K: altura del orden de 1,0 m en bordes de mezzanine y balcones, y aberturas que no dejen pasar una esfera de ≈10 cm (verificar). El vidrio de relleno debe ser de seguridad templado-laminado. El anclaje del paral es el punto crítico: momento en la base.",
    "maintenance": "Revisar el apriete de los anclajes y la fijación del vidrio una vez al año; en exterior, retocar las bases de los parales, donde se acumula agua; limpiar el inox del pasamanos con frecuencia.",
    "fabricationDays": {
      "low": 6,
      "high": 14
    },
    "weightRationale": "Por ml: parales 50x50x2 (≈2,8 kg) + pasamanos Ø1-1/2\" (2,3 kg) + 2 travesaños 40x20 (2,6 kg) + 10 barrotes de 1/2\" de 0,9 m (11,4 kg) + placas (1,5 kg) ≈ 20 kg. Con vidrio o lámina en lugar de barrotes ≈ 8–10 kg.",
    "benchmarkPerUnit": {
      "low": 150000,
      "high": 800000
    }
  },
  {
    "id": "porton",
    "name": "Portón / puerta pivotante",
    "category": "Accesos",
    "unit": "m2",
    "description": "Puerta de acceso o portón de gran formato, batiente o pivotante, con bastidor de tubo y forro de lámina, lamas o celosía. Retoma las puertas pivotantes holandesas y escandinavas, los portones de Carlo Scarpa en Castelvecchio y la rejería ornamental bogotana.",
    "quantity": {
      "default": 6,
      "min": 2,
      "max": 30,
      "step": 0.5
    },
    "structuralSystem": "Bastidor perimetral con montantes intermedios en tubo cuadrado o rectangular, forro de lámina cal. 16 o lamas, girando sobre pivote de piso con rodamiento y buje superior (pivotante) o sobre bisagras de carga; marco anclado a la estructura del vano.",
    "profiles": [
      "Tubo rectangular 100x50x2",
      "Tubo cuadrado 75x75x3",
      "Tubo cuadrado 50x50x2",
      "Platina 2\" x 1/4\"",
      "Varilla cuadrada 1/2\""
    ],
    "connectionIds": [
      "soldadura-filete",
      "pasador-pivote",
      "anclaje-mecanico-expansivo",
      "placa-base-anclaje-quimico",
      "tornillo-autoperforante"
    ],
    "materialIds": [
      "acero-estructural",
      "acero-corten",
      "acero-galvanizado",
      "acero-inox-304"
    ],
    "defaultMaterialId": "acero-estructural",
    "defaultFinishId": "epoxico-poliuretano",
    "kgPerUnit": {
      "low": 18,
      "high": 40
    },
    "fabricationGrade": 0.6,
    "mobilization": 1200000,
    "finishAreaPerUnit": 2.6,
    "complements": [
      {
        "id": "lamina-perforada",
        "qtyPerUnit": 1,
        "optional": true
      },
      {
        "id": "corte-laser-cnc",
        "qtyPerUnit": 1,
        "optional": true
      },
      {
        "id": "tablero-madera",
        "qtyPerUnit": 1,
        "optional": true
      },
      {
        "id": "vidrio-templado",
        "qtyPerUnit": 0.5,
        "optional": true
      },
      {
        "id": "anclajes-quimicos",
        "qtyPerUnit": 0.7,
        "optional": false
      }
    ],
    "fireProtectionApplies": false,
    "nsr10": "No es estructural, pero el marco y los pivotes deben resistir el peso propio, el viento (B.6) en hojas grandes y el uso. Si es salida de evacuación, el sentido de giro, el ancho y los herrajes deben cumplir el Título K. Verificar que la losa o el piso resista la carga puntual del pivote.",
    "maintenance": "Lubricar pivotes y bisagras cada 6 meses; revisar el alineamiento y la holgura inferior; retocar la pintura del borde inferior (salpicaduras de lluvia) cada año.",
    "fabricationDays": {
      "low": 8,
      "high": 15
    },
    "weightRationale": "Portón de 3x2 m: bastidor y montantes en tubo 100x50x2 (≈17 m x 4,5 = 77 kg) + forro de lámina cal. 16 (6 m² x 11,8 = 71 kg) ≈ 148 kg / 6 m² ≈ 25 kg/m²; con lamas macizas o bastidor 75x75x3 llega a ≈40 kg/m².",
    "benchmarkPerUnit": {
      "low": 400000,
      "high": 1600000
    }
  },
  {
    "id": "senaletica-corten",
    "name": "Letrero / señalética en acero corten",
    "category": "Identidad y señalética",
    "unit": "und",
    "description": "Aviso de fachada o tótem de 1–2 m² en lámina corten de 3 mm con letras y logotipo calados por láser, separados del muro y opcionalmente retroiluminados. Referencias: la señalética de los parques nórdicos, las esculturas de Richard Serra y los avisos de corten de las tostadoras de especialidad.",
    "quantity": {
      "default": 1,
      "min": 1,
      "max": 10,
      "step": 1
    },
    "structuralSystem": "Panel de lámina corten de 3 mm calado por CNC sobre bastidor de tubo, con separadores de 30–50 mm y anclaje a muro de concreto; en versión tótem, pedestal de tubo cuadrado con placa base anclada.",
    "profiles": [
      "Tubo cuadrado 40x40x2",
      "Tubo cuadrado 100x100x4",
      "Platina 1-1/2\" x 1/4\"",
      "Ángulo L 1-1/2\" x 1/8\""
    ],
    "connectionIds": [
      "soldadura-filete",
      "anclaje-mecanico-expansivo",
      "placa-base-anclaje-quimico"
    ],
    "materialIds": [
      "acero-corten",
      "acero-estructural",
      "acero-inox-304"
    ],
    "defaultMaterialId": "acero-corten",
    "defaultFinishId": "patina-corten",
    "kgPerUnit": {
      "low": 25,
      "high": 90
    },
    "fabricationGrade": 0.9,
    "mobilization": 1200000,
    "finishAreaPerUnit": 4,
    "complements": [
      {
        "id": "corte-laser-cnc",
        "qtyPerUnit": 1.5,
        "optional": false
      },
      {
        "id": "led-lineal",
        "qtyPerUnit": 4,
        "optional": true
      },
      {
        "id": "anclajes-quimicos",
        "qtyPerUnit": 4,
        "optional": false
      }
    ],
    "fireProtectionApplies": false,
    "nsr10": "Como elemento no estructural adosado (A.9) se anclan para viento y sismo; no fijarlos a mampostería no reforzada. En Bogotá la publicidad exterior visual está regulada por la Secretaría Distrital de Ambiente (Decreto Distrital 959 de 2000): el aviso requiere registro y debe cumplir dimensiones y ubicación (verificar área máxima por fachada). Las conexiones LED cumplen RETIE.",
    "maintenance": "Durante los primeros 2–3 años la escorrentía de óxido mancha muros y andenes: prever gotero, separación del muro y una franja de gravilla. Limpiar hojas y polvo; revisar los anclajes una vez al año. En zonas resguardadas aplicar sellador.",
    "fabricationDays": {
      "low": 5,
      "high": 10
    },
    "weightRationale": "Panel de 1,5 m² en lámina de 3 mm (23,6 kg/m² x 1,5 = 35 kg, menos 30% calado ≈ 25 kg) + bastidor 40x40x2 (≈6 m = 14 kg) ≈ 40 kg; tótem con pedestal 100x100x4 (2x2 m = 47 kg) ≈ 90 kg.",
    "benchmarkPerUnit": {
      "low": 1500000,
      "high": 6500000
    }
  },
  {
    "id": "marquesina",
    "name": "Marquesina / alero de acceso",
    "category": "Cubiertas y exteriores",
    "unit": "m2",
    "description": "Voladizo de 1,0–2,0 m sobre el acceso, con ménsulas empotradas o atirantadas y cubierta de vidrio, lámina o policarbonato, con canal y gotero integrados. Desde las marquesinas Art Nouveau del metro de París de Guimard hasta los aleros finos de la arquitectura japonesa contemporánea.",
    "quantity": {
      "default": 6,
      "min": 2,
      "max": 60,
      "step": 0.5
    },
    "structuralSystem": "Ménsulas IPE o tubo rectangular cada 1,2–1,5 m empotradas con placa y anclajes químicos a viga o losa de concreto (o atirantadas con tensores de varilla a la fachada), viga frontal que oculta la canal y correas para la cubierta.",
    "profiles": [
      "IPE 160",
      "IPE 120",
      "Tubo rectangular 150x50x3",
      "Tubo rectangular 100x50x3",
      "Tubo rectangular 100x50x2",
      "Varilla redonda 5/8\"",
      "Perfil C 100x50x15x2"
    ],
    "connectionIds": [
      "soldadura-penetracion-completa",
      "placa-base-anclaje-quimico",
      "tensor-varilla-horquilla",
      "pasador-pivote",
      "soldadura-filete",
      "tornillo-autoperforante"
    ],
    "materialIds": [
      "acero-estructural",
      "acero-galvanizado",
      "acero-corten",
      "acero-inox-304"
    ],
    "defaultMaterialId": "acero-estructural",
    "defaultFinishId": "galvanizado-caliente",
    "kgPerUnit": {
      "low": 20,
      "high": 40
    },
    "fabricationGrade": 0.4,
    "mobilization": 1800000,
    "finishAreaPerUnit": 1.3,
    "complements": [
      {
        "id": "vidrio-templado",
        "qtyPerUnit": 1,
        "optional": true,
        "group": "cubierta"
      },
      {
        "id": "policarbonato",
        "qtyPerUnit": 1.05,
        "optional": true,
        "group": "cubierta"
      },
      {
        "id": "lamina-perforada",
        "qtyPerUnit": 1,
        "optional": true,
        "group": "cubierta"
      },
      {
        "id": "led-lineal",
        "qtyPerUnit": 0.7,
        "optional": true
      },
      {
        "id": "anclajes-quimicos",
        "qtyPerUnit": 3,
        "optional": false
      }
    ],
    "fireProtectionApplies": false,
    "nsr10": "Diseño según NSR-10 F.2 para peso propio, granizo (B.4.8.3, obligatorio en Bogotá), viento ascendente (succión, B.6) y sismo con componente vertical en voladizos. El empotramiento debe hacerse a concreto con anclajes calificados para sismo. El vidrio de cubierta debe ser templado-laminado (Título K). Si vuela sobre el andén o espacio público, verificar las restricciones del POT y la cartilla de andenes de Bogotá antes de diseñar.",
    "maintenance": "Limpiar la canal y el gotero cada 3 meses y siempre antes de las lluvias; revisar los sellos del vidrio y la tensión de los tensores cada año; retocar el galvanizado en cortes de obra con pintura rica en zinc.",
    "fabricationDays": {
      "low": 7,
      "high": 14
    },
    "weightRationale": "Ejemplo de 4 m x 1,5 m: 3 ménsulas IPE 160 de 1,5 m (71 kg) + viga frontal tubo 100x50x3 de 4 m (6,6 kg/m, 26 kg) + correas 100x50x2 (≈12 m, 54 kg) + tensores Ø5/8\" (10 kg) + placas y horquillas (24 kg) ≈ 185 kg / 6 m² ≈ 31 kg/m².",
    "benchmarkPerUnit": {
      "low": 450000,
      "high": 1600000
    }
  }
];

export const PROFILES: Profile[] = [
  {
    "family": "IPE (perfil I europeo laminado en caliente)",
    "designation": "IPE 100",
    "kgPerM": 8.1,
    "use": "Viguetas cortas, correas de pérgola, marcos de portón pivotante pesado."
  },
  {
    "family": "IPE (perfil I europeo laminado en caliente)",
    "designation": "IPE 120",
    "kgPerM": 10.4,
    "use": "Viguetas de mezzanine con luces de 2,5–3 m, ménsulas de marquesina pequeñas."
  },
  {
    "family": "IPE (perfil I europeo laminado en caliente)",
    "designation": "IPE 160",
    "kgPerM": 15.8,
    "use": "Viguetas de mezzanine (luces 3,5–4,5 m), vigas de pérgola, ménsulas de marquesina."
  },
  {
    "family": "IPE (perfil I europeo laminado en caliente)",
    "designation": "IPE 200",
    "kgPerM": 22.4,
    "use": "Vigas secundarias de mezzanine, vigas principales de pérgola de 5–6 m."
  },
  {
    "family": "IPE (perfil I europeo laminado en caliente)",
    "designation": "IPE 240",
    "kgPerM": 30.7,
    "use": "Vigas principales de mezzanine con luces de 5–6 m."
  },
  {
    "family": "IPE (perfil I europeo laminado en caliente)",
    "designation": "IPE 300",
    "kgPerM": 42.2,
    "use": "Vigas principales de mezzanine con luces de 6–8 m o cargas de almacenamiento."
  },
  {
    "family": "HEA (perfil H europeo de ala ancha)",
    "designation": "HEA 100",
    "kgPerM": 16.7,
    "use": "Columnas cortas de pérgola o marquesina, postes de portón."
  },
  {
    "family": "HEA (perfil H europeo de ala ancha)",
    "designation": "HEA 140",
    "kgPerM": 24.7,
    "use": "Columnas de mezzanine de una planta (h ≈ 3 m)."
  },
  {
    "family": "HEA (perfil H europeo de ala ancha)",
    "designation": "HEA 160",
    "kgPerM": 30.4,
    "use": "Columnas de mezzanine y pórticos de kiosko grande."
  },
  {
    "family": "HEA (perfil H europeo de ala ancha)",
    "designation": "HEA 200",
    "kgPerM": 42.3,
    "use": "Columnas de mezzanine con cargas altas, vigas de transferencia cortas."
  },
  {
    "family": "HEA (perfil H europeo de ala ancha)",
    "designation": "HEA 240",
    "kgPerM": 60.3,
    "use": "Columnas o vigas de pórticos resistentes a momento en estructuras de mayor luz."
  },
  {
    "family": "W (perfil de ala ancha AISC, muy común en Colombia)",
    "designation": "W8x10 (W200x15)",
    "kgPerM": 14.9,
    "use": "Alternativa a IPE 160 para viguetas de mezzanine y ménsulas."
  },
  {
    "family": "W (perfil de ala ancha AISC, muy común en Colombia)",
    "designation": "W10x12 (W250x17.9)",
    "kgPerM": 17.9,
    "use": "Viguetas de mezzanine de 4–5 m de luz."
  },
  {
    "family": "W (perfil de ala ancha AISC, muy común en Colombia)",
    "designation": "W12x26 (W310x38.7)",
    "kgPerM": 38.7,
    "use": "Vigas principales de mezzanine de 6–7 m."
  },
  {
    "family": "UPN (canal laminado en caliente)",
    "designation": "UPN 160",
    "kgPerM": 18.8,
    "use": "Zancas de escalera recta, vigas de borde de mezzanine."
  },
  {
    "family": "UPN (canal laminado en caliente)",
    "designation": "UPN 200",
    "kgPerM": 25.3,
    "use": "Zancas de escalera de mayor luz o ancho, vigas de borde con baranda."
  },
  {
    "family": "Tubo estructural cuadrado (PTS, ASTM A500)",
    "designation": "Tubo cuadrado 25x25x1.5",
    "kgPerM": 1.06,
    "use": "Barrotes de baranda, marcos de exhibidores livianos, mobiliario."
  },
  {
    "family": "Tubo estructural cuadrado (PTS, ASTM A500)",
    "designation": "Tubo cuadrado 40x40x2",
    "kgPerM": 2.31,
    "use": "Patas de mesa, montantes de estantería, bastidores de letreros."
  },
  {
    "family": "Tubo estructural cuadrado (PTS, ASTM A500)",
    "designation": "Tubo cuadrado 50x50x2",
    "kgPerM": 2.93,
    "use": "Bastidor de barra de café, parales de baranda, marcos de puertas."
  },
  {
    "family": "Tubo estructural cuadrado (PTS, ASTM A500)",
    "designation": "Tubo cuadrado 75x75x3",
    "kgPerM": 6.6,
    "use": "Marcos de portón, subestructura de fachada, columnas de pérgola pequeña."
  },
  {
    "family": "Tubo estructural cuadrado (PTS, ASTM A500)",
    "designation": "Tubo cuadrado 100x100x3",
    "kgPerM": 8.96,
    "use": "Columnas de pérgola y marquesina, pedestales de señalética."
  },
  {
    "family": "Tubo estructural cuadrado (PTS, ASTM A500)",
    "designation": "Tubo cuadrado 100x100x4",
    "kgPerM": 11.73,
    "use": "Columnas de pérgola, kiosko y mezzanine liviano."
  },
  {
    "family": "Tubo estructural rectangular (PTS, ASTM A500)",
    "designation": "Tubo rectangular 40x20x1.5",
    "kgPerM": 1.3,
    "use": "Travesaños de baranda, marcos de repisa, lamas livianas."
  },
  {
    "family": "Tubo estructural rectangular (PTS, ASTM A500)",
    "designation": "Tubo rectangular 100x50x2",
    "kgPerM": 4.5,
    "use": "Correas y lamas de pérgola, subestructura de fachada, bastidor de portón."
  },
  {
    "family": "Tubo estructural rectangular (PTS, ASTM A500)",
    "designation": "Tubo rectangular 100x50x3",
    "kgPerM": 6.6,
    "use": "Vigas frontales de marquesina (ocultan la canal), dinteles de portón, correas de mayor luz."
  },
  {
    "family": "Tubo estructural rectangular (PTS, ASTM A500)",
    "designation": "Tubo rectangular 150x50x3",
    "kgPerM": 8.96,
    "use": "Vigas perimetrales de kiosko, zancas de escalera tipo tubo, vigas de pérgola."
  },
  {
    "family": "Tubo redondo (ASTM A500 / A53)",
    "designation": "Tubo redondo 1-1/2\" (48,3 mm) x 2.0",
    "kgPerM": 2.28,
    "use": "Pasamanos, reposapiés de barra, tensores rígidos livianos."
  },
  {
    "family": "Tubo redondo (ASTM A500 / A53)",
    "designation": "Tubo redondo 2\" (60,3 mm) x 2.5",
    "kgPerM": 3.56,
    "use": "Pasamanos robustos, pedestal de mesa, columnas esbeltas decorativas."
  },
  {
    "family": "Tubo redondo (ASTM A500 / A53)",
    "designation": "Tubo redondo 4\" SCH 40 (114,3 x 6,02 mm)",
    "kgPerM": 16.07,
    "use": "Columnas de pérgola y marquesina con estética circular."
  },
  {
    "family": "Ángulo de alas iguales (ASTM A36)",
    "designation": "Ángulo L 1-1/2\" x 1/8\"",
    "kgPerM": 1.83,
    "use": "Soporte de tableros y repisas, marcos de vidrio, rigidizadores livianos."
  },
  {
    "family": "Ángulo de alas iguales (ASTM A36)",
    "designation": "Ángulo L 2\" x 3/16\"",
    "kgPerM": 3.63,
    "use": "Soporte de peldaños, arriostramientos, marcos de piso de kiosko."
  },
  {
    "family": "Ángulo de alas iguales (ASTM A36)",
    "designation": "Ángulo L 2\" x 1/4\"",
    "kgPerM": 4.75,
    "use": "Conexiones de cortante (clip angles), riostras, ménsulas cortas."
  },
  {
    "family": "Platina / barra plana (ASTM A36)",
    "designation": "Platina 1-1/2\" x 1/4\"",
    "kgPerM": 1.9,
    "use": "Lamas de celosía fina, parales de baranda minimalista, cartelas."
  },
  {
    "family": "Platina / barra plana (ASTM A36)",
    "designation": "Platina 2\" x 1/4\"",
    "kgPerM": 2.53,
    "use": "Lamas de celosía y fachada, montantes de estantería, marcos de letreros."
  },
  {
    "family": "Platina / barra plana (ASTM A36)",
    "designation": "Platina 3\" x 3/8\"",
    "kgPerM": 5.7,
    "use": "Parales de baranda estructural, zancas de escalera liviana, pletinas de anclaje."
  },
  {
    "family": "Perfil PHR C (lámina formada en frío, NSR-10 F.4)",
    "designation": "Perfil C 100x50x15x2",
    "kgPerM": 3.49,
    "use": "Correas de cubierta liviana, viguetas de piso de kiosko, bastidores."
  },
  {
    "family": "Perfil PHR C (lámina formada en frío, NSR-10 F.4)",
    "designation": "Perfil C 150x50x15x2",
    "kgPerM": 4.27,
    "use": "Correas de pérgola y marquesina, viguetas de cubierta de kiosko."
  },
  {
    "family": "Barra maciza (ASTM A36)",
    "designation": "Varilla cuadrada 1/2\"",
    "kgPerM": 1.27,
    "use": "Barrotes verticales de baranda y portón, celosía forjada tradicional (herencia de El Taller)."
  },
  {
    "family": "Barra maciza (ASTM A36)",
    "designation": "Varilla redonda 5/8\"",
    "kgPerM": 1.55,
    "use": "Tensores de marquesina con horquilla, arriostramientos en cruz."
  }
];

export const CONNECTIONS: Connection[] = [
  {
    "id": "soldadura-filete",
    "name": "Soldadura de filete (SMAW E7018 / GMAW ER70S-6)",
    "description": "Cordón triangular en junta en T, traslapo o esquina; es la unión más económica y común en taller. Tamaño mínimo según espesor (AWS D1.1 / NSR-10 F.2.10.2); en perfiles de lámina delgada (≤ 4,8 mm) aplica AWS D1.3.",
    "whenToUse": "Uniones de bastidores, mobiliario, barandas, conexiones de cortante, platinas a tubo y cualquier unión de taller que no transmita momento sísmico crítico."
  },
  {
    "id": "soldadura-penetracion-completa",
    "name": "Soldadura de penetración completa (CJP)",
    "description": "Junta biselada que funde todo el espesor de la pieza y desarrolla la resistencia completa del metal base. Requiere WPS calificado o precalificado, soldador calificado (AWS D1.1) e inspección VT 100% más UT/MT según criticidad.",
    "whenToUse": "Empalmes de vigas y columnas, patines en conexiones a momento, placas base de columnas en voladizo, uniones de zancas y ménsulas de marquesina."
  },
  {
    "id": "pernada-a325-cortante",
    "name": "Conexión pernada A325 a cortante (apriete ajustado)",
    "description": "Pernos ASTM F3125 Gr. A325 con tuerca A563 y arandela F436, instalados en condición snug-tight; trabajan por aplastamiento. Permite montaje rápido en obra sin soldadura en sitio.",
    "whenToUse": "Unión de viguetas a vigas, ensamble de kioskos modulares desmontables, pérgolas y estanterías que deben armarse en sitio."
  },
  {
    "id": "pernada-a325-momento",
    "name": "Conexión a momento con placa extrema pernada (pretensionada)",
    "description": "Placa soldada al extremo de la viga y pernada a la columna con pernos A325 pretensionados (deslizamiento crítico o pretensionado), con rigidizadores. Precalificada según AISC 358 referenciada por NSR-10 F.3.",
    "whenToUse": "Pórticos resistentes a momento de pérgolas exentas, kioskos sin arriostramiento y mezzanines donde no se pueden poner riostras."
  },
  {
    "id": "conexion-articulada-aleta",
    "name": "Conexión articulada (platina de cortante / ángulos)",
    "description": "Platina simple (shear tab) o par de ángulos que transmiten solo cortante; se modela como articulación. Más económica que una conexión a momento, pero exige un sistema de arriostramiento o muros para la estabilidad lateral.",
    "whenToUse": "Viguetas de mezzanine, vigas secundarias, pórticos arriostrados con diagonales o anclados a muros de concreto."
  },
  {
    "id": "conexion-momento-soldada",
    "name": "Conexión a momento soldada en taller/obra",
    "description": "Patines con soldadura CJP y alma pernada o soldada; puede requerir placas de continuidad. En sistemas sísmicos (PRM DMO/DES) debe ser una conexión precalificada o ensayada (NSR-10 F.3, AISC 358) con soldaduras de demanda crítica con tenacidad Charpy.",
    "whenToUse": "Pórticos rígidos de mezzanine, marcos de kiosko y voladizos de marquesina empotrados."
  },
  {
    "id": "placa-base-anclaje-quimico",
    "name": "Placa base con anclajes químicos (epóxicos)",
    "description": "Placa de acero (típicamente 3/8\"–3/4\") perforada, fijada a losa o dado existente con varilla roscada y adhesivo epóxico o híbrido de alto desempeño, calificado para concreto fisurado y cargas sísmicas (ACI 355.4 / ETA). Nivelación con mortero sin retracción (grout).",
    "whenToUse": "Intervenciones en locales existentes: columnas de mezzanine y pérgola, barandas, barras, estanterías antivuelco y señalética sobre concreto."
  },
  {
    "id": "placa-base-pernos-embebidos",
    "name": "Placa base con pernos de anclaje embebidos (F1554)",
    "description": "Pernos ASTM F1554 Gr. 36/55 en J o con tuerca de anclaje embebidos en dado de concreto nuevo, con plantilla de posicionamiento y grout sin retracción bajo placa.",
    "whenToUse": "Obra nueva: cimentación de kioskos, columnas de pérgolas exentas y mezzanines con zapatas nuevas."
  },
  {
    "id": "anclaje-mecanico-expansivo",
    "name": "Anclaje mecánico de expansión / tornillo para concreto",
    "description": "Anclaje de cuña o de tornillo (screw anchor) en concreto macizo; instalación inmediata sin tiempo de curado. No apto para mampostería hueca ni cargas sísmicas altas sin calificación.",
    "whenToUse": "Fijaciones livianas: estanterías a muro, letreros, bastidores de fachada sobre concreto, marcos de portón."
  },
  {
    "id": "pasador-pivote",
    "name": "Pasador / pivote con rodamiento",
    "description": "Articulación real con pasador macizo o pivote de piso con rodamiento axial y buje superior; permite giro libre y concentra la carga vertical en un punto.",
    "whenToUse": "Puertas y portones pivotantes, lamas giratorias de celosía, articulaciones expresadas en pérgolas."
  },
  {
    "id": "tornillo-autoperforante",
    "name": "Tornillo autoperforante con arandela EPDM",
    "description": "Tornillo de acero cementado o inoxidable con punta broca, para fijar láminas, policarbonato o paneles a correas; la arandela de neopreno/EPDM garantiza estanqueidad.",
    "whenToUse": "Cubiertas de pérgola, marquesina y kiosko; forros de lámina en portones y fachadas."
  },
  {
    "id": "conector-cortante-studs",
    "name": "Conectores de cortante soldados (studs) para steel deck",
    "description": "Pernos con cabeza soldados a través de la lámina colaborante sobre las vigas, que generan acción compuesta entre la losa y el acero (NSR-10 F.2.9, sección compuesta).",
    "whenToUse": "Mezzanines con steel deck y losa de concreto, para reducir el peso de las vigas y controlar vibraciones."
  },
  {
    "id": "tensor-varilla-horquilla",
    "name": "Tensor de varilla con horquilla y templador",
    "description": "Varilla roscada o barra con horquillas (clevis) y templador para ajustar tensión; los tensores trabajan solo a tracción y deben anclarse a un elemento estructural sólido.",
    "whenToUse": "Marquesinas atirantadas a muro o losa, arriostramiento en cruz de pérgolas y kioskos."
  }
];

export const CODE_NOTES: string[] = [
  "NSR-10 (Reglamento Colombiano de Construcción Sismo Resistente, Decreto 926 de 2010 y sus modificaciones, bajo la Ley 400 de 1997) es obligatorio. El Título F regula las estructuras metálicas: F.2 acero estructural laminado y tubular (basado en AISC 360), F.3 provisiones sísmicas para acero (basado en AISC 341) y F.4 perfiles de lámina formada en frío (basado en AISI S100). Verificar la numeración en la edición vigente.",
  "Bogotá está en zona de amenaza sísmica intermedia (Aa = 0,15; Av = 0,20, Apéndice A-4) y aplica la microzonificación sísmica (Decreto Distrital 523 de 2010), con espectros por zona (cerros, piedemonte, lacustre, aluvial). Las estructuras nuevas como mezzanines y pérgolas exentas deben usar el espectro de la zona del predio.",
  "Elementos no estructurales (Título A, Capítulo A.9): fachadas, celosías, barras, estanterías, letreros y equipos deben anclarse para la fuerza sísmica Fp y acomodar la deriva de la estructura principal.",
  "Cargas (Título B): carga viva según el uso (Tabla B.4.2.1-1; áreas de público y restaurantes ≈5,0 kN/m², oficinas ≈2,0 kN/m², almacenamiento mayor), carga de granizo obligatoria en cubiertas de ciudades sobre 2.000 m s. n. m. como Bogotá (B.4.8.3), viento (B.6) y cargas en barandas y pasamanos. Los valores exactos deben verificarse en el texto vigente.",
  "Título J (protección contra incendio): según el grupo de ocupación y el área, la estructura principal de mezzanines y escaleras puede requerir resistencia al fuego (pintura intumescente o encapsulado). Título K (requisitos complementarios): medios de evacuación, escaleras, barandas y vidrios de seguridad (vidrio templado-laminado en cubiertas y barandas).",
  "Licencia de construcción (Decreto 1077 de 2015, que compila el Decreto 1469 de 2010): un mezzanine que agrega área es una ampliación y requiere licencia ante una curaduría urbana de Bogotá, con planos arquitectónicos, memorias de cálculo y planos estructurales firmados por un ingeniero civil con matrícula profesional (COPNIA). Modificar la fachada, hacer un reforzamiento estructural o poner una cubierta permanente también puede requerir licencia. Las reparaciones locativas no la requieren, siempre que no afecten la estructura.",
  "Los inmuebles declarados Bien de Interés Cultural o ubicados en sectores de interés cultural (La Candelaria, Teusaquillo, partes de Chapinero) requieren aprobación previa del Instituto Distrital de Patrimonio Cultural (IDPC) para cualquier intervención de fachada, cubierta o estructura.",
  "Soldadura: AWS D1.1 (acero estructural, espesores ≥ 3 mm), AWS D1.3 (lámina delgada ≤ 4,8 mm) y AWS D1.6 (inoxidable). Se requieren procedimientos WPS precalificados o calificados, soldadores con certificado vigente (WPQ) e inspector CWI o equivalente para estructura. Usar electrodos de bajo hidrógeno (E7018) o alambre ER70S-6; en conexiones sísmicas de demanda crítica, metal de aporte con tenacidad Charpy certificada.",
  "Inspección de soldaduras: inspección visual (VT) al 100%; en soldaduras CJP de conexiones a momento, ultrasonido (UT) o partículas magnéticas (MT) según F.3/AISC 341. Deben documentarse los planos de taller (shop drawings) aprobados por el diseñador estructural antes de fabricar.",
  "Materiales: perfiles ASTM A36 (Fy 250 MPa) o A572 Gr. 50 (Fy 345 MPa); tubería estructural ASTM A500 Gr. C; corten ASTM A588 (Fy 345 MPa) o A242 y lámina tipo corten A606-4; lámina galvanizada ASTM A653 (steel deck G60/G90); pernos ASTM F3125 Gr. A325 con tuercas A563 y arandelas F436; anclajes ASTM F1554; adhesivos químicos calificados para concreto fisurado y sismo (ACI 355.4). Exigir certificados de calidad (mill certificates).",
  "Protección anticorrosiva: especificar según ISO 12944 (categoría de corrosividad y durabilidad) con preparación de superficie SSPC/ISO 8501 (SA 2½ para sistemas epóxicos) y galvanizado según ASTM A123 / ISO 1461. Medir espesores de película seca y registrarlos en el dossier de calidad.",
  "Instalaciones eléctricas en kioskos, iluminación LED de barras, letreros y barandas: deben cumplir RETIE y quedar certificadas.",
  "Publicidad exterior visual en Bogotá: los avisos de fachada se registran ante la Secretaría Distrital de Ambiente (Decreto Distrital 959 de 2000 y normas complementarias), que limita su número, área y ubicación por establecimiento.",
  "Espacio público: kioskos, marquesinas sobre el andén y mobiliario en antejardín o andén requieren permisos distritales (DADEP, IDU, Marco Regulatorio del Aprovechamiento Económico del Espacio Público, Decreto Distrital 552 de 2018 y sus modificaciones; verificar la norma vigente) y deben respetar el POT y la cartilla de andenes; no se puede ocupar el andén sin autorización."
];

export const BOGOTA_NOTES: string[] = [
  "Altitud de ≈2.600 m s. n. m.: la temperatura media es de 13–15 °C con fuerte oscilación diaria (≈5 °C de madrugada y 20–22 °C al mediodía). Es una dilatación térmica moderada (≈2–3 mm cada 10 m de acero expuesto), pero en elementos largos se deben prever juntas u agujeros ovalados.",
  "Humedad relativa alta (70–85%) y condensación de madrugada sobre el acero frío: el tiempo de humectación es largo aunque no llueva. Esto acelera la corrosión en bordes, soldaduras, cavidades y uniones sin drenaje; hay que sellar o drenar todos los tubos y evitar trampas de agua.",
  "Lluvias de ≈800–1.100 mm al año con régimen bimodal (temporadas de marzo a mayo y de septiembre a noviembre), lloviznas frecuentes y aguaceros con granizo. Las tormentas de granizo intensas (por ejemplo la de noviembre de 2007 en el norte de la ciudad y la de diciembre de 2022 en San Cristóbal) obligan a diseñar cubiertas para el granizo, preferir policarbonato de ≥ 8–10 mm o lámina sólida y usar vidrio laminado.",
  "Radiación UV muy alta por la altitud (índice UV con frecuencia de 11 o más al mediodía): los epóxicos sin protección se entizan y decoloran en meses. En exterior usar siempre acabado de poliuretano alifático o polvo poliéster de grado exterior; los colores oscuros se calientan más y se desvanecen antes.",
  "Corrosividad atmosférica estimada ISO 9223 C2–C3: C3 cerca de avenidas de alto tráfico diésel y zonas industriales (Puente Aranda, Montevideo, calle 13 y avenida 68). El hollín y el material particulado (PM2,5/PM10) ensucian los acabados, así que se recomienda lavarlos periódicamente. El galvanizado en caliente rinde muy bien en este ambiente.",
  "Acero corten en Bogotá: la pátina necesita ciclos de mojado y secado. Con el clima frío, nublado y húmedo se estabiliza lentamente (2–4 años) y en zonas resguardadas, en contacto con suelo o vegetación, o permanentemente húmedas, puede quedar porosa y escamosa con pérdida de sección. Se debe usar en superficies verticales ventiladas y expuestas, con espesores ≥ 3 mm en exterior, sin contacto con tierra.",
  "La escorrentía del corten mancha durante los primeros años andenes, fachadas claras y pisos de piedra: diseñar goteros, separaciones del muro y franjas de gravilla. En interiores la pátina no se forma de manera natural: usar pátina acelerada en taller y sellador (barniz o cera).",
  "Aplicación de pintura: por la humedad y el frío de las mañanas, aplicar solo cuando la superficie esté ≥ 3 °C por encima del punto de rocío y la HR sea < 85%. Los epóxicos curan lentamente por debajo de 10–15 °C. Conviene pintar en taller con condiciones controladas y dejar en obra solo los retoques.",
  "Suministro: en Colombia los perfiles y tubos se venden normalmente en barras de 6 m (algunos IPE/HEA/W en 12 m). Esto define la modulación y los empalmes. El precio del acero sigue el mercado internacional y la tasa de cambio, así que las cotizaciones deben tener vigencia corta (15–30 días).",
  "Galvanizado: hay plantas de galvanizado por inmersión en Bogotá y en municipios de la Sabana; el tamaño de la cuba (verificar con cada planta, del orden de 6–12 m de largo) limita las piezas. El diseño debe incluir perforaciones de venteo y drenaje y sumar 5–10 días de logística al cronograma.",
  "Logística y montaje: Bogotá restringe el tránsito de vehículos de carga en ciertos horarios y zonas, y los centros comerciales y zonas gastronómicas (Zona G, Usaquén, Chapinero) suelen exigir montajes nocturnos o en horarios definidos. Las piezas grandes, como los kioskos, requieren grúa y permiso para ocupar la vía.",
  "Suelos: la zona lacustre del occidente y el norte tiene arcillas blandas compresibles. Las estructuras exentas como kioskos, pérgolas y tótems necesitan dados o zapatas diseñados según la microzonificación y el estudio de suelos; no se deben apoyar sobre rellenos ni sobre el andén sin verificar."
];

export const PRICING_META: { asOf: string; caveats: string[]; feesNotes: string } = {
  "asOf": "octubre 2026",
  "caveats": [
    "Son estimaciones de orden de magnitud (−20% / +30%) construidas con fuentes públicas colombianas de 2025–2026 y criterio de taller; no reemplazan una cotización formal.",
    "El precio del acero es volátil: depende del dólar, del níquel (inoxidable), del zinc (galvanizado) y de medidas comerciales como el antidumping a la lámina galvanizada china (2025).",
    "La mano de obra subió con el salario mínimo de 2026 (≈23%), lo que encarece la fabricación frente a 2025.",
    "El precio por kilo sube cuando la pieza es pequeña, va a la vista y lleva mucho detalle: por eso una barra cuesta más por kilo que un entrepiso.",
    "Corten, inoxidable, galvanizado en caliente, pátina, electrostática y LED tienen pocas referencias públicas en Colombia: su precio tiene menor confianza.",
    "No incluye diseño o revisión estructural firmada (NSR-10), licencias de construcción, permisos de publicidad exterior o de espacio público, obra civil ni desmontes.",
    "El IVA se calcula al 19% sobre el total, como en el suministro e instalación de carpintería metálica; en contratos de obra con AIU puede liquidarse distinto.",
    "Fuera de Bogotá y la Sabana se suma el transporte por viaje."
  ],
  "feesNotes": "IVA general en Colombia: 19%. En contratos de obra bajo esquema AIU (Administración, Imprevistos y Utilidad, típicamente 20–30% sobre costo directo), el IVA puede liquidarse solo sobre la Utilidad; en la fabricación y suministro de mobiliario o carpintería metálica se cobra sobre el total. Hay que confirmarlo con el contador del estudio. Honorarios: el Decreto 2090 de 1989 (tarifas de la SCA) sigue siendo la referencia normativa y se calcula por categoría sobre el costo de obra. En el mercado se cobra 3–8% para edificaciones; para obras comerciales pequeñas como cafés (presupuesto bajo y mucho detalle) es razonable 6–12%, o un mínimo fijo por proyecto (estimación). Imprevistos: 10% (rango 8–15%; 15% si es remodelación sobre estructura existente o va a fachada). Transporte e instalación cuando el precio es solo de taller: 8–15%; ya están incluidos en los benchmarks por obra y en el COP/kg fabricado e instalado, así que no hay que sumarlos dos veces. Fuera de Bogotá y Cundinamarca hay recargos de transporte de ≈0,5–1,2 M COP por viaje (estimación)."
};

