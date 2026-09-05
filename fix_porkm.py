import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. FIX EXTRAS TOTAL
find_total = """        if (serv && val && val.activo) {
          if (serv.tipo_tarifa === 'por_dia') {
            extrasTotal += Number(serv.precio_base) * (val.qty || 1);
          } else if (serv.tipo_tarifa === 'por_trayecto') {
            let count = 0;
            if (val.ida) count++;
            if (val.vuelta) count++;
            extrasTotal += Number(serv.precio_base) * count;
          } else {
            extrasTotal += Number(serv.precio_base);
          }
        }"""
replace_total = """        if (serv && val && val.activo) {
          if (serv.tipo_tarifa === 'por_dia') {
            extrasTotal += Number(serv.precio_base) * (val.qty || 1);
          } else if (serv.tipo_tarifa === 'por_trayecto') {
            let count = 0;
            if (val.ida) count++;
            if (val.vuelta) count++;
            extrasTotal += Number(serv.precio_base) * count;
          } else if (serv.tipo_tarifa === 'por_km') {
            extrasTotal += 0;
          } else {
            extrasTotal += Number(serv.precio_base);
          }
        }"""
content = content.replace(find_total, replace_total)

# 2. FIX PAYLOAD BUILDER
find_payload = """          if (s.tipo_tarifa === 'por_dia') {
            finalQty = val.qty || 1;
          } else if (s.tipo_tarifa === 'por_trayecto') {
            finalQty = (val.ida ? 1 : 0) + (val.vuelta ? 1 : 0);
            if (finalQty === 0) return null;
            if (val.ida && val.vuelta) finalName += ' (Ida y Vuelta)';
            else if (val.ida) finalName += ' (Ida)';
            else if (val.vuelta) finalName += ' (Vuelta)';
          }
          return {"""
replace_payload = """          if (s.tipo_tarifa === 'por_dia') {
            finalQty = val.qty || 1;
          } else if (s.tipo_tarifa === 'por_trayecto') {
            finalQty = (val.ida ? 1 : 0) + (val.vuelta ? 1 : 0);
            if (finalQty === 0) return null;
            if (val.ida && val.vuelta) finalName += ' (Ida y Vuelta)';
            else if (val.ida) finalName += ' (Ida)';
            else if (val.vuelta) finalName += ' (Vuelta)';
          } else if (s.tipo_tarifa === 'por_km') {
            finalName += ' (Requiere cotización de ruta)';
          }
          return {"""
content = content.replace(find_payload, replace_payload)

# 3. FIX UI RENDER
find_ui = """                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{serv.nombre}</p>
                          <p className="text-xs text-gray-500">{serv.tipo_tarifa === 'por_dia' ? 'Por día' : (serv.tipo_tarifa === 'por_trayecto' ? 'Por trayecto' : 'Pago único')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-teal-700">+{formatPrice(serv.precio_base)}</p>
                          <p className="text-[10px] text-gray-400">
                            {serv.tipo_tarifa === 'por_dia' ? 'x día' : (serv.tipo_tarifa === 'por_trayecto' ? 'c/u' : 'Total')}
                          </p>
                        </div>
                      </div>"""

# Note: the user text has `` due to encodings. But wait, in fix_layout.py I rewrote it! So it's correctly "Por día", "Pago único" etc.
# Wait, let's use regex to find the UI safely just in case.

replace_ui = """                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{serv.nombre}</p>
                          <p className="text-xs text-gray-500">
                            {serv.tipo_tarifa === 'por_dia' ? 'Por día' : 
                             (serv.tipo_tarifa === 'por_trayecto' ? 'Por trayecto' : 
                             (serv.tipo_tarifa === 'por_km' ? 'Saliendo de Puerto Morelos. Ref: Pto Morelos - Xcaret aprox. 43 km (a cotizar según destino final).' : 'Pago único'))}
                          </p>
                        </div>
                        <div className="text-right">
                          {serv.tipo_tarifa === 'por_km' ? (
                             <>
                               <p className="text-sm font-semibold text-teal-700">Desde {formatPrice(serv.precio_base)}</p>
                               <p className="text-[10px] text-gray-400">/ km</p>
                             </>
                          ) : (
                             <>
                               <p className="text-sm font-semibold text-teal-700">+{formatPrice(serv.precio_base)}</p>
                               <p className="text-[10px] text-gray-400">
                                 {serv.tipo_tarifa === 'por_dia' ? 'x día' : (serv.tipo_tarifa === 'por_trayecto' ? 'c/u' : 'Total')}
                               </p>
                             </>
                          )}
                        </div>
                      </div>"""

import re
content = re.sub(r'<div className="flex-1">\s*<p className="text-sm font-medium text-gray-900">\{serv\.nombre\}<\/p>.*?<\/div>\s*<\/div>', replace_ui, content, flags=re.DOTALL)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
