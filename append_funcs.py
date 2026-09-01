import re

funcs = """
export async function eliminarAjusteReserva(ajusteId: string, reservaId: string) {
  const supabase = await createClient()
  const db = supabase as any

  await db.from('ajustes_reserva').delete().eq('id', ajusteId).eq('reserva_id', reservaId)

  // Re-calculate everything
  const { data: reserva } = await db.from('reservas').select('tarifa_base, porcentaje_comision, ajustes_reserva(*)').eq('id', reservaId).maybeSingle()
  if (reserva) {
    const tarifaBase = Number(reserva.tarifa_base) || 0
    const cargosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo') || []
    const descuentosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'descuento') || []
    const cargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    const descuentos = descuentosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    
    const nuevoTotal = Math.max(0, tarifaBase + cargos - descuentos)
    
    // Descuentos NO reducen la comisión
    const comisionBaseCalculada = tarifaBase * (Number(reserva.porcentaje_comision) / 100 || 0.025)
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
}

export async function crearServicio(data: any) {
  const supabase = await createClient()
  const db = supabase as any
  
  // Blindado: Forzamos la comisión del tenant en backend
  const { data: tenant } = await db.from('tenants_config').select('comision_servicios_porcentaje').eq('id', 'casasgaby').maybeSingle()
  data.porcentaje_comision = tenant?.comision_servicios_porcentaje ? Number(tenant.comision_servicios_porcentaje) : 5.0
  data.tenant_id = 'casasgaby'
  
  const { error } = await db.from('catalogo_servicios').insert(data)
  if (error) throw new Error(error.message)
  revalidatePath('/casasgaby/admin/ajustes')
  return { success: true }
}

export async function actualizarServicio(id: string, data: any) {
  const supabase = await createClient()
  const db = supabase as any
  
  const { data: tenant } = await db.from('tenants_config').select('comision_servicios_porcentaje').eq('id', 'casasgaby').maybeSingle()
  data.porcentaje_comision = tenant?.comision_servicios_porcentaje ? Number(tenant.comision_servicios_porcentaje) : 5.0
  
  const { error } = await db.from('catalogo_servicios').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/casasgaby/admin/ajustes')
  return { success: true }
}

export async function eliminarServicio(id: string) {
  const supabase = await createClient()
  const db = supabase as any
  
  const { error } = await db.from('catalogo_servicios').update({ activo: false }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/casasgaby/admin/ajustes')
  return { success: true }
}

export async function actualizarCliente(clienteId: string, data: { nombre: string, email: string, telefono: string }) {
  try {
    const supabase = await createClient()
    const db = supabase as any

    const { error } = await db
      .from('clientes')
      .update({ nombre: data.nombre, email: data.email.trim().toLowerCase(), telefono: data.telefono })
      .eq('id', clienteId)

    if (error) throw new Error(error.message)

    revalidatePath('/casasgaby/admin/clientes')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al actualizar el cliente' }
  }
}

export async function fusionarClientes(origenId: string, destinoId: string) {
  try {
    const supabase = await createClient()
    const db = supabase as any

    // Mover reservas
    await db.from('reservas').update({ cliente_id: destinoId }).eq('cliente_id', origenId)
    // Mover transacciones
    await db.from('transacciones').update({ cliente_id: destinoId }).eq('cliente_id', origenId)

    // Recalcular métricas
    const { data: trans } = await db.from('transacciones').select('monto_mxn, tipo').eq('cliente_id', destinoId).eq('tipo', 'ingreso')
    const total = trans?.reduce((acc: number, t: any) => acc + (Number(t.monto_mxn) || 0), 0) || 0
    const { count: estancias } = await db.from('reservas').select('*', { count: 'exact', head: true }).eq('cliente_id', destinoId)

    await db.from('clientes').update({ total_generado_mxn: total, total_estancias: estancias }).eq('id', destinoId)
    
    // Eliminar origen
    await db.from('clientes').delete().eq('id', origenId)

    revalidatePath('/casasgaby/admin/clientes')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al fusionar clientes' }
  }
}
"""

with open('src/app/casasgaby/admin/actions.ts', 'a', encoding='utf-8') as f:
    f.write("\n\n" + funcs)
