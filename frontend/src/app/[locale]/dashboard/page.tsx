'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useUserStore } from '@/store/userStore'
import { Bell, Pill, Building2, HeartPulse, Syringe, BookOpen, CheckCircle, ChevronRight, Settings, Plus, Loader2 } from 'lucide-react'
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
          // Use getUser() — validates JWT with server, not just from local cookie
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
      <div className="min-h-screen bg-brand-smoke flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-deepGreen animate-spin mb-4" />
        <p className="text-brand-inkSoft font-medium text-sm">Loading your health dashboard...</p>
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

  // For vaccination action subtitle: using wallet stats instead of family iteration to be quick
  const totalVaccines = 0 // In real app, calculate actual count
  const doneVaccines = 0

  return (
    <AppShell>
      {/* TopBar */}
      <div className="sticky top-0 bg-brand-smoke/95 backdrop-blur-sm z-10 py-3 px-4 flex items-center justify-between h-[52px]">
        <div className="flex flex-col">
          <span className="text-brand-inkSoft text-sm leading-none mb-0.5">{t('dashboard.greeting', { name: '' }).replace(', ', '')}</span>
          <span className="text-brand-ink text-base font-semibold leading-none">{profile.name.split(' ')[0]}</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle compact />
          <div className="relative">
            <Bell size={20} className="text-brand-ink" />
            {reminders.length > 0 && <div className="absolute top-0 right-0 w-2 h-2 bg-brand-saffron rounded-full border border-brand-smoke" />}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6 md:gap-8 pb-20 md:pb-6">
        
        {/* SavingsHero Card - 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {profile.features.prescription ? (
            <div className="lg:col-span-2 bg-gradient-to-br from-brand-deepGreen to-brand-midGreen rounded-2xl p-5 md:p-6 text-white shadow-card-md">
              <div className="flex justify-between items-start mb-2">
                <div className="text-white/70 text-xs md:text-sm">{t('dashboard.savings.totalLabel')}</div>
                <div className="bg-white/20 px-2 py-0.5 rounded text-[10px]">Jan Aushadhi</div>
              </div>
              <div className="font-mono font-bold text-4xl md:text-5xl mb-4">
                <CountUp amount={wallet.totalSavings} />
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="bg-white/10 rounded-full px-2 py-0.5 text-xs">{t('dashboard.savings.monthly', { amount: wallet.monthlySavings })}</div>
                <div className="bg-white/10 rounded-full px-2 py-0.5 text-xs">{t('dashboard.savings.prescriptions', { count: wallet.prescriptionsScanned })}</div>
                {profile.features.schemes && (
                  <div className="bg-white/10 rounded-full px-2 py-0.5 text-xs">{t('dashboard.savings.schemes', { count: wallet.schemesUnlocked })}</div>
                )}
              </div>
              <Link href="/wallet" className="text-white/80 text-sm flex items-center gap-1 hover:text-white transition-colors">
                {t('dashboard.walletLink')} <ChevronRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl p-5 md:p-6 shadow-card">
              <div className="text-sm font-semibold mb-3">{t('dashboard.savings.featuresDisabled')}</div>
              <div className="flex flex-wrap gap-2">
                {activeFeatures.map(k => (
                  <Badge key={k} variant="secondary" className="bg-brand-lightGreen text-brand-deepGreen border-none">{t(`features.${k}` as any)}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Stats summary card for desktop */}
          <div className="hidden lg:flex bg-white border border-brand-border rounded-2xl p-6 shadow-card flex-col justify-between">
            <div>
              <div className="text-brand-inkSoft text-sm mb-1">Monthly Savings</div>
              <div className="font-mono font-bold text-2xl text-brand-deepGreen">₹{wallet.monthlySavings}</div>
            </div>
            <div className="border-t border-brand-border pt-4 mt-4">
              <div className="text-brand-inkSoft text-sm mb-1">Total Prescriptions</div>
              <div className="font-mono font-bold text-2xl text-brand-ink">{wallet.prescriptionsScanned}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid - 2 cols mobile, 3 tablet, 4 desktop */}
        <section>
          <h2 className="text-base md:text-lg font-semibold text-brand-ink mb-3 md:mb-4">{t('dashboard.actionsTitle')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {profile.features.prescription && (
              <Link href="/prescription" className="bg-white border border-brand-border rounded-2xl p-4 md:p-5 shadow-card hover:shadow-card-md transition-shadow relative">
                <div className="w-10 h-10 rounded-xl bg-brand-lightGreen flex items-center justify-center mb-2">
                  <Pill size={20} className="text-brand-deepGreen" />
                </div>
                <h3 className="text-sm font-semibold text-brand-ink mb-0.5">{t('dashboard.action.prescription.title')}</h3>
                <p className="text-xs text-brand-inkSoft leading-tight">{t('dashboard.action.prescription.subtitle', { amount: wallet.monthlySavings })}</p>
              </Link>
            )}
            
            {profile.features.schemes && (
              <Link href="/schemes" className="bg-white border border-brand-border rounded-2xl p-4 md:p-5 shadow-card hover:shadow-card-md transition-shadow relative">
                <div className="w-10 h-10 rounded-xl bg-brand-blueLight flex items-center justify-center mb-2">
                  <Building2 size={20} className="text-brand-blue" />
                </div>
                <h3 className="text-sm font-semibold text-brand-ink mb-0.5">{t('dashboard.action.schemes.title')}</h3>
                <p className="text-xs text-brand-inkSoft leading-tight">{t('dashboard.action.schemes.subtitle', { count: wallet.schemesUnlocked })}</p>
              </Link>
            )}

            {profile.features.pregnancy && (
              <Link href="/mother-care" className="bg-white border border-brand-border rounded-2xl p-4 md:p-5 shadow-card hover:shadow-card-md transition-shadow relative">
                <div className="w-10 h-10 rounded-xl bg-brand-pinkLight flex items-center justify-center mb-2">
                  <HeartPulse size={20} className="text-brand-pink" />
                </div>
                <h3 className="text-sm font-semibold text-brand-ink mb-0.5">{t('dashboard.action.pregnancy.title')}</h3>
                <p className="text-xs text-brand-inkSoft leading-tight">
                  {(() => {
                    const pregnantMember = familyMembers.find(m => m.isPregnant)
                    if (pregnantMember && pregnantMember.lmpDate) {
                      const week = calculatePregnancyWeek(pregnantMember.lmpDate)
                      return t('dashboard.action.pregnancy.subtitle', { week, left: Math.max(0, 40 - week) })
                    }
                    return 'Not setup'
                  })()}
                </p>
              </Link>
            )}

            {profile.features.vaccination && (
              <Link href="/vaccination" className="bg-white border border-brand-border rounded-2xl p-4 md:p-5 shadow-card hover:shadow-card-md transition-shadow relative">
                <div className="w-10 h-10 rounded-xl bg-brand-saffronLight flex items-center justify-center mb-2">
                  <Syringe size={20} className="text-brand-saffron" />
                </div>
                <h3 className="text-sm font-semibold text-brand-ink mb-0.5">{t('dashboard.action.vaccination.title')}</h3>
                <p className="text-xs text-brand-inkSoft leading-tight">{t('dashboard.action.vaccination.subtitle', { done: 3, total: 14 })}</p>
                {reminders.some(r => r.type === 'vaccine' && r.urgency === 'urgent') && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-saffron rounded-full text-white text-[10px] flex items-center justify-center font-bold">!</div>
                )}
              </Link>
            )}

            {profile.features.awareness && (
              <Link href="/awareness" className="bg-white border border-brand-border rounded-2xl p-4 md:p-5 shadow-card hover:shadow-card-md transition-shadow relative">
                <div className="w-10 h-10 rounded-xl bg-brand-lightGreen flex items-center justify-center mb-2">
                  <BookOpen size={20} className="text-brand-deepGreen" />
                </div>
                <h3 className="text-sm font-semibold text-brand-ink mb-0.5">{t('dashboard.action.awareness.title')}</h3>
                <p className="text-xs text-brand-inkSoft leading-tight">{t('dashboard.action.awareness.subtitle', { count: AWARENESS_ARTICLES.length })}</p>
              </Link>
            )}

            {activeFeatures.length < 2 && (
              <Link href="/settings" className="bg-white border border-brand-border border-dashed rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-card-md transition-shadow flex flex-col justify-center items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-brand-smoke flex items-center justify-center mb-2">
                  <Settings size={20} className="text-brand-inkSoft" />
                </div>
                <h3 className="text-sm font-semibold text-brand-ink mb-0.5">{t('dashboard.action.settings.title')}</h3>
                <p className="text-xs text-brand-inkSoft leading-tight">{t('dashboard.action.settings.subtitle')}</p>
              </Link>
            )}
          </div>
        </section>

        {/* Reminders & Health Tip - Side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Reminders Section - 2 cols on desktop */}
          <section className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <h2 className="text-base md:text-lg font-semibold text-brand-ink">{t('dashboard.remindersTitle')}</h2>
              {reminders.length > 0 && (
                <Badge variant="secondary" className="bg-brand-saffronLight text-brand-saffron border-none px-1.5 min-w-[20px] justify-center">{reminders.length}</Badge>
              )}
            </div>
            
            {reminders.length > 0 ? (
              <div className="flex flex-col gap-3">
                {reminders.slice(0, 3).map(rem => (
                  <ReminderCard key={rem.id} reminder={rem} language={language} />
                ))}
                {reminders.length > 3 && (
                  <Link href="/settings" className="text-sm font-medium text-brand-deepGreen text-center py-2 hover:bg-brand-smoke rounded-lg transition-colors">
                    {t('dashboard.seeAllReminders', { n: reminders.length - 3 })} →
                  </Link>
                )}
              </div>
            ) : (
              <EmptyState 
                icon={CheckCircle} 
                title={t('dashboard.remindersEmpty')} 
                description={t('dashboard.remindersEmptyDesc')} 
                tone="default"
              />
            )}
          </section>

          {/* Health Tip Card */}
          {profile.features.awareness && (
            <section className="lg:col-span-1">
              <h2 className="text-base md:text-lg font-semibold text-brand-ink mb-3 md:mb-4">{t('dashboard.tipTitle')}</h2>
              <Link href="/awareness" className="bg-white border border-brand-border rounded-2xl p-4 md:p-5 shadow-card hover:shadow-card-md transition-shadow flex flex-col h-full">
                <div className="w-12 h-12 shrink-0 rounded-full bg-brand-lightGreen flex items-center justify-center mb-3">
                  <BookOpen size={24} className="text-brand-deepGreen" />
                </div>
                <Badge className="bg-brand-pinkLight text-brand-pink border-none mb-2 w-fit hover:bg-brand-pinkLight">
                  {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                </Badge>
                <h3 className="font-semibold text-brand-ink text-sm mb-2 flex-grow">
                  {language === 'hi' ? tip.title.hi : tip.title.en}
                </h3>
                <span className="text-brand-deepGreen font-medium text-xs">
                  {tip.readTimeMinutes} min padhein →
                </span>
              </Link>
            </section>
          )}
        </div>

        {/* Family Row - Horizontal scroll on mobile, grid on desktop */}
        <section>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-base md:text-lg font-semibold text-brand-ink">{t('dashboard.familyTitle')}</h2>
            <Link href="/settings" className="text-xs md:text-sm font-medium text-brand-deepGreen hover:underline">{t('dashboard.seeAllFamily')} →</Link>
          </div>
          
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {familyMembers.map(member => {
              const status = getFamilyStatus(member)
              const initials = member.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()
              return (
                <div key={member.id} className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm flex flex-col items-center text-center hover:shadow-card-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-brand-lightGreen text-brand-deepGreen font-bold flex items-center justify-center mb-2">
                    {initials}
                  </div>
                  <div className="w-full">
                    <h4 className="text-sm font-semibold text-brand-ink truncate">{member.name}</h4>
                    <p className="text-xs text-brand-inkSoft mb-2 capitalize">{member.relation}</p>
                    {status ? (
                      <div className={`${status.bg} ${status.text} text-xs font-semibold px-2 py-1 rounded-full inline-block`}>
                        {status.label}
                      </div>
                    ) : (
                      <div className="h-6" />
                    )}
                  </div>
                </div>
              )
            })}
            
            <Link href="/settings" className="bg-brand-smoke border border-brand-border border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-brand-border/20 transition-colors">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 text-brand-inkSoft">
                <Plus size={20} />
              </div>
              <span className="text-sm font-medium text-brand-inkSoft">Add Member</span>
            </Link>
          </div>

          {/* Mobile horizontal scroll */}
          <div className="flex md:hidden overflow-x-auto gap-3 pb-2 -mx-4 px-4 scrollbar-hide">
            {familyMembers.map(member => {
              const status = getFamilyStatus(member)
              const initials = member.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()
              return (
                <div key={member.id} className="bg-white border border-brand-border rounded-2xl p-3 flex-shrink-0 w-28 shadow-sm flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-brand-lightGreen text-brand-deepGreen font-bold flex items-center justify-center mb-2">
                    {initials}
                  </div>
                  <div className="w-full">
                    <h4 className="text-xs font-semibold text-brand-ink truncate">{member.name.split(' ')[0]}</h4>
                    <p className="text-[10px] text-brand-inkSoft mb-1.5 capitalize">{member.relation}</p>
                    {status ? (
                      <div className={`${status.bg} ${status.text} text-[9px] font-semibold px-2 py-0.5 rounded-full inline-block`}>
                        {status.label}
                      </div>
                    ) : (
                      <div className="h-4" />
                    )}
                  </div>
                </div>
              )
            })}
            
            <Link href="/settings" className="bg-brand-smoke border border-brand-border border-dashed rounded-2xl p-3 flex-shrink-0 w-28 flex flex-col items-center justify-center text-center active:bg-brand-border/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 text-brand-inkSoft">
                <Plus size={20} />
              </div>
              <span className="text-xs font-medium text-brand-inkSoft">Add Member</span>
            </Link>
          </div>
        </section>

      </div>
    </AppShell>
  )
}