// src/data/mrrobottoData.ts
// Datos de la plataforma Mr-Robotto: Tienda Maker, Cursos con DC-3, Tutoriales Arduino y Kits WRO/SOLACyT

import {
  TutorialModulo,
  CursoPremium,
  ProductoRobotica,
  CertificacionDC3Info
} from "@/types/mrrobotto";

export const CERTIFICACION_DC3_GLOBAL: CertificacionDC3Info = {
  incluida: true,
  claveRegistroSTPS: "STPS-CAP-MRB-2026/894",
  horasAcreditadas: 40,
  areaTematica: "Tecnologías de la Información, Robótica y Automatización Industrial",
  agenteCapacitador: "Centro de Capacitación Tecnológica Mr-Robotto S.A.S. de C.V.",
  beneficios: [
    "Constancia oficial de competencias o habilidades laborales con validez federal ante la STPS",
    "Currículum enriquecido con registro oficial para técnicos, ingenieros y docentes",
    "Evaluación de proyecto práctico final y retroalimentación personalizada por instructores certificados",
    "Acreditación de horas de educación técnica continua exigidas por empresas e instituciones educativas"
  ]
};

export const PRODUCTOS_MRROBOTTO: ProductoRobotica[] = [
  {
    id: "prod-wro-kit",
    slug: "kit-robotica-competicion-wro-roborunner",
    nombre: "Kit de Robótica de Competición WRO 'RoboRunner V3'",
    subtitulo: "Homologado para World Robot Olympiad (RoboMission) y torneos SOLACyT Infomatrix",
    categoria: "Kits de Competencia (WRO/SOLACyT)",
    precio: 2850,
    precioOriginal: 3400,
    stock: 14,
    envioGratis: true,
    destacadoReel: true,
    badge: "Homologado WRO 2026",
    calificacion: 4.95,
    reviewsCount: 38,
    imagenPrincipal: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion:
      "Diseñado específicamente para las exigencias de tiempo y precisión de la WRO y torneos de robótica móvil de SOLACyT. Cuenta con motores N20 de alto torque con encoder magnético de cuadratura, chasis de fibra de vidrio ultra ligero y placa controladora ESP32/Arduino con puente H MOSFET integrado.",
    compatibilidad: ["Arduino IDE", "ESP-IDF", "Python / MicroPython", "ROS 2 Embebido"],
    especificaciones: [
      { nombre: "Velocidad Máxima", valor: "1.8 m/s regulada con PID" },
      { nombre: "Microcontrolador", valor: "ESP32-S3 Dual Core 240MHz + Wi-Fi" },
      { nombre: "Sensores Incluidos", valor: "Barra de 8 sensores infrarrojos + ToF Láser + Giroscopio MPU6050" },
      { nombre: "Batería", valor: "LiPo 2S 7.4V 1500mAh con circuito de protección BMS" },
      { nombre: "Chasis", valor: "Fibra de vidrio FR4 con corte CNC de precisión" }
    ],
    contenidoCaja: [
      "Chasis RoboRunner V3 con tornillería de acero inoxidable",
      "2x Motores N20 12V con encoders magnéticos metálicos",
      "Tarjeta controladora Mr-Robotto Master Drive ESP32-S3",
      "Barra de 8 reflectores IR con salida analógica/digital",
      "Batería LiPo 7.4V con cargador balanceador inteligente",
      "Código base de calibración PID y biblioteca de navegación"
    ],
    enfoqueOlimpiada: "WRO RoboMission Senior / Junior & Robomatrix Seguidor de Línea"
  },
  {
    id: "prod-brazo-4dof",
    slug: "kit-brazo-robotico-4dof-garra-servos",
    nombre: "Kit Brazo Robótico 4-DoF con Garra y Servomotores Metálicos",
    subtitulo: "Estructura articulada de 4 grados de libertad con pinza mecánica para Arduino y ESP32",
    categoria: "Kits de Robótica (Brazos y Móviles)",
    precio: 1850,
    precioOriginal: 2200,
    stock: 12,
    envioGratis: true,
    destacadoReel: true,
    badge: "Kit Estrella",
    calificacion: 4.96,
    reviewsCount: 45,
    imagenPrincipal: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion: "Kit completo de brazo robótico industrial a escala para aprendizaje mecatrónico y automatización de procesos. Incorpora servomotores con piñonería metálica MG996R y SG90, base giratoria reforzada de 180° y pinza de sujeción de alta precisión. Incluye shield de conexión rápida para Arduino y código de cinemática inversa con control por joystick analógico o app Bluetooth.",
    compatibilidad: ["Arduino Uno / Mega", "ESP32", "Raspberry Pi", "Control por Joystick o Bluetooth"],
    especificaciones: [
      { nombre: "Grados de Libertad (DoF)", valor: "4 ejes (Base giratoria, Hombro, Codo, Pinza)" },
      { nombre: "Servomotores", valor: "2x MG996R (Metálicos 11kg/cm) + 2x SG90 (Micro)" },
      { nombre: "Alcance Máximo", valor: "32 cm de radio" },
      { nombre: "Capacidad de Carga", valor: "Hasta 250 gramos en extremo de pinza" },
      { nombre: "Alimentación", valor: "5V a 6V DC externa recomendada (2A - 3A)" }
    ],
    contenidoCaja: [
      "Piezas estructurales de acrílico reforzado / corte láser",
      "2x Servomotores metálicos MG996R de alto torque",
      "2x Micro servomotores SG90 para codo y garra",
      "Shield de expansión de servomotores para Arduino",
      "Módulo de 2 Joysticks analógicos con pulsador",
      "Fuente de alimentación 5V 3A regulada para servomotores",
      "Manual impreso de montaje y código fuente en C++"
    ]
  },
  {
    id: "prod-seguidor-linemaster",
    slug: "robot-seguidor-linea-wro-solacyt-linemaster",
    nombre: "Robot Seguidor de Línea Velocista 'LineMaster Pro' (WRO/SOLACyT)",
    subtitulo: "Seguidor de línea de alta velocidad con barra reflectiva de 8 sensores y control PID",
    categoria: "Kits de Competencia (WRO/SOLACyT)",
    precio: 2450,
    precioOriginal: 2950,
    stock: 9,
    envioGratis: true,
    destacadoReel: true,
    badge: "Campeón SOLACyT",
    calificacion: 4.98,
    reviewsCount: 31,
    imagenPrincipal: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion: "Robot móvil ultraligero diseñado para ganar carreras de seguidores de línea en pistas oficiales de lona negra con cinta blanca (o viceversa). Equipado con dos micromotores Pololu metálicos de 1000 RPM, puente H MOSFET de baja resistencia, barra frontal QTR-8A calibrada y algoritmo de control PID en tiempo real.",
    compatibilidad: ["Arduino IDE", "ESP32", "MicroPython"],
    especificaciones: [
      { nombre: "Velocidad Máxima", valor: "Hasta 2.2 m/s en recta" },
      { nombre: "Sensores Ópticos", valor: "Barra de 8 fototransistores infrarrojos frontales" },
      { nombre: "Chasis", valor: "Fibra de vidrio FR4 con pista de circuito impreso integrada" },
      { nombre: "Neumáticos", valor: "Ruedas de silicona de alta tracción y baja inercia" }
    ],
    contenidoCaja: [
      "Chasis LineMaster Pro ensamblado y probado",
      "Batería LiPo 7.4V de alta descarga",
      "Cargador USB para batería LiPo",
      "Código fuente abierto con rutina de autocalibración en pista"
    ],
    enfoqueOlimpiada: "SOLACyT Robomatrix Seguidor de Línea & WRO Future Engineers"
  },
  {
    id: "prod-stl-chasis-seguidor",
    slug: "archivos-stl-chasis-seguidor-linea-aerodinamico",
    nombre: "Pack STL: Chasis Ultraligero Aerodinámico para Seguidor de Línea",
    subtitulo: "Archivos 3D listos para imprimir en PLA/PETG optimizados para WRO y SOLACyT",
    categoria: "Archivos de Impresión 3D (.STL)",
    precio: 95,
    precioOriginal: 150,
    stock: 999,
    envioGratis: true,
    destacadoReel: false,
    badge: "Descarga Inmediata",
    calificacion: 4.92,
    reviewsCount: 67,
    imagenPrincipal: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion: "Pack de archivos digitales para fabricación aditiva FDM. Incluye el chasis monocasco de bajo centro de gravedad, soporte ajustable para barra de sensores reflectivos, encastres para micromotores N20 y bandeja porta-batería. Sin necesidad de soportes complejos.",
    compatibilidad: ["Cualquier impresora 3D FDM (Ender 3, Prusa, Bambu Lab)", "Slicers: Cura, PrusaSlicer, OrcaSlicer"],
    especificaciones: [
      { nombre: "Formatos Incluidos", valor: ".STL de alta resolución, .STEP editable y .3MF con perfiles" },
      { nombre: "Tiempo de Impresión", valor: "Aprox. 2h 45m al 20% de relleno" },
      { nombre: "Material Sugerido", valor: "PLA+, PETG o fibra de carbono PLA" },
      { nombre: "Peso Final de Pieza", valor: "28 gramos (super ligero)" }
    ],
    contenidoCaja: [
      "Descarga directa en archivo .ZIP",
      "Guía PDF con parámetros recomendados de laminado",
      "Licencia maker para impresión ilimitada de tu equipo"
    ],
    esDigital: true,
    formatosArchivos: [".STL", ".STEP", ".3MF"],
    parametrosImpresion: {
      material: "PLA+ / PETG",
      infill: "20% Gyroid",
      tiempoEstimado: "2h 45m",
      pesoFilamento: "28 g"
    }
  },
  {
    id: "prod-stl-brazo-4dof",
    slug: "archivos-stl-brazo-robotico-4dof-garra",
    nombre: "Pack STL: Estructura Completa de Brazo Robótico 4-DoF con Garra",
    subtitulo: "Kit de archivos 3D para armar tu propio brazo robótico con servos MG996R y SG90",
    categoria: "Archivos de Impresión 3D (.STL)",
    precio: 160,
    precioOriginal: 240,
    stock: 999,
    envioGratis: true,
    destacadoReel: false,
    badge: "Modelo 3D Imprimible",
    calificacion: 4.95,
    reviewsCount: 53,
    imagenPrincipal: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion: "Conjunto de 14 piezas 3D meticulosamente diseñadas para tolerancias de tornillería M3 y engranes estándar de servomotores. Incluye dedos de pinza con superficie dentada para agarrar objetos y base con alojamiento para rodamiento 608ZZ.",
    compatibilidad: ["Impresoras 3D FDM con cama de al menos 15x15 cm"],
    especificaciones: [
      { nombre: "Total de Piezas", valor: "14 archivos STL organizados por ensamblaje" },
      { nombre: "Formatos", valor: ".STL y .STEP (para personalizar en SolidWorks o Fusion 360)" },
      { nombre: "Tornillería Requerida", valor: "Tornillos M3 de varias longitudes (guía incluida)" }
    ],
    contenidoCaja: [
      "Descarga digital instantánea en .ZIP",
      "Manual esquemático de ensamblaje en PDF paso a paso",
      "Diagrama de cableado de servomotores hacia Arduino"
    ],
    esDigital: true,
    formatosArchivos: [".STL", ".STEP", ".3MF"],
    parametrosImpresion: {
      material: "PLA / PETG",
      infill: "30% Grid",
      tiempoEstimado: "9 horas (conjunto completo)",
      pesoFilamento: "140 g"
    }
  },
  {
    id: "prod-stl-soportes-sensores",
    slug: "archivos-stl-soportes-sensores-hcsr04-dht11-oled",
    nombre: "Pack STL: Soportes y Carcasas Modulares para Sensores Maker",
    subtitulo: "Soportes para sensor ultrasónico HC-SR04, DHT11/DHT22 y pantallas OLED 0.96\"",
    categoria: "Archivos de Impresión 3D (.STL)",
    precio: 65,
    precioOriginal: 110,
    stock: 999,
    envioGratis: true,
    destacadoReel: false,
    badge: "Utilidad Maker",
    calificacion: 4.88,
    reviewsCount: 39,
    imagenPrincipal: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion: "El kit de utilidades esenciales para prototipado limpio. Olvídate de pegar sensores con cinta o silicón: monta tus sensores ultrasónicos con rotación de servomotor, fija pantallas OLED al chasis y protege módulos térmicos DHT11.",
    compatibilidad: ["HC-SR04", "DHT11", "DHT22", "OLED 0.96 I2C", "Servomotores SG90"],
    especificaciones: [
      { nombre: "Piezas", valor: "8 modelos STL individuales de encastre a presión y con tornillo" },
      { nombre: "Tiempo por pieza", valor: "15 a 30 minutos por soporte" }
    ],
    contenidoCaja: [
      "Archivos STL listos para imprimir",
      "Archivos editables en STEP"
    ],
    esDigital: true,
    formatosArchivos: [".STL", ".STEP"],
    parametrosImpresion: {
      material: "PLA",
      infill: "15%",
      tiempoEstimado: "2 horas total",
      pesoFilamento: "35 g"
    }
  },
  {
    id: "prod-kit-sensores-37",
    slug: "kit-master-37-sensores-arduino-esp32",
    nombre: "Kit Master 37 Sensores y Módulos Maker para Arduino & ESP32",
    subtitulo: "El kit definitivo para aprender electrónica práctica y crear prototipos mecatrónicos",
    categoria: "Sensores & Módulos",
    precio: 680,
    precioOriginal: 890,
    stock: 29,
    envioGratis: true,
    destacadoReel: true,
    badge: "Más Vendido",
    calificacion: 4.9,
    reviewsCount: 112,
    imagenPrincipal: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion:
      "Conjunto completo de 37 sensores y módulos analógicos/digitales en estuche organizador rígido. Incluye sensores de ultrasonido, temperatura, gas, sonido, pulso cardíaco, infrarrojos, joysticks, relevadores y pantallas OLED.",
    compatibilidad: ["Arduino Uno / Nano / Mega", "ESP32", "Raspberry Pi Pico", "STM32"],
    especificaciones: [
      { nombre: "Total Módulos", valor: "37 módulos individuales en PCB estándar" },
      { nombre: "Voltaje Compatible", valor: "3.3V y 5V DC" },
      { nombre: "Estuche", valor: "Plástico ABS compartimentado con broche seguro" },
      { nombre: "Guías Digitales", valor: "Acceso exclusivo a los tutoriales interactivos de Mr-Robotto" }
    ],
    contenidoCaja: [
      "37 módulos de sensores y actuadores etiquetados",
      "Guía visual de conexión pinout a color",
      "Cables Dupont Hembra-Hembra y Macho-Hembra",
      "Acceso directo a los sketches C++ listos para copiar"
    ]
  },
  {
    id: "prod-esp32-devkit",
    slug: "esp32-wroom-32d-devkit-v1",
    nombre: "Placa de Desarrollo ESP32-WROOM-32D Dual-Core Wi-Fi + BLE",
    subtitulo: "Potencia de 240 MHz con conectividad inalámbrica para IoT y robots de telemetría",
    categoria: "Microcontroladores",
    precio: 145,
    precioOriginal: 190,
    stock: 50,
    envioGratis: false,
    destacadoReel: true,
    badge: "Oferta Maker",
    calificacion: 4.88,
    reviewsCount: 84,
    imagenPrincipal: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion:
      "La placa predilecta para el desarrollo de proyectos conectados de alta velocidad. Cuenta con 38 pines GPIO con soporte para DAC, ADC de 12 bits, sensores táctiles capacitivos, PWM por hardware y transceptor de radio de 2.4 GHz.",
    compatibilidad: ["Arduino IDE", "MicroPython", "Espressif IDF", "FreeRTOS"],
    especificaciones: [
      { nombre: "Procesador", valor: "Xtensa dual-core 32-bit LX6 hasta 240MHz" },
      { nombre: "Memoria", valor: "520 KB SRAM interna + 4MB Flash SPI" },
      { nombre: "Conectividad", valor: "Wi-Fi 802.11 b/g/n + Bluetooth 4.2 BR/EDR y BLE" },
      { nombre: "Conector USB", valor: "Micro-USB con convertidor serie CP2102 de alta velocidad" }
    ],
    contenidoCaja: [
      "Placa de desarrollo ESP32 DevKit V1 en empaque antiestático",
      "Pinout impreso de alta resolución"
    ]
  },
  {
    id: "prod-driver-l298n-pack",
    slug: "pack-driver-l298n-motores-dc",
    nombre: "Driver de Motores Doble Puente H L298N de Alto Rendimiento",
    subtitulo: "Control bidireccional hasta 2A por canal con gran disipador térmico",
    categoria: "Motores & Drivers",
    precio: 75,
    precioOriginal: 99,
    stock: 35,
    envioGratis: false,
    destacadoReel: false,
    badge: "Esencial Robótica",
    calificacion: 4.8,
    reviewsCount: 42,
    imagenPrincipal: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion:
      "Módulo de control de potencia diseñado para gobernar la dirección y velocidad de hasta 2 motores de corriente continua o 1 motor paso a paso bipolar.",
    compatibilidad: ["Arduino", "ESP32", "Raspberry Pi", "Microcontroladores PIC"],
    especificaciones: [
      { nombre: "Rango de Voltaje de Motores", valor: "5V a 35V DC" },
      { nombre: "Corriente Pico", valor: "3A (2A continuo por canal)" },
      { nombre: "Regulador 5V Integrado", valor: "LM78M05 para alimentar la lógica" }
    ],
    contenidoCaja: [
      "Módulo L298N con disipador montado de fábrica",
      "Guía rápida de conexión de borneras y jumpers"
    ]
  },
  {
    id: "prod-chasis-sumo-solacyt",
    slug: "chasis-aluminio-mini-sumo-solacyt",
    nombre: "Chasis CNC de Aluminio Anodizado para Mini Sumo de Torneo",
    subtitulo: "Cumple especificaciones oficiales de peso y dimensiones SOLACyT / Robomatrix",
    categoria: "Kits de Competencia (WRO/SOLACyT)",
    precio: 1450,
    precioOriginal: 1800,
    stock: 8,
    envioGratis: true,
    destacadoReel: true,
    badge: "Reglamento SOLACyT",
    calificacion: 4.97,
    reviewsCount: 19,
    imagenPrincipal: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion:
      "Estructura mecanizada en aleación de aluminio 6061 con rampa frontal afilada para levantar contrincantes en el dohyo. Diseñado para no exceder las dimensiones de 10x10 cm ni el límite de 500g de las categorías oficiales de Mini Sumo.",
    compatibilidad: ["Motores Pololu Micro Metal", "Sensores Sharp / ToF", "Controladores Arduino Nano / ESP32"],
    especificaciones: [
      { nombre: "Dimensiones", valor: "9.8 cm x 9.8 cm x 4.5 cm (Reglamentario)" },
      { nombre: "Peso Vacío", valor: "165 gramos" },
      { nombre: "Material", valor: "Aluminio aeroespacial anodizado negro mate" }
    ],
    contenidoCaja: [
      "Chasis principal con rampa frontal de ataque",
      "Soportes de montaje para micromotores",
      "Neumáticos de silicona de alta adherencia para pistas de lona",
      "Juego de tornillos Allen métrica 2mm"
    ],
    enfoqueOlimpiada: "SOLACyT Robomatrix Mini Sumo & Torneos Internacionales"
  }
];

