import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Solicitudes in aprobarSolicitud
content = re.sub(
    r"\.eq\('id', solicitudId\)\s*\.single\(\)\s*if \(errorSol \|\| !solicitud\) throw new Error\('Solicitud no encontrada'\)",
    ".eq('id', solicitudId)\n      .maybeSingle()\n\n    if (errorSol) throw new Error('Error al buscar solicitud: ' + errorSol.message)\n    if (!solicitud) return { success: false, message: 'La solicitud no existe o ya fue eliminada.' }",
    content
)

# 2. Clientes in aprobarSolicitud
content = re.sub(
    r"\.eq\('telefono', telefonoLimpio\)\s*\.single\(\)",
    ".eq('telefono', telefonoLimpio)\n    .maybeSingle()",
    content
)

# 3. reservas in registrarComisionPagada
content = re.sub(
    r"\.eq\('id', reservaId\)\.single\(\)\s*if \(errFetch \|\| !reserva\) throw new Error\('Reserva no encontrada'\)",
    ".eq('id', reservaId).maybeSingle()\n  if (errFetch) throw new Error('Error al buscar reserva: ' + errFetch.message)\n  if (!reserva) return { success: false, message: 'La reserva no existe o ya fue eliminada.' }",
    content
)

# 4. comisiones in registrarPagoComisionTabla
content = re.sub(
    r"\.eq\('id', comisionId\)\.single\(\)\s*if \(errFetch \|\| !comision\) throw new Error\('Comisión no encontrada'\)",
    ".eq('id', comisionId).maybeSingle()\n  if (errFetch) throw new Error('Error al buscar comisión: ' + errFetch.message)\n  if (!comision) return { success: false, message: 'La comisión no existe o ya fue eliminada.' }",
    content
)

# 5. reservas in cancelarReserva
content = re.sub(
    r"\.eq\('id', reservaId\)\s*\.single\(\)\s*if \(fetchErr\) throw new Error\('Error al buscar la reserva: ' \+ fetchErr\.message\)",
    ".eq('id', reservaId)\n      .maybeSingle()\n\n    if (fetchErr) {\n      throw new Error('Error al buscar la reserva: ' + fetchErr.message);\n    }\n    \n    if (!reserva) {\n      return { success: false, message: 'La reserva no existe o ya fue eliminada.' };\n    }",
    content
)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
