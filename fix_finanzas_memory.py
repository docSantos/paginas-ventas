import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "propiedades.forEach(prop => {",
    "propiedades.filter(p => p.activa !== false).forEach(prop => {"
)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
