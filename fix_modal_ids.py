import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific onClick that has id: c.id
old_click = """onClick={() => setModalComision({ 
                              isOpen: true, 
                              id: c.id, 
                              saldo: c.monto_comision - c.monto_pagado, 
                              pago: String(c.monto_comision - c.monto_pagado) 
                            })}"""

new_click = """onClick={() => setModalComision({ 
                              isOpen: true, 
                              ids: [c.id], 
                              saldo: c.monto_comision - c.monto_pagado, 
                              pago: String(c.monto_comision - c.monto_pagado) 
                            })}"""

content = content.replace(old_click, new_click)

# Also fix the button to show Liquidado instead of Pagar if it is pagado
# Let's just find the whole td
td_pattern = re.compile(r'<td className="px-4 py-3 text-center">.*?\{c\.estado_pago !== \'liquidado\'.*?Pagar\s*</Button>\s*\)\}\s*</td>', re.DOTALL)

td_new = """<td className="px-4 py-3 text-center">
                        {c.estado_pago !== 'pagado' && c.estado_pago !== 'cancelada' && c.estado_pago !== 'cancelada_con_saldo_a_favor' ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                            onClick={() => setModalComision({ 
                              isOpen: true, 
                              ids: [c.id], 
                              saldo: c.monto_comision - c.monto_pagado, 
                              pago: String(c.monto_comision - c.monto_pagado) 
                            })}
                          >
                            Pagar
                          </Button>
                        ) : (
                          <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded">Liquidado</span>
                        )}
                      </td>"""

if td_pattern.search(content):
    content = td_pattern.sub(td_new, content)
else:
    # If the regex doesn't match, we already fixed the 'id: c.id' above. Let's make sure it handles 'pagado' properly
    # Check if there is still 'liquidado' in the condition
    content = content.replace("c.estado_pago !== 'liquidado'", "c.estado_pago !== 'pagado'")
    
with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
