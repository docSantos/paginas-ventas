import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"(<div className=\"bg-white p-3 rounded-lg border border-purple-200 mb-3 text-sm\">\s*\{\(\(\) => \{\s*).*?(\s*return \(\s*<>\s*)<div className=\"flex justify-between mb-1\">\s*<span className=\"text-gray-600 flex items-center gap-1\">Total Comisi.n.*?(<div className=\"flex justify-between mb-1\">\s*<span className=\"text-gray-600\">Comisi.n Pagada:</span>.*?</>\s*\)\s*\}\)\(\)\}\s*</div>)"

def replacer(m):
    return """<div className="bg-white p-3 rounded-lg border border-purple-200 mb-3 text-sm">
                                {(() => {
                                  const tarifaBase = Number(r.tarifa_base || 0);
                                  const montoTotalAcordado = Number(r.monto_total_acordado || r.costo_total || 0);
                                  const subtotalExtras = Math.max(0, montoTotalAcordado - tarifaBase);
                                  
                                  const comBase = tarifaBase * 0.025;
                                  const comExtras = subtotalExtras * 0.05;
                                  
                                  const comTotal = Number(r.monto_comision) || (comBase + comExtras);
                                  const comPagada = Number(r.comision_pagada) || 0;
                                  const comSaldo = comTotal - comPagada;
                                  return (
                                    <>
                                      <div className="flex justify-between mb-1">
                                        <span className="text-gray-600">Hospedaje base (2.5%):</span>
                                        <span className="font-medium text-gray-800">{formatPrice(comBase)}</span>
                                      </div>
                                      {subtotalExtras > 0 && (
                                        <div className="flex justify-between mb-2">
                                          <span className="text-gray-600">Servicios extras (5.0%):</span>
                                          <span className="font-medium text-gray-800">{formatPrice(comExtras)}</span>
                                        </div>
                                      )}
                                      <div className="pt-2 border-t border-purple-100 mt-2 mb-1 flex justify-between">
                                        <span className="text-gray-600">Total Comisión:</span>
                                        <span className="font-semibold text-purple-700">{formatPrice(comTotal)}</span>
                                      </div>
                                      """ + m.group(3)

content = re.sub(pattern, replacer, content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated comision card in ReservasClient")
