import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Append bloquearFechas action at the end
new_actions = """
export async function bloquearFechas(propiedadId: string, fechaEntrada: string, fechaSalida: string, motivo: string) {
  const supabase = await createClient()
  const db = supabase as any

  const { error } = await db.schema('hospedaje').from('reservas').insert({
    propiedad_id: propiedadId,
    fecha_entrada: fechaEntrada,
    fecha_salida: fechaSalida,
    estado: motivo === 'mantenimiento' ? 'mantenimiento' : 'bloqueo',
    nombre_cliente: `[BLOQUEO] ${motivo}`,
    noches: Math.max(1, Math.ceil((new Date(fechaSalida).getTime() - new Date(fechaEntrada).getTime()) / (1000 * 60 * 60 * 24))),
    monto_total_acordado: 0,
    monto_apartado: 0,
    telefono: '',
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/casasgaby')
  return { success: true }
}
"""

if 'bloquearFechas' not in content:
    content = content.rstrip() + '\n' + new_actions

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
