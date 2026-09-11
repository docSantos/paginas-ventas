import os
import re

filepath = 'src/components/casasgaby/admin/OperacionClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace getSaldo definition
old_getSaldo = r"const getSaldo = \(r: any\) => \{\s*const total = Number\(r\.monto_total_acordado\) \|\| Number\(r\.costo_total\) \|\| 0\s*let abonado = 0\s*if \(r\.transacciones && r\.transacciones\.length > 0\) \{\s*abonado = r\.transacciones\.filter\(\(t: any\) => t\.tipo === 'ingreso'\)\.reduce\(\(sum: number, t: any\) => sum \+ \(Number\(t\.monto_mxn\) \|\| Number\(t\.monto\) \|\| 0\), 0\)\s*\} else \{\s*abonado = Number\(r\.monto_apartado\) \|\| 0\s*\}\s*return Math\.max\(0, Math\.round\(\(total - abonado\) \* 100\) / 100\)\s*\}"

new_getSaldo = """export const calcularFinanzasReserva = (r: any) => {
    const totalAcordado = Number(r.monto_total_acordado || r.costo_total || r.tarifa_base || 0);
    const sumaTransacciones = r.transacciones?.filter((t: any) => t.tipo === 'ingreso').reduce((acc: any, t: any) => acc + Number(t.monto_acreditado ?? t.monto_mxn ?? t.monto ?? 0), 0) || 0;
    const totalPagado = sumaTransacciones > 0 ? sumaTransacciones : Number(r.monto_apartado || 0);
    const saldoPendiente = Math.max(0, totalAcordado - totalPagado);
    return { totalAcordado, totalPagado, saldoPendiente };
  }
  
  const getSaldo = (r: any) => calcularFinanzasReserva(r).saldoPendiente;"""
  
content = re.sub(old_getSaldo, new_getSaldo, content)

# Now in OperacionClient.tsx, inside inHouse.map, I had injected an inline closure. I will replace it with the new function call.
inline_closure_target = r"\{\(\(\) => \{\s*const totalAcordado = Number\(r\.monto_total_acordado \|\| r\.costo_total \|\| r\.tarifa_base \|\| 0\);\s*const sumaTransacciones = r\.transacciones\?\.filter\(\(t:any\) => t\.tipo === 'ingreso'\)\.reduce\(\(acc: any, t: any\) => acc \+ Number\(t\.monto_mxn \?\? t\.monto \?\? 0\), 0\) \|\| 0;\s*const totalPagado = sumaTransacciones > 0 \? sumaTransacciones : Number\(r\.monto_apartado \|\| 0\);\s*const saldoPendiente = Math\.max\(0, totalAcordado - totalPagado\);\s*return \(\s*<>\s*<div className=\"flex justify-between border-t border-gray-100 pt-1\.5 mt-1\.5\">\s*<span className=\"text-gray-900 font-medium\">Total Acordado:</span>\s*<span className=\"font-bold text-gray-900\">\{formatPrice\(totalAcordado\)\}</span>\s*</div>\s*<div className=\"flex justify-between\">\s*<span className=\"text-gray-600\">Pagado Acumulado:</span>\s*<span className=\"font-semibold text-teal-600\">\{formatPrice\(totalPagado\)\}</span>\s*</div>\s*<div className=\"flex justify-between pt-1 border-t border-gray-100 mt-1\">\s*<span className=\"text-gray-900 font-bold\">Saldo Pendiente:</span>\s*<span className=\{`font-bold \$\{saldoPendiente <= 0\.5 \? 'text-green-600' : 'text-red-600'\}`\}>\s*\{saldoPendiente <= 0\.5 \? 'Liquidado' : formatPrice\(saldoPendiente\)\}\s*</span>\s*</div>\s*</>\s*\);\s*\}\)\(\)\}"

new_inline_closure = """{(() => {
                                  const { totalAcordado, totalPagado, saldoPendiente } = calcularFinanzasReserva(r);
                                  return (
                                    <>
                                      <div className="flex justify-between border-t border-gray-100 pt-1.5 mt-1.5">
                                        <span className="text-gray-900 font-medium">Total Acordado:</span>
                                        <span className="font-bold text-gray-900">{formatPrice(totalAcordado)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Pagado Acumulado:</span>
                                        <span className="font-semibold text-teal-600">{formatPrice(totalPagado)}</span>
                                      </div>
                                      <div className="flex justify-between pt-1 border-t border-gray-100 mt-1">
                                        <span className="text-gray-900 font-bold">Saldo Pendiente:</span>
                                        <span className={`font-bold ${saldoPendiente <= 0.5 ? 'text-green-600' : 'text-red-600'}`}>
                                          {saldoPendiente <= 0.5 ? 'Liquidado' : formatPrice(saldoPendiente)}
                                        </span>
                                      </div>
                                    </>
                                  );
                                })()}"""
content = re.sub(inline_closure_target, new_inline_closure, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated OperacionClient")
