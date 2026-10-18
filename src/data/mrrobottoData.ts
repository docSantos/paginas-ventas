// src/data/mrrobottoData.ts
// Datos de la plataforma Mr-Robotto: Tienda Maker, Cursos con DC-3, Tutoriales Arduino y Kits WRO/SOLACyT

import {
  TutorialModulo,
  CursoPremium,
  ProductoRobotica,
  CertificacionDC3Info,
  BloqueCapacitacionHora
} from "@/types/mrrobotto";

export const CERTIFICACION_DC3_GLOBAL: CertificacionDC3Info = {
  incluida: true,
  claveRegistroSTPS: "STPS-CERTIMEXICO-2026/DC3",
  horasAcreditadas: 40,
  areaTematica: "Diseño Electrónico Avanzado, Ruteo de PCB Multicapa e Inteligencia Artificial Aplicada a Hardware",
  agenteCapacitador: "CertiMéxico (certimexico.com) en alianza con Mr-Robotto",
  plataformaCertificadoraNombre: "certimexico.com",
  plataformaCertificadoraUrl: "https://certimexico.com",
  beneficios: [
    "Constancia oficial de competencias o habilidades laborales Formato DC-3 con validez federal ante la STPS",
    "Evaluación y emisión oficial realizada directamente a través de la plataforma certificadora certimexico.com",
    "Dominio profesional de herramientas EDA líderes en la industria: Altium Designer y KiCad asistido por IA",
    "Valor curricular comprobable para ingenieros electrónicos, mecatrónicos, técnicos y diseñadores de hardware"
  ]
};

