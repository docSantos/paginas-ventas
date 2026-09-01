import sys

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "return {\n        totalGenerado: finalTotalGenerado,",
    "const ultimaEstancia = sorted.length > 0 ? sorted[0].fecha_entrada : null;\n      const ingresos = allPagos.filter((t: any) => t.tipo === 'ingreso' || !t.tipo);\n\n      return {\n        totalGenerado: finalTotalGenerado,"
)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
