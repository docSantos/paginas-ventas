'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CalendarDays, Settings, LogOut, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export function AdminBottomNav() {
  const pathname = usePathname()
  const supabase = createClient()

  const navItems = [
    { href: '/casasgaby/admin', label: 'Propiedades', icon: LayoutDashboard },
    { href: '/casasgaby/admin/reservas', label: 'Reservas', icon: CalendarDays },
    { href: '/casasgaby/admin/finanzas', label: 'Finanzas', icon: TrendingUp },
    { href: '/casasgaby/admin/ajustes', label: 'Ajustes', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/casasgaby/admin/login'
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-0 flex-1',
                isActive ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5px]')} aria-hidden="true" />
              <span className={cn('text-[10px] sm:text-xs font-medium truncate', isActive && 'font-semibold')}>
                {item.label}
              </span>
            </Link>
          )
        })}
        
        <button 
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-0 flex-1 text-gray-500 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" aria-hidden="true" />
          <span className="text-[10px] sm:text-xs font-medium truncate">Salir</span>
        </button>
      </div>
    </nav>
  )
}
