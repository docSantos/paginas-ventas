import re

with open('src/app/casasgaby/admin/reservas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    ".select(`*, propiedades ( id, titulo, precio_por_noche, precio_por_semana, precio_por_mes ), ajustes_reserva (*)`",
    ".select(`*, propiedades ( id, titulo, precio_por_noche, precio_por_semana, precio_por_mes ), ajustes_reserva (*), comisiones (*)`"
)

with open('src/app/casasgaby/admin/reservas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
