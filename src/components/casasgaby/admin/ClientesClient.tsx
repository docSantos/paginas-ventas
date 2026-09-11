'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, User, Phone, Mail, Calendar, TrendingUp, Edit2, Merge, ChevronDown, ChevronUp , ArrowRightLeft, Banknote , Coins } from 'lucide-react'
import { Input } from '@/components/ui/input'
import PhoneInputField from '@/components/PhoneInputField'
import { formatPrice, formatDateEs, formatPhoneWithFlag, buildWaUrl, formatPhoneWithFlagObj } from '@/lib/utils'
import { actualizarCliente, fusionarClientes } from '@/app/casasgaby/admin/actions'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Reserva {
  id: string
  propiedad_id: string
  propiedades?: { titulo: string }
  estado: string
  monto_total_acordado: number
  fecha_entrada: string
  fecha_salida: string
  monto_reembolsado?: number
}


interface Transaccion {
  id: string
  tipo: string
  monto: number
  monto_mxn: number
  moneda: string
  concepto: string
  fecha: string
  reserva_id: string
}
interface Cliente {
  transacciones?: Transaccion[]

  id: string
  codigo_cliente: string
  nombre_completo: string
  email: string
  telefono: string
  notas: string | null
  reservas?: Reserva[]
}

export default function ClientesClient({ clientes, solicitudes = [], reservasConfirmadas = [], servicios = [] }: { clientes: Cliente[], solicitudes?: any[], reservasConfirmadas?: any[], servicios?: any[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'crm'|'directorio'>(() => {
    const tab = searchParams.get('tab')
    return (tab === 'directorio') ? 'directorio' : 'crm'
  })

  const handleTabChange = (tab: 'crm'|'directorio') => {
    setActiveTab(tab)
    router.replace(`?tab=${tab}`, { scroll: false })
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Edit Modal State
  const [editModal, setEditModal] = useState<{ open: boolean, cliente: Cliente | null }>({ open: false, cliente: null })
  const [editNombre, setEditNombre] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editTelefono, setEditTelefono] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Merge Modal State
  const [mergeModal, setMergeModal] = useState<{ open: boolean, origen: Cliente | null }>({ open: false, origen: null })
  const [destinoId, setDestinoId] = useState<string>('')
  const [isMerging, setIsMerging] = useState(false)

  const filteredClientes = clientes.filter(c => {
    const term = searchTerm.toLowerCase()
    return (c.nombre_completo || '')?.toLowerCase().includes(term) ||
           c.telefono?.includes(term) ||
           (c.email && c.email.toLowerCase().includes(term)) ||
           c.codigo_cliente?.includes(term)
  })

  const openEdit = (c: Cliente) => {
    setEditNombre(c.nombre_completo || '')
    setEditEmail(c.email || '')
    setEditTelefono(c.telefono || '')
    setEditModal({ open: true, cliente: c })
  }

  const handleEditSave = async () => {
    if (!editModal.cliente) return
    setIsSaving(true)
    const res = await actualizarCliente(editModal.cliente.id, {
      nombre_completo: editNombre,
      email: editEmail,
      telefono: editTelefono
    })
    setIsSaving(false)
    if (res.success) {
      setEditModal({ open: false, cliente: null })
    } else {
      alert(res.error || 'Error al actualizar')
    }
  }

  const handleMerge = async () => {
    if (!mergeModal.origen || !destinoId) return
    setIsMerging(true)
    const res = await fusionarClientes(mergeModal.origen.id, destinoId)
    setIsMerging(false)
    if (res.success) {
      setMergeModal({ open: false, origen: null })
      setDestinoId('')
    } else {
      alert(res.error || 'Error al fusionar')
    }
  }

  const getMetrics = (c: Cliente) => {
    const validReservas = (c.reservas || []).filter(r => {
      const st = (r.estado || '').toLowerCase()
      // Incluimos confirmada/completada (solicitado por usuario) y activa/archivada (valores del sistema real)
      return ['activa', 'archivada', 'confirmada', 'completada'].includes(st)
    })
    
    // Sort by fecha_entrada desc
    const sorted = [...validReservas].sort((a, b) => new Date(b.fecha_entrada).getTime() - new Date(a.fecha_entrada).getTime())
    
    
      let hasUSD = false;
    const rawPagos = [...(c.transacciones || []), ...validReservas.flatMap((r: any) => {
        const pagos = [];
        if (r.transacciones) pagos.push(...r.transacciones);
        if (r.pagos_reservas) pagos.push(...r.pagos_reservas);
        return pagos;
      })];
      const allPagos = Array.from(new Map(rawPagos.map((item: any) => [item.id || `${item.reserva_id}-${item.fecha_pago}-${Math.random()}`, item])).values());
    
    // Sumamos directamente los ingresos
    const totalGenerado = allPagos.reduce((sum: number, pago: any) => {
      if (pago.tipo === 'egreso' && pago.categoria === 'reembolso') {
        return sum - (Number(pago.monto_mxn) || Number(pago.monto) || 0);
      }
      if (pago.tipo && pago.tipo !== 'ingreso') return sum;
      if (pago.moneda === 'USD') hasUSD = true;
      return sum + (Number(pago.monto_mxn) || Number(pago.monto) || 0);
    }, 0);

    const fallbackTotal = validReservas.reduce((acc: number, r: any) => acc + (Number(r.monto_apartado) || 0), 0);
    const finalTotalGenerado = allPagos.length > 0 ? totalGenerado : fallbackTotal;
      const ultimaEstancia = sorted.length > 0 ? sorted[0].fecha_entrada : null;
      const ingresos = allPagos.filter((t: any) => t.tipo === 'ingreso' || !t.tipo);
      return {
      totalGenerado: finalTotalGenerado,
      estancias: validReservas.length,
      ultimaEstancia,
      validReservas: sorted,
      hasUSD,
      ingresos
    }
  }

  return (
    <div className="pb-24 space-y-4">
      <div className="flex flex-wrap border-b border-gray-200 gap-y-2 mb-4 bg-white sticky top-0 z-20 px-4">
        <button
          onClick={() => handleTabChange('crm')}
          className={`py-3 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'crm'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Embudo CRM / Prospectos
        </button>
        <button
          onClick={() => handleTabChange('directorio')}
          className={`py-3 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'directorio'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Directorio de Huéspedes
        </button>
      </div>

      {activeTab === 'crm' && (
        <CrmPipeline solicitudes={solicitudes} reservasConfirmadas={reservasConfirmadas} servicios={servicios} />
      )}

      {activeTab === 'directorio' && (
        <div className="space-y-6">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Directorio de Clientes</h1>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Buscar por código, nombre, teléfono o email..."
              className="pl-9 bg-gray-50 border-transparent focus:bg-white transition-colors"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {filteredClientes.length === 0 ? (
          <div className="text-center py-10">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-900 font-medium">No se encontraron clientes</h3>
            <p className="text-sm text-gray-500 mt-1">Intenta con otros términos de búsqueda.</p>
          </div>
        ) : (
          filteredClientes.map(cliente => {
            const numRaw = cliente.telefono || ''
            const numeroLimpiado = numRaw.replace(/\D/g, '')
            let waLink = '#'
            if (numeroLimpiado) {
              const code = numeroLimpiado.length === 10 ? '52' : '' 
              waLink = `https://wa.me/${numeroLimpiado.startsWith('52') ? numeroLimpiado : code + numeroLimpiado}`
            }

            const metrics = getMetrics(cliente)
            const isExpanded = expandedId === cliente.id
            const codigoDisplay = cliente.codigo_cliente || '000000'

            return (
              <div key={cliente.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        {cliente.nombre_completo || 'Huésped'}
                      </h3>
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                        #{codigoDisplay}
                      </span>
                      <button onClick={() => openEdit(cliente)} className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-0.5">
                      
                      {cliente.telefono ? formatPhoneWithFlagObj((cliente as any).codigo_pais, cliente.telefono) : 'Sin teléfono'}
                    </div>
                    {cliente.email && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-0.5">
                        <Mail className="w-3.5 h-3.5" />
                        {cliente.email}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setMergeModal({ open: true, origen: cliente })}
                      className="shrink-0 bg-purple-50 text-purple-600 hover:bg-purple-100 p-2 rounded-full transition-colors"
                      title="Fusionar con otro cliente"
                    >
                      <Merge className="w-4 h-4" />
                    </button>
                    <a 
                      href={waLink}
                      target="_blank" 
                      rel="noreferrer"
                      className={`shrink-0 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 p-2 rounded-full transition-colors ${!numeroLimpiado && 'opacity-50 pointer-events-none'}`}
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </a>
                  </div>
                </div>

                <div 
                  className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors -mx-4 px-4 pb-2"
                  onClick={() => setExpandedId(isExpanded ? null : cliente.id)}
                >
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <div className="text-xs text-gray-500 font-medium mb-1">Última estancia</div>
                    <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      {metrics.ultimaEstancia ? formatDateEs(metrics.ultimaEstancia) : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <div className="text-xs text-gray-500 font-medium mb-1">Total Generado</div>
                    <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                      {formatPrice(metrics.totalGenerado)}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                      {metrics.estancias} {metrics.estancias === 1 ? 'estancia válida' : 'estancias válidas'}
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-center text-gray-400 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="pt-2 pb-2">
                    <div className="flex justify-between items-center mb-2 mt-2">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Historial de Reservas</h4>
                      {metrics.hasUSD && <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Incluye pagos en USD (al TC)</span>}
                    </div>
                    
                    {metrics.validReservas.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No hay reservas válidas.</p>
                    ) : (
                      <div className="space-y-3">
                        {metrics.validReservas.map(r => {
                          const resIngresos = ((r as any).transacciones || []).filter((t: any) => t.tipo === 'ingreso');
                          
                          return (
                          <div key={r.id} className="bg-gray-50 p-2.5 rounded border border-gray-100 text-sm">
                            <div className="flex justify-between font-medium text-gray-800 mb-1">
                              <span>{r.propiedades?.titulo || 'Propiedad'}</span>
                              <span className="text-gray-500 text-xs">{formatDateEs(r.fecha_entrada)} al {formatDateEs(r.fecha_salida)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                              <span>Total Acordado: {formatPrice(r.monto_total_acordado || 0)}</span>
                              <span className="capitalize px-1.5 py-0.5 bg-gray-200 rounded text-gray-700">{r.estado}</span>
                              {r.estado.toLowerCase() === 'cancelada' && Number(r.monto_reembolsado) > 0 && (
                                <span className="ml-2 text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">
                                  Reembolso: {formatPrice(Number(r.monto_reembolsado))}
                                </span>
                              )}
                            </div>
                            
                            {/* Historial de Transacciones */}
                            {resIngresos.length > 0 ? (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Abonos / Ingresos</span>
                                {resIngresos.map((t: any, idx: number) => (
                                  <div key={t.id || Math.random().toString()} className="flex justify-between text-xs py-0.5">
                                    <span className="text-gray-600 truncate max-w-[150px]">{t.concepto || 'Ingreso'}</span>
                                    <span className="text-teal-600 font-medium">+{formatPrice(Number(t.monto_mxn) || Number(t.monto) || 0)} {t.moneda === 'USD' ? '(USD)' : ''}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-400 italic">
                                No hay transacciones registradas.
                              </div>
                            )}
                          </div>
                        )})}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={editModal.open} onOpenChange={(o) => setEditModal(p => ({ ...p, open: o }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nombre</label>
              <Input value={editNombre} onChange={e => setEditNombre(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Teléfono</label>
              <PhoneInputField value={editTelefono} onChange={setEditTelefono} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setEditModal({ open: false, cliente: null })}>Cancelar</Button>
            <Button onClick={handleEditSave} disabled={isSaving}>Guardar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Merge Modal */}
      <Dialog open={mergeModal.open} onOpenChange={(o) => setMergeModal(p => ({ ...p, open: o }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fusionar Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              ¿Deseas fusionar al cliente <strong className="text-gray-900">#{mergeModal.origen?.codigo_cliente || '000000'} ({mergeModal.origen?.nombre_completo || mergeModal.origen?.email})</strong> dentro de 
              {destinoId ? (
                (() => {
                  const dest = clientes.find(c => c.id === destinoId);
                  return <strong className="text-gray-900"> #{dest?.codigo_cliente || '000000'} ({dest?.nombre_completo || dest?.email})</strong>;
                })()
              ) : " otro cliente"}?
              <br/><br/>Las reservas se transferirán y se mantendrán los datos del cliente principal.
            </p>
            <div>
              <label className="text-sm font-medium mb-2 block">Selecciona el Cliente Principal (Destino):</label>
              <select 
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={destinoId}
                onChange={e => setDestinoId(e.target.value)}
              >
                <option value="">-- Seleccionar cliente principal --</option>
                {clientes.filter(c => c.id !== mergeModal.origen?.id).map(c => (
                  <option key={c.id} value={c.id}>
                    #{c.codigo_cliente || '000000'} - {c.nombre_completo || c.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setMergeModal({ open: false, origen: null })}>Cancelar</Button>
            <Button onClick={handleMerge} disabled={!destinoId || isMerging} className="bg-purple-600 hover:bg-purple-700">Confirmar Fusión</Button>
          </div>
        </DialogContent>
      </Dialog>
        </div>
      )}
    </div>
  )
}


function CrmPipeline({ solicitudes, reservasConfirmadas = [], servicios = [] }: { solicitudes: any[], reservasConfirmadas?: any[], servicios?: any[] }) {
  const stages = [
    { id: 'por_contactar', title: 'Por Contactar', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'en_seguimiento', title: 'En Seguimiento', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 'cerradas', title: 'Cerradas', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  ]

      // Normalize states to 3 CRM stages
    const normalizedSolicitudes = solicitudes.map(s => {
      let estado_crm = 'por_contactar';
      if (s.estado === 'en_seguimiento') estado_crm = 'en_seguimiento';
      else if (s.estado === 'confirmada' || s.estado === 'descartada') estado_crm = 'cerradas';
      return { ...s, estado_crm };
    })

      // Detect collision: does a confirmed reservation overlap this solicitud's dates?
    const tieneColision = (sol: any): boolean => {
      // Only show warning for active stages (por_contactar, en_seguimiento)
      if (sol.estado_crm === 'cerradas' || ['confirmada', 'convertida', 'aprobada', 'descartada', 'rechazada'].includes(sol.estado)) {
        return false;
      }
      
      return reservasConfirmadas.some(r => {
        if (r.propiedad_id !== sol.propiedad_id) return false;
        // Exclude the reservation that might belong to this same request
        if (r.id === sol.reserva_id || r.solicitud_id === sol.id) return false;
        
        // Strict string comparison YYYY-MM-DD prevents timezone parsing offsets
        const reservaLlegada = r.fecha_entrada.split('T')[0];
        const reservaSalida = r.fecha_salida.split('T')[0];
        const solicitudLlegada = sol.fecha_entrada.split('T')[0];
        const solicitudSalida = sol.fecha_salida.split('T')[0];
        
        const hayCruce = (solicitudLlegada < reservaSalida) && (solicitudSalida > reservaLlegada);
        return hayCruce;
      })
    }

  const [activeStage, setActiveStage] = useState('por_contactar')
  const [isMobile, setIsMobile] = useState(false)
  const [confirmModal, setConfirmModal] = useState<{ open: boolean, solicitud: any | null }>({ open: false, solicitud: null })
  const [confMoneda, setConfMoneda] = useState('MXN')
  const [confTc, setConfTc] = useState('16.00')
  const [confMetodo, setConfMetodo] = useState('Transferencia')
  const [confAnticipo, setConfAnticipo] = useState('')
  const [confHospedaje, setConfHospedaje] = useState('')
  const [confExtras, setConfExtras] = useState<Record<string, any>>({})
  const [confReferencia, setConfReferencia] = useState('')
  const [confSaving, setConfSaving] = useState(false)
  const [confError, setConfError] = useState('')

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const changeStage = async (id: string, stage: string) => {
    try {
      const { cambiarEtapaSolicitud } = await import('@/app/casasgaby/admin/actions')
      const res = await cambiarEtapaSolicitud(id, stage)
      if (!res.success) alert(res.error)
    } catch (e: any) {
      alert('Error: ' + e.message)
    }
  }

  const handleWhatsAppAndAdvance = async (sol: any) => {
    const waUrl = buildWaUrl(sol.codigo_pais || '+52', sol.telefono, `Hola ${sol.nombre_cliente}, te escribo de Casas Gaby respecto a tu solicitud del ${formatDateEs(sol.fecha_entrada)}.`)
    window.open(waUrl, '_blank')
    // Auto-advance to En Seguimiento if still Por Contactar
    if (sol.estado_crm === 'por_contactar') {
      await changeStage(sol.id, 'en_seguimiento')
    }
  }

  const getExtrasTotal = (state: Record<string, any>) => {
    return Object.values(state).reduce((acc: number, s: any) => {
      if (!s.activo) return acc;
      if (s.tipo_tarifa === 'por_trayecto') {
        const count = (s.ida ? 1 : 0) + (s.vuelta ? 1 : 0);
        return acc + (Number(s.precio_base) * count);
      }
      return acc + (Number(s.precio_base) * (s.qty || 1));
    }, 0);
  }

  const handleConfirmarReserva = async () => {
    if (!confirmModal.solicitud) return
    const anticipo = parseFloat(confAnticipo || '0')
    const tc = parseFloat(confTc || '1')
    if (!confAnticipo || isNaN(anticipo)) return setConfError('Ingresa el monto del anticipo.')
    setConfSaving(true)
    setConfError('')
    try {
      const { aprobarSolicitud } = await import('@/app/casasgaby/admin/actions')
      const sol = confirmModal.solicitud
      const extrasAmount = getExtrasTotal(confExtras)
      const hospedajeAmount = parseFloat(confHospedaje || '0')
      const finalTotal = hospedajeAmount + extrasAmount
      
      const finalExtrasList = Object.values(confExtras).filter(e => e.activo).map(e => {
        let finalQty = e.qty;
        let finalName = e.nombre;
        if (e.tipo_tarifa === 'por_trayecto') {
          finalQty = (e.ida ? 1 : 0) + (e.vuelta ? 1 : 0);
          const baseName = e.nombre.replace(/\s*\(Ida.*?\)/g, '').trim();
          if (e.ida && e.vuelta) finalName = baseName + ' (Ida y Vuelta)';
          else if (e.ida) finalName = baseName + ' (Ida)';
          else if (e.vuelta) finalName = baseName + ' (Vuelta)';
        }
        return {
          id: e.id,
          nombre: finalName,
          qty: finalQty,
          precio_base: e.precio_base,
          tipo_tarifa: e.tipo_tarifa
        }
      }).filter(e => e.qty > 0);

      const res = await aprobarSolicitud(
        sol.id, finalTotal, anticipo,
        confMetodo === 'Transferencia' ? 'transferencia_mxn' : 'efectivo_mxn',
        confMoneda, tc, finalExtrasList
      )
      if (res && !res.success) return setConfError(res.message || 'Error al confirmar.')
      setConfirmModal({ open: false, solicitud: null })
      setConfAnticipo('')
      setConfReferencia('')
    } catch (e: any) {
      setConfError(e.message)
    } finally {
      setConfSaving(false)
    }
  }

  const extrasModalTotal = getExtrasTotal(confExtras);
  const hospedajeModalTotal = parseFloat(confHospedaje || '0');
  const montoPrevisto = hospedajeModalTotal + extrasModalTotal;
  
  // Reactively calculate suggested anticipo if they edit the USD TC or change currency
  useEffect(() => {
    if (!confirmModal.open) return;
    const baseSugerido = montoPrevisto * 0.5;
    if (confMoneda === 'USD') {
      const tc = parseFloat(confTc || '16.00');
      setConfAnticipo((baseSugerido / tc).toFixed(2));
    } else {
      setConfAnticipo(baseSugerido.toFixed(2));
    }
  }, [montoPrevisto, confMoneda, confTc, confirmModal.open]);

  const anticipoMXN = confMoneda === 'USD' ? (parseFloat(confAnticipo || '0') * parseFloat(confTc || '16.00')) : parseFloat(confAnticipo || '0');


  const renderCard = (s: any, stageId: string) => {
    const colision = tieneColision(s)
    const isCerrada = stageId === 'cerradas'
    const esConvertida = s.estado === 'confirmada' || ['convertida', 'aprobada', 'Aprobada'].includes(s.estado)
    const esDescartada = ['descartada', 'rechazada', 'Rechazada'].includes(s.estado)

    return (
      <div
        key={s.id}
        className={`bg-white p-3 rounded-xl border shadow-sm flex flex-col gap-2 transition-all hover:shadow-md ${colision ? 'border-red-400 bg-red-50/50' : 'border-gray-200'}`}
      >
        {colision && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-red-700 bg-red-100 border border-red-200 rounded-lg px-2 py-1">
            ⚠️ Fechas ya no disponibles (Cruce con reserva confirmada)
          </div>
        )}
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-900 text-sm leading-tight">{s.nombre_cliente || s.nombre_completo}</h4>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-xs text-gray-500">{formatDateEs(s.fecha_entrada)}</span>
            {isCerrada && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${esConvertida ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {esConvertida ? '✓ Confirmada' : esDescartada ? 'Descartada' : 'Cerrada'}
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-teal-700 font-medium">{s.propiedades?.titulo}</p>
        <p className="text-xs text-gray-600 font-bold">{formatPrice(s.costo_total || 0)}</p>
        <p className="text-xs text-gray-400">{formatDateEs(s.fecha_entrada)} → {formatDateEs(s.fecha_salida)} · {s.noches || '?'} noches</p>

        <div className="flex flex-wrap gap-2 mt-1 pt-2 border-t">
            {!isCerrada && (<button
              onClick={() => handleWhatsAppAndAdvance(s)}
              className="flex-1 bg-green-50 text-green-700 border border-green-200 text-xs py-1.5 rounded-md text-center hover:bg-green-100 font-medium transition-colors"
            >
              WhatsApp {stageId === 'por_contactar' ? '→ Seguimiento' : ''}
            </button>)}
                          <select
                className="flex-1 text-xs border rounded-md px-1 py-1.5 bg-gray-50 focus:ring-1 focus:ring-teal-500"
                value={s.estado === 'descartada' ? 'descartada' : s.estado === 'confirmada' ? 'confirmada' : s.estado_crm}
                onChange={(e) => changeStage(s.id, e.target.value)}
              >
                <option value="por_contactar">Por Contactar</option>
                <option value="en_seguimiento">En Seguimiento</option>
                <option value="descartada">Descartar</option>
                {s.estado === 'confirmada' && <option value="confirmada" disabled>Confirmada</option>}
              </select>
          </div>

        {!isCerrada && !colision && (
          <Button
            size="sm"
            className="w-full mt-1 bg-teal-600 hover:bg-teal-700 text-white h-8 text-xs font-semibold"
            onClick={() => {
              const initExtras: Record<string, any> = {};
              if (Array.isArray(s.servicios_extra)) {
                s.servicios_extra.forEach((e: any) => {
                  let ida = false;
                  let vuelta = false;
                  let qty = e.qty || 1;
                  if (e.tipo_tarifa === 'por_trayecto') {
                    if (e.nombre?.includes('Ida y Vuelta')) { ida = true; vuelta = true; qty = 2; }
                    else if (e.nombre?.includes('Ida')) { ida = true; qty = 1; }
                    else if (e.nombre?.includes('Vuelta')) { vuelta = true; qty = 1; }
                    else { ida = true; vuelta = true; qty = 2; } // fallback
                  }
                  initExtras[e.id] = { activo: true, id: e.id, nombre: e.nombre, precio_base: e.precio_base, tipo_tarifa: e.tipo_tarifa, qty, ida, vuelta };
                });
              }
              const eTotal = Object.values(initExtras).reduce((acc: number, s: any) => acc + (s.precio_base * s.qty), 0);
              const totalBase = parseFloat(s.costo_total || s.monto_total_acordado || '0');
              const hBase = Math.max(0, totalBase - eTotal);
              
              
              
                              const confReserva = reservasConfirmadas.find(r => 

              
                                r.propiedad_id === s.propiedad_id &&

              
                                r.id !== s.reserva_id &&

              
                                r.solicitud_id !== s.id &&

              
                                r.fecha_entrada < s.fecha_salida &&

              
                                r.fecha_salida > s.fecha_entrada

              
                              );

              
                              

              
                              if (confReserva) {

              
                                const fEntrada = new Date(s.fecha_entrada + 'T00:00:00');

              
                                const fSalida = new Date(s.fecha_salida + 'T00:00:00');

              
                                const formatter = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' });

              
                                alert(`No es posible confirmar la reserva: El rango de fechas seleccionado (${formatter.format(fEntrada)} - ${formatter.format(fSalida)}) ya está reservado por ${confReserva.nombre_cliente}.`);

              
                                return;

              
                              }

              
              

              
                              setConfExtras(initExtras);
              setConfHospedaje(hBase.toFixed(2));
              setConfirmModal({ open: true, solicitud: s })
              setConfMoneda('MXN')
              setConfTc('16.00')
              setConfMetodo('Transferencia')
              setConfError('')
            }}
          >
            Confirmar Reserva
          </Button>
        )}
      </div>
    )
  }

  const renderCards = (stageId: string) => {
    const items = normalizedSolicitudes.filter(s => s.estado_crm === stageId)
    if (items.length === 0) return <div className="text-sm text-gray-400 p-4 text-center italic">Vacío</div>
    return items.map(s => renderCard(s, stageId))
  }

  return (
    <>
      {isMobile ? (
        <div className="space-y-4 px-4 pb-20">
          <div className="flex overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gap-2 pb-2 scrollbar-hide -mx-4 px-4">
            {stages.map(st => (
              <button
                key={st.id}
                onClick={() => setActiveStage(st.id)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${activeStage === st.id ? st.color + ' ring-1 ring-black/10 shadow-sm' : 'bg-white text-gray-600 border-gray-200'}`}
              >
                {st.title} ({normalizedSolicitudes.filter(s => s.estado_crm === st.id).length})
              </button>
            ))}
          </div>
          <div className="bg-gray-50/50 rounded-2xl min-h-[400px] border border-gray-200/50 p-2 space-y-3">
            {renderCards(activeStage)}
          </div>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-6 px-4 min-h-[600px]">
          {stages.map(st => (
            <div key={st.id} className="flex-none w-80 flex flex-col bg-gray-50/50 rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm">
              <div className={`p-3 border-b border-black/5 font-bold text-sm flex justify-between items-center ${st.color}`}>
                <span>{st.title}</span>
                <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-black shadow-sm">
                  {normalizedSolicitudes.filter(s => s.estado_crm === st.id).length}
                </span>
              </div>
              <div className="p-3 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-3">
                {renderCards(st.id)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Confirmar Reserva desde CRM */}
      <Dialog open={confirmModal.open} onOpenChange={(o) => setConfirmModal(p => ({ ...p, open: o }))}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <DialogHeader>
            <DialogTitle>Confirmar Reserva</DialogTitle>
          </DialogHeader>
          {confirmModal.solicitud && (
            <div className="space-y-4 py-2">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-sm space-y-2">
                <div>
                  <p className="font-bold text-teal-800">{confirmModal.solicitud.nombre_cliente}</p>
                  <p className="text-teal-700">{confirmModal.solicitud.propiedades?.titulo}</p>
                  <p className="text-gray-600">{formatDateEs(confirmModal.solicitud.fecha_entrada)} → {formatDateEs(confirmModal.solicitud.fecha_salida)} · {confirmModal.solicitud.noches} noches</p>
                </div>
                
                <div className="border-t border-teal-200/60 pt-2">
                  <p className="font-semibold text-teal-900 mb-1">Catálogo de Servicios ({servicios.length} disponibles):</p>
                    {servicios.length > 0 ? (
                      <div className="space-y-2">
                      {servicios.map((srv: any) => {
                        const state = confExtras[srv.id] || { activo: false, id: srv.id, nombre: srv.nombre, precio_base: srv.precio_base, tipo_tarifa: srv.tipo_tarifa, qty: 1, ida: false, vuelta: false };
                        const isSel = state.activo;
                        
                        return (
                          <div key={srv.id} className={`p-2 rounded-lg border transition-all duration-300 ${isSel ? 'bg-teal-50/50 border-teal-200' : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`}>
                            <div className="flex items-start gap-2">
                              <input 
                                type="checkbox" 
                                className="mt-1 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                                checked={isSel}
                                onChange={(e) => {
                                  const activo = e.target.checked;
                                  setConfExtras({ ...confExtras, [srv.id]: { ...state, activo, ida: activo ? (state.ida || true) : state.ida } });
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <span className={`text-sm font-medium leading-tight ${!isSel ? 'text-gray-500' : 'text-gray-900'}`}>{srv.nombre}</span>
                                  <span className={`text-xs font-bold whitespace-nowrap ml-2 ${!isSel ? 'text-gray-400' : 'text-teal-700'}`}>
                                    +{formatPrice(isSel ? (srv.tipo_tarifa === 'por_trayecto' ? srv.precio_base * ((state.ida ? 1 : 0) + (state.vuelta ? 1 : 0)) : srv.precio_base * state.qty) : srv.precio_base)}
                                  </span>
                                </div>
                                {isSel && srv.tipo_tarifa !== 'fijo' && (
                                  <div className="mt-1.5 flex items-center gap-2">
                                    {srv.tipo_tarifa === 'por_trayecto' ? (
                                      <div className="flex flex-col gap-1 w-full mt-1">
                                        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                          <input type="checkbox" className="rounded text-teal-600 w-3 h-3" checked={!!state.ida}
                                            onChange={(e) => setConfExtras({...confExtras, [srv.id]: {...state, ida: e.target.checked, activo: e.target.checked || state.vuelta}})} />
                                          Ida (Apto &rarr; Casa)
                                        </label>
                                        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                          <input type="checkbox" className="rounded text-teal-600 w-3 h-3" checked={!!state.vuelta}
                                            onChange={(e) => setConfExtras({...confExtras, [srv.id]: {...state, vuelta: e.target.checked, activo: state.ida || e.target.checked}})} />
                                          Vuelta (Casa &rarr; Apto)
                                        </label>
                                      </div>
                                    ) : (
                                      <>
                                        <span className="text-xs text-gray-600">
                                          {srv.nombre.toLowerCase().includes('auto') ? 'Días:' : srv.nombre.toLowerCase().includes('distancia') || srv.nombre.toLowerCase().includes('especial') ? 'Distancia (km):' : 'Personas / Piezas:'}
                                        </span>
                                        <input 
                                          type="number" min="1" value={state.qty}
                                          onChange={(e) => setConfExtras({...confExtras, [srv.id]: {...state, qty: parseInt(e.target.value)||1}})}
                                          className="w-16 h-6 text-xs rounded border-gray-300 px-2 bg-white"
                                        />
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No hay servicios en el catálogo</p>
                  )}
                </div>

                <div className="border-t border-teal-200/60 pt-2 grid grid-cols-2 gap-2 items-center">
                  <label className="font-medium text-gray-700 text-xs">Subtotal Hospedaje (Editable)</label>
                  <Input type="number" value={confHospedaje} onChange={e => setConfHospedaje(e.target.value)} className="h-8 text-sm" />
                  
                  <span className="font-medium text-gray-700 text-xs">Subtotal Extras</span>
                  <span className="text-sm font-semibold">{formatPrice(extrasModalTotal)}</span>
                </div>
                
                <div className="bg-teal-100/50 p-2 rounded -mx-1 mt-1 flex justify-between items-center">
                  <span className="font-bold text-teal-900">Total Acordado:</span>
                  <span className="font-black text-teal-900 text-base">{formatPrice(montoPrevisto)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Moneda del anticipo</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfMoneda('MXN')}
                      className={`flex-1 flex items-center justify-center py-2 text-sm rounded-lg border font-medium transition-colors ${confMoneda === 'MXN' ? 'bg-gray-100 border-gray-400' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                    >
                      <svg viewBox="0 0 64 64" className="w-4 h-4 mr-1.5"><path fill="#006341" d="M0 16h21.3v32H0z"/><path fill="#fff" d="M21.3 16h21.4v32H21.3z"/><path fill="#c8102e" d="M42.7 16H64v32H42.7z"/><circle cx="32" cy="32" r="4.5" fill="#693d25"/><path fill="#006341" d="M30 34c1.1 1.5 3.3 1.5 4 0l-2-2-2 2z"/></svg> MXN
                    </button>
                    <button
                      onClick={() => setConfMoneda('USD')}
                      className={`flex-1 flex items-center justify-center py-2 text-sm rounded-lg border font-medium transition-colors ${confMoneda === 'USD' ? 'bg-gray-100 border-gray-400' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                    >
                      <svg viewBox="0 0 64 64" className="w-4 h-4 mr-1.5"><path fill="#fff" d="M0 16h64v32H0z"/><path fill="#bd3d44" d="M0 18.5h64v2.4H0zm0 4.9h64v2.4H0zm0 4.9h64v2.4H0zm0 4.9h64v2.4H0zm0 4.9h64v2.4H0zm0 4.9h64v2.4H0z"/><path fill="#192f5d" d="M0 16h29.3v17H0z"/><path fill="#fff" d="M3 18l.8 2.4H6l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.7 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.6 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4H13zm4.7 0l.8 2.4h2.2L19 21.8l.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.6 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm-16.3 3l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.7 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4H13zm4.6 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.7 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm-16.3 3l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4H8.3zm4.7 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4H13zm4.6 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.7 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm-16.3 3l.8 2.4H8l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.7 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4H13zm4.6 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.7 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2z"/></svg> USD
                    </button>
                  </div>
                </div>
                {confMoneda === 'USD' && (
                  <div>
                    <label className="text-sm font-medium block mb-1">Tipo de cambio (1 USD =)</label>
                    <Input type="number" value={confTc} onChange={e => setConfTc(e.target.value)} placeholder="17.00" />
                  </div>
                )}
              </div>

              {confMoneda === 'USD' && parseFloat(confAnticipo) > 0 && (
                <p className="text-xs text-gray-500 bg-gray-50 border rounded-lg px-3 py-2">
                  Equivalente: <strong>{formatPrice(anticipoMXN)}</strong> MXN al tipo de cambio {confTc}
                </p>
              )}

              <div>
                <label className="text-sm font-medium block mb-1">Método de pago</label>
                <div className="flex gap-2">
                  {['Efectivo', 'Transferencia'].map(m => (
                    <button
                      key={m}
                      onClick={() => setConfMetodo(m)}
                      className={`flex-1 inline-flex items-center justify-center py-2 text-sm rounded-lg border font-medium transition-colors ${confMetodo === m ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400'}`}
                    >
                      {m === 'Efectivo' ? <Banknote className="w-4 h-4 mr-1.5" /> : <ArrowRightLeft className="w-4 h-4 mr-1.5" />}
                      <span>{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Monto anticipo ({confMoneda})</label>
                  <Input type="number" value={confAnticipo} onChange={e => setConfAnticipo(e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Referencia / Folio</label>
                  <Input value={confReferencia} onChange={e => setConfReferencia(e.target.value)} placeholder="Opcional" />
                </div>
              </div>

              {confError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{confError}</p>}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setConfirmModal({ open: false, solicitud: null })}>Cancelar</Button>
                <Button
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={confSaving}
                  onClick={handleConfirmarReserva}
                >
                  {confSaving ? 'Guardando...' : '✓ Confirmar y Registrar'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
