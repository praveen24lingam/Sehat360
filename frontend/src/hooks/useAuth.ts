import { useUserStore } from '@/store/userStore'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export function useAuth() {
  const profile = useUserStore((state) => state.profile)
  const isDemo = !isSupabaseConfigured

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase?.auth.signOut()
    }
    useUserStore.getState().clearStore()
  }

  return {
    isAuthenticated: !!profile,
    profile,
    isDemo,
    logout
  }
}
