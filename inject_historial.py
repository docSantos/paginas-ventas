import os

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import_statement = "import { format, parseISO } from 'date-fns'\nimport { es } from 'date-fns/locale'"
if "from 'date-fns'" not in content:
    content = content.replace("import Link from 'next/link'", "import Link from 'next/link'\n" + import_statement)

# Now, perform regex replacement to inject the transacciones dropdown block
import re

target_regex = r'<div className="flex justify-between">\s*<span className="text-gray-600">Pagado \(MXN\):</span>\s*<span className="font-semibold text-teal-600">\{formatPrice\(r\.monto_apartado \|\| 0\)\}</span>\s*</div>'

replacement = """<div className="flex justify-between">
                              <span className="text-gray-600">Pagado (MXN):</span>
                              <span className="font-semibold text-teal-600">{formatPrice(r.monto_apartado || 0)}</span>
                            </div>
                            {r.transacciones && r.transacciones.filter((t: any) => t.tipo === 'ingreso').length > 0 && (
                              <details className="mt-2 text-xs">
                                <summary className="font-semibold text-indigo-600 cursor-pointer pt-2 border-t border-indigo-50">
                                  Ver historial de pagos ({r.transacciones.filter((t: any) => t.tipo === 'ingreso').length})
                                </summary>
                                <div className="pt-2 space-y-1.5">
                                  {r.transacciones.filter((t: any) => t.tipo === 'ingreso').map((t: any, idx: number) => (
                                    <div key={idx} className="flex justify-between border-b border-gray-50 pb-1">
                                      <div>
                                        <div className="font-medium text-gray-700">{formatPrice(t.monto_mxn || t.monto)}</div>
                                        <div className="text-[10px] text-gray-400 capitalize">{t.metodo_pago ? t.metodo_pago.replace('_', ' ') : 'Desconocido'}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-gray-500">{t.concepto || 'Abono'}</div>
                                        <div className="text-[10px] text-gray-400">{(t.created_at || t.fecha) ? format(parseISO(t.created_at || t.fecha || new Date().toISOString()), 'dd/MM/yy HH:mm', { locale: es }) : 'Reciente'}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            )}"""

# Replace all occurrences
content, count = re.subn(target_regex, replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"Replaced {count} occurrences in ReservasClient.tsx")
