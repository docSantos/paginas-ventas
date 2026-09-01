import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the grid cols and remove pct input
# From: <div className="mt-3 pl-7 grid grid-cols-3 gap-3">
# To: <div className="mt-3 pl-7 grid grid-cols-2 gap-3">
content = content.replace(
    '<div className="mt-3 pl-7 grid grid-cols-3 gap-3">',
    '<div className="mt-3 pl-7 grid grid-cols-2 gap-3">'
)

pct_block = r"<div>\s*<label className=\"text-\[11px\] font-medium block text-gray-500 mb-1\">% Comisión</label>\s*<Input\s*type=\"number\" min=\"0\" max=\"100\" step=\"any\" className=\"h-8 text-sm\"\s*value=\{selectedExtras\[s\.id\]\.pct\}\s*onChange=\{\(e\) => setSelectedExtras\(prev => \(\{ \.\.\.prev, \[s\.id\]: \{ \.\.\.prev\[s\.id\], pct: Number\(e\.target\.value\) \} \}\)\)\}\s*/>\s*</div>"
content = re.sub(pct_block, "", content)

# 2. Remove Comision Total Estimada
comision_summary_block = r"<div className=\"flex justify-between text-purple-700 font-semibold pt-1\">\s*<span>Comisión Total Estimada:</span>\s*<span>\{formatPrice\(\(\(Number\(montoAcordado\) \|\| 0\) \* \(tenantBase \|\| 2\.5\) / 100\) \+ Object\.values\(selectedExtras\)\.reduce\(\(acc, s\) => acc \+ \(s\.monto \* s\.pct / 100\), 0\)\)\} MXN</span>\s*</div>"
content = re.sub(comision_summary_block, "", content)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
