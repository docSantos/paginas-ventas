import re

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix optimistic UI bug (monto_mxn: monto -> monto_mxn: equivalenteMXN)
content = content.replace(
    "transacciones: [...(reserva.transacciones || []), { tipo: 'ingreso', monto_mxn: monto }]",
    "transacciones: [...(reserva.transacciones || []), { tipo: 'ingreso', monto_mxn: equivalenteMXN }]"
)

# 2. Fix date format: 'dd/MM/yy HH:mm' -> 'dd MMM yy HH:mm', { locale: es }
# And 'dd/MM/yy' -> 'dd MMM yy', { locale: es }
# But wait, date-fns 'es' is already imported at the top!
# `import { es } from 'date-fns/locale'`
# So we can just do: `format(checkInDate, 'dd MMM yy HH:mm', { locale: es })`
content = content.replace(
    "In: {format(checkInDate, 'dd/MM/yy HH:mm')}",
    "In: {format(checkInDate, 'dd MMM yy HH:mm', { locale: es })}"
)
content = content.replace(
    "Out: {format(parseISO(r.fecha_salida), 'dd/MM/yy')}",
    "Out: {format(parseISO(r.fecha_salida), 'dd MMM yy', { locale: es })}"
)

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
