import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileRole, setProfileRole] = useState(null)

  // Determine active role: profileRole > user_metadata.role > 'guest'
  const activeRole = profileRole || user?.user_metadata?.role || 'guest'

  const syncUserProfile = async (u) => {
    if (!u) {
      setProfileRole(null)
      return
    }
    const metaRole = u.user_metadata?.role || 'guest'
    const fullName = u.user_metadata?.full_name || u.email?.split('@')[0] || ''

    try {
      // 1. Fetch profile from Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', u.id)
        .maybeSingle()

      if (profile?.role) {
        setProfileRole(profile.role)
      } else {
        // 2. Upsert profile if missing
        await supabase.from('profiles').upsert({
          id: u.id,
          full_name: fullName,
          email: u.email,
          role: metaRole,
        }, { onConflict: 'id' })
        setProfileRole(metaRole)
      }
    } catch (err) {
      console.warn('Could not sync profile to Supabase:', err)
      setProfileRole(metaRole)
    }
  }

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const current = session?.user ?? null
      setUser(current)
      if (current) {
        await syncUserProfile(current)
      }
      setLoading(false)
    }
    getInitialSession()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const current = session?.user ?? null
      setUser(current)
      if (current) {
        await syncUserProfile(current)
      } else {
        setProfileRole(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const login = (email, password) => supabase.auth.signInWithPassword({ email, password })

  const signup = (email, password, fullName, role = 'guest') =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: role },
        emailRedirectTo: `${window.location.origin}/confirmed`,
      },
    })

  const logout = () => {
    setProfileRole(null)
    return supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        role: activeRole,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider')
  return ctx
}
