import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: monto_apartado in reservas insert
content = re.sub(
    r'tarifa_base:\s*montoAcordado,\s*monto_apartado:\s*montoAnticipo,',
    r'tarifa_base: montoAcordado,\n      monto_apartado: moneda === \'USD\' ? (montoAnticipo * tc) : montoAnticipo,',
    content
)

# Fix 2: transacciones insert in aprobarSolicitud
content = re.sub(
    r'monto:\s*montoAnticipo,\s*moneda:\s*moneda,\s*metodo_pago:\s*metodo,\s*tipo_cambio:\s*tc,',
    r'monto: montoAnticipo,\n        monto_mxn: equivalenteMXN,\n        moneda: moneda,\n        metodo_pago: metodo,\n        tipo_cambio: tc,',
    content
)

# Fix 3: transacciones insert in registrarAbono
content = re.sub(
    r'monto:\s*monto,\s*moneda:\s*moneda,\s*metodo_pago:\s*metodo,\s*tipo_cambio:\s*tc,',
    r'monto: monto,\n      monto_mxn: equivalenteMXN,\n      moneda: moneda,\n      metodo_pago: metodo,\n      tipo_cambio: tc,',
    content
)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
