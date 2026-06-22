'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Wallet, Info, Settings } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface MoreSheetProps {
  open: boolean
  onClose: () => void
}

export function MoreSheet({ open, onClose }: MoreSheetProps) {
  const t = useTranslations()

  const links = [
    { href: '/wallet', icon: Wallet, label: 'Health Wallet' },
    { href: '/awareness', icon: Info, label: t('features.awareness') },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl p-0 max-w-[430px] mx-auto">
        <SheetHeader className="p-4 border-b border-brand-border text-left">
          <SheetTitle>{t('nav.more')}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col p-2 safe-area-bottom">
          {links.map(link => (
            <Link 
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center gap-3 p-4 rounded-xl active:bg-brand-smoke transition-colors"
            >
              <link.icon className="text-brand-deepGreen" size={24} />
              <span className="text-base font-medium text-brand-ink">{link.label}</span>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}