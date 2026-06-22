'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ChevronLeft, AlertCircle, Mail, Lock, Sparkles, UserPlus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { useAuthContext } from '@/components/providers/AuthProvider'
import Link from 'next/link'

export default function SignupPage() {
  const t = useTranslations()
  const router = useRouter()
  const { signUp } = useAuthContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!email.includes('@')) {
      setError(t('login.error.invalidEmail') || 'Invalid email address')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signUp(email, password)
      if (error) {
         if (error.message.includes('already registered')) {
           setError('This email is already registered. Please log in.')
         } else {
           throw error
         }
      } else {
         setSuccess(true)
         setTimeout(() => {
           router.push('/onboarding')
         }, 2000)
      }
    } catch (err: any) {
      setError(err?.message || 'Network error occurred during signup.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-brand-smoke min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Premium Background */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-brand-lightGreen/50 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-deepGreen/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-saffron/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Header Row with back arrow & Language Toggle */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50">
        <button 
          onClick={() => router.push('/')} 
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/80 border border-brand-border/40 backdrop-blur-md text-brand-ink font-bold hover:bg-white active:scale-95 transition-all text-sm shadow-glass"
        >
          <ChevronLeft size={18} />
          <span>{t('common.back')}</span>
        </button>

        <div className="w-auto shadow-glass rounded-full overflow-hidden bg-white/80 backdrop-blur-md border border-brand-border/40 p-1">
          <LanguageToggle compact />
        </div>
      </div>

      {/* Main Signup Card container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-[420px] bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] shadow-glass p-7 md:p-10 mt-8 relative z-10"
      >
        <div className="text-center mt-2 mb-8">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-premium rounded-2xl flex items-center justify-center shadow-button text-white relative overflow-hidden">
              <span className="font-extrabold text-3xl relative z-10 font-sans tracking-tighter">S</span>
              <div className="absolute inset-0 bg-white/20 -translate-y-full hover:translate-y-0 transition-transform duration-300" />
            </div>
            <div className="flex items-baseline leading-none">
              <span className="text-[2rem] font-black text-brand-ink tracking-tight font-sans">Sehat</span>
              <span className="text-[2rem] font-black text-brand-saffron tracking-tight font-sans">Mitra</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-brand-ink mb-2 tracking-tight">Create Account</h1>
          <p className="text-sm text-brand-inkSoft font-medium">
            Join SehatMitra to track health and savings
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 bg-brand-dangerLight border-brand-danger/20 text-brand-danger rounded-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-bold">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-brand-lightGreen border-brand-deepGreen/20 text-brand-deepGreen rounded-2xl">
            <Sparkles className="h-4 w-4" />
            <AlertDescription className="text-xs font-bold">Account created successfully! Redirecting to setup...</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSignupSubmit} className="flex flex-col gap-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-ink flex items-center gap-2">
              <Mail size={16} className="text-brand-deepGreen" />
              Email Address
            </label>
            <div className="relative flex items-center shadow-sm rounded-xl bg-white focus-within:shadow-md transition-shadow group">
              <div className="absolute left-4 border-r border-brand-border/80 pr-4 flex items-center">
                <Mail size={20} className="text-brand-inkSoft/80" />
              </div>
              <Input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="your@email.com" 
                className="pl-[4.5rem] h-14 rounded-xl border-brand-border focus-visible:ring-2 focus-visible:ring-brand-deepGreen/50 focus:border-brand-deepGreen text-lg bg-transparent transition-all w-full font-medium" 
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-ink flex items-center gap-2">
              <Lock size={16} className="text-brand-deepGreen" />
              Password
            </label>
            <div className="relative flex items-center shadow-sm rounded-xl bg-white focus-within:shadow-md transition-shadow group">
              <div className="absolute left-4 border-r border-brand-border/80 pr-4 flex items-center">
                <Lock size={20} className="text-brand-inkSoft/80" />
              </div>
              <Input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Min 6 characters" 
                className="pl-[4.5rem] h-14 rounded-xl border-brand-border focus-visible:ring-2 focus-visible:ring-brand-deepGreen/50 focus:border-brand-deepGreen text-lg bg-transparent transition-all w-full font-medium" 
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-ink flex items-center gap-2">
              <Lock size={16} className="text-brand-deepGreen" />
              Confirm Password
            </label>
            <div className="relative flex items-center shadow-sm rounded-xl bg-white focus-within:shadow-md transition-shadow group">
              <div className="absolute left-4 border-r border-brand-border/80 pr-4 flex items-center">
                <Lock size={20} className="text-brand-inkSoft/80" />
              </div>
              <Input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="Confirm password" 
                className="pl-[4.5rem] h-14 rounded-xl border-brand-border focus-visible:ring-2 focus-visible:ring-brand-deepGreen/50 focus:border-brand-deepGreen text-lg bg-transparent transition-all w-full font-medium" 
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || success || !email || !password || !confirmPassword} 
            className="w-full mt-2 h-14 bg-gradient-premium text-white rounded-xl text-base font-bold transition-all duration-300 shadow-button hover:shadow-card-md active:scale-[0.98] active:shadow-button flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus size={20} />
                <span>Create Account</span>
              </>
            )}
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
  )
}
