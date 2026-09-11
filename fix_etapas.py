import os

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = "const etapasValidasParaConfirmar = ['por_contactar', 'en_seguimiento', 'Pendiente', 'nueva', 'contactado', 'cotizado', 'anticipo_pendiente'];"
replacement = "const etapasValidasParaConfirmar = ['por_contactar', 'en_seguimiento'];"

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated etapasValidasParaConfirmar")
else:
    print("Not found")
