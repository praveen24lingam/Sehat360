'use client'

import { Medicine } from '@/types'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, ChevronDown, ChevronUp, ArrowRight, ShieldCheck } from 'lucide-react'
import { RupeeDisplay } from './RupeeDisplay'

interface MedicineCardProps {
  medicine: Medicine
  expanded?: boolean
  onToggle?: () => void
}

export function MedicineCard({ medicine, expanded = false, onToggle }: MedicineCardProps) {
  return (
    <div 
      onClick={onToggle} 
      className={`bg-white border transition-all duration-300 cursor-pointer overflow-hidden relative ${expanded ? 'rounded-[2rem] border-brand-deepGreen/20 shadow-card-lg' : 'rounded-[1.5rem] border-brand-border/60 shadow-card hover:shadow-card-md hover:border-brand-border'}`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="pr-4">
            <div className="flex items-center gap-2 mb-1.5">
              <h4 className="font-black text-brand-ink text-base tracking-tight">{medicine.brandName}</h4>
              <span className="text-[9px] bg-brand-smoke px-2 py-0.5 rounded-full font-bold text-brand-inkSoft border border-brand-border/50 uppercase tracking-widest">{medicine.dosage}</span>
            </div>
            {!expanded && (
              <div className="text-xs text-brand-inkSoft font-medium flex items-center gap-1.5 line-clamp-1">
                <span>{medicine.saltName}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="bg-brand-saffronLight text-brand-saffron px-2.5 py-1 rounded-xl text-xs font-black shadow-sm flex flex-col items-end border border-brand-saffron/10">
              <span className="text-[8px] uppercase tracking-wider mb-0.5 opacity-80">You Save</span>
              <RupeeDisplay amount={medicine.monthlySaving} size="sm" compact />
            </div>
            {!expanded ? <ChevronDown size={16} className="text-brand-inkSoft" /> : <ChevronUp size={16} className="text-brand-inkSoft" />}
          </div>
        </div>

        {expanded && (
          <div className="mt-5 pt-5 border-t border-brand-border/60">
            <div className="flex items-center justify-between bg-brand-smoke p-4 rounded-2xl border border-brand-border/40">
              {/* Brand Side */}
              <div className="flex-1 flex flex-col items-start">
                <span className="text-[9px] text-brand-inkSoft uppercase font-black tracking-widest mb-1.5">Brand (MRP)</span>
                <span className="font-bold text-brand-ink text-sm mb-1 line-clamp-1">{medicine.brandName}</span>
                <div className="text-brand-danger line-through font-mono font-bold">₹{medicine.brandPrice}</div>
              </div>

              {/* Divider/Arrow */}
              <div className="px-3 text-brand-inkSoft/30">
                <ArrowRight size={20} />
              </div>

              {/* Generic Side */}
              <div className="flex-1 flex flex-col items-end text-right">
                <span className="text-[9px] text-brand-deepGreen bg-brand-lightGreen px-2 py-0.5 rounded-full uppercase font-black tracking-widest mb-1.5 border border-brand-deepGreen/10">Jan Aushadhi</span>
                <span className="font-bold text-brand-ink text-sm mb-1 line-clamp-1">{medicine.saltName}</span>
                <div className="font-mono font-black text-brand-deepGreen text-xl">₹{medicine.genericPrice}</div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between px-1">
              {medicine.confidence > 0.9 ? (
                <div className="flex items-center gap-1.5 text-[10px] text-brand-midGreen font-bold">
                  <ShieldCheck size={14} className="text-brand-deepGreen" />
                  {medicine.source === 'gemini' ? 'AI Verified Match' : 'Catalog Verified'}
                </div>
              ) : (
                <div className="text-[10px] text-brand-inkSoft font-medium">Medium confidence match</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}