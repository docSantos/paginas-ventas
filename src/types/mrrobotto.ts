// src/types/mrrobotto.ts
// Tipos para Mr-Robotto: Tutoriales de Módulos, Tienda de Productos Maker, Cursos con Certificación DC3 y Competiciones WRO/SOLACyT

export type NivelDificultad = 'Principiante' | 'Intermedio' | 'Avanzado' | 'Fácil' | 'Media';

export type CategoriaModulo = 
  | 'Todos'
  | 'Sensores'
  | 'Displays'
  | 'Motores y Actuadores'
  | 'Comunicación'
  | 'Alimentación'
  | 'Microcontroladores'
  | 'Kits de Robótica';

export type CategoriaProducto = 
  | 'Todos'
  | 'Kits de Robótica (Brazos y Móviles)'
  | 'Kits de Competencia (WRO/SOLACyT)'
  | 'Archivos de Impresión 3D (.STL)'
  | 'Sensores & Módulos'
  | 'Motores & Drivers'
  | 'Microcontroladores'
  | 'Herramientas & Prototipado';

export interface PinConexion {
  pinModulo: string;
  pinArduino: string;
  colorCable: 'Rojo' | 'Negro' | 'Azul' | 'Amarillo' | 'Verde' | 'Naranja' | 'Blanco';
  tipoSenal: 'Alimentación (VCC)' | 'Tierra (GND)' | 'Digital I/O' | 'Analógico' | 'I2C (SDA)' | 'I2C (SCL)' | 'PWM' | 'UART (TX/RX)';
  nota: string;
}

export interface EspecificacionTecnica {
  nombre: string;
  valor: string;
}

export interface LibreriaRequerida {
  nombre: string;
  autor: string;
  instalador: string;
}

export interface ExplicacionPaso {
  paso: string;
  detalle: string;
}

export interface SolucionProblema {
  problema: string;
  causa: string;
  solucion: string;
}

export interface TutorialModulo {
  id: string;
  slug: string;
  nombre: string;
  subtitulo: string;
  categoria: 'Sensores' | 'Displays' | 'Motores y Actuadores' | 'Comunicación' | 'Alimentación' | 'Microcontroladores' | 'Kits de Robótica';
  chipPrincipal: string;
  nivel: NivelDificultad;
  voltajeOperacion: string;
  protocolo: string;
  tiempoEstimado: string;
  imagen: string;
  descripcion: string;
  especificaciones: EspecificacionTecnica[];
  pines: PinConexion[];
  librerias: LibreriaRequerida[];
  codigoArduino: string;
  explicacionCodigo: ExplicacionPaso[];
  solucionProblemas: SolucionProblema[];
  tags: string[];
}

export interface RecursoDescarga {
  nombre: string;
  tipo: 'pdf' | 'zip' | 'link' | 'code';
  url: string;
  peso?: string;
}

export interface LeccionVideo {
  id: string;
  titulo: string;
  duracion: string;
  resumen: string;
  videoUrl?: string;
  codigoArduino?: string;
  pines?: PinConexion[];
  recursos?: RecursoDescarga[];
  esGratis: boolean;
}

export interface ModuloCurso {
  id: string;
  titulo: string;
  descripcion: string;
  lecciones: LeccionVideo[];
}

export interface CertificacionDC3Info {
  incluida: boolean;
  claveRegistroSTPS: string;
  horasAcreditadas: number;
  areaTematica: string;
  agenteCapacitador: string;
  beneficios: string[];
}

export interface CursoPremium {
  id: string;
  slug: string;
  titulo: string;
  descripcionCorta: string;
  descripcionLarga: string;
  nivel: NivelDificultad;
  categoria: 'Arduino & Maker' | 'Robótica WRO / SOLACyT' | 'Capacitación Docente' | 'Cursos de Kits' | 'Automatización & PLC' | 'IoT & ESP32';
  instructor: {
    nombre: string;
    rol: string;
    avatar: string;
    certificaciones?: string;
  };
  portada: string;
  duracionTotal: string;
  totalLecciones: number;
  calificacion: number;
  precio: number;
  precioOriginal?: number;
  esPremium: boolean;
  certificacionDC3: CertificacionDC3Info;
  enfoqueCompetencia?: 'WRO' | 'SOLACyT Infomatrix' | 'Robomatrix' | 'General';
  esCapacitacionDocente?: boolean;
  paraDocentes?: {
    nivelEducativo: string;
    incluyeMaterialAula: boolean;
    rubricasEvaluacion?: boolean;
  };
  requisitos: string[];
  loQueAprenderas: string[];
  modulos: ModuloCurso[];
}

export interface ProductoRobotica {
  id: string;
  slug: string;
  nombre: string;
  subtitulo: string;
  categoria: 'Kits de Robótica (Brazos y Móviles)' | 'Kits de Competencia (WRO/SOLACyT)' | 'Archivos de Impresión 3D (.STL)' | 'Sensores & Módulos' | 'Motores & Drivers' | 'Microcontroladores' | 'Herramientas & Prototipado';
  precio: number;
  precioOriginal?: number;
  stock: number;
  envioGratis: boolean;
  imagenPrincipal: string;
  galeria: string[];
  destacadoReel: boolean;
  badge?: string;
  calificacion: number;
  reviewsCount: number;
  descripcion: string;
  compatibilidad: string[];
  especificaciones: EspecificacionTecnica[];
  contenidoCaja: string[];
  enfoqueOlimpiada?: string;
  esDigital?: boolean;
  formatosArchivos?: string[];
  parametrosImpresion?: {
    material: string;
    infill: string;
    tiempoEstimado: string;
    pesoFilamento: string;
  };
}
