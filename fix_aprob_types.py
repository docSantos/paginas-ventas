import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_aprob = """        if (res && !res.success) {
          alert("No es posible aprobar esta solicitud: " + (res.message || res.error || "Ocurrió un error."));
          return;
        }"""

new_aprob = """        if (res && !res.success) {
          alert("No es posible aprobar esta solicitud: " + (res.message || "Ocurrió un error."));
          return;
        }"""

content = content.replace(old_aprob, new_aprob)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
