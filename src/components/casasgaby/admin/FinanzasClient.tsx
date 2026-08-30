'use client'

import { useState, useMemo } from 'react'
import { formatPrice } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Wallet, TrendingDown, PiggyBank, Calendar as CalendarIcon, Percent } from 'lucide-react'

export function FinanzasClient({ propiedades, reservas, pagos }: { propiedades: any[], reservas: any[], pagos: any[] }) {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth()) // 0-11

  const kpis = useMemo(() => {
    // 1. Total Proyectado de Reservas
    const totalProyectado = reservas.reduce((acc, r) => acc + (Number(r.monto_total_acordado) || Number(r.costo_total) || 0), 0)
    
    // 2. Dinero Real en Caja (Total cobrado en MXN de pagos_reservas)
    const dineroEnCaja = pagos.reduce((acc, p) => acc + Number(p.monto_equivalente_mxn || 0), 0)
    
    // 3. Cuentas por Cobrar (Saldos pendientes)
    const cuentasPorCobrar = totalProyectado - dineroEnCaja

    // 4. Comisiones
    const totalComisiones = reservas.reduce((acc, r) => acc + Number(r.monto_comision || 0), 0)
    const comisionesPagadas = reservas.reduce((acc, r) => acc + Number(r.comision_pagada || 0), 0)
    const comisionesPendientes = totalComisiones - comisionesPagadas

    return { totalProyectado, dineroEnCaja, cuentasPorCobrar, totalComisiones, comisionesPagadas, comisionesPendientes }
  }, [reservas, pagos])

  // Opportunity Cost Calculations
  const metrics = useMemo(() => {
    let totalPast = 0
    let totalCurrent = 0
    let totalFuture = 0

    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()

    const startOfYear = new Date(currentYear, 0, 1)
    const endOfYear = new Date(currentYear, 11, 31)

    // Helper to calculate lost revenue for a date range
    const getLostRevenue = (startBound: Date, endBound: Date) => {
      let lost = 0
      propiedades.forEach(prop => {
        const dailyRate = prop.precio_por_noche || 0
        if (!dailyRate) return

        let daysInBound = Math.round((endBound.getTime() - startBound.getTime()) / (1000 * 60 * 60 * 24)) + 1
        
        // Find overlapping reservations
        let bookedDays = 0
        reservas.forEach(r => {
          if (r.propiedad_id !== prop.id) return
          const rStart = new Date(r.fecha_entrada + 'T12:00:00')
          const rEnd = new Date(r.fecha_salida + 'T12:00:00')
          
          if (rStart <= endBound && rEnd >= startBound) {
            const overlapStart = rStart > startBound ? rStart : startBound
            const overlapEnd = rEnd < endBound ? rEnd : endBound
            bookedDays += Math.round((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
          }
        })
        
        const freeDays = Math.max(0, daysInBound - bookedDays)
        lost += (freeDays * dailyRate)
      })
      return lost
    }

    // Past months: Jan 1 to end of last month
    if (currentMonth > 0) {
      totalPast = getLostRevenue(startOfYear, new Date(currentYear, currentMonth, 0))
    }
    
    // Current month: Start of this month to end of this month
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1)
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0)
    totalCurrent = getLostRevenue(startOfCurrentMonth, endOfCurrentMonth)

    // Future months: Start of next month to Dec 31
    if (currentMonth < 11) {
      const startOfNextMonth = new Date(currentYear, currentMonth + 1, 1)
      totalFuture = getLostRevenue(startOfNextMonth, endOfYear)
    }

    const totalYearLost = totalPast + totalCurrent + totalFuture

    // Detail table math (Focusing on Current Month Selector)
    const viewStart = new Date(year, month, 1)
    const viewEnd = new Date(year, month + 1, 0)
    const daysInView = viewEnd.getDate()

    const propertyRows = propiedades.map(prop => {
      const dailyRate = prop.precio_por_noche || 0
      
      let bookedDays = 0
      let ingresosCobrados = 0
      let totalProyectadoProp = 0
      let comisionPendiente = 0

      reservas.forEach(r => {
        if (r.propiedad_id !== prop.id) return
        
        // Income stats (Lifetime)
        const t = Number(r.monto_total_acordado) || Number(r.costo_total) || 0
        totalProyectadoProp += t
        
        const propPagos = pagos.filter(p => p.reserva_id === r.id)
        ingresosCobrados += propPagos.reduce((acc, p) => acc + Number(p.monto_equivalente_mxn || 0), 0)

        // Commission
        comisionPendiente += (Number(r.monto_comision || 0) - Number(r.comision_pagada || 0))

        // Occupancy stats (For Selected Month)
        const rStart = new Date(r.fecha_entrada + 'T12:00:00')
        const rEnd = new Date(r.fecha_salida + 'T12:00:00')
        
        if (rStart <= viewEnd && rEnd >= viewStart) {
          const overlapStart = rStart > viewStart ? rStart : viewStart
          const overlapEnd = rEnd < viewEnd ? rEnd : viewEnd
          bookedDays += Math.round((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
        }
      })

      const occupancyPercent = daysInView > 0 ? (bookedDays / daysInView) * 100 : 0
      const freeDays = Math.max(0, daysInView - bookedDays)
      const lostRevenueMonth = freeDays * dailyRate
      const pendingBalance = totalProyectadoProp - ingresosCobrados

      return {
        id: prop.id,
        titulo: prop.titulo,
        bookedDays,
        occupancyPercent,
        ingresosCobrados,
        pendingBalance,
        comisionPendiente,
        lostRevenueMonth
      }
    })

    return { totalPast, totalCurrent, totalFuture, totalYearLost, propertyRows, daysInView }
  }, [propiedades, reservas, pagos, year, month])

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  return (
    <div className="space-y-8">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-teal-100 bg-teal-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-teal-600" />
              Total Proyectado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(kpis.totalProyectado)}</div>
            <p className="text-xs text-gray-500 mt-1">Suma de reservas activas</p>
          </CardContent>
        </Card>
        
        <Card className="border-green-100 bg-green-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-green-600" />
              Dinero Real en Caja (MXN)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{formatPrice(kpis.dineroEnCaja)}</div>
            <p className="text-xs text-gray-500 mt-1">Cobrado y liquidado</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100 bg-amber-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-amber-600" />
              Cuentas por Cobrar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{formatPrice(kpis.cuentasPorCobrar)}</div>
            <p className="text-xs text-gray-500 mt-1">Saldos pendientes de huéspedes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-purple-100 bg-purple-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              Comisiones Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(kpis.totalComisiones)}</div>
            <p className="text-xs text-gray-500 mt-1">Generadas por reservas</p>
          </CardContent>
        </Card>
        
        <Card className="border-indigo-100 bg-indigo-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-indigo-600" />
              Comisiones Pagadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700">{formatPrice(kpis.comisionesPagadas)}</div>
            <p className="text-xs text-gray-500 mt-1">Liquidadas a gestores</p>
          </CardContent>
        </Card>

        <Card className="border-pink-100 bg-pink-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-pink-600" />
              Comisiones Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-700">{formatPrice(kpis.comisionesPendientes)}</div>
            <p className="text-xs text-gray-500 mt-1">Por liquidar a gestores</p>
          </CardContent>
        </Card>
      </div>

      {/* Dinero No Generado (Costo de Oportunidad) */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-red-500" />
          Dinero No Generado (Costo de Oportunidad {new Date().getFullYear()})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-gray-200">
            <CardContent className="pt-4">
              <div className="text-sm text-gray-500 mb-1">Meses Pasados</div>
              <div className="text-xl font-bold text-gray-800">{formatPrice(metrics.totalPast)}</div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="pt-4">
              <div className="text-sm text-red-600 font-medium mb-1">Mes Actual</div>
              <div className="text-xl font-bold text-red-700">{formatPrice(metrics.totalCurrent)}</div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="pt-4">
              <div className="text-sm text-gray-500 mb-1">Meses Siguientes</div>
              <div className="text-xl font-bold text-gray-800">{formatPrice(metrics.totalFuture)}</div>
            </CardContent>
          </Card>
          <Card className="border-gray-300 bg-gray-50">
            <CardContent className="pt-4">
              <div className="text-sm text-gray-600 font-bold mb-1">Total del Año</div>
              <div className="text-xl font-black text-gray-900">{formatPrice(metrics.totalYearLost)}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabla de Propiedades */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-gray-900">Desempeño por Propiedad</h3>
          <div className="flex gap-2">
            <select 
              value={month} 
              onChange={e => setMonth(Number(e.target.value))}
              className="h-9 rounded-md border border-gray-300 px-3 text-sm"
            >
              {months.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
            <select 
              value={year} 
              onChange={e => setYear(Number(e.target.value))}
              className="h-9 rounded-md border border-gray-300 px-3 text-sm"
            >
              <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
              <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
              <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium">Propiedad</th>
                <th className="px-4 py-3 font-medium text-center">Días Ocupados ({metrics.daysInView})</th>
                <th className="px-4 py-3 font-medium text-center">Ocupación %</th>
                <th className="px-4 py-3 font-medium text-right">Ingresos Cobrados</th>
                <th className="px-4 py-3 font-medium text-right">Saldos por Cobrar</th>
                <th className="px-4 py-3 font-medium text-right">Comisión Pendiente</th>
                <th className="px-4 py-3 font-medium text-right">Pérdida Días Libres</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {metrics.propertyRows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.titulo}</td>
                  <td className="px-4 py-3 text-center">{row.bookedDays} / {metrics.daysInView}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      row.occupancyPercent >= 70 ? 'bg-green-100 text-green-800' :
                      row.occupancyPercent >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {row.occupancyPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-teal-600">{formatPrice(row.ingresosCobrados)}</td>
                  <td className="px-4 py-3 text-right font-medium text-amber-600">{formatPrice(row.pendingBalance)}</td>
                  <td className="px-4 py-3 text-right font-medium text-purple-600">{formatPrice(row.comisionPendiente)}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{formatPrice(row.lostRevenueMonth)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
