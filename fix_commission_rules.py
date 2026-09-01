import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update `agregarAjusteReserva`
# We change signature and logic inside.
# `porcentaje_comision` parameter will be removed, we will fetch tenant settings to get `porcentaje_servicios` and `porcentaje_comision_base`
old_agregar_ajuste = r"export async function agregarAjusteReserva\(reservaId: string, tipo: 'cargo' \| 'descuento', concepto: string, monto: number, porcentaje_comision: number = 0\) \{[\s\S]*?if \(comision\) \{\s*const estadoPago = Number\(comision\.monto_pagado\) >= nuevoMontoComision \? 'liquidado' : \(Number\(comision\.monto_pagado\) > 0 \? 'parcial' : 'pendiente'\)\s*await db\.from\('comisiones'\)\.update\(\{ monto_estancia: nuevoTotal, monto_comision: nuevoMontoComision, estado_pago: estadoPago \}\)\.eq\('id', comision\.id\)\s*\}\s*\}\s*revalidatePath\('/casasgaby/admin/reservas'\)\s*return \{ success: true \}\s*\}"

new_agregar_ajuste = r"""export async function agregarAjusteReserva(reservaId: string, tipo: 'cargo' | 'descuento', concepto: string, monto: number, esServicio: boolean = false) {
  if (!monto || isNaN(Number(monto)) || Number(monto) <= 0) {
    throw new Error('El monto debe ser un número positivo mayor a cero.')
  }
  
  const supabase = await createClient()
  const db = supabase as any

  // Get tenant config for commissions
  const { data: tenant } = await db.from('tenants_config').select('porcentaje_comision_base, comision_servicios_porcentaje').eq('id', 'casasgaby').maybeSingle()
  const pComisionBase = tenant?.porcentaje_comision_base ? Number(tenant.porcentaje_comision_base) : 2.50
  const pComisionServicios = tenant?.comision_servicios_porcentaje ? Number(tenant.comision_servicios_porcentaje) : 5.00

  // Determine the commission percentage for this adjustment
  let porcentaje_comision = 0;
  if (tipo === 'cargo') {
    porcentaje_comision = esServicio ? pComisionServicios : pComisionBase;
  }

  await db.from('ajustes_reserva').insert({ reserva_id: reservaId, tipo, concepto, monto, porcentaje_comision, monto_comision: (monto * porcentaje_comision) / 100 })

  const { data: reserva } = await db.from('reservas').select('tarifa_base, porcentaje_comision, ajustes_reserva(*)').eq('id', reservaId).maybeSingle()
  if (reserva) {
    const tarifaBase = Number(reserva.tarifa_base) || 0
    const cargosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo') || []
    const descuentosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'descuento') || []
    const cargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    const descuentos = descuentosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    
    const nuevoTotal = Math.max(0, tarifaBase + cargos - descuentos)
    
    // Descuentos NO reducen la comisión
    const comisionBaseCalculada = tarifaBase * (Number(reserva.porcentaje_comision) / 100 || (pComisionBase/100))
    const comisionCargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto_comision || 0), 0)
    const nuevoMontoComision = comisionBaseCalculada + comisionCargos
    
    await db.from('reservas').update({ monto_total_acordado: nuevoTotal, monto_comision: nuevoMontoComision }).eq('id', reservaId)

    const { data: comision } = await db.from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
    if (comision) {
      const estadoPago = Number(comision.monto_pagado) >= nuevoMontoComision ? 'liquidado' : (Number(comision.monto_pagado) > 0 ? 'parcial' : 'pendiente')
      await db.from('comisiones').update({ monto_estancia: nuevoTotal, monto_comision: nuevoMontoComision, estado_pago: estadoPago }).eq('id', comision.id)
    }
  }

  revalidatePath('/casasgaby/admin/reservas')
  return { success: true }
}"""

content = re.sub(old_agregar_ajuste, lambda m: new_agregar_ajuste, content)


# 2. Update `actualizarTarifaBase`
old_actualizar_tarifa = r"const comisionBase = Math\.max\(0, tarifaBase - descuentos\) \* \(Number\(reserva\.porcentaje_comision\) / 100 \|\| 0\.025\)"
new_actualizar_tarifa = "const comisionBase = tarifaBase * (Number(reserva.porcentaje_comision) / 100 || 0.025)"
content = re.sub(old_actualizar_tarifa, new_actualizar_tarifa, content)

# 3. Update `eliminarAjusteReserva`
old_eliminar_ajuste = r"const comisionBase = Math\.max\(0, tarifaBase - descuentos\) \* \(Number\(reserva\.porcentaje_comision\) / 100 \|\| 0\.025\)"
new_eliminar_ajuste = "const comisionBase = tarifaBase * (Number(reserva.porcentaje_comision) / 100 || 0.025)"
content = re.sub(old_eliminar_ajuste, new_eliminar_ajuste, content)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
