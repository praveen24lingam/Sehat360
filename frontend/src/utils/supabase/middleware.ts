import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export function resolveSupabaseUrl(url: string | undefined): string {
  if (!url) return ''
  return url.startsWith('https://') ? url : `https://${url.replace('sb_publishable_', '')}.supabase.co`
}

export async function updateSession(request: NextRequest, response: NextResponse) {
  let supabaseResponse = response

  const supabase = createServerClient(
    resolveSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const localeMatch = request.nextUrl.pathname.match(/^\/(hi|en)/)
  const locale = localeMatch ? localeMatch[1] : 'hi'
  
  const isAuthRoute = request.nextUrl.pathname.includes('/login') || request.nextUrl.pathname.includes('/signup')
  
  // Public routes that don't require auth
  const isPublicRoute = request.nextUrl.pathname === '/' || 
                        request.nextUrl.pathname === `/${locale}` ||
                        isAuthRoute ||
                        request.nextUrl.pathname.startsWith('/_next') ||
                        request.nextUrl.pathname.startsWith('/api') ||
                        request.nextUrl.pathname.includes('/onboarding')

  // Redirect unauthenticated users to login if they try to access protected routes
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }
  
  // Redirect authenticated users away from auth routes to the dashboard
  if (user && isAuthRoute) {
     const url = request.nextUrl.clone()
     url.pathname = `/${locale}/dashboard`
     return NextResponse.redirect(url)
  }

  return supabaseResponse
}
