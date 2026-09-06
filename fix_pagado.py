import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace 'liquidado' with 'pagado' for comisiones
content = content.replace("? 'liquidado' : 'parcial'", "? 'pagado' : 'parcial'")
content = content.replace("estadoPago === 'liquidado'", "estadoPago === 'pagado'")

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
