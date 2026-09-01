import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. replace .single() -> .maybeSingle() in general places:
content = content.replace(".eq('id', solicitudId)\n    .single()", ".eq('id', solicitudId)\n    .maybeSingle()")
content = content.replace("if (errorSol || !solicitud) throw new Error('Solicitud no encontrada')", "if (errorSol) throw new Error('Error al buscar solicitud: ' + errorSol.message)\n  if (!solicitud) return { success: false, message: 'La solicitud no existe o ya fue eliminada.' }")

content = content.replace(".eq('id', reservaId).single()", ".eq('id', reservaId).maybeSingle()")
content = content.replace("if (errFetch || !reserva) throw new Error('Reserva no encontrada')", "if (errFetch) throw new Error('Error al buscar reserva: ' + errFetch.message)\n    if (!reserva) return { success: false, message: 'La reserva no existe o ya fue eliminada.' }")

content = content.replace(".eq('id', reservaId)\n    .single()", ".eq('id', reservaId)\n    .maybeSingle()")
content = content.replace("if (fetchErr) throw new Error('Error al buscar la reserva: ' + fetchErr.message)", "if (fetchErr) throw new Error('Error al buscar la reserva: ' + fetchErr.message)\n  if (!reserva) return { success: false, message: 'La reserva no existe o ya fue eliminada.' }")

# 2. Add phase 5 logic in aprobarSolicitud:
phase5_logic = """    if (pagoErr) throw new Error('Error al registrar pago: ' + pagoErr.message)
  }

  // --- FASE 5: Insertar en la tabla comisiones dedicada ---
  const { error: comErr } = await db.from('comisiones').insert({
    reserva_id: reserva.id,
    propiedad_id: solicitud.propiedad_id,
    monto_estancia: montoAcordado,
    porcentaje_comision: 2.50,
    monto_comision: montoAcordado * 0.025,
    monto_pagado: 0,
    estado_pago: 'pendiente',
    fecha_reserva: solicitud.fecha_entrada
  })
  if (comErr) console.error('Error insertando comisión:', comErr)

  // --- FASE 5: Upsert en clientes (CRM) ---
  let codigo_pais = '+52'
  let telefonoLimpio = solicitud.telefono || ''
  if (telefonoLimpio.startsWith('52') && telefonoLimpio.length > 2) {
    codigo_pais = '+52'
    telefonoLimpio = telefonoLimpio.substring(2)
  } else if (telefonoLimpio.startsWith('1') && telefonoLimpio.length > 1) {
    codigo_pais = '+1'
    telefonoLimpio = telefonoLimpio.substring(1)
  }

  const { data: clienteExistente } = await db.from('clientes')
    .select('*')
    .eq('codigo_pais', codigo_pais)
    .eq('telefono', telefonoLimpio)
    .maybeSingle()

  if (clienteExistente) {
    await db.from('clientes').update({
      total_estancias: (clienteExistente.total_estancias || 0) + 1,
      total_generado_mxn: (Number(clienteExistente.total_generado_mxn) || 0) + montoAcordado,
      ultima_estancia: solicitud.fecha_entrada,
      nombre_completo: solicitud.nombre_cliente,
      email: solicitud.email || clienteExistente.email
    }).eq('id', clienteExistente.id)
  } else {
    await db.from('clientes').insert({
      nombre_completo: solicitud.nombre_cliente,
      codigo_pais: codigo_pais,
      telefono: telefonoLimpio,
      email: solicitud.email,
      total_estancias: 1,
      total_generado_mxn: montoAcordado,
      ultima_estancia: solicitud.fecha_entrada
    })
  }

  const { error: errorUpd }"""
content = content.replace("    if (pagoErr) throw new Error('Error al registrar pago: ' + pagoErr.message)\n  }\n\n  const { error: errorUpd }", phase5_logic)

# Revalidate clientes path
content = content.replace("revalidatePath('/casasgaby/admin/reservas')\n  revalidatePath(`/casasgaby/propiedad/${solicitud.propiedad_id}`)", "revalidatePath('/casasgaby/admin/reservas')\n  revalidatePath('/casasgaby/admin/clientes')\n  revalidatePath(`/casasgaby/propiedad/${solicitud.propiedad_id}`)")

# 3. Add registrarPagoComisionTabla and validation
registrar_pago_comision = """
export async function registrarPagoComisionTabla(comisionId: string, montoAbono: number, metodo: string = 'transferencia') {
  if (!montoAbono || isNaN(Number(montoAbono)) || Number(montoAbono) <= 0) {
    throw new Error('El monto ingresado debe ser un número positivo mayor a cero.')
  }
  const supabase = await createClient()
  const db = supabase as any

  const { data: comision, error: errFetch } = await db.from('comisiones').select('*').eq('id', comisionId).maybeSingle()
  if (errFetch) throw new Error('Error al buscar comisión: ' + errFetch.message)
  if (!comision) return { success: false, message: 'La comisión no existe o ya fue eliminada.' }

  const saldo = Number(comision.monto_comision) - Number(comision.monto_pagado)
  if (montoAbono > saldo) {
    throw new Error('El abono no puede exceder el saldo pendiente de ' + saldo)
  }

  const nuevoMontoPagado = Number(comision.monto_pagado) + montoAbono
  const estadoPago = nuevoMontoPagado >= Number(comision.monto_comision) ? 'liquidado' : 'parcial'

  const { error: errUpd } = await db.from('comisiones').update({
    monto_pagado: nuevoMontoPagado,
    estado_pago: estadoPago,
    metodo_pago_comision: metodo,
    fecha_liquidacion: estadoPago === 'liquidado' ? new Date().toISOString() : null
  }).eq('id', comisionId)

  if (errUpd) throw new Error('Error al registrar pago de comisión: ' + errUpd.message)

  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true }
}

export async function registrarAbono"""
content = content.replace("export async function registrarAbono", registrar_pago_comision)

# 4. Modify registrarAbono
abono_val = """export async function registrarAbono(
  reservaId: string, 
  monto: number, 
  metodo: string, 
  moneda: string, 
  tc: number, 
  notas: string = ''
) {
  if (!monto || isNaN(Number(monto)) || Number(monto) <= 0) {
    throw new Error('El monto ingresado debe ser un número positivo mayor a cero.')
  }
  const supabase = await createClient()
  const db = supabase as any

  const equivalenteMXN = moneda === 'USD' ? monto * tc : monto;

  // Validation overpayment
  const { data: reserva, error: errFetch } = await db.from('reservas').select('monto_total_acordado, pagos_reservas(monto_equivalente_mxn)').eq('id', reservaId).maybeSingle()
  if (errFetch) throw new Error('Error al buscar reserva: ' + errFetch.message)
  if (!reserva) return { success: false, message: 'La reserva no existe.' }

  const totalPagosRes = reserva.pagos_reservas?.reduce((acc: any, p: any) => acc + (Number(p.monto_equivalente_mxn) || 0), 0) || 0
  const saldoPend = Number(reserva.monto_total_acordado) - totalPagosRes

  if (equivalenteMXN > saldoPend) {
    throw new Error('El abono no puede exceder el saldo pendiente de MXN ' + saldoPend)
  }

  const { error: pagoErr } = await db.from('pagos_reservas').insert({"""

content = re.sub(
    r"export async function registrarAbono\(.*?\) \{\s*const supabase = await createClient\(\)\s*const db = supabase as any\s*const equivalenteMXN = moneda === 'USD' \? monto \* tc : monto;\s*const \{ error: pagoErr \} = await db.from\('pagos_reservas'\).insert\(\{",
    abono_val,
    content,
    flags=re.DOTALL
)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
