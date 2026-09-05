import re

with open('src/app/casasgaby/admin/finanzas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "const { data: propiedades } = await db.schema('hospedaje').from('propiedades').select('*')",
    "const { data: propiedades } = await db.schema('hospedaje').from('propiedades').select('*').eq('activa', true)"
)

with open('src/app/casasgaby/admin/finanzas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
