import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Change defaults to 16.00
content = content.replace("const [tc, setTc] = useState('20.00')", "const [tc, setTc] = useState('16.00')")
content = content.replace("const [abonoTc, setAbonoTc] = useState('20.00')", "const [abonoTc, setAbonoTc] = useState('16.00')")

# 2. Update the useEffect for metodoPago
old_ue_1 = """  useEffect(() => {
    // Cuando el m\u00e9todo cambia a usd, forzar moneda
    if (metodoPago.includes('usd')) setMoneda('USD')
    else setMoneda('MXN')
  }, [metodoPago])"""

new_ue_1 = """  useEffect(() => {
    const isUSD = metodoPago.includes('usd');
    setMoneda(isUSD ? 'USD' : 'MXN');

    let currentTc = parseFloat(tc);
    if (isNaN(currentTc) || currentTc === 20 || currentTc === 0) {
      currentTc = 16;
      setTc('16.00');
    }

    const total = parseFloat(montoAcordado || '0');
    if (total > 0) {
      if (isUSD) {
        setMontoAnticipo((total * 0.5 / currentTc).toFixed(2));
      } else {
        setMontoAnticipo((total * 0.5).toString());
      }
    }
  }, [metodoPago])"""

content = content.replace(old_ue_1, new_ue_1)

# 3. We also need to fix the UI button "Aplicar 50%" to match the requested calculation.
# Let's find "Aplicar 50%" in the file.
old_btn = """<button 
                    type="button"
                    className="text-blue-600 underline font-semibold hover:text-blue-900"
                    onClick={() => setMontoAnticipo(((parseFloat(montoAcordado || '0') / 2) / (parseFloat(tc || '1') || 1)).toFixed(2))}
                  >
                    Aplicar 50%
                  </button>"""
                  
new_btn = """<button 
                    type="button"
                    className="text-blue-600 underline font-semibold hover:text-blue-900"
                    onClick={() => setMontoAnticipo(((parseFloat(montoAcordado || '0') * 0.5) / (parseFloat(tc || '16') || 16)).toFixed(2))}
                  >
                    Aplicar 50%
                  </button>"""

content = content.replace(old_btn, new_btn)

# Make sure we didn't miss it if it was slightly different formatted
if "Aplicar 50%" not in content:
    print("Warning: Aplicar 50% string not found or not replaced.")

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
