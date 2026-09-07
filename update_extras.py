import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update component signatures to accept 'servicios'
content = content.replace(
    "export default function ClientesClient({ clientes, solicitudes = [], reservasConfirmadas = [] }: { clientes: Cliente[], solicitudes?: any[], reservasConfirmadas?: any[] }) {",
    "export default function ClientesClient({ clientes, solicitudes = [], reservasConfirmadas = [], servicios = [] }: { clientes: Cliente[], solicitudes?: any[], reservasConfirmadas?: any[], servicios?: any[] }) {"
)

content = content.replace(
    "<CrmPipeline solicitudes={solicitudes} reservasConfirmadas={reservasConfirmadas} />",
    "<CrmPipeline solicitudes={solicitudes} reservasConfirmadas={reservasConfirmadas} servicios={servicios} />"
)

content = content.replace(
    "function CrmPipeline({ solicitudes, reservasConfirmadas = [] }: { solicitudes: any[], reservasConfirmadas?: any[] }) {",
    "function CrmPipeline({ solicitudes, reservasConfirmadas = [], servicios = [] }: { solicitudes: any[], reservasConfirmadas?: any[], servicios?: any[] }) {"
)

# 2. Update state inside CrmPipeline
# Replace confExtrasSelection
old_states = """  const [confHospedaje, setConfHospedaje] = useState('')
  const [confExtrasSelection, setConfExtrasSelection] = useState<Record<number, boolean>>({})
  const [confReferencia, setConfReferencia] = useState('')"""

new_states = """  const [confHospedaje, setConfHospedaje] = useState('')
  const [confExtras, setConfExtras] = useState<Record<string, any>>({})
  const [confReferencia, setConfReferencia] = useState('')"""
content = content.replace(old_states, new_states)

# 3. Update getExtrasTotal logic
old_getExtras = """  const getExtrasTotal = (sol: any, selection?: Record<number, boolean>) => {
    if (!sol || !Array.isArray(sol.servicios_extra)) return 0;
    return sol.servicios_extra.reduce((acc: number, s: any, idx: number) => {
      if (selection && !selection[idx]) return acc;
      return acc + (Number(s.precio_base || 0) * (s.qty || 1));
    }, 0);
  }"""

new_getExtras = """  const getExtrasTotal = (state: Record<string, any>) => {
    return Object.values(state).reduce((acc: number, s: any) => {
      if (!s.activo) return acc;
      if (s.tipo_tarifa === 'por_trayecto') {
        const count = (s.ida ? 1 : 0) + (s.vuelta ? 1 : 0);
        return acc + (Number(s.precio_base) * count);
      }
      return acc + (Number(s.precio_base) * (s.qty || 1));
    }, 0);
  }"""
content = content.replace(old_getExtras, new_getExtras)

# 4. Update the initialization when clicking "Confirmar Reserva"
old_btn_init = """              const eTotal = getExtrasTotal(s);
              const totalBase = parseFloat(s.costo_total || s.monto_total_acordado || '0');
              const hBase = Math.max(0, totalBase - eTotal);
              const initSel: Record<number, boolean> = {};
              if (Array.isArray(s.servicios_extra)) {
                s.servicios_extra.forEach((_: any, idx: number) => initSel[idx] = true);
              }
              setConfExtrasSelection(initSel);
              setConfHospedaje(hBase.toFixed(2));
              setConfirmModal({ open: true, solicitud: s })
              setConfMoneda('MXN')
              setConfTc('16.00')
              setConfMetodo('Transferencia')
              setConfError('')
            }}"""

