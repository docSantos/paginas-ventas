import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Tabs: The original string has "MǸtricas y Rendimiento" (or utf-8 corrupted version)
old_tabs_block = r"""<div className="flex border-b border-gray-200">\s*<button\s*onClick=\{\(\) => setActiveTab\('kpis'\)\}.*?>.*?</button>\s*<button\s*onClick=\{\(\) => setActiveTab\('comisiones'\)\}.*?>.*?</button>\s*</div>"""

new_tabs_block = """<div className="flex flex-wrap border-b border-gray-200 gap-y-2">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`py-3 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'ledger' ? 'border-teal-600 text-teal-700 bg-teal-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Libro Mayor
          </button>
          <button
            onClick={() => setActiveTab('kpis')}
            className={`py-3 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'kpis' ? 'border-teal-600 text-teal-700 bg-teal-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Métricas y Rendimiento
          </button>
          <button
            onClick={() => setActiveTab('comisiones')}
            className={`py-3 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'comisiones' ? 'border-teal-600 text-teal-700 bg-teal-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Liquidación de Comisiones
          </button>
        </div>"""

content = re.sub(old_tabs_block, new_tabs_block, content, flags=re.DOTALL)

# Fix Typography: text-2xl font-bold text-gray-900 -> text-xl sm:text-2xl font-bold tracking-tight text-gray-900 truncate
content = content.replace('text-2xl font-bold text-gray-900', 'text-xl sm:text-2xl font-bold tracking-tight text-gray-900 truncate')

# Prevent card overflow by adding overflow-hidden and ensuring padding is sensible.
# The cards are already standard CardContent. We'll just replace their class.
content = content.replace('<CardContent>', '<CardContent className="overflow-hidden">')

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
