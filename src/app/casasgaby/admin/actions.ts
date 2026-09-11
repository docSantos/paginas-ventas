'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }) } catch(e) {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }) } catch(e) {}
        },
      },
    }
  )
}

export async function togglePropertyStatus(id: string, currentStatus: boolean) {
  const supabase = await getSupabaseServerClient()
  
  const { error } = await supabase
    .schema('hospedaje').from('propiedades')
    .update({ activa: !currentStatus })
    .eq('id', id)
    
  if (error) throw new Error(error.message)
  
  revalidatePath('/casasgaby/admin')
  revalidatePath('/casasgaby')
}

export async function deleteProperty(id: string) {
  const supabase = await getSupabaseServerClient()
  
  const { error } = await supabase
    .schema('hospedaje').from('propiedades')
    .delete()
    .eq('id', id)
    
  if (error) throw new Error(error.message)
  
  revalidatePath('/casasgaby/admin')
  revalidatePath('/casasgaby')
}

export async function saveProperty(data: any, id?: string, serviciosIds?: string[]) {
  const supabase = await getSupabaseServerClient()
  let propId = id;
  
  if (id) {
    const { error } = await supabase
      .schema('hospedaje').from('propiedades')
      .update(data)
      .eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { data: newData, error } = await supabase
      .schema('hospedaje').from('propiedades')
      .insert([data])
      .select('id')
      .single()
    if (error) throw new Error(error.message)
    propId = newData.id
  }
  
  // Sync servicios
  if (propId && serviciosIds !== undefined) {
    // 1. Marcar todos como no disponibles primero
    await supabase.schema('hospedaje').from('propiedad_servicios').update({ disponible: false }).eq('propiedad_id', propId);
    
    // 2. Insertar o actualizar los seleccionados a true
    for (const sId of serviciosIds) {
      const { data: exists } = await supabase.schema('hospedaje').from('propiedad_servicios').select('id').eq('propiedad_id', propId).eq('servicio_id', sId).maybeSingle();
      if (exists) {
        await supabase.schema('hospedaje').from('propiedad_servicios').update({ disponible: true }).eq('id', exists.id);
      } else {
        await supabase.schema('hospedaje').from('propiedad_servicios').insert({ propiedad_id: propId, servicio_id: sId, disponible: true });
      }
    }
  }
  
  revalidatePath('/casasgaby/admin')
  revalidatePath('/casasgaby')
}

