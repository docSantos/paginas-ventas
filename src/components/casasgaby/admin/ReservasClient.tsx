'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { aprobarSolicitud, rechazarSolicitud } from '@/app/casasgaby/admin/actions'
import type { Solicitud, Reserva, Propiedad } from '@/types/casasgaby'
import Link from 'next/link'

interface ReservasClientProps {
  solicitudes: (Solicitud & { propiedades: Pick<Propiedad, 'titulo'> | null })[]
  reservas: (Reserva & { propiedades: Pick<Propiedad, 'titulo'> | null })[]
}

export function ReservasClient({ solicitudes, reservas }: ReservasClientProps) {
  const [activeTab, setActiveTab] = useState<'pendientes' | 'confirmadas'>('pendientes')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleAction = async (id: string, action: 'aprobar' | 'rechazar') => {
    setLoadingId(id)
    try {
      if (action === 'aprobar') {
        await aprobarSolicitud(id)
      } else {
        await rechazarSolicitud(id)
      }
    } catch (e: any) {
      alert("Error: " + e.message)
    } finally {
      setLoadingId(null)
    }
  }

  const pendientes = solicitudes.filter(s => s.estado === 'Pendiente')

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200">
        <button
          className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'pendientes' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('pendientes')}
        >
          Solicitudes Pendientes ({pendientes.length})
        </button>
        <button
          className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'confirmadas' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('confirmadas')}
        >
          Reservas Confirmadas ({reservas.length})
        </button>
      </div>

      {activeTab === 'pendientes' && (
        <div className="space-y-4">
          {pendientes.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              No tienes solicitudes pendientes por el momento.
            </div>
          ) : (
            pendientes.map(solicitud => (
              <div key={solicitud.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900">{solicitud.nombre_cliente}</h3>
                  <div className="text-sm text-gray-600 mt-1 flex flex-col gap-0.5">
                    <span className="font-medium text-teal-700">{solicitud.propiedades?.titulo}</span>
                    <span>📞 {solicitud.telefono} {solicitud.email ? `• ✉️ ${solicitud.email}` : ''}</span>
                    <span>Fechas: {solicitud.fecha_entrada} a {solicitud.fecha_salida} ({solicitud.noches} noches)</span>
                    <span>Total: {formatPrice(solicitud.costo_total || 0)} • Anticipo sugerido: {formatPrice(solicitud.monto_apartado || 0)}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Button 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    disabled={loadingId !== null}
                    onClick={() => handleAction(solicitud.id, 'rechazar')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar
                  </Button>
                  <Button 
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                    disabled={loadingId !== null}
                    isLoading={loadingId === solicitud.id}
                    onClick={() => handleAction(solicitud.id, 'aprobar')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprobar y Bloquear Fechas
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'confirmadas' && (
        <div className="space-y-4">
          {reservas.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
              <CheckCircle className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              No tienes reservas confirmadas.
            </div>
          ) : (
            reservas.map(reserva => (
              <div key={reserva.id} className="bg-white p-5 rounded-xl border border-teal-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-0.5 rounded uppercase">Reserva Activa</span>
                    <Link href={`/casasgaby/propiedad/${reserva.propiedad_id}`} className="text-xs text-gray-400 hover:text-teal-600 flex items-center">
                      Ver casa <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                  <h3 className="font-bold text-gray-900">{reserva.nombre_cliente}</h3>
                  <div className="text-sm text-gray-600 mt-1 flex flex-col gap-0.5">
                    <span className="font-medium">{reserva.propiedades?.titulo}</span>
                    <span>📞 {reserva.telefono}</span>
                    <span>Fechas bloqueadas: {reserva.fecha_entrada} a {reserva.fecha_salida}</span>
                    <span>Total de estadía: {formatPrice(reserva.costo_total)}</span>
                  </div>
                </div>
                {/* Opcional: Botón para archivar o cancelar la reserva en el futuro */}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
