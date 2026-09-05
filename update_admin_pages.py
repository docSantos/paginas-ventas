import re

# Update editar/page.tsx
with open('src/app/casasgaby/admin/propiedades/[id]/editar/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_logic = """
  const supabase = await createClient()
  const { data, error } = await supabase.from('propiedades').select('*').eq('id', id).single()
  
  if (error || !data) {
    notFound()
  }

  const { data: serviciosCatalogo } = await supabase.from('catalogo_servicios').select('*').eq('tenant_id', 'casasgaby').eq('activo', true)
  const { data: propiedadServicios } = await supabase.from('propiedad_servicios').select('servicio_id').eq('propiedad_id', id).eq('disponible', true)
  const activosIds = propiedadServicios ? propiedadServicios.map((ps: any) => ps.servicio_id) : []
"""
content = re.sub(
    r"const supabase = await createClient\(\)\n\s*const \{ data, error \} = await supabase.from\('propiedades'\).select\('\*'\).eq\('id', id\).single\(\)\n\s*if \(error \|\| !data\) \{\n\s*notFound\(\)\n\s*\}",
    new_logic,
    content
)

content = content.replace("<PropertyForm initialData={data} />", "<PropertyForm initialData={data} serviciosCatalogo={serviciosCatalogo || []} initialServiciosIds={activosIds} />")

with open('src/app/casasgaby/admin/propiedades/[id]/editar/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Update nueva/page.tsx
with open('src/app/casasgaby/admin/propiedades/nueva/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("export default function NuevaPropiedadPage() {", "import { createClient } from '@/lib/supabase/server'\n\nexport default async function NuevaPropiedadPage() {\n  const supabase = await createClient()\n  const { data: serviciosCatalogo } = await supabase.from('catalogo_servicios').select('*').eq('tenant_id', 'casasgaby').eq('activo', true)")
content = content.replace("<PropertyForm />", "<PropertyForm serviciosCatalogo={serviciosCatalogo || []} initialServiciosIds={[]} />")

with open('src/app/casasgaby/admin/propiedades/nueva/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
