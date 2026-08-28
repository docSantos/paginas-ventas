// src/components/casasgaby/BottomNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, CalendarDays, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/casasgaby',          label: 'Inicio',     icon: Home },
  { href: '/casasgaby/buscar',   label: 'Buscar',     icon: Search },
  { href: '/casasgaby/reservas', label: 'Reservas',   icon: CalendarDays },
  { href: '/casasgaby/admin',    label: 'Admin',      icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/casasgaby' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-0 flex-1',
                isActive
                  ? 'text-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon
                className={cn('w-5 h-5', isActive && 'stroke-[2.5px]')}
                aria-hidden="true"
              />
              <span className={cn('text-xs font-medium truncate', isActive && 'font-semibold')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
