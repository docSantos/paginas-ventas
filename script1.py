import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# In aprobarSolicitud, insert into ajustes_reserva
# Find `if (pagoErr) console.error('Error insertando pago anticipo:', pagoErr)`
# It should be after inserting the initial payment.

old_pago = r"(if \(pagoErr\)\s*throw new Error\('Error al registrar anticipo: ' \+ pagoErr\.message\)\s*\})"
# wait, I'm not sure of the exact text for pagoErr. Let's find it.
