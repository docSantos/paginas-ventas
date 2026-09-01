import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "const resIngresos = (r.transacciones || []).filter((t: any) => t.tipo === 'ingreso');",
    "const resIngresos = ((r as any).transacciones || []).filter((t: any) => t.tipo === 'ingreso');"
)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
