import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

funcs_to_add = """  const openAprobar = (solicitud: any) => {
    setAprobarModal({ open: true, solicitud })
    setMontoAcordado(String(solicitud.costo_total || ''))
    setMontoAnticipo('')
    setMetodoPago('efectivo_mxn')
    setMoneda('MXN')
    setTc('20.00')
    setSelectedExtras({})
  }

  const handleAprobar = async () => {
    if (!aprobarModal.solicitud) return
    if (!montoAcordado || Number(montoAcordado) <= 0) {
      alert("El monto acordado debe ser mayor a 0")
      return
    }
    try {
      const extrasList = Object.values(selectedExtras)
      await aprobarSolicitud(
        aprobarModal.solicitud.id, 
        Number(montoAcordado), 
        Number(montoAnticipo), 
        metodoPago, 
        moneda, 
        Number(tc),
        extrasList
      )
      setAprobarModal({ open: false, solicitud: null })
      setSelectedExtras({})
    } catch (e: any) {
      alert("Error: " + e.message)
    }
  }

  // Abonos Modal"""

content = content.replace("  // Abonos Modal", funcs_to_add)

# Make sure onClick calls openAprobar instead of inline
content = re.sub(
    r"onClick=\{\(\) => \{\s*setAprobarModal\(\{ open: true, solicitud: s \}\)\s*setMontoAcordado\(String\(s\.costo_total \|\| ''\)\)\s*\}\}",
    "onClick={() => openAprobar(s)}",
    content,
    flags=re.DOTALL
)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
