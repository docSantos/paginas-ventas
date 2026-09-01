import re
import os

utils_path = 'src/lib/utils.ts'
reservas_path = 'src/components/casasgaby/admin/ReservasClient.tsx'
clientes_path = 'src/components/casasgaby/admin/ClientesClient.tsx'

# 1. Update utils.ts
with open(utils_path, 'r', encoding='utf-8') as f:
    utils_content = f.read()

# Remove the old formatStoredPhone function
start_idx = utils_content.find("export function formatStoredPhone")
if start_idx != -1:
    utils_content = utils_content[:start_idx]

new_func = """export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  
  // Limpiar espacios y guiones previos, conservando solo dígitos y si inicia con '+'
  const raw = phone.trim();
  const hasPlus = raw.startsWith('+');
  const digits = raw.replace(/\\D/g, '');

  if (!digits) return phone;

  // Caso México con 52
  if (digits.startsWith('52') && digits.length >= 12) {
    const rest = digits.slice(2);
    return `+52 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6, 10)}${rest.slice(10) ? ' ' + rest.slice(10) : ''}`.trim();
  }

  // Caso España con 34
  if (digits.startsWith('34')) {
    const rest = digits.slice(2);
    // Agrupar en bloques de 3
    const groups = rest.match(/.{1,3}/g)?.join(' ') || rest;
    return `+34 ${groups}`;
  }

  // Caso USA/Canadá con 1
  if (digits.startsWith('1') && digits.length === 11) {
    const rest = digits.slice(1);
    return `+1 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
  }

  // Si tiene 10 dígitos sin lada (nacional)
  if (digits.length === 10 && !hasPlus) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  // Fallback genérico para otros internacionales
  if (hasPlus || digits.length > 10) {
    const prefix = digits.length > 10 ? digits.slice(0, 2) : '';
    const rest = digits.length > 10 ? digits.slice(2) : digits;
    const groups = rest.match(/.{1,3}/g)?.join(' ') || rest;
    return `+${prefix ? prefix + ' ' : ''}${groups}`;
  }

  return phone;
}
"""

with open(utils_path, 'w', encoding='utf-8') as f:
    f.write(utils_content + new_func)

# 2. Update ReservasClient.tsx
with open(reservas_path, 'r', encoding='utf-8') as f:
    reservas_content = f.read()

reservas_content = reservas_content.replace('formatStoredPhone', 'formatPhoneNumber')

with open(reservas_path, 'w', encoding='utf-8') as f:
    f.write(reservas_content)

# 3. Update ClientesClient.tsx
with open(clientes_path, 'r', encoding='utf-8') as f:
    clientes_content = f.read()

clientes_content = clientes_content.replace('formatStoredPhone', 'formatPhoneNumber')

with open(clientes_path, 'w', encoding='utf-8') as f:
    f.write(clientes_content)
