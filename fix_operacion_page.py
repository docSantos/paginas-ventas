import os

filepath = 'src/app/casasgaby/admin/operacion/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("`*, propiedades ( id, titulo ), transacciones (*)`", "`*, propiedades ( id, titulo ), transacciones (*), ajustes_reserva (*)`")
content = content.replace("const { data: reservas } = await supabase", "const { data: servicios } = await supabase.schema('hospedaje').from('catalogo_servicios').select('*').eq('tenant_id', 'casasgaby').eq('activo', true)\n\n  const { data: reservas } = await supabase")
content = content.replace("<OperacionClient reservas={reservas || []} />", "<OperacionClient reservas={reservas || []} servicios={servicios || []} />")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Operacion page.tsx")
