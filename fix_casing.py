import re

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'", "import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'")
content = content.replace("import { Button } from '@/components/ui/Button'", "import { Button } from '@/components/ui/button'")

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
