import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# The first one is before `return (`
# Let's search for it.
bad_bar_pattern = re.compile(r'\{/\*\s*BARRA FLOTANTE DE ACCIÓN POR LOTE\s*\*/\}(.*?)\}\)\s*\}\s*return\s*\(', re.DOTALL)
content = bad_bar_pattern.sub("return (", content)

# But wait, there might be character encoding issues (ACCI"N). Let's use a simpler pattern.
bad_bar_pattern_2 = re.compile(r'\{\s*/\*\s*BARRA FLOTANTE DE.*?Liquidar seleccionadas\s*</Button>\s*</div>\s*\)\}\s*return\s*\(', re.DOTALL)
content = bad_bar_pattern_2.sub("return (", content)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
