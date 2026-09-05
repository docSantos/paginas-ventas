import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the useEffect and refs
useeffect_regex = r"  useEffect\(\(\) => \{.*?\n  \}, \[showSuccessBanner\]\);\n*"
content = re.sub(useeffect_regex, "", content, flags=re.DOTALL)

ref_regex = r"\s*const mensajeExitoRef = useRef<HTMLDivElement>\(null\)"
content = re.sub(ref_regex, "", content)

# 2. Remove the old banner block completely
old_banner_regex = r"(\s*)\{showSuccessBanner && \(\s*<div id=\"banner-exito-reserva\".*?</div>\s*\)\}"
content = re.sub(old_banner_regex, "", content, flags=re.DOTALL)

# 3. Replace the Cotiza tu estadía container
cotiza_start = r"(<div className=\"bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm\">\s*<h2 className=\"font-semibold text-lg mb-3 text-gray-900\">Cotiza tu estad.*?</p>\s*</div>\s*\}?\s*</div>)"

replacement_cotiza = r"""{showSuccessBanner ? (
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
          \1
        )}"""

content = re.sub(cotiza_start, replacement_cotiza, content, flags=re.DOTALL)

# 4. Hide bottom bar if success banner is true
bottom_bar_regex = r"(<div className=\"fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200)"
replacement_bottom_bar = r"{!showSuccessBanner && (\n        \1"

content = re.sub(bottom_bar_regex, replacement_bottom_bar, content)

# we need to close the !showSuccessBanner condition at the end of the div
# let's look for the end of the fixed bottom bar
button_end_regex = r"(</Button>\n\s*</div>)"
replacement_button_end = r"\1\n        )}"
content = re.sub(button_end_regex, replacement_button_end, content, count=1)


with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
