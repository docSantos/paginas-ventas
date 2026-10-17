# 🤖 MR-ROBOTTO - LOG DE DESARROLLO Y DEFINICIÓN DE PLATAFORMA

**Fecha de Inicio:** Octubre 2026  
**Proyecto:** Plataforma E-commerce y LMS Maker para Robótica Educativa, Kits WRO/SOLACyT, Capacitación Docente y Certificación DC-3.  
**Ubicación en Plataforma:** `/mrrobotto` (módulo integrado en el Hub de Paginas IXA).

---

## 🎯 1. OBJETIVO DEL PROYECTO
Mr-Robotto es una plataforma tecnológica y educativa integral orientada a estudiantes, entusiastas de la mecatrónica, competidores de torneos de robótica y, muy especialmente, **docentes e instituciones educativas**.

El modelo de negocio combina:
1. **Venta de Hardware y Kits Físicos:** Kits de brazos robóticos y robots móviles para olimpiadas (seguidores de línea WRO/SOLACyT).
2. **Venta de Archivos Digitales 3D:** Modelos STL y diseños mecánicos optimizados para impresión 3D FDM.
3. **Cursos y Capacitación Docente:** Formación especializada en el uso de los kits, pedagogía en robótica y cursos con valor oficial mediante **Certificación DC-3 (STPS)**.
4. **Material y Tutoriales Gratuitos:** Documentación técnica abierta (diagramas de pines, código C++ `.ino`, guías de sensores Arduino/ESP32 y videos demostrativos).

---

## 📦 2. DEFINICIÓN DE LÍNEAS DE VENTA

### A. Kits de Proyectos Físicos
* **Brazos Robóticos:**
  * Kit Brazo Robótico 4-DoF con Garra (servos de torque metálico MG996R y SG90, tarjeta de control Arduino/ESP32, joystick / Bluetooth).
  * Kit Brazo Robótico 6-DoF Industrial Educativo (cinemática inversa, control por grados y secuencias de memoria).
* **Robots para Competencias (WRO / SOLACyT):**
  * Seguidor de Línea Velocista de Alto Rendimiento (algoritmo PID en bucle cerrado, barra de 8 reflectores ópticos, motores N20 con encoders magnéticos, chasis de fibra o aluminio ligero).
  * Seguidor de Línea Educativo Inicial (para categorías Junior y secundarias).
  * Robot Mini Sumo (especificaciones reglamentarias SOLACyT: 10x10 cm, 500g).
* **Componentes Sueltos:**
  * Microcontroladores (ESP32 DevKit, Arduino Uno/Nano).
  * Sensores y actuadores (HC-SR04, DHT11, DHT22, OLED SSD1306, drivers L298N, servomotores).

### B. Archivos Digitales de Impresión 3D (.STL / .STEP)
* Diseños mecánicos listos para laminar e imprimir en impresoras 3D (Ender 3, Bambu Lab, etc.).
* Descarga inmediata tras la compra.
* Incluye parámetros recomendados de laminado (relleno infill %, material PLA/PETG, orientación sin soportes innecesarios).
* Catálogo inicial:
  * Chasis aerodinámico para Seguidor de Línea WRO/SOLACyT.
  * Estructura completa de articulaciones y garra para Brazo Robótico.
  * Soportes para sensor ultrasónico HC-SR04, portapilas 18650 y pantallas OLED.

### C. Cursos y Capacitaciones
1. **Capacitaciones para Docentes de Robótica:**
   * Cómo crear y liderar clubes escolares de robótica.
   * Planificación curricular, rúbricas de evaluación y resolución de problemas comunes en el aula.
   * Capacitaciones personalizadas sobre el uso de los kits de Mr-Robotto.
2. **Cursos Premium de Kits:**
   * Tutoriales avanzados paso a paso de ensamblaje, calibración mecánica, algoritmos de cinemática inversa y sintonización de control PID.
3. **Cursos con Certificación Oficial DC-3 (STPS México):**
   * Emisión legal de la Constancia de Competencias o Habilidades Laborales con clave de registro STPS federal, horas acreditadas (25 a 40 horas) y valor curricular oficial.

---

## 🎁 3. MATERIAL GRATUITO Y ESTRATEGIA DE COMUNIDAD
Para atraer a la comunidad maker y docentes sin fricción:
* **Tutoriales Escritos Paso a Paso:**
  * Módulo Sensor Ultrasónico HC-SR04 (distancias con pulseIn).
  * Módulo DHT11 y DHT22 (temperatura y humedad ambiental).
  * Pantalla OLED 0.96" I2C SSD1306 (gráficos y fuentes).
  * Driver de Motores L298N (puente H y control PWM).
  * Servomotor SG90 (barrido angular 0° a 180°).
  * Módulo Bluetooth HC-05 (puente serial UART).
* **Código Fuente C++ (.ino):**
  * Bloques interactivos con botón para copiar al portapapeles en 1 clic y descargar el archivo `.ino`.