export async function aprobarSolicitud(
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
    .schema('hospedaje').from('solicitudes')
    .select('*')
    .eq('id', solicitudId)
    .maybeSingle()

  if (errorSol) throw new Error('Error al buscar solicitud: ' + errorSol.message)
  if (!solicitud) return { success: false, message: 'La solicitud no existe o ya fue eliminada.' }
  const etapasValidasParaConfirmar = ['por_contactar', 'en_seguimiento'];
  if (!etapasValidasParaConfirmar.includes(solicitud.estado)) {
    throw new Error('La solicitud ya fue procesada o está en una etapa inválida');
  }

  // VALIDACIÓN DE OVERBOOKING
  const { data: conflictos, error: errConflictos } = await db
    .schema('hospedaje').from('reservas')
    .select('id, fecha_entrada, fecha_salida')
    .eq('propiedad_id', solicitud.propiedad_id)
    .neq('estado', 'cancelada')
    .lt('fecha_entrada', solicitud.fecha_salida)
    .gt('fecha_salida', solicitud.fecha_entrada);

  if (errConflictos) throw new Error('Error al verificar disponibilidad de fechas.');
  if (conflictos && conflictos.length > 0) {
    return { 
      success: false, 
      message: `Conflicto de fechas: ya existe una reserva activa del ${conflictos[0].fecha_entrada} al ${conflictos[0].fecha_salida}. No se puede aprobar.` 
    };
  }

  const { data: regla, error: errRegla } = await db
    .schema('central')
    .from('reglas_comisiones')
    .select('porcentaje_base, porcentaje_extras')
    .eq('modulo', 'hospedaje')
    .eq('activo', true)
    .single();

  if (errRegla || !regla) {
    throw new Error('Error contable: Regla de comisiones no encontrada en central.reglas_comisiones');
  }

  const tasaBase = Number(regla.porcentaje_base) / 100;
  const tasaExtras = Number(regla.porcentaje_extras) / 100;

  const sumaExtras = extras ? extras.reduce((acc: any, e: any) => acc + Number(e.monto || e.precio_base || 0), 0) : 0;
  
  let tarifa_base = Number(montoAcordado);
  if (tarifa_base >= sumaExtras && sumaExtras > 0) {
    tarifa_base = tarifa_base - sumaExtras;
  }
  
  const nuevoTotalAcordado = tarifa_base + sumaExtras;
  const montoComisionCalc = Number(((tarifa_base * tasaBase) + (sumaExtras * tasaExtras)).toFixed(2));
  const pComision = Number(regla.porcentaje_base);

  // --- UPSERT EN CLIENTES ---
  let codigoPais = '+52';
  let phoneDigits = (solicitud.telefono || solicitud.telefono_cliente || '').replace(/\D/g, '');
  if (phoneDigits.startsWith('52') && phoneDigits.length >= 12) {
    codigoPais = '+52';
    phoneDigits = phoneDigits.substring(2);
  } else if (phoneDigits.startsWith('34') && phoneDigits.length >= 11) {
    codigoPais = '+34';
    phoneDigits = phoneDigits.substring(2);
  } else if (phoneDigits.startsWith('1') && phoneDigits.length >= 11) {
    codigoPais = '+1';
    phoneDigits = phoneDigits.substring(1);
  }

  const { data: clienteId, error: errCliente } = await db.schema('hospedaje').rpc('upsert_cliente_reserva', {
    p_tenant_id: 'casasgaby',
    p_nombre: solicitud.nombre_cliente || solicitud.nombre_completo || solicitud.nombre || 'Huésped',
    p_email: solicitud.email || solicitud.email_cliente || '',
    p_telefono: phoneDigits
  })

  if (errCliente || !clienteId) {
    console.error('Error al resolver cliente:', errCliente)
    throw new Error('No se pudo vincular o crear el cliente.')
  }
  
  await db.schema('hospedaje').from('clientes').update({ codigo_pais: codigoPais, telefono: phoneDigits }).eq('id', clienteId);
  // -------------------------

const { data: reserva, error: errorRes } = await db
    .schema('hospedaje').from('reservas')
    .insert({
      propiedad_id: solicitud.propiedad_id,
      cliente_id: clienteId,
      nombre_cliente: solicitud.nombre_cliente,
      email: solicitud.email,
      telefono: solicitud.telefono,
      fecha_entrada: solicitud.fecha_entrada,
      fecha_salida: solicitud.fecha_salida,
      costo_total: nuevoTotalAcordado,
      monto_total_acordado: nuevoTotalAcordado,
      tarifa_base: tarifa_base,
      monto_apartado: moneda === 'USD' ? (montoAnticipo * tc) : montoAnticipo,
      porcentaje_comision: pComision,
      monto_comision: montoComisionCalc,
      comision_pagada: 0,
      estado_comision: 'pendiente',
      num_huespedes: solicitud.num_huespedes || 1,
      notas: solicitud.notas || '',
      estado: 'Activa',
      solicitada_en: solicitud.created_at,
      confirmada_en: new Date().toISOString()
    })
    .select('id')
    .single()

  if (errorRes) throw new Error('Error al crear la reserva: ' + errorRes.message)

    // REGISTRAR EN central.transacciones_comisiones
    if (reserva?.id) {
      await db.schema('central').from('transacciones_comisiones').insert({
        tenant_id: 'casasgaby',
        origen_modulo: 'hospedaje',
        referencia_id: String(reserva.id),
        concepto: `Comisión Reserva - ${solicitud.nombre_cliente}`,
        monto_total: nuevoTotalAcordado,
        porcentaje_comision: pComision,
        monto_comision: montoComisionCalc,
        estado: 'pendiente'
      });
    }

  // Insert payment record if anticipo > 0
  if (montoAnticipo > 0) {
    const equivalenteMXN = moneda === 'USD' ? montoAnticipo * tc : montoAnticipo;
    const { error: pagoErr } = await db.schema('hospedaje').from('transacciones').insert({
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
      await db.schema('hospedaje').from('ajustes_reserva').insert({
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
  const { error: comErr } = await db.schema('hospedaje').from('comisiones').insert({
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
    .schema('hospedaje').from('solicitudes')
    .update({ estado: 'confirmada' })
    .eq('id', solicitudId)

  if (errorUpd) throw new Error('Error al actualizar la solicitud')

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/clientes')
  revalidatePath(`/casasgaby/propiedad/${solicitud.propiedad_id}`)
  return { success: true }
}

export async function registrarComisionPagada(reservaId: string, montoPagado: number, notas: string = '') {
  if (!montoPagado || isNaN(Number(montoPagado)) || Number(montoPagado) <= 0) throw new Error('El monto debe ser un número positivo mayor a cero.');
  const supabase = await createClient()
  const db = supabase as any

  // Get current
  const { data: reserva, error: errFetch } = await db.schema('hospedaje').from('reservas').select('monto_comision, comision_pagada').eq('id', reservaId).maybeSingle()
  if (errFetch) throw new Error('Error al buscar reserva: ' + errFetch.message)
    if (!reserva) return { success: false, message: 'La reserva no existe o ya fue eliminada.' }

  const nuevoTotal = (Number(reserva.comision_pagada) || 0) + montoPagado
  const estado = nuevoTotal >= Number(reserva.monto_comision) ? 'liquidada' : 'parcial'

    const { error: errUpd } = await db.schema('hospedaje').from('reservas').update({
    comision_pagada: nuevoTotal,
    estado_comision: estado
  }).eq('id', reservaId)

  // Sync to comisiones table
  const { data: com } = await db.schema('hospedaje').from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
  if (com) {
    await db.schema('hospedaje').from('comisiones').update({
      monto_pagado: nuevoTotal,
      estado_pago: estado === 'liquidada' ? 'liquidado' : estado
    }).eq('id', com.id)
  }

  if (errUpd) throw new Error('Error al registrar comisión: ' + errUpd.message)

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true }
}


export async function registrarPagoComisionTabla(comisionId: string, montoAbono: number, metodo: string = 'Transferencia') {
  try {
    if (!montoAbono || isNaN(Number(montoAbono)) || Number(montoAbono) <= 0) {
      return { success: false, error: 'El monto ingresado debe ser un número positivo mayor a cero.' }
    }
    const supabase = await createClient()
    const db = supabase as any

    const { data: comision, error: errFetch } = await db.schema('hospedaje').from('comisiones').select('*').eq('id', comisionId).maybeSingle()
    if (errFetch) return { success: false, error: 'Error al buscar comisión: ' + errFetch.message }
    if (!comision) return { success: false, error: 'La comisión no existe o ya fue eliminada.' }

    const saldo = Number(comision.monto_comision) - Number(comision.monto_pagado)
    if (montoAbono > saldo + 0.5) {
      return { success: false, error: 'El abono no puede exceder el saldo pendiente.' }
    }

    const nuevoMontoPagado = Number(comision.monto_pagado) + montoAbono
    const estadoPago = nuevoMontoPagado >= Number(comision.monto_comision) - 0.5 ? 'pagado' : 'parcial'

    const { error: errUpd } = await db.schema('hospedaje').from('comisiones').update({
      monto_pagado: nuevoMontoPagado,
      estado_pago: estadoPago,
      metodo_pago_comision: metodo,
      fecha_liquidacion: estadoPago === 'pagado' ? new Date().toISOString() : null
    }).eq('id', comisionId)

    if (errUpd) return { success: false, error: 'Error al registrar pago: ' + errUpd.message }

    const { error: errTrans } = await db.schema('hospedaje').from('transacciones').insert({
      reserva_id: comision.reserva_id,
      cliente_id: comision.cliente_id, 
      monto: montoAbono,
      moneda: 'MXN',
      tipo_cambio: 1,
      metodo_pago: metodo,
      concepto: 'Pago de comisión a gestor (Casas Gaby)',
      tipo: 'egreso',
      categoria: 'comisiones'
    })

    if (errTrans) {
      console.error('Error insertando egreso en transacciones:', errTrans)
    }

    revalidatePath('/casasgaby/admin/finanzas')
    return { success: true }
  } catch (e: any) {
    console.error('Excepción en registrarPagoComisionTabla:', e)
    return { success: false, error: e.message || 'Error desconocido' }
  }
}

export async function registrarAbono(
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
  const { data: reserva, error: errFetch } = await db.schema('hospedaje').from('reservas').select('monto_total_acordado, costo_total, cliente_id, transacciones(monto_mxn, tipo)').eq('id', reservaId).maybeSingle()
  if (errFetch) throw new Error('Error al buscar reserva: ' + errFetch.message)
  if (!reserva) return { success: false, message: 'La reserva no existe.' }

  const totalAcordado = Number(reserva.monto_total_acordado) || Number(reserva.costo_total) || 0
  const totalPagosRes = reserva.transacciones?.filter((t: any) => t.tipo === 'ingreso').reduce((acc: any, p: any) => acc + Number(p.monto_acreditado ?? p.monto_mxn ?? p.monto ?? 0), 0) || 0
  const saldoPend = totalAcordado - totalPagosRes

  if (equivalenteMXN > saldoPend + 0.5) {
    throw new Error('El abono no puede exceder el saldo pendiente de MXN ' + saldoPend)
  }

  const { error: pagoErr } = await db.schema('hospedaje').from('transacciones').insert({
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
  const { data: trans } = await db.schema('hospedaje').from('transacciones').select('monto, monto_mxn, monto_acreditado').eq('reserva_id', reservaId).eq('tipo', 'ingreso')
  const totalPagado = trans?.reduce((sum: number, p: any) => sum + Number(p.monto_acreditado ?? p.monto_mxn ?? p.monto ?? 0), 0) || 0

  await db.schema('hospedaje').from('reservas').update({ monto_apartado: totalPagado }).eq('id', reservaId)

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/clientes')
  return { success: true }
}

export async function cancelarReserva(reservaId: string) {
  try {
    const supabase = await createClient()
    const db = supabase as any

    // 1. Obtener datos de la reserva
    const { data: reserva, error: fetchErr } = await db
      .schema('hospedaje').from('reservas')
      .select('propiedad_id')
      .eq('id', reservaId)
      .maybeSingle()

    if (fetchErr) throw new Error('Error al buscar la reserva: ' + fetchErr.message)
    if (!reserva) throw new Error('La reserva no existe o ya fue eliminada.')

    // 2. Lógica de cancelación con comisiones (Envuelto en try/catch)
    try {
      const { data: comision } = await db.schema('hospedaje').from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
      if (comision) {
        await db.schema('hospedaje').from('comisiones').update({ estado_pago: 'cancelada' }).eq('id', comision.id)
      }
    } catch (err) {
      console.warn("No se pudo actualizar la comisión, continuando cancelación:", err)
    }

    // 3. Actualizar estado a cancelada
    const { error: updateError } = await db
      .schema('hospedaje').from('reservas')
      .update({ estado: 'cancelada' })
      .eq('id', reservaId)

    if (updateError) throw new Error(updateError.message)

    // 4. Eliminar bloqueos de fechas asociados
    await db
      .schema('hospedaje').from('fechas_bloqueadas')
      .delete()
      .eq('reserva_id', reservaId)

    revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/clientes')
    if (reserva?.propiedad_id) {
      revalidatePath(`/casasgaby/propiedad/${reserva.propiedad_id}`)
    }
    revalidatePath('/casasgaby/admin/finanzas')
    return { success: true }
  } catch (error: any) {
    console.error('Error al cancelar reserva:', error)
    return { success: false, error: error.message || 'Error al cancelar la reserva' }
  }
}

export async function rechazarSolicitud(solicitudId: string) {
  const supabase = await createClient()
  const db = supabase as any

  const { error } = await db
    .schema('hospedaje').from('solicitudes')
    .update({ estado: 'Rechazada' })
    .eq('id', solicitudId)

  if (error) throw new Error('Error al rechazar: ' + error.message)

  revalidatePath('/casasgaby/admin/reservas')
  return { success: true }
}

export async function actualizarPagosReserva(reservaId: string, nuevoAbono: number) {
  const supabase = await createClient()
  const db = supabase as any

  const { error } = await db
    .schema('hospedaje').from('reservas')
    .update({ monto_apartado: nuevoAbono })
    .eq('id', reservaId)

  if (error) throw new Error('Error al actualizar pagos: ' + error.message)

  revalidatePath('/casasgaby/admin/reservas')
  return { success: true }
}

export async function actualizarFechasReserva(reservaId: string, propiedadId: string, entrada: string, salida: string, total: number) {
  const supabase = await createClient()
  const db = supabase as any

  const { error } = await db
    .schema('hospedaje').from('reservas')
    .update({ 
      fecha_entrada: entrada,
      fecha_salida: salida,
      costo_total: total
    })
    .eq('id', reservaId)

  if (error) throw new Error('Error al actualizar fechas: ' + error.message)

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath(`/casasgaby/propiedad/${propiedadId}`)
  return { success: true }
}


export async function aplicarSaldoAFavorComision(comisionActivaId: string, montoRequerido: number) {
  if (!montoRequerido || isNaN(Number(montoRequerido)) || Number(montoRequerido) <= 0) throw new Error('El monto debe ser un número positivo mayor a cero.');
  const supabase = await createClient()
  const db = supabase as any

  let remaining = montoRequerido

  const { data: canceladas } = await db.schema('hospedaje').from('comisiones')
    .select('*')
    .eq('estado_pago', 'cancelada').gt('monto_pagado', 0)
    .order('created_at', { ascending: true })

  if (!canceladas || canceladas.length === 0) throw new Error('No hay saldo a favor disponible')

  for (const c of canceladas) {
    if (remaining <= 0) break;
    
    const disponible = Number(c.monto_pagado)
    const tomar = Math.min(disponible, remaining)
    
    const nuevoMontoCancelada = disponible - tomar
    await db.schema('hospedaje').from('comisiones').update({
      monto_pagado: nuevoMontoCancelada,
      estado_pago: 'cancelada'
    }).eq('id', c.id)

    remaining -= tomar
  }

  const abonado = montoRequerido - remaining

  const { data: activa } = await db.schema('hospedaje').from('comisiones').select('*').eq('id', comisionActivaId).maybeSingle()
  if (activa) {
    const nuevoMontoPagado = Number(activa.monto_pagado) + abonado
    const estadoPago = nuevoMontoPagado >= Number(activa.monto_comision) ? 'pagado' : 'parcial'
    
    await db.schema('hospedaje').from('comisiones').update({
      monto_pagado: nuevoMontoPagado,
      estado_pago: estadoPago,
      fecha_liquidacion: estadoPago === 'pagado' ? new Date().toISOString() : null,
      notas: (activa.notas ? activa.notas + ' | ' : '') + `Se aplicó saldo a favor por ${abonado}`
    }).eq('id', activa.id)
  }

  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true, abonado }
}


export async function actualizarTarifaBase(reservaId: string, tarifaBase: number) {
  if (tarifaBase <= 0) throw new Error('La tarifa base debe ser mayor a 0');
  const supabase = await createClient()
  const db = supabase as any

  const { data: reserva } = await db.schema('hospedaje').from('reservas').select('tarifa_base, monto_total_acordado, costo_total').eq('id', reservaId).maybeSingle()
  if (!reserva) throw new Error('Reserva no encontrada')

  const { data: regla } = await db.schema('central').from('reglas_comisiones').select('porcentaje_base, porcentaje_extras').eq('modulo', 'hospedaje').eq('activo', true).single()
  if (!regla) throw new Error('Regla de comisiones no encontrada')
  
  const tasaBase = Number(regla.porcentaje_base) / 100
  const tasaExtras = Number(regla.porcentaje_extras) / 100

  const subtotalExtras = Math.max(0, Number(reserva.monto_total_acordado || reserva.costo_total || 0) - Number(reserva.tarifa_base || 0));
  const nuevoTotalAcordado = Number(tarifaBase) + subtotalExtras;

  const comisionBase = Number(tarifaBase) * tasaBase;
  const comisionExtras = subtotalExtras * tasaExtras;
  const nuevaComisionTotal = Number((comisionBase + comisionExtras).toFixed(2));

  await db.schema('hospedaje').from('reservas').update({ 
    tarifa_base: Number(tarifaBase), 
    monto_total_acordado: nuevoTotalAcordado, 
    costo_total: nuevoTotalAcordado,
    monto_comision: nuevaComisionTotal 
  }).eq('id', reservaId)

  await db.schema('hospedaje').from('comisiones').update({
    monto_estancia: nuevoTotalAcordado,
    monto_comision: nuevaComisionTotal
  }).eq('reserva_id', reservaId)
    
  await db.schema('central').from('transacciones_comisiones').update({
    monto_total: nuevoTotalAcordado,
    monto_comision: nuevaComisionTotal
  }).eq('referencia_id', String(reservaId))

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/clientes')
  revalidatePath('/casasgaby/admin/finanzas')
  revalidatePath('/casasgaby/admin/operacion')
  return { success: true }
}

export async function agregarAjusteReserva(reservaId: string, tipo: 'cargo' | 'descuento', concepto: string, monto: number, esServicio: boolean = false, overrideComision?: number) {
  if (!monto || isNaN(Number(monto)) || Number(monto) <= 0) {
    throw new Error('El monto debe ser un nmero positivo mayor a cero.')
  }
  
  const supabase = await createClient()
  const db = supabase as any

  const { data: regla } = await db.schema('central').from('reglas_comisiones').select('porcentaje_base, porcentaje_extras').eq('modulo', 'hospedaje').eq('activo', true).single()
  if (!regla) throw new Error('Error contable: Regla de comisiones no encontrada en central.reglas_comisiones')
  const pComisionBase = Number(regla.porcentaje_base)
  const pComisionServicios = Number(regla.porcentaje_extras)

  let porcentaje_comision = 0;
  if (tipo === 'cargo') {
    if (overrideComision !== undefined && overrideComision !== null) {
      porcentaje_comision = overrideComision;
    } else {
      porcentaje_comision = esServicio ? pComisionServicios : pComisionBase;
    }
  }

  await db.schema('hospedaje').from('ajustes_reserva').insert({ reserva_id: reservaId, tipo, concepto, monto, porcentaje_comision, monto_comision: (monto * porcentaje_comision) / 100 })

  const { data: reserva } = await db.schema('hospedaje').from('reservas').select('tarifa_base, porcentaje_comision, ajustes_reserva(*)').eq('id', reservaId).maybeSingle()
  if (reserva) {
    const tarifaBase = Number(reserva.tarifa_base) || 0
    
  const { data: regla } = await db.schema('central').from('reglas_comisiones').select('porcentaje_base').eq('modulo', 'hospedaje').eq('activo', true).single()
  const tasaBase = regla ? Number(regla.porcentaje_base) / 100 : (Number(reserva.porcentaje_comision)/100);
  
const cargosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo') || []
    const descuentosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'descuento') || []
    const cargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    const descuentos = descuentosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    
    const nuevoTotal = Math.max(0, tarifaBase + cargos - descuentos)
    
    const comisionBaseCalculada = tarifaBase * (Number(reserva.porcentaje_comision) / 100 || (pComisionBase/100))
    const comisionCargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto_comision || 0), 0)
    const nuevoMontoComision = comisionBaseCalculada + comisionCargos
    
    await db.schema('hospedaje').from('reservas').update({ monto_total_acordado: nuevoTotal, monto_comision: nuevoMontoComision }).eq('id', reservaId)

    await db.schema('hospedaje').from('comisiones').update({
      monto_estancia: nuevoTotal,
      monto_comision: nuevoMontoComision
    }).eq('reserva_id', reservaId)
    
    await db.schema('central').from('transacciones_comisiones').update({
      monto_total: nuevoTotal,
      monto_comision: nuevoMontoComision
    }).eq('referencia_id', String(reservaId))
  }

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/clientes')
  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true }
}

export async function actualizarServicio(id: string, data: any) {
  if (data.precio_base !== undefined && data.precio_base < 0) throw new Error('El precio base no puede ser negativo')
  
  // Ignorar cualquier porcentaje_comision que intente mandarse desde el cliente
  if (data.porcentaje_comision !== undefined) {
    delete data.porcentaje_comision
  }
  
  const supabase = await createClient()
  const db = supabase as any
  await db.schema('hospedaje').from('catalogo_servicios').update(data).eq('id', id).eq('tenant_id', 'casasgaby')
  revalidatePath('/casasgaby/admin/ajustes')
  revalidatePath('/casasgaby/admin/reservas')
  return { success: true }
}

export async function eliminarServicio(id: string) {
  const supabase = await createClient()
  const db = supabase as any
  await db.schema('hospedaje').from('catalogo_servicios').delete().eq('id', id).eq('tenant_id', 'casasgaby')
  revalidatePath('/casasgaby/admin/ajustes')
  revalidatePath('/casasgaby/admin/reservas')
  return { success: true }
}


export async function actualizarCliente(clienteId: string, data: { nombre_completo: string, email: string, telefono: string }) {
  try {
    const supabase = await createClient()
    const db = supabase as any

    let codigoPais = '+52';
    let digits = (data.telefono || '').replace(/\D/g, '');
    if (digits.startsWith('52') && digits.length >= 12) {
      codigoPais = '+52';
      digits = digits.substring(2);
    } else if (digits.startsWith('34') && digits.length >= 11) {
      codigoPais = '+34';
      digits = digits.substring(2);
    } else if (digits.startsWith('1') && digits.length >= 11) {
      codigoPais = '+1';
      digits = digits.substring(1);
    }

    const { error } = await db
      .schema('hospedaje').from('clientes')
      .update({ nombre_completo: data.nombre_completo, email: data.email.trim().toLowerCase(), telefono: digits, codigo_pais: codigoPais })
      .eq('id', clienteId)

    if (error) throw new Error(error.message)

    revalidatePath('/casasgaby/admin/clientes')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al actualizar el cliente' }
  }
}

export async function fusionarClientes(origenId: string, destinoId: string) {
  try {
    const supabase = await createClient()
    const db = supabase as any

    const { error } = await db.schema('hospedaje').rpc('merge_clientes', { 
      cliente_origen_id: origenId, 
      cliente_destino_id: destinoId 
    })

    if (error) throw new Error(error.message)

    revalidatePath('/casasgaby/admin/clientes')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al fusionar clientes' }
  }
}

export async function cancelarReservaConReembolso(
  reservaId: string, 
  datosReembolso?: { 
    monto: number, 
    moneda: string, 
    metodo: string, 
    concepto: string,
    tipoCambio: number
  }
) {
  try {
    const supabase = await createClient()
    const db = supabase as any

    const { data: reserva, error: fetchErr } = await db
      .schema('hospedaje').from('reservas')
      .select('propiedad_id, cliente_id')
      .eq('id', reservaId)
      .maybeSingle()

    if (fetchErr) throw new Error('Error al buscar la reserva: ' + fetchErr.message)
    if (!reserva) throw new Error('La reserva no existe o ya fue eliminada.')

    // 1. Manejo de comisiones (Envuelto en try/catch seguro)
    try {
      const { data: comision } = await db.schema('hospedaje').from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
      if (comision) {
        await db.schema('hospedaje').from('comisiones').update({ estado_pago: 'cancelada' }).eq('id', comision.id)
      }
    } catch (err) {
      console.warn("No se pudo actualizar la comisión, continuando cancelación:", err)
    }

    // 2. Insertar transaccin de reembolso si aplica
    if (datosReembolso && datosReembolso.monto > 0) {
      const { error: transErr } = await db.schema('hospedaje').from('transacciones').insert({
        tipo: 'egreso',
        categoria: 'reembolso',
        monto: datosReembolso.monto,
        moneda: datosReembolso.moneda,
        tipo_cambio: datosReembolso.tipoCambio,
        metodo_pago: datosReembolso.metodo,
        concepto: datosReembolso.concepto || 'Reembolso por cancelacin de reserva',
        reserva_id: reservaId,
        cliente_id: reserva.cliente_id,
        propiedad_id: reserva.propiedad_id,
        fecha: new Date().toISOString()
      })
      if (transErr) throw new Error('Error insertando reembolso: ' + transErr.message)
    }

    // 3. Actualizar estado y monto_reembolsado
    const updatePayload: any = { estado: 'cancelada' }
    if (datosReembolso && datosReembolso.monto > 0) {
      updatePayload.monto_reembolsado = datosReembolso.monto
    }
    
    const { error: updateError } = await db
      .schema('hospedaje').from('reservas')
      .update(updatePayload)
      .eq('id', reservaId)

    if (updateError) throw new Error(updateError.message)

    // 4. Eliminar bloqueos de fechas
    await db
      .schema('hospedaje').from('fechas_bloqueadas')
      .delete()
      .eq('reserva_id', reservaId)

    revalidatePath('/casasgaby/admin/reservas')
    revalidatePath('/casasgaby/admin/clientes')
    if (reserva.propiedad_id) {
      revalidatePath(`/casasgaby/propiedad/${reserva.propiedad_id}`)
    }
    revalidatePath('/casasgaby/admin/finanzas')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error al cancelar reserva con reembolso:', error)
    return { success: false, error: error.message || 'Error desconocido' }
  }
}



export async function eliminarAjusteReserva(ajusteId: string, reservaId: string) {
  const supabase = await createClient()
  const db = supabase as any

  await db.schema('hospedaje').from('ajustes_reserva').delete().eq('id', ajusteId).eq('reserva_id', reservaId)

  const { data: reserva } = await db.schema('hospedaje').from('reservas').select('tarifa_base, porcentaje_comision, ajustes_reserva(*)').eq('id', reservaId).maybeSingle()
  if (reserva) {
    const tarifaBase = Number(reserva.tarifa_base) || 0
    const cargosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo') || []
    const descuentosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'descuento') || []
    const cargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    const descuentos = descuentosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    
    const nuevoTotal = Math.max(0, tarifaBase + cargos - descuentos)
    
    
    const { data: regla } = await db.schema('central').from('reglas_comisiones').select('porcentaje_base').eq('modulo', 'hospedaje').eq('activo', true).maybeSingle();
    const tasaBase = regla ? Number(regla.porcentaje_base) / 100 : 0;
  const comisionBaseCalculada = tarifaBase * (reserva.porcentaje_comision ? (Number(reserva.porcentaje_comision) / 100) : tasaBase)
    const comisionCargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto_comision || 0), 0)
    const nuevoMontoComision = comisionBaseCalculada + comisionCargos
    
    await db.schema('hospedaje').from('reservas').update({ monto_total_acordado: nuevoTotal, monto_comision: nuevoMontoComision }).eq('id', reservaId)

    await db.schema('hospedaje').from('comisiones').update({
      monto_estancia: nuevoTotal,
      monto_comision: nuevoMontoComision
    }).eq('reserva_id', reservaId)
    
    await db.schema('central').from('transacciones_comisiones').update({
      monto_total: nuevoTotal,
      monto_comision: nuevoMontoComision
    }).eq('referencia_id', String(reservaId))
  }

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/clientes')
  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true }
}

