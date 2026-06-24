'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { Footer } from '@/components/layout/Footer'
import { Logo } from '@/components/shared/Logo'
import {
  ArrowRight, ShieldCheck, HeartPulse, Stethoscope,
  BookOpen, Users
} from 'lucide-react'

export default function LandingPage() {
  const t = useTranslations()

  return (
    <div className="bg-brand-smoke min-h-[100dvh] flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Mesh Gradient */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-lightGreen/60 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-midGreen/10 blur-[100px] pointer-events-none" />
      
      {/* Premium Glass Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-shell-desktop mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <div className="w-32 hidden sm:block">
              <LanguageToggle />
            </div>
            <Link href="/login" className="text-sm font-bold bg-brand-deepGreen hover:bg-brand-midGreen text-white px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm border border-brand-deepGreen/20">
              {t('landing.ctaSecondary')}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full pt-28 pb-16">
        
        {/* HERO SECTION */}
        <section className="w-full max-w-shell-desktop mx-auto px-4 sm:px-6 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
            
            <div className="lg:col-span-6 flex flex-col justify-center text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-lightGreen/50 text-brand-deepGreen text-xs font-bold mb-6 border border-brand-deepGreen/20">
                <HeartPulse size={14} />
                <span>Your Trusted Digital Health Companion</span>
              </div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black text-brand-ink leading-[1.05] mb-6 tracking-tight"
              >
                {t('app.tagline')}
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-brand-inkSoft text-lg sm:text-xl leading-relaxed max-w-xl mb-10 font-medium"
              >
                {t('landing.heroDesc')}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full sm:w-auto"
              >
                <Link 
                  href="/welcome" 
                  className="w-full sm:w-auto bg-gradient-premium shadow-button hover:shadow-card-md text-white font-bold rounded-xl py-3.5 px-8 text-center active:shadow-button-active transition-all flex items-center justify-center gap-2 group text-base"
                >
                  <span>{t('landing.ctaPrimary')}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                </Link>
                <Link 
                  href="/login" 
                  className="w-full sm:w-auto bg-white hover:bg-brand-smoke border-2 border-brand-border/40 hover:border-brand-border text-brand-ink font-bold rounded-xl py-3.5 px-8 text-center active:scale-[0.98] transition-all shadow-sm text-base"
                >
                  {t('landing.ctaSecondary')}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap items-center gap-5 text-brand-inkSoft text-sm font-semibold"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-brand-midGreen" /> 100% Free
                </div>
                <div className="w-1 h-1 rounded-full bg-brand-border" />
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-brand-midGreen" /> Hindi &amp; English
                </div>
                <div className="w-1 h-1 rounded-full bg-brand-border" />
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-brand-midGreen" /> No Ads
                </div>
              </motion.div>
            </div>

            {/* Premium Hero Illustration */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end relative h-full min-h-[400px] lg:min-h-[600px]">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-lg aspect-square"
              >
                <Image 
                  src="/images/hero_health.png" 
                  alt="SehatMitra Family Health"
                  fill
                  priority
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION — asymmetric bento-style layout */}
        <section className="w-full py-20 border-t border-brand-border/30">
          <div className="max-w-shell-desktop mx-auto px-4 sm:px-6">
            <div className="mb-12">
              <p className="text-[11px] font-bold tracking-widest uppercase text-brand-inkSoft/60 mb-3">What you get</p>
              <h2 className="text-3xl md:text-4xl font-black text-brand-ink leading-tight max-w-lg">
                Sab kuch free mein.<br />
                <span className="text-brand-deepGreen">Government se direct.</span>
              </h2>
            </div>

            {/* Bento grid: varied card sizes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Large hero card */}
              <div className="col-span-2 row-span-2 bg-gradient-to-br from-brand-deepGreen to-brand-midGreen rounded-3xl p-8 flex flex-col justify-between min-h-[240px] relative overflow-hidden">
                <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Stethoscope size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">Government Schemes</h3>
                  <p className="text-white/70 text-sm font-medium">PM-JAY, PMMVY, JSY — check what you qualify for in 2 minutes. No paperwork needed to check.</p>
                </div>
              </div>

              {/* Small card 1 */}
              <div className="col-span-1 bg-brand-blueLight border border-brand-blue/15 rounded-3xl p-6 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/15 flex items-center justify-center">
                  <BookOpen size={20} className="text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-base font-black text-brand-ink">Hindi Articles</h3>
                  <p className="text-xs text-brand-inkSoft font-medium mt-1">Anaemia, nutrition, newborn care — in your language.</p>
                </div>
              </div>

              {/* Small card 2 */}
              <div className="col-span-1 bg-brand-pinkLight border border-brand-pink/15 rounded-3xl p-6 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-pink/15 flex items-center justify-center">
                  <HeartPulse size={20} className="text-brand-pink" />
                </div>
                <div>
                  <h3 className="text-base font-black text-brand-ink">Pregnancy Tracker</h3>
                  <p className="text-xs text-brand-inkSoft font-medium mt-1">Week by week guidance and checkup reminders.</p>
                </div>
              </div>

              {/* Wide bottom card */}
              <div className="col-span-2 bg-white border border-brand-border rounded-3xl p-6 flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-saffronLight flex items-center justify-center shrink-0">
                  <Users size={24} className="text-brand-saffron" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-brand-ink">Family Health Profiles</h3>
                  <p className="text-sm text-brand-inkSoft font-medium">Vaccination schedules for children, medicine savings for everyone — one account covers your whole family.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  )
}