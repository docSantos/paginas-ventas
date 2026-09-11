import os

filepath = 'src/components/casasgaby/admin/OperacionClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const nueva = res.transaccion || {", "const nueva = (res as any).transaccion || {")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed OperacionClient typescript error")
