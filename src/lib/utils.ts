import { COUNTRIES } from '@/lib/countries'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(price)
}

export function formatDateEs(isoDate: string) {
  if (!isoDate) return ''
  // Fix timezone shift by appending T12:00:00 or parsing parts
  const [year, month, day] = isoDate.split('T')[0].split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace('.', '') // Some locales add a dot after month
}

export function formatPhone(value: string, lada: string): string {
  const digits = value.replace(/\D/g, '')
  if (lada === '52') {
    const limited = digits.slice(0, 10)
    if (limited.length <= 3) return limited
    if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`
    return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`
  }
  if (lada === '1') {
    const limited = digits.slice(0, 10)
    if (limited.length <= 3) return limited
    if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`
  }
  if (lada === '34') {
    const limited = digits.slice(0, 9)
    const groups = limited.match(/.{1,3}/g)?.join(' ') || limited
    return groups
  }
  
  // Generic grouping for other countries (e.g., 3-3-4)
  const limited = digits.slice(0, 15)
  return limited.match(/.{1,3}/g)?.join(' ') || limited
}

export function isPhoneValid(value: string, lada: string): boolean {
  const digits = value.replace(/\D/g, '')
  if (lada === '52' || lada === '1') {
    return digits.length === 10
  }
  return digits.length >= 8 && digits.length <= 15
}


export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  const raw = phone.replace(/\D/g, '');
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
}

export function formatPhoneWithFlag(phone: string | null | undefined): string {
  if (!phone) return '';
  const raw = phone.replace(/\D/g, '');
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
}

export function parsePhoneForDb(rawPhone: string, defaultCode = '+52') {
  const digits = rawPhone.replace(/\D/g, '');
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
  const code = (codigoPais || '+52').replace(/\D/g, '');
  const num = (telefono || '').replace(/\D/g, '');
  const base = `https://wa.me/${code}${num}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function formatPhoneWithFlagObj(codigoPais: string | null | undefined, telefono: string | null | undefined): string {
  if (!telefono) return '';
  let code = (codigoPais || '+52').replace(/\D/g, '');
  let num = telefono.replace(/\D/g, '');
  
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
}
