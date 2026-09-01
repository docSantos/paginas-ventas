import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix in aplicarSaldoAFavorComision
old_saldo_1 = r"\.eq\('estado_pago', 'cancelada_con_saldo_a_favor'\)"
new_saldo_1 = ".eq('estado_pago', 'cancelada').gt('monto_pagado', 0)"
content = re.sub(old_saldo_1, new_saldo_1, content)

old_saldo_2 = r"estado_pago: nuevoMontoCancelada > 0 \? 'cancelada_con_saldo_a_favor' : 'cancelada'"
new_saldo_2 = "estado_pago: 'cancelada'"
content = re.sub(old_saldo_2, new_saldo_2, content)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
