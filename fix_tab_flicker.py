import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = """const [activeTab, setActiveTab] = useState<'ledger'|'kpis'|'comisiones'>('ledger')

  // Initialize from URL
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'ledger' || tab === 'kpis' || tab === 'comisiones') {
      setActiveTab(tab)
    }
  }, [searchParams])"""

new_block = """const [activeTab, setActiveTab] = useState<'ledger'|'kpis'|'comisiones'>(() => {
    const tab = searchParams.get('tab')
    return (tab === 'kpis' || tab === 'comisiones') ? tab : 'ledger'
  })"""

content = content.replace(old_block, new_block)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
