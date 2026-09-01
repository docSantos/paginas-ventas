import re

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add servComision state
content = content.replace(
    "const [servTipo, setServTipo] = useState('fijo')",
    "const [servTipo, setServTipo] = useState('fijo')\n  const [servComision, setServComision] = useState('5')"
)

# In openServicioModal
content = content.replace(
    "setServTipo(s.tipo_tarifa)",
    "setServTipo(s.tipo_tarifa)\n      setServComision(String(s.porcentaje_comision ?? 5))"
)
content = content.replace(
    "setServTipo('fijo')",
    "setServTipo('fijo')\n      setServComision('5')"
)

# In handleSaveServicio
content = content.replace(
    "tipo_tarifa: servTipo",
    "tipo_tarifa: servTipo,\n          porcentaje_comision: Number(servComision)"
)
content = content.replace(
    "crearServicio(servNombre, servDesc, Number(servPrecio), servTipo, true)",
    "crearServicio(servNombre, servDesc, Number(servPrecio), servTipo, true, Number(servComision))"
)

# Table Header
content = content.replace(
    "<th className=\"px-4 py-3\">Precio Base</th>",
    "<th className=\"px-4 py-3\">Precio Base</th>\n                <th className=\"px-4 py-3 text-center\">% Comisión</th>"
)

# Table Row
content = content.replace(
    "<td className=\"px-4 py-3\">{formatPrice(s.precio_base)}</td>",
    "<td className=\"px-4 py-3\">{formatPrice(s.precio_base)}</td>\n                  <td className=\"px-4 py-3 text-center font-medium text-purple-600\">{s.porcentaje_comision ?? 10}%</td>"
)

# Modal UI
modal_updates = """              <div>
                <label className="text-sm font-medium block mb-1">Tipo de Tarifa</label>
                <select className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm" value={servTipo} onChange={e => setServTipo(e.target.value)}>
                  <option value="fijo">Fijo</option>
                  <option value="por_dia">Por Día / Cantidad</option>
                  <option value="por_km">Por Km</option>
                  <option value="negociable">Negociable</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">% de Comisión</label>
              <Input type="number" min="0" max="100" step="any" onKeyDown={e => e.key === '-' && e.preventDefault()} value={servComision} onChange={e => setServComision(e.target.value)} />
            </div>"""
content = re.sub(
    r"<div>\s*<label className=\"text-sm font-medium block mb-1\">Tipo de Tarifa</label>.*?</div>\s*</div>",
    modal_updates,
    content,
    flags=re.DOTALL
)

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
