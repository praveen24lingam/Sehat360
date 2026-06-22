'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true)
      return
    }

    // iOS detection
    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsIOS(/iphone|ipad|ipod/.test(userAgent))

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Only show automatically if they haven't dismissed it recently
      if (!localStorage.getItem('pwa_dismissed')) {
        setShowInstall(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    // For iOS, since there's no event, we show it manually if not standalone
    if (isIOS && !isStandalone && !localStorage.getItem('pwa_dismissed')) {
      setShowInstall(true)
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [isStandalone, isIOS])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowInstall(false)
      }
    }
  }

  const handleDismiss = () => {
    setShowInstall(false)
    localStorage.setItem('pwa_dismissed', 'true')
  }

  if (!showInstall || isStandalone) return null

  return (
    <AnimatePresence>
      {showInstall && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-brand-deepGreen text-white p-4 rounded-2xl shadow-premium z-[9999] flex items-start gap-4 border border-brand-deepGreen/20"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Download size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm mb-1">Install SehatMitra</h4>
            {isIOS && !deferredPrompt ? (
              <p className="text-xs text-white/80 leading-relaxed">
                Tap the Share button below and select <strong>&quot;Add to Home Screen&quot;</strong> to install the app.
              </p>
            ) : (
              <p className="text-xs text-white/80 leading-relaxed mb-3">
                Get faster access, offline mode, and a better experience.
              </p>
            )}
            
            {deferredPrompt && (
              <button 
                onClick={handleInstallClick}
                className="bg-white text-brand-deepGreen text-xs font-bold px-4 py-2 rounded-lg hover:bg-brand-smoke transition-colors"
              >
                Install App
              </button>
            )}
          </div>
          <button 
            onClick={handleDismiss}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
