import re

filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf8') as f:
    content = f.read()

# Add useRouter import
if "import { useRouter }" not in content:
    content = content.replace("import { useState } from 'react'", "import { useState } from 'react'\nimport { useRouter } from 'next/navigation'")

# Add useRouter hook
target_hook = "const [expanded, setExpanded] = useState<Record<string, boolean>>({})"
repl_hook = "const [expanded, setExpanded] = useState<Record<string, boolean>>({})\n  const router = useRouter()"
if "const router = useRouter()" not in content:
    content = content.replace(target_hook, repl_hook)

# Update handleGuardarComision
target_func = """  const handleGuardarComision = async () => {
    if (!comisionModal.reserva || !comisionMonto) return
    try {
      await registrarComisionPagada(comisionModal.reserva.id, parseFloat(comisionMonto))
      setComisionModal({ open: false, reserva: null })
      setComisionMonto('')
    } catch (e: any) {
      alert("Error al registrar comisión: " + e.message)
    }
  }"""

repl_func = """  const handleGuardarComision = async () => {
    if (!comisionModal.reserva || !comisionMonto) return
    try {
      await registrarComisionPagada(comisionModal.reserva.id, parseFloat(comisionMonto))
      setComisionModal({ open: false, reserva: null })
      setComisionMonto('')
      router.refresh()
    } catch (e: any) {
      alert("Error al registrar comisión: " + e.message)
    }
  }"""

if target_func in content:
    content = content.replace(target_func, repl_func)
    with open(filepath, 'w', encoding='utf8') as f:
        f.write(content)
    print("ReservasClient patched!")
else:
    print("Target function not found!")
