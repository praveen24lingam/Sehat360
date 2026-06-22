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
    green: 'text-brand-deepGreen bg-brand-lightGreen',
    saffron: 'text-brand-saffron bg-brand-saffronLight',
    blue: 'text-brand-blue bg-brand-blueLight',
    pink: 'text-brand-pink bg-brand-pinkLight',
  }

  return (
    <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-card flex flex-col justify-between aspect-square">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${toneClasses[tone]}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="font-mono font-bold text-2xl text-brand-ink mb-1">{value}</div>
        <div className="text-xs text-brand-inkSoft font-medium leading-tight">{label}</div>
      </div>
    </div>
  )
}