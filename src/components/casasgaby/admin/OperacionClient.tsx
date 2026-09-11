'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UserCheck, UserMinus, MessageCircle, MapPin, CalendarDays, Wallet, Clock, AlertTriangle, History, Undo2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { FinanzasCard, calcularFinanzasReserva } from './FinanzasCard'
import { format, parseISO, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { marcarCheckIn, marcarCheckOut, liquidarSaldoRecepcion, checkOutAnticipado, revertirCheckOut, actualizarTarifaBase, agregarAjusteReserva, eliminarAjusteReserva } from '@/app/casasgaby/admin/actions'
import { useRouter } from 'next/navigation'

export function OperacionClient({ reservas, servicios = [] }: { reservas: any[], servicios?: any[] }) {
  const [localReservas, setLocalReservas] = useState<any[]>(reservas)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [modalReserva, setModalReserva] = useState<any>(null)
  const [modalAnticipado, setModalAnticipado] = useState<any>(null)
  const [serviciosAjustados, setServiciosAjustados] = useState<{ [key: string]: any }>({})
  const [accionSaldoFavor, setAccionSaldoFavor] = useState<'reembolsar' | 'penalizacion'>('reembolsar')
  const [metodoReembolso, setMetodoReembolso] = useState('Efectivo MXN')
  const [modalHistorial, setModalHistorial] = useState<any>(null)
  const [montoPago, setMontoPago] = useState<string>('')
  const [metodoPago, setMetodoPago] = useState('Efectivo MXN')
  const [notasPago, setNotasPago] = useState('')
  const [tc, setTc] = useState('16.00')
  const [editTarifaModal, setEditTarifaModal] = useState<{ open: boolean, reservaId: string, currentBase: number }>({ open: false, reservaId: '', currentBase: 0 })
  const [ajusteModal, setAjusteModal] = useState<{ open: boolean, reservaId: string }>({ open: false, reservaId: '' })
  const [ajusteData, setAjusteData] = useState({ tipo: 'catalogo', catalogoId: '', concepto: '', monto: '' })

  
  const router = useRouter()
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Cancun' }).format(new Date())

  
  const handleActualizarTarifa = async () => {
    try {
      await actualizarTarifaBase(editTarifaModal.reservaId, Number(editTarifaModal.currentBase));
      setEditTarifaModal({ open: false, reservaId: '', currentBase: 0 });
      router.refresh();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  const handleAgregarAjuste = async () => {
    let conceptoFinal = ajusteData.concepto;
    let montoFinal = ajusteData.monto;
    let tipoReal: 'cargo' | 'descuento' = 'cargo';
    let esServicio = false;

    if (ajusteData.tipo === 'catalogo') {
      const s = servicios.find(x => x.id === ajusteData.catalogoId);
      if (!s) return alert('Selecciona un servicio');
      conceptoFinal = s.nombre + (ajusteData.concepto ? ` - ${ajusteData.concepto}` : '');
      esServicio = true;
    } else if (ajusteData.tipo === 'nuevo') {
      esServicio = true;
    } else if (ajusteData.tipo === 'descuento') {
      tipoReal = 'descuento';
    }

    if (!conceptoFinal || !montoFinal) return alert('Completa los campos obligatorios');

    try {
      await agregarAjusteReserva(
        ajusteModal.reservaId,
        tipoReal,
        conceptoFinal,
        Number(montoFinal),
        esServicio
      );
      setAjusteModal({ open: false, reservaId: '' });
      setAjusteData({ tipo: 'catalogo', catalogoId: '', concepto: '', monto: '' });
      router.refresh();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  const handleEliminarAjuste = async (ajusteId: string, reservaId: string) => {
    if (!confirm('¿Eliminar este ajuste?')) return;
    try {
      await eliminarAjusteReserva(ajusteId, reservaId);
      router.refresh();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  
  
  const getSaldo = (r: any) => calcularFinanzasReserva(r).saldoPendiente;

  const arrivals = localReservas.filter(r => {
    return r.fecha_entrada <= todayStr && !r.check_in_real_at && !r.check_out_real_at
  })

  const inHouse = localReservas.filter(r => {
    return !!r.check_in_real_at && !r.check_out_real_at
  })


  const inHouseConflicts = Object.values(inHouse.reduce((acc: any, r: any) => {
    if (!acc[r.propiedad_id]) acc[r.propiedad_id] = [];
    acc[r.propiedad_id].push(r);
    return acc;
  }, {})).filter((arr: any) => arr.length > 1);
  
  const hasConflict = inHouseConflicts.length > 0;

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
    const extrasList: any[] = Array.isArray(r.servicios_extra) ? r.servicios_extra : []
    
    // Mapear el catálogo completo inicializando el estado según lo contratado
    const initialMap: { [key: string]: any } = {}
    
    servicios.forEach((srv: any) => {
      // Buscar si este servicio fue contratado en la reserva
      const matchingExtra = extrasList.find((e: any) => 
        (e.id && e.id === srv.id) || 
        (e.nombre && srv.nombre && e.nombre.toLowerCase().includes(srv.nombre.toLowerCase())) ||
        (srv.nombre && e.nombre && srv.nombre.toLowerCase().includes(e.nombre.toLowerCase()))
      )

      if (matchingExtra) {
        const isTrayecto = srv.tipo_tarifa === 'por_trayecto'
        const hasIdaYVuelta = matchingExtra.nombre?.toLowerCase().includes('ida y vuelta') || matchingExtra.qty === 2
        
        initialMap[srv.id] = {
          id: srv.id,
          activo: true,
          nombre: srv.nombre,
          precio_base: Number(srv.precio_base || 0),
          tipo_tarifa: srv.tipo_tarifa,
          qty: matchingExtra.qty || 1,
          // Si tenía ida y vuelta, por defecto marcamos que consumió la llegada (ida), pero no la vuelta
          ida: isTrayecto ? true : false,
          vuelta: false
        }
      } else {
        initialMap[srv.id] = {
          id: srv.id,
          activo: false,
          nombre: srv.nombre,
          precio_base: Number(srv.precio_base || 0),
          tipo_tarifa: srv.tipo_tarifa,
          qty: 1,
          ida: false,
          vuelta: false
        }
      }
    })

    setServiciosAjustados(initialMap)
    setAccionSaldoFavor('reembolsar')
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

    const nochesOriginales = Math.max(1, differenceInDays(parseISO(r.fecha_salida), parseISO(r.fecha_entrada)))
    let nochesEfectivas = differenceInDays(new Date(), parseISO(r.fecha_entrada))
    if (nochesEfectivas <= 0) nochesEfectivas = 1
if (nochesEfectivas > nochesOriginales) nochesEfectivas = nochesOriginales

    const baseOriginal = Number(r.tarifa_base) > 0 ? Number(r.tarifa_base) : (Number(r.costo_total) || 0)
    const tarifaPorNoche = baseOriginal / nochesOriginales
    const nuevaTarifaBase = parseFloat((nochesEfectivas * tarifaPorNoche).toFixed(2))

    const totalExtrasCobrados = Object.values(serviciosAjustados)
      .filter((item: any) => item.activo)
      .reduce((sum: number, item: any) => {
        if (item.tipo_tarifa === 'por_trayecto') {
          const tramos = (item.ida ? 1 : 0) + (item.vuelta ? 1 : 0)
          return sum + (Number(item.precio_base || 0) * tramos)
        }
        return sum + (Number(item.precio_base || 0) * (Number(item.qty) || 1))
      }, 0)

    const nuevoCostoTotal = parseFloat((nuevaTarifaBase + totalExtrasCobrados).toFixed(2))
    const saldoOriginal = getSaldo(r)
    const totalAbonado = parseFloat(((Number(r.monto_total_acordado) || Number(r.costo_total) || 0) - saldoOriginal).toFixed(2))
    const nuevoSaldo = parseFloat((nuevoCostoTotal - totalAbonado).toFixed(2))
    try {
      setLoadingId('submit-anticipado')

      if (nuevoSaldo > 0.5) {
        // Saldo pendiente: ajusta base y total, no marca salida física aún y abre modal de liquidación
        const res = await checkOutAnticipado(r.id, nuevaTarifaBase, nuevoCostoTotal, todayStr, false)
        if (res.success) {
          const updatedReserva = { 
            ...r, 
            tarifa_base: nuevaTarifaBase, 
            costo_total: nuevoCostoTotal, 
            monto_total_acordado: nuevoCostoTotal, 
            fecha_salida: todayStr 
          }
          setLocalReservas(prev => prev.map(reserva => reserva.id === r.id ? updatedReserva : reserva))
          setModalAnticipado(null)

          setModalReserva(updatedReserva)
          setMontoPago(nuevoSaldo.toFixed(2))
          setMetodoPago('Efectivo MXN')
          setNotasPago('Liquidación por salida anticipada ajustada')
          setTc('16.00')
        } else {
          alert('Error: ' + res.error)
        }
      } else {
        // Saldo cero o a favor: registra devolución o penalización y marca check-out real
        const montoExcedente = Math.abs(nuevoSaldo)
        const datosReembolso = montoExcedente > 0.5 ? {
          monto: montoExcedente,
          metodo: metodoReembolso,
          retenerComoPenalizacion: accionSaldoFavor === 'penalizacion',
          concepto: accionSaldoFavor === 'penalizacion'
            ? 'Penalización no reembolsable retenida por salida anticipada'
            : 'Devolución de saldo a favor en recepción'
        } : undefined

        const res = await checkOutAnticipado(
          r.id,
          nuevaTarifaBase,
          nuevoCostoTotal,
          todayStr,
          true,
          datosReembolso
        )

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
              transacciones: [...(reserva.transacciones || []), (res as any).transaccion || { tipo: 'ingreso', monto_mxn: equivalenteMXN, monto: monto, metodo_pago: metodoPago, concepto: notasPago || 'Abono', created_at: new Date().toISOString() }]
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
          {hasConflict && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 mx-4 mt-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-800 font-semibold">
                  ⚠️ Conflicto de Ocupación: Se detectaron múltiples huéspedes registrados simultáneamente en la misma propiedad.
                </p>
              </div>
            </div>
          )}
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
                  const transacciones = r.transacciones?.filter((t: any) => t.tipo === 'ingreso') || []
                  
                  return (
                    <div key={r.id} className="p-4 sm:p-6 flex flex-col md:flex-row gap-6 justify-between hover:bg-gray-50 transition-colors">
                      {/* Izquierda: Info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{r.nombre_cliente}</h3>
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
                        <div className="flex items-center gap-2">
                          <a 
                            href={`https://wa.me/${(r.telefono || '').replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(r.nombre_cliente)},%20esperamos%20que%20tu%20estancia%20sea%20excelente.`}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md hover:bg-emerald-100"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Contactar WhatsApp
                          </a>
                        </div>
                      </div>
                      
                      {/* Derecha: Finanzas y Botones */}
                      <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Finanzas</h4>
                          <Button onClick={() => setAjusteModal({ open: true, reservaId: r.id })} variant="outline" size="sm" className="h-7 text-xs text-teal-700 bg-white border-teal-300 hover:bg-teal-50 hover:text-teal-800">
                            + Agregar Ajuste
                          </Button>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm space-y-1.5 shadow-sm">
                          <FinanzasCard reserva={r} onEditTarifa={(id, current) => setEditTarifaModal({ open: true, reservaId: id, currentBase: current })} />
                          
                          
                        </div>

                        {/* Botones Operativos */}
                        <div className="flex flex-col gap-2 mt-1">
                          {saldo > 0.5 && (
                            <Button onClick={() => handleLiquidar(r)} disabled={loadingId === r.id + '-liquidar'} variant="outline" className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 h-8 text-xs">
                              Liquidar o abonar
                            </Button>
                          )}
                          <Button onClick={() => handleCheckOut(r)} disabled={loadingId === r.id} className={`w-full h-8 text-xs text-white shadow-sm ${r.fecha_salida > todayStr ? 'bg-slate-700 hover:bg-slate-800' : 'bg-gray-900 hover:bg-gray-800'}`}>
                            {loadingId === r.id ? 'Procesando...' : (r.fecha_salida > todayStr ? 'Check-out Anticipado' : 'Marcar Check-out')}
                          </Button>
                          {r.fecha_salida < todayStr && (
                            <button onClick={() => handleRevertirCheckOut(r)} disabled={loadingId === r.id + '-revertir'} className="w-full text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 py-1">
                              <Undo2 className="w-3 h-3" /> Revertir Check-out
                            </button>
                          )}
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
                            <span className="text-xs text-gray-500">{(t.created_at || t.fecha) ? format(parseISO(t.created_at || t.fecha || new Date().toISOString()), 'dd MMM yyyy HH:mm', { locale: es }) : 'Reciente'}</span>
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
        const nochesOriginales = Math.max(1, differenceInDays(parseISO(r.fecha_salida), parseISO(r.fecha_entrada)))
        let nochesEfectivas = differenceInDays(new Date(), parseISO(r.fecha_entrada))
        if (nochesEfectivas <= 0) nochesEfectivas = 1
        if (nochesEfectivas > nochesOriginales) nochesEfectivas = nochesOriginales

        const baseOriginal = Number(r.tarifa_base) > 0 ? Number(r.tarifa_base) : (Number(r.costo_total) || 0)
        const tarifaPorNoche = baseOriginal / nochesOriginales
        const nuevaTarifaBase = parseFloat((nochesEfectivas * tarifaPorNoche).toFixed(2))

        const totalExtrasCobrados = Object.values(serviciosAjustados)
          .filter((item: any) => item.activo)
          .reduce((sum: number, item: any) => {
            if (item.tipo_tarifa === 'por_trayecto') {
              const tramos = (item.ida ? 1 : 0) + (item.vuelta ? 1 : 0)
              return sum + (Number(item.precio_base || 0) * tramos)
            }
            return sum + (Number(item.precio_base || 0) * (Number(item.qty) || 1))
          }, 0)

        const nuevoCostoTotal = parseFloat((nuevaTarifaBase + totalExtrasCobrados).toFixed(2))


        const saldoOriginal = getSaldo(r)
        const totalAbonado = parseFloat(((Number(r.monto_total_acordado) || Number(r.costo_total) || 0) - saldoOriginal).toFixed(2))
        const nuevoSaldo = parseFloat((nuevoCostoTotal - totalAbonado).toFixed(2))
        const haySaldoAFavor = nuevoSaldo < -0.5
        const montoAFavor = Math.abs(nuevoSaldo)

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-24 sm:pb-6 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
                <div>
                  <h2 className="text-lg font-bold text-indigo-900">Ajuste de Estancia (Salida Anticipada)</h2>
                  <p className="text-xs text-indigo-600 font-medium">{r.nombre_cliente}</p>
                </div>
                <button onClick={() => setModalAnticipado(null)} className="text-gray-400 hover:text-gray-600 p-1">
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto">
                <p className="text-sm text-gray-600">
                  El huésped se retira antes de la fecha programada ({format(parseISO(r.fecha_salida), 'dd MMM yy', { locale: es })}). 
                  Se recalcula la estancia según los días reales y servicios consumidos.
                </p>

                {/* Hospedaje Noches */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Noches habitadas reales:</span>
                    <span className="font-semibold text-gray-900">{nochesEfectivas} de {nochesOriginales} noches</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tarifa hospedaje recalculada:</span>
                    <span className="font-semibold text-gray-900">{formatPrice(nuevaTarifaBase)}</span>
                  </div>
                </div>

{/* Catálogo y Ajuste de Servicios Extra */}
<div className="bg-white p-4 rounded-xl border border-teal-200/70 space-y-3 shadow-xs">
  <div className="flex justify-between items-center border-b border-teal-100 pb-2">
    <p className="font-semibold text-sm text-teal-950">
      Catálogo de Servicios ({servicios.length} disponibles):
    </p>
    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
      Subtotal: {formatPrice(totalExtrasCobrados)}
    </span>
  </div>

  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
    {servicios.map((srv: any) => {
      const state = serviciosAjustados[srv.id] || {
        activo: false,
        id: srv.id,
        nombre: srv.nombre,
        precio_base: srv.precio_base,
        tipo_tarifa: srv.tipo_tarifa,
        qty: 1,
        ida: false,
        vuelta: false
      }
      const isSel = state.activo

      const itemCost = isSel
        ? srv.tipo_tarifa === 'por_trayecto'
          ? srv.precio_base * ((state.ida ? 1 : 0) + (state.vuelta ? 1 : 0))
          : srv.precio_base * state.qty
        : 0

      return (
        <div
          key={srv.id}
          className={`p-2.5 rounded-lg border transition-all duration-200 ${
            isSel ? 'bg-teal-50/50 border-teal-200 shadow-xs' : 'bg-gray-50/80 border-gray-200/80 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer accent-teal-600"
              checked={isSel}
              onChange={(e) => {
                const activo = e.target.checked
                setServiciosAjustados({
                  ...serviciosAjustados,
                  [srv.id]: {
                    ...state,
                    activo,
                    ida: activo ? (state.ida || true) : false,
                    vuelta: activo ? state.vuelta : false
                  }
                })
              }}
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium leading-tight ${!isSel ? 'text-gray-500' : 'text-gray-900'}`}>
                  {srv.nombre}
                </span>
                <span className={`text-xs font-bold whitespace-nowrap ml-2 ${!isSel ? 'text-gray-400' : 'text-teal-700'}`}>
                  +{formatPrice(isSel ? itemCost : srv.precio_base)}
                </span>
              </div>

              {isSel && srv.tipo_tarifa !== 'fijo' && (
                <div className="mt-2 pt-2 border-t border-teal-100/70 flex items-center gap-2">
                  {srv.tipo_tarifa === 'por_trayecto' ? (
                    <div className="flex flex-col sm:flex-row sm:gap-4 gap-1.5 w-full">
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-teal-600 w-3.5 h-3.5 accent-teal-600 cursor-pointer"
                          checked={!!state.ida}
                          onChange={(e) => {
                            const ida = e.target.checked
                            setServiciosAjustados({
                              ...serviciosAjustados,
                              [srv.id]: { ...state, ida, activo: ida || state.vuelta }
                            })
                          }}
                        />
                        <span>Ida (Apto &rarr; Casa)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-teal-600 w-3.5 h-3.5 accent-teal-600 cursor-pointer"
                          checked={!!state.vuelta}
                          onChange={(e) => {
                            const vuelta = e.target.checked
                            setServiciosAjustados({
                              ...serviciosAjustados,
                              [srv.id]: { ...state, vuelta, activo: state.ida || vuelta }
                            })
                          }}
                        />
                        <span>Vuelta (Casa &rarr; Apto)</span>
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">
                        {srv.nombre.toLowerCase().includes('auto')
                          ? 'Días:'
                          : srv.nombre.toLowerCase().includes('distancia') || srv.nombre.toLowerCase().includes('especial')
                          ? 'Distancia (km):'
                          : 'Personas / Piezas:'}
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={state.qty}
                        onChange={(e) =>
                          setServiciosAjustados({
                            ...serviciosAjustados,
                            [srv.id]: { ...state, qty: Math.max(1, parseInt(e.target.value) || 1) }
                          })
                        }
                        className="w-16 h-7 text-xs rounded-md border border-gray-300 px-2 bg-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    })}
  </div>
</div>

                {/* Resumen Contable */}
                <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nuevo total acordado:</span>
                    <span className="font-bold text-gray-900">{formatPrice(nuevoCostoTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total abonado acumulado:</span>
                    <span className="font-medium text-gray-900">{formatPrice(totalAbonado)}</span>
                  </div>
                  <div className="pt-2 border-t border-indigo-100 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Balance:</span>
                    {haySaldoAFavor ? (
                      <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-sm">
                        {formatPrice(montoAFavor)} a favor del huésped
                      </span>
                    ) : nuevoSaldo > 0.5 ? (
                      <span className="font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded text-sm">
                        Debe {formatPrice(nuevoSaldo)}
                      </span>
                    ) : (
                      <span className="font-bold text-gray-700">Cuenta saldada ($0.00)</span>
                    )}
                  </div>
                </div>

                {/* Resolución del saldo a favor */}
                {haySaldoAFavor && (
                  <div className="border border-emerald-200 bg-emerald-50/60 p-4 rounded-xl space-y-3">
                    <span className="text-xs font-bold text-emerald-900 block">¿Qué hacer con los {formatPrice(montoAFavor)} a favor?</span>
                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="accionSaldo"
                          value="reembolsar"
                          checked={accionSaldoFavor === 'reembolsar'}
                          onChange={() => setAccionSaldoFavor('reembolsar')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span><strong>Reembolsar al huésped</strong> (Efectivo / Transferencia en recepción)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="accionSaldo"
                          value="penalizacion"
                          checked={accionSaldoFavor === 'penalizacion'}
                          onChange={() => setAccionSaldoFavor('penalizacion')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span><strong>Retener como penalización</strong> por noches no reembolsables</span>
                      </label>
                    </div>

                    {accionSaldoFavor === 'reembolsar' && (
                      <div className="pt-2">
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Método de devolución:</label>
                        <select
                          value={metodoReembolso}
                          onChange={(e) => setMetodoReembolso(e.target.value)}
                          className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white"
                        >
                          <option value="Efectivo MXN">Efectivo MXN en recepción</option>
                          <option value="Transferencia MXN">Transferencia Bancaria</option>
                          <option value="Tarjeta">Devolución a Tarjeta</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {nuevoSaldo > 0.5 && (
                  <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100 font-medium">
                    Al confirmar este ajuste, el sistema abrirá la ventana de pagos para liquidar el saldo restante de {formatPrice(nuevoSaldo)}.
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

      {/* MODAL EDITAR TARIFA BASE */}
      <Dialog open={editTarifaModal.open} onOpenChange={(o) => setEditTarifaModal({ ...editTarifaModal, open: o })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Hospedaje Base</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium block mb-1">Monto de Hospedaje (MXN)</label>
              <Input type="number" value={editTarifaModal.currentBase} onChange={e => setEditTarifaModal({ ...editTarifaModal, currentBase: Number(e.target.value) })} />
              <p className="text-xs text-gray-500 mt-1">Modificar esta base recalculará automáticamente el total y la comisión base.</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditTarifaModal({ ...editTarifaModal, open: false })}>Cancelar</Button>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleActualizarTarifa}>Guardar Cambios</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL AGREGAR AJUSTE */}
      <Dialog open={ajusteModal.open} onOpenChange={(o) => setAjusteModal({ ...ajusteModal, open: o })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Ajuste / Cargo Extra / Descuento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium block mb-1">Tipo de Concepto</label>
              <select 
                className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={ajusteData.tipo} 
                onChange={e => setAjusteData({ ...ajusteData, tipo: e.target.value })}
              >
                <option value="catalogo">Servicio del Catálogo</option>
                <option value="nuevo">Cargo Manual</option>
                <option value="descuento">Descuento Especial</option>
              </select>
            </div>

            {ajusteData.tipo === 'catalogo' && (
              <div>
                <label className="text-sm font-medium block mb-1">Selecciona el Servicio</label>
                <select 
                  className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  value={ajusteData.catalogoId} 
                  onChange={e => {
                    const s = servicios.find(x => x.id === e.target.value)
                    if (s) {
                      setAjusteData({ ...ajusteData, catalogoId: s.id, monto: s.precio_base.toString() })
                    }
                  }}
                >
                  <option value="">-- Seleccionar --</option>
                  {servicios.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre} ({formatPrice(s.precio_base)})</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium block mb-1">
                {ajusteData.tipo === 'catalogo' ? 'Nota adicional (opcional)' : 'Concepto (Ej. Limpieza extra)'}
              </label>
              <Input value={ajusteData.concepto} onChange={e => setAjusteData({ ...ajusteData, concepto: e.target.value })} placeholder="Describe el concepto..." />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Monto (MXN)</label>
              <Input type="number" value={ajusteData.monto} onChange={e => setAjusteData({ ...ajusteData, monto: e.target.value })} placeholder="0.00" />
            </div>

            {ajusteData.tipo === 'descuento' && (
              <p className="text-xs text-gray-500 italic mt-2">
                * Los descuentos solo ajustan el saldo a pagar del cliente y no alteran la comisión.
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setAjusteModal({ ...ajusteModal, open: false })}>Cancelar</Button>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleAgregarAjuste}>Agregar Ajuste</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}