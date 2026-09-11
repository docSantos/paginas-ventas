import os
import re

filepath = 'src/components/casasgaby/admin/OperacionClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("res.transaccion || { tipo: 'ingreso'", "(res as any).transaccion || { tipo: 'ingreso'")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed TS error again")
