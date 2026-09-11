import os

filepath = 'src/app/casasgaby/admin/reservas/page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """  const reservasConExtras = (reservas || []).map((r: any) => ({
    ...r,
    servicios_extra: solicitudesMap.get(r.solicitud_id) || solicitudesMap.get(r.email) || r.servicios_extra || []
  }));"""

replacement = """  const reservaIds = (reservas || []).map((r: any) => r.id).filter(Boolean);
  let comisionesMap = new Map();
  if (reservaIds.length > 0) {
    const { data: comisiones } = await supabase
      .schema('central')
      .from('transacciones_comisiones')
      .select('*')
      .in('referencia_id', reservaIds)
      .eq('origen_modulo', 'hospedaje');
    
    (comisiones || []).forEach((c: any) => {
      if (!comisionesMap.has(c.referencia_id)) {
        comisionesMap.set(c.referencia_id, []);
      }
      comisionesMap.get(c.referencia_id).push({
        ...c,
        monto: c.monto_comision,
        porcentaje: c.porcentaje_comision
      });
    });
  }

  const reservasConExtras = (reservas || []).map((r: any) => ({
    ...r,
    servicios_extra: solicitudesMap.get(r.solicitud_id) || solicitudesMap.get(r.email) || r.servicios_extra || [],
    comisiones: comisionesMap.get(r.id) || []
  }));"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Target not found!")
