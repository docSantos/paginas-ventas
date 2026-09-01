import re

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the junk
old_junk = r"\{\)\}\)>[\s\S]*?<DialogContent>"
new_junk = r"""
        </div>
      </div>

      {/* SECCIÓN SERVICIOS ESPECIALES */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">Catálogo de Servicios</h2>
            <p className="text-sm text-gray-600 mt-1">Gestiona servicios adicionales para agregar como cargos a las reservas.</p>
          </div>
          <Button onClick={() => openServicioModal()}>+ Agregar Servicio</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">Servicio</th>
                <th className="px-4 py-3">Tarifa</th>
                <th className="px-4 py-3">Precio Base</th>
                <th className="px-4 py-3 text-center">% Comisión</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {servicios.length === 0 && (
                <tr><td colSpan={5} className="text-center py-4 text-gray-500">No hay servicios</td></tr>
              )}
              {servicios.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{s.nombre}</div>
                    <div className="text-xs text-gray-500">{s.descripcion}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">{s.tipo_tarifa.replace('_', ' ')}</td>
                  <td className="px-4 py-3">{formatPrice(s.precio_base)}</td>
                  <td className="px-4 py-3 text-center font-medium text-purple-600">{s.porcentaje_comision ?? 5}%</td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => toggleServicio(s.id, !s.activo)}
                      className={`px-2 py-0.5 rounded text-xs font-bold uppercase transition-colors ${s.activo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {s.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button onClick={() => openServicioModal(s)} className="text-gray-400 hover:text-blue-600 p-1"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteServicio(s.id)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SERVICIO */}
      <Dialog open={modalServicio.open} onOpenChange={o => setModalServicio(p => ({...p, open: o}))}>
        <DialogContent>"""

content = re.sub(r"\}\)\}\)>[\s\S]*?<DialogContent>", new_junk, content)

with open('src/app/casasgaby/admin/ajustes/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
