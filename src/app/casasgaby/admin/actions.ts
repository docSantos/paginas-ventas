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

export async function aprobarSolicitud(solicitudId: string) {
  const supabase = await createClient()
  const db = supabase as any

  const { data: solicitud, error: errorSol } = await db
    .from('solicitudes')
    .select('*')
    .eq('id', solicitudId)
    .single()

  if (errorSol || !solicitud) throw new Error('Solicitud no encontrada')
  if (solicitud.estado !== 'Pendiente') throw new Error('La solicitud ya fue procesada')

  const { error: errorRes } = await db
    .from('reservas')
    .insert({
      propiedad_id: solicitud.propiedad_id,
      nombre_cliente: solicitud.nombre_cliente,
      email: solicitud.email,
      telefono: solicitud.telefono,
      fecha_entrada: solicitud.fecha_entrada,
      fecha_salida: solicitud.fecha_salida,
      costo_total: solicitud.costo_total || 0,
      monto_apartado: solicitud.monto_apartado || 0,
      num_huespedes: solicitud.num_huespedes || 1,
      notas: solicitud.notas || '',
      estado: 'Activa'
    })

  if (errorRes) throw new Error('Error al crear la reserva: ' + errorRes.message)

  const { error: errorUpd } = await db
    .from('solicitudes')
    .update({ estado: 'Aprobada' })
    .eq('id', solicitudId)

  if (errorUpd) throw new Error('Error al actualizar la solicitud')

  revalidatePath('/casasgaby/admin/reservas')
  revalidatePath(`/casasgaby/propiedad/${solicitud.propiedad_id}`)
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
