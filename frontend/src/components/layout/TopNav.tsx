'use client'

import { Menu, LogOut, User, LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useAuthContext } from '@/components/providers/AuthProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TopNavProps {
  onMenuClick?: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const t = useTranslations()
  const { user, signOut, loading } = useAuthContext()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <nav className="hidden md:block bg-white border-b border-brand-border sticky top-0 z-40">
      <div className="h-16 px-6 flex items-center justify-between max-w-shell-desktop mx-auto">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-brand-smoke rounded-lg transition-colors lg:hidden"
            aria-label="Menu"
          >
            <Menu size={20} className="text-brand-ink" />
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-deepGreen rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-brand-ink hidden sm:inline">SehatMitra</span>
          </Link>
        </div>

        {/* Right: Auth State */}
        <div className="flex items-center gap-3">
          {!loading && (
            user ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="text-brand-ink hover:bg-brand-smoke gap-2 font-bold">
                    <User size={18} />
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-brand-danger hover:bg-brand-dangerLight hover:text-brand-danger" onClick={handleLogout}>
                  <LogOut size={18} />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-brand-ink hover:bg-brand-smoke font-bold gap-2">
                    <LogIn size={18} />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-brand-deepGreen text-white hover:bg-brand-ink font-bold gap-2 rounded-xl">
                    <UserPlus size={18} />
                    Sign Up
                  </Button>
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
