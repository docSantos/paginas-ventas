import re

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the UI for modal
new_modal_jsx = """      {/* MODAL DE LIQUIDACIÓN */}
      {modalReserva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Registrar Pago / Liquidación</h2>
              <button onClick={() => setModalReserva(null)} className="text-gray-400 hover:text-gray-600 p-1">
                ✕
              </button>
            </div>
            
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <p className="text-sm text-indigo-900"><strong>Huésped:</strong> {modalReserva.nombre_cliente}</p>
                <p className="text-sm text-indigo-900"><strong>Propiedad:</strong> {modalReserva.propiedades?.titulo}</p>
                <p className="text-sm text-indigo-900 mt-1"><strong>Saldo Pendiente:</strong> {formatPrice(getSaldo(modalReserva))}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Monto a Pagar {metodoPago.includes('USD') ? '(USD)' : '(MXN)'}</label>
                <Input 
                  type="number" 
                  value={montoPago} 
                  onChange={e => setMontoPago(e.target.value)} 
                  placeholder="Ej. 1500" 
                  className="font-semibold text-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Método de Pago</label>
                <select 
                  className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={metodoPago}
                  onChange={e => setMetodoPago(e.target.value)}
                >
                  <option value="Efectivo MXN">Efectivo MXN</option>
                  <option value="Efectivo USD">Efectivo USD</option>
                  <option value="Transferencia MXN">Transferencia MXN</option>
                  <option value="Transferencia USD">Transferencia USD</option>
                </select>
              </div>

              {metodoPago.includes('USD') && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Tipo de Cambio (MXN/USD)</label>
                  <Input 
                    type="number" 
                    value={tc} 
                    onChange={e => setTc(e.target.value)} 
                    placeholder="Ej. 16.00" 
                    className="font-semibold text-lg"
                  />
                  <p className="text-xs text-amber-700 font-medium bg-amber-50 p-2 rounded border border-amber-100">
                    Equivalente en MXN: {formatPrice(Number(montoPago || 0) * Number(tc || 0))}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Referencia / Notas (Opcional)</label>
                <Input 
                  value={notasPago} 
                  onChange={e => setNotasPago(e.target.value)} 
                  placeholder="Ej. Liquidación en recepción" 
                />
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex gap-3 bg-gray-50/50 mt-auto">
              <Button variant="outline" className="flex-1" onClick={() => setModalReserva(null)}>
                Cancelar
              </Button>
              <Button 
                onClick={submitLiquidacion} 
                disabled={loadingId === 'submit-pago' || Number(montoPago) <= 0 || (metodoPago.includes('USD') ? Number(montoPago) * Number(tc) : Number(montoPago)) > getSaldo(modalReserva)} 
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {loadingId === 'submit-pago' ? 'Registrando...' : 'Confirmar Pago'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}"""

idx = content.find("{/* MODAL DE")
if idx != -1:
    content = content[:idx] + new_modal_jsx

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
