import re

with open('src/app/casasgaby/admin/clientes/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Try to query both `transacciones` and `pagos_reservas` to be totally sure.
# We can just add `, pagos_reservas(*)` inside reservas.
content = content.replace(
    ".select('*, reservas(*, propiedades(titulo), transacciones(*)), transacciones(*)')",
    ".select('*, reservas(*, propiedades(titulo), transacciones(*), pagos_reservas(*)), transacciones(*)')"
)

with open('src/app/casasgaby/admin/clientes/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
