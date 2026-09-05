import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { CheckCircle, XCircle, Clock", "import { CheckCircle, XCircle, Clock, AlertCircle")

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
