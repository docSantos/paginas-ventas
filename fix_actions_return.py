import os

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "return { success: true, transaccion: nuevaTransaccion }" in line:
        lines[i] = line.replace("return { success: true, transaccion: nuevaTransaccion }", "return { success: true }")
    elif "export async function liquidarSaldoRecepcion" in line:
        # Search down for the return { success: true } inside this function
        for j in range(i, i+50):
            if "return { success: true }" in lines[j]:
                lines[j] = lines[j].replace("return { success: true }", "return { success: true, transaccion: nuevaTransaccion }")
                break

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("Fixed actions.ts")
