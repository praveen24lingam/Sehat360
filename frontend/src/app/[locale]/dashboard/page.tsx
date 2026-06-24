'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useUserStore } from '@/store/userStore'
import {
  Bell, Pill, Building2, HeartPulse, Syringe,
  BookOpen, CheckCircle, ChevronRight, Plus, Loader2,
  TrendingUp, AlertCircle, Wallet
} from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { CountUp } from '@/components/shared/CountUp'
import { ReminderCard } from '@/components/shared/ReminderCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { AWARENESS_ARTICLES } from '@/data/awarenessArticles'
import { calculatePregnancyWeek, calculateAgeInMonths, getVaccineStatus } from '@/lib/dates'
import { FamilyMember } from '@/types'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function DashboardPage() {
  const t = useTranslations()
  const router = useRouter()
  const { profile, familyMembers, setProfile, language, reminders, vaccinationRecords, getWalletData } = useUserStore()
  const wallet = getWalletData()
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    async function initProfile() {
      if (!profile) {
        if (isSupabaseConfigured) {
          const { data: { user } } = await supabase!.auth.getUser()
          if (user) {
            const { data, error } = await supabase!.from('profiles').select('*').eq('id', user.id).single()
            if (data) {
              setProfile(data)
            } else {
              if (error && error.code !== 'PGRST116') {
                console.error('Supabase profile fetch error:', error.message)
                if (error.message.includes('fetch') || error.message.includes('network')) {
                  setIsInitializing(false)
                  return
                }
              }
              router.push('/onboarding')
            }
          }
        } else {
          router.push('/onboarding')
        }
      }
      setIsInitializing(false)
    }
    initProfile()
  }, [profile, router, setProfile])

  if (isInitializing || !profile) {
    return (
      <div className="min-h-screen bg-brand-smoke flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-deepGreen animate-spin" />
        <p className="text-brand-inkSoft text-sm font-medium">Loading...</p>
      </div>
    )
  }

  const activeFeatures = Object.entries(profile.features).filter(([_, enabled]) => enabled).map(([k]) => k)

  const getFamilyStatus = (member: FamilyMember) => {
    if (member.isPregnant) return { label: t('dashboard.status.pregnant'), bg: 'bg-brand-pinkLight', text: 'text-brand-pink' }
    const records = vaccinationRecords[member.id] || []
    const hasOverdue = records.some(r => !r.done && getVaccineStatus(r.dueDate, r.done) === 'overdue')
    if (hasOverdue) return { label: t('dashboard.status.vaccineDue'), bg: 'bg-brand-dangerLight', text: 'text-brand-danger' }
    if (member.relation === 'child' && member.dob) {
      const ageMonths = calculateAgeInMonths(member.dob)
      return { label: t('dashboard.status.months', { age: ageMonths }), bg: 'bg-brand-saffronLight', text: 'text-brand-saffron' }
    }
    return null
  }

  const tip = profile.features.pregnancy
    ? AWARENESS_ARTICLES.find(a => a.category === 'pregnancy') || AWARENESS_ARTICLES[0]
    : AWARENESS_ARTICLES[0]

  const firstName = profile.name.split(' ')[0]
  const urgentReminders = reminders.filter(r => r.urgency === 'urgent')
  const savingsGoal = 10000
  const savingsPercent = Math.min(100, Math.round((wallet.totalSavings / savingsGoal) * 100))

  return (
    <AppShell>
      {/* TopBar */}
      <div className="sticky top-0 bg-brand-smoke/95 backdrop-blur-sm z-10 h-[56px] flex items-center justify-between px-4">
        <div>
          <p className="text-[11px] text-brand-inkSoft font-medium leading-none mb-0.5">{t('dashboard.greeting', { name: '' }).replace(', ', '')}</p>
          <p className="text-base font-bold text-brand-ink leading-none">{firstName}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <LanguageToggle compact />
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-brand-border shadow-sm" aria-label="Notifications">
            <Bell size={18} className="text-brand-ink" />
            {urgentReminders.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-saffron rounded-full border-2 border-white" />
            )}
          </button>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-8 pb-24 md:pb-8 flex flex-col gap-7">

        {/* ── Savings Hero ── */}
        {profile.features.prescription ? (
          <div className="relative bg-gradient-to-br from-brand-deepGreen via-[#1f7d57] to-brand-midGreen rounded-3xl overflow-hidden shadow-card-lg mt-2">
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-black/5 pointer-events-none" />

            <div className="relative z-10 p-5 md:p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white/60 text-xs font-semibold tracking-wide uppercase">{t('dashboard.savings.totalLabel')}</p>
                  <div className="font-mono font-black text-4xl text-white mt-1 leading-none">
                    <CountUp amount={wallet.totalSavings} />
                  </div>
                </div>
                <Link href="/wallet" className="flex items-center gap-1 bg-white/15 hover:bg-white/25 transition-colors text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  <Wallet size={13} />
                  {t('dashboard.walletLink')}
                </Link>
              </div>

              {/* Savings progress toward ₹10k goal */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-white/60 text-[11px] font-medium">Progress to ₹10,000 goal</span>
                  <span className="text-white text-[11px] font-bold">{savingsPercent}%</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: `${savingsPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="bg-white/15 text-white/90 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  {t('dashboard.savings.monthly', { amount: wallet.monthlySavings })}
                </span>
                <span className="bg-white/15 text-white/90 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  {t('dashboard.savings.prescriptions', { count: wallet.prescriptionsScanned })}
                </span>
                {profile.features.schemes && wallet.schemesUnlocked > 0 && (
                  <span className="bg-white/15 text-white/90 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {t('dashboard.savings.schemes', { count: wallet.schemesUnlocked })} schemes
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-2 bg-white border border-brand-border rounded-2xl p-4 shadow-card">
            <p className="text-sm font-semibold text-brand-ink mb-2">{t('dashboard.savings.featuresDisabled')}</p>
            <div className="flex flex-wrap gap-2">
              {activeFeatures.map(k => (
                <Badge key={k} variant="secondary" className="bg-brand-lightGreen text-brand-deepGreen border-none">{t(`features.${k}` as any)}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* ── Urgent Reminders (if any) ── */}
        {urgentReminders.length > 0 && (
          <div className="bg-brand-saffronLight border border-brand-saffron/20 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-saffron/20 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle size={16} className="text-brand-saffron" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-brand-ink mb-0.5">{urgentReminders.length} urgent action{urgentReminders.length > 1 ? 's' : ''} needed</p>
              <p className="text-xs text-brand-inkSoft font-medium truncate">{language === 'hi' ? urgentReminders[0].titleHi : urgentReminders[0].title}</p>
            </div>
            <Link href={urgentReminders[0].linkedRoute} className="text-brand-saffron shrink-0">
              <ChevronRight size={20} />
            </Link>
          </div>
        )}

        {/* ── Quick Actions ── */}
        <section>
          <p className="section-label mb-3">{t('dashboard.actionsTitle')}</p>

          {/* Primary action — prescription is the hero */}
          {profile.features.prescription && (
            <Link href="/prescription" className="block bg-white border border-brand-border rounded-2xl shadow-card p-4 mb-3 active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-lightGreen flex items-center justify-center shrink-0">
                  <Pill size={24} className="text-brand-deepGreen" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-brand-ink">{t('dashboard.action.prescription.title')}</h3>
                  <p className="text-sm text-brand-inkSoft font-medium">{t('dashboard.action.prescription.subtitle', { amount: wallet.monthlySavings })}</p>
                </div>
                <div className="flex items-center gap-1 text-brand-deepGreen">
                  <TrendingUp size={16} />
                  <ChevronRight size={18} />
                </div>
              </div>
            </Link>
          )}

          {/* Secondary actions — 2-column grid */}
          <div className="grid grid-cols-2 gap-3">
            {profile.features.schemes && (
              <Link href="/schemes" className="bg-brand-blueLight border border-brand-blue/15 rounded-2xl p-4 active:scale-[0.97] transition-all">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/15 flex items-center justify-center mb-3">
                  <Building2 size={20} className="text-brand-blue" />
                </div>
                <h3 className="text-sm font-bold text-brand-ink leading-tight">{t('dashboard.action.schemes.title')}</h3>
                <p className="text-[11px] text-brand-blue font-semibold mt-0.5">
                  {wallet.schemesUnlocked > 0 ? `${wallet.schemesUnlocked} matched` : 'Check eligibility'}
                </p>
              </Link>
            )}

            {profile.features.pregnancy && (
              <Link href="/mother-care" className="bg-brand-pinkLight border border-brand-pink/15 rounded-2xl p-4 active:scale-[0.97] transition-all">
                <div className="w-10 h-10 rounded-xl bg-brand-pink/15 flex items-center justify-center mb-3">
                  <HeartPulse size={20} className="text-brand-pink" />
                </div>
                <h3 className="text-sm font-bold text-brand-ink leading-tight">{t('dashboard.action.pregnancy.title')}</h3>
                <p className="text-[11px] text-brand-pink font-semibold mt-0.5">
                  {(() => {
                    const pregnantMember = familyMembers.find(m => m.isPregnant)
                    if (pregnantMember?.lmpDate) {
                      const week = calculatePregnancyWeek(pregnantMember.lmpDate)
                      return `Week ${week} of 40`
                    }
                    return 'Track pregnancy'
                  })()}
                </p>
              </Link>
            )}

            {profile.features.vaccination && (
              <Link href="/vaccination" className="bg-brand-saffronLight border border-brand-saffron/15 rounded-2xl p-4 active:scale-[0.97] transition-all relative">
                <div className="w-10 h-10 rounded-xl bg-brand-saffron/15 flex items-center justify-center mb-3">
                  <Syringe size={20} className="text-brand-saffron" />
                </div>
                <h3 className="text-sm font-bold text-brand-ink leading-tight">{t('dashboard.action.vaccination.title')}</h3>
                <p className="text-[11px] text-brand-saffron font-semibold mt-0.5">
                  {t('dashboard.action.vaccination.subtitle', { done: 3, total: 14 })}
                </p>
                {reminders.some(r => r.type === 'vaccine' && r.urgency === 'urgent') && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-brand-danger rounded-full text-white text-[9px] flex items-center justify-center font-black">!</span>
                )}
              </Link>
            )}

            {profile.features.awareness && (
              <Link href="/awareness" className="bg-brand-lightGreen border border-brand-deepGreen/10 rounded-2xl p-4 active:scale-[0.97] transition-all">
                <div className="w-10 h-10 rounded-xl bg-brand-deepGreen/10 flex items-center justify-center mb-3">
                  <BookOpen size={20} className="text-brand-deepGreen" />
                </div>
                <h3 className="text-sm font-bold text-brand-ink leading-tight">{t('dashboard.action.awareness.title')}</h3>
                <p className="text-[11px] text-brand-deepGreen font-semibold mt-0.5">
                  {t('dashboard.action.awareness.subtitle', { count: AWARENESS_ARTICLES.length })}
                </p>
              </Link>
            )}
          </div>
        </section>

        {/* ── Family Members ── */}
        {familyMembers.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">{t('dashboard.familyTitle')}</p>
              <Link href="/settings" className="text-xs font-bold text-brand-deepGreen">{t('dashboard.seeAllFamily')} →</Link>
            </div>

            <div className="flex overflow-x-auto gap-3 -mx-4 px-4 pb-1 scrollbar-hide">
              {familyMembers.map(member => {
                const status = getFamilyStatus(member)
                const initials = member.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                const relationColors: Record<string, string> = {
                  self: 'bg-brand-lightGreen text-brand-deepGreen',
                  spouse: 'bg-brand-blueLight text-brand-blue',
                  child: 'bg-brand-saffronLight text-brand-saffron',
                  parent: 'bg-brand-pinkLight text-brand-pink',
                  other: 'bg-brand-smoke text-brand-inkSoft',
                }
                const avatarColor = relationColors[member.relation as string] ?? relationColors.other

                return (
                  <div key={member.id} className="bg-white border border-brand-border rounded-2xl p-3.5 flex-shrink-0 w-[120px] shadow-card flex flex-col items-center text-center gap-2">
                    <div className={`w-11 h-11 rounded-full font-bold text-sm flex items-center justify-center ${avatarColor}`}>
                      {initials}
                    </div>
                    <div className="w-full">
                      <p className="text-xs font-bold text-brand-ink truncate">{member.name.split(' ')[0]}</p>
                      <p className="text-[10px] text-brand-inkSoft capitalize">{member.relation}</p>
                    </div>
                    {status && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    )}
                  </div>
                )
              })}

              <Link href="/settings" className="bg-brand-smoke border border-dashed border-brand-border rounded-2xl p-3.5 flex-shrink-0 w-[120px] flex flex-col items-center justify-center gap-2 active:bg-brand-border/30 transition-colors">
                <div className="w-11 h-11 rounded-full bg-white border border-brand-border flex items-center justify-center text-brand-inkSoft">
                  <Plus size={18} />
                </div>
                <p className="text-xs font-semibold text-brand-inkSoft">Add Member</p>
              </Link>
            </div>
          </section>
        )}

        {/* ── Reminders ── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <p className="section-label">{t('dashboard.remindersTitle')}</p>
            {reminders.length > 0 && (
              <span className="w-5 h-5 bg-brand-saffron text-white rounded-full text-[10px] font-black flex items-center justify-center">
                {reminders.length}
              </span>
            )}
          </div>

          {reminders.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {reminders.slice(0, 3).map(rem => (
                <ReminderCard key={rem.id} reminder={rem} language={language} />
              ))}
              {reminders.length > 3 && (
                <Link href="/settings" className="text-sm font-semibold text-brand-deepGreen text-center py-2">
                  {t('dashboard.seeAllReminders', { n: reminders.length - 3 })} →
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white border border-brand-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-lightGreen flex items-center justify-center shrink-0">
                <CheckCircle size={20} className="text-brand-deepGreen" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-ink">{t('dashboard.remindersEmpty')}</p>
                <p className="text-xs text-brand-inkSoft font-medium">{t('dashboard.remindersEmptyDesc')}</p>
              </div>
            </div>
          )}
        </section>

        {/* ── Health Tip ── */}
        {profile.features.awareness && (
          <section>
            <p className="section-label mb-3">{t('dashboard.tipTitle')}</p>
            <Link href="/awareness" className="flex gap-4 bg-white border border-brand-border rounded-2xl p-4 shadow-card active:scale-[0.98] transition-all items-start">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-brand-lightGreen flex items-center justify-center">
                <BookOpen size={22} className="text-brand-deepGreen" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold text-brand-pink uppercase tracking-wide">
                  {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                </span>
                <h3 className="text-sm font-bold text-brand-ink mt-0.5 leading-snug">
                  {language === 'hi' ? tip.title.hi : tip.title.en}
                </h3>
                <p className="text-xs text-brand-deepGreen font-semibold mt-1.5">
                  {tip.readTimeMinutes} min read →
                </p>
              </div>
            </Link>
          </section>
        )}

      </div>
    </AppShell>
  )
}
