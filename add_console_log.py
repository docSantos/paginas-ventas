import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "export function PropertyDetailClient({ propiedad, isDemo = false, reservas = [], adminPhone, servicios = [] }: PropertyDetailClientProps) {\n  const router = useRouter()",
    "export function PropertyDetailClient({ propiedad, isDemo = false, reservas = [], adminPhone, servicios = [] }: PropertyDetailClientProps) {\n  console.log('Servicios recibidos en cliente:', servicios);\n  const router = useRouter()"
)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
