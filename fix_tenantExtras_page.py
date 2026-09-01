import re

with open('src/app/casasgaby/admin/reservas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("tenantExtras={tenant?.porcentaje_comision_extras || 10}", "tenantExtras={tenant?.porcentaje_comision_extras || 5}")

with open('src/app/casasgaby/admin/reservas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
