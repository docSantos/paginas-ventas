import { PropertyForm } from '../PropertyForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Nueva Propiedad - Admin',
}

import { createClient } from '@/lib/supabase/server'

export default async function NuevaPropiedadPage() {
  const supabase = await createClient()
  const { data: serviciosCatalogo } = await supabase.schema('hospedaje').from('catalogo_servicios').select('*').eq('tenant_id', 'casasgaby').eq('activo', true)
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/casasgaby/admin" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Volver al Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Registrar Nueva Casa</h1>
        <PropertyForm serviciosCatalogo={serviciosCatalogo || []} initialServiciosIds={[]} />
      </div>
    </div>
  )
}
