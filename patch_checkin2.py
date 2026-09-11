import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf8') as f:
    content = f.read()

import_target = "import { aprobarSolicitud, rechazarSolicitud, registrarAbono, registrarComisionPagada, actualizarFechasReserva, cancelarReserva, cancelarReservaConReembolso, actualizarTarifaBase, agregarAjusteReserva, eliminarAjusteReserva } from '@/app/casasgaby/admin/actions'"
import_replacement = "import { aprobarSolicitud, rechazarSolicitud, registrarAbono, registrarComisionPagada, actualizarFechasReserva, cancelarReserva, cancelarReservaConReembolso, actualizarTarifaBase, agregarAjusteReserva, eliminarAjusteReserva, marcarCheckIn } from '@/app/casasgaby/admin/actions'"
if import_target in content:
    content = content.replace(import_target, import_replacement)

target = r'(<Button\s+size="sm"\s+variant="outline"\s+className="text-red-600 border-red-200 hover:bg-red-50 ml-auto"\s+onClick=\{\(\) => \{)'
replacement = r'''{(r.estado === 'Activa' && !r.check_in_real_at) && (
                                <Button className="text-emerald-700 border-emerald-200 hover:bg-emerald-50" onClick={async () => {
                                    if (confirm(`¿Marcar Check-in de ${r.nombre_cliente}? La reserva pasará al módulo In-House.`)) {
                                      const res = await marcarCheckIn(r.id);
                                      if (res && res.error) {
                                        alert(res.error);
                                      }
                                    }
                                  }}
                                  size="sm" variant="outline"
                                >
                                  Check-in
                                </Button>
                              )}
                              \1'''

content = re.sub(target, replacement, content)

with open(filepath, 'w', encoding='utf8') as f:
    f.write(content)
print("Button patched!")
