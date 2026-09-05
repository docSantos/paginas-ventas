'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, AlertCircle, ExternalLink, ChevronDown, ChevronUp, DollarSign, Calendar as CalendarIcon, Save, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatPrice, formatDateEs, formatPhoneWithFlag, buildWaUrl, formatPhoneWithFlagObj } from '@/lib/utils'
import { calculateStayTotal } from '@/lib/pricing'
import { aprobarSolicitud, rechazarSolicitud, registrarAbono, registrarComisionPagada, actualizarFechasReserva, cancelarReserva, cancelarReservaConReembolso, actualizarTarifaBase, agregarAjusteReserva, eliminarAjusteReserva } from '@/app/casasgaby/admin/actions'
import type { Solicitud, Reserva } from '@/types/casasgaby'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const tieneConflictoEntreSolicitudes = (solicitudActual: any, todasLasSolicitudes: any[]) => {
  return todasLasSolicitudes.some((otra) => {
    if (otra.id === solicitudActual.id) return false;
    if (otra.propiedad_id !== solicitudActual.propiedad_id) return false;
    if (otra.estado !== 'Pendiente') return false;
    
    const inicioA = new Date(solicitudActual.fecha_entrada);
    const finA = new Date(solicitudActual.fecha_salida);
    const inicioB = new Date(otra.fecha_entrada);
    const finB = new Date(otra.fecha_salida);
    
    return inicioA < finB && finA > inicioB;
  });
};

