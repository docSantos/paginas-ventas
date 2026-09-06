# Mapa3: Plan Integral de Desarrollo y Escalabilidad (Ecosistema Páginas Gaby)

Este documento establece la arquitectura completa, el estado actual de los módulos y la hoja de ruta desde los cimientos hasta la automatización con IA y producción.

---

## 🧭 Resumen de Fases del Ecosistema

- **Fase 1:** Cimientos, Stack Base y Arquitectura Multi-App (Completada)
- **Fase 2:** Front-End Público, Mobile-First y Cotizador Reactivo (Completada)
- **Fase 3:** Panel Administrativo y CRUD de Propiedades con Storage (Completada)
- **Fase 4:** Inbox de Solicitudes, Conversión a Reservas y Transacciones (Completada)
- **Fase 5:** Métricas Financieras, Costo de Oportunidad y Sanidad de Datos (Completada)
- **Fase 6:** Servicios Adicionales Híbridos, Anti-Overbooking y Migración Multi-Esquema (Completada)
- **Fase 7:** Hub Multinegocio, Operación In-House, Auditoría Financiera, CRM y Base de Consola Central (En desarrollo)
- **Fase 8:** Automatización con n8n, Agente de Ventas "Sofía" y Webhooks (Siguiente)
- **Fase 9:** SEO, Optimización de Rendimiento y Despliegue a Producción (Cierre)

---

## 📦 Fases Concluidas (1 a 6)

### Fase 1: Cimientos y Arquitectura Base
- Configuración de Next.js (App Router), TypeScript, Tailwind CSS y componentes accesibles.
- Inicialización del cliente Supabase (PostgreSQL nativo).
- Estructura base de datos inicial y bucket de Storage (`fotos-casas`).
- Preparación del repositorio para albergar módulos independientes bajo el mismo proyecto.

### Fase 2: Motor de Cotización (Front-End Público)
- Catálogo mobile-first y vista detallada por casa (`/casasgaby/propiedad/[id]`).
- Cotizador dinámico por noches, capacidad y tarifas base.
- Sticky action bar y generador de enlaces formateados hacia WhatsApp (`buildWaUrl`).

### Fase 3: Backoffice y Panel de Administración
- Rutas protegidas para administración (`/casasgaby/admin`) con Supabase Auth.
- CRUD de propiedades (alta, edición, pausa de visibilidad).
- Carga asíncrona drag & drop de fotografías de alta resolución hacia Supabase Storage.

### Fase 4: Inbox de Solicitudes y Gestión de Pagos
- Bandeja centralizada de solicitudes de prospectos.
- Modal interactivo de conversión de solicitud a reserva confirmada.
- Registro de abonos parciales, deudas y saldos pendientes por cliente y propiedad.

### Fase 5: Estabilidad, Métricas y Sanidad de Datos
- Dashboard de métricas financieras (ingresos cobrados, saldos pendientes y costo de oportunidad).
- Algoritmo de ocupación corregido a conteo estricto de noches de pernocta.
- Filtro de exclusión de propiedades inactivas para cálculo de métricas reales.
- Normalización internacional de teléfonos (E.164) y corrección de campos de cliente.

### Fase 6: Servicios Extra, Anti-Overbooking y Migración Multi-Esquema
- Catálogo de servicios adicionales en formato flexible (fijos, por día, por trayecto, por km).
- Restricciones anti-overbooking a nivel PostgreSQL (`EXCLUDE` daterange) y frontend cruzado.
- Aislamiento de base de datos en esquemas dedicados (`hospedaje`, `central`, `autolavado`, `tienda_cafe`).
- Soporte multidivisa (USD/MXN) con columna generada `monto_mxn` y modal seguro de reembolsos.

---

## 🚀 Fase 7: Hub Multinegocio, Operación In-House, Auditoría Financiera, CRM y Base Central

### Sprint 7.1: Hub Multinegocio (`localhost:3000`)
- Rediseño de la pantalla raíz con acceso a los módulos del ecosistema:
  1. Casas Gaby (Renta vacacional - Activo)
  2. Carros Gaby (Renta de autos - En preparación)
  3. FalVolt Café (Cafetería y snacks - En preparación)
  4. Bretema Servicios (Mantenimiento y servicios operativos - En preparación)
  5. EZ Elektronik (Componentes y proyectos de ingeniería - En preparación)
  6. Consola Central (Métricas y administración transversal - En preparación)

### Sprint 7.2: Infraestructura de Auditoría y Timestamps (Supabase)
- Auditoría temporal integral del ciclo de vida de la reserva:
  - `solicitada_en` (`created_at` de la solicitud original).
  - `confirmada_en` (timestamp exacto de aprobación y bloqueo).
  - `check_in_real_at` (timestamp de ingreso físico efectivo).
  - `check_out_real_at` (timestamp de entrega de llaves y salida).
