'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice, formatDateEs } from '@/lib/utils'
import { 
  reprogramarFechasReserva, 
  extenderEstanciaInHouse, 
  actualizarFechasSolicitudCRM,
  validarDisponibilidadRango 
} from '@/app/casasgaby/admin/actions'
import { calcularTarifaHospedaje, calcularCostoExtras, PreciosPropiedad } from '@/lib/pricing'
import { CalendarDays, AlertTriangle, History, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface HistorialItem {
  id: string
  tipo_cambio: string
  fecha_anterior_entrada: string
  fecha_anterior_salida: string
  fecha_nueva_entrada: string
  fecha_nueva_salida: string
  diferencia_noches: number
  impacto_financiero: number
  motivo: string
  creado_el: string
}

interface Props {
  open: boolean
  onClose: () => void
  reserva?: any // Para 'completo' o 'solo_salida'
  solicitud?: any // Para 'crm'
  modo: 'completo' | 'solo_salida' | 'crm'
  historial?: HistorialItem[]
  onSuccess?: () => void
}

export function ModalModificarFechas({ 
  open, 
  onClose, 
  reserva, 
  solicitud,
  modo, 
  historial = [], 
  onSuccess 
}: Props) {
  const esCRM = modo === 'crm'
  const dataItem = esCRM ? solicitud : reserva
  const inHouse = !esCRM && !!dataItem?.check_in_real_at

  const [nuevaEntrada, setNuevaEntrada] = useState(dataItem?.fecha_entrada || '')
  const [nuevaSalida, setNuevaSalida] = useState(dataItem?.fecha_salida || '')
  const [motivo, setMotivo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'editar' | 'historial'>('editar')

// --- CÁLCULO DE NOCHES Y DIFERENCIAL ---
  const nochesOriginales = dataItem?.fecha_entrada && dataItem?.fecha_salida
    ? Math.max(1, Math.round(
        (new Date(dataItem.fecha_salida).getTime() - new Date(dataItem.fecha_entrada).getTime()) / (1000 * 60 * 60 * 24)
      ))
    : 0

  const nochesNuevas = (nuevaEntrada && nuevaSalida && nuevaSalida > nuevaEntrada)
    ? Math.max(1, Math.round(
        (new Date(nuevaSalida).getTime() - new Date(nuevaEntrada).getTime()) / (1000 * 60 * 60 * 24)
      ))
    : 0

  const deltaNoches = nochesNuevas - nochesOriginales

  // --- EXTRACCION DE COSTO DE SERVICIOS EXTRA Y TOTALES ---
  const totalOriginal = Number(dataItem?.monto_total_acordado || dataItem?.costo_total || 0)
  const tarifaBaseOriginal = Number(dataItem?.tarifa_base || 0)

  let extrasOriginal = 0
  let hospedajeOriginal = 0

  if (esCRM) {
    const extrasList = dataItem?.servicios_extra 
      ? (typeof dataItem.servicios_extra === 'string' ? JSON.parse(dataItem.servicios_extra) : dataItem.servicios_extra)
      : []
    extrasOriginal = calcularCostoExtras(extrasList)
    hospedajeOriginal = Math.max(0, totalOriginal - extrasOriginal)
  } else {
    // Para reservas confirmadas, la tarifa base ya está consolidada. 
    // Los extras fijos congelados son la diferencia entre el total y la tarifa base.
    hospedajeOriginal = tarifaBaseOriginal > 0 ? tarifaBaseOriginal : totalOriginal;
    extrasOriginal = Math.max(0, totalOriginal - hospedajeOriginal)
  }

  // --- TARIFAS BASE (PROPIEDAD O INFERIDAS) ---
  const prop = dataItem?.propiedad || dataItem?.propiedades || {}
  
  // Inferimos o leemos el catálogo para tener la tabla de precios
  const precioPorNoche = Number(prop.precio_por_noche) || 1500
  const precioPorSemana = Number(prop.precio_por_semana) || (precioPorNoche * 7)
  const precioPorMes = Number(prop.precio_por_mes) || (precioPorSemana * 4)

  // --- REGLA OFICIAL DE CASAS GABY ---
  const preciosCalculados = {
    precio_por_noche: precioPorNoche,
    precio_por_semana: precioPorSemana,
    precio_por_mes: precioPorMes
  };

  const nuevoHospedaje = calcularTarifaHospedaje(nochesNuevas, preciosCalculados);
  const nuevoTotal = nuevoHospedaje + extrasOriginal
  const nuevaTarifaBase = nuevoHospedaje
  const impactoFinanciero = nuevoTotal - totalOriginal
  
  
  // Reset al abrir
  useEffect(() => {
    if (open && dataItem) {
      setNuevaEntrada(dataItem.fecha_entrada || '')
      setNuevaSalida(dataItem.fecha_salida || '')
      setMotivo('')
      setError('')
      setActiveTab('editar')
    }
  }, [open, dataItem])

  const handleGuardar = async () => {
    if (!esCRM && !motivo.trim()) {
      setError('El motivo del cambio es obligatorio.')
      return
    }
    if (!nuevaSalida || (!inHouse && !nuevaEntrada)) {
      setError('Las fechas son requeridas.')
      return
    }
    if (nuevaSalida <= nuevaEntrada) {
      setError('La fecha de salida debe ser posterior a la entrada.')
      return
    }
    if (inHouse && nuevaSalida <= (dataItem?.fecha_entrada || '')) {
      setError('La nueva fecha de salida debe ser posterior a la fecha de llegada.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      let res
      if (esCRM) {
        res = await actualizarFechasSolicitudCRM(
          dataItem.id,
          dataItem.propiedad_id,
          nuevaEntrada,
          nuevaSalida,
          nuevoTotal,       // <-- Agregar nuevoTotal
          nochesNuevas      // <-- Agregar nochesNuevas (si tu action lo admite)
        )
      } else if (inHouse || modo === 'solo_salida') {
        res = await extenderEstanciaInHouse(dataItem.id, nuevaSalida, motivo, nuevaTarifaBase, nuevoTotal)
      } else {
        res = await reprogramarFechasReserva(dataItem.id, nuevaEntrada, nuevaSalida, motivo, nuevaTarifaBase, nuevoTotal)
      }

      if (!res.success) {
        setError(res.error || 'Error al guardar los cambios.')
      } else {
        onSuccess?.()
        onClose()
      }
    } catch (e: any) {
      setError(e.message || 'Error inesperado.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!dataItem) return null

  const labelTipoCambio: Record<string, string> = {
    reprogramacion_fechas: 'Reprogramación',
    extension_estancia: 'Extensión',
    ajuste_tarifa: 'Ajuste de Tarifa'
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-teal-600" />
            {esCRM 
              ? 'Ajustar Fechas de Prospecto (CRM)' 
              : inHouse 
                ? 'Modificar Salida' 
                : 'Reprogramar Fechas'}
          </DialogTitle>
        </DialogHeader>

        {/* Tabs solo si NO es CRM (el CRM no lleva historial de auditoría) */}
        {!esCRM && (
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab('editar')}
              className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'editar' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Modificar Fechas
            </button>
            <button
              onClick={() => setActiveTab('historial')}
              className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'historial' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <History className="w-4 h-4" />
              Historial {historial.length > 0 && <span className="bg-gray-200 text-gray-600 text-xs rounded-full px-1.5">{historial.length}</span>}
            </button>
          </div>
        )}

        {activeTab === 'editar' && (
          <div className="space-y-4">
            {/* Fechas actuales */}
            <div className="bg-gray-550 rounded-lg p-3 text-sm">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Fechas actuales</p>
              <div className="flex gap-4 text-gray-800 font-medium">
                <span>Entrada: {formatDateEs(dataItem.fecha_entrada)}</span>
                <span>Salida: {formatDateEs(dataItem.fecha_salida)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {nochesOriginales} noches {totalOriginal > 0 && `· ${formatPrice(totalOriginal)}`}
              </p>
            </div>

            {/* Inputs de fechas */}
            <div className={`grid gap-3 ${!inHouse ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {!inHouse && (
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Nueva Entrada</label>
                  <Input
                    type="date"
                    value={nuevaEntrada}
                    onChange={e => setNuevaEntrada(e.target.value)}
                    className="text-sm"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  {inHouse ? 'Modificar Salida a' : 'Nueva Salida'}
                </label>
                <Input
                  type="date"
                  value={nuevaSalida}
                  min={inHouse ? dataItem.fecha_entrada : nuevaEntrada}
                  onChange={e => setNuevaSalida(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Diferencial en tiempo real */}
            {nochesNuevas > 0 && (nochesNuevas !== nochesOriginales || nuevaEntrada !== dataItem.fecha_entrada) && (
              <div className={`rounded-lg p-3 text-sm border ${
                deltaNoches > 0
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : deltaNoches < 0
                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Nuevas noches: {nochesNuevas}</span>
                  <span className={`font-bold ${deltaNoches > 0 ? 'text-amber-700' : deltaNoches < 0 ? 'text-blue-700' : 'text-gray-700'}`}>
                    {deltaNoches > 0 ? '+' : ''}{deltaNoches} noches
                  </span>
                </div>
                {totalOriginal > 0 && (
                  <>
                    <div className="mt-2 space-y-1 text-xs border-t border-gray-100 pt-2">
                      <div className="flex justify-between">
                        <span>Hospedaje ({nochesNuevas} noches - Tarifa Escalada):</span>
                        <span>{formatPrice(nuevoHospedaje)}</span>
                      </div>
                      {extrasOriginal > 0 && (
                        <div className="flex justify-between text-gray-500">
                          <span>Extras fijos (Congelados):</span>
                          <span>{formatPrice(extrasOriginal)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between mt-2 pt-1 border-t border-gray-100 text-sm">
                      <span>Total ajustado:</span>
                      <span className="font-bold">{formatPrice(nuevoTotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs mt-0.5">
                      <span>Impacto financiero:</span>
                      <span className={`font-semibold ${impactoFinanciero > 0 ? 'text-green-600' : impactoFinanciero < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                        {impactoFinanciero > 0 ? '+' : ''}{impactoFinanciero < 0 ? '-' : ''}{formatPrice(Math.abs(impactoFinanciero))}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Motivo (solo para reservas formales, no para CRM) */}
            {!esCRM ? (
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Motivo del cambio <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={motivo}
                  onChange={e => setMotivo(e.target.value)}
                  placeholder="Ej: El cliente solicitó llegar un día antes por vuelo adelantado"
                  rows={2}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                />
                <p className="text-xs text-gray-400 mt-0.5">Este campo queda en el historial inmutable de la reserva.</p>
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                Ajusta la cotización del prospecto. No aparta ni bloquea fechas en el calendario.
              </p>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
                Cancelar
              </Button>
              <Button
                onClick={handleGuardar}
                disabled={isLoading || (!esCRM && !motivo.trim()) || nochesNuevas === 0}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
              >
                {isLoading ? 'Guardando...' : (esCRM ? 'Actualizar Cotización' : inHouse ? 'Modificar Salida' : 'Reprogramar Fechas')}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'historial' && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {historial.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                Sin cambios registrados aún
              </div>
            ) : (
              historial.map(h => (
                <div key={h.id} className="bg-gray-50 rounded-lg p-3 text-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      h.tipo_cambio === 'extension_estancia' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {labelTipoCambio[h.tipo_cambio] || h.tipo_cambio}
                    </span>
                    <span className="text-xs text-gray-400">
                      {h.creado_el ? format(new Date(h.creado_el), "dd MMM yyyy HH:mm", { locale: es }) : ''}
                    </span>
                  </div>
                  <div className="text-gray-700 text-xs">
                    <span className="line-through text-gray-400 mr-2">
                      {formatDateEs(h.fecha_anterior_entrada)} → {formatDateEs(h.fecha_anterior_salida)}
                    </span>
                    <span className="font-medium">
                      {formatDateEs(h.fecha_nueva_entrada)} → {formatDateEs(h.fecha_nueva_salida)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1 text-xs">
                    <span className="text-gray-500">
                      {h.diferencia_noches > 0 ? '+' : ''}{h.diferencia_noches} noches
                    </span>
                    <span className={`font-medium ${h.impacto_financiero > 0 ? 'text-green-600' : h.impacto_financiero < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                      {h.impacto_financiero > 0 ? '+' : ''}{h.impacto_financiero < 0 ? '-' : ''}{formatPrice(Math.abs(h.impacto_financiero))}
                    </span>
                  </div>
                  {h.motivo && (
                    <p className="text-xs text-gray-500 mt-1 italic">"{h.motivo}"</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}