import re

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add new state for the new modal if not there
if "const [modalAnticipado" not in content:
    content = content.replace(
        "const [modalReserva, setModalReserva] = useState<any>(null)",
        "const [modalReserva, setModalReserva] = useState<any>(null)\n  const [modalAnticipado, setModalAnticipado] = useState<any>(null)"
    )

# Replace handleCheckOut function
old_handle = r"  const handleCheckOut = async \(r: any\) => \{[\s\S]*?\} finally \{\s*setLoadingId\(null\)\s*\}\s*\}"
new_handle = """  const handleCheckOut = async (r: any) => {
    // 1. Detección de salida anticipada PRIMERO
    if (r.fecha_salida > todayStr) {
      setModalAnticipado(r)
      return
    }
    
    // 2. Checkout normal (solo si fecha de salida es hoy o anterior)
    const saldo = getSaldo(r)
    if (saldo > 0) {
      alert(`No se puede realizar check-out con saldo pendiente (${formatPrice(saldo)} MXN). Usa el botón "Liquidar o abonar" primero.`)
      return
    }

    try {
      setLoadingId(r.id)
      const res = await marcarCheckOut(r.id)
      if (res.success) {
        setLocalReservas(prev => prev.filter(reserva => reserva.id !== r.id))
      } else {
        alert('Error: ' + res.error)
      }
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoadingId(null)
    }
  }

  const procesarAnticipado = async () => {
    if (!modalAnticipado) return
    const r = modalAnticipado
    
    let nochesEfectivas = differenceInDays(new Date(), parseISO(r.fecha_entrada))
    if (nochesEfectivas <= 0) nochesEfectivas = 1
    
    const nochesOriginales = differenceInDays(parseISO(r.fecha_salida), parseISO(r.fecha_entrada))
    const precioNoche = Number(r.propiedades?.precio_por_noche) || (Number(r.costo_total) / nochesOriginales) || 0
    const nuevoCosto = nochesEfectivas * precioNoche
    
    const saldoOriginal = getSaldo(r)
    const totalAbonado = (Number(r.monto_total_acordado) || Number(r.costo_total) || 0) - saldoOriginal
    
    const nuevoSaldo = nuevoCosto - totalAbonado

    try {
      setLoadingId('submit-anticipado')
      if (nuevoSaldo > 0) {
        // Recalcular pero no marcar salida, luego abrir modal de cobro
        const res = await checkOutAnticipado(r.id, nuevoCosto, todayStr, false)
        if (res.success) {
          // Update local state with new cost
          const updatedReserva = { ...r, costo_total: nuevoCosto, monto_total_acordado: nuevoCosto, fecha_salida: todayStr }
          setLocalReservas(prev => prev.map(reserva => reserva.id === r.id ? updatedReserva : reserva))
          setModalAnticipado(null)
          
          // Abre modal de cobro para pagar el resto
          setModalReserva(updatedReserva)
          setMontoPago(nuevoSaldo.toString())
          setMetodoPago('Efectivo MXN')
          setNotasPago('Liquidación por salida anticipada ajustada')
          setTc('16.00')
        } else {
          alert('Error: ' + res.error)
        }
      } else {
        // Saldo cero o a favor (se asume 0 para liberar) -> marcar checkout real
        const res = await checkOutAnticipado(r.id, nuevoCosto, todayStr, true)
        if (res.success) {
          setLocalReservas(prev => prev.filter(reserva => reserva.id !== r.id))
          setModalAnticipado(null)
        } else {
          alert('Error: ' + res.error)
        }
      }
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoadingId(null)
    }
  }"""
content = re.sub(old_handle, new_handle, content)

# Remove old terms in texts (just in case)
content = content.replace("Liquidar en recepción", "Liquidar o abonar")
content = content.replace("Liquidar en recepcin", "Liquidar o abonar")

# Fix secondary button in card
card_button_old = r"""<Button \s*onClick=\{([^}]+)\}\s*disabled=\{loadingId === r\.id\}\s*variant="default"\s*className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white shadow-sm"\s*>\s*\{loadingId === r\.id \? 'Marcando\.\.\.' : 'Marcar Check-out'\}\s*</Button>"""

