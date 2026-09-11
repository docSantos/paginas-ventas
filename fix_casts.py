import os
import re

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(".eq('referencia_id', reservaId)", ".eq('referencia_id', String(reservaId))")
content = content.replace("referencia_id: reserva.id", "referencia_id: String(reserva.id)")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated all referencia_id casts in actions.ts")
