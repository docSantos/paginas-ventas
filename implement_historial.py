import re

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace(
    "import { marcarCheckIn, marcarCheckOut, liquidarSaldoRecepcion, checkOutAnticipado } from '@/app/casasgaby/admin/actions'",
    "import { marcarCheckIn, marcarCheckOut, liquidarSaldoRecepcion, checkOutAnticipado, revertirCheckOut } from '@/app/casasgaby/admin/actions'"
)
content = content.replace(
    "import { UserCheck, UserMinus, MessageCircle, MapPin, CalendarDays, Wallet, Clock, AlertTriangle } from 'lucide-react'",
    "import { UserCheck, UserMinus, MessageCircle, MapPin, CalendarDays, Wallet, Clock, AlertTriangle, History, Undo2 } from 'lucide-react'"
)

# 2. Add modalHistorial state
content = content.replace(
    "const [modalAnticipado, setModalAnticipado] = useState<any>(null)",
    "const [modalAnticipado, setModalAnticipado] = useState<any>(null)\n  const [modalHistorial, setModalHistorial] = useState<any>(null)"
)

# 3. Add handleRevertir function
handle_revertir_code = """
  const handleRevertirCheckOut = async (r: any) => {
    if (!confirm('¿Seguro que deseas revertir la salida y devolver al huésped a In-House?')) return
    try {
      setLoadingId(r.id + '-revertir')
      const res = await revertirCheckOut(r.id)
      if (res.success) {
        setLocalReservas(prev => prev.map(reserva => reserva.id === r.id ? { ...reserva, check_out_real_at: null } : reserva))
      } else {
        alert('Error: ' + res.error)
      }
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoadingId(null)
    }
  }
"""
content = content.replace("  const handleMetodoPagoChange", handle_revertir_code + "\n  const handleMetodoPagoChange")

# 4. Filter logic for Salidas Recientes
filter_old = """  const arrivals = localReservas.filter(r => r.check_in_real_at === null && r.fecha_entrada === todayStr)
  const inHouse = localReservas.filter(r => r.check_out_real_at === null && (r.check_in_real_at !== null || (r.fecha_entrada <= todayStr && r.fecha_salida >= todayStr)))"""
filter_new = """  const arrivals = localReservas.filter(r => r.check_in_real_at === null && r.fecha_entrada === todayStr)
  const inHouse = localReservas.filter(r => r.check_out_real_at === null && (r.check_in_real_at !== null || (r.fecha_entrada <= todayStr && r.fecha_salida >= todayStr)))
  const salidasHoy = localReservas.filter(r => r.check_out_real_at !== null && r.check_out_real_at.startsWith(todayStr))"""
content = content.replace(filter_old, filter_new)

# 5. Update UI for Todo Pagado / Deuda to be clickable
todo_pagado_old = r"""<span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-2 rounded-md w-full sm:w-auto text-center border border-green-100">
\s*Todo Pagado
\s*</span>"""
todo_pagado_new = """<button onClick={() => setModalHistorial(r)} className="text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-md w-full sm:w-auto text-center border border-green-200 transition-colors flex justify-center items-center gap-1.5 cursor-pointer">
  <History className="w-3.5 h-3.5" /> Todo Pagado
</button>"""
content = re.sub(todo_pagado_old, todo_pagado_new, content)

deuda_old = r"""<span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-md w-full sm:w-auto text-center border border-red-100">
\s*Deuda: \{formatPrice\(saldo\)\}
\s*</span>"""
deuda_new = """<button onClick={() => setModalHistorial(r)} className="text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md w-full sm:w-auto text-center border border-red-200 transition-colors flex justify-center items-center gap-1.5 cursor-pointer">
  <History className="w-3.5 h-3.5" /> Deuda: {formatPrice(saldo)}
</button>"""
content = re.sub(deuda_old, deuda_new, content)

