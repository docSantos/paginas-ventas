import os
import re

filepath = 'src/app/api/solicitudes/route.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add revalidatePath to imports
if "revalidatePath" not in content:
    content = content.replace("import { cookies } from 'next/headers'", "import { cookies } from 'next/headers'\nimport { revalidatePath } from 'next/cache'")

# Replace estado: 'Pendiente'
content = content.replace("estado: 'Pendiente'", "estado: 'por_contactar'")

# Add revalidatePath call before return
if "revalidatePath('/casasgaby/admin/clientes')" not in content:
    content = content.replace("    return NextResponse.json({ success: true, id: solicitudId })", "    revalidatePath('/casasgaby/admin/clientes')\n    return NextResponse.json({ success: true, id: solicitudId })")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated route.ts")
