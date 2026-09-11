const fs = require('fs');

let content = fs.readFileSync('implementation_plan F7.md', 'utf8');

// Change 7.6 to COMPLETADO
content = content.replace(
  /### Sprint 7\.6: Reorganización del Tablero Operativo y Check-in Anticipado \[EN PROGRESO\]\s*\n\*\*Estatus:\*\* En ejecución activa\./g,
  '### Sprint 7.6: Reorganización del Tablero Operativo y Check-in Anticipado [COMPLETADO]\n\n**Estatus:** Completado y Validado.'
);

const newSprint = `

---

### Sprint 7.7: Reprogramación Trazable, Control In-House y Corrección de Comisiones [EN PROGRESO]

**Estatus:** En ejecución activa.

**Objetivos y Alcance:**
- **Auditoría de Modificaciones:** Modificación controlada de estancias con validación antibloqueo en calendario y registro histórico inmutable (timestamp y motivo) de cada cambio en \`historial_modificaciones\`.
- **Control Operativo In-House:** Desglose detallado de la reserva desde la recepción (\`OperacionClient.tsx\`), permitiendo la extensión estricta de estancias (solo \`fecha_salida\`) y la liquidación de comisiones directamente en sitio.
- **Sincronización del Ledger de Comisiones:** Diagnóstico y reparación de discrepancias en Finanzas para reflejar con total precisión las comisiones devengadas contra las pagadas (fusionando \`hospedaje.comisiones\`, \`central.transacciones_comisiones\` y \`hospedaje.transacciones\`).
- **Prevención Absoluta de Sobreventa:** Garantizar la liberación temporal de inventario al reprogramar, previniendo choques, y recálculo en cascada del costo total y penalizaciones/saldo pendiente o a favor.
`;

// Append to the file (before the end marker if it exists, or just append)
if (content.includes('---' + '\n' + '*Fin del reporte del Libro Mayor y Avances F7*')) {
    content = content.replace('---' + '\n' + '*Fin del reporte del Libro Mayor y Avances F7*', newSprint + '\n\n---\n*Fin del reporte del Libro Mayor y Avances F7*');
} else {
    content += newSprint;
}

fs.writeFileSync('implementation_plan F7.md', content, 'utf8');
console.log('F7 updated');
