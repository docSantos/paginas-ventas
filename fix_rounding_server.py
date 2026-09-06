import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix liquidarSaldoRecepcion
content = re.sub(
    r'export async function liquidarSaldoRecepcion\(reservaId: string, monto: number, clienteId: string(.*?)\) \{',
    r'export async function liquidarSaldoRecepcion(reservaId: string, monto: number, clienteId: string\1) {\n  monto = parseFloat(monto.toFixed(2))',
    content
)

# Fix checkOutAnticipado
content = re.sub(
    r'export async function checkOutAnticipado\(reservaId: string, nuevoCosto: number, nuevaFechaSalida: string(.*?)\) \{',
    r'export async function checkOutAnticipado(reservaId: string, nuevoCosto: number, nuevaFechaSalida: string\1) {\n  nuevoCosto = parseFloat(nuevoCosto.toFixed(2))',
    content
)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