* **Diagramas de Conexión:**
  * Tabla pin a pin con código de color estándar para protoboard.
* **Videos y Guías de Montaje:**
  * Integración de reproductores de video responsivos con lecciones y capítulos.

---

## 🏗️ 4. ARQUITECTURA TÉCNICA Y ESTÁNDARES
* **Mobile-First & PWA:** Contenedor nativo `max-w-2xl mx-auto` con barra inferior fija (`BottomNav.tsx`) táctil y soporte para safe area de iPhone (`safe-area-pb`, `safe-area-pt`).
* **Depuración Móvil:** Integración de `<ErudaProvider />` en modo desarrollo para consola de depuración en tiempo real en iOS Safari.
* **Robustez UTF-8 / Mojibake:** Búsquedas y filtros normalizados mediante `src/lib/textUtils.ts` (insensible a acentos y diacríticos).
* **Cero Hardcodeo:** Todos los productos, cursos, kits y archivos 3D se estructuran en `src/data/mrrobottoData.ts` con tipado estricto en `src/types/mrrobotto.ts`.

---

## 📝 5. REGISTRO DE HITOS (CHANGELOG)
* **Hito 1 (16/10/2026):** Creación del módulo `/mrrobotto`, definición del Reel interactivo estilo MercadoLibre, Banner institucional DC-3 y sección temática WRO/SOLACyT.
* **Hito 2 (17/10/2026):** Creación del LOG oficial exclusivo (`MR_ROBOTTO_LOG.md`). Ampliación de la tienda con **Brazos Robóticos 4-DoF**, **Robot Seguidor de Línea LineMaster Pro WRO/SOLACyT**, **Packs de Archivos 3D (.STL / .STEP)** y **Capacitación para Docentes de Clubes STEAM**.
* **Hito 3 (17/10/2026):** 
  * Integración de tutoriales específicos gratuitos: **Sensor DHT11** con sketch Arduino/ESP32 y tabla de pines, **ESP32 DevKit v1 con Servidor Web Local y Telemetría**, y **Guía de Centrado Eléctrico de Servos a 90° para Brazos Robóticos**.
  * Filtros por píldoras en UI para navegación rápida de compradores y educadores: *Kits de Robótica*, *Archivos 3D (.STL)*, *Capacitaciones Docentes* y *Con DC-3 STPS*.
  * Insignias visuales en tarjetas de producto para descargas 3D digitales (`💾 DESCARGA .STL`) y cursos para profesores (`🎓 Docente STEAM`).
  * Verificación integral de compilación (`npm.cmd run build`) exitosa con 33 rutas estáticas pregeneradas (SSG) y salida código 0.
* **Hito 4 (17/10/2026):**
  * **Eliminación del badge/botón confuso `DC-3 / WRO`** junto al título: la marca ahora dice limpiamente **"Mr-Robotto"** con su avatar e isotipo robot.
  * **Barra de Navegación Superior Unificada:** Se integraron las 4 pestañas solicitadas: **Tienda**, **Tutoriales**, **Cursos Premium** y **Cursos DC-3**, manteniendo el resaltado rojo activo (`bg-red-600 text-white shadow-md shadow-red-950/50`).
  * **Sincronización Mobile & PWA:** Barra responsive con fila horizontal táctil sin cortes en teléfonos (`overflow-x-auto`) y sincronización en la barra inferior fija (`BottomNav.tsx`).
  * **Compilación y Rutas:** Prueba de build de Next.js 16 con exit code 0.
* **Hito 5 (17/10/2026):**
  * **Eliminación de Scrollbar Horizontal Flotante:** Se definieron las utilidades CSS `.no-scrollbar` y `.scrollbar-none` en `src/app/globals.css` (ocultando scrollbars nativos de Windows/WebKit/Firefox).
  * **Reacomodo de Selector de Pestañas y Buscador:** Dentro del contenedor `max-w-2xl`, el selector de 4 pestañas ahora usa una cuadrícula limpia de ancho completo (`grid-cols-2 sm:grid-cols-4`) sin desbordamiento horizontal y el buscador ocupa su propia fila completa debajo.
  * **Ajuste de Grids de Tarjetas:** Se calibraron los grids de productos, tutoriales y cursos a `grid-cols-1 sm:grid-cols-2` para ajustarse al ancho de columna `max-w-2xl`.
* **Hito 6 (17/10/2026):**
  * **Corrección de Metadatos de la Matriz Central:** Se reemplazó el remanente de "Paginas Gaby" en `src/app/layout.tsx` (title template `%s | Páginas Ixa`), `src/app/page.tsx` (footer de la consola central), `src/app/manifest.ts` y las etiquetas OpenGraph de `/mrrobotto`. Ahora todas las vistas previas en WhatsApp y navegadores reflejan con exactitud a **Páginas Ixa** como la matriz central.


