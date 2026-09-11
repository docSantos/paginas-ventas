import os
import re

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Update insert
content = content.replace("porcentaje_comision: pComision,", "porcentaje_comision: pComisionHospedaje,")

# Add the central.transacciones_comisiones insertion block right after the insert finishes
# We look for:
#    const { data: reserva, error: errorRes } = await db
#      .schema('hospedaje').from('reservas')
#      .insert({
# ...
#      })
#      .select('id')
#      .single()

# Let's find exactly the end of this block
insert_end_pattern = re.compile(r"      \.select\('id'\)\n\s*\.single\(\)\n\n\s*if \(errorRes\) \{[\s\S]*?\}")
insert_end_match = insert_end_pattern.search(content)

if insert_end_match:
    insertion_code = """
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
    }
"""
    new_content = content[:insert_end_match.end()] + "\n" + insertion_code + content[insert_end_match.end():]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Added central insert")
else:
    print("Could not find insert_end_pattern")
