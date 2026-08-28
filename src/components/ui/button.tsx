// src/components/ui/button.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default:     'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-sm',
  outline:     'border border-teal-600 text-teal-700 hover:bg-teal-50 active:bg-teal-100',
  ghost:       'text-teal-700 hover:bg-teal-50 active:bg-teal-100',
  destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
  link:        'text-teal-600 underline-offset-4 hover:underline p-0 h-auto',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm:   'h-8 px-3 text-xs rounded-lg',
  md:   'h-10 px-4 text-sm rounded-xl',
  lg:   'h-12 px-6 text-base rounded-xl',
  icon: 'h-10 w-10 rounded-xl',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
