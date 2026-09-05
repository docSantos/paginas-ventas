import re

with open('src/app/casasgaby/propiedad/[id]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """        // 3. Obtener nǧmero de WA activo
        const { data: activePhone } = await db
          .from('configuracion_telefonos')
          .select('telefono')
          .eq('activo', true)
          .single()
          
        adminPhone = activePhone?.telefono || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "529981424300"
      } else {"""

replacement = """        // 3. Obtener número de WA activo
        const { data: activePhone } = await db
          .from('configuracion_telefonos')
          .select('telefono')
          .eq('activo', true)
          .single()
          
        adminPhone = activePhone?.telefono || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "529981424300"
        
        // 4. Fetch servicios extra
        const { data: psData, error: psError } = await db
          .from('propiedad_servicios')
          .select(`
            servicio_id,
            catalogo_servicios (*)
          `)
          .eq('propiedad_id', id)
          .eq('disponible', true)
          
        if (psData) {
          serviciosActivos = psData
            .map((ps: any) => ps.catalogo_servicios)
            .filter((c: any) => c != null)
        }
      } else {"""

# Do a simple string replace
if "adminPhone = activePhone?.telefono" in content:
    # Just to be safe with any hidden characters, let's use regex
    pattern = r"\s*// 3\. Obtener n[^m]+mero de WA activo\s*const \{ data: activePhone \} = await db\s*\.from\('configuracion_telefonos'\)\s*\.select\('telefono'\)\s*\.eq\('activo', true\)\s*\.single\(\)\s*adminPhone = activePhone\?\.telefono \|\| process\.env\.NEXT_PUBLIC_WHATSAPP_NUMBER \|\| \"529981424300\"\s*\} else \{"
    
    content = re.sub(pattern, replacement, content)
else:
    print("Could not find the target block.")

with open('src/app/casasgaby/propiedad/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
