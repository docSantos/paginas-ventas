import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace handleAdelantarCheckIn and render section
start_marker = "  return (\n    <div className=\"space-y-8\">\n      {/* Header + Bloquear Fechas */}"
end_marker = "      {/* Modal Aprobar Solicitud */}"

parts = content.split(start_marker)

replacement = """  const handleAdelantarCheckIn = async () => {
    if (!earlyCheckinModal.reserva) return
    setEarlyCheckinModal(p => ({ ...p, loading: true }))
    const res = await adelantarCheckIn(earlyCheckinModal.reserva.id, earlyCheckinModal.notas || undefined)
    if (!res.success) {
      alert('Error al registrar check-in: ' + (res as any).error)
      setEarlyCheckinModal(p => ({ ...p, loading: false }))
    } else {
      setEarlyCheckinModal({ open: false, reserva: null, notas: '', loading: false, isEarly: false })
    }
  }

  const renderEarlyCheckinBtn = (r: any) => {
    const isEarly = r.fecha_entrada > todayStr
    return (
      <Button
        size="sm"
        variant="outline"
        className={isEarly ? "text-teal-700 border-teal-300 hover:bg-teal-50 font-semibold" : "bg-teal-600 hover:bg-teal-700 text-white border-transparent font-bold"}
        onClick={(e) => { e.stopPropagation(); setEarlyCheckinModal({ open: true, reserva: r, notas: '', loading: false, isEarly }) }}
      >
        <LogIn className="w-4 h-4 mr-1.5" /> {isEarly ? 'Adelantar Check-in' : 'Realizar Check-in'}
      </Button>
    )
  }

""" + start_marker + """
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservas Confirmadas</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Gestión de estancias activas. Las solicitudes nuevas viven en el{' '}
            <a href="/casasgaby/admin/clientes?tab=crm" className="text-teal-600 font-medium hover:underline">CRM</a>.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-amber-300 text-amber-700 hover:bg-amber-50 shrink-0"
          onClick={() => setBloqueoModal({ open: true, propiedadId: '', fechaEntrada: '', fechaSalida: '', motivo: 'mantenimiento', error: '', saving: false })}
        >
          <CalendarIcon className="w-4 h-4 mr-2" /> Bloquear Fechas
        </Button>
      </div>

      {/* ─── BUCKET 1: Llegadas de hoy (check-in pendiente) ─── */}
      {llegadasHoy.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-amber-800 flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-amber-500" />
            Llegadas de Hoy ({llegadasHoy.length})
            <span className="text-xs font-normal bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-1">Check-in pendiente</span>
          </h2>
          <div className="grid gap-3">
            {llegadasHoy.map(reserva => {
              const r = reserva as any
              const isExpanded = !!expanded[r.id]
              const totalAcordado = r.monto_total_acordado || r.costo_total
              const saldo = totalAcordado - (r.monto_apartado || 0)
              const liquidado = saldo <= 0
              return (
                <div key={r.id} className="bg-white rounded-xl border border-amber-300 shadow-sm overflow-hidden transition-all">
                  <div
                    onClick={() => toggleExpand(r.id)}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-amber-50/40 select-none"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="font-bold text-gray-900 truncate" title={r.nombre_cliente}>{r.nombre_cliente}</div>
                      <div className="text-sm font-medium text-teal-700 truncate">{r.propiedades?.titulo}</div>
                      <div className="text-sm text-gray-600">
                        {formatDateEs(r.fecha_entrada)} <span className="text-gray-400">al</span> {formatDateEs(r.fecha_salida)}
                      </div>
                      <div className="flex items-center gap-2">
                        {liquidado ? (
                          <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-xs uppercase">Liquidado</span>
                        ) : (
                          <span className="text-red-600 text-sm font-semibold">Saldo: {formatPrice(saldo)}</span>
                        )}
                        {renderEarlyCheckinBtn(r)}
                      </div>
                    </div>
                    <div className="text-gray-400 shrink-0">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="p-4 border-t border-amber-100 bg-amber-50/20">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {renderEarlyCheckinBtn(r)}
                        <Button size="sm" variant="outline" onClick={() => setAbonoModal({ open: true, reserva: r })} className="text-teal-700 border-teal-200 hover:bg-teal-50">
                          <DollarSign className="w-4 h-4 mr-1" /> Registrar Abono
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setFEntrada(r.fecha_entrada); setFSalida(r.fecha_salida); setFechasModal({ open: true, reserva: r }) }} className="text-blue-700 border-blue-200 hover:bg-blue-50">
                          <CalendarIcon className="w-4 h-4 mr-1" /> Editar Fechas
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 ml-auto"
                          onClick={() => { const tot = (r.transacciones||[]).filter((t:any)=>t.tipo==='ingreso').reduce((s:number,t:any)=>s+Number(t.monto),0)||Number(r.monto_apartado)||0; setCancelData({willRefund:true,amount:tot.toString(),currency:'MXN',method:'transferencia',note:'Cancelación'}); setCancelModal({open:true,reserva:r}) }}>
                          Cancelar Reserva
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── BUCKET 2: Próximas Llegadas (fechas futuras) ─── */}
      <div>
        <h2 className="text-lg font-bold text-teal-800 flex items-center gap-2 mb-3">
          <HomeIcon className="w-5 h-5 text-teal-500" />
          Próximas Llegadas ({proximasLlegadas.length})
        </h2>
        <div className="grid gap-3">
          {proximasLlegadas.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 text-sm">No hay reservas programadas a futuro.</div>
          ) : (
            proximasLlegadas.map(reserva => {
              const r = reserva as any
              const isExpanded = !!expanded[r.id]
              const totalAcordado = r.monto_total_acordado || r.costo_total
              const saldo = totalAcordado - (r.monto_apartado || 0)
              const liquidado = saldo <= 0
              return (
                <div key={r.id} className="bg-white rounded-xl border border-teal-200 shadow-sm overflow-hidden transition-all">
                  <div
                    onClick={() => toggleExpand(r.id)}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 select-none"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="font-bold text-gray-900 truncate" title={r.nombre_cliente}>{r.nombre_cliente}</div>
                      <div className="text-sm font-medium text-teal-700 truncate">{r.propiedades?.titulo}</div>
                      <div className="text-sm text-gray-600">
                        {formatDateEs(r.fecha_entrada)} <span className="text-gray-400">al</span> {formatDateEs(r.fecha_salida)}
                      </div>
                      <div className="text-sm font-semibold flex items-center gap-2">
                        {liquidado ? (
                          <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-xs uppercase">Liquidado</span>
                        ) : (
                          <span className="text-red-600">Pendiente: {formatPrice(saldo)}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-400 flex items-center justify-center shrink-0">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-teal-100 bg-teal-50/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Columna Izquierda: Detalles del Cliente e Historial */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Detalles del Cliente</h4>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-800">{formatPhoneWithFlagObj((r as any).codigo_pais, r.telefono)}</span>
                            <a 
                              href={buildWaUrl((r as any).codigo_pais, r.telefono, `Hola ${r.nombre_cliente}, te escribo de Casas Gaby sobre tu reserva.`)}
                              target="_blank" rel="noreferrer"
                              className="text-[10px] font-bold bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 px-2 py-0.5 rounded-full uppercase"
                            >
                              WhatsApp
                            </a>
                          </div>
                          {r.email && (
                            <a href={`mailto:${r.email}`} className="text-sm text-gray-800 block mb-1 hover:text-teal-600 transition-colors">
                              ✉️ {r.email}
                            </a>
                          )}
                          
                          {pagosHistory[r.id] && pagosHistory[r.id].length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <History className="w-3 h-3" /> Historial de Pagos
                              </h4>
                              <div className="space-y-2">
                                {pagosHistory[r.id].map(pago => (
                                  <div key={pago.id} className="bg-white p-2 rounded border border-gray-200 text-xs flex justify-between items-center">
                                    <div>
                                      <span className="font-semibold block">{formatPrice(pago.monto)} {pago.moneda}</span>
                                      <span className="text-gray-500 capitalize">{pago.metodo_pago.replace('_', ' ')}</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-gray-900 block font-medium">Equiv: {formatPrice(pago.monto_equivalente_mxn)}</span>
                                      <span className="text-gray-400">{new Date(pago.created_at).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Columna Derecha: Finanzas y Botones */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Finanzas</h4>
                            <Button onClick={() => setAjusteModal({ open: true, reservaId: r.id })} variant="outline" size="sm" className="h-7 text-xs text-teal-700 bg-white border-teal-300 hover:bg-teal-50 hover:text-teal-800 transition-colors shadow-sm font-medium">
                              + Agregar Ajuste
                            </Button>
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

                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Comisión</h4>
                          <div className="bg-white p-3 rounded-lg border border-purple-200 mb-3 text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Total Comisión:</span>
                              <span className="font-semibold text-purple-700">{formatPrice(r.monto_comision || 0)}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Comisión Pagada:</span>
                              <span className="font-semibold text-teal-600">{formatPrice(r.comision_pagada || 0)}</span>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-gray-100 mt-1">
                              <span className="text-gray-900 font-bold">Saldo Comisión:</span>
                              <span className={`font-bold ${(r.monto_comision || 0) - (r.comision_pagada || 0) <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                                {formatPrice((r.monto_comision || 0) - (r.comision_pagada || 0))}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {renderEarlyCheckinBtn(r)}
                            <Button size="sm" variant="outline" onClick={() => setAbonoModal({ open: true, reserva: r })} className="text-teal-700 border-teal-200 hover:bg-teal-50">
                              <DollarSign className="w-4 h-4 mr-1" /> Registrar Abono
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => { setComisionMonto(((r.monto_comision || 0) - (r.comision_pagada || 0)).toString()); setComisionModal({ open: true, reserva: r }) }} className="text-purple-700 border-purple-200 hover:bg-purple-50">
                              Saldar Comisión
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => { setFEntrada(r.fecha_entrada); setFSalida(r.fecha_salida); setFechasModal({ open: true, reserva: r }) }} className="text-blue-700 border-blue-200 hover:bg-blue-50">
                              <CalendarIcon className="w-4 h-4 mr-1" /> Editar Fechas
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 ml-auto"
                              onClick={() => { const tot = (r.transacciones||[]).filter((t:any)=>t.tipo==='ingreso').reduce((s:number,t:any)=>s+Number(t.monto),0)||Number(r.monto_apartado)||0; setCancelData({willRefund:true,amount:tot.toString(),currency:'MXN',method:'transferencia',note:'Cancelación'}); setCancelModal({open:true,reserva:r}) }}>
                              Cancelar Reserva
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ─── BUCKET 3: En Curso / In-House (check-in activo) ─── */}
      {enCurso.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-green-800 flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            En Curso / In-House ({enCurso.length})
          </h2>
          <div className="grid gap-3">
            {enCurso.map(reserva => {
              const r = reserva as any
              const totalAcordado = r.monto_total_acordado || r.costo_total
              const saldo = totalAcordado - (r.monto_apartado || 0)
              const liquidado = saldo <= 0
              return (
                <div key={r.id} className="bg-green-50/30 rounded-xl border border-green-300 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="font-bold text-gray-900 truncate">{r.nombre_cliente}</div>
                    <div className="text-sm font-medium text-teal-700 truncate">{r.propiedades?.titulo}</div>
                    <div className="text-sm text-gray-600">
                      {formatDateEs(r.fecha_entrada)} → {formatDateEs(r.fecha_salida)}
                    </div>
                    <div className="text-sm flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">In-House</span>
                      {liquidado ? <span className="text-green-600 text-xs">Liquidado</span> : <span className="text-red-600 text-xs">Saldo: {formatPrice(saldo)}</span>}
                    </div>
                  </div>
                  <a href="/casasgaby/admin/operacion" className="text-xs text-teal-600 underline font-medium shrink-0">Ver en Recepción →</a>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── BUCKET 4: Historial / Concluidas ─── */}
      {concluidas.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-500 flex items-center gap-2 mb-3">
            <ArchiveIcon className="w-5 h-5 text-gray-400" />
            Historial / Concluidas ({concluidas.length})
          </h2>
          <div className="grid gap-2">
            {concluidas.map(reserva => {
              const r = reserva as any
              const totalAcordado = r.monto_total_acordado || r.costo_total
              const saldo = totalAcordado - (r.monto_apartado || 0)
              const liquidado = saldo <= 0
              return (
                <div key={r.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-col md:flex-row md:items-center gap-4 opacity-75">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2 items-center text-sm">
                    <div className="font-semibold text-gray-700 truncate">{r.nombre_cliente}</div>
                    <div className="text-gray-500 truncate">{r.propiedades?.titulo}</div>
                    <div className="text-gray-400">{formatDateEs(r.fecha_entrada)} → {formatDateEs(r.fecha_salida)}</div>
                    <div className="flex gap-2">
                      <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">Concluida</span>
                      {liquidado ? <span className="text-green-600 text-xs">Liquidado</span> : <span className="text-red-500 text-xs">Saldo: {formatPrice(saldo)}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
"""

