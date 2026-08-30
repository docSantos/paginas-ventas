'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Clock, ExternalLink, ChevronDown, ChevronUp, DollarSign, Calendar as CalendarIcon, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatPrice, formatDateEs } from '@/lib/utils'
import { calculateStayTotal } from '@/lib/pricing'
import { aprobarSolicitud, rechazarSolicitud, actualizarPagosReserva, actualizarFechasReserva, cancelarReserva } from '@/app/casasgaby/admin/actions'
import type { Solicitud, Reserva } from '@/types/casasgaby'
import Link from 'next/link'

export function ReservasClient({ solicitudes, reservas }: { solicitudes: Solicitud[], reservas: Reserva[] }) {
  const pendientes = solicitudes.filter(s => s.estado === 'Pendiente')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  
  // Modals state
  const [pagoModal, setPagoModal] = useState<{ open: boolean, reserva: any | null }>({ open: false, reserva: null })
  const [nuevoAbono, setNuevoAbono] = useState('')
  
  const [fechasModal, setFechasModal] = useState<{ open: boolean, reserva: any | null }>({ open: false, reserva: null })
  const [fEntrada, setFEntrada] = useState('')
  const [fSalida, setFSalida] = useState('')
  
  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleGuardarAbono = async () => {
    if (!pagoModal.reserva || !nuevoAbono) return
    try {
      await actualizarPagosReserva(pagoModal.reserva.id, parseFloat(nuevoAbono))
      setPagoModal({ open: false, reserva: null })
    } catch (e) {
      alert("Error al actualizar abono")
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

  return (
    <div className="space-y-8">
      {/* Solicitudes Pendientes (Mantener similar pero más limpio) */}
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
                {/* Contenido solicitud */}
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
                    <span>📞 {solicitud.telefono}</span>
                    <span>Fechas: {formatDateEs(solicitud.fecha_entrada)} al {formatDateEs(solicitud.fecha_salida)} ({solicitud.noches} noches)</span>
                    <span>Total: {formatPrice(solicitud.costo_total || 0)} • Anticipo sugerido: {formatPrice(solicitud.monto_apartado || 0)}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={async () => await rechazarSolicitud(solicitud.id)}>
                    <XCircle className="w-4 h-4 mr-2" /> Rechazar
                  </Button>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={async () => await aprobarSolicitud(solicitud.id)}>
                    <CheckCircle className="w-4 h-4 mr-2" /> Aprobar y Bloquear
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reservas Activas (Compact / Accordion) */}
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
              const saldo = r.costo_total - (r.monto_apartado || 0)
              const liquidado = saldo <= 0

              return (
                <div key={r.id} className="bg-white rounded-xl border border-teal-200 shadow-sm overflow-hidden transition-all">
                  {/* Fila Compacta (Siempre visible) */}
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

                  {/* Detalles Expandidos */}
                  {isExpanded && (
                    <div className="p-4 border-t border-teal-100 bg-teal-50/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Columna Izquierda */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Detalles del Cliente</h4>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-800">📞 {r.telefono}</span>
                            <a 
                              href={`https://wa.me/${r.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${r.nombre_cliente}, te escribo de Casas Gaby sobre tu reserva.`)}`}
                              target="_blank" rel="noreferrer"
                              className="text-[10px] font-bold bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 px-2 py-0.5 rounded-full uppercase"
                            >
                              WhatsApp
                            </a>
                          </div>
                          {r.email && <span className="text-sm text-gray-800 block mb-1">✉️ {r.email}</span>}
                          <span className="text-sm text-gray-800 block mb-3">Huéspedes: {r.num_huespedes || 1}</span>

                          {r.notas && (
                            <div className="p-2 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200 mb-3">
                              <strong>Notas:</strong> {r.notas}
                            </div>
                          )}

                          <Link href={`/casasgaby/propiedad/${r.propiedad_id}`} className="text-xs text-teal-600 hover:underline flex items-center">
                            Ver propiedad en catálogo <ExternalLink className="w-3 h-3 ml-1" />
                          </Link>
                        </div>

                        {/* Columna Derecha (Finanzas y Fechas) */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Finanzas y Fechas</h4>
                          <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Total Estadía:</span>
                              <span className="font-semibold">{formatPrice(r.costo_total)}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Pagado / Abono:</span>
                              <span className="font-semibold text-teal-600">{formatPrice(r.monto_apartado || 0)}</span>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-gray-100 mt-1">
                              <span className="text-gray-900 font-bold">Saldo:</span>
                              <span className={`font-bold ${liquidado ? 'text-green-600' : 'text-red-600'}`}>
                                {formatPrice(saldo)}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setNuevoAbono((r.monto_apartado || 0).toString())
                                setPagoModal({ open: true, reserva: r })
                              }}
                              className="text-teal-700 border-teal-200 hover:bg-teal-50"
                            >
                              <DollarSign className="w-4 h-4 mr-1" /> Pagos
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
                              <CalendarIcon className="w-4 h-4 mr-1" /> Fechas
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

      {/* Modal Pagos */}
      <Dialog open={pagoModal.open} onOpenChange={(o) => setPagoModal({ open: o, reserva: pagoModal.reserva })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Abono / Pago</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium mb-1">Monto total pagado hasta ahora (Anticipos + Abonos)</p>
              <Input 
                type="number" 
                value={nuevoAbono} 
                onChange={e => setNuevoAbono(e.target.value)} 
                placeholder="Ej: 5000"
              />
              <p className="text-xs text-gray-500 mt-2">
                Total de la estadía: {pagoModal.reserva && formatPrice(pagoModal.reserva.costo_total)}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPagoModal({ open: false, reserva: null })} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleGuardarAbono} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
                <Save className="w-4 h-4 mr-2" /> Guardar
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
              * Nota: Si cambias las fechas, el sistema recalculará automáticamente el Total de la estadía usando las tarifas de la propiedad, pero conservará los abonos registrados.
            </p>
            <div className="flex gap-3">
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
    </div>
  )
}
