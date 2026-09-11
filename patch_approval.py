import os
import re

# 1. Patch ReservasClient.tsx
filepath = 'src/components/casasgaby/admin/ReservasClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """        const currentMonto = parseFloat(montoAcordado || '0');
        const sumaExtras = extrasPayload.reduce((sum, e) => sum + (e?.monto || 0), 0);
        const baseCalculada = currentMonto - sumaExtras;

        const res = await aprobarSolicitud(
          aprobarModal.solicitud.id,
          baseCalculada,
          parseFloat(montoAnticipo || '0'),"""

replacement = """        const currentMonto = parseFloat(montoAcordado || '0');
        
        const res = await aprobarSolicitud(
          aprobarModal.solicitud.id,
          currentMonto,
          parseFloat(montoAnticipo || '0'),"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("ReservasClient patched")
else:
    print("Target not found in ReservasClient")

# 2. Patch actions.ts
filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target_actions = """  // Si montoAcordado ya viene como el total completo (mayor o igual a los extras),
  // separamos la tarifa base neta restándole los extras para no inflarlo.
  let subtotalHospedaje = Number(montoAcordado);
  if (subtotalHospedaje >= sumaExtras && sumaExtras > 0) {
    subtotalHospedaje = subtotalHospedaje - sumaExtras;
  }
  
  const nuevoTotalAcordado = subtotalHospedaje + sumaExtras;
  const montoComisionCalc = Number(((subtotalHospedaje * tasaBase) + (sumaExtras * tasaExtras)).toFixed(2));
  const pComision = Number(regla.porcentaje_base);"""

replacement_actions = """  let tarifa_base = Number(montoAcordado);
  if (tarifa_base >= sumaExtras && sumaExtras > 0) {
    tarifa_base = tarifa_base - sumaExtras;
  }
  
  const nuevoTotalAcordado = tarifa_base + sumaExtras;
  const montoComisionCalc = Number(((tarifa_base * tasaBase) + (sumaExtras * tasaExtras)).toFixed(2));
  const pComision = Number(regla.porcentaje_base);"""

if target_actions in content:
    content = content.replace(target_actions, replacement_actions)
    
    # Need to replace subtotalHospedaje with tarifa_base in the insert query
    content = content.replace("tarifa_base: subtotalHospedaje,", "tarifa_base: tarifa_base,")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("actions.ts patched")
else:
    print("Target not found in actions.ts")
