import os

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """  const pComisionHospedaje = 2.50;
  const pComisionExtras = 5.00;
  
  const sumaExtras = extras ? extras.reduce((acc: any, e: any) => acc + Number(e.monto || e.precio_base || 0), 0) : 0;
  const subtotalHospedaje = montoAcordado;
  const montoComisionHospedaje = subtotalHospedaje * (pComisionHospedaje / 100);
  const montoComisionExtrasCalc = sumaExtras * (pComisionExtras / 100);
  const montoComisionCalc = montoComisionHospedaje + montoComisionExtrasCalc;
  const nuevoTotalAcordado = subtotalHospedaje + sumaExtras;
  const pComision = pComisionHospedaje;"""

replacement = """  const TASA_HOSPEDAJE = 0.025;
  const TASA_EXTRAS = 0.05;
  
  const sumaExtras = extras ? extras.reduce((acc: any, e: any) => acc + Number(e.monto || e.precio_base || 0), 0) : 0;
  const subtotalHospedaje = montoAcordado;
  const montoComisionHospedaje = subtotalHospedaje * TASA_HOSPEDAJE;
  const montoComisionExtrasCalc = sumaExtras * TASA_EXTRAS;
  const montoComisionTotal = montoComisionHospedaje + montoComisionExtrasCalc;
  const nuevoTotalAcordado = subtotalHospedaje + sumaExtras;
  const montoComisionCalc = montoComisionTotal;
  const pComision = 2.50; // Para la columna porcentaje_comision"""

if target in content:
    content = content.replace(target, replacement)
    
    # Also replace pComisionHospedaje usage below
    content = content.replace("porcentaje_comision: pComisionHospedaje,", "porcentaje_comision: 2.50,")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated to constants")
else:
    print("Not found")
