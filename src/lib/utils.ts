// src/lib/utils.ts
// Utilidades de estilos para combinar clases de Tailwind de forma segura
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases de Tailwind de forma segura, resolviendo conflictos.
 * Uso: cn("px-4 py-2", isActive && "bg-blue-500", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un número como precio en pesos mexicanos.
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formatea una fecha ISO a formato legible en español.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Calcula el número de noches entre dos fechas.
 */
export function calcularNoches(entrada: string, salida: string): number {
  const inicio = new Date(entrada)
  const fin = new Date(salida)
  const diff = fin.getTime() - inicio.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
