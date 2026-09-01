import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace crearServicio
old_crear = r"export async function crearServicio\(nombre: string, descripcion: string, precio_base: number, tipo_tarifa: string, activo: boolean, porcentaje_comision: number = 5\) \{(.*?)\} \}\n"
new_crear = """export async function crearServicio(nombre: string, descripcion: string, precio_base: number, tipo_tarifa: string, activo: boolean) {
  if (precio_base < 0) throw new Error('El precio base no puede ser negativo')
  const supabase = await createClient()
  const db = supabase as any
  
  const { data: tenant } = await db.from('tenants_config').select('porcentaje_comision_extras').eq('id', 'casasgaby').maybeSingle()
  const comision = tenant?.porcentaje_comision_extras || 5
  
  await db.from('catalogo_servicios').insert({ nombre, descripcion, precio_base, tipo_tarifa, activo, porcentaje_comision: comision })
  revalidatePath('/casasgaby/admin/ajustes')
  revalidatePath('/casasgaby/admin/reservas')
  return { success: true }
}
"""

# Regex matching for old_crear is tricky because of the inside block. Let's just do a manual string replacement.
start_crear = content.find("export async function crearServicio")
end_crear = content.find("export async function actualizarServicio")

if start_crear != -1 and end_crear != -1:
    content = content[:start_crear] + new_crear + "\n" + content[end_crear:]

# Now replace actualizarServicio
old_act = r"export async function actualizarServicio\(id: string, data: any\) \{.*?return \{ success: true \}\s*\}"
new_act = """export async function actualizarServicio(id: string, data: any) {
  if (data.precio_base !== undefined && data.precio_base < 0) throw new Error('El precio base no puede ser negativo')
  
  // Ignorar cualquier porcentaje_comision que intente mandarse desde el cliente
  if (data.porcentaje_comision !== undefined) {
    delete data.porcentaje_comision
  }
  
  const supabase = await createClient()
  const db = supabase as any
  await db.from('catalogo_servicios').update(data).eq('id', id)
  revalidatePath('/casasgaby/admin/ajustes')
  revalidatePath('/casasgaby/admin/reservas')
  return { success: true }
}"""

content = re.sub(old_act, new_act, content, flags=re.DOTALL)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
