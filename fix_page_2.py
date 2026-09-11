import os

def insert_safely(filepath, tag):
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
    for line in lines:
        if tag in line:
            new_lines.append(inject_code)
            line = line.replace('reservas={reservas || []}', 'reservas={reservasConExtras}')
            line = line.replace('reservas={reservas}', 'reservas={reservasConExtras}')
        new_lines.append(line)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

insert_safely('src/app/casasgaby/admin/reservas/page.tsx', '<ReservasClient')
insert_safely('src/app/casasgaby/admin/operacion/page.tsx', '<OperacionClient')

print("Injected logic correctly.")
