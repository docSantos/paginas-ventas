import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update crearServicio validation & default
replace_crear = """export async function crearServicio(nombre: string, descripcion: string, precio_base: number, tipo_tarifa: string, activo: boolean, porcentaje_comision: number = 5) {
  if (precio_base < 0) throw new Error('El precio base no puede ser negativo')
  if (porcentaje_comision < 0 || porcentaje_comision > 100) throw new Error('El porcentaje de comisión debe estar entre 0 y 100')
  const supabase = await createClient()"""
content = re.sub(
    r"export async function crearServicio\(nombre: string, descripcion: string, precio_base: number, tipo_tarifa: string,\s*activo: boolean, porcentaje_comision: number = 10\) \{\s*const supabase = await createClient\(\)",
    replace_crear,
    content
)

# Update agregarAjusteReserva validation
replace_agregar = """export async function agregarAjusteReserva(reservaId: string, tipo: 'cargo' | 'descuento', concepto: string, monto: number, porcentaje_comision: number = 0) {
  if (!monto || isNaN(Number(monto)) || Number(monto) <= 0) {
    throw new Error('El monto debe ser un número positivo mayor a cero.')
  }
  if (porcentaje_comision < 0 || porcentaje_comision > 100) {
    throw new Error('El porcentaje de comisión debe estar entre 0 y 100')
  }
  const supabase = await createClient()"""
content = re.sub(
    r"export async function agregarAjusteReserva\(reservaId: string, tipo: 'cargo' \| 'descuento', concepto: string, monto: number, porcentaje_comision: number = 0\) \{\s*if \(\!monto \|\| isNaN\(Number\(monto\)\) \|\| Number\(monto\) <= 0\) \{\s*throw new Error\('El monto debe ser un n.*?mero positivo mayor a cero\.'\)\s*\}\s*const supabase = await createClient\(\)",
    replace_agregar,
    content
)

# Update actualizarServicio validation
replace_actualizar = """export async function actualizarServicio(id: string, data: any) {
  if (data.precio_base !== undefined && data.precio_base < 0) throw new Error('El precio base no puede ser negativo')
  if (data.porcentaje_comision !== undefined && (data.porcentaje_comision < 0 || data.porcentaje_comision > 100)) throw new Error('El porcentaje de comisión debe estar entre 0 y 100')
  const supabase = await createClient()"""
content = re.sub(
    r"export async function actualizarServicio\(id: string, data: any\) \{\s*const supabase = await createClient\(\)",
    replace_actualizar,
    content
)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
