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
* **Hito 7 (17/10/2026):**
  * **Transformación Visual de Alta Gama (Puntos 1 y 2):**
    * **Suavizado de la Oscuridad (Punto 1):** Se desterró el plástico negro rígido y frío (`slate-950`) reemplazándolo por un grafito/zinc neutro mate (`neutral-950`) cálido y sofisticado. Se sustituyeron los neones rojos planos por degradados carmesí-rose luminosos (`from-red-600 to-rose-600`) con sombras difusas elegantes (`shadow-[0_2px_12px_rgba(225,29,72,0.35)]`) e iluminaciones ambientales sutiles (`radial-gradient`).
    * **Jerarquía Tipográfica y Acabados de Ingeniería (Punto 2):** Se introdujo una estética de hardware de alta tecnología (estilo Apple Hardware / DJI Robotics) en lugar de una apariencia sobrecargada gamer: titulares con `tracking-tight` y contraste refinado, cápsulas flotantes translúcidas (`backdrop-blur-md`), tarjetas con fondos `neutral-900/70` y micro-bordes suaves `border-neutral-800/80`.
    * **Componentes Refinados:** Actualización integral de `Header`, `MrRobottoHomeClient`, `ProductCard`, `TutorialCard`, `CourseCard`, `ProductReel`, `DC3Banner`, `WROSection`, `VideoPlayerMock`, `CodeBlock`, `PinoutTable` y `BottomNav`.
    * **Verificación de Build:** Compilación limpia en Next.js 16.3.3 (`exit code 0`, 33 rutas estáticas generadas sin fallos).
* **Hito 8 (17/10/2026):**
  * **Transición a Paleta Blanco/Gris Aeroespacial:**
    * **Identidad Visual "SpaceX Dragon / NASA Cleanroom / DJI Enterprise":** Sustitución del tema oscuro por un acabado cerámico y titanio aeroespacial limpio: lienzo exterior en `bg-slate-900` para encuadrar la consola móvil central en blanco/gris aeroespacial de grado quirúrgico (`bg-[#f8fafc]` / `bg-white`).
    * **Contraste y Legibilidad Superior:** Tipografía principal en gris espacial oscuro (`text-slate-900`, `text-slate-600`, `text-slate-500`) con acentos vibrantes de seguridad aeronáutica en rojo carmesí (`from-red-600 to-rose-600`) y certificaciones en ámbar oficial (`bg-amber-100 text-amber-900 border-amber-300`).
    * **Tarjetas y Superficies Cerámicas:** Modernización completa de componentes:
      * `Header.tsx`: Vidrio blanco esmerilado con desenfoque (`bg-white/90 backdrop-blur-xl border-slate-200/90`).
      * `ProductCard.tsx` y `TutorialCard.tsx`: Chasis cerámicos blancos con microbordes de precisión `border-slate-200/90`, sombras suaves `shadow-xs` / `hover:shadow-md` y badges pasteles de alta legibilidad.
      * `CourseCard.tsx` y `VideoPlayerMock.tsx`: Marcos cerámicos con visores de alto contraste para reproducción de lecciones.
      * `ProductReel.tsx`: Estética de catálogo técnico con tarjetas de producto en relieve blanco y selector táctil tipo carrete.
      * `DC3Banner.tsx`: Credencial digital STPS en tarjeta blanca con bordes dorados e insignias oficiales de validez curricular federal.
      * `WROSection.tsx`: Bloques de torneos olímpicos con fondos claros y distintivos para categorías WRO, SOLACyT e Infomatrix.
      * `BottomNav.tsx`: Barra de navegación inferior en vidrio esmerilado blanco con pestañas en rojo aeroespacial de alto contraste.
      * `CoursePlayerClient.tsx` y `TutorialDetailClient.tsx`: Experiencia completa de lectura y reproductor adaptada a la estética aeroespacial clara.
