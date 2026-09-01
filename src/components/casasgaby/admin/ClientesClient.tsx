'use client'

import { useState } from 'react'
import { Search, User, Phone, Mail, Calendar, TrendingUp, Edit2, Merge, ChevronDown, ChevronUp } from 'lucide-react'
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

export default function ClientesClient({ clientes }: { clientes: Cliente[] }) {
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
    <div className="pb-24">
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
  )
}
