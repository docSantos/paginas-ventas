import os
import re

filepath = 'src/components/casasgaby/admin/ClientesClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Locate the button for "Confirmar Reserva"
target = """            <Button 
              size="sm" 
              variant="default"
              className="w-full bg-teal-600 hover:bg-teal-700"
              onClick={() => {
                setConfirmModal({ open: true, solicitud: s })
                setConfHospedaje(s.costo_total?.toString() || '')
                setConfMetodo('Transferencia')
                setConfMoneda('MXN')
                setConfExtras({})
                setTc('')
                setConfSaving(false)
                setConfError('')
              }}
            >
              Confirmar Reserva
            </Button>"""

replacement = """            <Button 
              size="sm" 
              variant="default"
              className="w-full bg-teal-600 hover:bg-teal-700"
              onClick={() => {
                const confReserva = reservasConfirmadas.find(r => 
                  r.propiedad_id === s.propiedad_id &&
                  r.id !== s.reserva_id &&
                  r.solicitud_id !== s.id &&
                  r.fecha_entrada < s.fecha_salida &&
                  r.fecha_salida > s.fecha_entrada
                );
                
                if (confReserva) {
                  const fEntrada = new Date(s.fecha_entrada + 'T00:00:00');
                  const fSalida = new Date(s.fecha_salida + 'T00:00:00');
                  const formatter = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' });
                  alert(`No es posible confirmar la reserva: El rango de fechas seleccionado (${formatter.format(fEntrada)} - ${formatter.format(fSalida)}) ya está reservado por ${confReserva.nombre_cliente}.`);
                  return;
                }

                setConfirmModal({ open: true, solicitud: s })
                setConfHospedaje(s.costo_total?.toString() || '')
                setConfMetodo('Transferencia')
                setConfMoneda('MXN')
                setConfExtras({})
                setTc('')
                setConfSaving(false)
                setConfError('')
              }}
            >
              Confirmar Reserva
            </Button>"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated ClientesClient.tsx")
else:
    print("Could not find the target button block in ClientesClient.tsx")
