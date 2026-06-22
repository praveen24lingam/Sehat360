'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, AlertCircle, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { Logo } from '@/components/shared/Logo'
import { useAuthContext } from '@/components/providers/AuthProvider'
import Link from 'next/link'

export default function SignupPage() {
  const t = useTranslations()
  const router = useRouter()
  const { signUp } = useAuthContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.includes('@') || password.length < 6) {
      setError('Please enter a valid email and password (min 6 chars)')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await signUp(email, password)
      if (error) throw error
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-brand-smoke min-h-[100dvh] w-full flex flex-col md:flex-row relative overflow-hidden select-none">
      
      {/* Top Header Row with back arrow & Language Toggle */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50">
        <button 
          onClick={() => router.push('/')} 
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/80 border border-brand-border/40 backdrop-blur-md text-brand-ink font-bold hover:bg-white active:scale-95 transition-all text-sm shadow-glass"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">{t('common.back')}</span>
        </button>

        <div className="w-auto shadow-glass rounded-full overflow-hidden bg-white/80 backdrop-blur-md border border-brand-border/40 p-1">
          <LanguageToggle compact />
        </div>
      </div>

      {/* LEFT SIDE: Visual & Trust Indicators (Hidden on small mobile) */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] bg-brand-lightGreen p-12 flex-col justify-center items-center relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-md w-full relative z-10 flex flex-col items-center text-center">
          <div className="w-64 h-64 relative mb-10">
            <Image 
              src="/images/auth_trust.png" 
              alt="Secure Health Platform" 
              fill 
              className="object-contain drop-shadow-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-brand-ink mb-6">Join SehatMitra Today</h2>
          <div className="flex flex-col gap-4 text-left w-full">
            <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl backdrop-blur-sm border border-white">
              <div className="w-10 h-10 rounded-full bg-brand-deepGreen text-white flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-brand-ink text-sm">Save on Medicines</h4>
                <p className="text-xs font-medium text-brand-inkSoft">Find generic alternatives and track savings.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl backdrop-blur-sm border border-white">
              <div className="w-10 h-10 rounded-full bg-brand-deepGreen text-white flex items-center justify-center shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <h4 className="font-bold text-brand-ink text-sm">100% Free & Secure</h4>
                <p className="text-xs font-medium text-brand-inkSoft">No ads, no hidden fees, total privacy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex items-center justify-center p-6 pt-28 pb-10 relative">
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-deepGreen/10 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[400px] bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] shadow-glass p-8 relative z-10"
        >
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="mb-6"><Logo variant="app" /></div>
            <h1 className="text-2xl font-black text-brand-ink mb-2 tracking-tight">Create Account</h1>
            <p className="text-sm text-brand-inkSoft font-medium">Join thousands of families</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 bg-brand-dangerLight border-brand-danger/20 text-brand-danger rounded-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs font-bold">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-ink flex items-center gap-2">
                <Mail size={16} className="text-brand-deepGreen" />
                Email Address
              </label>
              <Input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="your@email.com" 
                className="h-14 rounded-xl text-lg w-full bg-white/50" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-ink flex items-center gap-2">
                <Lock size={16} className="text-brand-deepGreen" />
                Password
              </label>
              <Input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Min 6 characters" 
                className="h-14 rounded-xl text-lg w-full bg-white/50" 
                required
              />
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full h-14 bg-gradient-premium text-white rounded-xl text-base font-bold shadow-button mt-2">
              {isLoading ? 'Creating...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-brand-inkSoft">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-deepGreen font-bold hover:underline">
              Log in here
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