export async function crearServicio(nombre: string, descripcion: string, precio_base: number, tipo_tarifa: string, activo: boolean = true) {
  const supabase = await createClient()
  const db = supabase as any
  
  const { data: regla } = await db.schema('central').from('reglas_comisiones').select('porcentaje_extras').eq('modulo', 'hospedaje').eq('activo', true).single()
    const pComision = regla ? Number(regla.porcentaje_extras) : 0
  
  const payload = {
    tenant_id: 'casasgaby',
    nombre,
    descripcion,
    precio_base,
    tipo_tarifa,
    activo,
    porcentaje_comision: pComision
  }
  
  const { error } = await db.schema('hospedaje').from('catalogo_servicios').insert(payload)
  if (error) throw new Error(error.message)
  revalidatePath('/casasgaby/admin/ajustes')
  return { success: true }
}


export async function adelantarCheckIn(reservaId: string, notasOperativas?: string) {
  const supabase = await createClient()
  const db = supabase as any

  // 1. Obtener datos de la reserva objetivo
  const { data: reserva, error: errReserva } = await db.schema('hospedaje')
    .from('reservas')
    .select('propiedad_id, fecha_entrada, fecha_salida, propiedades(titulo)')
    .eq('id', reservaId)
    .single()
    
  if (errReserva || !reserva) return { success: false, error: 'Reserva no encontrada.' }

  const propiedadTitulo = reserva.propiedades?.titulo || 'La propiedad'

  // 2. Verificar colisión física actual en la propiedad (alguien con check-in y sin check-out)
  const { data: ocupantes, error: errOcupacion } = await db.schema('hospedaje')
    .from('reservas')
    .select('id, nombre_cliente')
    .eq('propiedad_id', reserva.propiedad_id)
    .not('check_in_real_at', 'is', null)
    .is('check_out_real_at', null)
    .neq('id', reservaId)

  if (errOcupacion) return { success: false, error: errOcupacion.message }
  if (ocupantes && ocupantes.length > 0) {
    const nombreOcupante = ocupantes[0].nombre_cliente || 'otro huésped'
    return { 
      success: false, 
      error: `Operación bloqueada: ${propiedadTitulo} se encuentra habitada actualmente por ${nombreOcupante}. Debe realizarse el check-out previo antes de ingresar un nuevo huésped.` 
    }
  }

  // 3. Calcular nueva fecha de salida preservando noches
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Cancun' }).format(new Date())
  
  // Calculate nights originally booked
  const fechaIn = new Date(reserva.fecha_entrada + 'T00:00:00')
  const fechaOut = new Date(reserva.fecha_salida + 'T00:00:00')
  const noches = Math.round((fechaOut.getTime() - fechaIn.getTime()) / (1000 * 60 * 60 * 24))
  
  // Calculate new exit date based on today
  const newFechaOut = new Date(new Date(todayStr + 'T00:00:00').getTime() + (noches * 24 * 60 * 60 * 1000))
  const newFechaOutStr = newFechaOut.toISOString().split('T')[0]

  // 4. Actualizar reserva
  const updatePayload: Record<string, any> = { 
    check_in_real_at: new Date().toISOString(),
    fecha_entrada: todayStr,
    fecha_salida: newFechaOutStr
  }
  if (notasOperativas) updatePayload.notas_operativas = notasOperativas
  
  const { error } = await db.schema('hospedaje').from('reservas').update(updatePayload).eq('id', reservaId)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/operacion')
  return { success: true }
}

