import os
import re

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = "if (!['Pendiente', 'nueva', 'contactado', 'cotizado', 'anticipo_pendiente'].includes(solicitud.estado)) throw new Error('La solicitud ya fue procesada o está en una etapa inválida')"
replacement = """const etapasValidasParaConfirmar = ['por_contactar', 'en_seguimiento', 'Pendiente', 'nueva', 'contactado', 'cotizado', 'anticipo_pendiente'];
  if (!etapasValidasParaConfirmar.includes(solicitud.estado)) {
    throw new Error('La solicitud ya fue procesada o está en una etapa inválida');
  }"""

# Try direct replace first (handling unicode mismatches if any)
content = re.sub(
    r"if \(\!\['Pendiente', 'nueva', 'contactado', 'cotizado', 'anticipo_pendiente'\]\.includes\(solicitud\.estado\)\) throw new Error\('La solicitud ya fue procesada o est[áǭ] en una etapa inv[áǭ]lida'\)",
    replacement,
    content
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated actions.ts")
