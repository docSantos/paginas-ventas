import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_actions = """
export async function actualizarTarifaBase(reservaId: string, tarifaBase: number) {
  if (tarifaBase <= 0) throw new Error('La tarifa base debe ser mayor a 0');
  const supabase = await createClient()
  const db = supabase as any

  const { data: reserva, error: fetchErr } = await db.from('reservas').select('*, ajustes_reserva(*)').eq('id', reservaId).maybeSingle()
  if (!reserva) throw new Error('Reserva no encontrada')

  const cargos = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo').reduce((acc: number, a: any) => acc + Number(a.monto), 0) || 0
  const descuentos = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'descuento').reduce((acc: number, a: any) => acc + Number(a.monto), 0) || 0
  
  const nuevoTotal = tarifaBase + cargos - descuentos

  await db.from('reservas').update({ tarifa_base: tarifaBase, monto_total_acordado: nuevoTotal, monto_comision: nuevoTotal * 0.025 }).eq('id', reservaId)
  
  const { data: comision } = await db.from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
  if (comision) {
    const nuevoMontoComision = nuevoTotal * 0.025
    const estadoPago = Number(comision.monto_pagado) >= nuevoMontoComision ? 'liquidado' : (Number(comision.monto_pagado) > 0 ? 'parcial' : 'pendiente')
    await db.from('comisiones').update({ monto_estancia: nuevoTotal, monto_comision: nuevoMontoComision, estado_pago: estadoPago }).eq('id', comision.id)
  }

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true }
}

export async function agregarAjusteReserva(reservaId: string, tipo: 'cargo' | 'descuento', concepto: string, monto: number) {
  if (!monto || isNaN(Number(monto)) || Number(monto) <= 0) {
    throw new Error('El monto debe ser un número positivo mayor a cero.')
  }
  const supabase = await createClient()
  const db = supabase as any

  await db.from('ajustes_reserva').insert({ reserva_id: reservaId, tipo, concepto, monto })

  const { data: reserva } = await db.from('reservas').select('tarifa_base, ajustes_reserva(*)').eq('id', reservaId).maybeSingle()
  if (reserva) {
    const tarifaBase = Number(reserva.tarifa_base) || 0
    const cargos = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo').reduce((acc: number, a: any) => acc + Number(a.monto), 0) || 0
    const descuentos = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'descuento').reduce((acc: number, a: any) => acc + Number(a.monto), 0) || 0
    
    const nuevoTotal = tarifaBase + cargos - descuentos
    await db.from('reservas').update({ monto_total_acordado: nuevoTotal, monto_comision: nuevoTotal * 0.025 }).eq('id', reservaId)

    const { data: comision } = await db.from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
    if (comision) {
      const nuevoMontoComision = nuevoTotal * 0.025
      const estadoPago = Number(comision.monto_pagado) >= nuevoMontoComision ? 'liquidado' : (Number(comision.monto_pagado) > 0 ? 'parcial' : 'pendiente')
      await db.from('comisiones').update({ monto_estancia: nuevoTotal, monto_comision: nuevoMontoComision, estado_pago: estadoPago }).eq('id', comision.id)
    }
  }

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true }
}

export async function eliminarAjusteReserva(ajusteId: string, reservaId: string) {
  const supabase = await createClient()
  const db = supabase as any

  await db.from('ajustes_reserva').delete().eq('id', ajusteId)

  const { data: reserva } = await db.from('reservas').select('tarifa_base, ajustes_reserva(*)').eq('id', reservaId).maybeSingle()
  if (reserva) {
    const tarifaBase = Number(reserva.tarifa_base) || 0
    const cargos = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo').reduce((acc: number, a: any) => acc + Number(a.monto), 0) || 0
    const descuentos = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'descuento').reduce((acc: number, a: any) => acc + Number(a.monto), 0) || 0
    
    const nuevoTotal = Math.max(0, tarifaBase + cargos - descuentos)
    await db.from('reservas').update({ monto_total_acordado: nuevoTotal, monto_comision: nuevoTotal * 0.025 }).eq('id', reservaId)

    const { data: comision } = await db.from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
    if (comision) {
      const nuevoMontoComision = nuevoTotal * 0.025
      const estadoPago = Number(comision.monto_pagado) >= nuevoMontoComision ? 'liquidado' : (Number(comision.monto_pagado) > 0 ? 'parcial' : 'pendiente')
      await db.from('comisiones').update({ monto_estancia: nuevoTotal, monto_comision: nuevoMontoComision, estado_pago: estadoPago }).eq('id', comision.id)
    }
  }

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true }
}
"""

content = content + "\n" + new_actions

# Also modify aprobarSolicitud to set tarifa_base = montoAcordado initially
content = content.replace("monto_total_acordado: montoAcordado,", "monto_total_acordado: montoAcordado,\n        tarifa_base: montoAcordado,")

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