export async function marcarCheckIn(reservaId: string) {
  const supabase = await createClient()
  const db = supabase as any

  const { data: reserva, error: fetchErr } = await db
    .schema('hospedaje')
    .from('reservas')
    .select('id, fecha_entrada, fecha_salida')
    .eq('id', reservaId)
    .single()

  if (fetchErr || !reserva) {
    return { success: false, error: 'No se encontró la reserva.' }
  }

  // 1. Calcular noches originales sin sesgo horario
  const [yIn, mIn, dIn] = reserva.fecha_entrada.split('-').map(Number)
  const [yOut, mOut, dOut] = reserva.fecha_salida.split('-').map(Number)
  const entradaOrig = new Date(Date.UTC(yIn, mIn - 1, dIn))
  const salidaOrig = new Date(Date.UTC(yOut, mOut - 1, dOut))
  const diffTime = salidaOrig.getTime() - entradaOrig.getTime()
  const nochesOriginales = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)))

  // 2. Obtener fecha calendario local para evitar el salto por toISOString
  const ahora = new Date()
  const y = ahora.getFullYear()
  const m = String(ahora.getMonth() + 1).padStart(2, '0')
  const d = String(ahora.getDate()).padStart(2, '0')
  const nuevaFechaEntradaStr = `${y}-${m}-${d}`

  // 3. Proyectar salida sumando exactamente las noches originales
  const salidaDate = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + nochesOriginales)
  const ySal = salidaDate.getFullYear()
  const mSal = String(salidaDate.getMonth() + 1).padStart(2, '0')
  const dSal = String(salidaDate.getDate()).padStart(2, '0')
  const nuevaFechaSalidaStr = `${ySal}-${mSal}-${dSal}`

  // 4. Guardar en base de datos
  const { error: updateErr } = await db
    .schema('hospedaje')
    .from('reservas')
    .update({
      check_in_real_at: ahora.toISOString(),
      fecha_entrada: nuevaFechaEntradaStr,
      fecha_salida: nuevaFechaSalidaStr
    })
    .eq('id', reservaId)

  if (updateErr) {
    return { success: false, error: updateErr.message }
  }

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/operacion')
  return { success: true }
}


