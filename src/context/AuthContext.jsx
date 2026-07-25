import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const ensureProfile = async (u) => {
    if (!u) return
    const fullName = u.user_metadata?.full_name || u.email?.split('@')[0] || ''
    try {
      await supabase.from('profiles').upsert({
        id: u.id,
        full_name: fullName,
        email: u.email,
      }, { onConflict: 'id' })
    } catch (err) {
      console.warn('Could not sync profile to Supabase:', err)
    }
  }

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const current = session?.user ?? null
      setUser(current)
      if (current) ensureProfile(current)
      setLoading(false)
    }
    getInitialSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const current = session?.user ?? null
      setUser(current)
      if (current) ensureProfile(current)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const login = (email, password) => supabase.auth.signInWithPassword({ email, password })

  const signup = (email, password, fullName) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/confirmed`,
      },
    })

  const logout = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider')
  return ctx
}