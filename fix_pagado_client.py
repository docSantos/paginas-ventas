import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace 'liquidado' with 'pagado' for the optimistic updates
content = content.replace("? 'liquidado' : 'parcial'", "? 'pagado' : 'parcial'")
content = content.replace("c.estado_pago === 'liquidado'", "c.estado_pago === 'pagado'")

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
