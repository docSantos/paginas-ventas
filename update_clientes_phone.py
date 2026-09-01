import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import
if "PhoneInputField" not in content:
    content = content.replace("import { Input } from '@/components/ui/input'", "import { Input } from '@/components/ui/input'\nimport PhoneInputField from '@/components/PhoneInputField'")

# 2. Replace `<Input value={editTelefono}` with `<PhoneInputField value={editTelefono} onChange={setEditTelefono}`
old_input = r"<Input value=\{editTelefono\} onChange=\{e => setEditTelefono\(e\.target\.value\)\} />"
new_input = r"<PhoneInputField value={editTelefono} onChange={setEditTelefono} />"

content = re.sub(old_input, new_input, content)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
