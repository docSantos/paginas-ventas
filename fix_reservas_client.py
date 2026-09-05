import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix handleAbrirAprobar to parse JSON safely, calculate correct base price, and set extra quantities.
find_abrir = """    const handleAbrirAprobar = (solicitud: any) => {
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
          defaultExtras[e.id] = e.qty || e.cantidad || 1
        })
      }
      setExtraQuantities(defaultExtras)
    }"""

replace_abrir = """    const handleAbrirAprobar = (solicitud: any) => {
      setAprobarModal({ open: true, solicitud })
      
      let parsedExtras: any[] = [];
      if (typeof solicitud.servicios_extra === 'string') {
        try { parsedExtras = JSON.parse(solicitud.servicios_extra); } catch(e) {}
      } else if (Array.isArray(solicitud.servicios_extra)) {
        parsedExtras = solicitud.servicios_extra;
      }
      
      const defaultExtras: Record<string, number> = {}
      let sumaExtrasIniciales = 0;
      
      parsedExtras.forEach((e: any) => {
        const extraId = e.servicio_id || e.id;
        if (extraId) {
           const qty = e.qty || e.cantidad || 1;
           defaultExtras[extraId] = qty;
           
           // Calculate initial extra cost to deduce base
           const servCat = servicios.find(s => s.id === extraId);
           if (servCat && servCat.tipo_tarifa !== 'por_km') {
             sumaExtrasIniciales += (servCat.precio_base || 0) * qty;
           }
        }
      })
      
      const totalAcordado = parseFloat(solicitud.costo_total || 0)
      const baseHospedaje = Math.max(0, totalAcordado - sumaExtrasIniciales)
      
      setPrecioBaseHospedaje(baseHospedaje)
      setMontoAcordado(totalAcordado.toString())
      setMontoAnticipo((solicitud.monto_apartado || 0).toString())
      setMetodoPago('transferencia_mxn')
      
      setExtraQuantities(defaultExtras)
    }"""

content = content.replace(find_abrir, replace_abrir)

# Update the UI display to show the details of selected extra
find_ui = """                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <span className="text-sm font-medium text-gray-900 leading-tight">{s.nombre}</span>
                                  <span className="text-xs font-bold text-teal-700 whitespace-nowrap ml-2">
                                    +{formatPrice(s.precio_base)}
                                  </span>
                                </div>
                                {s.descripcion && <span className="text-xs text-gray-500 leading-tight block mt-0.5">{s.descripcion}</span>}
                              </div>"""

replace_ui = """                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <span className="text-sm font-medium text-gray-900 leading-tight">{s.nombre}</span>
                                  <span className="text-xs font-bold text-teal-700 whitespace-nowrap ml-2">
                                    {s.tipo_tarifa === 'por_km' ? `Desde ${formatPrice(s.precio_base)}` : `+${formatPrice(s.precio_base)}`}
                                  </span>
                                </div>
                                {s.descripcion && <span className="text-xs text-gray-500 leading-tight block mt-0.5">{s.descripcion}</span>}
                                {isSel && s.tipo_tarifa !== 'fijo' && s.tipo_tarifa !== 'por_km' && (
                                  <span className="text-[10px] text-teal-600 font-medium block mt-1">Seleccionado: {extraQuantities[s.id]} {s.tipo_tarifa === 'por_dia' ? 'día(s)' : 'trayecto(s)'}</span>
                                )}
                                {isSel && s.tipo_tarifa === 'por_km' && (
                                  <span className="text-[10px] text-teal-600 font-medium block mt-1">Requiere cotización de ruta final</span>
                                )}
                              </div>"""

content = content.replace(find_ui, replace_ui)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
