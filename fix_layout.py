import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# First, let's extract the "Cotiza tu estadía" start up to the inputs.
# And let's extract the "Servicios Extra" block, since it's already properly formatted.
# Then we reconstruct the entire `Cotiza tu estadía` div!

start_marker = '<div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">'
end_marker = '{showSuccessBanner && ('

parts = content.split(start_marker)
if len(parts) == 2:
    before_cotiza = parts[0]
    rest = parts[1]
    
    sub_parts = rest.split(end_marker)
    after_cotiza = end_marker + sub_parts[1]
    
    # We now have the whole middle part. We just rewrite it from scratch using the exact logic requested.
    
    new_cotiza_block = """<div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-lg mb-3 text-gray-900">Cotiza tu estadía</h2>
          
          {/* 1. Inputs de Fechas */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Input 
              type="date" 
              label="Llegada" 
              value={fechaEntrada}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFechaEntrada(e.target.value)}
            />
            <Input 
              type="date" 
              label="Salida"
              value={fechaSalida}
              min={fechaEntrada || new Date().toISOString().split('T')[0]}
              onChange={(e) => setFechaSalida(e.target.value)}
            />
          </div>

          {errorFechas && (
            <div className="mb-4 p-2.5 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{errorFechas}</p>
            </div>
          )}
          
          {/* 2. Fechas Ocupadas */}
          {reservas && reservas.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 text-sm rounded-xl border border-red-100">
              <p className="font-semibold mb-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Fechas ocupadas:</p>
                <ul className="list-disc pl-5 space-y-0.5 text-xs">
                  {reservas.map((r: any, i: number) => (
                    <li key={i}>{formatDateEs(r.fecha_entrada)} al {formatDateEs(r.fecha_salida)}</li>
                  ))}
                </ul>
            </div>
          )}

          {/* 3. Selector de Huéspedes */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Huéspedes (Máx. {propiedad.capacidad_personas})
            </label>
            <div className="flex items-center gap-4">
              <button 
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl text-gray-600 bg-white"
                onClick={() => setHuespedes(Math.max(1, huespedes - 1))}
              >-</button>
              <span className="font-medium text-lg w-4 text-center">{huespedes}</span>
              <button 
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl text-gray-600 bg-white"
                onClick={() => setHuespedes(Math.min(propiedad.capacidad_personas, huespedes + 1))}
              >+</button>
            </div>
          </div>

          {/* 4. Servicios Extra */}
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
                              setSelectedExtras((prev: any) => ({
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
                              <button type="button" className="w-7 h-7 rounded-md border border-gray-300 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100" onClick={() => setSelectedExtras((prev: any) => ({...prev, [serv.id]: { ...prev[serv.id], qty: Math.max(1, (prev[serv.id]?.qty || 1) - 1)}}))}>-</button>
                              <span className="text-sm font-bold w-4 text-center">{state.qty || 1}</span>
                              <button type="button" className="w-7 h-7 rounded-md border border-gray-300 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100" onClick={() => setSelectedExtras((prev: any) => ({...prev, [serv.id]: { ...prev[serv.id], qty: Math.min(cotizacion?.noches || 1, (prev[serv.id]?.qty || 1) + 1)}}))}>+</button>
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
                                setSelectedExtras((prev: any) => {
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
                                setSelectedExtras((prev: any) => {
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

          {/* 5. Resumen Financiero */}
          {cotizacion && !errorFechas && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-gray-600 text-sm mb-2">
                <span>{cotizacion.breakdown}</span>
                <span>{formatPrice(cotizacion.total - cotizacion.extrasTotal)}</span>
              </div>
              {cotizacion.extrasTotal > 0 && (
                <div className="flex justify-between text-teal-700 text-sm mb-2">
                  <span>Servicios extra</span>
                  <span>+{formatPrice(cotizacion.extrasTotal)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-gray-100 pt-2 mt-1">
                <span>Total estimado</span>
                <span>{formatPrice(cotizacion.total)}</span>
              </div>
              <p className="text-xs text-teal-700 mt-2 font-medium bg-teal-50 inline-block px-2 py-1 rounded-md">
                Anticipo para reservar: {formatPrice(cotizacion.anticipo)} (50%)
              </p>
            </div>
          )}
        </div>
        
        """
        
    final_content = before_cotiza + new_cotiza_block + after_cotiza
    
    with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
        f.write(final_content)
