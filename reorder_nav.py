import re

with open('src/components/casasgaby/admin/AdminBottomNav.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_nav = """  const navItems = [
    { href: '/casasgaby/admin', label: 'Propiedades', icon: LayoutDashboard },
    { href: '/casasgaby/admin/reservas', label: 'Reservas', icon: CalendarDays },
    { href: '/casasgaby/admin/operacion', label: 'Recepcin', icon: ClipboardCheck },
    { href: '/casasgaby/admin/clientes', label: 'Clientes', icon: Users },
    { href: '/casasgaby/admin/finanzas', label: 'Finanzas', icon: TrendingUp },
    { href: '/casasgaby/admin/ajustes', label: 'Ajustes', icon: Settings },
  ]"""

# Sometimes file read gets weird encoding issues with 'Recepción' -> 'Recepcin'
# To be safe, let's use regex to replace the array block

new_nav = """  const navItems = [
    { href: '/casasgaby/admin', label: 'Propiedades', icon: LayoutDashboard },
    { href: '/casasgaby/admin/clientes', label: 'Clientes', icon: Users },
    { href: '/casasgaby/admin/reservas', label: 'Reservas', icon: CalendarDays },
    { href: '/casasgaby/admin/operacion', label: 'In-House', icon: ClipboardCheck },
    { href: '/casasgaby/admin/finanzas', label: 'Finanzas', icon: TrendingUp },
    { href: '/casasgaby/admin/ajustes', label: 'Ajustes', icon: Settings },
  ]"""

# Using regex to replace the whole `const navItems = [ ... ]`
pattern = re.compile(r'const navItems = \[[^\]]+\]', re.DOTALL)
content = pattern.sub(new_nav, content)

with open('src/components/casasgaby/admin/AdminBottomNav.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
