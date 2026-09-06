import re

# Revert Layout
with open('src/app/casasgaby/layout.tsx', 'r', encoding='utf-8') as f:
    layout = f.read()

layout = layout.replace('Páginas IXA - Renta de casas', 'Casas Gaby - Renta de casas')
layout = layout.replace('%s | Páginas IXA', '%s | Casas Gaby')
layout = layout.replace('con Páginas IXA', 'con Casas Gaby')

with open('src/app/casasgaby/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(layout)

# Revert Header
with open('src/components/casasgaby/Header.tsx', 'r', encoding='utf-8') as f:
    header = f.read()

header = header.replace('Páginas<span className="text-teal-600">IXA</span>', 'Casas<span className="text-teal-600">Gaby</span>')

with open('src/components/casasgaby/Header.tsx', 'w', encoding='utf-8') as f:
    f.write(header)
