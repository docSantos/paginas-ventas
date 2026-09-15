import { ReactNode } from 'react'
import { AdminBottomNav } from '@/components/casasgaby/admin/AdminBottomNav'
import { createClient } from '@/lib/supabase/server'
import { LoginClient } from './login/LoginClient'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-extrabold text-teal-600 mb-2">Casas Gaby</h1>
        </div>
        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl border border-gray-100 sm:px-10">
            <LoginClient />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      <main className="flex-1 overflow-auto p-4 md:p-8 max-w-5xl mx-auto w-full">
        {children}
      </main>
      <AdminBottomNav />
    </div>
  )
}
