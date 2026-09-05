import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_button = """              <button
                type="button"
                onClick={() => setShowSuccessBanner(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition"
              >
                Modificar fechas o cotizar de nuevo
              </button>"""

new_button = """              <button
                type="button"
                onClick={() => {
                  setFechaEntrada('')
                  setFechaSalida('')
                  setHuespedes(1)
                  setSelectedExtras({})
                  setFormData({ nombre: '', telefono: '', correo: '' })
                  setShowSuccessBanner(false)
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition"
              >
                Cotizar una nueva solicitud
              </button>"""

content = content.replace(old_button, new_button)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
