'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { PageHeader } from '@/components/layout/PageHeader'
import { User, Mail, Calendar, Key, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const t = useTranslations()
  const router = useRouter()
  const { user, signOut, loading } = useAuthContext()

  if (loading) {
    return <div className="p-8 flex justify-center"><span className="animate-pulse">Loading profile...</span></div>
  }

  if (!user) {
    // Should be caught by middleware, but fallback
    router.push('/login')
    return null
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  const creationDate = new Date(user.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="pb-24 md:pb-8">
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your account details"
      />
      
      <div className="px-6 py-4 max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border/60">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-brand-lightGreen text-brand-deepGreen rounded-full flex items-center justify-center border-2 border-brand-deepGreen/20">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-ink">Account Info</h2>
              <p className="text-brand-inkSoft text-sm">Supabase Authentication</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-smoke border border-brand-border/40">
              <Mail className="text-brand-deepGreen mt-0.5" size={20} />
              <div>
                <p className="text-xs font-bold text-brand-inkSoft uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-brand-ink font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-smoke border border-brand-border/40">
              <Key className="text-brand-deepGreen mt-0.5" size={20} />
              <div>
                <p className="text-xs font-bold text-brand-inkSoft uppercase tracking-wider mb-1">User ID</p>
                <p className="text-brand-ink font-mono text-sm break-all">{user.id}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-smoke border border-brand-border/40">
              <Calendar className="text-brand-deepGreen mt-0.5" size={20} />
              <div>
                <p className="text-xs font-bold text-brand-inkSoft uppercase tracking-wider mb-1">Member Since</p>
                <p className="text-brand-ink font-medium">{creationDate}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-brand-border/60">
            <Button 
              onClick={handleLogout}
              variant="destructive"
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl font-bold bg-brand-dangerLight text-brand-danger hover:bg-brand-danger hover:text-white transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
