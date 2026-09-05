import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

helper = """const tieneConflictoEntreSolicitudes = (solicitudActual: any, todasLasSolicitudes: any[]) => {
  return todasLasSolicitudes.some((otra) => {
    if (otra.id === solicitudActual.id) return false;
    if (otra.propiedad_id !== solicitudActual.propiedad_id) return false;
    if (otra.estado !== 'Pendiente') return false;
    
    const inicioA = new Date(solicitudActual.fecha_entrada);
    const finA = new Date(solicitudActual.fecha_salida);
    const inicioB = new Date(otra.fecha_entrada);
    const finB = new Date(otra.fecha_salida);
    
    return inicioA < finB && finA > inicioB;
  });
};

export function ReservasClient"""

content = content.replace("export function ReservasClient", helper)

old_map = """            pendientes.map(solicitud => (
              <div key={solicitud.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    {solicitud.nombre_cliente}
                    <a 
                      href={buildWaUrl((solicitud as any).codigo_pais, solicitud.telefono, `Hola ${solicitud.nombre_cliente}, te escribo de Casas Gaby sobre tu solicitud de reserva.`)}"""

new_map = """            pendientes.map(solicitud => {
              const tieneConflicto = tieneConflictoEntreSolicitudes(solicitud, pendientes);
              return (
              <div key={solicitud.id} className={`p-5 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${tieneConflicto ? 'border-red-400 bg-red-50/70 hover:bg-red-50' : 'bg-white border-gray-200'}`}>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                    {solicitud.nombre_cliente}
                    {tieneConflicto && (
                      <span className="bg-red-100 text-red-700 text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full border border-red-200 inline-flex items-center gap-1">
                        ⚠️ Conflicto
                      </span>
                    )}
                    <a 
                      href={buildWaUrl((solicitud as any).codigo_pais, solicitud.telefono, `Hola ${solicitud.nombre_cliente}, te escribo de Casas Gaby sobre tu solicitud de reserva.`)}"""

content = content.replace(old_map, new_map)

# Replace the closing paren of the map
old_end_map = """                  <div className="flex gap-2 mt-2 md:mt-0">
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={async () => await rechazarSolicitud(solicitud.id)}>
                    <XCircle className="w-4 h-4 mr-2" /> Rechazar
                  </Button>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => handleAbrirAprobar(solicitud)}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Aprobar
                  </Button>
                </div>
              </div>
            ))"""

new_end_map = """                  <div className="flex gap-2 mt-2 md:mt-0">
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={async () => await rechazarSolicitud(solicitud.id)}>
                    <XCircle className="w-4 h-4 mr-2" /> Rechazar
                  </Button>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => handleAbrirAprobar(solicitud)}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Aprobar
                  </Button>
                </div>
              </div>
            )})"""

content = content.replace(old_end_map, new_end_map)

# Also add the note in the approval modal
old_modal_start = """      {/* Modal Aprobar Solicitud */}
      <Dialog open={aprobarModal.open} onOpenChange={(o) => setAprobarModal({ open: o, solicitud: aprobarModal.solicitud })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar y Registrar Pagos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">"""

new_modal_start = """      {/* Modal Aprobar Solicitud */}
      <Dialog open={aprobarModal.open} onOpenChange={(o) => setAprobarModal({ open: o, solicitud: aprobarModal.solicitud })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar y Registrar Pagos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {aprobarModal.solicitud && tieneConflictoEntreSolicitudes(aprobarModal.solicitud, pendientes) && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-lg flex gap-2 items-start">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p><strong>Atención:</strong> Hay otra solicitud pendiente compitiendo por estas mismas fechas. Al aprobar esta, la otra deberá ser rechazada o reubicada.</p>
              </div>
            )}"""

content = content.replace(old_modal_start, new_modal_start)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
