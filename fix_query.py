import re

with open('src/app/casasgaby/admin/clientes/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    ".select('*, reservas(*, propiedades(titulo), transacciones(*), pagos_reservas(*)), transacciones(*)')",
    ".select('*, reservas(*, propiedades(titulo), transacciones(*)), transacciones(*)')"
)

with open('src/app/casasgaby/admin/clientes/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
