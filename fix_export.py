import os
import re

filepath = 'src/components/casasgaby/admin/OperacionClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("export const calcularFinanzasReserva = (r: any) => {", "const calcularFinanzasReserva = (r: any) => {")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed export from OperacionClient.tsx")
