import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace dineroEnCaja
old_dinero = "const dineroEnCaja = pagos.reduce((acc, p) => acc + (Number(p.monto_mxn) || Number(p.monto) || 0), 0)"
new_dinero = """const dineroEnCaja = reservas.reduce((acc, r) => {
        const propPagos = pagos.filter(p => p.reserva_id === r.id)
        return acc + propPagos.reduce((sum, p) => sum + (Number(p.monto_mxn) || Number(p.monto) || 0), 0)
      }, 0)"""

content = content.replace(old_dinero, new_dinero)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
