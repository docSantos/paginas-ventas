import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Imports
content = content.replace("registrarPagoComisionTabla, aplicarSaldoAFavorComision", "registrarPagoComisionTabla, aplicarSaldoAFavorComision, registrarPagoComisionLote")

# 2. Add Selected state
content = content.replace(
    "const [localComisiones, setLocalComisiones] = useState<any[]>(comisiones || [])",
    "const [localComisiones, setLocalComisiones] = useState<any[]>(comisiones || [])\n  const [selectedComisiones, setSelectedComisiones] = useState<string[]>([])"
)

# 3. Modify modalComision state
content = content.replace(
    "const [modalComision, setModalComision] = useState<{isOpen: boolean, id: string, saldo: number, pago: string}>({",
    "const [modalComision, setModalComision] = useState<{isOpen: boolean, ids: string[], saldo: number, pago: string}>({"
)
content = content.replace("isOpen: false, id: '', saldo: 0, pago: ''", "isOpen: false, ids: [], saldo: 0, pago: ''")

# 4. Update handlePagarComision
old_handle = re.compile(r"const handlePagarComision = async \(\) => \{.*?finally \{\s*setIsSubmitting\(false\)\s*\}\s*\}", re.DOTALL)
new_handle = """const handlePagarComision = async () => {
    try {
      setIsSubmitting(true)
      let res;
      if (modalComision.ids.length === 1) {
        res = await registrarPagoComisionTabla(modalComision.ids[0], Number(modalComision.pago))
      } else {
        res = await registrarPagoComisionLote(modalComision.ids)
      }
      
      if (res && res.success === false) {
        alert(res.error || "Error al pagar comisión")
      } else {
        // Actualización optimista
        setLocalComisiones(prev => prev.map(c => {
          if (modalComision.ids.includes(c.id)) {
            let nuevoPagado = Number(c.monto_pagado);
            if (modalComision.ids.length === 1) {
              nuevoPagado += Number(modalComision.pago)
            } else {
              nuevoPagado = Number(c.monto_comision)
            }
            return {
              ...c,
              monto_pagado: nuevoPagado,
              estado_pago: nuevoPagado >= Number(c.monto_comision) - 0.5 ? 'pagado' : 'parcial'
            }
          }
          return c
        }))
        setModalComision({ isOpen: false, ids: [], saldo: 0, pago: '' })
        setSelectedComisiones([])
      }
    } catch (e: any) {
      alert(e.message || "Error desconocido al pagar")
    } finally {
      setIsSubmitting(false)
    }
  }"""
content = old_handle.sub(new_handle, content)

# Also patch handleAplicarSaldoAFavor to use modalComision.ids[0]
content = content.replace("aplicarSaldoAFavorComision(modalComision.id, Number(modalComision.pago))", "aplicarSaldoAFavorComision(modalComision.ids[0], Number(modalComision.pago))")

# 5. Table Header Update (Checkbox)
th_old = """<th className="px-4 py-3">Fecha / Reserva</th>"""
th_new = """<th className="px-4 py-3 w-10">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          checked={localComisiones.filter(c => c.estado_pago === 'pendiente' || c.estado_pago === 'parcial').length > 0 && selectedComisiones.length === localComisiones.filter(c => c.estado_pago === 'pendiente' || c.estado_pago === 'parcial').length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedComisiones(localComisiones.filter(c => c.estado_pago === 'pendiente' || c.estado_pago === 'parcial').map(c => c.id))
                            } else {
                              setSelectedComisiones([])
                            }
                          }}
                        />
                      </th>
                      <th className="px-4 py-3">Fecha / Reserva</th>"""
content = content.replace(th_old, th_new)

# 6. Table Row Update (Checkbox and disabled button)
tr_old = """<tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{c.fecha_reserva ? formatDateString(c.fecha_reserva) : ''}</td>"""

tr_new = """<tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 disabled:opacity-50"
                          disabled={c.estado_pago === 'pagado' || c.estado_pago === 'cancelada' || c.estado_pago === 'cancelada_con_saldo_a_favor'}
                          checked={selectedComisiones.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedComisiones(prev => [...prev, c.id])
                            } else {
                              setSelectedComisiones(prev => prev.filter(id => id !== c.id))
                            }
                          }}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{c.fecha_reserva ? formatDateString(c.fecha_reserva) : ''}</td>"""
content = content.replace(tr_old, tr_new)

# Update the button row
td_button_old = """<td className="px-4 py-3 text-center">
                        {c.estado_pago !== 'pagado' && c.estado_pago !== 'cancelada' && c.estado_pago !== 'cancelada_con_saldo_a_favor' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                            onClick={() => setModalComision({ 
                              isOpen: true, 
                              id: c.id, 
                              saldo: c.monto_comision - c.monto_pagado, 
                              pago: String(c.monto_comision - c.monto_pagado) 
                            })}
                          >
                            Pagar
                          </Button>
                        )}
                      </td>"""

td_button_new = """<td className="px-4 py-3 text-center">
                        {c.estado_pago !== 'pagado' && c.estado_pago !== 'cancelada' && c.estado_pago !== 'cancelada_con_saldo_a_favor' ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                            onClick={() => setModalComision({ 
                              isOpen: true, 
                              ids: [c.id], 
                              saldo: c.monto_comision - c.monto_pagado, 
                              pago: String(c.monto_comision - c.monto_pagado) 
                            })}
                          >
                            Pagar
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Liquidado</span>
                        )}
                      </td>"""
content = content.replace(td_button_old, td_button_new)

# 7. Add Floating Bar
floating_bar = """
      {/* BARRA FLOTANTE DE ACCIÓN POR LOTE */}
      {selectedComisiones.length > 0 && activeTab === 'comisiones' && (
        <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-medium text-gray-700">
            <span className="bg-teal-100 text-teal-800 py-1 px-2 rounded-full mr-2">{selectedComisiones.length}</span>
            comisiones seleccionadas | Total a transferir: <span className="font-bold text-lg text-gray-900">{formatPrice(localComisiones.filter(c => selectedComisiones.includes(c.id)).reduce((acc, c) => acc + (c.monto_comision - c.monto_pagado), 0))}</span>
          </div>
          <Button 
            className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
            onClick={() => {
              const total = localComisiones.filter(c => selectedComisiones.includes(c.id)).reduce((acc, c) => acc + (c.monto_comision - c.monto_pagado), 0)
              setModalComision({
                isOpen: true,
                ids: selectedComisiones,
                saldo: total,
                pago: String(total)
              })
            }}
          >
            Liquidar seleccionadas
          </Button>
        </div>
      )}
"""
content = content.replace("return (", floating_bar + "\n    return (")

# Disable input when in bulk mode
modal_input_old = """<Input 
                  type="number"
                  value={modalComision.pago}
                  onChange={e => setModalComision(p => ({...p, pago: e.target.value}))}
                  max={modalComision.saldo}
                  min="0.01"
                  step="any"
                  onKeyDown={e => e.key === '-' && e.preventDefault()}
                />"""
modal_input_new = """<Input 
                  type="number"
                  value={modalComision.pago}
                  onChange={e => setModalComision(p => ({...p, pago: e.target.value}))}
                  max={modalComision.saldo}
                  min="0.01"
                  step="any"
                  onKeyDown={e => e.key === '-' && e.preventDefault()}
                  disabled={modalComision.ids.length > 1}
                />
                {modalComision.ids.length > 1 && <p className="text-xs text-gray-500 mt-1">El monto no es editable en pagos por lote.</p>}"""
content = content.replace(modal_input_old, modal_input_new)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
