import re

with open('implementation_plan F7.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Sprint 7.5 content with the requested wording
old_75 = """### Sprint 7.5: CRM Multietapa y Pipeline de Conversión
- **Embudo CRM Ágil:** Pipeline visual dividido en 3 etapas ('Por Contactar', 'En Seguimiento' y 'Cerradas'), con persistencia sincronizada vía Supabase.
- **Directorio de Huéspedes:** Pestaña sincronizada en URL sin parpadeos, que consolida el LTV (Lifetime Value) e historial transaccional de cada cliente.
- **Desacople de Solicitudes:** Las cotizaciones y solicitudes de la web ya no saturan la vista principal de 'Reservas', manteniendo la operación in-house limpia.
- **Modal de Confirmación Interactivo y Financiero:**
  - **Selector de Moneda SVG:** Uso de banderas vectorizadas impecables (compatibles con Windows).
  - **Conversión de Divisas Dinámica:** Recálculo exacto del anticipo requerido a la tasa de cambio ingresada en el momento.
  - **Servicios Extras Flexibles (Acordeón):** El modal importa el catálogo de `hospedaje.catalogo_servicios`, hace match automático con lo pre-cotizado por el cliente web y permite agregar de forma reactiva más días/trayectos (calculando montos precisos al vuelo en formato acordeón fluido, libre de scrollbars nativos molestos).
- **Prevención de Overbooking:** Motor de detección léxica cruzada `YYYY-MM-DD` que alerta visualmente en rojo (Fechas ya no disponibles) cuando las fechas solicitadas por un prospecto solapan estricta y temporalmente con una reserva confirmada activa.
- **Migración de Postgres Constraint:** Liberación de `solicitudes_estado_check` en la base de datos maestra para permitir los nuevos estados de negocio sin colisiones internas en Postgres."""

new_75 = """### Sprint 7.5: Refactor CRM Ágil, Desacople de Solicitudes y Modal Financiero [COMPLETADO]
- **Separación de responsabilidades:** CRM gestiona prospectos (`hospedaje.solicitudes`) y Reservas gestiona estancias confirmadas y bloqueos operativos.
- **Embudo ágil de 3 etapas en CRM:** Por Contactar, En Seguimiento y Cerradas (Confirmada / Descartada) con migración del CHECK constraint en PostgreSQL (`solicitudes_estado_check`).
- **Algoritmo de detección de colisiones de inventario hotelero:** Validación estricta léxica `YYYY-MM-DD` (check-out 11:00 AM vs check-in 3:00 PM sin falsos positivos).
- **Modal de Confirmación atómico:** Soporte estricto de Efectivo / Transferencia, conversión reactiva MXN / USD (TC por defecto 16.00), edición del subtotal de hospedaje y catálogo interactivo de servicios extra con desglose de cantidades, trayectos y subtotales en tiempo real.
- **Optimización visual de UI:** Remoción de barras de scroll dobles y componentes limpios de banderas e íconos Lucide nativos."""

content = content.replace(old_75, new_75)

# Failsafe using regex if exact match fails due to encoding
content = re.sub(
    r'### Sprint 7\.5: CRM Multietapa y Pipeline de Conversi.*?Migraci.*?Postgres\.',
    new_75,
    content,
    flags=re.DOTALL
)

with open('implementation_plan F7.md', 'w', encoding='utf-8') as f:
    f.write(content)
