import os
import re

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the old config fetching
old_config = """    const { data: tenant } = await db.schema('hospedaje').from('tenants_config').select('porcentaje_comision_base').eq('id', 'casasgaby').maybeSingle()
    const pComision = tenant?.porcentaje_comision_base ? Number(tenant.porcentaje_comision_base) : 2.50"""

new_config = """    // RECUPERAR COMISIÓN TRANSVERSAL DESDE LA CONSOLA CENTRAL
    let pComision = 2.50
    const { data: centralCfg } = await db.schema('central').from('configuracion').select('*').eq('tenant_id', 'casasgaby').maybeSingle()
    if (!centralCfg) {
      const { data: centralCfgId } = await db.schema('central').from('configuracion').select('*').eq('id', 'casasgaby').maybeSingle()
      if (centralCfgId) {
        pComision = Number(centralCfgId.comision_hospedaje || centralCfgId.porcentaje_comision || centralCfgId.porcentaje_comision_rentas || 2.50)
      }
    } else {
      pComision = Number(centralCfg.comision_hospedaje || centralCfg.porcentaje_comision || centralCfg.porcentaje_comision_rentas || 2.50)
    }"""

content = content.replace(old_config, new_config)

# Update reserva insert
old_insert = """      num_huespedes: solicitud.num_huespedes || 1,
      monto_total_acordado: nuevoTotalAcordado,
      monto_apartado: anticipoReal,
      tarifa_base: montoAcordado,
      monto_comision: montoComisionCalc,
      comision_pagada: 0,
      estado: 'Activa'
    })
    .select('id')"""

new_insert = """      num_huespedes: solicitud.num_huespedes || 1,
      monto_total_acordado: nuevoTotalAcordado,
      monto_apartado: anticipoReal,
      tarifa_base: montoAcordado,
      
      // Comisión transversal
      porcentaje_comision: pComision,
      monto_comision: montoAcordado * (pComision / 100),
      comision_pagada: 0,
      estado_comision: 'pendiente',
      
      estado: 'Activa'
    })
    .select('id')"""

content = content.replace(old_insert, new_insert)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
    
print("Updated actions.ts for commissions.")
