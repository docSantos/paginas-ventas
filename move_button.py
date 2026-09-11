import os
import re

filepath = 'src/components/casasgaby/PropertyDetailClient.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the buttons in the modal (remove Fechas)
old_buttons = """<div className="flex gap-2 mb-2">
            <button type="button" onClick={siguienteContactoPrueba} className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold px-2 py-1 rounded border border-amber-300">🎲 Contacto</button>
            <button type="button" onClick={siguienteFechasPrueba} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded border border-blue-300">📅 Fechas</button>
          </div>"""

new_buttons = """<div className="flex gap-2 mb-2">
            <button type="button" onClick={siguienteContactoPrueba} className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold px-2 py-1 rounded border border-amber-300">🎲 Contacto</button>
          </div>"""

content = content.replace(old_buttons, new_buttons)

# Add Fechas button to the "Cotiza tu estadía" header
old_header = '<h2 className="font-semibold text-lg mb-3 text-gray-900">Cotiza tu estadía</h2>'
new_header = """<div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-lg text-gray-900">Cotiza tu estadía</h2>
            <button type="button" onClick={siguienteFechasPrueba} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded border border-blue-300">📅 Fechas</button>
          </div>"""

content = content.replace(old_header, new_header)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Moved 'Fechas' button to Cotiza tu estadía header")
