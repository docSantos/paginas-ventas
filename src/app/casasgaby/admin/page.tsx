import { Metadata } from 'next'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { isSupabaseConfigured, createClient } from '@/lib/supabase/server'
import { PropertyListClient } from './PropertyListClient'
import { MOCK_PROPIEDADES } from '@/types/casasgaby'

export const metadata: Metadata = {
  title: 'Dashboard - Casas Gaby',
}

export default async function AdminDashboardPage() {
  const isDemo = !isSupabaseConfigured()
  let propiedades = MOCK_PROPIEDADES

  if (!isDemo) {
    const supabase = await createClient()
    const { data } = await supabase.from('propiedades').select('*').order('created_at', { ascending: false })
    if (data) propiedades = data
  }

  return (
    <>
      {isDemo && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />
          <div>
            <h3 className="font-semibold text-amber-900">Modo Demo Activo (Sin Seguridad)</h3>
            <p className="text-sm mt-1">
              Las credenciales de Supabase no están configuradas.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Propiedades</h2>
          <p className="text-gray-500 text-sm">Gestiona el catálogo de casas vacacionales</p>
        </div>
        <Link 
          href="/casasgaby/admin/propiedades/nueva" 
          className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 text-sm"
        >
          + Nueva Propiedad
        </Link>
      </div>

      <PropertyListClient propiedades={propiedades} />
    </>
  )
}
