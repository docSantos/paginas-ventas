import os

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

start_str = "    const { data: tenant } = await db.schema('hospedaje').from('tenants_config').select('porcentaje_comision_base').eq('id', 'casasgaby').maybeSingle()"
end_str = "const montoComisionCalc = ((montoAcordado * pComision) / 100) + comisionExtras"

if start_str in content and end_str in content:
    start_idx = content.index(start_str)
    end_idx = content.index(end_str) + len(end_str)
    
    replacement = """    const { data: tenant } = await db.schema('hospedaje').from('tenants_config').select('porcentaje_comision_base, porcentaje_comision_extras').eq('id', 'casasgaby').maybeSingle();
    const pComisionHospedaje = tenant?.porcentaje_comision_base ? Number(tenant.porcentaje_comision_base) : 15.00;
    const pComisionExtras = tenant?.porcentaje_comision_extras ? Number(tenant.porcentaje_comision_extras) : 5.00;
    
    const sumaExtras = extras ? extras.reduce((acc: any, e: any) => acc + Number(e.monto || e.precio_base || 0), 0) : 0;
    const subtotalHospedaje = montoAcordado;
    const montoComisionHospedaje = subtotalHospedaje * (pComisionHospedaje / 100);
    const montoComisionExtrasCalc = sumaExtras * (pComisionExtras / 100);
    const montoComisionCalc = montoComisionHospedaje + montoComisionExtrasCalc;
    const nuevoTotalAcordado = subtotalHospedaje + sumaExtras;
    const pComision = pComisionHospedaje;"""
    
    content = content[:start_idx] + replacement + content[end_idx:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Not found")
