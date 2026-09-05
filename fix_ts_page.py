import re

with open('src/app/casasgaby/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = "<PropertyCard key={propiedad.id} propiedad={propiedad} hasExtraServices={propiedad.propiedad_servicios && propiedad.propiedad_servicios.length > 0} />"
replacement = "<PropertyCard key={propiedad.id} propiedad={propiedad} hasExtraServices={((propiedad as any).propiedad_servicios || []).length > 0} />"

content = content.replace(target, replacement)

with open('src/app/casasgaby/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
