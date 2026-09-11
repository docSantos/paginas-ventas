import os
import re

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = "if (errorRes) throw new Error('Error al crear la reserva: ' + errorRes.message)"
replacement = """if (errorRes) throw new Error('Error al crear la reserva: ' + errorRes.message)

    // REGISTRAR EN central.transacciones_comisiones
    if (reserva?.id) {
      await db.schema('central').from('transacciones_comisiones').insert({
        tenant_id: 'casasgaby',
        origen_modulo: 'hospedaje',
        referencia_id: reserva.id,
        concepto: `Comisión Reserva - ${solicitud.nombre_cliente}`,
        monto_total: nuevoTotalAcordado,
        porcentaje_comision: pComisionHospedaje,
        monto_comision: montoComisionCalc,
        estado: 'pendiente'
      });
    }"""

content = content.replace(target, replacement)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated central insert")
