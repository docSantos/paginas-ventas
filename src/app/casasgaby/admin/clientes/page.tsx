import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientesClient from '@/components/casasgaby/admin/ClientesClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ClientesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/casasgaby/admin/login')
  }

  // Fetch clientes with reservations and transactions
  const { data: clientes } = await supabase
    .schema('hospedaje').from('clientes')
    .select('*, reservas(*, propiedades(titulo), transacciones(*)), transacciones(*)')
    .order('codigo_numero', { ascending: true })

  // Fetch solicitudes para el embudo CRM
  const { data: solicitudes } = await supabase
    .schema('hospedaje').from('solicitudes')
    .select('*, propiedades(titulo)')
    .order('created_at', { ascending: false })

  // Fetch reservas confirmadas para detección de colisiones en el CRM
  const { data: reservasConfirmadas } = await supabase
    .schema('hospedaje').from('reservas')
    .select('id, propiedad_id, fecha_entrada, fecha_salida, estado')
    .in('estado', ['Activa', 'confirmada', 'activa'])

  // Fetch servicios adicionales
  const { data: servicios } = await supabase
    .schema('hospedaje').from('catalogo_servicios')
    .select('*')
    .eq('tenant_id', 'casasgaby')
    .eq('activo', true)

  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Cargando directorio...</div>}>
      <ClientesClient
        clientes={clientes || []}
        solicitudes={solicitudes || []}
        reservasConfirmadas={reservasConfirmadas || []}
        servicios={servicios || []}
      />
    </Suspense>
  )
}
