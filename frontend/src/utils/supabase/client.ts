import { createBrowserClient } from '@supabase/ssr'

export function resolveSupabaseUrl(url: string | undefined): string {
  if (!url) return ''
  return url.startsWith('https://') ? url : `https://${url.replace('sb_publishable_', '')}.supabase.co`
}

export function createClient() {
  return createBrowserClient(
    resolveSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
