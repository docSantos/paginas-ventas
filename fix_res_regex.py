import os
import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject import
if 'import { FinanzasCard, calcularFinanzasReserva }' not in content:
    content = content.replace("import { createClient } from '@/lib/supabase/client'", "import { createClient } from '@/lib/supabase/client'\nimport { FinanzasCard, calcularFinanzasReserva } from './FinanzasCard'")

# 2. Remove calcularFinanzasReserva definition if exists
content = re.sub(r'const calcularFinanzasReserva = \([^}]+\}\n*\}?;?\n?', '', content)

# 3. Replace the FINANZAS block.
# In both llegadasHoy and proximasLlegadas, there is a block:
# <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm space-y-1.5">
# ...
# <span className={`font-bold ${saldo <= 0.5 ? 'text-green-600' : 'text-red-600'}`}>
#   {liquidado ? 'Liquidado' : formatPrice(saldo)}
# </span>
# </div>
# </div>

target_block = r'<div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm space-y-1\.5">[\s\S]*?<span className=\{`font-bold \$\{saldo <= 0\.5 \? \'text-green-600\' : \'text-red-600\'\}`\}>\s*\{liquidado \? \'Liquidado\' : formatPrice\(saldo\)\}\s*</span>\s*</div>\s*</div>'

replacement = '<div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm space-y-1.5 shadow-sm">\n<FinanzasCard reserva={r} onEditTarifa={(id, current) => setEditTarifaModal({ open: true, reservaId: id, currentBase: current })} />\n</div>'

new_content, count = re.subn(target_block, replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)
print(f"Replaced {count} instances in ReservasClient")
