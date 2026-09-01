import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Interface fix
content = content.replace("nombre: string\n  nombre_completo?: string", "nombre_completo: string")

# Fallbacks fix
content = content.replace("(c.nombre_completo || c.nombre)?.toLowerCase()", "(c.nombre_completo || '')?.toLowerCase()")
content = content.replace("setEditNombre(c.nombre_completo || c.nombre || '')", "setEditNombre(c.nombre_completo || '')")
content = content.replace("{cliente.nombre_completo || cliente.nombre || 'Huésped'}", "{cliente.nombre_completo || 'Huésped'}")
content = content.replace("mergeModal.origen?.nombre_completo || mergeModal.origen?.nombre || mergeModal.origen?.email", "mergeModal.origen?.nombre_completo || mergeModal.origen?.email")
content = content.replace("dest?.nombre_completo || dest?.nombre || dest?.email", "dest?.nombre_completo || dest?.email")
content = content.replace("c.nombre_completo || c.nombre || c.email", "c.nombre_completo || c.email")

# Update payload fix
content = content.replace("nombre: editNombre,", "nombre_completo: editNombre,")

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
