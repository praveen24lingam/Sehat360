'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { Footer } from '@/components/layout/Footer'
import { 
  Pill, 
  Building2, 
  HeartPulse, 
  Syringe, 
  CheckCircle, 
  ChevronRight, 
  ArrowRight, 
  Wifi, 
  Battery, 
  Bell,
  Sparkles,
  ChevronDown,
  Calculator,
  Percent,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react'
import { useEffect, useState } from 'react'

const POPULAR_MEDICINES = [
  { id: '1', brand: 'Glycomet 500mg', salt: 'Metformin', brandPrice: 72, genericPrice: 14, disease: 'Diabetes' },
  { id: '2', brand: 'Atorva 10mg', salt: 'Atorvastatin', brandPrice: 120, genericPrice: 22, disease: 'Cholesterol' },
  { id: '3', brand: 'Pan-40', salt: 'Pantoprazole', brandPrice: 152, genericPrice: 28, disease: 'Gas/Acidity' }
]

export default function LandingPage() {
  const t = useTranslations()
  const [selectedMedId, setSelectedMedId] = useState('1')
  
  const currentMed = POPULAR_MEDICINES.find(m => m.id === selectedMedId) || POPULAR_MEDICINES[0]
  const yearlySaving = (currentMed.brandPrice - currentMed.genericPrice) * 12
  const savingPercentage = Math.round(((currentMed.brandPrice - currentMed.genericPrice) / currentMed.brandPrice) * 100)

  // Floating animations
  const floatAnimation = {
    y: [-8, 8, -8],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }

  return (
    <div className="bg-brand-smoke min-h-[100dvh] flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Mesh Gradient */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-lightGreen/60 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-midGreen/10 blur-[100px] pointer-events-none" />
      
      {/* Premium Glass Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-shell-desktop mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-premium rounded-2xl flex items-center justify-center shadow-button text-white relative overflow-hidden">
              <span className="font-extrabold text-2xl relative z-10 font-sans tracking-tighter">S</span>
              <div className="absolute inset-0 bg-white/20 -translate-y-full hover:translate-y-0 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline leading-none">
            <span className="text-xl md:text-2xl font-black text-brand-ink tracking-tight font-sans">Sehat</span>
            <span className="text-xl md:text-2xl font-black text-brand-saffron tracking-tight font-sans">Mitra</span>
          </div>
            </div>
          </div>
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

      <main className="flex-1 flex items-center max-w-shell-desktop mx-auto w-full px-4 sm:px-6 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center w-full">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left z-10">
            
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
                className="w-full sm:w-auto bg-gradient-premium shadow-button hover:shadow-card-md text-white font-bold rounded-xl py-3 px-8 text-center active:shadow-button-active transition-all flex items-center justify-center gap-2 group text-base"
              >
                <span>{t('landing.ctaPrimary')}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link 
                href="/login" 
                className="w-full sm:w-auto bg-white hover:bg-brand-smoke border-2 border-brand-border/40 hover:border-brand-border text-brand-ink font-bold rounded-xl py-3 px-8 text-center active:scale-[0.98] transition-all shadow-sm text-base"
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
                <ShieldCheck size={18} className="text-brand-midGreen" /> {t('landing.trustFree')}
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-brand-midGreen" /> {t('landing.trustLang')}
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-brand-midGreen" /> {t('landing.trustNoAds')}
              </div>
            </motion.div>
          </div>

          {/* Right Hero Content: Premium 3D-like Device Mockup */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end relative h-full min-h-[600px]">
            
            {/* Floating Elements (Background) */}
            <motion.div animate={floatAnimation} className="absolute top-[10%] -left-[10%] bg-white p-4 rounded-2xl shadow-glass border border-white/50 z-20 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="bg-brand-saffronLight p-2 rounded-xl text-brand-saffron"><Syringe size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-brand-ink">Vaccine Due</p>
                  <p className="text-[10px] text-brand-inkSoft">Arjun: Hep B</p>
                </div>
              </div>
            </motion.div>

            <motion.div animate={{ y: [8, -8, 8], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } }} className="absolute bottom-[20%] -right-[5%] bg-white p-4 rounded-2xl shadow-glass border border-white/50 z-20 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="bg-brand-lightGreen p-2 rounded-xl text-brand-deepGreen"><Building2 size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-brand-ink">PM-JAY Eligible</p>
                  <p className="text-[10px] text-brand-inkSoft">Save up to 5 Lakhs</p>
                </div>
              </div>
            </motion.div>

            {/* Main Phone Frame */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-[320px] h-[650px] bg-[#E5E7EB] rounded-[3rem] p-3 shadow-2xl z-10 border border-white/40"
              style={{ transformPerspective: 1000 }}
            >
              {/* Inner Screen */}
              <div className="w-full h-full bg-brand-smoke rounded-[2.5rem] overflow-hidden border border-black/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] relative flex flex-col">
                
                {/* Glossy Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-50 pointer-events-none z-50" />

                {/* Status Bar */}
                <div className="h-12 flex justify-between items-center px-8 pt-3 bg-white/80 backdrop-blur-md z-40 text-brand-ink text-[11px] font-bold">
                  <span>9:41</span>
                  <div className="w-32 h-6 bg-black rounded-full absolute left-1/2 -translate-x-1/2 flex items-center justify-end px-2 gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#1A1A1A] mr-1" />
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <Wifi size={12} />
                    <Battery size={14} />
                  </div>
                </div>

                {/* App Content Simulation */}
                <div className="flex-1 px-5 pt-4 pb-20 overflow-y-hidden flex flex-col gap-5 bg-brand-smoke relative z-30">
                  
                  {/* Premium Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[11px] font-bold text-brand-inkSoft">Namaste,</p>
                      <h2 className="text-lg font-black text-brand-ink">Meena Sharma</h2>
                    </div>
                    <div className="w-10 h-10 bg-brand-lightGreen rounded-full flex items-center justify-center text-brand-deepGreen">
                      <Bell size={18} />
                    </div>
                  </div>

                  {/* Premium Savings Card */}
                  <div className="bg-gradient-premium rounded-3xl p-5 text-white shadow-button relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
                    <p className="text-xs font-medium text-white/80 mb-1">Total Family Savings</p>
                    <h3 className="text-4xl font-black font-mono mb-4">₹9,400</h3>
                    
                    <div className="bg-white/20 rounded-2xl p-3 backdrop-blur-md border border-white/10">
                      <div className="flex justify-between text-[11px] font-bold mb-2">
                        <span>Monthly Target</span>
                        <span>73%</span>
                      </div>
                      <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "73%" }}
                          transition={{ duration: 1.5, delay: 1 }}
                          className="h-full bg-white rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Calculator Widget */}
                  <div className="bg-white rounded-3xl p-4 shadow-card-md border border-brand-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity size={16} className="text-brand-deepGreen" />
                      <h4 className="text-xs font-bold text-brand-ink">Generic Savings Finder</h4>
                    </div>
                    
                    <div className="bg-brand-smoke p-3 rounded-2xl flex items-center justify-between mb-3 border border-brand-border/30">
                      <div>
                        <p className="text-[10px] text-brand-inkSoft font-bold">Brand: Glycomet</p>
                        <p className="text-sm font-black text-brand-danger line-through">₹72</p>
                      </div>
                      <ArrowRight size={14} className="text-brand-inkSoft" />
                      <div className="text-right">
                        <p className="text-[10px] text-brand-inkSoft font-bold">Generic: Metformin</p>
                        <p className="text-sm font-black text-brand-deepGreen">₹14</p>
                      </div>
                    </div>
                    
                    <button className="w-full py-2.5 bg-brand-lightGreen text-brand-deepGreen text-xs font-bold rounded-xl active:bg-brand-midGreen active:text-white transition-colors">
                      Scan Prescription
                    </button>
                  </div>

                </div>

                {/* Premium Bottom Nav */}
                <div className="absolute bottom-0 left-0 w-full h-20 bg-white/90 backdrop-blur-xl border-t border-brand-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40 flex justify-around items-center px-2 pb-2">
                  <div className="flex flex-col items-center gap-1 text-brand-deepGreen">
                    <HeartPulse size={20} className="fill-brand-deepGreen/20" />
                    <span className="text-[9px] font-bold">Home</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-brand-inkSoft">
                    <Pill size={20} />
                    <span className="text-[9px] font-bold">Dawai</span>
                  </div>
                  <div className="w-12 h-12 bg-gradient-premium rounded-full flex items-center justify-center text-white shadow-button -translate-y-4 border-4 border-brand-smoke">
                    <Zap size={20} className="fill-white/20" />
                  </div>
                  <div className="flex flex-col items-center gap-1 text-brand-inkSoft">
                    <Building2 size={20} />
                    <span className="text-[9px] font-bold">Yojana</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-brand-inkSoft">
                    <Bell size={20} />
                    <span className="text-[9px] font-bold">Care</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}