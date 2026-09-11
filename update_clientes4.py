import os
import re

filepath = 'src/components/casasgaby/admin/ClientesClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """
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

                setConfExtras(initExtras);"""

content = re.sub(r'(\s+)setConfExtras\(initExtras\);', r'\1' + replacement.replace('\n', '\n\\1').strip(), content, 1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ClientesClient.tsx regex")
