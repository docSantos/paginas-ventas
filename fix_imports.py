import os

filepath = 'src/components/casasgaby/admin/OperacionClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { Input } from '@/components/ui/input'", "import { Input } from '@/components/ui/input'\nimport { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added dialog imports")
