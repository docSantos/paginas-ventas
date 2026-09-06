import re

with open('src/components/casasgaby/admin/AdminBottomNav.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add ClipboardCheck to lucide-react imports
content = re.sub(
    r"import { LayoutDashboard, CalendarDays, Settings, LogOut, TrendingUp, Users } from 'lucide-react'",
    r"import { LayoutDashboard, CalendarDays, Settings, LogOut, TrendingUp, Users, ClipboardCheck } from 'lucide-react'",
    content
)

# Insert the navigation item
nav_items_pattern = r"\{ href: '/casasgaby/admin/reservas', label: 'Reservas', icon: CalendarDays \},"
new_nav_item = "{ href: '/casasgaby/admin/reservas', label: 'Reservas', icon: CalendarDays },\n    { href: '/casasgaby/admin/operacion', label: 'Operación', icon: ClipboardCheck },"
content = content.replace(nav_items_pattern, new_nav_item)

with open('src/components/casasgaby/admin/AdminBottomNav.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
