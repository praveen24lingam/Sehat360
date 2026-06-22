'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Sparkles, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/utils/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })
      if (error) throw error
      setSuccess('Password updated successfully!')
      setTimeout(() => router.push('/login'), 2000)
    } catch (err: any) {
      setError(err?.message || 'Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-brand-smoke min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-brand-lightGreen/50 to-transparent pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] shadow-glass p-7 md:p-10 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-brand-ink mb-2 tracking-tight">Set New Password</h1>
          <p className="text-sm text-brand-inkSoft font-medium">Enter your new password below</p>
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

        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-ink flex items-center gap-2">
              <Lock size={16} className="text-brand-deepGreen" />
              New Password
            </label>
            <Input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Min 6 characters" 
              className="h-14 rounded-xl text-lg w-full" 
              required
            />
          </div>
          <Button type="submit" disabled={isLoading || !!success} className="w-full h-14 bg-gradient-premium text-white rounded-xl text-base font-bold">
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
