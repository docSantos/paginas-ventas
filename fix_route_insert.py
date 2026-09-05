import re

with open('src/app/api/solicitudes/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

find_insert = """        noches: Number(noches),
        costo_total: Number(costo_total),
        monto_apartado: Number(monto_apartado),
        servicios_extra,
        estado: 'Pendiente'"""

replace_insert = """        noches: Number(noches),
        costo_total: Number(costo_total),
        monto_apartado: Number(monto_apartado),
        servicios_extra: servicios_extra || [],
        estado: 'Pendiente'"""

content = content.replace(find_insert, replace_insert)

with open('src/app/api/solicitudes/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)
