import sys

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "if (pago.moneda === 'USD') hasUSD = true;\n      return sum + (Number(pago.monto_mxn) || Number(pago.monto) || 0);",
    "if (pago.tipo && pago.tipo !== 'ingreso') return sum;\n      if (pago.moneda === 'USD') hasUSD = true;\n      return sum + (Number(pago.monto_mxn) || Number(pago.monto) || 0);"
)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
