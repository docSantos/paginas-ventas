import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

action_logic = """
export async function aplicarSaldoAFavorComision(comisionActivaId: string, montoRequerido: number) {
  const supabase = await createClient()
  const db = supabase as any

  let remaining = montoRequerido

  const { data: canceladas } = await db.from('comisiones')
    .select('*')
    .eq('estado_pago', 'cancelada_con_saldo_a_favor')
    .order('created_at', { ascending: true })

  if (!canceladas || canceladas.length === 0) throw new Error('No hay saldo a favor disponible')

  for (const c of canceladas) {
    if (remaining <= 0) break;
    
    const disponible = Number(c.monto_pagado)
    const tomar = Math.min(disponible, remaining)
    
    const nuevoMontoCancelada = disponible - tomar
    await db.from('comisiones').update({
      monto_pagado: nuevoMontoCancelada,
      estado_pago: nuevoMontoCancelada > 0 ? 'cancelada_con_saldo_a_favor' : 'cancelada'
    }).eq('id', c.id)

    remaining -= tomar
  }

  const abonado = montoRequerido - remaining

  const { data: activa } = await db.from('comisiones').select('*').eq('id', comisionActivaId).maybeSingle()
  if (activa) {
    const nuevoMontoPagado = Number(activa.monto_pagado) + abonado
    const estadoPago = nuevoMontoPagado >= Number(activa.monto_comision) ? 'liquidado' : 'parcial'
    
    await db.from('comisiones').update({
      monto_pagado: nuevoMontoPagado,
      estado_pago: estadoPago,
      fecha_liquidacion: estadoPago === 'liquidado' ? new Date().toISOString() : null,
      notas: (activa.notas ? activa.notas + ' | ' : '') + `Se aplicó saldo a favor por ${abonado}`
    }).eq('id', activa.id)
  }

  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true, abonado }
}
"""

# Append at the end
content = content + "\n" + action_logic

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
