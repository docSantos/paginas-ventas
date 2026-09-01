import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update aprobarSolicitud client logic
old_cliente_logic = r"// --- FASE 5: Upsert en clientes \(CRM\) ---.*?await db\.from\('solicitudes'\)\s*\.update\(\{ estado: 'Aprobada' \}\)\s*\.eq\('id', solicitudId\)"

new_cliente_logic = r"""// --- FASE 5: Upsert en clientes (CRM) ---
  let clienteId = null;
  let telefonoLimpio = (solicitud.telefono || '').replace(/\D/g, '');
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

content = re.sub(old_cliente_logic, lambda m: new_cliente_logic, content, flags=re.DOTALL)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
