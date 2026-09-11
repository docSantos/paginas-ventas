# 📖 Plan de Implementación y Avance Técnico (Fase 7)

## Ecosistema Páginas IXA / Casas Gaby

Este documento registra el estatus de la arquitectura del Sistema Central y los componentes operativos desplegados hasta el Sprint 7.5.

---

## ✅ Resumen de Sprints Completados (7.1 a 7.5)

### Sprint 7.1: Reestructuración de Base de Datos y Tipos
- Transición a Supabase completada exitosamente.
- Mapeo de tipos generados automáticamente (`database.types.ts`).
- Corrección de cascadas y triggers de cálculo para las comisiones y transacciones.

### Sprint 7.2: Infraestructura de Auditoría y Timestamps
- Integración de columnas obligatorias para control de ciclos de vida de hospedaje:
  - `solicitada_en`, `confirmada_en`, `check_in_real_at`, `check_out_real_at`.
- Endpoints (Server Actions) actualizados para marcar con precisión milimétrica la entrada y salida de los huéspedes, lo cual permite calcular el costo de oportunidad.

### Sprint 7.3: Módulo Operativo "In-House" (Recepción)
- **Panel de control de llaves y caja en tiempo real.**
- **Bandejas separadas:** Llegadas del Día, Huéspedes In-House y Salidas Recientes.
- **Cobro Multidivisa Estricto:** Modal de liquidación que acepta ingresos en MXN/USD con conversión a `.toFixed(2)` en estado optimista para eludir micro-fracciones de conversión.
- **Bloqueo Financiero:** Un huésped no puede abandonar la casa si su `saldo > 0.5`.
- **Ajuste de Estancia Anticipado:** Recálculo avanzado que **aísla las noches consumidas de los servicios fijos extras**, garantizando que no haya pérdidas de dinero al cancelar noches restantes.
- **Auditoría e Historial In-Situ:** Clic en "Todo Pagado" arroja el historial transaccional para consulta rápida.
- **Reversión Anti-Errores:** Posibilidad de anular check-outs accidentales de inmediato.

### Sprint 7.4: Libro Mayor Financiero Global (Ledger de Ingresos)
- Refactorización absoluta de `/casasgaby/admin/finanzas/page.tsx` para admitir una arquitectura por pestañas (Tabs).
- Pestaña primaria establecida como **Libro Mayor**.
- **Motor de KPIs:** Tarjetas de reporte instantáneas con suma total histórica, mes actual, divisas extrajeras captadas (USD) y la proporción Efectivo vs Transferencia.
- **Tabla Cronológica de Auditoría:** Carga e hidrata todas las transacciones `tipo='ingreso'` haciendo *JOIN* en Supabase a `reservas` (para saber el huésped) y `propiedades` (origen del ingreso).
- **Filtros Combinados:** 
  - Búsqueda por nombre de cliente/referencia.
  - Selección de método de pago.
  - Intervalos de tiempo (Mes actual, mes anterior, histórico).
- **Liquidación Masiva de Comisiones (Bulk Payout):** Implementación de la selección múltiple con *Sticky Bar* altamente responsiva para liquidar gestores en lote, evadiendo solapamientos en UI.
- **Sincronización Inteligente de Rutas:** Conservación del estado visual de pestañas vía `searchParams` y enrutador de Next.js, envuelto en `<Suspense>`, eliminando parpadeos (flickers) al recargar con F5.
- **Resolución de Constraints Contables:** Aplicación obligatoria del string `'pagado'` para satisfacer la verificación `comisiones_estado_pago_check` y registro contable de egresos.

### Sprint 7.5: Refactor CRM Ágil, Desacople de Solicitudes y Modal Financiero [COMPLETADO]
- **Separación de responsabilidades:** CRM gestiona prospectos (`hospedaje.solicitudes`) y Reservas gestiona estancias confirmadas y bloqueos operativos.
- **Embudo ágil de 3 etapas en CRM:** Por Contactar, En Seguimiento y Cerradas (Confirmada / Descartada) con migración del CHECK constraint en PostgreSQL (`solicitudes_estado_check`).
- **Algoritmo de detección de colisiones de inventario hotelero:** Validación estricta léxica `YYYY-MM-DD` (check-out 11:00 AM vs check-in 3:00 PM sin falsos positivos).
- **Modal de Confirmación atómico:** Soporte estricto de Efectivo / Transferencia, conversión reactiva MXN / USD (TC por defecto 16.00), edición del subtotal de hospedaje y catálogo interactivo de servicios extra con desglose de cantidades, trayectos y subtotales en tiempo real.
- **Optimización visual de UI:** Remoción de barras de scroll dobles y componentes limpios de banderas e íconos Lucide nativos.

---

## 🚀 Sprint Activo

### Sprint 7.6: Reorganización del Tablero Operativo y Check-in Anticipado [EN PROGRESO]

**Estatus:** En ejecución activa.

**Objetivos y Alcance:**
- **Limpieza final de `ReservasClient.tsx`:** Remoción de toda referencia a bandejas de solicitudes (delegadas 100% al CRM). La vista de Reservas es exclusiva de estancias confirmadas.
- **Tablero segmentado en 4 bandejas:**
  1. 🕐 **Llegadas de Hoy** — Reservas cuya `fecha_entrada <= hoy` sin `check_in_real_at` registrado. Expone el botón **"Adelantar Check-in"** de forma prominente.
  2. 🏠 **Próximas Llegadas** — Reservas futuras confirmadas (`fecha_entrada > hoy`, sin check-in). Botón "Adelantar Check-in" disponible en el detalle expandible.
  3. ✅ **En Curso / In-House** — Reservas con `check_in_real_at` activo y sin `check_out_real_at`. Muestra badge "In-House" y enlace al panel Operativo.
  4. 🗄️ **Historial / Concluidas** — Reservas con `check_out_real_at` registrado (visibilidad de auditoría).
- **Acción Operativa "Adelantar Check-in":**
  - Modal de confirmación ágil con campo de notas operativas opcionales (ej. cuota de early check-in).
  - Server Action `adelantarCheckIn(reservaId, notas?)` que escribe `check_in_real_at = NOW()` y revalida `/casasgaby/admin/reservas` y `/casasgaby/admin/operacion`.
  - La reserva aparece de inmediato en la sección In-House del panel Operativo.
- **Query del Server Component actualizada:** Incluye estados `'Activa'`, `'confirmada'` y `'Confirmada'` para máxima cobertura de datos reales.

---
*Fin del reporte del Libro Mayor y Avances F7*
