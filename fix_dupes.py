import sys

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace allPagos definition with deduplicated one
original_all_pagos = """const allPagos = [...(c.transacciones || []), ...validReservas.flatMap((r: any) => {
        const pagos = [];
        if (r.transacciones) pagos.push(...r.transacciones);
        if (r.pagos_reservas) pagos.push(...r.pagos_reservas);
        return pagos;
      })];"""

deduplicated_all_pagos = """const rawPagos = [...(c.transacciones || []), ...validReservas.flatMap((r: any) => {
        const pagos = [];
        if (r.transacciones) pagos.push(...r.transacciones);
        if (r.pagos_reservas) pagos.push(...r.pagos_reservas);
        return pagos;
      })];
      const allPagos = Array.from(new Map(rawPagos.map((item: any) => [item.id || `${item.reserva_id}-${item.fecha_pago}-${Math.random()}`, item])).values());"""

content = content.replace(original_all_pagos, deduplicated_all_pagos)

# Fix key in map
content = content.replace("resIngresos.map((t: any) => (", "resIngresos.map((t: any, idx: number) => (")
content = content.replace("<div key={t.id} className=\"flex justify-between text-xs py-0.5\">", "<div key={`${t.id || 'ingreso'}-${idx}`} className=\"flex justify-between text-xs py-0.5\">")

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
