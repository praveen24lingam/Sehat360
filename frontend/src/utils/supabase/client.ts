import { createBrowserClient } from '@supabase/ssr'
import { resolveSupabaseUrl } from './shared'

export function createClient() {
  return createBrowserClient(
    resolveSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
