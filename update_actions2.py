import os
import re

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_func_pattern = r"export async function adelantarCheckIn\(reservaId: string, notasOperativas\?: string\) \{[\s\S]*?revalidatePath\('/casasgaby/admin/operacion'\)\n  return \{ success: true \}\n\}"

new_func = """export async function adelantarCheckIn(reservaId: string, notasOperativas?: string) {
  const supabase = await createClient()
  const db = supabase as any

  // 1. Obtener datos de la reserva objetivo
  const { data: reserva, error: errReserva } = await db.schema('hospedaje')
    .from('reservas')
    .select('propiedad_id, fecha_entrada, fecha_salida, propiedades(titulo)')
    .eq('id', reservaId)
    .single()
    
  if (errReserva || !reserva) return { success: false, error: 'Reserva no encontrada.' }

  const propiedadTitulo = reserva.propiedades?.titulo || 'La propiedad'

  // 2. Verificar colisión física actual en la propiedad (alguien con check-in y sin check-out)
  const { data: ocupantes, error: errOcupacion } = await db.schema('hospedaje')
    .from('reservas')
    .select('id, nombre_cliente')
    .eq('propiedad_id', reserva.propiedad_id)
    .not('check_in_real_at', 'is', null)
    .is('check_out_real_at', null)
    .neq('id', reservaId)

  if (errOcupacion) return { success: false, error: errOcupacion.message }
  if (ocupantes && ocupantes.length > 0) {
    const nombreOcupante = ocupantes[0].nombre_cliente || 'otro huésped'
    return { 
      success: false, 
      error: `Operación bloqueada: ${propiedadTitulo} se encuentra habitada actualmente por ${nombreOcupante}. Debe realizarse el check-out previo antes de ingresar un nuevo huésped.` 
    }
  }

  // 3. Calcular nueva fecha de salida preservando noches
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Cancun' }).format(new Date())
  
  // Calculate nights originally booked
  const fechaIn = new Date(reserva.fecha_entrada + 'T00:00:00')
  const fechaOut = new Date(reserva.fecha_salida + 'T00:00:00')
  const noches = Math.round((fechaOut.getTime() - fechaIn.getTime()) / (1000 * 60 * 60 * 24))
  
  // Calculate new exit date based on today
  const newFechaOut = new Date(new Date(todayStr + 'T00:00:00').getTime() + (noches * 24 * 60 * 60 * 1000))
  const newFechaOutStr = newFechaOut.toISOString().split('T')[0]

  // 4. Actualizar reserva
  const updatePayload: Record<string, any> = { 
    check_in_real_at: new Date().toISOString(),
    fecha_entrada: todayStr,
    fecha_salida: newFechaOutStr
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
    print("Pattern not found!")
