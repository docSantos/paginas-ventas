import re

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { Edit2, Dialog as DialogIcon } from 'lucide-react'", "import { Edit2 } from 'lucide-react'")

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