new_btn_init = """              const initExtras: Record<string, any> = {};
              if (Array.isArray(s.servicios_extra)) {
                s.servicios_extra.forEach((e: any) => {
                  let ida = false;
                  let vuelta = false;
                  let qty = e.qty || 1;
                  if (e.tipo_tarifa === 'por_trayecto') {
                    if (e.nombre?.includes('Ida y Vuelta')) { ida = true; vuelta = true; qty = 2; }
                    else if (e.nombre?.includes('Ida')) { ida = true; qty = 1; }
                    else if (e.nombre?.includes('Vuelta')) { vuelta = true; qty = 1; }
                    else { ida = true; vuelta = true; qty = 2; } // fallback
                  }
                  initExtras[e.id] = { activo: true, id: e.id, nombre: e.nombre, precio_base: e.precio_base, tipo_tarifa: e.tipo_tarifa, qty, ida, vuelta };
                });
              }
              const eTotal = Object.values(initExtras).reduce((acc: number, s: any) => acc + (s.precio_base * s.qty), 0);
              const totalBase = parseFloat(s.costo_total || s.monto_total_acordado || '0');
              const hBase = Math.max(0, totalBase - eTotal);
              
              setConfExtras(initExtras);
              setConfHospedaje(hBase.toFixed(2));
              setConfirmModal({ open: true, solicitud: s })
              setConfMoneda('MXN')
              setConfTc('16.00')
              setConfMetodo('Transferencia')
              setConfError('')
            }}"""
content = content.replace(old_btn_init, new_btn_init)

# 5. Reactivity update
old_recalc = """  const extrasModalTotal = confirmModal.solicitud ? getExtrasTotal(confirmModal.solicitud, confExtrasSelection) : 0;"""
new_recalc = """  const extrasModalTotal = getExtrasTotal(confExtras);"""
content = content.replace(old_recalc, new_recalc)

# 6. handleConfirmarReserva payload
old_submit = """      const extrasAmount = getExtrasTotal(sol, confExtrasSelection)
      const hospedajeAmount = parseFloat(confHospedaje || '0')
      const finalTotal = hospedajeAmount + extrasAmount
      
      const selectedExtras = (sol.servicios_extra || []).filter((_: any, idx: number) => confExtrasSelection[idx])
      const res = await aprobarSolicitud(
        sol.id, finalTotal, anticipo,
        confMetodo === 'Transferencia' ? 'transferencia_mxn' : 'efectivo_mxn',
        confMoneda, tc, selectedExtras
      )"""

new_submit = """      const extrasAmount = getExtrasTotal(confExtras)
      const hospedajeAmount = parseFloat(confHospedaje || '0')
      const finalTotal = hospedajeAmount + extrasAmount
      
      const finalExtrasList = Object.values(confExtras).filter(e => e.activo).map(e => {
        let finalQty = e.qty;
        let finalName = e.nombre;
        if (e.tipo_tarifa === 'por_trayecto') {
          finalQty = (e.ida ? 1 : 0) + (e.vuelta ? 1 : 0);
          const baseName = e.nombre.replace(/\\s*\\(Ida.*?\\)/g, '').trim();
          if (e.ida && e.vuelta) finalName = baseName + ' (Ida y Vuelta)';
          else if (e.ida) finalName = baseName + ' (Ida)';
          else if (e.vuelta) finalName = baseName + ' (Vuelta)';
        }
        return {
          id: e.id,
          nombre: finalName,
          qty: finalQty,
          precio_base: e.precio_base,
          tipo_tarifa: e.tipo_tarifa
        }
      }).filter(e => e.qty > 0);

      const res = await aprobarSolicitud(
        sol.id, finalTotal, anticipo,
        confMetodo === 'Transferencia' ? 'transferencia_mxn' : 'efectivo_mxn',
        confMoneda, tc, finalExtrasList
      )"""
content = content.replace(old_submit, new_submit)

# 7. Extras JSX rendering update
old_jsx_extras = """                <div className="border-t border-teal-200/60 pt-2">
                  <p className="font-semibold text-teal-900 mb-1">Servicios Adicionales:</p>
                  {Array.isArray(confirmModal.solicitud.servicios_extra) && confirmModal.solicitud.servicios_extra.length > 0 ? (
                    <ul className="text-xs text-gray-700 space-y-1">
                      {confirmModal.solicitud.servicios_extra.map((srv: any, idx: number) => (
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
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Sin servicios extra solicitados</p>
                  )}
                </div>"""

