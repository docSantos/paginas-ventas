import os
import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace the entire FINANZAS content box in ReservasClient.tsx with FinanzasCard.
# Currently it looks like:
# <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm space-y-1.5">
# ... up to the end of the FINANZAS block.

target = r'<div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm space-y-1\.5">[\s\S]*?<div className="flex justify-between border-t border-gray-100 pt-1\.5 mt-1\.5">\s*<span className="text-gray-900 font-bold">Saldo Pendiente:</span>\s*<span className={`font-bold \$\{saldo <= 0\.5 \? \'text-green-600\' : \'text-red-600\'\}`}>\s*\{liquidado \? \'Liquidado\' : formatPrice\(saldo\)\}\s*</span>\s*</div>\s*</div>'

# Let's replace it with the FinanzasCard
replacement = '<div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm space-y-1.5 shadow-sm">\n<FinanzasCard reserva={r} onEditTarifa={(id, current) => setEditTarifaModal({ open: true, reservaId: id, currentBase: current })} />\n</div>'

new_content, count = re.subn(target, replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)
print(f"Replaced {count} instances in ReservasClient")
