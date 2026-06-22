'use client'

import { RupeeDisplay } from './RupeeDisplay'

interface SavingsCardProps {
  monthly: number
  yearly: number
  prescriptionCount: number
  schemeCount?: number
}

export function SavingsCard({ monthly, yearly, prescriptionCount, schemeCount = 0 }: SavingsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-premium p-6 text-white shadow-button border border-white/10 group">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-deepGreen/50 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10">
        <div className="text-white/80 text-xs font-bold uppercase tracking-wider mb-2">Total Monthly Savings</div>
        <RupeeDisplay amount={monthly} size="xl" color="white" />
        
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 bg-white/5 -mx-4 px-4 rounded-b-[1rem] backdrop-blur-sm shadow-inner">
          <div>
            <div className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">Yearly Projection</div>
            <RupeeDisplay amount={yearly} size="sm" color="white" />
          </div>
          <div className="text-right">
            <div className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">Active Benefits</div>
            <div className="text-sm font-bold text-white/90">{prescriptionCount} Meds • {schemeCount} Schemes</div>
          </div>
        </div>
      </div>
    </div>
  )
}