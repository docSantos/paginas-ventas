import os
import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Nuke the BUCKET 4 block
pattern = r"      \{\/\* ─── BUCKET 4: Historial \/ Concluidas ─── \*\/\}[\s\S]*?(?=      \{\/\* Modal: |      \{\/\* MODAL |      <Dialog)"
content = re.sub(pattern, "", content)

# Remove the unused ArchiveIcon import
content = re.sub(r", ArchiveIcon", "", content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed concluidas bucket properly.")
