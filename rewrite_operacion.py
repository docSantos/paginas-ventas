import os
import re

filepath = 'src/components/casasgaby/admin/OperacionClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Props and State
content = content.replace(
    "export function OperacionClient({ reservas }: { reservas: any[] }) {",
    "export function OperacionClient({ reservas, servicios = [] }: { reservas: any[], servicios?: any[] }) {"
)

state_additions = """
  const [editTarifaModal, setEditTarifaModal] = useState<{ open: boolean, reservaId: string, currentBase: number }>({ open: false, reservaId: '', currentBase: 0 })
  const [ajusteModal, setAjusteModal] = useState<{ open: boolean, reservaId: string }>({ open: false, reservaId: '' })
  const [ajusteData, setAjusteData] = useState({ tipo: 'catalogo', catalogoId: '', concepto: '', monto: '' })
"""
content = content.replace("const [tc, setTc] = useState('16.00')", "const [tc, setTc] = useState('16.00')" + state_additions)

# 2. Add imports
content = content.replace(
    "import { marcarCheckIn, marcarCheckOut, liquidarSaldoRecepcion, checkOutAnticipado, revertirCheckOut } from '@/app/casasgaby/admin/actions'",
    "import { marcarCheckIn, marcarCheckOut, liquidarSaldoRecepcion, checkOutAnticipado, revertirCheckOut, actualizarTarifaBase, agregarAjusteReserva, eliminarAjusteReserva } from '@/app/casasgaby/admin/actions'\nimport { useRouter } from 'next/navigation'"
)

# 3. Add router to component
content = content.replace("const todayStr =", "const router = useRouter()\n  const todayStr =")

# 4. Add handlers
handlers = """
  const handleActualizarTarifa = async () => {
    try {
      await actualizarTarifaBase(editTarifaModal.reservaId, Number(editTarifaModal.currentBase));
      setEditTarifaModal({ open: false, reservaId: '', currentBase: 0 });
      router.refresh();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  const handleAgregarAjuste = async () => {
    let conceptoFinal = ajusteData.concepto;
    let montoFinal = ajusteData.monto;
    let tipoReal: 'cargo' | 'descuento' = 'cargo';
    let esServicio = false;

    if (ajusteData.tipo === 'catalogo') {
      const s = servicios.find(x => x.id === ajusteData.catalogoId);
      if (!s) return alert('Selecciona un servicio');
      conceptoFinal = s.nombre + (ajusteData.concepto ? ` - ${ajusteData.concepto}` : '');
      esServicio = true;
    } else if (ajusteData.tipo === 'nuevo') {
      esServicio = true;
    } else if (ajusteData.tipo === 'descuento') {
      tipoReal = 'descuento';
    }

    if (!conceptoFinal || !montoFinal) return alert('Completa los campos obligatorios');

    try {
      await agregarAjusteReserva(
        ajusteModal.reservaId,
        tipoReal,
        conceptoFinal,
        Number(montoFinal),
        esServicio
      );
      setAjusteModal({ open: false, reservaId: '' });
      setAjusteData({ tipo: 'catalogo', catalogoId: '', concepto: '', monto: '' });
      router.refresh();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }

  const handleEliminarAjuste = async (ajusteId: string, reservaId: string) => {
    if (!confirm('¿Eliminar este ajuste?')) return;
    try {
      await eliminarAjusteReserva(ajusteId, reservaId);
      router.refresh();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  }
"""
content = content.replace("const getSaldo = (r: any) => {", handlers + "\n  const getSaldo = (r: any) => {")

# 5. Fix In-House card rendering
# We need to find the inHouse.map block and inject the Finanzas UI.
inhouse_pattern = r"(\{\s*inHouse\.map\(r => \{.*?return \(\s*<div key=\{r\.id\}.*?>)(.*?)(</div\>\s*\)\s*\}\)\s*\})"

