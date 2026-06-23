import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  imageSrc?: string
  icon?: LucideIcon
  actionLabel?: string
  onAction?: () => void
  className?: string
  tone?: 'default' | 'feature' | 'danger'
}

export function EmptyState({
  title,
  description,
  imageSrc,
  icon: Icon,
  actionLabel,
  onAction,
  className,
  tone = 'default',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl shadow-sm border border-brand-border/40 max-w-lg mx-auto animate-slide-up',
        className
      )}
    >
      <div className="mb-6 relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 192px, 256px"
          />
        ) : Icon ? (
          <div
            className={cn(
              'opacity-50 transform scale-[3]',
              tone === 'danger' ? 'text-brand-danger' : 'text-brand-midGreen'
            )}
          >
            <Icon />
          </div>
        ) : null}
      </div>

      <h3 className="text-xl md:text-2xl font-black text-brand-ink mb-2 tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-brand-inkSoft font-medium max-w-sm mb-6">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-brand-deepGreen hover:bg-brand-midGreen text-white font-bold rounded-xl px-8 h-12 shadow-sm active:scale-95 transition-all"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
