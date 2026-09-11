import os
import re

filepath = 'src/components/casasgaby/admin/OperacionClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = r"const calcularFinanzasReserva = \(r: any\) => \{[\s\S]*?return \{ totalAcordado, totalPagado, saldoPendiente \};\s*\}"
content = re.sub(target, "", content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed duplicate in OperacionClient")
