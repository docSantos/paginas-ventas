import sys
import re

with open('src/lib/utils.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_utils = """
export function parsePhoneForDb(rawPhone: string, defaultCode = '+52') {
  const digits = rawPhone.replace(/\\D/g, '');
  let codigoPais = defaultCode;
  let telefono = digits;

  // Extremely basic detection: if it matches country codes
  if (digits.startsWith('52') && digits.length >= 12) {
    codigoPais = '+52';
    telefono = digits.substring(2);
  } else if (digits.startsWith('34') && digits.length >= 11) {
    codigoPais = '+34';
    telefono = digits.substring(2);
  } else if (digits.startsWith('1') && digits.length >= 11) {
    codigoPais = '+1';
    telefono = digits.substring(1);
  }

  return { codigoPais, telefono };
}

export function buildWaUrl(codigoPais: string | null | undefined, telefono: string | null | undefined, text?: string): string {
  const code = (codigoPais || '+52').replace(/\\D/g, '');
  const num = (telefono || '').replace(/\\D/g, '');
  const base = `https://wa.me/${code}${num}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function formatPhoneWithFlagObj(codigoPais: string | null | undefined, telefono: string | null | undefined): string {
  if (!telefono) return '';
  const code = (codigoPais || '+52').replace(/\\D/g, '');
  const num = telefono.replace(/\\D/g, '');
  
  const country = COUNTRIES.find(c => c.code === code);
  const flag = country ? country.flag : '';
  
  return `${flag} +${code} ${formatPhone(num, code)}`.trim();
}
"""

content += new_utils

with open('src/lib/utils.ts', 'w', encoding='utf-8') as f:
    f.write(content)
