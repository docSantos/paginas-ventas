import re

with open('src/app/casasgaby/admin/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "export async function registrarComisionPagada(reservaId: string, montoPagado: number, notas: string = '') {\n  const supabase = await createClient()",
    "export async function registrarComisionPagada(reservaId: string, montoPagado: number, notas: string = '') {\n  if (!montoPagado || isNaN(Number(montoPagado)) || Number(montoPagado) <= 0) throw new Error('El monto debe ser un número positivo mayor a cero.');\n  const supabase = await createClient()"
)

content = content.replace(
    "export async function aplicarSaldoAFavorComision(comisionActivaId: string, montoRequerido: number) {\n  const supabase = await createClient()",
    "export async function aplicarSaldoAFavorComision(comisionActivaId: string, montoRequerido: number) {\n  if (!montoRequerido || isNaN(Number(montoRequerido)) || Number(montoRequerido) <= 0) throw new Error('El monto debe ser un número positivo mayor a cero.');\n  const supabase = await createClient()"
)

with open('src/app/casasgaby/admin/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
