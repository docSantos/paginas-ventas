import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace("cancelarReserva,", "cancelarReserva, cancelarReservaConReembolso,")

# 2. Add Cancel Modal State
state_str = "const [cancelarAjusteId, setCancelarAjusteId] = useState<string | null>(null)"
if state_str not in content:
    # Just find a place to put the state
    idx = content.find("const [aprobarModal")
    
cancel_state = """
  // Cancelar Modal
  const [cancelModal, setCancelModal] = useState<{ open: boolean, reserva: Reserva | null }>({ open: false, reserva: null })
  const [cancelData, setCancelData] = useState({ willRefund: false, amount: '', currency: 'MXN', method: 'transferencia', note: '' })
  const [isCanceling, setIsCanceling] = useState(false)
"""
content = content.replace("const [aprobarModal", cancel_state + "  const [aprobarModal")

# 3. Modify Cancel Button logic
cancel_btn_regex = r"<Button\s+variant=\"outline\" size=\"sm\"\s+className=\"text-red-600 border-red-200 hover:bg-red-50 ml-auto\"\s+onClick=\{async \(\) => \{.*?\}\}\s+>\s+Cancelar Reserva\s+</Button>"

new_cancel_btn = """<Button 
                                variant="outline" size="sm" 
                                className="text-red-600 border-red-200 hover:bg-red-50 ml-auto"
                                onClick={() => {
                                  const totalAbonado = (r as any).transacciones?.filter((t:any) => t.tipo === 'ingreso').reduce((sum:number, t:any) => sum + Number(t.monto), 0) || Number(r.monto_apartado) || 0;
                                  const hasUsd = (r as any).transacciones?.some((t:any) => t.moneda === 'USD');
                                  
                                  setCancelData({ 
                                    willRefund: false, 
                                    amount: totalAbonado.toString(), 
                                    currency: hasUsd ? 'USD' : 'MXN', 
                                    method: 'transferencia', 
                                    note: 'Reembolso por cancelación anticipada' 
                                  });
                                  setCancelModal({ open: true, reserva: r });
                                }}
                              >
                                Cancelar Reserva
                              </Button>"""

content = re.sub(cancel_btn_regex, new_cancel_btn, content, flags=re.DOTALL)

# 4. Add the Modal JSX at the bottom
cancel_modal_jsx = """
      {/* Cancel Reservation Modal */}
      <Dialog open={cancelModal.open} onOpenChange={(o) => setCancelModal(p => ({ ...p, open: o }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Reserva</DialogTitle>
          </DialogHeader>
          {cancelModal.reserva && (
            <div className="space-y-4 py-4">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <p className="text-sm text-amber-800 font-medium">Al cancelar esta reserva, las fechas serán liberadas en el calendario.</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Abonado por el Cliente:</span>
                <span className="text-sm font-bold text-gray-900">
                  {(() => {
                    const r = cancelModal.reserva as any;
                    const ingresos = (r.transacciones || []).filter((t:any) => t.tipo === 'ingreso');
                    if (ingresos.length > 0) {
                      const sumMx = ingresos.filter((t:any)=>t.moneda==='MXN').reduce((a:any,b:any)=>a+Number(b.monto),0);
                      const sumUsd = ingresos.filter((t:any)=>t.moneda==='USD').reduce((a:any,b:any)=>a+Number(b.monto),0);
                      let parts = [];
                      if (sumMx > 0) parts.push(formatPrice(sumMx) + ' MXN');
                      if (sumUsd > 0) parts.push(formatPrice(sumUsd) + ' USD');
                      return parts.join(' / ');
                    }
                    return formatPrice(Number(r.monto_apartado || 0)) + ' MXN';
                  })()}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <input 
                  type="checkbox" 
                  id="willRefund" 
                  checked={cancelData.willRefund}
                  onChange={e => setCancelData({...cancelData, willRefund: e.target.checked})}
                  className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                />
                <label htmlFor="willRefund" className="text-sm font-medium text-gray-900">
                  ¿Se realizará un reembolso al cliente?
                </label>
              </div>

              {cancelData.willRefund && (
                <div className="pl-6 space-y-4 border-l-2 border-purple-100 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Monto a reembolsar</label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={cancelData.amount}
                        onChange={e => setCancelData({...cancelData, amount: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Moneda</label>
                      <select 
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={cancelData.currency}
                        onChange={e => setCancelData({...cancelData, currency: e.target.value})}
                      >
                        <option value="MXN">MXN</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Método de reembolso</label>
                    <select 
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={cancelData.method}
                      onChange={e => setCancelData({...cancelData, method: e.target.value})}
                    >
                      <option value="transferencia">Transferencia Bancaria</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="stripe">Stripe</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Concepto / Nota (Opcional)</label>
                    <input 
                      type="text" 
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={cancelData.note}
                      onChange={e => setCancelData({...cancelData, note: e.target.value})}
                      placeholder="Ej. Reembolso por cancelación anticipada"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setCancelModal({ open: false, reserva: null })} disabled={isCanceling}>Cerrar</Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white" 
              disabled={isCanceling}
              onClick={async () => {
                if (!cancelModal.reserva) return;
                
                const r = cancelModal.reserva as any;
                const totalMx = (r.transacciones || []).filter((t:any) => t.tipo === 'ingreso' && t.moneda === 'MXN').reduce((s:number,t:any)=>s+Number(t.monto),0);
                const totalUsd = (r.transacciones || []).filter((t:any) => t.tipo === 'ingreso' && t.moneda === 'USD').reduce((s:number,t:any)=>s+Number(t.monto),0);
                
                if (cancelData.willRefund) {
                  const amount = Number(cancelData.amount);
                  if (isNaN(amount) || amount <= 0) {
                    alert('Por favor ingresa un monto mayor a 0 para el reembolso.');
                    return;
                  }
                  if (cancelData.currency === 'MXN' && amount > totalMx && totalUsd === 0 && totalMx > 0) {
                     // Solo validar estrictamente si hay montos claros, para no bloquear edge cases
                     if (!confirm(`El monto ingresado ($${amount}) parece ser mayor a lo abonado ($${totalMx}). ¿Deseas continuar?`)) return;
                  }
                }
                
                setIsCanceling(true);
                
                let tc = 1.0;
                if (cancelData.currency === 'USD') {
                  const tcs = (r.transacciones || []).filter((t:any) => t.moneda === 'USD' && t.tipo_cambio).map((t:any) => Number(t.tipo_cambio));
                  tc = tcs.length > 0 ? tcs[0] : 18.5; // fallback
                }

                const res = await cancelarReservaConReembolso(r.id, cancelData.willRefund ? {
                  monto: Number(cancelData.amount),
                  moneda: cancelData.currency,
                  metodo: cancelData.method,
                  concepto: cancelData.note,
                  tipoCambio: tc
                } : undefined);
                
                setIsCanceling(false);
                
                if (res.success) {
                  setCancelModal({ open: false, reserva: null });
                } else {
                  alert("Error al cancelar: " + res.error);
                }
              }}
            >
              {isCanceling ? 'Procesando...' : (cancelData.willRefund ? 'Cancelar con Reembolso' : 'Cancelar Reserva')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
"""

# Append just before the final `</div>`
# In `ReservasClient.tsx`, usually the file ends with:
#       </Dialog>
#     </div>
#   )
# }
content = content.replace("    </div>\n  )\n}", cancel_modal_jsx + "    </div>\n  )\n}")

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

