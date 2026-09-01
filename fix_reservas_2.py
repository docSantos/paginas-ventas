import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Change signature
content = content.replace("export function ReservasClient({ solicitudes, reservas }: { solicitudes: Solicitud[], reservas: Reserva[] }) {", "export function ReservasClient({ solicitudes, reservas, servicios = [] }: { solicitudes: Solicitud[], reservas: Reserva[], servicios?: any[] }) {")

# Modify adjustment modal states to support catalog
state_mods = """  // Ajustes Finanzas Modal
  const [ajusteModal, setAjusteModal] = useState<{ open: boolean, reservaId: string, tipo: 'cargo'|'descuento' }>({ open: false, reservaId: '', tipo: 'cargo' })
  const [ajusteModo, setAjusteModo] = useState<'manual'|'catalogo'>('manual')
  const [ajusteCatSelected, setAjusteCatSelected] = useState<string>('')
  const [ajusteCantidad, setAjusteCantidad] = useState(1)
  const [ajusteConcepto, setAjusteConcepto] = useState('')
  const [ajusteMonto, setAjusteMonto] = useState('')

  const handleSelectCatalogo = (id: string) => {
    setAjusteCatSelected(id)
    const s = servicios.find(x => x.id === id)
    if (s) {
      setAjusteConcepto(s.nombre)
      if (s.tipo_tarifa === 'por_dia') {
        setAjusteMonto(String(s.precio_base * ajusteCantidad))
      } else if (s.tipo_tarifa !== 'negociable') {
        setAjusteMonto(String(s.precio_base))
      } else {
        setAjusteMonto('')
      }
    }
  }

  const handleCantidadChange = (qty: number) => {
    setAjusteCantidad(qty)
    const s = servicios.find(x => x.id === ajusteCatSelected)
    if (s && s.tipo_tarifa === 'por_dia') {
      setAjusteMonto(String(s.precio_base * qty))
    }
  }

  const openAjusteModal = (reservaId: string, tipo: 'cargo'|'descuento') => {
    setAjusteModo('manual')
    setAjusteCatSelected('')
    setAjusteCantidad(1)
    setAjusteConcepto('')
    setAjusteMonto('')
    setAjusteModal({ open: true, reservaId, tipo })
  }
"""

content = re.sub(r"  // Ajustes Finanzas Modal.*?const \[ajusteMonto, setAjusteMonto\] = useState\(''\)", state_mods, content, flags=re.DOTALL)

# Modify button clicks that open modal
content = content.replace("setAjusteModal({ open: true, reservaId: r.id, tipo: 'descuento' })", "openAjusteModal(r.id, 'descuento')")
content = content.replace("setAjusteModal({ open: true, reservaId: r.id, tipo: 'cargo' })", "openAjusteModal(r.id, 'cargo')")

# Modify the Modal UI
modal_ui = """
      {/* Modal Ajuste Reserva */}
      <Dialog open={ajusteModal.open} onOpenChange={(o) => setAjusteModal(p => ({ ...p, open: o }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ajusteModal.tipo === 'cargo' ? 'Agregar Cargo Extra' : 'Agregar Descuento'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            
            {ajusteModal.tipo === 'cargo' && (
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setAjusteModo('manual')}
                  className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                    ajusteModo === 'manual' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500'
                  }`}
                >
                  Manual
                </button>
                <button
                  onClick={() => setAjusteModo('catalogo')}
                  className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                    ajusteModo === 'catalogo' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500'
                  }`}
                >
                  De Catálogo
                </button>
              </div>
            )}

            {ajusteModo === 'catalogo' && ajusteModal.tipo === 'cargo' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Seleccionar Servicio</label>
                  <select 
                    className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
                    value={ajusteCatSelected}
                    onChange={e => handleSelectCatalogo(e.target.value)}
                  >
                    <option value="">-- Selecciona un servicio --</option>
                    {servicios.map(s => (
                      <option key={s.id} value={s.id}>{s.nombre} ({s.tipo_tarifa === 'por_dia' ? 'Por día' : s.tipo_tarifa === 'fijo' ? 'Fijo' : 'Variable'})</option>
                    ))}
                  </select>
                </div>
                {ajusteCatSelected && servicios.find(x => x.id === ajusteCatSelected)?.tipo_tarifa === 'por_dia' && (
                  <div>
                    <label className="text-sm font-medium block mb-1">Cantidad / Días</label>
                    <Input type="number" min="1" step="1" onKeyDown={e => e.key === '-' && e.preventDefault()} value={ajusteCantidad} onChange={e => handleCantidadChange(Number(e.target.value))} />
                  </div>
                )}
                {ajusteCatSelected && (
                  <div>
                    <label className="text-sm font-medium block mb-1">Monto (MXN)</label>
                    <Input 
                      type="number" min="0.01" step="any" onKeyDown={e => e.key === '-' && e.preventDefault()} 
                      value={ajusteMonto} 
                      onChange={e => setAjusteMonto(e.target.value)} 
                      disabled={servicios.find(x => x.id === ajusteCatSelected)?.tipo_tarifa !== 'negociable'} 
                    />
                  </div>
                )}
              </div>
            )}

            {(ajusteModo === 'manual' || ajusteModal.tipo === 'descuento') && (
              <>
                <div>
                  <label className="text-sm font-medium block mb-1">Concepto</label>
                  <Input type="text" value={ajusteConcepto} onChange={e => setAjusteConcepto(e.target.value)} placeholder="Ej. Mascotas, Check-out tardío..." />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Monto (MXN)</label>
                  <Input type="number" min="0.01" step="any" onKeyDown={e => e.key === '-' && e.preventDefault()} value={ajusteMonto} onChange={e => setAjusteMonto(e.target.value)} />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setAjusteModal(p => ({ ...p, open: false }))} className="flex-1">Cancelar</Button>
              <Button onClick={handleAgregarAjuste} className={`flex-1 text-white ${ajusteModal.tipo === 'cargo' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-orange-500 hover:bg-orange-600'}`}>
                Guardar {ajusteModal.tipo === 'cargo' ? 'Cargo' : 'Descuento'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
"""

content = re.sub(
    r"\{\/\* Modal Ajuste Reserva \*\/\}.*?Guardar \{ajusteModal\.tipo === 'cargo' \? 'Cargo' : 'Descuento'\}\n              </Button>\n            </div>\n          </div>\n        </DialogContent>\n      </Dialog>",
    modal_ui,
    content,
    flags=re.DOTALL
)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
