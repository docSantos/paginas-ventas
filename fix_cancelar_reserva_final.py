import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

cancelar_reserva_new = """export async function cancelarReserva(reservaId: string) {
  try {
    const supabase = await createClient()
    const db = supabase as any

    const { data: reserva, error: fetchErr } = await db
      .from('reservas')
      .select('propiedad_id')
      .eq('id', reservaId)
      .maybeSingle()

    if (fetchErr) {
      return { success: false, error: 'Error al buscar la reserva: ' + fetchErr.message }
    }
    
    if (!reserva) {
      return { success: false, error: 'La reserva no existe o ya fue eliminada.' }
    }

    // --- Lógica de cancelación con comisiones ---
    const { data: comision } = await db.from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
    if (comision) {
      const nuevoEstadoComision = Number(comision.monto_pagado) > 0 ? 'cancelada_con_saldo_a_favor' : 'cancelada'
      await db.from('comisiones').update({ estado_pago: nuevoEstadoComision }).eq('id', comision.id)
    }

    // Soft delete en reservas ('cancelada' minúscula para la constraint)
    const { error } = await db
      .from('reservas')
      .update({ estado: 'cancelada' })
      .eq('id', reservaId)

    if (error) return { success: false, error: 'Error al cancelar la reserva: ' + error.message }

    // Liberar fechas bloqueadas (si existe tabla independiente)
    await db.from('fechas_bloqueadas').delete().eq('reserva_id', reservaId)

    revalidatePath('/casasgaby/admin/reservas')
    if (reserva?.propiedad_id) {
      revalidatePath(`/casasgaby/propiedad/${reserva.propiedad_id}`)
    }
    revalidatePath('/casasgaby/admin/finanzas')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error desconocido al cancelar la reserva' }
  }
}"""

content = re.sub(
    r"export async function cancelarReserva\(reservaId: string\) \{.*?return \{ success: true \}\n  \}",
    cancelar_reserva_new,
    content,
    flags=re.DOTALL
)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
