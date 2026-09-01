import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "const resIngresos = metrics.ingresos.filter((t: any) => t.reserva_id === r.id);",
    "const resIngresos = (r.transacciones || []).filter((t: any) => t.tipo === 'ingreso');"
)

content = content.replace(
    '<div key={`${t.id || \'ingreso\'}-${idx}`} className="flex justify-between text-xs py-0.5">',
    '<div key={t.id || Math.random().toString()} className="flex justify-between text-xs py-0.5">'
)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
