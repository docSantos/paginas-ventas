import re

with open('implementation_plan F7.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Add to Sprint 7.4
new_sprint_7_4 = """### Sprint 7.4: Libro Mayor Financiero Global (Ledger de Ingresos)
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
- **Resolución de Constraints Contables:** Aplicación obligatoria del string `'pagado'` para satisfacer la verificación `comisiones_estado_pago_check` y registro contable de egresos."""

old_sprint_7_4_pattern = re.compile(r'### Sprint 7\.4: Libro Mayor Financiero Global \(Ledger de Ingresos\).*?(?=\n\n---)', re.DOTALL)

content = old_sprint_7_4_pattern.sub(new_sprint_7_4, content)

with open('implementation_plan F7.md', 'w', encoding='utf-8') as f:
    f.write(content)
