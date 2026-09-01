import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the `{isExpanded && (` block manually by indices to replace it correctly.

start_str = "{isExpanded && ("
end_str = ")}\n              </div>\n            )\n          })\n        )}\n      </div>"

# Find indices
start_idx = content.find(start_str)
# Find the next {editModal} or something after the isExpanded block to know where it ends.
# the expanded block ends before {/* Edit Modal */}
edit_modal_idx = content.find("{/* Edit Modal */}")

if start_idx != -1 and edit_modal_idx != -1:
    # We want to replace everything between start_idx and edit_modal_idx
    
    expanded_content = """{isExpanded && (
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
                                    <span className="text-gray-600 truncate max-w-[150px]">{t.concepto || 'Ingreso'}</span>
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
              </div>
            )
          })
        )}
      </div>

      """
    
    new_content = content[:start_idx] + expanded_content + content[edit_modal_idx:]
    with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
