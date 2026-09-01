import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r"const finalTotalGenerado = allPagos\.length > 0 \? totalGenerado : fallbackTotal;\s*return \{",
    """const finalTotalGenerado = allPagos.length > 0 ? totalGenerado : fallbackTotal;
      const ultimaEstancia = sorted.length > 0 ? sorted[0].fecha_entrada : null;
      const ingresos = allPagos.filter((t: any) => t.tipo === 'ingreso' || !t.tipo);
      return {""",
    content
)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