export async function marcarCheckOut(reservaId: string) {
  const supabase = await createClient()
  const db = supabase as any
  const { error } = await db.schema('hospedaje').from('reservas').update({ check_out_real_at: new Date().toISOString() }).eq('id', reservaId)
  if (error) return { success: false, error: error.message }
  revalidatePath('/casasgaby/admin/operacion')
  return { success: true }
}

export async function liquidarSaldoRecepcion(reservaId: string, monto: number, clienteId: string, metodo: string = 'Efectivo MXN', notas: string = '', moneda: string = 'MXN', tc: number = 1) {
  monto = parseFloat(monto.toFixed(2))
  const supabase = await createClient()
  const db = supabase as any
  
  const { data: nuevaTransaccion, error: pagoErr } = await db.schema('hospedaje').from('transacciones').insert({
    reserva_id: reservaId,
    cliente_id: clienteId,
    monto: monto,
    moneda: moneda,
    metodo_pago: metodo,
    tipo_cambio: tc,
    concepto: notas || 'Liquidación/Abono en recepción',
    tipo: 'ingreso',
    categoria: 'reserva'
  }).select().single()
  if (pagoErr) return { success: false, error: pagoErr.message }

  // Update cached total in reservas
  const { data: trans } = await db.schema('hospedaje').from('transacciones').select('monto, monto_mxn, monto_acreditado').eq('reserva_id', reservaId).eq('tipo', 'ingreso')
  const totalPagado = trans?.reduce((sum: number, p: any) => sum + Number(p.monto_acreditado ?? p.monto_mxn ?? p.monto ?? 0), 0) || 0

  await db.schema('hospedaje').from('reservas').update({ monto_apartado: totalPagado }).eq('id', reservaId)

  revalidatePath('/casasgaby/admin/operacion')
  return { success: true }
}

