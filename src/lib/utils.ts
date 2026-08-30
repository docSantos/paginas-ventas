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
  if (lada === '52' || lada === '1') {
    const limited = digits.slice(0, 10)
    if (limited.length <= 3) return limited
    if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`
    return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`
  }
  return digits.slice(0, 15)
}

export function isPhoneValid(value: string, lada: string): boolean {
  const digits = value.replace(/\D/g, '')
  if (lada === '52' || lada === '1') {
    return digits.length === 10
  }
  return digits.length >= 8 && digits.length <= 15
}
