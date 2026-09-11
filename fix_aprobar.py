import os

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """  const TASA_HOSPEDAJE = 0.025;
  const TASA_EXTRAS = 0.05;
  
  const sumaExtras = extras ? extras.reduce((acc: any, e: any) => acc + Number(e.monto || e.precio_base || 0), 0) : 0;
  const subtotalHospedaje = montoAcordado;
  const montoComisionHospedaje = subtotalHospedaje * TASA_HOSPEDAJE;
  const montoComisionExtrasCalc = sumaExtras * TASA_EXTRAS;
  const montoComisionTotal = montoComisionHospedaje + montoComisionExtrasCalc;
  const nuevoTotalAcordado = subtotalHospedaje + sumaExtras;
  const montoComisionCalc = montoComisionTotal;
  const pComision = 2.50; // Para la columna porcentaje_comision"""

replacement = """  const { data: regla, error: errRegla } = await db
    .schema('central')
    .from('reglas_comisiones')
    .select('porcentaje_base, porcentaje_extras')
    .eq('modulo', 'hospedaje')
    .eq('activo', true)
    .single();

  if (errRegla || !regla) {
    throw new Error('Error contable: Regla de comisiones no encontrada en central.reglas_comisiones');
  }

  const tasaBase = Number(regla.porcentaje_base) / 100;
  const tasaExtras = Number(regla.porcentaje_extras) / 100;

  const sumaExtras = extras ? extras.reduce((acc: any, e: any) => acc + Number(e.monto || e.precio_base || 0), 0) : 0;
  const subtotalHospedaje = montoAcordado;
  
  const montoComision = (subtotalHospedaje * tasaBase) + (sumaExtras * tasaExtras);
  const nuevoTotalAcordado = subtotalHospedaje + sumaExtras;
  const montoComisionCalc = montoComision;
  const pComision = Number(regla.porcentaje_base);"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced calculations dynamically in aprobarSolicitud")
else:
    print("Not found target block in aprobarSolicitud")
