import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the Extras JSX block
# Let's find the extras rendering map.
old_extras_block = """                                <div className="flex justify-between items-start">
                                  <span className={`text-sm font-medium leading-tight ${!isSel ? 'text-gray-500' : 'text-gray-900'}`}>{srv.nombre}</span>
                                  <span className={`text-xs font-bold whitespace-nowrap ml-2 ${!isSel ? 'text-gray-400' : 'text-teal-700'}`}>
                                    +{formatPrice(srv.precio_base)}
                                  </span>
                                </div>
                                {isSel && srv.tipo_tarifa !== 'fijo' && (
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
                                        <span className="text-xs text-gray-600">Cantidad:</span>
                                        <input 
                                          type="number" min="1" value={state.qty}
                                          onChange={(e) => setConfExtras({...confExtras, [srv.id]: {...state, qty: parseInt(e.target.value)||1}})}
                                          className="w-16 h-6 text-xs rounded border-gray-300 px-2 bg-white"
                                        />
                                      </>
                                    )}
                                  </div>
                                )}"""

new_extras_block = """                                <div className="flex justify-between items-start">
                                  <span className={`text-sm font-medium leading-tight ${!isSel ? 'text-gray-500' : 'text-gray-900'}`}>{srv.nombre}</span>
                                  <span className={`text-xs font-bold whitespace-nowrap ml-2 ${!isSel ? 'text-gray-400' : 'text-teal-700'}`}>
                                    +{formatPrice(isSel ? (srv.tipo_tarifa === 'por_trayecto' ? srv.precio_base * ((state.ida ? 1 : 0) + (state.vuelta ? 1 : 0)) : srv.precio_base * state.qty) : srv.precio_base)}
                                  </span>
                                </div>
                                {isSel && srv.tipo_tarifa !== 'fijo' && (
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

# 2. Fix the Payment buttons
old_payment_block = """              <div>
                <label className="text-sm font-medium block mb-1">Método de pago</label>
                <div className="flex gap-2">
                  {['Transferencia', 'Efectivo'].map(m => (
                    <button
                      key={m}
                      onClick={() => setConfMetodo(m)}
                      className={`flex-1 py-2 text-sm rounded-lg border font-medium transition-colors ${confMetodo === m ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400'}`}
                    >
                      {m === 'Transferencia' ? <ArrowRightLeft className="w-4 h-4 mr-2 inline" /> : <Banknote className="w-4 h-4 mr-2 inline" />} {m}
                    </button>
                  ))}
                </div>
              </div>"""

new_payment_block = """              <div>
                <label className="text-sm font-medium block mb-1">Método de pago</label>
                <div className="flex gap-2">
                  {['Efectivo', 'Transferencia'].map(m => (
                    <button
                      key={m}
                      onClick={() => setConfMetodo(m)}
                      className={`flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm rounded-lg border font-medium transition-colors ${confMetodo === m ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400'}`}
                    >
                      {m === 'Efectivo' ? <Banknote className="h-4 w-4 shrink-0" /> : <ArrowRightLeft className="h-4 w-4 shrink-0" />}
                      <span>{m}</span>
                    </button>
                  ))}
                </div>
              </div>"""

if old_extras_block in content:
    content = content.replace(old_extras_block, new_extras_block)
else:
    print("Warning: old_extras_block not found.")

if old_payment_block in content:
    content = content.replace(old_payment_block, new_payment_block)
else:
    print("Warning: old_payment_block not found. Checking with regex...")
    # use regex fallback for payment block
    content = re.sub(
        r'<label className="text-sm font-medium block mb-1">Método de pago</label>\s*<div className="flex gap-2">\s*\{\[\'Transferencia\', \'Efectivo\'\]\.map\(m => \(.*?</button>\s*\)\)\}\s*</div>',
        """<label className="text-sm font-medium block mb-1">Método de pago</label>
                <div className="flex gap-2">
                  {['Efectivo', 'Transferencia'].map(m => (
                    <button
                      key={m}
                      onClick={() => setConfMetodo(m)}
                      className={`flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm rounded-lg border font-medium transition-colors ${confMetodo === m ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400'}`}
                    >
                      {m === 'Efectivo' ? <Banknote className="h-4 w-4 shrink-0" /> : <ArrowRightLeft className="h-4 w-4 shrink-0" />}
                      <span>{m}</span>
                    </button>
                  ))}
                </div>""",
        content,
        flags=re.DOTALL
    )

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
