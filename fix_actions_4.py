import os
import re

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update marcarCheckIn
checkin_target = r"update\(\{ check_in_real_at: new Date\(\)\.toISOString\(\) \}\)\.eq\('id', reservaId\)"
checkin_replacement = "update({ estado: 'in_house', check_in_real_at: new Date().toISOString() }).eq('id', reservaId)"
content = re.sub(checkin_target, checkin_replacement, content)

# 2. Update agregarAjusteReserva for central.transacciones_comisiones
ajuste_target = r"await db\.schema\('hospedaje'\)\.from\('comisiones'\)\.update\(\{\s*monto_estancia: nuevoTotal,\s*monto_comision: nuevoMontoComision\s*\}\)\.eq\('reserva_id', reservaId\)"
ajuste_replacement = """await db.schema('hospedaje').from('comisiones').update({
      monto_estancia: nuevoTotal,
      monto_comision: nuevoMontoComision
    }).eq('reserva_id', reservaId)
    
    await db.schema('central').from('transacciones_comisiones').update({
      monto_total: nuevoTotal,
      monto_comision: nuevoMontoComision
    }).eq('referencia_id', reservaId)"""
content = re.sub(ajuste_target, ajuste_replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated actions.ts")
