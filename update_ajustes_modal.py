import re

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove state variable `servComision`
content = re.sub(r"const \[servComision, setServComision\] = useState\('5'\)\n", "", content)

# 2. Update `openServicioModal`
content = re.sub(r"setServComision\(String\(s\.porcentaje_comision \?\? 5\)\)\n", "", content)
content = re.sub(r"setServComision\('5'\)\n", "", content)

# 3. Update `handleSaveServicio` payload for `actualizarServicio`
content = re.sub(r"porcentaje_comision: Number\(servComision\)", "", content)

# 4. Update `handleSaveServicio` payload for `crearServicio`
content = re.sub(r"await crearServicio\(servNombre, servDesc, Number\(servPrecio\), servTipo, true, Number\(servComision\)\)", 
                 r"await crearServicio(servNombre, servDesc, Number(servPrecio), servTipo, true)", content)

# Also fix the trailing comma if present in actualizarServicio data
# { ..., tipo_tarifa: servTipo, }
content = re.sub(r"tipo_tarifa: servTipo,\s*}", r"tipo_tarifa: servTipo\n          }", content)


# 5. Remove the table column for commission if we want? 
# The prompt says: "Actualiza el modal de "Editar / Crear Servicio"... Elimina el input numérico editable de "% de Comisión" ... Reemplázalo por un badge".
# It doesn't strictly say to remove it from the table, but the table says "10%".
# In the table: `<td className="px-4 py-3 text-center font-medium text-purple-600">{s.porcentaje_comision ?? 10}%</td>`
# Let's change it to: `<td className="px-4 py-3 text-center font-medium text-purple-600">{s.porcentaje_comision ?? 5}%</td>`
content = content.replace("{s.porcentaje_comision ?? 10}%", "{s.porcentaje_comision ?? 5}%")

# 6. Replace the input in the JSX modal
old_input = r"""<div>
                <label className="text-sm font-medium block mb-1">% de Comisi(?:ó|o)n</label>
                <Input type="number" min="0" max="100" step="any" onKeyDown=\{e => e\.key === '-' && e\.preventDefault\(\)\} value=\{servComision\} onChange=\{e => setServComision\(e\.target\.value\)\} />
              </div>"""

new_badge = """<div className="bg-purple-50 p-3 rounded-lg border border-purple-100 mt-2">
                <span className="text-sm font-medium text-purple-900 block mb-0.5">Comisión de servicio: 5%</span>
                <span className="text-xs text-purple-600">(Fijada por configuración general)</span>
              </div>"""

content = re.sub(old_input, new_badge, content, flags=re.DOTALL)
# (Handle encoding mismatch on 'ó' by using (?:ó|o) just in case it was decoded weirdly, actually it was 'Comisin' in powershell cat output. Let's just use `Comisi.*n`)

old_input_fallback = r"""<div>\s*<label className="text-sm font-medium block mb-1">% de Comisi.*?n</label>\s*<Input type="number" min="0" max="100" step="any" onKeyDown=\{e => e\.key === '-' && e\.preventDefault\(\)\} value=\{servComision\} onChange=\{e => setServComision\(e\.target\.value\)\} />\s*</div>"""

content = re.sub(old_input_fallback, new_badge, content, flags=re.DOTALL)

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