export function ReservasClient({ solicitudes, reservas, servicios = [], tenantExtras = 5, tenantBase = 2.50 }: { solicitudes: Solicitud[], reservas: any[], servicios?: any[], tenantExtras?: number, tenantBase?: number }) {
  const pendientes = solicitudes.filter(s => s.estado === 'Pendiente')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  
  // Aprobar Modal
  
  // Cancelar Modal
  const [cancelModal, setCancelModal] = useState<{ open: boolean, reserva: Reserva | null }>({ open: false, reserva: null })
  const [cancelData, setCancelData] = useState({ willRefund: false, amount: '', currency: 'MXN', method: 'transferencia', note: '' })
  const [isCanceling, setIsCanceling] = useState(false)
  const [editTarifaModal, setEditTarifaModal] = useState<{ open: boolean, reservaId: string, currentBase: number }>({ open: false, reservaId: '', currentBase: 0 })
  const [ajusteModal, setAjusteModal] = useState<{ open: boolean, reservaId: string }>({ open: false, reservaId: '' })
  const [ajusteData, setAjusteData] = useState({ tipo: 'catalogo', catalogoId: '', concepto: '', monto: '' })
  
  const [aprobarModal, setAprobarModal] = useState<{ open: boolean, solicitud: any | null }>({ open: false, solicitud: null })
    const [montoAcordado, setMontoAcordado] = useState('')
  const [precioBaseHospedaje, setPrecioBaseHospedaje] = useState(0)
  const [extraQuantities, setExtraQuantities] = useState<Record<string, number>>({})
  const [montoAnticipo, setMontoAnticipo] = useState('')
  const [metodoPago, setMetodoPago] = useState('efectivo_mxn')
  const [moneda, setMoneda] = useState('MXN')
  const [tc, setTc] = useState('20.00')

  // Abonos Modal
  const [abonoModal, setAbonoModal] = useState<{ open: boolean, reserva: any | null }>({ open: false, reserva: null })
  const [abonoMonto, setAbonoMonto] = useState('')
  const [abonoMetodo, setAbonoMetodo] = useState('efectivo_mxn')
  const [abonoMoneda, setAbonoMoneda] = useState('MXN')
  const [abonoTc, setAbonoTc] = useState('20.00')
  
  // Fechas Modal
  const [fechasModal, setFechasModal] = useState<{ open: boolean, reserva: any | null }>({ open: false, reserva: null })
  const [fEntrada, setFEntrada] = useState('')
  const [fSalida, setFSalida] = useState('')

  // Comisión Modal
  const [comisionModal, setComisionModal] = useState<{ open: boolean, reserva: any | null }>({ open: false, reserva: null })
  const [comisionMonto, setComisionMonto] = useState('')

  // Historial de pagos
  const [pagosHistory, setPagosHistory] = useState<Record<string, any[]>>({})
  const supabase = createClient()

  useEffect(() => {
    // Cuando el método cambia a usd, forzar moneda
    if (metodoPago.includes('usd')) setMoneda('USD')
    else setMoneda('MXN')
  }, [metodoPago])

  useEffect(() => {
    if (abonoMetodo.includes('usd')) setAbonoMoneda('USD')
    else setAbonoMoneda('MXN')
  }, [abonoMetodo])

  const toggleExpand = async (id: string) => {
    const isExpanding = !expanded[id]
    setExpanded(prev => ({ ...prev, [id]: isExpanding }))

    if (isExpanding && !pagosHistory[id]) {
      const db = supabase as any
      const { data } = await db.from('pagos_reservas').select('*').eq('reserva_id', id).order('created_at', { ascending: false })
      if (data) setPagosHistory(prev => ({ ...prev, [id]: data }))
    }
  }

  const handleAbrirAprobar = (solicitud: any) => {
    setAprobarModal({ open: true, solicitud })
    const base = parseFloat(solicitud.costo_total || 0)
    setPrecioBaseHospedaje(base)
    setMontoAcordado(base.toString())
    setMontoAnticipo((solicitud.monto_apartado || 0).toString())
    setMetodoPago('transferencia_mxn')
    
    // Si la solicitud trae servicios solicitados pre-cargados
    const defaultExtras: Record<string, number> = {}
    if (solicitud.servicios_extra && Array.isArray(solicitud.servicios_extra)) {
      solicitud.servicios_extra.forEach((e: any) => {
        defaultExtras[e.id] = e.qty || e.cantidad || 1
      })
    }
    setExtraQuantities(defaultExtras)
  }
  
  // Helper to recalculate total
  const recalcularMontoAcordado = (base: number, cantidades: Record<string, number>) => {
    let sumaExtras = 0;
    Object.keys(cantidades).forEach(id => {
      const serv = servicios.find(s => s.id === id);
      if (serv) {
        sumaExtras += (serv.precio_base || 0) * cantidades[id];
      }
    });
    setMontoAcordado((base + sumaExtras).toString());
  }

  const toggleExtra = (servicio: any, checked: boolean) => {
    setExtraQuantities(prev => {
      const next = { ...prev };
      if (checked) {
        next[servicio.id] = 1;
      } else {
        delete next[servicio.id];
      }
      recalcularMontoAcordado(precioBaseHospedaje, next);
      return next;
    });
  }

  const updateExtraQty = (servicio: any, qty: number) => {
    if (qty < 1) qty = 1;
    setExtraQuantities(prev => {
      const next = { ...prev, [servicio.id]: qty };
      recalcularMontoAcordado(precioBaseHospedaje, next);
      return next;
    });
  }
  

  const handleActualizarTarifa = async () => {
    try {
      await actualizarTarifaBase(editTarifaModal.reservaId, Number(editTarifaModal.currentBase));
      setEditTarifaModal({ open: false, reservaId: '', currentBase: 0 });
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
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  const handleEliminarAjuste = async (ajusteId: string, reservaId: string) => {
    if (!confirm('¿Eliminar este ajuste?')) return;
    try {
      await eliminarAjusteReserva(ajusteId, reservaId);
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  const handleConfirmarAprobar = async () => {
    if (!aprobarModal.solicitud) return
    try {
      
        const extrasPayload = Object.keys(extraQuantities).map(id => {
          const serv = servicios.find((s: any) => s.id === id);
          if (!serv) return null;
          const qty = extraQuantities[id];
          return {
            id: serv.id,
            concepto: `${serv.nombre} ${serv.tipo_tarifa !== 'fijo' ? `(x${qty})` : ''}`.trim(),
            monto: Number(serv.precio_base) * (serv.tipo_tarifa !== 'fijo' ? qty : 1),
            porcentaje_comision: serv.porcentaje_comision || tenantExtras
          }
        }).filter(Boolean);

        // Calculate the base without the extras since we pass `montoAcordado` as the base stay price, and `extras` separately!
        // Wait, the API `aprobarSolicitud` expects `montoAcordado` to be just the stay base, because it does: 
        // `nuevoTotalAcordado = montoAcordado + sumaExtras`.
        // So we should pass `precioBaseHospedaje` instead of `montoAcordado` which is currently Base + Extras!
        // But what if the admin edited `montoAcordado` manually? We should compute `editedBase = currentMontoAcordado - sumaExtras`.
        const currentMonto = parseFloat(montoAcordado || '0');
        const sumaExtras = extrasPayload.reduce((sum, e) => sum + (e?.monto || 0), 0);
        const baseCalculada = currentMonto - sumaExtras;

        const res = await aprobarSolicitud(
          aprobarModal.solicitud.id,
          baseCalculada,
          parseFloat(montoAnticipo || '0'),
          metodoPago,
          moneda,
          parseFloat(tc || '1'),
          extrasPayload
        )
        if (res && !res.success) {
          alert("No es posible aprobar esta solicitud: " + (res.message || "Ocurrió un error."));
          return;
        }
      setAprobarModal({ open: false, solicitud: null })
    } catch (e: any) {
      alert("Error al aprobar: " + e.message)
    }
  }

  const handleGuardarAbono = async () => {
    if (!abonoModal.reserva || !abonoMonto) return
    try {
      await registrarAbono(
        abonoModal.reserva.id,
        parseFloat(abonoMonto),
        abonoMetodo,
        abonoMoneda,
        parseFloat(abonoTc || '1'),
        'Abono registrado manual'
      )
      // Refrescar historial
      const db = supabase as any
      const { data } = await db.from('pagos_reservas').select('*').eq('reserva_id', abonoModal.reserva.id).order('created_at', { ascending: false })
      if (data) setPagosHistory(prev => ({ ...prev, [abonoModal.reserva.id]: data }))
      setAbonoModal({ open: false, reserva: null })
      setAbonoMonto('')
    } catch (e: any) {
      alert("Error al registrar abono: " + e.message)
    }
  }

  const handleGuardarFechas = async () => {
    if (!fechasModal.reserva || !fEntrada || !fSalida) return
    const prop = fechasModal.reserva.propiedades
    if (!prop) return

    const start = new Date(fEntrada + 'T12:00:00')
    const end = new Date(fSalida + 'T12:00:00')
    const noches = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

    const { total } = calculateStayTotal(
      noches,
      prop.precio_por_noche,
      prop.precio_por_semana,
      prop.precio_por_mes
    )

    try {
      await actualizarFechasReserva(fechasModal.reserva.id, prop.id, fEntrada, fSalida, total)
      setFechasModal({ open: false, reserva: null })
    } catch (e) {
      alert("Error al actualizar fechas")
    }
  }

  const handleGuardarComision = async () => {
    if (!comisionModal.reserva || !comisionMonto) return
    try {
      await registrarComisionPagada(comisionModal.reserva.id, parseFloat(comisionMonto))
      setComisionModal({ open: false, reserva: null })
      setComisionMonto('')
    } catch (e: any) {
      alert("Error al registrar comisión: " + e.message)
    }
  }

  return (
    <div className="space-y-8">
      {/* Solicitudes Pendientes */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-amber-500" />
          Nuevas Solicitudes ({pendientes.length})
        </h2>
        
        <div className="grid gap-4">
          {pendientes.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
              No hay solicitudes pendientes en este momento.
            </div>
          ) : (
            pendientes.map(solicitud => {
              const tieneConflicto = tieneConflictoEntreSolicitudes(solicitud, pendientes);
              return (
              <div key={solicitud.id} className={`p-5 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${tieneConflicto ? 'border-red-400 bg-red-50/70 hover:bg-red-50' : 'bg-white border-gray-200'}`}>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                    {solicitud.nombre_cliente}
                    {tieneConflicto && (
                      <span className="bg-red-100 text-red-700 text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full border border-red-200 inline-flex items-center gap-1">
                        ⚠️ Conflicto
                      </span>
                    )}
                    <a 
                      href={buildWaUrl((solicitud as any).codigo_pais, solicitud.telefono, `Hola ${solicitud.nombre_cliente}, te escribo de Casas Gaby sobre tu solicitud de reserva.`)}
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center text-xs font-medium bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 px-2 py-1 rounded-full transition-colors"
                    >
                      WhatsApp
                    </a>
                  </h3>
                  <div className="text-sm text-gray-600 mt-1 flex flex-col gap-0.5">
                    <span className="font-medium text-teal-700">{(solicitud as any).propiedades?.titulo}</span>
                    <span>{formatPhoneWithFlagObj((solicitud as any).codigo_pais, solicitud.telefono)}</span>
                      {((solicitud as any).email || (solicitud as any).email_cliente) && (
                        <a href={`mailto:${(solicitud as any).email || (solicitud as any).email_cliente}`} className="hover:text-teal-600 transition-colors flex items-center gap-1">
                          ✉️ {(solicitud as any).email || (solicitud as any).email_cliente}
                        </a>
                      )}
                    <span>Fechas: {formatDateEs(solicitud.fecha_entrada)} al {formatDateEs(solicitud.fecha_salida)} ({solicitud.noches} noches)</span>
                    <span>Total sugerido: {formatPrice(solicitud.costo_total || 0)}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={async () => await rechazarSolicitud(solicitud.id)}>
                    <XCircle className="w-4 h-4 mr-2" /> Rechazar
                  </Button>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => handleAbrirAprobar(solicitud)}>
                    <CheckCircle className="w-4 h-4 mr-2" /> Aprobar y Cobrar
                  </Button>
                </div>
              </div>
            )
          })
          )}
        </div>
      </div>

      {/* Reservas Activas */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-teal-600" />
          Reservas Confirmadas ({reservas.length})
        </h2>
        
        <div className="grid gap-3">
          {reservas.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
              No tienes reservas confirmadas.
            </div>
          ) : (
            reservas.map(reserva => {
              const r = reserva as any
              const isExpanded = !!expanded[r.id]
              const totalAcordado = r.monto_total_acordado || r.costo_total
              const saldo = totalAcordado - (r.monto_apartado || 0)
              const liquidado = saldo <= 0

              return (
                <div key={r.id} className="bg-white rounded-xl border border-teal-200 shadow-sm overflow-hidden transition-all">
                  <div 
                    onClick={() => toggleExpand(r.id)}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 select-none"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="font-bold text-gray-900 truncate" title={r.nombre_cliente}>{r.nombre_cliente}</div>
                      <div className="text-sm font-medium text-teal-700 truncate">{r.propiedades?.titulo}</div>
                      <div className="text-sm text-gray-600">
                        {formatDateEs(r.fecha_entrada)} <span className="text-gray-400">al</span> {formatDateEs(r.fecha_salida)}
                      </div>
                      <div className="text-sm font-semibold flex items-center gap-2">
                        {liquidado ? (
                          <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-xs uppercase">Liquidado</span>
                        ) : (
                          <span className="text-red-600">Pendiente: {formatPrice(saldo)}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-400 flex items-center justify-center shrink-0">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-teal-100 bg-teal-50/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Columna Izquierda: Detalles del Cliente e Historial */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Detalles del Cliente</h4>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-800">{formatPhoneWithFlagObj((r as any).codigo_pais, r.telefono)}</span>
                            <a 
                              href={buildWaUrl((r as any).codigo_pais, r.telefono, `Hola ${r.nombre_cliente}, te escribo de Casas Gaby sobre tu reserva.`)}
                              target="_blank" rel="noreferrer"
                              className="text-[10px] font-bold bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 px-2 py-0.5 rounded-full uppercase"
                            >
                              WhatsApp
                            </a>
                          </div>
                          {r.email && (
                              <a href={`mailto:${r.email}`} className="text-sm text-gray-800 block mb-1 hover:text-teal-600 transition-colors">
                                ✉️ {r.email}
                              </a>
                            )}
                          
                          {pagosHistory[r.id] && pagosHistory[r.id].length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <History className="w-3 h-3" /> Historial de Pagos
                              </h4>
                              <div className="space-y-2">
                                {pagosHistory[r.id].map(pago => (
                                  <div key={pago.id} className="bg-white p-2 rounded border border-gray-200 text-xs flex justify-between items-center">
                                    <div>
                                      <span className="font-semibold block">{formatPrice(pago.monto)} {pago.moneda}</span>
                                      <span className="text-gray-500 capitalize">{pago.metodo_pago.replace('_', ' ')}</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-gray-900 block font-medium">Equiv: {formatPrice(pago.monto_equivalente_mxn)}</span>
                                      <span className="text-gray-400">{new Date(pago.created_at).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Columna Derecha: Finanzas y Botones */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Finanzas</h4>
                              <Button onClick={() => setAjusteModal({ open: true, reservaId: r.id })} variant="outline" size="sm" className="h-7 text-xs text-teal-700 bg-white border-teal-300 hover:bg-teal-50 hover:text-teal-800 transition-colors shadow-sm font-medium">
                                + Agregar Ajuste
                              </Button>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 flex items-center gap-1.5">
                                  Hospedaje base: 
                                  <button onClick={() => setEditTarifaModal({ open: true, reservaId: r.id, currentBase: r.tarifa_base || 0 })} className="text-gray-400 hover:text-teal-600">✏️</button>
                                </span>
                                <span className="font-medium text-gray-800">{formatPrice(r.tarifa_base || 0)}</span>
                              </div>

                              {(r.ajustes_reserva || []).filter((a: any) => a.tipo === 'cargo').map((c: any) => (
                                <div key={c.id} className="flex justify-between items-center text-xs">
                                  <span className="text-gray-500 pl-1 flex items-center gap-1">+ {c.concepto}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">{formatPrice(c.monto)}</span>
                                    <button onClick={() => handleEliminarAjuste(c.id, r.id)} className="text-red-400 hover:text-red-600">×</button>
                                  </div>
                                </div>
                              ))}

                              {(r.ajustes_reserva || []).filter((a: any) => a.tipo === 'descuento').map((d: any) => (
                                <div key={d.id} className="flex justify-between items-center text-xs">
                                  <span className="text-gray-500 pl-1 flex items-center gap-1">- {d.concepto}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-red-500">-{formatPrice(d.monto)}</span>
                                    <button onClick={() => handleEliminarAjuste(d.id, r.id)} className="text-red-400 hover:text-red-600">×</button>
                                  </div>
                                </div>
                              ))}

                              <div className="flex justify-between border-t border-gray-100 pt-1.5 mt-1.5">
                                <span className="text-gray-900 font-medium">Total Acordado:</span>
                                <span className="font-bold">{formatPrice(totalAcordado)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Pagado (MXN):</span>
                                <span className="font-semibold text-teal-600">{formatPrice(r.monto_apartado || 0)}</span>
                              </div>
                              <div className="flex justify-between pt-1 border-t border-gray-100 mt-1">
                                <span className="text-gray-900 font-bold">Saldo Pendiente:</span>
                                <span className={`font-bold ${liquidado ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatPrice(saldo)}
                                </span>
                              </div>
                            </div>

                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Comisión</h4>
                          <div className="bg-white p-3 rounded-lg border border-purple-200 mb-3 text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Total Comisión:</span>
                              <span className="font-semibold text-purple-700">{formatPrice(r.monto_comision || 0)}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Comisión Pagada:</span>
                              <span className="font-semibold text-teal-600">{formatPrice(r.comision_pagada || 0)}</span>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-gray-100 mt-1">
                              <span className="text-gray-900 font-bold">Saldo Comisión:</span>
                              <span className={`font-bold ${(r.monto_comision || 0) - (r.comision_pagada || 0) <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                                {formatPrice((r.monto_comision || 0) - (r.comision_pagada || 0))}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setAbonoModal({ open: true, reserva: r })}
                              className="text-teal-700 border-teal-200 hover:bg-teal-50"
                            >
                              <DollarSign className="w-4 h-4 mr-1" /> Registrar Abono
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setComisionMonto(((r.monto_comision || 0) - (r.comision_pagada || 0)).toString())
                                setComisionModal({ open: true, reserva: r })
                              }}
                              className="text-purple-700 border-purple-200 hover:bg-purple-50"
                            >
                              Saldar Comisión
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setFEntrada(r.fecha_entrada)
                                setFSalida(r.fecha_salida)
                                setFechasModal({ open: true, reserva: r })
                              }}
                              className="text-blue-700 border-blue-200 hover:bg-blue-50"
                            >
                              <CalendarIcon className="w-4 h-4 mr-1" /> Editar Fechas
                            </Button>
                            
                            <Button 
                                size="sm" 
                                variant="outline"
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
                              </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Modal Aprobar Solicitud */}
      <Dialog open={aprobarModal.open} onOpenChange={(o) => setAprobarModal({ open: o, solicitud: aprobarModal.solicitud })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar y Registrar Pagos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {aprobarModal.solicitud && tieneConflictoEntreSolicitudes(aprobarModal.solicitud, pendientes) && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-lg flex gap-2 items-start">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p><strong>Atención:</strong> Hay otra solicitud pendiente compitiendo por estas mismas fechas. Al aprobar esta, la otra deberá ser rechazada o reubicada.</p>
              </div>
            )}
            <div>
                <label className="text-sm font-medium block mb-1">Monto Total Acordado (MXN)</label>
                <Input type="number" value={montoAcordado} onChange={e => {
                  setMontoAcordado(e.target.value);
                  // Opcional: ajustar precioBaseHospedaje inversamente para mantener consistencia, pero dejaremos que el admin teclee libre.
                }} />
              </div>

              {servicios.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Servicios Adicionales (Catálogo)</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {servicios.map((s: any) => {
                      const isSel = !!extraQuantities[s.id];
                      return (
                        <div key={s.id} className="flex flex-col gap-1 p-2 bg-white border border-gray-100 rounded shadow-sm">
                          <div className="flex items-start gap-2">
                            <input 
                              type="checkbox" 
                              className="mt-1 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                              checked={isSel}
                              onChange={e => toggleExtra(s, e.target.checked)}
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <span className="text-sm font-medium text-gray-900 leading-tight">{s.nombre}</span>
                                <span className="text-xs font-bold text-teal-700 whitespace-nowrap ml-2">
                                  +{formatPrice(s.precio_base)}
                                </span>
                              </div>
                              {s.descripcion && <span className="text-xs text-gray-500 leading-tight block mt-0.5">{s.descripcion}</span>}
                            </div>
                          </div>
                          {isSel && s.tipo_tarifa !== 'fijo' && (
                            <div className="ml-6 flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-600">Cantidad (Días/Viajes):</span>
                              <input 
                                type="number" 
                                min="1" 
                                value={extraQuantities[s.id]} 
                                onChange={e => updateExtraQty(s, parseInt(e.target.value) || 1)}
                                className="w-16 h-7 text-xs rounded border-gray-300 px-2"
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Método</label>
                <select 
                  className="w-full h-11 rounded-xl border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  value={metodoPago}
                  onChange={e => setMetodoPago(e.target.value)}
                >
                  <option value="efectivo_mxn">Efectivo MXN</option>
                  <option value="transferencia_mxn">Transferencia MXN</option>
                  <option value="efectivo_usd">Efectivo USD</option>
                  <option value="transferencia_usd">Transferencia USD</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Anticipo Recibido</label>
                <Input type="number" value={montoAnticipo} onChange={e => setMontoAnticipo(e.target.value)} />
              </div>
            </div>
            {moneda === 'USD' && (
              <div>
                <label className="text-sm font-medium block mb-1">Tipo de Cambio</label>
                <Input type="number" step="0.01" value={tc} onChange={e => setTc(e.target.value)} />
                
                <div className="mt-3 mb-2 bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-800 flex items-center justify-between">
                  <span>💡 Anticipo (50% = {formatPrice(parseFloat(montoAcordado || '0') / 2)}): <strong>${((parseFloat(montoAcordado || '0') / 2) / (parseFloat(tc || '1') || 1)).toFixed(2)} USD</strong></span>
                  <button 
                    type="button"
                    className="text-blue-600 underline font-semibold hover:text-blue-900"
                    onClick={() => setMontoAnticipo(((parseFloat(montoAcordado || '0') / 2) / (parseFloat(tc || '1') || 1)).toFixed(2))}
                  >
                    Aplicar 50%
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-1">El anticipo de USD {montoAnticipo || 0} se registrará como MXN {formatPrice((parseFloat(montoAnticipo||'0')) * (parseFloat(tc||'1')))}</p>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setAprobarModal({ open: false, solicitud: null })} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleConfirmarAprobar} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
                <CheckCircle className="w-4 h-4 mr-2" /> Aprobar y Bloquear
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Abonos */}
      <Dialog open={abonoModal.open} onOpenChange={(o) => setAbonoModal({ open: o, reserva: abonoModal.reserva })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Abono</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Método</label>
                <select 
                  className="w-full h-11 rounded-xl border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  value={abonoMetodo}
                  onChange={e => setAbonoMetodo(e.target.value)}
                >
                  <option value="efectivo_mxn">Efectivo MXN</option>
                  <option value="transferencia_mxn">Transferencia MXN</option>
                  <option value="efectivo_usd">Efectivo USD</option>
                  <option value="transferencia_usd">Transferencia USD</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Monto Recibido</label>
                <Input type="number" value={abonoMonto} onChange={e => setAbonoMonto(e.target.value)} />
              </div>
            </div>
            {abonoMoneda === 'USD' && (
              <div>
                <label className="text-sm font-medium block mb-1">Tipo de Cambio</label>
                <Input type="number" step="0.01" value={abonoTc} onChange={e => setAbonoTc(e.target.value)} />
                <p className="text-xs text-gray-500 mt-1">El abono de USD {abonoMonto || 0} equivale a MXN {formatPrice((parseFloat(abonoMonto||'0')) * (parseFloat(abonoTc||'1')))}</p>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setAbonoModal({ open: false, reserva: null })} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleGuardarAbono} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
                <Save className="w-4 h-4 mr-2" /> Guardar Abono
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Fechas */}
      <Dialog open={fechasModal.open} onOpenChange={(o) => setFechasModal({ open: o, reserva: fechasModal.reserva })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Fechas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Llegada</label>
                <Input type="date" value={fEntrada} onChange={e => setFEntrada(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Salida</label>
                <Input type="date" value={fSalida} onChange={e => setFSalida(e.target.value)} />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              * Nota: Si cambias las fechas, el sistema recalculará el Total base, pero tendrás que ajustarlo manualmente como "Total Acordado" si es necesario.
            </p>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setFechasModal({ open: false, reserva: null })} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleGuardarFechas} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4 mr-2" /> Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Comision */}
      <Dialog open={comisionModal.open} onOpenChange={(o) => setComisionModal({ open: o, reserva: comisionModal.reserva })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Saldar Comisión</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium block mb-1">Monto Pagado al Gestor/Desarrollador</label>
              <Input type="number" value={comisionMonto} onChange={e => setComisionMonto(e.target.value)} />
            </div>
            <p className="text-xs text-gray-500">
              Se registrará el pago de la comisión por la reserva de {comisionModal.reserva?.nombre_cliente}.
            </p>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setComisionModal({ open: false, reserva: null })} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleGuardarComision} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                <Save className="w-4 h-4 mr-2" /> Registrar Comisión
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                onChange={e => {
                  const val = e.target.value;
                  setAjusteData({ tipo: val, catalogoId: '', concepto: '', monto: '' });
                }}
              >
                <option value="catalogo">Servicio Adicional del Catálogo</option>
                <option value="nuevo">Servicio Nuevo / No Listado</option>
                <option value="cargo">Cargo Adicional (+)</option>
                <option value="descuento">Descuento (-)</option>
              </select>
            </div>

            {ajusteData.tipo === 'catalogo' && (
              <div>
                <label className="text-sm font-medium block mb-1">Selecciona el Servicio</label>
                <select 
                  className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  value={ajusteData.catalogoId}
                  onChange={e => {
                    const id = e.target.value;
                    const serv = servicios.find(s => s.id === id);
                    setAjusteData({ ...ajusteData, catalogoId: id, monto: serv ? serv.precio_base.toString() : '' });
                  }}
                >
                  <option value="">-- Seleccionar --</option>
                  {servicios.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre} (+${s.precio_base})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className={ajusteData.tipo === 'catalogo' ? 'col-span-2' : 'col-span-1'}>
                <label className="text-sm font-medium block mb-1">
                  {ajusteData.tipo === 'catalogo' ? 'Notas / Cantidad (Opcional)' : (ajusteData.tipo === 'nuevo' ? 'Nombre del Servicio' : 'Concepto / Motivo')}
                </label>
                <Input 
                  placeholder={
                    ajusteData.tipo === 'catalogo' ? 'Ej. x2 días, para 3 personas...' : 
                    (ajusteData.tipo === 'descuento' ? 'Ej. Cortesía, Promoción...' : 'Ej. Mascota extra, Limpieza...')
                  } 
                  value={ajusteData.concepto} 
                  onChange={e => setAjusteData({ ...ajusteData, concepto: e.target.value })} 
                />
              </div>
              <div className={ajusteData.tipo === 'catalogo' ? 'col-span-2' : 'col-span-1'}>
                <label className="text-sm font-medium block mb-1">Monto (MXN)</label>
                <Input type="number" placeholder="0.00" value={ajusteData.monto} onChange={e => setAjusteData({ ...ajusteData, monto: e.target.value })} />
              </div>
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