export const PRODUCTOS_MRROBOTTO: ProductoRobotica[] = [
  {
    id: "prod-gabinete-escualo",
    slug: "gabinete-escualo-chasis-mecha-robotico-argb",
    nombre: "Gabinete Escualo — Chasis Mecha Biónico con Iluminación ARGB (Próximamente)",
    subtitulo: "Diseño propio de Mr-Robotto: estructura biónica articulada de tiburón mecánico para PC y laboratorio maker",
    categoria: "Kits de Robótica (Brazos y Móviles)",
    precio: 14999,
    precioOriginal: 17500,
    stock: 0,
    envioGratis: true,
    destacadoReel: true,
    esProximamente: true,
    badge: "Próximamente · Diseño Propio",
    calificacion: 5.0,
    reviewsCount: 24,
    imagenPrincipal: "/mrrobotto/shark-x.webp",
    galeria: [
      "/mrrobotto/shark-x.webp",
      "/mrrobotto/shark-x.jpg"
    ],
    descripcion:
      "Una obra maestra de la mecatrónica y el diseño biónico desarrollada y rediseñada por el laboratorio de ingeniería de Mr-Robotto. El Gabinete Escualo fusiona la aerodinámica de un depredador marino con arquitectura cibernética modular: exoesqueleto articulado de fabricación propia, base iluminada con anillo ARGB, sistema de refrigeración integrado y soporte para placas Mini-ITX y fuentes SFX.",
    compatibilidad: ["Placas Mini-ITX", "Refrigeración líquida 120/240mm", "Tarjetas gráficas dedicadas hasta 304mm", "Control ARGB y articulación por microcontrolador"],
    especificaciones: [
      { nombre: "Estatus", valor: "Próximo Lanzamiento (Registro en Lista de Espera VIP abierto)" },
      { nombre: "Ingeniería", valor: "Rediseño exclusivo de autoría propia Mr-Robotto" },
      { nombre: "Iluminación", valor: "Sistema ARGB direccionable en aleta dorsal, branquias y base hexagonal" },
      { nombre: "Refrigeración", valor: "Soporte para refrigeración líquida AIO 120/240 mm" },
      { nombre: "Fuente Soportada", valor: "Formato SFX / SFX-L de alto rendimiento" }
    ],
    contenidoCaja: [
      "Chasis biónico Gabinete Escualo (Edición de Autor Mr-Robotto)",
      "Base estructural con controlador de iluminación ARGB",
      "Kit de tornillería de acero inoxidable y cable PCIe Riser",
      "Manual de montaje y certificado de serie numerada"
    ]
  },
  {
    id: "prod-robot-4gdl-joystick",
    slug: "robot-4-gdl-plantilla-doble-joystick-mdf",
    nombre: "Robot 4 GDL con Plantilla de Control de Doble Joystick",
    subtitulo: "Brazo robótico articulado en MDF de corte láser gobernado por consola ergonómica con 2 joysticks analógicos",
    categoria: "Kits de Robótica (Brazos y Móviles)",
    precio: 890,
    precioOriginal: 1150,
    stock: 18,
    envioGratis: true,
    destacadoReel: true,
    esProximamente: false,
    badge: "Disponible · Entrega Inmediata",
    calificacion: 4.96,
    reviewsCount: 45,
    imagenPrincipal: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion:
      "El kit ideal para iniciarte en la robótica industrial y mecatrónica práctica. Consta de un brazo articulado de 4 Grados de Libertad (Base giratoria, Hombro, Codo y Pinza) fabricado en MDF de corte láser de alta precisión, controlado mediante una plantilla de mando física donde se montan dos módulos joystick analógicos para operar todos los ejes con ambas manos como una excavadora o robot industrial real. Además, su chasis es 100% actualizable a la versión de Visión Artificial con ESP32 y Python.",
    compatibilidad: ["Arduino Uno / Nano", "ESP32", "Actualizable a Visión Artificial con Python", "Plantilla de Doble Joystick"],
    especificaciones: [
      { nombre: "Grados de Libertad", valor: "4 GDL (Base, Hombro, Codo y Garra mecánica)" },
      { nombre: "Sistema de Mando", valor: "2 Joysticks analógicos montados sobre plantilla de control ergonómica" },
      { nombre: "Estructura", valor: "MDF de corte láser CNC de encastre exacto" },
      { nombre: "Actuadores", valor: "4x Micro servomotores calibrados para articulación y pinza" },
      { nombre: "Escalabilidad", valor: "Chasis preparado para actualización futura a ESP32 + Visión Artificial" }
    ],
    contenidoCaja: [
      "Kit completo de piezas estructurales en MDF para el Brazo 4 GDL",
      "Plantilla/consola física de control para alojar los 2 joysticks",
      "2x Módulos Joystick analógicos de doble eje con botón pulsador",
      "4x Servomotores con accesorios de acoplamiento y tornillería completa",
      "Placa controladora compatible con Arduino, cables Dupont y código fuente C++ listo para cargar"
    ]
  },
  {
    id: "prod-robot-otto",
    slug: "robot-otto-bionico-kit-educativo-bipedo",
    nombre: "Robot Otto Biónico — Kit Educativo Bípedo Programable",
    subtitulo: "Humanoide bípedo interactivo que camina, baila y esquiva obstáculos con sensor ultrasónico HC-SR04",
    categoria: "Kits de Robótica (Brazos y Móviles)",
    precio: 790,
    precioOriginal: 990,
    stock: 22,
    envioGratis: true,
    destacadoReel: true,
    esProximamente: false,
    badge: "Disponible · Bestseller STEAM",
    calificacion: 4.98,
    reviewsCount: 64,
    imagenPrincipal: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion:
      "El robot bípedo más carismático y educativo del mundo maker. Otto camina por sí mismo, realiza coreografías de baile, emite sonidos melódicos con su buzzer integrado y detecta objetos frente a él gracias a sus 'ojos' ultrasónicos HC-SR04. Es perfecto para estudiantes, niños, jóvenes y clubes de robótica que buscan aprender programación en bloques o C++ en Arduino viendo resultados inmediatos.",
    compatibilidad: ["Arduino Nano + Shield I/O", "Arduino IDE (C++)", " Otto Blockly (Programación visual por bloques)"],
    especificaciones: [
      { nombre: "Locomoción", valor: "Bípeda de 4 servomotores (Caderas izquierda/derecha y Tobillos)" },
      { nombre: "Visión de Distancia", valor: "Sensor ultrasónico HC-SR04 frontal (2 cm a 400 cm)" },
      { nombre: "Audio", valor: "Buzzer piezoeléctrico para emociones sonoras y melodías" },
      { nombre: "Cerebro", valor: "Arduino Nano + Shield de expansión para conexión directa de servos" },
      { nombre: "Chasis", valor: "Piezas impresas en 3D / corte de alta resistencia listas para armar" }
    ],
    contenidoCaja: [
      "Cuerpo completo (Cabeza, Torso, 2 Piernas y 2 Pies)",
      "4x Micro servomotores para caderas y pies con tornillería",
      "Placa Arduino Nano + Shield de expansión I/O + Cable USB",
      "Sensor ultrasónico HC-SR04, Buzzer sonoro y portabaterías",
      "Guía paso a paso de ensamblaje y librerías de baile/caminata"
    ]
  },
  {
    id: "prod-robot-4gdl-vision-ia",
    slug: "robot-4-gdl-vision-artificial-esp32-python",
    nombre: "Robot 4 GDL con Visión Artificial, ESP32 y Python (Próximamente)",
    subtitulo: "Brazo robótico 4 GDL controlado sin contacto mediante seguimiento de manos con IA (OpenCV / MediaPipe + ESP32)",
    categoria: "Kits de Robótica (Brazos y Móviles)",
    precio: 1390,
    precioOriginal: 1750,
    stock: 0,
    envioGratis: true,
    destacadoReel: true,
    esProximamente: true,
    badge: "Próximamente · IA Física",
    calificacion: 4.99,
    reviewsCount: 19,
    imagenPrincipal: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion:
      "Lleva la Inteligencia Artificial del monitor al mundo físico. Este sistema evoluciona nuestro Brazo de 4 GDL integrando un microcontrolador ESP32 de doble núcleo comunicado en tiempo real con un script en Python (MediaPipe + OpenCV). Mueve tu mano frente a la cámara de tu computadora o módulo de visión y el brazo robótico replicará tus gestos, abrirá la pinza al juntar tus dedos y clasificará objetos por color o forma.",
    compatibilidad: ["ESP32 Dual-Core Wi-Fi/Serial", "Python 3 + OpenCV + MediaPipe", "Compatible como Upgrade del Robot 4 GDL con Joystick"],
    especificaciones: [
      { nombre: "Estatus", valor: "En fase final de desarrollo — Lista de Espera abierta" },
      { nombre: "Control por IA", valor: "Hand Tracking (21 puntos de la mano en tiempo real) con Python" },
      { nombre: "Microcontrolador", valor: "ESP32 de 240 MHz con comunicación de baja latencia" },
      { nombre: "Grados de Libertad", valor: "4 GDL sincronizados con cinemática mapeada por visión" },
      { nombre: "Ventaja Modular", valor: "Si ya tienes el Robot 4 GDL con Joystick, podrás actualizarlo fácilmente" }
    ],
    contenidoCaja: [
      "Estructura completa de Brazo Robótico 4 GDL + 4 Servomotores",
      "Tarjeta de desarrollo ESP32 Dual-Core Wi-Fi + Bluetooth",
      "Repositorio de scripts en Python (Detección de gestos de mano y objetos)",
      "Firmware en C++ para ESP32 y guía de instalación de entorno Python"
    ]
  },
  {
    id: "prod-robot-6gdl-kuka-joystick",
    slug: "robot-6-gdl-tipo-kuka-doble-joystick-mg90s",
    nombre: "Robot 6 GDL Tipo KUKA con Plantilla de Doble Joystick y Servos MG90S (Próximamente)",
    subtitulo: "Réplica a escala de brazo industrial de 6 ejes con piñonería metálica MG90S y consola con 2 joysticks",
    categoria: "Kits de Robótica (Brazos y Móviles)",
    precio: 1950,
    precioOriginal: 2450,
    stock: 0,
    envioGratis: true,
    destacadoReel: true,
    esProximamente: true,
    badge: "Próximamente · Tipo KUKA 6-DoF",
    calificacion: 4.99,
    reviewsCount: 28,
    imagenPrincipal: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion:
      "Inspirado en la geometría de los brazos robóticos industriales KUKA. Cuenta con 6 Grados de Libertad (Base, Hombro, Codo, Giro de Muñeca, Inclinación de Muñeca y Pinza) impulsados por servomotores MG90S de engranes 100% metálicos (~2.2 kg·cm), con un alcance optimizado de ingeniería de 20 a 22 cm para máxima precisión y par mecánico sin vibraciones. Se gobierna desde una plantilla de control con dos joysticks analógicos y botones de cambio de eje para operar los 6 grados de libertad con total fluidez.",
    compatibilidad: ["Arduino Uno / Mega / Nano", "ESP32", "Controlador PWM I2C PCA9685 de 16 canales", "Plantilla de Doble Joystick"],
    especificaciones: [
      { nombre: "Estatus", valor: "Próximamente — Apartado en Lista de Espera disponible" },
      { nombre: "Grados de Libertad", valor: "6 GDL completos tipo manipulador industrial KUKA" },
      { nombre: "Servomotores", valor: "6x MG90S con piñonería metálica de alto desempeño (2.2 kg·cm)" },
      { nombre: "Alcance Óptimo", valor: "20 a 22 cm de radio (calculado para par óptimo sin sobrecarga)" },
      { nombre: "Consola de Mando", valor: "Plantilla de control con 2 Joysticks analógicos y conmutación de ejes" }
    ],
    contenidoCaja: [
      "Estructura estética industrial tipo KUKA de 6 ejes articulados",
      "6x Servomotores MG90S de engranes metálicos",
      "Plantilla de control ergonómica con 2 módulos Joystick analógicos",
      "Driver PWM PCA9685 de 16 canales + Placa microcontroladora",
      "Fuente de alimentación de 5V de alto amperaje y código de control suave"
    ]
  },
  {
    id: "prod-robot-6gdl-kuka-vision-ia",
    slug: "robot-6-gdl-tipo-kuka-vision-artificial-esp32-python",
    nombre: "Robot 6 GDL Tipo KUKA con Visión Artificial, ESP32 y Python (Próximamente)",
    subtitulo: "Manipulador industrial a escala de 6 ejes gobernado por Visión por Computadora en Python y ESP32",
    categoria: "Kits de Robótica (Brazos y Móviles)",
    precio: 2490,
    precioOriginal: 3100,
    stock: 0,
    envioGratis: true,
    destacadoReel: true,
    esProximamente: true,
    badge: "Próximamente · Tope de Gama IA",
    calificacion: 5.0,
    reviewsCount: 33,
    imagenPrincipal: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion:
      "La cúspide de nuestra línea de brazos robóticos educativos e industriales a escala. Combina la cinemática de 6 Grados de Libertad tipo KUKA (servomotores metálicos MG90S) con el poder del microcontrolador ESP32 y algoritmos de Visión Artificial en Python. Permite realizar tareas automatizadas de Pick & Place inteligente por detección de objetos, seguimiento espacial en 3D y control gestual avanzado desde computadora.",
    compatibilidad: ["ESP32 Dual-Core", "Python 3 (OpenCV, MediaPipe, NumPy)", "Cinemática Inversa 6-DoF", "Driver PCA9685 I2C"],
    especificaciones: [
      { nombre: "Estatus", valor: "Próximamente — Registro prioritario por WhatsApp" },
      { nombre: "Arquitectura", valor: "Brazo 6 GDL tipo KUKA + Cerebro ESP32 + Visión Artificial Python" },
      { nombre: "Servomotores", valor: "6x MG90S de engranes metálicos con control PWM de 12 bits" },
      { nombre: "Alcance Mecánico", valor: "20 a 22 cm con compensación geométrica de par" },
      { nombre: "Funciones IA", valor: "Reconocimiento de postura de mano, clasificación por color y coordenadas X-Y-Z" }
    ],
    contenidoCaja: [
      "Brazo Robótico 6 GDL Tipo KUKA completo con 6 servos metálicos MG90S",
      "Placa ESP32 Dual-Core + Módulo controlador PCA9685 de 16 canales",
      "Plantilla de control secundaria + Suite de programas en Python y C++",
      "Fuente de poder dedicada y guía maestra de cinemática + visión artificial"
    ]
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
    imagenPrincipal: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80"
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
    subtitulo: "Kit de archivos 3D para armar tu propio brazo robótico con servos MG996R y MG90S",
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
    id: "prod-kit-sensores-37",
    slug: "kit-master-37-sensores-arduino-esp32",
    nombre: "Kit Master 37 Sensores y Módulos Maker para Arduino & ESP32",
    subtitulo: "El kit definitivo para aprender electrónica práctica y crear prototipos mecatrónicos",
    categoria: "Sensores & Módulos",
    precio: 680,
    precioOriginal: 890,
    stock: 29,
    envioGratis: true,
    destacadoReel: false,
    badge: "Complemento Maker",
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
    subtitulo: "Potencia de 240 MHz con conectividad inalámbrica para IoT y robots con Visión Artificial",
    categoria: "Microcontroladores",
    precio: 145,
    precioOriginal: 190,
    stock: 50,
    envioGratis: false,
    destacadoReel: false,
    badge: "Oferta Maker",
    calificacion: 4.88,
    reviewsCount: 84,
    imagenPrincipal: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    galeria: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    descripcion:
      "La placa predilecta para el desarrollo de proyectos conectados de alta velocidad. Cuenta con 38 pines GPIO con soporte para DAC, ADC de 12 bits, sensores táctiles capacitivos, PWM por hardware y transceptor de radio de 2.4 GHz.",
    compatibilidad: ["Arduino IDE", "MicroPython", "Espressif IDF", "Python Serial / Wi-Fi"],
    especificaciones: [
      { nombre: "Procesador", valor: "Xtensa dual-core 32-bit LX6 hasta 240MHz" },
      { nombre: "Memoria", valor: "520 KB SRAM interna + 4MB Flash SPI" },
      { nombre: "Conectividad", valor: "Wi-Fi 802.11 b/g/n + Bluetooth 4.2 BR/EDR y BLE" },
      { nombre: "Conector USB", valor: "USB con convertidor serie CP2102 de alta velocidad" }
    ],
    contenidoCaja: [
      "Placa de desarrollo ESP32 DevKit V1 en empaque antiestático",
      "Pinout impreso de alta resolución"
    ]
  }
];

