import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_crear = r"export async function crearServicio\(data: any\) \{[\s\S]*?return \{ success: true \}\s*\}"
new_crear = """export async function crearServicio(nombre: string, descripcion: string, precio_base: number, tipo_tarifa: string, activo: boolean = true) {
  const supabase = await createClient()
  const db = supabase as any
  
  const { data: tenant } = await db.from('tenants_config').select('comision_servicios_porcentaje').eq('id', 'casasgaby').maybeSingle()
  const pComision = tenant?.comision_servicios_porcentaje ? Number(tenant.comision_servicios_porcentaje) : 5.0
  
  const payload = {
    tenant_id: 'casasgaby',
    nombre,
    descripcion,
    precio_base,
    tipo_tarifa,
    activo,
    porcentaje_comision: pComision
  }
  
  const { error } = await db.from('catalogo_servicios').insert(payload)
  if (error) throw new Error(error.message)
  revalidatePath('/casasgaby/admin/ajustes')
  return { success: true }
}"""
content = re.sub(old_crear, new_crear, content)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
