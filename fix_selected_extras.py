import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add selectedExtras state
if "const [selectedExtras, setSelectedExtras] = useState<Record<string, any>>({})" not in content:
    content = content.replace(
        "const [huespedes, setHuespedes] = useState(1)",
        "const [huespedes, setHuespedes] = useState(1)\n  const [selectedExtras, setSelectedExtras] = useState<Record<string, any>>({})"
    )

# Fix duplicate console.log
content = content.replace("  console.log('Servicios recibidos en cliente:', servicios);\n  console.log('Servicios recibidos en cliente:', servicios);", "  console.log('Servicios recibidos en cliente:', servicios);")

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
