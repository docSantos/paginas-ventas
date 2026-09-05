import re

with open('src/app/api/solicitudes/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("monto_apartado\n    } = body", "monto_apartado,\n      servicios_extra\n    } = body")

content = content.replace("monto_apartado: Number(monto_apartado),\n        estado: 'Pendiente'", "monto_apartado: Number(monto_apartado),\n        servicios_extra,\n        estado: 'Pendiente'")

content = content.replace("monto_apartado,\n            timestamp", "monto_apartado,\n            servicios_extra,\n            timestamp")

with open('src/app/api/solicitudes/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)