export async function checkOutAnticipado(
  reservaId: string,
  nuevaTarifaBase: number,
  nuevoCostoTotal: number,
  nuevaFechaSalida: string,
  marcarSalida: boolean = true,
  reembolso?: { monto: number; metodo: string; concepto?: string; retenerComoPenalizacion?: boolean }
) {
  nuevaTarifaBase = parseFloat(Number(nuevaTarifaBase).toFixed(2))
  nuevoCostoTotal = parseFloat(Number(nuevoCostoTotal).toFixed(2))
  const supabase = await createClient()
  const db = supabase as any

  // 1. Obtener datos clave de la reserva previa
  const { data: reserva, error: fetchErr } = await db
    .schema('hospedaje')
    .from('reservas')
    .select('propiedad_id, cliente_id, porcentaje_comision')
    .eq('id', reservaId)
    .single()

  if (fetchErr || !reserva) {
    return { success: false, error: fetchErr?.message || 'Reserva no encontrada' }
  }

  // 2. Si se retiene el excedente como penalización, el nuevo costo total absorbe esa penalización
  let costoFinal = nuevoCostoTotal
  let montoReembolsado = 0

  if (reembolso && reembolso.monto > 0) {
    if (reembolso.retenerComoPenalizacion) {
      // El total acordado no se reduce tanto; absorbe el dinero retenido
      costoFinal = parseFloat((nuevoCostoTotal + reembolso.monto).toFixed(2))
    } else {
      // Registrar egreso real de devolución
      montoReembolsado = parseFloat(reembolso.monto.toFixed(2))
      const { error: egresoErr } = await db.schema('hospedaje').from('transacciones').insert({
        reserva_id: reservaId,
        cliente_id: reserva.cliente_id,
        propiedad_id: reserva.propiedad_id,
        monto: montoReembolsado,
        moneda: 'MXN',
        tipo_cambio: 1,
        metodo_pago: reembolso.metodo || 'Efectivo MXN',
        concepto: reembolso.concepto || 'Devolución de saldo a favor por salida anticipada',
        tipo: 'egreso',
        categoria: 'reembolso',
        fecha: new Date().toISOString()
      })
      if (egresoErr) console.error('Error insertando egreso de reembolso:', egresoErr)
    }
  }

  // 3. Preparar payload para la tabla reservas
  const payload: any = {
    tarifa_base: nuevaTarifaBase,
    costo_total: costoFinal,
    monto_total_acordado: costoFinal,
    fecha_salida: nuevaFechaSalida,
    monto_reembolsado: montoReembolsado
  }

  if (marcarSalida) {
    payload.check_out_real_at = new Date().toISOString()
  }

  const { error: updErr } = await db.schema('hospedaje').from('reservas').update(payload).eq('id', reservaId)
  if (updErr) return { success: false, error: updErr.message }

  // 4. Actualizar comisiones con la nueva base acordada
  try {
    const pComision = Number(reserva.porcentaje_comision) || 0
    const nuevaComision = parseFloat(((costoFinal * pComision) / 100).toFixed(2))

    await db.schema('hospedaje').from('reservas').update({ monto_comision: nuevaComision }).eq('id', reservaId)
    await db.schema('hospedaje').from('comisiones').update({ monto_estancia: costoFinal, monto_comision: nuevaComision }).eq('reserva_id', reservaId)
    await db.schema('central').from('transacciones_comisiones').update({ monto_total: costoFinal, monto_comision: nuevaComision }).eq('referencia_id', String(reservaId))
  } catch (comErr) {
    console.warn('Advertencia actualizando comisión tras salida anticipada:', comErr)
  }

  revalidatePath('/casasgaby/admin/operacion')
  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true }
}

