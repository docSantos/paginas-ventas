import os
import re

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = r"export async function actualizarTarifaBase\(reservaId: string, tarifaBase: number\) \{[\s\S]*?return \{ success: true \}\n\}"

replacement = """export async function actualizarTarifaBase(reservaId: string, tarifaBase: number) {
  if (tarifaBase <= 0) throw new Error('La tarifa base debe ser mayor a 0');
  const supabase = await createClient()
  const db = supabase as any

  const { data: reserva } = await db.schema('hospedaje').from('reservas').select('tarifa_base, monto_total_acordado, costo_total').eq('id', reservaId).maybeSingle()
  if (!reserva) throw new Error('Reserva no encontrada')

  const { data: regla } = await db.schema('central').from('reglas_comisiones').select('porcentaje_base, porcentaje_extras').eq('modulo', 'hospedaje').eq('activo', true).single()
  if (!regla) throw new Error('Regla de comisiones no encontrada')
  
  const tasaBase = Number(regla.porcentaje_base) / 100
  const tasaExtras = Number(regla.porcentaje_extras) / 100

  const subtotalExtras = Math.max(0, Number(reserva.monto_total_acordado || reserva.costo_total || 0) - Number(reserva.tarifa_base || 0));
  const nuevoTotalAcordado = Number(tarifaBase) + subtotalExtras;

  const comisionBase = Number(tarifaBase) * tasaBase;
  const comisionExtras = subtotalExtras * tasaExtras;
  const nuevaComisionTotal = Number((comisionBase + comisionExtras).toFixed(2));

  await db.schema('hospedaje').from('reservas').update({ 
    tarifa_base: Number(tarifaBase), 
    monto_total_acordado: nuevoTotalAcordado, 
    costo_total: nuevoTotalAcordado,
    monto_comision: nuevaComisionTotal 
  }).eq('id', reservaId)

  await db.schema('hospedaje').from('comisiones').update({
    monto_estancia: nuevoTotalAcordado,
    monto_comision: nuevaComisionTotal
  }).eq('reserva_id', reservaId)
    
  await db.schema('central').from('transacciones_comisiones').update({
    monto_total: nuevoTotalAcordado,
    monto_comision: nuevaComisionTotal
  }).eq('referencia_id', String(reservaId))

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/clientes')
  revalidatePath('/casasgaby/admin/finanzas')
  revalidatePath('/casasgaby/admin/operacion')
  return { success: true }
}"""

content = re.sub(target, replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated actualizarTarifaBase in actions.ts")
