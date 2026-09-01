import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_click = """onClick={async () => {
                                  if (confirm('Estǭs seguro de cancelar esta reserva? Las fechas se liberarǭn.')) {
                                    await cancelarReserva(r.id)
                                  }
                                }}"""

new_click = """onClick={async () => {
                                  if (confirm('¿Estás seguro de cancelar esta reserva? Las fechas se liberarán.')) {
                                    const res = await cancelarReserva(r.id)
                                    if (res && !res.success) {
                                      alert("Error al cancelar: " + res.error)
                                    }
                                  }
                                }}"""
# Because encoding artifacts may be present:
content = re.sub(
    r"onClick=\{async \(\) => \{\s*if \(confirm\('[^']+'\)\) \{\s*await cancelarReserva\(r\.id\)\s*\}\s*\}\}",
    new_click,
    content,
    flags=re.DOTALL
)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
