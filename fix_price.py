import sys

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "+{formatPrice(t.monto_mxn)}",
    "+{formatPrice(Number(t.monto_mxn) || Number(t.monto) || 0)}"
)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
