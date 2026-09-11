import os

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = lines[:504] + lines[526:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Removed old pagosHistory block")