* **Hito 9 (17/10/2026):**
  * **Reorganización Estricta del Banner Hero & Exclusividad de Sección:**
    * **Exclusividad en Tienda:** El banner superior principal se configuró para mostrarse **únicamente en la sección de Tienda**, eliminándose por completo de las otras tres secciones (*Tutoriales*, *Cursos Premium* y *Cursos DC-3*), permitiendo un acceso inmediato y sin distracciones al contenido respectivo.
    * **Conservación de lo Superior a la Línea Azul:** Se mantuvieron con precisión únicamente el pill badge institucional, el titular degradado rojo/ámbar y el párrafo descriptivo, eliminando las cuatro tarjetas estáticas que estaban por debajo.
  * **Reel de Productos Autónomo Estilo Facebook:**
    * **Ubicación Debajo de la Línea Azul:** Se incorporó un componente dinámico autónomo (`ProductReel.tsx`) que rota productos automáticamente cada 3.5 segundos con animación fluida.
    * **Diseño Inspirado en Facebook Reels:** Tarjeta activa con miniatura de alta resolución, badge de categoría, nombre, precio destacado en rojo aeronáutico, stock y accesos directos en 1 clic para compra por WhatsApp y Ficha Técnica modal.
    * **Puntos de Paginación Sincronizados:** Indicadores de puntos (`• • • • •`) al estilo de historias/reels con estado activo interactivo.
    * **Tira Inferior de Minitarjetas Sincronizada (Elemento en Amarillo):** La fila horizontal de tarjetas de producto se desplaza y centra automáticamente en el producto en reproducción, manteniendo el borde rojo activo y permitiendo selección manual instantánea al toque.
    * **Pausa Inteligente:** Pausa automática al colocar el cursor o interactuar táctilmente, más botones de control manual (Play/Pausa, Anterior, Siguiente).