# 6. Add Salidas Recientes section after InHouse section
inhouse_end_marker = "      </Card>\n\n      {/* MODAL DE LIQUIDACIÓN */}"
salidas_jsx = """      </Card>

      {/* SECCIÓN 3: SALIDAS RECIENTES */}
      {salidasHoy.length > 0 && (
        <Card className="border-gray-200 bg-white opacity-80 hover:opacity-100 transition-opacity">
          <CardHeader className="bg-gray-50 border-b border-gray-100 py-3">
            <CardTitle className="text-gray-600 flex items-center gap-2 text-sm font-medium">
              <History className="w-4 h-4 text-gray-500" />
              Salidas Recientes (Hoy)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {salidasHoy.map(r => (
                <div key={r.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-gray-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 line-through decoration-gray-300">{r.nombre_cliente}</h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        Check-out completado
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {r.propiedades?.titulo}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Out: {format(parseISO(r.check_out_real_at), 'HH:mm', { locale: es })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full sm:w-auto">
                    <Button 
                      onClick={() => handleRevertirCheckOut(r)}
                      disabled={loadingId === r.id + '-revertir'}
                      variant="outline"
                      className="w-full sm:w-auto text-gray-600 hover:text-gray-900 border-gray-300 gap-2"
                    >
                      <Undo2 className="w-4 h-4" />
                      {loadingId === r.id + '-revertir' ? 'Revirtiendo...' : 'Revertir Check-out'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* MODAL DE LIQUIDACIÓN */}"""
content = content.replace(inhouse_end_marker, salidas_jsx)

# 7. Add Modal Historial
modal_historial_jsx = """
      {/* MODAL DE HISTORIAL DE PAGOS */}
      {modalHistorial && (() => {
        const r = modalHistorial
        const saldo = getSaldo(r)
        const total = Number(r.monto_total_acordado) || Number(r.costo_total) || 0
        const transacciones = r.transacciones?.filter((t: any) => t.tipo === 'ingreso') || []
        const totalPagado = total - saldo

        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-500" />
                  Historial de Pagos
                </h2>
                <button onClick={() => setModalHistorial(null)} className="text-gray-400 hover:text-gray-600 p-1">
                  ✕
                </button>
              </div>
              
              <div className="p-5 space-y-4 overflow-y-auto">
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 mb-4 text-sm">
                  <p className="text-indigo-900"><strong>Huésped:</strong> {r.nombre_cliente}</p>
                  <p className="text-indigo-900"><strong>Propiedad:</strong> {r.propiedades?.titulo}</p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-sm">Transacciones Registradas</h3>
                  {transacciones.length === 0 ? (
                    <p className="text-sm text-gray-500 italic p-4 text-center border border-dashed rounded-lg">No hay pagos registrados.</p>
                  ) : (
                    <div className="space-y-2">
                      {transacciones.map((t: any, idx: number) => (
                        <div key={idx} className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm text-sm">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-gray-900">{formatPrice(Number(t.monto_mxn || t.monto))} MXN</span>
                            <span className="text-xs text-gray-500">{t.created_at ? format(parseISO(t.created_at), 'dd MMM yyyy HH:mm', { locale: es }) : 'Reciente'}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                            <div><span className="font-medium text-gray-700">Método:</span> {t.metodo_pago || 'Desconocido'}</div>
                            {t.moneda === 'USD' && <div><span className="font-medium text-gray-700">Monto Orig:</span> {t.monto} USD (TC: {t.tipo_cambio})</div>}
                            <div className="col-span-2 mt-1 italic text-gray-500">{t.concepto || 'Sin referencias'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50 mt-auto">
                <div className="space-y-1 mb-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Total de la estancia:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Abonado acumulado:</span>
                    <span>{formatPrice(totalPagado)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Saldo Restante:</span>
                    <span className={saldo > 0.5 ? 'text-red-600' : 'text-green-600'}>{formatPrice(saldo)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setModalHistorial(null)}>
                    Cerrar
                  </Button>
                  {saldo > 0.5 && (
                    <Button 
                      onClick={() => {
                        setModalHistorial(null)
                        handleLiquidar(r)
                      }} 
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Registrar Pago
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })()}
"""
content = content.replace("{/* MODAL DE CHECK-OUT ANTICIPADO */}", modal_historial_jsx + "\n      {/* MODAL DE CHECK-OUT ANTICIPADO */}")

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
