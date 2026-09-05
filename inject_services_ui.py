import sys

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure we didn't inject it somewhere wrong. Let's remove any stray {servicios && ...} if it accidentally exists
# Actually we can see from Get-Content that it doesn't exist.

services_ui = """
          {servicios && servicios.length > 0 && (
            <div className="mb-4 pt-4 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Personaliza tu estancia con servicios extra
              </label>
              <div className="space-y-3">
                {servicios.map((serv: any) => {
                  const state = selectedExtras[serv.id] || {};
                  const isSelected = !!state.activo;
                  
                  return (
                    <div key={serv.id} className={`p-3 border rounded-xl flex flex-col gap-3 transition-colors ${isSelected ? 'bg-teal-50 border-teal-200' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-start gap-3">
                        {serv.tipo_tarifa !== 'por_trayecto' && (
                          <input 
                            type="checkbox"
                            className="mt-1 rounded text-teal-600 focus:ring-teal-500"
                            checked={isSelected}
                            onChange={(e) => {
                              setSelectedExtras(prev => ({
                                ...prev,
                                [serv.id]: { 
                                  ...prev[serv.id], 
                                  activo: e.target.checked,
                                  qty: e.target.checked ? Math.max(1, prev[serv.id]?.qty || 1) : 0
                                }
                              }))
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{serv.nombre}</p>
                          <p className="text-xs text-gray-500">{serv.tipo_tarifa === 'por_dia' ? 'Por día' : (serv.tipo_tarifa === 'por_trayecto' ? 'Por trayecto' : 'Pago único')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-teal-700">+{formatPrice(serv.precio_base)}</p>
                          <p className="text-[10px] text-gray-400">
                            {serv.tipo_tarifa === 'por_dia' ? 'x día' : (serv.tipo_tarifa === 'por_trayecto' ? 'c/u' : 'Total')}
                          </p>
                        </div>
                      </div>
                      
                      {/* Controles para por_dia */}
                      {isSelected && serv.tipo_tarifa === 'por_dia' && (
                        <div className="ml-7 flex items-center justify-between gap-3 bg-white p-2 rounded-lg border border-teal-100">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-gray-700">Días de renta:</span>
                            <div className="flex items-center gap-2">
                              <button type="button" className="w-7 h-7 rounded-md border border-gray-300 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100" onClick={() => setSelectedExtras(prev => ({...prev, [serv.id]: { ...prev[serv.id], qty: Math.max(1, (prev[serv.id]?.qty || 1) - 1)}}))}>-</button>
                              <span className="text-sm font-bold w-4 text-center">{state.qty || 1}</span>
                              <button type="button" className="w-7 h-7 rounded-md border border-gray-300 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100" onClick={() => setSelectedExtras(prev => ({...prev, [serv.id]: { ...prev[serv.id], qty: Math.min(cotizacion?.noches || 1, (prev[serv.id]?.qty || 1) + 1)}}))}>+</button>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-teal-800">
                            Subtotal: {formatPrice(Number(serv.precio_base) * (state.qty || 1))}
                          </span>
                        </div>
                      )}

                      {/* Controles para por_trayecto */}
                      {serv.tipo_tarifa === 'por_trayecto' && (
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200">
                            <input 
                              type="checkbox"
                              className="rounded text-teal-600 focus:ring-teal-500"
                              checked={!!state.ida}
                              onChange={(e) => {
                                const newVal = e.target.checked;
                                setSelectedExtras(prev => {
                                  const old = prev[serv.id] || {};
                                  const isAnyActive = newVal || old.vuelta;
                                  return {
                                    ...prev,
                                    [serv.id]: { ...old, ida: newVal, activo: isAnyActive }
                                  }
                                })
                              }}
                            />
                            Ida (Aeropuerto / Origen &rarr; Casa)
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200">
                            <input 
                              type="checkbox"
                              className="rounded text-teal-600 focus:ring-teal-500"
                              checked={!!state.vuelta}
                              onChange={(e) => {
                                const newVal = e.target.checked;
                                setSelectedExtras(prev => {
                                  const old = prev[serv.id] || {};
                                  const isAnyActive = old.ida || newVal;
                                  return {
                                    ...prev,
                                    [serv.id]: { ...old, vuelta: newVal, activo: isAnyActive }
                                  }
                                })
                              }}
                            />
                            Vuelta (Casa &rarr; Aeropuerto / Destino)
                          </label>
                          {isSelected && (
                             <div className="text-right mt-1">
                                <span className="text-xs font-semibold text-teal-800">
                                  Subtotal: {formatPrice(Number(serv.precio_base) * ((state.ida ? 1 : 0) + (state.vuelta ? 1 : 0)))}
                                </span>
                             </div>
                          )}
                        </div>
                      )}

                    </div>
                  )
                })}
              </div>
            </div>
          )}
"""

# Find the end of huespedes block
huespedes_anchor = """              <button 
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl text-gray-600 bg-white"
                onClick={() => setHuespedes(Math.min(propiedad.capacidad_personas, huespedes + 1))}
              >+</button>
            </div>
          </div>"""

if huespedes_anchor in content:
    content = content.replace(huespedes_anchor, huespedes_anchor + "\n" + services_ui)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
