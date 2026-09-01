import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update aprobarSolicitud client logic
old_cliente_logic = r"let codigo_pais = '52'.*?await db\.from\('solicitudes'\)\s*\.update\(\{ estado: 'Aprobada' \}\)\s*\.eq\('id', solicitudId\)"

new_cliente_logic = """let clienteId = null;
  let telefonoLimpio = (solicitud.telefono || '').replace(/\\D/g, '');
  if (telefonoLimpio.length === 12 && telefonoLimpio.startsWith('52')) {
    telefonoLimpio = telefonoLimpio.substring(2);
  } else if (telefonoLimpio.startsWith('52') && telefonoLimpio.length > 10) {
    telefonoLimpio = telefonoLimpio.substring(2);
  }

  const nombreReal = solicitud.nombre_cliente || 'Huésped sin nombre';
  const emailLimpiado = solicitud.email?.trim().toLowerCase() || null;

  // Buscar cliente por email o teléfono
  let query = db.from('clientes').select('*');
  if (emailLimpiado && telefonoLimpio) {
    query = query.or(`telefono.eq.${telefonoLimpio},email.eq.${emailLimpiado}`);
  } else if (emailLimpiado) {
    query = query.eq('email', emailLimpiado);
  } else if (telefonoLimpio) {
    query = query.eq('telefono', telefonoLimpio);
  }
  
  const { data: clienteExistente } = await query.order('created_at', { ascending: false }).limit(1).maybeSingle();

  if (clienteExistente) {
    clienteId = clienteExistente.id;
    const updatePayload: any = {
      ultima_estancia: solicitud.fecha_entrada,
      total_estancias: (clienteExistente.total_estancias || 0) + 1,
      total_generado_mxn: (Number(clienteExistente.total_generado_mxn) || 0) + montoAcordado
    };
    
    // Si no tiene nombre, o si su nombre actual es igual a su correo electrónico
    if (!clienteExistente.nombre || clienteExistente.nombre === clienteExistente.email || clienteExistente.nombre === 'Huésped sin nombre') {
      updatePayload.nombre = nombreReal;
    }
    if (!clienteExistente.email && emailLimpiado) updatePayload.email = emailLimpiado;
    if (!clienteExistente.telefono && telefonoLimpio) updatePayload.telefono = telefonoLimpio;

    await db.from('clientes').update(updatePayload).eq('id', clienteId);
  } else {
    const { data: nuevoCliente } = await db.from('clientes').insert({
      nombre: nombreReal,
      telefono: telefonoLimpio,
      email: emailLimpiado,
      ultima_estancia: solicitud.fecha_entrada,
      total_estancias: 1,
      total_generado_mxn: montoAcordado
    }).select('id').single();
    if (nuevoCliente) clienteId = nuevoCliente.id;
  }

  const { error: errorUpd } = await db
    .from('solicitudes')
    .update({ estado: 'Aprobada' })
    .eq('id', solicitudId)"""

# using lambda to avoid escape sequence issues
content = re.sub(old_cliente_logic, lambda m: new_cliente_logic, content, flags=re.DOTALL)


# 2. Add cliente_id to reservas insert in aprobarSolicitud
content = content.replace("propiedad_id: solicitud.propiedad_id,", "propiedad_id: solicitud.propiedad_id,\n        cliente_id: clienteId,")


# 3. Update Anticipo insert in aprobarSolicitud to use transacciones
old_anticipo = r"const \{ error: pagoErr \} = await db\.from\('pagos_reservas'\)\.insert\(\{[\s\S]*?\}\)"
new_anticipo = """const { error: pagoErr } = await db.from('transacciones').insert({
      reserva_id: reserva.id,
      cliente_id: clienteId,
      monto: montoAnticipo,
      moneda: moneda,
      metodo_pago: metodo,
      tipo_cambio: tc,
      concepto: 'Anticipo inicial',
      tipo: 'ingreso',
      categoria: 'anticipo',
      fecha: new Date().toISOString()
    })"""
content = re.sub(old_anticipo, lambda m: new_anticipo, content, count=1)


# 4. Fix registrarAbono to use transacciones and validate correctly
old_registrar = r"export async function registrarAbono[\s\S]*?revalidatePath\('/casasgaby/admin/reservas'\)\s*return \{ success: true \}\s*\}"

new_registrar = """export async function registrarAbono(
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
  const { data: reserva, error: errFetch } = await db.from('reservas').select('monto_total_acordado, cliente_id, transacciones(monto_mxn, tipo)').eq('id', reservaId).maybeSingle()
  if (errFetch) throw new Error('Error al buscar reserva: ' + errFetch.message)
  if (!reserva) return { success: false, message: 'La reserva no existe.' }

  const totalPagosRes = reserva.transacciones?.filter((t: any) => t.tipo === 'ingreso').reduce((acc: any, p: any) => acc + (Number(p.monto_mxn) || 0), 0) || 0
  const saldoPend = Number(reserva.monto_total_acordado) - totalPagosRes

  if (equivalenteMXN > saldoPend) {
    throw new Error('El abono no puede exceder el saldo pendiente de MXN ' + saldoPend)
  }

  const { error: pagoErr } = await db.from('transacciones').insert({
    reserva_id: reservaId,
    cliente_id: reserva.cliente_id,
    monto: monto,
    moneda: moneda,
    metodo_pago: metodo,
    tipo_cambio: tc,
    concepto: notas || 'Abono a reserva',
    tipo: 'ingreso',
    categoria: 'reserva'
  })
  if (pagoErr) throw new Error('Error al registrar abono: ' + pagoErr.message)

  // Update cached total in reservas
  const { data: trans } = await db.from('transacciones').select('monto_mxn').eq('reserva_id', reservaId).eq('tipo', 'ingreso')
  const totalPagado = trans?.reduce((sum: number, p: any) => sum + Number(p.monto_mxn), 0) || 0

  await db.from('reservas').update({ monto_apartado: totalPagado }).eq('id', reservaId)

  revalidatePath('/casasgaby/admin/reservas')
  return { success: true }
}"""
content = re.sub(old_registrar, lambda m: new_registrar, content)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
