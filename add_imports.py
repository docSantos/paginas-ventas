import os
import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'import { FinanzasCard, calcularFinanzasReserva }' not in content:
    content = content.replace("import { createClient } from '@/lib/supabase/client'", "import { createClient } from '@/lib/supabase/client'\nimport { FinanzasCard, calcularFinanzasReserva } from './FinanzasCard'")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added imports to ReservasClient")
