import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace getMetrics logic to ensure fallback to t.monto
# Currently we have `return acc + (Number(t.monto_mxn) || 0);`
content = content.replace("Number(t.monto_mxn) || 0", "(Number(t.monto_mxn) || Number(t.monto) || 0)")

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
