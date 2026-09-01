import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

cancelar_reserva_new = """export async function cancelarReserva(reservaId: string) {
  try {
    const supabase = await createClient()
    const db = supabase as any

    // 1. Obtener datos de la reserva
    const { data: reserva, error: fetchErr } = await db
      .from('reservas')
      .select('propiedad_id')
      .eq('id', reservaId)
      .maybeSingle()

    if (fetchErr) throw new Error('Error al buscar la reserva: ' + fetchErr.message)
    if (!reserva) throw new Error('La reserva no existe o ya fue eliminada.')

    // 2. Lógica de cancelación con comisiones (Respetando saldo a favor y sin .catch)
    const { data: comision } = await db.from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
    if (comision) {
      const nuevoEstadoComision = Number(comision.monto_pagado) > 0 ? 'cancelada_con_saldo_a_favor' : 'cancelada'
      const { error: comErr } = await db.from('comisiones').update({ estado_pago: nuevoEstadoComision }).eq('id', comision.id)
      if (comErr) throw new Error('Error al actualizar estado de comisión: ' + comErr.message)
    }

    // 3. Actualizar estado a cancelada
    const { error: updateError } = await db
      .from('reservas')
      .update({ estado: 'cancelada' })
      .eq('id', reservaId)

    if (updateError) throw new Error(updateError.message)

    // 4. Eliminar bloqueos de fechas asociados
    await db
      .from('fechas_bloqueadas')
      .delete()
      .eq('reserva_id', reservaId)

    revalidatePath('/casasgaby/admin/reservas')
    if (reserva?.propiedad_id) {
      revalidatePath(`/casasgaby/propiedad/${reserva.propiedad_id}`)
    }
    revalidatePath('/casasgaby/admin/finanzas')
    return { success: true }
  } catch (error: any) {
    console.error('Error al cancelar reserva:', error)
    return { success: false, error: error.message || 'Error al cancelar la reserva' }
  }
}

export async function rechazarSolicitud"""

content = re.sub(
    r"export async function cancelarReserva\(reservaId: string\) \{.*?export async function rechazarSolicitud",
    cancelar_reserva_new,
    content,
    flags=re.DOTALL
)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
