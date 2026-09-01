import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

aprobar_replace = """  const { data: tenant } = await db.from('tenants_config').select('porcentaje_comision_base').eq('id', 'casasgaby').maybeSingle()
  const pComision = tenant?.porcentaje_comision_base ? Number(tenant.porcentaje_comision_base) : 2.50
  const montoComisionCalc = (montoAcordado * pComision) / 100

  const { data: reserva, error: errorRes } = await db
    .from('reservas')
    .insert({
      propiedad_id: solicitud.propiedad_id,
      nombre_cliente: solicitud.nombre_cliente,
      email: solicitud.email,
      telefono: solicitud.telefono,
      fecha_entrada: solicitud.fecha_entrada,
      fecha_salida: solicitud.fecha_salida,
      costo_total: solicitud.costo_total || 0,
      monto_total_acordado: montoAcordado,
      tarifa_base: montoAcordado,
      monto_apartado: montoAnticipo,
      porcentaje_comision: pComision,
      monto_comision: montoComisionCalc,"""

content = re.sub(
    r"const \{ data: reserva, error: errorRes \} = await db\s*\.from\('reservas'\)\s*\.insert\(\{.*?monto_comision: montoAcordado \* 0\.025,",
    aprobar_replace,
    content,
    flags=re.DOTALL
)

comision_replace = """  const { error: comErr } = await db.from('comisiones').insert({
    tenant_id: 'casasgaby',
    reserva_id: reserva.id,
    propiedad_id: solicitud.propiedad_id,
    monto_estancia: montoAcordado,
    porcentaje_comision: pComision,
    monto_comision: montoComisionCalc,"""

content = re.sub(
    r"const \{ error: comErr \} = await db\.from\('comisiones'\)\.insert\(\{.*?monto_comision: montoAcordado \* 0\.025,",
    comision_replace,
    content,
    flags=re.DOTALL
)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
