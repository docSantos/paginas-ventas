import os

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """  const { error } = await db.schema('hospedaje').from('reservas').insert({
    propiedad_id: propiedadId,
    fecha_entrada: fechaEntrada,
    fecha_salida: fechaSalida,
    estado: motivo === 'mantenimiento' ? 'mantenimiento' : 'bloqueo',
    nombre_cliente: `[BLOQUEO] ${motivo}`,
    noches: Math.max(1, Math.ceil((new Date(fechaSalida).getTime() - new Date(fechaEntrada).getTime()) / (1000 * 60 * 60 * 24))),
    monto_total_acordado: 0,
    monto_apartado: 0,
    telefono: '',
  })"""

replacement = """  const { error } = await db.schema('hospedaje').from('reservas').insert({
    propiedad_id: propiedadId,
    nombre_cliente: `[BLOQUEO] ${motivo}`,
    telefono: '0000000000',
    email: null,
    fecha_entrada: fechaEntrada,
    fecha_salida: fechaSalida,
    costo_total: 0,
    monto_apartado: 0,
    estado: 'Activa'
  })"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("actions.ts patched")
else:
    print("Target not found in actions.ts")
