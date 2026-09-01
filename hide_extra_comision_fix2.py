import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "<label" in line and "% de Comisi" in line:
        # We are at the label of the percentage
        # Let's remove the <div> that wraps it. The <div> is on line i-1 usually.
        # But wait, it's easier to just comment out the block or return null.
        pass

# Actually, let's use re.sub with very permissive dotall.
with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern 1 (Catalogo)
# <div>
#   <label className="text-sm font-medium block mb-1">% de Comisin</label>
#   <Input ... value={ajustePorcentajeComision} ... />
# </div>
pat1 = r"<div>\s*<label[^>]*>% de Comisi[^<]*</label>\s*<Input[^>]*value=\{ajustePorcentajeComision\}[^>]*/>\s*</div>"
text = re.sub(pat1, "", text, flags=re.DOTALL)

# Pattern 2 (Manual)
# {ajusteModal.tipo === 'cargo' && (
#   <div>
#     <label className="text-sm font-medium block mb-1">% Comisin</label>
#     <Input type="number" ... value={ajustePorcentajeComision} ... />
#   </div>
# )}
pat2 = r"\{ajusteModal\.tipo === 'cargo' && \(\s*<div>\s*<label[^>]*>% Comisi[^<]*</label>\s*<Input[^>]*value=\{ajustePorcentajeComision\}[^>]*/>\s*</div>\s*\)\}"
text = re.sub(pat2, "", text, flags=re.DOTALL)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

