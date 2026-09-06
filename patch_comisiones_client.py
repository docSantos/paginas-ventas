import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add localComisiones state
content = content.replace(
    "const [activeTab, setActiveTab] = useState<'ledger'|'kpis'|'comisiones'>('ledger')",
    "const [localComisiones, setLocalComisiones] = useState<any[]>(comisiones || [])\n  const [activeTab, setActiveTab] = useState<'ledger'|'kpis'|'comisiones'>('ledger')"
)

# 2. Update handlePagarComision
old_handle_pagar = """  const handlePagarComision = async () => {
    try {
      setIsSubmitting(true)
      await registrarPagoComisionTabla(modalComision.id, Number(modalComision.pago))
      setModalComision({ isOpen: false, id: '', saldo: 0, pago: '' })
    } catch (e) {
      alert("Error al pagar comisión")
    } finally {
      setIsSubmitting(false)
    }
  }"""
# In case it has weird characters in "comisión", I'll use regex
handle_pagar_pattern = re.compile(r"const handlePagarComision = async \(\) => \{.*?finally \{\s*setIsSubmitting\(false\)\s*\}\s*\}", re.DOTALL)

new_handle_pagar = """const handlePagarComision = async () => {
    try {
      setIsSubmitting(true)
      const res = await registrarPagoComisionTabla(modalComision.id, Number(modalComision.pago))
      if (res && res.success === false) {
        alert(res.error || "Error al pagar comisión")
      } else {
        // Actualización optimista
        setLocalComisiones(prev => prev.map(c => {
          if (c.id === modalComision.id) {
            const nuevoPagado = Number(c.monto_pagado) + Number(modalComision.pago)
            return {
              ...c,
              monto_pagado: nuevoPagado,
              estado_pago: nuevoPagado >= Number(c.monto_comision) - 0.5 ? 'liquidado' : 'parcial'
            }
          }
          return c
        }))
        setModalComision({ isOpen: false, id: '', saldo: 0, pago: '' })
      }
    } catch (e: any) {
      alert(e.message || "Error desconocido al pagar")
    } finally {
      setIsSubmitting(false)
    }
  }"""

content = handle_pagar_pattern.sub(new_handle_pagar, content)

# 3. Replace comisiones?.map and comisiones?.filter with localComisiones
content = content.replace("comisiones?.filter(", "localComisiones.filter(")
content = content.replace("comisiones?.length", "localComisiones.length")
content = content.replace("comisiones?.map(", "localComisiones.map(")

# Update the badge to say Liquidada / Pagada
badge_old = """c.estado_pago === 'liquidado' ? 'bg-green-100 text-green-700'"""
badge_new = """c.estado_pago === 'liquidado' ? 'bg-green-100 text-green-700 font-bold'"""
content = content.replace(badge_old, badge_new)
content = content.replace("{c.estado_pago === 'liquidado' ? 'Liquidado'", "{c.estado_pago === 'liquidado' ? 'Liquidada / Pagada'")

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
