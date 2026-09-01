import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"export async function aprobarSolicitud\([\s\S]*?revalidatePath\(`/casasgaby/propiedad/\$\{solicitud\.propiedad_id\}`\)\s*return \{ success: true \}\s*\}"

replacement = """export async function aprobarSolicitud(
  solicitudId: string, 
  montoAcordado: number, 
  montoAnticipo: number, 
  metodo: string, 
  moneda: string, 
  tc: number,
  extras?: any[]
) {
  const supabase = await createClient()
  const db = supabase as any

  const { data: solicitud, error: errorSol } = await db
    .from('solicitudes')
    .select('*')
    .eq('id', solicitudId)
    .maybeSingle()

  if (errorSol) throw new Error('Error al buscar solicitud: ' + errorSol.message)
  if (!solicitud) return { success: false, message: 'La solicitud no existe o ya fue eliminada.' }
  if (solicitud.estado !== 'Pendiente') throw new Error('La solicitud ya fue procesada')

  const { data: tenant } = await db.from('tenants_config').select('porcentaje_comision_base').eq('id', 'casasgaby').maybeSingle()
  const pComision = tenant?.porcentaje_comision_base ? Number(tenant.porcentaje_comision_base) : 2.50
  
  const sumaExtras = extras ? extras.reduce((acc, e) => acc + Number(e.monto), 0) : 0
  const comisionExtras = extras ? extras.reduce((acc, e) => acc + (Number(e.monto) * Number(e.porcentaje_comision) / 100), 0) : 0

  const nuevoTotalAcordado = montoAcordado + sumaExtras
  const montoComisionCalc = ((montoAcordado * pComision) / 100) + comisionExtras

  // --- UPSERT EN CLIENTES ---
  let clienteId = null;
  let telefonoLimpio = (solicitud.telefono || '').replace(/\D/g, '');
  if (telefonoLimpio.length === 12 && telefonoLimpio.startsWith('52')) {
    telefonoLimpio = telefonoLimpio.substring(2);
  } else if (telefonoLimpio.startsWith('52') && telefonoLimpio.length > 10) {
    telefonoLimpio = telefonoLimpio.substring(2);
  }

  const nombreReal = solicitud.nombre_cliente || 'Huésped sin nombre';
  const emailLimpiado = solicitud.email?.trim().toLowerCase() || null;

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
    
    // Check missing properties or email mistakenly saved as name
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
  // -------------------------

  const { data: reserva, error: errorRes } = await db
    .from('reservas')
    .insert({
      propiedad_id: solicitud.propiedad_id,
      cliente_id: clienteId,
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
      monto_comision: montoComisionCalc,
      comision_pagada: 0,
      estado_comision: 'pendiente',
      num_huespedes: solicitud.num_huespedes || 1,
      notas: solicitud.notas || '',
      estado: 'Activa'
    })
    .select('id')
    .single()

  if (errorRes) throw new Error('Error al crear la reserva: ' + errorRes.message)

  // Insert payment record if anticipo > 0
  if (montoAnticipo > 0) {
    const equivalenteMXN = moneda === 'USD' ? montoAnticipo * tc : montoAnticipo;
    const { error: pagoErr } = await db.from('transacciones').insert({
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
    })
    if (pagoErr) throw new Error('Error al registrar pago: ' + pagoErr.message)
  }

  // Insert extras into ajustes_reserva
  if (extras && extras.length > 0) {
    for (const e of extras) {
      await db.from('ajustes_reserva').insert({
        reserva_id: reserva.id,
        tipo: 'cargo',
        concepto: e.concepto,
        monto: e.monto,
        porcentaje_comision: e.porcentaje_comision,
        monto_comision: (Number(e.monto) * Number(e.porcentaje_comision)) / 100
      })
    }
  }

  // --- Insertar en la tabla comisiones dedicada ---
  const { error: comErr } = await db.from('comisiones').insert({
    tenant_id: 'casasgaby',
    reserva_id: reserva.id,
    propiedad_id: solicitud.propiedad_id,
    cliente_id: clienteId,
    monto_estancia: nuevoTotalAcordado,
    porcentaje_comision: pComision,
    monto_comision: montoComisionCalc,
    monto_pagado: 0,
    estado_pago: 'pendiente',
    fecha_reserva: solicitud.fecha_entrada
  })
  if (comErr) console.error('Error insertando comisión:', comErr)

  const { error: errorUpd } = await db
    .from('solicitudes')
    .update({ estado: 'Aprobada' })
    .eq('id', solicitudId)

  if (errorUpd) throw new Error('Error al actualizar la solicitud')

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/clientes')
  revalidatePath(`/casasgaby/propiedad/${solicitud.propiedad_id}`)
  return { success: true }
}"""

content = re.sub(pattern, lambda m: replacement, content)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
