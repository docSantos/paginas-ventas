import sys
import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We replace the map and filter logic with a more straightforward approach similar to the user's snippet.
old_logic_pattern = r"      const allTransacciones = new Map\(\);[\s\S]*?totalGenerado = Math\.max\(0, sumaIngresos - sumaEgresos\);\n      \} else \{\n        totalGenerado = validReservas\.reduce\(\(acc: number, r: any\) => acc \+ \(Number\(r\.monto_apartado\) \|\| 0\), 0\);\n      \}"

new_logic = """      // Consolidar todos los pagos (transacciones directas e indirectas y pagos_reservas)
      const allTransacciones = new Map();
      
      // 1. Transacciones directas del cliente
      (c.transacciones || []).forEach((t: any) => allTransacciones.set(t.id, t));
      
      // 2. Transacciones y pagos a través de reservas válidas
      validReservas.forEach((r: any) => {
        (r.transacciones || []).forEach((t: any) => allTransacciones.set(t.id, t));
        (r.pagos_reservas || []).forEach((p: any) => allTransacciones.set(p.id || Math.random(), { ...p, tipo: 'ingreso' }));
      });
      
      const deduplicatedTransacciones = Array.from(allTransacciones.values());
      const ingresos = deduplicatedTransacciones.filter((t: any) => t.tipo === 'ingreso');
      const egresosReembolso = deduplicatedTransacciones.filter((t: any) => t.tipo === 'egreso' && t.categoria === 'reembolso');
      
      if (ingresos.length > 0) {
        const sumaIngresos = ingresos.reduce((acc: number, t: any) => {
          if (t.moneda === 'USD') hasUSD = true;
          return acc + (Number(t.monto_mxn) || Number(t.monto) || 0);
        }, 0);
        const sumaEgresos = egresosReembolso.reduce((acc: number, t: any) => acc + (Number(t.monto_mxn) || Number(t.monto) || 0), 0);
        totalGenerado = Math.max(0, sumaIngresos - sumaEgresos);
      } else {
        // Fallback robusto a monto_apartado / monto_total si no hay transacciones formateadas
        totalGenerado = validReservas.reduce((acc: number, r: any) => acc + (Number(r.monto_apartado) || 0), 0);
      }
"""

content = re.sub(old_logic_pattern, new_logic, content)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
