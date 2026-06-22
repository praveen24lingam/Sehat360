'use client'

import { AppShell } from '@/components/layout/AppShell'

export default function AwarenessLoading() {
  return (
    <AppShell>
      <div className="h-[52px] border-b border-brand-border flex items-center px-4 bg-white">
        <div className="h-6 w-32 bg-brand-border/50 rounded animate-pulse" />
      </div>

      <div className="sticky top-[52px] z-10 bg-brand-smoke/95 px-4 py-2 border-b border-brand-border">
        <div className="h-10 w-full bg-brand-border/30 rounded-xl mb-3 animate-pulse" />
        <div className="flex gap-2 pb-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-8 w-24 bg-brand-border/30 rounded-full animate-pulse shrink-0" />
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-brand-border rounded-2xl p-4 h-[180px] animate-pulse" />
        ))}
      </div>
    </AppShell>
  )
}
