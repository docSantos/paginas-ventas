import re

# 1. Fix casasgaby.ts - update 'public' to 'hospedaje'
with open('src/types/casasgaby.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("Database['public']", "Database['hospedaje']")

with open('src/types/casasgaby.ts', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Fix ImageUploader.tsx - storage API doesn't use .schema()
with open('src/components/casasgaby/admin/ImageUploader.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(".schema('hospedaje').from('fotos-casas')", ".from('fotos-casas')")

with open('src/components/casasgaby/admin/ImageUploader.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# 3. Fix ClientesClient.tsx - Array.from( got wrongly modified
with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Revert the Array.schema('hospedaje').from( to Array.from(
content = content.replace("Array.schema('hospedaje').from(", "Array.from(")

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
