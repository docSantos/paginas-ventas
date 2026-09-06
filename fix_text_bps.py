import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<span className="hidden sm:inline">seleccionadas | Total:</span>', '<span className="hidden md:inline">seleccionadas | Total:</span>')
content = content.replace('<span className="sm:hidden">Total:</span>', '<span className="md:hidden">Total:</span>')

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
