import os

filepath = 'src/app/casasgaby/admin/reservas/page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """const { data: tenant } = await supabase.schema('hospedaje').from('tenants_config').select('porcentaje_comision_extras, porcentaje_comision_base').eq('id', 'casasgaby').maybeSingle() as { data: any }"""

replacement = """const { data: tenant } = await supabase.schema('hospedaje').from('tenants_config').select('porcentaje_comision_extras, porcentaje_comision_base').eq('id', 'casasgaby').maybeSingle() as { data: any }
const { data: reglaComisiones } = await supabase.schema('central').from('reglas_comisiones').select('porcentaje_base, porcentaje_extras').eq('modulo', 'hospedaje').eq('activo', true).single()"""

if target in content:
    content = content.replace(target, replacement)
    
target2 = """tenantExtras={tenant?.porcentaje_comision_extras || 5}
        tenantBase={tenant?.porcentaje_comision_base || 2.50}"""

replacement2 = """tenantExtras={reglaComisiones?.porcentaje_extras || tenant?.porcentaje_comision_extras || 5}
        tenantBase={reglaComisiones?.porcentaje_base || tenant?.porcentaje_comision_base || 2.50}"""

if target2 in content:
    content = content.replace(target2, replacement2)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("page.tsx patched")
