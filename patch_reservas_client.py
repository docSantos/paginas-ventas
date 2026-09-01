import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "export function ReservasClient({ solicitudes, reservas, servicios = [] }: { solicitudes: Solicitud[], reservas: Reserva[], servicios?: any[] }) {",
    "export function ReservasClient({ solicitudes, reservas, servicios = [], tenantExtras = 10 }: { solicitudes: Solicitud[], reservas: Reserva[], servicios?: any[], tenantExtras?: number }) {"
)

content = content.replace(
    "setAjustePorcentajeComision('0')",
    "setAjustePorcentajeComision(String(tenantExtras))"
)
content = content.replace(
    "const [ajustePorcentajeComision, setAjustePorcentajeComision] = useState('0')",
    "const [ajustePorcentajeComision, setAjustePorcentajeComision] = useState(String(tenantExtras))"
)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
