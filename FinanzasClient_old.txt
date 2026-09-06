'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Wallet, TrendingDown, PiggyBank, Calendar as CalendarIcon, Percent, BadgeDollarSign, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registrarPagoComisionTabla, aplicarSaldoAFavorComision } from '@/app/casasgaby/admin/actions'
import { formatPrice, formatDateEs } from '@/lib/utils'

export function FinanzasClient({ propiedades, reservas, pagos, comisiones }: { propiedades: any[], reservas: any[], pagos: any[], comisiones?: any[] }) {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth()) // 0-11
  
  
const formatLargePrice = (price: number) => {
  const formatted = formatPrice(price);
  return formatted.replace('\xa0', ' ').replace('.00', '');
}

const [activeTab, setActiveTab] = useState<'kpis'|'comisiones'>('kpis')
  const [modalComision, setModalComision] = useState<{isOpen: boolean, id: string, saldo: number, pago: string}>({
    isOpen: false, id: '', saldo: 0, pago: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  
  const handlePagarComision = async () => {
    try {
      setIsSubmitting(true)
      await registrarPagoComisionTabla(modalComision.id, Number(modalComision.pago))
      setModalComision({ isOpen: false, id: '', saldo: 0, pago: '' })
    } catch (e) {
      alert("Error al pagar comisión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAplicarSaldoAFavor = async () => {
    try {
      setIsSubmitting(true)
      await aplicarSaldoAFavorComision(modalComision.id, Number(modalComision.pago))
      setModalComision({ isOpen: false, id: '', saldo: 0, pago: '' })
    } catch (e) {
      alert("Error al aplicar saldo a favor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const saldoAFavor = comisiones?.filter(c => c.estado_pago === 'cancelada_con_saldo_a_favor')
    .reduce((acc, c) => acc + Number(c.monto_pagado), 0) || 0;
  
  const totalComisionPendiente = comisiones?.filter(c => c.estado_pago === 'pendiente' || c.estado_pago === 'parcial')
    .reduce((acc, c) => acc + (Number(c.monto_comision) - Number(c.monto_pagado)), 0) || 0;

  const totalNetoATransferir = Math.max(0, totalComisionPendiente - saldoAFavor);


  const kpis = useMemo(() => {
    // 1. Total Proyectado de Reservas
    const totalProyectado = reservas.reduce((acc, r) => acc + (Number(r.monto_total_acordado) || Number(r.costo_total) || 0), 0)
    
    // 2. Dinero Real en Caja (Total cobrado en MXN de transacciones)
    const dineroEnCaja = reservas.reduce((acc, r) => {
        const propPagos = pagos.filter(p => p.reserva_id === r.id)
        return acc + propPagos.reduce((sum, p) => sum + (Number(p.monto_mxn) || Number(p.monto) || 0), 0)
      }, 0)
    
    // 3. Saldo por Cobrar (Saldos pendientes)
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

    let freeNightsCurrent = 0
    let freeNightsFuture = 0

    // Helper to calculate lost revenue and free nights for a date range
    const getLostRevenue = (startBound: Date, endBound: Date) => {
      let lost = 0
      let totalFreeDays = 0
      propiedades.filter(p => p.activa !== false).forEach(prop => {
        const dailyRate = prop.precio_por_noche || 0
        if (!dailyRate) return

        let daysInBound = Math.round((endBound.getTime() - startBound.getTime()) / (1000 * 60 * 60 * 24)) + 1
        
        // Find overlapping reservations
        let bookedDays = 0
        reservas.forEach(r => {
          if (r.propiedad_id !== prop.id) return
          const rStart = new Date(r.fecha_entrada + 'T12:00:00')
          const rEnd = new Date(r.fecha_salida + 'T12:00:00')
          
          if (rStart <= endBound && rEnd > startBound) {
              const overlapStart = rStart > startBound ? rStart : startBound
              const rEndNight = new Date(rEnd)
              rEndNight.setDate(rEndNight.getDate() - 1)
              const overlapEnd = rEndNight < endBound ? rEndNight : endBound
              
              if (overlapEnd >= overlapStart) {
                bookedDays += Math.round((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
              }
            }
        })
        
        const freeDays = Math.max(0, daysInBound - bookedDays)
        lost += (freeDays * dailyRate)
        totalFreeDays += freeDays
      })
      return { lost, freeDays: totalFreeDays }
    }

    // Past months: Jan 1 to end of last month
    if (currentMonth > 0) {
      totalPast = getLostRevenue(startOfYear, new Date(currentYear, currentMonth, 0)).lost
    }
    
    // Current month: Start of this month to end of this month
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1)
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0)
    totalCurrent = getLostRevenue(startOfCurrentMonth, endOfCurrentMonth).lost
    
    // For free nights specifically from TODAY to end of current month
    // Set 'today' to midnight to be consistent with date bounds
    const todayMidnight = new Date(currentYear, currentMonth, today.getDate())
    if (todayMidnight <= endOfCurrentMonth) {
      freeNightsCurrent = getLostRevenue(todayMidnight, endOfCurrentMonth).freeDays
    }

    // Future months: Start of next month to Dec 31
    if (currentMonth < 11) {
      const startOfNextMonth = new Date(currentYear, currentMonth + 1, 1)
      const futureData = getLostRevenue(startOfNextMonth, endOfYear)
      totalFuture = futureData.lost
      freeNightsFuture = futureData.freeDays
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
        ingresosCobrados += propPagos.reduce((acc, p) => acc + (Number(p.monto_mxn) || Number(p.monto) || 0), 0)

        // Commission
        comisionPendiente += (Number(r.monto_comision || 0) - Number(r.comision_pagada || 0))

        // Occupancy stats (For Selected Month)
        const rStart = new Date(r.fecha_entrada + 'T12:00:00')
        const rEnd = new Date(r.fecha_salida + 'T12:00:00')
        
        if (rStart <= viewEnd && rEnd > viewStart) {
            const overlapStart = rStart > viewStart ? rStart : viewStart
            const rEndNight = new Date(rEnd)
            rEndNight.setDate(rEndNight.getDate() - 1)
            const overlapEnd = rEndNight < viewEnd ? rEndNight : viewEnd
            
            if (overlapEnd >= overlapStart) {
              bookedDays += Math.round((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
            }
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

    return { totalPast, totalCurrent, totalFuture, totalYearLost, propertyRows, daysInView, freeNightsCurrent, freeNightsFuture }
  }, [propiedades, reservas, pagos, year, month])

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('kpis')}
          className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'kpis' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Métricas y Rendimiento
        </button>
        <button
          onClick={() => setActiveTab('comisiones')}
          className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'comisiones' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Liquidación de Comisiones
        </button>
      </div>

      {activeTab === 'kpis' && (
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
              Dinero Cobrado (MXN)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{formatPrice(kpis.dineroEnCaja)}</div>
            <p className="text-xs text-gray-500 mt-1">Anticipos y abonos recibidos</p>
          </CardContent>
        </Card>

        <Card className="border-amber-100 bg-amber-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-amber-600" />
              Saldo por Cobrar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{formatPrice(kpis.cuentasPorCobrar)}</div>
            <p className="text-xs text-gray-500 mt-1">Pendiente por liquidar antes del check-in</p>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <Card className="border-gray-200">
            <CardContent className="p-2.5 sm:p-3.5 flex flex-col justify-center min-w-0">
              <div className="text-sm text-gray-500 mb-1">Meses Pasados</div>
              <div className="text-base sm:text-lg tracking-tight font-bold text-gray-800 truncate">{formatLargePrice(metrics.totalPast)}</div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-2.5 sm:p-3.5 flex flex-col justify-center min-w-0">
              <div className="text-sm text-red-600 font-medium mb-1">Mes Actual</div>
              <div className="text-base sm:text-lg tracking-tight font-bold text-red-700 truncate">{formatLargePrice(metrics.totalCurrent)}</div>
                <p className="text-[10px] sm:text-xs text-red-500/80 font-medium mt-1 truncate">{metrics.freeNightsCurrent} noches libres restantes</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-2.5 sm:p-3.5 flex flex-col justify-center min-w-0">
              <div className="text-sm text-gray-500 mb-1">Meses Siguientes</div>
              <div className="text-base sm:text-lg tracking-tight font-bold text-gray-800 truncate">{formatLargePrice(metrics.totalFuture)}</div>
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-1 truncate">{metrics.freeNightsFuture} noches por reservar</p>
            </CardContent>
          </Card>
          <Card className="border-gray-300 bg-gray-50">
            <CardContent className="p-2.5 sm:p-3.5 flex flex-col justify-center min-w-0">
                <div className="text-xs sm:text-sm text-gray-600 font-bold mb-1 truncate">Total del Año</div>
                <div className="text-base sm:text-lg tracking-tight font-black text-gray-900 truncate">{formatLargePrice(metrics.totalYearLost)}</div>
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
      )}

      
      {activeTab === 'comisiones' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-purple-100 bg-purple-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <BadgeDollarSign className="w-4 h-4 text-purple-600" />
                  Comisión Pendiente (Reservas Activas)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{formatPrice(totalComisionPendiente)}</div>
              </CardContent>
            </Card>

            <Card className="border-green-100 bg-green-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Saldo a Favor (Cancelaciones)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">-{formatPrice(saldoAFavor)}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 bg-blue-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-blue-600" />
                  Total Neto a Transferir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">{formatPrice(totalNetoATransferir)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Propiedad / Cliente</th>
                  <th className="px-4 py-3 text-right">Estancia</th>
                  <th className="px-4 py-3 text-right">Comisión</th>
                  <th className="px-4 py-3 text-right">Pagado</th>
                  <th className="px-4 py-3 text-right">Saldo</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="px-4 py-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comisiones?.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-6 text-gray-400">No hay comisiones registradas</td></tr>
                )}
                {comisiones?.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.fecha_reserva ? formatDateEs(c.fecha_reserva) : ''}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{c.propiedades?.titulo}</div>
                      <div className="text-xs text-gray-500">{c.reservas?.nombre_cliente}</div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatPrice(c.monto_estancia)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-medium text-purple-700">{formatPrice(c.monto_comision)}</div>
                      <div className="text-[10px] text-gray-400">{c.porcentaje_comision}%</div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatPrice(c.monto_pagado)}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">{formatPrice(c.monto_comision - c.monto_pagado)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.estado_pago === 'liquidado' ? 'bg-green-100 text-green-700' :
                        c.estado_pago === 'cancelada_con_saldo_a_favor' ? 'bg-indigo-100 text-indigo-700' :
                        c.estado_pago === 'cancelada' ? 'bg-red-100 text-red-700' :
                        c.estado_pago === 'parcial' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {c.estado_pago}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.estado_pago !== 'liquidado' && c.estado_pago !== 'cancelada' && c.estado_pago !== 'cancelada_con_saldo_a_favor' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                          onClick={() => setModalComision({ 
                            isOpen: true, 
                            id: c.id, 
                            saldo: c.monto_comision - c.monto_pagado, 
                            pago: String(c.monto_comision - c.monto_pagado) 
                          })}
                        >
                          Pagar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}

      {/* Modal Registrar Pago de Comisión */}
      <Dialog open={modalComision.isOpen} onOpenChange={(val) => setModalComision(p => ({...p, isOpen: val}))}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Registrar Pago a Gestor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Saldo Pendiente</label>
              <div className="text-lg font-bold text-gray-900">{formatPrice(modalComision.saldo)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Monto a Abonar</label>
              <Input 
                type="number"
                value={modalComision.pago}
                onChange={e => setModalComision(p => ({...p, pago: e.target.value}))}
                max={modalComision.saldo}
                min="0.01"
                step="any"
                onKeyDown={e => e.key === '-' && e.preventDefault()}
              />
            </div>
            
            <div className="flex flex-col gap-2 pt-2">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
                onClick={handlePagarComision}
                isLoading={isSubmitting}
                disabled={!modalComision.pago || Number(modalComision.pago) <= 0 || Number(modalComision.pago) > modalComision.saldo}
              >
                Confirmar Transferencia
              </Button>
              {saldoAFavor > 0 && (
                <Button 
                  variant="outline"
                  className="w-full border-green-600 text-green-700 hover:bg-green-50" 
                  onClick={handleAplicarSaldoAFavor}
                  isLoading={isSubmitting}
                  disabled={!modalComision.pago || Number(modalComision.pago) <= 0 || Number(modalComision.pago) > modalComision.saldo || Number(modalComision.pago) > saldoAFavor}
                >
                  Aplicar Saldo a Favor ({formatPrice(saldoAFavor)} Disp.)
                </Button>
              )}
            </div>
          </div>
        </DialogContent>

      </Dialog>
    </div>
  )
}
