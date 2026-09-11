import os
import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Insert calcularFinanzasReserva before ReservasClient function
calc_func = """export const calcularFinanzasReserva = (r: any) => {
  const totalAcordado = Number(r.monto_total_acordado || r.costo_total || r.tarifa_base || 0);
  const sumaTransacciones = r.transacciones?.filter((t: any) => t.tipo === 'ingreso').reduce((acc: any, t: any) => acc + Number(t.monto_acreditado ?? t.monto_mxn ?? t.monto ?? 0), 0) || 0;
  const totalPagado = sumaTransacciones > 0 ? sumaTransacciones : Number(r.monto_apartado || 0);
  const saldoPendiente = Math.max(0, totalAcordado - totalPagado);
  return { totalAcordado, totalPagado, saldoPendiente };
}

export function ReservasClient"""

content = content.replace("export function ReservasClient", calc_func)

# Now, find inside ReservasClient where it calculates totalAcordado and saldo
# It had something like:
# const totalAcordado = r.monto_total_acordado || r.costo_total
# const saldo = totalAcordado - (r.monto_apartado || 0)
# const liquidado = saldo <= 0

old_calc = r"const totalAcordado = r\.monto_total_acordado \|\| r\.costo_total\s*const saldo = totalAcordado - \(r\.monto_apartado \|\| 0\)\s*const liquidado = saldo <= 0"
new_calc = """const { totalAcordado, totalPagado, saldoPendiente: saldo } = calcularFinanzasReserva(r);
                const liquidado = saldo <= 0.5;"""
                
content = re.sub(old_calc, new_calc, content)

# Also update the UI in ReservasClient for "Pagado (MXN)" where I previously put:
# <span className="font-semibold text-teal-600">{formatPrice(r.monto_apartado || 0)}</span>
# I need to change it to use totalPagado

ui_target = r'<span className="font-semibold text-teal-600">\{formatPrice\(r\.monto_apartado \|\| 0\)\}</span>'
ui_replacement = '<span className="font-semibold text-teal-600">{formatPrice(totalPagado)}</span>'
content = re.sub(ui_target, ui_replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ReservasClient")
