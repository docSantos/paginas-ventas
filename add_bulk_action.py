import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_action = """
export async function registrarPagoComisionLote(comisionIds: string[], metodo: string = 'Transferencia') {
  try {
    if (!comisionIds || comisionIds.length === 0) {
      return { success: false, error: 'No hay comisiones seleccionadas.' }
    }
    const supabase = await createClient()
    const db = supabase as any

    const { data: comisiones, error: errFetch } = await db.schema('hospedaje').from('comisiones').select('*').in('id', comisionIds)
    if (errFetch) return { success: false, error: 'Error al buscar comisiones: ' + errFetch.message }
    if (!comisiones || comisiones.length === 0) return { success: false, error: 'Las comisiones no existen.' }

    let totalPagado = 0
    const transacciones = []
    
    // Preparar actualizaciones
    for (const comision of comisiones) {
      const saldo = Number(comision.monto_comision) - Number(comision.monto_pagado)
      if (saldo <= 0) continue // Skip ya pagadas

      const nuevoMontoPagado = Number(comision.monto_comision)
      
      const { error: errUpd } = await db.schema('hospedaje').from('comisiones').update({
        monto_pagado: nuevoMontoPagado,
        estado_pago: 'pagado',
        metodo_pago_comision: metodo,
        fecha_liquidacion: new Date().toISOString()
      }).eq('id', comision.id)

      if (errUpd) {
        console.error('Error al actualizar comision', comision.id, errUpd)
        continue
      }

      totalPagado += saldo

      transacciones.push({
        reserva_id: comision.reserva_id,
        cliente_id: comision.cliente_id,
        monto: saldo,
        moneda: 'MXN',
        tipo_cambio: 1,
        metodo_pago: metodo,
        concepto: 'Pago de comisión a gestor (Lote) - Reserva ' + comision.reserva_id,
        tipo: 'egreso',
        categoria: 'comisiones'
      })
    }

    if (transacciones.length > 0) {
      const { error: errTrans } = await db.schema('hospedaje').from('transacciones').insert(transacciones)
      if (errTrans) console.error('Error insertando egresos en transacciones:', errTrans)
    }

    revalidatePath('/casasgaby/admin/finanzas')
    return { success: true, pagadas: transacciones.length }
  } catch (e: any) {
    console.error('Excepción en registrarPagoComisionLote:', e)
    return { success: false, error: e.message || 'Error desconocido' }
  }
}
"""

if "export async function registrarPagoComisionLote" not in content:
    content += new_action

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
