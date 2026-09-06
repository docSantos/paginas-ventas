import re

with open('src/components/casasgaby/admin/AdminBottomNav.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { LayoutDashboard, CalendarDays, Settings, LogOut, TrendingUp, Users } from 'lucide-react'", "import { LayoutDashboard, CalendarDays, Settings, LogOut, TrendingUp, Users, ClipboardCheck } from 'lucide-react'")

old_nav = """  const navItems = [
    { href: '/casasgaby/admin', label: 'Propiedades', icon: LayoutDashboard },
    { href: '/casasgaby/admin/reservas', label: 'Reservas', icon: CalendarDays },
    { href: '/casasgaby/admin/clientes', label: 'Clientes', icon: Users },
    { href: '/casasgaby/admin/finanzas', label: 'Finanzas', icon: TrendingUp },
    { href: '/casasgaby/admin/ajustes', label: 'Ajustes', icon: Settings },
  ]"""

new_nav = """  const navItems = [
    { href: '/casasgaby/admin', label: 'Propiedades', icon: LayoutDashboard },
    { href: '/casasgaby/admin/reservas', label: 'Reservas', icon: CalendarDays },
    { href: '/casasgaby/admin/operacion', label: 'Operación', icon: ClipboardCheck },
    { href: '/casasgaby/admin/clientes', label: 'Clientes', icon: Users },
    { href: '/casasgaby/admin/finanzas', label: 'Finanzas', icon: TrendingUp },
    { href: '/casasgaby/admin/ajustes', label: 'Ajustes', icon: Settings },
  ]"""

content = content.replace(old_nav, new_nav)

with open('src/components/casasgaby/admin/AdminBottomNav.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
