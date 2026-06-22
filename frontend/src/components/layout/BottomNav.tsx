'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Pill, Building2, HeartPulse, MoreHorizontal } from 'lucide-react'
import { useState, useEffect } from 'react'
import { MoreSheet } from './MoreSheet'
import { useTranslations } from 'next-intl'

const TABS = [
  { href: '/dashboard',    icon: Home,          labelKey: 'nav.home' },
  { href: '/prescription', icon: Pill,          labelKey: 'nav.prescription' },
  { href: '/schemes',      icon: Building2,     labelKey: 'nav.schemes' },
  { href: '/mother-care',  icon: HeartPulse,    labelKey: 'nav.care',
    activeOn: ['/mother-care', '/vaccination'] },
  { href: '#more',         icon: MoreHorizontal, labelKey: 'nav.more',
    activeOn: ['/settings', '/wallet', '/awareness'] },
]

export function BottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const t = useTranslations()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [setMounted])

  if (!mounted) return null

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 md:hidden w-full
                   bg-white/90 backdrop-blur-md shadow-nav border-t border-brand-border
                   z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex h-16">
          {TABS.map((tab) => {
            const activeRoutes = tab.activeOn ?? [tab.href]
            const isActive = activeRoutes.some(r => pathname.startsWith(r))
            const Icon = tab.icon

            if (tab.href === '#more') {
              return (
                <button
                  key="more"
                  onClick={() => setMoreOpen(true)}
                  className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative
                    transition-colors ${isActive ? 'text-brand-deepGreen' : 'text-brand-inkSoft'}`}
                  aria-label="More options"
                >
                  {isActive && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand-deepGreen" />
                  )}
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{t(tab.labelKey)}</span>
                </button>
              )
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative
                  transition-colors ${isActive ? 'text-brand-deepGreen' : 'text-brand-inkSoft'}`}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand-deepGreen" />
                )}
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{t(tab.labelKey)}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  )
}