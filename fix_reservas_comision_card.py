import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the Comision Card
comision_card_old = r"<h4 className=\"text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2\">Comisión \(\{\(r\.porcentaje_comision \|\| 2\.5\)\}%\)</h4>\s*<div className=\"bg-white p-3 rounded-lg border border-purple-200 mb-3 text-sm\">\s*<div className=\"flex justify-between mb-1\">\s*<span className=\"text-gray-600\">Total Comisión:</span>\s*<span className=\"font-semibold text-purple-700\">\{formatPrice\(r\.monto_comision \|\| 0\)\}</span>\s*</div>\s*<div className=\"flex justify-between mb-1\">\s*<span className=\"text-gray-600\">Comisión Pagada:</span>\s*<span className=\"font-semibold text-teal-600\">\{formatPrice\(r\.comision_pagada \|\| 0\)\}</span>\s*</div>\s*<div className=\"flex justify-between pt-1 border-t border-gray-100 mt-1\">\s*<span className=\"text-gray-900 font-bold\">Saldo Comisión:</span>\s*<span className=\{\`font-bold \$\{\(r\.monto_comision \|\| 0\) - \(r\.comision_pagada \|\| 0\) <= 0 \? 'text-green-600' : 'text-amber-600'\}\`\}>\s*\{formatPrice\(\(r\.monto_comision \|\| 0\) - \(r\.comision_pagada \|\| 0\)\)\}\s*</span>\s*</div>\s*</div>"

comision_card_new = """{(() => {
                              const comisionRecord = (r.comisiones && r.comisiones.length > 0) ? r.comisiones[0] : null;
                              const totalComision = comisionRecord?.monto_comision ?? r.monto_comision ?? 0;
                              const comisionPagada = comisionRecord?.monto_pagado ?? r.comision_pagada ?? 0;
                              const saldoComision = totalComision - comisionPagada;
                              
                              return (
                                <>
                                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Comisión ({comisionRecord?.porcentaje_comision || r.porcentaje_comision || 2.5}%)
                                  </h4>
                                  <div className="bg-white p-3 rounded-lg border border-purple-200 mb-3 text-sm">
                                    <div className="flex justify-between mb-1">
                                      <span className="text-gray-600">Total Comisión:</span>
                                      <span className="font-semibold text-purple-700">{formatPrice(totalComision)}</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-gray-600">Comisión Pagada:</span>
                                      <span className="font-semibold text-teal-600">{formatPrice(comisionPagada)}</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t border-gray-100 mt-1">
                                      <span className="text-gray-900 font-bold">Saldo Comisión:</span>
                                      <span className={`font-bold ${saldoComision <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                                        {formatPrice(saldoComision)}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )
                            })()}"""

content = re.sub(comision_card_old, comision_card_new, content, flags=re.DOTALL)

# And also replace `setComisionMonto(((r.monto_comision || 0) - (r.comision_pagada || 0)).toString())`
# Because `r.monto_comision` is now handled differently.
# But `r` here is just `r`. 
replace_saldar = r"setComisionMonto\(\(\(r\.monto_comision \|\| 0\) - \(r\.comision_pagada \|\| 0\)\)\.toString\(\)\)\s*setComisionModal\(\{ open: true, reserva: r \}\)"
new_saldar = """const cRec = (r.comisiones && r.comisiones.length > 0) ? r.comisiones[0] : null;
                                  const tCom = cRec?.monto_comision ?? r.monto_comision ?? 0;
                                  const cPag = cRec?.monto_pagado ?? r.comision_pagada ?? 0;
                                  setComisionMonto((tCom - cPag).toString())
                                  setComisionModal({ open: true, reserva: { ...r, idComision: cRec?.id } })"""

content = re.sub(replace_saldar, new_saldar, content, flags=re.DOTALL)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
