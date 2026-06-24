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
        transition={{ duration: 0.4 }}
        className="max-w-[430px] w-full bg-white border border-brand-border shadow-card-lg rounded-3xl p-7 z-10"
      >
        <div className="mb-7">
          <div className="w-14 h-14 bg-gradient-premium rounded-2xl flex items-center justify-center shadow-button text-white mb-5">
            <span className="font-extrabold text-2xl font-sans tracking-tighter">S</span>
          </div>
          <h1 className="text-2xl font-black text-brand-ink mb-1.5 tracking-tight">
            SehatMitra mein aapka swagat hai
          </h1>
          <p className="text-brand-inkSoft text-sm leading-relaxed">
            {t('app.tagline')}
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-7">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + idx * 0.08 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-brand-smoke border border-brand-border"
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${benefit.bg} ${benefit.text}`}>
                <benefit.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-brand-ink text-sm">{benefit.title}</h3>
                <p className="text-xs text-brand-inkSoft leading-snug mt-0.5 truncate">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/signup" className="block">
            <button className="w-full bg-brand-deepGreen text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 shadow-button active:scale-[0.98] transition-all group">
              <span>Shuru karein</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-inkSoft/70">
            <ShieldCheck size={14} className="text-brand-midGreen" />
            <span>{t('landing.trustFree')} · {t('landing.trustNoAds')}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
