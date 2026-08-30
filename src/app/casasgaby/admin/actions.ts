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

export async function saveProperty(data: any, id?: string) {
  const supabase = await getSupabaseServerClient()
  
  if (id) {
    const { error } = await supabase
      .from('propiedades')
      .update(data)
      .eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('propiedades')
      .insert([data])
    if (error) throw new Error(error.message)
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
  tc: number
) {
  const supabase = await createClient()
  const db = supabase as any

  const { data: solicitud, error: errorSol } = await db
    .from('solicitudes')
    .select('*')
    .eq('id', solicitudId)
    .single()

  if (errorSol || !solicitud) throw new Error('Solicitud no encontrada')
  if (solicitud.estado !== 'Pendiente') throw new Error('La solicitud ya fue procesada')

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
      monto_apartado: montoAnticipo, // Maintain compatibility cache
      porcentaje_comision: 2.50,
      monto_comision: montoAcordado * 0.025,
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
    const { error: pagoErr } = await db.from('pagos_reservas').insert({
      reserva_id: reserva.id,
      monto: montoAnticipo,
      moneda: moneda,
      metodo_pago: metodo,
      tipo_cambio: tc,
      monto_equivalente_mxn: equivalenteMXN,
      notas: 'Anticipo inicial'
    })
    if (pagoErr) throw new Error('Error al registrar pago: ' + pagoErr.message)
  }

  const { error: errorUpd } = await db
    .from('solicitudes')
    .update({ estado: 'Aprobada' })
    .eq('id', solicitudId)

  if (errorUpd) throw new Error('Error al actualizar la solicitud')

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath(`/casasgaby/propiedad/${solicitud.propiedad_id}`)
  return { success: true }
}

export async function registrarComisionPagada(reservaId: string, montoPagado: number, notas: string = '') {
  const supabase = await createClient()
  const db = supabase as any

  // Get current
  const { data: reserva, error: errFetch } = await db.from('reservas').select('monto_comision, comision_pagada').eq('id', reservaId).single()
  if (errFetch || !reserva) throw new Error('Reserva no encontrada')

  const nuevoTotal = (Number(reserva.comision_pagada) || 0) + montoPagado
  const estado = nuevoTotal >= Number(reserva.monto_comision) ? 'liquidada' : 'parcial'

  const { error: errUpd } = await db.from('reservas').update({
    comision_pagada: nuevoTotal,
    estado_comision: estado
  }).eq('id', reservaId)

  if (errUpd) throw new Error('Error al registrar comisión: ' + errUpd.message)

  revalidatePath('/casasgaby/admin/reservas')
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
  const supabase = await createClient()
  const db = supabase as any

  const equivalenteMXN = moneda === 'USD' ? monto * tc : monto;

  const { error: pagoErr } = await db.from('pagos_reservas').insert({
    reserva_id: reservaId,
    monto: monto,
    moneda: moneda,
    metodo_pago: metodo,
    tipo_cambio: tc,
    monto_equivalente_mxn: equivalenteMXN,
    notas: notas
  })
  if (pagoErr) throw new Error('Error al registrar abono: ' + pagoErr.message)

  // Update cached total in reservas
  const { data: pagos } = await db.from('pagos_reservas').select('monto_equivalente_mxn').eq('reserva_id', reservaId)
  const totalPagado = pagos?.reduce((sum: number, p: any) => sum + Number(p.monto_equivalente_mxn), 0) || 0

  await db.from('reservas').update({ monto_apartado: totalPagado }).eq('id', reservaId)

  revalidatePath('/casasgaby/admin/reservas')
  return { success: true }
}

export async function cancelarReserva(reservaId: string) {
  const supabase = await createClient()
  const db = supabase as any

  const { data: reserva, error: fetchErr } = await db
    .from('reservas')
    .select('propiedad_id')
    .eq('id', reservaId)
    .single()

  if (fetchErr) throw new Error('Error al buscar la reserva: ' + fetchErr.message)

  const { error } = await db
    .from('reservas')
    .delete()
    .eq('id', reservaId)

  if (error) throw new Error('Error al cancelar: ' + error.message)

  revalidatePath('/casasgaby/admin/reservas')
  if (reserva?.propiedad_id) {
    revalidatePath(`/casasgaby/propiedad/${reserva.propiedad_id}`)
  }
  return { success: true }
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
