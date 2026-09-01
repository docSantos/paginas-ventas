import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientesClient from '@/components/casasgaby/admin/ClientesClient'

export const dynamic = 'force-dynamic'

export default async function ClientesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/casasgaby/admin/login')
  }

  // Fetch clientes with reservations and transactions
  const { data: clientes } = await supabase
    .from('clientes')
    .select('*, reservas(*, propiedades(titulo), transacciones(*)), transacciones(*)')
    .order('codigo_numero', { ascending: true })

  return <ClientesClient clientes={clientes || []} />
}
