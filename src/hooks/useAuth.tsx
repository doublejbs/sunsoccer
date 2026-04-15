import { useState, useEffect, useContext, createContext, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '../lib/types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithKakao: () => Promise<void>
  signOut: () => Promise<void>
  updateNickname: (nickname: string) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string, attempt = 0) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (!data && attempt < 5) {
      await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)))
      return fetchProfile(userId, attempt + 1)
    }
    setProfile(data)
    setLoading(false)
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  async function signInWithKakao() {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: window.location.origin }
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  async function updateNickname(nickname: string): Promise<{ error: string | null }> {
    if (!user) return { error: '로그인이 필요합니다.' }
    const trimmed = nickname.trim()
    if (!trimmed || trimmed.length < 2) return { error: '닉네임은 2자 이상이어야 합니다.' }
    if (trimmed.length > 20) return { error: '닉네임은 20자 이하여야 합니다.' }

    const { error } = await supabase
      .from('profiles')
      .update({ nickname: trimmed })
      .eq('id', user.id)

    if (error) {
      if (error.code === '23505') return { error: '이미 사용 중인 닉네임입니다.' }
      return { error: '닉네임 변경에 실패했습니다.' }
    }

    setProfile(prev => prev ? { ...prev, nickname: trimmed } : prev)
    return { error: null }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signInWithKakao, signOut, updateNickname }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
