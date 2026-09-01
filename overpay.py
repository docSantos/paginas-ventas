import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

abono_overpayment = """
  const { data: reserva, error: errFetch } = await db.from('reservas').select('monto_total_acordado, pagos_reservas(monto_equivalente_mxn)').eq('id', reservaId).maybeSingle()
  if (errFetch) throw new Error('Error al buscar reserva: ' + errFetch.message)
  if (!reserva) throw new Error('La reserva no existe')

  const totalPagado = reserva.pagos_reservas?.reduce((acc: any, pago: any) => acc + (Number(pago.monto_equivalente_mxn) || 0), 0) || 0
  const saldoPendiente = Number(reserva.monto_total_acordado) - totalPagado

  if (equivalenteMXN > saldoPendiente) {
    throw new Error('El abono no puede exceder el saldo pendiente de MXN ' + saldoPendiente)
  }

  const { error: pagoErr }"""

content = content.replace("  const { error: pagoErr }", abono_overpayment)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
