import re

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update getSaldo to strictly round to 2 decimals
content = re.sub(
    r'return Math\.max\(0, total - abonado\)',
    r'return Math.max(0, Math.round((total - abonado) * 100) / 100)',
    content
)

# 2. Update handleCheckOut threshold
handle_check_out_old = r"""  const handleCheckOut = async \(r: any\) => \{
    // 1\. Detección de salida anticipada PRIMERO
    if \(r\.fecha_salida > todayStr\) \{
      setModalAnticipado\(r\)
      return
    \}
    
    // 2\. Checkout normal \(solo si fecha de salida es hoy o anterior\)
    const saldo = getSaldo\(r\)
    if \(saldo > 0\) \{
      alert\(`No se puede realizar check-out con saldo pendiente \(\$\{formatPrice\(saldo\)\} MXN\)\. Usa el botón "Liquidar o abonar" primero\.`\)
      return
    \}"""

handle_check_out_new = """  const handleCheckOut = async (r: any) => {
    // 1. Detección de salida anticipada PRIMERO
    if (r.fecha_salida > todayStr) {
      setModalAnticipado(r)
      return
    }
    
    // 2. Checkout normal (solo si fecha de salida es hoy o anterior)
    const saldo = getSaldo(r)
    if (saldo > 0.5) {
      alert(`No se puede realizar check-out con saldo pendiente (${formatPrice(saldo)} MXN). Usa el botón "Liquidar o abonar" primero.`)
      return
    }"""

content = re.sub(handle_check_out_old, handle_check_out_new, content)

# 3. If there are other places where `saldo > 0` is used for conditional rendering, update them to `saldo > 0.5`
content = content.replace("saldo > 0 ?", "saldo > 0.5 ?")
content = content.replace("nuevoSaldo > 0", "nuevoSaldo > 0.5")
content = content.replace("nuevoSaldo <= 0", "nuevoSaldo <= 0.5")

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
