import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix activeTab and add missing states
old_tab = "const [activeTab, setActiveTab] = useState<'kpis'|'comisiones'>('kpis')"
new_tab = """const [localComisiones, setLocalComisiones] = useState<any[]>(comisiones || [])
  const [selectedComisiones, setSelectedComisiones] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'ledger'|'kpis'|'comisiones'>('ledger')"""

content = content.replace(old_tab, new_tab)

# Also ensure we have the Ledger tab in the UI!
old_tabs_block = re.compile(r'<div className="flex border-b border-gray-200">\s*<button\s*onClick=\{\(\) => setActiveTab\(\'kpis\'\)\}.*?>.*?<button\s*onClick=\{\(\) => setActiveTab\(\'comisiones\'\)\}.*?</button>\s*</div>', re.DOTALL)

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

content = old_tabs_block.sub(new_tabs_block, content)

# And fix typography for KPI cards!
content = content.replace('text-2xl font-bold text-gray-900', 'text-xl sm:text-2xl font-bold tracking-tight text-gray-900 truncate')
content = content.replace('<CardContent>', '<CardContent className="overflow-hidden">')

# Also, I need to restore the ledger section UI since `git checkout` removed it?
# Let's check if `{activeTab === 'ledger' && (` is there.
# If not, I should grab it from FinanzasClient.tsx if it was completely lost. Wait, `git checkout` reverted everything...

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
