import re

# 1. Patch page.tsx
filepath = 'src/app/casasgaby/admin/finanzas/page.tsx'
with open(filepath, 'r', encoding='utf8') as f:
    content = f.read()

target = "const { data: pagos } = await db.schema('hospedaje').from('transacciones').select('*, reservas(nombre_cliente, propiedades(titulo))').eq('tipo', 'ingreso').order('created_at', { ascending: false })"
replacement = "const { data: pagos } = await db.schema('hospedaje').from('transacciones').select('*, reservas(nombre_cliente, propiedades(titulo))').order('created_at', { ascending: false })"

content = content.replace(target, replacement)
with open(filepath, 'w', encoding='utf8') as f:
    f.write(content)


# 2. Patch FinanzasClient.tsx
filepath = 'src/components/casasgaby/admin/FinanzasClient.tsx'
with open(filepath, 'r', encoding='utf8') as f:
    content = f.read()

# Fix dineroEnCaja metric
content = content.replace(
    """return acc + propPagos.reduce((sum, p) => sum + (Number(p.monto_mxn) || Number(p.monto) || 0), 0)""",
    """return acc + propPagos.reduce((sum, p) => sum + ((p.tipo === 'egreso' || p.categoria === 'reembolso' ? -1 : 1) * (Number(p.monto_mxn) || Number(p.monto) || 0)), 0)"""
)

# Fix ingresosCobrados metric
content = content.replace(
    """ingresosCobrados += propPagos.reduce((acc, p) => acc + (Number(p.monto_mxn) || Number(p.monto) || 0), 0)""",
    """ingresosCobrados += propPagos.reduce((acc, p) => acc + ((p.tipo === 'egreso' || p.categoria === 'reembolso' ? -1 : 1) * (Number(p.monto_mxn) || Number(p.monto) || 0)), 0)"""
)

# Fix LEDGER LOGIC (totalHistorico)
content = content.replace(
    """const totalHistorico = pagos.reduce((acc, p) => acc + Number(p.monto_mxn || 0), 0)""",
    """const totalHistorico = pagos.reduce((acc, p) => acc + ((p.tipo === 'egreso' || p.categoria === 'reembolso' ? -1 : 1) * Number(p.monto_mxn || p.monto || 0)), 0)"""
)

# Fix ingresosMesActual
content = content.replace(
    """}).reduce((acc, p) => acc + Number(p.monto_mxn || 0), 0)""",
    """}).reduce((acc, p) => acc + ((p.tipo === 'egreso' || p.categoria === 'reembolso' ? -1 : 1) * Number(p.monto_mxn || p.monto || 0)), 0)"""
)

# Fix pagosEfectivo & pagosTransf - they should probably also account for refunds but the instruction specifically said "Ajusta la suma aritmética para que distinga entre ingresos y egresos: Si p.tipo === 'egreso' (...)"
# To be safe and compliant, we can do it for all ledger reductions.
content = content.replace(
    """const usdAcumulado = pagos.filter(p => p.moneda === 'USD').reduce((acc, p) => acc + Number(p.monto || 0), 0)""",
    """const usdAcumulado = pagos.filter(p => p.moneda === 'USD').reduce((acc, p) => acc + ((p.tipo === 'egreso' || p.categoria === 'reembolso' ? -1 : 1) * Number(p.monto || 0)), 0)"""
)
content = content.replace(
    """const pagosEfectivo = pagos.filter(p => p.metodo_pago?.includes('Efectivo')).reduce((acc, p) => acc + Number(p.monto_mxn || 0), 0)""",
    """const pagosEfectivo = pagos.filter(p => p.metodo_pago?.includes('Efectivo')).reduce((acc, p) => acc + ((p.tipo === 'egreso' || p.categoria === 'reembolso' ? -1 : 1) * Number(p.monto_mxn || p.monto || 0)), 0)"""
)
content = content.replace(
    """const pagosTransf = pagos.filter(p => p.metodo_pago?.includes('Transferencia')).reduce((acc, p) => acc + Number(p.monto_mxn || 0), 0)""",
    """const pagosTransf = pagos.filter(p => p.metodo_pago?.includes('Transferencia')).reduce((acc, p) => acc + ((p.tipo === 'egreso' || p.categoria === 'reembolso' ? -1 : 1) * Number(p.monto_mxn || p.monto || 0)), 0)"""
)

# Fix table rendering
target_tr = """                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        {formatPrice(p.monto_mxn || p.monto)}
                      </td>"""

replacement_tr = """                      <td className={`px-4 py-3 text-right font-bold ${p.tipo === 'egreso' || p.categoria === 'reembolso' ? 'text-red-600' : 'text-gray-900'}`}>
                        {p.tipo === 'egreso' || p.categoria === 'reembolso' ? (
                          <div className="flex flex-col items-end">
                            <span>-{formatPrice(p.monto_mxn || p.monto)}</span>
                            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded mt-1">Reembolso / Egreso</span>
                          </div>
                        ) : (
                          formatPrice(p.monto_mxn || p.monto)
                        )}
                      </td>"""

content = content.replace(target_tr, replacement_tr)

with open(filepath, 'w', encoding='utf8') as f:
    f.write(content)
