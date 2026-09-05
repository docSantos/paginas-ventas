import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove monto_mxn: equivalenteMXN, from the inserts
content = re.sub(
    r'\s*monto_mxn:\s*equivalenteMXN,',
    '',
    content
)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
