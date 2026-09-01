import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import for buildWaUrl if it exists
if "buildWaUrl" not in content:
    content = content.replace("import { formatPrice, formatDateEs, formatPhoneWithFlag } from '@/lib/utils'",
                              "import { formatPrice, formatDateEs, formatPhoneWithFlag, buildWaUrl, formatPhoneWithFlagObj } from '@/lib/utils'")

# Replace href 1 (solicitud)
content = re.sub(
    r"href=\{`https://wa\.me/\$\{solicitud\.telefono\.replace\(/\\D/g, ''\)\}\?text=\$\{encodeURIComponent\(`Hola \$\{solicitud\.nombre_cliente\}, te escribo de Casas Gaby sobre tu solicitud de reserva\.`\)\}`\}",
    "href={buildWaUrl((solicitud as any).codigo_pais, solicitud.telefono, `Hola ${solicitud.nombre_cliente}, te escribo de Casas Gaby sobre tu solicitud de reserva.`)}",
    content
)

# Replace href 2 (reserva)
content = re.sub(
    r"href=\{`https://wa\.me/\$\{r\.telefono\.replace\(/\\D/g, ''\)\}\?text=\$\{encodeURIComponent\(`Hola \$\{r\.nombre_cliente\}, te escribo de Casas Gaby sobre tu reserva\.`\)\}`\}",
    "href={buildWaUrl((r as any).codigo_pais, r.telefono, `Hola ${r.nombre_cliente}, te escribo de Casas Gaby sobre tu reserva.`)}",
    content
)

# Replace formatPhoneWithFlag with formatPhoneWithFlagObj
content = content.replace("{formatPhoneWithFlag(r.telefono)}", "{formatPhoneWithFlagObj((r as any).codigo_pais, r.telefono)}")
content = content.replace("{formatPhoneWithFlag(solicitud.telefono)}", "{formatPhoneWithFlagObj((solicitud as any).codigo_pais, solicitud.telefono)}")

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
