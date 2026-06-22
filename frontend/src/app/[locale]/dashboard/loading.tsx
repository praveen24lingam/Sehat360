'use client'

import { AppShell } from '@/components/layout/AppShell'

export default function DashboardLoading() {
  return (
    <AppShell>
      <div className="sticky top-0 bg-brand-smoke/95 backdrop-blur-sm z-10 py-3 px-4 flex items-center justify-between h-[52px]">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-24 bg-brand-border/50 rounded animate-pulse" />
          <div className="h-5 w-32 bg-brand-border/50 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-6 bg-brand-border/50 rounded-full animate-pulse" />
          <div className="w-8 h-8 bg-brand-border/50 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6 md:gap-8 pb-20 md:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-brand-border/20 rounded-2xl p-5 md:p-6 h-[200px] animate-pulse" />
          <div className="hidden lg:flex bg-brand-border/20 rounded-2xl p-6 h-[200px] animate-pulse" />
        </div>

        <section>
          <div className="h-5 w-32 bg-brand-border/50 rounded mb-4 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-brand-border/10 border border-brand-border/30 rounded-2xl p-4 md:p-5 h-[120px] animate-pulse" />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <section className="lg:col-span-2">
            <div className="h-5 w-40 bg-brand-border/50 rounded mb-4 animate-pulse" />
            <div className="flex flex-col gap-3">
              {[1, 2].map(i => (
                <div key={i} className="bg-brand-border/10 rounded-xl h-[80px] animate-pulse" />
              ))}
            </div>
          </section>
          <section className="lg:col-span-1">
            <div className="h-5 w-32 bg-brand-border/50 rounded mb-4 animate-pulse" />
            <div className="bg-brand-border/10 rounded-2xl h-[160px] animate-pulse" />
          </section>
        </div>
      </div>
    </AppShell>
  )
}
