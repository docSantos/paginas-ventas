import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    r"{m === \'Transferencia\' ? <ArrowRightLeft className=\"w-4 h-4 mr-2 inline\" /> : <Banknote className=\"w-4 h-4 mr-2 inline\" />} {m}",
    '{m === \'Transferencia\' ? <ArrowRightLeft className="w-4 h-4 mr-2 inline" /> : <Banknote className="w-4 h-4 mr-2 inline" />} {m}'
)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
