import re

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix imports
if "import { Input }" not in content:
    content = content.replace("import { Button } from '@/components/ui/button'", "import { Button } from '@/components/ui/button'\nimport { Input } from '@/components/ui/input'")

# Fix State
if "const [modalReserva" not in content:
    content = content.replace("const [loadingId, setLoadingId] = useState<string | null>(null)", """const [loadingId, setLoadingId] = useState<string | null>(null)
  const [modalReserva, setModalReserva] = useState<any>(null)
  const [montoPago, setMontoPago] = useState<string>('')
  const [metodoPago, setMetodoPago] = useState('Efectivo MXN')
  const [notasPago, setNotasPago] = useState('')""")

with open('src/components/casasgaby/admin/OperacionClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
