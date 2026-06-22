'use client'

import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function ErrorState({ title, description, actionLabel, onAction }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 py-12">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-brand-dangerLight text-brand-danger">
        <AlertCircle size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-brand-ink mb-2">{title}</h3>
      <p className="text-sm text-brand-inkSoft mb-6 max-w-[280px]">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="destructive" className="rounded-xl px-6">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}