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
    .from('propiedades')
    .update({ activa: !currentStatus })
    .eq('id', id)
    
  if (error) throw new Error(error.message)
  
  revalidatePath('/casasgaby/admin')
  revalidatePath('/casasgaby')
}

export async function deleteProperty(id: string) {
  const supabase = await getSupabaseServerClient()
  
  const { error } = await supabase
    .from('propiedades')
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
      .from('propiedades')
      .update(data)
      .eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { data: newData, error } = await supabase
      .from('propiedades')
      .insert([data])
      .select('id')
      .single()
    if (error) throw new Error(error.message)
    propId = newData.id
  }
  
  // Sync servicios
  if (propId && serviciosIds !== undefined) {
    // 1. Marcar todos como no disponibles primero
    await supabase.from('propiedad_servicios').update({ disponible: false }).eq('propiedad_id', propId);
    
    // 2. Insertar o actualizar los seleccionados a true
    for (const sId of serviciosIds) {
      const { data: exists } = await supabase.from('propiedad_servicios').select('id').eq('propiedad_id', propId).eq('servicio_id', sId).maybeSingle();
      if (exists) {
        await supabase.from('propiedad_servicios').update({ disponible: true }).eq('id', exists.id);
      } else {
        await supabase.from('propiedad_servicios').insert({ propiedad_id: propId, servicio_id: sId, disponible: true });
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

  const { data: clienteId, error: errCliente } = await db.rpc('upsert_cliente_reserva', {
    p_tenant_id: 'casasgaby',
    p_nombre: solicitud.nombre_cliente || solicitud.nombre_completo || solicitud.nombre || 'Huésped',
    p_email: solicitud.email || solicitud.email_cliente || '',
    p_telefono: phoneDigits
  })

  if (errCliente || !clienteId) {
    console.error('Error al resolver cliente:', errCliente)
    throw new Error('No se pudo vincular o crear el cliente.')
  }
  
  await db.from('clientes').update({ codigo_pais: codigoPais, telefono: phoneDigits }).eq('id', clienteId);
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
}

export async function registrarComisionPagada(reservaId: string, montoPagado: number, notas: string = '') {
  if (!montoPagado || isNaN(Number(montoPagado)) || Number(montoPagado) <= 0) throw new Error('El monto debe ser un número positivo mayor a cero.');
  const supabase = await createClient()
  const db = supabase as any

  // Get current
  const { data: reserva, error: errFetch } = await db.from('reservas').select('monto_comision, comision_pagada').eq('id', reservaId).maybeSingle()
  if (errFetch) throw new Error('Error al buscar reserva: ' + errFetch.message)
    if (!reserva) return { success: false, message: 'La reserva no existe o ya fue eliminada.' }

  const nuevoTotal = (Number(reserva.comision_pagada) || 0) + montoPagado
  const estado = nuevoTotal >= Number(reserva.monto_comision) ? 'liquidada' : 'parcial'

    const { error: errUpd } = await db.from('reservas').update({
    comision_pagada: nuevoTotal,
    estado_comision: estado
  }).eq('id', reservaId)

  // Sync to comisiones table
  const { data: com } = await db.from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
  if (com) {
    await db.from('comisiones').update({
      monto_pagado: nuevoTotal,
      estado_pago: estado === 'liquidada' ? 'liquidado' : estado
    }).eq('id', com.id)
  }

  if (errUpd) throw new Error('Error al registrar comisión: ' + errUpd.message)

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true }
}


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
  revalidatePath('/casasgaby/admin/clientes')
  return { success: true }
}

