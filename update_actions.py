import os

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Match the old adelantarCheckIn function
old_func_pattern = r"export async function adelantarCheckIn\(reservaId: string, notasOperativas\?: string\) \{[\s\S]*?return \{ success: true \}\n\}"

new_func = """export async function adelantarCheckIn(reservaId: string, notasOperativas?: string) {
  const supabase = await createClient()
  const db = supabase as any

  // 1. Obtener datos de la reserva objetivo
  const { data: reserva, error: errReserva } = await db.schema('hospedaje').from('reservas').select('propiedad_id').eq('id', reservaId).single()
  if (errReserva || !reserva) return { success: false, error: 'Reserva no encontrada.' }

  // 2. Verificar colisión física actual en la propiedad (alguien con check-in y sin check-out)
  const { data: ocupantes, error: errOcupacion } = await db.schema('hospedaje')
    .from('reservas')
    .select('id')
    .eq('propiedad_id', reserva.propiedad_id)
    .not('check_in_real_at', 'is', null)
    .is('check_out_real_at', null)
    .neq('id', reservaId)

  if (errOcupacion) return { success: false, error: errOcupacion.message }
  if (ocupantes && ocupantes.length > 0) {
    return { success: false, error: 'No es posible adelantar el check-in: la propiedad se encuentra habitada actualmente por otro huésped.' }
  }

  // 3. Actualizar
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Cancun' }).format(new Date())
  const updatePayload: Record<string, any> = { 
    check_in_real_at: new Date().toISOString(),
    fecha_entrada: todayStr
  }
  if (notasOperativas) updatePayload.notas_operativas = notasOperativas
  
  const { error } = await db.schema('hospedaje').from('reservas').update(updatePayload).eq('id', reservaId)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/operacion')
  return { success: true }
}"""

if re.search(old_func_pattern, content):
    content = re.sub(old_func_pattern, new_func, content)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated adelantarCheckIn in actions.ts")
else:
    print("Could not find adelantarCheckIn in actions.ts")
