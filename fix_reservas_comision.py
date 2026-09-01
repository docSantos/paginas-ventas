import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_logic = """    let conceptoFinal = ajusteData.concepto;
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

    try {
      let montoFinal = ajusteData.monto.toString().replace(/[^0-9.]/g, '')
      await agregarAjusteReserva(
        ajusteModal.reservaId, 
        tipoReal, 
        conceptoFinal, 
        Number(montoFinal), 
        esServicio
      );"""

new_logic = """    let conceptoFinal = ajusteData.concepto;
    let tipoReal: 'cargo' | 'descuento' = 'cargo';
    let esServicio = false;
    let overrideComision: number | undefined = undefined;

    if (ajusteData.tipo === 'catalogo') {
      const s = servicios.find(x => x.id === ajusteData.catalogoId);
      if (!s) return alert('Selecciona un servicio');
      conceptoFinal = s.nombre + (ajusteData.concepto ? ` - ${ajusteData.concepto}` : '');
      esServicio = true;
      overrideComision = s.porcentaje_comision;
    } else if (ajusteData.tipo === 'nuevo') {
      esServicio = true;
    } else if (ajusteData.tipo === 'descuento') {
      tipoReal = 'descuento';
    }

    try {
      let montoFinal = ajusteData.monto.toString().replace(/[^0-9.]/g, '')
      await agregarAjusteReserva(
        ajusteModal.reservaId, 
        tipoReal, 
        conceptoFinal, 
        Number(montoFinal), 
        esServicio,
        overrideComision
      );"""

content = content.replace(old_logic, new_logic)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
