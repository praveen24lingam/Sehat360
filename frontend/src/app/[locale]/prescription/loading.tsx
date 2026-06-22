'use client'

import { AppShell } from '@/components/layout/AppShell'

export default function PrescriptionLoading() {
  return (
    <AppShell>
      <div className="h-[52px] border-b border-brand-border flex items-center px-4 bg-white">
        <div className="h-6 w-32 bg-brand-border/50 rounded animate-pulse" />
      </div>

      <div className="p-4 flex flex-col gap-6">
        <div className="bg-brand-border/10 rounded-2xl p-6 h-[250px] border border-brand-border/50 border-dashed animate-pulse" />
        
        <div className="flex flex-col gap-3">
          <div className="h-5 w-40 bg-brand-border/50 rounded mb-2 animate-pulse" />
          {[1, 2].map(i => (
            <div key={i} className="bg-white border border-brand-border rounded-xl p-4 h-[100px] animate-pulse" />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
