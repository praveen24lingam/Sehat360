'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  signInWithOtp: (email: string) => Promise<{ error: any }>
  verifyOtp: (email: string, token: string) => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  resendVerification: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  signInWithOtp: async () => ({ error: null }),
  verifyOtp: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  resendVerification: async () => ({ error: null }),
})

export function AuthProvider({ children, initialSession }: { children: ReactNode, initialSession?: Session | null }) {
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null)
  const [session, setSession] = useState<Session | null>(initialSession ?? null)
  const [loading, setLoading] = useState(!initialSession)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      if (initialSession) return;
      try {
        // getUser() verifies the JWT with the Supabase server
        const { data: { user } } = await supabase.auth.getUser()
        if (mounted && user) {
          const { data: { session } } = await supabase.auth.getSession()
          setSession(session)
          setUser(user)
        }
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (mounted) {
          setSession(newSession)
          setUser(newSession?.user ?? null)
          setLoading(false)
          // Only refresh on meaningful auth transitions, not on every token refresh
          if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
            router.refresh()
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, router, initialSession])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error) {
       router.refresh()
    }
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    // Check if the user is a fake record indicating duplicate email
    if (data?.user && data.user.identities && data.user.identities.length === 0) {
      return { error: new Error('This email is already registered. Please login or reset your password.') }
    }
    
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const signInWithOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    return { error }
  }

  const verifyOtp = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    if (!error) {
      router.refresh()
    }
    return { error }
  }

  const resetPassword = async (email: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    })
    return { error }
  }
  
  const resendVerification = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })
    return { error }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, signInWithOtp, verifyOtp, resetPassword, resendVerification }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
