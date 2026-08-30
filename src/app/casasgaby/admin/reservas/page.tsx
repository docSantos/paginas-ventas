import { isSupabaseConfigured, createClient } from '@/lib/supabase/server'
import { ReservasClient } from '@/components/casasgaby/admin/ReservasClient'

export const metadata = {
  title: 'Gestión de Reservas - Admin',
}

export default async function ReservasPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Reservas</h1>
        <div className="bg-amber-50 p-4 rounded-xl text-amber-800">
          Esta función requiere configuración de Supabase.
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  const { data: solicitudes } = await supabase
    .from('solicitudes')
    .select(`*, propiedades ( titulo )`)
    .order('created_at', { ascending: false })

  const { data: reservas } = await supabase
    .from('reservas')
    .select(`*, propiedades ( id, titulo, precio_por_noche, precio_por_semana, precio_por_mes )`)
    .eq('estado', 'Activa')
    .order('fecha_entrada', { ascending: true })

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Reservas</h1>
        <p className="text-gray-500 mt-1">Aprueba solicitudes y bloquea fechas en el calendario.</p>
      </div>

      <ReservasClient 
        solicitudes={solicitudes || []} 
        reservas={reservas || []} 
      />
    </>
  )
}
