import sys

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "return sum + (Number(pago.monto_mxn) || Number(pago.monto) || 0);\n    }, 0);",
    "return sum + (Number(pago.monto_mxn) || Number(pago.monto) || 0);\n    }, 0);\n\n    const fallbackTotal = validReservas.reduce((acc: number, r: any) => acc + (Number(r.monto_apartado) || 0), 0);\n    const finalTotalGenerado = allPagos.length > 0 ? totalGenerado : fallbackTotal;"
)

content = content.replace("totalGenerado,", "totalGenerado: finalTotalGenerado,")

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
