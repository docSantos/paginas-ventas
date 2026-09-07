import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
if 'useRouter' not in content:
    content = content.replace("import { useState } from 'react'", "import { useState, useEffect } from 'react'\nimport { useRouter, useSearchParams } from 'next/navigation'")

# 2. Add CrmPipeline imports and states
if 'export default function ClientesClient({ clientes }: { clientes: Cliente[] }) {' in content:
    content = content.replace("export default function ClientesClient({ clientes }: { clientes: Cliente[] }) {", "export default function ClientesClient({ clientes, solicitudes = [] }: { clientes: Cliente[], solicitudes?: any[] }) {")

# 3. Add tab state inside ClientesClient
tab_state = """
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'crm'|'directorio'>(() => {
    const tab = searchParams.get('tab')
    return (tab === 'directorio') ? 'directorio' : 'crm'
  })

  const handleTabChange = (tab: 'crm'|'directorio') => {
    setActiveTab(tab)
    router.replace(`?tab=${tab}`, { scroll: false })
  }
"""

pattern_start = re.compile(r'export default function ClientesClient\([^)]+\) \{')
match = pattern_start.search(content)
if match:
    content = content[:match.end()] + tab_state + content[match.end():]

# 4. Wrap the return statement with tabs. 
# We look for the main `return (\n      <div className="pb-24">`
old_return = """  return (
    <div className="pb-24">"""
new_return = """  return (
    <div className="pb-24 space-y-4">
      <div className="flex flex-wrap border-b border-gray-200 gap-y-2 mb-4 bg-white sticky top-0 z-20 px-4">
        <button
          onClick={() => handleTabChange('crm')}
          className={`py-3 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'crm'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Embudo CRM / Prospectos
        </button>
        <button
          onClick={() => handleTabChange('directorio')}
          className={`py-3 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'directorio'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Directorio de Huéspedes
        </button>
      </div>

      {activeTab === 'crm' && (
        <CrmPipeline solicitudes={solicitudes} />
      )}

      {activeTab === 'directorio' && (
        <div className="space-y-6">"""
content = content.replace(old_return, new_return)

# 5. We need to close the `activeTab === 'directorio' && ( <div className="space-y-6">` conditional
# Since `<div className="pb-24 space-y-4">` is the root, we can close the `directorio` div BEFORE the final closing div.
# We'll replace the last `</div>\n  )\n}`
content = content.replace("    </div>\n  )\n}", "        </div>\n      )}\n    </div>\n  )\n}")

# 6. Append CrmPipeline
crm_pipeline_code = """
function CrmPipeline({ solicitudes }: { solicitudes: any[] }) {
  const router = useRouter()
  const stages = [
    { id: 'nueva', title: 'Nuevas', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'contactado', title: 'Contactado', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 'cotizado', title: 'Cotizado', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { id: 'anticipo_pendiente', title: 'Anticipo', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 'convertida', title: 'Convertida', color: 'bg-green-100 text-green-800 border-green-200' },
    { id: 'descartada', title: 'Descartada', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  ]

  const normalizedSolicitudes = solicitudes.map(s => ({
    ...s,
    estado_crm: s.estado === 'Pendiente' ? 'nueva' : (s.estado || 'nueva')
  }))

  const [activeStage, setActiveStage] = useState('nueva')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const changeStage = async (id: string, stage: string) => {
    try {
      const { cambiarEtapaSolicitud } = await import('@/app/casasgaby/admin/actions')
      const res = await cambiarEtapaSolicitud(id, stage)
      if (!res.success) alert(res.error)
    } catch (e: any) {
      alert("Error: " + e.message)
    }
  }

  const renderCards = (stageId: string) => {
    const items = normalizedSolicitudes.filter(s => s.estado_crm.toLowerCase() === stageId.toLowerCase())
    if (items.length === 0) return <div className="text-sm text-gray-400 p-4 text-center">Vacío</div>
    
    return items.map(s => (
      <div key={s.id} className="bg-white p-3 rounded-xl border shadow-sm flex flex-col gap-2 relative transition-all hover:shadow-md">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-900 text-sm leading-tight">{s.nombre_cliente || s.nombre_completo}</h4>
          <span className="text-xs text-gray-500 font-medium">{formatDateEs(s.fecha_entrada)}</span>
        </div>
        <p className="text-xs text-teal-700 font-medium">{s.propiedades?.titulo}</p>
        <p className="text-xs text-gray-600 font-bold">{formatPrice(s.costo_total || 0)}</p>
        
        <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t">
          <a href={buildWaUrl(s.codigo_pais || '+52', s.telefono, `Hola ${s.nombre_cliente}, te escribo de Casas Gaby.`)} target="_blank" className="flex-1 bg-green-50 text-green-700 border border-green-200 text-xs py-1.5 rounded-md text-center hover:bg-green-100 font-medium transition-colors">
            WhatsApp
          </a>
          <select 
            className="flex-1 text-xs border rounded-md px-1 py-1.5 bg-gray-50 focus:ring-1 focus:ring-teal-500"
            value={s.estado_crm}
            onChange={(e) => changeStage(s.id, e.target.value)}
          >
            {stages.map(st => <option key={st.id} value={st.id}>{st.title}</option>)}
          </select>
        </div>
        
        {(stageId !== 'convertida' && stageId !== 'descartada') && (
          <Button size="sm" className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white h-8 text-xs font-semibold" onClick={() => window.location.href='/casasgaby/admin/reservas'}>
            Convertir a Reserva
          </Button>
        )}
      </div>
    ))
  }

  if (isMobile) {
    return (
      <div className="space-y-4 px-4 pb-20">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4">
          {stages.map(st => (
            <button
              key={st.id}
              onClick={() => setActiveStage(st.id)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${activeStage === st.id ? st.color + ' ring-1 ring-black/10 shadow-sm' : 'bg-white text-gray-600 border-gray-200'}`}
            >
              {st.title} ({normalizedSolicitudes.filter(s => s.estado_crm.toLowerCase() === st.id.toLowerCase()).length})
            </button>
          ))}
        </div>
        <div className="bg-gray-50/50 rounded-2xl min-h-[400px] border border-gray-200/50 p-2">
          <div className="space-y-3">
            {renderCards(activeStage)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 px-4 min-h-[600px]">
      {stages.map(st => (
        <div key={st.id} className="flex-none w-72 flex flex-col bg-gray-50/50 rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm">
          <div className={`p-3 border-b border-black/5 font-bold text-sm flex justify-between items-center ${st.color}`}>
            <span>{st.title}</span>
            <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-black shadow-sm">{normalizedSolicitudes.filter(s => s.estado_crm.toLowerCase() === st.id.toLowerCase()).length}</span>
          </div>
          <div className="p-3 flex-1 overflow-y-auto space-y-3">
            {renderCards(st.id)}
          </div>
        </div>
      ))}
    </div>
  )
}
"""

content = content + "\n" + crm_pipeline_code

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
