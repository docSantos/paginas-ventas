import os

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("porcentaje_comision: 2.50,", "porcentaje_comision: pComision,")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated percentage in actions")
