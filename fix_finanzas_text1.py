import re

with open('src/app/casasgaby/admin/finanzas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace main heading
content = content.replace(
    '<h1 className="text-2xl font-bold text-gray-900">CRM / Inteligencia Financiera</h1>',
    '<h1 className="text-2xl font-bold text-gray-900">Panel Financiero Inteligente</h1>'
)

# Replace subtitle (handle encoding of 'é' just in case it's broken, so we match parts)
content = re.sub(
    r'<p className="text-gray-500">M[^t]+tricas de ingresos, saldos por cobrar y costo de oportunidad\.</p>',
    '<p className="text-gray-500">Métricas de ingresos, saldos pendientes por liquidar, costo de oportunidad y comisiones a gestores.</p>',
    content
)
# Fallback replace if regex missed due to plain text matches
content = content.replace(
    '<p className="text-gray-500">Métricas de ingresos, saldos por cobrar y costo de oportunidad.</p>',
    '<p className="text-gray-500">Métricas de ingresos, saldos pendientes por liquidar, costo de oportunidad y comisiones a gestores.</p>'
)

with open('src/app/casasgaby/admin/finanzas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
