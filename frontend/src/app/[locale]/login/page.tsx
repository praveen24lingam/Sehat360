'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, AlertCircle, Mail, Lock, Sparkles, ArrowRight, KeyRound, ShieldCheck } from 'lucide-react'
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
          <h2 className="text-3xl lg:text-4xl font-black text-brand-ink mb-6">Your Family&apos;s Digital Health Companion</h2>
          <div className="flex flex-col gap-4 text-left w-full">
            <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl backdrop-blur-sm border border-white">
              <div className="w-10 h-10 rounded-full bg-brand-deepGreen text-white flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-brand-ink text-sm">100% Secure & Private</h4>
                <p className="text-xs font-medium text-brand-inkSoft">Your health records are end-to-end encrypted.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl backdrop-blur-sm border border-white">
              <div className="w-10 h-10 rounded-full bg-brand-deepGreen text-white flex items-center justify-center shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <h4 className="font-bold text-brand-ink text-sm">Verified Medical Info</h4>
                <p className="text-xs font-medium text-brand-inkSoft">Information curated from authentic government sources.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex items-center justify-center p-6 pt-28 pb-10 relative">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-saffron/10 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div 
          key={mode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[400px] bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] shadow-glass p-8 relative z-10"
        >
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="mb-6"><Logo variant="app" /></div>
            <h1 className="text-2xl font-black text-brand-ink mb-2 tracking-tight">
              {mode === 'forgot_password' ? 'Reset Password' : 'Login'}
            </h1>
            <p className="text-sm text-brand-inkSoft font-medium">
              {mode === 'forgot_password' ? 'Enter email to receive reset link' : 'Welcome back to SehatMitra'}
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
              <AlertDescription className="text-xs font-bold">{success}</AlertDescription>
            </Alert>
          )}

          {/* PASSWORD LOGIN */}
          {mode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="flex flex-col gap-5">
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
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-brand-ink flex items-center gap-2">
                    <Lock size={16} className="text-brand-deepGreen" />
                    Password
                  </label>
                  <button type="button" onClick={() => setMode('forgot_password')} className="text-xs font-bold text-brand-deepGreen hover:underline">
                    Forgot Password?
                  </button>
                </div>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Enter password" 
                  className="h-14 rounded-xl text-lg w-full bg-white/50" 
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-14 bg-gradient-premium text-white rounded-xl text-base font-bold shadow-button">
                {isLoading ? 'Loading...' : 'Log In'}
              </Button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-brand-border/60"></div>
                <span className="flex-shrink-0 mx-4 text-[10px] uppercase font-black tracking-wider text-brand-inkSoft">Or continue with</span>
                <div className="flex-grow border-t border-brand-border/60"></div>
              </div>
              
              {!isSupabaseConfigured && (
                <Button type="button" onClick={() => router.push('/dashboard')} variant="outline" className="w-full h-14 rounded-xl border-2 border-brand-deepGreen text-brand-deepGreen font-bold hover:bg-brand-smoke bg-brand-lightGreen mb-2">
                  <Sparkles className="mr-2 text-brand-deepGreen" size={18} /> Continue in Demo Mode
                </Button>
              )}
              
              <Button type="button" onClick={() => setMode('otp_request')} variant="outline" className="w-full h-14 rounded-xl border-2 border-brand-border text-brand-ink font-bold hover:bg-brand-smoke bg-white">
                <KeyRound className="mr-2 text-brand-deepGreen" size={18} /> Login with OTP
              </Button>
            </form>
          )}

          {/* OTP REQUEST */}
          {mode === 'otp_request' && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
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
              <Button type="submit" disabled={isLoading} className="w-full h-14 bg-gradient-premium text-white rounded-xl text-base font-bold shadow-button">
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Button>
              <button type="button" onClick={() => setMode('password')} className="text-xs font-bold text-brand-inkSoft mt-2 hover:text-brand-deepGreen transition-colors">
                Use Password Instead
              </button>
            </form>
          )}

          {/* OTP VERIFY */}
          {mode === 'otp_verify' && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
              <div className="space-y-2 text-center">
                <label className="text-sm font-bold text-brand-ink">
                  Enter OTP sent to {email}
                </label>
                <Input 
                  type="text" 
                  value={otp} 
                  onChange={e => setOtp(e.target.value)} 
                  placeholder="000000" 
                  maxLength={6}
                  className="h-14 rounded-xl text-2xl tracking-widest text-center w-full bg-white/50" 
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading || otp.length < 6} className="w-full h-14 bg-gradient-premium text-white rounded-xl text-base font-bold shadow-button">
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                disabled={countdown > 0 || isLoading}
                onClick={() => handleSendOtp()}
                className="w-full h-12 rounded-xl text-sm border-2 border-brand-border bg-white"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </Button>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
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
              <Button type="submit" disabled={isLoading} className="w-full h-14 bg-gradient-premium text-white rounded-xl text-base font-bold shadow-button">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <div className="mt-8 text-center text-sm font-medium text-brand-inkSoft">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-brand-deepGreen font-bold hover:underline">
              Sign up here
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}