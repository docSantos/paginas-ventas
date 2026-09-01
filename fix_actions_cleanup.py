import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "data: { nombre: string, email: string, telefono: string }",
    "data: { nombre_completo: string, email: string, telefono: string }"
)

content = content.replace(
    ".update({ nombre_completo: data.nombre, email: data.email.trim().toLowerCase(), telefono: data.telefono })",
    ".update({ nombre_completo: data.nombre_completo, email: data.email.trim().toLowerCase(), telefono: data.telefono })"
)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
