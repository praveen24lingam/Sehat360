'use client'

import { LucideIcon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { FeatureFlags } from '@/types'
import { useUserStore } from '@/store/userStore'

interface FeatureToggleRowProps {
  featureKey: keyof FeatureFlags
  icon: LucideIcon
  title: string
  description: string
  tone?: 'green' | 'saffron' | 'blue' | 'pink'
}

export function FeatureToggleRow({ featureKey, icon: Icon, title, description, tone = 'green' }: FeatureToggleRowProps) {
  const isEnabled = useUserStore(state => state.isFeatureEnabled(featureKey))
  const toggleFeature = useUserStore(state => state.toggleFeature)
  const features = useUserStore(state => state.profile?.features)

  const activeFeaturesCount = features ? Object.values(features).filter(Boolean).length : 0
  const isLastActive = isEnabled && activeFeaturesCount <= 1

  const toneClasses = {
    green: 'text-brand-deepGreen bg-brand-lightGreen',
    saffron: 'text-brand-saffron bg-brand-saffronLight',
    blue: 'text-brand-blue bg-brand-blueLight',
    pink: 'text-brand-pink bg-brand-pinkLight',
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-brand-border rounded-2xl shadow-card">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
          <Icon size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-brand-ink text-sm">{title}</h4>
          <p className="text-xs text-brand-inkSoft mt-0.5">{description}</p>
        </div>
      </div>
      <Switch 
        checked={isEnabled} 
        onCheckedChange={() => toggleFeature(featureKey)}
        disabled={isLastActive}
      />
    </div>
  )
}