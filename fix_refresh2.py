import os

filepath = 'src/components/casasgaby/admin/ClientesClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("      router.refresh()\n", "")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed router.refresh()")
