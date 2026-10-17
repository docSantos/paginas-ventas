'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Wallet, TrendingDown, PiggyBank, Calendar as CalendarIcon, Percent, BadgeDollarSign, CheckCircle, Info } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { pagarComisionInHouse, aplicarSaldoAFavorComision, pagarComisionesLoteReservas } from '@/app/casasgaby/admin/actions'
import { formatPrice, formatDateEs } from '@/lib/utils'
import { calcularFinanzasReserva } from './FinanzasCard'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function FinanzasClient({ propiedades, reservas, pagos, comisiones }: { propiedades: any[], reservas: any[], pagos: any[], comisiones?: any[] }) {

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth()) // 0-11
  
  
const formatLargePrice = (price: number) => {
  const formatted = formatPrice(price);
  return formatted.replace('\xa0', ' ').replace('.00', '');
}

  const comisionesUnificadas = useMemo(() => {
    // Tomamos las reservas del periodo que tienen comision > 0 y no estan canceladas sin costo
    const reservasGeneradoras = (reservas || []).filter(r =>
      !(r.estado === 'Cancelada' && !Number(r.monto_comision)) &&
      Number(r.monto_comision || 0) > 0
    );

    return reservasGeneradoras.map(r => {
      const comGuardada = (comisiones || []).find(c => c.reserva_id === r.id);
      const prop = (propiedades || []).find(p => p.id === r.propiedad_id);

      // Tomar siempre el valor más reciente de lo pagado (priorizando la reserva actualizada tras la acción)
      const montoComision = Number(r.monto_comision || comGuardada?.monto_comision || 0);
      const montoPagado = Math.max(Number(r.comision_pagada || 0), Number(comGuardada?.monto_pagado || 0));
      const saldo = Math.max(0, montoComision - montoPagado);

      const costoEstancia = Number(r.costo_total || r.monto_total_acordado || comGuardada?.monto_estancia || 0);
      const porcentaje = costoEstancia > 0 ? Math.round((montoComision / costoEstancia) * 100) : null;

      return {
        id: r.id,
        reserva_id: r.id,
        fecha_reserva: r.solicitada_en || r.created_at || r.fecha_entrada,
        propiedad_titulo: prop?.titulo || comGuardada?.propiedades?.titulo || 'Propiedad',
        nombre_cliente: r.nombre_cliente || comGuardada?.reservas?.nombre_cliente || 'Sin nombre',
        monto_estancia: costoEstancia,
        monto_comision: montoComision,
        monto_pagado: montoPagado,
        saldo: saldo,
        estado_pago: saldo <= 0 ? 'pagado' : (montoPagado > 0 ? 'parcial' : 'pendiente'),
        rawReserva: r
      };
    }).sort((a, b) => new Date(b.fecha_reserva).getTime() - new Date(a.fecha_reserva).getTime());
  }, [reservas, comisiones, propiedades]);

  const [selectedComisiones, setSelectedComisiones] = useState<string[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'ledger'|'kpis'|'comisiones'>(() => {
    const tab = searchParams.get('tab')
    return (tab === 'kpis' || tab === 'comisiones') ? tab : 'ledger'
  })

  // Wrapper function to update state and URL
  const handleTabChange = (tab: 'ledger'|'kpis'|'comisiones') => {
    setActiveTab(tab)
    router.replace(`?tab=${tab}`, { scroll: false })
  }
  const [ledgerSearch, setLedgerSearch] = useState('')
  const [ledgerFilterMethod, setLedgerFilterMethod] = useState('Todos')
  const [ledgerFilterDate, setLedgerFilterDate] = useState('Todo')
  const [modalComision, setModalComision] = useState<{isOpen: boolean, ids: string[], saldo: number, pago: string}>({
    isOpen: false, ids: [], saldo: 0, pago: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  
  const handlePagarComision = async () => {
    try {
      setIsSubmitting(true)
      let res;
      if (modalComision.ids.length === 1) {
        res = await pagarComisionInHouse(modalComision.ids[0], Number(modalComision.pago))
      } else {
        res = await pagarComisionesLoteReservas(modalComision.ids)
      }
      
      if (res && res.success === false) {
        alert(res.error || "Error al pagar comisión")
      } else {
        setModalComision({ isOpen: false, ids: [], saldo: 0, pago: '' })
        setSelectedComisiones([])
      }
    } catch (e: any) {
      alert(e.message || "Error desconocido al pagar")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAplicarSaldoAFavor = async () => {
    try {
      setIsSubmitting(true)
      await aplicarSaldoAFavorComision(modalComision.ids[0], Number(modalComision.pago))
      setModalComision({ isOpen: false, ids: [], saldo: 0, pago: '' })
    } catch (e) {
      alert("Error al aplicar saldo a favor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const {
    totalGenerado,
    totalLiquidado,
    saldoAFavor,
    pendienteBruto,
    totalNetoATransferir
  } = useMemo(() => {
    const reservasSafe = reservas || [];
    
    // 1. totalGenerado: Suma de monto_comision de reservas del periodo/año (excluyendo canceladas sin costo)
    const reservasGeneradoras = reservasSafe.filter(r => !(r.estado === 'Cancelada' && !Number(r.monto_comision)));
    const generado = reservasGeneradoras.reduce((acc, r) => acc + Number(r.monto_comision || 0), 0);
    
    // 2. totalLiquidado: Suma de comision_pagada (total abonado a la fecha)
    const liquidado = reservasSafe.reduce((acc, r) => acc + Number(r.comision_pagada || 0), 0);

    // 3. saldoAFavor: Crédito acumulado por reservas canceladas que ya tenían comisión pagada
    const sFavor = reservasSafe.filter(r => r.estado_comision === 'cancelada_con_saldo_a_favor')
      .reduce((acc, r) => acc + Number(r.comision_pagada || 0), 0);

    // 4. pendienteBruto: Math.max(0, totalGenerado - totalLiquidado)
    const pendienteB = Math.max(0, generado - liquidado);

    // 5. totalNetoATransferir: Math.max(0, pendienteBruto - saldoAFavor)
    const netoTransferir = Math.max(0, pendienteB - sFavor);

    return {
      totalGenerado: generado,
      totalLiquidado: liquidado,
      saldoAFavor: sFavor,
      pendienteBruto: pendienteB,
      totalNetoATransferir: netoTransferir
    };
  }, [reservas]);


    const kpis = useMemo(() => {
      // 1. Total Proyectado de Reservas (Solo Confirmadas y Activas)
      const reservasVigentes = reservas.filter(r => ['Confirmada', 'Activa'].includes(r.estado) && !r.check_out_real_at)
      
      const totalProyectado = reservasVigentes.reduce((acc, r) => acc + (Number(r.monto_total_acordado) || Number(r.costo_total) || 0), 0)
      
      // 2. Dinero Real en Caja (Solo histórico neto, o solo de vigentes? La métrica original sumaba 'reservas'. Ahora sumamos todos los pagos globales para coincidir con Histórico, o solo vigentes? El prompt dice: "Total Proyectado desfasado... si una reserva es Completada no debe computar como proyección". Para Dinero Cobrado, sumamos TODOS los pagos para que refleje la realidad en caja de ese grupo, o lo calculamos sobre la tabla transacciones. Mantendremos el cálculo sobre las reservasVigentes si es "Dinero Cobrado de reservas activas", pero para que el histórico no se caiga, lo haremos sobre todas las reservas en caso de que Dinero Cobrado sea global. O mejor, sobre 'pagos' directo).
      
      let dineroIngresadoBruto = 0;
      let dineroReembolsado = 0;
      
      // Calculemos los pagos de forma global y precisa.
      pagos.forEach(p => {
        const monto = Number(p.monto_mxn) || Number(p.monto) || 0;
        const tipo = String(p.tipo || '').toLowerCase().trim();
        const cat = String(p.categoria || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
        
        if (tipo === 'egreso') {
          // Filtrar unicamente las transacciones que sean devoluciones reales al huésped
          if (cat === 'reembolso' || cat === 'devolucion' || cat === 'cancelacion') {
            dineroReembolsado += monto;
          }
          // El pago de comisiones se ignora aquí; pertenece a otro flujo.
        } else {
          dineroIngresadoBruto += monto;
        }
      });
      const dineroEnCaja = dineroIngresadoBruto - dineroReembolsado;
      
      // 3. Saldo por Cobrar (Saldos pendientes reales)
      const cuentasPorCobrar = reservasVigentes.reduce((acc, r) => {
        const transaccionesReserva = pagos.filter(p => p.reserva_id === r.id);
        const reservaConTransacciones = { ...r, transacciones: transaccionesReserva };
        const { saldoPendiente } = calcularFinanzasReserva(reservaConTransacciones);
        return acc + saldoPendiente;
      }, 0);
  
      // 4. Comisiones - Manteniendo el origen de reservas vigentes
      const totalComisiones = reservasVigentes.reduce((acc, r) => acc + Number(r.monto_comision || 0), 0);
      const comisionesPagadas = reservasVigentes.reduce((acc, r) => acc + Number(r.comision_pagada || 0), 0);
      const comisionesPendientes = Math.max(0, totalComisiones - comisionesPagadas);
  
      return { totalProyectado, dineroEnCaja, dineroIngresadoBruto, dineroReembolsado, cuentasPorCobrar, totalComisiones, comisionesPagadas, comisionesPendientes }
    }, [reservas, pagos, comisiones])

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
        ingresosCobrados += propPagos.reduce((acc, p) => acc + ((p.tipo === 'egreso' || p.categoria === 'reembolso' ? -1 : 1) * (Number(p.monto_mxn) || Number(p.monto) || 0)), 0)

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


  // === LEDGER LOGIC (Flujo de Caja Real) ===
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // 1. Total Histórico Neto (Entradas reales - Salidas reales registradas en transacciones)
  const totalHistorico = pagos.reduce((acc, p) => {
    const tipo = String(p.tipo || '').toLowerCase().trim();
    const cat = String(p.categoria || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    const esEgreso = tipo === 'egreso' || cat === 'reembolso';
    const monto = Number(p.monto_mxn || p.monto || 0);
    return acc + (esEgreso ? -monto : monto);
  }, 0);

  // 2. Ingresos Brutos Cobrados en el Mes Actual (Solo entradas de dinero)
  const ingresosBrutosMesActual = pagos.filter(p => {
    const d = new Date(p.created_at);
    const tipo = String(p.tipo || '').toLowerCase().trim();
    return tipo !== 'egreso' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).reduce((acc, p) => acc + Number(p.monto_mxn || p.monto || 0), 0);

  // 3. Egresos en el Mes Actual (Comisiones y reembolsos pagados desde caja)
  const egresosMesActual = pagos.filter(p => {
    const d = new Date(p.created_at);
    const tipo = String(p.tipo || '').toLowerCase().trim();
    const cat = String(p.categoria || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    const esEgreso = tipo === 'egreso' || cat === 'reembolso';
    return esEgreso && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).reduce((acc, p) => acc + Number(p.monto_mxn || p.monto || 0), 0);

  // 4. Flujo Neto del Mes Actual
  const ingresosMesActual = ingresosBrutosMesActual - egresosMesActual;

  // 5. Divisas USD acumuladas
  const usdAcumulado = pagos.filter(p => p.moneda === 'USD').reduce((acc, p) => {
    const esEgreso = p.tipo === 'egreso' || p.categoria === 'reembolso';
    return acc + ((esEgreso ? -1 : 1) * Number(p.monto || 0));
  }, 0);
  
const pagosEfectivo = pagos.filter(p => {
    const m = (p.metodo_pago || '').toLowerCase()
    return m.includes('efectivo')
  }).reduce((acc, p) => acc + ((p.tipo === 'egreso' || p.categoria === 'reembolso' ? -1 : 1) * Number(p.monto_mxn || p.monto || 0)), 0)

  const pagosTransf = pagos.filter(p => {
    const m = (p.metodo_pago || '').toLowerCase()
    return m.includes('transf')
  }).reduce((acc, p) => acc + ((p.tipo === 'egreso' || p.categoria === 'reembolso' ? -1 : 1) * Number(p.monto_mxn || p.monto || 0)), 0)
  
  const filteredPagos = pagos.filter(p => {
    const matchSearch = p.reservas?.nombre_cliente?.toLowerCase().includes(ledgerSearch.toLowerCase()) || 
                        p.concepto?.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
                        p.propiedades?.titulo?.toLowerCase().includes(ledgerSearch.toLowerCase())
    
    let matchMethod = true
    if (ledgerFilterMethod !== 'Todos') {
      matchMethod = p.metodo_pago === ledgerFilterMethod || (ledgerFilterMethod === 'Transferencias' && p.metodo_pago?.includes('Transferencia'))
    }

    let matchDate = true
    const d = new Date(p.created_at)
    if (ledgerFilterDate === 'Este mes') {
      matchDate = d.getMonth() === currentMonth && d.getFullYear() === currentYear
    } else if (ledgerFilterDate === 'Mes anterior') {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
      matchDate = d.getMonth() === prevMonth && d.getFullYear() === prevYear
    }

    return matchSearch && matchMethod && matchDate
  })
  // === END LEDGER LOGIC ===

  
      return (
    <div className="space-y-6">
      <div className="flex flex-wrap border-b border-gray-200 gap-y-2">
          <button
            onClick={() => handleTabChange('ledger')}
            className={`py-3 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'ledger' ? 'border-teal-600 text-teal-700 bg-teal-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Libro Mayor
          </button>
          <button
            onClick={() => handleTabChange('kpis')}
            className={`py-3 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'kpis' ? 'border-teal-600 text-teal-700 bg-teal-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Métricas y Rendimiento
          </button>
          <button
            onClick={() => handleTabChange('comisiones')}
            className={`py-3 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'comisiones' ? 'border-teal-600 text-teal-700 bg-teal-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Liquidación de Comisiones
          </button>
        </div>

      
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            {/* KPIs Ledger */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-indigo-100 bg-indigo-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2">
                    <BadgeDollarSign className="w-4 h-4 text-indigo-600" />
                    Total Histórico
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-visible">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-gray-900 whitespace-nowrap overflow-visible">{formatLargePrice(totalHistorico)}</div>
                </CardContent>
              </Card>
              <Card className="border-emerald-100 bg-emerald-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-emerald-600" />
                    Ingresos Mes Actual
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-visible">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-gray-900 whitespace-nowrap overflow-visible">{formatLargePrice(ingresosBrutosMesActual)}</div>
                  <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">Neto: <span className="font-medium text-emerald-700">{formatLargePrice(ingresosMesActual)}</span></div>
                </CardContent>
              </Card>
<Card className="border-amber-100 bg-amber-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    Divisas Acumuladas
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-visible">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-gray-900 whitespace-nowrap overflow-visible">
                    {usdAcumulado < 0 ? `-$${Math.abs(usdAcumulado).toLocaleString('es-MX')}` : `$${usdAcumulado.toLocaleString('es-MX')}`} USD
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-100 bg-slate-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-slate-600" />
                    Efectivo vs Transf.
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 pt-1">
                  <div className="text-sm flex items-center justify-between gap-2">
                    <span className="text-gray-500">Efectivo:</span>
                    <span className={`font-semibold ${pagosEfectivo < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {pagosEfectivo < 0 ? `-$${Math.abs(pagosEfectivo).toLocaleString('es-MX')}` : `$${pagosEfectivo.toLocaleString('es-MX')}`}
                    </span>
                  </div>
                  <div className="text-sm flex items-center justify-between gap-2">
                    <span className="text-gray-500">Transf:</span>
                    <span className={`font-semibold ${pagosTransf < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {pagosTransf < 0 ? `-$${Math.abs(pagosTransf).toLocaleString('es-MX')}` : `$${pagosTransf.toLocaleString('es-MX')}`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4">
              <Input 
                placeholder="Buscar por huésped, referencia..." 
                value={ledgerSearch} 
                onChange={e => setLedgerSearch(e.target.value)}
                className="md:w-1/3"
              />
              <select 
                className="flex h-10 w-full md:w-48 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                value={ledgerFilterMethod}
                onChange={e => setLedgerFilterMethod(e.target.value)}
              >
                <option value="Todos">Todos los métodos</option>
                <option value="Efectivo MXN">Efectivo MXN</option>
                <option value="Efectivo USD">Efectivo USD</option>
                <option value="Transferencias">Transferencias</option>
              </select>
              <select 
                className="flex h-10 w-full md:w-48 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                value={ledgerFilterDate}
                onChange={e => setLedgerFilterDate(e.target.value)}
              >
                <option value="Todo">Todo el tiempo</option>
                <option value="Este mes">Este mes</option>
                <option value="Mes anterior">Mes anterior</option>
              </select>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Fecha y Hora</th>
                      <th className="px-4 py-3">Huésped / Referencia</th>
                      <th className="px-4 py-3">Método</th>
                      <th className="px-4 py-3 text-right">Monto Original</th>
                      <th className="px-4 py-3 text-right">Importe Acreditado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPagos.map((p, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {format(new Date(p.created_at || p.fecha), "dd MMM yyyy", { locale: es })}
                          </div>
                          <div className="text-xs text-gray-400">
                            {format(new Date(p.created_at || p.fecha), "HH:mm 'hrs'", { locale: es })}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-900">{p.reservas?.nombre_cliente || 'Desconocido'}</div>
                          <div className="text-xs text-gray-500">{p.concepto || p.propiedades?.titulo}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{p.metodo_pago}</td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {p.moneda === 'USD' ? (
                            <span className="text-green-600 font-medium">${p.monto} USD <span className="text-[10px] text-gray-400 block">TC: {p.tipo_cambio}</span></span>
                          ) : (
                            <span>{formatPrice(p.monto)}</span>
                          )}
                        </td>
                        {(() => {
                          const isEgreso = p.tipo === 'egreso' || String(p.categoria).toLowerCase() === 'reembolso';
                          const cat = String(p.categoria || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
                          const concepto = String(p.concepto || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
                          
                          if (isEgreso) {
                            let badge = <span className="text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[11px] font-medium mt-1 whitespace-nowrap">Egreso Operativo</span>;
                            if (cat.includes('comision') || concepto.includes('comision')) {
                              badge = <span className="text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-medium mt-1 whitespace-nowrap">Comisión Pagada</span>;
                            } else if (cat.includes('reembolso') || cat.includes('devolucion') || concepto.includes('reembolso') || concepto.includes('devolucion')) {
                              badge = <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-medium mt-1 whitespace-nowrap">Reembolso Huésped</span>;
                            }

                            return (
                              <td className="px-4 py-3 text-right font-bold text-red-600">
                                <div className="flex flex-col items-end">
                                  <span>-{formatPrice(p.monto_mxn || p.monto)}</span>
                                  {badge}
                                </div>
                              </td>
                            );
                          }

                          return (
                            <td className="px-4 py-3 text-right font-bold text-gray-900">
                              {formatPrice(p.monto_mxn || p.monto)}
                            </td>
                          );
                        })()}
                      </tr>
                    ))}
                    {filteredPagos.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No se encontraron transacciones.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

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
          <CardContent className="overflow-hidden">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 truncate">{formatPrice(kpis.totalProyectado)}</div>
            <p className="text-xs text-gray-500 mt-1">Suma de reservas activas</p>
          </CardContent>
        </Card>
        
        <Card className="border-green-100 bg-green-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-green-600" />
              Dinero Cobrado Neto (MXN)
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <div suppressHydrationWarning className="text-2xl font-bold text-green-700">{formatPrice(kpis.dineroEnCaja)}</div>
            <div className="mt-2 space-y-1 text-[11px] text-gray-600">
              <div className="flex justify-between">
                <span>Ingresos Brutos:</span>
                <span className="font-medium text-gray-900">{formatPrice(kpis.dineroIngresadoBruto)}</span>
              </div>
              {kpis.dineroReembolsado > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Reembolsos Emitidos:</span>
                  <span className="font-medium">-{formatPrice(kpis.dineroReembolsado)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100 bg-amber-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-amber-600" />
              Saldo por Cobrar
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden">
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
          <CardContent className="overflow-hidden">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 truncate">{formatPrice(kpis.totalComisiones)}</div>
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
          <CardContent className="overflow-hidden">
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
          <CardContent className="overflow-hidden">
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
            <CardContent className="p-2.5 sm:p-3.5 flex flex-col justify-center">
              <div className="text-sm text-gray-500 mb-1">Meses Pasados</div>
              <div className="text-base sm:text-lg tracking-tight font-bold text-gray-800 whitespace-nowrap">{formatLargePrice(metrics.totalPast)}</div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-2.5 sm:p-3.5 flex flex-col justify-center">
              <div className="text-sm text-red-600 font-medium mb-1">Mes Actual</div>
              <div className="text-base sm:text-lg tracking-tight font-bold text-red-700 whitespace-nowrap">{formatLargePrice(metrics.totalCurrent)}</div>
                <p className="text-[10px] sm:text-xs text-red-500/80 font-medium mt-1">{metrics.freeNightsCurrent} noches libres restantes</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-2.5 sm:p-3.5 flex flex-col justify-center">
              <div className="text-sm text-gray-500 mb-1">Meses Siguientes</div>
              <div className="text-base sm:text-lg tracking-tight font-bold text-gray-800 whitespace-nowrap">{formatLargePrice(metrics.totalFuture)}</div>
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-1">{metrics.freeNightsFuture} noches por reservar</p>
            </CardContent>
          </Card>
          <Card className="border-gray-300 bg-gray-50">
            <CardContent className="p-2.5 sm:p-3.5 flex flex-col justify-center">
                <div className="text-xs sm:text-sm text-gray-600 font-bold mb-1">Total del Año</div>
                <div className="text-base sm:text-lg tracking-tight font-black text-gray-900 whitespace-nowrap">{formatLargePrice(metrics.totalYearLost)}</div>
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
                    Total Comisiones Generadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-hidden">
                  <div suppressHydrationWarning className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 truncate">
                    {mounted ? formatPrice(totalGenerado) : '$0.00'}
                  </div>
                  <div className="mt-2 text-[11px] text-gray-500">
                    Total pactado en reservas del periodo
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-100 bg-green-50/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Comisiones Liquidadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-hidden">
                  <div suppressHydrationWarning className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 truncate">
                    {mounted ? formatPrice(totalLiquidado) : '$0.00'}
                  </div>
                  <div className="mt-2 text-[11px] text-gray-500">
                    Total de abonos efectivamente pagados a gestores
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-100 bg-blue-50/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    Pendiente Neto a Transferir
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-hidden">
                  <div suppressHydrationWarning className="text-xl sm:text-2xl font-bold tracking-tight text-blue-700 truncate">
                    {mounted ? formatPrice(totalNetoATransferir) : '$0.00'}
                  </div>
                  <div suppressHydrationWarning className="mt-2 text-[11px]">
                    {mounted && saldoAFavor > 0 ? (
                      <span className="text-green-600 font-medium">Incluye -{formatPrice(saldoAFavor)} de saldo a favor por cancelaciones</span>
                    ) : (
                      <span className="text-gray-500">Saldo al corriente para liquidación</span>
                    )}
                  </div>
                </CardContent>
              </Card>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 w-10 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      checked={comisionesUnificadas.filter(c => c.estado_pago === 'pendiente' || c.estado_pago === 'parcial').length > 0 && selectedComisiones.length === comisionesUnificadas.filter(c => c.estado_pago === 'pendiente' || c.estado_pago === 'parcial').length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedComisiones(comisionesUnificadas.filter(c => c.estado_pago === 'pendiente' || c.estado_pago === 'parcial').map(c => c.id))
                        } else {
                          setSelectedComisiones([])
                        }
                      }}
                    />
                  </th>
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
                {comisionesUnificadas.length === 0 && (
                  <tr><td colSpan={9} className="text-center py-6 text-gray-400">No hay comisiones registradas</td></tr>
                )}
                {comisionesUnificadas.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 disabled:opacity-50 cursor-pointer"
                        disabled={c.estado_pago === 'pagado' || c.estado_pago === 'liquidado' || c.estado_pago === 'cancelada' || c.estado_pago === 'cancelada_con_saldo_a_favor'}
                        checked={selectedComisiones.includes(c.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedComisiones(prev => [...prev, c.id])
                          } else {
                            setSelectedComisiones(prev => prev.filter(id => id !== c.id))
                          }
                        }}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {c.fecha_reserva ? format(parseISO(c.fecha_reserva), 'dd MMM yyyy, HH:mm', { locale: es }) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{c.propiedad_titulo}</div>
                      <div className="text-xs text-gray-500">{c.nombre_cliente}</div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {formatPrice(c.monto_estancia || 0)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 group relative">
                        <div className="font-medium text-purple-700">{formatPrice(c.monto_comision)}</div>
                        <Info className="h-3 w-3 text-gray-400 cursor-help" />
                        
                        {/* CSS Tooltip */}
                        <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-50 pointer-events-none">
                          {c.rawReserva?.ajustes_reserva && c.rawReserva.ajustes_reserva.length > 0 ? (
                            <div className="space-y-1 text-left">
                              {c.rawReserva.ajustes_reserva.map((ajuste: any, i: number) => (
                                <div key={i} className="flex justify-between">
                                  <span>{ajuste.concepto}</span>
                                  <span className="font-semibold text-purple-200">{ajuste.porcentaje_comision}%</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-left text-purple-200">
                              Tarifa base × {c.rawReserva?.porcentaje_comision || 0}%
                            </div>
                          )}
                          <div className="absolute right-3 -bottom-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {formatPrice(c.monto_pagado || 0)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {formatPrice(c.saldo || 0)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.estado_pago === 'liquidado' || c.estado_pago === 'pagado' ? 'bg-green-100 text-green-700 font-bold' :
                        c.estado_pago === 'cancelada_con_saldo_a_favor' ? 'bg-indigo-100 text-indigo-700' :
                        c.estado_pago === 'cancelada' ? 'bg-red-100 text-red-700' :
                        c.estado_pago === 'parcial' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {c.estado_pago === 'pagado' || c.estado_pago === 'liquidado' ? 'Liquidada' : c.estado_pago}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.estado_pago !== 'pagado' && c.estado_pago !== 'liquidado' && c.estado_pago !== 'cancelada' && c.estado_pago !== 'cancelada_con_saldo_a_favor' ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                          onClick={() => setModalComision({ 
                            isOpen: true, 
                            ids: [c.id], 
                            saldo: c.saldo, 
                            pago: String(c.saldo) 
                          })}
                        >
                          Pagar
                        </Button>
                      ) : (
                        <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded">Liquidada</span>
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

      {/* BARRA FLOTANTE DE ACCIÓN POR LOTE (POSICIONAMIENTO GLOBAL) */}
      {selectedComisiones.length > 0 && activeTab === 'comisiones' && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-[110px] z-[60] w-[90%] max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <div className="text-sm font-medium flex items-center">
            <span className="bg-teal-500 text-white text-xs py-1 px-2.5 rounded-full mr-3 shadow-inner">{selectedComisiones.length}</span>
            <span className="hidden md:inline">seleccionadas | Total:</span>
            <span className="md:hidden">Total:</span>
            <span className="font-bold text-lg text-teal-400 ml-2">{formatPrice(comisionesUnificadas.filter(c => selectedComisiones.includes(c.id)).reduce((acc, c) => acc + (c.saldo || 0), 0))}</span>
          </div>
          <Button 
            className="bg-teal-500 hover:bg-teal-600 text-white border border-teal-400 shadow-md whitespace-nowrap"
            onClick={() => {
              const total = comisionesUnificadas.filter(c => selectedComisiones.includes(c.id)).reduce((acc, c) => acc + (c.saldo || 0), 0)
              setModalComision({
                isOpen: true,
                ids: selectedComisiones,
                saldo: total,
                pago: String(total)
              })
            }}
          >
            Liquidar
          </Button>
        </div>
      )}

    </div>
  )
}