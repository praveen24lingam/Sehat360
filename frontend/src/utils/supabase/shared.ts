export function resolveSupabaseUrl(url: string | undefined): string {
  if (!url) return ''
  if (url.startsWith('https://') || url.startsWith('http://')) return url
  return `https://${url.replace('sb_publishable_', '')}.supabase.co`
}
