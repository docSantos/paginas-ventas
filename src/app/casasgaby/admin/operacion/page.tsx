import { isSupabaseConfigured, createClient } from '@/lib/supabase/server'
import { OperacionClient } from '@/components/casasgaby/admin/OperacionClient'

export const metadata = {
  title: 'Operación In-House - Admin',
}

export default async function OperacionPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Operación In-House</h1>
        <div className="bg-amber-50 p-4 rounded-xl text-amber-800">
          Esta función requiere configuración de Supabase.
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  const { data: reservas } = await supabase
    .schema('hospedaje').from('reservas')
    .select(`*, propiedades ( id, titulo ), transacciones (*)`)
    .eq('estado', 'Activa')
    .order('fecha_entrada', { ascending: true })

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Operación In-House</h1>
        <p className="text-gray-500 mt-1">Recepción del día a día, llegadas y huéspedes en vivo.</p>
      </div>

      <OperacionClient reservas={reservas || []} />
    </>
  )
}