def replacer_inhouse(m):
    return """{inHouse.map(r => {
                  const saldo = getSaldo(r)
                  const checkInDate = r.check_in_real_at ? parseISO(r.check_in_real_at) : parseISO(r.fecha_entrada)
                  const nochesTotales = differenceInDays(parseISO(r.fecha_salida), parseISO(r.fecha_entrada))
                  let nochesTranscurridas = differenceInDays(new Date(), checkInDate)
                  if (nochesTranscurridas < 0) nochesTranscurridas = 0
                  const transacciones = r.transacciones?.filter((t: any) => t.tipo === 'ingreso') || []
                  
                  return (
                    <div key={r.id} className="p-4 sm:p-6 flex flex-col md:flex-row gap-6 justify-between hover:bg-gray-50 transition-colors">
                      {/* Izquierda: Info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{r.nombre_cliente}</h3>
                          {r.fecha_salida > todayStr && (
                            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                              Día {nochesTranscurridas} de {nochesTotales}
                            </span>
                          )}
                          {r.fecha_salida === todayStr && (
                            <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Sale Hoy
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {r.propiedades?.titulo}</span>
                          <span className="flex items-center gap-1 text-gray-600 font-medium">
                            <Clock className="w-4 h-4" /> 
                            In: {format(checkInDate, 'dd MMM yy HH:mm', { locale: es })} 
                            {' -> '} 
                            Out: {format(parseISO(r.fecha_salida), 'dd MMM yy', { locale: es })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <a 
                            href={`https://wa.me/${(r.telefono || '').replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(r.nombre_cliente)},%20esperamos%20que%20tu%20estancia%20sea%20excelente.`}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md hover:bg-emerald-100"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Contactar WhatsApp
                          </a>
                        </div>
                      </div>
                      
                      {/* Derecha: Finanzas y Botones */}
                      <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Finanzas</h4>
                          <Button onClick={() => setAjusteModal({ open: true, reservaId: r.id })} variant="outline" size="sm" className="h-7 text-xs text-teal-700 bg-white border-teal-300 hover:bg-teal-50 hover:text-teal-800">
                            + Agregar Ajuste
                          </Button>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm space-y-1.5 shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 flex items-center gap-1.5">
                              Hospedaje base: 
                              <button onClick={() => setEditTarifaModal({ open: true, reservaId: r.id, currentBase: r.tarifa_base || 0 })} className="text-gray-400 hover:text-teal-600">✏️</button>
                            </span>
                            <span className="font-medium text-gray-800">{formatPrice(r.tarifa_base || 0)}</span>
                          </div>
                          {(r.ajustes_reserva || []).filter((a: any) => a.tipo === 'cargo').map((c: any) => (
                            <div key={c.id} className="flex justify-between items-center text-xs">
                              <span className="text-gray-500 pl-1">+ {c.concepto}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700">{formatPrice(c.monto)}</span>
                                <button onClick={() => handleEliminarAjuste(c.id, r.id)} className="text-red-400 hover:text-red-600">×</button>
                              </div>
                            </div>
                          ))}
                          {(r.ajustes_reserva || []).filter((a: any) => a.tipo === 'descuento').map((d: any) => (
                            <div key={d.id} className="flex justify-between items-center text-xs">
                              <span className="text-gray-500 pl-1">- {d.concepto}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-red-500">-{formatPrice(d.monto)}</span>
                                <button onClick={() => handleEliminarAjuste(d.id, r.id)} className="text-red-400 hover:text-red-600">×</button>
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-between border-t border-gray-100 pt-1.5 mt-1.5">
                            <span className="text-gray-900 font-medium">Total Acordado:</span>
                            <span className="font-bold">{formatPrice(Number(r.monto_total_acordado) || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pagado Acumulado:</span>
                            <span className="font-semibold text-teal-600">{formatPrice((Number(r.monto_total_acordado) || 0) - saldo)}</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-gray-100 mt-1">
                            <span className="text-gray-900 font-bold">Saldo Pendiente:</span>
                            <span className={`font-bold ${saldo <= 0.5 ? 'text-green-600' : 'text-red-600'}`}>
                              {saldo <= 0.5 ? 'Liquidado' : formatPrice(saldo)}
                            </span>
                          </div>
                          
                          {transacciones.length > 0 && (
                            <details className="mt-2 text-xs">
                              <summary className="font-semibold text-indigo-600 cursor-pointer pt-2 border-t border-indigo-50">Ver historial de pagos ({transacciones.length})</summary>
                              <div className="pt-2 space-y-1.5">
                                {transacciones.map((t: any, idx: number) => (
                                  <div key={idx} className="flex justify-between border-b border-gray-50 pb-1">
                                    <div>
                                      <div className="font-medium text-gray-700">{formatPrice(t.monto_mxn || t.monto)}</div>
                                      <div className="text-[10px] text-gray-400">{t.metodo_pago}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-gray-500">{t.concepto}</div>
                                      <div className="text-[10px] text-gray-400">{format(parseISO(t.created_at), 'dd/MM/yy', { locale: es })}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>

                        {/* Botones Operativos */}
                        <div className="flex flex-col gap-2 mt-1">
                          {saldo > 0.5 && (
                            <Button onClick={() => handleLiquidar(r)} disabled={loadingId === r.id + '-liquidar'} variant="outline" className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 h-8 text-xs">
                              Liquidar o abonar
                            </Button>
                          )}
                          <Button onClick={() => handleCheckOut(r)} disabled={loadingId === r.id} className={`w-full h-8 text-xs text-white shadow-sm ${r.fecha_salida > todayStr ? 'bg-slate-700 hover:bg-slate-800' : 'bg-gray-900 hover:bg-gray-800'}`}>
                            {loadingId === r.id ? 'Procesando...' : (r.fecha_salida > todayStr ? 'Check-out Anticipado' : 'Marcar Check-out')}
                          </Button>
                          {r.fecha_salida < todayStr && (
                            <button onClick={() => handleRevertirCheckOut(r)} disabled={loadingId === r.id + '-revertir'} className="w-full text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 py-1">
                              <Undo2 className="w-3 h-3" /> Revertir Check-out
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}"""

