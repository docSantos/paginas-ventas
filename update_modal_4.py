import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove max-h and overflow from the container, and update header
old_catalog_header = """<p className="font-semibold text-teal-900 mb-1">Catǭlogo de Servicios:</p>
                    {servicios.length > 0 ? (
                      <div className="space-y-2 max-h-[160px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-1">"""

new_catalog_header = """<p className="font-semibold text-teal-900 mb-1">Catálogo de Servicios ({servicios.length} disponibles):</p>
                    {servicios.length > 0 ? (
                      <div className="space-y-2">"""

# Replace specifically the header part. Due to encoding issues with 'Catǭlogo', I'll use regex.
content = re.sub(
    r'<p className="font-semibold text-teal-900 mb-1">Cat.*?logo de Servicios:</p>\s*\{servicios\.length > 0 \? \(\s*<div className="space-y-2 max-h-\[160px\] overflow-y-auto \[scrollbar-width:none\] \[-ms-overflow-style:none\] \[&::-webkit-scrollbar\]:hidden pr-1">',
    r'<p className="font-semibold text-teal-900 mb-1">Catálogo de Servicios ({servicios.length} disponibles):</p>\n                    {servicios.length > 0 ? (\n                      <div className="space-y-2">',
    content,
    flags=re.DOTALL
)

# 2. Fix the Banknote icon exactly as requested
old_payment_buttons = """                  {['Efectivo', 'Transferencia'].map(m => (
                    <button
                      key={m}
                      onClick={() => setConfMetodo(m)}
                      className={`flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm rounded-lg border font-medium transition-colors ${confMetodo === m ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400'}`}
                    >
                      {m === 'Efectivo' ? <Banknote className="h-4 w-4 shrink-0" /> : <ArrowRightLeft className="h-4 w-4 shrink-0" />}
                      <span>{m}</span>
                    </button>
                  ))}"""

new_payment_buttons = """                  {['Efectivo', 'Transferencia'].map(m => (
                    <button
                      key={m}
                      onClick={() => setConfMetodo(m)}
                      className={`flex-1 inline-flex items-center justify-center py-2 text-sm rounded-lg border font-medium transition-colors ${confMetodo === m ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400'}`}
                    >
                      {m === 'Efectivo' ? <Banknote className="w-4 h-4 mr-1.5" /> : <ArrowRightLeft className="w-4 h-4 mr-1.5" />}
                      <span>{m}</span>
                    </button>
                  ))}"""

content = content.replace(old_payment_buttons, new_payment_buttons)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
