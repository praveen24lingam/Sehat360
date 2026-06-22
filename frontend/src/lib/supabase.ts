import { createClient } from '@/utils/supabase/client'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function isValidHttpUrl(value: string | undefined) {
  if (!value || value === 'your_supabase_url') return false

  try {
    // Handle both full URLs and Supabase reference IDs
    if (value.startsWith('sb_publishable_') || value.startsWith('https://')) {
      return true
    }
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export const isSupabaseConfigured = Boolean(isValidHttpUrl(url) && key && key !== 'your_anon_key' && !key.includes('your_anon_key'))

export const supabase = isSupabaseConfigured ? createClient() : null
