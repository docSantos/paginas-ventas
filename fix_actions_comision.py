import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the block that deletes porcentaje_comision
block_to_remove = """    // Ignorar cualquier porcentaje_comision que intente mandarse desde el cliente
    if (data.porcentaje_comision !== undefined) {
      delete data.porcentaje_comision
    }"""

content = content.replace(block_to_remove, "")

# We also need to change agregarAjusteReserva to accept an optional porcentaje
# export async function agregarAjusteReserva(reservaId: string, tipo: 'cargo' | 'descuento', concepto: string, monto: number, esServicio: boolean = false)
old_agregar = "export async function agregarAjusteReserva(reservaId: string, tipo: 'cargo' | 'descuento', concepto: string, monto: number, esServicio: boolean = false) {"
new_agregar = "export async function agregarAjusteReserva(reservaId: string, tipo: 'cargo' | 'descuento', concepto: string, monto: number, esServicio: boolean = false, overrideComision?: number) {"

content = content.replace(old_agregar, new_agregar)

# Update logic inside agregarAjusteReserva
old_logic = """  let porcentaje_comision = 0;
  if (tipo === 'cargo') {
    porcentaje_comision = esServicio ? pComisionServicios : pComisionBase;
  }"""

new_logic = """  let porcentaje_comision = 0;
  if (tipo === 'cargo') {
    if (overrideComision !== undefined && overrideComision !== null) {
      porcentaje_comision = overrideComision;
    } else {
      porcentaje_comision = esServicio ? pComisionServicios : pComisionBase;
    }
  }"""

content = content.replace(old_logic, new_logic)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
