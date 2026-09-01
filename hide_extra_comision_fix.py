import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Match anything between <label ...> and </label>
catalogo_pct_block = r"<div>\s*<label className=\"text-sm font-medium block mb-1\">% de Comisi[^<]+</label>\s*<Input[^>]+value=\{ajustePorcentajeComision\}[^>]+/>\s*</div>"
content = re.sub(catalogo_pct_block, "", content)

manual_pct_block = r"\{ajusteModal\.tipo === 'cargo' && \(\s*<div>\s*<label className=\"text-sm font-medium block mb-1\">% Comisi[^<]+</label>\s*<Input[^>]+value=\{ajustePorcentajeComision\}[^>]+/>\s*</div>\s*\)\}"
content = re.sub(manual_pct_block, "", content)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
