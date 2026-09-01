import re

with open('src/app/casasgaby/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "const { data: tenant } = await supabase.from('tenants_config').select('activo').eq('id', 'casasgaby').maybeSingle();",
    "const { data: tenant } = await supabase.from('tenants_config').select('activo').eq('id', 'casasgaby').maybeSingle() as { data: any };"
)

with open('src/app/casasgaby/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/app/casasgaby/admin/reservas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "const { data: tenant } = await supabase.from('tenants_config').select('porcentaje_comision_extras').eq('id', 'casasgaby').maybeSingle()",
    "const { data: tenant } = await supabase.from('tenants_config').select('porcentaje_comision_extras').eq('id', 'casasgaby').maybeSingle() as { data: any }"
)

with open('src/app/casasgaby/admin/reservas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
