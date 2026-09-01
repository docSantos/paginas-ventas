import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace the logic of `getMetrics` inside ClientesClient.tsx

old_logic = r"""      let totalGenerado = 0;
      let hasUSD = false;
      const ingresos = \(c\.transacciones \|\| \[\]\)\.filter\(\(t: any\) => t\.tipo === 'ingreso'\);
  
      // Total Generado = Ingresos - Egresos \(reembolsos\)
      const egresosReembolso = \(c\.transacciones \|\| \[\]\)\.filter\(\(t: any\) => t\.tipo === 'egreso' && t\.categoria === 'reembolso'\);"""

new_logic = """      let totalGenerado = 0;
      let hasUSD = false;
      
      // Combinar transacciones directas y transacciones a través de reservas para cubrir nulos en cliente_id
      const allTransacciones = new Map();
      (c.transacciones || []).forEach((t: any) => allTransacciones.set(t.id, t));
      (c.reservas || []).forEach((r: any) => {
        (r.transacciones || []).forEach((t: any) => allTransacciones.set(t.id, t));
      });
      const deduplicatedTransacciones = Array.from(allTransacciones.values());

      const ingresos = deduplicatedTransacciones.filter((t: any) => t.tipo === 'ingreso');
  
      // Total Generado = Ingresos - Egresos (reembolsos)
      const egresosReembolso = deduplicatedTransacciones.filter((t: any) => t.tipo === 'egreso' && t.categoria === 'reembolso');"""

content = re.sub(old_logic, new_logic, content)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
