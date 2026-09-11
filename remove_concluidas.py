import os
import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the concluidas variable assignment
content = re.sub(r"  const concluidas = reservas\.filter\(r => r\.check_out_real_at\)\n", "", content)

# Remove the concluidas bucket UI
pattern = r"      \{\/\* ─── BUCKET 4: Historial \/ Concluidas ─── \*\/\}[\s\S]*?      \{\/\* Modal: Cancelar Reserva \*\/\}"
content = re.sub(pattern, "      {/* Modal: Cancelar Reserva */}", content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed concluidas from ReservasClient.tsx")