content = re.sub(inhouse_pattern, replacer_inhouse, content, flags=re.DOTALL)

# 6. Add modals at the bottom
modals = """
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
            <div>
              <label className="text-sm font-medium block mb-1">Tipo de Concepto</label>
              <select 
                className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={ajusteData.tipo} 
                onChange={e => setAjusteData({ ...ajusteData, tipo: e.target.value })}
              >
                <option value="catalogo">Servicio del Catálogo</option>
                <option value="nuevo">Cargo Manual</option>
                <option value="descuento">Descuento Especial</option>
              </select>
            </div>

            {ajusteData.tipo === 'catalogo' && (
              <div>
                <label className="text-sm font-medium block mb-1">Selecciona el Servicio</label>
                <select 
                  className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  value={ajusteData.catalogoId} 
                  onChange={e => {
                    const s = servicios.find(x => x.id === e.target.value)
                    if (s) {
                      setAjusteData({ ...ajusteData, catalogoId: s.id, monto: s.precio_base.toString() })
                    }
                  }}
                >
                  <option value="">-- Seleccionar --</option>
                  {servicios.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre} ({formatPrice(s.precio_base)})</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium block mb-1">
                {ajusteData.tipo === 'catalogo' ? 'Nota adicional (opcional)' : 'Concepto (Ej. Limpieza extra)'}
              </label>
              <Input value={ajusteData.concepto} onChange={e => setAjusteData({ ...ajusteData, concepto: e.target.value })} placeholder="Describe el concepto..." />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Monto (MXN)</label>
              <Input type="number" value={ajusteData.monto} onChange={e => setAjusteData({ ...ajusteData, monto: e.target.value })} placeholder="0.00" />
            </div>

            {ajusteData.tipo === 'descuento' && (
              <p className="text-xs text-gray-500 italic mt-2">
                * Los descuentos solo ajustan el saldo a pagar del cliente y no alteran la comisión.
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setAjusteModal({ ...ajusteModal, open: false })}>Cancelar</Button>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleAgregarAjuste}>Agregar Ajuste</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
"""

# Insert modals before the last </div>
content = content.replace("    </div>\n  )\n}", modals + "\n    </div>\n  )\n}")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated OperacionClient.tsx")
