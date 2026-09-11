import os

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "Columna Derecha: Finanzas y Botones" in line:
        # Insert a </div> right before it
        lines.insert(i-1, "                        </div>\n")
        break

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("Restored missing div closing tag")
