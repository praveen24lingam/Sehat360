'use client'

import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  tone?: 'default' | 'feature'
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, tone = 'default' }: EmptyStateProps) {
  const isFeature = tone === 'feature'
  
  return (
    <div className={`flex flex-col items-center justify-center text-center p-6 ${isFeature ? 'bg-brand-lightGreen border border-brand-border rounded-2xl' : 'py-12'}`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isFeature ? 'bg-white text-brand-deepGreen' : 'bg-white border border-brand-border text-brand-inkSoft'}`}>
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-brand-ink mb-2">{title}</h3>
      <p className="text-sm text-brand-inkSoft mb-6 max-w-[280px]">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant={isFeature ? 'default' : 'outline'} className="rounded-xl px-6">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}