import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Build servicios_extra payload
payload_builder = """    const serviciosExtraPayload = Object.keys(selectedExtras)
      .filter(id => selectedExtras[id]?.activo)
      .map(id => {
        const s = servicios.find((x: any) => x.id === id);
        if (!s) return null;
        const val = selectedExtras[id];
        let finalQty = 1;
        let finalName = s.nombre;
        if (s.tipo_tarifa === 'por_dia') {
          finalQty = val.qty || 1;
        } else if (s.tipo_tarifa === 'por_trayecto') {
          finalQty = (val.ida ? 1 : 0) + (val.vuelta ? 1 : 0);
          if (finalQty === 0) return null;
          if (val.ida && val.vuelta) finalName += ' (Ida y Vuelta)';
          else if (val.ida) finalName += ' (Ida)';
          else if (val.vuelta) finalName += ' (Vuelta)';
        }
        return {
          id,
          qty: finalQty,
          nombre: finalName,
          precio_base: s.precio_base,
          tipo_tarifa: s.tipo_tarifa
        }
      }).filter(Boolean);"""

# Replace in handleWhatsAppSubmit
# Find: `const handleWhatsAppSubmit = async (e: React.FormEvent) => {\n      e.preventDefault()\n      if (!cotizacion) return\n      setIsSubmitting(true)`

find_submit = """  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cotizacion) return
    setIsSubmitting(true)"""

replace_submit = find_submit + "\n\n" + payload_builder

content = content.replace(find_submit, replace_submit)

# Update fetch body
find_body = """            costo_total: cotizacion.total,
            monto_apartado: cotizacion.anticipo
          })"""
replace_body = """            costo_total: cotizacion.total,
            monto_apartado: cotizacion.anticipo,
            servicios_extra: serviciosExtraPayload
          })"""

content = content.replace(find_body, replace_body)

# Update WhatsApp string
find_wa = """  Huéspedes: ${huespedes} (${cotizacion.breakdown})
  
  *Cotización sugerida:*"""

# Wait, `Huéspedes` is `HuǸspedes` in the file output. Let's use regex to find the string.
wa_pattern = r"\*Estadía:\*\s*Llegada: \$\{fechaEntrada\}\s*Salida: \$\{fechaSalida\}\s*Huéspedes: \$\{huespedes\} \(\$\{cotizacion\.breakdown\}\)\s*\*Cotización sugerida:\*"

# It's better to just search for `(${cotizacion.breakdown})`
find_wa_2 = """(${cotizacion.breakdown})
  
  *Cotización sugerida:*"""

replace_wa_2 = """(${cotizacion.breakdown})
  ${serviciosExtraPayload.length > 0 ? `\\n  *Servicios Extra:*\\n  ${serviciosExtraPayload.map((s: any) => `- ${s.nombre} (x${s.qty})`).join('\\n  ')}\\n` : ''}
  *Cotización sugerida:*"""

# If the regex doesn't match directly, let's just do a simple replacement for the exact string chunk
if "(${cotizacion.breakdown})" in content:
    idx = content.find("(${cotizacion.breakdown})")
    # find the next `*Cotizac`
    idx2 = content.find("*Cotizac", idx)
    if idx != -1 and idx2 != -1:
        orig = content[idx:idx2]
        new_str = f"(${{cotizacion.breakdown}})\n  ${{serviciosExtraPayload.length > 0 ? `\\n  *Servicios Extra:*\\n  ${{serviciosExtraPayload.map((s: any) => `- ${{s.nombre}} (x${{s.qty}})`).join('\\n  ')}}\\n` : ''}}\n  "
        content = content.replace(orig, new_str)


with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
