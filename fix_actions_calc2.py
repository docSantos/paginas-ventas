import os

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

start_str = "  const TASA_HOSPEDAJE = 0.025;"
end_str = "const pComision = 2.50; // Para la columna porcentaje_comision"

if start_str in content and end_str in content:
    start_idx = content.index(start_str)
    end_idx = content.index(end_str) + len(end_str)
    
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
    
    content = content[:start_idx] + replacement + content[end_idx:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced calculation successfully")
else:
    print("Not found calculation")
