import sys

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("(c.reservas || []).forEach((r: any) => {", "validReservas.forEach((r: any) => {")

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
