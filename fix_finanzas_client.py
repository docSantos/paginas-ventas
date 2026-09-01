import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace global sum
content = content.replace(
    "const dineroEnCaja = pagos.reduce((acc, p) => acc + Number(p.monto_equivalente_mxn || 0), 0)",
    "const dineroEnCaja = pagos.reduce((acc, p) => acc + (Number(p.monto_mxn) || Number(p.monto) || 0), 0)"
)

# Replace per-property sum
content = content.replace(
    "ingresosCobrados += propPagos.reduce((acc, p) => acc + Number(p.monto_equivalente_mxn || 0), 0)",
    "ingresosCobrados += propPagos.reduce((acc, p) => acc + (Number(p.monto_mxn) || Number(p.monto) || 0), 0)"
)

# Update comment
content = content.replace(
    "// 2. Dinero Real en Caja (Total cobrado en MXN de pagos_reservas)",
    "// 2. Dinero Real en Caja (Total cobrado en MXN de transacciones)"
)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
