import re

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf8') as f:
    content = f.read()

target = r"export async function marcarCheckIn\(reservaId: string\) \{.*?return \{ success: true \}\n\}"

replacement = """export async function marcarCheckIn(reservaId: string) {
  const supabase = await createClient()
  const db = supabase as any

  const { data: reserva, error: fetchErr } = await db
    .schema('hospedaje')
    .from('reservas')
    .select('id, fecha_entrada, fecha_salida')
    .eq('id', reservaId)
    .single()

  if (fetchErr || !reserva) {
    return { success: false, error: 'No se encontró la reserva.' }
  }

  const entradaOrig = new Date(reserva.fecha_entrada)
  const salidaOrig = new Date(reserva.fecha_salida)
  const diffTime = salidaOrig.getTime() - entradaOrig.getTime()
  const nochesOriginales = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)))

  const ahora = new Date()
  const nuevaFechaEntradaStr = ahora.toISOString().split('T')[0]
  
  const nuevaFechaSalida = new Date(ahora)
  nuevaFechaSalida.setDate(nuevaFechaSalida.getDate() + nochesOriginales)
  const nuevaFechaSalidaStr = nuevaFechaSalida.toISOString().split('T')[0]

  const { error: updateErr } = await db
    .schema('hospedaje')
    .from('reservas')
    .update({
      check_in_real_at: ahora.toISOString(),
      fecha_entrada: nuevaFechaEntradaStr,
      fecha_salida: nuevaFechaSalidaStr
    })
    .eq('id', reservaId)

  if (updateErr) {
    return { success: false, error: updateErr.message }
  }

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/operacion')
  return { success: true }
}"""

content = re.sub(target, replacement, content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf8') as f:
    f.write(content)
print("marcarCheckIn patched!")
