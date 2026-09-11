import os
import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"(const comBase = tarifaBase \*) 0\.025;\s*(const comExtras = subtotalExtras \*) 0\.05;"
def replacer(m):
    return m.group(1) + " (tenantBase / 100);\n                                  " + m.group(2) + " (tenantExtras / 100);"

content = re.sub(pattern, replacer, content)

content = content.replace('Hospedaje base (2.5%):', 'Hospedaje base ({tenantBase}%):')
content = content.replace('Servicios extras (5.0%):', 'Servicios extras ({tenantExtras}%):')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ReservasClient.tsx to use props")
