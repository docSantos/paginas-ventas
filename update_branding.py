import re

# 1. Update Layout
with open('src/app/casasgaby/layout.tsx', 'r', encoding='utf-8') as f:
    layout = f.read()

layout = layout.replace('Casas Gaby - Renta de casas', 'Páginas IXA - Renta de casas')
layout = layout.replace('%s | Casas Gaby', '%s | Páginas IXA')
layout = layout.replace('con Casas Gaby', 'con Páginas IXA')

with open('src/app/casasgaby/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(layout)

# 2. Update Header
with open('src/components/casasgaby/Header.tsx', 'r', encoding='utf-8') as f:
    header = f.read()

header = header.replace('Casas<span className="text-teal-600">Gaby</span>', 'Páginas<span className="text-teal-600">IXA</span>')

with open('src/components/casasgaby/Header.tsx', 'w', encoding='utf-8') as f:
    f.write(header)