card_button_new = """<div className="flex flex-col gap-2 w-full sm:w-auto">
                        <Button 
                          onClick={() => handleCheckOut(r)}
                          disabled={loadingId === r.id}
                          variant="default"
                          className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
                        >
                          {loadingId === r.id ? 'Marcando...' : 'Marcar Check-out'}
                        </Button>
                        {r.fecha_salida > todayStr && (
                          <button
                            onClick={() => setModalAnticipado(r)}
                            disabled={loadingId === r.id}
                            className="text-xs text-indigo-600 hover:text-indigo-800 underline text-right w-full font-medium"
                          >
                            Salida anticipada
                          </button>
                        )}
                      </div>"""

content = re.sub(card_button_old, card_button_new, content)

# Inject the new Modal HTML
modal_anticipado_jsx = """
      {/* MODAL DE CHECK-OUT ANTICIPADO */}
      {modalAnticipado && (() => {
        const r = modalAnticipado
        let nochesEfectivas = differenceInDays(new Date(), parseISO(r.fecha_entrada))
        if (nochesEfectivas <= 0) nochesEfectivas = 1
        
        const nochesOriginales = differenceInDays(parseISO(r.fecha_salida), parseISO(r.fecha_entrada))
        const precioNoche = Number(r.propiedades?.precio_por_noche) || (Number(r.costo_total) / nochesOriginales) || 0
        const nuevoCosto = nochesEfectivas * precioNoche
        
        const saldoOriginal = getSaldo(r)
        const totalAbonado = (Number(r.monto_total_acordado) || Number(r.costo_total) || 0) - saldoOriginal
        const nuevoSaldo = nuevoCosto - totalAbonado

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-24 sm:pb-6 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
                <h2 className="text-lg font-bold text-indigo-900">Ajuste de Estancia (Salida Anticipada)</h2>
                <button onClick={() => setModalAnticipado(null)} className="text-gray-400 hover:text-gray-600 p-1">
                  ✕
                </button>
              </div>
              
              <div className="p-5 space-y-4 overflow-y-auto">
                <p className="text-sm text-gray-600">
                  El huésped se retira antes de la fecha programada ({format(parseISO(r.fecha_salida), 'dd MMM yy', { locale: es })}). 
                  Se calculará el nuevo costo con base en las noches reales transcurridas.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Noches habitadas (reales):</span>
                    <span className="font-semibold text-gray-900">{nochesEfectivas} de {nochesOriginales}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tarifa recalculada:</span>
                    <span className="font-semibold text-gray-900">{formatPrice(nuevoCosto)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total abonado a la fecha:</span>
                    <span className="font-semibold text-gray-900">{formatPrice(totalAbonado)}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                    <span className="font-bold text-gray-900">Nuevo saldo pendiente:</span>
                    <span className={`font-bold ${nuevoSaldo > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {nuevoSaldo > 0 ? formatPrice(nuevoSaldo) : 'Todo Pagado / A favor'}
                    </span>
                  </div>
                </div>
                
                {nuevoSaldo > 0 && (
                  <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100 font-medium">
                    Al confirmar este ajuste, el sistema abrirá la ventana de pagos para liquidar el saldo restante de {formatPrice(nuevoSaldo)} antes de entregar las llaves.
                  </p>
                )}
                {nuevoSaldo <= 0 && (
                  <p className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100 font-medium">
                    La reserva está cubierta. El check-out se marcará de inmediato y la propiedad quedará liberada.
                  </p>
                )}
              </div>

              <div className="p-5 border-t border-gray-100 flex gap-3 bg-gray-50 mt-auto">
                <Button variant="outline" className="flex-1" onClick={() => setModalAnticipado(null)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={procesarAnticipado} 
                  disabled={loadingId === 'submit-anticipado'} 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {loadingId === 'submit-anticipado' ? 'Procesando...' : 'Aceptar Reajuste'}
                </Button>
              </div>
            </div>
          </div>
        )
      })()}
"""

idx = content.find("{/* MODAL DE LIQUIDACIÓN */}")
if idx != -1:
    content = content[:idx] + modal_anticipado_jsx + content[idx:]

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