new_jsx_extras = """                <div className="border-t border-teal-200/60 pt-2">
                  <p className="font-semibold text-teal-900 mb-1">Catálogo de Servicios:</p>
                  {servicios.length > 0 ? (
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {servicios.map((srv: any) => {
                        const state = confExtras[srv.id] || { activo: false, id: srv.id, nombre: srv.nombre, precio_base: srv.precio_base, tipo_tarifa: srv.tipo_tarifa, qty: 1, ida: false, vuelta: false };
                        const isSel = state.activo;
                        
                        return (
                          <div key={srv.id} className={`p-2 rounded-lg border transition-colors ${isSel ? 'bg-teal-50/50 border-teal-200' : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`}>
                            <div className="flex items-start gap-2">
                              <input 
                                type="checkbox" 
                                className="mt-1 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                                checked={isSel}
                                onChange={(e) => {
                                  const activo = e.target.checked;
                                  setConfExtras({ ...confExtras, [srv.id]: { ...state, activo, ida: activo ? (state.ida || true) : state.ida } });
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <span className={`text-sm font-medium leading-tight ${!isSel ? 'text-gray-500' : 'text-gray-900'}`}>{srv.nombre}</span>
                                  <span className={`text-xs font-bold whitespace-nowrap ml-2 ${!isSel ? 'text-gray-400' : 'text-teal-700'}`}>
                                    +{formatPrice(srv.precio_base)}
                                  </span>
                                </div>
                                {isSel && srv.tipo_tarifa !== 'fijo' && (
                                  <div className="mt-1.5 flex items-center gap-2">
                                    {srv.tipo_tarifa === 'por_trayecto' ? (
                                      <div className="flex flex-col gap-1 w-full mt-1">
                                        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                          <input type="checkbox" className="rounded text-teal-600 w-3 h-3" checked={!!state.ida}
                                            onChange={(e) => setConfExtras({...confExtras, [srv.id]: {...state, ida: e.target.checked, activo: e.target.checked || state.vuelta}})} />
                                          Ida (Apto &rarr; Casa)
                                        </label>
                                        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                          <input type="checkbox" className="rounded text-teal-600 w-3 h-3" checked={!!state.vuelta}
                                            onChange={(e) => setConfExtras({...confExtras, [srv.id]: {...state, vuelta: e.target.checked, activo: state.ida || e.target.checked}})} />
                                          Vuelta (Casa &rarr; Apto)
                                        </label>
                                      </div>
                                    ) : (
                                      <>
                                        <span className="text-xs text-gray-600">Cantidad:</span>
                                        <input 
                                          type="number" min="1" value={state.qty}
                                          onChange={(e) => setConfExtras({...confExtras, [srv.id]: {...state, qty: parseInt(e.target.value)||1}})}
                                          className="w-16 h-6 text-xs rounded border-gray-300 px-2 bg-white"
                                        />
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No hay servicios en el catálogo</p>
                  )}
                </div>"""
content = content.replace(old_jsx_extras, new_jsx_extras)

# 8. Button method styling
old_buttons = """                      <button
                        key={m}
                        onClick={() => setConfMetodo(m)}
                        className={`flex-1 py-2 text-sm rounded-lg border font-medium transition-colors ${confMetodo === m ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400'}`}
                      >
                        {m === 'Transferencia' ? <ArrowRightLeft className="w-4 h-4 mr-2 inline" /> : <Banknote className="w-4 h-4 mr-2 inline" />} {m}
                      </button>"""

new_buttons = """                      <button
                        key={m}
                        onClick={() => setConfMetodo(m)}
                        className={`flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm rounded-lg border font-medium transition-colors ${confMetodo === m ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400'}`}
                      >
                        {m === 'Transferencia' ? <ArrowRightLeft className="w-4 h-4" /> : <Banknote className="w-4 h-4" />} {m}
                      </button>"""
content = content.replace(old_buttons, new_buttons)


with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
