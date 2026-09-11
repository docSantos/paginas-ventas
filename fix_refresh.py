import os

filepath = 'src/components/casasgaby/admin/ClientesClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """      const res = await aprobarSolicitud(
        sol.id, finalTotal, anticipo,
        confMetodo === 'Transferencia' ? 'transferencia_mxn' : 'efectivo_mxn',
        confMoneda, tc, finalExtrasList
      )
      if (res && !res.success) return setConfError(res.message || 'Error al confirmar.')
      setConfirmModal({ open: false, solicitud: null })
      setConfAnticipo('')
      setConfReferencia('')"""

replacement = """      const res = await aprobarSolicitud(
        sol.id, finalTotal, anticipo,
        confMetodo === 'Transferencia' ? 'transferencia_mxn' : 'efectivo_mxn',
        confMoneda, tc, finalExtrasList
      )
      if (res && !res.success) return setConfError(res.message || 'Error al confirmar.')
      setConfirmModal({ open: false, solicitud: null })
      setConfAnticipo('')
      setConfReferencia('')
      router.refresh()"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added router.refresh()")
else:
    print("Not found")