* **Hito 10 (17/10/2026):**
  * **Arquitectura 100% Responsiva para Pantallas Grandes (Desktop & Monitores Ultra-Wide):**
    * **Eliminación del Efecto 'Letterbox' Móvil:** Se removió el envoltorio `max-w-2xl` y el fondo oscuro artificial `bg-slate-900` de `src/app/mrrobotto/layout.tsx`. Ahora el fondo aeroespacial claro `bg-[#f8fafc]` cubre el ancho completo (full-bleed) de la pantalla en cualquier monitor (1080p, 2K, 4K) sin barras laterales oscuras vacías.
    * **Ocultamiento Inteligente de BottomNav en Escritorio:** La barra inferior flotante (`BottomNav.tsx`) se configuró con `md:hidden`, mostrándose exclusivamente en teléfonos móviles (< 768px). En escritorio la navegación se delega con naturalidad al `Header.tsx` superior sin duplicar barras.
    * **Header Expansivo en Desktop:** `src/components/mrrobotto/Header.tsx` aprovecha el ancho completo con contenedor `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`, mostrando la marca en el extremo izquierdo y las pestañas de navegación a la derecha.
    * **Hero y Reel Centrados con Proporción Áurea:** En `MrRobottoHomeClient.tsx`, el hero se amplió a `max-w-5xl` y el `ProductReel` a `max-w-4xl`, permitiendo que el reel se luzca en grande sin deformarse ni comprimirse en un tubo de teléfono.
    * **Reel Activo Adaptable Mobile/Desktop:** En `ProductReel.tsx`, la tarjeta de producto activa presenta en móviles un esquema horizontal compacto y en escritorio (`sm:` en adelante) distribuye la imagen e información en el flanco izquierdo y los botones táctiles de compra/ficha en una columna lateral derecha organizada.
    * **Toolbar de Controles y Buscador:** El selector de 4 pestañas y el buscador en vivo se integraron en un toolbar balanceado (`flex-col md:flex-row md:items-center justify-between`) que mantiene las pestañas organizadas y el campo de búsqueda acotado (`md:max-w-xs lg:max-w-sm`) en lugar de estirarse excesivamente.
    * **Grids Multi-Columna Fluidos:**
      * **Catálogo de Tienda:** Pasa de 2 columnas forzadas a cuadrícula dinámica de 4 columnas en pantallas grandes (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6`).
      * **Tutoriales de Módulos:** Cuadrícula de 3 columnas en escritorio (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6`).
      * **Cursos Premium y Cursos DC-3 STPS:** Cuadrícula de 3 columnas en escritorio (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5`).
    * **Manejo de Errores de Imagen (`onError` Fallback):** Implementación de respaldos automáticos en `ProductReel.tsx` y `ProductCard.tsx` para evitar que enlaces externos lentos o caídos muestren iconos rotos en pantalla.
* **Hito 11 (17/10/2026):**
  * **Integración Visual de Hardware de Punta en Fondo del Hero (Desktop):**
    * **Renders 3D Fotorrealistas de Alta Resolución:** Se generaron y procesaron digitalmente con fondo blanco puro y formato `.webp` de alto rendimiento dos piezas clave de hardware:
      * **Arduino VENTUNO Q:** La nueva placa insignia de IA de borde (aniversario 21 de Arduino) con disipador térmico negro finned marcado "ARDUINO VENTUNO Q", conectores USB-C, HDMI, puerto Ethernet RJ45 y pines de cabecera turquesa.
      * **ESP32-S3 DevKitC-1:** Placa de desarrollo con blindaje metálico RF grabado "ESP32-S3", puertos duales USB-C, antena PCB grabada y terminales de pines chapados en oro.
    * **Composición y Distribución Símétrica:**
      * **Lateral Izquierdo:** Arduino Ventuno Q flotando con una ligera inclinación dinámica (`-rotate-6`), halo difuso en tono Arduino Teal y píldora con indicador activo `ARDUINO VENTUNO Q`.
      * **Lateral Derecho:** ESP32-S3 DevKit flotando con inclinación simétrica (`rotate-6`), halo difuso en tono carmesí aeroespacial y píldora con indicador activo `ESP32-S3 DUAL-CORE`.
    * **Fusión Visual Sin Fisuras (`mix-blend-multiply`):** Al contar con fondo blanco puro procesado con curvas de brillo, las placas se funden orgánicamente con el degradado aeroespacial del Hero sin cortes rectangulares ni artefactos de recorte.
    * **Adaptabilidad Responsiva (`hidden lg:flex`):** Los modelos se muestran en pantallas grandes (laptops y monitores de escritorio donde hay espacio disponible a los costados del Reel) y se ocultan automáticamente en móviles y tablets para evitar saturación o solapamiento con los controles de compra.
    * **Compilación Verificada:** Construcción de Next.js 16 con exit code 0 y 33 rutas estáticas pregeneradas.
* **Hito 12 (17/10/2026):**
  * **Fondo Hero "Mitad y Mitad" con Transparencia Oscura Estilo Fal-Volt:**
    * **Arquitectura de Fondo Abarcante 50/50:** Siguiendo la estética visual de Fal-Volt (con la imagen de la montaña en penumbra), el Hero de Mr-Robotto se transformó en una experiencia cinematográfica oscura (`bg-slate-950 text-white rounded-b-3xl sm:rounded-b-[2.5rem] border-b border-slate-800 shadow-2xl`):
      * **Mitad Izquierda (50% de ancho):** Render 16:9 fotorrealista de alta definición del **Arduino VENTUNO Q** sobre pizarra oscura (`hero-arduino-ventuno-dark.webp`), con disipador térmico ranurado, cabezal GPIO turquesa y trazas doradas visibles bajo una suave opacidad del 45-50%.
      * **Mitad Derecha (50% de ancho):** Render 16:9 fotorrealista del **ESP32-S3 DevKit** sobre pizarra oscura (`hero-esp32-s3-dark.webp`), con blindaje metálico grabado, puertos USB-C dobles y leds de encendido/estado iluminados.
    * **Capas de Transparencia Oscura y Viñeta Central:** Gradientes cruzados horizontales (`from-slate-950/80 via-transparent to-slate-950/90`) y verticales (`from-slate-950 via-slate-950/75 to-slate-950/50`), garantizando que las placas se aprecien como texturas de ingeniería de fondo sin competir con la lectura del texto.
    * **Tipografía y Elementos Flotantes:** Titulares en blanco puro (`text-white`) con degradado carmesí/ámbar brillante, badge institucional translúcido (`bg-red-500/10 border-red-500/30 text-red-300`) y chips identificadores sutiles en las esquinas inferiores (`ARDUINO VENTUNO Q` y `ESP32-S3 DUAL-CORE`).
    * **Realce del ProductReel:** La tarjeta del Reel se equipó con `shadow-2xl ring-1 ring-white/20`, luciendo como una consola o terminal de e-commerce iluminada en primer plano flotando sobre el hardware en penumbra.
    * **Verificación de Build:** Next.js 16 compiló con éxito (`exit code 0`, 33 rutas estáticas generadas).
* **Hito 13 (17/10/2026):**
  * **Iluminación del Hero, Reubicación de WRO a Cursos Premium y Eliminación del Autoscroll:**
    * **Mayor Luminosidad en Fondo Hero:** Se ajustó la opacidad de los renders a un 70-85% (antes 40-50%) e integraron resplandores ambientales de pantalla (`mix-blend-screen` en tonos cian para Arduino y carmesí para ESP32), aligerando las capas de viñeta para que el hardware y sus circuitos dorados se distingan nítidamente con viveza y luz cinematográfica.
    * **Reubicación de WRO & SOLACyT a Cursos Premium:** La sección `<WROSection />` ("Preparación para WRO México & Torneos SOLACyT") fue retirada de la pestaña de Tienda y reubicada en la cabecera de la pestaña **Cursos Premium** (`activeTab === 'cursos-premium'`), en perfecta consonancia con su enlace de acceso a la *Masterclass Olímpica*.
    * **Eliminación Definitiva del Autoscroll Molesto:** Se detectó que el centrado de la minitarjeta activa del Reel ejecutaba `activeEl.scrollIntoView()`, lo que forzaba al navegador a brincar la posición vertical del viewport del usuario cada 3.5 segundos. Se reemplazó por un cálculo matemático de desplazamiento interno local: `container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' })`, el cual únicamente desliza la barra horizontal de miniaturas sin afectar en absoluto el scroll vertical de la ventana.
    * **Compilación Verificada:** Compilación en Next.js 16 exitosa con código 0 y 33 rutas estáticas generadas.
* **Hito 14 (17/10/2026):**
  * **Integración del Shark X como Producto #1 del Reel y Barra Intermedia "Catálogo" con Alternador Galería / Lista:**
    * **Shark X — Gabinete Mecha Robótico Flagship:**
      * Se procesó la fotografía original de alta definición (`media_1792275954023_7f3ebc19.jpg`) en un lienzo cuadrado optimizado de 1000x1000px y se exportó a formatos WebP y JPG (`/mrrobotto/shark-x.webp`).
      * Se integró a la base de datos `PRODUCTOS_MRROBOTTO` con el ID `prod-shark-x` como elemento de índice 0 (`destacadoReel: true`, $14,999 MXN, calificación 4.99, badge "Edición Especial", especificaciones de aleación aeroespacial, iluminación ARGB y soporte AIO).
      * En `MrRobottoHomeClient.tsx`, el prop `productos` del `ProductReel` se configuró con `productosReel` (filtrando productos con `destacadoReel`), garantizando que el Shark X sea el primer producto activo que se despliega inmediatamente en el Reel al cargar la página de Tienda.
    * **Barra Intermedia Unificada "Catálogo":**
      * Se removió la redundancia de los 4 botones repetidos ("Tienda, Tutoriales, Cursos Premium, Cursos DC-3") de la barra intermedia debajo del Hero, manteniéndolos limpios y fijos exclusivamente en la barra de navegación superior (`Header.tsx`).
      * La barra intermedia ahora presenta de forma coherente en las 4 secciones:
        * Título principal **"Catálogo"** con isotipo de capas e indicador dinámico de conteo (`X productos`, `X guías`, `X cursos`) y subtítulo contextual de cada sección.
        * Selector de modo interactivo: **Modo Galería (▦)** vs **Modo Lista (▤)** con indicador activo destacado.
        * Barra de búsqueda en vivo alineada a la derecha con botón de borrado rápido.
    * **Soporte Bidireccional de Visualización (Galería vs Lista):**
      * **Tienda:** Modo Galería despliega las cuadrículas de 4 columnas; Modo Lista despliega tarjetas horizontales con miniatura, categoría, badge, estrellas, título, especificaciones clave en chips, precio, botón de vista rápida y botón de pedido inmediato por WhatsApp.
      * **Tutoriales:** Modo Galería en cuadrícula de 3 columnas; Modo Lista despliega filas con chip, dificultad, tiempo de lectura, título, pines mapeados, voltaje, protocolo y enlace "Ver Tutorial".
      * **Cursos Premium:** Modo Galería en cuadrícula de 3 columnas; Modo Lista en filas horizontales con portada 16:9, badges STPS/Docente STEAM, duración, lecciones, nivel, precio y botón de acceso al programa.
      * **Cursos DC-3 STPS:** Modo Galería y Lista resaltando la constancia oficial de habilidades laborales DC-3 STPS y las horas acreditadas.
    * **Verificación de Build:** Compilación limpia con `next build` (código de salida 0, 33/33 páginas estáticas generadas sin errores de TypeScript ni linter).
* **Hito 15 (17/10/2026):**
  * **Optimización y Rediseño Premium del Header Superior en Celulares (`Header.tsx`):**
    * **Eliminación del Desbordamiento Horizontal y Recorte de Botones:** En lugar del carrusel desbordado `overflow-x-auto` donde el cuarto botón ("Cursos DC-3") quedaba cortado a la mitad en la orilla derecha de la pantalla, se implementó un control segmentado nativo tipo cápsula de 4 columnas simétricas (`grid grid-cols-4 gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70 shadow-2xs`).
    * **Nombres Compactos de Alta Legibilidad en Pantallas Chicas:**
      * Pestaña 1: `Tienda`
      * Pestaña 2: `Tutoriales`
      * Pestaña 3: `Premium` (en lugar de la frase larga que desbordaba)
      * Pestaña 4: `DC-3` (en lugar de la frase larga)
      * Las 4 pestañas caben simultáneamente en cualquier resolución de teléfono (360px a 430px) sin desplazamientos ni cortes.
    * **Acceso Rápido de Soporte en Fila 1:** Se aprovechó el espacio libre a la derecha de la marca para integrar un botón directo de WhatsApp (`Soporte`) con tono esmeralda, balanceando estéticamente la fila superior.
    * **Reducción de Altura Vertical:** Altura optimizada de 52px en fila de marca y padding compacto en pestañas, ahorrando espacio de pantalla en teléfonos.
    * **Compilación Verificada:** Compilación Next.js 16 con código de salida 0 y 33 rutas estáticas generadas sin errores.
* **Hito 16 (17/10/2026):**
  * **Línea Oficial de 6 Productos Iniciales (Doble Joystick en Plantilla, Visión IA y Gabinete Escualo) y Cursos DC-3 STPS vía `certimexico.com`:**
    * **Actualización de los 6 Productos Estelares en Tienda y Reel (`PRODUCTOS_MRROBOTTO`):**
      1. **Gabinete Escualo — Chasis Mecha Biónico con Iluminación ARGB (Próximamente):** Diseño propio de Mr-Robotto inspirado en aerodinámica de tiburón mecha (`esProximamente: true`, Lista VIP).
      2. **Robot 4 GDL con Plantilla de Control de Doble Joystick:** Brazo robótico articulado en MDF de 3mm operado mediante **dos módulos joystick analógicos montados ergonómicamente sobre una plantilla de control dedicada** (disponible para envío inmediato).
      3. **Robot Otto Biónico — Kit Educativo Bípedo Programable:** Kit bípedo con sensor ultrasónico HC-SR04 y 4 servomotores SG90 (disponible para envío inmediato).
      4. **Robot 4 GDL con Visión Artificial, ESP32 y Python (Próximamente):** Evolución con cámara ESP32-S3 y MediaPipe/OpenCV (`esProximamente: true`).
      5. **Robot 6 GDL Tipo KUKA con Plantilla de Doble Joystick y Servos MG90S (Próximamente):** Brazo antropomórfico de 6 ejes con engranajes metálicos MG90S (alcance optimizado de 20–22 cm) y **plantilla física de control con dos joysticks analógicos** (`esProximamente: true`).
      6. **Robot 6 GDL Tipo KUKA con Visión Artificial, ESP32 y Python (Próximamente):** Tope de gama con cinemática inversa en Python y cámara ESP32-S3 — **sin DC-3**, enfocado 100% como kit de hardware e ingeniería avanzada (`esProximamente: true`).
    * **Nuevos Cursos DC-3 STPS de Diseño Electrónico (`CURSOS_PREMIUM_MRROBOTTO`):**
      * **Curso de Diseño Electrónico y PCB Profesional con Altium Designer (DC-3):** 24 horas acreditadas STPS, ruteo multicapa, impedancia controlada y archivos Gerber/BOM industriales.
      * **Curso de Diseño Electrónico con KiCad + Inteligencia Artificial (DC-3):** 20 horas acreditadas STPS, diseño de tarjetas para ESP32/Arduino asistido por IA para selección de componentes, revisión de esquemáticos y ruteo.
    * **Integración Oficial con `certimexico.com`:**
      * Se vinculó `https://certimexico.com` en `CERTIFICACION_DC3_GLOBAL`, `DC3Banner.tsx`, `CourseCard.tsx`, `CoursePlayerClient.tsx` y `MrRobottoHomeClient.tsx` como la plataforma certificadora oficial donde se realiza la evaluación y emisión de las constancias DC-3 ante la STPS.
      * Soporte visual de preventa (`esProximamente`) en `ProductReel.tsx`, `ProductCard.tsx` y `MrRobottoHomeClient.tsx` con botón ámbar *"Apartar en WhatsApp"* y mensaje personalizado de Lista VIP.
* **Hito 17 (17/10/2026):**
  * **Separación de Cursos DC-3 vs Cursos Premium Maker y Capacitación por Bloques de Horas para Docentes y Clubes (WRO/SOLACyT):**
    * **Desacople Estricto de Cursos DC-3 en Pestaña Premium:**
      * En la pestaña **Cursos Premium** se excluyen todos los programas con certificación DC-3 (`certificacionDC3.incluida === false`).
      * Se crearon las versiones de autoestudio maker a precios más accesibles sin arancel de certificación STPS:
        * **Curso de Diseño Electrónico y PCB Profesional con Altium Designer (Edición Maker):** $890 MXN (original $1,490 MXN).
        * **Curso de Diseño Electrónico con KiCad + Inteligencia Artificial (Edición Maker):** $690 MXN (original $1,190 MXN).
        * **Masterclass: Ensamblaje, Doble Joystick y Visión Artificial para Brazos Robóticos:** $850 MXN (original $1,200 MXN).
      * La pestaña **Cursos DC-3** conserva exclusivamente los programas con Constancia Oficial DC-3 STPS emitida y evaluada en `certimexico.com` ($1,950 y $1,750 MXN).
    * **Capacitación por Bloques de Horas para Docentes y Clubes de Robótica (`WROSection.tsx` & `BLOQUES_CAPACITACION_MRROBOTTO`):**
      * Se unificó el mensaje de docentes y torneos WRO/SOLACyT como servicio de capacitación técnica por horas (en lugar de cursos pregrabados en el catálogo):
        * *¿Eres docente o líder de club de robótica? Asesoramos a clubes escolares, universidades y competidores independientes con hardware homologado, chasis de torneo y código PID optimizado. Ofrecemos paquetes escolares, factura con CFDI y kits de práctica con descuento por volumen.*
      * Estructurado en 3 bloques de horas con agendado directo a WhatsApp:
        1. **Bloque Asesoría & Diagnóstico Técnico (5 Horas)**
        2. **Capacitación Docente STEAM & Gestión de Aula (10 Horas)** — *Más Solicitado*
        3. **Entrenamiento Intensivo WRO & Torneos SOLACyT (20 Horas)** — *Alto Rendimiento*
      * Banner inferior con cotización formal para colegios con factura CFDI y descuento institucional por volumen en kits de práctica.
      * **Ubicación Estratégica:** Se reubicó al pie de la pestaña Cursos Premium (después del catálogo de cursos maker) para priorizar los temarios de autoestudio al abrir la sección.
    * **Compilación Verificada:** Construcción de Next.js 16 con código de salida 0 y rutas estáticas pregeneradas.
* **Hito 18 (17/10/2026):**
  * **Diseño Visual de Tarjetas con Fondos Claros por Categoría de Producto y Corrección de Purga Tailwind:**
    * **Diagnóstico de Causa Raíz de Fondos Transparentes/Blancos:**
      * Se detectó que `tailwind.config.js` únicamente incluía `./src/app`, `./src/pages` y `./src/components` en su array `content`. Como las clases de tema residen en `src/lib/mrrobottoThemes.ts`, el compilador de Tailwind no las escaneaba y las purgaba del CSS final, provocando que las tarjetas se mostraran transparentes/blancas en el navegador.
      * Se agregaron `./src/lib/**/*.{js,ts,jsx,tsx,mdx}` y `./src/data/**/*.{js,ts,jsx,tsx,mdx}` a `tailwind.config.js`.
      * Para blindar el renderizado al 100% contra cualquier problema de caché o compilación CSS, `ProductCard.tsx` y `MrRobottoHomeClient.tsx` ahora aplican directamente atributos `style={{ backgroundColor: theme.bgHex, borderColor: theme.borderHex }}`.
    * **Paleta Pastel Claramente Visible por Categoría:**
      * **Kits de Robótica (Brazos, Otto, WRO, Gabinete Escualo):** Fondo rosa/cálido pastel claro (`#FFE4E8`, Rose 100) y borde `#FDA4AF` (Rose 300).
      * **Archivos 3D (.STL):** Fondo lavanda/índigo digital pastel claro (`#EDE9FE`, Violet 100) y borde `#C7D2FE` (Indigo 200).
      * **Componentes & Módulos (ESP32, sensores, servos, drivers):** Fondo menta/teal tecnológico pastel claro (`#CCFBF1`, Teal 100) y borde `#5EEAD4` (Teal 300).
    * **Reemplazo de Imágenes Rotos 404 de Unsplash:**
      * Se reemplazó la URL rota `photo-1581092335397-9583fe92d232` (HTTP 404 en Unsplash que mostraba texto alt en las tarjetas de Robot 6 GDL y STL Seguidor) por imágenes de ingeniería robótica y prototipado activas con respuesta HTTP 200 OK.
    * **Integridad de Casas Gaby Verificada:** Confirmación mediante `git status` de que ningún archivo ni configuración del módulo de Casas Gaby fue modificado.
    * **Compilación Verificada:** Compilación Next.js 16 con código de salida 0 y rutas estáticas pregeneradas.
* **Hito 19 (17/10/2026):**
  * **Diseño Visual de Tarjetas con Fondos Claros en Tutoriales de Módulos:**
    * **Asignación Cromática por Especialidad de Tutorial (`getTutorialCategoryTheme` en `src/lib/mrrobottoThemes.ts`):**
      * **Sensores & Módulos:** Tono cian pastel claro fresco (`#E0F7FA`, Cyan 100) y borde `#A5F3FC` (Cyan 200).
      * **Displays:** Tono azul cielo / sky pastel claro (`#E0F2FE`, Sky 100) y borde `#BAE6FD` (Sky 200).
      * **Motores y Actuadores:** Tono ámbar / cálido pastel suave (`#FEF3C7`, Amber 100) y borde `#FDE68A` (Amber 200).
      * **Comunicación & IoT:** Tono esmeralda / menta pastel suave (`#D1FAE5`, Emerald 100) y borde `#A7F3D0` (Emerald 200).
      * **Kits de Robótica (Calibración & Servos):** Tono rosa cálido pastel suave (`#FFE4E8`, Rose 100) y borde `#FDA4AF` (Rose 300).
    * **Blindaje en Modo Galería y Modo Lista:**
      * **Modo Galería (`TutorialCard.tsx`):** La tarjeta recibe `style={{ backgroundColor: theme.bgHex, borderColor: theme.borderHex }}` con barra inferior traslúcida y badge de alta legibilidad.
      * **Modo Lista (`MrRobottoHomeClient.tsx`):** Las filas de tutoriales adquieren el color de fondo y borde de su especialidad, chip de circuito y microcontrolador legible y botón estilizado.
    * **Compilación Verificada:** Compilación Next.js 16 con código de salida 0 y rutas estáticas pregeneradas.
* **Hito 20 (17/10/2026):**
  * **Igualación y Calibración de Luminosidad del Fondo Hero en Celulares (`MrRobottoHomeClient.tsx`):**
    * **Diagnóstico de Pantalla Móvil:** Se identificó que en pantallas OLED/AMOLED de teléfonos el hardware se apreciaba oscuro debido a la atenuación reducida previa (`opacity-70`) combinada con capas de viñeta oscuras que apagaban el hardware respecto a computadoras de escritorio.
    * **Luminosidad y Resplandor Incrementados:**
      * Opacidad base en celulares elevada a `opacity-85` (y `sm:opacity-90` en pantallas grandes).
      * Resplandor ambiental de pantalla elevado a `15%` (`bg-teal-500/15` en Arduino y `bg-red-500/15` en ESP32).
      * Viñetas laterales suavizadas de 40%-60% a 25%-40% (`from-slate-950/25 via-transparent to-slate-950/40`).
      * Gradiente vertical oscuro suavizado de 85% a 70% (`from-slate-950/70 via-slate-950/25 to-slate-900/15`).
      * Halo tipográfico central calibrado a `bg-slate-950/50` para preservar 100% la nitidez del texto.
    * **Compilación Verificada:** Compilación Next.js 16 con código de salida 0 y rutas estáticas pregeneradas.
* **Hito 21 (17/10/2026):**
  * **Corrección de Recorte y Solapamiento Inferior por BottomNav en Celulares:**
    * **Diagnóstico de Causa Raíz:** La barra de navegación inferior fija (`BottomNav.tsx`) mide `h-16` (64px) más el inset de `safe-area-pb` (alcanzando 80-90px de altura total fija en móviles). Los contenedores principales tenían un padding inferior insuficiente (`pb-5` a `pb-20`), lo que provocaba que al llegar al final de cualquier sección (Tienda, Tutoriales, Cursos Premium y Cursos DC-3) la última tarjeta, sus precios y los botones de acción quedaran solapados y tapados a la mitad por la barra inferior flotante.
    * **Ampliación Integral de Padding Inferior y Espaciador de Seguridad:**
      * En [`src/app/mrrobotto/layout.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/app/mrrobotto/layout.tsx): Aumentado a `pb-28 md:pb-8`.
      * En [`src/components/mrrobotto/MrRobottoHomeClient.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/components/mrrobotto/MrRobottoHomeClient.tsx): Aumentado a `pb-32 sm:pb-20 md:pb-12` e integrado un espaciador de seguridad `<div className="h-10 md:hidden" />` al final del flujo de pestañas.
      * En [`CoursePlayerClient.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/components/mrrobotto/CoursePlayerClient.tsx) y [`TutorialDetailClient.tsx`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/components/mrrobotto/TutorialDetailClient.tsx): Aumentado a `pb-32 sm:pb-20 md:pb-12`.
    * **Resultado Visual:** Al desplazarse al final en cualquier teléfono, la última tarjeta y todos los botones de compra/cotización concluyen holgadamente por encima de la barra de navegación, con espacio de respiración limpio.
    * **Compilación Verificada:** Compilación Next.js 16 con código de salida 0 y rutas estáticas pregeneradas.


