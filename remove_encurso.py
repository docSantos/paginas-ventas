import os
import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the enCurso variable assignment
content = re.sub(r"  const enCurso = reservas\.filter\(r => r\.check_in_real_at && !r\.check_out_real_at\)\n", "", content)

# Remove the enCurso bucket UI
pattern = r"      \{\/\* ─── BUCKET 3: En Curso \/ In-House \(check-in activo\) ─── \*\/\}[\s\S]*?      \{\/\* ─── BUCKET 4: Historial \/ Concluidas ─── \*\/\}"
content = re.sub(pattern, "      {/* ─── BUCKET 4: Historial / Concluidas ─── */}", content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed enCurso from ReservasClient.tsx")
