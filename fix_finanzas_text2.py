import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Titles
content = content.replace("Dinero Real en Caja (MXN)", "Dinero Cobrado (MXN)")
content = content.replace("Cuentas por Cobrar", "Saldo por Cobrar")

# Replace Subtexts
content = content.replace(
    '<p className="text-xs text-gray-500 mt-1">Cobrado y liquidado</p>',
    '<p className="text-xs text-gray-500 mt-1">Anticipos y abonos recibidos</p>'
)

# Use regex for 'Saldos pendientes de huéspedes' to handle broken unicode characters like huǸspedes
content = re.sub(
    r'<p className="text-xs text-gray-500 mt-1">Saldos pendientes de hu[^s]+spedes</p>',
    '<p className="text-xs text-gray-500 mt-1">Pendiente por liquidar antes del check-in</p>',
    content
)

# Just in case regex fails due to exact match available
content = content.replace(
    '<p className="text-xs text-gray-500 mt-1">Saldos pendientes de huéspedes</p>',
    '<p className="text-xs text-gray-500 mt-1">Pendiente por liquidar antes del check-in</p>'
)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