export async function revertirCheckOut(reservaId: string) {
  const supabase = await createClient()
  const db = supabase as any
  const { error } = await db.schema('hospedaje').from('reservas').update({ check_out_real_at: null }).eq('id', reservaId)
  if (error) return { success: false, error: error.message }
  revalidatePath('/casasgaby/admin/operacion')
  return { success: true }
}

export async function registrarPagoComisionLote(comisionIds: string[], metodo: string = 'Transferencia') {
  try {
    if (!comisionIds || comisionIds.length === 0) {
      return { success: false, error: 'No hay comisiones seleccionadas.' }
    }
    const supabase = await createClient()
    const db = supabase as any

    const { data: comisiones, error: errFetch } = await db.schema('hospedaje').from('comisiones').select('*').in('id', comisionIds)
    if (errFetch) return { success: false, error: 'Error al buscar comisiones: ' + errFetch.message }
    if (!comisiones || comisiones.length === 0) return { success: false, error: 'Las comisiones no existen.' }

    let totalPagado = 0
    const transacciones = []
    
    // Preparar actualizaciones
    for (const comision of comisiones) {
      const saldo = Number(comision.monto_comision) - Number(comision.monto_pagado)
      if (saldo <= 0) continue // Skip ya pagadas

      const nuevoMontoPagado = Number(comision.monto_comision)
      
      const { error: errUpd } = await db.schema('hospedaje').from('comisiones').update({
        monto_pagado: nuevoMontoPagado,
        estado_pago: 'pagado',
        metodo_pago_comision: metodo,
        fecha_liquidacion: new Date().toISOString()
      }).eq('id', comision.id)

      if (errUpd) {
        console.error('Error al actualizar comision', comision.id, errUpd)
        continue
      }

      totalPagado += saldo

      transacciones.push({
        reserva_id: comision.reserva_id,
        cliente_id: comision.cliente_id,
        monto: saldo,
        moneda: 'MXN',
        tipo_cambio: 1,
        metodo_pago: metodo,
        concepto: 'Pago de comisión a gestor (Lote) - Reserva ' + comision.reserva_id,
        tipo: 'egreso',
        categoria: 'comisiones'
      })
    }

    if (transacciones.length > 0) {
      const { error: errTrans } = await db.schema('hospedaje').from('transacciones').insert(transacciones)
      if (errTrans) console.error('Error insertando egresos en transacciones:', errTrans)
    }

    revalidatePath('/casasgaby/admin/finanzas')
    return { success: true, pagadas: transacciones.length }
  } catch (e: any) {
    console.error('Excepción en registrarPagoComisionLote:', e)
    return { success: false, error: e.message || 'Error desconocido' }
  }
}

