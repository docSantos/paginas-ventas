'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, ExternalLink, ChevronDown, ChevronUp, DollarSign, Calendar as CalendarIcon, Save, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatPrice, formatDateEs } from '@/lib/utils'
import { calculateStayTotal } from '@/lib/pricing'
import { aprobarSolicitud, rechazarSolicitud, registrarAbono, registrarComisionPagada, actualizarFechasReserva, cancelarReserva } from '@/app/casasgaby/admin/actions'
import type { Solicitud, Reserva } from '@/types/casasgaby'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export function ReservasClient({ solicitudes, reservas }: { solicitudes: Solicitud[], reservas: Reserva[] }) {
  const pendientes = solicitudes.filter(s => s.estado === 'Pendiente')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  
  // Aprobar Modal
  const [aprobarModal, setAprobarModal] = useState<{ open: boolean, solicitud: any | null }>({ open: false, solicitud: null })
  const [montoAcordado, setMontoAcordado] = useState('')
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
    setMontoAcordado((solicitud.costo_total || 0).toString())
    setMontoAnticipo((solicitud.monto_apartado || 0).toString())
    setMetodoPago('transferencia_mxn')
  }

  const handleConfirmarAprobar = async () => {
    if (!aprobarModal.solicitud) return
    try {
      await aprobarSolicitud(
        aprobarModal.solicitud.id,
        parseFloat(montoAcordado || '0'),
        parseFloat(montoAnticipo || '0'),
        metodoPago,
        moneda,
        parseFloat(tc || '1')
      )
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
            pendientes.map(solicitud => (
              <div key={solicitud.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    {solicitud.nombre_cliente}
                    <a 
                      href={`https://wa.me/${solicitud.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${solicitud.nombre_cliente}, te escribo de Casas Gaby sobre tu solicitud de reserva.`)}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center text-xs font-medium bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 px-2 py-1 rounded-full transition-colors"
                    >
                      WhatsApp
                    </a>
                  </h3>
                  <div className="text-sm text-gray-600 mt-1 flex flex-col gap-0.5">
                    <span className="font-medium text-teal-700">{(solicitud as any).propiedades?.titulo}</span>
                    <span>📞 +{solicitud.telefono}</span>
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
            ))
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
                            <span className="text-sm text-gray-800">📞 +{r.telefono}</span>
                            <a 
                              href={`https://wa.me/${r.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${r.nombre_cliente}, te escribo de Casas Gaby sobre tu reserva.`)}`}
                              target="_blank" rel="noreferrer"
                              className="text-[10px] font-bold bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 px-2 py-0.5 rounded-full uppercase"
                            >
                              WhatsApp
                            </a>
                          </div>
                          {r.email && <span className="text-sm text-gray-800 block mb-1">✉️ {r.email}</span>}
                          
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
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Finanzas</h4>
                          <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Total Acordado:</span>
                              <span className="font-semibold">{formatPrice(totalAcordado)}</span>
                            </div>
                            <div className="flex justify-between mb-1">
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

                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Comisión ({(r.porcentaje_comision || 2.5)}%)</h4>
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
                              onClick={async () => {
                                if (confirm('¿Estás seguro de cancelar esta reserva? Las fechas se liberarán.')) {
                                  await cancelarReserva(r.id)
                                }
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
            <div>
              <label className="text-sm font-medium block mb-1">Monto Total Acordado (MXN)</label>
              <Input type="number" value={montoAcordado} onChange={e => setMontoAcordado(e.target.value)} />
            </div>
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
    </div>
  )
}
