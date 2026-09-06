import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Change default tab
content = content.replace(
    "const [activeTab, setActiveTab] = useState<'kpis'|'comisiones'>('kpis')",
    "const [activeTab, setActiveTab] = useState<'ledger'|'kpis'|'comisiones'>('ledger')\n  const [ledgerSearch, setLedgerSearch] = useState('')\n  const [ledgerFilterMethod, setLedgerFilterMethod] = useState('Todos')\n  const [ledgerFilterDate, setLedgerFilterDate] = useState('Todo')"
)

# Insert the Tab button
old_tabs_html = r"""      <div className="space-y-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick=\{.*?\}
            className=\{`py-3 px-6 text-sm font-medium border-b-2 transition-colors \$\{.*?\}
            \}`}
          >
            Métricas y Rendimiento
          </button>"""

new_tabs_html = """      <div className="space-y-6">
        <div className="flex flex-wrap border-b border-gray-200">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'ledger' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Libro Mayor
          </button>
          <button
            onClick={() => setActiveTab('kpis')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'kpis' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Métricas y Rendimiento
          </button>"""

# Using replace for safety (sometimes regex with newlines is finicky)
if "Métricas y Rendimiento" in content:
    content = content.replace("""<button
            onClick={() => setActiveTab('kpis')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'kpis' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Métricas y Rendimiento
          </button>""", """<button
            onClick={() => setActiveTab('ledger')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'ledger' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Libro Mayor
          </button>
          <button
            onClick={() => setActiveTab('kpis')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'kpis' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Métricas y Rendimiento
          </button>""")
else:
    # If using utf-8 encoding and the original file has 'MǸtricas', let's just search for it
    pass

# We will just write a new script that generates a whole file or injects using a known marker.
