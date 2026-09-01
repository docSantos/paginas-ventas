import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

servicios_actions = """
export async function crearServicio(nombre: string, descripcion: string, precio_base: number, tipo_tarifa: string, activo: boolean) {
  const supabase = await createClient()
  const db = supabase as any
  await db.from('catalogo_servicios').insert({ nombre, descripcion, precio_base, tipo_tarifa, activo })
  revalidatePath('/casasgaby/admin/ajustes')
  revalidatePath('/casasgaby/admin/reservas')
  return { success: true }
}

export async function actualizarServicio(id: string, data: any) {
  const supabase = await createClient()
  const db = supabase as any
  await db.from('catalogo_servicios').update(data).eq('id', id)
  revalidatePath('/casasgaby/admin/ajustes')
  revalidatePath('/casasgaby/admin/reservas')
  return { success: true }
}

export async function eliminarServicio(id: string) {
  const supabase = await createClient()
  const db = supabase as any
  await db.from('catalogo_servicios').delete().eq('id', id)
  revalidatePath('/casasgaby/admin/ajustes')
  revalidatePath('/casasgaby/admin/reservas')
  return { success: true }
}
"""

content = content + "\n" + servicios_actions

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