- Auditoría en `hospedaje.transacciones`: timestamp exacto para anticipos, abonos, finiquitos y reembolsos.

### Sprint 7.3: Módulo Operativo "In-House" y Llegadas del Día
- Panel operativo enfocado en el día a día de recepción y anfitriones:
  - **Llegadas del Día (Arrivals):** Reservas confirmadas programadas con check-in para hoy (`fecha_entrada = CURRENT_DATE`).
  - **Huéspedes en Vivo (In-House):** Reservas con check-in realizado o activas dentro del rango (`fecha_entrada <= CURRENT_DATE` y `fecha_salida > CURRENT_DATE`).
- Acciones operativas: "Marcar Check-in", "Marcar Check-out", enlace directo a WhatsApp y visualización de saldo pendiente por liquidar en recepción.

### Sprint 7.4: Libro Mayor / Movimientos Financieros Globales
- Tabla centralizada de transacciones contables (anticipos, liquidaciones, abonos y reembolsos).
- Registro unificado de divisa nominal, tipo de cambio y total equivalente en MXN.
- Filtros por rango de fechas, propiedad y método de pago.

### Sprint 7.5: CRM Multietapa (Leads, Prospectos y Clientes)
- Clasificación estricta del embudo comercial:
  - **Lead:** Persona que genera una solicitud de reserva (formulario web o bot) pero aún no ha tenido contacto directo o interacción comercial calificada.
  - **Prospecto:** Solicitud revisada/contactada donde hay interés confirmado de fechas o cotización en negociación, pero aún no realiza el anticipo económico.
  - **Cliente:** Ha concretado al menos una reserva pagada/confirmada (o estancia previa registrada en el sistema).
- Panel de gestión de contactos con métricas acumuladas: total de estancias, noches pernoctadas, total gastado (LTV), cantidad de acompañantes habituales/históricos y notas de preferencias.

### Sprint 7.6: Reorganización del Tablero Operativo y Check-in Anticipado
- Reordenamiento del panel de reservas:
  1. Solicitudes de reserva (pendientes de confirmación).
  2. Reservas confirmadas (programadas a futuro).
- **Acción de Check-in Anticipado:** Botón "Adelantar Check-in" en reservas confirmadas para registrar llegadas previas a la fecha formal, actualizando `check_in_real_at` y moviendo la reserva de inmediato a la sección operativa In-House.

### Sprint 7.7: Cimientos de la Consola Central y Preparación para Despliegue
- Avance funcional de la pantalla de la Consola Central (`/central` o `/admin/central`):
  - Vista general del estado de los 5 negocios.
  - Conmutador de accesos rápidos y panel base de métricas transversales.
- Checklist de variables de entorno y preparación final para despliegue a producción previo a n8n.

---

## 🤖 Fase 8: Automatización con n8n, Agente "Sofía" y Webhooks

### 8.1 Configuración de Infraestructura n8n
- Montaje de webhooks para recepción y envío de datos de prospectos.
- Variables de entorno seguras para comunicación API con Supabase y Next.js.

### 8.2 Herramientas del Agente de Ventas
- Implementación de tool calls seguras para el agente:
  - `consultar_propiedades`: Lista casas activas, fotos y capacidades.
  - `verificar_disponibilidad`: Chequeo en tiempo real de colisiones en base de datos.
  - `calcular_cotizacion`: Tarifa total y anticipo requerido del 50%.
  - `registrar_solicitud`: Alta automática de prospectos calificados en `hospedaje.solicitudes`.

### 8.3 Integración Front-End (ChatWidget)
- Componente interactivo flotante en la landing pública con avatar de "Sofía".
- Manejo de estados de conversación, mensajes en streaming y confirmación visual inmediata de apartado.

---

## 🌐 Fase 9: SEO, Performance y Despliegue a Producción

### 9.1 Optimización Técnica y SEO
- Configuración de metadatos dinámicos por casa (OpenGraph, descripciones y títulos atractivos).
- Generación de `sitemap.xml` y `robots.txt` para indexación en buscadores.
- Optimización de carga de imágenes (Next/Image, formatos WebP/AVIF y lazy loading).

### 9.2 Auditoría de Seguridad y Pruebas Finales
- Verificación exhaustiva de políticas RLS (Row Level Security) en Supabase.
- Aseguramiento de aislamiento de esquemas (`hospedaje` vs `public` vs `central`).
- Pruebas móviles completas de punta a punta (reserva, pago simulado, recepción).

### 9.3 Despliegue Oficial a Producción
- Configuración de DNS y dominios productivos.
- Puesta en marcha oficial del ecosistema completo.
