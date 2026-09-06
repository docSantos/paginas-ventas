import re

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace import { toast } from 'sonner'
content = content.replace("import { toast } from 'sonner'\n", "")

# Replace toast.success
content = content.replace("toast.success('Check-in marcado exitosamente')", "alert('Check-in marcado exitosamente'); window.location.reload();")
content = content.replace("toast.success('Check-out marcado exitosamente')", "alert('Check-out marcado exitosamente'); window.location.reload();")

# Replace toast.error
content = content.replace("toast.error('Error al marcar check-in')", "alert('Error al marcar check-in');")
content = content.replace("toast.error('Error al marcar check-out')", "alert('Error al marcar check-out');")
content = content.replace("toast.error(e.message)", "alert(e.message);")

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
