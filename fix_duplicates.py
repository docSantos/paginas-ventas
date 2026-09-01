import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# We will remove the exact block of code starting at the duplicate `export async function actualizarServicio` at the end
start_idx = content.rfind('export async function actualizarServicio')
if start_idx != -1:
    content = content[:start_idx]

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
