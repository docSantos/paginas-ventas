import os
import re

filepath = 'src/components/casasgaby/admin/OperacionClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = r'<div className="flex justify-between border-t border-gray-100 pt-1\.5 mt-1\.5">\s*<span className="text-gray-900 font-medium">Total Acordado:</span>\s*<span className="font-bold">\{formatPrice\(Number\(r\.monto_total_acordado\) \|\| 0\)\}</span>\s*</div>\s*<div className="flex justify-between">\s*<span className="text-gray-600">Pagado Acumulado:</span>\s*<span className="font-semibold text-teal-600">\{formatPrice\(\(Number\(r\.monto_total_acordado\) \|\| 0\) - saldo\)\}</span>\s*</div>\s*<div className="flex justify-between pt-1 border-t border-gray-100 mt-1">\s*<span className="text-gray-900 font-bold">Saldo Pendiente:</span>\s*<span className=\{`font-bold \$\{saldo <= 0\.5 \? \'text-green-600\' : \'text-red-600\'\}`\}>\s*\{saldo <= 0\.5 \? \'Liquidado\' : formatPrice\(saldo\)\}\s*</span>\s*</div>'

replacement = """{(() => {
                                  const totalAcordado = Number(r.monto_total_acordado || r.costo_total || r.tarifa_base || 0);
                                  const sumaTransacciones = r.transacciones?.filter((t:any) => t.tipo === 'ingreso').reduce((acc: any, t: any) => acc + Number(t.monto_mxn ?? t.monto ?? 0), 0) || 0;
                                  const totalPagado = sumaTransacciones > 0 ? sumaTransacciones : Number(r.monto_apartado || 0);
                                  const saldoPendiente = Math.max(0, totalAcordado - totalPagado);
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

new_content, count = re.subn(target, replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print(f"Replaced {count} instances.")
