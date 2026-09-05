import re

with open('src/app/casasgaby/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'\.select\("\*"\)'

replacement = """.select(`
        *,
        propiedad_servicios(
          disponible,
          catalogo_servicios(nombre)
        )
      `)"""

content = re.sub(pattern, replacement, content)

# Also update the way it passes props
old_prop = r"hasExtraServices=\{[^}]+\}"
# Instead of hasExtraServices, pass the array of active services
new_prop = "serviciosExtra={((propiedad as any).propiedad_servicios || []).filter((ps: any) => ps.disponible).map((ps: any) => ps.catalogo_servicios?.nombre).filter(Boolean)}"

content = re.sub(old_prop, new_prop, content)

with open('src/app/casasgaby/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
