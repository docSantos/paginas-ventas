import re

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace button text correctly by removing old encoding if needed
# There is a button with text "Liquidar Recepcin" or similar.
content = re.sub(r'Liquidar Recepci(?:[^\w\s]*)(?:n|ón)', 'Liquidar o abonar', content)
content = content.replace('Liquidar Recepción', 'Liquidar o abonar')

# 2. Add handleMetodoPagoChange
handle_metodo_pago_func = """
  const handleMetodoPagoChange = (val: string) => {
    setMetodoPago(val)
    if (!modalReserva) return
    const saldo = getSaldo(modalReserva)
    if (val.includes('USD')) {
      setMontoPago((saldo / Number(tc || 16)).toFixed(2))
    } else {
      setMontoPago(saldo.toString())
    }
  }

  const handleTcChange = (val: string) => {
    setTc(val)
    if (!modalReserva || !metodoPago.includes('USD')) return
    const saldo = getSaldo(modalReserva)
    const newTc = Number(val)
    if (newTc > 0) {
      setMontoPago((saldo / newTc).toFixed(2))
    }
  }
"""
if "handleMetodoPagoChange" not in content:
    content = content.replace("const submitLiquidacion", handle_metodo_pago_func + "\n  const submitLiquidacion")

# 3. Use handleMetodoPagoChange and handleTcChange in JSX
content = content.replace("onChange={e => setMetodoPago(e.target.value)}", "onChange={e => handleMetodoPagoChange(e.target.value)}")
content = content.replace("onChange={e => setTc(e.target.value)}", "onChange={e => handleTcChange(e.target.value)}")

# 4. Replace Modal container div
old_modal_div = 'className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"'
new_modal_div = 'className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-24 sm:pb-6 bg-black/50 backdrop-blur-sm overflow-y-auto"'
content = content.replace(old_modal_div, new_modal_div)

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
