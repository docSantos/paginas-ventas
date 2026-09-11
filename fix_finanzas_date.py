import os
import re

filepath = 'src/components/casasgaby/admin/FinanzasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import_statement = "import { format } from 'date-fns'\nimport { es } from 'date-fns/locale'"
content = content.replace("import { formatPrice, formatDateEs } from '@/lib/utils'", "import { formatPrice, formatDateEs } from '@/lib/utils'\n" + import_statement)

# Replace the specific td inside filteredPagos.map
target = r'<td className="px-4 py-3 whitespace-nowrap text-gray-600">\{formatDateEs\(p\.created_at\)\}</td>'

replacement = """<td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {format(new Date(p.created_at || p.fecha), "dd MMM yyyy", { locale: es })}
                          </div>
                          <div className="text-xs text-gray-400">
                            {format(new Date(p.created_at || p.fecha), "HH:mm 'hrs'", { locale: es })}
                          </div>
                        </td>"""

content = re.sub(target, replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated FinanzasClient")
