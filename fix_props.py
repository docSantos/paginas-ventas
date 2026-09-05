import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "  adminPhone?: string\n}",
    "  adminPhone?: string\n  servicios?: any[]\n}"
)

content = content.replace(
    "adminPhone }: PropertyDetailClientProps) {",
    "adminPhone, servicios = [] }: PropertyDetailClientProps) {\n  console.log('Servicios recibidos en cliente:', servicios);"
)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
