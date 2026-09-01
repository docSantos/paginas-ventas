import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's cleanly replace `let totalGenerado = 0; ... } else { ... }` with the user's snippet logic.
# I will find the lines and replace them.

lines = content.split('\n')
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "let totalGenerado = 0;" in line and "let hasUSD = false;" in lines[i+1]:
        start_idx = i
    if start_idx != -1 and "return {" in line and "estancias:" in lines[i+1]:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    new_block = """      let hasUSD = false;
      const totalGenerado = validReservas.flatMap((r: any) => r.pagos_reservas || r.transacciones || [])
        .reduce((sum: number, pago: any) => {
          if (pago.moneda === 'USD') hasUSD = true;
          return sum + Number(pago.monto_mxn || pago.monto || 0);
        }, 0);
"""
    lines = lines[:start_idx] + new_block.split('\n') + lines[end_idx:]

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
