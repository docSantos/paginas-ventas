import re

with open('implementation_plan F7.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_sprint = """### Sprint 7.5: CRM Multietapa y Contactos
- Clasificación estricta del embudo comercial:
  - **Pipeline Kanban:** Nueva pestaña "Embudo CRM / Prospectos" inyectada en `/casasgaby/admin/clientes` con vista tipo Board en Desktop y Selector Chips en Móvil.
  - **Nuevas Etapas Soportadas:** 'nueva', 'contactado', 'cotizado', 'anticipo_pendiente', 'convertida', 'descartada'.
- Actions Seguras de Conversión:
  - `cambiarEtapaSolicitud` para avance sin recarga.
  - `convertirSolicitudAReserva` enlazando hacia `aprobarSolicitud`.
- Persistencia de URL (Flicker-free): Envoltura del Directorio con `Suspense` y lazy initialization.
"""

content = content.replace("### Sprint 7.5: CRM Multietapa (Leads, Prospectos y Clientes)\n- Clasificacin estricta del embudo comercial:\n  - **Lead:** Persona que genera una solicitud de reserva (formulario web o bot) pero aǧn no ha tenido contacto directo o interaccin comercial calificada.\n  - **Prospecto:** Solicitud revisada/contactada donde hay interǸs confirmado de fechas o cotizacin en negociacin, pero aǧn no realiza el anticipo econmico.\n  - **Cliente:** Ha concretado al menos una reserva pagada/confirmada (o estancia previa registrada en el sistema).\n- Panel de gestin de contactos con mǸtricas acumuladas: total de estancias, noches pernoctadas, total gastado (LTV), cantidad de acompaantes habituales/histricos y notas de preferencias.", new_sprint)

with open('implementation_plan F7.md', 'w', encoding='utf-8') as f:
    f.write(content)
