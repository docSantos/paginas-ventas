import re

with open('src/app/casasgaby/admin/finanzas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Suspense import
if "import { Suspense } from 'react'" not in content:
    content = "import { Suspense } from 'react'\n" + content

# Wrap FinanzasClient with Suspense
client_block = """      <FinanzasClient 
        propiedades={propiedades || []} 
        reservas={reservas || []} 
        pagos={pagos || []} 
        comisiones={comisiones || []}
      />"""

suspense_block = """      <Suspense fallback={<div className="p-8 text-center text-gray-500">Cargando libro mayor...</div>}>
        <FinanzasClient 
          propiedades={propiedades || []} 
          reservas={reservas || []} 
          pagos={pagos || []} 
          comisiones={comisiones || []}
        />
      </Suspense>"""

content = content.replace(client_block, suspense_block)

with open('src/app/casasgaby/admin/finanzas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
