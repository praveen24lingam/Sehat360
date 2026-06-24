'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ChevronLeft, AlertCircle, Lock, Sparkles, KeyRound, ShieldCheck, HeartPulse } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { Logo } from '@/components/shared/Logo'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { isSupabaseConfigured } from '@/lib/supabase'
import Link from 'next/link'

type LoginMode = 'password' | 'otp_request' | 'otp_verify' | 'forgot_password'

export default function LoginPage() {
  const t = useTranslations()
  const router = useRouter()
  const { signIn, signInWithOtp, verifyOtp, resetPassword } = useAuthContext()

  const [mode, setMode] = useState<LoginMode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email.includes('@') || !password) {
      setError('Enter valid email and password')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await signIn(email, password)
      if (error) {
        if (error.message.includes('Email not confirmed') || error.message.includes('Invalid login credentials')) {
          throw new Error('Incorrect email or password, or your email may not be verified yet. Please check your inbox.')
        }
        throw error
      }
      // Success will cause AuthProvider to refresh, which triggers middleware to push to /dashboard
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email.includes('@')) {
      setError('Enter a valid email')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await signInWithOtp(email)
      if (error) throw error
      setMode('otp_verify')
      setSuccess('OTP sent to your email!')
      setCountdown(60)
    } catch (err: any) {
      setError(err?.message || 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (otp.length < 6) {
      setError('Enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await verifyOtp(email, otp)
      if (error) throw error
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email.includes('@')) {
      setError('Enter a valid email')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await resetPassword(email)
      if (error) throw error
      setSuccess('Password reset link sent to your email!')
      setMode('password')
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset link')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-brand-smoke min-h-[100dvh] w-full flex flex-col md:flex-row relative overflow-hidden select-none">
      
      {/* Top Header Row with back arrow & Language Toggle */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50">
        <button 
          onClick={() => {
            if (mode === 'password') router.push('/')
            else setMode('password')
          }} 
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/80 border border-brand-border/40 backdrop-blur-md text-brand-ink font-bold hover:bg-white active:scale-95 transition-all text-sm shadow-glass"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">{t('common.back')}</span>
        </button>

        <div className="w-auto shadow-glass rounded-full overflow-hidden bg-white/80 backdrop-blur-md border border-brand-border/40 p-1">
          <LanguageToggle compact />
        </div>
      </div>

      {/* LEFT SIDE: Brand story (Hidden on small mobile) */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] bg-gradient-to-br from-brand-deepGreen to-brand-midGreen p-12 flex-col justify-center items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-black/10 translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-8">
            <HeartPulse size={32} className="text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
            Apne parivaar ki<br />sehat, ek jagah
          </h2>
          <p className="text-white/70 text-base font-medium mb-10 leading-relaxed">
            Prescriptions scan karo, sarkari yojanaon ke liye check karo, aur poori family ka health track karo — bilkul free.
          </p>

          <div className="flex flex-col gap-3">
            {[
              { icon: ShieldCheck, title: 'Private & Secure', desc: 'Your data stays yours. Always.' },
              { icon: Lock, title: 'Government-Backed Info', desc: 'Schemes and data from official sources.' },
              { icon: Sparkles, title: '100% Free Forever', desc: 'No subscriptions, no hidden charges.' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 p-3.5 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <item.icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{item.title}</p>
                  <p className="text-white/60 text-xs font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex items-center justify-center p-6 pt-28 pb-10 relative">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-saffron/8 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-[400px] bg-white border border-brand-border rounded-3xl shadow-card-md p-8 relative z-10"
        >
          <div className="mb-7 flex flex-col items-start">
            <div className="mb-5"><Logo variant="app" /></div>
            <h1 className="text-2xl font-black text-brand-ink tracking-tight">
              {mode === 'forgot_password' ? 'Reset Password' : mode === 'otp_verify' ? 'Enter OTP' : 'Sign In'}
            </h1>
            <p className="text-sm text-brand-inkSoft font-medium mt-1">
              {mode === 'forgot_password'
                ? "We'll send a reset link to your email"
                : mode === 'otp_verify'
                ? `Code sent to ${email}`
                : 'Good to see you again'}
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 p-3.5 bg-brand-dangerLight border border-brand-danger/20 rounded-2xl">
              <AlertCircle size={16} className="text-brand-danger mt-0.5 shrink-0" />
              <p className="text-xs font-semibold text-brand-danger">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-start gap-3 p-3.5 bg-brand-lightGreen border border-brand-deepGreen/20 rounded-2xl">
              <Sparkles size={16} className="text-brand-deepGreen mt-0.5 shrink-0" />
              <p className="text-xs font-semibold text-brand-deepGreen">{success}</p>
            </div>
          )}

          {/* PASSWORD LOGIN */}
          {mode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-inkSoft uppercase tracking-wide">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="h-12 rounded-xl w-full"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-brand-inkSoft uppercase tracking-wide">Password</label>
                  <button type="button" onClick={() => setMode('forgot_password')} className="text-xs font-bold text-brand-deepGreen">
                    Forgot?
                  </button>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl w-full"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-premium text-white rounded-xl font-bold shadow-button mt-1">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="relative flex items-center">
                <div className="flex-grow border-t border-brand-border" />
                <span className="mx-3 text-[10px] uppercase font-bold tracking-widest text-brand-inkSoft/60">or</span>
                <div className="flex-grow border-t border-brand-border" />
              </div>

              {!isSupabaseConfigured && (
                <Button type="button" onClick={() => router.push('/dashboard')} variant="outline" className="w-full h-12 rounded-xl border-2 border-brand-deepGreen/30 text-brand-deepGreen font-bold bg-brand-lightGreen hover:bg-brand-lightGreen/80">
                  <Sparkles className="mr-2" size={16} /> Continue in Demo Mode
                </Button>
              )}
              <Button type="button" onClick={() => setMode('otp_request')} variant="outline" className="w-full h-12 rounded-xl border-2 border-brand-border text-brand-ink font-bold">
                <KeyRound className="mr-2 text-brand-deepGreen" size={16} /> Sign in with OTP
              </Button>
            </form>
          )}

          {/* OTP REQUEST */}
          {mode === 'otp_request' && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-inkSoft uppercase tracking-wide">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="h-12 rounded-xl w-full"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-premium text-white rounded-xl font-bold shadow-button">
                {isLoading ? 'Sending...' : 'Send One-Time Code'}
              </Button>
              <button type="button" onClick={() => setMode('password')} className="text-sm font-bold text-brand-inkSoft hover:text-brand-deepGreen transition-colors text-center">
                ← Use password instead
              </button>
            </form>
          )}

          {/* OTP VERIFY */}
          {mode === 'otp_verify' && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <Input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="h-16 rounded-xl text-3xl tracking-[0.5em] text-center w-full font-mono font-bold"
                required
              />
              <Button type="submit" disabled={isLoading || otp.length < 6} className="w-full h-12 bg-gradient-premium text-white rounded-xl font-bold shadow-button">
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={countdown > 0 || isLoading}
                onClick={() => handleSendOtp()}
                className="w-full h-11 rounded-xl text-sm border-brand-border"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </Button>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-inkSoft uppercase tracking-wide">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="h-12 rounded-xl w-full"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-premium text-white rounded-xl font-bold shadow-button">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm font-medium text-brand-inkSoft">
            New here?{' '}
            <Link href="/signup" className="text-brand-deepGreen font-bold hover:underline">
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}