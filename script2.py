import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
old_import = r"import \{ aprobarSolicitud, rechazarSolicitud, registrarAbono, registrarComisionPagada, actualizarFechasReserva, cancelarReserva, cancelarReservaConReembolso \} from '@/app/casasgaby/admin/actions'"
new_import = "import { aprobarSolicitud, rechazarSolicitud, registrarAbono, registrarComisionPagada, actualizarFechasReserva, cancelarReserva, cancelarReservaConReembolso, actualizarTarifaBase, agregarAjusteReserva, eliminarAjusteReserva } from '@/app/casasgaby/admin/actions'"
content = re.sub(old_import, new_import, content)

# 2. Add Modal States
state_injection = r"const \[aprobarModal, setAprobarModal\] = useState"
new_state = """const [editTarifaModal, setEditTarifaModal] = useState<{ open: boolean, reservaId: string, currentBase: number }>({ open: false, reservaId: '', currentBase: 0 })
  const [ajusteModal, setAjusteModal] = useState<{ open: boolean, reservaId: string }>({ open: false, reservaId: '' })
  const [ajusteData, setAjusteData] = useState({ tipo: 'cargo', concepto: '', monto: '', porcentaje_comision: '0' })
  
  const [aprobarModal, setAprobarModal] = useState"""
content = re.sub(state_injection, new_state, content)


# 3. Add handlers
handler_injection = r"const handleConfirmarAprobar = async \(\) => \{"
new_handlers = """const handleActualizarTarifa = async () => {
    try {
      await actualizarTarifaBase(editTarifaModal.reservaId, Number(editTarifaModal.currentBase));
      setEditTarifaModal({ open: false, reservaId: '', currentBase: 0 });
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  const handleAgregarAjuste = async () => {
    if (!ajusteData.concepto || !ajusteData.monto) return alert('Completa los campos obligatorios');
    try {
      await agregarAjusteReserva(ajusteModal.reservaId, ajusteData.tipo as 'cargo'|'descuento', ajusteData.concepto, Number(ajusteData.monto), Number(ajusteData.porcentaje_comision));
      setAjusteModal({ open: false, reservaId: '' });
      setAjusteData({ tipo: 'cargo', concepto: '', monto: '', porcentaje_comision: '0' });
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  const handleEliminarAjuste = async (ajusteId: string, reservaId: string) => {
    if (!confirm('¿Eliminar este ajuste?')) return;
    try {
      await eliminarAjusteReserva(ajusteId, reservaId);
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  const handleConfirmarAprobar = async () => {"""
content = re.sub(handler_injection, new_handlers, content)

# 4. Update the Finanzas block (and Comision block title to reflect base %)
old_finanzas_block = r"<h4 className=\"text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2\">Finanzas</h4>\s*<div className=\"bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm\">\s*<div className=\"flex justify-between mb-1\">\s*<span className=\"text-gray-600\">Total Acordado:</span>\s*<span className=\"font-semibold\">\{formatPrice\(totalAcordado\)\}</span>\s*</div>\s*<div className=\"flex justify-between mb-1\">\s*<span className=\"text-gray-600\">Pagado \(MXN\):</span>\s*<span className=\"font-semibold text-teal-600\">\{formatPrice\(r\.monto_apartado \|\| 0\)\}</span>\s*</div>\s*<div className=\"flex justify-between pt-1 border-t border-gray-100 mt-1\">\s*<span className=\"text-gray-900 font-bold\">Saldo Pendiente:</span>\s*<span className=\{\`font-bold \$\{liquidado \? 'text-green-600' : 'text-red-600'\}\`\}>\s*\{formatPrice\(saldo\)\}\s*</span>\s*</div>\s*</div>\s*<h4 className=\"text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2\">Comisi.n \(\{\(r\.porcentaje_comision \|\| 2\.5\)\}\%\)</h4>"

