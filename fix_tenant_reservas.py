import re

with open('src/app/casasgaby/admin/reservas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    ".from('catalogo_servicios').select('*')",
    ".from('catalogo_servicios').select('*').eq('tenant_id', 'casasgaby')"
)

with open('src/app/casasgaby/admin/reservas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
