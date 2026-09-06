import re

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

calc_logic_replacement = """    let nochesEfectivas = differenceInDays(new Date(), parseISO(r.fecha_entrada))
    if (nochesEfectivas <= 0) nochesEfectivas = 1
    
    const nochesOriginales = differenceInDays(parseISO(r.fecha_salida), parseISO(r.fecha_entrada))
    const costoOriginal = Number(r.monto_total_acordado) || Number(r.costo_total) || 0
    let precioNoche = Number(r.propiedades?.precio_por_noche) || (costoOriginal / nochesOriginales) || 0
    
    let extras = costoOriginal - (nochesOriginales * precioNoche)
    if (extras < 0) {
      precioNoche = costoOriginal / nochesOriginales
      extras = 0
    }
    
    const costoHospedaje = parseFloat((nochesEfectivas * precioNoche).toFixed(2))
    const nuevoCosto = parseFloat((costoHospedaje + extras).toFixed(2))
    
    const saldoOriginal = getSaldo(r)
    const totalAbonado = parseFloat((costoOriginal - saldoOriginal).toFixed(2))
    
    const nuevoSaldo = parseFloat((nuevoCosto - totalAbonado).toFixed(2))"""

# Replace in `procesarAnticipado`
old_procesar_logic = r"""    let nochesEfectivas = differenceInDays\(new Date\(\), parseISO\(r\.fecha_entrada\)\)
    if \(nochesEfectivas <= 0\) nochesEfectivas = 1
    
    const nochesOriginales = differenceInDays\(parseISO\(r\.fecha_salida\), parseISO\(r\.fecha_entrada\)\)
    const precioNoche = Number\(r\.propiedades\?\.precio_por_noche\) \|\| \(Number\(r\.costo_total\) / nochesOriginales\) \|\| 0
    const nuevoCosto = parseFloat\(\(nochesEfectivas \* precioNoche\)\.toFixed\(2\)\)
    
    const saldoOriginal = getSaldo\(r\)
    const totalAbonado = \(Number\(r\.monto_total_acordado\) \|\| Number\(r\.costo_total\) \|\| 0\) - saldoOriginal
    
    const nuevoSaldo = nuevoCosto - totalAbonado"""

content = re.sub(old_procesar_logic, calc_logic_replacement, content, count=1)

# Now, we need to update the UI render in `{modalAnticipado && (() => {`
# The render logic is essentially the same, plus the UI for extras.
ui_logic_old = r"""          let nochesEfectivas = differenceInDays\(new Date\(\), parseISO\(r\.fecha_entrada\)\)
          if \(nochesEfectivas <= 0\) nochesEfectivas = 1
          
          const nochesOriginales = differenceInDays\(parseISO\(r\.fecha_salida\), parseISO\(r\.fecha_entrada\)\)
          const precioNoche = Number\(r\.propiedades\?\.precio_por_noche\) \|\| \(Number\(r\.costo_total\) / nochesOriginales\) \|\| 0
          const nuevoCosto = parseFloat\(\(nochesEfectivas \* precioNoche\)\.toFixed\(2\)\)
          
          const saldoOriginal = getSaldo\(r\)
          const totalAbonado = \(Number\(r\.monto_total_acordado\) \|\| Number\(r\.costo_total\) \|\| 0\) - saldoOriginal
          const nuevoSaldo = nuevoCosto - totalAbonado

          return \("""

ui_logic_new = """          let nochesEfectivas = differenceInDays(new Date(), parseISO(r.fecha_entrada))
          if (nochesEfectivas <= 0) nochesEfectivas = 1
          
          const nochesOriginales = differenceInDays(parseISO(r.fecha_salida), parseISO(r.fecha_entrada))
          const costoOriginal = Number(r.monto_total_acordado) || Number(r.costo_total) || 0
          let precioNoche = Number(r.propiedades?.precio_por_noche) || (costoOriginal / nochesOriginales) || 0
          
          let extras = costoOriginal - (nochesOriginales * precioNoche)
          if (extras < 0) {
            precioNoche = costoOriginal / nochesOriginales
            extras = 0
          }
          
          const costoHospedaje = parseFloat((nochesEfectivas * precioNoche).toFixed(2))
          const nuevoCosto = parseFloat((costoHospedaje + extras).toFixed(2))
          
          const saldoOriginal = getSaldo(r)
          const totalAbonado = parseFloat((costoOriginal - saldoOriginal).toFixed(2))
          const nuevoSaldo = parseFloat((nuevoCosto - totalAbonado).toFixed(2))

          return ("""

content = re.sub(ui_logic_old, ui_logic_new, content)

# Now update the UI display to include the breakdown
breakdown_old = r"""                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Noches habitadas \(reales\):</span>
                      <span className="font-semibold text-gray-900">\{nochesEfectivas\} de \{nochesOriginales\}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tarifa recalculada:</span>
                      <span className="font-semibold text-gray-900">\{formatPrice\(nuevoCosto\)\}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total abonado a la fecha:</span>
                      <span className="font-semibold text-gray-900">\{formatPrice\(totalAbonado\)\}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                      <span className="font-bold text-gray-900">Nuevo saldo pendiente:</span>
                      <span className=\{`font-bold \$\{nuevoSaldo > 0 \? 'text-red-600' : 'text-green-600'\}`\}>
                        \{nuevoSaldo > 0 \? formatPrice\(nuevoSaldo\) : 'Todo Pagado / A favor'\}
                      </span>
                    </div>
                  </div>"""

breakdown_new = """                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hospedaje consumido:</span>
                      <span className="font-semibold text-gray-900">{nochesEfectivas} × {formatPrice(precioNoche)} = {formatPrice(costoHospedaje)}</span>
                    </div>
                    {extras > 0 && (
                      <div className="flex justify-between text-indigo-700">
                        <span>Servicios/Extras fijos (Transporte, etc.):</span>
                        <span className="font-semibold">+{formatPrice(extras)}</span>
                      </div>
                    )}
                    <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                      <span className="font-bold text-gray-900">Total reajustado:</span>
                      <span className="font-bold text-gray-900">{formatPrice(nuevoCosto)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Menos abonos registrados:</span>
                      <span className="font-semibold">-{formatPrice(totalAbonado)}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                      <span className="font-bold text-gray-900">Saldo pendiente final:</span>
                      <span className={`font-bold ${nuevoSaldo > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {nuevoSaldo > 0 ? formatPrice(nuevoSaldo) : 'Todo Pagado / A favor'}
                      </span>
                    </div>
                  </div>"""

content = re.sub(breakdown_old, breakdown_new, content)

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
