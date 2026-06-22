'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function DemoBanner() {
  const [open, setOpen] = useState(true)
  const t = useTranslations('common')

  if (!open) return null

  return (
    <div className="bg-brand-saffronLight border-b border-brand-saffron/20 text-brand-saffron text-xs px-4 py-2 flex items-center justify-between">
      <span>{t('demoNote')}</span>
      <button onClick={() => setOpen(false)} className="p-1 active:bg-brand-saffron/10 rounded-full">
        <X size={14} />
      </button>
    </div>
  )
}