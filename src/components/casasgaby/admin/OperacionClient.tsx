'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserCheck, UserMinus, MessageCircle, MapPin, CalendarDays, Wallet, Clock, AlertTriangle, History, Undo2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { format, parseISO, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { marcarCheckIn, marcarCheckOut, liquidarSaldoRecepcion, checkOutAnticipado, revertirCheckOut } from '@/app/casasgaby/admin/actions'

export function OperacionClient({ reservas }: { reservas: any[] }) {
  const [localReservas, setLocalReservas] = useState<any[]>(reservas)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [modalReserva, setModalReserva] = useState<any>(null)
  const [modalAnticipado, setModalAnticipado] = useState<any>(null)
  const [modalHistorial, setModalHistorial] = useState<any>(null)
  const [montoPago, setMontoPago] = useState<string>('')
  const [metodoPago, setMetodoPago] = useState('Efectivo MXN')
  const [notasPago, setNotasPago] = useState('')
  const [tc, setTc] = useState('16.00')
  
  const todayStr = new Date().toLocaleDateString('en-CA')

  const getSaldo = (r: any) => {
    const total = Number(r.monto_total_acordado) || Number(r.costo_total) || 0
    let abonado = 0
    if (r.transacciones && r.transacciones.length > 0) {
      abonado = r.transacciones.filter((t: any) => t.tipo === 'ingreso').reduce((sum: number, t: any) => sum + (Number(t.monto_mxn) || Number(t.monto) || 0), 0)
    } else {
      abonado = Number(r.monto_apartado) || 0
    }
    return Math.max(0, Math.round((total - abonado) * 100) / 100)
  }

  const arrivals = localReservas.filter(r => {
    return r.fecha_entrada === todayStr && !r.check_in_real_at && !r.check_out_real_at
  })

  const inHouse = localReservas.filter(r => {
    if (r.check_out_real_at) return false; // Inmediatamente removido al marcar check-out
    
    const hasCheckIn = !!r.check_in_real_at
    const isDateActive = r.fecha_entrada <= todayStr && r.fecha_salida >= todayStr
    
    if (hasCheckIn) return true;
    if (!hasCheckIn && isDateActive) return true;
    
    return false;
  }).filter(r => !arrivals.some(a => a.id === r.id))

  const handleCheckIn = async (id: string) => {
    try {
      setLoadingId(id)
      const res = await marcarCheckIn(id)
      if (res.success) {
        setLocalReservas(prev => prev.map(r => r.id === id ? { ...r, check_in_real_at: new Date().toISOString() } : r))
      } else {
        alert('Error al marcar check-in: ' + res.error)
      }
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoadingId(null)
    }
  }

  const handleCheckOut = async (r: any) => {
    // 1. Detección de salida anticipada PRIMERO
    if (r.fecha_salida > todayStr) {
      setModalAnticipado(r)
      return
    }
    
    // 2. Checkout normal (solo si fecha de salida es hoy o anterior)
    const saldo = getSaldo(r)
    if (saldo > 0.5) {
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
    const costoOriginal = Number(r.monto_total_acordado) || Number(r.costo_total) || 0
    let precioNoche = Number(r.propiedades?.precio_por_noche) || (costoOriginal / nochesOriginales) || 0
    
    let extras = costoOriginal - (nochesOriginales * precioNoche)
    if (extras < 0) {
      precioNoche = costoOriginal / nochesOriginales
      extras = 0
    }
    
    const costoHospedaje = parseFloat((nochesEfectivas * precioNoche).toFixed(2))
    const nuevoCosto = parseFloat((costoHospedaje + extras).toFixed(2))
    
    const saldoOriginal = getSaldo(r)
    const totalAbonado = parseFloat((costoOriginal - saldoOriginal).toFixed(2))
    
    const nuevoSaldo = parseFloat((nuevoCosto - totalAbonado).toFixed(2))

    try {
      setLoadingId('submit-anticipado')
      if (nuevoSaldo > 0.5) {
        // Recalcular pero no marcar salida, luego abrir modal de cobro
        const res = await checkOutAnticipado(r.id, nuevoCosto, todayStr, false)
        if (res.success) {
          // Update local state with new cost
          const updatedReserva = { ...r, costo_total: nuevoCosto, monto_total_acordado: nuevoCosto, fecha_salida: todayStr }
          setLocalReservas(prev => prev.map(reserva => reserva.id === r.id ? updatedReserva : reserva))
          setModalAnticipado(null)
          
          // Abre modal de cobro para pagar el resto
          setModalReserva(updatedReserva)
          setMontoPago(nuevoSaldo.toFixed(2))
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
  }

    const handleLiquidar = (r: any) => {
    setModalReserva(r)
    setMontoPago(getSaldo(r).toFixed(2))
    setMetodoPago('Efectivo MXN')
    setNotasPago('')
  }

  

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

  const handleMetodoPagoChange = (val: string) => {
    setMetodoPago(val)
    if (!modalReserva) return
    const saldo = getSaldo(modalReserva)
    if (val.includes('USD')) {
      setMontoPago((saldo / Number(tc || 16)).toFixed(2))
    } else {
      setMontoPago(saldo.toString())
    }
  }

  const handleTcChange = (val: string) => {
    setTc(val)
    if (!modalReserva || !metodoPago.includes('USD')) return
    const saldo = getSaldo(modalReserva)
    const newTc = Number(val)
    if (newTc > 0) {
      setMontoPago((saldo / newTc).toFixed(2))
    }
  }

  const submitLiquidacion = async () => {
    if (!modalReserva) return
    const monto = Number(montoPago)
    const saldo = getSaldo(modalReserva)
    const tipoCambio = Number(tc)
    
    if (isNaN(monto) || monto <= 0) return alert('El monto debe ser mayor a 0.')
    
    const isUSD = metodoPago.includes('USD')
    const equivalenteMXN = parseFloat((isUSD ? monto * tipoCambio : monto).toFixed(2))
    
    if (equivalenteMXN > saldo) return alert('El equivalente en MXN (' + formatPrice(equivalenteMXN) + ') no puede ser mayor al saldo pendiente de ' + formatPrice(saldo))

    try {
      setLoadingId('submit-pago')
      const moneda = isUSD ? 'USD' : 'MXN'
      const res = await liquidarSaldoRecepcion(modalReserva.id, monto, modalReserva.cliente_id, metodoPago, notasPago, moneda, isUSD ? tipoCambio : 1)
      if (res.success) {
        setLocalReservas(prev => prev.map(reserva => {
          if (reserva.id === modalReserva.id) {
            return {
              ...reserva,
              transacciones: [...(reserva.transacciones || []), { tipo: 'ingreso', monto_mxn: equivalenteMXN }]
            }
          }
          return reserva
        }))
        setModalReserva(null)
      } else {
        alert('Error al liquidar: ' + res.error)
      }
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoadingId(null)
    }
  }

  const buildWaUrl = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/\D/g, '')
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
  }

  return (
    <div className="space-y-8">
      {/* SECCIÓN 1: LLEGADAS DEL DÍA */}
      <Card className="border-teal-100 bg-white">
        <CardHeader className="bg-teal-50/50 border-b border-teal-100">
          <CardTitle className="text-teal-900 flex items-center gap-2 text-lg">
            <UserCheck className="w-5 h-5 text-teal-600" />
            Llegadas del Día (Arrivals)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {arrivals.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No hay llegadas programadas para hoy.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {arrivals.map(r => {
                const saldo = getSaldo(r)
                const noches = differenceInDays(parseISO(r.fecha_salida), parseISO(r.fecha_entrada))
                
                return (
                  <div key={r.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-gray-50 transition-colors">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900">{r.nombre_cliente}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {r.propiedades?.titulo}</span>
                        <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4" /> {noches} noches ({r.num_huespedes} pax)</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <a 
                          href={buildWaUrl(r.telefono, `Hola ${r.nombre_cliente}, te esperamos hoy en ${r.propiedades?.titulo} para tu check-in.`)}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md hover:bg-emerald-100"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Contactar
                        </a>
                        {saldo > 0.5 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-md">
                            <Wallet className="w-3.5 h-3.5" /> Saldo: {formatPrice(saldo)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-md">
                            <Wallet className="w-3.5 h-3.5" /> Pagado
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleCheckIn(r.id)}
                      disabled={loadingId === r.id}
                      className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      {loadingId === r.id ? 'Marcando...' : 'Marcar Check-in'}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECCIÓN 2: IN-HOUSE */}
      <Card className="border-indigo-100 bg-white">
        <CardHeader className="bg-indigo-50/50 border-b border-indigo-100">
          <CardTitle className="text-indigo-900 flex items-center gap-2 text-lg">
            <UserMinus className="w-5 h-5 text-indigo-600" />
            Huéspedes en Vivo (In-House)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {inHouse.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No hay huéspedes actualmente alojados.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {inHouse.map(r => {
                const saldo = getSaldo(r)
                const checkInDate = r.check_in_real_at ? parseISO(r.check_in_real_at) : parseISO(r.fecha_entrada)
                const nochesTotales = differenceInDays(parseISO(r.fecha_salida), parseISO(r.fecha_entrada))
                let nochesTranscurridas = differenceInDays(new Date(), checkInDate)
                if (nochesTranscurridas < 0) nochesTranscurridas = 0
                
                return (
                  <div key={r.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-gray-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{r.nombre_cliente}</h3>
                        {r.fecha_salida > todayStr && (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                            Día {nochesTranscurridas} de {nochesTotales}
                          </span>
                        )}
                        {r.fecha_salida === todayStr && (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Sale Hoy
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {r.propiedades?.titulo}</span>
                        <span className="flex items-center gap-1 text-gray-600 font-medium">
                          <Clock className="w-4 h-4" /> 
                          In: {format(checkInDate, 'dd MMM yy HH:mm', { locale: es })} 
                          {' -> '} 
                          Out: {format(parseISO(r.fecha_salida), 'dd MMM yy', { locale: es })}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <a 
                          href={buildWaUrl(r.telefono, `Hola ${r.nombre_cliente}, esperamos que tu estancia en ${r.propiedades?.titulo} sea excelente.`)}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md hover:bg-emerald-100"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Contactar
                        </a>
                      </div>
                    </div>
                    
                    <div className="w-full sm:w-auto flex flex-col items-end gap-2">
                      {saldo > 0.5 ? (
                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                          <button onClick={() => setModalHistorial(r)} className="text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md w-full sm:w-auto text-center border border-red-200 transition-colors flex justify-center items-center gap-1.5 cursor-pointer">
  <History className="w-3.5 h-3.5" /> Deuda: {formatPrice(saldo)}
</button>
                          <Button 
                            onClick={() => handleLiquidar(r)}
                            disabled={loadingId === r.id + '-liquidar'}
                            variant="outline"
                            className="w-full sm:w-auto border-amber-200 text-amber-700 hover:bg-amber-50"
                          >
                            Liquidar o abonar
                          </Button>
                        </div>
                      ) : (
                        <button onClick={() => setModalHistorial(r)} className="text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-md w-full sm:w-auto text-center border border-green-200 transition-colors flex justify-center items-center gap-1.5 cursor-pointer">
  <History className="w-3.5 h-3.5" /> Todo Pagado
</button>
                      )}
                      
                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <Button 
                        onClick={() => handleCheckOut(r)}
                        disabled={loadingId === r.id}
                        variant="default"
                        className={`w-full sm:w-auto text-white shadow-sm ${
                          r.fecha_salida > todayStr 
                            ? 'bg-slate-700 hover:bg-slate-800' 
                            : 'bg-gray-900 hover:bg-gray-800'
                        }`}
                      >
                        {loadingId === r.id ? 'Procesando...' : (r.fecha_salida > todayStr ? 'Check-out Anticipado' : 'Marcar Check-out')}
                      </Button>
                    </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

            
      
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

      {/* MODAL DE CHECK-OUT ANTICIPADO */}
      {modalAnticipado && (() => {
        const r = modalAnticipado
        let nochesEfectivas = differenceInDays(new Date(), parseISO(r.fecha_entrada))
        if (nochesEfectivas <= 0) nochesEfectivas = 1
        
        const nochesOriginales = differenceInDays(parseISO(r.fecha_salida), parseISO(r.fecha_entrada))
        const precioNoche = Number(r.propiedades?.precio_por_noche) || (Number(r.costo_total) / nochesOriginales) || 0
        const nuevoCosto = parseFloat((nochesEfectivas * precioNoche).toFixed(2))
        
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
                    <span className={`font-bold ${nuevoSaldo > 0.5 ? 'text-red-600' : 'text-green-600'}`}>
                      {nuevoSaldo > 0.5 ? formatPrice(nuevoSaldo) : 'Todo Pagado / A favor'}
                    </span>
                  </div>
                </div>
                
                {nuevoSaldo > 0.5 && (
                  <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100 font-medium">
                    Al confirmar este ajuste, el sistema abrirá la ventana de pagos para liquidar el saldo restante de {formatPrice(nuevoSaldo)} antes de entregar las llaves.
                  </p>
                )}
                {nuevoSaldo <= 0.5 && (
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
{/* MODAL DE LIQUIDACIÓN */}
      {modalReserva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-24 sm:pb-6 bg-black/50 backdrop-blur-sm overflow-y-auto">
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
                  className="font-semibold text-lg" step="0.01"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Método de Pago</label>
                <select 
                  className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={metodoPago}
                  onChange={e => handleMetodoPagoChange(e.target.value)}
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
                    onChange={e => handleTcChange(e.target.value)} 
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
}