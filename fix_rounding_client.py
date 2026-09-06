import re

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add step="0.01" to Monto a Pagar Input
content = re.sub(
    r'(<Input \s*type="number" \s*value=\{montoPago\} \s*onChange=\{e => setMontoPago\(e\.target\.value\)\} \s*placeholder="Ej\. 1500" \s*className="font-semibold text-lg")',
    r'\1 step="0.01"',
    content
)

# 2. Fix setMontoPago(nuevoSaldo.toString()) -> setMontoPago(nuevoSaldo.toFixed(2))
content = content.replace(
    "setMontoPago(nuevoSaldo.toString())",
    "setMontoPago(nuevoSaldo.toFixed(2))"
)

# 3. Fix nuevoCosto rounding in procesarAnticipado
content = content.replace(
    "const nuevoCosto = nochesEfectivas * precioNoche",
    "const nuevoCosto = parseFloat((nochesEfectivas * precioNoche).toFixed(2))"
)

# 4. Fix equivalenteMXN rounding in submitLiquidacion
content = content.replace(
    "const equivalenteMXN = isUSD ? monto * tipoCambio : monto",
    "const equivalenteMXN = parseFloat((isUSD ? monto * tipoCambio : monto).toFixed(2))"
)

# 5. Fix setMontoPago in getSaldo for handleLiquidar if present
content = content.replace(
    "setMontoPago(getSaldo(r).toString())",
    "setMontoPago(getSaldo(r).toFixed(2))"
)

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
