import os
import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
if 'import { FinanzasCard }' not in content:
    content = content.replace("import { formatPrice } from '@/lib/utils'", "import { formatPrice } from '@/lib/utils'\nimport { FinanzasCard } from './FinanzasCard'")

# We had calcularFinanzasReserva defined in ReservasClient.tsx. I should remove it.
calc_target = r"export const calcularFinanzasReserva = \([^}]+\}\s*"
content = re.sub(calc_target, "", content)

# Now find the FINANZAS block rendering in ReservasClient
# Starts at <div className="flex justify-between items-center">\s*<span className="text-gray-600 flex items-center gap-1.5">\s*Hospedaje base:
# Ends at the </span>\s*</div> related to Saldo Pendiente. Let's build a regex.
finanzas_target = r'<div className="flex justify-between items-center">\s*<span className="text-gray-600 flex items-center gap-1\.5">\s*Hospedaje base:[\s\S]*?<span className=\{`font-bold \$\{saldo <= 0\.5 \? \'text-green-600\' : \'text-red-600\'\}`\}>\s*\{liquidado \? \'Liquidado\' : formatPrice\(saldo\)\}\s*</span>\s*</div>'

finanzas_replacement = '<FinanzasCard reserva={r} onEditTarifa={(id, current) => setEditTarifaModal({ open: true, reservaId: id, currentBase: current })} />'

content = re.sub(finanzas_target, finanzas_replacement, content)

# I should also remove the inline <details> tag that I injected before for "Ver historial de pagos" because FinanzasCard includes it!
details_target = r'\{r\.transacciones && r\.transacciones\.length > 0 && \(\s*<details className="mt-2 text-xs">[\s\S]*?</details>\s*\)\}'
content = re.sub(details_target, '', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ReservasClient Finanzas block")
