import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace getMetrics function inside ClientesClient.tsx

old_getMetrics = r"const getMetrics = \(c: Cliente\) => \{[\s\S]*?ingresos\n      \}\n    \}"

new_getMetrics = """const getMetrics = (c: Cliente) => {
    const validReservas = (c.reservas || []).filter(r => {
      const st = (r.estado || '').toLowerCase()
      return ['activa', 'archivada', 'confirmada', 'completada'].includes(st)
    })
    
    const sorted = [...validReservas].sort((a, b) => new Date(b.fecha_entrada).getTime() - new Date(a.fecha_entrada).getTime())
    
    let hasUSD = false;

    // Calcular "Total Generado" del Cliente únicamente sobre reservas válidas
    let totalGenerado = (c.reservas || [])
      .filter((r: any) => r.estado !== 'cancelada')
      .reduce((acc: number, r: any) => {
        const ingresosReserva = (r.transacciones || [])
          .filter((t: any) => t.tipo === 'ingreso')
          .reduce((sum: number, t: any) => {
            if (t.moneda === 'USD') hasUSD = true;
            return sum + Number(t.monto_mxn || t.monto || 0);
          }, 0);
        return acc + ingresosReserva;
      }, 0);

    // Fallback if no valid income tracked but has monto_apartado
    if (totalGenerado === 0) {
      totalGenerado = validReservas.reduce((acc: number, r: any) => acc + (Number(r.monto_apartado) || 0), 0);
    }

    return {
      estancias: validReservas.length,
      ultimaEstancia: sorted.length > 0 ? sorted[0].fecha_entrada : null,
      validReservas: sorted,
      totalGenerado,
      hasUSD
    }
  }"""

content = re.sub(old_getMetrics, new_getMetrics, content)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
