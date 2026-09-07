import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace states
old_states = """  const [confMoneda, setConfMoneda] = useState('MXN')
  const [confTc, setConfTc] = useState('17.00')
  const [confMetodo, setConfMetodo] = useState('Transferencia')
  const [confAnticipo, setConfAnticipo] = useState('')
  const [confReferencia, setConfReferencia] = useState('')
  const [confSaving, setConfSaving] = useState(false)
  const [confError, setConfError] = useState('')"""

new_states = """  const [confMoneda, setConfMoneda] = useState('MXN')
  const [confTc, setConfTc] = useState('16.00')
  const [confMetodo, setConfMetodo] = useState('Transferencia')
  const [confAnticipo, setConfAnticipo] = useState('')
  const [confHospedaje, setConfHospedaje] = useState('')
  const [confReferencia, setConfReferencia] = useState('')
  const [confSaving, setConfSaving] = useState(false)
  const [confError, setConfError] = useState('')"""

content = content.replace(old_states, new_states)

# Replace handleConfirmarReserva
old_handler = """  const handleConfirmarReserva = async () => {
    if (!confirmModal.solicitud) return
    const anticipo = parseFloat(confAnticipo || '0')
    const tc = parseFloat(confTc || '1')
    if (!confAnticipo || isNaN(anticipo)) return setConfError('Ingresa el monto del anticipo.')
    setConfSaving(true)
    setConfError('')
    try {
      const { aprobarSolicitud } = await import('@/app/casasgaby/admin/actions')
      const sol = confirmModal.solicitud
      const base = parseFloat(sol.costo_total || sol.monto_total_acordado || '0')
      const res = await aprobarSolicitud(
        sol.id, base, anticipo,
        confMetodo === 'Transferencia' ? 'transferencia_mxn' : 'efectivo_mxn',
        confMoneda, tc, []
      )"""

new_handler = """  const getExtrasTotal = (sol: any) => {
    if (!sol || !Array.isArray(sol.servicios_extra)) return 0;
    return sol.servicios_extra.reduce((acc: number, s: any) => acc + (Number(s.precio_base || 0) * (s.qty || 1)), 0);
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
      const extrasAmount = getExtrasTotal(sol)
      const hospedajeAmount = parseFloat(confHospedaje || '0')
      const finalTotal = hospedajeAmount + extrasAmount
      
      const res = await aprobarSolicitud(
        sol.id, finalTotal, anticipo,
        confMetodo === 'Transferencia' ? 'transferencia_mxn' : 'efectivo_mxn',
        confMoneda, tc, sol.servicios_extra || []
      )"""

content = content.replace(old_handler, new_handler)

# Replace Reactivity values
old_recalc = """  const montoPrevisto = confirmModal.solicitud ? parseFloat(confirmModal.solicitud.costo_total || '0') : 0
  const anticipoMXN = parseFloat(confAnticipo || '0') * (confMoneda === 'USD' ? parseFloat(confTc || '1') : 1)"""

new_recalc = """  const extrasModalTotal = confirmModal.solicitud ? getExtrasTotal(confirmModal.solicitud) : 0;
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
"""
content = content.replace(old_recalc, new_recalc)

# Replace button onClick assignment for confirm modal
old_btn = """            onClick={() => {
              setConfirmModal({ open: true, solicitud: s })
              setConfAnticipo(((s.costo_total || 0) * 0.5).toFixed(2))
              setConfMoneda('MXN')
              setConfMetodo('Transferencia')
              setConfError('')
            }}"""

new_btn = """            onClick={() => {
              const eTotal = getExtrasTotal(s);
              const totalBase = parseFloat(s.costo_total || s.monto_total_acordado || '0');
              const hBase = Math.max(0, totalBase - eTotal);
              setConfHospedaje(hBase.toFixed(2));
              setConfirmModal({ open: true, solicitud: s })
              setConfMoneda('MXN')
              setConfTc('16.00')
              setConfMetodo('Transferencia')
              setConfError('')
            }}"""
content = content.replace(old_btn, new_btn)


# Update Modal JSX for desglose and inputs
old_modal_inner = """              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-sm space-y-1">
                <p className="font-bold text-teal-800">{confirmModal.solicitud.nombre_cliente}</p>
                <p className="text-teal-700">{confirmModal.solicitud.propiedades?.titulo}</p>
                <p className="text-gray-600">{formatDateEs(confirmModal.solicitud.fecha_entrada)} → {formatDateEs(confirmModal.solicitud.fecha_salida)} · {confirmModal.solicitud.noches} noches</p>
                <p className="font-semibold text-gray-800">Total acordado: {formatPrice(montoPrevisto)}</p>
              </div>"""

new_modal_inner = """              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-sm space-y-2">
                <div>
                  <p className="font-bold text-teal-800">{confirmModal.solicitud.nombre_cliente}</p>
                  <p className="text-teal-700">{confirmModal.solicitud.propiedades?.titulo}</p>
                  <p className="text-gray-600">{formatDateEs(confirmModal.solicitud.fecha_entrada)} → {formatDateEs(confirmModal.solicitud.fecha_salida)} · {confirmModal.solicitud.noches} noches</p>
                </div>
                
                <div className="border-t border-teal-200/60 pt-2">
                  <p className="font-semibold text-teal-900 mb-1">Servicios Adicionales:</p>
                  {Array.isArray(confirmModal.solicitud.servicios_extra) && confirmModal.solicitud.servicios_extra.length > 0 ? (
                    <ul className="text-xs text-gray-700 space-y-1">
                      {confirmModal.solicitud.servicios_extra.map((srv: any, idx: number) => (
                        <li key={idx}>✓ {srv.nombre} (x{srv.qty || 1}) - {formatPrice(Number(srv.precio_base || 0) * (srv.qty || 1))}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Sin servicios extra solicitados</p>
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
              </div>"""

content = content.replace(old_modal_inner, new_modal_inner)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

