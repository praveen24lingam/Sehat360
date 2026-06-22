'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function CareSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations()
  
  const currentTab = pathname.includes('vaccination') ? 'vaccination' : 'mother-care'

  return (
    <div className="px-4 py-3 bg-brand-smoke sticky top-14 z-30">
      <Tabs value={currentTab} onValueChange={(val) => router.push(`/${val}`)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-brand-border/50 p-1">
          <TabsTrigger value="mother-care" className="data-[state=active]:bg-white data-[state=active]:text-brand-deepGreen rounded-lg">
            {t('features.pregnancy')}
          </TabsTrigger>
          <TabsTrigger value="vaccination" className="data-[state=active]:bg-white data-[state=active]:text-brand-deepGreen rounded-lg">
            {t('features.vaccination')}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}