import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { FinanzasClient } from '@/components/casasgaby/admin/FinanzasClient'

export default async function FinanzasPage() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/casasgaby/admin/login')
  }

  const db = supabase as any

  // Traer propiedades para calcular métricas base
  const { data: propiedades } = await db.from('propiedades').select('*')
  
  // Traer reservas confirmadas
  const { data: reservas } = await db.from('reservas').select('*').eq('estado', 'Activa')

  // Traer historial de pagos
  const { data: pagos } = await db.from('pagos_reservas').select('*')

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">CRM / Inteligencia Financiera</h1>
      <p className="text-gray-500">Métricas de ingresos, saldos por cobrar y costo de oportunidad.</p>

      <FinanzasClient 
        propiedades={propiedades || []} 
        reservas={reservas || []} 
        pagos={pagos || []} 
      />
    </div>
  )
}
