import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace states
content = content.replace(
    "const [activeTab, setActiveTab] = useState<'kpis'|'comisiones'>('kpis')",
    "const [activeTab, setActiveTab] = useState<'ledger'|'kpis'|'comisiones'>('ledger')\n  const [ledgerSearch, setLedgerSearch] = useState('')\n  const [ledgerFilterMethod, setLedgerFilterMethod] = useState('Todos')\n  const [ledgerFilterDate, setLedgerFilterDate] = useState('Todo')"
)

# Inject Tab Button
tab_kpis = """<button
            onClick={() => setActiveTab('kpis')}"""
tab_ledger_and_kpis = """<button
            onClick={() => setActiveTab('ledger')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'ledger' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Libro Mayor
          </button>
          <button
            onClick={() => setActiveTab('kpis')}"""

content = content.replace(tab_kpis, tab_ledger_and_kpis)

# Inject ledger tab content before kpis tab
ledger_logic_and_jsx = """
  // === LEDGER LOGIC ===
  const totalHistorico = pagos.reduce((acc, p) => acc + Number(p.monto_mxn || 0), 0)
  
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const ingresosMesActual = pagos.filter(p => {
    const d = new Date(p.created_at)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  }).reduce((acc, p) => acc + Number(p.monto_mxn || 0), 0)

  const usdAcumulado = pagos.filter(p => p.moneda === 'USD').reduce((acc, p) => acc + Number(p.monto || 0), 0)
  const pagosEfectivo = pagos.filter(p => p.metodo_pago?.includes('Efectivo')).reduce((acc, p) => acc + Number(p.monto_mxn || 0), 0)
  const pagosTransf = pagos.filter(p => p.metodo_pago?.includes('Transferencia')).reduce((acc, p) => acc + Number(p.monto_mxn || 0), 0)

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
"""

# Insert logic just before `return (`
content = content.replace("  return (", ledger_logic_and_jsx + "\n  return (")

ledger_jsx = """
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
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{formatLargePrice(totalHistorico)}</div>
                </CardContent>
              </Card>
              <Card className="border-emerald-100 bg-emerald-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-emerald-600" />
                    Ingresos Mes Actual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{formatLargePrice(ingresosMesActual)}</div>
                </CardContent>
              </Card>
              <Card className="border-amber-100 bg-amber-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    Divisas Acumuladas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">${formatLargePrice(usdAcumulado)} USD</div>
                </CardContent>
              </Card>
              <Card className="border-slate-100 bg-slate-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-slate-600" />
                    Efectivo vs Transf.
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-sm flex justify-between"><span className="text-gray-500">Efectivo:</span> <span className="font-semibold">{formatLargePrice(pagosEfectivo)}</span></div>
                  <div className="text-sm flex justify-between"><span className="text-gray-500">Transf:</span> <span className="font-semibold">{formatLargePrice(pagosTransf)}</span></div>
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
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatDateEs(p.created_at, true)}</td>
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
                        <td className="px-4 py-3 text-right font-bold text-gray-900">
                          {formatPrice(p.monto_mxn || p.monto)}
                        </td>
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
"""

content = content.replace("{activeTab === 'kpis' && (", ledger_jsx + "\n        {activeTab === 'kpis' && (")

# Add formatDateEs logic to lib/utils if needed (or just add it inline to FinanzasClient)
import_fix = """import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

const formatDateEs = (dateStr: string, withTime = false) => {
  if (!dateStr) return ''
  return format(parseISO(dateStr), withTime ? 'dd MMM yyyy HH:mm' : 'dd MMM yyyy', { locale: es })
}
"""
content = content.replace("const [year, setYear] = useState", import_fix + "\n  const [year, setYear] = useState")

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
