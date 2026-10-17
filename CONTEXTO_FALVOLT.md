# ☕ CAFÉ FAL-VOLT — CONTEXTO MAESTRO Y BITÁCORA TÉCNICA (LOG)

Este documento es el repositorio permanente y exclusivo de la plataforma **Café FAL-VOLT**. Registra la arquitectura del sistema, catálogo, fórmulas de mercado, patrones estacionales de trading en Chiapas y el historial de decisiones tomadas.

---

## 🏗️ 1. ARQUITECTURA Y STACK TECNOLÓGICO

* **Framework:** Next.js (App Router) con TypeScript.
* **Rutas Principales:**
  * [`/falvoltcafe`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/app/falvoltcafe/page.tsx): Portada, catálogo de variedades, historia artesanal y cotizador/orden interactiva de café.
  * [`/falvoltcafe/precios`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/app/falvoltcafe/precios/page.tsx): **Ruta independiente** para el Monitor de Precios, gráfica histórica, calendario de cosecha y simulador de costos. Cuenta con botón de regreso inteligente que preserva la navegación dentro de Fal-Volt sin expulsar al usuario al Hub principal.
* **Filosofía Mobile-First & Compatibilidad:**
  * Contenedor nativo móvil centrado (`max-w-2xl mx-auto`).
  * Preparado para PWA (`appleWebApp`, `viewport-fit=cover`, `RegisterSW`).
  * Safeguards para iOS / WebKit (prevención de auto-zoom con inputs a `16px`, clases utilitarias `safe-area-pt` y `safe-area-pb` para notch/isla dinámica, y soporte de consola móvil [`ErudaProvider`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/components/ErudaProvider.tsx)).
  * Integridad UTF-8 estricta en tipografía española y acentos sin mojibake.
* **Activos:** Migrados y normalizados en [`public/falvolt/`](file:///c:/Users/PcKon/Documents/paginas-ventas/public/falvolt/) (las carpetas legadas `Chikis landig page/` están excluidas vía [`.gitignore`](file:///c:/Users/PcKon/Documents/paginas-ventas/.gitignore)).

---

## ☕ 2. MODELO DE NEGOCIO Y CATÁLOGO

* **Origen:** Sierra de Tapachula, Chiapas, México (1,200 – 1,450 msnm).
* **Variedades Estrella:**
  1. **Selección Oro (Mezcla Marago-Árabe):** Grano elefante Maragojipe + Typica Árabe. Tostado medio, acidez cítrica brillante, notas a chocolate amargo y cuerpo denso.
  2. **Tueste Profundo:** 100% Arábica de altura. Tostado intenso, notas a cacao 80%, caramelo tostado y baja acidez.
  3. **Kit Barista & Coffee Lover:** Dúo de 250g con guía de preparación para prensa, moka y filtrados.
* **Moliendas Soportadas:** En grano entero, Molido fino (Espresso/Moka), Molido medio (Drip/Chemex/V60) y Molido grueso (Prensa Francesa/Cold Brew).
* **Presentaciones Comerciales:** 250 g, 500 g y 1 kg (con precios dinámicos calculados sin hardcodeo).
* **Checkout One-Click:** Formulario interactivo que genera un pedido formateado enviado directamente vía WhatsApp al `+52 962 476 6726`.

---

## 📈 3. INTELIGENCIA DE MERCADO Y TRADING DE CAFÉ (CHIAPAS)

### A. Fórmula de Conversión Físico Tapachula
El precio pagado en mano al productor en el Soconusco y la Sierra Madre no es arbitrario; está anclado al **Contrato C de Arábica en la Bolsa de Nueva York (ICE - `KC`)**:

$$\text{Precio Físico Quintal MXN} \approx \left(\frac{\text{Bolsa NY (¢/lb)} \pm \text{Diferencial Calidad}}{100}\right) \times 100 \times (\text{Tipo de Cambio USD/MXN}) - \text{Costos/Mermas de Beneficio}$$

* **Unidades de Medida Clave:**
  * 1 Quintal de café pergamino seco = **57.5 kg** (rinde aprox. 46 kg de café oro verde trillado, factor ~80%).
  * 1 Quintal de café oro = **46 kg (100 lbs)**.
  * Merma de tueste = **17% a 19%** del peso verde.
* **Diferencial de Altura:** Para café de estricta altura y microlotes Marago de Tapachula, se añade un sobreprecio de **+$30 a +$45 USD por quintal** sobre la cotización de Nueva York.

### B. Patrones Estacionales Críticos (Trading & Cosecha)

1. **El "Pico de Diciembre" (Squeeze de Invierno y Rolado de Contrato):**
   * *Mecánica:* Vence el contrato `KCZ` en Nueva York; tostadoras del hemisferio norte cubren compras para invierno.
   * *Efecto en Tapachula:* Bodegas del ciclo anterior vacías + exportadores compitiendo por los primeros lotes de altura recién despulpados = **Precios inflados y artificialmente altos en diciembre**.
   * *Acción:* **No sobrecomprar en diciembre**; comprar solo lo indispensable para consumo del mes.

2. **El "Valle de Febrero" (Pico Bajo Máximo y Oportunidad de Oro):**
   * *Mecánica:* **Presión masiva de cosecha (*Harvest Pressure*)**. Coinciden en su pico México (Chiapas, Veracruz, Oaxaca), Guatemala, Honduras y Colombia.
   * *Efecto en Tapachula:* Patios y camas de secado a tope. Los caficultores necesitan flujo de caja semanal para pagar jornales de recolección ("la raya"), provocando sobreoferta de contado.
   * *Acción:* **Comprar entre el 70% y el 80% del volumen anual en pergamino seco (10% - 12% de humedad)**. Es el precio más bajo y el grano más fresco del año.

3. **El Segundo Valle (Agosto – Octubre):**
   * *Mecánica:* Ingreso al mercado mundial de la cosecha de **Brasil** (mayor productor mundial, cosecha mayo-agosto).
   * *Comportamiento 2025 vs 2026:*
     * En 2025 tocó fondo en **octubre** (liquidación de remanentes antes de la cosecha mexicana).
     * En 2026 tocó fondo en **agosto** (285 ¢/lb) y rebotó en septiembre/octubre (290-292 ¢/lb), formando **pisos más altos (*higher lows*)**, indicativo de fuerza compradora previa al invierno.

---

## 📝 4. REGISTRO DE DECISIONES Y CAMBIOS (CHANGELOG)

* **2026-10-16 (Sesión Inicial):**
  * Creación del módulo `/falvoltcafe` con diseño mobile-first y estética color café/ámbar.
  * Exclusión de la carpeta fuente `Chikis landig page` en `.gitignore`.
  * Implementación del cotizador y configurador de café "Comprar Café".
  * Implementación de la sección de Inteligencia de Precios con gráfica SVG pura, sin dependencias pesadas.
  * Extensión a la vista de **2 años mensuales (24 meses)** para comparar los ciclos 2024/2025 vs 2025/2026.
  * Separación del monitor de mercado a su propia ruta [`/falvoltcafe/precios`](file:///c:/Users/PcKon/Documents/paginas-ventas/src/app/falvoltcafe/precios/page.tsx) con historial del navegador desacoplado para corregir el retroceso al Hub central.
  * Creación del presente archivo maestro [`CONTEXTO_FALVOLT.md`](file:///c:/Users/PcKon/Documents/paginas-ventas/CONTEXTO_FALVOLT.md).
