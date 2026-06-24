'use client'

import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  tone?: 'green' | 'saffron' | 'blue' | 'pink'
}

export function StatCard({ icon: Icon, value, label, tone = 'green' }: StatCardProps) {
  const toneClasses = {
    green:   { icon: 'text-brand-deepGreen bg-brand-lightGreen',   accent: 'text-brand-deepGreen' },
    saffron: { icon: 'text-brand-saffron bg-brand-saffronLight',   accent: 'text-brand-saffron' },
    blue:    { icon: 'text-brand-blue bg-brand-blueLight',         accent: 'text-brand-blue' },
    pink:    { icon: 'text-brand-pink bg-brand-pinkLight',         accent: 'text-brand-pink' },
  }

  const { icon: iconClass, accent } = toneClasses[tone]

  return (
    <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-card flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <div className={`font-mono font-black text-2xl leading-none mb-0.5 ${accent}`}>{value}</div>
        <div className="text-xs text-brand-inkSoft font-medium leading-tight truncate">{label}</div>
      </div>
    </div>
  )
}
