import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Title
old_title = r"<h4 className=\"text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2\">Comisión \(\{\(r\.porcentaje_comision \|\| 2\.5\)\}% Base\)</h4>"
new_title = r'<h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Comisión</h4>'
content = re.sub(old_title, new_title, content)

# 2. Update Button
old_btn = r"<button onClick=\{.*?setAjusteModal.*?\} className=\"text-\[10px\].*?\">\s*\+\s*Agregar Ajuste\s*</button>"
new_btn = """<Button onClick={() => setAjusteModal({ open: true, reservaId: r.id })} variant="outline" size="sm" className="h-7 text-xs text-teal-700 bg-white border-teal-300 hover:bg-teal-50 hover:text-teal-800 transition-colors shadow-sm font-medium">
                                + Agregar Ajuste
                              </Button>"""
content = re.sub(old_btn, new_btn, content)

# 3. Add Modals at the end (safely replacing the last `</Dialog>\n    </div>\n  )\n}`)
end_pattern = r"\s*</DialogContent>\n\s*</Dialog>\n\s*</div>\n\s*\)\n\}\s*$"

modals_to_inject = """
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL EDITAR TARIFA BASE */}
      <Dialog open={editTarifaModal.open} onOpenChange={(o) => setEditTarifaModal({ ...editTarifaModal, open: o })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Hospedaje Base</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium block mb-1">Monto de Hospedaje (MXN)</label>
              <Input type="number" value={editTarifaModal.currentBase} onChange={e => setEditTarifaModal({ ...editTarifaModal, currentBase: Number(e.target.value) })} />
              <p className="text-xs text-gray-500 mt-1">Modificar esta base recalculará automáticamente el total y la comisión base.</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditTarifaModal({ ...editTarifaModal, open: false })}>Cancelar</Button>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleActualizarTarifa}>Guardar Cambios</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL AGREGAR AJUSTE */}
      <Dialog open={ajusteModal.open} onOpenChange={(o) => setAjusteModal({ ...ajusteModal, open: o })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Ajuste / Cargo Extra / Descuento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Tipo de Ajuste</label>
                <select 
                  className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  value={ajusteData.tipo}
                  onChange={e => setAjusteData({ ...ajusteData, tipo: e.target.value, porcentaje_comision: e.target.value === 'cargo' ? tenantExtras.toString() : '0' })}
                >
                  <option value="cargo">Cargo Adicional (+)</option>
                  <option value="descuento">Descuento (-)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Monto (MXN)</label>
                <Input type="number" placeholder="0.00" value={ajusteData.monto} onChange={e => setAjusteData({ ...ajusteData, monto: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Concepto / Descripción</label>
              <Input placeholder="Ej. Mascota extra, Early Check-in, Descuento familiar..." value={ajusteData.concepto} onChange={e => setAjusteData({ ...ajusteData, concepto: e.target.value })} />
            </div>
            {ajusteData.tipo === 'cargo' && (
              <div>
                <label className="text-sm font-medium block mb-1">% de Comisión aplicable (5% por defecto)</label>
                <Input type="number" step="0.01" value={ajusteData.porcentaje_comision} onChange={e => setAjusteData({ ...ajusteData, porcentaje_comision: e.target.value })} />
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setAjusteModal({ ...ajusteModal, open: false })}>Cancelar</Button>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleAgregarAjuste}>Agregar Ajuste</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
"""

content = re.sub(end_pattern, modals_to_inject, content)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
