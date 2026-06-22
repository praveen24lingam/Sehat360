'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { CountUp } from '@/components/shared/CountUp'
import { EmptyState } from '@/components/shared/EmptyState'
import { SchemeCard } from '@/components/shared/SchemeCard'
import { useUserStore } from '@/store/userStore'
import { useTranslations } from 'next-intl'
import { IndianRupee, Share2, Pill, Building2, Syringe, CheckCircle, Lock } from 'lucide-react'
import { formatDateInLocale } from '@/lib/dates'
import Link from 'next/link'

export default function WalletPage() {
  const t = useTranslations()
  const { profile, language, prescriptions, matchedSchemes, getWalletData } = useUserStore()
  const wallet = getWalletData()
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  const toggleCard = (id: string) => setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }))

  if (!profile) return null

  const handleShare = async () => {
    const text = t('wallet.shareText', { amount: wallet.totalSavings, schemes: wallet.schemesUnlocked, url: 'SehatMitra.vercel.app' })
    if (navigator.share) {
      try {
        await navigator.share({ title: t('wallet.title'), text })
      } catch (err) {
        console.log(err)
      }
    } else {
      navigator.clipboard.writeText(text)
      alert(t('wallet.copy.success'))
    }
  }

  const MILESTONES = [
    { id: 'first-scan', labelKey: 'wallet.milestone.firstScan', done: prescriptions.length > 0 },
    { id: 'save-5k', labelKey: 'wallet.milestone.save5k', done: wallet.totalSavings >= 5000, value: 5000 },
    { id: 'pmjay', labelKey: 'wallet.milestone.pmjay', done: matchedSchemes.some(s => s.id === 'pm-jay') },
    { id: 'save-10k', labelKey: 'wallet.milestone.save10k', done: wallet.totalSavings >= 10000, value: 10000 },
    { id: 'vaccines-50', labelKey: 'wallet.milestone.vaccines50', done: wallet.vaccinationPercent >= 50 },
  ]

  const eligibleSchemes = matchedSchemes.filter(s => s.status === 'eligible' || s.status === 'likely')

  return (
    <AppShell>
      <PageHeader 
        title={t('wallet.title')} 
        subtitle={t('wallet.subtitle')} 
        showBack={true} 
        rightSlot={
          <button onClick={handleShare} className="p-2 text-brand-deepGreen active:bg-brand-lightGreen rounded-full transition-colors">
            <Share2 size={20} />
          </button>
        } 
      />
      
      <div className="p-4 flex flex-col gap-6">
        
        {/* Total Savings Hero */}
        <section>
          <div className="bg-gradient-to-br from-brand-deepGreen to-brand-midGreen rounded-2xl p-5 text-white mb-2 shadow-card-md">
            <div className="text-white/70 text-xs mb-1">{t('wallet.totalLabel')}</div>
            <div className="font-mono font-bold text-4xl mb-6">
              <CountUp amount={wallet.totalSavings} />
            </div>
            
            <div className="flex justify-between items-end mb-1">
              <div className="text-white/60 text-xs">{t('wallet.targetLabel')}</div>
              <div className="text-white/70 text-xs font-medium">{t('wallet.remaining', { amount: Math.max(0, 10000 - wallet.totalSavings).toLocaleString('en-IN') })}</div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div className="bg-white h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min((wallet.totalSavings / 10000) * 100, 100)}%` }} />
            </div>
          </div>
          
          {prescriptions.length === 0 && (
            <div className="mt-4">
              <EmptyState 
                icon={Pill} 
                title={t('wallet.historyEmpty')} 
                description="Scan prescriptions to see savings" 
                actionLabel={t('wallet.historyCta')}
                onAction={() => window.location.href = '/prescription'}
                tone="feature"
              />
            </div>
          )}
        </section>

        {/* Stats Grid */}
        <section>
          <h2 className="text-base font-semibold text-brand-ink mb-3">{t('wallet.statsTitle')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {profile.features.prescription && (
              <StatCard icon={Pill} value={wallet.prescriptionsScanned} label={t('wallet.stat.prescriptions')} tone="green" />
            )}
            {profile.features.schemes && (
              <StatCard icon={Building2} value={wallet.schemesUnlocked} label={t('wallet.stat.schemes')} tone="blue" />
            )}
            {profile.features.vaccination && (
              <StatCard icon={Syringe} value={`${wallet.vaccinationPercent}%`} label={t('wallet.stat.vaccines')} tone="saffron" />
            )}
          </div>
        </section>

        {/* Prescription History */}
        {profile.features.prescription && prescriptions.length > 0 && (
          <section>
            <h2 className="text-base font-semibold text-brand-ink mb-3">{t('wallet.historyTitle')}</h2>
            <div className="flex flex-col gap-2">
              {[...prescriptions].reverse().map((p, i) => (
                <div key={p.id} className="bg-white border border-brand-border rounded-xl p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-lightGreen flex items-center justify-center text-brand-deepGreen shrink-0">
                      <Pill size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-brand-ink">{t('wallet.historyItem', { n: prescriptions.length - i })}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-brand-inkSoft">{formatDateInLocale(p.createdAt, language)}</span>
                        <span className="w-1 h-1 rounded-full bg-brand-border" />
                        <span className="text-[10px] text-brand-inkSoft">{t('wallet.historyMeds', { count: p.medicines.length })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-brand-deepGreen text-sm">{t('wallet.historyMonthly', { amount: p.totalMonthlySaving })}</div>
                    <div className="text-[10px] text-brand-inkSoft mt-0.5">{t('wallet.historyYearly', { amount: p.totalYearlySaving })}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Schemes Unlocked */}
        {profile.features.schemes && (
          <section>
            <h2 className="text-base font-semibold text-brand-ink mb-3">{t('wallet.schemesTitle')}</h2>
            {eligibleSchemes.length > 0 ? (
              <div className="flex flex-col gap-3">
                {eligibleSchemes.map(scheme => (
                  <SchemeCard 
                    key={scheme.id} 
                    scheme={scheme} 
                    language={language}
                    expanded={expandedCards[scheme.id] || false}
                    onToggle={() => toggleCard(scheme.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={Building2} 
                title={t('wallet.schemesEmpty')} 
                description="Find schemes that can save you money" 
                actionLabel="Check Eligibility"
                onAction={() => window.location.href = '/schemes'}
              />
            )}
          </section>
        )}

        {/* Milestones */}
        <section className="mb-6">
          <h2 className="text-base font-semibold text-brand-ink mb-3">{t('wallet.milestonesTitle')}</h2>
          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm">
            {MILESTONES.map((m, i) => (
              <div key={m.id} className={`flex items-center justify-between py-3 ${i !== MILESTONES.length - 1 ? 'border-b border-brand-border' : ''} ${m.done ? 'text-brand-ink' : 'text-brand-inkSoft opacity-60'}`}>
                <div className="flex items-center gap-3">
                  {m.done ? <CheckCircle size={18} className="text-brand-deepGreen" /> : <Lock size={18} />}
                  <span className="text-sm font-medium">{t(m.labelKey as any)}</span>
                </div>
                {m.value && (
                  <span className="font-mono text-xs font-semibold">₹{m.value.toLocaleString('en-IN')}</span>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </AppShell>
  )
}