export const CURSOS_PREMIUM_MRROBOTTO: CursoPremium[] = [
  {
    id: "curso-dc3-altium-pcb",
    slug: "diseno-electronico-pcb-altium-designer-dc3",
    titulo: "Curso de Diseño Electrónico y PCB Profesional con Altium Designer (DC-3)",
    descripcionCorta:
      "Domina el estándar industrial para diseño de circuitos impresos (PCB) multicapa, reglas de alta velocidad y generación de archivos de manufactura Gerber/BOM. Certificación Oficial DC-3 STPS realizada en certimexico.com.",
    descripcionLarga:
      "Aprende a diseñar tarjetas electrónicas profesionales de nivel industrial con Altium Designer. Desde la captura esquemática jerárquica y creación de librerías con modelos 3D STEP, hasta el ruteo diferencial, planos de tierra, control de impedancia, análisis de integridad de señal y exportación de paquetes completos para fabricación y ensamblaje superficial (SMT/PCBA). La evaluación y emisión de tu Constancia Oficial DC-3 ante la STPS se realiza directamente en nuestra plataforma certificadora aliada certimexico.com.",
    nivel: "Intermedio",
    categoria: "Diseño Electrónico & PCB",
    instructor: {
      nombre: "M. en C. Roberto Palacios",
      rol: "Especialista en Diseño de Hardware Industrial / Evaluador en certimexico.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      certificaciones: "Certificación Oficial STPS vía certimexico.com • Senior PCB Designer"
    },
    portada: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    duracionTotal: "40 horas con valor curricular STPS (30 lecciones en video HD)",
    totalLecciones: 30,
    calificacion: 4.99,
    precio: 1950,
    precioOriginal: 2800,
    esPremium: true,
    certificacionDC3: {
      incluida: true,
      claveRegistroSTPS: "STPS-CERTIMEXICO-ALT-2026",
      horasAcreditadas: 40,
      areaTematica: "Diseño Electrónico Industrial y Manufactura de Tarjetas PCB con Altium Designer",
      agenteCapacitador: "CertiMéxico (certimexico.com) — Centro Certificador Oficial STPS",
      plataformaCertificadoraNombre: "certimexico.com",
      plataformaCertificadoraUrl: "https://certimexico.com",
      beneficios: [
        "Constancia oficial Formato DC-3 con validez ante la STPS gestionada y emitida en certimexico.com",
        "Verificación digital del certificado y registro curricular para la industria electrónica y automotriz",
        "Revisión técnica de tu diseño de PCB final antes de enviarlo a fábrica (JLCPCB / PCBWay)",
        "Plantillas profesionales de reglas de diseño (Design Rules) y librerías IPC verificadas"
      ]
    },
    enfoqueCompetencia: "General",
    requisitos: [
      "Conocimientos básicos de electricidad o electrónica (resistencias, capacitores, microcontroladores).",
      "Computadora con Windows para ejecutar Altium Designer.",
      "Registro activo en certimexico.com (incluido con tu inscripción) para la emisión de tu DC-3."
    ],
    loQueAprenderas: [
      "Flujo completo de ingeniería de hardware: del diagrama esquemático al prototipo físico ensamblado",
      "Creación de símbolos esquemáticos, footprints IPC y asociación de modelos 3D (.STEP)",
      "Ruteo de PCB de 2 y 4 capas, planos de alimentación (Power Planes) y blindaje contra ruido EMI/EMC",
      "Diseño de fuentes conmutadas e integración de microcontroladores ESP32 y STM32 en tu propia placa",
      "Generación de archivos Gerber X2, NC Drill, Pick & Place y lista de materiales (BOM) automatizada",
      "Acreditación del proyecto práctico en certimexico.com para obtener tu constancia DC-3 STPS"
    ],
    modulos: [
      {
        id: "alt-m1",
        titulo: "Módulo 1: Captura Esquemática Profesional y Librerías IPC en Altium",
        descripcion: "Arquitectura de proyectos en Altium Designer, creación de componentes desde hoja de datos y validación ERC.",
        lecciones: [
          {
            id: "lec-alt-1-1",
            titulo: "1.1 Entorno Altium Designer y Proceso de Certificación DC-3 en certimexico.com",
            duracion: "18:40",
            resumen:
              "Bienvenida al programa, configuración de preferencias de ingeniería en Altium y guía de registro en certimexico.com para acreditar tu constancia laboral STPS.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            esGratis: true,
            recursos: [
              { nombre: "Guía de Certificación DC-3 en certimexico.com (PDF)", tipo: "pdf", url: "https://certimexico.com", peso: "1.4 MB" }
            ]
          },
          {
            id: "lec-alt-1-2",
            titulo: "1.2 Diseño de Librerías: Símbolos, Huellas SMD (Footprints) y Modelos 3D STEP",
            duracion: "26:15",
            resumen:
              "Cómo leer las dimensiones mecánicas de un datasheet y construir footprints libres de errores de soldadura.",
            esGratis: false
          }
        ]
      },
      {
        id: "alt-m2",
        titulo: "Módulo 2: Layout Multicapa, Reglas DRC y Manufactura PCBA",
        descripcion: "Emplazamiento estratégico de componentes, ruteo interactivo y salida a fábrica.",
        lecciones: [
          {
            id: "lec-alt-2-1",
            titulo: "2.1 Ruteo de Potencia, Señales Diferenciales USB y Planos GND",
            duracion: "31:20",
            resumen:
              "Cálculo de ancho de pista por corriente según norma IPC-2221 y ruteo de par diferencial USB para ESP32.",
            esGratis: false
          }
        ]
      }
    ]
  },
  {
    id: "curso-dc3-kicad-ia",
    slug: "diseno-electronico-kicad-inteligencia-artificial-dc3",
    titulo: "Curso de Diseño Electrónico con KiCad + Inteligencia Artificial (DC-3)",
    descripcionCorta:
      "Aprende a diseñar PCBs profesionales sin pagar licencias usando KiCad potenciado con herramientas de IA para lectura de datasheets, cálculo de circuitos y automatización. Certificación DC-3 en certimexico.com.",
    descripcionLarga:
      "El diseño electrónico moderno ha cambiado para siempre. En este programa aprenderás a dominar KiCad (la suite EDA de código abierto más potente del mundo usada hasta por el CERN) acelerando tu flujo de trabajo x5 mediante Inteligencia Artificial: análisis instantáneo de hojas de datos en PDF con IA, selección automática de componentes en stock, generación de scripts en Python para posicionar componentes y revisión inteligente de esquemáticos. Incluye acreditación oficial DC-3 ante la STPS realizada directamente en certimexico.com.",
    nivel: "Principiante",
    categoria: "Diseño Electrónico & PCB",
    instructor: {
      nombre: "Ing. David Almonte",
      rol: "Diseñador de Sistemas Embebidos con IA / Instructor Certificado en certimexico.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      certificaciones: "Acreditador Oficial DC-3 en certimexico.com • Especialista KiCad & Edge AI"
    },
    portada: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80",
    duracionTotal: "40 horas con valor curricular STPS (28 lecciones en video HD)",
    totalLecciones: 28,
    calificacion: 4.99,
    precio: 1750,
    precioOriginal: 2500,
    esPremium: true,
    certificacionDC3: {
      incluida: true,
      claveRegistroSTPS: "STPS-CERTIMEXICO-KICAD-2026",
      horasAcreditadas: 40,
      areaTematica: "Diseño Electrónico Asistido por computadora (KiCad) e Inteligencia Artificial",
      agenteCapacitador: "CertiMéxico (certimexico.com) — Centro Certificador Oficial STPS",
      plataformaCertificadoraNombre: "certimexico.com",
      plataformaCertificadoraUrl: "https://certimexico.com",
      beneficios: [
        "Emisión de Constancia Oficial DC-3 STPS a través del portal oficial certimexico.com",
        "Flujo de trabajo de última generación combinando software libre industrial (KiCad) con copilotos de IA",
        "Diseña tu propia tarjeta controladora de robótica con ESP32 lista para pedir ensamblada de fábrica",
        "Acceso vitalicio a prompts de ingeniería electrónica, plugins de KiCad y librerías verificadas"
      ]
    },
    enfoqueCompetencia: "General",
    requisitos: [
      "No requiere experiencia previa diseñando PCBs: empezamos desde cero paso a paso.",
      "Compatible con Windows, macOS y Linux (KiCad es 100% gratuito y sin límites de tamaño de placa).",
      "Acceso a internet para realizar la evaluación final de certificación en certimexico.com."
    ],
    loQueAprenderas: [
      "Dominio integral de KiCad: Editor de Esquemas, Editor de PCB, Visor 3D con Raytracing y Gestor de Librerías",
      "Ingeniería asistida por IA: cómo usar modelos de IA para extraer circuitos típicos de aplicación de datasheets complejos",
      "Automatización con Python en KiCad: scripts generados con IA para colocar matrices de LEDs, conectores y trazas",
      "Verificación inteligente de errores comunes (pines sin conectar, inversión de polaridad, desacoplo de capacitores)",
      "Cómo pedir tus placas fabricadas y soldadas con componentes SMD por menos de $10 USD",
      "Evaluación práctica en certimexico.com para descargar tu constancia oficial DC-3 STPS"
    ],
    modulos: [
      {
        id: "kic-m1",
        titulo: "Módulo 1: Fundamentos de KiCad + Copilotos de IA para Ingeniería Electrónica",
        descripcion: "Instalación del ecosistema KiCad, plugins esenciales y metodología de diseño asistido por IA.",
        lecciones: [
          {
            id: "lec-kic-1-1",
            titulo: "1.1 Introducción a KiCad + IA y Acreditación Oficial en certimexico.com",
            duracion: "17:15",
            resumen:
              "Cómo la Inteligencia Artificial multiplica la velocidad del diseñador electrónico y cómo funciona tu certificación DC-3 en certimexico.com.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            esGratis: true,
            recursos: [
              { nombre: "Portal de Certificación Oficial certimexico.com", tipo: "link", url: "https://certimexico.com", peso: "Web" }
            ]
          },
          {
            id: "lec-kic-1-2",
            titulo: "1.2 Análisis de Datasheets con IA y Captura Esquemática de Tarjeta ESP32",
            duracion: "24:50",
            resumen:
              "Extracción automática de valores de capacitores de desacoplo, circuito de auto-reset y regulador LDO usando IA.",
            esGratis: false
          }
        ]
      },
      {
        id: "kic-m2",
        titulo: "Módulo 2: Ruteo de PCB, Renderizado 3D y Automatización para Fábrica",
        descripcion: "Diseño físico de la tarjeta controladora para robots de 4 y 6 GDL y envío a manufactura.",
        lecciones: [
          {
            id: "lec-kic-2-1",
            titulo: "2.1 Ruteo de Pistas, Planos de Cobre y Exportación Un-Clic para Ensamblaje SMT",
            duracion: "29:10",
            resumen:
              "Generación automática de archivos Gerber, Posición (CPL) y BOM compatibles con ensamblaje robotizado.",
            esGratis: false
          }
        ]
      }
    ]
  },
  {
    id: "curso-altium-pcb-maker",
    slug: "diseno-electronico-pcb-altium-designer",
    titulo: "Curso de Diseño Electrónico y PCB Profesional con Altium Designer (Edición Maker)",
    descripcionCorta:
      "Domina el estándar de la industria para diseño esquemático y ruteo de PCBs multicapa con Altium Designer. Modalidad práctica de autoestudio maker sin arancel de certificación STPS.",
    descripcionLarga:
      "Aprende a diseñar tarjetas electrónicas profesionales con Altium Designer a tu propio ritmo. Desde la captura esquemática jerárquica y creación de librerías con modelos 3D STEP, hasta el ruteo diferencial, planos de tierra, control de impedancia y exportación de archivos Gerber/BOM para JLCPCB o PCBWay. Esta edición maker está diseñada para autodidactas y entusiastas que buscan la máxima calidad de aprendizaje técnico al precio más accesible sin requerir trámite de constancia laboral STPS.",
    nivel: "Intermedio",
    categoria: "Diseño Electrónico & PCB",
    instructor: {
      nombre: "M. en C. Roberto Palacios",
      rol: "Especialista en Diseño de Hardware Industrial",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      certificaciones: "Senior PCB Designer • Instructor de Hardware Embebido"
    },
    portada: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    duracionTotal: "30 lecciones en video HD (Acceso ilimitado)",
    totalLecciones: 30,
    calificacion: 4.99,
    precio: 890,
    precioOriginal: 1490,
    esPremium: true,
    certificacionDC3: {
      incluida: false,
      claveRegistroSTPS: "",
      horasAcreditadas: 0,
      areaTematica: "Diseño Electrónico Maker con Altium Designer",
      agenteCapacitador: "Mr-Robotto Academy",
      beneficios: [
        "Acceso completo e ilimitado a todas las lecciones en video HD y proyectos de práctica",
        "Plantillas profesionales de reglas de diseño (Design Rules) y librerías IPC verificadas",
        "Archivos de proyecto completos descargables para Altium Designer",
        "Opción de actualizar a la versión certificada DC-3 posteriormente cubriendo la diferencia"
      ]
    },
    enfoqueCompetencia: "General",
    requisitos: [
      "Conocimientos básicos de electrónica (resistencias, capacitores, microcontroladores).",
      "Computadora con Windows para ejecutar Altium Designer."
    ],
    loQueAprenderas: [
      "Flujo completo de diseño: del diagrama esquemático a la tarjeta física",
      "Creación de símbolos esquemáticos, huellas SMD (footprints) y modelos 3D (.STEP)",
      "Ruteo de PCB de 2 y 4 capas, planos de tierra y blindaje contra ruido EMI",
      "Generación de archivos Gerber X2, NC Drill y lista de materiales (BOM)"
    ],
    modulos: [
      {
        id: "alt-m1-maker",
        titulo: "Módulo 1: Captura Esquemática Profesional y Librerías IPC en Altium",
        descripcion: "Arquitectura de proyectos en Altium Designer, creación de componentes desde hoja de datos y validación ERC.",
        lecciones: [
          {
            id: "lec-alt-m1-1",
            titulo: "1.1 Entorno Altium Designer y Configuración Inicial",
            duracion: "18:40",
            resumen: "Bienvenida al programa, configuración de preferencias de ingeniería y flujo de trabajo.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            esGratis: true
          },
          {
            id: "lec-alt-m1-2",
            titulo: "1.2 Diseño de Librerías: Símbolos, Huellas SMD y Modelos 3D STEP",
            duracion: "26:15",
            resumen: "Cómo leer las dimensiones mecánicas de un datasheet y construir footprints sin errores.",
            esGratis: false
          }
        ]
      },
      {
        id: "alt-m2-maker",
        titulo: "Módulo 2: Layout Multicapa, Reglas DRC y Manufactura PCBA",
        descripcion: "Emplazamiento estratégico de componentes, ruteo interactivo y salida a fábrica.",
        lecciones: [
          {
            id: "lec-alt-m2-1",
            titulo: "2.1 Ruteo de Potencia, Señales Diferenciales USB y Planos GND",
            duracion: "31:20",
            resumen: "Cálculo de ancho de pista por corriente según norma IPC-2221 y ruteo diferencial.",
            esGratis: false
          }
        ]
      }
    ]
  },
  {
    id: "curso-kicad-ia-maker",
    slug: "diseno-electronico-kicad-inteligencia-artificial",
    titulo: "Curso de Diseño Electrónico con KiCad + Inteligencia Artificial (Edición Maker)",
    descripcionCorta:
      "Aprende a diseñar PCBs profesionales con la suite libre KiCad acelerada por Inteligencia Artificial para datasheets y scripts. Modalidad de autoestudio maker a precio accesible.",
    descripcionLarga:
      "El diseño electrónico moderno ha cambiado para siempre. En este programa aprenderás a dominar KiCad (la suite EDA de código abierto usada por ingenieros en todo el mundo) acelerando tu flujo de trabajo x5 mediante Inteligencia Artificial: análisis de hojas de datos con IA, selección de componentes, scripts en Python y revisión de esquemáticos. Esta versión maker te brinda el contenido formativo completo a un precio reducido sin aranceles de certificación laboral STPS.",
    nivel: "Principiante",
    categoria: "Diseño Electrónico & PCB",
    instructor: {
      nombre: "Ing. David Almonte",
      rol: "Diseñador de Sistemas Embebidos con IA",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      certificaciones: "Especialista en KiCad & Edge AI"
    },
    portada: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80",
    duracionTotal: "28 lecciones en video HD (Acceso vitalicio)",
    totalLecciones: 28,
    calificacion: 4.99,
    precio: 690,
    precioOriginal: 1190,
    esPremium: true,
    certificacionDC3: {
      incluida: false,
      claveRegistroSTPS: "",
      horasAcreditadas: 0,
      areaTematica: "Diseño Electrónico Libre con KiCad e IA",
      agenteCapacitador: "Mr-Robotto Academy",
      beneficios: [
        "Acceso ilimitado de por vida a los 28 videos en alta definición y recursos descargables",
        "Colección de prompts especializados para análisis de datasheets y esquemáticos con IA",
        "Diseño paso a paso de una tarjeta controladora para robots con microcontrolador ESP32",
        "Opción de solicitar evaluación para constancia oficial DC-3 posteriormente en certimexico.com"
      ]
    },
    enfoqueCompetencia: "General",
    requisitos: [
      "No requiere experiencia previa diseñando circuitos impresos: arrancamos desde cero.",
      "KiCad es 100% gratuito y compatible con Windows, Mac y Linux."
    ],
    loQueAprenderas: [
      "Dominio de KiCad: Editor de Esquemas, Ruteo de PCB y Render 3D con Raytracing",
      "Copilotos de IA para extraer circuitos típicos de hojas de datos complejas en segundos",
      "Automatización con scripts Python generados con IA para tareas repetitivas",
      "Cómo ordenar tus tarjetas fabricadas y ensambladas de fábrica por menos de $10 USD"
    ],
    modulos: [
      {
        id: "kic-m1-maker",
        titulo: "Módulo 1: Fundamentos de KiCad + Copilotos de IA para Ingeniería Electrónica",
        descripcion: "Instalación de KiCad, plugins esenciales y metodología de diseño asistido por IA.",
        lecciones: [
          {
            id: "lec-kic-m1-1",
            titulo: "1.1 Introducción a KiCad + IA: Multiplicando la Productividad Maker",
            duracion: "17:15",
            resumen: "Cómo la Inteligencia Artificial acelera los tiempos de desarrollo en hardware.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            esGratis: true
          },
          {
            id: "lec-kic-m1-2",
            titulo: "1.2 Análisis de Datasheets con IA y Captura Esquemática con ESP32",
            duracion: "24:50",
            resumen: "Extracción automática de circuitos de soporte y desacoplo para microcontrolador ESP32.",
            esGratis: false
          }
        ]
      },
      {
        id: "kic-m2-maker",
        titulo: "Módulo 2: Ruteo de PCB, Renderizado 3D y Salida a Fábrica",
        descripcion: "Diseño físico de la tarjeta controladora y exportación de archivos de manufactura.",
        lecciones: [
          {
            id: "lec-kic-m2-1",
            titulo: "2.1 Ruteo de Pistas, Planos de Tierra y Exportación para JLCPCB/PCBWay",
            duracion: "29:10",
            resumen: "Generación de archivos Gerber, taladrado y lista BOM lista para producción.",
            esGratis: false
          }
        ]
      }
    ]
  },
  {
    id: "curso-brazo-robotico-premium",
    slug: "masterclass-brazo-robotico-4dof-control-cinematica",
    titulo: "Masterclass Premium: Ensamblaje, Doble Joystick y Visión Artificial para Brazos Robóticos",
    descripcionCorta:
      "Aprende a construir, calibrar y programar rutinas de pick-and-place, plantilla de control con 2 joysticks y actualización a Visión Artificial con Python + ESP32.",
    descripcionLarga:
      "El curso oficial de acompañamiento para los Kits de Brazo Robótico de 4 GDL y 6 GDL de Mr-Robotto. Desglosa desde el ensamblaje mecánico y centrado de los ejes de servomotores a 90 grados, hasta el cableado de la plantilla de control con dos joysticks analógicos y la migración a Visión Artificial con Python (MediaPipe) y ESP32.",
    nivel: "Intermedio",
    categoria: "Cursos de Kits",
    instructor: {
      nombre: "Ing. David Almonte",
      rol: "Ingeniero Mecatrónico y Diseñador de los Kits Mr-Robotto",
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
        "Códigos para plantilla de doble joystick y scripts de Visión Artificial en Python",
        "Archivos STL de refacciones y mejoras impresas para el brazo"
      ]
    },
    enfoqueCompetencia: "General",
    requisitos: [
      "Kit de Brazo Robótico Mr-Robotto (4 GDL o 6 GDL).",
      "Arduino Uno, Nano o ESP32 con cable USB.",
      "Fuente de poder de 5V para alimentar servomotores."
    ],
    loQueAprenderas: [
      "Ensamblaje mecánico correcto evitando holguras y calibración de servos a 90°",
      "Cableado y mapeo de la plantilla de control con 2 joysticks analógicos",
      "Programación de secuencias de memoria: grabación y repetición de trayectorias (Pick & Place)",
      "Matemáticas de trigonometría y cinemática inversa práctica",
      "Integración con Python y OpenCV/MediaPipe para control gestual por cámara"
    ],
    modulos: [
      {
        id: "br-m1",
        titulo: "Módulo 1: Ensamblaje Mecánico, Centrado de Servos y Plantilla de Doble Joystick",
        descripcion: "Montaje de base, hombro, codo, garra y estación de mando dual.",
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
  }
];

export const BLOQUES_CAPACITACION_MRROBOTTO: BloqueCapacitacionHora[] = [
  {
    id: "bloque-asesoria-5h",
    titulo: "Bloque de Asesoría & Diagnóstico Técnico",
    horas: 5,
    subtitulo: "Resolución de fallas, calibración de hardware y puesta a punto de prototipos",
    descripcion:
      "Sesiones 1 a 1 enfocadas en destrabar problemas técnicos específicos: puesta en marcha de sensores, corrección de conexiones, calibración de actuadores y optimización de código en Arduino o ESP32.",
    dirigidoA: "Docentes independientes, clubes escolares que inician o proyectos con fallas de hardware.",
    incluye: [
      "Diagnóstico exhaustivo de componentes y esquemas de conexión",
      "Calibración de sensores ópticos, ultrasónicos y servomotores",
      "Revisión y depuración de código en C++ (Arduino IDE) o MicroPython",
      "Factura fiscal con CFDI disponible para instituciones",
      "Sesiones interactivas por Google Meet o Zoom con grabación disponible"
    ],
    badge: "5 Horas • Rápido Impacto",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200"
  },
  {
    id: "bloque-taller-docente-10h",
    titulo: "Capacitación Docente STEAM & Gestión de Aula",
    horas: 10,
    subtitulo: "Metodología pedagógica, rúbricas de evaluación y planeación curricular escolar",
    descripcion:
      "Formación integral para profesores y directivos que desean implementar talleres o materias extracurriculares de robótica educativa utilizando kits Mr-Robotto (Robot Otto y Brazos 4/6 GDL).",
    dirigidoA: "Profesores de primaria alta, secundaria, bachillerato y coordinadores de tecnología.",
    incluye: [
      "Estructuración de dinámicas de clase y trabajo por equipos en el aula",
      "Planeaciones didácticas de 16 semanas y rúbricas de evaluación por competencias",
      "Ensamblaje guiado y mantenimiento preventivo para evitar pérdidas de componentes",
      "Paquetes escolares con descuento por volumen en kits de práctica",
      "Facturación formal con CFDI para colegios y universidades"
    ],
    badge: "10 Horas • Más Solicitado",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    destacado: true
  },
  {
    id: "bloque-torneo-olimpico-20h",
    titulo: "Entrenamiento Intensivo WRO & Torneos SOLACyT",
    horas: 20,
    subtitulo: "Hardware homologado de torneo, control PID de alta velocidad y estrategia de pista",
    descripcion:
      "Acompañamiento técnico de alto rendimiento para equipos estudiantiles y coaches que competirán en World Robot Olympiad (RoboMission) o torneos SOLACyT (Infomatrix/Robomatrix en seguidor de línea y mini sumo).",
    dirigidoA: "Clubes de robótica de competición, universidades y competidores que buscan podio.",
    incluye: [
      "Interpretación estratégica del reglamento oficial de la temporada",
      "Implementación de algoritmo de control PID en tiempo real con muestreo constante",
      "Selección de componentes homologados: turbinas, tracción, sensores de alto contraste",
      "Simulación de pistas oficiales y resolución del reto sorpresa",
      "Revisión del portafolio técnico y defensa argumentada ante el jurado calificador"
    ],
    badge: "20 Horas • Alto Rendimiento",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200"
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
    imagen: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
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
