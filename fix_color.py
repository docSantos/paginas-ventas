import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

color_logic = """c.estado_pago === 'liquidado' ? 'bg-green-100 text-green-700' :
                        c.estado_pago === 'cancelada_con_saldo_a_favor' ? 'bg-indigo-100 text-indigo-700' :
                        c.estado_pago === 'cancelada' ? 'bg-red-100 text-red-700' :
                        c.estado_pago === 'parcial' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'"""
content = content.replace("c.estado_pago === 'liquidado' ? 'bg-green-100 text-green-700' :\n                        c.estado_pago === 'parcial' ? 'bg-amber-100 text-amber-700' :\n                        'bg-gray-100 text-gray-600'", color_logic)

content = content.replace("{c.estado_pago !== 'liquidado' && (", "{c.estado_pago !== 'liquidado' && c.estado_pago !== 'cancelada' && c.estado_pago !== 'cancelada_con_saldo_a_favor' && (")

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
