import createMiddleware from 'next-intl/middleware'
import { updateSession } from '@/utils/supabase/middleware'
import { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: ['hi', 'en'],
  defaultLocale: 'hi',
  localePrefix: 'never',
})

export default async function middleware(req: NextRequest) {
  const res = intlMiddleware(req)
  return await updateSession(req, res)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}