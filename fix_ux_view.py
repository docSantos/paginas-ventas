with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the exact indices
start_str = '<div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">'
end_str = "Anticipo para reservar: {formatPrice(cotizacion.anticipo)} (50%)\n              </p>\n            </div>\n          )}\n        </div>"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    end_idx += len(end_str)
    
    chunk_to_replace = content[start_idx:end_idx]
    
    replacement = """{showSuccessBanner ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-100 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">¡Solicitud Enviada con Éxito!</h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                Se ha abierto WhatsApp para continuar tu confirmación. Además, hemos registrado tu solicitud en el sistema y te atenderemos enseguida.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowSuccessBanner(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition"
              >
                Modificar fechas o cotizar de nuevo
              </button>
            </div>
          </div>
        ) : (
          """ + chunk_to_replace + """\n        )}"""
          
    content = content[:start_idx] + replacement + content[end_idx:]
    
with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
