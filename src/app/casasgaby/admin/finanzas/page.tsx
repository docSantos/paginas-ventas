import { Suspense } from 'react'
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
  const { data: propiedades } = await db.schema('hospedaje').from('propiedades').select('*').eq('activa', true)
  
  // Traer reservas confirmadas
  const { data: reservas } = await db.schema('hospedaje').from('reservas').select('*').eq('estado', 'Activa')

  // Traer historial de pagos
  const { data: pagos } = await db.schema('hospedaje').from('transacciones').select('*, reservas(nombre_cliente, propiedades(titulo))').eq('tipo', 'ingreso').order('created_at', { ascending: false })

  // Traer comisiones
  const { data: comisiones } = await db.schema('hospedaje').from('comisiones').select('*, propiedades(titulo), reservas(fecha_entrada, nombre_cliente)').order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Libro Mayor Financiero</h1>
      <p className="text-gray-500">Métricas de ingresos, saldos pendientes por liquidar, costo de oportunidad y comisiones a gestores.</p>

      <Suspense fallback={<div className="p-8 text-center text-gray-500">Cargando libro mayor...</div>}>
        <FinanzasClient 
          propiedades={propiedades || []} 
          reservas={reservas || []} 
          pagos={pagos || []} 
          comisiones={comisiones || []}
        />
      </Suspense>
    </div>
  )
}
