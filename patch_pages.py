import os
import re

def patch_page(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find where `reservas` are returned and passed to Client
    # It looks like:
    # return <ReservasClient ... reservas={reservas || []} />
    # We will inject the logic right before the return statement.
    
    inject_code = """
  const solicitudIds = (reservas || []).map((r: any) => r.solicitud_id).filter(Boolean);
  let solicitudesMap = new Map();
  
  if (solicitudIds.length > 0) {
    const { data: sols } = await supabase
      .schema('hospedaje')
      .from('solicitudes')
      .select('id, servicios_extra')
      .in('id', solicitudIds);
    (sols || []).forEach((s: any) => solicitudesMap.set(s.id, s.servicios_extra));
  } else {
    const emails = (reservas || []).map((r: any) => r.email).filter(Boolean);
    if (emails.length > 0) {
      const { data: sols } = await supabase
        .schema('hospedaje')
        .from('solicitudes')
        .select('email, servicios_extra')
        .in('email', emails);
      (sols || []).forEach((s: any) => solicitudesMap.set(s.email, s.servicios_extra));
    }
  }

  const reservasConExtras = (reservas || []).map((r: any) => ({
    ...r,
    servicios_extra: solicitudesMap.get(r.solicitud_id) || solicitudesMap.get(r.email) || r.servicios_extra || []
  }));
"""
    # Just replace `reservas={reservas || []}` with `reservas={reservasConExtras}`
    # and insert the logic before `return`
    
    content = content.replace("reservas={reservas || []}", "reservas={reservasConExtras}")
    
    # Insert inject_code before `return (` or `return <`
    if "return (" in content:
        content = content.replace("return (", inject_code + "\n  return (")
    elif "return <" in content:
        content = content.replace("return <", inject_code + "\n  return <")
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

patch_page('src/app/casasgaby/admin/reservas/page.tsx')
patch_page('src/app/casasgaby/admin/operacion/page.tsx')

print("Patched page.tsx")
