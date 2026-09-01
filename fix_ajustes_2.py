import re

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add new imports
new_imports = """import { crearServicio, actualizarServicio, eliminarServicio } from '@/app/casasgaby/admin/actions'
import { Edit2, Dialog as DialogIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatPrice } from '@/lib/utils'"""
content = re.sub(r"import \{ formatPhone, isPhoneValid \} from '@\/lib\/utils'", "import { formatPhone, isPhoneValid } from '@/lib/utils'\n" + new_imports, content)

# Add state
new_state = """
  const [servicios, setServicios] = useState<any[]>([])
  const [modalServicio, setModalServicio] = useState<{ open: boolean, servicio: any | null }>({ open: false, servicio: null })
  const [servNombre, setServNombre] = useState('')
  const [servDesc, setServDesc] = useState('')
  const [servPrecio, setServPrecio] = useState('')
  const [servTipo, setServTipo] = useState('fijo')

  const loadServicios = async () => {
    const db = supabase as any
    const { data } = await db.from('catalogo_servicios').select('*').order('created_at', { ascending: true })
    if (data) setServicios(data)
  }

  useEffect(() => {
    loadServicios()
  }, [])

  const handleSaveServicio = async () => {
    try {
      setSaving(true)
      if (modalServicio.servicio) {
        await actualizarServicio(modalServicio.servicio.id, {
          nombre: servNombre,
          descripcion: servDesc,
          precio_base: Number(servPrecio),
          tipo_tarifa: servTipo
        })
      } else {
        await crearServicio(servNombre, servDesc, Number(servPrecio), servTipo, true)
      }
      setModalServicio({ open: false, servicio: null })
      await loadServicios()
    } catch(e: any) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleServicio = async (id: string, activo: boolean) => {
    try {
      setSaving(true)
      await actualizarServicio(id, { activo })
      await loadServicios()
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteServicio = async (id: string) => {
    if (!confirm('¿Eliminar servicio?')) return
    try {
      setSaving(true)
      await eliminarServicio(id)
      await loadServicios()
    } finally {
      setSaving(false)
    }
  }

  const openServicioModal = (s: any = null) => {
    if (s) {
      setServNombre(s.nombre)
      setServDesc(s.descripcion || '')
      setServPrecio(String(s.precio_base))
      setServTipo(s.tipo_tarifa)
      setModalServicio({ open: true, servicio: s })
    } else {
      setServNombre('')
      setServDesc('')
      setServPrecio('')
      setServTipo('fijo')
      setModalServicio({ open: true, servicio: null })
    }
  }
"""
content = re.sub(r"const supabase = createClient\(\)\s*const loadConfig = async", "const supabase = createClient()\n" + new_state + "\n  const loadConfig = async", content)

# Add UI
new_ui = """
      {/* SECCIÓN SERVICIOS ESPECIALES */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">Catálogo de Servicios</h2>
            <p className="text-sm text-gray-600 mt-1">Gestiona servicios adicionales para agregar como cargos a las reservas.</p>
          </div>
          <Button onClick={() => openServicioModal()}>+ Agregar Servicio</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">Servicio</th>
                <th className="px-4 py-3">Tarifa</th>
                <th className="px-4 py-3">Precio Base</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {servicios.length === 0 && (
                <tr><td colSpan={5} className="text-center py-4 text-gray-500">No hay servicios</td></tr>
              )}
              {servicios.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{s.nombre}</div>
                    <div className="text-xs text-gray-500">{s.descripcion}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">{s.tipo_tarifa.replace('_', ' ')}</td>
                  <td className="px-4 py-3">{formatPrice(s.precio_base)}</td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => toggleServicio(s.id, !s.activo)}
                      className={`px-2 py-0.5 rounded text-xs font-bold uppercase transition-colors ${s.activo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {s.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button onClick={() => openServicioModal(s)} className="text-gray-400 hover:text-blue-600 p-1"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteServicio(s.id)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SERVICIO */}
      <Dialog open={modalServicio.open} onOpenChange={o => setModalServicio(p => ({...p, open: o}))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalServicio.servicio ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium block mb-1">Nombre del Servicio</label>
              <Input value={servNombre} onChange={e => setServNombre(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Descripción</label>
              <Input value={servDesc} onChange={e => setServDesc(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Precio Base</label>
                <Input type="number" min="0" step="any" onKeyDown={e => e.key === '-' && e.preventDefault()} value={servPrecio} onChange={e => setServPrecio(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Tipo de Tarifa</label>
                <select className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm" value={servTipo} onChange={e => setServTipo(e.target.value)}>
                  <option value="fijo">Fijo</option>
                  <option value="por_dia">Por Día / Cantidad</option>
                  <option value="por_km">Por Km</option>
                  <option value="negociable">Negociable</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalServicio(p => ({...p, open: false}))} className="flex-1">Cancelar</Button>
              <Button onClick={handleSaveServicio} className="flex-1" disabled={saving}>Guardar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
"""

content = content.replace("    </div>\n  )\n}", new_ui + "    </div>\n  )\n}")

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
