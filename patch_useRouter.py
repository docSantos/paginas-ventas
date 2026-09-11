import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf8') as f:
    content = f.read()

target = "import { useState, useEffect } from 'react'"
replacement = "import { useState, useEffect } from 'react'\nimport { useRouter } from 'next/navigation'"

if "import { useRouter }" not in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf8') as f:
        f.write(content)
    print("Patched useRouter")
else:
    print("Already present")
