import { useUserStore } from '@/store/userStore'
import { FeatureFlags } from '@/types'

export function useFeatureGate(featureKey: keyof FeatureFlags) {
  const isDemo = useUserStore((state) => state.isDemo)
  const profile = useUserStore((state) => state.profile)

  // In demo mode, all features are enabled
  if (isDemo) return true

  return profile?.features?.[featureKey] ?? false
}