export const CURSOS_PREMIUM_MRROBOTTO: CursoPremium[] = [
  {
    id: "curso-docentes-robotica",
    slug: "capacitacion-docentes-clubes-robotica-kits",
    titulo: "Capacitación para Docentes: Creación de Clubes de Robótica con Kits Mr-Robotto",
    descripcionCorta:
      "Formación pedagógica STEAM y técnica para profesores de secundaria, preparatoria y universidad. Incluye rúbricas de evaluación, planeaciones didácticas y Certificación Oficial DC-3 STPS.",
    descripcionLarga:
      "Diseñado especialmente para docentes, directores y coordinadores de tecnología que desean implementar talleres o materias extracurriculares de robótica educativa en sus colegios. Te enseñamos a estructurar sesiones prácticas de 50 a 90 minutos usando los kits de Mr-Robotto, cómo evaluar mediante rúbricas objetivas, resolver los fallos más comunes de hardware en clase y motivar a tus alumnos para participar en la World Robot Olympiad (WRO) o ferias de SOLACyT. Incluye acreditación oficial con Certificación DC-3 STPS.",
    nivel: "Principiante",
    categoria: "Capacitación Docente",
    instructor: {
      nombre: "Mtra. Claudia Santillán",
      rol: "Coordinadora Pedagógica STEAM y Asesora de Clubes Olímpicos",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      certificaciones: "Certificadora STPS • Especialista en Educación Tecnológica"
    },
    portada: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    duracionTotal: "30 horas con valor curricular (24 lecciones en video)",
    totalLecciones: 24,
    calificacion: 4.99,
    precio: 1650,
    precioOriginal: 2400,
    esPremium: true,
    esCapacitacionDocente: true,
    paraDocentes: {
      nivelEducativo: "Secundaria, Bachillerato y Universidad",
      incluyeMaterialAula: true,
      rubricasEvaluacion: true
    },
    certificacionDC3: {
      incluida: true,
      claveRegistroSTPS: "STPS-CAP-MRB-2026/410",
      horasAcreditadas: 30,
      areaTematica: "Capacitación Docente en Robótica y Metodologías STEAM",
      agenteCapacitador: "Centro de Capacitación Tecnológica Mr-Robotto S.A.S.",
      beneficios: [
        "Constancia de competencias laborales formato DC-3 con validez federal STPS para tu expediente docente",
        "Rúbricas de evaluación en PDF y planeaciones didácticas de 16 semanas listas para usar en tu colegio",
        "Asesoría técnica prioritaria por WhatsApp para resolver dudas durante tus clases de laboratorio",
        "Descuento institucional del 15% en compras de kits para tu colegio"
      ]
    },
    enfoqueCompetencia: "WRO",
    requisitos: [
      "Ser docente, instructor, laboratorista o directivo escolar.",
      "No se requiere experiencia técnica previa avanzada: partimos desde cero absoluto.",
      "Disponer de una computadora para Arduino IDE."
    ],
    loQueAprenderas: [
      "Metodología STEAM aplicada al aula con retos gamificados por equipos",
      "Paso a paso para ensamblar y diagnosticar los kits de Mr-Robotto (Brazos y Seguidores)",
      "Gestión de componentes y prevención de averías comunes en laboratorio escolar",
      "Diseño de rúbricas de evaluación por competencias alineadas a planes de estudio oficiales",
      "Preparación de equipos estudiantiles para torneos regionales y nacionales de WRO/SOLACyT"
    ],
    modulos: [
      {
        id: "doc-m1",
        titulo: "Módulo 1: Pedagogía STEAM y Estructura del Taller de Robótica",
        descripcion: "Cómo organizar el espacio de trabajo, roles de alumnos y dinámicas de aprendizaje.",
        lecciones: [
          {
            id: "lec-doc-1-1",
            titulo: "1.1 Bienvenida y Estructura Curricular del Taller Escolar",
            duracion: "18:30",
            resumen: "Definición del calendario de actividades, objetivos pedagógicos y selección de kits según la edad de los estudiantes.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            esGratis: true,
            recursos: [
              { nombre: "Planeación Didáctica Escolar de 16 Semanas (PDF)", tipo: "pdf", url: "#", peso: "1.8 MB" }
            ]
          },
          {
            id: "lec-doc-1-2",
            titulo: "1.2 Gestión del Material y Protocolos de Seguridad Eléctrica en el Aula",
            duracion: "22:15",
            resumen: "Reglas para el manejo de baterías LiPo, cautines y organización de kits para evitar pérdidas de componentes.",
            esGratis: false
          }
        ]
      }
    ]
  },
  {
    id: "curso-brazo-robotico-premium",
    slug: "masterclass-brazo-robotico-4dof-control-cinematica",
    titulo: "Masterclass Premium: Ensamblaje, Cinemática y Control del Brazo Robótico",
    descripcionCorta:
      "Aprende a construir, calibrar y programar rutinas de pick-and-place, cinemática directa/inversa y control por joystick o smartphone para el Brazo Robótico 4-DoF de Mr-Robotto.",
    descripcionLarga:
      "El curso oficial de acompañamiento para el Kit de Brazo Robótico Mr-Robotto. Desglosa desde la colocación de cada tornillo y centrado de los ejes de servomotores a 90 grados, hasta la programación de algoritmos de cinemática para mover la pinza a coordenadas (X, Y, Z) en el espacio tridimensional.",
    nivel: "Intermedio",
    categoria: "Cursos de Kits",
    instructor: {
      nombre: "Ing. David Almonte",
      rol: "Ingeniero Mecatrónico y Diseñador del Kit de Brazo Robótico Mr-Robotto",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    portada: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
    duracionTotal: "14 horas (18 lecciones)",
    totalLecciones: 18,
    calificacion: 4.97,
    precio: 850,
    precioOriginal: 1200,
    esPremium: true,
    certificacionDC3: {
      incluida: false,
      claveRegistroSTPS: "STPS-OPC-MRB-2026/512",
      horasAcreditadas: 14,
      areaTematica: "Mecatrónica y Manipuladores Robóticos",
      agenteCapacitador: "Mr-Robotto Capacitación Técnica",
      beneficios: [
        "Diploma digital de acreditación del curso",
        "Códigos y bibliotecas listas para cinemática inversa en Arduino y ESP32",
        "Archivos STL de refacciones y mejoras impresas para el brazo"
      ]
    },
    enfoqueCompetencia: "General",
    requisitos: [
      "Kit de Brazo Robótico Mr-Robotto (o piezas impresas compatibles).",
      "Arduino Uno, Nano o ESP32 con cable USB.",
      "Fuente de poder de 5V 3A para alimentar servomotores."
    ],
    loQueAprenderas: [
      "Ensamblaje mecánico correcto evitando holguras y calibración de servos a 90°",
      "Distribución de corriente de potencia vs lógica para evitar caídas de tensión (brownouts)",
      "Programación de secuencias de memoria: grabación y repetición de trayectorias (Pick & Place)",
      "Matemáticas de trigonometría y cinemática inversa bidimensional",
      "Comunicación inalámbrica Bluetooth con aplicación móvil para control manual"
    ],
    modulos: [
      {
        id: "br-m1",
        titulo: "Módulo 1: Ensamblaje Mecánico y Calibración Inicial",
        descripcion: "Montaje de base, hombro, codo y garra sin forzar los topes de los engranes.",
        lecciones: [
          {
            id: "lec-br-1-1",
            titulo: "1.1 Centrado Eléctrico de Servos antes del Montaje",
            duracion: "15:10",
            resumen: "Paso crítico: cómo calibrar el punto neutro de los servos con un sketch simple antes de atornillar las articulaciones.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            esGratis: true
          }
        ]
      }
    ]
  },
  {
    id: "curso-dc3-robotica-industrial",
    slug: "certificacion-dc3-robotica-automatizacion",
    titulo: "Certificación DC-3: Robótica Móvil, Microcontroladores y Automatización Industrial",
    descripcionCorta:
      "Obtén la Constancia Oficial de Competencias Laborales (Formato DC-3 de la STPS) válida a nivel nacional en México. Domina programación en C++, arquitectura embebida y control de potencia.",
    descripcionLarga:
      "Programa de alta especialización técnica avalado ante la Secretaría del Trabajo y Previsión Social (STPS). Aprende desde la instrumentación analógica y digital con microcontroladores hasta el diseño de bucles de control PID para robots móviles y maquinaria industrial pequeña. Incluye emisión de constancia oficial DC-3 con código de registro y verificación digital.",
    nivel: "Intermedio",
    categoria: "Automatización & PLC",
    instructor: {
      nombre: "M. en C. Roberto Palacios",
      rol: "Agente Capacitador Externo Registrado STPS / Especialista en Automatización",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      certificaciones: "Registro STPS: PARM-850412-STP • Senior Member IEEE Robotics"
    },
    portada: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    duracionTotal: "40 horas con valor curricular (32 lecciones en video HD)",
    totalLecciones: 32,
    calificacion: 4.98,
    precio: 1850,
    precioOriginal: 2600,
    esPremium: true,
    certificacionDC3: {
      incluida: true,
      claveRegistroSTPS: "STPS-CAP-MRB-2026/894",
      horasAcreditadas: 40,
      areaTematica: "Tecnologías de la Información, Robótica y Automatización",
      agenteCapacitador: "Mr-Robotto Capacitación Técnica S.A.S.",
      beneficios: [
        "Emisión de constancia oficial en formato DC-3 con firma y sello del Agente Capacitador",
        "Valor curricular oficial para ascensos laborales y cumplimiento de normatividad STPS",
        "Revisión y retroalimentación de código por parte de ingenieros de soporte",
        "Acceso vitalicio al material, esquemas de circuitos y actualizaciones"
      ]
    },
    enfoqueCompetencia: "General",
    requisitos: [
      "Conocimientos básicos de computación y aritmética elemental.",
      "Placa de desarrollo Arduino Uno/Nano o ESP32 con cable de datos.",
      "Residir en México para la emisión del documento oficial DC-3 con CURP (o recibir certificado internacional si resides en el extranjero)."
    ],
    loQueAprenderas: [
      "Marco normativo laboral de seguridad en automatización industrial (NOM-004-STPS)",
      "Programación estructurada en C/C++ embebido y gestión de interrupciones de hardware",
      "Control de actuadores industriales: relevadores de estado sólido, servomotores y variadores de frecuencia simples",
      "Diseño de interfaces hombre-máquina (HMI) compactas con pantallas OLED y teclados matriciales",
      "Protocolos industriales serie: Modbus RTU básico, UART y bus I2C con aislamiento galvánico",
      "Construcción y presentación de proyecto técnico final para acreditación de la constancia DC-3"
    ],
    modulos: [
      {
        id: "m1-dc3",
        titulo: "Módulo 1: Fundamentos Normativos y Arquitectura de Control",
        descripcion: "Reglamentación STPS, seguridad eléctrica y manejo de entradas/salidas protegidas.",
        lecciones: [
          {
            id: "lec-dc3-1-1",
            titulo: "1.1 Introducción a la Capacitación Técnica DC-3 y Normas de Seguridad",
            duracion: "16:20",
            resumen:
              "Explicación del formato oficial DC-3, requisitos de evaluación, prevención de riesgos por arco eléctrico y protección de tarjetas electrónicas contra descargas electrostáticas (ESD).",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            esGratis: true,
            recursos: [
              { nombre: "Guía Oficial de Certificación DC-3 STPS (PDF)", tipo: "pdf", url: "#", peso: "1.5 MB" }
            ]
          },
          {
            id: "lec-dc3-1-2",
            titulo: "1.2 Aislamiento Galvánico con Optoacopladores y Relevadores",
            duracion: "22:45",
            resumen:
              "Cómo proteger las salidas del microcontrolador frente a cargas inductivas utilizando optoacopladores PC817 y diodos flyback 1N4007.",
            esGratis: false
          }
        ]
      },
      {
        id: "m2-dc3",
        titulo: "Módulo 2: Sensores Industriales y Acondicionamiento de Señal",
        descripcion: "Transmisores de corriente 4-20mA, divisores de tensión de precisión y filtrado digital.",
        lecciones: [
          {
            id: "lec-dc3-2-1",
            titulo: "2.1 Lectura de Señales Analógicas Ruidosas y Filtros Media Móvil",
            duracion: "19:15",
            resumen:
              "Técnicas de software para limpiar lecturas de sensores térmicos y de presión en entornos con interferencia electromagnética de motores.",
            esGratis: false
          }
        ]
      }
    ]
  },
  {
    id: "curso-wro-solacyt-master",
    slug: "preparacion-olimpiadas-wro-solacyt",
    titulo: "Masterclass: Robótica de Competición WRO y Torneos SOLACyT Infomatrix",
    descripcionCorta:
      "Aprende las estrategias mecánicas, algoritmos de seguimiento de línea de alta velocidad con control PID y visión por sensores que usan los equipos campeones mundiales.",
    descripcionLarga:
      "Tanto la World Robot Olympiad (WRO) como los torneos de la Sociedad Latinoamericana de Ciencia y Tecnología (SOLACyT / Infomatrix y Robomatrix) exigen un nivel de ingeniería y resolución autónoma muy por encima de los proyectos escolares convencionales. En este curso desarmamos las mejores arquitecturas mecánicas, la física de la adherencia en pista y los algoritmos de control PID en tiempo real.",
    nivel: "Avanzado",
    categoria: "Robótica WRO / SOLACyT",
    instructor: {
      nombre: "Ing. David Almonte",
      rol: "Coach Olímpico WRO México / Ganador Medalla de Oro Infomatrix Sudamérica",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    portada: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    duracionTotal: "25 horas de entrenamiento táctico (20 lecciones)",
    totalLecciones: 20,
    calificacion: 4.96,
    precio: 1250,
    precioOriginal: 1950,
    esPremium: true,
    certificacionDC3: {
      incluida: true,
      claveRegistroSTPS: "STPS-CAP-MRB-2026/721",
      horasAcreditadas: 25,
      areaTematica: "Desarrollo de Soluciones de Robótica Móvil Avanzada",
      agenteCapacitador: "Mr-Robotto Capacitación Técnica S.A.S.",
      beneficios: [
        "Diploma avalado ante la STPS y certificación técnica de entrenador/competidor",
        "Acceso al repositorio de algoritmos PID sintonizados para pistas oficiales",
        "Sesiones mensuales de mentoría y resolución de retos de las temporadas vigentes"
      ]
    },
    enfoqueCompetencia: "WRO",
    requisitos: [
      "Conocimientos intermedios de Arduino o ESP32 en C++.",
      "Chasis móvil de competencia (preferentemente con encoders magnéticos).",
      "Ganas de competir o asesorar equipos escolares en torneos nacionales e internacionales."
    ],
    loQueAprenderas: [
      "Interpretación estratégica del reglamento de la temporada WRO (Reglas generales y de sorpresa)",
      "Cálculo matemático de relaciones de engranajes y centro de gravedad para máxima estabilidad",
      "Implementación matemática de algoritmo PID (Proporcional, Integral y Derivativo) con tiempo de muestreo constante",
      "Calibración automática de barras de sensores ópticos ante distintas tonalidades de pista",
      "Algoritmos de búsqueda de salida de laberintos y evasión rápida de obstáculos",
      "Diseño del portafolio técnico y defensa del proyecto ante el jurado calificador de SOLACyT"
    ],
    modulos: [
      {
        id: "wro-m1",
        titulo: "Módulo 1: Estrategia de Reglamento y Cinemática de Alta Velocidad",
        descripcion: "Secretos de diseño mecánico, selección de ruedas de silicona y análisis de pistas.",
        lecciones: [
          {
            id: "lec-wro-1-1",
            titulo: "1.1 Desglosando el Reglamento WRO y Criterios de Evaluación SOLACyT",
            duracion: "24:10",
            resumen:
              "Cómo sumar la mayor cantidad de puntos en el menor tiempo posible, evitando penalizaciones por contacto o salida de pista.",
            esGratis: true
          }
        ]
      },
      {
        id: "wro-m2",
        titulo: "Módulo 2: Algoritmo PID de Seguimiento y Calibración en Vivo",
        descripcion: "Programación del lazo cerrado de control con corrección milimétrica de trayectoria.",
        lecciones: [
          {
            id: "lec-wro-2-1",
            titulo: "2.1 Código Maestro PID en Arduino / ESP32 para Barras de 8 Sensores",
            duracion: "31:40",
            resumen:
              "Cálculo del error ponderado, sintonización de constantes Kp, Ki y Kd, y ajuste dinámico en curvas pronunciadas.",
            codigoArduino: `/*
 * Control PID para Seguidor de Línea de Competición
 * Mr-Robotto Academy - Especial WRO / SOLACyT
 */

// Constantes de sintonización PID
float Kp = 0.28;
float Ki = 0.0001;
float Kd = 1.45;

int error = 0;
int errorPrevio = 0;
float integral = 0;
float derivativo = 0;
int correccion = 0;

const int VELOCIDAD_BASE = 160;

void setup() {
  Serial.begin(115200);
  // Inicialización de hardware
}

void loop() {
  // 1. Leer barra reflectiva y calcular error (-100 a +100)
  // error = calcularErrorSensores();

  // 2. Cálculo de términos del controlador
  integral += error;
  integral = constrain(integral, -100, 100); // Anti-windup
  derivativo = error - errorPrevio;

  correccion = (Kp * error) + (Ki * integral) + (Kd * derivativo);
  errorPrevio = error;

  // 3. Aplicar velocidades a motores izquierdo y derecho
  int velocidadIzq = constrain(VELOCIDAD_BASE + correccion, 0, 255);
  int velocidadDer = constrain(VELOCIDAD_BASE - correccion, 0, 255);

  // motorIzquierdo(velocidadIzq);
  // motorDerecho(velocidadDer);
}`,
            esGratis: false
          }
        ]
      }
    ]
  },
  {
    id: "curso-arduino-cero-mrb",
    slug: "arduino-desde-cero-maker",
    titulo: "Arduino y Microcontroladores desde Cero: Fundamentos a Proyectos Autónomos",
    descripcionCorta:
      "Aprende electrónica práctica y programación en C++ para microcontroladores desde lo más básico. Diseña circuitos, domina sensores y crea tus primeros sistemas automatizados.",
    descripcionLarga:
      "Este curso práctico te guiará paso a paso por la arquitectura del microcontrolador ATmega328P de Arduino, el entorno Arduino IDE 2.x, las leyes esenciales de Ohm y Kirchhoff aplicadas a circuitos maker, y la lectura/escritura de señales digitales y analógicas.",
    nivel: "Principiante",
    categoria: "Arduino & Maker",
    instructor: {
      nombre: "Ing. Fidel Ramos",
      rol: "Especialista en Sistemas Embebidos y Robótica Educativa",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    portada: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80",
    duracionTotal: "12 horas (28 lecciones en video HD)",
    totalLecciones: 28,
    calificacion: 4.9,
    precio: 490,
    precioOriginal: 850,
    esPremium: false,
    certificacionDC3: {
      incluida: false,
      claveRegistroSTPS: "STPS-OPC-MRB-2026/102",
      horasAcreditadas: 15,
      areaTematica: "Fundamentos de Hardware Libre",
      agenteCapacitador: "Mr-Robotto Capacitación Técnica",
      beneficios: [
        "Diploma de acreditación de curso básico",
        "Opción de trámite de certificado DC-3 al culminar proyecto integrador"
      ]
    },
    enfoqueCompetencia: "General",
    requisitos: [
      "No se requieren conocimientos previos de programación ni electrónica.",
      "Placa Arduino Uno, Nano o compatible con cable USB."
    ],
    loQueAprenderas: [
      "Arquitectura de microcontroladores y flujo de ejecución en tiempo real",
      "Sintaxis de C++ aplicada al hardware: variables, funciones y condicionales",
      "Lectura analógica y modulación por ancho de pulsos (PWM)",
      "Control de servomotores y pantallas OLED por I2C"
    ],
    modulos: [
      {
        id: "m1-ard",
        titulo: "Módulo 1: Fundamentos de Hardware y Entorno Arduino IDE",
        descripcion: "Conoce las entrañas de la placa, instalación del software y tu primer circuito blink.",
        lecciones: [
          {
            id: "lec-ard-1-1",
            titulo: "1.1 Bienvenida y Anatomía de la Placa Arduino Uno",
            duracion: "12:15",
            resumen:
              "Revisión de componentes: microcontrolador ATmega328P, reguladores de voltaje y convertidor USB-Serie.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            esGratis: true
          }
        ]
      }
    ]
  }
];

export const TUTORIALES_MODULOS: TutorialModulo[] = [
  {
    id: "mod-1",
    slug: "sensor-ultrasonico-hc-sr04",
    nombre: "Sensor Ultrasónico de Distancia HC-SR04",
    subtitulo: "Medición precisa de distancia de 2 cm a 400 cm mediante eco acústico en Arduino",
    categoria: "Sensores",
    chipPrincipal: "HC-SR04 Transductor Ultrasónico 40kHz",
    nivel: "Principiante",
    voltajeOperacion: "5V DC",
    protocolo: "Pulsos Digitales (Trigger / Echo)",
    tiempoEstimado: "15 min",
    imagen: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80",
    descripcion:
      "El HC-SR04 es el sensor de evasión de obstáculos más usado en competencias WRO y Robomatrix. Emite una ráfaga ultrasónica a 40 kHz mediante su transductor transmisor (Trigger) y mide el tiempo que tarda la onda en rebotar en un objeto y volver al receptor (Echo). Con la velocidad del sonido en el aire (343 m/s), calculamos la distancia exacta en centímetros.",
    especificaciones: [
      { nombre: "Voltaje de alimentación", valor: "5V DC ± 10%" },
      { nombre: "Consumo de corriente", valor: "15 mA en reposo / 2 mA en ráfaga" },
      { nombre: "Frecuencia de trabajo", valor: "40 kHz" },
      { nombre: "Rango de medición", valor: "2 cm a 400 cm" },
      { nombre: "Ángulo de apertura eficaz", valor: "15 grados" },
      { nombre: "Resolución de lectura", valor: "0.3 cm" }
    ],
    pines: [
      {
        pinModulo: "VCC",
        pinArduino: "5V",
        colorCable: "Rojo",
        tipoSenal: "Alimentación (VCC)",
        nota: "Conectar a la salida fija de 5V de Arduino (no usar 3.3V porque el sensor requiere 5V)."
      },
      {
        pinModulo: "Trig",
        pinArduino: "Pin D9",
        colorCable: "Amarillo",
        tipoSenal: "Digital I/O",
        nota: "Pin configurado como OUTPUT en Arduino para emitir el pulso de disparo de 10 microsegundos."
      },
      {
        pinModulo: "Echo",
        pinArduino: "Pin D10",
        colorCable: "Azul",
        tipoSenal: "Digital I/O",
        nota: "Pin configurado como INPUT. El sensor pone este pin en HIGH durante el tiempo de vuelo del ultrasonido."
      },
      {
        pinModulo: "GND",
        pinArduino: "GND",
        colorCable: "Negro",
        tipoSenal: "Tierra (GND)",
        nota: "Tierra común del circuito de control y Arduino."
      }
    ],
    librerias: [
      {
        nombre: "Sin librerías obligatorias (Usa función nativa pulseIn)",
        autor: "Arduino Core",
        instalador: "Viene incluido por defecto en Arduino IDE sin instalar paquetes adicionales."
      }
    ],
    codigoArduino: `/*
 * Tutorial: Sensor Ultrasónico HC-SR04 con Arduino
 * Mr-Robotto - Plataforma Maker y Robótica
 * Mide distancia en cm y la envía al Monitor Serial a 9600 baudios.
 */

const int PIN_TRIG = 9;  // Pin de disparo (Trigger)
const int PIN_ECHO = 10; // Pin de recepción (Echo)

void setup() {
  Serial.begin(9600);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  
  Serial.println("======================================");
  Serial.println("  Mr-Robotto: Sensor HC-SR04 Listo    ");
  Serial.println("======================================");
}

void loop() {
  long duracion;
  float distanciaCm;

  // 1. Pulso de 10 us en HIGH
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(4);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  // 2. Medir tiempo de retorno
  duracion = pulseIn(PIN_ECHO, HIGH, 30000);

  // 3. Conversión matemática
  if (duracion == 0) {
    Serial.println("Fuera de rango o sin obstáculo.");
  } else {
    distanciaCm = (duracion * 0.0343) / 2.0;
    Serial.print("Distancia: ");
    Serial.print(distanciaCm, 1);
    Serial.println(" cm");
  }

  delay(100);
}`,
    explicacionCodigo: [
      {
        paso: "Pulso Trigger",
        detalle: "Se emite un pulso en estado HIGH de 10 microsegundos para que los cristales piezoeléctricos vibren a 40kHz."
      },
      {
        paso: "pulseIn(Echo)",
        detalle: "Captura el tiempo de ida y vuelta de la onda acústica."
      },
      {
        paso: "Fórmula de distancia",
        detalle: "distancia = (tiempo * 0.0343) / 2. Se divide entre dos porque el trayecto es de ida y vuelta."
      }
    ],
    solucionProblemas: [
      {
        problema: "Siempre devuelve 0.0 cm",
        causa: "Pines Trig y Echo cruzados o alimentación deficiente.",
        solucion: "Revisa que VCC esté a 5V firme y los cables Trig en D9 y Echo en D10."
      }
    ],
    tags: ["Sensor", "Ultrasonido", "Distancia", "WRO", "Robótica"]
  },
  {
    id: "mod-2",
    slug: "pantalla-oled-096-i2c-ssd1306",
    nombre: "Pantalla OLED 0.96\" I2C (Controlador SSD1306)",
    subtitulo: "Visualización gráfica nítida de 128x64 píxeles con solo 2 pines de comunicación en Arduino",
    categoria: "Displays",
    chipPrincipal: "SSD1306 OLED Monocromático",
    nivel: "Principiante",
    voltajeOperacion: "3.3V - 5V DC (con regulador integrado)",
    protocolo: "I2C (SDA / SCL, dirección 0x3C)",
    tiempoEstimado: "20 min",
    imagen: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    descripcion:
      "La pantalla OLED de 0.96 pulgadas con resolución de 128x64 píxeles y bus I2C es fundamental para mostrar telemetría en vivo de robots de competición (estado de sensores, voltaje de batería y tiempos de vuelta en pista).",
    especificaciones: [
      { nombre: "Resolución", valor: "128 x 64 píxeles monocromáticos" },
      { nombre: "Controlador interno", valor: "SSD1306" },
      { nombre: "Voltaje de operación", valor: "3.3V a 5.0V DC" },
      { nombre: "Consumo de energía", valor: "Aprox. 20 mA activo" }
    ],
    pines: [
      {
        pinModulo: "VCC",
        pinArduino: "5V o 3.3V",
        colorCable: "Rojo",
        tipoSenal: "Alimentación (VCC)",
        nota: "Alimentación con regulador LDO."
      },
      {
        pinModulo: "GND",
        pinArduino: "GND",
        colorCable: "Negro",
        tipoSenal: "Tierra (GND)",
        nota: "Tierra común."
      },
      {
        pinModulo: "SCL",
        pinArduino: "Pin A5 (en Uno/Nano) o D22 (ESP32)",
        colorCable: "Amarillo",
        tipoSenal: "I2C (SCL)",
        nota: "Reloj I2C."
      },
      {
        pinModulo: "SDA",
        pinArduino: "Pin A4 (en Uno/Nano) o D21 (ESP32)",
        colorCable: "Verde",
        tipoSenal: "I2C (SDA)",
        nota: "Datos I2C."
      }
    ],
    librerias: [
      {
        nombre: "Adafruit_SSD1306",
        autor: "Adafruit",
        instalador: "Instalar vía Gestor de Bibliotecas de Arduino IDE."
      }
    ],
    codigoArduino: `/*
 * Tutorial: Pantalla OLED 0.96" SSD1306 con Arduino
 * Mr-Robotto - Robótica y Maker Lab
 */

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define ANCHO_PANTALLA 128
#define ALTO_PANTALLA 64
#define OLED_RESET -1
Adafruit_SSD1306 display(ANCHO_PANTALLA, ALTO_PANTALLA, &Wire, OLED_RESET);

void setup() {
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    for (;;);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(20, 10);
  display.println(F("MR-ROBOTTO"));
  display.setCursor(10, 30);
  display.println(F("WRO/SOLACyT Ready"));
  display.display();
}

void loop() {
  // Bucle de telemetría
}`,
    explicacionCodigo: [
      {
        paso: "display.begin(0x3C)",
        detalle: "Inicia la pantalla en la dirección estándar I2C 0x3C."
      }
    ],
    solucionProblemas: [
      {
        problema: "Pantalla no enciende",
        causa: "Dirección incorrecta (0x3D) o cables invertidos.",
        solucion: "Verifica que SDA vaya a A4 y SCL a A5 en Arduino Uno."
      }
    ],
    tags: ["Display", "OLED", "I2C", "Telemetría", "Robótica"]
  },
  {
    id: "mod-dht11",
    slug: "sensor-temperatura-humedad-dht11",
    nombre: "Sensor de Temperatura y Humedad DHT11",
    subtitulo: "Lectura digital de temperatura (0-50°C) y humedad relativa (20-90% RH) para proyectos escolares y estaciones meteorológicas con Arduino y ESP32",
    categoria: "Sensores",
    chipPrincipal: "DHT11 Sensor Resistivo / NTC",
    nivel: "Principiante",
    voltajeOperacion: "3.3V a 5.0V DC",
    protocolo: "Digital Propietario (Single-Bus / 1 Hilo)",
    tiempoEstimado: "15 min",
    imagen: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    descripcion:
      "El sensor DHT11 es el componente de referencia para aprender instrumentación ambiental en Arduino y ESP32. Su carcasa azul integra un sensor de humedad capacitivo y un termistor NTC calibrados en fábrica. Envía 40 bits de datos digitales seriales mediante una sola línea de señal, eliminando el ruido típico de lecturas analógicas.",
    especificaciones: [
      { nombre: "Voltaje de alimentación", valor: "3.3V a 5.5V DC" },
      { nombre: "Rango de Humedad", valor: "20% a 90% RH con precisión del 5%" },
      { nombre: "Rango de Temperatura", valor: "0°C a 50°C con precisión de ±2°C" },
      { nombre: "Frecuencia de muestreo", valor: "1 Hz (1 lectura por segundo)" },
      { nombre: "Corriente de consumo", valor: "0.5 a 2.5 mA en medición / 100 uA en espera" }
    ],
    pines: [
      {
        pinModulo: "VCC (+)",
        pinArduino: "5V (o 3.3V en ESP32)",
        colorCable: "Rojo",
        tipoSenal: "Alimentación (VCC)",
        nota: "Alimentar preferentemente con 5V para mayor estabilidad de lectura en Arduino Uno."
      },
      {
        pinModulo: "DATA (Out)",
        pinArduino: "Pin D2 (Arduino) / GPIO 4 (ESP32)",
        colorCable: "Amarillo",
        tipoSenal: "Digital I/O",
        nota: "Línea de datos con resistencia pull-up de 4.7kΩ a 10kΩ hacia VCC (los módulos breakout ya la incluyen)."
      },
      {
        pinModulo: "GND (-)",
        pinArduino: "GND",
        colorCable: "Negro",
        tipoSenal: "Tierra (GND)",
        nota: "Referencia de tierra común del circuito."
      }
    ],
    librerias: [
      {
        nombre: "DHT sensor library",
        autor: "Adafruit",
        instalador: "Buscar 'DHT sensor library by Adafruit' en el Gestor de Bibliotecas de Arduino IDE e instalar con dependencias (Adafruit Unified Sensor)."
      }
    ],
    codigoArduino: `/*
 * Tutorial: Sensor de Temperatura y Humedad DHT11
 * Mr-Robotto - Robótica y Formación Maker
 * Compatible con Arduino Uno, Nano, Mega y ESP32.
 */

#include "DHT.h"

// Definición de pines y tipo de sensor
#define PIN_DHT 2       // Pin digital donde está conectado el cable DATA
#define TIPO_DHT DHT11  // Definimos explícitamente el modelo DHT11

DHT dht(PIN_DHT, TIPO_DHT);

void setup() {
  Serial.begin(9600);
  Serial.println("==========================================");
  Serial.println("   Mr-Robotto: Iniciando Sensor DHT11     ");
  Serial.println("==========================================");

  // Inicializar sensor
  dht.begin();
  delay(1000); // Pausa de estabilización inicial
}

void loop() {
  // El DHT11 requiere al menos 1 segundo entre lecturas consecutivas
  delay(2000);

  // Leer humedad relativa (%) y temperatura en grados Celsius (°C)
  float humedad = dht.readHumidity();
  float temperatura = dht.readTemperature();

  // Comprobar si la lectura falló
  if (isnan(humedad) || isnan(temperatura)) {
    Serial.println("Error: No se pudo obtener datos del DHT11. Revisa cables y resistencia pull-up.");
    return;
  }

  // Calcular índice de calor (sensación térmica)
  float indiceCalor = dht.computeHeatIndex(temperatura, humedad, false);

  // Imprimir reporte por el Monitor Serial
  Serial.print("Humedad Relativa: ");
  Serial.print(humedad, 1);
  Serial.print(" %\t");
  Serial.print("Temperatura: ");
  Serial.print(temperatura, 1);
  Serial.print(" °C\t");
  Serial.print("Sensación Térmica: ");
  Serial.print(indiceCalor, 1);
  Serial.println(" °C");
}`,
    explicacionCodigo: [
      {
        paso: "DHT dht(PIN_DHT, DHT11)",
        detalle: "Instancia el objeto del sensor configurándolo específicamente para el chip DHT11 en el pin digital 2."
      },
      {
        paso: "dht.readHumidity() y readTemperature()",
        detalle: "Envía el tren de pulsos de inicio y decodifica los 40 bits de humedad y temperatura enviados por el microprocesador interno del sensor."
      },
      {
        paso: "isnan(humedad)",
        detalle: "Comprueba si la función devolvió un valor nulo (Not a Number) ante falsos contactos o desconexiones físicas."
      }
    ],
    solucionProblemas: [
      {
        problema: "El monitor serial solo muestra 'Error: No se pudo obtener datos del DHT11'",
        causa: "Pin DATA conectado en pin analógico en lugar de digital, o falta de resistencia pull-up en sensores sueltos (de 4 patas sin plaqueta PCB).",
        solucion: "Si usas el sensor suelto de 4 patas, coloca una resistencia de 10kΩ entre el pin VCC y DATA. Si usas la plaqueta PCB de 3 pines, verifica que el cable DATA coincida con el pin definido en #define PIN_DHT."
      },
      {
        problema: "Las lecturas no cambian o se congelan",
        causa: "Frecuencia de lectura menor a 1 segundo en el bucle loop().",
        solucion: "Mantén un delay(2000) entre lecturas para no saturar el elemento sensor sensible."
      }
    ],
    tags: ["Sensor", "DHT11", "Temperatura", "Humedad", "Arduino", "ESP32", "Maker"]
  },
  {
    id: "mod-esp32-iot",
    slug: "esp32-devkit-wifi-servidor-web-telemetria",
    nombre: "ESP32 DevKit: WiFi Integrado, Servidor Web y Telemetría Maker",
    subtitulo: "Aprende a montar un servidor web local en ESP32 para controlar actuadores y visualizar telemetría desde tu celular",
    categoria: "Microcontroladores",
    chipPrincipal: "ESP32-WROOM-32 Dual Core 240MHz",
    nivel: "Intermedio",
    voltajeOperacion: "5V Micro-USB / 3.3V GPIO",
    protocolo: "WiFi 802.11 b/g/n + HTTP Server",
    tiempoEstimado: "25 min",
    imagen: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80",
    descripcion:
      "El ESP32 es el cerebro predilecto para proyectos IoT, telemetría de robots de competencia y prototipos avanzados para torneos SOLACyT. Este tutorial enseña cómo conectar el microcontrolador a una red inalámbrica WiFi local y levantar un servidor web HTTP que sirve una interfaz gráfica para encender y apagar actuadores y monitorear sensores en tiempo real.",
    especificaciones: [
      { nombre: "Procesador", valor: "Tensilica Xtensa Dual-Core 32-bit LX6 a 240 MHz" },
      { nombre: "Conectividad", valor: "WiFi 802.11 b/g/n y Bluetooth v4.2 BR/EDR y BLE" },
      { nombre: "Memoria", valor: "520 KB SRAM + 4 MB Flash externa" },
      { nombre: "Entradas/Salidas", valor: "36 pines GPIO, 18 canales ADC de 12 bits, 2 DAC de 8 bits" }
    ],
    pines: [
      {
        pinModulo: "VIN / 5V",
        pinArduino: "5V USB",
        colorCable: "Rojo",
        tipoSenal: "Alimentación (VCC)",
        nota: "Entrada del regulador LDO interno (soporta 5V por USB)."
      },
      {
        pinModulo: "GND",
        pinArduino: "GND",
        colorCable: "Negro",
        tipoSenal: "Tierra (GND)",
        nota: "Tierra del circuito."
      },
      {
        pinModulo: "GPIO 2 (LED integrado)",
        pinArduino: "Salida Digital",
        colorCable: "Azul",
        tipoSenal: "Digital I/O",
        nota: "LED azul integrado en la mayoría de placas ESP32 DevKit v1."
      }
    ],
    librerias: [
      {
        nombre: "WiFi.h y WebServer.h",
        autor: "Espressif Systems",
        instalador: "Vienen preinstaladas al agregar el paquete de placas ESP32 en Arduino IDE."
      }
    ],
    codigoArduino: `/*
 * Servidor Web de Telemetría y Control con ESP32
 * Mr-Robotto Academy - Especial IoT y Robótica Conectada
 */

#include <WiFi.h>
#include <WebServer.h>

// Credenciales de tu red WiFi
const char* ssid = "TU_RED_WIFI";
const char* password = "TU_PASSWORD";

WebServer server(80);
const int LED_PIN = 2; // LED interno del ESP32

void handleRoot() {
  String html = "<!DOCTYPE html><html><head><meta charset='UTF-8'>";
  html += "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
  html += "<title>Mr-Robotto ESP32 Dashboard</title>";
  html += "<style>body{font-family:sans-serif;background:#0f172a;color:#f8fafc;text-align:center;padding:20px;}";
  html += ".btn{background:#ef4444;color:white;padding:12px 24px;border:none;border-radius:10px;font-size:16px;font-weight:bold;cursor:pointer;margin:10px;text-decoration:none;display:inline-block;}";
  html += ".btn-off{background:#475569;}</style></head><body>";
  html += "<h1>Mr-Robotto IoT Hub</h1><p>Control Remoto y Telemetr&iacute;a</p>";
  html += "<p><a href='/on' class='btn'>ENCENDER ACTUADOR</a></p>";
  html += "<p><a href='/off' class='btn btn-off'>APAGAR ACTUADOR</a></p>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

void handleLedOn() {
  digitalWrite(LED_PIN, HIGH);
  server.sendHeader("Location", "/");
  server.send(303);
}

void handleLedOff() {
  digitalWrite(LED_PIN, LOW);
  server.sendHeader("Location", "/");
  server.send(303);
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  Serial.print("Conectando a WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("¡WiFi Conectado con éxito!");
  Serial.print("Dirección IP asignada: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/on", handleLedOn);
  server.on("/off", handleLedOff);
  server.begin();
  Serial.println("Servidor Web HTTP iniciado en puerto 80.");
}

void loop() {
  server.handleClient();
}`,
    explicacionCodigo: [
      {
        paso: "WiFi.begin(ssid, password)",
        detalle: "Inicia la negociación con el router WiFi en la banda de 2.4 GHz y solicita dirección IP por DHCP."
      },
      {
        paso: "server.on('/', handleRoot)",
        detalle: "Registra la ruta raíz que devuelve la página HTML interactiva a cualquier celular o computadora que visite la IP."
      },
      {
        paso: "server.handleClient()",
        detalle: "Atiende las solicitudes HTTP entrantes de forma no bloqueante dentro del loop principal."
      }
    ],
    solucionProblemas: [
      {
        problema: "El ESP32 no conecta al WiFi (se queda en puntos suspensivos)",
        causa: "Red WiFi configurada únicamente en 5 GHz. El ESP32 solo soporta frecuencias de 2.4 GHz.",
        solucion: "Habilita la red de 2.4 GHz en tu módem o comparte internet desde tu teléfono móvil configurando la banda en 2.4 GHz."
      }
    ],
    tags: ["ESP32", "WiFi", "IoT", "ServidorWeb", "Telemetría", "Robótica"]
  },
  {
    id: "mod-brazo-calibracion",
    slug: "calibracion-centrado-servos-brazo-robotico-4dof",
    nombre: "Calibración y Centrado de Servos para Brazo Robótico 4-DoF",
    subtitulo: "Guía paso a paso para calibrar a 90° el punto neutro de los servos antes del armado mecánico para evitar fracturas de piezas 3D",
    categoria: "Kits de Robótica",
    chipPrincipal: "Servos MG996R (Torque 11 kg) y SG90 9g",
    nivel: "Principiante",
    voltajeOperacion: "5V a 6V DC (3 Amperios externos)",
    protocolo: "PWM con librería Servo.h",
    tiempoEstimado: "20 min",
    imagen: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
    descripcion:
      "El error más común al armar un brazo robótico de 4 grados de libertad es atornillar los engranes mecánicos sin antes haber centrado eléctricamente los servomotores a su ángulo medio (90°). Esta guía te enseña el sketch maestro de centrado y la alimentación de potencia separada para proteger tu Arduino.",
    especificaciones: [
      { nombre: "Servos de Base y Hombro", valor: "MG996R con piñonería metálica (Torque 11 kg·cm)" },
      { nombre: "Servos de Codo y Garra", valor: "SG90 micro servomotores de 9 gramos" },
      { nombre: "Corriente de pico", valor: "Hasta 2.5 A con los 4 servomotores en movimiento" }
    ],
    pines: [
      { pinModulo: "Pin Señal Servo Base", pinArduino: "Pin D3", colorCable: "Naranja", tipoSenal: "PWM", nota: "Base giratoria 180°" },
      { pinModulo: "Pin Señal Servo Hombro", pinArduino: "Pin D5", colorCable: "Naranja", tipoSenal: "PWM", nota: "Elevación hombro" },
      { pinModulo: "Pin Señal Servo Codo", pinArduino: "Pin D6", colorCable: "Naranja", tipoSenal: "PWM", nota: "Articulación antebrazo" },
      { pinModulo: "Pin Señal Servo Garra", pinArduino: "Pin D9", colorCable: "Naranja", tipoSenal: "PWM", nota: "Apertura y cierre de garra" },
      { pinModulo: "GND Fuente y Arduino", pinArduino: "GND común", colorCable: "Negro", tipoSenal: "Tierra (GND)", nota: "Unir tierra de la fuente externa con la de Arduino" }
    ],
    librerias: [{ nombre: "Servo.h", autor: "Arduino Core", instalador: "Incluida por defecto en Arduino IDE" }],
    codigoArduino: `/*
 * Calibrador de Punto Medio (90°) para Servomotores de Brazo Robótico
 * Mr-Robotto - Kit Oficial Brazo Robótico 4-DoF
 * Ejecuta este código ANTES de atornillar las partes impresas en 3D.
 */

#include <Servo.h>

Servo servoBase;
Servo servoHombro;
Servo servoCodo;
Servo servoGarra;

void setup() {
  Serial.begin(9600);
  Serial.println("==================================================");
  Serial.println("  Mr-Robotto: Centrado de Servos a 90 Grados      ");
  Serial.println("==================================================");

  servoBase.attach(3);
  servoHombro.attach(5);
  servoCodo.attach(6);
  servoGarra.attach(9);

  // Mover todos los servos a 90 grados exactos (Punto Neutro)
  servoBase.write(90);
  servoHombro.write(90);
  servoCodo.write(90);
  servoGarra.write(90);

  Serial.println("Servos posicionados a 90°. Ya puedes atornillar los brazos!");
}

void loop() {
  // Mantiene los servos fijos en su posición neutra mientras ensamblas
  delay(1000);
}`,
    explicacionCodigo: [
      {
        paso: "servo.attach(pin)",
        detalle: "Asigna la generación de pulsos PWM de 50 Hz en los pines correspondientes."
      },
      {
        paso: "servo.write(90)",
        detalle: "Genera el pulso de 1.5 ms que ordena al potenciómetro interno colocarse a la mitad exacta de su rango de giro (de 0° a 180°)."
      }
    ],
    solucionProblemas: [
      {
        problema: "Arduino se apaga o reinicia cada vez que se mueven los servos",
        causa: "Alimentar los servomotores directamente desde el pin 5V de Arduino. El regulador interno se satura por exceso de corriente.",
        solucion: "Usa una fuente externa o portapilas de 5V-6V exclusivo para los cables rojos (+) de los servos, y une el negativo (-) con el GND de Arduino."
      }
    ],
    tags: ["BrazoRobótico", "Servomotores", "Calibración", "Kits", "Arduino"]
  },
  {
    id: "mod-3",
    slug: "sensor-temperatura-humedad-dht22",
    nombre: "Sensor de Temperatura y Humedad DHT22 (AM2302)",
    subtitulo: "Lecturas ambientales de alta precisión con protocolo digital de 1 hilo (OneWire)",
    categoria: "Sensores",
    chipPrincipal: "AM2302 / DHT22 Sensor Capacitivo",
    nivel: "Principiante",
    voltajeOperacion: "3.3V - 5.5V DC",
    protocolo: "Digital Propietario (Single-Bus)",
    tiempoEstimado: "15 min",
    imagen: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    descripcion:
      "Sensor de grado semindustrial para control de climatización, monitoreo ambiental y proyectos de ciencia aplicada para ferias de SOLACyT.",
    especificaciones: [
      { nombre: "Humedad", valor: "0 a 100% RH con precisión ±2%" },
      { nombre: "Temperatura", valor: "-40°C a +80°C con precisión ±0.5°C" }
    ],
    pines: [
      { pinModulo: "VCC", pinArduino: "5V o 3.3V", colorCable: "Rojo", tipoSenal: "Alimentación (VCC)", nota: "Alimentación positiva." },
      { pinModulo: "DATA", pinArduino: "Pin D2", colorCable: "Amarillo", tipoSenal: "Digital I/O", nota: "Datos con resistencia pull-up." },
      { pinModulo: "GND", pinArduino: "GND", colorCable: "Negro", tipoSenal: "Tierra (GND)", nota: "Tierra común." }
    ],
    librerias: [
      { nombre: "DHT sensor library by Adafruit", autor: "Adafruit", instalador: "Gestor de Bibliotecas Arduino IDE" }
    ],
    codigoArduino: `// Tutorial DHT22 Mr-Robotto
#include "DHT.h"
#define PIN_DHT 2
#define TIPO_DHT DHT22
DHT dht(PIN_DHT, TIPO_DHT);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  delay(2000);
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (!isnan(h) && !isnan(t)) {
    Serial.print("Humedad: "); Serial.print(h); Serial.print(" % | Temp: "); Serial.print(t); Serial.println(" *C");
  }
}`,
    explicacionCodigo: [
      { paso: "delay(2000)", detalle: "Espera obligatoria de 2s entre muestras térmicas." }
    ],
    solucionProblemas: [
      { problema: "Lecturas NaN", causa: "Cable suelto o falta resistencia pull-up", solucion: "Revisa cableado de datos." }
    ],
    tags: ["Sensor", "DHT22", "Clima", "Ciencia"]
  },
  {
    id: "mod-4",
    slug: "driver-motores-l298n-puente-h",
    nombre: "Driver de Motores L298N Doble Puente H",
    subtitulo: "Control bidireccional de 2 motores DC o 1 motor paso a paso con PWM de velocidad",
    categoria: "Motores y Actuadores",
    chipPrincipal: "L298N Dual Full-Bridge Driver",
    nivel: "Intermedio",
    voltajeOperacion: "5V a 35V DC (motores) / 5V lógica",
    protocolo: "Control por niveles lógicos y señales PWM",
    tiempoEstimado: "25 min",
    imagen: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
    descripcion:
      "El driver clásico de tracción para robots de mini sumo, seguidores de línea y vehículos autónomos para olimpiadas escolares.",
    especificaciones: [
      { nombre: "Voltaje motores", valor: "5V a 35V DC" },
      { nombre: "Corriente por canal", valor: "2A continuos" }
    ],
    pines: [
      { pinModulo: "12V (+)", pinArduino: "Batería Externa (+)", colorCable: "Rojo", tipoSenal: "Alimentación (VCC)", nota: "Alimentación de motores." },
      { pinModulo: "GND", pinArduino: "GND Arduino y Batería (-)", colorCable: "Negro", tipoSenal: "Tierra (GND)", nota: "Tierra común obligatoria." },
      { pinModulo: "ENA (PWM)", pinArduino: "Pin D5 (~)", colorCable: "Amarillo", tipoSenal: "PWM", nota: "Velocidad Motor A." },
      { pinModulo: "IN1", pinArduino: "Pin D6", colorCable: "Azul", tipoSenal: "Digital I/O", nota: "Dirección A1." },
      { pinModulo: "IN2", pinArduino: "Pin D7", colorCable: "Verde", tipoSenal: "Digital I/O", nota: "Dirección A2." }
    ],
    librerias: [],
    codigoArduino: `// Control Motor DC con L298N - Mr-Robotto
const int ENA = 5;
const int IN1 = 6;
const int IN2 = 7;

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
}

void loop() {
  // Giro adelante
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 200);
  delay(2000);
  
  // Alto
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  delay(1000);
}`,
    explicacionCodigo: [
      { paso: "analogWrite(ENA, 200)", detalle: "Genera pulso PWM para controlar la velocidad del motor." }
    ],
    solucionProblemas: [
      { problema: "Arduino se resetea al arrancar el motor", causa: "No hay tierra común o caída de voltaje", solucion: "Usa batería independiente para los motores." }
    ],
    tags: ["Motores", "Puente H", "PWM", "L298N", "Tracción", "WRO"]
  },
  {
    id: "mod-5",
    slug: "micro-servomotor-sg90",
    nombre: "Micro Servomotor SG90 9g (0° a 180°)",
    subtitulo: "Posicionamiento angular preciso con señales PWM de 50 Hz y librería Servo.h",
    categoria: "Motores y Actuadores",
    chipPrincipal: "SG90 Micro Servo con potenciómetro interno",
    nivel: "Principiante",
    voltajeOperacion: "4.8V a 6.0V DC",
    protocolo: "PWM analógico (Pulsos de 1 ms a 2 ms a 50 Hz)",
    tiempoEstimado: "15 min",
    imagen: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
    descripcion:
      "Actuador ligero ideal para mecanismos de garras, elevadores de banderas en retos WRO y dirección de vehículos RC.",
    especificaciones: [
      { nombre: "Torque", valor: "1.8 kg·cm a 4.8V" },
      { nombre: "Peso", valor: "9 gramos" }
    ],
    pines: [
      { pinModulo: "Marrón (-)", pinArduino: "GND", colorCable: "Negro", tipoSenal: "Tierra (GND)", nota: "GND" },
      { pinModulo: "Rojo (+)", pinArduino: "5V", colorCable: "Rojo", tipoSenal: "Alimentación (VCC)", nota: "5V" },
      { pinModulo: "Naranja (S)", pinArduino: "Pin D9", colorCable: "Naranja", tipoSenal: "PWM", nota: "Señal de control" }
    ],
    librerias: [{ nombre: "Servo.h", autor: "Arduino Core", instalador: "Incluida por defecto" }],
    codigoArduino: `#include <Servo.h>
Servo miServo;

void setup() {
  miServo.attach(9);
}

void loop() {
  miServo.write(0);
  delay(1000);
  miServo.write(90);
  delay(1000);
  miServo.write(180);
  delay(1000);
}`,
    explicacionCodigo: [{ paso: "miServo.write(grados)", detalle: "Mueve el eje al ángulo indicado en grados." }],
    solucionProblemas: [{ problema: "Temblores continuos", causa: "Voltaje inestable", solucion: "Añadir condensador de 100uF entre 5V y GND." }],
    tags: ["Servo", "SG90", "Actuador", "Mecánica", "WRO"]
  },
  {
    id: "mod-6",
    slug: "modulo-bluetooth-hc-05",
    nombre: "Módulo de Comunicación Bluetooth HC-05 (Serial SPP)",
    subtitulo: "Control inalámbrico bidireccional entre Arduino y teléfonos inteligentes Android",
    categoria: "Comunicación",
    chipPrincipal: "CSR BC417 + Memoria Flash",
    nivel: "Intermedio",
    voltajeOperacion: "3.6V a 6.0V en VCC (Lógica de 3.3V en RX)",
    protocolo: "Bluetooth v2.0 + EDR (UART Serial)",
    tiempoEstimado: "25 min",
    imagen: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    descripcion:
      "Control remoto inalámbrico para robots de control manual en torneos y telemetría por app móvil.",
    especificaciones: [
      { nombre: "Alcance", valor: "Hasta 10 metros" },
      { nombre: "Baudios", valor: "9600 baudios por defecto" }
    ],
    pines: [
      { pinModulo: "VCC", pinArduino: "5V", colorCable: "Rojo", tipoSenal: "Alimentación (VCC)", nota: "5V" },
      { pinModulo: "GND", pinArduino: "GND", colorCable: "Negro", tipoSenal: "Tierra (GND)", nota: "GND" },
      { pinModulo: "TXD", pinArduino: "Pin D10", colorCable: "Verde", tipoSenal: "UART (TX/RX)", nota: "RX Arduino" },
      { pinModulo: "RXD", pinArduino: "Pin D11 (con divisor 3.3V)", colorCable: "Amarillo", tipoSenal: "UART (TX/RX)", nota: "TX Arduino" }
    ],
    librerias: [{ nombre: "SoftwareSerial.h", autor: "Arduino Core", instalador: "Incluida" }],
    codigoArduino: `#include <SoftwareSerial.h>
SoftwareSerial bt(10, 11);

void setup() {
  Serial.begin(9600);
  bt.begin(9600);
  pinMode(13, OUTPUT);
}

void loop() {
  if (bt.available()) {
    char c = bt.read();
    if (c == '1') digitalWrite(13, HIGH);
    if (c == '0') digitalWrite(13, LOW);
  }
}`,
    explicacionCodigo: [{ paso: "SoftwareSerial", detalle: "Permite usar pines digitales como puerto serial." }],
    solucionProblemas: [{ problema: "No empareja", causa: "PIN incorrecto", solucion: "Probar PIN 1234 o 0000." }],
    tags: ["Bluetooth", "Inalámbrico", "Control", "App"]
  }
];
