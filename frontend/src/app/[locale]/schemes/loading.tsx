'use client'

import { AppShell } from '@/components/layout/AppShell'

export default function SchemesLoading() {
  return (
    <AppShell>
      <div className="h-[52px] border-b border-brand-border flex items-center px-4 bg-white">
        <div className="h-6 w-32 bg-brand-border/50 rounded animate-pulse" />
      </div>

      <div className="p-4 flex flex-col gap-6">
        <div className="bg-brand-border/20 rounded-2xl p-6 h-[120px] animate-pulse" />
        
        <div className="bg-white border border-brand-border rounded-2xl p-6 h-[400px] animate-pulse" />
      </div>
    </AppShell>
  )
}
