import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Hide scrollbars everywhere
scroll_classes = "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
content = content.replace("overflow-y-auto", f"overflow-y-auto {scroll_classes}")
content = content.replace("overflow-x-auto", f"overflow-x-auto {scroll_classes}")
# If any replacements resulted in duplicate classes, let's fix them just in case (though it shouldn't)

# 2. Smooth accordion for extras
old_extras_block = """                                  {isSel && srv.tipo_tarifa !== 'fijo' && (
                                    <div className="mt-1.5 flex items-center gap-2">
                                      {srv.tipo_tarifa === 'por_trayecto' ? (
                                        <div className="flex flex-col gap-1 w-full mt-1">
                                          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                            <input type="checkbox" className="rounded text-teal-600 w-3 h-3" checked={!!state.ida}
                                              onChange={(e) => setConfExtras({...confExtras, [srv.id]: {...state, ida: e.target.checked, activo: e.target.checked || state.vuelta}})} />
                                            Ida (Apto &rarr; Casa)
                                          </label>
                                          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                            <input type="checkbox" className="rounded text-teal-600 w-3 h-3" checked={!!state.vuelta}
                                              onChange={(e) => setConfExtras({...confExtras, [srv.id]: {...state, vuelta: e.target.checked, activo: state.ida || e.target.checked}})} />
                                            Vuelta (Casa &rarr; Apto)
                                          </label>
                                        </div>
                                      ) : (
                                        <>
                                          <span className="text-xs text-gray-600">
                                            {srv.nombre.toLowerCase().includes('auto') ? 'Días:' : srv.nombre.toLowerCase().includes('distancia') || srv.nombre.toLowerCase().includes('especial') ? 'Distancia (km):' : 'Personas / Piezas:'}
                                          </span>
                                          <input 
                                            type="number" min="1" value={state.qty}
                                            onChange={(e) => setConfExtras({...confExtras, [srv.id]: {...state, qty: parseInt(e.target.value)||1}})}
                                            className="w-16 h-6 text-xs rounded border-gray-300 px-2 bg-white"
                                          />
                                        </>
                                      )}
                                    </div>
                                  )}"""

new_extras_block = """                                  <div className={`grid transition-all duration-300 ease-in-out ${isSel && srv.tipo_tarifa !== 'fijo' ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                                    <div className="overflow-hidden flex items-center gap-2">
                                      {srv.tipo_tarifa === 'por_trayecto' ? (
                                        <div className="flex flex-col gap-1 w-full mt-1">
                                          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                            <input type="checkbox" className="rounded text-teal-600 w-3 h-3" checked={!!state.ida}
                                              onChange={(e) => setConfExtras({...confExtras, [srv.id]: {...state, ida: e.target.checked, activo: e.target.checked || state.vuelta}})} />
                                            Ida (Apto &rarr; Casa)
                                          </label>
                                          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                            <input type="checkbox" className="rounded text-teal-600 w-3 h-3" checked={!!state.vuelta}
                                              onChange={(e) => setConfExtras({...confExtras, [srv.id]: {...state, vuelta: e.target.checked, activo: state.ida || e.target.checked}})} />
                                            Vuelta (Casa &rarr; Apto)
                                          </label>
                                        </div>
                                      ) : (
                                        <>
                                          <span className="text-xs text-gray-600">
                                            {srv.nombre.toLowerCase().includes('auto') ? 'Días:' : srv.nombre.toLowerCase().includes('distancia') || srv.nombre.toLowerCase().includes('especial') ? 'Distancia (km):' : 'Personas / Piezas:'}
                                          </span>
                                          <input 
                                            type="number" min="1" value={state.qty}
                                            onChange={(e) => setConfExtras({...confExtras, [srv.id]: {...state, qty: parseInt(e.target.value)||1}})}
                                            className="w-16 h-6 text-xs rounded border-gray-300 px-2 bg-white"
                                          />
                                        </>
                                      )}
                                    </div>
                                  </div>"""

content = content.replace(old_extras_block, new_extras_block)

# 3. Enhance outer container transition
content = content.replace(
    """className={`p-2 rounded-lg border transition-colors ${isSel ? 'bg-teal-50/50 border-teal-200' : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`}""",
    """className={`p-2 rounded-lg border transition-all duration-300 ${isSel ? 'bg-teal-50/50 border-teal-200' : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`}"""
)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
