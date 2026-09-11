import os

# 1. Patch ReservasClient.tsx
filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add to props
target_props = "export function ReservasClient({ solicitudes, reservas, servicios = [], tenantExtras = 5, tenantBase = 2.50 }: { solicitudes: Solicitud[], reservas: any[], servicios?: any[], tenantExtras?: number, tenantBase?: number }) {"
repl_props = "export function ReservasClient({ solicitudes, reservas, servicios = [], propiedades = [], tenantExtras = 5, tenantBase = 2.50 }: { solicitudes: Solicitud[], reservas: any[], servicios?: any[], propiedades?: any[], tenantExtras?: number, tenantBase?: number }) {"
if target_props in content:
    content = content.replace(target_props, repl_props)

# Fix JSX select
target_select = """<select
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-500"
                  value={bloqueoModal.propiedadId}
                  onChange={e => setBloqueoModal({ ...bloqueoModal, propiedadId: e.target.value })}
                >
                  <option value="">-- Seleccionar propiedad --</option>
                  {Array.from(new Map(reservas.map((r: any) => [r.propiedades?.titulo, r.propiedad_id])).entries()).map(([titulo, pid]) => (
                    <option key={String(pid)} value={String(pid)}>{titulo}</option>
                  ))}
                </select>"""

repl_select = """<select
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-500"
                  value={bloqueoModal.propiedadId}
                  onChange={e => setBloqueoModal({ ...bloqueoModal, propiedadId: e.target.value })}
                >
                  <option value="">-- Seleccionar propiedad --</option>
                  {propiedades.map((p: any) => (
                    <option key={String(p.id)} value={String(p.id)}>{p.titulo}</option>
                  ))}
                </select>"""

if target_select in content:
    content = content.replace(target_select, repl_select)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("ReservasClient.tsx patched")

# 2. Patch page.tsx
filepath = 'src/app/casasgaby/admin/reservas/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target_fetch = "const hoyStr = new Date().toISOString().split('T')[0];"
repl_fetch = """const { data: propiedades } = await supabase.schema('hospedaje').from('propiedades').select('id, titulo').eq('activo', true)
const hoyStr = new Date().toISOString().split('T')[0];"""
if target_fetch in content:
    content = content.replace(target_fetch, repl_fetch)

target_pass = """<ReservasClient 
        solicitudes={solicitudes || []} 
        reservas={reservasConExtras} 
        servicios={servicios || []}
        tenantExtras={reglaComisiones?.porcentaje_extras || tenant?.porcentaje_comision_extras || 5}
        tenantBase={reglaComisiones?.porcentaje_base || tenant?.porcentaje_comision_base || 2.50}
      />"""
repl_pass = """<ReservasClient 
        solicitudes={solicitudes || []} 
        reservas={reservasConExtras} 
        servicios={servicios || []}
        propiedades={propiedades || []}
        tenantExtras={reglaComisiones?.porcentaje_extras || tenant?.porcentaje_comision_extras || 5}
        tenantBase={reglaComisiones?.porcentaje_base || tenant?.porcentaje_comision_base || 2.50}
      />"""
if target_pass in content:
    content = content.replace(target_pass, repl_pass)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("page.tsx patched")
