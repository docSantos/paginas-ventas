import re

with open('src/app/casasgaby/admin/reservas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    ".select('porcentaje_comision_extras')",
    ".select('porcentaje_comision_extras, porcentaje_comision_base')"
)
content = content.replace(
    "tenantExtras={tenant?.porcentaje_comision_extras || 5}",
    "tenantExtras={tenant?.porcentaje_comision_extras || 5}\n        tenantBase={tenant?.porcentaje_comision_base || 2.50}"
)

with open('src/app/casasgaby/admin/reservas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
