import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "defaultExtras[e.id] = e.cantidad || 1",
    "defaultExtras[e.id] = e.qty || e.cantidad || 1"
)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
