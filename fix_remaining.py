import re

filepath = 'src/app/casasgaby/admin/actions.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. actualizarTarifaBase
# Find: const comisionBaseCalculada = tarifaBase * (Number(reserva.porcentaje_comision) / 100 || 0.025)
# We need to inject the fetch for `regla` if not present
# But wait, it's easier to just replace the logic inside the function.

pattern_actualizar = r"(const cargosList = reserva\.ajustes_reserva.*?)(const comisionBaseCalculada = tarifaBase \* \(Number\(reserva\.porcentaje_comision\) / 100 \|\| 0\.025\))(.*?)(const nuevoMontoComision = comisionBaseCalculada \+ comisionCargos)"
def repl_actualizar(m):
    return """
  const { data: regla } = await db.schema('central').from('reglas_comisiones').select('porcentaje_base').eq('modulo', 'hospedaje').eq('activo', true).single()
  const tasaBase = regla ? Number(regla.porcentaje_base) / 100 : (Number(reserva.porcentaje_comision)/100);
  
""" + m.group(1) + """
  const comisionBaseCalculada = tarifaBase * (reserva.porcentaje_comision ? (Number(reserva.porcentaje_comision) / 100) : tasaBase)""" + m.group(3) + m.group(4)

content = re.sub(pattern_actualizar, repl_actualizar, content, flags=re.DOTALL)

# 2. agregarAjusteReserva
# Find the tenants_config block
pattern_agregar = r"const \{ data: tenant \} = await db\.schema\('hospedaje'\)\.from\('tenants_config'\).*?const pComisionServicios = tenant\?\.comision_servicios_porcentaje \? Number\(tenant\.comision_servicios_porcentaje\) : 5\.00"
repl_agregar = """const { data: regla } = await db.schema('central').from('reglas_comisiones').select('porcentaje_base, porcentaje_extras').eq('modulo', 'hospedaje').eq('activo', true).single()
  if (!regla) throw new Error('Error contable: Regla de comisiones no encontrada en central.reglas_comisiones')
  const pComisionBase = Number(regla.porcentaje_base)
  const pComisionServicios = Number(regla.porcentaje_extras)"""
content = re.sub(pattern_agregar, repl_agregar, content, flags=re.DOTALL)

# Find the next comisionBaseCalculada in agregarAjusteReserva
# const comisionBaseCalculada = tarifaBase * (Number(reserva.porcentaje_comision) / 100 || (pComisionBase/100))
# This is fine since it uses pComisionBase dynamically.

# 3. eliminarAjusteReserva
# Find: const comisionBaseCalculada = tarifaBase * (Number(reserva.porcentaje_comision) / 100 || 0.025)
pattern_eliminar = r"(const cargos = cargosList\.reduce.*?)(const comisionBaseCalculada = tarifaBase \* \(Number\(reserva\.porcentaje_comision\) / 100 \|\| 0\.025\))"
def repl_eliminar(m):
    return """
      const { data: regla } = await db.schema('central').from('reglas_comisiones').select('porcentaje_base').eq('modulo', 'hospedaje').eq('activo', true).maybeSingle()
      const fallbackBase = regla ? Number(regla.porcentaje_base) / 100 : 0;
""" + m.group(1) + """
      const comisionBaseCalculada = tarifaBase * (reserva.porcentaje_comision ? (Number(reserva.porcentaje_comision) / 100) : fallbackBase)"""

content = re.sub(pattern_eliminar, repl_eliminar, content, flags=re.DOTALL)


# 4. crearServicio
# Find tenants_config
pattern_crear = r"const \{ data: tenant \} = await db\.schema\('hospedaje'\)\.from\('tenants_config'\)\.select\('comision_servicios_porcentaje'\)\.eq\('id', 'casasgaby'\)\.maybeSingle\(\)\s*const pComision = tenant\?\.comision_servicios_porcentaje \? Number\(tenant\.comision_servicios_porcentaje\) : 5\.0"
repl_crear = """const { data: regla } = await db.schema('central').from('reglas_comisiones').select('porcentaje_extras').eq('modulo', 'hospedaje').eq('activo', true).single()
    const pComision = regla ? Number(regla.porcentaje_extras) : 0"""
content = re.sub(pattern_crear, repl_crear, content, flags=re.DOTALL)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated dynamic fetch in actions.ts")
