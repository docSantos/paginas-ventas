import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update metric calculation for Total Generado in ClientesClient.tsx
old_logic = """
    if (ingresos.length > 0) {
      totalGenerado = ingresos.reduce((acc: number, t: any) => {
        if (t.moneda === 'USD') hasUSD = true;
        return acc + (Number(t.monto_mxn) || 0);
      }, 0);
    } else {
      totalGenerado = validReservas.reduce((acc: number, r: any) => acc + (Number(r.monto_apartado) || 0), 0);
    }
"""

new_logic = """
    // Total Generado = Ingresos - Egresos (reembolsos)
    const egresosReembolso = (c.transacciones || []).filter((t: any) => t.tipo === 'egreso' && t.categoria === 'reembolso');
    
    if (ingresos.length > 0) {
      const sumaIngresos = ingresos.reduce((acc: number, t: any) => {
        if (t.moneda === 'USD') hasUSD = true;
        return acc + (Number(t.monto_mxn) || 0);
      }, 0);
      const sumaEgresos = egresosReembolso.reduce((acc: number, t: any) => acc + (Number(t.monto_mxn) || 0), 0);
      totalGenerado = Math.max(0, sumaIngresos - sumaEgresos);
    } else {
      totalGenerado = validReservas.reduce((acc: number, r: any) => acc + (Number(r.monto_apartado) || 0), 0);
    }
"""

content = content.replace(old_logic, new_logic)

# Show tag in the expanded history
old_tag = """<span className="capitalize px-1.5 py-0.5 bg-gray-200 rounded">{r.estado}</span>"""
new_tag = """<span className="capitalize px-1.5 py-0.5 bg-gray-200 rounded text-gray-700">{r.estado}</span>
                              {r.estado.toLowerCase() === 'cancelada' && Number(r.monto_reembolsado) > 0 && (
                                <span className="ml-2 text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">
                                  Reembolso: {formatPrice(Number(r.monto_reembolsado))}
                                </span>
                              )}"""

content = content.replace(old_tag, new_tag)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
