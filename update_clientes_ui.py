import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update interfaces
interface_transaccion = """
interface Transaccion {
  id: string
  tipo: string
  monto: number
  monto_mxn: number
  moneda: string
  concepto: string
  fecha: string
  reserva_id: string
}
"""

content = re.sub(r"interface Cliente \{", interface_transaccion + "interface Cliente {\n  transacciones?: Transaccion[]\n", content)

# 2. Update `getMetrics` logic
old_metrics_pattern = r"const totalGenerado = validReservas\.reduce\(\(acc, r\) => acc \+ \(Number\(r\.monto_total_acordado\) \|\| 0\), 0\)"
new_metrics = """
    let totalGenerado = 0;
    let hasUSD = false;
    const ingresos = (c.transacciones || []).filter((t: any) => t.tipo === 'ingreso');

    if (ingresos.length > 0) {
      totalGenerado = ingresos.reduce((acc: number, t: any) => {
        if (t.moneda === 'USD') hasUSD = true;
        return acc + (Number(t.monto_mxn) || 0);
      }, 0);
    } else {
      totalGenerado = validReservas.reduce((acc: number, r: any) => acc + (Number(r.monto_apartado) || 0), 0);
    }
"""

content = re.sub(old_metrics_pattern, new_metrics, content)

old_return_metrics = r"return \{\s*totalGenerado,\s*estancias: validReservas\.length,\s*ultimaEstancia,\s*validReservas: sorted\s*\}"
new_return_metrics = """return {
      totalGenerado,
      estancias: validReservas.length,
      ultimaEstancia,
      validReservas: sorted,
      hasUSD,
      ingresos
    }"""
content = re.sub(old_return_metrics, new_return_metrics, content)

# 3. Update the Expanded view
# Find: {isExpanded && ( ... </div>\n                )}
old_expanded_start = r"\{isExpanded && \(\s*<div className=\"pt-2 pb-2\">"

expanded_content = """
                {isExpanded && (
                  <div className="pt-2 pb-2">
                    <div className="flex justify-between items-center mb-2 mt-2">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Historial de Reservas</h4>
                      {metrics.hasUSD && <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Incluye pagos en USD (al TC)</span>}
                    </div>
                    
                    {metrics.validReservas.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No hay reservas válidas.</p>
                    ) : (
                      <div className="space-y-3">
                        {metrics.validReservas.map(r => {
                          const resIngresos = metrics.ingresos.filter((t: any) => t.reserva_id === r.id);
                          
                          return (
                          <div key={r.id} className="bg-gray-50 p-2.5 rounded border border-gray-100 text-sm">
                            <div className="flex justify-between font-medium text-gray-800 mb-1">
                              <span>{r.propiedades?.titulo || 'Propiedad'}</span>
                              <span className="text-gray-500 text-xs">{formatDateEs(r.fecha_entrada)} al {formatDateEs(r.fecha_salida)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                              <span>Total Acordado: {formatPrice(r.monto_total_acordado || 0)}</span>
                              <span className="capitalize px-1.5 py-0.5 bg-gray-200 rounded">{r.estado}</span>
                            </div>
                            
                            {/* Historial de Transacciones */}
                            {resIngresos.length > 0 ? (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Abonos / Ingresos</span>
                                {resIngresos.map((t: any) => (
                                  <div key={t.id} className="flex justify-between text-xs py-0.5">
                                    <span className="text-gray-600">{t.concepto || 'Ingreso'} - {formatDateEs(t.fecha)}</span>
                                    <span className="text-teal-600 font-medium">+{formatPrice(t.monto_mxn)} {t.moneda === 'USD' ? '(USD)' : ''}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-400 italic">
                                No hay transacciones registradas.
                              </div>
                            )}
                          </div>
                        )})}
                      </div>
                    )}
                  </div>
                )}
"""

# Because regex with huge multi-line HTML can be error-prone, let's just do a string replacement for the entire isExpanded block.
# Wait, let's find the boundaries in the existing file.
"""
                {isExpanded && (
                  <div className="pt-2 pb-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 mt-2 tracking-wider">Historial de Reservas</h4>
                    {metrics.validReservas.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No hay reservas válidas.</p>
                    ) : (
                      <div className="space-y-2">
                        {metrics.validReservas.map(r => (
                          <div key={r.id} className="bg-gray-50 p-2.5 rounded border border-gray-100 text-sm">
                            <div className="flex justify-between font-medium text-gray-800 mb-1">
                              <span>{r.propiedades?.titulo || 'Propiedad'}</span>
                              <span className="text-teal-700">{formatPrice(r.monto_total_acordado || 0)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{formatDateEs(r.fecha_entrada)} al {formatDateEs(r.fecha_salida)}</span>
                              <span className="capitalize">{r.estado}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
"""
content = re.sub(
    r"\{isExpanded && \(\s*<div className=\"pt-2 pb-2\">.*?</div>\s*\)\s*\)\}\s*</div>\s*\)\s*\}\s*\)\s*\)\}\s*</div>",
    expanded_content + "              </div>\n            )\n          })\n        )}\n      </div>",
    content,
    flags=re.DOTALL
)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
