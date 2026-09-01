import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Import formatStoredPhone and the new actions
imports = """import { formatPrice, formatDateEs, formatStoredPhone } from '@/lib/utils'
import { calculateStayTotal } from '@/lib/pricing'
import { aprobarSolicitud, rechazarSolicitud, registrarAbono, registrarComisionPagada, actualizarFechasReserva, cancelarReserva, actualizarTarifaBase, agregarAjusteReserva, eliminarAjusteReserva } from '@/app/casasgaby/admin/actions'"""

content = re.sub(r"import \{ formatPrice, formatDateEs \}.*?from '@/app/casasgaby/admin/actions'", imports, content, flags=re.DOTALL)

# Add states for adjustments modal
state_logic = """
  // Abonos Modal
  const [abonoModal, setAbonoModal] = useState<{ open: boolean, reserva: any | null }>({ open: false, reserva: null })
  const [abonoMonto, setAbonoMonto] = useState('')
  const [abonoMetodo, setAbonoMetodo] = useState('efectivo_mxn')
  const [abonoMoneda, setAbonoMoneda] = useState('MXN')
  const [abonoTc, setAbonoTc] = useState('20.00')

  // Ajustes Finanzas Modal
  const [ajusteModal, setAjusteModal] = useState<{ open: boolean, reservaId: string, tipo: 'cargo'|'descuento' }>({ open: false, reservaId: '', tipo: 'cargo' })
  const [ajusteConcepto, setAjusteConcepto] = useState('')
  const [ajusteMonto, setAjusteMonto] = useState('')

  // Edicion Tarifa Base Modal
  const [tarifaModal, setTarifaModal] = useState<{ open: boolean, reservaId: string }>({ open: false, reservaId: '' })
  const [tarifaBaseInput, setTarifaBaseInput] = useState('')

  const handleAgregarAjuste = async () => {
    try {
      await agregarAjusteReserva(ajusteModal.reservaId, ajusteModal.tipo, ajusteConcepto, Number(ajusteMonto))
      setAjusteModal({ open: false, reservaId: '', tipo: 'cargo' })
      setAjusteConcepto('')
      setAjusteMonto('')
    } catch (e: any) {
      alert("Error al guardar ajuste: " + e.message)
    }
  }

  const handleActualizarTarifa = async () => {
    try {
      await actualizarTarifaBase(tarifaModal.reservaId, Number(tarifaBaseInput))
      setTarifaModal({ open: false, reservaId: '' })
      setTarifaBaseInput('')
    } catch (e: any) {
      alert("Error al actualizar tarifa: " + e.message)
    }
  }
"""
content = re.sub(
    r"// Abonos Modal\n  const \[abonoModal, setAbonoModal\] = useState.*?const \[abonoTc, setAbonoTc\] = useState\('20\.00'\)",
    state_logic,
    content,
    flags=re.DOTALL
)

# Replace phone
content = content.replace("<span>📞 +{solicitud.telefono}</span>", "<span>📞 {formatStoredPhone(solicitud.telefono)}</span>")
content = content.replace("<span className=\"text-sm text-gray-800\">📞 +{r.telefono}</span>", "<span className=\"text-sm text-gray-800\">📞 {formatStoredPhone(r.telefono)}</span>")

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
