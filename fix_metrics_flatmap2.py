import sys

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find("let totalGenerado = 0;")
end = content.find("return {", start)

if start != -1 and end != -1:
    new_block = """let hasUSD = false;
    const allPagos = validReservas.flatMap((r: any) => {
      const pagos = [];
      if (r.transacciones) pagos.push(...r.transacciones);
      if (r.pagos_reservas) pagos.push(...r.pagos_reservas);
      return pagos;
    });
    
    // Sumamos directamente los ingresos
    const totalGenerado = allPagos.reduce((sum: number, pago: any) => {
      if (pago.tipo === 'egreso' && pago.categoria === 'reembolso') {
        return sum - (Number(pago.monto_mxn) || Number(pago.monto) || 0);
      }
      if (pago.moneda === 'USD') hasUSD = true;
      return sum + (Number(pago.monto_mxn) || Number(pago.monto) || 0);
    }, 0);

    """
    content = content[:start] + new_block + content[end:]

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
