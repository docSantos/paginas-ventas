import os
import re

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace in line 404
content = re.sub(r'acc \+ \(Number\(p\.monto_mxn\) \|\| 0\)', 'acc + Number(p.monto_acreditado ?? p.monto_mxn ?? p.monto ?? 0)', content)

# Replace in line 426 and 1019
content = re.sub(r'sum \+ Number\(p\.monto_mxn\)', 'sum + Number(p.monto_acreditado ?? p.monto_mxn ?? p.monto ?? 0)', content)

# Wait, we need to make sure `select` statements in actions.ts fetch `monto_acreditado` and `monto`.
# For line 426: `const { data: trans } = await db.schema('hospedaje').from('transacciones').select('monto_mxn').eq('reserva_id', reservaId).eq('tipo', 'ingreso')`
content = re.sub(r"\.select\('monto_mxn'\)", ".select('monto, monto_mxn, monto_acreditado')", content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated actions reducers")
