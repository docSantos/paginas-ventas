import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = re.sub(
    r'(import \{.*?)(\} from \'lucide-react\')',
    r'\1, ArrowRightLeft, Banknote \2',
    content
)

# 2. Add confExtrasSelection state
old_states = """  const [confHospedaje, setConfHospedaje] = useState('')
  const [confReferencia, setConfReferencia] = useState('')"""

new_states = """  const [confHospedaje, setConfHospedaje] = useState('')
  const [confExtrasSelection, setConfExtrasSelection] = useState<Record<number, boolean>>({})
  const [confReferencia, setConfReferencia] = useState('')"""

content = content.replace(old_states, new_states)

# 3. Update getExtrasTotal
old_getExtras = """  const getExtrasTotal = (sol: any) => {
    if (!sol || !Array.isArray(sol.servicios_extra)) return 0;
    return sol.servicios_extra.reduce((acc: number, s: any) => acc + (Number(s.precio_base || 0) * (s.qty || 1)), 0);
  }"""

new_getExtras = """  const getExtrasTotal = (sol: any, selection?: Record<number, boolean>) => {
    if (!sol || !Array.isArray(sol.servicios_extra)) return 0;
    return sol.servicios_extra.reduce((acc: number, s: any, idx: number) => {
      if (selection && !selection[idx]) return acc;
      return acc + (Number(s.precio_base || 0) * (s.qty || 1));
    }, 0);
  }"""

content = content.replace(old_getExtras, new_getExtras)

# 4. Update handleConfirmarReserva
old_handler = """      const extrasAmount = getExtrasTotal(sol)
      const hospedajeAmount = parseFloat(confHospedaje || '0')
      const finalTotal = hospedajeAmount + extrasAmount
      
      const res = await aprobarSolicitud(
        sol.id, finalTotal, anticipo,
        confMetodo === 'Transferencia' ? 'transferencia_mxn' : 'efectivo_mxn',
        confMoneda, tc, sol.servicios_extra || []
      )"""

new_handler = """      const extrasAmount = getExtrasTotal(sol, confExtrasSelection)
      const hospedajeAmount = parseFloat(confHospedaje || '0')
      const finalTotal = hospedajeAmount + extrasAmount
      
      const selectedExtras = (sol.servicios_extra || []).filter((_: any, idx: number) => confExtrasSelection[idx])
      const res = await aprobarSolicitud(
        sol.id, finalTotal, anticipo,
        confMetodo === 'Transferencia' ? 'transferencia_mxn' : 'efectivo_mxn',
        confMoneda, tc, selectedExtras
      )"""

content = content.replace(old_handler, new_handler)

# 5. Update reactivity calculations
old_recalc = """  const extrasModalTotal = confirmModal.solicitud ? getExtrasTotal(confirmModal.solicitud) : 0;"""
new_recalc = """  const extrasModalTotal = confirmModal.solicitud ? getExtrasTotal(confirmModal.solicitud, confExtrasSelection) : 0;"""
content = content.replace(old_recalc, new_recalc)

# 6. Update open modal initialization
old_btn = """              const eTotal = getExtrasTotal(s);
              const totalBase = parseFloat(s.costo_total || s.monto_total_acordado || '0');
              const hBase = Math.max(0, totalBase - eTotal);
              setConfHospedaje(hBase.toFixed(2));
              setConfirmModal({ open: true, solicitud: s })"""

new_btn = """              const eTotal = getExtrasTotal(s);
              const totalBase = parseFloat(s.costo_total || s.monto_total_acordado || '0');
              const hBase = Math.max(0, totalBase - eTotal);
              const initSel: Record<number, boolean> = {};
              if (Array.isArray(s.servicios_extra)) {
                s.servicios_extra.forEach((_: any, idx: number) => initSel[idx] = true);
              }
              setConfExtrasSelection(initSel);
              setConfHospedaje(hBase.toFixed(2));
              setConfirmModal({ open: true, solicitud: s })"""
content = content.replace(old_btn, new_btn)


# 7. Update the currency select and payment methods in JSX
old_currency = """                  <label className="text-sm font-medium block mb-1">Moneda del anticipo</label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm" value={confMoneda} onChange={e => setConfMoneda(e.target.value)}>
                    <option value="MXN">🇲🇽 MXN</option>
                    <option value="USD">🇺🇸 USD</option>
                  </select>"""

