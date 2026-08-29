'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url') {
      router.push('/casasgaby/admin/login')
      return
    }

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    await supabase.auth.signOut()
    router.refresh()
    router.push('/casasgaby/admin/login')
  }

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full"
      title="Cerrar sesión"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden md:inline">Cerrar Sesión</span>
    </button>
  )
}
