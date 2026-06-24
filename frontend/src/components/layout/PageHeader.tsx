'use client'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  rightSlot?: React.ReactNode
}

export function PageHeader({ title, subtitle, showBack = false, rightSlot }: PageHeaderProps) {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-40 h-14 md:h-16 bg-brand-smoke/95 backdrop-blur-sm border-b border-brand-border/60 px-4 md:px-6 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center -ml-1 rounded-xl text-brand-inkSoft active:bg-brand-border transition-colors shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-[17px] md:text-lg font-bold text-brand-ink leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-brand-inkSoft font-medium leading-tight truncate">{subtitle}</p>}
        </div>
      </div>
      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </div>
  )
}
