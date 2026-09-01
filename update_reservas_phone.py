import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
if "formatStoredPhone" not in content:
    content = content.replace("formatPrice, formatDateEs", "formatPrice, formatDateEs, formatStoredPhone")

# 2. Update visual representation of phone in Solicitudes
content = content.replace("+{solicitud.telefono}", "{formatStoredPhone(solicitud.telefono)}")

# 3. Update visual representation of phone in Reservas Confirmadas
content = content.replace("+{r.telefono}", "{formatStoredPhone(r.telefono)}")

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
