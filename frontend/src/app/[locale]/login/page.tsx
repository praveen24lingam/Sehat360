'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, AlertCircle, Mail, Lock, Sparkles, ArrowRight, KeyRound, RefreshCw, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { useAuthContext } from '@/components/providers/AuthProvider'
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
      if (error) throw error
      router.push('/dashboard')
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
    <div className="bg-brand-smoke min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-brand-lightGreen/50 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-deepGreen/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-saffron/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50">
        <button 
          onClick={() => {
            if (mode === 'password') router.push('/')
            else setMode('password')
          }} 
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/80 border border-brand-border/40 backdrop-blur-md text-brand-ink font-bold hover:bg-white active:scale-95 transition-all text-sm shadow-glass"
        >
          <ChevronLeft size={18} />
          <span>{t('common.back')}</span>
        </button>

        <div className="w-auto shadow-glass rounded-full overflow-hidden bg-white/80 backdrop-blur-md border border-brand-border/40 p-1">
          <LanguageToggle compact />
        </div>
      </div>

      <motion.div 
        key={mode}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
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
          <h1 className="text-2xl md:text-3xl font-black text-brand-ink mb-2 tracking-tight">
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
                className="h-14 rounded-xl text-lg w-full" 
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
                className="h-14 rounded-xl text-lg w-full" 
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-14 bg-gradient-premium text-white rounded-xl text-base font-bold">
              {isLoading ? 'Loading...' : 'Log In'}
            </Button>
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-brand-border/60"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-bold text-brand-inkSoft">OR</span>
              <div className="flex-grow border-t border-brand-border/60"></div>
            </div>
            <Button type="button" onClick={() => setMode('otp_request')} variant="outline" className="w-full h-14 rounded-xl border-brand-border text-brand-ink font-bold">
              <KeyRound className="mr-2" size={18} /> Login with OTP
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
                className="h-14 rounded-xl text-lg w-full" 
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-14 bg-gradient-premium text-white rounded-xl text-base font-bold">
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>
            <button type="button" onClick={() => setMode('password')} className="text-sm font-bold text-brand-inkSoft mt-2">
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
                className="h-14 rounded-xl text-2xl tracking-widest text-center w-full" 
                required
              />
            </div>
            <Button type="submit" disabled={isLoading || otp.length < 6} className="w-full h-14 bg-gradient-premium text-white rounded-xl text-base font-bold">
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              disabled={countdown > 0 || isLoading}
              onClick={() => handleSendOtp()}
              className="w-full h-12 rounded-xl text-sm"
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
                className="h-14 rounded-xl text-lg w-full" 
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-14 bg-gradient-premium text-white rounded-xl text-base font-bold">
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        )}

      </motion.div>
    </div>
  )
}