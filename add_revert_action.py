import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_action = """
export async function revertirCheckOut(reservaId: string) {
  const supabase = await createClient()
  const db = supabase as any
  const { error } = await db.schema('hospedaje').from('reservas').update({ check_out_real_at: null }).eq('id', reservaId)
  if (error) return { success: false, error: error.message }
  revalidatePath('/casasgaby/admin/operacion')
  return { success: true }
}
"""
if "export async function revertirCheckOut" not in content:
    content += new_action

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
