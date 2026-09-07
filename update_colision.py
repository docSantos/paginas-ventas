import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_colision = """    // Detect collision: does a confirmed reservation overlap this solicitud's dates?
    const tieneColision = (sol: any): boolean => {
      return reservasConfirmadas.some(r => {
        if (r.propiedad_id !== sol.propiedad_id) return false
        const rS = new Date(r.fecha_entrada).getTime()
        const rE = new Date(r.fecha_salida).getTime()
        const sS = new Date(sol.fecha_entrada).getTime()
        const sE = new Date(sol.fecha_salida).getTime()
        return sS < rE && sE > rS
      })
    }"""

new_colision = """    // Detect collision: does a confirmed reservation overlap this solicitud's dates?
    const tieneColision = (sol: any): boolean => {
      // Only show warning for active stages (por_contactar, en_seguimiento)
      if (sol.estado_crm === 'cerradas' || ['confirmada', 'convertida', 'aprobada', 'descartada', 'rechazada'].includes(sol.estado)) {
        return false;
      }
      
      return reservasConfirmadas.some(r => {
        if (r.propiedad_id !== sol.propiedad_id) return false;
        // Exclude the reservation that might belong to this same request
        if (r.id === sol.reserva_id || r.solicitud_id === sol.id) return false;
        
        // Strict string comparison YYYY-MM-DD prevents timezone parsing offsets
        const rS = r.fecha_entrada.split('T')[0];
        const rE = r.fecha_salida.split('T')[0];
        const sS = sol.fecha_entrada.split('T')[0];
        const sE = sol.fecha_salida.split('T')[0];
        
        return sS < rE && sE > rS;
      })
    }"""

if old_colision in content:
    content = content.replace(old_colision, new_colision)
else:
    print("Warning: old_colision not found, using regex...")
    content = re.sub(
        r'// Detect collision:.*?\n\s*const tieneColision.*?return sS < rE && sE > rS\n\s*\}\)\n\s*\}',
        new_colision,
        content,
        flags=re.DOTALL
    )

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
