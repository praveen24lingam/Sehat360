'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Pill, Building2, HeartPulse, Settings, Wallet, BookOpen, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { href: '/dashboard', icon: Home, labelKey: 'nav.home' },
  { href: '/prescription', icon: Pill, labelKey: 'nav.prescription' },
  { href: '/schemes', icon: Building2, labelKey: 'nav.schemes' },
  { href: '/mother-care', icon: HeartPulse, labelKey: 'nav.care' },
  { href: '/wallet', icon: Wallet, labelKey: 'wallet.title' },
  { href: '/awareness', icon: BookOpen, labelKey: 'awareness.title' },
  { href: '/settings', icon: Settings, labelKey: 'settings.title' },
]

interface SideNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SideNav({ open, onOpenChange }: SideNavProps) {
  const pathname = usePathname()
  const t = useTranslations()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(media.matches)
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - visible on lg+, drawer on tablet */}
      <motion.aside
        initial={isDesktop ? { x: 0 } : { x: -280 }}
        animate={{ x: isDesktop ? 0 : (open ? 0 : -280) }}
        exit={{ x: -280 }}
        transition={{ duration: 0.2 }}
        className="fixed left-0 top-0 h-dvh w-60 bg-white border-r border-brand-border z-50 
                   lg:static lg:z-0 lg:translate-x-0 lg:w-60 lg:border-r
                   overflow-y-auto"
      >
        {/* Header with close button */}
        <div className="p-4 border-b border-brand-border flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-deepGreen rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-brand-ink">SehatMitra</span>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-brand-smoke rounded transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.includes(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-brand-lightGreen text-brand-deepGreen font-medium'
                    : 'text-brand-inkSoft hover:bg-brand-smoke'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{t(item.labelKey)}</span>
              </Link>
            )
          })}
        </nav>
      </motion.aside>
    </>
  )
}
