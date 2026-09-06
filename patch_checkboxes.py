import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the Header
th_old = """<th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Propiedad / Cliente</th>"""
th_new = """<th className="px-4 py-3 w-10 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        checked={localComisiones.filter(c => c.estado_pago === 'pendiente' || c.estado_pago === 'parcial').length > 0 && selectedComisiones.length === localComisiones.filter(c => c.estado_pago === 'pendiente' || c.estado_pago === 'parcial').length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedComisiones(localComisiones.filter(c => c.estado_pago === 'pendiente' || c.estado_pago === 'parcial').map(c => c.id))
                          } else {
                            setSelectedComisiones([])
                          }
                        }}
                      />
                    </th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Propiedad / Cliente</th>"""

content = content.replace(th_old, th_new)

# 2. Fix the Body Row
tr_old = """<tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{c.fecha_reserva ? formatDateEs(c.fecha_reserva) : ''}</td>"""

tr_new = """<tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 disabled:opacity-50 cursor-pointer"
                          disabled={c.estado_pago === 'pagado' || c.estado_pago === 'cancelada' || c.estado_pago === 'cancelada_con_saldo_a_favor'}
                          checked={selectedComisiones.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedComisiones(prev => [...prev, c.id])
                            } else {
                              setSelectedComisiones(prev => prev.filter(id => id !== c.id))
                            }
                          }}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{c.fecha_reserva ? formatDateEs(c.fecha_reserva) : ''}</td>"""

content = content.replace(tr_old, tr_new)

# 3. Add colspan=9 for empty row
content = content.replace('colSpan={8}', 'colSpan={9}')

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
