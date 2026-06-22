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
  BookOpen, Users, Video, FileText
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
                className="flex flex-wrap items-center gap-6 text-brand-inkSoft text-sm font-bold"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-brand-midGreen" /> 100% Free & Secure
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-brand-midGreen" /> Available in Hindi
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

        {/* FEATURES SECTION */}
        <section className="w-full bg-white py-24 border-y border-brand-border/40">
          <div className="max-w-shell-desktop mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-brand-ink mb-4">Everything your family needs</h2>
              <p className="text-brand-inkSoft font-medium max-w-2xl mx-auto">Access verified government health resources, schemes, and tools in one unified platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: BookOpen, title: 'Health Articles', desc: 'Read verified information in Hindi', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: Video, title: 'Expert Videos', desc: 'Watch doctor consultations and guides', color: 'text-red-600', bg: 'bg-red-50' },
                { icon: Stethoscope, title: 'Govt Schemes', desc: 'Check eligibility for PM-JAY and more', color: 'text-brand-deepGreen', bg: 'bg-brand-lightGreen' },
                { icon: Users, title: 'Family Profiles', desc: 'Track vaccination and records for all', color: 'text-purple-600', bg: 'bg-purple-50' }
              ].map((feature, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-brand-smoke border border-brand-border/40 hover:shadow-card-md transition-shadow">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color}`}>
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-black text-brand-ink mb-2">{feature.title}</h3>
                  <p className="text-sm font-medium text-brand-inkSoft">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  )
}