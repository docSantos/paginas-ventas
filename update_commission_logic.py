import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_actualizar = r"const comisionBase = Math\.max\(0, tarifaBase - descuentos\) \* \(Number\(reserva\.porcentaje_comision\) / 100 \|\| 0\.025\)"
new_actualizar = "const comisionBase = tarifaBase * (Number(reserva.porcentaje_comision) / 100 || 0.025)"
content = re.sub(old_actualizar, new_actualizar, content)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
