import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix actualizarServicio
content = content.replace(
    "await db.from('catalogo_servicios').update(data).eq('id', id)",
    "await db.from('catalogo_servicios').update(data).eq('id', id).eq('tenant_id', 'casasgaby')"
)

# Fix eliminarServicio
content = content.replace(
    "await db.from('catalogo_servicios').delete().eq('id', id)",
    "await db.from('catalogo_servicios').delete().eq('id', id).eq('tenant_id', 'casasgaby')"
)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
