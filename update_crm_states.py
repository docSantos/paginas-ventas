import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Strict mapping for normalizedSolicitudes
old_norm = """    // Normalize states to 3 CRM stages
    const normalizedSolicitudes = solicitudes.map(s => {
      let estado_crm = 'por_contactar'
      const e = (s.estado || '').toLowerCase()
      if (['en_seguimiento', 'cotizado', 'anticipo_pendiente', 'contactado'].includes(e)) estado_crm = 'en_seguimiento'
      else if (['cerradas', 'convertida', 'Aprobada', 'descartada', 'Rechazada'].includes(s.estado) || ['cerradas', 'convertida', 'aprobada', 'descartada', 'rechazada'].includes(e)) estado_crm = 'cerradas'
      else if (['nueva', 'Pendiente', 'nueva'].includes(s.estado) || e === 'pendiente') estado_crm = 'por_contactar'
      return { ...s, estado_crm }
    })"""

new_norm = """    // Normalize states to 3 CRM stages
    const normalizedSolicitudes = solicitudes.map(s => {
      let estado_crm = 'por_contactar';
      if (s.estado === 'en_seguimiento') estado_crm = 'en_seguimiento';
      else if (s.estado === 'confirmada' || s.estado === 'descartada') estado_crm = 'cerradas';
      return { ...s, estado_crm };
    })"""

if old_norm in content:
    content = content.replace(old_norm, new_norm)
else:
    # regex fallback
    content = re.sub(
        r'// Normalize states to 3 CRM stages.*?return \{ \.\.\.s, estado_crm \}\n\s*\}\)',
        new_norm,
        content,
        flags=re.DOTALL
    )

# 2. Add 'confirmada' to esConvertida
content = content.replace(
    "const esConvertida = ['convertida', 'aprobada', 'Aprobada'].includes(s.estado)",
    "const esConvertida = s.estado === 'confirmada' || ['convertida', 'aprobada', 'Aprobada'].includes(s.estado)"
)

# 3. Update the Dropdown Select Options
old_select = """              <select
                className="flex-1 text-xs border rounded-md px-1 py-1.5 bg-gray-50 focus:ring-1 focus:ring-teal-500"
                value={s.estado_crm}
                onChange={(e) => changeStage(s.id, e.target.value)}
              >
                {stages.map(st => <option key={st.id} value={st.id}>{st.title}</option>)}
              </select>"""

new_select = """              <select
                className="flex-1 text-xs border rounded-md px-1 py-1.5 bg-gray-50 focus:ring-1 focus:ring-teal-500"
                value={s.estado === 'descartada' ? 'descartada' : s.estado === 'confirmada' ? 'confirmada' : s.estado_crm}
                onChange={(e) => changeStage(s.id, e.target.value)}
              >
                <option value="por_contactar">Por Contactar</option>
                <option value="en_seguimiento">En Seguimiento</option>
                <option value="descartada">Descartar</option>
                {s.estado === 'confirmada' && <option value="confirmada" disabled>Confirmada</option>}
              </select>"""

if old_select in content:
    content = content.replace(old_select, new_select)
else:
    content = re.sub(
        r'<select[^>]*value=\{s\.estado_crm\}[^>]*>.*?\{stages\.map\(.*?\}\s*</select>',
        new_select,
        content,
        flags=re.DOTALL
    )

# 4. Hide dropdown entirely if Cerrada? The user says:
# "Si una solicitud en 'Cerradas' reactiva conversación, el dropdown debe permitir devolverla a en_seguimiento."
# Wait, the dropdown is wrapped in {!isCerrada && ( ... )}, so it is HIDDEN if isCerrada!
# Let's fix that wrapper.

content = content.replace(
    "{!isCerrada && (\n            <div className=\"flex items-center gap-2 mt-2 pt-2 border-t\">\n              <button",
    "<div className=\"flex items-center gap-2 mt-2 pt-2 border-t\">\n              {!isCerrada && <button"
)
content = content.replace(
    "                {stages.map(st => <option key={st.id} value={st.id}>{st.title}</option>)}\n              </select>\n            </div>\n          )}",
    "                {s.estado === 'confirmada' && <option value=\"confirmada\" disabled>Confirmada</option>}\n              </select>\n            </div>"
)

# Need a robust way to replace the block
old_card_footer = """          {!isCerrada && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t">
              <button
                onClick={() => handleWhatsAppAndAdvance(s)}
                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                WhatsApp &rarr; Seguimiento
              </button>
              <select
                className="flex-1 text-xs border rounded-md px-1 py-1.5 bg-gray-50 focus:ring-1 focus:ring-teal-500"
                value={s.estado_crm}
                onChange={(e) => changeStage(s.id, e.target.value)}
              >
                {stages.map(st => <option key={st.id} value={st.id}>{st.title}</option>)}
              </select>
            </div>
          )}"""

new_card_footer = """          <div className="flex items-center gap-2 mt-2 pt-2 border-t">
            {!isCerrada && (
              <button
                onClick={() => handleWhatsAppAndAdvance(s)}
                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                WhatsApp &rarr; Seguimiento
              </button>
            )}
            <select
              className="flex-1 text-xs border rounded-md px-1 py-1.5 bg-gray-50 focus:ring-1 focus:ring-teal-500"
              value={s.estado === 'descartada' ? 'descartada' : s.estado === 'confirmada' ? 'confirmada' : s.estado_crm}
              onChange={(e) => changeStage(s.id, e.target.value)}
            >
              <option value="por_contactar">Por Contactar</option>
              <option value="en_seguimiento">En Seguimiento</option>
              <option value="descartada">Descartar</option>
              {s.estado === 'confirmada' && <option value="confirmada" disabled>Confirmada</option>}
            </select>
          </div>"""

# Safely replace if not already done
if old_card_footer in content:
    content = content.replace(old_card_footer, new_card_footer)
else:
    # If partial replace happened, use regex to just force the clean block
    content = re.sub(
        r'\{\!isCerrada && \(\n\s*<div className="flex items-center gap-2 mt-2 pt-2 border-t">.*?</select>\n\s*</div>\n\s*\)\}',
        new_card_footer,
        content,
        flags=re.DOTALL
    )

# Let's ensure the detection logic uses EXACTLY the user's notation
old_colision = """        // Strict string comparison YYYY-MM-DD prevents timezone parsing offsets
        const rS = r.fecha_entrada.split('T')[0];
        const rE = r.fecha_salida.split('T')[0];
        const sS = sol.fecha_entrada.split('T')[0];
        const sE = sol.fecha_salida.split('T')[0];
        
        return sS < rE && sE > rS;"""

new_colision = """        // Strict string comparison YYYY-MM-DD prevents timezone parsing offsets
        const reservaLlegada = r.fecha_entrada.split('T')[0];
        const reservaSalida = r.fecha_salida.split('T')[0];
        const solicitudLlegada = sol.fecha_entrada.split('T')[0];
        const solicitudSalida = sol.fecha_salida.split('T')[0];
        
        const hayCruce = (solicitudLlegada < reservaSalida) && (solicitudSalida > reservaLlegada);
        return hayCruce;"""

content = content.replace(old_colision, new_colision)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
