import os

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """const { data: reserva, error: errFetch } = await db.schema('hospedaje').from('reservas').select('monto_total_acordado, cliente_id, transacciones(monto_mxn, tipo)').eq('id', reservaId).maybeSingle()
  if (errFetch) throw new Error('Error al buscar reserva: ' + errFetch.message)
  if (!reserva) return { success: false, message: 'La reserva no existe.' }

  const totalPagosRes = reserva.transacciones?.filter((t: any) => t.tipo === 'ingreso').reduce((acc: any, p: any) => acc + (Number(p.monto_mxn) || 0), 0) || 0
  const saldoPend = Number(reserva.monto_total_acordado) - totalPagosRes

  if (equivalenteMXN > saldoPend) {"""

replacement = """const { data: reserva, error: errFetch } = await db.schema('hospedaje').from('reservas').select('monto_total_acordado, costo_total, cliente_id, transacciones(monto_mxn, tipo)').eq('id', reservaId).maybeSingle()
  if (errFetch) throw new Error('Error al buscar reserva: ' + errFetch.message)
  if (!reserva) return { success: false, message: 'La reserva no existe.' }

  const totalAcordado = Number(reserva.monto_total_acordado) || Number(reserva.costo_total) || 0
  const totalPagosRes = reserva.transacciones?.filter((t: any) => t.tipo === 'ingreso').reduce((acc: any, p: any) => acc + (Number(p.monto_mxn) || 0), 0) || 0
  const saldoPend = totalAcordado - totalPagosRes

  if (equivalenteMXN > saldoPend + 0.5) {""" # add a small epsilon to avoid float issues

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed registrarAbono validation")
else:
    print("Target not found in registrarAbono")
