import re

# =============================================================================
# 1. FIX PROPERTY DETAIL FETCH (src/app/casasgaby/propiedad/[id]/page.tsx)
# =============================================================================
with open('src/app/casasgaby/propiedad/[id]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific block where adminPhone is retrieved and property is mocked
target = """        // 3. Obtener nǧmero de WA activo
        const { data: activePhone } = await db
          .from('configuracion_telefonos')
          .select('telefono')
          .eq('activo', true)
          .single()
          
        adminPhone = activePhone?.telefono || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "529981424300"
      } else {"""

replacement = """        // 3. Obtener nǧmero de WA activo
        const { data: activePhone } = await db
          .from('configuracion_telefonos')
          .select('telefono')
          .eq('activo', true)
          .single()
          
        adminPhone = activePhone?.telefono || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "529981424300"

        // 4. Fetch servicios extra
        const { data: psData } = await db
          .from('propiedad_servicios')
          .select(`
            servicio_id,
            catalogo_servicios (
              id, nombre, descripcion, precio_base, tipo_tarifa
            )
          `)
          .eq('propiedad_id', id)
          .eq('disponible', true)
        
        if (psData) {
          serviciosActivos = psData.map((ps: any) => ps.catalogo_servicios).filter(Boolean)
        }

      } else {"""

content = content.replace(target, replacement)
content = content.replace("nǧmero", "número")

with open('src/app/casasgaby/propiedad/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# =============================================================================
# 2. FIX HOME PAGE FETCH (src/app/casasgaby/page.tsx)
# =============================================================================
with open('src/app/casasgaby/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """      const { data, error } = await supabase
        .from("propiedades")
        .select("*")
        .eq("activa", true)
        .order("created_at", { ascending: false });"""

replacement = """      const { data, error } = await supabase
        .from("propiedades")
        .select(`
          *,
          propiedad_servicios(id)
        `)
        .eq("activa", true)
        .order("created_at", { ascending: false });"""

content = content.replace(target, replacement)

target2 = "<PropertyCard key={propiedad.id} propiedad={propiedad} />"
replacement2 = "<PropertyCard key={propiedad.id} propiedad={propiedad} hasExtraServices={propiedad.propiedad_servicios && propiedad.propiedad_servicios.length > 0} />"
content = content.replace(target2, replacement2)

with open('src/app/casasgaby/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

