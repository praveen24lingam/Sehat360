'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CheckCircle, Pill, Building2, HeartPulse, Syringe, BookOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { useUserStore } from '@/store/userStore'
import { INDIAN_STATES } from '@/data/states'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

const getStepStyles = (i: number, step: number) => {
  const isDone = step > i || (step === 3 && i === 3)
  const isActive = step === i
  if (isDone) return 'bg-brand-deepGreen text-white'
  if (isActive) return 'bg-white border-2 border-brand-deepGreen text-brand-deepGreen'
  return 'bg-white border border-brand-border text-brand-inkSoft'
}

export default function OnboardingPage() {
  const t = useTranslations()
  const router = useRouter()
  const { profile, setProfile, language } = useUserStore()
  
  const [step, setStep] = useState<1 | 2 | 3>(1)
  
  const profileSchema = z.object({
    name: z.string().min(2, t('onboarding.error.nameMin')),
    city: z.string().min(2, t('onboarding.error.cityMin')),
    state: z.string().min(1, t('onboarding.error.stateMin')),
    age: z.string().refine((val) => {
      const num = parseInt(val, 10)
      return !isNaN(num) && num >= 13 && num <= 100
    }, t('onboarding.error.ageMin')),
  })
  
  type ProfileFormValues = z.infer<typeof profileSchema>
  
  const { register, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: profile?.name || '', city: profile?.city || '', state: profile?.state || '', age: profile?.age ? String(profile.age) : '' },
    mode: 'onChange',
  })

  const [selectedFeatures, setSelectedFeatures] = useState({
    prescription: true, schemes: true, pregnancy: false, vaccination: true, awareness: true,
  })

  const handleFeatureToggle = (key: keyof typeof selectedFeatures) => {
    const currentActive = Object.values(selectedFeatures).filter(Boolean).length
    if (selectedFeatures[key] && currentActive <= 1) return
    setSelectedFeatures(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const onProfileSubmit = () => setStep(2)
  const onFeaturesSubmit = () => setStep(3)

  const onFinalSubmit = async () => {
    const formData = watch()
    const fullProfile = {
      id: profile?.id || 'temp-id',
      name: formData.name, city: formData.city, state: formData.state,
      age: parseInt(formData.age, 10), language: language, features: selectedFeatures,
    }
    
    setProfile(fullProfile)
    
    if (isSupabaseConfigured) {
      const { data: { user } } = await supabase!.auth.getUser()
      if (user) {
        await supabase!.from('profiles').upsert({ ...fullProfile, id: user.id })
      }
    }
    router.push('/dashboard')
  }

  const fadeVariants: any = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.15, ease: 'easeIn' } }
  }

  const renderStep1 = () => (
    <motion.div key="step1" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="p-6">
      <div className="mb-6"><h1 className="text-2xl font-bold text-brand-ink mb-1">{t('onboarding.step1.title')}</h1></div>
      <form onSubmit={handleSubmit(onProfileSubmit)} id="profile-form" className="flex flex-col gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-ink">{t('onboarding.step1.nameLabel')}*</label>
          <Input {...register('name')} placeholder={t('onboarding.step1.namePlaceholder')} className="h-12 bg-white rounded-xl shadow-sm border-brand-border focus-visible:ring-brand-deepGreen text-base" />
          {errors.name && <p className="text-xs text-brand-danger">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-ink">{t('onboarding.step1.cityLabel')}*</label>
          <Input {...register('city')} placeholder={t('onboarding.step1.cityPlaceholder')} className="h-12 bg-white rounded-xl shadow-sm border-brand-border focus-visible:ring-brand-deepGreen text-base" />
          {errors.city && <p className="text-xs text-brand-danger">{errors.city.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-ink">{t('onboarding.step1.stateLabel')}*</label>
          <Select onValueChange={(val) => setValue('state', val, { shouldValidate: true })} defaultValue={watch('state')}>
            <SelectTrigger className="h-12 bg-white rounded-xl shadow-sm border-brand-border focus:ring-brand-deepGreen text-base"><SelectValue placeholder={t('onboarding.step1.statePlaceholder')} /></SelectTrigger>
            <SelectContent className="max-h-[300px]">{INDIAN_STATES.map(s => <SelectItem key={s.id} value={s.en}>{language === 'hi' ? s.hi : s.en}</SelectItem>)}</SelectContent>
          </Select>
          {errors.state && <p className="text-xs text-brand-danger">{errors.state.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-ink">{t('onboarding.step1.ageLabel')}*</label>
          <Input type="number" inputMode="numeric" {...register('age')} className="h-12 bg-white rounded-xl shadow-sm border-brand-border focus-visible:ring-brand-deepGreen text-base" />
          {errors.age && <p className="text-xs text-brand-danger">{errors.age.message}</p>}
        </div>
        <div className="space-y-1.5 mt-2"><label className="text-sm font-medium text-brand-ink">{t('onboarding.step1.languageLabel')}</label><LanguageToggle /></div>
      </form>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div key="step2" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-ink mb-1">{t('onboarding.step2.title')}</h1>
        <p className="text-sm text-brand-inkSoft">{t('onboarding.step2.subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 gap-2.5">
        {[
          { id: 'prescription', icon: Pill,       accent: 'text-brand-deepGreen bg-brand-lightGreen',   title: t('features.prescription'), desc: t('onboarding.features.prescription.desc') },
          { id: 'schemes',      icon: Building2,  accent: 'text-brand-blue bg-brand-blueLight',          title: t('features.schemes'),      desc: t('onboarding.features.schemes.desc') },
          { id: 'pregnancy',    icon: HeartPulse, accent: 'text-brand-pink bg-brand-pinkLight',          title: t('features.pregnancy'),    desc: t('onboarding.features.pregnancy.desc') },
          { id: 'vaccination',  icon: Syringe,    accent: 'text-brand-saffron bg-brand-saffronLight',    title: t('features.vaccination'),  desc: t('onboarding.features.vaccination.desc') },
          { id: 'awareness',    icon: BookOpen,   accent: 'text-brand-deepGreen bg-brand-lightGreen',    title: t('features.awareness'),    desc: t('onboarding.features.awareness.desc') },
        ].map(feat => {
          const isSelected = selectedFeatures[feat.id as keyof typeof selectedFeatures]
          return (
            <div
              key={feat.id}
              onClick={() => handleFeatureToggle(feat.id as any)}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer select-none transition-all active:scale-[0.98] ${
                isSelected
                  ? 'border-brand-deepGreen bg-brand-lightGreen/30'
                  : 'border-brand-border bg-white'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${feat.accent}`}>
                <feat.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-brand-ink">{feat.title}</p>
                <p className="text-xs text-brand-inkSoft leading-tight mt-0.5">{feat.desc}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                isSelected ? 'bg-brand-deepGreen border-brand-deepGreen text-white' : 'border-brand-border bg-white'
              }`}>
                {isSelected && <CheckCircle size={14} strokeWidth={3} />}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div key="step3" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }} className="w-20 h-20 rounded-full bg-brand-lightGreen flex items-center justify-center text-brand-deepGreen mb-6"><CheckCircle size={40} /></motion.div>
      <h1 className="text-2xl font-bold text-brand-ink mb-2">{t('onboarding.step3.title', { name: watch('name').split(' ')[0] })}</h1>
      <p className="text-sm text-brand-inkSoft mb-8">{t('onboarding.step3.subtitle', { count: Object.values(selectedFeatures).filter(Boolean).length })}</p>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {Object.entries(selectedFeatures).map(([k, v]) => v && <span key={k} className="bg-brand-lightGreen text-brand-deepGreen px-3 py-1 rounded-full text-xs font-medium">{t(`features.${k}` as any)}</span>)}
      </div>
      <div className="bg-white border border-brand-border rounded-xl p-5 text-left w-full shadow-sm">
        <p className="text-sm font-semibold mb-3">App kholein aur shuru karein:</p>
        <ul className="text-sm text-brand-inkSoft space-y-2.5">
          <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-midGreen shrink-0 mt-1.5" />{t('onboarding.step3.points.1')}</li>
          <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-midGreen shrink-0 mt-1.5" />{t('onboarding.step3.points.2')}</li>
          <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-midGreen shrink-0 mt-1.5" />{t('onboarding.step3.points.3')}</li>
        </ul>
      </div>
    </motion.div>
  )

  return (
    <div className="bg-brand-smoke min-h-[100dvh] w-screen flex flex-col relative max-w-shell md:max-w-shell-tablet mx-auto">
      <div className="sticky top-0 bg-brand-smoke/95 backdrop-blur-sm z-10 p-6 pb-2">
        <div className="flex items-center justify-between relative max-w-[280px] mx-auto">
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-brand-border -z-10" />
          <div className="absolute top-4 left-4 h-0.5 bg-brand-midGreen transition-all duration-300 -z-10" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} />
          {[1, 2, 3].map(i => {
            const isDone = step > i || (step === 3 && i === 3)
            return (
              <div key={`ind-${i}`} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${getStepStyles(i, step)}`}>
                  {isDone ? <CheckCircle size={16} /> : i}
                </div>
                <span className={`text-[10px] font-medium ${step === i || isDone ? 'text-brand-ink' : 'text-brand-inkSoft'}`}>
                  {i === 1 ? t('onboarding.steps.profile') : i === 2 ? t('onboarding.steps.features') : t('onboarding.steps.ready')}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex-1 pb-32">
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-full max-w-shell md:max-w-shell-tablet mx-auto bg-brand-smoke/95 backdrop-blur-md pt-3 pb-[calc(env(safe-area-inset-bottom,16px)+16px)] px-6 border-t border-brand-border z-20">
        <div className="flex gap-3">
          {step === 1 && (
             <>
               <Button variant="outline" type="button" onClick={() => router.push('/dashboard')} className="w-1/3 h-12 rounded-xl text-base font-semibold border-brand-border text-brand-ink hover:bg-brand-smoke shadow-sm">Skip</Button>
               <Button type="submit" form="profile-form" disabled={!isValid} className="flex-1 h-12 bg-brand-deepGreen rounded-xl text-base font-semibold hover:bg-brand-midGreen">{t('common.next')}</Button>
             </>
          )}
          {step === 2 && (
             <>
               <Button variant="outline" type="button" onClick={() => router.push('/dashboard')} className="w-1/3 h-12 rounded-xl text-base font-semibold border-brand-border text-brand-ink hover:bg-brand-smoke shadow-sm">Skip</Button>
               <Button onClick={onFeaturesSubmit} className="flex-1 h-12 bg-brand-deepGreen rounded-xl text-base font-semibold hover:bg-brand-midGreen">{t('common.next')}</Button>
             </>
          )}
          {step === 3 && <Button onClick={onFinalSubmit} className="w-full h-12 bg-brand-deepGreen rounded-xl text-base font-semibold hover:bg-brand-midGreen">{t('onboarding.step3.cta')}</Button>}
        </div>
      </div>
    </div>
  )
}