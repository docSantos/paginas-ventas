import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

modal_ui = """      {/* Modal Aprobar Solicitud */}
      <Dialog open={aprobarModal.open} onOpenChange={(o) => setAprobarModal(p => ({ ...p, open: o }))}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aprobar y Registrar Pagos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            
            {/* Hospedaje Base */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold mb-3 text-gray-700">1. Hospedaje Base</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Monto Total Acordado (MXN)</label>
                  <Input type="number" min="0" step="any" onKeyDown={e => e.key === '-' && e.preventDefault()} value={montoAcordado} onChange={e => setMontoAcordado(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Anticipo Recibido (MXN)</label>
                  <Input type="number" min="0" step="any" onKeyDown={e => e.key === '-' && e.preventDefault()} value={montoAnticipo} onChange={e => setMontoAnticipo(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Moneda</label>
                  <select className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm" value={moneda} onChange={e => setMoneda(e.target.value)}>
                    <option value="MXN">MXN</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                {moneda === 'USD' && (
                  <div>
                    <label className="text-sm font-medium block mb-1">Tipo de Cambio</label>
                    <Input type="number" min="0" step="any" onKeyDown={e => e.key === '-' && e.preventDefault()} value={tc} onChange={e => setTc(e.target.value)} />
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium block mb-1">Método</label>
                  <select className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm" value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
                    <option value="efectivo_mxn">Efectivo MXN</option>
                    <option value="transferencia_mxn">Transferencia MXN</option>
                    <option value="efectivo_usd">Efectivo USD</option>
                    <option value="transferencia_usd">Transferencia USD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Servicios Adicionales Requeridos */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold mb-3 text-gray-700">2. Servicios Adicionales Requeridos</h4>
              <div className="space-y-3">
                {servicios.map(s => {
                  const isSelected = !!selectedExtras[s.id]
                  return (
                    <div key={s.id} className={`p-3 rounded-lg border ${isSelected ? 'border-emerald-500 bg-emerald-50/20' : 'border-gray-200 bg-gray-50/50'}`}>
                      <label className="flex items-center gap-3 cursor-pointer mb-1">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-emerald-600 rounded border-gray-300"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedExtras(prev => ({ ...prev, [s.id]: { qty: 1, monto: s.precio_base, pct: s.porcentaje_comision ?? 5, concepto: s.nombre } }))
                            } else {
                              const n = { ...selectedExtras };
                              delete n[s.id];
                              setSelectedExtras(n);
                            }
                          }}
                        />
                        <div>
                          <div className="font-medium text-sm text-gray-900">{s.nombre}</div>
                          <div className="text-xs text-gray-500">Precio base: {formatPrice(s.precio_base)} {s.tipo_tarifa === 'por_dia' ? '/ día' : ''}</div>
                        </div>
                      </label>

                      {isSelected && (
                        <div className="mt-3 pl-7 grid grid-cols-3 gap-3">
                          {s.tipo_tarifa === 'por_dia' && (
                            <div>
                              <label className="text-[11px] font-medium block text-gray-500 mb-1">Cantidad / Días</label>
                              <Input 
                                type="number" min="1" step="1" className="h-8 text-sm"
                                value={selectedExtras[s.id].qty} 
                                onChange={(e) => {
                                  const qty = Number(e.target.value);
                                  setSelectedExtras(prev => ({ ...prev, [s.id]: { ...prev[s.id], qty, monto: qty * s.precio_base } }))
                                }} 
                              />
                            </div>
                          )}
                          <div>
                            <label className="text-[11px] font-medium block text-gray-500 mb-1">Precio Final (MXN)</label>
                            <Input 
                              type="number" min="0" step="any" className="h-8 text-sm"
                              value={selectedExtras[s.id].monto} 
                              disabled={s.tipo_tarifa !== 'negociable'}
                              onChange={(e) => setSelectedExtras(prev => ({ ...prev, [s.id]: { ...prev[s.id], monto: Number(e.target.value) } }))} 
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-medium block text-gray-500 mb-1">% Comisión</label>
                            <Input 
                              type="number" min="0" max="100" step="any" className="h-8 text-sm"
                              value={selectedExtras[s.id].pct} 
                              onChange={(e) => setSelectedExtras(prev => ({ ...prev, [s.id]: { ...prev[s.id], pct: Number(e.target.value) } }))} 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                {servicios.length === 0 && <p className="text-sm text-gray-500 text-center py-2">No hay servicios en el catálogo.</p>}
              </div>
            </div>

            {/* Resumen Final */}
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <h4 className="text-sm font-semibold mb-3 text-emerald-800">3. Resumen en Tiempo Real</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Hospedaje Base:</span>
                  <span>{formatPrice(Number(montoAcordado) || 0)} MXN</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Servicios Extras:</span>
                  <span>{formatPrice(Object.values(selectedExtras).reduce((acc, s) => acc + s.monto, 0))} MXN</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-emerald-200 mt-2">
                  <span>Total Acordado Reserva:</span>
                  <span>{formatPrice((Number(montoAcordado) || 0) + Object.values(selectedExtras).reduce((acc, s) => acc + s.monto, 0))} MXN</span>
                </div>
                <div className="flex justify-between text-purple-700 font-semibold pt-1">
                  <span>Comisión Total Estimada:</span>
                  <span>{formatPrice(((Number(montoAcordado) || 0) * (tenantBase || 2.5) / 100) + Object.values(selectedExtras).reduce((acc, s) => acc + (s.monto * s.pct / 100), 0))} MXN</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setAprobarModal({ open: false, solicitud: null })} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleAprobar} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
                <CheckCircle className="w-4 h-4 mr-2" /> Aprobar y Bloquear
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>"""

content = re.sub(
    r"\{\/\* Modal Aprobar Solicitud \*\/\}.*?<DialogTitle>Aprobar y Registrar Pagos</DialogTitle>.*?Aprobar y Bloquear\s*</Button>\s*</div>\s*</div>\s*</DialogContent>\s*</Dialog>",
    modal_ui,
    content,
    flags=re.DOTALL
)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
