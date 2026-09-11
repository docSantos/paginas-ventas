import os

filepath = 'src/components/casasgaby/admin/FinanzasCard.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# I need to add a fallback in FinanzasCard if there are extras but no details.
# In `calcularFinanzasReserva`:
# const extrasSolicitud = Array.isArray(r.servicios_extra) 
#    ? r.servicios_extra 
#    : (Array.isArray(r.solicitudes?.servicios_extra) ? r.solicitudes.servicios_extra : [])
#
# If `subtotalExtras > 0` but `extrasSolicitud` is empty and there are no `extrasAjustes` covering the `subtotalExtras`, we should add a generic item.
# Better to do it directly in `FinanzasCard.tsx` rendering logic or `calcularFinanzasReserva`.

new_calc = """export const calcularFinanzasReserva = (r: any) => {
  const totalAcordado = Number(r.monto_total_acordado || r.costo_total || r.tarifa_base || 0)
  const sumaTransacciones = r.transacciones?.filter((t: any) => t.tipo === 'ingreso').reduce((acc: any, t: any) => acc + Number(t.monto_acreditado ?? t.monto_mxn ?? t.monto ?? 0), 0) || 0
  const totalPagado = sumaTransacciones > 0 ? sumaTransacciones : Number(r.monto_apartado || 0)
  const saldoPendiente = Math.max(0, totalAcordado - totalPagado)
  
  const tarifaBase = Number(r.tarifa_base || 0)
  const subtotalExtras = Math.max(0, totalAcordado - tarifaBase)

  const extrasSolicitud = Array.isArray(r.servicios_extra) 
    ? r.servicios_extra 
    : (Array.isArray(r.solicitudes?.servicios_extra) ? r.solicitudes.servicios_extra : [])

  const extrasAjustes = Array.isArray(r.ajustes_reserva)
    ? r.ajustes_reserva.map((a: any) => ({
        nombre: a.concepto || a.descripcion || 'Ajuste extra',
        qty: 1,
        monto: Number(a.monto || 0),
        tipo: a.tipo // cargo or descuento
      }))
    : []

  // Fallback genérico si hay extras pero no tenemos el desglose por falta de JOIN
  const montoAjustes = extrasAjustes.reduce((acc: number, a: any) => acc + (a.tipo === 'cargo' ? a.monto : -a.monto), 0)
  const montoDesglosadoSolicitud = extrasSolicitud.reduce((acc: number, e: any) => acc + Number(e.monto || e.precio || 0), 0)
  
  if (subtotalExtras > 0 && extrasSolicitud.length === 0 && Math.abs(subtotalExtras - montoAjustes) > 1) {
     extrasSolicitud.push({
         nombre: 'Paquete de servicios adicionales contratados',
         qty: 1,
         monto: subtotalExtras - montoAjustes
     })
  }

  return { totalAcordado, totalPagado, saldoPendiente, tarifaBase, subtotalExtras, extrasSolicitud, extrasAjustes }
}"""

import re
content = re.sub(r"export const calcularFinanzasReserva = \(r: any\) => \{[\s\S]*?return \{ totalAcordado, totalPagado, saldoPendiente, tarifaBase, subtotalExtras, extrasSolicitud, extrasAjustes \}\n\}", new_calc, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated FinanzasCard.tsx fallback")