mxn_svg = '<svg viewBox="0 0 64 64" className="w-4 h-4 mr-1.5"><path fill="#006341" d="M0 16h21.3v32H0z"/><path fill="#fff" d="M21.3 16h21.4v32H21.3z"/><path fill="#c8102e" d="M42.7 16H64v32H42.7z"/><circle cx="32" cy="32" r="4.5" fill="#693d25"/><path fill="#006341" d="M30 34c1.1 1.5 3.3 1.5 4 0l-2-2-2 2z"/></svg>'
usd_svg = '<svg viewBox="0 0 64 64" className="w-4 h-4 mr-1.5"><path fill="#fff" d="M0 16h64v32H0z"/><path fill="#bd3d44" d="M0 18.5h64v2.4H0zm0 4.9h64v2.4H0zm0 4.9h64v2.4H0zm0 4.9h64v2.4H0zm0 4.9h64v2.4H0zm0 4.9h64v2.4H0z"/><path fill="#192f5d" d="M0 16h29.3v17H0z"/><path fill="#fff" d="M3 18l.8 2.4H6l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.7 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.6 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4H13zm4.7 0l.8 2.4h2.2L19 21.8l.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.6 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm-16.3 3l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.7 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4H13zm4.6 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.7 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm-16.3 3l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4H8.3zm4.7 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4H13zm4.6 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.7 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm-16.3 3l.8 2.4H8l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.7 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4H13zm4.6 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2zm4.7 0l.8 2.4h2.2l-1.8 1.4.7 2.3-1.9-1.4-1.9 1.4.7-2.3-1.8-1.4h2.2z"/></svg>'

new_currency = f"""                  <label className="text-sm font-medium block mb-1">Moneda del anticipo</label>
                  <div className="flex gap-2">
                    <button
                      onClick={{() => setConfMoneda('MXN')}}
                      className={{`flex-1 flex items-center justify-center py-2 text-sm rounded-lg border font-medium transition-colors ${{confMoneda === 'MXN' ? 'bg-gray-100 border-gray-400' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}}`}}
                    >
                      {mxn_svg} MXN
                    </button>
                    <button
                      onClick={{() => setConfMoneda('USD')}}
                      className={{`flex-1 flex items-center justify-center py-2 text-sm rounded-lg border font-medium transition-colors ${{confMoneda === 'USD' ? 'bg-gray-100 border-gray-400' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}}`}}
                    >
                      {usd_svg} USD
                    </button>
                  </div>"""

content = content.replace(old_currency, new_currency)

old_payment = """                      <button
                        key={m}
                        onClick={() => setConfMetodo(m)}
                        className={`flex-1 py-2 text-sm rounded-lg border font-medium transition-colors ${confMetodo === m ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400'}`}
                      >
                        {m === 'Transferencia' ? '🏦' : '💵'} {m}
                      </button>"""

new_payment = """                      <button
                        key={m}
                        onClick={() => setConfMetodo(m)}
                        className={`flex-1 flex items-center justify-center py-2 text-sm rounded-lg border font-medium transition-colors ${confMetodo === m ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400'}`}
                      >
                        {m === 'Transferencia' ? <ArrowRightLeft className="w-4 h-4 mr-2" /> : <Banknote className="w-4 h-4 mr-2" />} {m}
                      </button>"""
content = content.replace(old_payment, new_payment)

# 8. Add checkboxes to the extras list
old_list = """                      {confirmModal.solicitud.servicios_extra.map((srv: any, idx: number) => (
                        <li key={idx}>✓ {srv.nombre} (x{srv.qty || 1}) - {formatPrice(Number(srv.precio_base || 0) * (srv.qty || 1))}</li>
                      ))}"""

new_list = """                      {confirmModal.solicitud.servicios_extra.map((srv: any, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={!!confExtrasSelection[idx]}
                            onChange={(e) => setConfExtrasSelection({...confExtrasSelection, [idx]: e.target.checked})}
                            className="w-3.5 h-3.5 text-teal-600 rounded border-gray-300 focus:ring-teal-500 cursor-pointer"
                          />
                          <span className={!confExtrasSelection[idx] ? 'text-gray-400 line-through' : ''}>
                            {srv.nombre} (x{srv.qty || 1}) - {formatPrice(Number(srv.precio_base || 0) * (srv.qty || 1))}
                          </span>
                        </li>
                      ))}"""
content = content.replace(old_list, new_list)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
