import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update signature
content = content.replace(
    "export async function aprobarSolicitud(\n  solicitudId: string, \n  montoAcordado: number, \n  montoAnticipo: number, \n  metodo: string, \n  moneda: string, \n  tc: number\n) {",
    "export async function aprobarSolicitud(\n  solicitudId: string, \n  montoAcordado: number, \n  montoAnticipo: number, \n  metodo: string, \n  moneda: string, \n  tc: number,\n  extras?: any[]\n) {"
)

# Replace the math calculations before the `reservas` insert
calc_replace = """  const { data: tenant } = await db.from('tenants_config').select('porcentaje_comision_base').eq('id', 'casasgaby').maybeSingle()
  const pComision = tenant?.porcentaje_comision_base ? Number(tenant.porcentaje_comision_base) : 2.50
  
  const sumaExtras = extras ? extras.reduce((acc, e) => acc + Number(e.monto), 0) : 0
  const comisionExtras = extras ? extras.reduce((acc, e) => acc + (Number(e.monto) * Number(e.porcentaje_comision) / 100), 0) : 0

  const nuevoTotalAcordado = montoAcordado + sumaExtras
  const montoComisionCalc = ((montoAcordado * pComision) / 100) + comisionExtras

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
      monto_total_acordado: nuevoTotalAcordado,
      tarifa_base: montoAcordado,
      monto_apartado: montoAnticipo,
      porcentaje_comision: pComision,
      monto_comision: montoComisionCalc,"""

content = re.sub(
    r"const \{ data: tenant \} = await db\.from\('tenants_config'\)\.select\('porcentaje_comision_base'\)\.eq\('id', 'casasgaby'\)\.maybeSingle\(\).*?monto_comision: montoComisionCalc,",
    calc_replace,
    content,
    flags=re.DOTALL
)

# After inserting to comisiones, insert to ajustes_reserva
insert_ajustes = """    if (comErr) throw new Error('Error al generar comisión: ' + comErr.message)

  if (extras && extras.length > 0) {
    const ajustes = extras.map((e: any) => ({
      reserva_id: reserva.id,
      tipo: 'cargo',
      concepto: e.concepto,
      monto: Number(e.monto),
      porcentaje_comision: Number(e.porcentaje_comision),
      monto_comision: (Number(e.monto) * Number(e.porcentaje_comision)) / 100
    }))
    await db.from('ajustes_reserva').insert(ajustes)
  }"""

content = re.sub(
    r"if \(comErr\) throw new Error\('Error al generar comisión: ' \+ comErr\.message\)",
    insert_ajustes,
    content
)

# And also ensure that `monto_estancia: montoAcordado` -> `monto_estancia: nuevoTotalAcordado` inside `comisiones` insertion.
comision_replace = """    monto_estancia: nuevoTotalAcordado,
    porcentaje_comision: pComision,
    monto_comision: montoComisionCalc,"""

content = re.sub(
    r"monto_estancia: montoAcordado,\s*porcentaje_comision: pComision,\s*monto_comision: montoComisionCalc,",
    comision_replace,
    content,
    flags=re.DOTALL
)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
