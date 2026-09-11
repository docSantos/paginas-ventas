import os

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
count = 0

for i, line in enumerate(lines):
    if '<h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Finanzas</h4>' in line:
        # We found the FINANZAS header. We want to skip from the next div to the end of the block.
        new_lines.append(line)
        continue
    
    if '<div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm space-y-1.5">' in line:
        skip = True
        count += 1
        new_lines.append('                            <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm space-y-1.5 shadow-sm">\n')
        new_lines.append('                              <FinanzasCard reserva={r} onEditTarifa={(id, current) => setEditTarifaModal({ open: true, reservaId: id, currentBase: current })} />\n')
        continue
    
    if skip:
        # Stop skipping when we hit the end of the FINANZAS block box (a closing div before COMISIÓN)
        # We can look for the next "COMISIÓN" header or similar.
        if '<h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Comisión</h4>' in line:
            skip = False
            # Wait, we need to add the closing div for FINANZAS box before this line
            new_lines.append('                            </div>\n')
            new_lines.append(line)
        elif 'ComisiónPagada' in line or 'Comisión' in line or 'Total Comisión' in line:
            pass # Keep skipping if we haven't found the header
            
    if not skip:
        new_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print(f"Replaced {count} instances in ReservasClient")
