# 📖 Plan de Implementación y Avance Técnico (Fase 7)

## Ecosistema Páginas IXA / Casas Gaby

Este documento registra el estatus de la arquitectura del Sistema Central y los componentes operativos desplegados hasta el Sprint 7.4.

---

## ✅ Resumen de Sprints Completados (7.1 a 7.4)

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

---

## 🚀 Próximos Pasos (Hoja de Ruta Inmediata)

### Sprint 7.5: CRM Multietapa y Contactos
1. Clasificar de manera estricta los niveles de embudo: `Lead -> Prospecto -> Cliente`.
2. Crear un panel "Directorio de Clientes" donde se aprecie el total de reservas y LTV (Life-Time Value) de cada viajero, así como un espacio para notas operativas o preferencias.

### Sprint 7.6: Reorganización del Tablero con IA y Consola Central
1. Preparar la arquitectura UI para el salto visual (Sonnet) y separar claramente las "Solicitudes Pendientes" de las "Reservas Confirmadas Futuras".
2. Habilitar la posibilidad de adelantar Check-ins (ej. para un huésped que llega un día antes y se negocia).
3. Levantar la ruta global `/central` para orquestar multinegocios.

---
*Fin del reporte del Libro Mayor y Avances F7*