export async function cambiarEtapaSolicitud(solicitudId: string, nuevaEtapa: string, notas?: string) {
  const supabase = await createClient()
  const db = supabase as any
  
  // Here we could also save 'notas' if there's a column, or just update the state
  const updateData: any = { estado: nuevaEtapa }
  if (notas !== undefined) {
    // If you add a 'notas' column to solicitudes in the future
    // updateData.notas = notas
  }
  
  const { error } = await db.schema('hospedaje').from('solicitudes').update(updateData).eq('id', solicitudId)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/casasgaby')
  return { success: true }
}

export async function convertirSolicitudAReserva(solicitudId: string, datosReserva: any) {
  // Alias or wrapper for aprobarSolicitud
  const res = await aprobarSolicitud(
    solicitudId,
    datosReserva.montoAcordado,
    datosReserva.montoAnticipo,
    datosReserva.metodo || 'transferencia_mxn',
    datosReserva.moneda || 'MXN',
    datosReserva.tc || 1,
    datosReserva.extras || []
  )
  
  if (res && res.success) {
    // Force the state to 'convertida' instead of 'Aprobada' for CRM purposes
    const supabase = await createClient()
    const db = supabase as any
    await db.schema('hospedaje').from('solicitudes').update({ estado: 'confirmada' }).eq('id', solicitudId)
  }
  
  return res
}

export async function bloquearFechas(propiedadId: string, fechaEntrada: string, fechaSalida: string, motivo: string) {
  const supabase = await createClient()
  const db = supabase as any

  const { error } = await db.schema('hospedaje').from('reservas').insert({
    propiedad_id: propiedadId,
    nombre_cliente: `[BLOQUEO] ${motivo}`,
    telefono: '0000000000',
    email: null,
    fecha_entrada: fechaEntrada,
    fecha_salida: fechaSalida,
    costo_total: 0,
    monto_apartado: 0,
    estado: 'Activa'
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/casasgaby')
  return { success: true }
}
