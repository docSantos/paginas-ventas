import sys
import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find getMetrics = (c: Cliente) => { and replace the whole function
match = re.search(r"const getMetrics = \(c: Cliente\) => \{[\s\S]*?return \{\s*estancias:\s*validReservas\.length,[\s\S]*?\}\s*\}", content)

if match:
    new_func = """const getMetrics = (c: Cliente) => {
    const validReservas = (c.reservas || []).filter(r => {
      const st = (r.estado || '').toLowerCase()
      // Incluimos confirmada/completada (solicitado por usuario) y activa/archivada (valores del sistema real)
      return ['activa', 'archivada', 'confirmada', 'completada'].includes(st)
    })
    
    // Sort by fecha_entrada desc
    const sorted = [...validReservas].sort((a, b) => new Date(b.fecha_entrada).getTime() - new Date(a.fecha_entrada).getTime())
    
    let totalGenerado = 0;
    let hasUSD = false;
    
    // Consolidar todos los pagos (transacciones directas e indirectas y pagos_reservas)
    const allTransacciones = new Map();
    
    // 1. Transacciones directas del cliente
    (c.transacciones || []).forEach((t: any) => allTransacciones.set(t.id, t));
    
    // 2. Transacciones y pagos a través de reservas válidas
    validReservas.forEach((r: any) => {
      (r.transacciones || []).forEach((t: any) => allTransacciones.set(t.id, t));
      (r.pagos_reservas || []).forEach((p: any) => allTransacciones.set(p.id || Math.random().toString(), { ...p, tipo: 'ingreso' }));
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

    return {
      estancias: validReservas.length,
      ultimaEstancia: sorted.length > 0 ? sorted[0].fecha_entrada : null,
      totalGenerado,
      hasUSD
    }
  }"""
    content = content[:match.start()] + new_func + content[match.end():]

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
