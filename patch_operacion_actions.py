import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_actions = """
export async function liquidarSaldoRecepcion(reservaId: string, montoMXN: number, clienteId: string) {
  const supabase = await createClient()
  const db = supabase as any
  
  const { error: pagoErr } = await db.schema('hospedaje').from('transacciones').insert({
    reserva_id: reservaId,
    cliente_id: clienteId,
    monto: montoMXN,
    moneda: 'MXN',
    metodo_pago: 'Efectivo MXN',
    tipo_cambio: 1,
    concepto: 'Liquidación en recepción (Check-out)',
    tipo: 'ingreso',
    categoria: 'reserva'
  })
  if (pagoErr) return { success: false, error: pagoErr.message }

  // Update cached total in reservas
  const { data: trans } = await db.schema('hospedaje').from('transacciones').select('monto_mxn').eq('reserva_id', reservaId).eq('tipo', 'ingreso')
  const totalPagado = trans?.reduce((sum: number, p: any) => sum + Number(p.monto_mxn), 0) || 0

  await db.schema('hospedaje').from('reservas').update({ monto_apartado: totalPagado }).eq('id', reservaId)

  revalidatePath('/casasgaby/admin/operacion')
  return { success: true }
}

export async function checkOutAnticipado(reservaId: string, nuevoCosto: number, nuevaFechaSalida: string) {
  const supabase = await createClient()
  const db = supabase as any
  const { error } = await db.schema('hospedaje').from('reservas').update({ 
    costo_total: nuevoCosto,
    monto_total_acordado: nuevoCosto,
    fecha_salida: nuevaFechaSalida,
    check_out_real_at: new Date().toISOString()
  }).eq('id', reservaId)
  if (error) return { success: false, error: error.message }
  revalidatePath('/casasgaby/admin/operacion')
  return { success: true }
}
"""

if "liquidarSaldoRecepcion" not in content:
    content += new_actions
    with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
        f.write(content)
