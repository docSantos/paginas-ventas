import os

filepath = 'src/components/casasgaby/admin/OperacionClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """        if (res.success) {
          setLocalReservas(prev => prev.map(reserva => {
            if (reserva.id === modalReserva.id) {
              return {
                ...reserva,
                transacciones: [...(reserva.transacciones || []), { tipo: 'ingreso', monto_mxn: equivalenteMXN }]
              }
            }
            return reserva
          }))"""

replacement = """        if (res.success) {
          setLocalReservas(prev => prev.map(reserva => {
            if (reserva.id === modalReserva.id) {
              const nueva = res.transaccion || { 
                tipo: 'ingreso', 
                monto_mxn: equivalenteMXN, 
                monto: monto,
                metodo_pago: metodoPago, 
                concepto: notasPago || 'Liquidación/Abono en recepción',
                created_at: new Date().toISOString() 
              };
              return {
                ...reserva,
                transacciones: [...(reserva.transacciones || []), nueva]
              }
            }
            return reserva
          }))"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced optimistic update correctly")
else:
    print("Target not found")
