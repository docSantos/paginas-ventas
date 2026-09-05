import re

with open('src/app/casasgaby/admin/propiedades/PropertyForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update signature
content = content.replace(
    "export function PropertyForm({ initialData }: { initialData?: Propiedad }) {",
    "export function PropertyForm({ initialData, serviciosCatalogo = [], initialServiciosIds = [] }: { initialData?: Propiedad, serviciosCatalogo?: any[], initialServiciosIds?: string[] }) {"
)

# 2. Add state and toggle logic
state_and_toggle = """  const [selectedServicios, setSelectedServicios] = useState<string[]>(initialServiciosIds)

  const toggleServicio = (id: string) => {
    setSelectedServicios(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }"""
content = content.replace("const [isLoading, setIsLoading] = useState(false)", "const [isLoading, setIsLoading] = useState(false)\n" + state_and_toggle)

# 3. Update saveProperty call
content = content.replace("await saveProperty(dataToSave, initialData?.id)", "await saveProperty(dataToSave, initialData?.id, selectedServicios)")

# 4. Render checkboxes after fotos box
fotos_box_end = """        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Fotos de la Casa</h3>
          <ImageUploader 
            initialFotos={formData.fotos} 
            onChange={(newFotos) => setFormData(prev => ({...prev, fotos: newFotos}))}
          />
        </div>"""

servicios_box = """        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Servicios Extra Disponibles</h3>
          <p className="text-sm text-gray-500 mb-2">Selecciona los servicios que aplican para esta propiedad.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {serviciosCatalogo.map((serv: any) => (
              <label key={serv.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500" 
                  checked={selectedServicios.includes(serv.id)}
                  onChange={() => toggleServicio(serv.id)}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{serv.nombre}</p>
                  <p className="text-xs text-gray-500">{serv.tipo_tarifa === 'fijo' ? 'Por estancia' : 'Por noche'}</p>
                </div>
              </label>
            ))}
            {serviciosCatalogo.length === 0 && (
              <p className="text-sm text-gray-500 italic">No hay servicios configurados en el catálogo.</p>
            )}
          </div>
        </div>"""

content = content.replace(fotos_box_end, fotos_box_end + "\n\n" + servicios_box)

with open('src/app/casasgaby/admin/propiedades/PropertyForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
