import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add `extraQuantities` state and `precioBaseHospedaje`
state_injection = """  const [montoAcordado, setMontoAcordado] = useState('')
  const [precioBaseHospedaje, setPrecioBaseHospedaje] = useState(0)
  const [extraQuantities, setExtraQuantities] = useState<Record<string, number>>({})"""

content = re.sub(r"const \[montoAcordado, setMontoAcordado\] = useState\(''\)", state_injection, content)

# 2. Update `handleAbrirAprobar`
old_handle_abrir = r"const handleAbrirAprobar = \(solicitud: any\) => \{\n\s+setAprobarModal\(\{ open: true, solicitud \}\)\n\s+setMontoAcordado\(\(solicitud\.costo_total \|\| 0\)\.toString\(\)\)\n\s+setMontoAnticipo\(\(solicitud\.monto_apartado \|\| 0\)\.toString\(\)\)\n\s+setMetodoPago\('transferencia_mxn'\)\n\s+\}"

new_handle_abrir = """const handleAbrirAprobar = (solicitud: any) => {
    setAprobarModal({ open: true, solicitud })
    const base = parseFloat(solicitud.costo_total || 0)
    setPrecioBaseHospedaje(base)
    setMontoAcordado(base.toString())
    setMontoAnticipo((solicitud.monto_apartado || 0).toString())
    setMetodoPago('transferencia_mxn')
    
    // Si la solicitud trae servicios solicitados pre-cargados
    const defaultExtras: Record<string, number> = {}
    if (solicitud.servicios_extra && Array.isArray(solicitud.servicios_extra)) {
      solicitud.servicios_extra.forEach((e: any) => {
        defaultExtras[e.id] = e.cantidad || 1
      })
    }
    setExtraQuantities(defaultExtras)
  }
  
  // Helper to recalculate total
  const recalcularMontoAcordado = (base: number, cantidades: Record<string, number>) => {
    let sumaExtras = 0;
    Object.keys(cantidades).forEach(id => {
      const serv = servicios.find(s => s.id === id);
      if (serv) {
        sumaExtras += (serv.precio_base || 0) * cantidades[id];
      }
    });
    setMontoAcordado((base + sumaExtras).toString());
  }

  const toggleExtra = (servicio: any, checked: boolean) => {
    setExtraQuantities(prev => {
      const next = { ...prev };
      if (checked) {
        next[servicio.id] = 1;
      } else {
        delete next[servicio.id];
      }
      recalcularMontoAcordado(precioBaseHospedaje, next);
      return next;
    });
  }

  const updateExtraQty = (servicio: any, qty: number) => {
    if (qty < 1) qty = 1;
    setExtraQuantities(prev => {
      const next = { ...prev, [servicio.id]: qty };
      recalcularMontoAcordado(precioBaseHospedaje, next);
      return next;
    });
  }
  """

content = re.sub(old_handle_abrir, new_handle_abrir, content)

# 3. Modify `handleConfirmarAprobar` payload
old_handle_confirm = r"await aprobarSolicitud\(\n\s+aprobarModal\.solicitud\.id,\n\s+parseFloat\(montoAcordado \|\| '0'\),\n\s+parseFloat\(montoAnticipo \|\| '0'\),\n\s+metodoPago,\n\s+moneda,\n\s+parseFloat\(tc \|\| '1'\)\n\s+\)"

new_handle_confirm = """
        const extrasPayload = Object.keys(extraQuantities).map(id => {
          const serv = servicios.find((s: any) => s.id === id);
          if (!serv) return null;
          const qty = extraQuantities[id];
          return {
            id: serv.id,
            concepto: `${serv.nombre} ${serv.tipo_tarifa !== 'fijo' ? `(x${qty})` : ''}`.trim(),
            monto: Number(serv.precio_base) * (serv.tipo_tarifa !== 'fijo' ? qty : 1),
            porcentaje_comision: serv.porcentaje_comision || tenantExtras
          }
        }).filter(Boolean);

        // Calculate the base without the extras since we pass `montoAcordado` as the base stay price, and `extras` separately!
        // Wait, the API `aprobarSolicitud` expects `montoAcordado` to be just the stay base, because it does: 
        // `nuevoTotalAcordado = montoAcordado + sumaExtras`.
        // So we should pass `precioBaseHospedaje` instead of `montoAcordado` which is currently Base + Extras!
        // But what if the admin edited `montoAcordado` manually? We should compute `editedBase = currentMontoAcordado - sumaExtras`.
        const currentMonto = parseFloat(montoAcordado || '0');
        const sumaExtras = extrasPayload.reduce((sum, e) => sum + (e?.monto || 0), 0);
        const baseCalculada = currentMonto - sumaExtras;

        await aprobarSolicitud(
          aprobarModal.solicitud.id,
          baseCalculada,
          parseFloat(montoAnticipo || '0'),
          metodoPago,
          moneda,
          parseFloat(tc || '1'),
          extrasPayload
        )"""

content = re.sub(old_handle_confirm, new_handle_confirm, content)


# 4. Add UI checkboxes to the Modal
# Before `<div className="grid grid-cols-2 gap-4">`
old_modal_content = r"<div className=\"grid grid-cols-2 gap-4\">"
new_modal_content = """<div className="grid grid-cols-2 gap-4">"""

# wait, I'll find `<div>\n                <label className="text-sm font-medium block mb-1">Monto Total Acordado (MXN)</label>`
# and inject the UI after that whole div.

old_monto_div = r"<div>\s*<label className=\"text-sm font-medium block mb-1\">Monto Total Acordado \(MXN\)</label>\s*<Input type=\"number\" value=\{montoAcordado\} onChange=\{e => setMontoAcordado\(e\.target\.value\)\} />\s*</div>"

new_monto_div = """<div>
                <label className="text-sm font-medium block mb-1">Monto Total Acordado (MXN)</label>
                <Input type="number" value={montoAcordado} onChange={e => {
                  setMontoAcordado(e.target.value);
                  // Opcional: ajustar precioBaseHospedaje inversamente para mantener consistencia, pero dejaremos que el admin teclee libre.
                }} />
              </div>

              {servicios.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Servicios Adicionales (Catálogo)</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {servicios.map((s: any) => {
                      const isSel = !!extraQuantities[s.id];
                      return (
                        <div key={s.id} className="flex flex-col gap-1 p-2 bg-white border border-gray-100 rounded shadow-sm">
                          <div className="flex items-start gap-2">
                            <input 
                              type="checkbox" 
                              className="mt-1 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                              checked={isSel}
                              onChange={e => toggleExtra(s, e.target.checked)}
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <span className="text-sm font-medium text-gray-900 leading-tight">{s.nombre}</span>
                                <span className="text-xs font-bold text-teal-700 whitespace-nowrap ml-2">
                                  +{formatPrice(s.precio_base)}
                                </span>
                              </div>
                              {s.descripcion && <span className="text-xs text-gray-500 leading-tight block mt-0.5">{s.descripcion}</span>}
                            </div>
                          </div>
                          {isSel && s.tipo_tarifa !== 'fijo' && (
                            <div className="ml-6 flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-600">Cantidad (Días/Viajes):</span>
                              <input 
                                type="number" 
                                min="1" 
                                value={extraQuantities[s.id]} 
                                onChange={e => updateExtraQty(s, parseInt(e.target.value) || 1)}
                                className="w-16 h-7 text-xs rounded border-gray-300 px-2"
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}"""

content = re.sub(old_monto_div, new_monto_div, content)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
