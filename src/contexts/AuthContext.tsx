import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { onIdTokenChanged, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { friendlyError } from '../lib/errors'
import type { UserProfile } from '../types/user'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  admin: boolean
  loading: boolean
  error: string
  logout: () => Promise<void>
}
const Context = createContext<AuthState | null>(null)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<AuthState, 'logout'>>({
    user: null,
    profile: null,
    admin: false,
    loading: !!auth,
    error: '',
  })
  useEffect(() => {
    if (!auth || !db) return
    let unsubscribeProfile = () => {}
    let generation = 0
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      const current = ++generation
      unsubscribeProfile()
      setState({ user, profile: null, admin: false, loading: !!user, error: '' })
      if (!user) return
      try {
        const token = await user.getIdTokenResult()
        if (current !== generation) return
        unsubscribeProfile = onSnapshot(
          doc(db!, 'users', user.uid),
          (snapshot) => {
            if (current === generation)
              setState({
                user,
                profile: snapshot.exists() ? (snapshot.data() as UserProfile) : null,
                admin: token.claims.admin === true,
                loading: false,
                error: '',
              })
          },
          (error) => {
            if (current === generation)
              setState({
                user,
                profile: null,
                admin: false,
                loading: false,
                error: friendlyError(error),
              })
          },
        )
      } catch (error) {
        if (current === generation)
          setState({
            user,
            profile: null,
            admin: false,
            loading: false,
            error: friendlyError(error),
          })
      }
    })
    return () => {
      generation++
      unsubscribe()
      unsubscribeProfile()
    }
  }, [])
  return (
    <Context.Provider
      value={{
        ...state,
        logout: async () => {
          if (auth) await signOut(auth)
        },
      }}
    >
      {children}
    </Context.Provider>
  )
}
export function useAuth() {
  const state = useContext(Context)
  if (!state) throw new Error('AuthProvider ausente')
  return state
}
