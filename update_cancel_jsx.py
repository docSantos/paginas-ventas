import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"""<div>\s*<label className="text-xs font-medium text-gray-700 block mb-1">Monto a reembolsar</label>\s*<input\s*type="number"\s*min="0"\s*className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm\s*focus:outline-none focus:ring-2 focus:ring-purple-500"\s*value=\{cancelData\.amount\}\s*onChange=\{e => setCancelData\(\{...cancelData, amount: e\.target\.value\}\)\}\s*/>\s*</div>"""

new_jsx = """<div>
                        <label className="text-xs font-bold text-slate-900 block mb-1">
                          Monto a reembolsar <span className="text-amber-500 ml-1">●</span>
                        </label>
                        <input 
                          type="number" 
                          min="0"
                          className="w-full rounded-md border-2 border-amber-400 bg-amber-50/40 px-3 py-2 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                          value={cancelData.amount}
                          onChange={e => setCancelData({...cancelData, amount: e.target.value})}
                        />
                      </div>"""

content = re.sub(pattern, new_jsx, content)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