export async function cancelarReserva(reservaId: string) {
  try {
    const supabase = await createClient()
    const db = supabase as any

    // 1. Obtener datos de la reserva
    const { data: reserva, error: fetchErr } = await db
      .from('reservas')
      .select('propiedad_id')
      .eq('id', reservaId)
      .maybeSingle()

    if (fetchErr) throw new Error('Error al buscar la reserva: ' + fetchErr.message)
    if (!reserva) throw new Error('La reserva no existe o ya fue eliminada.')

    // 2. Lógica de cancelación con comisiones (Envuelto en try/catch)
    try {
      const { data: comision } = await db.from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
      if (comision) {
        await db.from('comisiones').update({ estado_pago: 'cancelada' }).eq('id', comision.id)
      }
    } catch (err) {
      console.warn("No se pudo actualizar la comisión, continuando cancelación:", err)
    }

    // 3. Actualizar estado a cancelada
    const { error: updateError } = await db
      .from('reservas')
      .update({ estado: 'cancelada' })
      .eq('id', reservaId)

    if (updateError) throw new Error(updateError.message)

    // 4. Eliminar bloqueos de fechas asociados
    await db
      .from('fechas_bloqueadas')
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
    .from('solicitudes')
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
    .from('reservas')
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
    .from('reservas')
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

  const { data: canceladas } = await db.from('comisiones')
    .select('*')
    .eq('estado_pago', 'cancelada').gt('monto_pagado', 0)
    .order('created_at', { ascending: true })

  if (!canceladas || canceladas.length === 0) throw new Error('No hay saldo a favor disponible')

  for (const c of canceladas) {
    if (remaining <= 0) break;
    
    const disponible = Number(c.monto_pagado)
    const tomar = Math.min(disponible, remaining)
    
    const nuevoMontoCancelada = disponible - tomar
    await db.from('comisiones').update({
      monto_pagado: nuevoMontoCancelada,
      estado_pago: 'cancelada'
    }).eq('id', c.id)

    remaining -= tomar
  }

  const abonado = montoRequerido - remaining

  const { data: activa } = await db.from('comisiones').select('*').eq('id', comisionActivaId).maybeSingle()
  if (activa) {
    const nuevoMontoPagado = Number(activa.monto_pagado) + abonado
    const estadoPago = nuevoMontoPagado >= Number(activa.monto_comision) ? 'liquidado' : 'parcial'
    
    await db.from('comisiones').update({
      monto_pagado: nuevoMontoPagado,
      estado_pago: estadoPago,
      fecha_liquidacion: estadoPago === 'liquidado' ? new Date().toISOString() : null,
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

  const { data: reserva } = await db.from('reservas').select('porcentaje_comision, ajustes_reserva(*)').eq('id', reservaId).maybeSingle()
  if (!reserva) throw new Error('Reserva no encontrada')

  const cargosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo') || []
  const descuentosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'descuento') || []
  
  const cargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
  const descuentos = descuentosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
  
  const nuevoTotal = Math.max(0, tarifaBase + cargos - descuentos)

  const comisionBaseCalculada = tarifaBase * (Number(reserva.porcentaje_comision) / 100 || 0.025)
  const comisionCargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto_comision || 0), 0)
  const nuevoMontoComision = comisionBaseCalculada + comisionCargos

  await db.from('reservas').update({ tarifa_base: tarifaBase, monto_total_acordado: nuevoTotal, monto_comision: nuevoMontoComision }).eq('id', reservaId)

  await db.from('comisiones').update({
    monto_estancia: nuevoTotal,
    monto_comision: nuevoMontoComision
  }).eq('reserva_id', reservaId)

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/clientes')
  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true }
}

export async function agregarAjusteReserva(reservaId: string, tipo: 'cargo' | 'descuento', concepto: string, monto: number, esServicio: boolean = false, overrideComision?: number) {
  if (!monto || isNaN(Number(monto)) || Number(monto) <= 0) {
    throw new Error('El monto debe ser un nmero positivo mayor a cero.')
  }
  
  const supabase = await createClient()
  const db = supabase as any

  const { data: tenant } = await db.from('tenants_config').select('porcentaje_comision_base, comision_servicios_porcentaje').eq('id', 'casasgaby').maybeSingle()
  const pComisionBase = tenant?.porcentaje_comision_base ? Number(tenant.porcentaje_comision_base) : 2.50
  const pComisionServicios = tenant?.comision_servicios_porcentaje ? Number(tenant.comision_servicios_porcentaje) : 5.00

  let porcentaje_comision = 0;
  if (tipo === 'cargo') {
    if (overrideComision !== undefined && overrideComision !== null) {
      porcentaje_comision = overrideComision;
    } else {
      porcentaje_comision = esServicio ? pComisionServicios : pComisionBase;
    }
  }

  await db.from('ajustes_reserva').insert({ reserva_id: reservaId, tipo, concepto, monto, porcentaje_comision, monto_comision: (monto * porcentaje_comision) / 100 })

  const { data: reserva } = await db.from('reservas').select('tarifa_base, porcentaje_comision, ajustes_reserva(*)').eq('id', reservaId).maybeSingle()
  if (reserva) {
    const tarifaBase = Number(reserva.tarifa_base) || 0
    const cargosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo') || []
    const descuentosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'descuento') || []
    const cargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    const descuentos = descuentosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    
    const nuevoTotal = Math.max(0, tarifaBase + cargos - descuentos)
    
    const comisionBaseCalculada = tarifaBase * (Number(reserva.porcentaje_comision) / 100 || (pComisionBase/100))
    const comisionCargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto_comision || 0), 0)
    const nuevoMontoComision = comisionBaseCalculada + comisionCargos
    
    await db.from('reservas').update({ monto_total_acordado: nuevoTotal, monto_comision: nuevoMontoComision }).eq('id', reservaId)

    await db.from('comisiones').update({
      monto_estancia: nuevoTotal,
      monto_comision: nuevoMontoComision
    }).eq('reserva_id', reservaId)
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
  await db.from('catalogo_servicios').update(data).eq('id', id).eq('tenant_id', 'casasgaby')
  revalidatePath('/casasgaby/admin/ajustes')
  revalidatePath('/casasgaby/admin/reservas')
  return { success: true }
}

