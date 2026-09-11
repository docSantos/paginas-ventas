import os
import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's completely nuke the Concluidas section
# It starts with {/* ─── BUCKET 4: Historial / Concluidas ─── */}
# And ends before {/* Modal: Cancelar Reserva */}
start_marker = "      {/* ─── BUCKET 4: Historial / Concluidas ─── */}"
end_marker = "      {/* Modal: Cancelar Reserva */}"

if start_marker in content and end_marker in content:
    start_index = content.find(start_marker)
    end_index = content.find(end_marker)
    content = content[:start_index] + end_marker + content[end_index + len(end_marker):]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed concluidas bucket.")
