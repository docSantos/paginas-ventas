import os

filepath = 'src/components/casasgaby/admin/OperacionClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = "transacciones: [...(reserva.transacciones || []), { tipo: 'ingreso', monto_mxn: equivalenteMXN }]"
replacement = "transacciones: [...(reserva.transacciones || []), res.transaccion || { tipo: 'ingreso', monto_mxn: equivalenteMXN, monto: monto, metodo_pago: metodoPago, concepto: notasPago || 'Abono', created_at: new Date().toISOString() }]"

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced line correctly")
else:
    print("Target not found")