end_split = parts[1].split(end_marker)

final_content = parts[0] + replacement + end_marker + end_split[1]

# Now let's inject the modal at the end, replacing the last </div>
modal = """
      {/* Modal: Check-in */}
      <Dialog open={earlyCheckinModal.open} onOpenChange={(o) => setEarlyCheckinModal(p => ({ ...p, open: o }))}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-teal-600" /> {earlyCheckinModal.isEarly ? 'Adelantar Check-in' : 'Realizar Check-in'}
            </DialogTitle>
          </DialogHeader>
          {earlyCheckinModal.reserva && (
            <div className="space-y-4 py-2">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-sm space-y-1">
                <p className="font-semibold text-teal-900">{earlyCheckinModal.reserva.nombre_cliente}</p>
                <p className="text-teal-700">{earlyCheckinModal.reserva.propiedades?.titulo}</p>
                <p className="text-teal-600 text-xs">
                  {formatDateEs(earlyCheckinModal.reserva.fecha_entrada)} → {formatDateEs(earlyCheckinModal.reserva.fecha_salida)}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Se marcará la <strong>entrada física</strong> con la hora actual. El huésped aparecerá de inmediato en el panel <strong>In-House</strong> de Recepción.
              </p>
              <div>
                <label className="text-sm font-medium block mb-1 text-gray-700">Notas operativas (opcional)</label>
                <Input
                  placeholder={earlyCheckinModal.isEarly ? "Ej: Llegó 2 hrs antes. Cuota de early check-in cobrada." : "Ej: Llegó sin contratiempos."}
                  value={earlyCheckinModal.notas}
                  onChange={e => setEarlyCheckinModal(p => ({ ...p, notas: e.target.value }))}
                />
              </div>
              <div className="flex gap-3 pt-1">
                <Button variant="outline" className="flex-1" onClick={() => setEarlyCheckinModal({ open: false, reserva: null, notas: '', loading: false, isEarly: false })}>
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={earlyCheckinModal.loading}
                  onClick={handleAdelantarCheckIn}
                >
                  <LogIn className="w-4 h-4 mr-1.5" />
                  {earlyCheckinModal.loading ? 'Registrando...' : 'Confirmar Entrada'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
"""

final_content = final_content.rsplit("    </div>\n  )\n}", 1)[0] + modal

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(final_content)
