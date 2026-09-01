import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = r"if \(pagoErr\) throw new Error\('Error al registrar pago: ' \+ pagoErr\.message\)\n\s+\}"

new_block = """if (pagoErr) throw new Error('Error al registrar pago: ' + pagoErr.message)
  }

  // Insert extras into ajustes_reserva
  if (extras && extras.length > 0) {
    for (const e of extras) {
      await db.from('ajustes_reserva').insert({
        reserva_id: reserva.id,
        tipo: 'cargo',
        concepto: e.concepto,
        monto: e.monto,
        porcentaje_comision: e.porcentaje_comision,
        monto_comision: (Number(e.monto) * Number(e.porcentaje_comision)) / 100
      })
    }
  }"""

content = re.sub(old_block, new_block, content, count=1)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
