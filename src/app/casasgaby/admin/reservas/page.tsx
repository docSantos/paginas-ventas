import { isSupabaseConfigured, createClient } from '@/lib/supabase/server'
import { ReservasClient } from '@/components/casasgaby/admin/ReservasClient'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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

  // 1. Obtener solicitudes (join con propiedades para obtener el titulo)
  const { data: solicitudes } = await supabase
    .from('solicitudes')
    .select(`
      *,
      propiedades ( titulo )
    `)
    .order('created_at', { ascending: false })

  // 2. Obtener reservas (join con propiedades)
  const { data: reservas } = await supabase
    .from('reservas')
    .select(`
      *,
      propiedades ( titulo )
    `)
    .eq('estado', 'Activa')
    .order('fecha_entrada', { ascending: true })

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen bg-gray-50">
      <Link href="/casasgaby/admin" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Volver al Dashboard
      </Link>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Reservas</h1>
        <p className="text-gray-500 mt-1">Aprueba solicitudes y bloquea fechas en el calendario.</p>
      </div>

      <ReservasClient 
        solicitudes={solicitudes || []} 
        reservas={reservas || []} 
      />
    </div>
  )
}
