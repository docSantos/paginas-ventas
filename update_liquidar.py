import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"""export async function liquidarSaldoRecepcion\(reservaId: string, montoMXN: number, clienteId: string, metodo: string = 'Efectivo', notas: string = ''\) \{
  const supabase = await createClient\(\)
  const db = supabase as any
  
  const \{ error: pagoErr \} = await db\.schema\('hospedaje'\)\.from\('transacciones'\)\.insert\(\{
    reserva_id: reservaId,
    cliente_id: clienteId,
    monto: montoMXN,
    moneda: 'MXN',
    metodo_pago: metodo,
    tipo_cambio: 1,
    concepto: notas \|\| 'Liquidación en recepción',
    tipo: 'ingreso',
    categoria: 'reserva'
  \}\)"""

replacement = """export async function liquidarSaldoRecepcion(reservaId: string, monto: number, clienteId: string, metodo: string = 'Efectivo MXN', notas: string = '', moneda: string = 'MXN', tc: number = 1) {
  const supabase = await createClient()
  const db = supabase as any
  
  const { error: pagoErr } = await db.schema('hospedaje').from('transacciones').insert({
    reserva_id: reservaId,
    cliente_id: clienteId,
    monto: monto,
    moneda: moneda,
    metodo_pago: metodo,
    tipo_cambio: tc,
    concepto: notas || 'Liquidación/Abono en recepción',
    tipo: 'ingreso',
    categoria: 'reserva'
  })"""

content = re.sub(pattern, replacement, content)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
