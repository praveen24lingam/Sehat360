'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { useUserStore } from '@/store/userStore'
import { PageHeader } from '@/components/layout/PageHeader'
import { Mail, Calendar, MapPin, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const t = useTranslations()
  const router = useRouter()
  const { user, signOut, loading } = useAuthContext()
  const { profile, familyMembers, getWalletData } = useUserStore()
  const walletData = getWalletData()

  if (loading) {
    return (
      <div className="p-4">
        <div className="h-32 rounded-3xl skeleton mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-2xl skeleton" />)}
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  const memberSince = new Date(user.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
  })

  const displayName = profile?.name || user.email?.split('@')[0] || 'User'
  const initials = displayName.substring(0, 2).toUpperCase()
  const location = profile?.city && profile?.state ? `${profile.city}, ${profile.state}` : profile?.state || profile?.city || null

  return (
    <div className="pb-24 md:pb-8">
      <PageHeader title={t('nav.profile')} />

      <div className="p-4 flex flex-col gap-4 max-w-2xl mx-auto">
        {/* Green gradient header — matches wallet/settings hero */}
        <div className="bg-gradient-to-br from-brand-deepGreen to-brand-midGreen rounded-3xl p-5 text-white shadow-card-md relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center font-black text-xl shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg leading-tight truncate">{displayName}</h2>
              {location && <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1"><MapPin size={11} />{location}</p>}
            </div>
          </div>
          <div className="relative z-10 flex gap-4 mt-5 pt-4 border-t border-white/15">
            <div className="flex-1 text-center">
              <p className="font-mono font-black text-2xl leading-none">₹{walletData.totalSavings.toLocaleString('en-IN')}</p>
              <p className="text-white/60 text-[11px] mt-0.5">{t('wallet.totalSaved')}</p>
            </div>
            <div className="w-px bg-white/15" />
            <div className="flex-1 text-center">
              <p className="font-mono font-black text-2xl leading-none">{familyMembers.length}</p>
              <p className="text-white/60 text-[11px] mt-0.5">{t('family.title')}</p>
            </div>
            {profile?.age && (
              <>
                <div className="w-px bg-white/15" />
                <div className="flex-1 text-center">
                  <p className="font-mono font-black text-2xl leading-none">{profile.age}</p>
                  <p className="text-white/60 text-[11px] mt-0.5">{t('onboarding.step1.ageLabel')}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Account details */}
        <div className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden">
          <div className="p-4 border-b border-brand-border">
            <p className="section-label">Account</p>
          </div>
          <div className="divide-y divide-brand-border">
            <div className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-xl bg-brand-lightGreen flex items-center justify-center shrink-0">
                <Mail size={16} className="text-brand-deepGreen" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-inkSoft/70 mb-0.5">Email</p>
                <p className="text-sm font-medium text-brand-ink truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-xl bg-brand-lightGreen flex items-center justify-center shrink-0">
                <Calendar size={16} className="text-brand-deepGreen" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-inkSoft/70 mb-0.5">Member Since</p>
                <p className="text-sm font-medium text-brand-ink">{memberSince}</p>
              </div>
            </div>
            {profile?.name && (
              <div className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-xl bg-brand-lightGreen flex items-center justify-center shrink-0">
                  <User size={16} className="text-brand-deepGreen" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-brand-inkSoft/70 mb-0.5">Name</p>
                  <p className="text-sm font-medium text-brand-ink">{profile.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sign out */}
        <Button
          onClick={handleLogout}
          className="w-full h-12 rounded-2xl font-bold bg-brand-dangerLight text-brand-danger hover:bg-brand-danger hover:text-white transition-colors flex items-center justify-center gap-2 border border-brand-danger/20"
          variant="ghost"
        >
          <LogOut size={18} />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
