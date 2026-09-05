import sys
import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State changes:
content = content.replace(
    "const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>({})",
    "const [selectedExtras, setSelectedExtras] = useState<Record<string, any>>({})"
)

# 2. Update `cotizacion` logic
old_cotizacion = r"let extrasTotal = 0;.*?Object\.keys\(selectedExtras\)\.forEach\(servId => \{.*?\n\s*\}\);"
new_cotizacion = """let extrasTotal = 0;
    Object.keys(selectedExtras).forEach(servId => {
      const serv = servicios.find((s: any) => s.id === servId);
      const val = selectedExtras[servId];
      if (serv && val && val.activo) {
        if (serv.tipo_tarifa === 'por_dia') {
          extrasTotal += Number(serv.precio_base) * (val.qty || 1);
        } else if (serv.tipo_tarifa === 'por_trayecto') {
          let count = 0;
          if (val.ida) count++;
          if (val.vuelta) count++;
          extrasTotal += Number(serv.precio_base) * count;
        } else {
          extrasTotal += Number(serv.precio_base);
        }
      }
    });"""
content = re.sub(old_cotizacion, new_cotizacion, content, flags=re.DOTALL)

# 3. Update JSON Payload in form submit
old_payload_servicios = r"servicios_extra: Object\.keys\(selectedExtras\)\.map\(id => \(\{\s*id,\s*qty: selectedExtras\[id\],\s*nombre: servicios\.find\(s => s\.id === id\)\?\.nombre,\s*precio_base: servicios\.find\(s => s\.id === id\)\?\.precio_base,\s*tipo_tarifa: servicios\.find\(s => s\.id === id\)\?\.tipo_tarifa\s*\}\)\)\.filter\(s => s\.qty > 0\)"
new_payload_servicios = """servicios_extra: Object.keys(selectedExtras).filter(id => selectedExtras[id]?.activo).map(id => {
              const s = servicios.find((x: any) => x.id === id);
              const val = selectedExtras[id];
              let finalQty = 1;
              let finalName = s?.nombre;
              if (s?.tipo_tarifa === 'por_dia') {
                finalQty = val.qty || 1;
              } else if (s?.tipo_tarifa === 'por_trayecto') {
                finalQty = (val.ida ? 1 : 0) + (val.vuelta ? 1 : 0);
                if (finalQty === 0) return null; // Shouldn't happen if activo
                if (val.ida && val.vuelta) finalName += ' (Ida y Vuelta)';
                else if (val.ida) finalName += ' (Ida)';
                else if (val.vuelta) finalName += ' (Vuelta)';
              }
              return {
                id,
                qty: finalQty,
                nombre: finalName,
                precio_base: s?.precio_base,
                tipo_tarifa: s?.tipo_tarifa
              }
            }).filter(Boolean)"""
content = re.sub(old_payload_servicios, new_payload_servicios, content)

# 4. Update WhatsApp string
old_wa_active_extras = r"const activeExtras = Object\.keys\(selectedExtras\)\.filter\(k => selectedExtras\[k\] > 0\);"
new_wa_active_extras = """const activeExtras = Object.keys(selectedExtras).filter(k => selectedExtras[k]?.activo);"""
content = content.replace(old_wa_active_extras, new_wa_active_extras)

# 5. Move "Fechas ocupadas" BEFORE "Cantidad de personas".
parts = content.split('{reservas.length > 0 && (')
if len(parts) == 2:
    before_reservas = parts[0]
    rest = parts[1]
    
    parts_2 = rest.split('          {cotizacion && !errorFechas && (')
    if len(parts_2) == 2:
        fechas_block = '{reservas.length > 0 && (' + parts_2[0]
        after_fechas = '          {cotizacion && !errorFechas && (' + parts_2[1]
        
        content = before_reservas + after_fechas
        
        insert_point = '          <div>\n            <label className="text-sm font-medium text-gray-700 mb-1.5 block">\n              Cantidad de personas'
        
        content = content.replace(insert_point, fechas_block + "\n" + insert_point)

# 6. Replace UI for services
new_services_ui = """{servicios && servicios.length > 0 && (
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
          )}"""

content = re.sub(r'\{servicios && servicios\.length > 0 && \([\s\S]*?\}\)\}\s*<\/div>\s*<\/div>\s*\)\}', new_services_ui, content)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
