import re

filepath = 'src/components/casasgaby/admin/FinanzasClient.tsx'
with open(filepath, 'r', encoding='utf8') as f:
    content = f.read()

target = r'<td className="px-4 py-3 text-right font-bold text-gray-900">\s*\{formatPrice\(p\.monto_mxn \|\| p\.monto\)\}\s*</td>'
replacement = r'''<td className={`px-4 py-3 text-right font-bold ${p.tipo === 'egreso' || p.categoria === 'reembolso' ? 'text-red-600' : 'text-gray-900'}`}>
                        {p.tipo === 'egreso' || p.categoria === 'reembolso' ? (
                          <div className="flex flex-col items-end">
                            <span>-{formatPrice(p.monto_mxn || p.monto)}</span>
                            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded mt-1 whitespace-nowrap">Reembolso / Egreso</span>
                          </div>
                        ) : (
                          formatPrice(p.monto_mxn || p.monto)
                        )}
                      </td>'''

content = re.sub(target, replacement, content)

with open(filepath, 'w', encoding='utf8') as f:
    f.write(content)
print("Table patched!")
