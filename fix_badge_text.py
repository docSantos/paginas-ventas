import re

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Match the entire purple box
pattern = r'<div className="bg-purple-50 p-3 rounded-lg border border-purple-100 mt-2">\s*<span className="text-sm font-medium text-purple-900 block mb-0\.5">Comisi[^n]+n de servicio automatizada</span>\s*<p className="text-xs text-purple-700">Se heredar[^l]+l 5% del tenant\.</p>\s*</div>'

new_box = """<div className="bg-purple-50 p-3 rounded-lg border border-purple-100 mt-2">
              <span className="text-sm font-medium text-purple-900 block mb-0.5">Comisión de servicio 5%</span>
            </div>"""

content = re.sub(pattern, new_box, content)

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
