import sys

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "let totalGenerado = 0;" in line and "let hasUSD = false;" in lines[i+1]:
        new_lines.append("""      let totalGenerado = 0;
      let hasUSD = false;
      
      const allTransacciones = new Map();
      (c.transacciones || []).forEach((t: any) => allTransacciones.set(t.id, t));
      (c.reservas || []).forEach((r: any) => {
        (r.transacciones || []).forEach((t: any) => allTransacciones.set(t.id, t));
      });
      const deduplicatedTransacciones = Array.from(allTransacciones.values());

      const ingresos = deduplicatedTransacciones.filter((t: any) => t.tipo === 'ingreso');
  
      // Total Generado = Ingresos - Egresos (reembolsos)
      const egresosReembolso = deduplicatedTransacciones.filter((t: any) => t.tipo === 'egreso' && t.categoria === 'reembolso');\n""")
        skip = True
    elif skip and "const egresosReembolso" in line:
        skip = False
    elif not skip:
        new_lines.append(line)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
