import { Metadata } from 'next'
import { LogoutButton } from '@/components/casasgaby/admin/LogoutButton'
import { LayoutDashboard, Users, CalendarDays, ShieldAlert } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop (Oculto en móvil) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-teal-600">Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/casasgaby/admin" className="flex items-center gap-3 px-3 py-2 bg-teal-50 text-teal-700 rounded-lg font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Propiedades
          </Link>
          <Link href="/casasgaby/admin/solicitudes" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
            <Users className="w-5 h-5" />
            Solicitudes
          </Link>
          <Link href="/casasgaby/admin/calendario" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
            <CalendarDays className="w-5 h-5" />
            Calendario
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between md:hidden">
          <h1 className="font-bold text-lg text-gray-900">Admin Dashboard</h1>
          <div className="w-8">
            <LogoutButton />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {isDemo && (
            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />
              <div>
                <h3 className="font-semibold text-amber-900">Modo Demo Activo (Sin Seguridad)</h3>
                <p className="text-sm mt-1">
                  Las credenciales de Supabase no están configuradas. El middleware ha sido puenteado para previsualización.
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
        </div>
      </main>
    </div>
  )
}
