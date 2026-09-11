const fs = require('fs');

let content = fs.readFileSync('Mapa3.md', 'utf8');

const newSprint77 = `### Sprint 7.7: Reprogramación Trazable, Control In-House y Corrección de Comisiones
- **Auditoría de Modificaciones:** Modificación controlada de estancias con validación antibloqueo en calendario y registro histórico inmutable (timestamp y motivo) de cada cambio en \`historial_modificaciones\`.
- **Control Operativo In-House:** Desglose detallado de la reserva desde la recepción (\`OperacionClient.tsx\`), permitiendo la extensión estricta de estancias (solo \`fecha_salida\`) y la liquidación de comisiones directamente en sitio.
- **Sincronización del Ledger de Comisiones:** Diagnóstico y reparación de discrepancias en Finanzas para reflejar con total precisión las comisiones devengadas contra las pagadas (fusionando \`hospedaje.comisiones\`, \`central.transacciones_comisiones\` y \`hospedaje.transacciones\`).
- **Prevención Absoluta de Sobreventa:** Garantizar la liberación temporal de inventario al reprogramar, previniendo choques, y recálculo en cascada del costo total y penalizaciones/saldo pendiente o a favor.

`;

content = content.replace(
  '### Sprint 7.7: Cimientos de la Consola Central y Preparación para Despliegue',
  newSprint77 + '### Sprint 7.8: Cimientos de la Consola Central y Preparación para Despliegue'
);

fs.writeFileSync('Mapa3.md', content, 'utf8');
console.log('Mapa3 updated');
