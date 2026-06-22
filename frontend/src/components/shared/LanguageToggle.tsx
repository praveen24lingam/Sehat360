'use client'

import { useUserStore } from '@/store/userStore'
import { useRouter, usePathname } from 'next/navigation'

interface LanguageToggleProps {
  compact?: boolean
}

export function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const language = useUserStore(state => state.language)
  const setLanguage = useUserStore(state => state.setLanguage)
  const router = useRouter()
  const pathname = usePathname()

  const handleToggle = (lang: 'hi' | 'en') => {
    setLanguage(lang)
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`
    router.refresh()
  }

  if (compact) {
    return (
      <div className="flex bg-brand-smoke border border-brand-border rounded-lg p-0.5 w-[110px]">
        <button
          onClick={() => handleToggle('hi')}
          className={`flex-1 py-1.5 text-[11px] font-bold rounded transition-colors ${language === 'hi' ? 'bg-brand-deepGreen text-white shadow-sm' : 'text-brand-inkSoft hover:bg-brand-border/50'}`}
        >
          हिंदी
        </button>
        <button
          onClick={() => handleToggle('en')}
          className={`flex-1 py-1.5 text-[11px] font-bold rounded transition-colors ${language === 'en' ? 'bg-brand-deepGreen text-white shadow-sm' : 'text-brand-inkSoft hover:bg-brand-border/50'}`}
        >
          Eng
        </button>
      </div>
    )
  }

  return (
    <div className="flex bg-brand-smoke border border-brand-border rounded-xl p-1 w-full max-w-[240px]">
      <button
        onClick={() => handleToggle('hi')}
        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${language === 'hi' ? 'bg-brand-deepGreen text-white shadow-sm' : 'text-brand-inkSoft hover:bg-brand-border/50'}`}
      >
        हिंदी
      </button>
      <button
        onClick={() => handleToggle('en')}
        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${language === 'en' ? 'bg-brand-deepGreen text-white shadow-sm' : 'text-brand-inkSoft hover:bg-brand-border/50'}`}
      >
        English
      </button>
    </div>
  )
}