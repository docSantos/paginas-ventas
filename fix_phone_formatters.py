import re

with open('src/lib/utils.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace formatPhoneNumber
old_formatPhoneNumber = """export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  const raw = phone.replace(/\\\\D/g, '');
  if (!raw) return phone;
  const sorted = [...COUNTRIES].filter(c => c.code !== 'separator').sort((a, b) => b.code.length - a.code.length);
  for (const c of sorted) {
    if (raw.startsWith(c.code)) {
      return `+${c.code} ${formatPhone(raw.substring(c.code.length), c.code)}`;
    }
  }
  return `+${raw}`;
}"""

new_formatPhoneNumber = """export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  const raw = phone.replace(/\\D/g, '');
  if (!raw) return phone;
  
  if (raw.startsWith('52') && raw.length === 12) {
    return `+52 ${formatPhone(raw.substring(2), '52')}`;
  } else if (raw.length === 10) {
    return `+52 ${formatPhone(raw, '52')}`;
  }

  const sorted = [...COUNTRIES].filter(c => c.code !== 'separator').sort((a, b) => b.code.length - a.code.length);
  for (const c of sorted) {
    if (raw.startsWith(c.code) && raw.length > c.code.length) {
      return `+${c.code} ${formatPhone(raw.substring(c.code.length), c.code)}`;
    }
  }
  return `+${raw}`;
}"""
content = content.replace(old_formatPhoneNumber, new_formatPhoneNumber)


# Replace formatPhoneWithFlag
old_formatPhoneWithFlag = """export function formatPhoneWithFlag(phone: string | null | undefined): string {
  if (!phone) return '';
  const raw = phone.replace(/\\\\D/g, '');
  if (!raw) return phone;
  const sorted = [...COUNTRIES].filter(c => c.code !== 'separator').sort((a, b) => b.code.length - a.code.length);
  for (const c of sorted) {
    if (raw.startsWith(c.code)) {
      return `${c.flag} +${c.code} ${formatPhone(raw.substring(c.code.length), c.code)}`;
    }
  }
  return `+${raw}`;
}"""

new_formatPhoneWithFlag = """export function formatPhoneWithFlag(phone: string | null | undefined): string {
  if (!phone) return '';
  const raw = phone.replace(/\\D/g, '');
  if (!raw) return phone;
  
  const mx = COUNTRIES.find(c => c.code === '52');
  if (raw.startsWith('52') && raw.length === 12) {
    return `${mx?.flag || '🇲🇽'} +52 ${formatPhone(raw.substring(2), '52')}`;
  } else if (raw.length === 10) {
    return `${mx?.flag || '🇲🇽'} +52 ${formatPhone(raw, '52')}`;
  }

  const sorted = [...COUNTRIES].filter(c => c.code !== 'separator').sort((a, b) => b.code.length - a.code.length);
  for (const c of sorted) {
    if (raw.startsWith(c.code) && raw.length > c.code.length) {
      return `${c.flag} +${c.code} ${formatPhone(raw.substring(c.code.length), c.code)}`;
    }
  }
  return `+${raw}`;
}"""
content = content.replace(old_formatPhoneWithFlag, new_formatPhoneWithFlag)


# Replace formatPhoneWithFlagObj
old_formatPhoneWithFlagObj = """export function formatPhoneWithFlagObj(codigoPais: string | null | undefined, telefono: string | null | undefined): string {
  if (!telefono) return '';
  const code = (codigoPais || '+52').replace(/\\D/g, '');
  const num = telefono.replace(/\\D/g, '');
  
  const country = COUNTRIES.find(c => c.code === code);
  const flag = country ? country.flag : '';
  
  return `${flag} +${code} ${formatPhone(num, code)}`.trim();
}"""

new_formatPhoneWithFlagObj = """export function formatPhoneWithFlagObj(codigoPais: string | null | undefined, telefono: string | null | undefined): string {
  if (!telefono) return '';
  let code = (codigoPais || '+52').replace(/\\D/g, '');
  let num = telefono.replace(/\\D/g, '');
  
  // Cleanup case where full number is in `telefono`
  if (num.startsWith('52') && num.length === 12) {
    code = '52';
    num = num.substring(2);
  } else if (num.startsWith('1') && num.length === 11) {
    code = '1';
    num = num.substring(1);
  } else if (num.startsWith('34') && num.length === 11) {
    code = '34';
    num = num.substring(2);
  }

  const country = COUNTRIES.find(c => c.code === code);
  const flag = country ? country.flag : '';
  
  return `${flag} +${code} ${formatPhone(num, code)}`.trim();
}"""
content = content.replace(old_formatPhoneWithFlagObj, new_formatPhoneWithFlagObj)


with open('src/lib/utils.ts', 'w', encoding='utf-8') as f:
    f.write(content)
