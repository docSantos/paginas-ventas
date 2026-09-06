import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add imports
content = content.replace("import { useState, useMemo } from 'react'", "import { useState, useMemo, useEffect } from 'react'\nimport { useRouter, useSearchParams } from 'next/navigation'")

# 2. Modify activeTab state initialization
old_state = "const [activeTab, setActiveTab] = useState<'ledger'|'kpis'|'comisiones'>('ledger')"

new_state = """const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'ledger'|'kpis'|'comisiones'>('ledger')

  // Initialize from URL
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'ledger' || tab === 'kpis' || tab === 'comisiones') {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Wrapper function to update state and URL
  const handleTabChange = (tab: 'ledger'|'kpis'|'comisiones') => {
    setActiveTab(tab)
    router.replace(`?tab=${tab}`, { scroll: false })
  }"""

content = content.replace(old_state, new_state)

# 3. Replace all onClick={() => setActiveTab('tab')} with onClick={() => handleTabChange('tab')}
content = content.replace("onClick={() => setActiveTab('ledger')}", "onClick={() => handleTabChange('ledger')}")
content = content.replace("onClick={() => setActiveTab('kpis')}", "onClick={() => handleTabChange('kpis')}")
content = content.replace("onClick={() => setActiveTab('comisiones')}", "onClick={() => handleTabChange('comisiones')}")

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
