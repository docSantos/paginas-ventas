import os

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

start_str = "  const { data: tenant } = await db.schema('hospedaje').from('tenants_config').select('porcentaje_comision_base, porcentaje_comision_extras').eq('id', 'casasgaby').maybeSingle();"
end_str = "const pComision = pComisionHospedaje;"

if start_str in content and end_str in content:
    start_idx = content.index(start_str)
    end_idx = content.index(end_str) + len(end_str)
    
    replacement = """  const pComisionHospedaje = 2.50;
  const pComisionExtras = 5.00;
  
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
