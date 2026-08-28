// src/components/casasgaby/Header.tsx
'use client'

import Link from 'next/link'
import { Home, Menu } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-14 px-4 max-w-2xl mx-auto">
        {/* Logo */}
        <Link href="/casasgaby" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-base leading-tight">
            Casas<span className="text-teal-600">Gaby</span>
          </span>
        </Link>

        {/* Botón menú (futuro drawer) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
          className={cn(
            'w-9 h-9 flex items-center justify-center rounded-xl transition-colors',
            'hover:bg-gray-100 active:bg-gray-200',
            menuOpen && 'bg-gray-100'
          )}
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Mini menú desplegable (placeholder para Fase 2) */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 space-y-1 max-w-2xl mx-auto">
          <Link
            href="/casasgaby"
            className="block py-2 px-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMenuOpen(false)}
          >
            🏠 Catálogo de Casas
          </Link>
          <Link
            href="/casasgaby/solicitudes"
            className="block py-2 px-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMenuOpen(false)}
          >
            📋 Mis Solicitudes
          </Link>
          <Link
            href="/casasgaby/admin"
            className="block py-2 px-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMenuOpen(false)}
          >
            ⚙️ Panel Admin
          </Link>
        </div>
      )}
    </header>
  )
}
