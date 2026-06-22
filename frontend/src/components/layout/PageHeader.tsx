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
    <div className="sticky top-0 z-40 h-14 md:h-16 bg-brand-smoke/95 backdrop-blur-sm border-b border-brand-border px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={() => router.back()} 
            className="p-1 -ml-1 text-brand-inkSoft active:bg-brand-border rounded-full transition-colors hover:bg-brand-border/50"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-semibold text-brand-ink leading-tight">{title}</h1>
          {subtitle && <span className="text-sm text-brand-inkSoft leading-tight">{subtitle}</span>}
        </div>
      </div>
      {rightSlot && <div>{rightSlot}</div>}
    </div>
  )
}