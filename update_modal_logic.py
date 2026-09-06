import re

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State addition
if "const [tc," not in content:
    content = content.replace(
        "const [notasPago, setNotasPago] = useState('')",
        "const [notasPago, setNotasPago] = useState('')\n  const [tc, setTc] = useState('16.00')"
    )

# 2. Rename button
content = content.replace(">Liquidar Recepcin<", ">Liquidar o abonar<")
content = content.replace(">Liquidar Recepción<", ">Liquidar o abonar<")

# 3. Update submitLiquidacion
submit_old = r"""  const submitLiquidacion = async \(\) => \{
    if \(!modalReserva\) return
    const monto = Number\(montoPago\)
    const saldo = getSaldo\(modalReserva\)
    
    if \(isNaN\(monto\) \|\| monto <= 0\) return alert\('El monto debe ser mayor a 0\.'\)
    if \(monto > saldo\) return alert\('El monto no puede ser mayor al saldo pendiente de ' \+ formatPrice\(saldo\)\)

    try \{
      setLoadingId\('submit-pago'\)
      const res = await liquidarSaldoRecepcion\(modalReserva\.id, monto, modalReserva\.cliente_id, metodoPago, notasPago\)"""

submit_new = """  const submitLiquidacion = async () => {
    if (!modalReserva) return
    const monto = Number(montoPago)
    const saldo = getSaldo(modalReserva)
    const tipoCambio = Number(tc)
    
    if (isNaN(monto) || monto <= 0) return alert('El monto debe ser mayor a 0.')
    
    const isUSD = metodoPago.includes('USD')
    const equivalenteMXN = isUSD ? monto * tipoCambio : monto
    
    if (equivalenteMXN > saldo) return alert('El equivalente en MXN (' + formatPrice(equivalenteMXN) + ') no puede ser mayor al saldo pendiente de ' + formatPrice(saldo))

    try {
      setLoadingId('submit-pago')
      const moneda = isUSD ? 'USD' : 'MXN'
      const res = await liquidarSaldoRecepcion(modalReserva.id, monto, modalReserva.cliente_id, metodoPago, notasPago, moneda, isUSD ? tipoCambio : 1)"""

content = re.sub(submit_old, submit_new, content)

# 4. Update the actual UI validation disabled state
button_disabled_old = r"disabled=\{loadingId === 'submit-pago' \|\| Number\(montoPago\) <= 0 \|\| Number\(montoPago\) > getSaldo\(modalReserva\)\}"
button_disabled_new = "disabled={loadingId === 'submit-pago' || Number(montoPago) <= 0 || (metodoPago.includes('USD') ? Number(montoPago) * Number(tc) : Number(montoPago)) > getSaldo(modalReserva)}"
content = content.replace(button_disabled_old, button_disabled_new)

# 5. Update UI for the modal (Select options and new TC field)
modal_inputs_old = r"""              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Monto a Pagar \(MXN\)</label>
                <Input 
                  type="number" 
                  value=\{montoPago\} 
                  onChange=\{e => setMontoPago\(e\.target\.value\)\} 
                  placeholder="Ej. 1500" 
                  className="font-semibold text-lg"
                  max=\{getSaldo\(modalReserva\)\}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">MǸtodo de Pago</label>
                <select 
                  className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value=\{metodoPago\}
                  onChange=\{e => setMetodoPago\(e\.target\.value\)\}
                >
                  <option value="Efectivo MXN">Efectivo MXN</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta de CrǸdito">Tarjeta de CrǸdito</option>
                  <option value="Tarjeta de DǸbito">Tarjeta de DǸbito</option>
                  <option value="Efectivo USD">Efectivo USD</option>
                </select>
              </div>"""

modal_inputs_new = """              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Monto a Pagar {metodoPago.includes('USD') ? '(USD)' : '(MXN)'}</label>
                <Input 
                  type="number" 
                  value={montoPago} 
                  onChange={e => setMontoPago(e.target.value)} 
                  placeholder="Ej. 1500" 
                  className="font-semibold text-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Método de Pago</label>
                <select 
                  className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={metodoPago}
                  onChange={e => setMetodoPago(e.target.value)}
                >
                  <option value="Efectivo MXN">Efectivo MXN</option>
                  <option value="Efectivo USD">Efectivo USD</option>
                  <option value="Transferencia MXN">Transferencia MXN</option>
                  <option value="Transferencia USD">Transferencia USD</option>
                </select>
              </div>

              {metodoPago.includes('USD') && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Tipo de Cambio (MXN/USD)</label>
                  <Input 
                    type="number" 
                    value={tc} 
                    onChange={e => setTc(e.target.value)} 
                    placeholder="Ej. 16.00" 
                    className="font-semibold text-lg"
                  />
                  <p className="text-xs text-amber-700 font-medium bg-amber-50 p-2 rounded border border-amber-100">
                    Equivalente en MXN: {formatPrice(Number(montoPago || 0) * Number(tc || 0))}
                  </p>
                </div>
              )}"""

content = re.sub(modal_inputs_old, modal_inputs_new, content, flags=re.DOTALL)

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