new_finanzas_block = """<div className="flex justify-between items-center mb-2">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Finanzas</h4>
                              <button onClick={() => setAjusteModal({ open: true, reservaId: r.id })} className="text-[10px] bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full border border-teal-100 hover:bg-teal-100 transition-colors">
                                + Agregar Ajuste
                              </button>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 text-sm space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 flex items-center gap-1.5">
                                  Hospedaje base: 
                                  <button onClick={() => setEditTarifaModal({ open: true, reservaId: r.id, currentBase: r.tarifa_base || 0 })} className="text-gray-400 hover:text-teal-600">✏️</button>
                                </span>
                                <span className="font-medium text-gray-800">{formatPrice(r.tarifa_base || 0)}</span>
                              </div>

                              {(r.ajustes_reserva || []).filter((a: any) => a.tipo === 'cargo').map((c: any) => (
                                <div key={c.id} className="flex justify-between items-center text-xs">
                                  <span className="text-gray-500 pl-1 flex items-center gap-1">+ {c.concepto}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">{formatPrice(c.monto)}</span>
                                    <button onClick={() => handleEliminarAjuste(c.id, r.id)} className="text-red-400 hover:text-red-600">×</button>
                                  </div>
                                </div>
                              ))}

                              {(r.ajustes_reserva || []).filter((a: any) => a.tipo === 'descuento').map((d: any) => (
                                <div key={d.id} className="flex justify-between items-center text-xs">
                                  <span className="text-gray-500 pl-1 flex items-center gap-1">- {d.concepto}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-red-500">-{formatPrice(d.monto)}</span>
                                    <button onClick={() => handleEliminarAjuste(d.id, r.id)} className="text-red-400 hover:text-red-600">×</button>
                                  </div>
                                </div>
                              ))}

                              <div className="flex justify-between border-t border-gray-100 pt-1.5 mt-1.5">
                                <span className="text-gray-900 font-medium">Total Acordado:</span>
                                <span className="font-bold">{formatPrice(totalAcordado)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Pagado (MXN):</span>
                                <span className="font-semibold text-teal-600">{formatPrice(r.monto_apartado || 0)}</span>
                              </div>
                              <div className="flex justify-between pt-1 border-t border-gray-100 mt-1">
                                <span className="text-gray-900 font-bold">Saldo Pendiente:</span>
                                <span className={`font-bold ${liquidado ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatPrice(saldo)}
                                </span>
                              </div>
                            </div>

                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Comisión ({(r.porcentaje_comision || 2.5)}% Base)</h4>"""
content = re.sub(old_finanzas_block, new_finanzas_block, content)


# 5. Add the Modals at the bottom of the component
# Find `</DialogContent>\n        </Dialog>\n      </div>\n    </div>\n  )\n}`
# But wait, there are multiple Dialogs. Better to add right before `</div>\n    </div>\n  )\n}`
modals_injection = """
        <Dialog open={editTarifaModal.open} onOpenChange={(o) => setEditTarifaModal({ ...editTarifaModal, open: o })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Monto de Hospedaje Base</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium block mb-1">Monto de Hospedaje (MXN)</label>
                <Input type="number" value={editTarifaModal.currentBase} onChange={e => setEditTarifaModal({ ...editTarifaModal, currentBase: Number(e.target.value) })} />
                <p className="text-xs text-gray-500 mt-1">Modificar esta base recalculará automáticamente el total y la comisión.</p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditTarifaModal({ ...editTarifaModal, open: false })}>Cancelar</Button>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleActualizarTarifa}>Guardar Cambios</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={ajusteModal.open} onOpenChange={(o) => setAjusteModal({ ...ajusteModal, open: o })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Cargo / Descuento</DialogTitle>
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
                    <option value="cargo">Cargo (+) </option>
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
                <Input placeholder="Ej. Mascota extra, Descuento cortesía..." value={ajusteData.concepto} onChange={e => setAjusteData({ ...ajusteData, concepto: e.target.value })} />
              </div>
              {ajusteData.tipo === 'cargo' && (
                <div>
                  <label className="text-sm font-medium block mb-1">% de Comisión aplicable a este cargo</label>
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
    </div>
  )
}
"""

content = re.sub(r"      </div>\n    </div>\n  \)\n\}\s*$", modals_injection, content)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
