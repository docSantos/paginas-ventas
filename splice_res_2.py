import os

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []

# First pass: add imports
has_import = False
for line in lines:
    if 'FinanzasCard' in line and 'import' in line:
        has_import = True
if not has_import:
    # insert after supabase import
    for i, line in enumerate(lines):
        new_lines.append(line)
        if "import { createClient } from '@/lib/supabase/client'" in line:
            new_lines.append("import { FinanzasCard, calcularFinanzasReserva } from './FinanzasCard'\n")
else:
    new_lines = lines[:]

# Re-read
lines = new_lines[:]
new_lines = []

skip = False
for i, line in enumerate(lines):
    if 'const calcularFinanzasReserva =' in line:
        skip = True
    
    if skip and '};' in line and i > 0 and 'return' in lines[i-1]:
        skip = False
        continue
    if skip and '}' in line and i > 0 and '};' in lines[i-1]:
        skip = False
        continue
    
    if not skip:
        new_lines.append(line)

lines = new_lines[:]
new_lines = []

# Third pass: find FINANZAS blocks
skip = False
count = 0
for i, line in enumerate(lines):
    if '<div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm space-y-1.5">' in line:
        skip = True
        count += 1
        new_lines.append('                            <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm space-y-1.5 shadow-sm">\n')
        new_lines.append('                              <FinanzasCard reserva={r} onEditTarifa={(id, current) => setEditTarifaModal({ open: true, reservaId: id, currentBase: current })} />\n')
        continue
    
    if skip:
        if '<div className="flex justify-between border-t border-gray-100 pt-1.5 mt-1.5">' in line:
            # We found the end part of the block (Saldo Pendiente)
            # We need to skip this line and the next 4 lines
            pass
        elif 'Saldo Pendiente' in line:
            pass
        elif 'Liquidado' in line:
            pass
        elif '</span>' in line and 'font-bold' in lines[i-1] if i>0 else False:
            pass
        elif '</div>' in line and ('Liquidado' in lines[i-1] if i>0 else False or 'Saldo Pendiente' in lines[i-3] if i>3 else False):
            # This is the closing div of the Finanzas block.
            skip = False
            new_lines.append('                            </div>\n')
            continue
            
        # Or, safer: just look for the next COMISIÓN header
        if 'Comisión</h4>' in line or 'ComisiónPagada' in line or 'COMISIÓN' in line.upper():
            skip = False
            new_lines.append('                            </div>\n')
            new_lines.append(line)
            continue
            
    if not skip:
        new_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Replaced {count} instances in ReservasClient")
