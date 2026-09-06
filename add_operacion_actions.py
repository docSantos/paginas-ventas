import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_actions = """
export async function marcarCheckIn(reservaId: string) {
  const supabase = await createClient()
  const db = supabase as any
  const { error } = await db.schema('hospedaje').from('reservas').update({ check_in_real_at: new Date().toISOString() }).eq('id', reservaId)
  if (error) return { success: false, error: error.message }
  revalidatePath('/casasgaby/admin/operacion')
  return { success: true }
}

export async function marcarCheckOut(reservaId: string) {
  const supabase = await createClient()
  const db = supabase as any
  const { error } = await db.schema('hospedaje').from('reservas').update({ check_out_real_at: new Date().toISOString() }).eq('id', reservaId)
  if (error) return { success: false, error: error.message }
  revalidatePath('/casasgaby/admin/operacion')
  return { success: true }
}
"""

content += new_actions

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
