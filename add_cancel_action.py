import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_action = """
export async function cancelarReservaConReembolso(
  reservaId: string, 
  datosReembolso?: { 
    monto: number, 
    moneda: string, 
    metodo: string, 
    concepto: string,
    tipoCambio: number
  }
) {
  try {
    const supabase = await createClient()
    const db = supabase as any

    const { data: reserva, error: fetchErr } = await db
      .from('reservas')
      .select('propiedad_id, cliente_id')
      .eq('id', reservaId)
      .maybeSingle()

    if (fetchErr) throw new Error('Error al buscar la reserva: ' + fetchErr.message)
    if (!reserva) throw new Error('La reserva no existe o ya fue eliminada.')

    // 1. Manejo de comisiones
    const { data: comision } = await db.from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
    if (comision) {
      const nuevoEstadoComision = Number(comision.monto_pagado) > 0 ? 'cancelada_con_saldo_a_favor' : 'cancelada'
      const { error: comErr } = await db.from('comisiones').update({ estado_pago: nuevoEstadoComision }).eq('id', comision.id)
      if (comErr) throw new Error('Error al actualizar estado de comisin: ' + comErr.message)
    }

    // 2. Insertar transaccin de reembolso si aplica
    if (datosReembolso && datosReembolso.monto > 0) {
      const { error: transErr } = await db.from('transacciones').insert({
        tipo: 'egreso',
        categoria: 'reembolso',
        monto: datosReembolso.monto,
        moneda: datosReembolso.moneda,
        tipo_cambio: datosReembolso.tipoCambio,
        metodo_pago: datosReembolso.metodo,
        concepto: datosReembolso.concepto || 'Reembolso por cancelacin de reserva',
        reserva_id: reservaId,
        cliente_id: reserva.cliente_id,
        propiedad_id: reserva.propiedad_id,
        fecha: new Date().toISOString()
      })
      if (transErr) throw new Error('Error insertando reembolso: ' + transErr.message)
    }

    // 3. Actualizar estado y monto_reembolsado
    const updatePayload: any = { estado: 'cancelada' }
    if (datosReembolso && datosReembolso.monto > 0) {
      updatePayload.monto_reembolsado = datosReembolso.monto
    }
    
    const { error: updateError } = await db
      .from('reservas')
      .update(updatePayload)
      .eq('id', reservaId)

    if (updateError) throw new Error(updateError.message)

    // 4. Eliminar bloqueos de fechas
    await db
      .from('fechas_bloqueadas')
      .delete()
      .eq('reserva_id', reservaId)

    revalidatePath('/casasgaby/admin/reservas')
    revalidatePath('/casasgaby/admin/clientes')
    if (reserva.propiedad_id) {
      revalidatePath(`/casasgaby/propiedad/${reserva.propiedad_id}`)
    }
    revalidatePath('/casasgaby/admin/finanzas')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error al cancelar reserva con reembolso:', error)
    return { success: false, error: error.message || 'Error desconocido' }
  }
}
"""

with open('src/app/casasgaby/admin/actions.ts', 'a', encoding='utf-8') as f:
    f.write(new_action)
