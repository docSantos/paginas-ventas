import re

with open('src/app/casasgaby/admin/reservas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("  const { data: reservas } = await supabase", "  const { data: servicios } = await supabase.from('catalogo_servicios').select('*').eq('activo', true)\n\n  const { data: reservas } = await supabase")
content = content.replace("        reservas={reservas || []} ", "        reservas={reservas || []} \n        servicios={servicios || []}")

with open('src/app/casasgaby/admin/reservas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
