import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace cancelarReserva
cancelar_logic = """export async function cancelarReserva(reservaId: string) {
  const supabase = await createClient()
  const db = supabase as any

  const { data: reserva, error: fetchErr } = await db
    .from('reservas')
    .select('propiedad_id')
    .eq('id', reservaId)
    .maybeSingle()

  if (fetchErr) {
    throw new Error('Error al buscar la reserva: ' + fetchErr.message);
  }
  
  if (!reserva) {
    return { success: false, message: 'La reserva no existe o ya fue eliminada.' };
  }

  // --- FASE 5: Lógica de cancelación con comisiones ---
  // Obtener la comisión asociada a esta reserva
  const { data: comision } = await db.from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
  
  if (comision) {
    const nuevoEstadoComision = Number(comision.monto_pagado) > 0 ? 'cancelada_con_saldo_a_favor' : 'cancelada'
    await db.from('comisiones').update({ estado_pago: nuevoEstadoComision }).eq('id', comision.id)
  }

  // Soft delete en reservas para no disparar CASCADE
  const { error } = await db
    .from('reservas')
    .update({ estado: 'Cancelada' })
    .eq('id', reservaId)

  if (error) throw new Error('Error al cancelar: ' + error.message)

  revalidatePath('/casasgaby/admin/reservas')
  if (reserva?.propiedad_id) {
    revalidatePath(`/casasgaby/propiedad/${reserva.propiedad_id}`)
  }
  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true }
}"""

content = re.sub(
    r"export async function cancelarReserva\(reservaId: string\) \{.*?return \{ success: true \}\n\}",
    cancelar_logic,
    content,
    flags=re.DOTALL
)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
