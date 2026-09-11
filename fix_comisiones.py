import os

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """<div className="flex justify-between mb-1">
                              <span className="text-gray-600">Total Comisión:</span>
                              <span className="font-semibold text-purple-700">{formatPrice(r.monto_comision || 0)}</span>
                            </div>"""

replacement = """<div className="flex justify-between mb-1">
                              <span className="text-gray-600">Total Comisión:</span>
                              <span className="font-semibold text-purple-700">{formatPrice(r.monto_comision || 0)}</span>
                            </div>
                            
                            {r.comisiones && r.comisiones.length > 0 && (
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

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Target not found!")