export async function eliminarServicio(id: string) {
  const supabase = await createClient()
  const db = supabase as any
  await db.from('catalogo_servicios').delete().eq('id', id).eq('tenant_id', 'casasgaby')
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
      .from('clientes')
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

    const { error } = await db.rpc('merge_clientes', { 
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
      .from('reservas')
      .select('propiedad_id, cliente_id')
      .eq('id', reservaId)
      .maybeSingle()

    if (fetchErr) throw new Error('Error al buscar la reserva: ' + fetchErr.message)
    if (!reserva) throw new Error('La reserva no existe o ya fue eliminada.')

    // 1. Manejo de comisiones (Envuelto en try/catch seguro)
    try {
      const { data: comision } = await db.from('comisiones').select('*').eq('reserva_id', reservaId).maybeSingle()
      if (comision) {
        await db.from('comisiones').update({ estado_pago: 'cancelada' }).eq('id', comision.id)
      }
    } catch (err) {
      console.warn("No se pudo actualizar la comisión, continuando cancelación:", err)
    }

    // 2. Insertar transaccin de reembolso si aplica
    if (datosReembolso && datosReembolso.monto > 0) {
      const { error: transErr } = await db.from('transacciones').insert({
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
      .from('reservas')
      .update(updatePayload)
      .eq('id', reservaId)

    if (updateError) throw new Error(updateError.message)

    // 4. Eliminar bloqueos de fechas
    await db
      .from('fechas_bloqueadas')
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

  await db.from('ajustes_reserva').delete().eq('id', ajusteId).eq('reserva_id', reservaId)

  const { data: reserva } = await db.from('reservas').select('tarifa_base, porcentaje_comision, ajustes_reserva(*)').eq('id', reservaId).maybeSingle()
  if (reserva) {
    const tarifaBase = Number(reserva.tarifa_base) || 0
    const cargosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo') || []
    const descuentosList = reserva.ajustes_reserva?.filter((a: any) => a.tipo === 'descuento') || []
    const cargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    const descuentos = descuentosList.reduce((acc: number, a: any) => acc + Number(a.monto), 0)
    
    const nuevoTotal = Math.max(0, tarifaBase + cargos - descuentos)
    
    const comisionBaseCalculada = tarifaBase * (Number(reserva.porcentaje_comision) / 100 || 0.025)
    const comisionCargos = cargosList.reduce((acc: number, a: any) => acc + Number(a.monto_comision || 0), 0)
    const nuevoMontoComision = comisionBaseCalculada + comisionCargos
    
    await db.from('reservas').update({ monto_total_acordado: nuevoTotal, monto_comision: nuevoMontoComision }).eq('id', reservaId)

    await db.from('comisiones').update({
      monto_estancia: nuevoTotal,
      monto_comision: nuevoMontoComision
    }).eq('reserva_id', reservaId)
  }

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath('/casasgaby/admin/clientes')
  revalidatePath('/casasgaby/admin/finanzas')
  return { success: true }
}

export async function crearServicio(nombre: string, descripcion: string, precio_base: number, tipo_tarifa: string, activo: boolean = true) {
  const supabase = await createClient()
  const db = supabase as any
  
  const { data: tenant } = await db.from('tenants_config').select('comision_servicios_porcentaje').eq('id', 'casasgaby').maybeSingle()
  const pComision = tenant?.comision_servicios_porcentaje ? Number(tenant.comision_servicios_porcentaje) : 5.0
  
  const payload = {
    tenant_id: 'casasgaby',
    nombre,
    descripcion,
    precio_base,
    tipo_tarifa,
    activo,
    porcentaje_comision: pComision
  }
  
  const { error } = await db.from('catalogo_servicios').insert(payload)
  if (error) throw new Error(error.message)
  revalidatePath('/casasgaby/admin/ajustes')
  return { success: true }
}

