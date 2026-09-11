import os

filepath = 'src/components/casasgaby/admin/FinanzasCard.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# I will ensure the conditional logic is 100% robust.
# The user wants to make sure subtotalExtras is calculated correctly and the block renders unconditionally if subtotalExtras > 0.
# My code: {subtotalExtras > 0 && ( ... )}

# Let's completely rewrite FinanzasCard.tsx to be extremely safe and exactly as the user implies.
new_content = """'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatPrice } from '@/lib/utils'

export const calcularFinanzasReserva = (r: any) => {
  const totalAcordado = Number(r.monto_total_acordado || r.costo_total || r.tarifa_base || 0)
  const sumaTransacciones = r.transacciones?.filter((t: any) => t.tipo === 'ingreso').reduce((acc: any, t: any) => acc + Number(t.monto_acreditado ?? t.monto_mxn ?? t.monto ?? 0), 0) || 0
  const totalPagado = sumaTransacciones > 0 ? sumaTransacciones : Number(r.monto_apartado || 0)
  const saldoPendiente = Math.max(0, totalAcordado - totalPagado)
  
  const tarifaBase = Number(r.tarifa_base || 0)
  const subtotalExtras = Math.max(0, totalAcordado - tarifaBase)

  const extrasSolicitud = Array.isArray(r.servicios_extra) 
    ? [...r.servicios_extra]
    : (Array.isArray(r.solicitudes?.servicios_extra) ? [...r.solicitudes.servicios_extra] : [])

  const extrasAjustes = Array.isArray(r.ajustes_reserva)
    ? r.ajustes_reserva.map((a: any) => ({
        nombre: a.concepto || a.descripcion || 'Ajuste extra',
        qty: 1,
        monto: Number(a.monto || 0),
        tipo: a.tipo
      }))
    : []

  const montoAjustes = extrasAjustes.reduce((acc: number, a: any) => acc + (a.tipo === 'cargo' ? a.monto : -a.monto), 0)
  
  if (subtotalExtras > 0 && extrasSolicitud.length === 0 && Math.abs(subtotalExtras - montoAjustes) > 1) {
     extrasSolicitud.push({
         nombre: 'Paquete de servicios adicionales contratados',
         qty: 1,
         monto: subtotalExtras - montoAjustes
     })
  }

  return { totalAcordado, totalPagado, saldoPendiente, tarifaBase, subtotalExtras, extrasSolicitud, extrasAjustes }
}

export function FinanzasCard({ reserva: r, onEditTarifa }: { reserva: any, onEditTarifa?: (id: string, current: number) => void }) {
  const [mostrarExtras, setMostrarExtras] = useState(false)
  const { totalAcordado, totalPagado, saldoPendiente, tarifaBase, subtotalExtras, extrasSolicitud, extrasAjustes } = calcularFinanzasReserva(r)

  const totalItemsExtras = extrasSolicitud.length + extrasAjustes.length

  return (
    <>
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-600 flex items-center gap-1.5">
          Hospedaje base:
          {onEditTarifa && (
            <button onClick={() => onEditTarifa(r.id, tarifaBase)} className="text-gray-400 hover:text-teal-600">✏️</button>
          )}
        </span>
        <span className="font-medium text-gray-800">{formatPrice(tarifaBase)}</span>
      </div>
      
      {subtotalExtras > 0 && (
        <div className="space-y-1 mb-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Servicios extras:</span>
            <span className="font-semibold text-gray-800">
              {formatPrice(subtotalExtras)}
            </span>
          </div>
          <button 
            type="button"
            onClick={() => setMostrarExtras(!mostrarExtras)}
            className="text-xs text-teal-600 hover:underline flex items-center gap-1"
          >
            {mostrarExtras ? '▾ Ocultar desglose' : `▸ Ver desglose extras (${totalItemsExtras})`}
          </button>
          
          {mostrarExtras && (
            <div className="bg-gray-50 rounded-lg p-2 text-xs space-y-1.5 border border-gray-100 mt-1">
              {extrasSolicitud.map((e: any, i: number) => (
                <div key={`sol-${i}`} className="flex justify-between text-gray-600">
                  <span>{e.qty || 1}x {e.nombre || e.servicio}</span>
                  <span className="font-medium text-gray-800">{formatPrice(Number(e.monto || e.precio || 0))}</span>
                </div>
              ))}
              {extrasAjustes.filter((a: any) => a.tipo === 'cargo').map((a: any, i: number) => (
                <div key={`aj-c-${i}`} className="flex justify-between text-gray-600">
                  <span>+ {a.nombre}</span>
                  <span className="font-medium text-gray-800">{formatPrice(a.monto)}</span>
                </div>
              ))}
              {extrasAjustes.filter((a: any) => a.tipo === 'descuento').map((a: any, i: number) => (
                <div key={`aj-d-${i}`} className="flex justify-between text-gray-600">
                  <span>- {a.nombre}</span>
                  <span className="font-medium text-red-500">-{formatPrice(a.monto)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between border-t border-gray-100 pt-1.5 mt-1.5">
        <span className="text-gray-900 font-medium">Total Acordado:</span>
        <span className="font-bold text-gray-900">{formatPrice(totalAcordado)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Pagado Acumulado:</span>
        <span className="font-semibold text-teal-600">{formatPrice(totalPagado)}</span>
      </div>
      
      {r.transacciones && r.transacciones.filter((t: any) => t.tipo === 'ingreso').length > 0 && (
        <details className="mt-2 text-xs group">
          <summary className="font-semibold text-indigo-600 cursor-pointer pt-2 border-t border-indigo-50 list-none flex items-center gap-1">
            <span className="group-open:rotate-90 transition-transform">▸</span> Ver historial de pagos ({r.transacciones.filter((t: any) => t.tipo === 'ingreso').length})
          </summary>
          <div className="pt-2 space-y-1.5">
            {r.transacciones.filter((t: any) => t.tipo === 'ingreso').map((t: any, idx: number) => (
              <div key={idx} className="flex justify-between border-b border-gray-50 pb-1">
                <div>
                  <div className="font-medium text-gray-700">{formatPrice(t.monto_mxn || t.monto)}</div>
                  <div className="text-[10px] text-gray-400 capitalize">{t.metodo_pago ? t.metodo_pago.replace('_', ' ') : 'Desconocido'}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500">{t.concepto || 'Abono'}</div>
                  <div className="text-[10px] text-gray-400">{(t.created_at || t.fecha) ? format(parseISO(t.created_at || t.fecha || new Date().toISOString()), 'dd/MM/yy HH:mm', { locale: es }) : 'Reciente'}</div>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      <div className="flex justify-between pt-1 border-t border-gray-100 mt-1">
        <span className="text-gray-900 font-bold">Saldo Pendiente:</span>
        <span className={`font-bold ${saldoPendiente <= 0.5 ? 'text-green-600' : 'text-red-600'}`}>
          {saldoPendiente <= 0.5 ? 'Liquidado' : formatPrice(saldoPendiente)}
        </span>
      </div>
    </>
  )
}
"""

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print("Rewrote FinanzasCard.tsx")
