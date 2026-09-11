import os

filepath = 'src/app/casasgaby/admin/layout.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("comisiones[0].monto_comision !== 1475", "comisiones[0].monto_comision !== 912.50")
content = content.replace("const pComisionHospedaje = 15.00;", "const pComisionHospedaje = 2.50;")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated layout.tsx")
