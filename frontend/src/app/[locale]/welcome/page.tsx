'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, HeartPulse, Pill, Building2, ShieldCheck, ArrowRight } from 'lucide-react'

export default function WelcomePage() {
  const t = useTranslations()

  const benefits = [
    {
      icon: Pill,
      title: t('features.prescription'),
      desc: t('onboarding.features.prescription.desc'),
      bg: 'bg-brand-lightGreen',
      text: 'text-brand-deepGreen'
    },
    {
      icon: Building2,
      title: t('features.schemes'),
      desc: t('onboarding.features.schemes.desc'),
      bg: 'bg-brand-blueLight',
      text: 'text-brand-blue'
    },
    {
      icon: HeartPulse,
      title: t('features.pregnancy'),
      desc: t('onboarding.features.pregnancy.desc'),
      bg: 'bg-brand-pinkLight',
      text: 'text-brand-pink'
    }
  ]

  return (
    <div className="bg-brand-smoke min-h-[100dvh] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-lightGreen/60 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-midGreen/10 blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[480px] w-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-[2.5rem] p-8 z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-premium rounded-2xl flex items-center justify-center shadow-button text-white mx-auto mb-6">
            <span className="font-extrabold text-3xl font-sans tracking-tighter">S</span>
          </div>
          <h1 className="text-3xl font-black text-brand-ink mb-2 tracking-tight">
            Welcome to SehatMitra
          </h1>
          <p className="text-brand-inkSoft font-medium text-sm">
            {t('app.tagline')}
          </p>
        </div>

        <div className="space-y-4 mb-10">
          {benefits.map((benefit, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-brand-border/50 shadow-sm"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${benefit.bg} ${benefit.text}`}>
                <benefit.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-brand-ink text-sm mb-1">{benefit.title}</h3>
                <p className="text-xs text-brand-inkSoft leading-relaxed">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <Link href="/signup">
            <button className="w-full bg-gradient-premium text-white font-bold rounded-xl py-4 flex items-center justify-center gap-2 shadow-button active:scale-[0.98] transition-all group">
              <span>Continue to Sign Up</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-brand-inkSoft">
            <ShieldCheck size={16} className="text-brand-midGreen" />
            <span>{t('landing.trustFree')} • {t('landing.trustNoAds')}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
