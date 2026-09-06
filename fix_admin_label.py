import re

with open('src/components/casasgaby/admin/AdminBottomNav.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("label: 'Operacin'", "label: 'Recepción'")
content = content.replace("label: 'Operacin'", "label: 'Recepción'")
content = content.replace("label: 'Operación'", "label: 'Recepción'")

with open('src/components/casasgaby/admin/AdminBottomNav.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
