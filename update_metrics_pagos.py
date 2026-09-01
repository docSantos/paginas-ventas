import sys

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "(r.transacciones || []).forEach((t: any) => allTransacciones.set(t.id, t));" in line:
        new_lines.append(line)
        new_lines.append("        (r.pagos_reservas || []).forEach((p: any) => allTransacciones.set(p.id, { ...p, tipo: 'ingreso' }));\n")
    else:
        new_lines.append(line)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
