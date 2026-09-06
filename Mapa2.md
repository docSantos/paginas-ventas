# Mapa del Proyecto: "Páginas Ventas" (Casas Gaby)
**Estado Actual: Módulo de Hospedaje Estabilizado y Listo para Escalar**

Este documento es un mapa cronológico y técnico de todo lo que hemos construido en el proyecto desde su concepción.

---

## 🏗️ Fase 1: Cimientos y Arquitectura Base
- **Stack Tecnológico:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui.
- **Base de Datos:** Integración con Supabase (PostgreSQL nativo).
- **Esquema de Base de Datos:** Creación de las tablas principales (`propiedades`, `solicitudes`, `reservas`) y un bucket de Storage (`fotos-casas`).
- **Arquitectura Multi-App:** Preparación de la estructura del repositorio para albergar futuras aplicaciones (`/gabycarros`, `/electronica`) compartiendo un solo backend y sistema de diseño.

## 📱 Fase 2: Motor de Cotización (Front-End Público)
- **UI Mobile-First:** Desarrollo del catálogo de propiedades y la vista de detalle de cada casa (`/casasgaby/propiedad/[id]`) con galerías táctiles.
- **Cotizador Dinámico:** Algoritmo reactivo que calcula precios basados en el número de noches, topes de ocupación y tarifas base.
- **Flujo de Conversión:** Sticky Bottom Bar con el "Call to Action" y construcción de enlaces nativos de WhatsApp (`buildWaUrl`) formateados para cerrar la venta directamente en el chat.

## 🛠️ Fase 3: Backoffice y Panel de Administración
- **Seguridad:** Implementación de Supabase Auth para proteger las rutas privadas `/casasgaby/admin`.
- **Gestor de Propiedades (CRUD):** Formularios dinámicos para dar de alta, editar y pausar casas en el catálogo.
- **Gestión Multimedia:** Sistema "Drag & Drop" para la subida asíncrona de imágenes de alta resolución conectada a Supabase Storage.

## 📥 Fase 4: Inbox de Solicitudes y Gestión de Pagos
- **Inbox Centralizado:** Panel de solicitudes pendientes enviadas por visitantes o mediante agentes/bots.
- **Conversión de Solicitud a Reserva:** Modal interactivo para aprobar cotizaciones al vuelo.
- **Gestor de Transacciones:** Tabla de transacciones financieras para registrar abonos parciales, métodos de pago, cálculo de deudas y saldos pendientes por propiedad y por cliente.

## 📈 Fase 5: Estabilidad, Métricas y Sanidad de Datos
- **Métricas Financieras:** Desarrollo del Dashboard de Finanzas (`/casasgaby/admin/finanzas`) con cálculos complejos como Ingresos Cobrados, Saldos Pendientes y **Costo de Oportunidad** (Dinero no generado por noches libres).
- **Depuración Métrica:** Aislamiento de propiedades inactivas para asegurar una ocupación reportada con 100% de precisión y el cambio del algoritmo a conteo por "noches" (evitando solapamientos de check-out).
- **Sanitización Global:** Limpieza profunda del código (reemplazo de `nombre` por `nombre_completo`), normalización E.164 de números telefónicos internacionales y mitigación del "scroll-lock" de Next.js al abrir ventanas nuevas.

## 🛒 Fase 6: Servicios Extra y Anti-Overbooking
- **Catálogo de Servicios Híbridos:** Almacenamiento en `JSONB` que soporta servicios adicionales configurables:
  - Fijos, Por Día, Por Trayecto y Por Kilómetro.
- **UX Reactiva:** Reemplazo de la redirección forzada al formulario por una "Tarjeta de Éxito" (Success Banner) con botón de reinicio para permitir nuevas cotizaciones inmediatas.
- **Defensa Anti-Overbooking:**
  - *Front-End:* Detección visual cruzada (Peer-to-Peer) entre solicitudes en memoria que compiten por las mismas fechas, marcándolas en rojo.
  - *Back-End:* Implementación de restricciones `EXCLUDE` (daterange) en PostgreSQL y validación estricta de cruce temporal al aprobar reservas.

## 🌍 Migración Multi-Esquema (Escalabilidad Final)
- **Aislamiento de Negocios:** Movimiento masivo de las tablas del esquema `public` hacia un esquema dedicado `hospedaje`.
- **Esquemas Preparados:** Creación en base de datos de los esquemas `autolavado`, `tienda_cafe` y `central`.
- **Refactorización Multi-Divisa (MXN/USD):** Delegación de la columna `monto_mxn` a Postgres (`GENERATED ALWAYS`) para auto-calcular montos exactos en base al tipo de cambio interbancario configurado al aprobar abonos.
- **UX de Cancelación Segura:** Rediseño del modal de reembolsos para enfatizar visualmente la cantidad de salida y prevenir errores operativos (botones ámbar y cálculos automatizados).

---
*Fin del Módulo 1 (Casas Gaby). Listo para abordar las siguientes verticales del ecosistema.*
