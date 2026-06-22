'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Building2, Info, Loader2, MapPin, FileText, CheckCircle2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { SchemeCard } from '@/components/shared/SchemeCard'
import { useUserStore } from '@/store/userStore'
import { matchSchemesStatic } from '@/lib/schemeMatcher'
import { INDIAN_STATES } from '@/data/states'
import { SchemeAnswers } from '@/types'
import { isGeminiConfigured } from '@/lib/gemini'

const ANIM_FADE: Variants = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
const ANIM_SLIDE: Variants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }

export default function SchemesPage() {
  const t = useTranslations()
  const { profile, familyMembers, language, setSchemeResults, matchedSchemes } = useUserStore()
  
  const [isMatching, setIsMatching] = useState(false)
  const [showResults, setShowResults] = useState(matchedSchemes.length > 0)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  const isPregnantPrefill = familyMembers.some(m => m.isPregnant)
  const childrenUnder5Prefill = familyMembers.filter(m => {
    if (!m.dob) return false
    const ageMonths = (Date.now() - new Date(m.dob).getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    return ageMonths < 60
  }).length
  const seniorPrefill = familyMembers.some(m => {
    if (!m.dob) return false
    const ageYears = (Date.now() - new Date(m.dob).getTime()) / (1000 * 60 * 60 * 24 * 365)
    return ageYears >= 60
  }) || (profile?.age ? profile.age >= 60 : false)

  const formSchema = z.object({
    state: z.string().min(1, 'State is required'),
    monthlyIncome: z.string().min(1, 'Income is required'),
    rationCardType: z.enum(['none', 'apl', 'bpl', 'aay', 'unknown']),
    isPregnant: z.boolean(),
    childrenUnder5: z.number().min(0).max(10),
    hasSenior: z.boolean(),
    hasAyushmanCard: z.enum(['yes', 'no', 'unknown']),
  })

  const { control, handleSubmit, watch, setValue, formState: { isValid } } = useForm<SchemeAnswers>({
    resolver: zodResolver(formSchema),
    defaultValues: { state: profile?.state || '', monthlyIncome: '', rationCardType: 'unknown', isPregnant: isPregnantPrefill, childrenUnder5: childrenUnder5Prefill, hasSenior: seniorPrefill, hasAyushmanCard: 'unknown' },
    mode: 'onChange'
  })

  const onSubmit = async (data: SchemeAnswers) => {
    setIsMatching(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const results = matchSchemesStatic(data)
    setSchemeResults(data, results)
    if (results.length > 0) setExpandedCards({ [results[0].id]: true })
    setIsMatching(false)
    setShowResults(true)
  }

  const handleReset = () => {
    setShowResults(false)
    setExpandedCards({})
  }

  const toggleCard = (id: string) => setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }))

  const OptionButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button type="button" onClick={onClick} className={`px-3 py-2 text-sm font-medium rounded-xl border transition-colors flex-1 ${active ? 'bg-brand-deepGreen text-white border-brand-deepGreen shadow-sm' : 'bg-white text-brand-inkSoft border-brand-border hover:bg-brand-smoke'}`}>
      {label}
    </button>
  )

  const renderLocationSection = () => (
    <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm space-y-5">
      <h3 className="font-semibold text-brand-ink text-sm border-b border-brand-border pb-2">Location & Income</h3>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-brand-inkSoft uppercase tracking-wider">{t('schemes.form.stateLabel')}</label>
        <Controller name="state" control={control} render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="h-11 bg-white rounded-xl border-brand-border focus:ring-brand-deepGreen"><SelectValue placeholder="Select State" /></SelectTrigger>
            <SelectContent className="max-h-[250px]">{INDIAN_STATES.map(s => <SelectItem key={s.id} value={s.en}>{language === 'hi' ? s.hi : s.en}</SelectItem>)}</SelectContent>
          </Select>
        )} />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-brand-inkSoft uppercase tracking-wider">{t('schemes.form.incomeLabel')}</label>
        <div className="grid grid-cols-2 gap-2">
          <OptionButton label="₹0 - 5,000" active={watch('monthlyIncome') === '0-5000'} onClick={() => setValue('monthlyIncome', '0-5000')} />
          <OptionButton label="₹5,001 - 10,000" active={watch('monthlyIncome') === '5001-10000'} onClick={() => setValue('monthlyIncome', '5001-10000')} />
          <OptionButton label="₹10,001 - 25,000" active={watch('monthlyIncome') === '10001-25000'} onClick={() => setValue('monthlyIncome', '10001-25000')} />
          <OptionButton label="> ₹25,000" active={watch('monthlyIncome') === '>25000'} onClick={() => setValue('monthlyIncome', '>25000')} />
        </div>
      </div>
    </div>
  )

  const renderCardsSection = () => (
    <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm space-y-5">
      <h3 className="font-semibold text-brand-ink text-sm border-b border-brand-border pb-2">Documents</h3>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-brand-inkSoft uppercase tracking-wider">{t('schemes.form.rationLabel')}</label>
        <div className="flex flex-wrap gap-2">
          <OptionButton label="APL" active={watch('rationCardType') === 'apl'} onClick={() => setValue('rationCardType', 'apl')} />
          <OptionButton label="BPL" active={watch('rationCardType') === 'bpl'} onClick={() => setValue('rationCardType', 'bpl')} />
          <OptionButton label="AAY (Antyodaya)" active={watch('rationCardType') === 'aay'} onClick={() => setValue('rationCardType', 'aay')} />
          <OptionButton label="Nahi hai" active={watch('rationCardType') === 'none'} onClick={() => setValue('rationCardType', 'none')} />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-brand-inkSoft uppercase tracking-wider">{t('schemes.form.ayushmanLabel')}</label>
        <div className="flex gap-2">
          <OptionButton label="Haan" active={watch('hasAyushmanCard') === 'yes'} onClick={() => setValue('hasAyushmanCard', 'yes')} />
          <OptionButton label="Nahi" active={watch('hasAyushmanCard') === 'no'} onClick={() => setValue('hasAyushmanCard', 'no')} />
          <OptionButton label="Pata nahi" active={watch('hasAyushmanCard') === 'unknown'} onClick={() => setValue('hasAyushmanCard', 'unknown')} />
        </div>
      </div>
    </div>
  )

  const renderFamilySection = () => (
    <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm space-y-5">
      <h3 className="font-semibold text-brand-ink text-sm border-b border-brand-border pb-2">Family</h3>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-brand-ink leading-tight pr-4">{t('schemes.form.pregnantLabel')}</label>
        <Controller name="isPregnant" control={control} render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-brand-ink leading-tight pr-4">{t('schemes.form.childrenLabel')}</label>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setValue('childrenUnder5', Math.max(0, watch('childrenUnder5') - 1))} className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-xl pb-1 active:bg-brand-smoke">-</button>
          <span className="font-mono font-bold text-lg w-4 text-center">{watch('childrenUnder5')}</span>
          <button type="button" onClick={() => setValue('childrenUnder5', Math.min(10, watch('childrenUnder5') + 1))} className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-xl pb-1 active:bg-brand-smoke">+</button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-brand-ink leading-tight pr-4">{t('schemes.form.seniorLabel')}</label>
        <Controller name="hasSenior" control={control} render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
      </div>
    </div>
  )

  return (
    <AppShell>
      <PageHeader title={t('schemes.title')} />
      <div className="p-4 flex flex-col gap-4">
        {!showResults && !isMatching && (
          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-blueLight flex items-center justify-center shrink-0"><Building2 size={24} className="text-brand-blue" /></div>
            <div>
              <h3 className="font-semibold text-brand-ink text-sm mb-1">{t('schemes.trustTitle')}</h3>
              <p className="text-xs text-brand-ink font-medium mb-1.5">{t('schemes.trustSubtitle')}</p>
              <p className="text-[10px] text-brand-inkSoft leading-tight opacity-80">{t('schemes.trustNote')}</p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isMatching && (
            <motion.div key="matching" variants={ANIM_FADE} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-brand-lightGreen rounded-full flex items-center justify-center mb-6 relative"><Loader2 size={32} className="text-brand-deepGreen animate-spin" /><Building2 size={20} className="text-brand-deepGreen absolute opacity-30" /></div>
              <h2 className="text-lg font-semibold text-brand-ink mb-3">{t('schemes.loading')}</h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-blueLight text-brand-blue"><CheckCircle2 size={14} />{isGeminiConfigured ? 'Gemini AI Match' : 'Sarkari Rules Match'}</div>
            </motion.div>
          )}

          {!isMatching && showResults && (
            <motion.div key="results" variants={ANIM_SLIDE} initial="initial" animate="animate" className="flex flex-col gap-4 pb-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2">
                  <div className="bg-brand-lightGreen text-brand-deepGreen px-2.5 py-1 rounded-full text-xs font-bold">{t('schemes.results.eligible', { count: matchedSchemes.filter(s => s.status === 'eligible').length })}</div>
                  <div className="bg-brand-saffronLight text-brand-saffron px-2.5 py-1 rounded-full text-xs font-bold">{t('schemes.results.likely', { count: matchedSchemes.filter(s => s.status === 'likely').length })}</div>
                </div>
                <button onClick={handleReset} className="flex items-center gap-1 text-xs font-medium text-brand-inkSoft hover:text-brand-ink"><RotateCcw size={12} /> {t('schemes.results.retry')}</button>
              </div>
              <div className="flex flex-col gap-3">
                {matchedSchemes.sort((a,b) => a.status === 'eligible' ? -1 : 1).map(scheme => (
                  <SchemeCard key={scheme.id} scheme={scheme} language={language} expanded={expandedCards[scheme.id] || false} onToggle={() => toggleCard(scheme.id)} />
                ))}
              </div>
              <div className="bg-brand-lightGreen border border-brand-midGreen/20 rounded-2xl p-4 mt-2">
                <div className="flex items-center gap-3 mb-3"><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-deepGreen"><MapPin size={16} /></div><span className="font-semibold text-sm text-brand-ink">{t('schemes.action.phc')}</span></div>
                <Button variant="outline" className="w-full bg-white border-brand-border rounded-xl" onClick={() => window.open('https://maps.google.com/?q=primary+health+centre+near+me', '_blank')}>Google Maps par dekhein</Button>
                <div className="h-px bg-brand-border my-4" />
                <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-deepGreen shrink-0 mt-0.5"><FileText size={16} /></div><div><span className="font-semibold text-sm text-brand-ink block mb-1">Documents ready rakhein</span><p className="text-xs text-brand-inkSoft">Sabhi yojnaaon ke liye Aadhaar Card aur Bank Passbook zaroori hai.</p></div></div>
              </div>
              <div className="bg-brand-blueLight border border-brand-blue/20 rounded-xl p-3 flex gap-3 items-start mt-2"><Info size={16} className="text-brand-blue shrink-0 mt-0.5" /><p className="text-xs text-brand-blue leading-relaxed font-medium">{t('schemes.disclaimer')}</p></div>
            </motion.div>
          )}

          {!isMatching && !showResults && (
            <motion.div key="form" variants={ANIM_FADE} initial="initial" animate="animate" className="pb-24">
              <form id="schemes-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                {renderLocationSection()}
                {renderCardsSection()}
                {renderFamilySection()}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isMatching && !showResults && (
        <div className="md:static md:w-full md:max-w-none md:bg-transparent md:border-none md:p-0 md:mt-6 md:backdrop-blur-none
                        fixed bottom-[calc(env(safe-area-inset-bottom,0px)+64px)] w-full max-w-[430px] bg-brand-smoke/95 backdrop-blur-md pt-3 pb-4 px-4 border-t border-brand-border z-20">
          <Button type="submit" form="schemes-form" disabled={!isValid} className="w-full h-12 bg-brand-deepGreen rounded-xl text-base font-semibold">{t('schemes.form.cta')}</Button>
        </div>
      )}
    </AppShell>
  )
}