import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update props type and signature
content = content.replace(
    "interface PropertyDetailClientProps {\n  propiedad: Propiedad\n  isDemo?: boolean\n  reservas?: Pick<Reserva, 'fecha_entrada' | 'fecha_salida'>[]\n  adminPhone?: string\n}",
    "interface PropertyDetailClientProps {\n  propiedad: Propiedad\n  isDemo?: boolean\n  reservas?: Pick<Reserva, 'fecha_entrada' | 'fecha_salida'>[]\n  adminPhone?: string\n  servicios?: any[]\n}"
)
content = content.replace(
    "export function PropertyDetailClient({ propiedad, isDemo = false, reservas = [], adminPhone }: PropertyDetailClientProps) {",
    "export function PropertyDetailClient({ propiedad, isDemo = false, reservas = [], adminPhone, servicios = [] }: PropertyDetailClientProps) {"
)

# 2. Add extra services state
content = content.replace(
    "const [huespedes, setHuespedes] = useState(1)",
    "const [huespedes, setHuespedes] = useState(1)\n  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>({})"
)

# 3. Update cotizacion logic
old_cotizacion = """    const noches = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (noches <= 0) {
      setErrorFechas('La fecha de salida debe ser posterior a la de llegada')
      return null
    }

    let total = 0
    let breakdown = ''

    if (noches >= 28 && propiedad.precio_por_mes) {
      const meses = Math.floor(noches / 28)
      const nochesRestantes = noches % 28
      total = (meses * propiedad.precio_por_mes) + (nochesRestantes * propiedad.precio_por_noche)
      breakdown = `${meses} mes(es) + ${nochesRestantes} noche(s)`
    } else if (noches >= 7 && propiedad.precio_por_semana) {
      const semanas = Math.floor(noches / 7)
      const nochesRestantes = noches % 7
      total = (semanas * propiedad.precio_por_semana) + (nochesRestantes * propiedad.precio_por_noche)
      breakdown = `${semanas} semana(s) + ${nochesRestantes} noche(s)`
    } else {
      total = noches * propiedad.precio_por_noche
      breakdown = `${noches} noche(s) x ${formatPrice(propiedad.precio_por_noche)}`
    }

    return {
      noches,
      total,
      anticipo: total / 2,
      breakdown
    }
  }, [fechaEntrada, fechaSalida, propiedad, reservas])"""

new_cotizacion = """    const noches = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (noches <= 0) {
      setErrorFechas('La fecha de salida debe ser posterior a la de llegada')
      return null
    }

    let total = 0
    let breakdown = ''

    if (noches >= 28 && propiedad.precio_por_mes) {
      const meses = Math.floor(noches / 28)
      const nochesRestantes = noches % 28
      total = (meses * propiedad.precio_por_mes) + (nochesRestantes * propiedad.precio_por_noche)
      breakdown = `${meses} mes(es) + ${nochesRestantes} noche(s)`
    } else if (noches >= 7 && propiedad.precio_por_semana) {
      const semanas = Math.floor(noches / 7)
      const nochesRestantes = noches % 7
      total = (semanas * propiedad.precio_por_semana) + (nochesRestantes * propiedad.precio_por_noche)
      breakdown = `${semanas} semana(s) + ${nochesRestantes} noche(s)`
    } else {
      total = noches * propiedad.precio_por_noche
      breakdown = `${noches} noche(s) x ${formatPrice(propiedad.precio_por_noche)}`
    }
    
    // Add extra services cost
    let extrasTotal = 0;
    Object.keys(selectedExtras).forEach(servId => {
      const serv = servicios.find(s => s.id === servId);
      if (serv && selectedExtras[servId] > 0) {
        const qty = selectedExtras[servId];
        const cost = serv.tipo_tarifa === 'fijo' ? Number(serv.precio_base) : (Number(serv.precio_base) * qty);
        extrasTotal += cost;
      }
    });

    return {
      noches,
      total: total + extrasTotal,
      anticipo: (total + extrasTotal) / 2,
      breakdown,
      baseTotal: total,
      extrasTotal
    }
  }, [fechaEntrada, fechaSalida, propiedad, reservas, selectedExtras, servicios])"""

content = content.replace(old_cotizacion, new_cotizacion)

# 4. Update submit API payload
old_body = """          body: JSON.stringify({
            propiedad_id: propiedad.id,
            titulo_propiedad: propiedad.titulo,
            nombre_cliente: formData.nombre,
            telefono: `${lada}${formData.telefono.replace(/\D/g, '')}`,
            email: formData.correo,
            fecha_entrada: fechaEntrada,
            fecha_salida: fechaSalida,
            num_huespedes: huespedes,
            noches: cotizacion.noches,
            costo_total: cotizacion.total,
            monto_apartado: cotizacion.anticipo
          })"""
