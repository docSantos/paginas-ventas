import os
import re

filepath = 'src/components/casasgaby/admin/OperacionClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Target in OperacionClient.tsx (inHouse.map block)
# Starts with: <div className="flex justify-between items-center">\n  <span className="text-gray-600 flex items-center gap-1.5">\n Hospedaje base:
# Ends with: })()}
# Actually earlier I replaced a big chunk. Let's find exactly the block.

target_regex = r'<div className="flex justify-between items-center">\s*<span className="text-gray-600 flex items-center gap-1\.5">\s*Hospedaje base:[\s\S]*?\}\)\(\)\}'

new_content, count = re.subn(target_regex, '<FinanzasCard reserva={r} />', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print(f"Replaced {count} instances in OperacionClient.tsx.")
