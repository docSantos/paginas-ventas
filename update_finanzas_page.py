import re

with open('src/app/casasgaby/admin/finanzas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update pagos fetch to include nested relations
old_pagos_fetch = "const { data: pagos } = await db.schema('hospedaje').from('transacciones').select('*').eq('tipo', 'ingreso')"
new_pagos_fetch = "const { data: pagos } = await db.schema('hospedaje').from('transacciones').select('*, reservas(nombre_cliente, propiedades(titulo))').eq('tipo', 'ingreso').order('created_at', { ascending: false })"
content = content.replace(old_pagos_fetch, new_pagos_fetch)

# Update the page title and description
content = content.replace("Panel Financiero Inteligente", "Libro Mayor Financiero")
content = content.replace("MǸtricas de ingresos, saldos pendientes por liquidar, costo de oportunidad y comisiones a gestores.", "Ledger de Ingresos, historial contable y métricas de recaudación.")

with open('src/app/casasgaby/admin/finanzas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
