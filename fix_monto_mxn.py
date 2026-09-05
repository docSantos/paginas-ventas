import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix aprobarSolicitud
old_aprobar_1 = """      monto_total_acordado: nuevoTotalAcordado,
      tarifa_base: montoAcordado,
      monto_apartado: montoAnticipo,
      porcentaje_comision: pComision,"""

new_aprobar_1 = """      monto_total_acordado: nuevoTotalAcordado,
      tarifa_base: montoAcordado,
      monto_apartado: moneda === 'USD' ? (montoAnticipo * tc) : montoAnticipo,
      porcentaje_comision: pComision,"""

content = content.replace(old_aprobar_1, new_aprobar_1)

old_aprobar_2 = """    if (montoAnticipo > 0) {
      const equivalenteMXN = moneda === 'USD' ? montoAnticipo * tc : montoAnticipo;
      const { error: pagoErr } = await db.schema('hospedaje').from('transacciones').insert({
        reserva_id: reserva.id,
        cliente_id: clienteId,
        monto: montoAnticipo,
        moneda: moneda,
        metodo_pago: metodo,
        tipo_cambio: tc,"""

new_aprobar_2 = """    if (montoAnticipo > 0) {
      const equivalenteMXN = moneda === 'USD' ? montoAnticipo * tc : montoAnticipo;
      const { error: pagoErr } = await db.schema('hospedaje').from('transacciones').insert({
        reserva_id: reserva.id,
        cliente_id: clienteId,
        monto: montoAnticipo,
        monto_mxn: equivalenteMXN,
        moneda: moneda,
        metodo_pago: metodo,
        tipo_cambio: tc,"""

content = content.replace(old_aprobar_2, new_aprobar_2)

# Fix registrarAbono
old_abono_1 = """    const { error: pagoErr } = await db.schema('hospedaje').from('transacciones').insert({
      reserva_id: reservaId,
      cliente_id: reserva.cliente_id,
      monto: monto,
      moneda: moneda,
      metodo_pago: metodo,"""

new_abono_1 = """    const { error: pagoErr } = await db.schema('hospedaje').from('transacciones').insert({
      reserva_id: reservaId,
      cliente_id: reserva.cliente_id,
      monto: monto,
      monto_mxn: equivalenteMXN,
      moneda: moneda,
      metodo_pago: metodo,"""

content = content.replace(old_abono_1, new_abono_1)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
