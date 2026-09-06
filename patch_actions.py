import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"""(notas: solicitud\.notas \|\| '',\s*estado: 'Activa'\s*\})"""

replacement = r"""notas: solicitud.notas || '',
      estado: 'Activa',
      solicitada_en: solicitud.created_at,
      confirmada_en: new Date().toISOString()
    }"""

content = re.sub(pattern, replacement, content)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
