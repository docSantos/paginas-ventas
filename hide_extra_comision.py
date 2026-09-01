import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the percentage commission input from "catalogo" mode.
# It looks like:
# <div>
#   <label className="text-sm font-medium block mb-1">% de Comisión</label>
#   <Input ... value={ajustePorcentajeComision} onChange={e => setAjustePorcentajeComision(e.target.value)} />
# </div>
catalogo_pct_block = r"<div>\s*<label className=\"text-sm font-medium block mb-1\">% de Comisión</label>\s*<Input[^>]+value=\{ajustePorcentajeComision\}[^>]+/>\s*</div>"
content = re.sub(catalogo_pct_block, "", content)

# 2. Update the grid-cols in the catalogo mode if necessary.
# It was inside a `grid grid-cols-2 gap-4` probably. Let's let it just be whatever it is.

# 3. Remove the percentage commission input from "manual" mode.
# It looks like:
# {ajusteModal.tipo === 'cargo' && (
#   <div>
#     <label className="text-sm font-medium block mb-1">% Comisión</label>
#     <Input ... value={ajustePorcentajeComision} ... />
#   </div>
# )}
manual_pct_block = r"\{ajusteModal\.tipo === 'cargo' && \(\s*<div>\s*<label className=\"text-sm font-medium block mb-1\">% Comisión</label>\s*<Input[^>]+value=\{ajustePorcentajeComision\}[^>]+/>\s*</div>\s*\)\}"
content = re.sub(manual_pct_block, "", content)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
