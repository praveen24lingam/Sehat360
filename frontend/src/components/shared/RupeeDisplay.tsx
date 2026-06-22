'use client'

import { formatRupee } from '@/lib/formatters'

interface RupeeDisplayProps {
  amount: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'white' | 'green' | 'default'
  compact?: boolean
}

export function RupeeDisplay({ amount, size = 'md', color = 'default', compact = false }: RupeeDisplayProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  }
  
  const colorClasses = {
    white: 'text-white',
    green: 'text-brand-deepGreen',
    default: 'text-brand-ink'
  }

  const formatted = compact ? formatRupee(amount) : formatRupee(amount)

  return (
    <span className={`font-mono font-bold ${sizeClasses[size]} ${colorClasses[color]}`}>
      {formatted}
    </span>
  )
}