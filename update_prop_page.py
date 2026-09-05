import re

with open('src/app/casasgaby/propiedad/[id]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add services fetch
fetch_logic = """
        // 3. Obtener nǧmero de WA activo
        const { data: activePhone } = await db
          .from('configuracion_telefonos')
          .select('telefono')
          .eq('activo', true)
          .single()
          
        adminPhone = activePhone?.telefono || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "529981424300"
        
        // 4. Cargar servicios activos de la propiedad
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
          serviciosActivos = psData
            .map((ps: any) => ps.catalogo_servicios)
            .filter(Boolean)
        }
      } else {
"""

content = content.replace("""
        // 3. Obtener nǧmero de WA activo
        const { data: activePhone } = await db
          .from('configuracion_telefonos')
          .select('telefono')
          .eq('activo', true)
          .single()
          
        adminPhone = activePhone?.telefono || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "529981424300"
      } else {""", fetch_logic)

# Initialize array at the top
content = content.replace(
    "let adminPhone: string | undefined = undefined",
    "let adminPhone: string | undefined = undefined\n  let serviciosActivos: any[] = []"
)

# Pass it to client
content = content.replace(
    "<PropertyDetailClient \n      propiedad={propiedad} \n      isDemo={isDemo} \n      reservas={reservasActivas}\n      adminPhone={adminPhone}\n    />",
    "<PropertyDetailClient \n      propiedad={propiedad} \n      isDemo={isDemo} \n      reservas={reservasActivas}\n      adminPhone={adminPhone}\n      servicios={serviciosActivos}\n    />"
)

with open('src/app/casasgaby/propiedad/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
