import os
import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace props
content = re.sub(
    r'export function ReservasClient\(\{ solicitudes, reservas, servicios = \[\], tenantExtras = 5, tenantBase = 2\.50 \}: \{ solicitudes: Solicitud\[\], reservas: any\[\], servicios\?: any\[\], tenantExtras\?: number, tenantBase\?: number \}\) \{',
    r'export function ReservasClient({ solicitudes, reservas, servicios = [], propiedades = [], tenantExtras = 5, tenantBase = 2.50 }: { solicitudes: Solicitud[], reservas: any[], servicios?: any[], propiedades?: any[], tenantExtras?: number, tenantBase?: number }) {',
    content
)

# Replace select
old_map = r'\{Array\.from\(new Map\(reservas\.map\(\(r: any\) => \[r\.propiedades\?\.titulo,\s*r\.propiedad_id\]\)\)\.entries\(\)\)\.map\(\(\[titulo, pid\]\) => \(\s*<option key=\{String\(pid\)\} value=\{String\(pid\)\}>\{titulo\}</option>\s*\)\)\}'
new_map = r'{propiedades.map((p: any) => (<option key={String(p.id)} value={String(p.id)}>{p.titulo}</option>))}'

content = re.sub(old_map, new_map, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("ReservasClient.tsx patched with regex")
