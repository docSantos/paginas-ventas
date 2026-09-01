import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix how we read comisionRecord:
fix_comision_rec_old = r"const comisionRecord = \(r\.comisiones && r\.comisiones\.length > 0\) \? r\.comisiones\[0\] : null;"
fix_comision_rec_new = r"const comisionRecord = Array.isArray(r.comisiones) ? r.comisiones[0] : (r.comisiones || null);"

content = re.sub(fix_comision_rec_old, fix_comision_rec_new, content)

# There is a second occurrence of this inside `saldar_comision` button handler:
fix_saldar_old = r"const cRec = \(r\.comisiones && r\.comisiones\.length > 0\) \? r\.comisiones\[0\] : null;"
fix_saldar_new = r"const cRec = Array.isArray(r.comisiones) ? r.comisiones[0] : (r.comisiones || null);"
content = re.sub(fix_saldar_old, fix_saldar_new, content)

# Now, implement the fallback calculation if comisionRecord is null, using `ajustes_reserva`
# The user wants: "Si por alguna razón la reserva no tiene fila en comisiones, calcula en caliente (tarifa_base * 0.025) + extras_comision en lugar de mostrar $0.00."

# Let's replace the whole totalComision calculation logic:
old_calc = r"const totalComision = comisionRecord\?.monto_comision \?\? r\.monto_comision \?\? 0;"
new_calc = """let totalComision = comisionRecord?.monto_comision ?? r.monto_comision ?? 0;
                              if (totalComision === 0) {
                                const cargosList = r.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo') || [];
                                const extrasComision = cargosList.reduce((acc: number, a: any) => acc + (Number(a.monto_comision) || 0), 0);
                                totalComision = ((Number(r.tarifa_base) || Number(r.monto_total_acordado) || 0) * (comisionRecord?.porcentaje_comision || r.porcentaje_comision || 2.5) / 100) + extrasComision;
                              }"""
content = re.sub(old_calc, new_calc, content)

# Same for saldar comision button:
old_saldar_calc = r"const tCom = cRec\?.monto_comision \?\? r\.monto_comision \?\? 0;"
new_saldar_calc = """let tCom = cRec?.monto_comision ?? r.monto_comision ?? 0;
                                  if (tCom === 0) {
                                    const cargosList = r.ajustes_reserva?.filter((a: any) => a.tipo === 'cargo') || [];
                                    const extrasComision = cargosList.reduce((acc: number, a: any) => acc + (Number(a.monto_comision) || 0), 0);
                                    tCom = ((Number(r.tarifa_base) || Number(r.monto_total_acordado) || 0) * (cRec?.porcentaje_comision || r.porcentaje_comision || 2.5) / 100) + extrasComision;
                                  }"""
content = re.sub(old_saldar_calc, new_saldar_calc, content)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