new_body = """          body: JSON.stringify({
            propiedad_id: propiedad.id,
            titulo_propiedad: propiedad.titulo,
            nombre_cliente: formData.nombre,
            telefono: `${lada}${formData.telefono.replace(/\D/g, '')}`,
            email: formData.correo,
            fecha_entrada: fechaEntrada,
            fecha_salida: fechaSalida,
            num_huespedes: huespedes,
            noches: cotizacion.noches,
            costo_total: cotizacion.total,
            monto_apartado: cotizacion.anticipo,
            servicios_extra: Object.keys(selectedExtras).map(id => ({
              id,
              qty: selectedExtras[id],
              nombre: servicios.find(s => s.id === id)?.nombre,
              precio_base: servicios.find(s => s.id === id)?.precio_base,
              tipo_tarifa: servicios.find(s => s.id === id)?.tipo_tarifa
            })).filter(s => s.qty > 0)
          })"""
content = content.replace(old_body, new_body)

# Update WhatsApp string
old_wa = """const waText = `¡Hola! Me interesa rentar ${propiedad.titulo}.\\n\\nFechas: ${fechaEntrada} al ${fechaSalida}\\nHuéspedes: ${huespedes}\\nNombre: ${formData.nombre}\\nTeléfono: ${lada}${formData.telefono}\\nCorreo: ${formData.correo}\\n\\nAnticipo estimado: ${formatPrice(cotizacion.anticipo)}\\nTotal estimado: ${formatPrice(cotizacion.total)}`;"""
new_wa = """let extrasText = '';
        const activeExtras = Object.keys(selectedExtras).filter(k => selectedExtras[k] > 0);
        if (activeExtras.length > 0) {
          extrasText = '\\nExtras:\\n' + activeExtras.map(k => `- ${servicios.find(s => s.id === k)?.nombre}`).join('\\n') + '\\n';
        }
        const waText = `¡Hola! Me interesa rentar ${propiedad.titulo}.\\n\\nFechas: ${fechaEntrada} al ${fechaSalida}\\nHuéspedes: ${huespedes}\\nNombre: ${formData.nombre}\\nTeléfono: ${lada}${formData.telefono}\\nCorreo: ${formData.correo}\\n${extrasText}\\nAnticipo estimado: ${formatPrice(cotizacion.anticipo)}\\nTotal estimado: ${formatPrice(cotizacion.total)}`;"""
content = content.replace(old_wa, new_wa)

# 5. Render extra services block in UI
insert_point = """          {reservas.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 text-sm rounded-xl border border-red-100">"""

extra_services_jsx = """          {servicios && servicios.length > 0 && (
            <div className="mb-4 pt-4 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Personaliza tu estancia con servicios extra
              </label>
              <div className="space-y-2">
                {servicios.map((serv: any) => {
                  const isSelected = selectedExtras[serv.id] > 0;
                  return (
                    <div key={serv.id} className={`p-3 border rounded-xl flex flex-col gap-2 transition-colors ${isSelected ? 'bg-teal-50 border-teal-200' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-start gap-3">
                        <input 
                          type="checkbox"
                          className="mt-1 rounded text-teal-600 focus:ring-teal-500"
                          checked={isSelected}
                          onChange={(e) => {
                            setSelectedExtras(prev => ({
                              ...prev,
                              [serv.id]: e.target.checked ? 1 : 0
                            }))
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{serv.nombre}</p>
                          <p className="text-xs text-gray-500">{serv.descripcion}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-teal-700">+{formatPrice(serv.precio_base)}</p>
                          <p className="text-[10px] text-gray-400">{serv.tipo_tarifa === 'fijo' ? 'Total' : 'c/u'}</p>
                        </div>
                      </div>
                      
                      {isSelected && serv.tipo_tarifa === 'por_noche' && (
                        <div className="ml-7 flex items-center gap-3">
                          <span className="text-xs text-gray-600">Cantidad:</span>
                          <div className="flex items-center gap-2">
                            <button className="w-6 h-6 rounded-md border border-gray-300 flex items-center justify-center bg-white text-gray-600 text-sm" onClick={() => setSelectedExtras(prev => ({...prev, [serv.id]: Math.max(1, (prev[serv.id] || 1) - 1)}))}>-</button>
                            <span className="text-sm font-medium w-4 text-center">{selectedExtras[serv.id]}</span>
                            <button className="w-6 h-6 rounded-md border border-gray-300 flex items-center justify-center bg-white text-gray-600 text-sm" onClick={() => setSelectedExtras(prev => ({...prev, [serv.id]: (prev[serv.id] || 1) + 1}))}>+</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          
"""

content = content.replace(insert_point, extra_services_jsx + insert_point)

# Update cotizacion UI
old_cot_ui = """                <div className="flex justify-between text-gray-600 text-sm mb-2">
                  <span>{cotizacion.breakdown}</span>
                  <span>{formatPrice(cotizacion.total)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-lg">
                  <span>Total estimado</span>
                  <span>{formatPrice(cotizacion.total)}</span>
                </div>"""
new_cot_ui = """                <div className="flex justify-between text-gray-600 text-sm mb-2">
                  <span>{cotizacion.breakdown}</span>
                  <span>{formatPrice(cotizacion.baseTotal)}</span>
                </div>
                {cotizacion.extrasTotal > 0 && (
                  <div className="flex justify-between text-teal-700 text-sm mb-2">
                    <span>Servicios extra</span>
                    <span>+{formatPrice(cotizacion.extrasTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-lg">
                  <span>Total estimado</span>
                  <span>{formatPrice(cotizacion.total)}</span>
                </div>"""
content = content.replace(old_cot_ui, new_cot_ui)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
