import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace registrarPagoComisionTabla entirely.
old_func_pattern = re.compile(r"export async function registrarPagoComisionTabla\(comisionId: string, montoAbono: number, metodo: string =\s*'transferencia'\) \{.*?revalidatePath\('/casasgaby/admin/finanzas'\)\s*return \{ success: true \}\s*\}", re.DOTALL)

new_func = """export async function registrarPagoComisionTabla(comisionId: string, montoAbono: number, metodo: string = 'Transferencia') {
  try {
    if (!montoAbono || isNaN(Number(montoAbono)) || Number(montoAbono) <= 0) {
      return { success: false, error: 'El monto ingresado debe ser un número positivo mayor a cero.' }
    }
    const supabase = await createClient()
    const db = supabase as any

    const { data: comision, error: errFetch } = await db.schema('hospedaje').from('comisiones').select('*').eq('id', comisionId).maybeSingle()
    if (errFetch) return { success: false, error: 'Error al buscar comisión: ' + errFetch.message }
    if (!comision) return { success: false, error: 'La comisión no existe o ya fue eliminada.' }

    const saldo = Number(comision.monto_comision) - Number(comision.monto_pagado)
    if (montoAbono > saldo + 0.5) {
      return { success: false, error: 'El abono no puede exceder el saldo pendiente.' }
    }

    const nuevoMontoPagado = Number(comision.monto_pagado) + montoAbono
    const estadoPago = nuevoMontoPagado >= Number(comision.monto_comision) - 0.5 ? 'liquidado' : 'parcial'

    const { error: errUpd } = await db.schema('hospedaje').from('comisiones').update({
      monto_pagado: nuevoMontoPagado,
      estado_pago: estadoPago,
      metodo_pago_comision: metodo,
      fecha_liquidacion: estadoPago === 'liquidado' ? new Date().toISOString() : null
    }).eq('id', comisionId)

    if (errUpd) return { success: false, error: 'Error al registrar pago: ' + errUpd.message }

    const { error: errTrans } = await db.schema('hospedaje').from('transacciones').insert({
      reserva_id: comision.reserva_id,
      cliente_id: comision.cliente_id, 
      monto: montoAbono,
      moneda: 'MXN',
      tipo_cambio: 1,
      metodo_pago: metodo,
      concepto: 'Pago de comisión a gestor (Casas Gaby)',
      tipo: 'egreso',
      categoria: 'comisiones'
    })

    if (errTrans) {
      console.error('Error insertando egreso en transacciones:', errTrans)
    }

    revalidatePath('/casasgaby/admin/finanzas')
    return { success: true }
  } catch (e: any) {
    console.error('Excepción en registrarPagoComisionTabla:', e)
    return { success: false, error: e.message || 'Error desconocido' }
  }
}"""

content = old_func_pattern.sub(new_func, content)
with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
