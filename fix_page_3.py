import os

def insert_safely(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
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
    new_lines = []
    inject_ready = False
    injected = False
    for line in lines:
        if 'const { data: reservas } = await supabase' in line:
            inject_ready = True
            
        if inject_ready and not injected and line.strip() == '':
            # Found an empty line after the query, let's inject it here
            new_lines.append(inject_code + '\n')
            injected = True
            
        if 'reservas={reservas || []}' in line:
            line = line.replace('reservas={reservas || []}', 'reservas={reservasConExtras}')
        elif 'reservas={reservas}' in line:
            line = line.replace('reservas={reservas}', 'reservas={reservasConExtras}')
            
        new_lines.append(line)
        
    if not injected:
        print(f"Failed to inject in {filepath}")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

insert_safely('src/app/casasgaby/admin/reservas/page.tsx')
insert_safely('src/app/casasgaby/admin/operacion/page.tsx')
