import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

recalc_logic_tarifa = """
  const cargosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo') || []
  const descuentosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'descuento') || []
  
  const cargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
  const descuentos = descuentosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
  
  const nuevoTotal = tarifaBase + cargos - descuentos

  const comisionBase = Math.max(0, tarifaBase - descuentos) * (Number(reserva.porcentaje_comision) / 100 || 0.025)
  const comisionCargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto_comision || 0), 0)
  const nuevoMontoComision = comisionBase + comisionCargos

  await db.from('reservas').update({ tarifa_base: tarifaBase, monto_total_acordado: nuevoTotal, monto_comision: nuevoMontoComision }).eq('id', reservaId)
"""

content = re.sub(
    r"const cargos = reserva\.ajustes_reserva\?\.filter.*?\)\.eq\('id', reservaId\)",
    recalc_logic_tarifa.strip(),
    content,
    count=1,
    flags=re.DOTALL
)

# And make sure nuevoMontoComision in the comision update uses the calculated one instead of `nuevoTotal * 0.025` for `actualizarTarifaBase`, `agregarAjusteReserva` and `eliminarAjusteReserva`.
content = content.replace("const nuevoMontoComision = nuevoTotal * 0.025", "")
content = content.replace("monto_comision: nuevoTotal * 0.025", "monto_comision: nuevoMontoComision")

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
