import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace c.nombre references
content = content.replace("c.nombre?.toLowerCase()", "(c.nombre_completo || c.nombre)?.toLowerCase()")
content = content.replace("setEditNombre(c.nombre || '')", "setEditNombre(c.nombre_completo || c.nombre || '')")
content = content.replace("mergeModal.origen?.nombre || mergeModal.origen?.email", "mergeModal.origen?.nombre_completo || mergeModal.origen?.nombre || mergeModal.origen?.email")
content = content.replace("dest?.nombre || dest?.email", "dest?.nombre_completo || dest?.nombre || dest?.email")
content = content.replace("c.nombre || c.email", "c.nombre_completo || c.nombre || c.email")

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
