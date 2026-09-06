import re

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add imports (Input, Select) if not there, or native select.
import_pattern = r"import \{ Button \} from '@/components/ui/button'"
new_imports = "import { Button } from '@/components/ui/button'\nimport { Input } from '@/components/ui/input'"
if "Input" not in content:
    content = content.replace(import_pattern, new_imports)

# 2. Add state for modal
state_pattern = r"const \[loadingId, setLoadingId\] = useState<string \| null>\(null\)"
new_state = """const [loadingId, setLoadingId] = useState<string | null>(null)
  const [modalReserva, setModalReserva] = useState<any>(null)
  const [montoPago, setMontoPago] = useState<string>('')
  const [metodoPago, setMetodoPago] = useState('Efectivo MXN')
  const [notasPago, setNotasPago] = useState('')"""
content = content.replace(state_pattern, new_state)

# 3. Replace handleLiquidar
handle_liquidar_old = r"""  const handleLiquidar = async \(r: any\) => \{
    const saldo = getSaldo\(r\)
    const c = confirm\(`¿Confirmas que el huésped pagó \$\{formatPrice\(saldo\)\} MXN en recepción \(Efectivo\)\?`\)
    if \(!c\) return

    try \{
      setLoadingId\(r\.id \+ '-liquidar'\)
      const res = await liquidarSaldoRecepcion\(r\.id, saldo, r\.cliente_id\)
      if \(res\.success\) \{
        // Actualizamos estado local
        setLocalReservas\(prev => prev\.map\(reserva => \{
          if \(reserva\.id === r\.id\) \{
            return \{
              \.\.\.reserva,
              transacciones: \[\.\.\.\(reserva\.transacciones \|\| \[\]\), \{ tipo: 'ingreso', monto_mxn: saldo \}\]
            \}
          \}
          return reserva
        \}\)\)
        alert\('Saldo liquidado correctamente\.'\)
      \} else \{
        alert\('Error al liquidar: ' \+ res\.error\)
      \}
    \} catch \(e: any\) \{
      alert\(e\.message\)
    \} finally \{
      setLoadingId\(null\)
    \}
  \}"""

handle_liquidar_new = """  const handleLiquidar = (r: any) => {
    setModalReserva(r)
    setMontoPago(getSaldo(r).toString())
    setMetodoPago('Efectivo MXN')
    setNotasPago('')
  }

  const submitLiquidacion = async () => {
    if (!modalReserva) return
    const monto = Number(montoPago)
    const saldo = getSaldo(modalReserva)
    
    if (isNaN(monto) || monto <= 0) return alert('El monto debe ser mayor a 0.')
    if (monto > saldo) return alert('El monto no puede ser mayor al saldo pendiente de ' + formatPrice(saldo))

    try {
      setLoadingId('submit-pago')
      const res = await liquidarSaldoRecepcion(modalReserva.id, monto, modalReserva.cliente_id, metodoPago, notasPago)
      if (res.success) {
        setLocalReservas(prev => prev.map(reserva => {
          if (reserva.id === modalReserva.id) {
            return {
              ...reserva,
              transacciones: [...(reserva.transacciones || []), { tipo: 'ingreso', monto_mxn: monto }]
            }
          }
          return reserva
        }))
        setModalReserva(null)
      } else {
        alert('Error al liquidar: ' + res.error)
      }
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoadingId(null)
    }
  }"""

# Using regex to replace the function. Needs careful matching due to encoding or whitespace.
# It's better to split/replace or use re.sub with DOTALL.
content = re.sub(r"const handleLiquidar = async \(r: any\) => \{.*?\}(?=\n\n  const buildWaUrl)", handle_liquidar_new, content, flags=re.DOTALL)

# 4. Add Modal JSX at the end before final div closing
modal_jsx = """
      {/* MODAL DE LIQUIDACIÓN */}
      {modalReserva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Registrar Pago / Liquidación</h2>
              <button onClick={() => setModalReserva(null)} className="text-gray-400 hover:text-gray-600 p-1">
                ✕
              </button>
            </div>
            
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <p className="text-sm text-indigo-900"><strong>Huésped:</strong> {modalReserva.nombre_cliente}</p>
                <p className="text-sm text-indigo-900"><strong>Propiedad:</strong> {modalReserva.propiedades?.titulo}</p>
                <p className="text-sm text-indigo-900 mt-1"><strong>Saldo Pendiente:</strong> {formatPrice(getSaldo(modalReserva))}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Monto a Pagar (MXN)</label>
                <Input 
                  type="number" 
                  value={montoPago} 
                  onChange={e => setMontoPago(e.target.value)} 
                  placeholder="Ej. 1500" 
                  className="font-semibold text-lg"
                  max={getSaldo(modalReserva)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Método de Pago</label>
                <select 
                  className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={metodoPago}
                  onChange={e => setMetodoPago(e.target.value)}
                >
                  <option value="Efectivo MXN">Efectivo MXN</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                  <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                  <option value="Efectivo USD">Efectivo USD</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Referencia / Notas (Opcional)</label>
                <Input 
                  value={notasPago} 
                  onChange={e => setNotasPago(e.target.value)} 
                  placeholder="Ej. Liquidación en recepción" 
                />
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex gap-3 bg-gray-50/50 mt-auto">
              <Button variant="outline" className="flex-1" onClick={() => setModalReserva(null)}>
                Cancelar
              </Button>
              <Button 
                onClick={submitLiquidacion} 
                disabled={loadingId === 'submit-pago' || Number(montoPago) <= 0 || Number(montoPago) > getSaldo(modalReserva)} 
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {loadingId === 'submit-pago' ? 'Registrando...' : 'Confirmar Pago'}
              </Button>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace("    </div>\n  )\n}", modal_jsx + "    </div>\n  )\n}")

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
