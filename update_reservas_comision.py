import os
import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Comisión</h4>
                            <div className="bg-white p-3 rounded-lg border border-purple-200 mb-3 text-sm">
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-600">Total Comisión:</span>
                                <span className="font-semibold text-purple-700">{formatPrice(r.monto_comision || 0)}</span>
                              </div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-600">Comisión Pagada:</span>
                                <span className="font-semibold text-teal-600">{formatPrice(r.comision_pagada || 0)}</span>
                              </div>
                              <div className="flex justify-between pt-1 border-t border-gray-100 mt-1">
                                <span className="text-gray-900 font-bold">Saldo Comisión:</span>
                                <span className={`font-bold ${(r.monto_comision || 0) - (r.comision_pagada || 0) <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                                  {formatPrice((r.monto_comision || 0) - (r.comision_pagada || 0))}
                                </span>
                              </div>
                            </div>
  
                            <div className="flex flex-wrap gap-2">
                              {renderEarlyCheckinBtn(r)}
                              <Button size="sm" variant="outline" onClick={() => setAbonoModal({ open: true, reserva: r })} className="text-teal-700 border-teal-200 hover:bg-teal-50">
                                <DollarSign className="w-4 h-4 mr-1" /> Registrar Abono
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => { setComisionMonto(((r.monto_comision || 0) - (r.comision_pagada || 0)).toString()); setComisionModal({ open: true, reserva: r }) }} className="text-purple-700 border-purple-200 hover:bg-purple-50">"""


replacement = """                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Comisión</h4>
                            <div className="bg-white p-3 rounded-lg border border-purple-200 mb-3 text-sm">
                              {(() => {
                                const pct = Number(r.porcentaje_comision || 0);
                                const baseCalc = pct > 0 ? (Number(r.tarifa_base || r.monto_total_acordado || r.costo_total || 0) * (pct / 100)) : 0;
                                const comTotal = Number(r.monto_comision) || baseCalc;
                                const comPagada = Number(r.comision_pagada) || 0;
                                const comSaldo = comTotal - comPagada;
                                return (
                                  <>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-gray-600 flex items-center gap-1">Total Comisión {pct > 0 && <span className="text-[10px] bg-purple-100 text-purple-700 px-1 rounded">{pct}%</span>}:</span>
                                      <span className="font-semibold text-purple-700">{formatPrice(comTotal)}</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-gray-600">Comisión Pagada:</span>
                                      <span className="font-semibold text-teal-600">{formatPrice(comPagada)}</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t border-gray-100 mt-1">
                                      <span className="text-gray-900 font-bold">Saldo Comisión:</span>
                                      <span className={`font-bold ${comSaldo <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                                        {formatPrice(comSaldo)}
                                      </span>
                                    </div>
                                  </>
                                )
                              })()}
                            </div>
  
                            <div className="flex flex-wrap gap-2">
                              {renderEarlyCheckinBtn(r)}
                              <Button size="sm" variant="outline" onClick={() => setAbonoModal({ open: true, reserva: r })} className="text-teal-700 border-teal-200 hover:bg-teal-50">
                                <DollarSign className="w-4 h-4 mr-1" /> Registrar Abono
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => { 
                                const pct = Number(r.porcentaje_comision || 0);
                                const baseCalc = pct > 0 ? (Number(r.tarifa_base || r.monto_total_acordado || r.costo_total || 0) * (pct / 100)) : 0;
                                const comTotal = Number(r.monto_comision) || baseCalc;
                                const comPagada = Number(r.comision_pagada) || 0;
                                setComisionMonto((comTotal - comPagada).toString()); 
                                setComisionModal({ open: true, reserva: r }) 
                              }} className="text-purple-700 border-purple-200 hover:bg-purple-50">"""

# Replace all occurrences (since there may be multiple buckets left? Oh wait, there are only 2 buckets now: ProximasLlegadas and LlegadasHoy. But the render code might be looped.
# Let's do a regex replacement handling encoding safely.

content = content.replace(target, replacement)
content = content.replace(target.replace('Comisión', 'Comisin'), replacement)
content = content.replace(target.replace('Comisión', 'Comisin').replace('ó', ''), replacement)
# Instead of exact replace, I'll use regex for the block.

pattern = re.compile(r'<h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Comisi.*?</h4>.*?<Button size="sm" variant="outline" onClick=\{\(\) => \{ setComisionMonto.*?Saldar Comisi', re.DOTALL)

def repl(match):
    return replacement + "\n                                Saldar Comisi"

if not content.find("const comTotal = Number(r.monto_comision) || baseCalc") != -1:
    content = pattern.sub(repl, content)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated ReservasClient.tsx using regex.")
else:
    print("Already updated.")
