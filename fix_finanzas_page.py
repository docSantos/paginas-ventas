import re

with open('src/app/casasgaby/admin/finanzas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "const { data: pagos } = await db.from('pagos_reservas').select('*')",
    "const { data: pagos } = await db.from('transacciones').select('*').eq('tipo', 'ingreso')"
)

with open('src/app/casasgaby/admin/finanzas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
