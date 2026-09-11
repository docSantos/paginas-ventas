import os
import re

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace commission calculation block
pattern_calc = re.compile(r"    const \{ data: tenant \} = await db\.schema\('hospedaje'\)\.from\('tenants_config'\)\.select\('porcentaje_comision_base'\)\.eq\('id', 'casasgaby'\)\.maybeSingle\(\)\s*const pComision = tenant\?\.porcentaje_comision_base \? Number\(tenant\.porcentaje_comision_base\) : 2\.50\s*const sumaExtras = extras \? extras\.reduce\(\(acc, e\) => acc \+ Number\(e\.monto\), 0\) : 0\s*const comisionExtras = extras \? extras\.reduce\(\(acc, e\) => acc \+ \(Number\(e\.monto\) \* Number\(e\.porcentaje_comision\) / 100\), 0\) : 0\s*const nuevoTotalAcordado = montoAcordado \+ sumaExtras\s*const montoComisionCalc = \(\(montoAcordado \* pComision\) / 100\) \+ comisionExtras")

new_calc = """    const { data: tenant } = await db.schema('hospedaje').from('tenants_config').select('porcentaje_comision_base, porcentaje_comision_extras').eq('id', 'casasgaby').maybeSingle()
    const pComisionHospedaje = tenant?.porcentaje_comision_base ? Number(tenant.porcentaje_comision_base) : 15.00
    const pComisionExtras = tenant?.porcentaje_comision_extras ? Number(tenant.porcentaje_comision_extras) : 5.00
    
    const sumaExtras = extras ? extras.reduce((acc: any, e: any) => acc + Number(e.monto || e.precio_base || 0), 0) : 0
    const subtotalHospedaje = montoAcordado
    const montoComisionHospedaje = subtotalHospedaje * (pComisionHospedaje / 100)
    const montoComisionExtrasCalc = sumaExtras * (pComisionExtras / 100)
    
    const montoComisionCalc = montoComisionHospedaje + montoComisionExtrasCalc
    const nuevoTotalAcordado = subtotalHospedaje + sumaExtras"""

content = pattern_calc.sub(new_calc, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated calculations.")
