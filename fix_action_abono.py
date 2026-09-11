import os

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target_insert = """  const { error: pagoErr } = await db.schema('hospedaje').from('transacciones').insert({
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

repl_insert = """  const { data: nuevaTransaccion, error: pagoErr } = await db.schema('hospedaje').from('transacciones').insert({
    reserva_id: reservaId,
    cliente_id: clienteId,
    monto: monto,
    moneda: moneda,
    metodo_pago: metodo,
    tipo_cambio: tc,
    concepto: notas || 'Liquidación/Abono en recepción',
    tipo: 'ingreso',
    categoria: 'reserva'
  }).select().single()"""

if target_insert in content:
    content = content.replace(target_insert, repl_insert)
    content = content.replace("return { success: true }", "return { success: true, transaccion: nuevaTransaccion }", 1) # Only first occurrence (which is inside this function)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully in actions.ts")
else:
    print("Target not found in actions.ts")
