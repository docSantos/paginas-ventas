import os

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """{r.comisiones && r.comisiones.length > 0 && (
                              <details className="mb-2 text-xs group">
                                <summary className="font-medium text-purple-600 cursor-pointer list-none flex items-center gap-1 mt-0.5 select-none">
                                  <span className="group-open:rotate-90 transition-transform">▸</span> Ver desglose ({r.comisiones.length})
                                </summary>
                                <div className="pt-1.5 space-y-1 pl-3 border-l-2 border-purple-100 ml-1 mt-1">
                                  {r.comisiones.map((comision: any) => (
                                    <div key={comision.id} className="flex justify-between text-gray-700">
                                      <span className="flex-1 truncate pr-2" title={`${comision.concepto || 'Comisión'} - ${comision.estado || ''}`}>
                                        {comision.concepto || 'Comisión'} {comision.porcentaje ? `(${Number(comision.porcentaje)}%)` : ''}
                                      </span>
                                      <span className="font-medium whitespace-nowrap">
                                        {formatPrice(comision.monto)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            )}"""

replacement = """{r.comisiones && r.comisiones.length > 0 && (() => {
                              const tBase = Number(r.tarifa_base || 0);
                              const tAcordado = Number(r.monto_total_acordado || r.costo_total || r.tarifa_base || 0);
                              const subExtras = Math.max(0, tAcordado - tBase);
                              
                              return (
                                <details className="mb-2 text-xs group">
                                  <summary className="font-medium text-purple-600 cursor-pointer list-none flex items-center gap-1 mt-0.5 select-none">
                                    <span className="group-open:rotate-90 transition-transform">▸</span> Ver desglose
                                  </summary>
                                  <div className="pt-1.5 space-y-1 pl-3 border-l-2 border-purple-100 ml-1 mt-1">
                                    <div className="flex justify-between text-gray-700">
                                      <span className="flex-1 truncate pr-2">
                                        Comisión Hospedaje ({tenantBase}%)
                                      </span>
                                      <span className="font-medium whitespace-nowrap">
                                        {formatPrice(tBase * (tenantBase / 100))}
                                      </span>
                                    </div>
                                    {subExtras > 0 && (
                                      <div className="flex justify-between text-gray-700">
                                        <span className="flex-1 truncate pr-2">
                                          Comisión Extras ({tenantExtras}%)
                                        </span>
                                        <span className="font-medium whitespace-nowrap">
                                          {formatPrice(subExtras * (tenantExtras / 100))}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </details>
                              );
                            })()}"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("ReservasClient patched")
else:
    print("Target not found!")
