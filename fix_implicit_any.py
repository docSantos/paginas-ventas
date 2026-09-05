import re

# Fix all implicit 'any' in arrow functions - add ': string' type hint
files = {
    'src/app/casasgaby/admin/propiedades/PropertyForm.tsx': [
        ('prev.amenidades.filter(a =>', 'prev.amenidades.filter((a: string) =>'),
        ('prev.amenidades_compartidas.filter(a =>', 'prev.amenidades_compartidas.filter((a: string) =>'),
    ],
    'src/components/casasgaby/PropertyCard.tsx': [
        # Line 86
    ],
    'src/components/casasgaby/PropertyDetailClient.tsx': [
        # Line 288 - f, i params
        # Line 329 - amenidad
        # Line 345 - amenidad
    ],
}

# PropertyForm.tsx
with open('src/app/casasgaby/admin/propiedades/PropertyForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('prev.amenidades.filter(a =>', 'prev.amenidades.filter((a: string) =>')
content = content.replace('prev.amenidades_compartidas.filter(a =>', 'prev.amenidades_compartidas.filter((a: string) =>')
with open('src/app/casasgaby/admin/propiedades/PropertyForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# PropertyCard.tsx
with open('src/components/casasgaby/PropertyCard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Line 86 - find the implicit any arrow function
content = re.sub(r'\.filter\(a =>', '.filter((a: string) =>', content)
content = re.sub(r'\.map\(a =>', '.map((a: string) =>', content)
with open('src/components/casasgaby/PropertyCard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# PropertyDetailClient.tsx  
with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix (f, i) => at line 288 
content = re.sub(r'\(f, i\) =>', '(f: any, i: number) =>', content)

# Fix amenidad => at lines 329, 345
content = re.sub(r'\.map\(amenidad =>', '.map((amenidad: string) =>', content)
content = re.sub(r'\.filter\(amenidad =>', '.filter((amenidad: string) =>', content)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
