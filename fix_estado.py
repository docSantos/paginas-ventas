import os

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(".update({ estado: 'Aprobada' })", ".update({ estado: 'confirmada' })")
content = content.replace("estado a 'convertida'", "estado a 'confirmada'")
content = content.replace(".update({ estado: 'convertida' })", ".update({ estado: 'confirmada' })")
content = content.replace("instead of 'Aprobada'", "instead of 'Aprobada'") # keep comments fine

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated estado to confirmada")
